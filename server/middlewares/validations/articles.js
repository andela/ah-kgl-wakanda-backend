import Joi from 'joi';

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
    const articleSchema = {
      title: Joi.string().required(),
      description: Joi.string().required(),
      body: Joi.string().required()
    };

    const result = Joi.validate(req.body, articleSchema);
    if (result.error) {
      return res.status(400).json({
        status: 400,
        message: result.error.details[0].message.replace(/[^a-zA-Z0-9 ]/g, ''),
      });
    }

    next();
  }
}

export default articles;
