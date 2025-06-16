const express = require('express');
const { Joi } = require('express-validation');

const { validate } = require('../../helpers');
const bookCtrl = require('./book.controller');

// eslint-disable-next-line new-cap
const router = express.Router();

const parameterValidation = {
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
  .post(validate(parameterValidation.createBook), bookCtrl.create);

router.route('/:bookId')
  /** GET /api/books/:bookId - Get book */
  .get(bookCtrl.get)

  /** PUT /api/books/:bookId - Update book */
  .put(validate(parameterValidation.updateBook), bookCtrl.update)

  /** DELETE /api/books/:bookId - Delete book */
  .delete(bookCtrl.deleteOne);

/** Load book when API with bookId route parameter is hit */
router.param('bookId', bookCtrl.load);

module.exports = router;
