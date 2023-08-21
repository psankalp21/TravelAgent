import { Request, ResponseToolkit } from '@hapi/hapi';
import { booking_managment, logout_service, user_taxi_service } from '../services/user.services';
import Boom from 'boom';

export class booking_managment_controller {
    static async add_booking(request: Request, h: ResponseToolkit) {
        try {
            const user_id = request.headers.uid
            const { source, destination, taxi_id, journey_date, journey_time } = <any>request.payload;
            const result = await booking_managment.add_booking(user_id, source, destination, taxi_id, journey_date, journey_time);
            // const result = await getDistance(source, destination)
            if (result) {
                return h.response({
                    "Message": "Booking Added Successfully!"
                }).code(201);
            } else {
                return h.response({
                    "Message": "Booking failed",
                }).code(409);
            }
        } catch (error) {
            console.error(error);
            return h.response({ error }).code(500)
        }
    }


    static async view_all_bookings(request: Request, h: ResponseToolkit) {
        try {
            const user_id = request.headers.uid;
            const booking = await booking_managment.view_bookings(user_id);
            if (booking) {
                return h.response({
                    "Message": booking
                }).code(201);
            } else {
                return h.response({
                    "Message": "You have no bookings",
                }).code(409);
            }
        } catch (error) {
            console.error(error);
            return h.response({ "Message:": error }).code(500)
        }
    }
    static async cancel_booking(request: Request, h: ResponseToolkit) {
        try {
            const user_id = request.headers.uid
            const { booking_id } = <any>request.payload;
            const result = await booking_managment.cancel_booking(user_id,booking_id);
            if (result==1) {
                return h.response({
                    "Message": "Success! Booking Canceled."
                }).code(201);
            } else if (result==2) {
                return h.response({
                    "Message": "Failed! Booking is already scheduled or underway.",
                }).code(409);
            }
            else if (result==0) {
                return h.response({
                    "Message": "No such booking found",
                }).code(409);
            }
        } catch (error) {
            console.error(error);
            return h.response({ error }).code(500)
        }
    }
    static async view_one_booking(request: Request, h: ResponseToolkit) {
        try {
            const booking_id = <any>request.query.booking_id;
            const booking = await booking_managment.get_booking(booking_id);

            if (booking) {
                return h.response({
                    "Message": booking
                }).code(201);
            } else {
                return h.response({
                    "Message": `No booking found for ${booking_id}`,
                }).code(404);
            }
        } catch (error) {
            console.error(error);
            return h.response({ "Message:": error }).code(500)
        }
    }


    static async start_journey(request: Request, h: ResponseToolkit) {
        try {
            const { booking_id } = request.payload as any;
            const booking = await booking_managment.start_journey(booking_id);
            
            if (booking == 2) {
                return h.response({ "Message": "Journey Started" }).code(201);
            } else if (booking==0){
                return h.response({ "Message": `Journey not found` }).code(404);
            }
            else if (booking==1)
            {
                return h.response({ "Message": `Journey is not scheduled for id-${booking_id}` }).code(404);

            }
        } catch (error) {
            console.error(error);

            if (Boom.isBoom(error)) {
                // Re-throw Boom errors as they are
                throw error;
            }

            throw Boom.internal("An internal error occurred while handling the request");
        }
    }

    static async end_journey(request: Request, h: ResponseToolkit) {
        try {
            const { booking_id } = request.payload as any;
            const booking = await booking_managment.end_journey(booking_id);

            if (booking == 2) {
                return h.response({ "Message": "Journey completed" }).code(201);
            } else if (booking==0){
                return h.response({ "Message": `Journey not found` }).code(404);
            }
            else if (booking==1)
            {
                return h.response({ "Message": `Journey is not scheduled for id-${booking_id}` }).code(404);

            }
        } catch (error) {
            console.error(error);

            if (Boom.isBoom(error)) {
                throw error;
            }

            throw Boom.internal("An internal error occurred while handling the request");
        }
    }
}

export class user_taxi_controller {
    static async get_taxi(request: Request, h: ResponseToolkit) {
        try {
            const { capacity, category, fuel_type, journey_date } = <any>request.query;
            const taxi = await user_taxi_service.getTaxi(capacity, category, fuel_type, journey_date);

            if (taxi) {
                return h.response({
                    "Message": taxi
                }).code(201);
            } else {
                return h.response({
                    "Message": "No records found",
                }).code(409);
            }
        } catch (error) {
            console.error(error);
            return h.response({ "Message:": error }).code(500)
        }
    }
}

export class user_logout_controller {
    static async user_logout(request: Request, h: ResponseToolkit) {
        try {
            const ipAddress = request.info.remoteAddress;
            const user_id = request.headers.uid
            const user = await logout_service.user_logout(user_id,ipAddress);

            if (user==1) {
                return h.response({
                    "Message": "User logout success"
                }).code(201);
            } else {
                return h.response({
                    "Message": "Already logged out",
                }).code(409);
            }
        } catch (error) {
            console.error(error);
            return h.response({ "Message:": error}).code(500)
        }
    }


}
