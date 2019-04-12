/**
 * Handles controller errors
 *
 * @class errorHandler
 */
class errorHandler {
  /**
 *
 *
 * @static
 * @param {*} res
 * @param {*} e
 * @returns {object} error
 * @memberof Articles
 */
  static errorResponse(res, e) {
    if (e.name === 'SequelizeValidationError') {
      return res.status(400).json({
        status: 400,
        message: e.message
      });
    }

    return res.status(500).json({
      status: 500,
      message: e.message
    });
  }
}

export default errorHandler;
