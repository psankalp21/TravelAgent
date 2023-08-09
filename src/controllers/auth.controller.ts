import { Request, ResponseToolkit, server } from '@hapi/hapi';
import { signup_service, login_service, forgot_password_service, verify_otp_service } from '../services/auth.services';
import dotenv from 'dotenv';

dotenv.config();
const PORT = process.env.PORT || 4000;


export async function signup_controller(request: Request, h: ResponseToolkit) {
    try {
        const { name, email, password, dob, phone } = <any>request.payload;
        const signup = new signup_service();
        const result = await signup.signup(name, email, password, dob, phone);

        if (result == 1) {
            return h.response({
                "Message": "Signup Success!",
                "Action": `please login: http://localhost:${PORT}/login`
            }).code(201);
        } else if (result == 0) {
            return h.response({
                "Message": "Account Already exists",
                "Action": `Try login : http://localhost:${PORT}/login`
            }).code(409);
        }
        else if (result == 2) {
            return h.response({
                "Message": "Phone number is already linked to an account"
            })
        }
    } catch (error) {
        console.error(error);
        return h.response({ "Message:": "Something went wrong" }).code(500)
    }
}



export async function login_controller(request: Request, h: ResponseToolkit) {
    try {
        const { email, password } = <any>request.payload;
        const login = new login_service();
        const result = await login.login(email, password);

        if (result == 1) {
            return h.response({
                "Message": "Login Successful!",
                "Action": {
                    "1. Google Api to get distance":`http://localhost:${PORT}/get_distance`
                }
            }).code(201);
        } else if (result == 0) {
            return h.response({
                "Message": "There is no account associated with this email.",
                "Action": `Try signing up : http://localhost:${PORT}/signup`
            }).code(409);
        }
        else if (result == 2) {
            return h.response({
                "Message": "Invalid Passowrd",
                "Action": `Please retry or recover password : http://localhost:${PORT}/forgot_password`
            })
        }
    } catch (error) {
        console.error(error);
        return h.response({ "Message:": "Something went wrong" }).code(500)
    }
}




export async function forgot_password_controller(request: Request, h: ResponseToolkit) {
    try {
        const { email } = <any>request.payload;
        const forgot_password = new forgot_password_service();
        const result = await forgot_password.forgot_pwd(email);

        if (result == 1) {
            return h.response({
                "Message": "OTP Generated",
                "Action": `Enter OTP here : http://localhost:${PORT}/otp_verify`
            }).code(201);
        } else if (result == 0) {
            return h.response({
                "Message": "There is no account associated with this email.",
                "Action": `Double check your email or signup : http://localhost:${PORT}/signup`
            }).code(409);
        }
    } catch (error) {
        console.error(error);
        return h.response({ "Message:": "Something went wrong" }).code(500)
    }
}




export async function verify_otp(request: Request, h: ResponseToolkit) {
    try {
        const { email,otp,new_password} = <any>request.payload;
        const verify_otp = new verify_otp_service();
        const result = await verify_otp.verify(email,otp,new_password);

        if (result == 1) {
            return h.response({
                "Message": "Password has been updated.",
                "Action": `Please login to continue : http://localhost:${PORT}/login`
            }).code(201);
        } else if (result == 0) {
            return h.response({
                "Message": "Invalid OTP",
                "Action": `Please try again or regenerate OTP : http://localhost:${PORT}/forgot_password`
            }).code(409);
        }
    } catch (error) {
        console.error(error);
        return h.response({ "Message:": "Something went wrong" }).code(500)
    }
}