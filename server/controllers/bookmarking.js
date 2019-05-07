import { Bookmarking, Article } from '../models';
import checkSlug from '../helpers/checkSlug';
import errorHandler from '../helpers/errorHandler';
/**
 *
 *
 * @class Bookmark
 */
class Bookmark {
  /**
       *
       *
       * @static
       * @param {object} req
       * @param {object} res
       * @param {string} string
       * @returns {object} response
       * @memberof Bookmark
       */
  static async bookmark(req, res) {
    try {
      const articleId = await checkSlug(req, res);
      if (typeof articleId !== 'number') {
        return false;
      }
      const userId = req.user.id;
      const bookmarked = await Bookmarking.findOrCreate({
        where: {
          userId,
          articleId
        },
      });
      if (!bookmarked[1]) {
        return res.status(400).json({
          status: 400,
          message: 'The article is already bookmarked',
        });
      }
      return res.status(200).json({
        status: 200,
        message: 'Successfully bookmarked the article',
        article: {
          slug: req.params.slug,
        }
      });
    } catch (e) {
      return errorHandler.errorResponse(res, e);
    }
  }

  /**
       *
       *
       * @param {object} req
       *  @param {object} res
       * @param {string} string
       * @returns {object} response
       * @memberof Bookmark
       */
  static async unBookmark(req, res) {
    try {
      const articleId = await checkSlug(req, res);
      if (typeof articleId !== 'number') {
        return false;
      }
      const userId = req.user.id;
      const bookmarked = await Bookmarking.findOne({
        where: {
          userId,
          articleId,
        },
      });
      if (bookmarked) {
        await Bookmarking.destroy({
          where: {
            userId,
            articleId
          }
        });
        return res.status(200).json({
          status: 200,
          message: 'Successfully unbookmarked the article',
          article: {
            slug: req.params.slug,
          }
        });
      }
      return res.status(404).json({
        status: 404,
        message: 'This article is not bookmarked',
      });
    } catch (e) {
      errorHandler.errorResponse(res, e);
    }
  }

  /**
       *
       *
       * @param {object} req
       *  @param {object} res
       * @param {string} string
       * @returns {object} response
       * @memberof Bookmark
       */
  static async bookmarks(req, res) {
    try {
      const articles = await Bookmarking.findAll({
        attributes: ['id', 'createdAt'],
        include: [{
          model: Article,
          attributes: ['slug', 'title', 'description', 'body', 'images'],
        }],
        where: {
          userId: req.user.id,
        },
      });
      return res.json({ articles });
    } catch (e) {
      errorHandler.errorResponse(res, e);
    }
  }
}
export default Bookmark;
