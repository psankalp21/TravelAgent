import BaseEntity from "./base.entity";
import { Driver } from '../database/models/driver.model'
import Boom from "boom";

class DriverEntity extends BaseEntity {
    constructor() {
        super(Driver);
    }

    async addDriver(name, dob, phone, available) {
        let payload = { name: name, dob: dob, phone: phone, available: available }
        console.log("my payload",payload)
        let data = await this.create(payload)
        return data;
    }

    async fetchDrivers() {
        let data = await this.findAll()
        return data;
    }
    async removeDriver(id) {
        let condition = { id: id };
        let dataToDelete = await this.findOne(condition);

        if (!dataToDelete) {
            throw Boom.notFound(`Driver with ID ${id} not found`);
        }

        await this.destroy(dataToDelete);
        return dataToDelete;
    }
    async ifPhoneExists(phone) {
        let condition = { phone: phone }
        let data = await this.findOne(condition)
        return data;
    }

    async fetchDriverById(id) {
        let condition = { id: id }
        let data = await this.findOne(condition)
        return data
    }
}


export const DriverE = new DriverEntity();


