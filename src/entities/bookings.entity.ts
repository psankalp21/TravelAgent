import { Booking } from "../database/models/booking.model"
import Boom from "boom";

export async function addBooking(user_id, source, destination, distance, duration, taxi_id, start_date) {
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



export async function isTaxiAvaiable(taxi_id, start_date) {
    const avaiable = await Booking.findOne({ where: { taxi_id: taxi_id, journey_date: start_date } })
    if (avaiable == null)
        return 0
    else
        return 1

}


export async function assign_driver(agent_id, booking_id, driver_id) {

    const booking = await Booking.findOne({ where: { id: booking_id } })
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

export async function get_pending_bookings() {

    const bookings = await Booking.findAll({ where: { booking_status: "pending" } });
    return bookings

}
export async function get_all_bookings() {
    const bookings = await Booking.findAll();
    return bookings

}
export async function get_booking(booking_id) {

    const bookings = await Booking.findOne({ where: { id: booking_id } });
    if (!bookings)
        throw Boom.notFound('Booking not found', { errorCode: 'BOOKING_NOT_FOUND' });
    return bookings

}

export async function remBooking(user_id, booking_id) {

    const booking = await Booking.findOne({ where: { id: booking_id, user_id: user_id } });
    if (!booking)
        throw Boom.notFound('Booking not found', { errorCode: 'BOOKING_NOT_FOUND' });

    if (booking.booking_status == "pending")
        throw Boom.badRequest('You can only cancel booking if it is not scheduled or ongoing', { errorCode: 'BAD_REQUEST' });

    booking.destroy();
    return

}

export async function ifDriverAvailable(booking_id, driver_id) {
    const user_booking = await Booking.findOne({ where: { id: booking_id } });
    if (!user_booking)
        throw Boom.notFound('Booking not found', { errorCode: 'BOOKING_NOT_FOUND' });
    const driver_booking = await Booking.findAll({
        where: {
            journey_date: user_booking.journey_date,
            driver_id: driver_id
        }
    });
    if (driver_booking.length > 0)
        throw Boom.badRequest('Driver not available', { errorCode: 'DRIVER_NOT_AVAILABLE' });
    return
}

export async function viewBookings(user_id) {
    const bookings = await Booking.findAll({ where: { user_id: user_id } });
    return bookings
}

export async function getJourneyStatus(id) {
    const bookings = await Booking.findOne({ where: { id: id } });
    return bookings

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
