import Boom from "boom";
import { Taxi } from "../database/models/taxi.model";
import BaseEntity from "./base.entity";

class TaxiEntity extends BaseEntity {
    constructor() {
        super(Taxi);
    }

    async addTaxi(id, model, category, capacity, fuel_type) {
        let payload = { id: id, model: model, category: category, capacity: capacity, fuel_type: fuel_type, available: true }
        let data = await this.create(payload)
        return data;
    }

    async ifTaxiIdExists(id) {
        let condition = { id: id }
        let data = await this.findOne(condition)
        return data;
    }

    async ifPhoneExists(phone) {
        let condition = { phone: phone }
        let data = await this.findOne(condition)
        return data;
    }

    async fetchTaxis() {
        let data = await this.findAll()
        return data;
    }

    async getTaxiStatus(id) {
        let condition = {id:id}
        let data = await this.findOne(condition)
        return data.available;
    }

    async removeTaxi(id) {
        let condition = { id: id };
        let dataToDelete = await this.findOne(condition);
        if (!dataToDelete)
            throw Boom.notFound(`Taxi with ID ${id} not found`);
        await this.destroy(dataToDelete);
        return dataToDelete;
    }

    async updateTaxiStatus(id, update:boolean) {
        let condition = { id: id };
        let data = await this.findOne(condition)
        console.log("taxi found ",data)
        if (!data)
            throw Boom.notFound(`Taxi with ID ${id} not found`);
        let payload = { available:update }
        return await this.update(payload, condition);
    }
}


export const TaxiE = new TaxiEntity();


