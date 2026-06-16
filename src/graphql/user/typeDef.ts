export const typeDefs = `#graphql
  type User {
    id: String!
    firstName: String!
    lastName: String!
    email: String!
    profileImageUrl: String
  }

  type Query {
    hello: String
    say(name: String): String
  }

  type Mutation {
    createUser(firstName: String!, lastName: String!, email: String!, password: String!): Boolean
  }
`;