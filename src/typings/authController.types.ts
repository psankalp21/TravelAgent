export interface SignupPayload {
    name: string;
    email: string;
    password: string;
    dob: string;
    phone: string;
}

export interface LoginPayload {
    email: string;
    password: string;
    method: string;
}

export interface OTPPayload {
    email: string;
    OTP: string;
}