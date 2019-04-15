import express from 'express';
import users from './users';
<<<<<<< HEAD
import articles from './articles';
import auth from './auth';
=======
import socialLogin from './socialLogin';
>>>>>>> [feature #165020122] social login with google

const router = express.Router();

router.use(users);
<<<<<<< HEAD
router.use(articles);
router.use(auth);
=======
router.use(socialLogin);
>>>>>>> [feature #165020122] social login with google

export default router;
