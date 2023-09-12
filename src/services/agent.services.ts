import { createClient } from "redis";
import Boom from "boom";
import { DriverE } from "../entities/driver.entity";
import { TaxiE } from "../entities/taxi.entity";
import { BookingE } from "../entities/booking.entity";
import { UserE } from "../entities/user.entity";
import { AgentE } from "../entities/agent.entity";
import { CategoryE } from "../entities/category.entity";
import {messageQueue} from "../utils/worker"
import { ReviewE } from "../entities/review.entity";
const client = createClient();
client.on('error', err => console.log('Redis Client Error', err));
client.connect();

export class driver_managment {
    static async registerDriver(name: string, email: string, dob: string, phone: string, available: boolean) {
        const driver = await DriverE.ifPhoneExists(phone);
        if (driver)
            throw Boom.conflict('Phone number already associated with a driver', { errorCode: 'PHONE_EXISTS' });
        await DriverE.addDriver(name, email, dob, phone, available)
        return
    }

    static async toggleDriverStatus(id: number) {
        const driver = await DriverE.fetchDriverById(id);
        if (!driver)
            throw Boom.notFound('No such driver', { errorCode: 'DRIVER_NOT_FOUND' });

        if (driver.available == true) {
            driver.available = false
            driver.save();
            return ("Unavailable");
        }
        else {
            driver.available = true
            driver.save();
            return ("Available")
        }
    }

    static async fetchDrivers() {
        const driver = await DriverE.fetchDrivers();
        if (driver.length == 0)
            throw Boom.notFound('No driver available in database', { errorCode: 'NO_DRIVER_DATA' });
        return driver
    }

    static async removeDrivers(driver_id) {
        const driver = await DriverE.removeDriver(driver_id);
        if (!driver)
            throw Boom.notFound('No such driver', { errorCode: 'DRIVER_NOT_FOUND' });
        return driver
    }
}

export class taxi_managment {
    static async addNewTaxi(id: string, model: string, category: string, capacity: number, fuel_type: string) {
        const taxi = await TaxiE.ifTaxiIdExists(id);
        if (taxi)
            throw Boom.conflict('This taxi already exists', { errorCode: 'TAXI_EXISTS' });
        return await TaxiE.addTaxi(id, model, category, capacity, fuel_type);
    }

    static async fetchTaxis() {
        const taxi = await TaxiE.fetchTaxis();
        return taxi
    }

    static async removeTaxi(taxi_id) {
        const taxi = await TaxiE.removeTaxi(taxi_id);
        return taxi
    }

    static async toggle_taxi_status(taxi_id) {
        const taxi_status = await TaxiE.getTaxiStatus(taxi_id);
        if (taxi_status == true) {
            await TaxiE.updateTaxiStatus(taxi_id, false)
            return 1
        }
        else if (taxi_status == false) {
            await TaxiE.updateTaxiStatus(taxi_id, true)
            return 2
        }
    }
}

export class agent_booking_services {
    static async acceptBooking(agent_id, booking_id, driver_id) {
        const booking = await BookingE.FetchBookingByID(booking_id)
        if (!booking)
            throw Boom.notFound('Booking not found', { errorCode: 'BOOKING_NOT_FOUND' });

        const user = await UserE.fetchUserById(booking.user_id)
        const driver = await DriverE.fetchDriverById(driver_id)
        const agent = await AgentE.fetchAgentById(agent_id)

        await BookingE.ifDriverAvailable(booking_id, driver_id)
        await BookingE.assignDriver(booking_id, agent_id, driver_id)

        const queueName = 'booking_queue';

        const bookingData = {
            email: user.email,
            user_name: user.name,
            source: booking.source,
            destination: booking.destination,
            duration: `${booking.duration} Hrs`,
            distance: `${booking.distance} Kms`,
            driver: driver.name,
            driver_contact : driver.phone,
            expected_fare: `INR ${booking.estimated_fare} `,
            agent_name: agent.name,
            agent_contact: agent.phone,
            journey_status: "Scheduled",
            booking_status: "Accepted",
        };

        messageQueue.sendToQueue(queueName, bookingData)
        return
    }

    static async getPendingBookings() {
        const booking = await BookingE.getPendingBookings()
        if (booking.length == 0)
            throw Boom.notFound('Booking not found', { errorCode: 'BOOKING_NOT_FOUND' });
        return booking
    }

    static async getAllBookings() {
        const booking = await BookingE.getAllBookings()
        if (booking.length == 0)
            throw Boom.notFound('Booking not found', { errorCode: 'BOOKING_NOT_FOUND' });
        return booking
    }

    static async rejectBooking(id) {
        const booking = await BookingE.FetchBookingByID(id)
        if (!booking)
            throw Boom.notFound('Booking not found', { errorCode: 'BOOKING_NOT_FOUND' });
        else if (booking.booking_status == "rejected")
            throw Boom.conflict('Booking is already rejected', { errorCode: 'BOOKING_ALREADY_REJECTED' });
        else if (booking.journey_status == "completed")
            throw Boom.badRequest('Invalid request', { errorCode: 'INVALID_REQUEST' });
        return await BookingE.rejectBooking(id);
    }
}


export class category_service {
    static async addCategory(categoryName, categoryRate) {
        const category = await CategoryE.ifCategoryExists(categoryName);
        if (category)
            throw Boom.conflict('This category already exists', { errorCode: 'CATEGORY_EXISTS' });
        return await CategoryE.addNewCategory(categoryName, categoryRate);
    }

    static async get_all_category() {
        const category = await CategoryE.getAllCategory();
        return category
    }
    static async removeCategory(categoryName) {
        const category = await CategoryE.ifCategoryExists(categoryName);
        if (!category)
            throw Boom.notFound('Category not found', { errorCode: 'CATEGORY_NOT_FOUND' });
        return await CategoryE.removeCategory(categoryName);
    }

    static async updateCategoryRate(categoryName, categoryRate) {
        const category = await CategoryE.ifCategoryExists(categoryName);
        if (!category)
            throw Boom.notFound('Category not found', { errorCode: 'CATEGORY_NOT_FOUND' });
        return await CategoryE.updateCategoryRate(categoryName, categoryRate);
    }

    static async getCategoryRate(categoryName) {
        const category = await CategoryE.ifCategoryExists(categoryName);
        if (!category)
            throw Boom.notFound('Category not found', { errorCode: 'CATEGORY_NOT_FOUND' });
        const data = await CategoryE.getCategoryRate(categoryName);
        return data.categoryRate
    }
}

export class agent_review_service {

    static async getBookingReview(booking_id) {
        const review = await ReviewE.fetchBookingsReview(booking_id);
        if (!review)
            throw Boom.notFound('Review not found', { errorCode: 'REVIEW_NOT_FOUND' });
        return review
    }

    static async getDriverReview(driver_id) {
        const review = await BookingE.getBookingfromDriver(driver_id)
        const bookingIds = review.map((booking) => booking.id);
        const reviews = ReviewE.fetchDriverReview(bookingIds)
        return reviews
    }

    static async getTaxiReview(taxi_id) {
        const review = await BookingE.getBookingfromDriver(taxi_id)
        const bookingIds = review.map((booking) => booking.id);
        const reviews = ReviewE.fetchTaxiReview(bookingIds)
        return reviews
    }

}

export class logout_service {
    static async agent_logout(agent_id, ip) {
        const key = `${agent_id}_${ip}`;
        await client.hSet(key, {
            'agent_id': `${agent_id}`,
            'ip_address': `${ip}`,
            'session': 'inactive'
        });
        return
    }
}