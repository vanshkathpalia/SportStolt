import { getPrisma } from "../lib/prismaClient";
import { PostContext } from "../types/postTypes";

export const postService = {
  createPost: async (c: PostContext, data: { title: string; content: string; tagNames?: string[] }) => {
    const prisma = getPrisma(c.env.DATABASE_URL);
    const authorId = c.get("userId");

    const tagConnectOrCreate = (data.tagNames || []).map(tag => ({
      where: { name: tag.trim().toLowerCase() },
      create: { name: tag.trim().toLowerCase() }
    }));

    return prisma.post.create({
      data: {
        title: data.title,
        content: data.content,
        authorId,
        tags: { connectOrCreate: tagConnectOrCreate }
      },
      include: { tags: true }
    });
  },
  bulkPosts: async (c: PostContext, groupBy: string) => {
      const prisma = getPrisma(c.env.DATABASE_URL);
      // Example logic: group by tag or author
      if (groupBy === "tag") {
      return prisma.post.findMany({
          include: { tags: true }
      });
      }
      if (groupBy === "author") {
      return prisma.post.findMany({
          include: { author: true }
      });
      }
      // Default
      return prisma.post.findMany();
  },

  updatePost: async (c: PostContext, data: { id: number; title: string; content: string }) => {
    const prisma = getPrisma(c.env.DATABASE_URL);

    const existing = await prisma.post.findUnique({ where: { id: data.id } });
    if (!existing) throw new Error("Post not found");

    return prisma.post.update({
      where: { id: data.id },
      data: { title: data.title, content: data.content }
    });
  },
  

  deletePost: async (c: PostContext, id: number) => {
    const prisma = getPrisma(c.env.DATABASE_URL);
    return prisma.post.delete({ where: { id } });
  },

  getPostById: async (c: PostContext, id: number) => {
    const prisma = getPrisma(c.env.DATABASE_URL);
    const post = await prisma.post.findFirst({
      where: { id },
      include: {
        author: { select: { id: true, name: true, username: true, image: true } },
        tags: true
      }
    });
    if (!post) throw new Error("Post not found");
    return post;
  },

//   bulkPosts: async (c: PostContext, groupBy: string) => {
//     const prisma = getPrisma(c.env.DATABASE_URL);

//     const baseQuery = {
//         include: {
//         author: {
//             select: {
//             id: true,
//             name: true,
//             username: true,
//             image: true
//             }
//         },
//         tags: {
//             select: {
//             name: true
//             }
//         }
//         }
//     };

//         // If you want to filter/group differently, do so here
//         const posts = await prisma.post.findMany(baseQuery);

//         // Attach expanded: false as frontend expects
//         return posts.map(post => ({
//             ...post,
//             expanded: false
//         }));
//     },

  likeToggle: async (c: PostContext, postId: number) => {
    const prisma = getPrisma(c.env.DATABASE_URL);
    const userId = c.get("userId");

    const existing = await prisma.like.findUnique({
      where: { userId_postId: { userId, postId } }
    });

    if (existing) {
      await prisma.like.delete({ where: { userId_postId: { userId, postId } } });
      return { liked: false };
    } else {
      await prisma.like.create({ data: { userId, postId } });
      return { liked: true };
    }
  },

  saveToggle: async (c: PostContext, postId: number) => {
    const prisma = getPrisma(c.env.DATABASE_URL);
    const userId = c.get("userId");

    const existing = await prisma.save.findUnique({
      where: { userId_postId: { userId, postId } }
    });

    if (existing) {
      await prisma.save.delete({ where: { id: existing.id } });
    } else {
      await prisma.save.create({ data: { userId, postId } });
    }
  },

  getPostStatus: async (c: PostContext, postId: number) => {
    const prisma = getPrisma(c.env.DATABASE_URL);
    const userId = c.get("userId");

    const [liked, saved, likeCount] = await Promise.all([
      prisma.like.findUnique({ where: { userId_postId: { userId, postId } } }),
      prisma.save.findUnique({ where: { userId_postId: { userId, postId } } }),
      prisma.like.count({ where: { postId } })
    ]);

    return {
      liked: !!liked,
      saved: !!saved,
      likeCount
    };
  }
};
