import { filterTaxibyCapacity, filterTaxibyCategory } from "../entities/filter.entity";
import Boom from "boom";
import axios from "axios";
import { createClient } from "redis";
import Session from "../database/models/session.model";
import { BookingE } from "../entities/booking.entity";
import { sendEmail } from "../utils/emailSender";
import { distance_api } from "../common/distanceapi";
import { UserE } from "../entities/user.entity";

const client = createClient();
client.on('error', err => console.log('Redis Client Error', err));
client.connect();

export class booking_managment {
    static async add_booking(user_id: number, source: string, destination: string, taxi_id: string, journey_date: Date, journey_time: string) {
       
        const data = await distance_api(source,destination);
        const distance = data.distance;
        const duration = data.duration;

        if (distance == "0" )
            throw Boom.badRequest('Invalid Source or Destination');
        const checkBooking = await BookingE.fetchBookingAvailability(taxi_id, journey_date)
        if (checkBooking)
            throw Boom.badRequest(`Taxi not avaiable for ${journey_date}`);
        const user = await UserE.fetchUserById(user_id)
        const booking = await BookingE.addBooking(user_id, source, destination, distance, duration, taxi_id, journey_date);
        const subject = "Booking request has been added"
        const text = `Dear ${user.name}, You have made a booking for a journey on ${journey_date}. Your booking request is currently is queue and will be soon processed by our agent. Please use booking id: ${booking.id} to track it`
        await sendEmail(user.email,subject,text)
        return
    }

    static async check_fare(source,destination) {
        const data = await distance_api(source, destination);
        const fare = (parseFloat(data.distance)*15)
        return fare
    }

    static async cancel_booking(user_id, booking_id) {
        const user = await BookingE.removeBooking(booking_id, user_id);
        return
    }

    static async start_journey(booking_id) {
        const journey = await BookingE.getJourneyStatus(booking_id);
        console.log(journey)
        if (!journey)
            throw Boom.notFound("Journey Not Found")
        else if (journey.journey_status === 'canceled' || journey.journey_status === 'completed' || journey.journey_status === 'ongoing' || journey.journey_status === null)
            throw Boom.badRequest("Invalid Action")
        await BookingE.startJourney(booking_id);
        return;
    }

    static async end_journey(booking_id: number) {
        const journey = await BookingE.getJourneyStatus(booking_id);
        console.log(journey);
        if (!journey)
            throw Boom.notFound("Journey Not Found")
        else if (journey.journey_status === 'canceled' || journey.journey_status === 'completed' || journey.journey_status === 'scheduled' || journey.journey_status === null)
            throw Boom.badRequest("Invalid Action")
        return;
    }

    static async view_bookings(user_id) {
        const user = await BookingE.UserFetchBookings(user_id);
        if (!user)
            throw Boom.notFound("No bookings found");
        return user;
    }

    static async get_booking(booking_id) {
        const booking = await BookingE.FetchBookingByID(booking_id);
        if (!booking)
            throw Boom.notFound("Booking not found");
        return booking;
    }
}

export class user_taxi_service {
    static async getTaxi(capacity, category, fuel_type, journey_date) {
        try {
            if (capacity == null)
                return await filterTaxibyCategory(category, fuel_type, fuel_type)
            else if (category == null)
                return await filterTaxibyCapacity(capacity, fuel_type, journey_date)
        }
        catch (error) {
            console.error(error);
            throw Boom.internal("An internal error occurred");
        }
    }
}
export class logout_service {
    static async user_logout(user_id, ip) {
        try {
            const key = `${user_id}_${ip}`;
            await client.hSet(key, {
                'user_id': `${user_id}`,
                'ip_address': `${ip}`,
                'session': 'inactive'
            });
            const session = await Session.findByPk(key)
            if (session) {
                if (session.active == "active") {
                    session.active = "not active"
                    session.save();
                    return 1
                }
                else {
                    throw Boom.badRequest("You are already loggedout");

                }
            }
            else {
                throw Boom.badRequest("Session doesnot Exists");
            }

        }
        catch (error) {
            console.error(error);
            throw Boom.internal("An internal error occurred");
        }
    }
}
