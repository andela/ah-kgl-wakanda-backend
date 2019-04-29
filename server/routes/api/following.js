import express from 'express';
import Following from '../../controllers/following';

const router = express.Router();

router.post(
  '/user/:id/follow',
  Following.follow
);
router.delete('/user/:id/follow', Following.follow);

export default router;
