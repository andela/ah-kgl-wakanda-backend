import express from 'express';
import Ratings from '../../controllers/ratings';
import validations from '../../middlewares/validations/ratings';

const router = express.Router();


router.get('/articles/:slug/ratings', validations.queries, Ratings.findArticleRatings);

export default router;
