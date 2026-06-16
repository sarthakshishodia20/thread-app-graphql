export const queries = {
    hello: () => "Hello World from GraphQL",
    say: (_: unknown, { name }: { name: string }) => `Hello, ${name}`,
};