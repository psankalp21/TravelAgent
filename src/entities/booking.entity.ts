import BaseEntity from "./base.entity";
import { Booking } from '../database/models/booking.model'
import Boom from "boom";

class BookingEntity extends BaseEntity {
    constructor() {
        super(Booking);
    }



    async addBooking(user_id, source, destination, distance, duration, taxi_id, journey_date) {
        let payload = { user_id: user_id, source: source, destination: destination, distance: distance, duration: duration, taxi_id: taxi_id, journey_date: journey_date }
        let data = await this.create(payload)
        return data;
    }

    async removeBooking(booking_id, user_id) {
        let condition = { id: booking_id, user_id: user_id };
        let booking = await this.findOne(condition);
        if (!booking)
            throw Boom.notFound(`Booking with ID ${booking_id} not found`);
        if (booking.booking_status == "accepted")
            throw Boom.badRequest(`Booking can only be canceled if it is not accepted`);
        else if (booking.booking_status == "rejected")
            throw Boom.badRequest(`Booking can only be canceled if it is not accepted`);

        if (!booking)
            throw Boom.notFound(`Confirmed booking can be canceled`);
        await this.destroy(booking);
        return booking;
    }

    async ifDriverExists(driver_id) {
        let condition = { driver_id: driver_id }
        let data = await this.findOne(condition)
        return data;
    }

    async ifDriverAvailable(id, driver_id) {
        let driver = await this.findOne({ id })
        if (!driver)
            throw Boom.badRequest("Driver Not Found")
        let condition = { driver_id: driver_id, journey_date: driver.journey_date }
        let data = await this.findAllcondition(condition)
        if (data.length > 0)
            throw Boom.badRequest("Driver not available")
        return data
    }

    async assignDriver(id, agent_id, driver_id) {
        let condition = { id: id }
        let update = { driver_id: driver_id, agent_id: agent_id, journey_status: "scheduled", booking_status: "accepted" }
        return await this.update(update, condition)
    }

    async getPendingBookings() {
        let condition = { booking_status: "pending" }
        return await this.findAllcondition(condition)
    }

    async getJourneyStatus(id) {
        let condition = { id: id }
        return await this.findOne(condition)
    }
    async startJourney(id) {
        let condition = { id: id }
        let update = { journey_status: "ongoing" }
        return await this.update(update, condition)
    }
    async endJourney(id) {
        let condition = { id: id }
        let update = { journey_status: "completed" }
        return await this.update(update, condition)
    }
    async getAllBookings() {
        return await this.findAll()
    }
    async UserFetchBookings(user_id) {
        let condition = { user_id: user_id }
        return await this.findAllcondition(condition)
    }
    async FetchBookingByID(booking_id) {
        let condition = { id: booking_id }
        return await this.findOne(condition)
    }
    async fetchBookingAvailability(taxi_id, journey_date) {
        let condition = { taxi_id: taxi_id, journey_date: journey_date }
        return await this.findOne(condition)
    }
    async rejectBooking(id) {
        let condition = {id:id}
        let payload = {journey_status:"canceled",booking_status:"rejected"}
        return await this.update(payload,condition)
    }

}


export const BookingE = new BookingEntity();


