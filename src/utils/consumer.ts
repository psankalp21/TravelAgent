// consumer.ts
import amqp from 'amqplib';
import { generateRecipientPDF } from './pdfGenerator';
import { sendRecipient } from './emailSender'; 

const startWorker = async () => {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();

    const queueName = 'booking_queue';
    await channel.assertQueue(queueName, { durable: true });

    channel.consume(queueName, async (message) => {
        const bookingData = JSON.parse(message.content.toString());
        const pdfBuffer = await generateRecipientPDF(bookingData);
        await sendRecipient(bookingData.email, pdfBuffer);

        channel.ack(message);
    });
};

startWorker();
