import fs from "fs-extra";
import bcrypt from "bcrypt";
import path from "path";

const usersPath = path.resolve("db/users.json");
const todosPath = path.resolve("db/todos.json");
const SALT_ROUNDS = 10;

// Users
const readUsers = () => fs.readJSON(usersPath);
const writeUsers = (data) => fs.writeJSON(usersPath, data, { spaces: 2 });

// Todos
const readTodos = () => fs.readJSON(todosPath);
const writeTodos = (data) => fs.writeJSON(todosPath, data, { spaces: 2 });

export const resolvers = {
  Query: {
    users: async () => {
      const db = await readUsers();
      return db.users.map(({ password, ...user }) => user); // hide password
    },

    todos: async (_, { userId }) => {
      const db = await readTodos();
      return db.todos.filter((todo) => todo.userId === userId);
    },
  },

  Mutation: {
    register: async (_, { username, password }) => {
      const db = await readUsers();
      const exists = db.users.find((u) => u.username === username);
      if (exists) throw new Error("User already exists");

      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
      const newUser = {
        id: Date.now().toString(),
        username,
        password: hashedPassword,
      };

      db.users.push(newUser);
      await writeUsers(db);
      return { id: newUser.id, username: newUser.username };
    },

    login: async (_, { username, password }) => {
      const db = await readUsers();
      const user = db.users.find((u) => u.username === username);
      if (!user) throw new Error("User not found");

      const match = await bcrypt.compare(password, user.password);
      if (!match) throw new Error("Incorrect password");

      return { id: user.id, username: user.username };
    },

    addTodo: async (_, { userId, text }) => {
      const db = await readTodos();
      const newTodo = {
        id: Date.now().toString(),
        userId,
        text,
      };
      db.todos.push(newTodo);
      await writeTodos(db);
      return newTodo;
    },

    deleteTodo: async (_, { id }) => {
      const db = await readTodos();
      const index = db.todos.findIndex((todo) => todo.id === id);
      if (index === -1) throw new Error("Todo not found");

      db.todos.splice(index, 1);
      await writeTodos(db);
      return true;
    },

    updateTodo: async (_, { id, text }) => {
      const db = await readTodos();
      const todo = db.todos.find((t) => t.id === id);
      if (!todo) throw new Error("Todo not found");

      todo.text = text;
      await writeTodos(db);
      return todo;
    },
  },
};
