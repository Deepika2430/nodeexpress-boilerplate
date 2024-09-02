import express, { Request, Response, NextFunction } from 'express';
import { logger } from './logger/log';
import 'dotenv/config';
import feedRouter from './routes/routes.feed';
import filterRouter from './routes/routes.filter';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import cors from 'cors';
import bodyParser from 'body-parser'
import * as OpenApiValidator from 'express-openapi-validator';
import { errorLogger, requestLogger } from './middleware/logger.middleware';
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express'; // Import ExpressAdapter
import { Queue } from 'bullmq';
import { PrismaClient } from '@prisma/client';
import { prismaConnection } from './connections';
import { jwtMiddleware } from "./middleware/jwt-authorization";
import queueRouter from './routes/routes.worker';
import config from './config';

const queue = new Queue(config.queue.GENERIC_WORKER_QUEUE, {
  connection: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
  },
});

const app = express();
const swaggerDocument = YAML.load(path.join(__dirname, 'swagger/swagger.yaml'));
const openApiSpecPath = path.join(__dirname, 'swagger/swagger.yaml');

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(requestLogger);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/bull-board/ui');

createBullBoard({
  queues: [
    new BullMQAdapter(queue),
  ],
  serverAdapter,
});

app.use('/bull-board/ui', serverAdapter.getRouter());
app.use(jwtMiddleware);
app.use(
  OpenApiValidator.middleware({
    apiSpec: openApiSpecPath,
    validateRequests: true,
    validateResponses: true
  })
);
app.use(feedRouter);
app.use(filterRouter);
app.use(workerRouter);
app.use(errorLogger);

export let connection: PrismaClient;

export function startServer(options: { port: number }) {
  const server = app.listen(options.port, () => {
    logger.info(`Server is listening on port: ${options.port}`);
  });

  process.on('SIGTERM', async () => {
    logger.info('SIGTERM signal received: closing HTTP server');
    server.close(async () => {
      logger.info('Server closed');
      if (connection) {
        try {
          await prismaConnection.$disconnect();
          logger.info('Prisma client disconnected');
        } catch (error) {
          logger.error(`Error disconnecting prisma client: ${error}`);
        }
      }
      process.exit(0);
    });
  });
}
