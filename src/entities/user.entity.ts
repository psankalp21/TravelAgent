import { User } from "../database/models/user.model";


export async function ifEmailExists(email: string) {
    const user = await User.findOne({ where: { email } })
    return user
}

export async function ifPhoneExists(phone: string) {
    const user = await User.findOne({ where: { phone } })
    if (user)
        return true
    else
        return false
}

export async function addUser(name: string, email: string, password: string, dob: string, phone: string) {
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
        console.error(error);
        throw new Error("Failed to create user");
    }
}

export async function login(email: string,password:string) {
    const user = await User.findOne({ where: { email:email , password:password} })
    return user
}


export async function updatePassword(email: string,new_password:string) {
    const user = await User.findOne({where:{email:email}})
    user.password=new_password;
    return user
}
