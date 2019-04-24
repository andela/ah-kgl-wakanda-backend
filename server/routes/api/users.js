import express from 'express';
import userController from '../../controllers/users';
import validate from '../../middlewares/validations';
import schema from '../../middlewares/validations/users.schema';
import checkToken from '../../middlewares/checkToken';


const router = express.Router();
router.post('/auth/signup', validate(schema.signUp), userController.signUp);
router.post('/auth/login', validate(schema.logIn), userController.logIn);
router.delete('/users/signout', checkToken, userController.signout);

router.put('/user/:username', userController.update);

export default router;
