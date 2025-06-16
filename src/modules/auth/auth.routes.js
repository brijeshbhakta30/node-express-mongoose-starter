const express = require('express');
const { Joi } = require('express-validation');

const { validate } = require('../../helpers');
const authCtrl = require('./auth.controller');

// eslint-disable-next-line new-cap
const router = express.Router();

const parameterValidation = {
  login: {
    body: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  },
  registerUser: {
    body: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      firstName: Joi.string(),
      lastName: Joi.string(),
    }),
  },
};

/** POST /api/auth/login - Returns token if correct username and password is provided */
router.route('/login')
  .post(validate(parameterValidation.login), authCtrl.login);

/** POST /api/auth/register - Register a new user */
router.route('/register')
  .post(validate(parameterValidation.registerUser), authCtrl.register);

module.exports = router;
