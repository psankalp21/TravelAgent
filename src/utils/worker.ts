import amqp from 'amqplib';
import { sendRecipient } from './emailSender'; 
import { generateRecipientPDF } from './pdfGenerator';

class MessageQueue {
    async sendToQueue(queue, data) {
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();
        const queueName = queue;
        await channel.assertQueue(queueName, { durable: true });
        channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)), { persistent: true });
        await channel.close();
        await connection.close();
    }

    async startConsumer() {
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();
        const queueName = 'booking_queue';
        await channel.assertQueue(queueName, { durable: true });
        channel.consume(queueName, async (message) => {
            const bookingData = JSON.parse(message.content.toString());
            const pdfBuffer = await generateRecipientPDF(bookingData);
            // await uploadPDFToGoogleDrive();
            await sendRecipient(bookingData.email, pdfBuffer);
            channel.ack(message);
        });
    }
}

export const messageQueue = new MessageQueue();
