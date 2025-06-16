const { status } = require('http-status');
const jwt = require('jsonwebtoken');

const config = require('../../config');
const APIError = require('../../helpers/APIError');
const User = require('../user/user.model');

/**
 * Returns jwt token and user details if valid email and password are provided
 * @property {string} req.body.email - The email of user.
 * @property {string} req.body.password - The password of user.
 * @returns {token, User}
 */
async function login(req, res, next) {
  try {
    const foundUser = await User.getByEmail(req.body.email);
    if (!foundUser?.validPassword(req.body.password)) {
      throw new APIError('User email and password combination do not match', status.UNAUTHORIZED);
    }

    const token = generateJWT(foundUser.safeModel());
    return res.json({
      token,
      user: foundUser.safeModel(),
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * Register a new user
 * @property {string} req.body.email - The email of user.
 * @property {string} req.body.password - The password of user.
 * @property {string} req.body.firstName - The firstName of user.
 * @property {string} req.body.lastName - The lastName of user.
 * @returns {User}
 */
async function register(req, res, next) {
  const user = new User(req.body);
  try {
    const foundUser = await User.findOne({ email: req.body.email }).exec();
    if (foundUser) {
      throw new APIError('Email must be unique', status.CONFLICT);
    }

    user.password = user.generatePassword(req.body.password);
    const savedUser = await user.save();
    const token = generateJWT(savedUser.safeModel());
    return res.json({
      token,
      user: savedUser.safeModel(),
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * Generates JWT for the payload
 * @param {*} payload - Payload to be signed in JWT
 */
function generateJWT(payload) {
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
    algorithm: 'HS256',
  });
}

module.exports = { login, register };
