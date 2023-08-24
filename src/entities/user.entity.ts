import Boom from "boom";
import { User } from "../database/models/user.model";


export async function ifUserEmailExists(email: string) {
    try {
        const user = await User.findOne({ where: { email } })
        return user
    }
    catch (error) {
        console.log(error)
        throw Boom.internal('An internal server error occurred');
    }
}

export async function ifUserPhoneExists(phone: string) {
    try {
        const user = await User.findOne({ where: { phone } })
        return user
    }
    catch (error) {
        console.log(error)
        throw Boom.internal('An internal server error occurred');
    }
}

export async function addUser(name: string, email: string, password: string, dob: Date, phone: string) {
    try {
        const user = await User.create({
            name,
            email,
            password,
            dob,
            phone
        });
        return user;
    } catch (error) {
        console.log(error)
        throw Boom.internal('An internal server error occurred');
    }
}

export async function Userlogin(email: string, password: string) {
    try {
        const user = await User.findOne({ where: { email: email, password: password } })
        return user
    }
    catch (error) {
        console.log(error)
        throw Boom.internal('An internal server error occurred');
    }
}


export async function updateUserPassword(email: string, new_password: string) {
    try
    {
        const user = await User.findOne({ where: { email: email } })
        console.log("USER->->",user)
        user.password = new_password;
        user.save();
        return user
    }
    catch (error) {
        console.log(error)
        throw Boom.internal('An internal server error occurred');
    }

    
}
