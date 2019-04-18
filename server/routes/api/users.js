import express from 'express';
import passport from 'passport';
import userController from '../../controllers/users';
import validate from '../../middlewares/validations';
import schema from '../../middlewares/validations/users.schema';


const router = express.Router();

router.post('/auth/signup', validate(schema.signUp), userController.signUp);
router.post('/auth/login', validate(schema.logIn), userController.logIn);

export default router;
