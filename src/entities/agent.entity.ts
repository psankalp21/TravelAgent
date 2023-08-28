import { Agent } from "../database/models/agent.model";

export async function ifAgentEmailExists(email: string) {
    const user = await Agent.findOne({ where: { email } })
    return user
}

export async function ifAgentPhoneExists(phone: string) {
    const user = await Agent.findOne({ where: { phone } })
    return user

}

export async function addAgent(name: string, email: string, password: string, dob: Date, phone: string) {
    const user = await Agent.create({
        name,
        email,
        password,
        dob,
        phone
    });
    return user;

}

export async function Agentlogin(email: string, password: string) {
    const user = await Agent.findOne({ where: { email: email, password: password } })
    return user

}

export async function updateAgentPassword(email: string, new_password: string) {
    const user = await Agent.findOne({ where: { email: email } })
    user.password = new_password;
    return user

}
