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
    profile: (_parent: any, { userId }: { userId: string }, { prisma }: MyContext) => {
        return prisma.profile.findUnique({
            where: {
                userId: Number(userId) 
            }
        })
    },
}