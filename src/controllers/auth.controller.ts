import { Request, ResponseToolkit } from '@hapi/hapi';
import { signup_service, login_service, user_forgot_password_service, user_verify_otp_service } from '../services/auth.services';
import dotenv from 'dotenv';

dotenv.config();
const PORT = process.env.PORT || 4000;

export async function agent_signup_controller(request: Request, h: ResponseToolkit) {
    try {
        const { name, email, password, dob, phone } = <any>request.payload;
        const signup = new signup_service();
        const result = await signup.agent_signup(name, email, password, dob, phone);

        if (result == 1) {
            return h.response({
                "Message": "Signup Success!",
                "Action": `please login: http://localhost:${PORT}/agentlogin`
            }).code(201);
        } else if (result == 0) {
            return h.response({
                "Message": "Account Already exists",
                "Action": `Try login : http://localhost:${PORT}/agentlogin`
            }).code(409);
        }
        else if (result == 2) {
            return h.response({
                "Message": "Phone number is already linked to an account"
            });
        }
    } catch (error) {
        console.error(error);
        return h.response({ "Message:": "Something went wrong" }).code(500);
    }
}

export async function user_signup_controller(request: Request, h: ResponseToolkit) {
    try {
        const { name, email, password, dob, phone } = <any>request.payload;
        const signup = new signup_service();
        const result = await signup.user_signup(name, email, password, dob, phone);

        if (result == 1) {
            return h.response({
                "Message": "Signup Success!",
                "Action": `please login: http://localhost:${PORT}/userlogin`
            }).code(201);
        } else if (result == 0) {
            return h.response({
                "Message": "Account Already exists",
                "Action": `Try login : http://localhost:${PORT}/userlogin`
            }).code(409);
        }
        else if (result == 2) {
            return h.response({
                "Message": "Phone number is already linked to an account"
            });
        }
    } catch (error) {
        console.error(error);
        return h.response({ "Message:": "Something went wrong" }).code(500);
    }
}



export async function agent_login_controller(request: Request, h: ResponseToolkit) {
    try {
        const ipAddress = request.info.remoteAddress;
        const { email, password } = <any>request.payload;
        const login = new login_service();
        const result = await login.AgentLogin(ipAddress,email, password);
            return h.response({
                "Message": "Login Success",
                "Token": result
            }).code(200);
    
    } catch (error) {
        console.error(error);
        return h.response(error)
    }
}



export async function user_login_controller(request: Request, h: ResponseToolkit) {
    try {
        const { email, password } = <any>request.payload;
        const ipAddress = request.info.remoteAddress;
        const login = new login_service();
        const result = await login.Userlogin(ipAddress,email, password);


        if (result){
            return h.response({
                "Message": "Login Successful",
                "Token Generated": result
            })
        }else
        {
            return h.response({
                "Message": "Invalid Credentials"
            })
        }
    } catch (error) {
        console.error(error);
        return h.response({ "Message:": "Something went wrong" }).code(500)
    }
}

export async function user_forgot_password_controller(request: Request, h: ResponseToolkit) {
    try {
        const { email } = <any>request.payload;
        const forgot_password = new user_forgot_password_service();
        const result = await forgot_password.Userforgot_pwd(email);

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

export async function user_verify_otp(request: Request, h: ResponseToolkit) {
    try {
        const { email, otp, new_password } = <any>request.payload;
        const verify_otp = new user_verify_otp_service();
        const result = await verify_otp.Userverify(email, otp, new_password);

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

