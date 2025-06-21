import { status } from 'http-status';
import mongoose from 'mongoose';

import ApiError from '../../helpers/ApiError.mjs';

/**
 * Book Schema
 */
const BookSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  bookName: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  isbn: {
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
 * - pre-post-save hooks
 * - validations
 * - virtuals
 */

/**
 * Methods
 */
BookSchema.method({});

/**
 * Statics
 */
BookSchema.statics = {
  /**
   * Get book
   * @param {ObjectId} id - The objectId of book.
   * @returns {Promise<Book, ApiError>}
   */
  async get(id) {
    const book = await this.findById(id).populate('owner').exec();
    if (!book) {
      throw new ApiError('No such book exists!', status.NOT_FOUND);
    }

    return book;
  },

  /**
   * List books and populate owner details to which the book belongs to.
   * @returns {Promise<Book[]>}
   */
  list(owner, filters = {}) {
    return this.find({ ...filters, owner })
      .populate('owner')
      .exec();
  },

  /**
   * List books in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of books to be skipped.
   * @param {number} limit - Limit number of books to be returned.
   * @returns {Promise<Book[]>}
   */
  listLazy({ skip = 0, limit = 50 } = {}) {
    return this.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('owner')
      .exec();
  },
};

/**
 * @typedef Book
 */
export default mongoose.model('Book', BookSchema);
