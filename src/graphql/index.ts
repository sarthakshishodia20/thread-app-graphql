import { ApolloServer } from "@apollo/server";
import { User } from "./user/index.js";
import { Post } from "./post/index.js";

export async function createGqlServer() {
    const gqlServer = new ApolloServer({
        typeDefs: [
            User.typeDefs,
            Post.typeDefs,
        ],
        resolvers: {
            Query: {
                ...User.resolvers.Query,
                ...Post.resolvers.Query,
            },
            Mutation: {
                ...User.resolvers.Mutation,
                ...Post.resolvers.Mutation,
            }
        }
    });
    return gqlServer;
}