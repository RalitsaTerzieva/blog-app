import { Post } from "../generated/prisma/client";
import { MyContext } from "../context";

interface PostCreateArgs {
    title: string
    content: string
}

interface PostPayloadType {
    userErrors: {
        message: string
    }[],
    post: Post | null
}

export const Mutation = {
    postCreate: async (_parent: any, {title, content}: PostCreateArgs, context: MyContext): Promise<PostPayloadType> => {
        if(!title || !content) {
            return {
              userErrors: [
                {
                  message:
                    "You must provide a title and a content to create a post!",
                },
              ],
              post: null,
            };
        }
        
        const post = await context.prisma.post.create({
          data: {
            title,
            content,
            authorId: 1,
          },
        });

        return {
            userErrors: [],
            post
        }
    }
}