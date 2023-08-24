import { Agent } from "../database/models/agent.model";
import Boom from "boom";

export async function ifAgentEmailExists(email: string) {
    try {
        const user = await Agent.findOne({ where: { email } })
        return user
    }
    catch (error) {
        console.log(error)
        throw Boom.internal('An internal server error occurred');
    }
}

export async function ifAgentPhoneExists(phone: string) {
    try {
        const user = await Agent.findOne({ where: { phone } })
        return user
    }
    catch (error) {
        console.log(error)
        throw Boom.internal('An internal server error occurred');
    }
}

export async function addAgent(name: string, email: string, password: string, dob: Date, phone: string) {
    try {
        const user = await Agent.create({
            name,
            email,
            password,
            dob,
            phone});
        return user;
    } catch (error) {
        console.log(error)
        throw Boom.internal('An internal server error occurred');
    }
}

export async function Agentlogin(email: string, password: string) {
    try {
        const user = await Agent.findOne({ where: { email: email, password: password } })
        return user
    }
    catch (error) {
        console.log(error)
        throw Boom.internal('An internal server error occurred');
    }
}

export async function updateAgentPassword(email: string, new_password: string) {
    try {
        const user = await Agent.findOne({ where: { email: email } })
        user.password = new_password;
        return user
    }
    catch (error) {
        console.log(error)
        throw Boom.internal('An internal server error occurred');
    }
}
