import 'dotenv/config';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

interface Send {
  email: string;
  subject: string;
  html: string;
}

export function send({ email, subject, html }: Send) {
  return transporter.sendMail({
    to: email,
    subject,
    html,
  });
}

export function sendActivationEmail(email: string, token: string) {
  const href = `${process.env.CLIENT_URL}/activate/${token}`;

  const html = `
  <h1>Активируйте свой аккаунт</h1>
  <a href="${href}">${href}</a>
  `;

  send({ email, html, subject: 'Activate' });
}

export function sendResetPasswordEmail(email: string, token: string) {
  const href = `${process.env.CLIENT_URL}/reset/${token}`;

  const html = `
  <h1>Сбросить пароль</h1>
  <a href="${href}">${href}</a>
  `;

  send({ email, html, subject: 'Reset Password' });
}

export const emailService = {
  send,
  sendActivationEmail,
  sendResetPasswordEmail,
};
