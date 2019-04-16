import Joi from 'joi';

/**
 * @author Mutombo jean-vincent
 * @class Rating
 * @description Handle validation for article rating
*/
class Rating {
  /**
   * @description Validate rating credentials in the request body
   * @static
   * @param {object} req
   * @param {object} res
   * @param {callback} next
   * @returns {void}
   */
  static validateRating(req, res, next) {
    const rateSchema = {
      rate: Joi.number()
        .integer()
        .min(1)
        .max(5)
        .required()
    };

    const slugSchema = {
      slug: Joi
        .string()
        .required()
    };

    const rate = Joi.validate(req.body, rateSchema);
    const slug = Joi.validate(req.params, slugSchema);

    // validate rate in body
    if (rate.error) {
      return res.status(400).json({
        message: rate.error.details[0].message.replace(/[^a-zA-Z0-9 ]/g, ''),
      });
    }

    // validate slug in the url params
    if (slug.error) {
      return res.status(400).json({
        message: slug.error.details[0].message.replace(/[^a-zA-Z0-9 ]/g, ''),
      });
    }
    next();
  }
}

export default Rating;
