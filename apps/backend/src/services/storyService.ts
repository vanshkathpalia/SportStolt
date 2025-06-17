import { z } from "zod";
import axios from "axios";
import { getPrisma } from "~/lib/prismaClient";
import { Context } from "hono";

export const createStoryInput = z.object({
  locationImage: z.string().min(1, 'Image URL is required'),
  images: z.array(z.number()).optional(),
  isViewed: z.boolean().optional(),
  location: z.string().min(1, 'Location is required'),
  description: z.string().optional(),
  participants: z.number().optional().default(0),
  sport: z.string().min(1, 'Sport type is required'),
  stadium: z.string().optional(),
  swipeUpEnabled: z.boolean().optional(),
  image: z.string().url("Image must be a valid URL"),
  activityStarted: z.string(),
  activityEnded: z.string(),
});

async function fetchLocationImage(location: string): Promise<string | null> {
  const API_KEY = 'HumkAY45IhFQNjKoq50xxWo1b619Te5RmwhC9Ti0O8Bx09tdBS2hPxOp';
  try {
    const res = await axios.get(`https://api.pexels.com/v1/search?query=${encodeURIComponent(location)}&per_page=1`, {
      headers: { Authorization: API_KEY },
    });
    return res.data?.photos?.[0]?.src?.large || null;
  } catch (err) {
    console.error("Fetch location image failed:", err);
    return null;
  }
}

export async function createStory(c: Context, body: unknown) {
  const parseResult = createStoryInput.safeParse(body);
  if (!parseResult.success) {
    c.status(400);
    return { message: "Invalid input", errors: parseResult.error.errors };
  }

  const data = parseResult.data;
  const prisma = getPrisma(c.env.DATABASE_URL);
  const userId = c.get("userId");

  const today = new Date();
  const datePart = today.toISOString().split('T')[0];
  const start = new Date(`${datePart}T${data.activityStarted}`);
  const end = new Date(`${datePart}T${data.activityEnded}`);

  if (end <= start) {
    c.status(400);
    return { message: "Activity End time must be after start time" };
  }

  const expiry = new Date(end.getTime() + 60 * 60 * 1000);

  const existing = await prisma.story.findFirst({
    where: {
      isArchived: false,
      location: data.location,
      sport: data.sport,
      stadium: data.stadium || "",
      authorId: userId,
      activityStarted: start,
      activityEnded: end,
    },
  });

  let story = existing;
  if (!story) {
    const locationImage = await fetchLocationImage(data.location);
    story = await prisma.story.create({
      data: {
        location: data.location,
        sport: data.sport,
        stadium: data.stadium || "",
        description: data.description,
        authorId: userId,
        authenticityStatus: "pending",
        duration: 60,
        activityStarted: start,
        activityEnded: end,
        endTime: expiry,
        swipeUpEnabled: true,
        participants: data.participants,
        rating: 0,
        verificationCount: 0,
        rewardStatus: "pending",
        isViewed: false,
        rewardAmount: null,
        locationImage,
      }
    });
  }

  const img = await prisma.storyimages.create({
    data: {
      url: data.image,
      storyId: story.id,
      userId,
      authenticityChecked: false,
      verifiedBy: [],
    }
  });

  return {
    message: existing ? "Existing story found, added image." : "New story created.",
    story,
    storyImage: img,
  };
}

export async function fetchStories(c: Context) {
  const prisma = getPrisma(c.env.DATABASE_URL);
  const userId = c.get("userId");
  const filterBy = c.req.query("filterBy");
  const utcNow = new Date();

  const whereClause: any = { isArchived: false };

  if (filterBy) {
    const prefs = await prisma.userPreference.findUnique({
      where: { userId },
      select: { preferredSports: true, preferredLocations: true },
    });

    if (filterBy === "location" && prefs?.preferredLocations?.length) {
      whereClause.location = { in: prefs.preferredLocations, mode: "insensitive" };
    }
    if (filterBy === "sport" && prefs?.preferredSports?.length) {
      whereClause.sport = { in: prefs.preferredSports, mode: "insensitive" };
    }
  }

  const stories = await prisma.story.findMany({
    where: whereClause,
    select: {
      id: true, location: true, sport: true, locationImage: true, createdAt: true,
      activityStarted: true, activityEnded: true, endTime: true, description: true,
      stadium: true, swipeUpEnabled: true, participants: true, authenticityStatus: true,
      Storyimages: { select: { id: true, url: true, userId: true } },
      author: { select: { id: true, username: true, image: true } },
      StoryView: userId ? { where: { userId }, select: { id: true } } : false,
    },
    orderBy: [{ activityStarted: "asc" }, { activityEnded: "asc" }],
  });

  const activeStories = stories.filter(story => new Date(story.endTime) > utcNow)
    .map(story => ({ ...story, isViewed: story.StoryView?.length > 0 }));

  activeStories.sort((a, b) => {
    const sA = new Date(a.activityStarted).getTime();
    const sB = new Date(b.activityStarted).getTime();
    if (sA !== sB) return sA - sB;
    return a.isViewed ? 1 : -1;
  });

  return { stories: activeStories };
}

export async function getPoints(c: Context) {
  const prisma = getPrisma(c.env.DATABASE_URL);
  const userId = c.get("userId");
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { points: true },
  });
  return { points: user?.points ?? 0 };
}
