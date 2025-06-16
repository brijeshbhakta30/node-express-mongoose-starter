const pick = require('lodash/pick');

const User = require('./user.model');

/**
 * Load user and append to req.
 */
async function load(req, _res, next, id) {
  try {
    const user = await User.get(id);
    req.user = user;
    return next();
  } catch (error) {
    return next(error);
  }
}

/**
 * Get user
 * @returns {User}
 */
function get(req, res) {
  return res.json(req.user.safeModel());
}

/**
 * Get user profile of logged in user
 * @returns {User}
 */
async function getProfile(req, res, next) {
  try {
    const user = await User.get(req.auth._id);
    return res.json(user.safeModel());
  } catch (error) {
    return next(error);
  }
}

/**
 * Update existing user
 * @property {string} req.body.firstName - The firstName of user.
 * @property {string} req.body.lastName - The lastName of user.
 * @returns {User}
 */
async function update(req, res, next) {
  const { user } = req;
  const allowedFields = ['firstName', 'lastName'];
  const updateFields = pick(req.body, allowedFields);
  if (Object.keys(updateFields).length === 0) {
    return res.status(400).json({ message: 'No valid fields to update' });
  }

  for (const key of Object.keys(updateFields)) {
    if (updateFields[key] !== undefined) {
      user[key] = updateFields[key];
    }
  }

  try {
    const savedUser = await user.save();
    return res.json(savedUser.safeModel());
  } catch (error) {
    return next(error);
  }
}

/**
 * Get user list.
 * @property {number} req.query.skip - Number of users to be skipped.
 * @property {number} req.query.limit - Limit number of users to be returned.
 * @returns {User[]}
 */
async function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  try {
    const users = await User.list({ limit, skip });
    const safeUsers = users.map(user => user.safeModel());
    return res.json(safeUsers);
  } catch (error) {
    return next(error);
  }
}

/**
 * Delete user.
 * @returns {User}
 */
async function deleteOne(req, res, next) {
  const { user } = req;
  try {
    await user.deleteOne();
    return res.json(user.safeModel());
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  load,
  get,
  getProfile,
  update,
  list,
  deleteOne,
};
