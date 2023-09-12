import puppeteer, { Browser, Page } from 'puppeteer';

interface BookingData {
    user_name: string;
    source: string;
    destination: string;
    duration: string;
    distance: string;
    driver: string;
    driver_contact: string
    expected_fare: string;
    agent_name: string;
    agent_contact: string;
    journey_status: string;
    booking_status: string;
}

const generateRecipientPDF = async (bookingData: BookingData): Promise<Buffer> => {
    const browser: Browser = await puppeteer.launch();
    const page: Page = await browser.newPage();

    const contentHTML: string = `
        <html>
            <head>
                <title>Booking Details</title>
            </head>
            <body>
                <h1 style="text-align: center;">Booking Details</h1>
                <table>
                    <tr>
                        <td>Name:</td>
                        <td>${bookingData.user_name}</td>
                    </tr>
                    <tr>
                        <td>Source:</td>
                        <td>${bookingData.source}</td>
                    </tr>
                    <tr>
                        <td>Destination:</td>
                        <td>${bookingData.destination}</td>
                    </tr>
                    <tr>
                        <td>Duration:</td>
                        <td>${bookingData.duration}</td>
                    </tr>
                    <tr>
                        <td>Distance:</td>
                        <td>${bookingData.distance}</td>
                    </tr>
                    <tr>
                        <td>Driver:</td>
                        <td>${bookingData.driver}</td>
                    </tr>
                    <tr>
                    <td>Driver Contact:</td>
                    <td>${bookingData.driver_contact}</td>
                </tr>
                    <tr>
                        <td>Expected Fare:</td>
                        <td>${bookingData.expected_fare}</td>
                    </tr>
                    <tr>
                        <td>Agent Name:</td>
                        <td>${bookingData.agent_name}</td>
                    </tr>
                    <tr>
                    <td>Agent Contact:</td>
                    <td>${bookingData.agent_contact}</td>
                </tr>
                    <tr>
                        <td>Journey Status:</td>
                        <td>${bookingData.journey_status}</td>
                    </tr>
                    <tr>
                        <td>Booking Status:</td>
                        <td>${bookingData.booking_status}</td>
                    </tr>
                    <!-- Add more rows for other booking data -->
                </table>
            </body>
        </html>
    `;

    await page.setContent(contentHTML);

    const pdfBuffer: Buffer = await page.pdf({
        format: 'A4',
        printBackground: true,
    });

    await browser.close();
    return pdfBuffer;
};

export { generateRecipientPDF };
