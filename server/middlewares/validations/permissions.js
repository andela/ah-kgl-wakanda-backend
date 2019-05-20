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
    const permissionSchema = {
      resource: Joi.string()
        .required(),
      canCreate: Joi.boolean(),
      canRead: Joi.boolean(),
      canUpdate: Joi.boolean(),
      canDelete: Joi.boolean(),
    };

    const result = Joi.validate(req.body, permissionSchema);

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
    const permission = {
      permissionId: Joi.number()
        .integer()
        .required()
    };

    const { permissionId } = req.params;
    const result = Joi.validate({ permissionId, }, permission);

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
    const permissionSchema = {
      resource: Joi.string(),
      canCreate: Joi.boolean(),
      canRead: Joi.boolean(),
      canUpdate: Joi.boolean(),
      canDelete: Joi.boolean(),
    };

    const result = Joi.validate(req.body, permissionSchema);

    if (result.error) {
      return res.status(400).json({
        message: result.error.details[0].message.replace(/[^a-zA-Z0-9 ]/g, ''),
      });
    }
    next();
  }
}

export default Permission;
