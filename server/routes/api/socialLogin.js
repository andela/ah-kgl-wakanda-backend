import express from 'express';
import passport from 'passport';
import Users from '../../controllers/users';

const router = express.Router();

router.post(
  '/auth/facebook',
  passport.authenticate('facebook-token', { session: false }), Users.socialLogin
);
router.post(
  '/auth/google',
  passport.authenticate('google-token', { session: false }), Users.socialLogin
);

router.get(
  '/auth/twitter',
  passport.authenticate('twitter')
);

router.get(
  '/auth/twitter/callback',
  passport.authenticate('twitter', { session: false }), Users.socialLogin
);

export default router;
