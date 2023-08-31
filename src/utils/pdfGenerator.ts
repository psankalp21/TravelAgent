import PDFDocument from 'pdfkit';

const generateRecipientPDF = async (bookingData: any): Promise<Buffer> => {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument();

        const buffers: Buffer[] = [];
        doc.on('data', (chunk) => buffers.push(chunk));
        doc.on('end', () => {
            const pdfBuffer = Buffer.concat(buffers);
            resolve(pdfBuffer);
        });

        doc.fontSize(20).text('Booking Details', { align: 'center' });

        const tableRows = [
            ['Name:', bookingData.user_name],
            ['Source:', bookingData.source],
            ['Destination:', bookingData.destination],
            ['Duration:', bookingData.duration],
            ['Distance:', bookingData.distance],
            ['Driver:', bookingData.driver],
            ['Expected Fare:', bookingData.expected_fare],
            ['Agent Name:', bookingData.agent_name],
            ['Journey Status:', bookingData.journey_status],
            ['Booking Status:', bookingData.booking_status]
        ];

        const startX = 50;
        const startY = 100;
        const lineHeight = 20;

        tableRows.forEach((row, rowIndex) => {
            const [label, value] = row;
            doc.text(label, startX, startY + rowIndex * lineHeight);
            doc.text(value, startX + 150, startY + rowIndex * lineHeight);
        });

        doc.end();
    });
};

export { generateRecipientPDF };
