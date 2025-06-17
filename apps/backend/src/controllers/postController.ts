import { postService } from "../services/postService";
import { createPostSchema, updatePostSchema, PostContext } from "../types/postTypes";

export const postController = {
  createPost: async (c: PostContext) => {
    const body = await c.req.json();
    const parsed = createPostSchema.safeParse(body);
    if (!parsed.success) return c.json({ message: "Invalid input" }, 400);

    const post = await postService.createPost(c, parsed.data);
    return c.json(post);
  },
  
  getbulkPosts: async (c: PostContext) => {
    const groupBy = c.req.query("groupBy") || "default";
    const posts = await postService.bulkPosts(c, groupBy);
    return c.json(posts);
  },

  getPostById: async (c: PostContext) => {
    const id = Number(c.req.param("id"));
    if (isNaN(id)) return c.json({ message: "Invalid ID" }, 400);

    const post = await postService.getPostById(c, id);
    return c.json(post);
  },


  updatePost: async (c: PostContext) => {
    const body = await c.req.json();
    const parsed = updatePostSchema.safeParse(body);
    if (!parsed.success) return c.json({ message: "Invalid input" }, 400);

    const updated = await postService.updatePost(c, parsed.data);
    return c.json(updated);
  },

  deletePost: async (c: PostContext) => {
    const id = Number(c.req.param("id"));
    if (isNaN(id)) return c.json({ message: "Invalid ID" }, 400);

    const deleted = await postService.deletePost(c, id);
    return c.json({ message: "Post deleted", deleted });
  },


  postLike: async (c: PostContext) => {
    const postId = Number(c.req.param("id"));
    if (isNaN(postId)) return c.json({ message: "Invalid ID" }, 400);

    const result = await postService.likeToggle(c, postId);
    return c.json(result);
  },

  postSave: async (c: PostContext) => {
    const postId = Number(c.req.param("id"));
    if (isNaN(postId)) return c.json({ message: "Invalid ID" }, 400);

    await postService.saveToggle(c, postId);
    return c.json({ success: true });
  },

  getPostStatus: async (c: PostContext) => {
    const postId = Number(c.req.param("id"));
    if (isNaN(postId)) return c.json({ message: "Invalid ID" }, 400);

    const status = await postService.getPostStatus(c, postId);
    return c.json(status);
  }
};

