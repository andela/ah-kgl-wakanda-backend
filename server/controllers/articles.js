import slugify from '@sindresorhus/slugify';
import open from 'open';
import { Op } from 'sequelize';
import dotenv from 'dotenv';
import {
  Article, User, Tags, ArticleLikes, Rating
} from '../models';
import errorHandler from '../helpers/errorHandler';
import includeQuery from '../helpers/includeQuery';
import readTime from '../helpers/readTime';
import Notifications from './notifications';

dotenv.config();

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
      const { id } = req.user;
      article.userId = id;
      article.slug = await Articles.createSlug(res, article.title);
      const result = await Article.create(article, { include: [{ model: Tags }] });

      Notifications.create({ userId: id, title: 'NEW Article', articleId: result.id, });

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
        include: includeQuery,
        where: { active: true }
      });

      result = result.map((item) => {
        const article = Object.assign(item.dataValues, {
          readTime: readTime(item.title, item.description, item.body)
        });
        return article;
      });

      return res.status(200).json({
        status: 200,
        data: { articles: result, articlesCount: result.length }
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
        where: { slug: req.params.slug, active: true }
      });

      if (result) {
        // Increment an article reads
        const { slug } = result;
        let { reads } = result;
        reads += 1;

        let article = await Article.update({ reads }, {
          where: { slug, },
          returning: true,
          plain: true
        });

        result = Object.assign(result.dataValues, {
          readTime: readTime(result.title, result.description, result.body)
        });

        article = article[1].get();

        article.reads = undefined;

        return res.status(200).json({
          status: 200,
          data: { article }
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
      const { id } = req.user;
      const articleOwner = await Article.findOne({
        where: {
          slug: req.params.slug,
        }
      });
      if (!articleOwner) {
        return res.status(404).json({
          status: 404,
          message: 'Article not found'
        });
      }

      if (articleOwner.userId !== id) {
        return res.status(401).json({
          status: 401,
          message: 'This is not your article'
        });
      }

      if (article.title) {
        article.slug = await Articles.createSlug(res, article.title);
      }

      const { slug } = req.params;
      const result = await Article.update(article, {
        where: { slug, active: true },
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
      const { id } = req.user;
      const articleOwner = await Article.findOne({
        where: {
          slug: req.params.slug,
        }
      });

      if (!articleOwner) {
        return res.status(401).json({
          status: 404,
          message: 'Article not found'
        });
      }

      if (articleOwner.userId !== id) {
        return res.status(401).json({
          status: 401,
          message: 'This is not your article'
        });
      }
      
      const result = await Article.destroy({ where: { slug, }, returning: true });

      if (result > 0) {
        return res.status(200).json({
          status: 200,
          message: 'Article successfully deleted'
        });
      }

      return res.status(200).json({
        status: 200,
        message: 'Article successfully deleted'
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
      const newLike = await ArticleLikes.findOrCreate({
        where: {
          articleId: result.id,
          userId: user.id,
        },
        defaults: {
          articleId: result.id,
          userId: user.id,
        },
      });
      if (!newLike[1]) {
        return res.status(409).json({
          status: 409,
          message: 'You already liked this article'
        });
      }

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

      Notifications.create({ userId: user.id, title: 'NEW Like', articleId: result.id });

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
      return res.status(409).json({
        status: 409,
        message: 'Article has to be favorited first'
      });
    } catch (error) {
      errorHandler.errorResponse(res, error);
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
  static async share(req, res) {
    const { slug, channel } = req.params;
    const article = await Articles.checkArticle(slug);
    if (!article) {
      return res.status(404).json({
        status: 404,
        message: 'We didn\'t find that article would you like to write one?'
      });
    }
    const url = `${process.env.URL}/api/articles/${slug}/share/${channel}`;
    switch (channel) {
      case 'facebook':
        if (process.env.NODE_ENV !== 'test') { open(`https:www.facebook.com/sharer/sharer.php?u=${url}`); }
        res.status(200).json({
          status: 200,
          message: `Article shared to ${channel}`,
          url,
        });
        break;
      case 'twitter':
        if (process.env.NODE_ENV !== 'test') { open(`https://twitter.com/intent/tweet?url=${url}`); }
        res.status(200).json({
          status: 200,
          message: `Article shared to ${channel}`,
          url,
        });
        break;
      case 'mail':
        if (process.env.NODE_ENV !== 'test') { open(`mailto:?subject=${slug}&body=${url}`); }
        res.status(200).json({
          status: 200,
          message: `Article shared to ${channel}`,
          url,
        });
        break;
      default:
        break;
    }
  }

  /**
   *
   *
   * @static
   * @param {string} slug
   * @returns {object} response
   * @memberof Articles
   */
  static async checkArticle(slug) {
    try {
      const article = await Article.findOne({
        include: [{
          model: Tags
        }],
        where: { slug }
      });
      return article;
    } catch (error) {
      return null;
    }
  }

  /**
     * @static
     * @description convert mutliple tags separeted by space or commas into an array of tags
     * @param {string} tag
     * @returns {string[]} tagList
    */
  static tagsToArray(tag) {
    const tagList = tag.split(/[ ,]+/)
      .filter(Boolean)
      .map(item => item.replace(/,+/g, ''));
    return tagList;
  }

  /**
     * search filter for articles
     * @author Mutombo jean-vincent
     * @static
     * @param {*} req
     * @param {*} res
     * @returns {object} response
     * @memberof Articles
    */
  static async search(req, res) {
    // get query string
    const {
      author, title, tag, keyword, offset = 0, limit = 20
    } = req.query;

    const pagination = { offset, limit };
    let result;

    try {
      if (author) {
        result = await Articles.filterByAuthor(author, pagination);
      } else if (title) {
        result = await Articles.filterByTitle(title, pagination);
      } else if (keyword) {
        result = await Articles.filterByKeywords(keyword, pagination);

        // If we don't find article inside title, body or description
        // we search it inside tag
        if (result.length === 0) {
          result = await Articles.filterByTags(keyword);
        }
      } else if (tag) {
        result = await Articles.filterByTags(tag);
      } else {
        return res.status(400).json({
          message: 'search paramater are required'
        });
      }

      return res.status(200).json({
        status: 200,
        data: { articles: result }
      });
    } catch (e) {
      return res.status(500).json({
        message: 'Failed to search article'
      });
    }
  }

  /**
     * helps filter by author
     *
     * @description Check whether title matches or
     * if title contains the value passed as params
     * @static
     * @param {string} author
     * @param {object} pagination
     * @returns {object} response
     * @memberof Articles
    */
  static async filterByAuthor(author, pagination) {
    const where = {
      username: { [Op.iLike]: `%${author}%` }
    };

    const result = await Article.findAll({
      order: [['createdAt', 'DESC']],
      limit: pagination.limit,
      offset: pagination.offset,
      include: [
        {
          model: User,
          attributes: ['username', 'email', 'image'],
          where,
        },
        {
          model: Tags,
        },
        {
          model: Rating,
          attributes: ['rate']
        }
      ]
    });

    return result;
  }

  /**
     * helps filter by title
     *
     * @description Check whether title matches or
     * if title contains the value passed as params
     * @static
     * @param {string} title
     * @param {object} pagination
     * @returns {object} response
     * @memberof Articles
    */
  static async filterByTitle(title, pagination) {
    const where = {
      title: { [Op.iLike]: `%${title}%` }
    };

    const result = await Article.findAll({
      order: [['createdAt', 'DESC']],
      limit: pagination.limit,
      offset: pagination.offset,
      where,
      include: includeQuery
    });

    return result;
  }

  /**
     * helps filter by keyword
     *
     * @description search the keyword inside the article title, body or description
     * @static
     * @param {string} keywords
     * @param {object} pagination
     * @returns {object} response
     * @memberof Articles
    */
  static async filterByKeywords(keywords, pagination) {
    const where = {
      [Op.or]: [
        { title: { [Op.iLike]: `%${keywords}%` } },
        { body: { [Op.iLike]: `%${keywords}%` } },
        { description: { [Op.iLike]: `%${keywords}%` } }
      ]
    };

    const result = await Article.findAll({
      order: [['createdAt', 'DESC']],
      limit: pagination.limit,
      offset: pagination.offset,
      where,
      include: includeQuery
    });

    return result;
  }

  /**
     * helps filter by tag
     *
     * @description search if tagName contains tags pass in params
     * @static
     * @param {string[]} tags
     * @returns {object} response
     * @memberof Articles
    */
  static async filterByTags(tags) {
    const tagsList = Articles.tagsToArray(tags);
    const where = {
      [Op.or]: [
        { tagName: tagsList }
      ]
    };

    const result = await Tags.findAll({
      where,
      include: [{
        model: Article,
        include: [
          {
            model: User,
            attributes: ['username', 'email', 'image'],
          },
          {
            model: Rating,
            attributes: ['rate']
          }
        ],
        order: [['createdAt', 'DESC']],
      }]
    });

    return result;
  }

  /**
     * Gets the article statistic
     * about the number of reads
     *
     * @static
     * @param {*} req
     * @param {*} res
     * @returns {object} article
     * @memberof Articles
     */
  static async stats(req, res) {
    const { slug } = req.params;

    try {
      const article = await Article.findOne({ where: { slug }, attributes: ['userId', 'slug', 'title', 'reads'] });

      if (!article) {
        return res.status(404).json({
          status: 404,
          message: 'Article not found',
        });
      }

      if (req.user.id !== article.userId) {
        return res.status(401).json({
          status: 401,
          message: 'Only the owner can view the read stats',
        });
      }

      article.userId = undefined;

      return res.status(200).json({
        status: 200,
        article,
      });
    } catch (e) {
      errorHandler.errorResponse(res, e);
    }
  }
}
export default Articles;
