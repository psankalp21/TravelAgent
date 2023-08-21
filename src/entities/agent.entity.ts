import { Agent } from "../database/models/agent.model";
import Boom from "boom";

export async function ifAgentEmailExists(email: string) {
    const user = await Agent.findOne({ where: { email } })
    return user
}

export async function ifAgentPhoneExists(phone: string) {
    const user = await Agent.findOne({ where: { phone } })
    if (user)
        return true
    else
        return false
}

export async function addAgent(name: string, email: string, password: string, dob: Date, phone: string) {
    try {
        const user = await Agent.create({
            name,
            email,
            password,
            dob,
            phone
        });
        return user;
    } catch (error) {
        console.error(error);
        throw Boom.internal("An internal error occurred while starting the journey");
    }
}

export async function Agentlogin(email: string,password:string) {
    const user = await Agent.findOne({ where: { email:email , password:password} })
    return user
}

export async function updateAgentPassword(email: string,new_password:string) {
    const user = await Agent.findOne({where:{email:email}})
    user.password=new_password;
    return user
}
