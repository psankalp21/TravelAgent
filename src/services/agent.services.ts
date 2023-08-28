import { ifTaxiNumberExists, addTaxi, getTaxi, remTaxi, get_taxi_status, set_taxi_status } from "../entities/taxi.entity";
import { assign_driver, get_all_bookings, get_pending_bookings, ifDriverAvailable } from "../entities/bookings.entity";
import { createClient } from "redis";

import Boom from "boom";
import { DriverE } from "../entities/driver.base";
import { TaxiE } from "../entities/taxi.base";
import { Taxi } from "../database/models/taxi.model";
import { BookingE } from "../entities/booking.base";
const client = createClient();
client.on('error', err => console.log('Redis Client Error', err));
client.connect();

export class driver_managment {
    static async registerDriver(name: string, dob: string, phone: string, available: boolean) {
        const driver = await DriverE.ifPhoneExists(phone);
        console.log(driver)
        if (driver)
            throw Boom.conflict('Phone number already associated with a driver', { errorCode: 'PHONE_EXISTS' });
        await DriverE.addDriver(name, dob, phone, available)
        return
    }

    static async fetchDrivers() {
        const driver = await DriverE.fetchDrivers();
        if (driver.length == 0)
            throw Boom.notFound('No driver available in database', { errorCode: 'NO_DRIVER_DATA' });
        return driver
    }

    static async removeDrivers(driver_id) {
        const driver = await DriverE.removeDriver(driver_id);
        if (!driver)
            throw Boom.notFound('No such driver', { errorCode: 'DRIVER_NOT_FOUND' });
        return driver
    }
}

export class taxi_managment {
    static async addNewTaxi(id: string, model: string, category: string, capacity: number, fuel_type: string) {
        const taxi = await TaxiE.ifTaxiIdExists(id);
        if (taxi)
            throw Boom.conflict('This taxi already exists', { errorCode: 'TAXI_EXISTS' });
        return await TaxiE.addTaxi(id, model, category, capacity, fuel_type);
    }

    static async fetchTaxis() {
        const taxi = await TaxiE.fetchTaxis();
        return taxi
    }

    static async removeTaxi(taxi_id) {
        console.log("taxi_iddddd",taxi_id)
        const taxi = await TaxiE.removeTaxi(taxi_id);
        return taxi
    }

    static async toggle_taxi_status(taxi_id) {
        const taxi_status = await TaxiE.getTaxiStatus(taxi_id);
        console.log("tx == ",taxi_status)
        if (taxi_status == true) {
            await TaxiE.updateTaxiStatus(taxi_id, false)
            return 1
        }
        else if (taxi_status == false) {
            await TaxiE.updateTaxiStatus(taxi_id, true)
            return 2
        }
    }
}

export class agent_booking_services {
    static async acceptBooking(agent_id, booking_id, driver_id) {
        await BookingE.ifDriverAvailable(booking_id, driver_id)
        await BookingE.assignDriver(agent_id, booking_id, driver_id)
        return
    }

    static async getPendingBookings() {
        const booking = await BookingE.getPendingBookings()
        return booking
    }

    static async getAllBookings() {
        const booking = await BookingE.getAllBookings()
        return booking
    }
}

export class logout_service {
    static async agent_logout(agent_id, ip) {
        const key = `${agent_id}_${ip}`;
        await client.hSet(key, {
            'agent_id': `${agent_id}`,
            'ip_address': `${ip}`,
            'session': 'inactive'
        });
        return
    }
}