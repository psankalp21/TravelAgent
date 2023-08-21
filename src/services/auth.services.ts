import { addUser, ifUserEmailExists, ifUserPhoneExists, Userlogin, updateUserPassword } from "../entities/user.entity";
import { addAgent, ifAgentEmailExists, ifAgentPhoneExists, Agentlogin, updateAgentPassword } from "../entities/agent.entity";
import { create_session, update_session } from "../entities/session.entity";
import { createClient } from 'redis';
import Jwt from 'jsonwebtoken';
import Session from "../database/models/session.model";
const client = createClient();
client.on('error', err => console.log('Redis Client Error', err));
client.connect();
// const otp_redis = await client.get(email);
export class signup_service {
    // signup for agent
    async agent_signup(name: string, email: string, password: string, dob: Date, phone: string) {
        const agent: any = await ifAgentEmailExists(email);
        if (!agent) {
            try {
                const check_phone: boolean = await ifAgentPhoneExists(phone);
                console.log(check_phone)
                if (check_phone == false) {
                    await addAgent(name, email, password, dob, phone);
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
    //signup for user
    async user_signup(name: string, email: string, password: string, dob: Date, phone: string) {
        const user: any = await ifUserEmailExists(email);
        if (!user) {
            try {
                const check_phone: boolean = await ifUserPhoneExists(phone);
                console.log(check_phone)
                if (check_phone == false) {
                    await addUser(name, email, password, dob, phone);
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
    async Userlogin(ip: string, email: string, password: string) {
        try {
            const user_email: any = await ifUserEmailExists(email);
            if (user_email) {
                const user = await Userlogin(email, password);
                if (!user) {
                    throw new Error("Invalid Password")
                }
                const token = Jwt.sign({ uid: user.id, type: "user" }, 'PS21', { expiresIn: '24h' });
                const key = `${user.id}_${ip}`;

                await client.hSet(key, {
                    'user_id': `${user.id}`,
                    'ip_address': `${ip}`,
                    'session': 'active'
                });
                const session = await Session.findByPk(key)
                console.log("----<><><> ", session)
                if (session) {
                    await update_session(key)
                    return token
                }
                else {
                    await create_session(key, user.id, ip)
                    return token
                }
            }
            else {
                throw new Error("User doesnot exists")
            }
        }
        catch (error) {
            console.error(error);
            throw new Error("Failed to login user");
        }
    }

    async AgentLogin(ip: string, email: string, password: string) {
        try {
            const agent_email: any = await ifAgentEmailExists(email);
            if (agent_email) {
                const agent = await Agentlogin(email, password);
                const key = `${agent.id}_${ip}`;

                if (!agent) {
                    throw new Error("Invalid Password")
                }
                const token = Jwt.sign({ aid: agent.id, type: "admin" }, 'PS21', { expiresIn: '1h' });
                await client.hSet(key, {
                    'agent_id': `${agent.id}`,
                    'ip_address': `${ip}`,
                    'session': 'active'
                });
                const session = await Session.findByPk(key)
                if (session) {
                    await update_session(key)
                    return token
                }
                else {
                    await create_session(key, agent.id, ip)
                    return token
                }
            }
            else {
                throw new Error("Account doesnot exists")
            }
        }
        catch (error) {
            console.error(error);
            throw new Error("Failed to login");
        }
    }


    // async UserLogout() {
    //     try {
    //         if (user_email) {
    //             const user = await Userlogin(email, password);
    //             if (!user) {
    //                 throw new Error("Invalid Password")
    //             }
    //             const token = Jwt.sign({ uid: user.id, type: "user" }, 'PS21', { expiresIn: '1h' });

    //             await client.hSet(`${user.id}_${ip}`, {
    //                 'user_id': `${user.id}`,
    //                 'ip_address': `${ip}`,
    //                 'session': 'active'
    //               });

    //             return token;

    //         }
    //         else {
    //             throw new Error("User doesnot exists")
    //         }
    //     }
    //     catch (error) {
    //         console.error(error);
    //         throw new Error("Failed to login user");
    //     }
    // }
}


export class user_forgot_password_service {
    async Userforgot_pwd(email: string) {
        try {
            const user_email: any = await ifUserEmailExists(email);
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


export class user_verify_otp_service {
    async Userverify(email: string, otp: string, new_password: string) {
        try {
            const otp_redis = await client.get(email);
            if (otp_redis == otp) {
                const user = await updateUserPassword(email, new_password)
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