import BaseEntity from "./base.entity";
import { User } from "../database/models/user.model";

class UserEntity extends BaseEntity {
    constructor() {
        super(User);
    }
    async createUser(name, email, password, dob, phone) {
        let payload = { name: name, email: email, password: password, dob: dob, phone: phone }
        let data = await this.create(payload)
        return data;
    }

    async login(email, password) {
        let condition = { email: email, password: password }
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

    async updatePassword(email, new_password)
    {
        let condition = {email:email}
        let update = {dpassword:new_password}
        return await this.update(update,condition)
    }
}

export const UserE = new UserEntity();
