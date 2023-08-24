import { Request, ResponseToolkit } from '@hapi/hapi';
import { signup_service, login_service, reset_password_controller } from '../services/auth.services';
import dotenv from 'dotenv';
dotenv.config();
const PORT = process.env.PORT || 4000;

export async function agent_signup_controller(request: Request, h: ResponseToolkit) {
    try {
        const { name, email, password, dob, phone } = <any>request.payload;
        await signup_service.agent_signup(name, email, password, dob, phone);
        return h.response({
            "Message": "Signup Success!",
            "Action": `please login: http://localhost:${PORT}/agentlogin`
        }).code(201);
    }
    catch (error) {
        if (error.output && error.output.statusCode === 409) {
            return h.response({ message: error.message }).code(409);
        } else {
            console.error('Error during user signup:', error);
            return h.response({ message: 'Something went wrong :(' }).code(500);
        }
    }
}

export async function user_signup_controller(request: Request, h: ResponseToolkit) {
    try {
        const { name, email, password, dob, phone } = <any>request.payload;
        const signup = new signup_service();
        await signup.user_signup(name, email, password, dob, phone);
        return h.response({ "Message:": "User Signup Successful" }).code(500);

    }
    catch (error) {
        if (error.output && error.output.statusCode === 409) {
            return h.response({ message: error.message }).code(409);
        } else {
            console.error('Error during user signup:', error);
            return h.response({ message: 'Something went wrong :(' }).code(500);
        }
    }
}

export async function agent_login_controller(request: Request, h: ResponseToolkit) {
    try {
        const ipAddress = request.info.remoteAddress;
        const { email, password } = <any>request.payload;
        const login = new login_service();
        const result = await login.AgentLogin(ipAddress, email, password);
        return h.response({
            "Message": "Login Success",
            "Token": result
        }).code(200);

    } catch (error) {
        if (error.output && error.output.statusCode === 404) {
            return h.response({ message: error.message }).code(404);
        } else {
            console.error('Error during user signup:', error);
            return h.response({ message: 'Something went wrong :(' }).code(500);
        }
    }
}

export async function user_login_controller(request: Request, h: ResponseToolkit) {
    try {
        const { email, password } = <any>request.payload;
        const ipAddress = request.info.remoteAddress;
        const login = new login_service();
        const result = await login.Userlogin(ipAddress, email, password);
        return h.response({
            "Message": "Login Success",
            "Token": result
        }).code(200);

    } catch (error) {
        if (error.output && error.output.statusCode === 404) {
            return h.response({ message: error.message }).code(404);
        } else {
            console.error('Error during user signup:', error);
            return h.response({ message: 'Something went wrong :(' }).code(500);
        }
    }
}


export async function user_forgot_password_controller(request: Request, h: ResponseToolkit) {
    try {
        const { email } = <any>request.query;
        await reset_password_controller.Userforgot_pwd(email);
        return h.response({
            "Message": "OTP Generated",
            "Action": `Enter OTP here : http://localhost:${PORT}/otp_verify`
        }).code(201);
    } catch (error) {
        if (error.output && error.output.statusCode === 404) {
            return h.response({ message: error.message }).code(404);
        } else {
            console.error('Error during user signup:', error);
            return h.response({ message: 'Something went wrong' }).code(500);
        }
    }
}

export async function user_verify_otp(request: Request, h: ResponseToolkit) {
    try {
        const { email, otp, new_password } = <any>request.payload;
        await reset_password_controller.Userverify(email, otp, new_password);
        return h.response({
            "Message": "Password has been updated.",
            "Action": `Please login to continue : http://localhost:${PORT}/login`
        }).code(201);
    } catch (error) {
        if (error.output && error.output.statusCode === 400) {
            return h.response({ message: error.message }).code(400);
        } else {
            console.error('Error during user signup:', error);
            return h.response({ message: 'Something went wrong :(' }).code(500);
        }
    }
}

