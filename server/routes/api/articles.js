import passport from 'passport';
import express from 'express';
import Articles from '../../controllers/articles';
import ArticleValidations from '../../middlewares/validations/articles';

const router = express.Router();

router.post('/articles', passport.authenticate('jwt', { session: false }), ArticleValidations.create, Articles.create);
router.get('/articles', passport.authenticate('jwt', { session: false }), Articles.getAll);

export default router;
