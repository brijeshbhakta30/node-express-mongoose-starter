const express = require('express');
const { Joi } = require('express-validation');
const userCtrl = require('./user.controller');
const { validate } = require('../../helpers');

const router = express.Router();

const paramValidation = {
  updateUser: {
    body: Joi.object({
      email: Joi.string().required(),
      firstName: Joi.string(),
      lastName: Joi.string(),
    }),
    params: Joi.object({
      userId: Joi.string().hex().required(),
    }),
  },
};

router.route('/')
  /** GET /api/users - Get list of users */
  .get(userCtrl.list);

router.route('/profile')
  /** GET /api/users/profile - Get profile of logged in user */
  .get(userCtrl.getProfile);

router.route('/:userId')
  /** GET /api/users/:userId - Get user */
  .get(userCtrl.get)

  /** PUT /api/users/:userId - Update user */
  .put(validate(paramValidation.updateUser), userCtrl.update)

  /** DELETE /api/users/:userId - Delete user */
  .delete(userCtrl.remove);

/** Load user when API with userId route parameter is hit */
router.param('userId', userCtrl.load);

module.exports = router;
