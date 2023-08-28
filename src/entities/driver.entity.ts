import { Driver } from "../database/models/driver.model"
import Boom from "boom";

export async function ifDriverPhoneExists(phone: string) {
    const driver = await Driver.findOne({ where: { phone } })
    return driver
}

export async function addDriver(name: string, dob: string, phone: string, available: boolean) {
    try {
        const user = await Driver.create({
            name,
            dob,
            phone,
            available
        });
        return user;
    } catch (error) {
        console.error(error);
        throw new Error("Failed to add driver details");
    }
}

export async function getDrivers() {
    const driver = await Driver.findAll();
    return driver

}

export async function remDriver(driver_id) {
    const driver = await Driver.findOne({ where: { id: driver_id } });
    if (!driver)
        return null
    driver.destroy();
    return driver;
}


