import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import { prismaClient } from "./lib/db.js";

async function init(){
    const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

const gqlServer = new ApolloServer({
    typeDefs:`
    type Query{
        hello: String
        say(name:String): String
    }
    type Mutation{
       createUser(firstName:String!, lastName: String!, email: String!, password: String!): Boolean
    }`, //Schema
    
    resolvers:{
        Query:{
            hello: () => "Hello World from GraphQL",
            say:(_,{name}:{name:String}) => `Hello, ${name}`,
        },
        Mutation:{
            createUser:async(_,{firstName,lastName,email,password}:{firstName:string,lastName:string,email:string,password:string})=>{
                await prismaClient.user.create({
                    data :{
                        firstName,
                        lastName,
                        email,
                        password,
                        salt:"randomSALT",
                    }
                })
                return true;
            }
        }
    } // Resolvers Object 
})

app.get("/", (req, res) => {
    res.json(
        {
            message: "Server is up and running"
        }
    );
});
await gqlServer.start();

app.use("/graphql",expressMiddleware(gqlServer));
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
}

init();