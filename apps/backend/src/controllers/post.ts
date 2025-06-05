import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { verify } from 'hono/jwt'
import { createPostInput, updatePostInput } from '@vanshkathpalia/sportstolt-common'
import { z } from "zod"
import { authMiddleware } from '../middleware/authMiddleware' // adjust the path as needed


const createPostsInput = z.object({
    title: z.string().min(1, 'Title is required'),
    content: z.string().min(1, 'Content is required'),
});

export const postRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string;
        JWT_SECRET: string;
      } 
    Variables: {
        userId: number;
    }
}>();

postRouter.use('/*', authMiddleware);

 
// postRouter.post('/', async (c) => {
//     // console.log('Incoming request:', c.req.method, c.req.url);
//     try {
//         const body = await c.req.json();
//         console.log('Request body:', body);
//         // console.log('createPostInput:', createPostsInput);

//         const { success } = createPostsInput.safeParse(body);
//         if (!success) {
//             c.status(411);
//             return c.json({ message: "invalid" });
//         }

//         // const result = createPostsInput.safeParse(body);
//         // if (!result.success) {
//         //     console.error("Validation error:", result.error);
//         //     c.status(411);
//         //     c.json({ message: "Invalid input" });
//         //     return;
//         // }

//         const authorId = c.get("userId");
//         if (!authorId) {
//             c.status(403);
//             c.json({ message: "User not authenticated" });
//             return;
//         }

//         if (!c.env.DATABASE_URL) {
//             c.status(500);
//             c.json({ message: "DATABASE_URL is not set" });
//             return;
//         }
//         // const prisma = new PrismaClient({
//         //     datasourceUrl: c.env.DATABASE_URL,
//         // }).$extends(withAccelerate());
//         const prisma = new PrismaClient({
//             datasources: {
//                 db: { url: c.env.DATABASE_URL },
//             },
//         });
//         prisma.$connect()
//         .then(() => console.log('Prisma connected'))
//         .catch((error: unknown) => console.error('Prisma connection error:', error));


//         const post = await prisma.post.create({
//             data: {
//                 title: body.title,
//                 content: body.content,
//                 authorId: Number(authorId)
//             }
//         });

//         return c.json({
//             id: post.id
//         });
//     } catch(error) {
//         console.error("Unhandled error:", error);
//         c.status(500);
//         c.json({ message: "Internal server error" });
//     }
// })
postRouter.post('/', async (c) => {
    try {
        const body = await c.req.json();
        const { success } = createPostsInput.safeParse(body);
        if (!success) {
            c.status(411);
            return c.json({ message: "Invalid input" });
        }

        const authorId = c.get("userId");
        if (!authorId) {
            c.status(403);
            return c.json({ message: "User not authenticated" });
        }

        const prisma = new PrismaClient({
            datasources: {
                db: { url: c.env.DATABASE_URL },
            },
        });

        await prisma.$connect();

        // 1. Normalize tag names (trim + lowercase, or however you define uniqueness)
        const tagNames = body.tagNames?.map((t: string) => t.trim().toLowerCase()) ?? [];

        // 2. Upsert tags (create if they don’t exist)
        const tagConnectOrCreate = tagNames.map((tag: string) => ({
            where: { name: tag },
            create: { name: tag }
        }));

        // 3. Create post with tags
        const post = await prisma.post.create({
            data: {
                title: body.title,
                content: body.content,
                authorId: Number(authorId),
                tags: {
                    connectOrCreate: tagConnectOrCreate
                }
            },
            include: {
                tags: true
            }
        });

        return c.json({ id: post.id, tags: post.tags });
    } catch (error) {
        console.error("Error creating post:", error);
        c.status(500);
        return c.json({ message: "Internal server error" });
    }
});
  
  
postRouter.put('/', async (c) => {
    const body = await c.req.json();
    console.log("Received body:", body);

    const { success } = updatePostInput.safeParse(body);
    if (!success) {
        c.status(411);
        return c.json({ message: "Invalid input" });
    }
    if (!body.id || !body.title || !body.content) {
        return c.json({ message: "Invalid request body" }, 400);
    }

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    // Check if post exists
    const existingPost = await prisma.post.findUnique({
        where: { id: body.id },
    });

    if (!existingPost) {
        c.status(404);
        return c.json({ message: "Post not found" });
    }

    // Update the post
    const updatedPost = await prisma.post.update({
        where: { id: body.id },
        data: { 
            title: body.title, 
            content: body.content
        },
    });

    return c.json({ id: updatedPost.id });
});


postRouter.get('/bulk', authMiddleware, async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const groupBy = c.req.query('groupBy') || 'default';
  const userId = c.get('userId');

  if (!userId) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  let posts;

  if (groupBy === 'user') {
    // Get followed user IDs
    const followedUsers = await prisma.follow.findMany({
      where: {
        followerId: Number(userId)
      },
      select: {
        followingId: true
      }
    });

    const followedUserIds = followedUsers.map(f => f.followingId);

    posts = await prisma.post.findMany({
      where: {
        authorId: {
          in: followedUserIds
        }
      },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        author: {
          select: {
            id: true,
            name: true,
            image: true,
            username: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

  } else if (groupBy === 'tag') {
    // Get followed tag IDs
    const followedTags = await prisma.user.findMany({
      where: {
        id: Number(userId)
      },
      select: {
        followedTags: {
          select: {
            id: true
          }
        }
      }
    });

    const followedTagIds = followedTags.flatMap(t => t.followedTags.map(tag => tag.id));
    // const followedTagIds = followedTags.map(t => t.followedTags.id);

    posts = await prisma.post.findMany({
      where: {
        tags: {
          some: {
            id: {
              in: followedTagIds
            }
          }
        }
      },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        author: {
          select: {
            id: true,
            name: true,
            image: true,
            username: true
          }
        },
        tags: {
          select: {
            name: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

  } else {
    posts = await prisma.post.findMany({
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        author: {
          select: {
            id: true,
            name: true,
            image: true,
            username: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  return c.json({ posts });
});


// postRouter.get('/bulk', async (c) => {
//     const prisma = new PrismaClient({
//         datasourceUrl: c.env.DATABASE_URL,
//     }).$extends(withAccelerate());

//     const groupBy = c.req.query('groupBy') || 'default';

//     let posts;

//     if (groupBy === 'user') {
//         posts = await prisma.post.findMany({
//             select: {
//                 id: true,
//                 title: true,
//                 content: true,
//                 createdAt: true,
//                 author: {
//                     select: {
//                         name: true,
//                         image: true,
//                         username: true
//                     }
//                 }
//             },
//             orderBy: { createdAt: 'desc' }
//         });
//     } else if (groupBy === 'tag') {
//         posts = await prisma.post.findMany({
//             select: {
//                 id: true,
//                 title: true,
//                 content: true,
//                 createdAt: true,
//                 author: {
//                     select: {
//                         name: true,
//                         image: true,
//                         username: true
//                     }
//                 },
//                 tags: {
//                     select: {
//                         name: true
//                     }
//                 }
//             },
//             orderBy: { createdAt: 'desc' }
//         });
//     } else {
//         posts = await prisma.post.findMany({
//             select: {
//                 id: true,
//                 title: true,
//                 content: true,
//                 createdAt: true,
//                 author: {
//                     select: {
//                         name: true,
//                         image: true,
//                         username: true
//                     }
//                 }
//             },
//             orderBy: { createdAt: 'desc' }
//         });
//     }

//     return c.json({ posts });
// });

// Showing all posts by all users with pagination
// postRouter.get('/bulk', async (c) => {
//     const prisma = new PrismaClient({
//         datasourceUrl: c.env.DATABASE_URL,
//     }).$extends(withAccelerate());

//     const authorId = c.get("userId");
//     const page = Number(c.req.query('page') || 1); // Default to page 1
//     const limit = Number(c.req.query('limit') || 10); // Default to 10 posts per page
//     const skip = (page - 1) * limit; // Calculate the number of posts to skip

//     try {
//         // Fetch paginated posts
//         const posts = await prisma.post.findMany({
//             select: {
//                 content: true,
//                 title: true,
//                 id: true,
//                 author: {
//                     select: {
//                         name: true
//                     }
//                 }
//             },
//             skip, // Skip posts for pagination
//             take: limit, // Limit the number of posts
//         });

//         // Get total number of posts for pagination metadata
//         const totalPosts = await prisma.post.count();

//         return c.json({
//             posts,
//             pagination: {
//                 totalPosts,
//                 totalPages: Math.ceil(totalPosts / limit),
//                 currentPage: page,
//                 limit,
//             },
//         });
//     } catch (error) {
//         console.error("Error fetching posts:", error);
//         return c.json({ message: "Error fetching posts" }, 500);
//     }
// });


//add pagination at this 
//showing all the posts by all the user 
// postRouter.get('/bulk', async (c) => {
//     const prisma = new PrismaClient({
//         datasourceUrl: c.env.DATABASE_URL,
//       }).$extends(withAccelerate())
//     const authorId = c.get("userId")

//     const posts = await prisma.post.findMany({
//         select: {
//             content: true,
//             title: true,
//             id: true,
//             author: {
//                 select: {
//                     name: true,
//                     image: true, 
//                     username: true
//                 }
//             }
//         },
//         orderBy: { createdAt: 'desc' }, // because late time means it is the latest post
//     });
//     //for manipulating the size of the post image 
//     // const posts = receivedposts.map(post => ({
//     //     ...post,
//     //     content: `${post.content}?w=600&h=600&fit=crop`,
//     // }));
//     return c.json({
//         posts,
//     })
// })

//to get into the depth of a particular post
//this will handle the stories data too

postRouter.get('/:id', async (c) => {
    const id = await c.req.param("id");
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    const authorId = c.get("userId") 

    try {
        const post = await prisma.post.findFirst({
            select: {
                content: true,
                title: true,
                id: true,
                author: {
                    select: {
                        id: true,
                        username: true,
                        name: true,
                        image: true,
                    }
                }
            },
            where: {
                id: Number(id),
                // AuthorId: String(authorId)
            }
        })
        return c.json({
            post
        })
    }
    catch (e) {
        console.log(e);
        c.status(411) 
        return c.json({
            message: "error while fetching the posts"
        })
    }
})

postRouter.delete('/:id', async (c) => {
    try {
        const id = parseInt(c.req.param('id'), 10);

        if (isNaN(id)) {
            return c.json({ message: "Invalid post ID" }, 400);
        }

        const prisma = new PrismaClient({
            datasources: {
                db: { url: c.env.DATABASE_URL },
            },
        });

        await prisma.$connect();

        const deletedPost = await prisma.post.delete({
            where: { id },
        });

        return c.json({ message: "Post deleted successfully", deletedPost });
    } catch (error) {
        console.error("Error deleting post:", error);
        return c.json({ message: "Error while deleting post" }, 500);
    }
});

// POST /api/v1/posts/:id/like
postRouter.post('/:id/like', async (c) => {
    const userId = c.get("userId");
    const postId = Number(c.req.param('id'));
  
    const prisma = new PrismaClient({ datasources: { db: { url: c.env.DATABASE_URL } } });
  
    const existing = await prisma.like.findUnique({
      where: { userId_postId: { userId, postId } }
    });
  
    let liked: boolean;
  
    if (existing) {
      await prisma.like.delete({
        where: { userId_postId: { userId, postId } }
      });
      liked = false;
    } else {
      await prisma.like.create({
        data: { userId, postId }
      });
      liked = true;
    }
  
    const likeCount = await prisma.like.count({
      where: { postId }
    });
  
    return c.json({ success: true, liked, likeCount });
  });
  
// POST /api/posts/:id/save
postRouter.post('/:id/save', async (c) => {
    const userId = c.get("userId")
    const postId = Number(c.req.param('id'))
  
    const prisma = new PrismaClient({ datasources: { db: { url: c.env.DATABASE_URL } } })
  
    const existing = await prisma.save.findUnique({
      where: { userId_postId: { userId, postId } }
    })
  
    if (existing) {
      await prisma.save.delete({ where: { id: existing.id } })
    } else {
      await prisma.save.create({ data: { userId, postId } })
    }
  
    return c.json({ success: true })
  })
  

//   postRouter.get('/:id/status', async (c) => {
//     const userId = c.get("userId");
//     const postId = Number(c.req.param("id"));
  
//     const prisma = new PrismaClient({
//       datasources: {
//         db: { url: c.env.DATABASE_URL },
//       },
//     });
  
//     const liked = await prisma.like.findUnique({
//       where: { userId_postId: { userId, postId } },
//     });
  
//     const saved = await prisma.save.findUnique({
//       where: { userId_postId: { userId, postId } },
//     });
  
//     const likeCount = await prisma.like.count({
//       where: { postId },
//     });
  
//     return c.json({
//       liked: !!liked,
//       saved: !!saved,
//       likeCount,
//     });
//   });
  