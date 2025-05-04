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

  try {
    const user = await verify(authHeader, c.env.JWT_SECRET);

    if (user && typeof user.id === "number") {
      c.set("userId", user.id);
      return await next();
    } else {
      return c.json({ message: "Invalid token structure" }, 403);
    }
  } catch (err) {
    console.error("JWT verification failed:", err);
    return c.json({ message: "Invalid or expired token" }, 403);
  }
}
