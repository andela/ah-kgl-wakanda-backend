import express from 'express';
import Ratings from '../../controllers/ratings';
import Validation from '../../middlewares/validations/ratings';

const router = express.Router();

router.post(
  '/articles/rate/:slug',
  Validation.validateRating,
  Ratings.create
);
router.get('/articles/:slug/ratings', Validation.queries, Ratings.findArticleRatings);

export default router;
