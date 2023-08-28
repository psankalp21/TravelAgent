import { addBooking, endJourney, get_booking, startJourney, viewBookings, getJourneyStatus, remBooking } from "../entities/bookings.entity";
import { filterTaxibyCapacity, filterTaxibyCategory } from "../entities/taxi.entity";
import Boom from "boom";
import axios from "axios";
import { createClient } from "redis";
import Session from "../database/models/session.model";
import { BookingE } from "../entities/booking.base";

const client = createClient();
client.on('error', err => console.log('Redis Client Error', err));
client.connect();

export class booking_managment {
    static async add_booking(user_id: number, source: string, destination: string, taxi_id: string, journey_date: string, journey_time: string) {
        const options = {
            method: 'POST',
            url: 'https://distanceto.p.rapidapi.com/distance/route',
            params: { car: 'true' },
            headers: {
                'content-type': 'application/json',
                'X-RapidAPI-Key': 'b9caf1cca2msh9228a609241864fp18a502jsne626318a2d92',
                'X-RapidAPI-Host': 'distanceto.p.rapidapi.com',
            },
            data: {
                route: [
                    {
                        country: 'IN',
                        name: source,
                    },
                    {
                        country: 'IN',
                        name: destination,
                    },
                ],
            },
        };
        const response = await axios.request(options);
        const data_res = response.data.route.car;
        const distance = parseFloat(data_res.distance).toFixed(1);
        const drn = parseFloat((data_res.duration).toFixed(1));
        const duration = drn / 3600;
        if (distance == "0")
            throw Boom.badRequest('Invalid Source or Destination');
        const user = await BookingE.addBooking(user_id, source, destination, distance, duration, taxi_id, journey_date);
        return
    }

    static async cancel_booking(user_id, booking_id) {
        const user = await BookingE.removeBooking(booking_id,user_id);
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
