import { addDriver, getDrivers, ifDriverPhoneExists, remDriver } from "../entities/driver.entity";
import { ifTaxiNumberExists, addTaxi, getTaxi, remTaxi, get_taxi_status, set_taxi_status } from "../entities/taxi.entity";
import { assign_driver, get_all_bookings, get_pending_bookings, ifDriverAvailable } from "../entities/bookings.entity";
import { Driver } from "../database/models/driver.model";
import { Booking } from "../database/models/booking.model";
import { createClient } from "redis";
const client = createClient();
client.on('error', err => console.log('Redis Client Error', err));
client.connect();

export class driver_managment {
    static async registerDriver(name: string, dob: string, phone: string, available: boolean) {
        try {
            const driver: any = await ifDriverPhoneExists(phone);
            if (driver == false) {
                const user = await addDriver(name, dob, phone, available);
                return 1;
            }
            else
                return 0;

        }
        catch (error) {
            console.error(error);
            throw new Error("Failed to register driver");
        }
    }

    static async fetchDrivers() {
        try {
            const driver = await getDrivers();
            return driver
        }
        catch (error) {
            console.error(error);
            throw new Error("Failed to fetch drivers");
        }
    }

    // static async get_available_drivers(booking_id:number) {
    //     try {
    //         const drivers = await getAvailableDrivers(booking_id)
    //         return drivers;
    //     }
    //     catch (error) {
    //         console.error(error);
    //         throw new Error(error);
    //     }
    // }
    static async removeDrivers(driver_id) {
        try {
            const driver = await remDriver(driver_id);
            return driver
        }
        catch (error) {
            console.error(error);
            throw new Error("Failed to remove driver");
        }
    }
}


export class taxi_managment {
    static async addNewTaxi(id: string, model: string, category: string, capacity: number, fuel_type: string, available: boolean) {
        try {
            const taxi: any = await ifTaxiNumberExists(id);
            if (taxi == false) {
                const user = await addTaxi(id, model, category, capacity, fuel_type, available);
                return 1;
            }
            else
                return 2;

        }
        catch (error) {
            console.error(error);
            throw new Error("Failed to register a new taxi");
        }
    }
    static async fetchTaxis() {
        try {
            const taxi = await getTaxi();
            return taxi
        }
        catch (error) {
            console.error(error);
            throw new Error("Failed to fetch taxi");
        }
    }

    static async removeTaxi(taxi_id) {
        try {
            const taxi = await remTaxi(taxi_id);
            return taxi
        }
        catch (error) {
            console.error(error);
            throw new Error("Failed to remove taxi");
        }
    }
    static async toggle_taxi_status(taxi_id) {
        try {
            const taxi_status = await get_taxi_status(taxi_id);
            if (taxi_status == true) {
                await set_taxi_status(taxi_id, false)
                return 1
            }
            else if(taxi_status==false)
            {
                await set_taxi_status(taxi_id, true)
                return 2
            }
            else
                return 0
        }
        catch (error) {
            console.error(error);
            throw new Error("Failed to update taxi status");
        }
    }

}


export class agent_booking_services {
    static async acceptBooking(agent_id, booking_id, driver_id) {
        const isAvailable = await ifDriverAvailable(booking_id, driver_id)
        if(isAvailable==true)
        {
            const booking = await assign_driver(agent_id, booking_id, driver_id)
            return 1
        }
        else
            return 2
        
    }

    static async getPendingBookings() {
        const booking = await get_pending_bookings()
        return booking
    }

    static async getAllBookings() {
        const booking = await get_all_bookings()
        return booking
    }
}

export class logout_service {
   
    static async agent_logout(agent_id, ip) {
        try {
            const key = `${agent_id}_${ip}`;
            await client.hSet(key, {
                'agent_id': `${agent_id}`,
                'ip_address': `${ip}`,
                'session': 'inactive'
            });
            return 1
        }
        catch (error) {
            console.error(error);
            throw new Error("Failed to logout");
        }
    }
}
