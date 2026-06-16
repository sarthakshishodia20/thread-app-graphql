import UserService from "../../services/userService.js";

export const queries = {
    hello: () => "Hello World from GraphQL",
    say: (_: unknown, { name }: { name: string }) => `Hello, ${name}`,
    getUserToken: (_: unknown, payload: { email: string; password: string }) =>
        UserService.getUserToken(payload),
};