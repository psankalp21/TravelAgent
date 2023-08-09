import Hapi from '@hapi/hapi';

import { getDistance } from './controllers/google_api.controller';
import { getFuelPrices } from './controllers/fuel_price.controller';
import dotenv from 'dotenv';
import { sequelize } from './database/db.connection';
import { User } from './database/models/user.model';
import { forgot_password_controller, login_controller, signup_controller, verify_otp } from './controllers/auth.controller';


dotenv.config();
const PORT = process.env.PORT || 4000;

const init = async () => {
  const server = Hapi.server({
    port: PORT,
    host: 'localhost',
  });
  server.route({
    method: 'POST',
    path: '/get_distance',
    handler: getDistance,
  },);
  server.route({
    method: 'GET',
    path: '/fuel_price',
    handler: getFuelPrices,
  });
  server.route({
    method: 'POST',
    path: '/signup',
    handler: signup_controller,
  });
  server.route({
    method: 'POST',
    path: '/login',
    handler: login_controller,
  });
  server.route({
    method: 'POST',
    path: '/forgot_password',
    handler: forgot_password_controller,
  });
  server.route({
    method: 'POST',
    path: '/verify_otp',
    handler: verify_otp,
  });


  await server.start();
  console.log('Server running on %s', server.info.uri);

  sequelize.sync().then(() => {
    User.sync();
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
