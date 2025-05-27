import { Context } from 'hono';
import { sendTrainingEmail } from '../services/trainingService';
import { PrismaClient } from '@prisma/client/edge';

// const prisma = new PrismaClient();

// this code is used in services and we have common prisma for all the services 

// this was error
const getPrisma = (c: Context) =>
  new PrismaClient({ datasources: { db: { url: c.env.DATABASE_URL } } });

export const fetchAndSendPlaylist = async (c: Context) => {
  try {

    const prisma = getPrisma(c);
    
    // Extract only user data from the request body
    const { userName, userEmail, sportName, skillLevel, keywords } = await c.req.json();
    const body = await c.req.json();
    if (!userEmail || !userName) {
      console.log(body);
      console.error("Missing email or name");
      return c.json({ error: "Missing required fields" }, 400);
    }

    // Pass the API key from environment bindings
    const apiKey = c.env.YOUTUBE_API_KEY;
    const resendSenderEmail = c.env.RESEND_MAIL_EMAIL;

    const dburl = c.env.DATABASE_URL;

    // console.log('API Key:', apiKey);  
    // console.log('Resend Sender Email:', resendSenderEmail);
 
    // This is a service function that handles the email sending logic
    await sendTrainingEmail(dburl, userName, userEmail, sportName, skillLevel, keywords, apiKey, resendSenderEmail);

    return c.json({ message: 'Email sent successfully.' }, 200);
  } catch (error) {
    console.error("Error in fetchAndSendPlaylist:", error);
    console.error('Controller Error:', error);
    return c.json({ message: 'Failed to send email.' }, 500);
  }
};


// // controllers/trainingController.ts
// import { Context } from 'hono';
// import { sendTrainingEmail } from '../services/trainingService';

// export const fetchAndSendPlaylist = async (c: Context) => {
//   try {
//     const { name, email, sportName, skillLevel, keywords, process.env.YOUTUBE_API_KEY} = await c.req.json();
//     await sendTrainingEmail(name, email, sportName, skillLevel, keywords);
//     return c.json({ message: 'Email sent successfully.' }, 200);
//   } catch (error) {
//     console.error('Controller Error:', error);
//     return c.json({ message: 'Failed to send email.' }, 500);
//   }
// };


// import { Context } from 'hono';
// import { sendTrainingEmail } from '../Services/trainingService';


// export async function fetchPlaylistHandler(c: Context) {
//   try {
//     const { name, email, sportName, skillLevel, keywords } = await c.req.json();

//     await sendTrainingEmail(name, email, sportName, skillLevel, keywords);

//     return c.json({ message: 'Email sent successfully.' }, 200);
//   } catch (error) {
//     console.error('Error sending training email:', error);
//     return c.json({ message: 'Failed to send email.' }, 500);
//   }
// }
