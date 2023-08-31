import BaseEntity from "./base.entity";
import { User } from "../database/models/user.model";

class UserEntity extends BaseEntity {
    constructor() {
        super(User);
    }
    async createUser(name, email, password, dob, phone, twoFA) {
        let payload = { name: name, email: email, password: password, dob: dob, phone: phone, twoFA: twoFA }
        let data = await this.create(payload)
        return data;
    }

    async login(email) {
        let condition = { email: email}
        let data = await this.findOne(condition)
        return data;
    }

    async ifEmailExists(email) {
        let condition = { email: email }
        let data = await this.findOne(condition)
        return data;
    }


    async ifPhoneExists(phone) {
        let condition = { phone: phone }
        let data = await this.findOne(condition)
        return data;
    }

    async updatePassword(email, new_password) {
        let condition = { email: email }
        let update = { password: new_password }
        return await this.update(update, condition)
    }

    async getSecret(email) {
        let condition = { email: email }
        let data = await this.findOne(condition)
        return data
    }

    async fetchUserById(id) {
        let condition = { id: id }
        let data = await this.findOne(condition)
        return data
    }
}

export const UserE = new UserEntity();
