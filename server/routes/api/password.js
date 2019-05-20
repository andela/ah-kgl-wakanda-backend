import express from 'express';
import Password from '../../controllers/password';
import validate from '../../middlewares/validations';
import schema from '../../middlewares/validations/password';

const router = express.Router();

router.post('/users/reset_password', validate(schema.email), Password.resetPassword);
router.put('/users/password', validate(schema.password), Password.updatePassword);

export default router;
