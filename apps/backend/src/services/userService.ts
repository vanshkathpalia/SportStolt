import { Context } from 'hono';
import { sign } from 'hono/jwt';
import bcrypt from 'bcryptjs';
import { getPrisma } from "../lib/prismaClient";

const failedLoginAttempts: Record<string, number> = {};

interface SignupData {
  email: string;
  password: string;
  username: string;
}

interface SigninData {
  email: string;
  password: string;
}

interface UpdateProfileData {
  username?: string;
  bio?: string;
  // Add other fields you allow updating
}

export const userService = {
  signup: async (c: Context, data: SignupData) => {
    const prisma = getPrisma(c.env.DATABASE_URL);
    const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
    if (existingUser) return c.json({ error: "User already exists" }, 409);

    const hashedPassword = await bcrypt.hash(data.password, 6);
    const user = await prisma.user.create({
      data: { email: data.email, password: hashedPassword, username: data.username }
    });

    await prisma.follow.create({
      data: { followerId: user.id, followingId: user.id }
    });

    const token = await sign({ id: user.id, username: user.username }, c.env.JWT_SECRET);
    return c.json({ token, user: { id: user.id, username: user.username, email: user.email } });
  },

  signin: async (c: Context, data: SigninData) => {
    const prisma = getPrisma(c.env.DATABASE_URL);
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user) return c.json({ error: "User not found" }, 404);

    const isCorrect = await bcrypt.compare(data.password, user.password);
    if (!isCorrect) {
      failedLoginAttempts[data.email] = (failedLoginAttempts[data.email] || 0) + 1;
      return c.json({ error: "Incorrect password", attempts: failedLoginAttempts[data.email] }, 401);
    }

    failedLoginAttempts[data.email] = 0;
    const token = await sign({ id: user.id, username: user.username }, c.env.JWT_SECRET);
    return c.json({ token, user: { id: user.id, username: user.username, email: user.email } });
  },

  getAllUsers: async (c: Context) => {
    const prisma = getPrisma(c.env.DATABASE_URL);
    const users = await prisma.user.findMany({
      select: { id: true, username: true, email: true, post: true },
      orderBy: { id: 'asc' },
    });
    return c.json({ users });
  },

  getCurrentUser: async (c: Context) => {
    const prisma = getPrisma(c.env.DATABASE_URL);
    const userId = c.get('userId');
    if (!userId) return c.json({ error: "Unauthorized" }, 401);

    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
      select: { id: true, username: true, email: true },
    });
    if (!user) return c.json({ error: "User not found" }, 404);
    return c.json(user);
  },

  getProfile: async (c: Context) => {
    const prisma = getPrisma(c.env.DATABASE_URL);
    const userId = Number(c.req.param('id'));
    if (isNaN(userId)) return c.json({ error: "Invalid ID" }, 400);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        post: true,
        story: true,
        following: true,
        followers: true,
        verifiedStories: true
      },
    });
    if (!user) return c.json({ error: "User not found" }, 404);

    return c.json({
      id: user.id,
      username: user.username,
      bio: user.bio,
      postsCount: user.post.length,
      storiesCount: user.story.length,
      legitimacy: user.story.length
        ? `${Math.floor((user.verifiedStories.length / user.story.length) * 100)}%`
        : "0%",
    });
  },

  updateProfile: async (c: Context, data: UpdateProfileData) => {
    const prisma = getPrisma(c.env.DATABASE_URL);
    const userId = Number(c.req.param('id'));
    const authUserId = c.get('userId');
    if (!authUserId || authUserId !== userId) return c.json({ error: "Unauthorized" }, 401);

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { ...data, updatedAt: new Date() },
    });
    return c.json({ message: "Profile updated", user: updated });
  },

  getUserPosts: async (c: Context) => {
    const prisma = getPrisma(c.env.DATABASE_URL);
    const userId = Number(c.req.param('id'));
    const posts = await prisma.post.findMany({
      where: { authorId: userId },
      orderBy: { createdAt: 'desc' },
    });
    return c.json(posts);
  },

  getUserEvents: async (c: Context) => {
    const prisma = getPrisma(c.env.DATABASE_URL);
    const userId = Number(c.req.param('id'));
    const events = await prisma.event.findMany({
      where: { registration: { some: { userId } } },
      orderBy: { startDate: 'asc' },
    });
    return c.json(events.map(e => ({
      ...e,
      status: new Date() > e.endDate ? "completed" : new Date() >= e.startDate ? "ongoing" : "upcoming"
    })));
  },

  getUserIdByUsername: async (c: Context) => {
    const prisma = getPrisma(c.env.DATABASE_URL);
    const username = c.req.param('username');
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) return c.json({ error: "User not found" }, 404);
    return c.json({ id: user.id });
  }
};
