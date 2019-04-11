import { User } from '../models/index';


/**
 * The class handle everything about the user
 */
class Users {
  /**
   * The controller to create a user.
   * @param {req} req the request.
   * @param {res} res the response.
   * @returns {void}
  */
  static async create(req, res) {
    try {
      await User.create(req.user);
    } catch (error) {
      return res.status(400).json({
        status: 400,
        message: 'error message',
      });
    }
  }
}

export default Users;
