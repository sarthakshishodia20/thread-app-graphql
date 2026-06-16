import { prismaClient } from "../lib/db.js";
import { createHmac, randomBytes } from "node:crypto";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "";
export interface CreateUserPayload {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface CreateLoginPayload{
    email: string;
    password: string;
}

class UserService {
    public static async createUser(payload: CreateUserPayload) {
        const { firstName, lastName, email, password } = payload;

        const salt = randomBytes(32).toString("hex");
        const hashedPassword = this.generateHashPassword(password, salt);

        return prismaClient.user.create({
            data: {
                firstName,
                lastName,
                email,
                password: hashedPassword,
                salt,
            }
        });
    }

    public static getUserByEmail(email:string){
        return prismaClient.user.findUnique({
            where:{
                email
            }
        })
    }

    private static generateHashPassword(password:string, salt:string){
        const hashedPassword = createHmac("sha256", salt).update(password).digest("hex");
        return hashedPassword
    }
    
    public static async getUserToken(payload: CreateLoginPayload){
        const {email, password} = payload;
        const user = await UserService.getUserByEmail(email);
        if(!user) throw new Error("User not found");

        // Input password ko user ke salt se hash karo, phir DB se compare karo
        const hashedPassword = this.generateHashPassword(password, user.salt);
        if(hashedPassword !== user.password) throw new Error("Invalid password");

        // JWT mein sirf id aur email — password KABHI nahi daalna!
        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);
        return token;
    }
}

export default UserService;