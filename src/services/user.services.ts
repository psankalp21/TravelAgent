import { addBooking, endJourney, get_booking, startJourney, viewBookings, getJourneyStatus, remBooking } from "../entities/bookings.entity";
import { filterTaxibyCapacity, filterTaxibyCategory } from "../entities/taxi.entity";
import Boom from "boom";
import axios from "axios";
import { createClient } from "redis";
import Session from "../database/models/session.model";

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
                'X-RapidAPI-Key': 'Replace with key',
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

        try {
            const response = await axios.request(options);

            const data_res = response.data.route.car;
            const distance = parseFloat(data_res.distance).toFixed(1);
            const drn = parseFloat(data_res.duration).toFixed(1);
            const duration = ((data_res.drn) / 3600).toString();

            if (distance == "0")
                throw Boom.badRequest('Invalid Source or Destination');
            const user = await addBooking(user_id, source, destination, distance, duration, taxi_id, journey_date);
            return user;
        }
        catch (error) {
            console.error(error);
            throw Boom.internal("An internal error occurred");
        }
    }
    static async cancel_booking(user_id, booking_id) {
        try {
            const user = await remBooking(user_id, booking_id);
            return user;
        } catch (error) {
            console.error(error);
            throw Boom.badRequest("Failed to cancel booking");
        }
    }

    static async start_journey(booking_id) {
        try {
            const journey = await getJourneyStatus(booking_id);
            if (journey === null)
                return 0
            else if (journey.journey_status === 'canceled' || journey.journey_status === 'completed' || journey.journey_status === 'ongoing') {
                return 1
            }
            await startJourney(booking_id);
            return 2;
        } catch (error) {
            console.error(error);
            throw Boom.internal("An internal error occurred while starting the journey");
        }
    }

    static async end_journey(booking_id: number) {
        try {
            const journey = await getJourneyStatus(booking_id);
            console.log(journey);

            if (journey === null) {
                return 0
            } else if (journey.journey_status === 'canceled' || journey.journey_status === 'completed' || journey.journey_status === 'scheduled') {
                return 1
            }

            return 2;
        } catch (error) {
            console.error("Error in end_journey:", error);
            throw Boom.internal("An internal error occurred while ending the journey");
        }
    }

    static async view_bookings(user_id) {
        try {
            const user = await viewBookings(user_id);
            return user;
        }
        catch (error) {
            console.error(error);
            throw Boom.internal("An internal error occurred");
        }
    }

    static async get_booking(booking_id) {
        try {
            const booking = await get_booking(booking_id);
            return booking;
        }
        catch (error) {
            console.error(error);
            throw Boom.internal("An internal error occurred");
        }
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
