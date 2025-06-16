const { status } = require('http-status');

const APIError = require('../../helpers/APIError');
const Book = require('./book.model');

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
  const owner = req.auth._id;
  book.owner = owner;

  try {
    const foundBook = await Book.findOne({ bookName: book.bookName, owner }).exec();
    if (foundBook) {
      throw new APIError('Book name must be unique', status.CONFLICT, true);
    }

    const savedBook = await book.save();
    return res.json(savedBook);
  } catch (error) {
    return next(error);
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
async function deleteOne(req, res, next) {
  const { book } = req;
  try {
    await book.deleteOne();
    return res.json(book);
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
  deleteOne,
};
