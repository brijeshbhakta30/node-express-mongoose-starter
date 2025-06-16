const express = require('express');
const { expressjwt } = require('express-jwt');

const config = require('./config');
const authRoutes = require('./modules/auth/auth.routes');
const bookRoutes = require('./modules/book/book.routes');
const userRoutes = require('./modules/user/user.routes');

// eslint-disable-next-line new-cap
const router = express.Router();

/** GET /health-check - Check service health */
router.get('/health-check', (_req, res) => res.send('OK'));

// Mount auth routes at /auth
router.use('/auth', authRoutes);

// Validating all the APIs with jwt token.
router.use(expressjwt({
  secret: config.jwtSecret,
  algorithms: ['HS256'],
  getToken(req) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      return req.headers.authorization.split(' ')[1];
    }

    if (req.query && req.query.token) {
      return req.query.token;
    }
  },
}));

// Mount user routes at /users
router.use('/users', userRoutes);

// Mount book routes at /books
router.use('/books', bookRoutes);

module.exports = router;
