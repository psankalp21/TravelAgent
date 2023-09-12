import Hapi from '@hapi/hapi';
import authroutes from './routes/authroutes'
import agentRoutes from './routes/agent.routes';
import userRoutes from './routes/user.routes';
import hapiswagger from 'hapi-swagger';
import inert from '@hapi/inert';
import vision from '@hapi/vision'
import Session from './database/models/session.model';
import { sequelize } from './database/db.connection';
import { User } from './database/models/user.model';
import { Agent } from './database/models/agent.model';
import { Driver } from './database/models/driver.model';
import { Taxi } from './database/models/taxi.model';
import { Booking } from './database/models/booking.model';
import { Category } from './database/models/category.model';
import errorHandlingMiddleware from './middleware/errorhandle';
import { startScheduler } from './utils/cron'
import HapiRateLimitor from 'hapi-rate-limitor';
import dotenv from 'dotenv';
import path from 'path';
import { messageQueue } from './utils/worker';

dotenv.config();
const PORT = process.env.PORT || 4000;

const init = async () => {
  const server = Hapi.server({
    port: PORT,
    host: 'localhost',
  });

  const rateLimiterOptions: HapiRateLimitor.Options = {
    redis: {
      port: 6379,
      host: '127.0.0.1',
    },
    extensionPoint: 'onPreAuth',
    namespace: 'hapi-rate-limitor',
    max: 1,
    duration: 3600000,
    userAttribute: 'id',
    userLimitAttribute: 'rateLimit',
    enabled: true,
    // ipWhitelist: ['127.0.0.1'], // List of IP addresses skipping rate limiting
    getIp: async (request: Hapi.Request) => {
      const ips = request.headers['x-forwarded-for']?.split(',');
      return ips ? ips[ips.length - 1].trim() : request.info.remoteAddress;
    },
    emitter: null, 
  };
  

  await server.register([
    inert,
    vision,
    {
      plugin: hapiswagger,
      options: {
        info: {
          title: 'API Documentation',
          version: '1.0.0',
        },
        securityDefinitions: {
          apiKey: {
            type: 'apiKey',
            name: 'Authorization',
            in: 'header'
          }
        },
        security: [{ apiKey: [] }],
        grouping: 'tags',
        tags: [
          { name: 'agentauth', description: 'Agent Authentication' },
          { name: 'userauth', description: 'Agent Authentication' },
          { name: 'agent', description: 'Agent based APIS' },
          { name: 'user', description: 'User based APIS' },
        ],
      }
    },
    {
      plugin: {
        name: 'errorHandlingPlugin',
        register: errorHandlingMiddleware,
      },
    },
    {
      plugin: HapiRateLimitor,
      options: rateLimiterOptions,
    }
  ]);

  server.route(authroutes)
  server.route(agentRoutes)
  server.route(userRoutes)
  await server.start();
  console.log('Server running on %s', server.info.uri);
  startScheduler();
  await messageQueue.startConsumer();



  const keyFilePath = path.join(__dirname, '../../drive.json');
  console.log(`Resolved Key File Path: ${keyFilePath}`);

  sequelize.sync().then(() => {
    User.sync();
    Agent.sync();
    Driver.sync();
    Taxi.sync();
    Booking.sync();
    Session.sync();
    Category.sync();
    console.log('Connection has been established successfully.');
  }).catch((error) => {
    console.error('Unable to connect to the database: ', error);
  });
};

process.on('unhandledRejection', (err) => {
  console.error('Unhandled promise rejection:', err);
  process.exit(1);
});

init();
