import { userInfo } from "node:os";
import { MyContext } from "../context";

export const Query = {
    posts: async (_parent: any, _args: any, { prisma }: MyContext ) => {
        const posts = await prisma.post.findMany({
            orderBy: [
                {
                    createdAt: "desc"
                }
            ]
        })

        return posts
    },
    me: (_parent: any, _args: any, { userInfo, prisma }: MyContext) => {
        if(!userInfo) return null;

        return prisma.user.findUnique({
            where: {
                id: userInfo.userId
            }
        })
    },
    profile: async (_parent: any, { userId }: { userId: string }, { prisma, userInfo }: MyContext) => {
        console.log("userInfo in profile resolver:", userInfo);
        console.log("profile userId:", userId);
        const isMyProfile = Number(userId) === userInfo?.userId;
        const profile = await prisma.profile.findUnique({
            where: {
                userId: Number(userId) 
            }
        })

        if(!profile) return null;

        return {
            ...profile,
            isMyProfile
        }
    },
}