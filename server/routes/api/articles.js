
import express from 'express';
import Articles from '../../controllers/articles';
import ArticleValidations from '../../middlewares/validations/articles';
import Pagination from '../../middlewares/validations/pagination';
import validate from '../../middlewares/validations';
import schema from '../../middlewares/validations/shareArticles';
import checkToken from '../../middlewares/checkToken';
import SearchFilter from '../../middlewares/validations/searchFilter';

const router = express.Router();

router.post('/articles', checkToken, ArticleValidations.create, Articles.create);
router.get('/articles', Pagination.validatePagination, Articles.getAll);
router.get('/articles/:slug', ArticleValidations.get, Articles.get);
router.put('/articles/:slug', ArticleValidations.update, Articles.update);
router.delete('/articles/:slug', ArticleValidations.get, Articles.delete);
router.post('/articles/:slug/share/:channel', validate(schema.params, true), Articles.share);
router.get('/search', SearchFilter.validateFilter, Articles.search);


export default router;
