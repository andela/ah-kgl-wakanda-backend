import { Report, Article } from '../models';
import checkSlug from '../helpers/checkSlug';
import errorHandler from '../helpers/errorHandler';
import Notifications from './notifications';

/**
 *
 *
 * @class Report
 */
class Reports {
  /**
   *
   * report an article
   * @static
   * @param {object} req
   * @param {object} res
   * @returns {object} response
   * @memberof Report
   */
  static async create(req, res) {
    try {
      const articleId = await checkSlug(req, res);
      if (typeof articleId !== 'number') {
        return false;
      }
      const { type, message } = req.body;
      const reporter = req.user.id;

      const newReport = await Report.findOrCreate({
        where: { articleId, type, reporter },
        defaults: {
          articleId, type, reporter, message
        }
      });
      if (!newReport[1]) {
        return res.status(400).json({
          status: 400,
          message: 'You have already reported the article',
          data: {
            articleId: newReport[0].articleId,
            reporter: newReport[0].reporter,
            type: newReport[0].type,
          }
        });
      }
      Notifications.create({ userId: reporter, title: 'NEW Report', articleId, });
      return res.status(201).send({
        status: 201,
        data: {
          id: newReport[0].id,
          articleId: newReport[0].articleId,
          reporter: newReport[0].reporter,
          type: newReport[0].type,
          message: newReport[0].message,
        }
      });
    } catch (e) {
      errorHandler.errorResponse(res, e);
    }
  }

  /**
   *
   * get one reported articles
   * @static
   * @param {object} req
   * @param {object} res
   * @returns {object} response
   * @memberof Report
   */
  static async getOneReportedArticles(req, res) {
    try {
      const articleId = await checkSlug(req, res);
      if (typeof articleId !== 'number') {
        return false;
      }
      const article = await Article.findOne({
        where: { id: articleId, },
        attributes: ['id', 'slug', 'title'],
        include: {
          model: Report,
          required: true,
        }
      });

      if (!article) {
        return res.status(404).json({
          status: 404,
          message: 'No report for this article',
        });
      }

      return res.status(200).json({
        status: 200,
        article,
      });
    } catch (e) {
      errorHandler.errorResponse(res, e);
    }
  }

  /**
   *
   * get all reported articles
   * @static
   * @param {object} req
   * @param {object} res
   * @returns {object} response
   * @memberof Report
   */
  static async getAllReportedArticles(req, res) {
    try {
      let articles = await Article.findAll({
        include: {
          model: Report,
          attributes: {
            exclude: ['articleId']
          },
          order: [[{ model: Report }, 'createdAt', 'DESC']],
          required: true
        },
        order: [[{ model: Report }, 'createdAt', 'DESC']],
        attributes: ['id', 'slug', 'title', 'description'],
      });

      articles = articles.map((article) => {
        article.dataValues.reportsCount = article.Reports.length;
        return article;
      });

      return res.status(200).json({
        status: 200,
        articles,
      });
    } catch (e) {
      errorHandler.errorResponse(res, e);
    }
  }

  /**
   *
   * get one report on an article
   * @static
   * @param {object} req
   * @param {object} res
   * @returns {object} response
   * @memberof Report
   */
  static async getOneReport(req, res) {
    try {
      const articleId = await checkSlug(req, res);
      if (typeof articleId !== 'number') {
        return false;
      }
      const { id } = req.params;
      const report = await Report.findOne({
        include: {
          model: Article,
          attributes: ['slug', 'title', 'description']
        },
        attributes: {
          exclude: ['articleId']
        },
        where: {
          articleId,
          id,
        }
      });

      if (!report) {
        return res.status(404).json({
          status: 404,
          message: 'Report not found',
        });
      }

      return res.status(200).json({
        status: 200,
        report,
      });
    } catch (e) {
      errorHandler.errorResponse(res, e);
    }
  }

  /**
   *
   * delete a report
   * @static
   * @param {object} req
   * @param {object} res
   * @returns {object} response
   * @memberof Report
   */
  static async delete(req, res) {
    try {
      const articleId = await checkSlug(req, res);
      if (typeof articleId !== 'number') {
        return false;
      }
      const { id } = req.params;
      const result = await Report.destroy({ where: { id, }, returning: true });

      if (result > 0) {
        return res.status(200).json({
          status: 200,
          message: 'Report successfully deleted'
        });
      }

      return res.status(404).json({
        status: 404,
        message: 'Report not found',
      });
    } catch (e) {
      errorHandler.errorResponse(res, e);
    }
  }

  /**
   *
   * delete a report
   * @static
   * @param {object} req
   * @param {object} res
   * @returns {object} response
   * @memberof Report
   */
  static async deleteArticle(req, res) {
    try {
      const articleId = await checkSlug(req, res);
      if (typeof articleId !== 'number') {
        return false;
      }
      const isReported = await Report.findOne({
        where: { articleId, },
        attributes: ['id']
      });

      if (!isReported) {
        return res.status(404).json({
          status: 404,
          message: 'The article is not reported',
        });
      }

      const result = await Article.destroy({ where: { id: articleId, }, returning: true });

      return res.status(200).json({
        status: 200,
        result,
        message: 'Article successfully deleted'
      });
    } catch (e) {
      errorHandler.errorResponse(res, e);
    }
  }
}

export default Reports;
