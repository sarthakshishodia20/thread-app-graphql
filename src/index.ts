import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";

async function init(){
    const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

const gqlServer = new ApolloServer({
    typeDefs:`
    type Query{
        hello: String
        say(name:String): String
    }`, //Schema
    resolvers:{
        Query:{
            hello: () => "Hello World from GraphQL",
            say:(_,{name}:{name:String}) => `Hello, ${name}`,
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