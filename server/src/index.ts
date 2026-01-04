import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "./schema.js";
import { Query, Mutation, Profile, Post } from "./resolvers/inex.js";
import { prisma, MyContext } from "./context.js";
import { getUsersFromToken } from "./utils/getUsersFromToken.js";

const server = new ApolloServer({
  typeDefs,
  resolvers: {
    Query, 
    Mutation,
    Profile,
    Post
  }
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req }): Promise<MyContext> => {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.replace("Bearer ", "");

    let userInfo: MyContext["userInfo"] = null;
    
    if (token) {
      try {
        userInfo = getUsersFromToken(token);
      } catch (err) {
        console.warn("Invalid JWT token:", err);
        userInfo = null;
      }
    }
    return { 
      prisma, 
      userInfo 
    };
  }
});

console.log(`🚀 Server ready at ${url}`);