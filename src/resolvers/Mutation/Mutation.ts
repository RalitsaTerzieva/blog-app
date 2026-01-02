import { Post } from "../../generated/prisma/client";
import { MyContext } from "../../context";

interface PostCreateArgs {
    post: {
        title?: string
        content?: string
    }
}

interface PostPayloadType {
    userErrors: {
        message: string
    }[],
    post: Post | null
}

export const Mutation = {
    postCreate: async (_parent: any, { post }: PostCreateArgs, context: MyContext): Promise<PostPayloadType> => {
        const { title, content } = post;
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
        
        const newPost = await context.prisma.post.create({
          data: {
            title,
            content,
            authorId: 1,
          },
        });

        return {
            userErrors: [],
            post: newPost
        }
    },
    postUpdate: async (_parent: any, { post, postId }: {postId: string, post: PostCreateArgs["post"]}, { prisma }: MyContext) => {
        const { title, content } = post;

        if(!title && !content) {
            return {
                userError: [
                    {message: "Need to have at least one field to update!"}
                ],
                post: null
            }
        }

       const existingPost = await prisma.post.findUnique({
        where: {
            id: Number(postId)
        }
       });

       if(!existingPost) {
            return {
                userError: [
                    {message: "Post does not exist!"}
                ],
                post: null
            }
        }

        let payloadToUpdate = {
            title,
            content
        }

        if(!title) delete payloadToUpdate.title ;
        if(!content) delete payloadToUpdate.content;

        return {
            userError: [],
            post: prisma.post.update({
                data: {
                    ...payloadToUpdate
                },
                where: {
                    id: Number(postId)
                }
            })
        }
    },
    postDelete: async (_parent: any, { postId }: {postId: string}, { prisma }: MyContext) => {
       const post = await prisma.post.findUnique({
        where: {
            id: Number(postId)
        }
       })

       if(!post) {
            return {
                userError: [
                    {message: "Post does not exist!"}
                ],
                post: null
            }
        }

        await prisma.post.delete({
            where: {
                id: Number(postId)
            }
        })

        return {
            userErrors: [],
            post
        }
    },
    signup: () => {
        
    }
}