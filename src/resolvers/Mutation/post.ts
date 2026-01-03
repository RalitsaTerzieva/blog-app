import { MyContext } from "../../context";
import { Post } from "../../generated/prisma/client";
import { canUserMutatePost } from "../../utils/canUserMutatePost.js";


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

export const postResolvers = {
        postCreate: async (_parent: any, { post }: PostCreateArgs, {prisma, userInfo}: MyContext): Promise<PostPayloadType> => {
            
            if(!userInfo) {
                return {
                  userErrors: [
                    {
                      message:
                        "You must login first!",
                    },
                  ],
                  post: null,
                };
            }
            
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
            
            const newPost = await prisma.post.create({
              data: {
                title,
                content,
                authorId: userInfo.userId
              },
            });
    
            return {
                userErrors: [],
                post: newPost
            }
        },
        postUpdate: async (_parent: any, { post, postId }: {postId: string, post: PostCreateArgs["post"]}, { prisma, userInfo }: MyContext) => {
             if(!userInfo) {
                return {
                  userErrors: [
                    {
                      message:
                        "You must login first!",
                    },
                  ],
                  post: null,
                };
            }

            try {
                await canUserMutatePost({
                    userId: userInfo.userId,
                    postId: Number(postId),
                    prisma,
                });
            } catch (err: any) {
                return {
                    userErrors: [{ message: err.message }],
                    post: null,
                };
            }

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
        postDelete: async (_parent: any, { postId }: {postId: string}, { prisma, userInfo }: MyContext) => {
            if(!userInfo) {
                return {
                  userErrors: [
                    {
                      message:
                        "You must login first!",
                    },
                  ],
                  post: null,
                };
            }

            try {
                await canUserMutatePost({
                    userId: userInfo.userId,
                    postId: Number(postId),
                    prisma,
                });
            } catch (err: any) {
                return {
                    userErrors: [{ message: err.message }],
                    post: null,
                };
            }

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
}