import Hapi from '@hapi/hapi';
import authroutes from './routes/authroutes'
// import { getDistance } from './controllers/google_api.controller';
import dotenv from 'dotenv';
import { sequelize } from './database/db.connection';
import { User } from './database/models/user.model';
import { Agent } from './database/models/agent.model';
import agentRoutes from './routes/agent.routes';
import { Driver } from './database/models/driver.model';
import { Taxi } from './database/models/taxi.model';
import { Booking } from './database/models/booking.model';
import userRoutes from './routes/user.routes';
import hapiswagger from 'hapi-swagger';
import inert from '@hapi/inert';
import vision from '@hapi/vision'
import Session from './database/models/session.model';
// import { user_forgot_password_controller, user_login_controller, user_signup_controller, user_verify_otp } from './controllers/auth.controller';


dotenv.config();
const PORT = process.env.PORT || 4000;

const init = async () => {
  const server = Hapi.server({
    port: PORT,
    host: 'localhost',
  });


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
  ]);

  server.route(authroutes)
  server.route(agentRoutes)
  server.route(userRoutes)

  await server.start();
  console.log('Server running on %s', server.info.uri);

  sequelize.sync().then(() => {
    User.sync();
    Agent.sync();
    Driver.sync();
    Taxi.sync();
    Booking.sync();
    Session.sync();
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
