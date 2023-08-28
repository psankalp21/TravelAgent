import BaseEntity from "./base.entity";
import { Booking } from '../database/models/booking.model'
import Boom from "boom";

class BookingEntity extends BaseEntity {
    constructor() {
        super(Booking);
    }

    

    async addBooking(user_id, source, destination, distance, duration, taxi_id, journey_date) {
        let payload = { user_id:user_id, source:source, destination:destination, distance:distance, duration:duration, taxi_id:taxi_id, journey_date:journey_date }
        let data = await this.create(payload)
        return data;
    }

    async removeBooking(booking_id,user_id) {
        let condition = { id: booking_id,user_id:user_id };
        let dataToDelete = await this.findOne(condition);
        if (!dataToDelete)
            throw Boom.notFound(`Booking with ID ${booking_id} not found`);
        await this.destroy(dataToDelete);
        return dataToDelete;
    }

    async ifDriverExists(driver_id) {
        let condition = { driver_id: driver_id }
        let data = await this.findOne(condition)
        return data;
    }

    async ifDriverAvailable(id, driver_id) {
        let driver = await this.findOne({ id })
        console.log("driverrrrrr:::",driver.journey_date)
        if (!driver)
            throw Boom.badRequest("Driver Not Found")
        let condition = { driver_id: driver_id, journey_date:driver.journey_date }
        let data = await this.findAllcondition(condition)
        if (data)
            throw Boom.badRequest("Driver not available")
        return data
    }

    async assignDriver(id,agent_id,driver_id)
    {
        let condition = { id:id }
        let update = {driver_id:driver_id,agent_id:agent_id}
        return await this.update(update,condition)
    }

    async getPendingBookings()
    {
        let condition = { booking_status:"pending"}
        return await this.findAllcondition(condition)
    }

    async getJourneyStatus(id)
    {
        let condition = { id:id}
        return await this.findOne(condition)
    }
    async startJourney(id)
    {
        let condition = { id:id}
        let update = {journey_status:"ongoing"}
        return await this.update(update,condition)
    }
    async endJourney(id)
    {
        let condition = { id:id}
        let update = {journey_status:"completed"}
        return await this.update(update,condition)
    }
    async getAllBookings()
    {
        return await this.findAll()
    }
    async UserFetchBookings(user_id)
    {
        let condition = {user_id:user_id}
        return await this.findAllcondition(condition)
    }
    async FetchBookingByID(booking_id)
    {
        let condition = {id:booking_id}
        return await this.findAllcondition(condition)
    }
}


export const BookingE = new BookingEntity();


