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
    try {
        const taxi = await Taxi.findOne({ where: { id: id } });
        if (taxi) {
            taxi.destroy();
            return 1
        }
        else
            return 0
    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
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
    try {
        const taxi = await Taxi.findOne({ where: { id: id } });
        if (taxi)
            return taxi.available
        else
            return null
    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
}


export async function set_taxi_status(id, status) {
    try {
        const taxi = await Taxi.findOne({ where: { id: id } });
        taxi.available = status
        taxi.save();

    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
}