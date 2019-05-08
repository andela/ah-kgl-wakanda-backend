import express from 'express';
import Notifications from '../../controllers/notifications';
import checkToken from '../../middlewares/checkToken';
import validate from '../../middlewares/validations';
import schema from '../../middlewares/validations/notifications.schema';

const router = express.Router();

router.put('/notifications/subscribe', checkToken, Notifications.subscribe);
router.get('/notifications', checkToken, Notifications.getAll);
router.put('/notifications', checkToken, Notifications.readAll);
router.put('/notifications/:id', checkToken, validate(schema.idParam, true), Notifications.readOne);

export default router;
