import { IntegerDataType, Op } from "sequelize";
import { Taxi } from "../database/models/taxi.model"
import { Booking } from "../database/models/booking.model";
import Boom from "boom";


export async function ifTaxiNumberExists(id: string) {
    const user = await Taxi.findOne({ where: { id: id } })
    if (user)
        return true
    else
        return false
}

export async function addTaxi(id: string, model: string, category: string, capacity: number, fuel_type: string, available: boolean) {
    try {
        const taxi = await Taxi.create({
            id,
            model,
            category,
            capacity,
            fuel_type,
            available: true
        });
        return taxi;
    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
}


export async function remTaxi(id) {
    const taxi = await Taxi.findOne({ where: { id: id } });
    if (!taxi)
        throw Boom.notFound('Taxi not found', { errorCode: 'TAXI_NOT_FOUND' });
    taxi.destroy();
    return
}


export async function getTaxi() {
    try {
        const taxi = await Taxi.findAll();
        return taxi
    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
}



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
                        // booking_status: 'accepted',
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

export async function get_taxi_status(id) {
    const taxi = await Taxi.findOne({ where: { id: id } });
    if (!taxi)
        throw Boom.notFound('Taxi not found', { errorCode: 'TAXI_NOT_FOUND' });
    return taxi.available
}

export async function set_taxi_status(id, status) {
    const taxi = await Taxi.findOne({ where: { id: id } });
    taxi.available = status
    taxi.save();
}