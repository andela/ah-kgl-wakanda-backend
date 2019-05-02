import Joi from 'joi';

/**
 * @author Mutombo jean-vincent
 * @class Pagination
 * @description Handle validation for article pagination
*/
class Pagination {
  /**
   * @description Validate rating credentials in the request body
   * @static
   * @param {object} req
   * @param {object} res
   * @param {callback} next
   * @returns {void}
   */
  static validatePagination(req, res, next) {
    const schema = {
      limit: Joi.number()
        .integer()
        .min(1)
        .max(20),
      offset: Joi.number()
        .integer()
        .min(0),
    };

    const pagination = Joi.validate(req.query, schema);

    // validate rate in body
    if (pagination.error) {
      return res.status(400).json({
        message: pagination.error.details[0].message.replace(/[^a-zA-Z0-9 ]/g, ''),
      });
    }
    next();
  }
}

export default Pagination;
