import express from 'express';
import expressJwt from 'express-jwt';
import config from '../config/env';
import authRoutes from './auth/auth.routes';
import userRoutes from './user/user.routes';
import bookRoutes from './book/book.routes';

const router = express.Router(); // eslint-disable-line new-cap

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
  res.send('OK')
);

// mount auth routes at /auth
router.use('/api/auth', authRoutes);

// Validating all the APIs with jwt token.
router.use('/api', expressJwt({ secret: config.jwtSecret }));

// If jwt is valid, storing user data in local session.
router.use('/api', (req, res, next) => {
  const authorization = req.header('authorization');
  res.locals.session = JSON.parse(new Buffer((authorization.split(' ')[1]).split('.')[1], 'base64').toString()); // eslint-disable-line no-param-reassign
  next();
});

// mount user routes at /api/users
router.use('/api/users', userRoutes);

// mount book routes at /api/books
router.use('/api/books', bookRoutes);

export default router;
