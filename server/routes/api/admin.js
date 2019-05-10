import express from 'express';
import adminController from '../../controllers/admin';
import validate from '../../middlewares/validations/updatedValidation';
import schema from '../../middlewares/validations/createUser.schema';


const router = express.Router();
router.post('/admin/account/', validate(schema.signUp), adminController.createUsers);
router.put('/admin/account/:username', validate(schema.update), adminController.updateUsers);
router.delete('/admin/account/:username', adminController.deleteUsers);
router.post('/admin/account/:username/isadmin', adminController.makeAdmin);
router.delete('/admin/account/:username/isadmin', adminController.makeUser);


export default router;
