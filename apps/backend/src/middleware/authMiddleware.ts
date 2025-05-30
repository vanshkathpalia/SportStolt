
import { MiddlewareHandler } from 'hono'
import { verify } from 'hono/jwt'

export const authMiddleware: MiddlewareHandler<{
  Bindings: {
    JWT_SECRET: string;
  },
  Variables: {
    userId: number;
  }
}> = async (c, next) => {
  
  const authHeader = c.req.header("authorization") || "";
  
  // Ensure the token has the "Bearer " prefix
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;
  if (!authHeader) {
    return c.json({ error: "Missing token" }, 401);
  }

  try {
    const user = await verify(token, c.env.JWT_SECRET);

    if (user && typeof user.id === "number") {
      c.set("userId", user.id);
      // console.log('Token User ID:', c.get('userId'));
      return await next();
    } else {
      console.error("Invalid token structure:", user);
      return c.json({ message: "Invalid token structure" }, 403);
    }
  } catch (err) {
    console.error("JWT verification failed:", err);
    return c.json({ message: "Invalid or expired token" }, 403);
  }
}

// import { MiddlewareHandler } from 'hono'
// import { verify } from 'hono/jwt'

// export const authMiddleware: MiddlewareHandler<{
//   Bindings: {
//     JWT_SECRET: string;
//   },
//   Variables: {
//     userId: number;
//   }
// }> = async (c, next) => {
//   const authHeader = c.req.header("authorization") || "";

//   try {
//     const user = await verify(authHeader, c.env.JWT_SECRET);

//     if (user && typeof user.id === "number") {
//       c.set("userId", user.id);
//       return await next();
//     } else {
//       return c.json({ message: "Invalid token structure" }, 403);
//     }
//   } catch (err) {
//     console.error("JWT verification failed:", err);
//     return c.json({ message: "Invalid or expired token" }, 403);
//   }
// }
