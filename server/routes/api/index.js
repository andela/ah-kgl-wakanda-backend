import express from 'express';
import users from './users';
import articles from './articles';
import auth from './auth';

const router = express.Router();

router.use(users);
router.use(articles);
router.use(auth);

export default router;
