import { MyContext } from "../../context";
import validator from 'validator';
import { User } from "../../generated/prisma/client";

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
        user: User | null 
}

export const authResolvers = {
    signup: async (_parent: any, {email, name, bio, password}: signupArgs, { prisma }: MyContext): Promise<UserPayload> => {
        const isEmail = validator.isEmail(email);

        if(!isEmail) {
            return {
                userErrors: [{
                    message: "Invalid email!"
                }],
                user: null
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
                user: null
            }
        }

        if(!name || !bio) {
            return {
                userErrors: [{
                    message: "Invalid name or bio!"
                }],
                user: null
            }
        }


        return {
                userErrors: [],
                user: null
            }
    }
}