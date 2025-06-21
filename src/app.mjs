import compress from 'compression';
import cors from 'cors';
import express from 'express';
import { ValidationError } from 'express-validation';
import helmet from 'helmet';
import { status } from 'http-status';
import methodOverride from 'method-override';
import logger from 'morgan';

import config from './config.mjs';
import ApiError from './helpers/ApiError.mjs';
import routes from './routes.mjs';

const app = express();

if (config.env === 'development') {
  app.use(logger('dev'));
}

// Parse body params and attache them to req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(compress());
app.use(methodOverride());

// Secure apps by setting various HTTP headers
app.use(helmet());

// eslint-disable-next-line sonarjs/cors -- Enable CORS - Cross Origin Resource Sharing
app.use(cors());

// Mount all routes on /api path
app.use('/api', routes);

// If error is not an instanceOf ApiError, convert it.
app.use((err, _req, _res, next) => {
  if (err instanceof ValidationError) {
    // Validation error contains details object which has error message attached to error property.
    const allErrors = err.details.map(pathErrors => Object.values(pathErrors).join(', '));
    const unifiedErrorMessage = allErrors.join(', ').replace(/, ([^,]*)$/, ' and $1');
    const error = new ApiError(unifiedErrorMessage, err.statusCode);
    return next(error);
  }

  if (!(err instanceof ApiError)) {
    const apiError = new ApiError(err.message, err.status);
    return next(apiError);
  }

  return next(err);
});

// Catch 404 and forward to error handler
app.use((_req, _res, next) => {
  const err = new ApiError('API Not Found', status.NOT_FOUND);
  return next(err);
});

// Error handler, send stacktrace only during development
app.use((err, _req, res, _next) =>
  res.status(err.status).json({
    message: err.isPublic ? err.message : status[err.status],
    stack: config.env === 'development' ? err.stack : {},
  }));

export default app;
