import express from 'express';
import Ratings from '../../controllers/ratings';

const router = express.Router();


router.get('/articles/:slug/ratings', Ratings.findArticleRatings);

export default router;