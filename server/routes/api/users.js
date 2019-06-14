import express from 'express';
import userController from '../../controllers/users';
import validate from '../../middlewares/validations';
import schema from '../../middlewares/validations/users.schema';
import checkToken from '../../middlewares/checkToken';


const router = express.Router();
router.post('/auth/signup', validate(schema.signUp), userController.signUp);
router.post('/auth/login', validate(schema.logIn), userController.logIn);
router.delete('/users/signout', checkToken, userController.signout);
router.get('/users', checkToken, userController.listUsers);
router.put('/user/:username', checkToken, userController.update);
router.get('/users/:username', checkToken, userController.getUserInfo);
router.get('/auth/verification/:token', userController.verifyEmail);

export default router;
