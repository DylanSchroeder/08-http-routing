'use strict';

require('dotenv').config();

const server = require('./src/app');

const PORT = process.env.PORT;
if (!PORT) throw new Error('PORT not set!');

server.start(process.env.PORT)
  .then(() => console.log(`Listening on ${PORT}`));
