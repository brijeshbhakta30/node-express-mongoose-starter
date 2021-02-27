const express = require('express');
const expressJwt = require('express-jwt');
const config = require('./config');
const userRoutes = require('./modules/user/user.routes');
const authRoutes = require('./modules/auth/auth.routes');
const bookRoutes = require('./modules/book/book.routes');

const router = express.Router();

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) => res.send('OK'));

// mount auth routes at /auth
router.use('/auth', authRoutes);

// Validating all the APIs with jwt token.
router.use(expressJwt({
  secret: config.jwtSecret,
  algorithms: ['HS256'],
  resultProperty: 'locals.session',
  getToken: function fromHeaderOrQuerystring(req) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      return req.headers.authorization.split(' ')[1];
    }
    if (req.query && req.query.token) {
      return req.query.token;
    }
    return null;
  },
}));

// mount user routes at /users
router.use('/users', userRoutes);

// mount book routes at /books
router.use('/books', bookRoutes);

module.exports = router;
