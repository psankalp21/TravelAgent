import { addUser, ifUserEmailExists, ifUserPhoneExists, Userlogin, updateUserPassword } from "../entities/user.entity";
import { addAgent, ifAgentEmailExists, ifAgentPhoneExists, Agentlogin, updateAgentPassword } from "../entities/agent.entity";
import { create_session, update_session } from "../entities/session.entity";
import { createClient } from 'redis';
import Jwt from 'jsonwebtoken';
import Session from "../database/models/session.model";
import Boom from "boom";
const client = createClient();
client.on('error', err => console.log('Redis Client Error', err));
client.connect();



export class signup_service {
    static async agent_signup(name: string, email: string, password: string, dob: Date, phone: string) {
        const agent = await ifAgentEmailExists(email);
        if (agent)
            throw Boom.conflict('User already exists with associated Email', { errorCode: 'EMAIL_EXISTS' });
        const check_phone = await ifAgentPhoneExists(phone);
        if (check_phone)
            throw Boom.conflict('Phone number already associated with an account', { errorCode: 'PHONE_EXISTS' });
        return await addAgent(name, email, password, dob, phone);
    }

    async user_signup(name: string, email: string, password: string, dob: Date, phone: string) {
        const user: any = await ifUserEmailExists(email);
        if (user)
            throw Boom.conflict('User already exists with associated Email', { errorCode: 'EMAIL_EXISTS' });
        const check_phone = await ifUserPhoneExists(phone);
        if (check_phone)
            throw Boom.conflict('Phone number already exists', { errorCode: 'PONE_EXISTS' });
        return (await addUser(name, email, password, dob, phone));
    }
}

export class login_service {
    async Userlogin(ip: string, email: string, password: string) {
        const user = await Userlogin(email, password);
        if (!user)
            throw Boom.notFound('User not found', { errorCode: 'USER_NOT_FOUND' });
        const token = Jwt.sign({ uid: user.id, type: "user" }, 'PS21', { expiresIn: '24h' });
        const key = `${user.id}_${ip}`;
        await client.hSet(key, {
            'user_id': `${user.id}`,
            'ip_address': `${ip}`,
            'session': 'active'});
        const session = await Session.findByPk(key)
        if (session)
            await update_session(key)
        else
            await create_session(key, user.id, ip)
        return token
    }

    async AgentLogin(ip: string, email: string, password: string) {
        const agent = await Agentlogin(email, password);
        if (!agent)
            throw Boom.notFound('Agent not found', { errorCode: 'USER_NOT_FOUND' });
        const key = `${agent.id}_${ip}`;
        const token = Jwt.sign({ aid: agent.id, type: "admin" }, 'PS21', { expiresIn: '1h' });
        await client.hSet(key, {
            'agent_id': `${agent.id}`,
            'ip_address': `${ip}`,
            'session': 'active'});
        const session = await Session.findByPk(key)
        if (session)
            await update_session(key)
        else
            await create_session(key, agent.id, ip)
        return token
    }
}


export class reset_password_controller {
    static async Userforgot_pwd(email: string) {
        const user_email = await ifUserEmailExists(email);
        if (!user_email)
            throw Boom.notFound('User not found', { errorCode: 'USER_NOT_FOUND' });
        await client.set(email, '2201')
        return
    }

    static async Userverify(email: string, otp: string, new_password: string) {
        const otp_redis = await client.get(email);
        console.log("comparing",otp_redis,"==",otp)
        if (otp_redis != otp)
            throw Boom.badRequest('Invalid OTP', { errorCode: 'INVALID_OTP' });
        await updateUserPassword(email, new_password)
        client.del(email)
        return
    }
}
