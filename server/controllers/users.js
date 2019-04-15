import { User } from '../models/index';
import encrypt from '../helpers/encrypt';

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
  static async signUp(req, res) {
    try {
      const hashedPassword = encrypt.hashPassword(req.body.password);
      const { username, email } = req.body;
      const newUser = await User.create({ username, email, password: hashedPassword });
      const data = {
        id: newUser.get().id,
        username,
        email,
      };
      const token = encrypt.generateToken(data);
      return res.send(
        {
          user: {
            email,
            token,
            username,
            bio: newUser.bio,
            image: newUser.image,
          }
        }
      );
    } catch (error) {
      if (error.errors[0].message === 'email must be unique') {
        return res.status(400).json({
          status: 409,
          message: 'Email already exists',
        });
      }
      return res.status(400).json({
        status: 400,
        message: error.errors[0].message,
      });
    }
  }
}

export default Users;
