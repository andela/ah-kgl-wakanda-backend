import express from 'express';
import validate from '../../middlewares/validations';
import schema from '../../middlewares/validations/likeArticle';
import checkToken from '../../middlewares/checkToken';
import articleController from '../../controllers/articles';

const router = express.Router();
router.post('/articles/:slug/favorite', checkToken, validate(schema.params, true), articleController.like);
router.delete('/articles/:slug/favorite', checkToken, validate(schema.params, true), articleController.unlike);

export default router;
