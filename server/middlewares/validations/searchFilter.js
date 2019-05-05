import Joi from 'joi';

/**
 * @author Mutombo jean-vincent
 * @class SearchFilter
 * @description Handle validation for article search filter
*/
class SearchFilter {
  /**
   * @description Validate rating credentials in the request body
   * @static
   * @param {object} req
   * @param {object} res
   * @param {callback} next
   * @returns {void}
   */
  static validateFilter(req, res, next) {
    const schema = {
      limit: Joi.number()
        .integer()
        .min(1)
        .max(20),
      offset: Joi.number()
        .integer()
        .min(0),
      author: Joi.string(),
      title: Joi.string(),
      keyword: Joi.string(),
      tag: Joi.string(),
    };

    const filter = Joi.validate(req.query, schema);

    if (filter.error) {
      return res.status(400).json({
        message: filter.error.details[0].message.replace(/[^a-zA-Z0-9 ]/g, ''),
      });
    }
    next();
  }
}

export default SearchFilter;
