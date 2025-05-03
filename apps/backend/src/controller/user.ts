import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge"
import { withAccelerate } from '@prisma/extension-accelerate'
import { decode, sign, verify } from 'hono/jwt'
import { signupInput, signinInput } from '@vanshkathpalia/sportstolt-common'
import bcrypt from 'bcryptjs';

export const userRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string;
        JWT_SECRET: string
      } 
}>();

// userRouter.post('/signup', async (c) => {
//   const body = await c.req.json();
//   const { success } = signupInput.safeParse(body);
//   if (!success) {
//     c.status(400);  // Change to 400 for invalid input
//     return c.json({
//       message: "Invalid input"
//     });
//   }
  
//   const prisma = new PrismaClient({
//     datasourceUrl: c.env.DATABASE_URL,
//   }).$extends(withAccelerate());

//   try {
//     const hashedPassword = await bcrypt.hash(body.password, 6);
//     const user = await prisma.user.create({
//       data: {
//         username: body.username,
//         password: hashedPassword,
//         name: body.name
//       }
//     });

//     const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
//     return c.json({ token: jwt });
//   } catch (e) {
//     c.status(500);  // Change to 500 for server errors
//     console.log(e);
//     return c.text("Error creating user");
//   }
// });

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

// userRouter.post('/signin', async (c) => {
//   const body = await c.req.json();

//   if (!c.env.JWT_SECRET || !c.env.DATABASE_URL) {
//     throw new Error("Missing environment variables");
//   }

//   const { success: isValid } = signinInput.safeParse(body);

//   if (!isValid) {
//     c.status(400);
//     return c.json({
//       message: "Invalid input", issues: signinInput.safeParse(body).error
//     });
//   }

//   const prisma = new PrismaClient({
//     datasourceUrl: c.env.DATABASE_URL,
//   }).$extends(withAccelerate());

//   try {
//     const user = await prisma.user.findFirst({
//       where: { username: body.username }
//     });

//     if (!user || !(await bcrypt.compare(body.password, user.password))) {
//       c.status(403);  // Change to 403 for invalid credentials
//       return c.text("Invalid credentials");
//     }

//     const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
//     return c.json({ token: jwt });
//   } catch (e) {
//     c.status(500);  // Change to 500 for server errors
//     console.log(e);
//     return c.text("Error signing in");
//   }
// });

userRouter.post('/signin', async (c) => {
  const body = await c.req.json();
  const result = signinInput.safeParse(body);

  if (!result.success) {
    c.status(400);
    return c.json({ error: "Invalid input", details: result.error });
  }

  const prisma = new PrismaClient({ datasourceUrl: c.env.DATABASE_URL }).$extends(withAccelerate());

  try {
    const user = await prisma.user.findUnique({ where: { username: body.username } });

    if (!user) {
      c.status(404); // Not Found
      return c.json({ error: "User not found. Please sign up." });
    }

    const isPasswordCorrect = await bcrypt.compare(body.password, user.password);
    if (!isPasswordCorrect) {
      c.status(401); // Unauthorized
      return c.json({ error: "Incorrect password." });
    }

    const jwt = await sign(
      { id: user.id, username: user.username, iat: Math.floor(Date.now() / 1000) },
      c.env.JWT_SECRET
    );
    
    // to verify the JWT
    // const decoded = await verify(jwt, c.env.JWT_SECRET);
    // console.log(decoded); // should show different iat/id per user

    return c.json({ token: jwt });
  } catch (e) {
    c.status(500);
    console.error(e);
    return c.json({ error: "Internal server error during signin" });
  }
});



userRouter.get('/users', async (c) => {
  const prisma = new PrismaClient({ 
    datasourceUrl: c.env.DATABASE_URL 
  }).$extends(withAccelerate());

  try {
    const users = await prisma.user.findMany();
    return c.json(users);
  } catch (e) {
    c.status(500);
    console.error(e);
    return c.text("Error fetching users");
  }
});



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