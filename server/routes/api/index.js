import express from 'express';
import users from './users';
import articles from './articles';

const router = express.Router();

router.use(users);
router.use(articles);

export default router;
