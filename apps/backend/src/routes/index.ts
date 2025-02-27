import { Hono } from 'hono'
import { userRouter } from '../controller/user';
import { postRouter } from '../controller/post';
import { storyRouter } from '../controller/story'
import { searchRouter } from '../controller/search'
import { cors } from 'hono/cors'
import { apiPostRouter } from '../controller/apiPost';
import { eventRouter } from '../controller/event';
import { PrismaClient } from '@prisma/client/edge'

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  }
}>();

app.use('/*', cors())
app.route("/api/v1/user", userRouter);
app.route("/api/v1/post", postRouter);
app.route("api/v1/story", storyRouter);
app.route("api/v1/apiPost", apiPostRouter);
app.route("api/v1/event", eventRouter);
app.route("api/v1/search", searchRouter);

// setInterval(async () => {
//   const prisma = new PrismaClient({ datasourceUrl: process.env.DATABASE_URL });

//   try {
//       const deletedStories = await prisma.story.deleteMany({
//           where: { endTime: { lt: new Date() } },
//       });

//       if (deletedStories.count > 0) {
//           console.log(`Deleted ${deletedStories.count} expired stories.`);
//       }
//   } catch (error) {
//       console.error("Error deleting expired stories:", error);
//   } finally {
//       await prisma.$disconnect();
//   }
// }, 60 * 1000); // Run every minute


export default app

