import "dotenv/config";
import { PrismaClient } from "./generated/prisma/client.js";

export const prisma = new PrismaClient();

export interface MyContext {
  prisma: PrismaClient;
  userInfo: {userId: number} | null
}
