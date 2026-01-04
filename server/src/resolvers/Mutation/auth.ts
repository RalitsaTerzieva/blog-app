import { MyContext } from "../../context.js";
import validator from 'validator';
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";
import { JWT_SIGNATURE } from "../../constants.js";

interface signupArgs {
    credentials: {
        email: string,
        password: string;
    }
    name: string;
    bio: string;
}

interface signinArgs {
    credentials: {
        email: string,
        password: string;
    }
}


interface UserPayload {
    userErrors: {
            message: string
        }[],
        token: String | null 
}

export const authResolvers = {
    signup: async (_parent: any, {credentials, name, bio}: signupArgs, { prisma }: MyContext): Promise<UserPayload> => {
        const { email, password } = credentials;
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

        await prisma.profile.create({
           data: {
                bio,
                user: { connect: { id: user.id } },
            },
        })

        const token = JWT.sign({
            userId: user.id
        }, JWT_SIGNATURE, {expiresIn: 3600000})

        return {
                userErrors: [],
                token: token
            }
    },
    signin: async (_parent: any, { credentials }: signinArgs, { prisma }: MyContext): Promise<UserPayload> => {
        const { email, password } = credentials;
        const user = await prisma.user.findUnique({
            where: {
                email
            }
        });

        if(!user) {
            return {
                userErrors: [{
                    message: "Invalid credentials!"
                }],
                token: null
            }
        }

        const isMatch = await bcrypt.compare(password, user.password)
       
        if(!isMatch) {
            return {
                userErrors: [{
                    message: "Invalid credentials!"
                }],
                token: null
            }
        }


        return {
            userErrors: [],
            token: JWT.sign({userId: user.id}, JWT_SIGNATURE, {expiresIn: 3600000})
        }

    },
}