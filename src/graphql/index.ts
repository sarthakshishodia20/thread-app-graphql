import { ApolloServer } from "@apollo/server";
import { User } from "./user/index.js";

export async function createGqlServer() {
    const gqlServer = new ApolloServer({
        typeDefs: [
            User.typeDefs,   // User module ka poora schema (Query + Mutation + Types)
        ],
        resolvers: {
            Query: {
                ...User.resolvers.Query,
            },
            Mutation: {
                ...User.resolvers.Mutation,
            }
        }
    });
    return gqlServer;
}