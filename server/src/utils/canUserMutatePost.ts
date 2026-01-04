import { MyContext } from "../context"

interface CanUserMutatePostParams {
    userId: number,
    postId: number, 
    prisma: MyContext["prisma"]
}

export const canUserMutatePost = async ({ userId, postId, prisma }: CanUserMutatePostParams) => {
    const user = await prisma.user.findUnique({
        where: {
            id: userId
        }
    });

    if(!user) {
        throw new Error("User not found!")
    }

    const post = await prisma.post.findUnique({
        where: {
            id: postId
        }
    });

    if(post?.authorId !== user.id) {
        throw new Error("You are not allowed to modify this post");
    }
}