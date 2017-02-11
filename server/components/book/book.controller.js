import httpStatus from 'http-status';
import APIError from '../../helpers/APIError';
import Book from '../../models/book.model';

/**
 * Load book and append to req.
 */
function load(req, res, next, id) {
  Book.get(id)
    .then((book) => {
      req.book = book; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(e => next(e));
}

/**
 * Get book
 * @returns {Book}
 */
function get(req, res) {
  return res.json(req.book);
}

/**
 * Create new book
 * @property {string} req.body.bookName - The name of book.
 * @property {string} req.body.author - Author name of book.
 * @property {string} req.body.isbn- The isbn of book.
 * @returns {Book}
 */
function create(req, res, next) {
  const book = new Book(req.body);
  book.owner = res.locals.session._id;

  Book.findOne({ bookName: book.bookName })
    .exec()
    .then((foundBook) => {
      if (foundBook) {
        return Promise.reject(new APIError('Book name must be unique', httpStatus.CONFLICT, true));
      }
      return book.save();
    })
    .then(savedBook => res.json(savedBook))
    .catch(e => next(e));
}

/**
 * Update existing book
 * @property {string} req.body.bookName - The name of book.
 * @property {string} req.body.author - Author name of book.
 * @property {string} req.body.isbn- The isbn of book.
 * @returns {Book}
 */
function update(req, res, next) {
  const book = req.book;
  book.bookName = req.body.bookName || book.bookName;
  book.author = req.body.author || book.author;
  book.isbn = req.body.isbn || book.isbn;
  book.save()
    .then(savedBook => res.json(savedBook))
    .catch(e => next(new APIError(e.message, httpStatus.CONFLICT, true)));
}

/**
 * Get book list.
 * @returns {Book[]}
 */
function list(req, res, next) {
  Book.list()
    .then(books => res.json(books))
    .catch(e => next(e));
}

/**
 * Delete book.
 * @returns {Book}
 */
function remove(req, res, next) {
  const book = req.book;
  book.remove()
    .then(deletedBook => res.json(deletedBook))
    .catch(e => next(e));
}

export default { load, get, create, update, list, remove };
