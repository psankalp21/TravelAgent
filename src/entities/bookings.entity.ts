import { Booking } from "../database/models/booking.model"
import Boom from "boom";

export async function addBooking(user_id, source, destination, distance, duration, taxi_id, start_date) {

    try {
        const user = await Booking.create({
            user_id: user_id,
            source: source,
            destination: destination,
            duration: duration,
            distance: distance,
            taxi_id: taxi_id,
            journey_date: start_date,
        });
        return user;
    }
    catch (error) {
        console.error(error);
        throw Boom.internal("An internal error occurred");
    }
}



export async function isTaxiAvaiable (taxi_id, start_date) {

    try {
        const avaiable = await Booking.findOne({where:{taxi_id:taxi_id,journey_date:start_date}})
        if(avaiable==null)
            return 0
        else
            return 1
    }
    catch (error) {
        console.error(error);
        throw Boom.internal("An internal error occurred");
    }
}


export async function assign_driver(agent_id, booking_id, driver_id) {
    try {
        const booking = await Booking.findOne({ where: { id: booking_id } })
        // console.log(booking)
        if (booking) {
            booking.driver_id = driver_id;
            booking.journey_status = 'scheduled';
            booking.booking_status = 'accepted';
            booking.agent_id = agent_id;
            booking.save()
            return booking;

        }
        else
            return null


    }
    catch (error) {
        console.error(error);
        throw Boom.internal("An internal error occurred ");
    }

}

export async function get_pending_bookings() {
    try {
        const bookings = await Booking.findAll({ where: { booking_status: "pending" } });
        return bookings
    } catch (error) {
        console.error(error);
        throw Boom.internal("An internal error occurred");
    }
}
export async function get_all_bookings() {
    try {
        const bookings = await Booking.findAll();
        return bookings
    } catch (error) {
        console.error(error);
        throw Boom.internal("An internal error occurred");
    }
}
export async function get_booking(booking_id) {
    try {
        const bookings = await Booking.findOne({ where: { id: booking_id } });
        return bookings
    } catch (error) {
        console.error(error);
        throw Boom.internal("An internal error occurred");
    }
}

export async function remBooking(user_id, booking_id) {
    try {
        const booking = await Booking.findOne({ where: { id: booking_id, user_id: user_id } });
        if (booking.booking_status == "pending") {
            booking.destroy();
            return 1
        }
        else if (booking.booking_status == "accepted" || booking.booking_status == "rejected")
            return 2
        else
            return 0
    } catch (error) {
        console.error(error);
        throw Boom.internal("An internal error occurred");
    }
}

export async function ifDriverAvailable(booking_id, driver_id) {


    const user_booking = await Booking.findOne({ where: { id: booking_id } });
    console.log(user_booking)
    const driver_booking = await Booking.findAll({
        where: {
            journey_date: user_booking.journey_date,
            driver_id: driver_id
        }
    });
    if (driver_booking.length == 0) {
        return true
    }

    return false
}


export async function viewBookings(user_id) {
    try {
        const bookings = await Booking.findAll({ where: { user_id: user_id } });
        return bookings
    } catch (error) {
        console.error(error);
        throw Boom.internal("An internal error occurred ");
    }
}
export async function getJourneyStatus(id) {
    try {
        const bookings = await Booking.findOne({ where: { id: id } });
        return bookings
    } catch (error) {
        console.error(error);
        throw Boom.internal("An internal error occurred ");
    }
}

export async function startJourney(id) {

    const bookings = await Booking.findOne({ where: { id: id } });
    if (bookings) {
        bookings.journey_status = "ongoing";
        bookings.save()
        return bookings
    }
    else {
        return null
    }

}
export async function endJourney(id) {

    const bookings = await Booking.findOne({ where: { id: id } });
    if (bookings) {
        bookings.journey_status = "completed";
        bookings.save()
        return bookings
    }
    else {
        return null
    }

}
