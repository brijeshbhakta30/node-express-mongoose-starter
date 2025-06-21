import { validate as expressValidate } from 'express-validation';

/**
 * Wrapper around joi to validate the api requests.
 * @param {Joi} schema - Joi schema to be validated using express validation
 */
export default function validate(schema) {
  return expressValidate(schema, { keyByField: true }, { abortEarly: false });
}

