import { Comment, Article } from '../models';
import errorHandler from '../helpers/errorHandler';
/**
 *
 *
 * @class Comments
 */
class Comments {
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

      const userId = Number(req.user.id);
      const comment = {
        body: req.body.comment.body,
        userId,
        articleId: articleId.id,
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
}

export default Comments;
