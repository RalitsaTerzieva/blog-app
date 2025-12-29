import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "./schema.js";
import { Query, Mutation } from "./resolvers/inex.js";
import { PrismaClient } from './generated/prisma/client.js';

const prisma = new PrismaClient();

export interface MyContext {
  prisma: PrismaClient;
}

const server = new ApolloServer({
  typeDefs,
  resolvers: {
    Query, 
    Mutation
  }
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async (): Promise<MyContext> => {
    return { prisma };
  }
});

console.log(`🚀 Server ready at ${url}`);