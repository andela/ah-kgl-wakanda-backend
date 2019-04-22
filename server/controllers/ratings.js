import { Rating, Article } from '../models';

/**
 *
 *
 * @class Ratings
 */
class Ratings {
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
