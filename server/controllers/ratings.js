import { Article, Rating } from '../models';
import errorHandler from '../helpers/errorHandler';

/**
 * @author Gisele Iradukunda
 * @class Rating
 * @description Handle article rating activity
 */
class Ratings {
  /**
   * @description create rate for an article
   * @static
   * @param {req} req the request.
   * @param {res} res the response.
   * @returns {Object} .
  */
  static async create(req, res) {
    // get id from jwt middleware
    const { id } = req.user;
    const { rate } = req.body;
    const { slug } = req.params;

    try {
      // check if the article exist in the DB
      const article = await Article.findOne({
        attributes: ['id'],
        where: {
          slug,
        }
      });
      if (!article) {
        return res.status(404).json({
          message: 'Article was not found',
        });
      }

      const ratedArticle = await Rating.findOne({
        where: {
          articleId: article.id,
          userId: id,
        }
      });

      // if the article is already rated. We should edit it only
      if (ratedArticle) {
        const updateRate = await ratedArticle.update({
          rate,
        });

        return res.status(200).json({
          message: 'The article rating was successfully edited',
          data: updateRate,
        });
      }
      const ratingInfo = await Rating.create({
        articleId: article.id,
        userId: id,
        rate,
      });

      return res.status(201).json({
        message: 'The article was successfully rated',
        data: ratingInfo,
      });
    } catch (err) {
      errorHandler.errorResponse(res, err);
    }
  }

  /**
   * @static
   * @param {req} req the request.
   * @param {res} res the response.
   * @returns {Object} the average.
  */
  static async findArticleRatings(req, res) {
    const { slug } = req.params;

    try {
      const article = await Article.findOne({
        attributes: ['id'],
        where: {
          slug,
        }
      });
      if (!article) {
        return res.status(404).json({
          status: 404,
          message: 'Article not found',
        });
      }

      const where = {
        articleId: article.id,
      };

      const ratings = await Rating.findAll({
        attributes: ['rate', 'userId'],
        where,
        offset: req.query.offset || null,
        limit: req.query.limit || null
      });

      return res.status(200).json({
        status: 200,
        ratings,
      });
    } catch (error) {
      return res.status(400).json({
        status: 400,
        message: error,
      });
    }
  }
}
export default Ratings;
