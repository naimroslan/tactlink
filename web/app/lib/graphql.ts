import { GraphQLClient, gql } from 'graphql-request';

const endpoint = 'http://localhost:4000'; // adjust if needed
export const client = new GraphQLClient(endpoint);

export const LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      id
      username
    }
  }
`;

export const REGISTER = gql`
  mutation Register($username: String!, $password: String!) {
    register(username: $username, password: $password) {
      id
      username
    }
  }
`;

export const GET_TODOS = gql`
  query Todos($userId: ID!) {
    todos(userId: $userId) {
      id
      text
    }
  }
`;

export const ADD_TODO = gql`
  mutation AddTodo($userId: ID!, $text: String!) {
    addTodo(userId: $userId, text: $text) {
      id
      text
    }
  }
`;

export const DELETE_TODO = gql`
  mutation DeleteTodo($id: ID!) {
    deleteTodo(id: $id)
  }
`;

export const UPDATE_TODO = gql`
  mutation UpdateTodo($id: ID!, $text: String!) {
    updateTodo(id: $id, text: $text) {
      id
      text
    }
  }
`;
