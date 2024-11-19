import path from 'path';

import express, { Request } from 'express';
import session from 'express-session';
import cors from 'cors';
import bodyParser from 'body-parser';
import bodyParserXml from 'body-parser-xml';
import swaggerUi from 'swagger-ui-express';

import { logger } from './logger/log';
import config from './config';
import { errorLogger, requestLogger } from './middleware/logger.middleware';
import jwtAuthMiddleware from "./middleware/jwt.middleware";
import { handleLogin, handleLogout, redirectToAuthorizationUrl, setSessionVariable } from "./middleware/auth.middleware";
import { checkRolesAndPermissions } from './middleware/rbac.middleware';
import { openApiValidator } from './middleware/openApiValidator.middleware';
import bullBoardUI from './middleware/bullBoard.middleware';
import { prismaConnection } from './connections';
import { swaggerUiInstance } from './utils/utils.swagger';
import filterRouter from './routes/routes.filter';
import feedRouter from './routes/routes.feed';
import queueRouter from './routes/routes.queue';

export const app: express.Express = express();

app.use(session({
  secret: 'Microservices Boilerplate',
  resave: false,
  saveUninitialized: true,
}));

app.use(cors());
app.use(express.static(path.join(__dirname, './public')));

bodyParserXml(bodyParser);
app.use(bodyParser.xml({
  limit: '1MB',
  xmlParseOptions: { explicitArray: false }
}));
app.use(express.text());
app.use(express.json());

app.use("/api-docs/oauth2-redirect.html", handleLogin);
app.get("/authorize", redirectToAuthorizationUrl);
app.use("/api-docs", swaggerUi.serve, swaggerUiInstance);

app.use('/bull-board/ui', bullBoardUI); // Serving bull-board ui
app.get('/', (req: Request, res) => {
  res.redirect('/api-docs'); // Redirect to swagger UI
});
app.get('/queue-admin', (req, res) => {
  res.redirect(`http://localhost:5173`); // Redirect to queue admin
});

app.use(setSessionVariable); // Sets the token as a session variable
app.use("/logout", handleLogout); // Destroys the session variable on logout
app.use(requestLogger); // Logs requested routes for monitoring
app.use(openApiValidator); // Validates requests against the OpenAPI specification
app.use(jwtAuthMiddleware); // Validates JWT tokens for authentication
app.use(checkRolesAndPermissions); // Checks user roles and permissions for route access
app.use(filterRouter);
app.use(feedRouter);
app.use(queueRouter);
app.use(errorLogger); // Logs errors that occur during request processing

export function startServer(options: { port: number }) {
  const server = app.listen(options.port, config.app.host, () => {
    logger.info(`Server is listening on port: ${options.port}`);
  });

  process.on('SIGTERM', async () => {
    logger.info('SIGTERM signal received: closing HTTP server');
    server.close(async () => {
      logger.info('Server closed');
      if (prismaConnection) {
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