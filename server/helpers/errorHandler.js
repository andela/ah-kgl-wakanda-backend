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

    if (e.message === 'Cannot read property \'length\' of null') {
      return res.status(404).json({
        status: 404,
        message: 'Article not found'
      });
    }

    return res.status(500).json({
      status: 500,
      message: e.message
    });
  }

  /**
*
*
* @static
* @param {*} res
* @param {*} e
* @returns {object} error
* @memberof Articles
*/
  static joiErrorResponse(res, e) {
    return res.status(400).json({
      status: 400,
      message: e.details[0].message.replace(/[^a-zA-Z0-9 ]/g, ''),
    });
  }
}

export default errorHandler;
