const failedLoginAttempts: Record<string, number> = {};
import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge"
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign } from 'hono/jwt'
import { verify } from "hono/jwt";
import { signupInput, signinInput } from '@vanshkathpalia/sportstolt-common'
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { z, ZodError } from 'zod';
import nodemailer from 'nodemailer';
import { authMiddleware } from "../middleware/authMiddleware";


export const userRouter = new Hono<{
    Bindings: {
      DATABASE_URL: string;
      JWT_SECRET: string;
      GEOLOCATION_API_KEY: string;
      FRONTEND_BASE_URL: string;
    }
}>();

const UserUpdateInput = z.object({
  // existing properties...
  resetToken: z.string(),
  resetTokenExpiry: z.date(),
});

// const UserEditInput = z.object({
//   bio: z.string().max(500).optional(),
//   location: z.string().max(100).optional(),
//   university: z.string().max(100).optional(),
//   achievements: z.string().max(1000).optional(),
//   image: z.string().url().optional(), // Assuming image is a URL for now, later is an image indeed
// });

export const UserEditInput = z.object({
  image: z.string().url().optional(),
  bio: z.string()
    .max(500, "Bio is too long") // character fallback
    .refine(val => val.trim().split(/\s+/).length <= 25, {
      message: "Bio must be 25 words or fewer"
    }),
  location: z.string().optional(),
  university: z.string().optional(),
  achievements: z.string()
    .max(300, "Achievements is too long")
    .refine(val => val.trim().split(/\s+/).length <= 10, {
      message: "Achievements must be 10 words or fewer"
    }),
});

userRouter.post('/signup', async (c) => {
    const body = await c.req.json();


    const result = signupInput.safeParse(body);
    if (!result.success) {
        c.status(400);
        return c.json({ error: "Invalid input", details: result.error });
    }

    const prisma = new PrismaClient({ 
      datasourceUrl: c.env.DATABASE_URL 
    }).$extends(withAccelerate());

    try {
        const existingUser = await prisma.user.findUnique({ where: { email: body.email } });

        if (existingUser) {
            c.status(409); // Conflict
            console.log(Error)
            return c.json({ error: "User already exists. Try signing in." });
        }

        const hashedPassword = await bcrypt.hash(body.password, 6);
        const user = await prisma.user.create({
            data: {
                email: body.email,
                password: hashedPassword,
                username: body.username,
            }
        });

        await prisma.follow.create({
          data: {
            followerId: user.id,
            followingId: user.id
          }
        });
        

        const jwt = await sign(
            { id: user.id, username: user.username, timestamp: Date.now() },
            c.env.JWT_SECRET
        );

        return c.json({
          token: jwt,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
          },
        });

    } catch (e) {
        c.status(500);
        console.error(e);
        return c.json({ error: "Internal server error during signup" });
    }
});

// User Signin Route (Without Mailer Logic)
userRouter.post('/signin', async (c) => {
    const body = await c.req.json(); 

    const prisma = new PrismaClient({ datasourceUrl: c.env.DATABASE_URL }).$extends(withAccelerate());

    try {
        const user = await prisma.user.findUnique({ where: { email: body.email } });
        if (!user) {
            c.status(404);
            return c.json({ error: "User not found. Please sign up." });
        }

        const isPasswordCorrect = await bcrypt.compare(body.password, user.password);
        if (!isPasswordCorrect) {
            c.status(401);
            return c.json({ error: "Incorrect password." });
        }

        const jwt = await sign(
            { id: user.id, username: user.username, iat: Math.floor(Date.now() / 1000) },
            c.env.JWT_SECRET
        );

        c.status(200);
        
        return c.json({
          token: jwt,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
          },
        });

    } catch (e) {
        console.error(e);
        c.status(500);
        return c.json({ error: "Internal server error during signin" });
    }
});

// Get All Users
userRouter.get('/users', async (c) => {
  const prisma = new PrismaClient({ datasourceUrl: c.env.DATABASE_URL }).$extends(withAccelerate());

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        post: true,
      },
      orderBy: {
        id: 'asc', // Order by username ascending
      },
    });

    return c.json({ users });
  } catch (e) {
    c.status(500);
    console.error(e);
    return c.json({ error: "Failed to fetch users" });
  }
});


// Get Current User
userRouter.get('/me', authMiddleware, async (c) => {
  const prisma = new PrismaClient({ datasourceUrl: c.env.DATABASE_URL }).$extends(withAccelerate());
  
  const userId = c.get('userId');
  if (!userId) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  
  try {
    // Fetch user from DB by id, exclude password
    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
      select: {
        id: true,
        username: true,
        email: true,
        // bio: true,
        // location: true,
        // university: true,
        // achievements: true,
        // image: true,
        // any other public user fields
      },
    });
    
    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }
    
    return c.json(user);
  } catch (err) {
    console.error('Error fetching user:', err);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Get User Profile
userRouter.get('/:id/profile', authMiddleware, async (c) => {
  const userId = Number(c.req.param('id'));
  if (isNaN(userId)) return c.json({ error: 'Invalid user ID' }, 400);
  
  const prisma = new PrismaClient({ datasourceUrl: c.env.DATABASE_URL }).$extends(withAccelerate());
  
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      post: true,
      story: true,
      following: true,
      followers: true,
      // followedTags: true,
      verifiedStories: true,
    },
  });
  
  if (!user) return c.json({ error: 'User not found' }, 404);
  
  const profileData = {
    name: user.name,
    username: user.username,
    profileImage: user.image,
    postsCount: user.post.length,
    storiesCount: user.story.length,
    verifiedStoriesCount: user.verifiedStories.length,
    legitimacy: `${user.verifiedStories.length && user.story.length
      ? Math.floor((user.verifiedStories.length / user.story.length) * 100)
      : 0}%`,
      badge: user.badgeLevel,
      hasPaid: user.hasPaid,
      points: user.points,
      followingCount: user.following.length,
      followersCount: user.followers.length,
      // followedTagsCount: user.followedTags.length,
      achievements: user.achievements,
      location: user.location,
      university: user.university,
      bio: user.bio,
    };
    
    return c.json(profileData);
  });
  
  // Editing bio achievement... patch request
  userRouter.patch('/:id/profile', authMiddleware, async (c) => {
    const userId = Number(c.req.param('id'));
    if (isNaN(userId)) return c.json({ error: 'Invalid user ID' }, 400);
    
    // Parse and validate the input body
    let updateData;
    try {
      updateData = UserEditInput.parse(await c.req.json());
    } catch (e) {
      if (e instanceof ZodError) {
        return c.json({ error: 'Invalid input', details: e.errors }, 400);
      }
      return c.json({ error: 'Unexpected error' }, 500);
    }
    
    const prisma = new PrismaClient({ datasourceUrl: c.env.DATABASE_URL }).$extends(withAccelerate());
    
    // Optional: check if authenticated user matches the userId in URL or has permission
    const authUserId = c.get('userId'); // assuming authMiddleware sets this
    if (!authUserId || authUserId !== userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    try {
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          image: updateData.image, // Assuming you might want to update the profile image too
          bio: updateData.bio,
          location: updateData.location,
          university: updateData.university,
          achievements: updateData.achievements,
          updatedAt: new Date(),
        },
        select: {
          id: true,
          image: true,  
          bio: true,
          location: true,
          university: true,
          achievements: true,
          updatedAt: true,
        },
      });
      
      return c.json({ message: 'Profile updated', user: updatedUser });
    } catch (error) {
      return c.json({ error: 'Failed to update profile' }, 500);
    }
  });
  
  // Get User's Posts
  userRouter.get('/:id/posts', authMiddleware, async (c) => {
    const userId = Number(c.req.param('id'));
    if (isNaN(userId)) return c.json({ error: 'Invalid user ID' }, 400);
    
    const prisma = new PrismaClient({ datasourceUrl: c.env.DATABASE_URL }).$extends(withAccelerate());
    
    const posts = await prisma.post.findMany({
      where: { authorId: userId }, // Note: You wrote userId in where but your model uses authorId
      select: {
        id: true,
        content: true,   // Assuming you want content with image links here
        title: true,
        createdAt: true,
        _count: {
          select: {
            likes: true,
            Comment: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' },
    });
    
    return c.json(posts);
  });
  
  // Get User's Participated Events
  userRouter.get('/:id/events', authMiddleware, async (c) => {
    const userId = Number(c.req.param('id'));
    if (isNaN(userId)) return c.json({ error: 'Invalid user ID' }, 400);
    
    const prisma = new PrismaClient({ datasourceUrl: c.env.DATABASE_URL }).$extends(withAccelerate());
    
    const events = await prisma.event.findMany({
      where: {
        // isArchived: false,
        registration: {
          some: {
            userId: userId,
          },
        },
      },
      select: {
        id: true,
        name: true,
        startDate: true,
        endDate: true,
        startTime: true,
        stadium: true,
        OrganisedBy: true,
        // description: true,  // your schema doesn't have description in Event, so either add or remove
        city: true,
        createdAt: true,
      },
      orderBy: {
        startDate: 'asc', // Order by start date ascending
      },
    });
    
    const now = new Date();
    
    const enrichedEvents = events.map(event => {
      let status: "completed" | "ongoing" | "upcoming";
      if (now > event.endDate) {
        status = "completed";
      } else if (now >= event.startDate && now <= event.endDate) {
        status = "ongoing";
      } else {
        status = "upcoming";
      }
      
      const StartDate = new Date(event.startDate).toLocaleDateString('en-GB', {
        day: '2-digit', month: 'long', year: 'numeric',
      });
      
      const EndDate = new Date(event.endDate).toLocaleDateString('en-GB', {
        day: '2-digit', month: 'long', year: 'numeric',
      });
      
      const StartTime = new Date(event.startDate).toLocaleTimeString('en-GB', {
        hour: '2-digit', minute: '2-digit', hour12: true,
      });
      
      return {
        organisedBy: event.OrganisedBy,
        StartDate,
        EndDate,
        StartTime,
        timing: `Starts: ${StartDate} at ${StartTime}`,
        ...event,
        status,
      };
      
    });
    
    return c.json(enrichedEvents);
  });
  
  // GET /api/user/id/:username
  userRouter.get('/id/:username', async (c) => {
    const { username } = c.req.param();
    const prisma = new PrismaClient({ datasourceUrl: c.env.DATABASE_URL }).$extends(withAccelerate());
    
    const user = await prisma.user.findUnique({ where: { username } });
    
    if (!user) {
      c.status(404);
      return c.json({ error: "User not found" });
    }
    
    return c.json({ id: user.id });
  });
  
  


  
  // userRouter.get('/users', async (c) => {
  //   const prisma = new PrismaClient({ datasourceUrl: c.env.DATABASE_URL }).$extends(withAccelerate());
  
  //   try {
  //     const users = await prisma.user.findMany({
  //       select: { id: true }, // only fetch user IDs
  //     });
  
  //     return c.json({ userIds: users.map(user => user.id) });
  //   } catch (e) {
  //     c.status(500);
  //     console.error(e);
  //     return c.json({ error: "Failed to fetch user IDs" });
  //   }
  // });
  
  
  
  // // User Signup Route (Without Mailer Logic)
  // userRouter.post('/signup', async (c) => {
    //     const body = await c.req.json();
    //     const result = signupInput.safeParse(body);
    //     if (!result.success) {
      //         c.status(400);
      //         return c.json({ error: "Invalid input", details: result.error });
      //     }
      
      //     const prisma = new PrismaClient({ datasourceUrl: c.env.DATABASE_URL }).$extends(withAccelerate());
      
      //     try {
        //         const existingUser = await prisma.user.findUnique({ where: { email: body.email } });
        
        //         if (existingUser) {
          //             c.status(409); // Conflict
          //             return c.json({ error: "User already exists. Try signing in." });
          //         }
          
          //         const hashedPassword = await bcrypt.hash(body.password, 6);
          //         const user = await prisma.user.create({
            //             data: {
              //                 email: body.email,
              //                 password: hashedPassword,
              //                 username: body.username,
//                 type: body.type,
//             }
//         });

//         const jwt = await sign(
//             { id: user.id, email: user.email, timestamp: Date.now() },
//             c.env.JWT_SECRET
//         );

//         return c.json({ token: jwt });
//     } catch (e) {
//         c.status(500);
//         console.error(e);
//         return c.json({ error: "Internal server error during signup" });
//     }
// });

// // User Signin Route (Without Mailer Logic)
// userRouter.post('/signin', async (c) => {
//     const body = await c.req.json();
//     const prisma = new PrismaClient({ datasourceUrl: c.env.DATABASE_URL }).$extends(withAccelerate());

//     try {
//         const user = await prisma.user.findUnique({ where: { email: body.email } });
//         if (!user) {
//             c.status(404);
//             return c.json({ error: "User not found. Please sign up." });
//         }

//         const isPasswordCorrect = await bcrypt.compare(body.password, user.password);
//         if (!isPasswordCorrect) {
//             c.status(401);
//             return c.json({ error: "Incorrect password. Change your password" });
//         }

//         const jwt = await sign(
//             { id: user.id, email: user.email, iat: Math.floor(Date.now() / 1000) },
//             c.env.JWT_SECRET
//         );

//         c.status(200);
//         return c.json({ token: jwt });
//     } catch (e) {
//         console.error(e);
//         c.status(500);
//         return c.json({ error: "Internal server error during signin" });
//     }
// });

// User multiple wrong password attempts
// userRouter.post('/signin', async (c) => {
//     const body = await c.req.json();
//     const prisma = new PrismaClient({ datasourceUrl: c.env.DATABASE_URL }).$extends(withAccelerate());

//     try {
//         const user = await prisma.user.findUnique({ where: { username: body.username } });
//         if (!user) {
//             c.status(404);
//             return c.json({ error: "User not found. Please sign up." });
//         }

//         const isPasswordCorrect = await bcrypt.compare(body.password, user.password);

//         if (!isPasswordCorrect) {
//             // Increment failed attempts
//             failedLoginAttempts[body.username] = (failedLoginAttempts[body.username] || 0) + 1;

//             if (failedLoginAttempts[body.username] >= 3) {
//                 return c.json({
//                     error: "Too many failed attempts. Please try 'Forgot Password'."
//                 });
//             }

//             c.status(401);
//             return c.json({
//                 error: `Incorrect password. ${3 - failedLoginAttempts[body.username]} attempts left.`
//             });
//         }

//         // On successful login, reset attempt counter
//         delete failedLoginAttempts[body.username];

//         const jwt = await sign(
//             { id: user.id, username: user.username, iat: Math.floor(Date.now() / 1000) },
//             c.env.JWT_SECRET
//         );

//         c.status(200);
//         return c.json({ token: jwt });

//     } catch (e) {
//         console.error(e);
//         c.status(500);
//         return c.json({ error: "Internal server error during signin" });
//     }
// });


userRouter.post('/forgot-password', async (c) => {
  const { email } = await c.req.json();

  if (!email) {
    c.status(400);
    return c.json({ error: 'Email is required.' });
  }

  const emailSchema = z.string().email();
  if (!emailSchema.safeParse(email).success) {
    c.status(400);
    return c.json({ error: 'Invalid email format.' });
  }

  const prisma = new PrismaClient({ datasourceUrl: c.env.DATABASE_URL }).$extends(withAccelerate());
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    c.status(404);
    return c.json({ error: 'User not found' });
  }

  // Generate reset token and expiry (15 minutes)
  const token = crypto.randomBytes(32).toString('hex');
  const expiry = new Date(Date.now() + 15 * 60 * 1000);

  await prisma.user.update({
    where: { email },
    data: {
      resetToken: token,
      resetTokenExpiry: expiry,
    },
  });

  const resetLink = `${c.env.FRONTEND_BASE_URL}/reset-password?token=${encodeURIComponent(token)}`;
  console.log(resetLink)

  // Setup Nodemailer transporter using Gmail
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: "noreply.sportstolt@gmail.com",          // e.g. 'noreply.sportstolt@gmail.com'
      pass: "vsalxnxrhpkajcea",      // Gmail app password or OAuth token
    },
  });

  const mailOptions = {
    from: "noreply.sportstolt@gmail.com",
    to: email,
    subject: 'Password Reset Request - Sportstolt',
    text: `Hi ${user.username || ''},

You requested a password reset. Click the link below to reset your password. This link is valid for 15 minutes.

${resetLink}

If you did not request this, please ignore this email.

Thanks,
Sportstolt Team
    `,
    html: `
      <p>Hi ${user.username || ''},</p>
      <p>You requested a password reset. Click the link below to reset your password. This link is valid for 15 minutes.</p>
      <p><a href="${resetLink}">Reset Password</a></p>
      <p>If you did not request this, please ignore this email.</p>
      <br/>
      <p>Thanks,<br/>Sportstolt Team</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return c.json({ message: 'Password reset link sent to your email.' });
  } catch (error) {
    console.error('Nodemailer error:', error);
    c.status(500);
    return c.json({ error: 'Failed to send password reset email. Please try again later.' });
  }
});

// User Reset Password Route
userRouter.post('/reset-password', async (c) => {
  const { token, newPassword } = await c.req.json();

  if (!token || !newPassword) {
    c.status(400);
    return c.json({ error: 'Token and new password are required.' });
  }

  if (newPassword.length < 6) {
    c.status(400);
    return c.json({ error: 'New password must be at least 6 characters.' });
  }

  const prisma = new PrismaClient({ datasourceUrl: c.env.DATABASE_URL }).$extends(withAccelerate());

  const user = await prisma.user.findFirst({
    where: {
      resetToken: token,
      resetTokenExpiry: { gte: new Date() },
    },
  });

  if (!user) {
    c.status(400);
    return c.json({ error: 'Invalid or expired token.' });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 6);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null,
    },
  });

  return c.json({ message: 'Password has been reset successfully.' });
});


// User Forgot Password Route
// userRouter.post('/forgot-password', async (c) => {
//   const { username } = await c.req.json();

//   if (!username) {
//     c.status(400);
//     return c.json({ error: 'Username (email) is required.' });
//   }

//   // Optional: validate email format with zod or regex here
//   const emailSchema = z.string().email();
//   if (!emailSchema.safeParse(username).success) {
//     c.status(400);
//     return c.json({ error: 'Invalid email format.' });
//   }

//   const prisma = new PrismaClient({ datasourceUrl: c.env.DATABASE_URL }).$extends(withAccelerate());
//   const user = await prisma.user.findUnique({ where: { username } });

//   if (!user) {
//     c.status(404);
//     return c.json({ error: 'User not found' });
//   }

//   // Generate reset token and expiry (15 minutes)
//   const token = crypto.randomBytes(32).toString('hex');
//   const expiry = new Date(Date.now() + 15 * 60 * 1000);

//   await prisma.user.update({
//     where: { username },
//     data: {
//       resetToken: token,
//       resetTokenExpiry: expiry,
//     },
//   });

//   const resetLink = `${c.env.FRONTEND_BASE_URL}/reset-password?token=${token}`;

//   // Setup SendGrid
//   sgMail.setApiKey(c.env.SENDGRID_API_KEY);

//   const msg = {
//     to: username,
//     from: c.env.EMAIL_FROM,
//     subject: 'Password Reset Request - Sportstolt',
//     text: `Hi ${user.name || ''},

// You requested a password reset. Click the link below to reset your password. This link is valid for 15 minutes.

// ${resetLink}

// If you did not request this, please ignore this email.

// Thanks,
// Sportstolt Team
//     `,
//     html: `
//       <p>Hi ${user.name || ''},</p>
//       <p>You requested a password reset. Click the link below to reset your password. This link is valid for 15 minutes.</p>
//       <p><a href="${resetLink}">Reset Password</a></p>
//       <p>If you did not request this, please ignore this email.</p>
//       <br/>
//       <p>Thanks,<br/>Sportstolt Team</p>
//     `,
//   };

//   try {
//     await sgMail.send(msg);
//     return c.json({ message: 'Password reset link sent to your email.' });
//   } catch (error) {
//     console.error('SendGrid error:', error);
//     c.status(500);
//     return c.json({ error: 'Failed to send password reset email. Please try again later.' });
//   }
// });




// const stepInput = z.object({
//   fullName: z.string().min(1),
//   phone: z.string().optional(),
//   address: z.string().optional(),
//   // Add any other fields you want to collect at step 2 here
// });

// const stepInputIndividual = z.object({
//   age: z.number().int().min(0),
//   gender: z.string(),
//   city: z.string(),
//   country: z.string(),
// });

// const stepInputOrganization = z.object({
//   orgName: z.string(),
//   address: z.string(),
//   city: z.string(),
//   country: z.string(),
//   size: z.number().int().min(1),
// });

// type JwtPayload = {
//   id: number;
//   email?: string;
//   // add more fields if needed
// };

// 👇 Use middleware for this route
// userRouter.post("/signup/step", authMiddleware, async (c) => {
//   const prisma = new PrismaClient({ datasourceUrl: c.env.DATABASE_URL }).$extends(withAccelerate());
//   const userId = c.var.userId;

//   // Fetch user from DB
//   const user = await prisma.user.findUnique({
//     where: { id: userId },
//   });

//   if (!user) {
//     return c.json({ error: "User not found" }, 404);
//   }

//   try {
//     const body = await c.req.json();

//     if (user.type === "INDIVIDUAL") {
//       const result = stepInputIndividual.safeParse(body);

//       if (!result.success) {
//         return c.json({ error: "Invalid input", details: result.error }, 400);
//       }

//       const profile = await prisma.individualProfile.upsert({
//         where: { userId },
//         create: {
//           userId,
//           ...result.data,
//         },
//         update: result.data,
//       });

//       return c.json({ message: "Individual profile updated", profile });
//     }

//     if (user.type === "ORG") {
//       const result = stepInputOrganization.safeParse(body);

//       if (!result.success) {
//         return c.json({ error: "Invalid input", details: result.error }, 400);
//       }

//       const profile = await prisma.organizationProfile.upsert({
//         where: { userId },
//         create: {
//           userId,
//           ...result.data,
//         },
//         update: result.data,
//       });

//       return c.json({ message: "Organization profile updated", profile });
//     }

//     return c.json({ error: "Unknown user type" }, 400);
//   } catch (e) {
//     console.error(e);
//     return c.json({ error: "Failed to update profile" }, 500);
//   }
// });

// Route to update user profile info after initial signup
// userRouter.post('/signup/step', async (c) => {
//   // Get token from Authorization header
//   const authHeader = c.req.header("Authorization");
//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     c.status(401);
//     return c.json({ error: "Missing or invalid authorization header" });
//   }
//   const token = authHeader.substring(7);

//   // Verify JWT token
//   let payload;
//   // try {
//   //   const payload = await verify(token, c.env.JWT_SECRET) as { id: number };

//   //   if (!payload || !payload.id) {
//   //     c.status(401);
//   //     return c.json({ error: "Invalid token payload" });
//   //   }

//   //   const user = await prisma.user.findUnique({
//   //     where: { id: payload.id },
//   //   });

//   //   if (!user) {
//   //     c.status(404);
//   //     return c.json({ error: "User not found" });
//   //   }

//   //   // proceed with user
//   // } catch (err) {
//   //   c.status(401);
//   //   return c.json({ error: "Invalid or expired token" });
//   // }

//   try {
//     // const payload = await verify(token, c.env.JWT_SECRET) as JwtPayload;
//     const payload = (await verify(token, c.env.JWT_SECRET)) as { id?: number } | undefined;

//     if (!payload?.id) {
//       c.status(401);
//       return c.json({ error: "Invalid token" });
//     }
//     } catch (e) {
//       c.status(401);
//       return c.json({ error: "Invalid or expired token" });
//     }

//   // Fetch user with type from DB (to know which profile to update)
//   const prisma = new PrismaClient({ datasourceUrl: c.env.DATABASE_URL }).$extends(withAccelerate());
//   const user = await prisma.user.findUnique({
//     where: { id: payload.id },
//   });
//   if (!user) {
//     c.status(404);
//     return c.json({ error: "User not found" });
//   }

//   try {
//     if (user.type === "INDIVIDUAL") {
//       // Parse individual profile input
//       const body = await c.req.json();
//       const result = stepInputIndividual.safeParse(body);
//       if (!result.success) {
//         c.status(400);
//         return c.json({ error: "Invalid input", details: result.error });
//       }

//       // Upsert individual profile
//       const profile = await prisma.individualProfile.upsert({
//         where: { userId: user.id },
//         create: {
//           userId: user.id,
//           age: result.data.age,
//           gender: result.data.gender,
//           city: result.data.city,
//           country: result.data.country,
//         },
//         update: {
//           age: result.data.age,
//           gender: result.data.gender,
//           city: result.data.city,
//           country: result.data.country,
//         }
//       });

//       c.status(200);
//       return c.json({ message: "Individual profile updated", profile });

//     } else if (user.type === "ORG") {
//       // Parse organization profile input
//       const body = await c.req.json();
//       const result = stepInputOrganization.safeParse(body);
//       if (!result.success) {
//         c.status(400);
//         return c.json({ error: "Invalid input", details: result.error });
//       }

//       // Upsert organization profile
//       const profile = await prisma.organizationProfile.upsert({
//         where: { userId: user.id },
//         create: {
//           userId: user.id,
//           orgName: result.data.orgName,
//           address: result.data.address,
//           city: result.data.city,
//           country: result.data.country,
//           size: result.data.size,
//         },
//         update: {
//           orgName: result.data.orgName,
//           address: result.data.address,
//           city: result.data.city,
//           country: result.data.country,
//           size: result.data.size,
//         }
//       });

//       c.status(200);
//       return c.json({ message: "Organization profile updated", profile });

//     } else {
//       c.status(400);
//       return c.json({ error: "Unknown user type" });
//     }
//   } catch (e) {
//     console.error(e);
//     c.status(500);
//     return c.json({ error: "Failed to update profile" });
//   }
// });



// import { Hono } from "hono";
// import { PrismaClient } from "@prisma/client/edge"
// import { withAccelerate } from '@prisma/extension-accelerate'
// import { sign} from 'hono/jwt'
// import { signupInput, signinInput } from '@vanshkathpalia/sportstolt-common'
// import bcrypt from 'bcryptjs';
// import nodemailer from 'nodemailer';
// import axios from "axios";
// import { auth } from "googleapis/build/src/apis/abusiveexperiencereport";
// import { authMiddleware } from "~/middleware/authMiddleware";
// // import { Jwt } from "jsonwebtoken";
// // import jwt from 'jsonwebtoken';


// export const userRouter = new Hono<{
//     Bindings: {
//       DATABASE_URL: string;
//       JWT_SECRET: string;
//       GEOLOCATION_API_KEY: string;
//       // BASE_URL: string;
//     }
// }>();

// interface Requestheaders {
//   (name: Requestheaders): string | undefined;
//   (name: string): string | undefined;
//   (): Record<string, string>;
// }
// // const prisma = new PrismaClient({ datasourceUrl: c.env.DATABASE_URL }).$extends(withAccelerate());

// // userRouter.post('/signup', async (c) => {
// //   const body = await c.req.json();
// //   const { success } = signupInput.safeParse(body);
// //   if (!success) {
// //     c.status(400);  // Change to 400 for invalid input
// //     return c.json({
// //       message: "Invalid input"
// //     });
// //   }
  
// //   const prisma = new PrismaClient({
// //     datasourceUrl: c.env.DATABASE_URL,
// //   }).$extends(withAccelerate());

// //   try {
// //     const hashedPassword = await bcrypt.hash(body.password, 6);
// //     const user = await prisma.user.create({
// //       data: {
// //         username: body.username,
// //         password: hashedPassword,
// //         name: body.name
// //       }
// //     });

// //     const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
// //     return c.json({ token: jwt });
// //   } catch (e) {
// //     c.status(500);  // Change to 500 for server errors
// //     console.log(e);
// //     return c.text("Error creating user");
// //   }
// // });

// const sendEmail = async (username: string, name: string, password: string) => {

// //   // Create transporter with your email credentials
// //   const transporter = nodemailer.createTransport({
// //       service: 'Gmail',
// //       auth: {
// //           user: "noreply.sportstolt@gmail.com", // Use environment variables
// //           pass: "vsalxnxrhpkajcea", // Use environment variables
// //       },
// //   });

//   const transporter = nodemailer.createTransport({
//     host: 'smtp.gmail.com',
//     port: 465,
//     secure: true, // Use SSL
//     auth: {
//       user: "noreply.sportstolt@gmail.com",
//       pass: "vsalxnxrhpkajcea",
//     },
//   });
  

//    const mailOptions = {
//     from: "noreply.sportstolt@gmail.com",
//     to: username,
//     subject: `Welcome to Sportstolt, ${name}!`,
//     html: `
//       <p>Dear ${name},</p>
//       <p>Welcome to <strong>Sportstolt</strong>! We're thrilled to have you on board.</p>
//       <p>Here are your login credentials:</p>
//       <ul>
//         <li><strong>Username:</strong> ${username}</li>
//         <li><strong>Password:</strong> ${password}</li>
//       </ul>
//       <p>Please keep this information secure.</p>
//       <p>By signing up, you agree to our 
//         <a href="https://sportstolt.com/terms-and-conditions" target="_blank">Terms and Conditions</a>.
//       </p>
//       <p>Best regards,</p>
//       <p>The Sportstolt Team</p>
//     `,
//   };


//   try {
//       await transporter.sendMail(mailOptions);
//   } catch (error) {
//       console.error('Error sending email:', error);
//   }
// };

// userRouter.post('/signup', async (c) => {
//   const body = await c.req.json();
//   const result = signupInput.safeParse(body);
//   if (!result.success) {
//       c.status(400);
//       return c.json({ error: "Invalid input", details: result.error });
//   }

//   const prisma = new PrismaClient({ datasourceUrl: c.env.DATABASE_URL }).$extends(withAccelerate());

//   try {
//       const existingUser = await prisma.user.findUnique(
//         { where: { username: body.username } 
//       });

//       if (existingUser) {
//           c.status(409); // Conflict
//           return c.json({ error: "User already exists. Try signing in." });
//       }

//       const password = body.password;

//       const hashedPassword = await bcrypt.hash(body.password, 6);
//       const user = await prisma.user.create({
//           data: {
//             username: body.username,
//             password: hashedPassword,
//             name: body.name
//           }
//       });

//       const jwt = await sign(
//           { id: user.id, username: user.username, timestamp: Date.now() },
//           c.env.JWT_SECRET
//       );

//       console.log("Sending email to user:", user.username, "with JWT:", jwt);

//       // Send email after signup
//       await sendEmail(user.username, user?.name ?? '', password);

//       // Log after the email is sent successfully
//       console.log("Email sent successfully to:", user.username);

//       return c.json({ token: jwt });
//   } catch (e) {
//       c.status(500);
//       console.error(e);
//       return c.json({ error: "Internal server error during signup" });
//   }
// });

// const sendLoginConfirmationEmail = async (username: string, name: string, ipAddress: string, location: string) => {
//   const transporter = nodemailer.createTransport({
//     host: 'smtp.gmail.com',
//     port: 465,
//     secure: true,
//     auth: {
//       user: "noreply.sportstolt@gmail.com",
//       pass: "vsalxnxrhpkajcea",
//     },
//   });

//   const mailOptions = {
//     from: "noreply.sportstolt@gmail.com",
//     to: username,
//     subject: `New Login Detected for ${name}`,
//     html: `
//       <p>Dear ${name},</p>
//       <p>A new login to your Sportstolt account was detected from the following location:</p>
//       <ul>
//         <li><strong>IP Address:</strong> ${ipAddress}</li>
//         <li><strong>Location:</strong> ${location}</li>
//       </ul>
//       <p>If this was you, you can ignore this email. If this wasn't you, please secure your account immediately.</p>
//       <p>Best regards,</p>
//       <p>The Sportstolt Team</p>
//     `,
//   };

//   try {
//     const info = await transporter.sendMail(mailOptions);
//     console.log("Confirmation email sent successfully:", info.response);
//   } catch (error) {
//     console.error("Error sending confirmation email:", error);
//   }
// };

// userRouter.post('/signin', async (c) => {
//   const body = await c.req.json();
//   const prisma = new PrismaClient({ datasourceUrl: c.env.DATABASE_URL }).$extends(withAccelerate());

//   try {
//     const user = await prisma.user.findUnique({ where: { username: body.username } });
//     if (!user) {
//       c.status(404);
//       return c.json({ error: "User not found. Please sign up." });
//     }

//     const isPasswordCorrect = await bcrypt.compare(body.password, user.password);
//     if (!isPasswordCorrect) {
//       c.status(401);
//       return c.json({ error: "Incorrect password." });
//     }

//     // Generate JWT Token
//    // Generate JWT Token
//     const jwt = await sign(
//       { id: user.id, username: user.username, iat: Math.floor(Date.now() / 1000) },
//       c.env.JWT_SECRET,
//       // { expiresIn: '1h' }  // Optional: Set an expiration time
//     );


//     // Extract the user's IP address
//    // Extract the user's IP address
//     const ipAddress = c.req.header('cf-connecting-ip') || 
//                       c.req.header('x-forwarded-for') || 
//                       c.req.header('x-real-ip') || 
//                       c.req.header('x-client-ip') || 
//                       c.req.header('x-forwarded') || 
//                       c.req.header('x-cluster-client-ip') || 
//                       c.req.header('forwarded-for') || 
//                       c.req.header('forwarded') || 
//                       'Unknown IP';


//     // Fetch the location based on the IP address

//     const isLocalhost = ipAddress === '::1' || ipAddress === '127.0.0.1';
//     const ipForGeolocation = isLocalhost ? '8.8.8.8' : ipAddress;

//     let location = 'Unknown Location';
//     try {
//       const geoRes = await axios.get(`https://ipinfo.io/${ipForGeolocation}/json?token=${c.env.GEOLOCATION_API_KEY}`);
//       const { city, region, country } = geoRes.data;
//       // const city = c.req.header('cf-ipcity') || 'Unknown City';
//       // const region = c.req.header('cf-region') || 'Unknown Region';
//       // const country = c.req.header('cf-ipcountry') || 'Unknown Country';

//       location = `${city}, ${region}, ${country}`;
//     } catch (err) {
//       console.error("Error fetching geolocation:", err);
//     }

//     await sendLoginConfirmationEmail(user.username, user?.name ?? '', ipAddress, location);

//     c.status(200);
//     return c.json({ token: jwt });
//   } catch (e) {
//     console.error(e);
//     c.status(500);
//     return c.json({ error: "Internal server error during signin" });
//   }
// });

// //     return c.json({ message: "Login successful", user: { username: user.username, name: user.name } });

// //     instead of returning the username and name we should retun the token



// userRouter.post('/signup', async (c) => {
//   const body = await c.req.json();
//   const result = signupInput.safeParse(body);
//   if (!result.success) {
//       c.status(400);
//       return c.json({ error: "Invalid input", details: result.error });
//   }

//   const prisma = new PrismaClient({ datasourceUrl: c.env.DATABASE_URL }).$extends(withAccelerate());

//   try {
//       const existingUser = await prisma.user.findUnique(
//         { where: { username: body.username } 
//       });

//       if (existingUser) {
//           c.status(409); // Conflict
//           return c.json({ error: "User already exists. Try signing in." });
//       }

//       const password = body.password;

//       const hashedPassword = await bcrypt.hash(body.password, 6);
//       const user = await prisma.user.create({
//           data: {
//             username: body.username,
//             password: hashedPassword,
//             name: body.name
//           }
//       });

//       const jwt = await sign(
//           { id: user.id, username: user.username, timestamp: Date.now() },
//           c.env.JWT_SECRET
//       );

//       console.log("Sending email to user:", user.username, "with JWT:", jwt);

//       // Send email after signup
//       await sendEmail(user.username, user?.name ?? '', password);

//       // Log after the email is sent successfully
//       console.log("Email sent successfully to:", user.username);

//       return c.json({ token: jwt });
//   } catch (e) {
//       c.status(500);
//       console.error(e);
//       return c.json({ error: "Internal server error during signup" });
//   }
// });