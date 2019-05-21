import express from 'express';
import Report from '../../controllers/report';
import checkToken from '../../middlewares/checkToken';
import validate from '../../middlewares/validations';
import schema from '../../middlewares/validations/report.schema';
import permission from '../../middlewares/authorization';

const router = express.Router();

router.post('/articles/:slug/report', checkToken, validate(schema.slug, true), validate(schema.report), Report.create);
router.get('/articles/report', permission.adminOrSuperAdmin, Report.getAllReportedArticles);
router.get('/articles/:slug/report', permission.adminOrSuperAdmin, validate(schema.slug, true), Report.getOneReportedArticles);
router.get('/articles/:slug/report/:id', permission.adminOrSuperAdmin, validate(schema.params, true), Report.getOneReport);
router.delete('/articles/:slug/report/:id', checkToken, validate(schema.params, true), Report.delete);
router.delete('/articles/:slug/report/', permission.adminOrSuperAdmin, validate(schema.slug, true), Report.deleteArticle);

export default router;
