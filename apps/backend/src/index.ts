import { Hono } from 'hono'
import { userRouter } from './routes/user';
import { postRouter } from './routes/post';
import { storyRouter } from './routes/story'
import { cors } from 'hono/cors'
import { apiPostRouter } from './routes/foreignPost';

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


export default app

