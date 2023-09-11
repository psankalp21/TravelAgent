import amqp from 'amqplib';
import { sendRecipient } from './emailSender'; 

// import {uploadPDFToGoogleDrive} from '../utils/gdrive'
import { generateRecipientPDF } from './pdfGenerator';

const startWorker = async () => {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();

    const queueName = 'booking_queue';
    await channel.assertQueue(queueName, { durable: true });

    channel.consume(queueName, async (message) => {
        // const pdfFilePath = '/home/user/Desktop/Travel_Agent/data.pdf';
        const bookingData = JSON.parse(message.content.toString());
        const pdfBuffer = await generateRecipientPDF(bookingData);
        await sendRecipient(bookingData.email, pdfBuffer);
        // await uploadPDFToGoogleDrive(pdfFilePath,userAccessToken)
        channel.ack(message);
    });
};

startWorker();
