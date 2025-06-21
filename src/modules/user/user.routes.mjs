import express from 'express';
import { Joi } from 'express-validation';

import validate from '../../helpers/validate.mjs';
import userCtrl from './user.controller.mjs';

// eslint-disable-next-line new-cap
const router = express.Router();

const parameterValidation = {
  updateUser: {
    body: Joi.object({
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
  .put(validate(parameterValidation.updateUser), userCtrl.update)

  /** DELETE /api/users/:userId - Delete user */
  .delete(userCtrl.deleteOne);

/** Load user when API with userId route parameter is hit */
router.param('userId', userCtrl.load);

export default router;
