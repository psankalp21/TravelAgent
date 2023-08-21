import { Request, ResponseToolkit } from '@hapi/hapi';
import { agent_booking_services, driver_managment, logout_service, taxi_managment } from '../services/agent.services';

import dotenv from 'dotenv';

dotenv.config();
const PORT = process.env.PORT || 4000;

export class driver_managment_controller {
    static async add_driver(request: Request, h: ResponseToolkit) {
        try {
            const { name, dob, phone, available } = <any>request.payload;
            const result = await driver_managment.registerDriver(name, dob, phone, available);

            if (result == 1) {
                return h.response({
                    "Message": "Driver Added Successfully!"
                }).code(201);
            } else if (result == 0) {
                return h.response({
                    "Message": "Duplicate entry for phone number",
                }).code(409);
            }
        } catch (error) {
            console.error(error);
            return h.response({ "Message:": error }).code(500)
        }
    }

    static async fetch_driver(request: Request, h: ResponseToolkit) {
        try {
            const result = await driver_managment.fetchDrivers();
            if (result)
                return h.response(result).code(201);
            else
                return h.response({
                    "Message": "No entry for driver",
                }).code(404);

        } catch (error) {
            console.error(error);
            return h.response({ "Message:": error }).code(500)
        }
    }

    static async remove_driver(request: Request, h: ResponseToolkit) {
        try {
            const { driver_id } = <any>request.query;
            const result = await driver_managment.removeDrivers(driver_id);
            if (result == 1)
                return h.response({ "Message:": "Driver details removed" }).code(201);
            else
                return h.response({
                    "Message": `No entry for driver exists for ${driver_id}`,
                    "Action": ` To get all entries goto : http://localhost:${PORT}/getDrivers`
                }).code(404);

        } catch (error) {
            console.error(error);
            return h.response({ "Message:": error }).code(500)
        }
    }

    // static async get_avaiable_driver(request: Request, h: ResponseToolkit) {
    //     try {
    //         const {booking_id}= <any>request.query;
    //         const result = await driver_managment.get_available_drivers(booking_id);
    //         if (result)
    //             return h.response(result).code(201);
    //         else
    //             return h.response({
    //                 "Message": "No driver avaiable to the timeslot",
    //             }).code(404);

    //     } catch (error) {
    //         console.error(error);
    //         return h.response({ "Message:": "Something went wrong" }).code(500)
    //     }
    // }
   
}




export class taxi_management_controller {
    static async add_taxi(request: Request, h: ResponseToolkit) {
        try {
            const { id, model, category, capacity, fuel_type, available } = <any>request.payload;
            const result = await taxi_managment.addNewTaxi(id, model, category, capacity, fuel_type, available);

            if (result == 1) {
                return h.response({
                    "Message": "Taxi Added Successfully!"
                }).code(201);
            } else if (result == 2) {
                return h.response({
                    "Message": "This car is already registered!",
                }).code(409);
            }
        } catch (error) {
            console.error(error);
            return h.response({ "Message:": error }).code(500)
        }
    }

    static async fetch_taxi(request: Request, h: ResponseToolkit) {
        try {
            const result = await taxi_managment.fetchTaxis();
            if (result)
                return h.response(result).code(201);
            else
                return h.response({
                    "Message": "No entry for taxi",
                }).code(404);

        } catch (error) {
            console.error(error);
            return h.response({ "Message:": error }).code(500)
        }
    }

    static async remove_taxi(request: Request, h: ResponseToolkit) {
        try {
            const { taxi_id } = <any>request.payload;
            const result = await taxi_managment.removeTaxi(taxi_id);
            if (result == 1)
                return h.response({ "Message:": "Taxi details removed" }).code(201);
            else
                return h.response({
                    "Message": `No entry for taxi exists for ${taxi_id}`,
                    "Action": ` To get all entries goto : http://localhost:${PORT}/getTaxiDetails`
                }).code(404);

        } catch (error) {
            console.error(error);
            return h.response({ "Message:": error }).code(500)
        }
    }

    static async toggle_taxi_status(request: Request, h: ResponseToolkit) {
        try {
            const { taxi_id } = <any>request.payload;
            const result = await taxi_managment.toggle_taxi_status(taxi_id);
            if (result == 1)
                return h.response({ "Message:": "Taxi status updated to Unavailable" }).code(201);
            else if (result == 2)
                return h.response({ "Message:": "Taxi status updated to Available" }).code(201);
            else if (result==0)
                return h.response({
                    "Message": `No entry for taxi exists for ${taxi_id}`,
                    "Action": ` To get all entries goto : http://localhost:${PORT}/getTaxiDetails`
                }).code(404);

        } catch (error) {
            console.error(error);
            return h.response({ "Message:": error }).code(500)
        }
    }

}


export class agent_booking_controller {
    static async get_all_bookings(request: Request, h: ResponseToolkit) {
        try {
            const booking = await agent_booking_services.getAllBookings()
            if (booking)
                return h.response({ "Message": booking }).code(201);
            else
                return h.response({ "Message": `No such record found` }).code(404);
        }
        catch (error) {
            console.log(error)
            return h.response({ "Message": error}).code(500);

        }
    }
    static async get_pending_bookings(request: Request, h: ResponseToolkit) {
        try {
            const booking = await agent_booking_services.getPendingBookings()
            if (booking)
                return h.response({ "Message": booking }).code(201);
            else
                return h.response({ "Message": `No such record found` }).code(404);
        }
        catch (error) {
            console.log(error)
            return h.response({ "Message": error }).code(500);

        }
    }

    static async accept_booking(request: Request, h: ResponseToolkit) {
        try {
            const agent_id = request.headers.aid;
            const { booking_id, driver_id } = <any>request.payload;
            const booking = await agent_booking_services.acceptBooking(agent_id,booking_id, driver_id)
            if (booking == 1)
                return h.response({ "Message": `Bookings accepted, Driver Assigned` }).code(201);
            else if (booking ==2 )
                return h.response({ "Message": `Driver not available for selected slot` }).code(400);
        }
        catch (error) {
            console.log(error)
            return h.response({ "Message": error }).code(500);

        }
    }
}



export class agent_logout_controller {
    static async agent_logout(request: Request, h: ResponseToolkit) {
        try {
            const ipAddress = request.info.remoteAddress;
            const agent_id = request.headers.aid;
            const agent = await logout_service.agent_logout(agent_id,ipAddress);

            if (agent==1) {
                return h.response({
                    "Message": "Agent logout success"
                }).code(201);
            } else {
                return h.response({
                    "Message": "Already logged out",
                }).code(409);
            }
        } catch (error) {
            console.error(error);
            return h.response({ "Message:": error }).code(500)
        }
    }

}