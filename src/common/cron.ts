import cron from 'node-cron';
import { Booking } from '../database/models/booking.model';
import { sendEmail } from '../utils/emailSender';
import { UserE } from '../entities/user.entity';
import { DriverE } from '../entities/driver.entity';

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
            for (const booking of pendingBookings) {
                const user = await UserE.fetchUserById(booking.user_id);
                const driver = await DriverE.fetchDriverById(booking.driver_id);

                const userEmail = user.email;
                const driverEmail = driver.email;
                const subject = 'Reservation Reminder';
                const text = 'You have a reservation in 2 Hours';
                sendEmail(userEmail, subject, text);
                sendEmail(driverEmail, subject, text);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });
};

export { startScheduler };
