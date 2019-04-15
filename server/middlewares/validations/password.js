import Joi from 'joi';

/**
 * @author Mutombo jean-vincent
 * @class Password
 * @description Handle validation for password reset link
 */
class Password {
  /**
   * @description Validate email in the body
   * @static
   * @param {object} req
   * @param {object} res
   * @param {callback} next
   * @returns {void}
   */
  static validateEmail(req, res, next) {
    const emailSchema = {
      email: Joi.string()
        .email()
        .trim()
        .required(),
    };

    const result = Joi.validate(req.body, emailSchema);
    if (result.error) {
      return res.status(400).json({
        message: result.error.details[0].message.replace(/[^a-zA-Z0-9 ]/g, ''),
      });
    }
    next();
  }

  /**
   * @description Validate password in the body
   * @static
   * @param {object} req
   * @param {object} res
   * @param {callback} next
   * @returns {void}
   */
  static validatePassword(req, res, next) {
    const emailSchema = {
      password: Joi.string()
        .min(8)
        .alphanum()
        .required(),
    };

    const result = Joi.validate(req.body, emailSchema);
    if (result.error) {
      return res.status(400).json({
        message: result.error.details[0].message.replace(/[^a-zA-Z0-9 ]/g, ''),
      });
    }
    next();
  }
}

export default Password;