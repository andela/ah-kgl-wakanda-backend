import express from 'express';
import Notifications from '../../controllers/notifications';
import checkToken from '../../middlewares/checkToken';

const router = express.Router();

router.put('/notifications/subscribe', checkToken, Notifications.subscribe);
router.get('/notifications', checkToken, Notifications.getAll);
router.put('/notifications', checkToken, Notifications.readAll);
router.put('/notifications/:id', checkToken, Notifications.readOne);

export default router;
