import nodemailer from 'nodemailer';
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'fantemyt@gmail.com',
    pass: 'nouuvvuvfieekvcm',
  },
  
});
export async function sendOTPByEmail(email, otp,) {
  try {
    const info = await transporter.sendMail({
      to: email,
      subject: 'Your OTP for Login',
      text: `Your OTP is: ${otp}`,
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
