const httpStatus = require('http-status');
const Book = require('./book.model');
const APIError = require('../../helpers/APIError');

/**
 * Load book and append to req.
 */
async function load(req, res, next, id) {
  try {
    const book = await Book.get(id);
    req.book = book;
    return next();
  } catch (error) {
    return next(error);
  }
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
async function create(req, res, next) {
  const book = new Book(req.body);
  const owner = res.locals.session._id;
  book.owner = owner;

  try {
    const foundBook = await Book.findOne({ bookName: book.bookName, owner }).exec();
    if (foundBook) {
      throw new APIError('Book name must be unique', httpStatus.CONFLICT, true);
    }
    const savedBook = await book.save();
    return res.json(savedBook);
  } catch (error) {
    return next(new APIError(error.message, error.status || httpStatus.INTERNAL_SERVER_ERROR));
  }
}

/**
 * Update existing book
 * @property {string} req.body.bookName - The name of book.
 * @property {string} req.body.author - Author name of book.
 * @property {string} req.body.isbn- The isbn of book.
 * @returns {Book}
 */
async function update(req, res, next) {
  const { book } = req;
  book.bookName = req.body.bookName || book.bookName;
  book.author = req.body.author || book.author;
  book.isbn = req.body.isbn || book.isbn;
  try {
    const savedBook = await book.save();
    return res.json(savedBook);
  } catch (error) {
    return next(error);
  }
}

/**
 * Get book list.
 * @returns {Book[]}
 */
async function list(req, res, next) {
  try {
    const books = await Book.list();
    return res.json(books);
  } catch (error) {
    return next(error);
  }
}

/**
 * Delete book.
 * @returns {Book}
 */
async function remove(req, res, next) {
  const { book } = req;
  try {
    const deletedBook = await book.remove();
    return res.json(deletedBook);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  load,
  get,
  create,
  update,
  list,
  remove,
};
