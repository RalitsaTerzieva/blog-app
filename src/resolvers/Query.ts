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
    }
}