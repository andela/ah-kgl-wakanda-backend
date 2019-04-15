import express from 'express';
import userController from '../../controllers/users';
import validate from '../../middlewares/validations';
import schema from '../../middlewares/validations/users.schema';


const router = express.Router();

router.post('/auth/signup', validate(schema), userController.signUp);

export default router;
