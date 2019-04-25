import { Comment, Article, User } from '../models';
import errorHandler from '../helpers/errorHandler';
/**
 *
 *
 * @class Comments
 */
class Comments {
  /**
     *
     * returning the article giving the slug.
     * @static
     * @param {object} req
     * @param {object} res
     * @returns {id} article id
     * @memberof Comments
     */
  static async checkSlug(req, res) {
    try {
      const articleId = await Article.findOne({
        where: { slug: req.params.slug },
        attributes: ['id']
      });
      if (!articleId) {
        return res.status(404).json({
          status: 404,
          message: 'Article is not found.'
        });
      }
      return articleId.id;
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
     * @returns {object} response
     * @memberof Comments
     */
  static async create(req, res) {
    try {
      const articleId = await Comments.checkSlug(req, res);

      const userId = req.user.id;
      const comment = {
        body: req.body.comment.body,
        userId,
        articleId,
      };

      const result = await Comment.create(comment);

      return res.status(201).json({
        status: 201,
        data: { comment: result }
      });
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
     * @returns {object} response
     * @memberof Comments
     */
  static async getAll(req, res) {
    try {
      const articleId = await Comments.checkSlug(req, res);

      const result = await Comment.findAll({
        where: { articleId, },
        attributes: ['id', 'body', 'createdAt', 'updatedAt'],
        include: [{
          model: User,
          attributes: ['username', 'bio', 'image', 'following'],
        }]
      });
      return res.status(200).json({
        status: 200,
        data: { comments: result }
      });
    } catch (e) {
      errorHandler.errorResponse(res, e);
    }
  }
}

export default Comments;
