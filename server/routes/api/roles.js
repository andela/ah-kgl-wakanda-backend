import express from 'express';
import Roles from '../../controllers/roles';
import Permissions from '../../controllers/permissions';
import Validation from '../../middlewares/validations/roles';

const router = express.Router();

router.post('/roles', Validation.validateRoles, Roles.create);
router.get('/roles', Roles.getAll);
router.get('/roles/:id');
router.get('/roles/:id/permissions', Permissions.getRolePermissions);
router.put('/roles/:id', Validation.validateRoles, Roles.update);
router.delete('/roles/:id', Roles.delete);

export default router;
