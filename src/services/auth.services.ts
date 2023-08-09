import { addUser, ifEmailExists, ifPhoneExists, login, updatePassword } from "../entities/user.entity";
import { createClient } from 'redis';
const client = createClient();
client.on('error', err => console.log('Redis Client Error', err));
client.connect();

export class signup_service {
    async signup(name: string, email: string, password: string, dob: string, phone: string) {
        const user: any = await ifEmailExists(email);
        if (!user) {
            try {
                const check_phone: boolean = await ifPhoneExists(phone);
                console.log(check_phone)
                if (check_phone == true) {
                    await addUser(name, email, password, phone, dob);
                    console.log("signup success");
                    return 1;
                }
                else {
                    return 2;
                }

            } catch (error) {
                console.error(error);
                throw new Error("Failed to add user");
            }
        } else {
            return 0;
        }
    }
}

export class login_service {
    async login(email: string, password: string) {
        try {
            const user_email: any = await ifEmailExists(email);
            if (user_email) {
                const user = await login(email, password);
                if (user) {
                    return 1;
                }
                else {
                    return 2;
                }
            }
            else {
                return 0;
            }
        }
        catch (error) {
            console.error(error);
            throw new Error("Failed to add user");
        }
    }
}



export class forgot_password_service {
    async forgot_pwd(email: string) {
        try {
            const user_email: any = await ifEmailExists(email);
            console.log("email verified")
            if (user_email) {
                await client.set(email, '2201')
                return 1
            }
            else
                return 0;
        }
        catch (error) {
            console.error(error);
            throw new Error("Unknow Error");
        }
    }
}


export class verify_otp_service {
    async verify(email: string, otp: string, new_password: string) {
        try {
            const otp_redis = await client.get(email);
            if (otp_redis == otp) {
                const user = await updatePassword(email, new_password)
                client.del(email)
                return 1
            }
            else
                return 0
        }
        catch (error) {
            console.error(error);
            throw new Error("Unknow Error");
        }
    }
}