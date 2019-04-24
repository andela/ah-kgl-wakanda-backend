import { Article, Rating } from '../models';
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
    // get userId from jwt middleware
    const { userId } = req.body;
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
          userId,
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
        userId,
        rate,
      });

      return res.status(201).json({
        message: 'The article was successfully rated',
        data: ratingInfo,
      });
    } catch (err) {
      return res.status(500).json({
        message: 'Fail to rate the article',
      });
    }
  }

  /**
   * @static
   * @param {req} req the request.
   * @param {res} res the response.
   * @returns {Object} the ratings and who rated.
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
      const ratings = await Rating.findAll({
        attributes: ['rate', 'userId'],
        where: {
          articleId: article.id,
        }
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
