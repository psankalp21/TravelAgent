import cron from 'node-cron';
import { Booking } from '../database/models/booking.model';
import { sendEmail } from './emailSender';
import { UserE } from '../entities/user.entity';
import { DriverE } from '../entities/driver.entity';
import { generateOTP } from './generateotp';
import { createClient } from 'redis';
const client = createClient();
client.on('error', err => console.log('Redis Client Error', err));
client.connect();


const startScheduler = () => {
    cron.schedule('* * * * *', async () => {
        try {
            const currentTime = new Date();
            const timeInIST = new Date(currentTime.getTime() + (5.5 * 60 * 60 * 1000));
            const reminderTime = new Date(timeInIST.getTime() + 2 * 60 * 60 * 1000);
            const pendingBookings = await Booking.findAll({
                where: {
                    journey_date: reminderTime,
                    booking_status: 'accepted',
                },
            });
            console.log(pendingBookings)
            for (const booking of pendingBookings) {
                const user = await UserE.fetchUserById(booking.user_id);
                const driver = await DriverE.fetchDriverById(booking.driver_id);
                const otp = await generateOTP();
                const userEmail = user.email;
                const driverEmail = driver.email;
                const subject = 'Reservation Reminder';
                const user_text = 'You have a reservation in 2 Hours';
                const driver_text = `You have a reservation in 2 Hours. Kindly share the following OTP: ${otp} with you passenger to start the journey.`;
                await client.set(`jouneyOTP_${user.email}`, otp);
                await client.expire(`journeyOTP_${user.email}`, 14400);
                await sendEmail(userEmail, subject, user_text);
                await sendEmail(driverEmail, subject, driver_text);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });
};

export { startScheduler };
