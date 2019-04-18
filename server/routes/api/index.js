import express from 'express';
import users from './users';
import articles from './articles';
import socialLogin from './socialLogin';

const router = express.Router();

router.use(users);
router.use(articles);
router.use(socialLogin);

export default router;
