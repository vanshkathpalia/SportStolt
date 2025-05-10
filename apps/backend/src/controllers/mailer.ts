import { Hono } from 'hono';
import nodemailer from 'nodemailer';
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { google } from 'googleapis';
import { authMiddleware } from '../middleware/authMiddleware';

export const trainingRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string;
        JWT_SECRET: string;
        YOUTUBE_API_KEY: string;
        YOUTUBE_CLIENT_ID: string;
        YOUTUBE_CLIENT_SECRET: string;
        YOUTUBE_REDIRECT_URI: string;
    },
    Variables: {
        userId: number;
    }
}>();

trainingRouter.use('/*', authMiddleware);

trainingRouter.post('/fetch-playlist', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    
    try {
        const { name, email, sportName, skillLevel, keywords } = await c.req.json();
        console.log("Received data:", { name, email, sportName, skillLevel, keywords });

        // Check if the playlist is already in the database
        const existingPlaylist = await prisma.playlist.findFirst({
            where: { sportName, skillLevel, keywords },
        });

        let playlistLink = '';

        if (existingPlaylist) {
            console.log("Using cached playlist.");
            playlistLink = existingPlaylist.link;
        } else {
            console.log("Fetching new playlist from YouTube.");

            // const oauth2Client = new google.auth.OAuth2(
            //     c.env.YOUTUBE_CLIENT_ID,
            //     c.env.YOUTUBE_CLIENT_SECRET,
            //     'urn:ietf:wg:oauth:2.0:oob'
            // );

            const youtube = google.youtube({
                version: 'v3',
                auth: c.env.YOUTUBE_API_KEY,
            });

            const response = await youtube.search.list({
                part: ['snippet'],
                q: `${sportName} ${skillLevel} ${keywords}`,
                type: ['video'],
                maxResults: 10,
            });

            playlistLink = response.data.items?.map(
                (item) => `https://www.youtube.com/watch?v=${item.id?.videoId}`
            ).join('<br>') || "No videos found";

            // Store the new playlist in the database
            await prisma.playlist.create({
                data: {
                    sportName,
                    skillLevel,
                    keywords,
                    link: playlistLink,
                },
            });
        }

        // Send email (secure credentials via environment variables)
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: "noreply.sportstolt@gmail.com", // Use environment variables
                pass: "vsalxnxrhpkajcea", // Use environment variables
            },
        });

        const mailOptions = {
            from: "noreply.sportstolt@gmail.com",
            to: email,
            subject: `Your ${sportName} Tutorials`,
            html: TEMPLATE_SPORTS_PLAYLIST(name, sportName, playlistLink),
        };

        await transporter.sendMail(mailOptions);
        return c.json({ message: 'Email sent successfully.' }, 200);
    } catch (error) {
        console.error('Error sending training email:', error);
        c.status(500);
        return c.json({ message: 'Failed to send email.' }, 500);
    }
});

export const TEMPLATE_SPORTS_PLAYLIST = (userName: string, sportName: string, playlistLink: string): string => {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${sportName} Tutorial Playlist</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: Arial, sans-serif; line-height: 1.6; margin: 20px; }
            p { margin-bottom: 10px; }
            a { color: #3498db; text-decoration: none; }
        </style>
    </head>
    <body>
        <p>Dear ${userName},</p>
        <p>Thank you for your interest in learning ${sportName}. Here is the tutorial playlist we have curated for you:</p>
        <p><a href="${playlistLink}" target="_blank">Watch ${sportName} Tutorials</a></p>
        <p>We hope you find it helpful. Happy learning!</p>
        <p>Regards,</p>
        <p>Sports Tutorials Team</p>
    </body>
    </html>`;
};
