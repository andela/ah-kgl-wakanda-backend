import express from 'express';
import checkToken from '../../middlewares/checkToken';
import Bookmark from '../../controllers/bookmarking';

const router = express.Router();

router.post('/articles/:slug/bookmark', checkToken, Bookmark.bookmark);
router.delete('/articles/:slug/bookmark', checkToken, Bookmark.unBookmark);
router.get('/articles/bookmark', checkToken, Bookmark.bookmarks);

export default router;
