import express from 'express';
import users from './users';
<<<<<<< HEAD
import articles from './articles';
import socialLogin from './socialLogin';
=======
>>>>>>> [Feature #165020121] Reset passport token should be placed in the Authorization Header
import password from './password';
import ratings from './ratings';

const router = express.Router();

router.use(users);
<<<<<<< HEAD
router.use(articles);
router.use(socialLogin);
=======
>>>>>>> [Feature #165020121] Reset passport token should be placed in the Authorization Header
router.use(password);
router.use(ratings);

export default router;
