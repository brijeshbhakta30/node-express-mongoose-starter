import express from 'express';
import apiRoutes from './apiRoutes/index.route';

const router = express.Router(); // eslint-disable-line new-cap

router.get('');

// mount apiRoutes routes at /
router.use('/', apiRoutes);

export default router;
