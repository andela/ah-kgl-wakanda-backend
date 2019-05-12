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
    const rolesSchema = Joi.object().keys({
      roles: {
        name: Joi.string().required(),
        description: Joi.string().required(),
      }
    });

    const result = Joi.validate(req.body, rolesSchema);
    if (!result.error) {
      return next();
    }
    errorHandler.joiErrorResponse(res, result.error);
  }
}

export default Roles;
