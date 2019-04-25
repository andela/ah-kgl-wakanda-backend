import express from 'express';
import Comments from '../../controllers/comments';
import checkToken from '../../middlewares/checkToken';
import validate from '../../middlewares/validations';
import schema from '../../middlewares/validations/comments.schema';

const router = express.Router();

router.post('/articles/:slug/comments', checkToken, validate(schema.comment), Comments.create);
router.get('/articles/:slug/comments', Comments.getAll);

export default router;
