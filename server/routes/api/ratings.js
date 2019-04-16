import express from 'express';
import Ratings from '../../controllers/ratings';
import Validation from '../../middlewares/validations/ratings';

const router = express.Router();

router.post('/articles/rate/:slug', Ratings.create);

export default router;
