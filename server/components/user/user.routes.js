import express from 'express';
import validate from 'express-validation';
import Joi from 'joi';
import userCtrl from './user.controller';

const router = express.Router(); // eslint-disable-line new-cap
const paramValidation = {
  updateUser: {
    body: {
      email: Joi.string().required(),
      firstName: Joi.string(),
      lastName: Joi.string()
    }
  }
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

export default router;
