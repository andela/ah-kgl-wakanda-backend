import express from 'express';
import users from './users';
import articles from './articles';
import socialLogin from './socialLogin';
import ratings from './ratings';

const router = express.Router();

router.use(users);
router.use(articles);
router.use(socialLogin);
router.use(ratings);

export default router;
