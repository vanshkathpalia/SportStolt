import axios from "axios";
import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge"
import { withAccelerate } from '@prisma/extension-accelerate'
import { cors } from 'hono/cors';
// import { auth } from "googleapis/build/src/apis/abusiveexperiencereport";
import { authMiddleware } from "~/middleware/authMiddleware";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
// import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export const searchRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string;
        JWT_SECRET: string;
      } 
    Variables: {
        userId: number;
    }
}>();

searchRouter.use('*', cors());

// for seeing result in search bar
searchRouter.get('/', authMiddleware, async (c) => {

  const query = c.req.query('q')?.trim() || '';
  if (query.length === 0) {
    return c.json({ users: [], tags: [] });
  }

  // Initialize Prisma client
  const prisma = new PrismaClient({
    datasources: { db: { url: c.env.DATABASE_URL } },
  }).$extends(withAccelerate());

  try {
    const userId = c.get('userId') as number | undefined;
    // Find users matching query
    const users = await prisma.user.findMany({
      where: {
        AND: [
          {
            OR: [
              { username: { contains: query, mode: 'insensitive' } },
              { name: { contains: query, mode: 'insensitive' } },
            ],
          },
          {
            id: { not: userId },  // Exclude the logged-in user here
          },
        ],
      },
      select: {
        id: true,
        username: true,
        image: true,
        name: true,
      },
    });

    // const users = await prisma.user.findMany({
    //   where: {
    //     OR: [
    //       { username: { contains: query, mode: 'insensitive' } },
    //       { name: { contains: query, mode: 'insensitive' } },
    //     ],
    //   },
    //   select: {
    //     id: true,
    //     username: true,
    //     image: true,
    //     name: true,
    //     followedBy: {
    //       where: { followerId: userId || 0 },
    //       select: { id: true }
    //     }
    //   },
    // });

    // const mappedUsers = users.map(user => ({
    //   ...user,
    //   followed: user.followedBy.length > 0
    // }));


    // Find tags matching query by their name
    const tagsMatching = await prisma.tag.findMany({
      where: {
        name: {
          contains: query,
          mode: 'insensitive',
        },
      },
      select: {
        id: true,
        name: true,
      },
    });

    // Get user id from environment or authentication
    let followedTagIds = new Set<number>();

    if (userId) {
      // Fetch tags followed by this user
      const userWithTags = await prisma.user.findUnique({
        where: { id: userId },
        select: { followedTags: { select: { id: true } } },
      });

      followedTagIds = new Set(userWithTags?.followedTags.map((t: { id: number }) => t.id) || []);
    }

    // Map tags to include followed status
    const tags = tagsMatching.map((tag: { id: number; name: string }) => ({
      id: tag.id,
      name: tag.name,
      followed: followedTagIds.has(tag.id),
    }));

    return c.json({ users, tags });
  } catch (error) {
    console.error('Search error:', error);
    return c.json({ error: 'Failed to search' }, 500);
  } finally {
    await prisma.$disconnect();
  }
});

// for frontend to remember followed users and tags
searchRouter.get('/followed', authMiddleware, async (c) => {
  const userId = c.get('userId');
  if (!userId) return c.json({ error: 'Unauthorized' }, 401);

  const prisma = new PrismaClient({
    datasources: { db: { url: c.env.DATABASE_URL } },
  }).$extends(withAccelerate());

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        following: {
          select: {
            followingId: true,
            following: {
              select: {
                id: true,
                username: true,
              },
            },
          },
        },
        followedTags: {
          select: { name: true },
        },
      },
    });

    const followedUsers = user?.following.map((f) => ({
      id: f.following.id,
      username: f.following.username,
    })) || [];

    const followedTags = user?.followedTags.map((tag) => tag.name) || [];

    return c.json({ followedUsers, followedTags });
  } catch (err) {
    console.error('Followed fetch error:', err);
    return c.json({ error: 'Failed to fetch followed data' }, 500);
  }
});

// for frontend to remember followed users and tags
// searchRouter.get('/followed', authMiddleware, async (c) => {
//   const userId = c.get('userId');
//   const prisma = new PrismaClient({ 
//     datasourceUrl: c.env.DATABASE_URL 
//   });

//   try {
//     const user = await prisma.user.findUnique({
//       where: { id: userId },
//       include: {
//         following: {
//           select: { following: { select: { username: true } } },
//         },
//         followedTags: {
//           select: { name: true }, // or whatever field your tag model has
//         },
//       },
//     });

//     return c.json({
//       followedUsers: user?.following.map((f) => f.following.username) || [],
//       followedTags: user?.followedTags.map((tag) => tag.name) || [],
//     });
//   } catch (err) {
//     console.error('Followed fetch error:', err);
//     return c.json({ error: 'Failed to fetch followed data' }, 500);
//   } finally {
//     await prisma.$disconnect();
//   }
// });

// to follow a user
searchRouter.post('/follow/user/:id', authMiddleware, async (c) => {
  console.log("HIT /follow/user/:id route");
  console.log("DB URL:", c.env.DATABASE_URL);
  const followingId = parseInt(c.req.param('id'));
  const followerId = (c.get('userId'));

  if (!followerId || isNaN(followerId)) return c.json({ error: 'Invalid userId' }, 400);

  if (followingId === followerId) {
    return c.json({ error: "You can't follow yourself" }, 400);
  }

  const prisma = new PrismaClient({
    datasources: { db: { url: c.env.DATABASE_URL } },
  });

  const existingFollow = await prisma.follow.findFirst({
    where: {
      followerId,
      followingId
    }
  });

  if (existingFollow) {
    return c.json({ message: 'Already following this user' }, 200);
  }

  try {
    console.log('Trying to follow user', { followerId, followingId });

    await prisma.follow.create({
      data: {
        followerId,
        followingId,
      },
    });
    console.log('Follow request - followerId:', followerId, 'followingId:', followingId);
    return c.json({ message: 'User followed successfully' });
    // return c.json({ success: true });
  } catch (err) {
    const error = err as { code?: string };

    if (error?.code === 'P2002') {
      return c.json({ error: 'Already following' }, 400);
    }

    // console.error('Error in follow route:', JSON.stringify(err, null, 2));

    console.error('Follow error:', err);
    return c.json({ error: 'Failed to follow' }, 500);
  } finally {
    await prisma.$disconnect();
  }
});


// to unfollow a user
searchRouter.delete('/follow/user/:id', authMiddleware, async (c) => {
  const followingId = parseInt(c.req.param('id'));
  const followerId = c.get('userId');

  if (!followerId || isNaN(followingId)) {
    return c.json({ error: 'Invalid request' }, 400);
  }
  // const prisma = new PrismaClient({ datasourceUrl: c.env.DATABASE_URL });
  const prisma = new PrismaClient({
    datasources: { db: { url: c.env.DATABASE_URL } },
  });

  try {
    await prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });

    return c.json({ message: "user unfollowed successfully" });
  } catch (error) {
    console.error('Unfollow error:', error);
    return c.json({ error: 'Failed to unfollow' }, 500);
  } finally {
    await prisma.$disconnect();
  }
});

// to follow a tag
searchRouter.post('/follow/tag/:id', authMiddleware, async (c) => {
  const tagId = parseInt(c.req.param('id'));
  const userId = c.get('userId');

  if (!userId || isNaN(tagId)) {
    return c.json({ error: 'Invalid request' }, 400);
  }

  const prisma = new PrismaClient({
    datasources: { db: { url: c.env.DATABASE_URL } },
  });

  try {
    // Check if already following the tag
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        followedTags: {
          where: { id: tagId }
        }
      }
    });

    // add some other logic for this
    // if (user?.followedTags?.length > 0) {
    //   return c.json({ message: 'Already following this tag' }, 200);
    // }

    await prisma.user.update({
      where: { id: userId },
      data: {
        followedTags: {
          connect: { id: tagId },
        },
      },
    });

    return c.json({ message: 'Tag followed successfully' });

  } catch (err) {
    console.error('Follow tag error:', err);
    return c.json({ error: 'Failed to follow tag' }, 500);
  } finally {
    await prisma.$disconnect();
  }
});


// to unfollow a tag
searchRouter.delete('/follow/tag/:id', authMiddleware, async (c) => {
  const tagId = parseInt(c.req.param('id'));
  const userId = c.get('userId');

  if (!userId || isNaN(tagId)) {
    return c.json({ error: 'Invalid request' }, 400);
  }

  const prisma = new PrismaClient({
    datasources: { db: { url: c.env.DATABASE_URL } },
  });

  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        followedTags: {
          disconnect: { id: tagId },
        },
      },
    });

    return c.json({ message: 'Tag unfollowed successfully' });

  } catch (error) {
    console.error('Unfollow tag error:', error);
    return c.json({ error: 'Failed to unfollow tag' }, 500);
  } finally {
    await prisma.$disconnect();
  }
});



searchRouter.get('/images', authMiddleware, async (c: any) => {
  const API_KEY = 'HumkAY45IhFQNjKoq50xxWo1b619Te5RmwhC9Ti0O8Bx09tdBS2hPxOp';

  const randomPage = Math.floor(Math.random() * 10) + 1; // Random page between 1 and 10
  const pexelsUrl = `https://api.pexels.com/v1/search?query=sports&per_page=12&page=${randomPage}`;

  try {
    const response = await axios.get(pexelsUrl, {
      headers: { Authorization: API_KEY },
    });

    const images = response.data.photos.map((photo: any) => photo.src.large);
    return c.json({ images });
  } catch (error) {
    console.error('Error fetching sports images:', error);
    return c.json({ error: 'Failed to fetch images' }, 500);
  }
});

