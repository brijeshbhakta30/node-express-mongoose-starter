import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compress from 'compression';
import methodOverride from 'method-override';
import cors from 'cors';
import httpStatus from 'http-status';
import expressWinston from 'express-winston';
import expressValidation from 'express-validation';
import helmet from 'helmet';
import winstonInstance from './winston';
import config from './env';
import routes from '../components/routes';
import APIError from '../helpers/APIError';

const app = express();

// parse body params and attache them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(compress());
app.use(methodOverride());

// secure apps by setting various HTTP headers
app.use(helmet());

// enable CORS - Cross Origin Resource Sharing
app.use(cors());

// enable detailed API logging in dev env
if (config.env === 'development') {
  expressWinston.requestWhitelist.push('body');
  expressWinston.responseWhitelist.push('body');
  app.use(expressWinston.logger({
    winstonInstance,
    meta: false, // optional: log meta data about request (defaults to true)
    msg: 'HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms',
    colorStatus: true // Color the status code (default green, 3XX cyan, 4XX yellow, 5XX red).
  }));
}

// mount all routes on / path
app.use('/', routes);

// if error is not an instanceOf APIError, convert it.
app.use((err, req, res, next) => {
  if (err instanceof expressValidation.ValidationError) {
    // validation error contains errors which is an array of error each containing message[]
    const unifiedErrorMessage = err.errors.map(error => error.messages.join('. ')).join(' and ');
    return res.status(err.status).json({
      error: unifiedErrorMessage,
      stack: config.env === 'development' ? err.stack : {}
    });
  } else if (!(err instanceof APIError)) {
    return res.status(err.status || httpStatus.INTERNAL_SERVER_ERROR).json({
      error: err.message,
      stack: config.env === 'development' ? err.stack : {}
    });
  }
  return next(err);
});

// catch 404 and forward to error handler
app.use((req, res, next) => res.status(httpStatus.NOT_FOUND).json({ error: 'API not found' })); // eslint-disable-line no-unused-vars

// log error in winston transports except when executing test suite
if (config.env !== 'test') {
  /* app.use(expressWinston.errorLogger({
    winstonInstance
  }));*/
}

// error handler, send stacktrace only during development
// app.use((err, req, res, next) => // eslint-disable-line no-unused-vars
//   res.status(err.status).json({
//     error: err.isPublic ? err.message : httpStatus[err.status],
//     stack: config.env === 'development' ? err.stack : {}
//   })
// );

export default app;
