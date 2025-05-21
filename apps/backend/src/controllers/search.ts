import axios from "axios";
import { Hono } from "hono";
import { cors } from 'hono/cors';

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

searchRouter.get('/images', async (c: any) => {
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

