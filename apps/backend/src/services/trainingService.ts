import { sendMail } from '~/utils/emailUtils';
import { getPrisma } from '../lib/prismaClient';  // factory, not singleton

export async function getOrCreatePlaylist(
  env: any,
  sportName: string,
  skillLevel: string,
  keywords: string,
  apiKey: string
) {
  const prisma = getPrisma(env.DATABASE_URL);  // Pass DB URL explicitly

  const existing = await prisma.playlist.findFirst({
    where: { sportName, skillLevel, keywords },
  });

  if (existing) return existing.link;

  // now start, 2nd service (but happens first in the flow) youtube playlist fetch

  const searchQuery = `${sportName} ${skillLevel} ${keywords}`;
  const maxResults = 10;
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
    searchQuery
  )}&type=video&maxResults=${maxResults}&key=${apiKey}`;

  const response = await fetch(url);
  if (!response.ok) {
    const errorText = await response.text();
    console.error('YouTube API Error:', errorText);
    throw new Error('Failed to fetch YouTube playlist.');
  }

  const data = await response.json();

  const playlistLink =
    data.items
      ?.map((item: any) => `https://www.youtube.com/watch?v=${item.id.videoId}`)
      .join('<br>') || 'No videos found';

  await prisma.playlist.create({
    data: { sportName, skillLevel, keywords, link: playlistLink },
  });

  return playlistLink;
}

export const TEMPLATE_SPORTS_PLAYLIST = (
  userName: string,
  sportName: string,
  playlistLink: string
) => `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>${sportName} Tutorials</title></head>
<body>
<p>Dear ${userName},</p>
<p>Thank you for your interest in learning ${sportName}. Here is your tutorial playlist:</p>
<p>${playlistLink}</p>
<p>Happy learning!</p>
</body>
</html>`;


// Called in controller
export async function sendTrainingEmail(
  env: any,
  name: string,
  email: string,
  sportName: string,
  skillLevel: string,
  keywords: string,
  apiKey: string,
  resendSenderEmail: string
) {

  // code upper 
  const playlistLink = await getOrCreatePlaylist(
    env,
    sportName,
    skillLevel,
    keywords,
    apiKey
  );

  const html = TEMPLATE_SPORTS_PLAYLIST(name, sportName, playlistLink);

  await sendMail(email, `Your ${sportName} Tutorials`, html, resendSenderEmail);
  console.log(`Email sent to ${email} with ${sportName} tutorials.`);
  return { message: 'Email sent successfully. Through Resend' };
}


// // services/trainingService.ts
// import { sendMail } from '../utils/emailUtils';
// // import prisma from '../config/prismaClient';
// import { google } from 'googleapis';
// import dotenv from 'dotenv';  
// import prisma from '../config/prismaClient';
// import { PrismaClient } from '@prisma/client/scripts/default-index';
// import { getPrisma } from '../lib/prisma';

// // import { PrismaClient } from '@prisma/client/edge';
// // import { getPrisma } from '~/lib/prisma';
// // import { getPrisma } from '../lib/prisma';

// dotenv.config();


// export async function getOrCreatePlaylist(dburl: string, sportName: string, skillLevel: string, keywords: string, apiKey: string) {

//   const prisma = getPrisma(dburl);

//   // const prisma = getPrisma(dbUrl);
//   // const prisma = new PrismaClient({
//   //     datasources: {
//   //       db: { url: c.env.DATABASE_URL },
//   //     },
//   //   });

//   const existing = await prisma.playlist.findFirst({
//     where: { sportName, skillLevel, keywords },
//   });

//   if (existing) return existing.link;

//   const youtube = google.youtube({
//     version: 'v3',
//     // auth: process.env.YOUTUBE_API_KEY,
//     auth: apiKey,
//   });

//   const response = await youtube.search.list({
//     part: ['snippet'],
//     q: `${sportName} ${skillLevel} ${keywords}`,
//     type: ['video'],
//     maxResults: 10,
//   });

//   const playlistLink = response.data.items
//     ?.map((item) => `https://www.youtube.com/watch?v=${item.id?.videoId}`)
//     .join('<br>') || 'No videos found';

//   await prisma.playlist.create({
//     data: { sportName, skillLevel, keywords, link: playlistLink },
//   });

//   return playlistLink;
// }

// export const TEMPLATE_SPORTS_PLAYLIST = (userName: string, sportName: string, playlistLink: string) => `
// <!DOCTYPE html>
// <html lang="en">
// <head><meta charset="UTF-8"><title>${sportName} Tutorials</title></head>
// <body>
// <p>Dear ${userName},</p>
// <p>Thank you for your interest in learning ${sportName}. Here is your tutorial playlist:</p>
// <p>${playlistLink}</p>
// <p>Happy learning!</p>
// </body>
// </html>`;

// export async function sendTrainingEmail(dburl: string, name: string, email: string, sportName: string, skillLevel: string, keywords: string, apiKey: string, resendSenderEmail: string) {

//   // using service to get or create playlist
//   const playlistLink = await getOrCreatePlaylist(dburl, sportName, skillLevel, keywords, apiKey);

//   // joining was we get from searching form youtube
//   const html = TEMPLATE_SPORTS_PLAYLIST(name, sportName, playlistLink);

//   // calling emailUtil
//   await sendMail(email, `Your ${sportName} Tutorials`, html, resendSenderEmail);
//   console.log(`Email sent to ${email} with ${sportName} tutorials.`);
//   return { message: 'Email sent successfully. Through Resend' };
// }
