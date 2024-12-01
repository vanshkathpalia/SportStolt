import { Hono } from 'hono'
import { userRouter } from '../controller/user';
import { postRouter } from '../controller/post';
import { storyRouter } from '../controller/story'
import { cors } from 'hono/cors'
import { apiPostRouter } from '../controller/apiPost';
import { eventRouter } from '../controller/event';

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


export default app

