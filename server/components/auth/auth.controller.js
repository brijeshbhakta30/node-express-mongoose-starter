const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const User = require('../user/user.model');
const APIError = require('../../helpers/APIError');
const config = require('../../config');

/**
 * Returns jwt token and user details if valid email and password are provided
 * @property {string} req.body.email - The email of user.
 * @property {string} req.body.password - The password of user.
 * @returns {token, User}
 */
function login(req, res, next) {
  User.getByEmail(req.body.email)
    .then((foundUser) => {
      if (!foundUser.validPassword(req.body.password)) {
        const err = new APIError('User email and password combination do not match', httpStatus.UNAUTHORIZED);
        return next(err);
      }
      const token = jwt.sign(foundUser.safeModel(), config.jwtSecret, {
        expiresIn: config.jwtExpiresIn,
      });
      return res.json({
        token,
        user: foundUser.safeModel(),
      });
    })
    .catch(err => next(new APIError(err.message, httpStatus.NOT_FOUND)));
}

/**
 * Register a new user
 * @property {string} req.body.email - The email of user.
 * @property {string} req.body.password - The password of user.
 * @property {string} req.body.firstName - The firstName of user.
 * @property {string} req.body.lastName - The lastName of user.
 * @returns {User}
 */
function register(req, res, next) {
  const user = new User(req.body);

  User.findOne({ email: req.body.email })
    .exec()
    .then((foundUser) => {
      if (foundUser) {
        return Promise.reject(new APIError('Email must be unique', httpStatus.CONFLICT));
      }
      user.password = user.generatePassword(req.body.password);
      return user.save();
    })
    .then((savedUser) => {
      const token = jwt.sign(savedUser.safeModel(), config.jwtSecret, {
        expiresIn: config.jwtExpiresIn,
      });
      return res.json({
        token,
        user: savedUser.safeModel(),
      });
    })
    .catch(e => next(e));
}

module.exports = { login, register };
