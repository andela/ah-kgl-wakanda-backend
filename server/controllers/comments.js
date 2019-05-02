import { Comment, User } from '../models';
import errorHandler from '../helpers/errorHandler';
import checkSlug from '../helpers/checkSlug';
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
      const articleId = await checkSlug(req, res);
      if (typeof articleId !== 'number') {
        return false;
      }
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
      const articleId = await checkSlug(req, res);
      if (typeof articleId !== 'number') {
        return false;
      }
      const result = await Comment.findAndCountAll({
        where: { articleId, },
        attributes: ['id', 'body', 'createdAt', 'updatedAt'],
        include: [{
          model: User,
          attributes: ['username', 'bio', 'image', 'following'],
        }],
        order: [['createdAt', 'DESC']]
      });
      return res.status(200).json({
        status: 200,
        data: {
          comments: result.rows,
          commentsCount: result.count,
        }
      });
    } catch (e) {
      errorHandler.errorResponse(res, e);
    }
  }

  /**
     *
     * delete a comment.
     * @static
     * @param {object} req
     * @param {object} res
     * @returns {id} article id
     * @memberof Comments
     */
  static async delete(req, res) {
    try {
      const articleId = await checkSlug(req, res);
      if (typeof articleId !== 'number') {
        return false;
      }
      const { id } = req.params;
      const result = await Comment.destroy({ where: { id, }, returning: true });

      if (result > 0) {
        return res.status(200).json({
          status: 200,
          message: 'Comment successfully deleted'
        });
      }

      return res.status(404).json({
        status: 404,
        message: 'Comment not found'
      });
    } catch (e) {
      errorHandler.errorResponse(res, e);
    }
  }

  /**
     *
     * update a comment.
     * @static
     * @param {object} req
     * @param {object} res
     * @returns {id} article id
     * @memberof Comments
     */
  static async update(req, res) {
    try {
      const articleId = await checkSlug(req, res);
      if (typeof articleId !== 'number') {
        return false;
      }
      const { id } = req.params;
      const { body } = req.body.comment;
      const result = await Comment.update({ body, }, {
        where: { id, },
        returning: true,
        plain: true
      });
      return res.status(200).json({
        status: 200,
        data: { comment: result[1].get() }
      });
    } catch (e) {
      if (e.message === 'Cannot read property \'length\' of null') {
        return res.status(404).json({
          status: 404,
          message: 'Comment not found'
        });
      }
      errorHandler.errorResponse(res, e);
    }
  }
}

export default Comments;
