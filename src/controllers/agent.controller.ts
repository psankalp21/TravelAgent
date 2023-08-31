import { Request, ResponseToolkit } from '@hapi/hapi';
import { agent_booking_services, driver_managment, logout_service, taxi_managment } from '../services/agent.services';
import dotenv from 'dotenv';
dotenv.config();
const PORT = process.env.PORT || 4000;

export class driver_managment_controller {
    static async add_driver(request: Request, h: ResponseToolkit) {
        const { name, dob,email, phone, available } = <any>request.payload;
        await driver_managment.registerDriver(name, email,dob, phone, available);
        return h.response({
            "Message": "Driver Added Successfully!"
        }).code(201);
    }

    static async fetch_driver(request: Request, h: ResponseToolkit) {
        const result = await driver_managment.fetchDrivers();
        return h.response(result).code(201);
    }

    static async remove_driver(request: Request, h: ResponseToolkit) {
        const { driver_id } = <any>request.query;
        await driver_managment.removeDrivers(driver_id);
        return h.response({ "Message:": "Driver details removed" }).code(201);
    }

    static async toggle_driver_availability(request: Request, h: ResponseToolkit) {
        const { driver_id } = <any>request.query;
        const status = await driver_managment.toggleDriverStatus(driver_id);
        return h.response({ "Message:": `Driver marked as ${status}` }).code(201);
    }
}

export class taxi_management_controller {
    static async add_taxi(request: Request, h: ResponseToolkit) {
        const { id, model, category, capacity, fuel_type } = <any>request.payload;
        await taxi_managment.addNewTaxi(id, model, category, capacity, fuel_type);
        return h.response({
            "Message": "Taxi Added Successfully!"
        }).code(201);

    }

    static async fetch_taxi(request: Request, h: ResponseToolkit) {
        const result = await taxi_managment.fetchTaxis();
        return h.response(result).code(201);

    }

    static async remove_taxi(request: Request, h: ResponseToolkit) {
        const { taxi_id } = <any>request.query;
        await taxi_managment.removeTaxi(taxi_id);
        return h.response({ "Message:": "Taxi details removed" }).code(201);

    }

    static async toggle_taxi_status(request: Request, h: ResponseToolkit) {
        const { taxi_id } = <any>request.payload;
        const result = await taxi_managment.toggle_taxi_status(taxi_id);
        if (result == 1)
            return h.response({ "Message:": "Taxi status updated to Unavailable" }).code(201);
        else if (result == 2)
            return h.response({ "Message:": "Taxi status updated to Available" }).code(201);
    }
}

export class agent_booking_controller {
    static async get_all_bookings(request: Request, h: ResponseToolkit) {
        const booking = await agent_booking_services.getAllBookings()
        return h.response({ "Message": booking }).code(201);

    }

    static async get_pending_bookings(request: Request, h: ResponseToolkit) {
        const booking = await agent_booking_services.getPendingBookings()
        return h.response({ "Message": booking }).code(201);

    }

    static async accept_booking(request: Request, h: ResponseToolkit) {
        const agent_id = request.headers.aid;
        const { booking_id, driver_id } = <any>request.payload;
        await agent_booking_services.acceptBooking(agent_id, booking_id, driver_id)
        return h.response({ "Message": `Bookings accepted, Driver Assigned` }).code(201);
    }

    static async reject_booking(request: Request, h: ResponseToolkit) {
        const { id } = <any>request.query;
        await agent_booking_services.rejectBooking(id)
        return h.response({ "Message": `Booking Rejected for ${id}` }).code(201);
    }

}

export class agent_logout_controller {
    static async agent_logout(request: Request, h: ResponseToolkit) {
        const ipAddress = request.info.remoteAddress;
        const agent_id = request.headers.aid;
        await logout_service.agent_logout(agent_id, ipAddress);
        return h.response({
            "Message": "Agent logout success"
        }).code(201);

    }

}