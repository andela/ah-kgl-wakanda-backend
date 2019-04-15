import express from 'express';
import Ratings from '../../controllers/ratings';

const router = express.Router();

router.post('/articles/ratings/:slug', Ratings.create);

export default router;
