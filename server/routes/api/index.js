import express from 'express';
import users from './users';
import articles from './articles';
import socialLogin from './socialLogin';
import password from './password';
import ratings from './ratings';
import articleLikes from './likeArticles';
import comments from './comments';
import following from './following';
import bookmarking from './bookmarking';
import notifications from './notifications';
import roles from './roles';
import permissions from './permissions';
import admin from './admin';

const router = express.Router();

router.use(users);
router.use(bookmarking);
router.use(articles);
router.use(socialLogin);
router.use(password);
router.use(ratings);
router.use(articleLikes);
router.use(comments);
router.use(following);
router.use(notifications);
router.use(roles);
router.use(permissions);
router.use(admin);

export default router;
