import { MyContext } from "../../context";
import validator from 'validator';
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";
import { JWT_SIGNATURE } from "../../constants.js";

interface signupArgs {
    email: string;
    name: string;
    bio: string;
    password: string;
}

interface UserPayload {
    userErrors: {
            message: string
        }[],
        token: String | null 
}

export const authResolvers = {
    signup: async (_parent: any, {email, name, bio, password}: signupArgs, { prisma }: MyContext): Promise<UserPayload> => {
        const isEmail = validator.isEmail(email);

        if(!isEmail) {
            return {
                userErrors: [{
                    message: "Invalid email!"
                }],
                token: null
            }
        }

        const isValidPassword = validator.isLength(password, {
            min: 5
        })

        if(!isValidPassword) {
            return {
                userErrors: [{
                    message: "Your password should be at least 5 characters long!"
                }],
                token: null
            }
        }

        if(!name || !bio) {
            return {
                userErrors: [{
                    message: "Invalid name or bio!"
                }],
                token: null
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword
            }
        })


        const token = JWT.sign({
            userId: user.id,
            email: user.email
        }, JWT_SIGNATURE, {expiresIn: 3600000})

        return {
                userErrors: [],
                token: token
            }
    }
}