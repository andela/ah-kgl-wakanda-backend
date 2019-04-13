import express from 'express';
import users from './users';
import articles from './articles';
import socialLogin from './socialLogin';
import password from './password';

const router = express.Router();

router.use(users);
router.use(articles);
router.use(socialLogin);
router.use(password);

export default router;
