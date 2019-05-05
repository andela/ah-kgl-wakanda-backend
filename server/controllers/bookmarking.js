import { Bookmarking, Article } from '../models';
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
  static async bookmarkingInfo(req, res) {
    try {
      const { user } = req;
      const article = await Article.findOne({
        attributes: ['id', 'title'],
        where: { slug: req.params.slug }
      });
      if (!article) {
        return res.status(404).json({
          status: 404,
          message: 'We don\'t find the article to bookmark'
        });
      }

      return { article, user };
    } catch (e) {
      errorHandler.errorResponse(res, e);
    }
  }

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
      if (await Bookmark.bookmarkingInfo(req, res)) {
        const response = await Bookmark.bookmarkingInfo(req, res);
        const userId = response.user.id;
        const { id, title } = response.article;
        const bookmarked = await Bookmarking.findOrCreate({
          where: {
            userId,
            articleId: id,
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
          message: 'Successfully bookmarked',
          article: {
            articleId: id,
            title
          }
        });
      }
    } catch (e) {
      console.log('>>>>>>>>>>>>>>>>>>', e);
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
  static async unBookmark(req, res) {
    try {
      if (await Bookmark.bookmarkingInfo(req, res)) {
        const response = await Bookmark.bookmarkingInfo(req, res);
        const bookmarked = await Bookmarking.findOne({
          where: {
            userId: response.user.id,
            articleId: response.article.id
          },
        });
        if (bookmarked) {
          await Bookmarking.destroy({
            where: {
              userId: response.user.id,
              articleId: response.article.id
            }

          });
          return res.status(200).json({
            status: 200,
            message: 'Successfully unbookmarked the article',
            article: {
              articleId: response.article.id,
              title: response.article.title
            }
          });
        }
        return res.status(404).json({
          status: 404,
          message: 'This article is not bookmarked',
        });
      }
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
    console.log('whaaaat');
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
