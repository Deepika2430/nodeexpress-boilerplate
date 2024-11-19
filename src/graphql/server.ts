import { ApolloServer } from 'apollo-server-express';
import express, { Request, Response } from 'express';
import { GraphQLSchema } from 'graphql';

import { logger } from '../logger/log';

import { schema } from './schema';
import { createContext } from './context';


const PORT: number = 5000;
const app = express();

app.use('/greet', (req: Request, res: Response) => {
  res.send({ msg: "Hello World!" });
});

const server = new ApolloServer({
  schema:(schema as unknown) as GraphQLSchema,
  context: createContext,
});

async function startServer() {
  await server.start();
  server.applyMiddleware({ app });

  app.listen(PORT, () => {
    logger.info(`Server running at http://localhost:${PORT}${server.graphqlPath}`);
  });
}

startServer();
