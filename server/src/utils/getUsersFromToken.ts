import JWT from 'jsonwebtoken';
import { JWT_SIGNATURE } from '../constants.js';

export const getUsersFromToken = (token: string) => {
    try { 
        return JWT.verify(token, JWT_SIGNATURE) as {userId: number}
    } catch (error) {
        return null
    }    
}