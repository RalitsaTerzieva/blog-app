import { ApolloServer } from "@apollo/server";

export const typeDefs = `#graphql
  type Query {
    hello: String!
  }
  `