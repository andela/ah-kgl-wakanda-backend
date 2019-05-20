import express from 'express';
import Highlight from '../../controllers/highlight';
import checkToken from '../../middlewares/checkToken';
import validate from '../../middlewares/validations';
import validateHighlight, { schema } from '../../middlewares/validations/highlight.schema';

const router = express.Router();

router.post(
  '/articles/:slug/highlights',
  checkToken,
  validateHighlight,
  Highlight.create,
);

router
  .route('/articles/:slug/highlights/:id')
  .put(
    checkToken,
    validate(schema.params, true),
    Highlight.update
  )
  .delete(
    checkToken,
    validate(schema.params, true),
    Highlight.delete
  )
  .get(
    validate(schema.params, true),
    Highlight.getOne
  );

router.get(
  '/articles/:slug/highlights',
  Highlight.getAll
);


export default router;
