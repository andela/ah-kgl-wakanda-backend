import { User } from '../models/index';
import Users from './users';
import encrypt from '../helpers/encrypt';
import sendMail from '../helpers/sendVerificationEmail';


/**
 * The class handle everything about the Admin
 */
class Admin {
  /**
   * The controller to create a user by the admin.
   * @param {req} req the request.
   * @param {res} res the response.
   * @returns {void}
  */
  static async createUsers(req, res) {
    try {
      const hashedPassword = encrypt.hashPassword(req.body.password);
      const {
        firstname, lastname, username, email, password
      } = req.body;
      const newUser = await User.create({
        firstname, lastname, username, email, password: hashedPassword
      });
      const token = await Users.generateToken(newUser.get());
      const body = `
        You have been added to Author haven by the Admin and your account must be activated before you can use it 
        To activate your account use the link bellow.
        username: ${username}
        password: ${password} 
        Note that the password can be changed anytime
      `;
      if (process.env.NODE_ENV !== 'test') await sendMail(email, username, token, body);
      return res.status(200).json({
        status: 200,
        message: `An email has been sent to ${email} for verification`,
      });
    } catch (error) {
      Admin.errorHandler(res, error);
    }
  }

  /**
   * The controller to update a user by the admin.
   * @param {req} req the request.
   * @param {res} res the response.
   * @returns {void}
  */
  static async updateUsers(req, res) {
    try {
      const { username } = req.params;
      const {
        firstname, lastname, email, bio, image
      } = req.body;
      const user = await Users.getUser(username, res);
      if (!user) {
        return res.status(404).json({
          status: 404,
          message: 'User not found',
        });
      }
      const result = await User.update(
        {
          firstname,
          lastname,
          email,
          bio,
          image,
        },
        {
          where: { username },
          returning: true
        }
      );
      delete result[1][0].get().password;
      if (user.get().email !== email) {
        const token = await Users.generateToken(user.get());
        const body = `
        Your email has been changed by the Admin.
        To activate your new email use the link bellow. 
        Note that the password can be changed anytime
      `;
        if (process.env.NODE_ENV !== 'test') await sendMail(email, username, token, body);
        return res.status(200).json({
          status: 200,
          message: `A token has been sent to the new email (${email}) for verification`,
          user: result[1][0],
        });
      }
      return res.status(200).json({
        status: 200,
        user: result[1][0],
      });
    } catch (error) {
      Admin.errorHandler(res, error);
    }
  }

  /**
   * The controller to update a user by the admin.
   * @param {req} req the request.
   * @param {res} res the response.
   * @returns {void}
  */
  static async deleteUsers(req, res) {
    try {
      const { username } = req.params;
      const user = await Users.getUser(username, res);
      if (!user) {
        return res.status(404).json({
          status: 404,
          message: 'User not found',
        });
      }
      await User.destroy({ where: { username, }, returning: true });
      return res.status(200).json({
        status: 200,
        message: `User ${user.get().username} deleted successfully`,
      });
    } catch (error) {
      Admin.errorHandler(res, error);
    }
  }

  /**
   * The controller to update a user by the admin.
   * @param {req} req the request.
   * @param {res} res the response.
   * @returns {void}
  */
  static async makeAdmin(req, res) {
    try {
      const { username } = req.params;
      const user = await Users.getUser(username, res);
      if (!user) {
        return res.status(404).json({
          status: 404,
          message: 'User not found',
        });
      }
      if (user.get().roles === 'admin') {
        return res.status(400).json({
          status: 400,
          message: `${username} is already an admin`,
        });
      }
      const newAdmin = await User.update(
        { roles: 'admin', },
        {
          where: { username },
          returning: true
        }
      );
      delete newAdmin[1][0].get().password;
      return res.status(200).json({
        status: 200,
        message: `${username} is now an admin`,
        user: newAdmin[1][0],
      });
    } catch (error) {
      Admin.errorHandler(res, error);
    }
  }


  /**
   * The controller to update a user by the admin.
   * @param {req} req the request.
   * @param {res} res the response.
   * @returns {void}
  */
  static async makeUser(req, res) {
    try {
      const { username } = req.params;
      const user = await Users.getUser(username, res);
      if (!user) {
        return res.status(404).json({
          status: 404,
          message: 'User not found',
        });
      }
      if (user.get().roles === 'user') {
        return res.status(400).json({
          status: 400,
          message: `${username} is already a normal user`,
        });
      }
      const newAdmin = await User.update(
        { roles: 'user', },
        {
          where: { username },
          returning: true
        }
      );
      delete newAdmin[1][0].get().password;
      return res.status(200).json({
        status: 200,
        message: `${username} is now a normal user`,
        user: newAdmin[1][0],
      });
    } catch (error) {
      Admin.errorHandler(res, error);
    }
  }

  /**
   * The controller to update a user by the admin.
   * @param {string} res the request.
   * @param {string} error the response.
   * @returns {void}
  */
  static errorHandler(res, error) {
    if (error.errors[0].message === 'email must be unique') {
      return res.status(409).json({
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

export default Admin;
