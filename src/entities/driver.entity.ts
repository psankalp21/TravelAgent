import { Driver } from "../database/models/driver.model"

export async function ifDriverPhoneExists(phone: string) {
    const user = await Driver.findOne({ where: { phone } })
    if (user)
        return true
    else
        return false
}

export async function addDriver(name:string,dob:string,phone:string,available:boolean) {
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
    try {
        const driver = await Driver.findAll();
        return driver
    } catch (error) {
        console.error(error);
        throw new Error("Failed to get driver details");
    }
}

export async function remDriver(driver_id) {
    try {
        const driver = await Driver.findOne({ where: { id:driver_id } });
        if(driver)
        {
            driver.destroy();
            return 1
        }
        else 
            return 0
    } catch (error) {
        console.error(error);
        throw new Error("Failed to remove driver details");
    }
}


