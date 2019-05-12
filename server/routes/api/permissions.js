import express from 'express';
import Permissions from '../../controllers/permissions';
import Validation from '../../middlewares/validations/permissions';

const router = express.Router();

router.post('/permissions/:roleId', Validation.validatePermission, Permissions.grant);
router.get('/permissions', Permissions.getAll);
router.get('/permissions/:permissionId', Permissions.get);
router.put('/permissions/:permissionId', Validation.validatePermission, Permissions.update);
router.delete('/permissions/:permissionId', Permissions.revoke);

export default router;
