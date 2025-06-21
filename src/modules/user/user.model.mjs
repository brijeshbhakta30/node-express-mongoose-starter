import bcrypt from 'bcrypt';
import { status } from 'http-status';
import _ from 'lodash';
import mongoose from 'mongoose';

import ApiError from '../../helpers/ApiError.mjs';

/**
 * User Schema
 */
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: false,
  },
  lastName: {
    type: String,
    required: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

/**
 * Methods
 */
UserSchema.method({
  generatePassword(password) {
    // eslint-disable-next-line unicorn/no-null
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
  },
  validPassword(password) {
    return bcrypt.compareSync(password, this.password);
  },
  safeModel() {
    return _.omit(this.toObject(), ['password', '__v']);
  },
});

/**
 * Statics
 */
UserSchema.statics = {
  /**
   * Get user
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<User, ApiError>}
   */
  async get(id) {
    const user = await this.findById(id).exec();
    if (!user) {
      throw new ApiError('No such user exists!', status.NOT_FOUND);
    }

    return user;
  },

  /**
   * Get user by email
   * @param {ObjectId} email - The email of user.
   * @returns {Promise<User, ApiError>}
   */
  async getByEmail(email) {
    const user = await this.findOne({ email }).exec();
    if (!user) {
      throw new ApiError('No such user exists!', status.NOT_FOUND);
    }

    return user;
  },

  /**
   * List users in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of users to be skipped.
   * @param {number} limit - Limit number of users to be returned.
   * @returns {Promise<User[]>}
   */
  list({ skip = 0, limit = 50 } = {}) {
    return this.find()
      .sort({ createdAt: -1 })
      .skip(Number(skip))
      .limit(Number(limit))
      .exec();
  },
};

/**
 * @typedef User
 */
export default mongoose.model('User', UserSchema);
