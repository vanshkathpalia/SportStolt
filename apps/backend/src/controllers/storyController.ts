import { Context } from 'hono';
import * as storyService from '~/services/storyService';

export async function createStoryController(c: Context) {
  try {
    const body = await c.req.json();
    const result = await storyService.createStory(c, body);
    return c.json(result);
  } catch (err) {
    console.error("Create Story Error:", err);
    c.status(500);
    return c.json({ message: "Internal server error" });
  }
}

export async function fetchStoriesController(c: Context) {
  try {
    const result = await storyService.fetchStories(c);
    return c.json(result);
  } catch (err) {
    console.error("Fetch Stories Error:", err);
    c.status(500);
    return c.json({ message: "Internal server error" });
  }
}

export async function getPointsController(c: Context) {
  try {
    const result = await storyService.getPoints(c);
    return c.json(result);
  } catch (err) {
    console.error("Get Points Error:", err);
    c.status(500);
    return c.json({ message: "Internal server error" });
  }
}
