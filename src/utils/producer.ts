import amqp from 'amqplib';

class producer {
    async sendToQueue(queue, data) {
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();
        const queueName = queue;
        await channel.assertQueue(queueName, { durable: true });
        channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)), { persistent: true });
        await channel.close();
        await connection.close();
    }
}

export const Producer = new producer();
