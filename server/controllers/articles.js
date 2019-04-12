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
   * @param {*} res
   * @param {*} title
   * @param {*} description
   * @returns {string} slug
   * @memberof Articles
   */
  static async getSlug(res, title, description) {
    try {
      let slug = slugify(title);
      const result = await Article.findAll({ where: { slug } });

      if (result.length > 0) {
        slug = slugify([title, description.split(' ')[0]].join());
        return slug;
      }

      return slug;
    } catch (e) {
      if (e.name === 'SequelizeValidationError') {
        return res.status(400).json({
          status: 400,
          message: e.message
        });
      }

      return res.status(500).json({
        status: 500,
        message: e.message
      });
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
    const { body } = req;

    try {
      body.slug = await Articles.getSlug(res, body.title, body.description);
    } catch (e) {
      errorHandler.errorResponse(res, e);
    }

    try {
      const result = await Article.create(body);
      return res.status(201).json({
        status: 201,
        message: result
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
        message: result
      });
    } catch (e) {
      errorHandler.errorResponse(res, e);
    }
  }
}

export default Articles;
