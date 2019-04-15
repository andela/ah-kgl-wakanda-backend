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
      const token = await Users.generateToken(newUser.get());
      return Users.send(res, newUser, token);
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

  /**
   * The controller to create a user.
   * @param {req} req the request.
   * @param {res} res the response.
   * @returns {void}
  */
  static async logIn(req, res) {
    const { body } = req;
    const user = await User.findOne({ where: { email: body.email } });
    // if (user) console.log(user.get().password); else console.log('>>>>null');
    if (!user || !encrypt.comparePassword(user.get().password, body.password)) {
      return res.status(401).json({
        status: 401,
        error: 'The credentials you provided is incorrect',
      });
    }
    const token = await Users.generateToken(user.get());
    return Users.send(res, user, token);
  }

  /**
   * The controller to create a user.
   * @param {user} user the data user.
   * @returns {void}
  */
  static async generateToken(user) {
    const {
      id,
      username,
      email,
    } = user;
    return encrypt.generateToken({ id, username, email });
  }

  /**
   * The controller to create a user.
   * @param {res} res the data user.
   * @param {user} user the data user.
   * @param {token} token the data user.
   * @returns {void}
  */
  static async send(res, user, token) {
    return res.send(
      {
        user: {
          email: user.email,
          token,
          username: user.username,
          bio: user.bio,
          image: user.image,
        }
      }
    );
  }
}

export default Users;
