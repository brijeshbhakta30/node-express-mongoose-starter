import { status } from 'http-status';
import jwt from 'jsonwebtoken';

import config from '../../config.mjs';
import ApiError from '../../helpers/ApiError.mjs';
import User from '../user/user.model.mjs';

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
      throw new ApiError('User email and password combination do not match', status.UNAUTHORIZED);
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
      throw new ApiError('Email must be unique', status.CONFLICT);
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

export default {
  login,
  register,
};
