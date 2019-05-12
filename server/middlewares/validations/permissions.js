import Joi from 'joi';
import errorHandler from '../../helpers/errorHandler';
/**
 *
 *
 * @class Permissions
 */
class Permission {
  /**
   *
   * @description Validate permission credentials in the request body
   * @static
   * @param {object} req
   * @param {object} res
   * @param {callback} next
   * @returns {void}
   * @memberof Permission
   */
  static validatePermission(req, res, next) {
    const permissionSchema = Joi.object().keys({
      permission: {
        resource: Joi.string().required(),
        canCreate: Joi.boolean(),
        canRead: Joi.boolean(),
        canUpdate: Joi.boolean(),
        canDelete: Joi.boolean(),
      }
    });

    const result = Joi.validate(req.body, permissionSchema);
    if (!result.error) {
      return next();
    }
    errorHandler.joiErrorResponse(res, result.error);
  }
}

export default Permission;
