const express = require('express');
const { createServer } = require("http");
const path = require('path');
const  { ApolloServer } = require('apollo-server-express');

const db = require('./config/connection');

const { typeDefs, resolvers } = require("./schemas");
const { authMiddleware } = require('./utils/auth');

  const app = express();
  const PORT = process.env.PORT || 3001;

  const httpServer = createServer(app)

  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: authMiddleware,
  });

    app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

    // if we're in production, serve client/build as static assets
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
  }

  app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/"))
  })
  
const startServer = async () => {

  await apolloServer.start();
  apolloServer.applyMiddleware({ app });

  db.once('open', () => {
    httpServer.listen(PORT, () =>
        console.log(`Server listening on http://127.0.0.1:${PORT}${apolloServer.graphqlPath}`)
      )
  });

}

startServer();