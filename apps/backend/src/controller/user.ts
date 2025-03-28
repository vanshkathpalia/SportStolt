import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge"
import { withAccelerate } from '@prisma/extension-accelerate'
import { decode, sign, verify } from 'hono/jwt'
import { signupInput, signinInput } from '@vanshkathpalia/sportstolt-common'

export const userRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string;
        JWT_SECRET: string
      } 
}>();

userRouter.post('/signup', async (c) => {

    const body = await c.req.json();
    const { success } = signupInput.safeParse(body);
    if(!success) {
      c.status(411);
      return c.json({
        message: "invalid"
      })
    }
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    
    try {
      const user = await prisma.user.create({
        data: {
          username: body.username,
          password: body.password,
          name: body.name
        }
      });
      const jwt = await sign({
        id: user.id
      }, c.env.JWT_SECRET);
      return c.text(jwt);
    }
    catch (e) {
      c.status(411)
      console.log(e);
      return c.text("invalid details")
    }
  })
  
  
userRouter.post('/signin', async (c) => {
    const body = await c.req.json();

    const { success } = signinInput.safeParse(body);
    if(!success) {
      c.status(411);
      return c.json({
        message: "invalid"
      })
    }

    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    
    try {
      const user = await prisma.user.findFirst({
        where: {
          username: body.username,
          password: body.password,
        }
      })
  
      if (!user) { 
        c.status(403); 
        return c.text('invalid at signin')
      }
  
      const jwt = await sign({
        id: user.id
      }, c.env.JWT_SECRET);
      return c.text(jwt);
    }
    catch (e) {
      c.status(411)
      console.log(e);
      return c.text("invalid details")
    }
  })


userRouter.get('/users', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const users = await prisma.user.findMany();  // Fetch all users

    // Return users list as JSON
    return c.json(users);
  } catch (e) {
    c.status(500);
    console.log(e);
    return c.text("Error fetching users");
  }
});




// import { Hono } from "hono";
// import { PrismaClient } from "@prisma/client/edge"
// import { withAccelerate } from '@prisma/extension-accelerate'
// import { decode, sign, verify } from 'hono/jwt'
// import { signupInput, signinInput } from '@vanshkathpalia/sportstolt-common'
// import { authMiddleware } from "~/middleware/authMiddleware";
// import * as jwt from 'jsonwebtoken';
// // import { compare } from 'bcrypt';



// export const userRouter = new Hono<{
//     Bindings: {
//         DATABASE_URL: string;
//         JWT_SECRET: string
//       } 
// }>();

// userRouter.post('/signup', async (c) => {
//   const body = await c.req.json();
//   const { success } = signupInput.safeParse(body);
//   if (!success) {
//       c.status(411);
//       return c.json({ message: "invalid" });
//   }

//   const prisma = new PrismaClient({
//       datasourceUrl: c.env.DATABASE_URL,
//   }).$extends(withAccelerate());

//   try {
//       const user = await prisma.user.create({
//           data: {
//               username: body.username,
//               password: body.password, 
//               name: body.name
//           }
//       });

//       const token = jwt.sign(
//           { id: user.id },
//           c.env.JWT_SECRET,
//           { expiresIn: "7d" }
//       );

//       return c.json({ token });  
//   } catch (e) {
//       c.status(500);
//       console.log(e);
//       return c.text("Invalid details");
//   }
// });


// userRouter.post('/signin', async (c) => {
//     const body = await c.req.json();

//     const { success } = signinInput.safeParse(body);
//     if (!success) {
//         c.status(400); // Bad Request
//         return c.json({ message: "Invalid input" });
//     }

//     const prisma = new PrismaClient({
//         datasourceUrl: c.env.DATABASE_URL,
//     }).$extends(withAccelerate());

//     try {
//         const user = await prisma.user.findFirst({
//             where: {
//                 username: body.username,
//                 password: body.password, 
//             }
//         });

//         if (!user) {
//             console.log("Invalid credentials");
//             c.status(401); // Unauthorized
//             return c.json({ message: "Invalid credentials" });
//         }

//         if (!c.env.JWT_SECRET) {
//             console.error("JWT_SECRET is missing");
//             c.status(500);
//             return c.json({ message: "Server error" });
//         }

//         const jwtToken = await sign(
//             { id: user.id },
//             c.env.JWT_SECRET,
//             'HS256'
//         );
//         console.log("Generated Token:", jwtToken);

//         return c.json({ token: jwtToken, userId: user.id });
//     } catch (e) {
//         console.error("Signin Error:", e);
//         c.status(500); // Internal Server Error
//         return c.json({ message: "Server error" });
//     }
// });




// // userRouter.get("/me", authMiddleware, async (c) => {
// //   const prisma = new PrismaClient({
// //     datasourceUrl: c.env.DATABASE_URL,
// //   }).$extends(withAccelerate());
// //   // Get userId from context
// //   const authorId = c.get("userId") as number;

// //   try {
// //     const user = await prisma.user.findUnique({
// //       where: { id: authorId },
// //     });

// //     if (!user) {
// //       c.status(404);
// //       return c.json({ error: "User not found" });
// //     }

// //     return c.json(user);
// //   } catch (e) {
// //     c.status(500);
// //     console.error(e);
// //     return c.text("Error fetching user data");
// //   }
// // });


// userRouter.get('/users', async (c) => {
//   const prisma = new PrismaClient({
//     datasourceUrl: c.env.DATABASE_URL,
//   }).$extends(withAccelerate());

//   // try {
//   //   const users = await prisma.user.findMany();  // Fetch all users

//   //   // Return users list as JSON
//   //   return c.json(users);
//   // } catch (e) {
//   //   c.status(500);
//   //   console.log(e);
//   //   return c.text("Error fetching users");
//   // }

//   try {
//     const users = await prisma.user.findMany({
//       select: {
//         id: true,
//         username: true, 
//       }
//     });

//     return c.json(users);
//   } catch (e) {
//     console.error("Error fetching users:", e);
//     c.status(500);
//     return c.json({ error: "Server error" });
//   }
// });