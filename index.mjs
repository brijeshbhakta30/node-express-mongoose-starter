
import debugLib from 'debug';
import mongoose from 'mongoose';
import { inspect } from 'node:util';

// Config should be imported before importing any other file
import config from './src/config.mjs';
// eslint-disable-next-line perfectionist/sort-imports -- To value the env variables before importing the app
import server from './src/app.mjs';

const debug = debugLib('node-server:index');
// Connect mongo db
const { mongo } = config;
mongoose.connect(mongo.host, {
  autoIndex: true,
  ssl: mongo.ssl,
}).then(() => {
  debug(`connected to MongoDB at ${mongo.host}`);
  return true;
// eslint-disable-next-line unicorn/prefer-top-level-await
}).catch(error => {
  debug(`unable to connect to MongoDB at ${mongo.host}`, error);
  throw new Error(`unable to connect to database: ${mongo.host}`, error);
});

mongoose.connection.on('error', error => {
  throw new Error(`unable to connect to database: ${mongo.host}`, error);
});

// Print mongoose logs in dev env
if (config.mongooseDebug) {
  mongoose.set('debug', (collectionName, method, query, document) => {
    debug(`${collectionName}.${method}`, inspect(query, false, 20), document);
  });
}

// Listen on port config.port
server.listen(config.port, () => {
  debug(`server started on port ${config.port} (${config.env})`);
}).on('close', async () => {
  debug('server closed');
  try {
    await mongoose.disconnect();
  } catch (error) {
    debug('Error while disconnecting mongoose:', error);
  }
});

// eslint-disable-next-line unicorn/prefer-export-from
export default server;
