import { MyContext } from "../index";

interface PostCreateArgs {
    title: string
    content: string
}

export const Mutation = {
    postCreate: (_parent: any, {title, content}: PostCreateArgs, context: MyContext) => {
        context.prisma.post.create({
            data: {
                title,
                content,
                authorId: 1
            }
        })
    }
}