import { MyContext } from "../context";


interface PostParentType {
  authorId: number;
}

export const Post = {
  user: (parent: PostParentType, __: any, { prisma }: MyContext) => {
    return prisma.user.findUnique({
        where: {
            id: parent.authorId
        }
    })
  },
};