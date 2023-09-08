import { Request, ResponseToolkit } from '@hapi/hapi';
import { agent_booking_services, agent_review_service, category_service, driver_managment, logout_service, taxi_managment } from '../services/agent.services';
import dotenv from 'dotenv';
import { AgentBookingPayload, AgentCategoryPayload, DriverPayload, GetCategoryRateQuery, RemoveCategoryQuery, TaxiPayload, ToggleDriverPayload, ToggleTaxiPayload, UpdateCategoryRatePayload } from '../typings/agentController.types';
import { Review } from '../database/models/review.model';
import { Booking } from '../database/models/booking.model';
import { AgentE } from '../entities/agent.entity';
import { BookingE } from '../entities/booking.entity';
dotenv.config();
const PORT = process.env.PORT || 4000;

export class driver_managment_controller {
    static async add_driver(request: Request, h: ResponseToolkit) {
        const { name, dob, email, phone, available } = request.payload as DriverPayload;
        await driver_managment.registerDriver(name, email, dob, phone, available);
        return h.response({
            "Message": "Driver Added Successfully!"
        }).code(201);
    }

    static async fetch_driver(request: Request, h: ResponseToolkit) {
        const result = await driver_managment.fetchDrivers();
        return h.response(result).code(200);
    }

    static async remove_driver(request: Request, h: ResponseToolkit) {
        const { driver_id } = request.query as ToggleDriverPayload;
        await driver_managment.removeDrivers(driver_id);
        return h.response({ "Message:": "Driver details removed" }).code(204);
    }

    static async toggle_driver_availability(request: Request, h: ResponseToolkit) {
        const { driver_id } = request.query as ToggleDriverPayload;
        const status = await driver_managment.toggleDriverStatus(driver_id);
        return h.response({ "Message:": `Driver marked as ${status}` }).code(200);
    }
}

export class taxi_management_controller {
    static async add_taxi(request: Request, h: ResponseToolkit) {
        const { id, model, category, capacity, fuel_type } = request.payload as TaxiPayload;
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
        const { taxi_id } = request.query as ToggleTaxiPayload;
        await taxi_managment.removeTaxi(taxi_id);
        return h.response({ "Message:": "Taxi details removed" }).code(204);

    }

    static async toggle_taxi_status(request: Request, h: ResponseToolkit) {
        const { taxi_id } = request.payload as ToggleTaxiPayload;
        const result = await taxi_managment.toggle_taxi_status(taxi_id);
        if (result == 1)
            return h.response({ "Message:": "Taxi status updated to Unavailable" }).code(200);
        else if (result == 2)
            return h.response({ "Message:": "Taxi status updated to Available" }).code(200);
    }
}

export class agent_booking_controller {
    static async get_all_bookings(request: Request, h: ResponseToolkit) {
        const booking = await agent_booking_services.getAllBookings()
        return h.response({ "Message": booking }).code(200);

    }

    static async get_pending_bookings(request: Request, h: ResponseToolkit) {
        const booking = await agent_booking_services.getPendingBookings()
        return h.response({ "Message": booking }).code(200);

    }

    static async accept_booking(request: Request, h: ResponseToolkit) {
        const agent_id = request.headers.aid;
        const { booking_id, driver_id } = request.payload as AgentBookingPayload;
        await agent_booking_services.acceptBooking(agent_id, booking_id, driver_id)
        return h.response({ "Message": `Bookings accepted, Driver Assigned` }).code(200);
    }

    static async reject_booking(request: Request, h: ResponseToolkit) {
        const { id } = request.query as { id: number };
        await agent_booking_services.rejectBooking(id)
        return h.response({ "Message": `Booking Rejected for ${id}` }).code(200);
    }

}

export class agent_review_controler {
   
    static async get_booking_review(request: Request, h: ResponseToolkit) {
        const { booking_id } = request.query as { booking_id: number };
        const review = await agent_review_service.getBookingReview(booking_id)
        return h.response({ "Message": review }).code(200);
    }
    
    static async get_driver_review(request: Request, h: ResponseToolkit) {
        const { driver_id } = request.query as { driver_id: number };
        const review = await agent_review_service.getDriverReview(driver_id)
        return h.response({ "Message": review }).code(200);
    }

    static async get_taxi_review(request: Request, h: ResponseToolkit) {
        const { taxi_id } = request.query as { taxi_id: number };
        const review = await agent_review_service.getTaxiReview(taxi_id)
        return h.response({ "Message": review }).code(200);
    }
}

export class agent_category_controller {
    static async add_category(request: Request, h: ResponseToolkit) {
        const { categoryName, categoryRate } = request.payload as AgentCategoryPayload;
        await category_service.addCategory(categoryName, categoryRate);
        return h.response({
            "Message": "Category Added Successfuly"
        }).code(201);

    }
    static async remove_category(request: Request, h: ResponseToolkit) {
        const { categoryName } = request.query as RemoveCategoryQuery;
        await category_service.removeCategory(categoryName);
        return h.response({
            "Message": "Category Removed Successfuly"
        }).code(204);
    }
    static async update_category_rate(request: Request, h: ResponseToolkit) {
        const { categoryName, new_categoryRate } = request.payload as UpdateCategoryRatePayload;
        await category_service.updateCategoryRate(categoryName, new_categoryRate);
        return h.response({
            "Message": "Category Rate Updated Successfuly"
        }).code(200);
    }
    static async get_category_rate(request: Request, h: ResponseToolkit) {
        const { categoryName } = request.query as GetCategoryRateQuery;
        const rate = await category_service.getCategoryRate(categoryName);
        return h.response({
            "Cost Per Kilometer": `${categoryName} - ${rate} INR`
        }).code(200);
    }
    static async get_all_category(request: Request, h: ResponseToolkit) {
        const categories = await category_service.get_all_category();
        if (categories) {
            return h.response({
                "Message": categories
            }).code(200);
        } else {
            return h.response({
                "Message": "No records found",
            }).code(409);
        }
    }

}

export class agent_logout_controller {
    static async agent_logout(request: Request, h: ResponseToolkit) {
        const ipAddress = request.info.remoteAddress;
        const agent_id = request.headers.aid;
        await logout_service.agent_logout(agent_id, ipAddress);
        return h.response({
            "Message": "Agent logout success"
        }).code(200);

    }

}