import { create_session, update_session } from "../entities/session.entity";
import { createClient } from 'redis';
import Jwt from 'jsonwebtoken';
import Session from "../database/models/session.model";
import Boom from "boom";
import { generateOTP } from "../utils/generateotp";
import { sendEmail } from "../utils/emailSender";
import { AgentE } from "../entities/agent.entity";
import { UserE } from "../entities/user.entity";
import speakeasy from 'speakeasy';
import qrcode from 'qrcode';
import bcrypt from 'bcrypt'

const client = createClient();
client.on('error', err => console.log('Redis Client Error', err));
client.connect();
import dotenv from 'dotenv';
dotenv.config();
const secretKey = process.env.SECRET_KEY;

export class signup_service {
    static async agent_signup(name: string, email: string, password: string, dob: Date, phone: string) {
        const agent = await AgentE.ifEmailExists(email);
        if (agent)
            throw Boom.conflict('User already exists with associated Email', { errorCode: 'EMAIL_EXISTS' });
        const check_phone = await AgentE.ifPhoneExists(phone);
        if (check_phone)
            throw Boom.conflict('Phone number already associated with an account', { errorCode: 'PHONE_EXISTS' });

        dotenv.config();
        const secret = speakeasy.generateSecret({ length: 20, name: email });
        const salt = 10;
        const hashpassword = await bcrypt.hash(password, salt)
        await AgentE.createAgent(name, email, hashpassword, dob, phone, secret.base32);

        const qrCodeUrl = speakeasy.otpauthURL({
            secret: secret.base32,
            label: 'TravelAgent',
            issuer: 'AgentProfile',
        });
        
        const qrCodeDataUrl = await qrcode.toDataURL(qrCodeUrl);
        return qrCodeDataUrl;
    }

    async user_signup(name: string, email: string, password: string, dob: Date, phone: string) {
        const user: any = await UserE.ifEmailExists(email);
        if (user)
            throw Boom.conflict('User already exists with associated Email', { errorCode: 'EMAIL_EXISTS' });
        const check_phone = await UserE.ifPhoneExists(phone);
        if (check_phone)
            throw Boom.conflict('Phone number already exists', { errorCode: 'PHONE_EXISTS' });
        const secret = speakeasy.generateSecret({ length: 20, name: email });
        const salt = 10;
        const hashpassword = await bcrypt.hash(password, salt)
        await UserE.createUser(name, email, hashpassword, dob, phone, secret.base32);
        const qrCodeUrl = speakeasy.otpauthURL({
            secret: secret.base32,
            label: 'TravelAgent',
            issuer: 'UserProfile',
        });
        const qrCodeDataUrl = await qrcode.toDataURL(qrCodeUrl);
        return qrCodeDataUrl;
    }
}

export class login_service {
    async Userlogin(email: string, password: string, method: string) {
        const user = await UserE.login(email);
        if (!user)
            throw Boom.notFound('User not found', { errorCode: 'USER_NOT_FOUND' });
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid)
            throw Boom.badRequest('Invalid Password', { errorCode: 'INVALID_PASSWORD' });
        if (method != "email" && method != "app")
            throw Boom.badRequest('Invalid Verification Method', { errorCode: 'INVALID_VERIFICATION_METHOD' });
        else if (method == "email") {
            const otp = generateOTP();
            const otpKey = `userotp:${user.id}`;
            await client.set(otpKey, otp)
            await client.expire(otpKey, 120);
            const subject = "Login Verification"
            const text = `Hello ${user.name}, Your verification code is ${otp}`
            await sendEmail(email, subject, text);
        }
        return user
    }


    async UserLogin_verification(ip: string, email: string, userEnteredOTP: string) {
        const user = await UserE.getSecret(email);
        if (!user)
            throw Boom.notFound('User not found', { errorCode: 'USER_NOT_FOUND' });
        const verificationResult = speakeasy.totp.verify({
            secret: user.twoFA,
            encoding: 'ascii',
            token: userEnteredOTP,
        });

        const otpKey = `userotp:${user.id}`;
        let redis_otp = false
        if (await client.get(otpKey) == userEnteredOTP)
            redis_otp = true

        if (verificationResult || redis_otp) {
            const key = `${user.id}_${ip}`;
            const token = Jwt.sign({ uid: user.id, type: "user" }, secretKey, { expiresIn: '1h' });
            await client.hSet(key, {
                'agent_id': `${user.id}`,
                'ip_address': `${ip}`,
                'session': 'active'
            });
            const session = await Session.findByPk(key)
            if (session)
                await update_session(key)
            else
                await create_session(key, user.id, ip)
            return token
        }
        else
            throw Boom.badRequest('Invalid OTP', { errorCode: 'INVALID_OTP' })
    }

    async AgentLogin(email: string, password: string, method: string) {
        const agent = await AgentE.login(email);
        if (!agent)
            throw Boom.badRequest('Agent Not Found', { errorCode: 'AGENT_NOT_FOUND' });
        const isValid = await bcrypt.compare(password, agent.password);
        if (!isValid)
            throw Boom.badRequest('Invalid Password', { errorCode: 'INVALID_PASSWORD' });
        if (method != "email" && method != "app")
            throw Boom.badRequest('Invalid Verification Method', { errorCode: 'INVALID_VERIFICATION_METHOD' });
        else if (method == "email") {
            const otp = generateOTP();
            const otpKey = `agentotp:${agent.id}`;
            await client.set(otpKey, otp)
            await client.expire(otpKey, 120);
            const subject = "Login Verification"
            const text = `Hello ${agent.name}, Your verification code is ${otp}`
            await sendEmail(email, subject, text);
        }
        if (!agent)
            throw Boom.notFound('Agent not found', { errorCode: 'USER_NOT_FOUND' });
        return agent
    }

    async AgentLogin_verification(ip: string, email: string, userEnteredOTP: string) {
        const agent = await AgentE.getSecret(email);
        if (!agent)
            throw Boom.notFound('Agent not found', { errorCode: 'USER_NOT_FOUND' });
        const verificationResult = speakeasy.totp.verify({
            secret: agent.twoFA,
            encoding: 'ascii',
            token: userEnteredOTP,
        });
        let redis_otp = false
        const otpKey = `agentotp:${agent.id}`;
        if (await client.get(otpKey) == userEnteredOTP)
            redis_otp = true

        if (verificationResult || redis_otp) {
            const key = `${agent.id}_${ip}`;
            const token = Jwt.sign({ aid: agent.id, type: "admin" }, secretKey, { expiresIn: '1h' });
            await client.hSet(key, {
                'agent_id': `${agent.id}`,
                'ip_address': `${ip}`,
                'session': 'active'
            });
            const session = await Session.findByPk(key)
            if (session)
                await update_session(key)
            else
                await create_session(key, agent.id, ip)
            return token
        }
        else
            throw Boom.badRequest('Invalid OTP', { errorCode: 'INVALID_OTP' })
    }
}

export class reset_password_controller {
    static async Userforgot_pwd(email: string) {
        const user_email = await UserE.ifEmailExists(email);
        if (!user_email)
            throw Boom.notFound('User not found', { errorCode: 'USER_NOT_FOUND' });

        const failedAttemptsKey = `FGTPWD_FAILED_${email}`;
        const attempts = parseInt(await client.get(failedAttemptsKey)) || 0;
        console.log(attempts)
        if (attempts >= 3) {
            throw Boom.tooManyRequests('Too many failed attempts. Please try again later.', {
                errorCode: 'TOO_MANY_ATTEMPTS'
            });
        }
        const otp = generateOTP();
        await client.set(`FGTPWD_${email}`, otp);
        await client.expire(`FGTPWD_${email}`, 180);
        await client.set(failedAttemptsKey, attempts + 1);
        await client.expire(failedAttemptsKey, 1800);
        return;
    }

    static async Userverify(email: string, otp: string, new_password: string) {
        const otp_redis = await client.get(`FGTPWD_${email}`);
        if (otp_redis !== otp) {
            const failedAttemptsKey = `FGTPWD_FAILED_${email}`;
            const attempts = parseInt(await client.get(failedAttemptsKey)) || 0;
            await client.set(failedAttemptsKey, attempts + 1);
            throw Boom.badRequest('Invalid OTP', { errorCode: 'INVALID_OTP' });
        }
        await UserE.updatePassword(email, new_password);
        await client.del(`FGTPWD_${email}`);
        await client.del(`FGTPWD_FAILED_${email}`);
        return;
    }
}