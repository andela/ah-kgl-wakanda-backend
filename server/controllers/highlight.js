import {
  Highlight, Article, Comment
} from '../models';
import errorHandler from '../helpers/errorHandler';
import checkSlug from '../helpers/checkSlug';
// import Notifications from './notifications';
/**
 *
 *
 * @class Comments
 */
class Highlights {
  /**
   * @description create a new highlight
   * @static
   * @param {object} req
   * @param {object} res
   * @returns {object} response
   * @memberof Highlights
   */
  static async create(req, res) {
    try {
      const { start, end } = req.query;
      const { comment } = req.body;
      const { id: userId } = req.user;

      const articleId = await checkSlug(req, res);
      if (typeof articleId !== 'number') {
        return false;
      }
      const article = await Article.findOne({
        where: { id: articleId },
      });

      if (end > article.body.length) {
        return res.status(400).json({
          status: 400,
          message: 'Please, provide a valid end endex'
        });
      }

      const highlightedText = article.body.slice(start, end);

      const highlight = await Highlight.create({
        text: highlightedText,
        start,
        end,
        userId,
        articleId,
      });
      await highlight.createComment({
        body: comment,
        userId,
        articleId,
      });

      return res.status(201).json({
        status: 201,
        highlight: highlight.dataValues
      });
    } catch (e) {
      errorHandler.errorResponse(res, e);
    }
  }

  /**
   *
   * @description get all highlights on an article
   * @static
   * @param {object} req
   * @param {object} res
   * @returns {object} response
   * @memberof Highlights
   */
  static async getAll(req, res) {
    try {
      const articleId = await checkSlug(req, res);
      if (typeof articleId !== 'number') {
        return false;
      }
      const highlights = await Highlight.findAll({
        where: { articleId, },
        include: {
          model: Comment,
          as: Comment
        }
      });
      res.status(200).json({
        status: 200,
        highlights,
      });
    } catch (e) {
      errorHandler.errorResponse(res, e);
    }
  }

  /**
   *
   * @description get on highlight on an article
   * @static
   * @param {object} req
   * @param {object} res
   * @returns {object} response
   * @memberof Highlights
   */
  static async getOne(req, res) {
    try {
      const { id } = req.params;
      const articleId = await checkSlug(req, res);
      if (typeof articleId !== 'number') {
        return false;
      }
      const highlight = await Highlight.findOne({
        where: { articleId, id },
        include: {
          model: Comment,
          as: Comment
        }
      });

      if (!highlight) {
        return res.status(404).json({
          status: 404,
          message: 'Highlight not found'
        });
      }

      res.status(200).json({
        status: 200,
        highlight,

      });
    } catch (e) {
      errorHandler.errorResponse(res, e);
    }
  }

  /**
         *
         * @description update a highlighted
         * @static
         * @param {object} req
         * @param {object} res
         * @returns {object} response
         * @memberof Highlights
         */
  static async update(req, res) {
    try {
      const { start, end } = req.query;
      const { comment } = req.body;
      const { id: userId } = req.user;
      const { id } = req.params;

      const articleId = await checkSlug(req, res);
      if (typeof articleId !== 'number') {
        return false;
      }
      const article = await Article.findOne({
        where: { id: articleId },
      });

      if (end > article.body.length) {
        return res.status(400).json({
          status: 400,
          message: 'Please, provide a valid end index'
        });
      }

      const highlightedText = article.body.slice(start, end);

      const highlight = await Highlight.update(
        {
          text: highlightedText, start, end, comment
        },
        {
          where: { id, userId },
          returning: true,
        }
      );

      if (highlight[1][0]) {
        if (comment) {
          const HighlightId = highlight[1][0].dataValues.id;
          await Comment.update({ body: comment }, {
            where: { HighlightId, }
          });
        }
        return res.status(200).json({
          status: 200,
          highlight: highlight[1][0].dataValues
        });
      }
      return res.status(404).json({
        status: 404,
        message: 'Highlight not found'
      });
    } catch (e) {
      errorHandler.errorResponse(res, e);
    }
  }

  /**
         *
         * @description delete a highlighted
         * @static
         * @param {object} req
         * @param {object} res
         * @returns {object} response
         * @memberof Highlights
         */
  static async delete(req, res) {
    try {
      const { id: userId } = req.user;
      const { id } = req.params;

      const articleId = await checkSlug(req, res);
      if (typeof articleId !== 'number') {
        return false;
      }
      const result = await Highlight.destroy(
        {
          where: { id, userId },
          returning: true,
        }
      );

      if (result > 0) {
        return res.status(200).json({
          status: 200,
          message: 'Highlight deleted successfully'
        });
      }
      return res.status(404).json({
        status: 404,
        message: 'Highlight not found'
      });
    } catch (e) {
      errorHandler.errorResponse(res, e);
    }
  }
}

export default Highlights;
