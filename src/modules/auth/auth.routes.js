const express = require('express');
const validate = require('express-validation');
const Joi = require('@hapi/joi');
const authCtrl = require('./auth.controller');

const router = express.Router(); // eslint-disable-line new-cap
const paramValidation = {
  login: {
    body: {
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },
  },
  registerUser: {
    body: {
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      firstName: Joi.string(),
      lastName: Joi.string(),
    },
  },
};

/** POST /api/auth/login - Returns token if correct username and password is provided */
router.route('/login')
  .post(validate(paramValidation.login), authCtrl.login);

/** POST /api/auth/register - Register a new user */
router.route('/register')
  .post(validate(paramValidation.registerUser), authCtrl.register);

module.exports = router;
