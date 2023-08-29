import { Op } from "sequelize";
import { Taxi } from "../database/models/taxi.model"
import { Booking } from "../database/models/booking.model";
import Boom from "boom";


export async function filterTaxibyCapacity(capacity, fuel_type, journey_date) {
    try {
        const availableTaxis = await Taxi.findAll({
            attributes: ['id', 'model', 'capacity', 'category', 'fuel_type'],
            include: [
                {
                    model: Booking,
                    attributes: [],
                    required: false,
                    where: {
                        journey_date: journey_date,
                    },
                },
            ],
            where: {
                '$Bookings.taxi_id$': {
                    [Op.eq]: null,
                },
                capacity: {
                    [Op.gte]: capacity,
                },
                fuel_type: fuel_type,
            },
        });

        return availableTaxis;
    } catch (error) {
        console.error(error);
        throw Boom.internal('An internal error occurred while fetching available taxis');
    }
}


export async function filterTaxibyCategory(category, fuel_type, journey_date) {
    try {
        const availableTaxis = await Taxi.findAll({
            attributes: ['id', 'model', 'capacity', 'category', 'fuel_type'],
            include: [
                {
                    model: Booking,
                    attributes: [],
                    required: false,
                    where: {
                        journey_date: journey_date,
                        booking_status: 'accepted',
                    },
                },
            ],
            where: {
                '$Bookings.taxi_id$': {
                    [Op.eq]: null,
                },
                category: {
                    [Op.gte]: category,
                },
                fuel_type: fuel_type,
            },
        });

        return availableTaxis;
    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
}
