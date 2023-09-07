import { Request, ResponseToolkit } from '@hapi/hapi';
import { booking_managment, logout_service, user_category_service, user_review_managment_service, user_taxi_service } from '../services/user.services';
import { AddBookingPayload, CancelBookingPayload, CheckFareQuery, EndJourneyPayload, GetTaxiQuery, StartJourneyPayload, ViewOneBookingQuery, reviewPayload } from '../typings/userController.types';
const moment = require('moment-timezone');

export class booking_managment_controller {
    static async add_booking(request: Request, h: ResponseToolkit) {
        const user_id = request.headers.uid;
        const { source_city, source_state, destination_city, destination_state, taxi_id, date_time } = request.payload as AddBookingPayload;
       
        const localDateTime = new Date(date_time);
        const utcDateTime = new Date(localDateTime.toISOString());
    
        console.log("utcccc",utcDateTime)
        await booking_managment.add_booking(user_id, source_city, source_state, destination_city, destination_state, taxi_id, utcDateTime);
        return h.response({
            "Message": "Booking Added Successfully!"
        }).code(201);

    }

    static async check_fare(request: Request, h: ResponseToolkit) {
        const { source_city, source_state, destination_city, destination_state, categoryName } = request.query as CheckFareQuery;

        const fare = await booking_managment.check_fare(source_city, source_state, destination_city, destination_state, categoryName);
        return h.response({
            "Message": "This is just an estimated fare. Original fare might vary.",
            "Fare": fare
        }).code(201);
    }

    static async view_all_bookings(request: Request, h: ResponseToolkit) {

        const user_id = request.headers.uid;
        const booking = await booking_managment.view_bookings(user_id);
        return h.response({
            "Message": booking
        }).code(201);

    }
    static async cancel_booking(request: Request, h: ResponseToolkit) {

        const user_id = request.headers.uid
        const { booking_id } = request.payload as CancelBookingPayload;
        await booking_managment.cancel_booking(user_id, booking_id);
        return h.response({
            "Message": "Success! Booking Canceled."
        }).code(201);

    }
    static async view_one_booking(request: Request, h: ResponseToolkit) {
        const booking_id = request.query.booking_id as ViewOneBookingQuery;
        const booking = await booking_managment.get_booking(booking_id);
        return h.response({
            "Message": booking
        }).code(201);

    }

    static async start_journey(request: Request, h: ResponseToolkit) {
        const { booking_id, otp } = request.payload as StartJourneyPayload;
        await booking_managment.start_journey(booking_id, otp);
        return h.response({ "Message": "Journey Started" }).code(201);
    }

    static async end_journey(request: Request, h: ResponseToolkit) {
        const { booking_id } = request.payload as EndJourneyPayload;
        await booking_managment.end_journey(booking_id);
        return h.response({ "Message": "Journey completed" }).code(201);
    }
}

export class user_taxi_controller {
    static async get_taxi(request: Request, h: ResponseToolkit) {
        const { capacity, category, fuel_type, date_time } = request.query as GetTaxiQuery;
        const utcDateTime = moment.utc(date_time, 'YYYY-MM-DD HH:mm:ss');
        const istDateTime = utcDateTime.tz('Asia/Kolkata');
        const formattedDateTime = istDateTime.format('YYYY-MM-DD HH:mm:ss');
        const taxi = await user_taxi_service.getTaxi(capacity, category, fuel_type, formattedDateTime);
        if (taxi) {
            return h.response({
                "Message": taxi
            }).code(201);
        } else {
            return h.response({
                "Message": "No records found",
            }).code(409);
        }

    }
}

export class user_category_controller {
    static async get_all_categories(request: Request, h: ResponseToolkit) {
        const categories = await user_category_service.getAll_category();
        if (categories) {
            return h.response({
                "Message": categories
            }).code(201);
        } else {
            return h.response({
                "Message": "No records found",
            }).code(409);
        }

    }
}

export class review_managment_controller {
    static async add_review(request: Request, h: ResponseToolkit) {
        const user_id = request.headers.uid
        const { booking_id, driver_rating,taxi_rating,journey_rating, comment } = request.payload as reviewPayload;
        await user_review_managment_service.addReview(user_id,booking_id,driver_rating,taxi_rating,journey_rating, comment)
        return h.response({
            "Message": "Review Added"
        }).code(201);
    }

    static async update_review(request: Request, h: ResponseToolkit) {
        const user_id = request.headers.uid
        const { booking_id, driver_rating,taxi_rating,journey_rating, comment } = request.payload as reviewPayload;
        await user_review_managment_service.updateReview(user_id,booking_id, driver_rating,taxi_rating,journey_rating, comment)
        return h.response({
            "Message": "Review updated"
        }).code(201);
    }

    static async get_review(request: Request, h: ResponseToolkit) {
        const { booking_id } = request.query as reviewPayload;
       const review = await user_review_managment_service.getReview(booking_id)
        return h.response({
            "Message": review
        }).code(201);
    }
}

export class user_logout_controller {
    static async user_logout(request: Request, h: ResponseToolkit) {
        const ipAddress = request.info.remoteAddress;
        const user_id = request.headers.uid
        const user = await logout_service.user_logout(user_id, ipAddress);
        if (user == 1) {
            return h.response({
                "Message": "User logout success"
            }).code(201);
        } else {
            return h.response({
                "Message": "Already logged out",
            }).code(409);
        }

    }
}
