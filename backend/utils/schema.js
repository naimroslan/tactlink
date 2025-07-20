import { gql } from "apollo-server";

export const typeDefs = gql`
  type User {
    id: ID!
    username: String!
  }

  type Todo {
    id: ID!
    text: String!
    userId: ID!
  }

  type Query {
    users: [User!]!
    todos(userId: ID!): [Todo!]!
  }

  type Mutation {
    register(username: String!, password: String!): User
    login(username: String!, password: String!): User
    addTodo(userId: ID!, text: String!): Todo
    deleteTodo(id: ID!): Boolean
    updateTodo(id: ID!, text: String!): Todo
  }
`;
