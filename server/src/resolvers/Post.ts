import { MyContext } from "../context.js";
import { userLoader } from "../loaders/userLoader.js";


interface PostParentType {
  authorId: number;
}

export const Post = {
  user: (parent: PostParentType, __: any, { prisma }: MyContext) => {
    return userLoader.load(parent.authorId)
  },
};