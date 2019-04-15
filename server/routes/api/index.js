import express from 'express';
import users from './users';
import articles from './articles';
import socialLogin from './socialLogin';
import password from './password';
import ratings from './ratings';

const router = express.Router();

router.use(users);
router.use(articles);
router.use(socialLogin);
router.use(password);
router.use(ratings);

export default router;
