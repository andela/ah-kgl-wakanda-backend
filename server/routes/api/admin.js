import express from 'express';
import adminController from '../../controllers/admin';
import validate from '../../middlewares/validations/updatedValidation';
import schema from '../../middlewares/validations/createUser.schema';
import permission from '../../middlewares/authorization';


const router = express.Router();

router.post(
  '/admin/account/',
  validate(schema.signUp),
  permission.adminOrSuperAdmin,
  adminController.createUsers
);

router.put(
  '/admin/account/:username',
  validate(schema.update),
  permission.adminOrSuperAdmin,
  adminController.updateUsers
);

router.delete(
  '/admin/account/:username',
  permission.adminOrSuperAdmin,
  adminController.deleteUsers
);

router.post(
  '/admin/account/:username/isadmin',
  permission.superAdmin,
  adminController.makeAdmin
);

router.delete(
  '/admin/account/:username/isadmin',
  permission.superAdmin,
  adminController.makeUser
);


export default router;
