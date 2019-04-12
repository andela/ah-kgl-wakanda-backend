import express from 'express';
import passport from 'passport';
import Users from '../../controllers/users';

const router = express.Router();

router.post(
  '/auth/facebook',
  passport.authenticate('facebook-token', { session: false }), Users.create
);


export default router;
