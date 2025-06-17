import { userService } from "../services/userService";
import { signupInput, signinInput } from "@vanshkathpalia/sportstolt-common";
import { ZodError } from "zod";
import { Context } from "hono";
import { UserEditInput } from "~/schema/userSchemas";

export const userController = {
  signup: async (c: Context) => {
    const body = await c.req.json();
    const result = signupInput.safeParse(body);
    if (!result.success) {
      return c.json({ error: "Invalid input", details: result.error }, 400);
    }
    return userService.signup(c, result.data);
  },

  signin: async (c: Context) => {
    const body = await c.req.json();
    const result = signinInput.safeParse(body);
    if (!result.success) {
      return c.json({ error: "Invalid input", details: result.error }, 400);
    }
    return userService.signin(c, result.data);
  },

  getAllUsers: (c: Context) => userService.getAllUsers(c),
  getCurrentUser: (c: Context) => userService.getCurrentUser(c),
  getProfile: (c: Context) => userService.getProfile(c),
  updateProfile: async (c: Context) => {
    const body = await c.req.json();
    try {
      const data = UserEditInput.parse(body);
      return userService.updateProfile(c, data);
    } catch (e) {
      if (e instanceof ZodError) {
        return c.json({ error: 'Invalid input', details: e.errors }, 400);
      }
      return c.json({ error: 'Unexpected error' }, 500);
    }
  },
  getUserPosts: (c: Context) => userService.getUserPosts(c),
  getUserEvents: (c: Context) => userService.getUserEvents(c),
  getUserIdByUsername: (c: Context) => userService.getUserIdByUsername(c),
};
