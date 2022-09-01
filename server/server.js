const express = require('express');
const { createServer } = require("http");
const path = require('path');
const  { ApolloServer } = require('apollo-server-express');

const db = require('./config/connection');

const { typeDefs, resolvers } = require("./schemas");
const { authMiddleware } = require('./utils/auth');

const startServer = async () => {

const app = express();
const httpServer = createServer(app)

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});

await apolloServer.start();
apolloServer.applyMiddleware({ app });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

db.once('open', () => {
  httpServer.listen({ port: process.env.PORT || 9000 }, () =>
      console.log(`Server listening on http://localhost:9000${apolloServer.graphqlPath}`)
    )
});

}

startServer();