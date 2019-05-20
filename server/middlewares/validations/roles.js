import Joi from 'joi';
import errorHandler from '../../helpers/errorHandler';
/**
 *
 *
 * @class Roles
 */
class Roles {
  /**
   *
   * @description Validate roles credentials in the request body
   * @static
   * @param {object} req
   * @param {object} res
   * @param {callback} next
   * @returns {void}
   * @memberof Roles
   */
  static validateRoles(req, res, next) {
    const rolesSchema = {
      name: Joi.string()
        .required(),
      description: Joi.string()
        .required(),
    };

    const result = Joi.validate(req.body, rolesSchema);

    if (result.error) {
      return res.status(400).json({
        message: result.error.details[0].message.replace(/[^a-zA-Z0-9 ]/g, ''),
      });
    }
    next();
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
  static params(req, res, next) {
    const roleId = {
      id: Joi.number()
        .integer()
        .required()
    };

    const { id } = req.params;
    const result = Joi.validate({ id, }, roleId);

    if (!result.error) {
      return next();
    }
    errorHandler.joiErrorResponse(res, result.error);
  }

  /**
   *
   * @static
   * @param {object} req
   * @param {object} res
   * @param {callback} next
   * @returns {void}
   * @memberof Roles
   */
  static optionalBody(req, res, next) {
    const rolesSchema = {
      name: Joi.string(),
      description: Joi.string(),
    };

    const result = Joi.validate(req.body, rolesSchema);

    if (result.error) {
      return res.status(400).json({
        message: result.error.details[0].message.replace(/[^a-zA-Z0-9 ]/g, ''),
      });
    }
    next();
  }
}

export default Roles;
