const express = require('express');
const { Joi } = require('express-validation');
const bookCtrl = require('./book.controller');
const { validate } = require('../../helpers');

const router = express.Router();

const paramValidation = {
  createBook: {
    body: Joi.object({
      bookName: Joi.string().required(),
      author: Joi.string().required(),
      isbn: Joi.string().min(10).max(13).required(),
    }),
  },
  updateBook: {
    params: Joi.object({
      bookId: Joi.string().required(),
    }),
    body: Joi.object({
      bookName: Joi.string().required(),
      author: Joi.string().required(),
      isbn: Joi.string().min(10).max(13).required(),
    }),
  },
};

router.route('/')
  /** GET /api/books - Get list of books */
  .get(bookCtrl.list)

  /** POST /api/books - Create new book */
  .post(validate(paramValidation.createBook), bookCtrl.create);

router.route('/:bookId')
  /** GET /api/books/:bookId - Get book */
  .get(bookCtrl.get)

  /** PUT /api/books/:bookId - Update book */
  .put(validate(paramValidation.updateBook), bookCtrl.update)

  /** DELETE /api/books/:bookId - Delete book */
  .delete(bookCtrl.remove);

/** Load book when API with bookId route parameter is hit */
router.param('bookId', bookCtrl.load);

module.exports = router;
