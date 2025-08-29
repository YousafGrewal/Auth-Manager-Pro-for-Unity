import nodemailer from 'nodemailer';

export const sendEmail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT || 587),
    secure: false,
    auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS }
  });

  const info = await transporter.sendMail({
    from: process.env.MAIL_FROM || 'noreply@example.com',
    to,
    subject,
    html
  });

  return info.messageId;
};
