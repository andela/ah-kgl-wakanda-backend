import Joi from 'joi';
import errorHandler from '../../helpers/errorHandler';
/**
 *
 *
 * @class Ratings
 */
class Ratings {
  /**
   *
   *
   * @static
   * @param {object} req
   * @param {object} res
   * @param {callback} next
   * @returns {void}
   * @memberof Ratings
   */
  static queries(req, res, next) {
    const querySchema = {
      offset: Joi.number(),
      limit: Joi.number()
    };

    const result = Joi.validate(req.query, querySchema);
    if (!result.error) {
      return next();
    }
    errorHandler.joiErrorResponse(res, result.error);
  }
}

export default Ratings;
