// Config should be imported before importing any other file
const config = require('./src/config');

const debug = require('debug')('node-server:index');
const mongoose = require('mongoose');
const { inspect } = require('node:util');

const app = require('./src/app');

// Connect mongo db
const { mongo } = config;
mongoose.connect(mongo.host, {
  autoIndex: true,
  ssl: mongo.ssl,
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

// Note: module.parent check is required to support mocha watch
// src: https://github.com/mochajs/mocha/issues/1912
if (!module.parent) {
  // Listen on port config.port
  app.listen(config.port, () => {
    debug(`server started on port ${config.port} (${config.env})`);
  });
}

module.exports = app;
