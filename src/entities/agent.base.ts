import BaseEntity from "./base.entity";
import { Agent } from '../database/models/agent.model'

class AgentEntity extends BaseEntity {
    constructor() {
        super(Agent);
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

    async createAgent(name, email, password, dob, phone) {
        let payload = { name: name, email: email, password: password, dob: dob, phone: phone }
        let data = await this.create(payload)
        return data;
    }
}

export const AgentE = new AgentEntity();


