const dotenv = require('dotenv');
const { Joi } = require('express-validation');
const path = require('node:path');

const nodeEnvironmentValidator = Joi.string()
  .allow('development', 'production', 'test', 'provision')
  .default('development');

const nodeEnvironmentSchema = Joi.object({
  NODE_ENV: nodeEnvironmentValidator,
}).unknown().required();

// Getting environment to load relative .env file
const { error: environmentError, value } = nodeEnvironmentSchema.validate(process.env);
if (environmentError) {
  throw new Error(`Environment validation error: ${environmentError.message}`);
}

// Require and configure dotenv, will load vars in .env.* file in PROCESS.ENV
const environmentFilePath = path.resolve(__dirname, '..', '..', `.env.${value.NODE_ENV}`);
const environmentConfig = dotenv.config({ path: environmentFilePath });
if (environmentConfig.error) {
  throw new Error(`Environment file config error: ${environmentConfig.error}`);
}

// Define validation for all the env vars
const environmentVariablesSchema = Joi.object({
  NODE_ENV: nodeEnvironmentValidator,
  PORT: Joi.number()
    .default(4040),
  MONGOOSE_DEBUG: Joi.boolean()
    .when('NODE_ENV', {
      is: Joi.string().equal('development'),
      // eslint-disable-next-line unicorn/no-thenable
      then: Joi.boolean().default(true),
      otherwise: Joi.boolean().default(false),
    }),
  JWT_SECRET: Joi.string().required()
    .description('JWT Secret required to sign'),
  JWT_EXPIRES_IN: Joi.number().default(1440)
    .description('JWT expiration time in seconds'),
  MONGO_HOST: Joi.string().required()
    .description('Mongo DB host url'),
  MONGO_SSL: Joi.boolean()
    .default(false),
}).unknown()
  .required();

const { error, value: environmentVariables } = environmentVariablesSchema.validate(process.env);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  env: environmentVariables.NODE_ENV,
  port: environmentVariables.PORT,
  mongooseDebug: environmentVariables.MONGOOSE_DEBUG,
  jwtSecret: environmentVariables.JWT_SECRET,
  jwtExpiresIn: environmentVariables.JWT_EXPIRES_IN,
  mongo: {
    host: environmentVariables.MONGO_HOST,
    ssl: environmentVariables.MONGO_SSL,
  },
};

module.exports = config;
