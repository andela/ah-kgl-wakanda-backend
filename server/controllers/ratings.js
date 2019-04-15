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
   * @returns {Object} the average.
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
}

export default Ratings;
