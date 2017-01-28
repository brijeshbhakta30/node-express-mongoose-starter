import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';

/**
 * Book Schema
 */
const BookSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  bookName: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  isbn: {
    type: String,
    required: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
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
   * @returns {Promise<Book, APIError>}
   */
  get(id) {
    return this.findById(id)
      .populate('owner')
      .exec()
      .then((book) => {
        if (book) {
          return book;
        }
        const err = new APIError('No such book exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  /**
   * List books and populate owner details to wich the book belongs to.
   * @returns {Promise<Book[]>}
   */
  list() {
    return this.find()
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
  }
};

/**
 * @typedef Book
 */
export default mongoose.model('Book', BookSchema);
