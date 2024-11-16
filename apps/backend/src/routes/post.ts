import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { verify } from 'hono/jwt'
import { createPostInput, updatePostInput } from '@vanshkathpalia/sportstolt-common'
import { z } from "zod"

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
        userId: string;
    }
}>();

//for authentication, hitting as a middleware... code comming here before any of the other route is hitted
postRouter.use('/*', async (c, next) => {
    const authHeader = c.req.header("authorization") || "";
    const user = await verify(authHeader, c.env.JWT_SECRET)
    if (user && typeof user.id === "string") {
        c.set("userId", user.id);
        await next();
    }
    else {
        c.status(403);
        c.json({
            message: "you are not logged in"
        })
    }
});

 
postRouter.post('/', async (c) => {
    // console.log('Incoming request:', c.req.method, c.req.url);
    try {
        const body = await c.req.json();
        console.log('Request body:', body);
        console.log('createPostInput:', createPostsInput);

        const { success } = createPostsInput.safeParse(body); //deprop (success) which we do in library 
            if(!success) {
            c.status(411);
            return c.json({
                message: "invalid"
            })
        }
        // const result = createPostsInput.safeParse(body);
        // if (!result.success) {
        //     console.error("Validation error:", result.error);
        //     c.status(411);
        //     c.json({ message: "Invalid input" });
        //     return;
        // }

        const authorId = c.get("userId");
        if (!authorId) {
            c.status(403);
            c.json({ message: "User not authenticated" });
            return;
        }

        if (!c.env.DATABASE_URL) {
            c.status(500);
            c.json({ message: "DATABASE_URL is not set" });
            return;
        }
        // const prisma = new PrismaClient({
        //     datasourceUrl: c.env.DATABASE_URL,
        // }).$extends(withAccelerate());
        const prisma = new PrismaClient({
            datasources: {
                db: { url: c.env.DATABASE_URL },
            },
        });
        // prisma.$connect()
        // .then(() => console.log('Prisma connected'))
        // .catch((error) => console.error('Prisma connection error:', error));


        const post = await prisma.post.create({
            data: {
                title: body.title,
                content: body.content,
                authorId: String(authorId),
            }
        })

        return c.json({
            id: post.id
        });
    } catch(error) {
        console.error("Unhandled error:", error);
        c.status(500);
        c.json({ message: "Internal server error" });
    }
})
  
  
postRouter.put('/', async (c) => {
    const body = await c.req.json();

    const { success } = updatePostInput.safeParse(body);
    if(!success) {
      c.status(411);
      return c.json({
        message: "invalid"
      })
    }

    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const post = await prisma.post.update({
        where: {
            id: body.id
        },
        data: {
            title: body.title,
            content: body.content
        }
    })

    return c.json({
        id: post.id
    })
})
  

//add pagination at this 
postRouter.get('/bulk', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
      }).$extends(withAccelerate())
    const authorId = c.get("userId")

    const posts = await prisma.post.findMany({
        where: {
            authorId: String(authorId)
        }
    });

    return c.json({
        posts,
    })
})

  
postRouter.get('/:id', async (c) => {
    const id = await c.req.param("id");
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    const authorId = c.get("userId") 

    try {
        const post = await prisma.post.findFirst({
            where: {
                id: Number(id),
                authorId: String(authorId)
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

  
