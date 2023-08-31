import nodemailer from 'nodemailer';
import dotenv from "dotenv"

dotenv.config();
const email = process.env.EMAIL_USER;
const pass = process.env.EMAIL_PASSWORD;

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: email,
    pass: pass,
  },
});

export async function sendEmail(email,subject,text) {
  try {
    const info = await transporter.sendMail({
      to: email,
      subject: subject,
      text: text,
    });
    console.log('Message sent: %s', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}


export async function sendRecipient(email, pdfBuffer) {
  try {
    const info = await transporter.sendMail({
      to: email,
      subject: 'Your booking has been accepted',
      text: `Dear User, Your booking has been approved. Kindly refer to the attached pdf for complete details.`,
      attachments: [
        {
          filename: 'booking_details.pdf',
          content: pdfBuffer,
        },
      ],
    });
    console.log('Message sent: %s', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}
