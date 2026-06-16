export const typeDefs = `#graphql
  type Post {
    id: String!
    content: String!
    imageUrl: String
    authorId: String!
    createdAt: String
  }

  type Query {
    getAllPosts: [Post]
  }

  type Mutation {
    createPost(content: String!, imageUrl: String): Boolean
  }
`;
