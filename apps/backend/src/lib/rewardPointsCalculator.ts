import type { Story, Storyimages } from '@prisma/client';

export async function calculatePointsForStory(story: Story & { Storyimages: Storyimages[], attendees: any[] }) {
  let points = 0;

  // Duration logic
  const durationInHours = (new Date(story.activityEnded).getTime() - new Date(story.activityStarted).getTime()) / (1000 * 60 * 60);
  points += Math.floor(durationInHours * 2); // 2 points per hour

  // Verification logic
  const totalVerifications = story.Storyimages.reduce((acc, img) => acc + img.verificationCount, 0);
  points += totalVerifications * 3;

  // Attendance logic
  points += story.attendees.length * 5;

  // Location or sport-based boosts
  if (story.location.toLowerCase().includes("iit")) points += 10;
  if (story.sport === "Football") points += 5;

  return points;
}
