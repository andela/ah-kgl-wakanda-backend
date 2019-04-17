import Joi from 'joi';
import errorHandler from '../../helpers/errorHandler';
/**
 *
 *
 * @class articles
 */
class articles {
  /**
   *
   *
   * @static
   * @param {object} req
   * @param {object} res
   * @param {callback} next
   * @returns {void}
   * @memberof articles
   */
  static create(req, res, next) {
    const articleSchema = Joi.object().keys({
      article: {
        title: Joi.string().required(),
        description: Joi.string().required(),
        body: Joi.string().required(),
        images: Joi.array(),
        Tags: Joi.array()
      }
    });

    const result = Joi.validate(req.body, articleSchema);
    if (!result.error) {
      return next();
    }
    errorHandler.joiErrorResponse(res, result.error);
  }

  /**
   *
   *
   * @static
   * @param {object} req
   * @param {object} res
   * @param {callback} next
   * @returns {void}
   * @memberof articles
   */
  static get(req, res, next) {
    const slugSchema = {
      slug: Joi.string().required()
    };

    const { slug } = req.params;

    const result = Joi.validate({ slug, }, slugSchema);

    if (!result.error) {
      return next();
    }
    errorHandler.joiErrorResponse(res, result.error);
  }

  /**
   *
   *
   * @static
   * @param {object} req
   * @param {object} res
   * @param {callback} next
   * @returns {void}
   * @memberof articles
   */
  static update(req, res, next) {
    const articleSchema = Joi.object().keys({
      article: {
        title: Joi.string(),
        description: Joi.string(),
        body: Joi.string()
      }
    });

    const result = Joi.validate(req.body, articleSchema);

    if (!result.error) {
      return next();
    }
    errorHandler.joiErrorResponse(res, result.error);
  }
}

export default articles;
