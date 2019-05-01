import express from 'express';
import Follows from '../../controllers/following';
import checkToken from '../../middlewares/checkToken';

const router = express.Router();

router.post(
  '/profiles/:username/follow',
  checkToken,
  Follows.follow
);
router.delete(
  '/profiles/:username/follow',
  checkToken,
  Follows.unfollow
);
router.get(
  '/profiles/follow',
  checkToken,
  Follows.follows
);

export default router;
