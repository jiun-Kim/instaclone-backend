require("dotenv").config();

import * as http from "http"
import * as express from "express"
import { ApolloServer } from "apollo-server-express";
import * as morgan from "morgan"
import client from "./client";
import { resolvers, typeDefs } from "./schema";
import { getUser } from "./users/users.utils";

const apollo = new ApolloServer({
  resolvers,
  typeDefs,
  context: async (ctx) => {
    if (ctx.req) {
      return {
        loggedInUser: await getUser(ctx.req.headers.token),
        client,
      };
    } else {
      const {
        connection: { context }
      } = ctx
      return {
        loggedInUser: context.loggedInUser,
        client
      }
    }
  },
  subscriptions: {
    onConnect: async ({ token }: any) => {
      if (!token) {
        throw Error("You can't listen!")
      }
      const loggedInUser = await getUser(token)
      return { loggedInUser }
    }
  }
});

const PORT = process.env.PORT;

const app = express()

const httpServer = http.createServer(app)

app.use(morgan("tiny"))

apollo.applyMiddleware({ app })
apollo.installSubscriptionHandlers(httpServer)

httpServer.listen(PORT, () => console.log(`🚀 Server is running on http://localhost:${PORT}/graphql ✅`))