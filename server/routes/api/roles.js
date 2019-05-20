import express from 'express';
import Roles from '../../controllers/roles';
import Permissions from '../../controllers/permissions';
import Validation from '../../middlewares/validations/roles';

const router = express.Router();

router.get('/roles', Roles.getAll);
router.get('/roles/:id', Validation.params, Roles.get);
router.get('/roles/:roleId/permissions', Permissions.getRolePermissions);
router.put('/roles/:id', Validation.params, Validation.optionalBody, Roles.update);

export default router;
