import express from 'express';
import Notifications from '../../controllers/notifications';
import checkToken from '../../middlewares/checkToken';

const router = express.Router();

router.put('/notifications/subscribe', checkToken, Notifications.subscribe);

export default router;
