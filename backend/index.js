import { ApolloServer } from "apollo-server";
import { typeDefs } from "./utils/schema.js";
import { resolvers } from "./utils/resolvers.js";

const server = new ApolloServer({
  typeDefs,
  resolvers,
  cors: {
    origin: "https://tactlink.vercel.app",
    credentials: true,
  },
});

server.listen({ port: 4000, host: "0.0.0.0" }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
