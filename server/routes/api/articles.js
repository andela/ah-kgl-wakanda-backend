import express from 'express';
import Articles from '../../controllers/articles';
import ArticleValidations from '../../middlewares/validations/articles';

const router = express.Router();

router.post('/articles', ArticleValidations.create, Articles.create);
router.get('/articles', Articles.getAll);
router.get('/articles/:slug', ArticleValidations.get, Articles.get);
router.put('/articles', ArticleValidations.update, Articles.update);
router.delete('/articles/:slug', ArticleValidations.get, Articles.delete);

export default router;
