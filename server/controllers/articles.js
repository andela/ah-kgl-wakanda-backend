import slugify from '@sindresorhus/slugify';
import { Article, Tags } from '../models';
import errorHandler from '../helpers/errorHandler';
/**
 *
 *
 * @class Articles
 */
class Articles {
  /**
   *
   *
   * @static
   * @param {object} req
   * @param {object} res
   * @returns {object} response
   * @memberof Articles
   */
  static async create(req, res) {
    const { article } = req.body;
    article.slug = `${slugify(article.title)}-${Math.floor(Math.random() * 999999999) + 100000000}`;

    try {
      const result = await Article.create(article, { include: [{ model: Tags }] });

      return res.status(201).json({
        status: 201,
        data: { article: result }
      });
    } catch (e) {
      errorHandler.errorResponse(res, e);
    }
  }

  /**
   *
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @returns {object} response
   * @memberof Articles
   */
  static async getAll(req, res) {
    try {
      const result = await Article.findAll({
        include: [{
          model: Tags
        }]
      });

      return res.status(200).json({
        status: 200,
        data: { articles: result }
      });
    } catch (e) {
      errorHandler.errorResponse(res, e);
    }
  }

  /**
   *
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @returns {object} response
   * @memberof Articles
   */
  static async get(req, res) {
    try {
      const result = await Article.findOne({
        include: [{
          model: Tags
        }],
        where: { slug: req.params.slug }
      });

      if (result) {
        return res.status(200).json({
          status: 200,
          data: { article: result }
        });
      }

      return res.status(404).json({
        status: 404,
        message: 'Article not found'
      });
    } catch (e) {
      errorHandler.errorResponse(res, e);
    }
  }

  /**
   *
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @returns {object} response
   * @memberof Articles
   */
  static async update(req, res) {
    try {
      const { title } = req.body.article;
      const { UserId } = req.body.user;
      const result = await Article.update({ title, }, { where: { UserId, }, returning: true });

      if (result) {
        return res.status(200).json({
          status: 200,
          data: { article: result }
        });
      }

      return res.status(404).json({
        status: 404,
        message: 'Article not found'
      });
    } catch (e) {
      errorHandler.errorResponse(res, e);
    }
  }

  /**
 *
 *
 * @static
 * @param {*} req
 * @param {*} res
 * @returns {object} response
 * @memberof Articles
 */
  static async delete(req, res) {
    try {
      const { slug } = req.params;
      const result = await Article.destroy({ where: { slug, }, returning: true });

      if (result > 0) {
        return res.status(200).json({
          status: 200,
          data: 'Article successfully deleted'
        });
      }

      return res.status(404).json({
        status: 404,
        message: 'Article not found'
      });
    } catch (e) {
      errorHandler.errorResponse(res, e);
    }
  }
}

export default Articles;
