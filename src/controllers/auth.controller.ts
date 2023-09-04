import { Request, ResponseToolkit } from '@hapi/hapi';
import { signup_service, login_service, reset_password_controller } from '../services/auth.services';
import dotenv from 'dotenv';
dotenv.config();
const PORT = process.env.PORT || 4000;

export async function agent_signup_controller(request: Request, h: ResponseToolkit) {
    const { name, email, password, dob, phone } = <any>request.payload;
    const qr = await signup_service.agent_signup(name, email, password, dob, phone);
    return h.response(qr).code(201);
}

export async function user_signup_controller(request: Request, h: ResponseToolkit) {
    const { name, email, password, dob, phone } = <any>request.payload;
    const signup = new signup_service();
    const data = await signup.user_signup(name, email, password, dob, phone);
    return h.response(data).code(500);
}

export async function agent_login_controller(request: Request, h: ResponseToolkit) {
    const { email, password, method} = <any>request.payload;
    const login = new login_service();
    const result = await login.AgentLogin(email, password,method);
    return h.response({
        "Message": "Login Success, OTP Generated"
    }).code(200);
}

export async function agent_login_verification(request: Request, h: ResponseToolkit) {
    const ipAddress = request.info.remoteAddress;
    const { email,OTP } = <any>request.payload;
    const login = new login_service();
    const result = await login.AgentLogin_verification(ipAddress,email,OTP);
    return h.response({
        "Message": "Login Success",
        "Token": result
    }).code(200);
}

export async function user_login_controller(request: Request, h: ResponseToolkit) {
    const { email, password,method } = <any>request.payload;
    const login = new login_service();
    const result = await login.Userlogin(email, password,method);
    return h.response({
        "Message": "OTP Generated",
    }).code(200);
}

export async function user_login_verification(request: Request, h: ResponseToolkit) {
    const ipAddress = request.info.remoteAddress;
    const { email,OTP } = <any>request.payload;
    const login = new login_service();
    const result = await login.UserLogin_verification(ipAddress,email,OTP);
    return h.response({
        "Message": "Login Success",
        "Token": result
    }).code(200);
}

export async function user_forgot_password_controller(request: Request, h: ResponseToolkit) {
    const { email } = <any>request.query;
    await reset_password_controller.Userforgot_pwd(email);
    return h.response({
        "Message": "OTP Generated",
        "Action": `Enter OTP here : http://localhost:${PORT}/otp_verify`
    }).code(201);
}

export async function user_verify_otp(request: Request, h: ResponseToolkit) {
    const { email, otp, new_password } = <any>request.payload;
    await reset_password_controller.Userverify(email, otp, new_password);
    return h.response({
        "Message": "Password has been updated.",
        "Action": `Please login to continue : http://localhost:${PORT}/login`
    }).code(201);
}

