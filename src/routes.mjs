import express from 'express';
import { expressjwt } from 'express-jwt';

import config from './config.mjs';
import authRoutes from './modules/auth/auth.routes.mjs';
import bookRoutes from './modules/book/book.routes.mjs';
import userRoutes from './modules/user/user.routes.mjs';

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

export default router;
