const User = require('./user.model');

/**
 * Load user and append to req.
 */
async function load(req, res, next, id) {
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
    const user = await User.get(res.locals.session._id);
    return res.json(user.safeModel());
  } catch (error) {
    return next(error);
  }
}

/**
 * Update existing user
 * @property {string} req.body.email - The email of user.
 * @property {string} req.body.firstName - The firstName of user.
 * @property {string} req.body.lastName - The lastName of user.
 * @returns {User}
 */
async function update(req, res, next) {
  const { user } = req;
  user.email = req.body.email;
  user.firstName = req.body.firstName || user.firstName;
  user.lastName = req.body.lastName || user.lastName;

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
    return res.json(users);
  } catch (error) {
    return next(error);
  }
}

/**
 * Delete user.
 * @returns {User}
 */
async function remove(req, res, next) {
  const { user } = req;
  try {
    const deletedUser = await user.remove();
    return res.json(deletedUser.safeModel());
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
  remove,
};
