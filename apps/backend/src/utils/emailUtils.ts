import dotenv from 'dotenv';
dotenv.config();

export async function sendMail(to: string, subject: string, html: string, from: string) {
  // const RESEND_API_KEY = process.env.RESEND_API_KEY || '';

  // console.log('API Key:', process.env.RESEND_API_KEY);

  // if (!RESEND_API_KEY) {
  //   throw new Error('RESEND_API_KEY is not defined');
  // }

  const RESEND_API_KEY = 're_Z6a5fdkG_KuPHLQ2cGuKD7Y7FsH9M1BpR';

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      // noreply.sportstolt@gmail.com'
      // no-reply@sportstolt.com
      // from: process.env.RESEND_SENDER_EMAIL || 'noreply.sportstolt@gmail.com',
      // from: 'yourname@yourdomain.com',  // ✅ Must match verified sender in Resend
      from: 'onboarding@resend.dev',
      to,
      subject,
      html,
    }),
  });

  if (!response.ok) {
    const err = await response.json();
    console.error("Resend error:", err);
    throw new Error(`Email send failed: ${err.message}`);
  }

  return await response.json();
}

// // utils/emailUtils.ts
// // common for signup, signin and training emails
// import nodemailer from 'nodemailer';
// import { smtpConfig } from '../config/smtpConfig';


// export async function sendMail(to: string, subject: string, html: string) {
//   const transporter = nodemailer.createTransport(smtpConfig);

//   await transporter.sendMail({
//     from: smtpConfig.auth.user,
//     to,
//     subject,
//     html,
//   });
// }
