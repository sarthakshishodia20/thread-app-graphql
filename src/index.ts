import express from "express";
import { expressMiddleware } from "@as-integrations/express5";
import { createGqlServer } from "./graphql/index.js";
import UserService from "./services/userService.js";


async function init(){
    const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());


app.get("/", (req, res) => {
    res.json(
        {
            message: "Server is up and running"
        }
    );
});
const gqlServer= await createGqlServer();
await gqlServer.start();

app.use(
    "/graphql",
    expressMiddleware(gqlServer, {
        context: async ({ req }) => {
            const token = req.headers["authorization"];
            const user = UserService.decodeToken(token);
            return { user };
        },
    })
);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
}

init();