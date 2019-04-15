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
   * @param {object} res
   * @param {string} string
   * @returns {string} slug
   * @memberof Articles
   */
  static async createSlug(res, string) {
    try {
      const slug = `${await slugify(string)}-${Math.floor(Math.random() * 999999999) + 100000000}`;
      return slug;
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
   * @memberof Articles
   */
  static async create(req, res) {
    try {
      const { article } = req.body;
      article.slug = await Articles.createSlug(res, article.title);
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
      const { article } = req.body;

      if (article.title) {
        article.slug = await Articles.createSlug(res, article.title);
      }

      const { slug } = req.params;
      const result = await Article.update(article, {
        where: { slug, },
        returning: true,
        plain: true
      });
      if (result) {
        return res.status(200).json({
          status: 200,
          data: { article: result[1].get() }
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
          message: 'Article successfully deleted'
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
