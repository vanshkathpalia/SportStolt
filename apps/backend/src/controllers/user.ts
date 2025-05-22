const failedLoginAttempts: Record<string, number> = {};
import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge"
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign } from 'hono/jwt'
import { signupInput, signinInput } from '@vanshkathpalia/sportstolt-common'
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { z } from 'zod';
import nodemailer from 'nodemailer';
// import axios from "axios";

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

// User Signup Route (Without Mailer Logic)
userRouter.post('/signup', async (c) => {
    const body = await c.req.json();
    const result = signupInput.safeParse(body);
    if (!result.success) {
        c.status(400);
        return c.json({ error: "Invalid input", details: result.error });
    }

    const prisma = new PrismaClient({ datasourceUrl: c.env.DATABASE_URL }).$extends(withAccelerate());

    try {
        const existingUser = await prisma.user.findUnique({ where: { username: body.username } });

        if (existingUser) {
            c.status(409); // Conflict
            return c.json({ error: "User already exists. Try signing in." });
        }

        const hashedPassword = await bcrypt.hash(body.password, 6);
        const user = await prisma.user.create({
            data: {
                username: body.username,
                password: hashedPassword,
                name: body.name
            }
        });

        const jwt = await sign(
            { id: user.id, username: user.username, timestamp: Date.now() },
            c.env.JWT_SECRET
        );

        return c.json({ token: jwt });
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
          const user = await prisma.user.findUnique({ where: { username: body.username } });
          if (!user) {
              c.status(404);
              return c.json({ error: "User not found. Please sign up." });
          }

          const isPasswordCorrect = await bcrypt.compare(body.password, user.password);
          if (!isPasswordCorrect) {
              c.status(401);
              return c.json({ error: "Incorrect password. Change your password" });
          }

          const jwt = await sign(
              { id: user.id, username: user.username, iat: Math.floor(Date.now() / 1000) },
              c.env.JWT_SECRET
          );

          c.status(200);
          return c.json({ token: jwt });
      } catch (e) {
          console.error(e);
          c.status(500);
          return c.json({ error: "Internal server error during signin" });
      }
  });

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
  const { username } = await c.req.json();

  if (!username) {
    c.status(400);
    return c.json({ error: 'Username (email) is required.' });
  }

  const emailSchema = z.string().email();
  if (!emailSchema.safeParse(username).success) {
    c.status(400);
    return c.json({ error: 'Invalid email format.' });
  }

  const prisma = new PrismaClient({ datasourceUrl: c.env.DATABASE_URL }).$extends(withAccelerate());
  const user = await prisma.user.findUnique({ where: { username } });

  if (!user) {
    c.status(404);
    return c.json({ error: 'User not found' });
  }

  // Generate reset token and expiry (15 minutes)
  const token = crypto.randomBytes(32).toString('hex');
  const expiry = new Date(Date.now() + 15 * 60 * 1000);

  await prisma.user.update({
    where: { username },
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
    to: username,
    subject: 'Password Reset Request - Sportstolt',
    text: `Hi ${user.name || ''},

You requested a password reset. Click the link below to reset your password. This link is valid for 15 minutes.

${resetLink}

If you did not request this, please ignore this email.

Thanks,
Sportstolt Team
    `,
    html: `
      <p>Hi ${user.name || ''},</p>
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