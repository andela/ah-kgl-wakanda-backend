import slugify from '@sindresorhus/slugify';
import { Article, Tags, ArticleLikes } from '../models';
import errorHandler from '../helpers/errorHandler';
import includeQuery from '../helpers/includeQuery';
import readTime from '../helpers/readTime';
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
    // get query string
    const { limit = 20, offset = 0 } = req.query;
    try {
      let result = await Article.findAll({
        order: [['createdAt', 'DESC']],
        limit,
        offset,
        include: includeQuery
      });

      result = result.map((item) => {
        const article = Object.assign(item.dataValues, {
          readTime: readTime(item.title, item.description, item.body)
        });
        return article;
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
      let result = await Article.findOne({
        include: [{
          model: Tags
        }],
        where: { slug: req.params.slug }
      });

      if (result) {
        result = Object.assign(result.dataValues, {
          readTime: readTime(result.title, result.description, result.body)
        });

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
      return res.status(200).json({
        status: 200,
        data: { article: result[1].get() }
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

  /**
 *
 *
 * @static
 * @param {*} req
 * @param {*} res
 * @returns {object} response
 * @memberof Articles
 */
  static async like(req, res) {
    try {
      const result = await Article.findOne({
        include: [{
          model: Tags
        }],
        where: { slug: req.params.slug }
      });

      if (!result) {
        return res.status(404).json({
          status: 404,
          message: 'Article not found'
        });
      }

      const { user } = req;
      await ArticleLikes.findOrCreate({
        where: {
          articleId: result.id,
          userId: user.id,
        },
        defaults: {
          articleId: result.id,
          userId: user.id,
        },
      });
      const totOfLikes = await ArticleLikes.findAndCountAll({
        where: { articleId: result.id }
      });
      const { slug } = req.params;
      const updateArticle = await Article.update(
        {
          favorited: true,
          favoritesCount: totOfLikes.count,
        },
        {
          where: { slug, },
          returning: true,
          plain: true
        }
      );
      return res.status(200).json({
        status: 200,
        data: { article: updateArticle[1].get() }
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
  static async unlike(req, res) {
    try {
      const { user } = req;
      const { slug } = req.params;
      const article = await Article.findOne({
        include: [{
          model: Tags
        }],
        where: { slug }
      });

      if (!article) {
        return res.status(404).json({
          status: 404,
          message: 'Article not found'
        });
      }
      const isLiked = await ArticleLikes.findOne({
        where: {
          articleId: article.id,
          userId: user.id,
        }
      });
      if (isLiked) {
        await ArticleLikes.destroy({
          where: {
            articleId: article.id,
            userId: user.id,
          },
          returning: true,
        });

        const totOfLikes = await ArticleLikes.findAndCountAll({
          where: { articleId: article.id }
        });
        let updateArticle;
        if (totOfLikes.count > 0) {
          updateArticle = await Article.update(
            {
              favoritesCount: totOfLikes.count,
            },
            {
              where: { slug, },
              returning: true,
              plain: true
            }
          );
        } else {
          updateArticle = await Article.update(
            {
              favorited: false,
              favoritesCount: totOfLikes.count,
            },
            {
              where: { slug, },
              returning: true,
              plain: true
            }
          );
        }
        return res.status(200).json({
          status: 200,
          data: { article: updateArticle }
        });
      }
      return res.status(404).json({
        status: 404,
        message: 'Article has to be favorited first'
      });
    } catch (error) {
      errorHandler.errorResponse(res, error);
    }
  }
}
export default Articles;
