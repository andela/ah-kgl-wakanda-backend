import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import mailer from '../helpers/mailer';
import { User } from '../models';

dotenv.config();

const appDomain = 'app.heroku.com';
const resetLink = `${appDomain}/api/users/password`;
/**
 * @author Mutombo jean-vincent
 * @class Password
 * @description Handle password reset activity
 */
class Password {
  /**
   *
   *
   * @static
   * @param {object} req
   * @param {object} res
   * @returns {object} response
   */
  static async resetPassword(req, res) {
    // get the email
    const { email } = req.body;

    try {
      // check if the email exist in the DB
      const result = await User.findOne({
        where: {
          email
        }
      });

      if (!result) {
        return res.status(404).json({
          message: 'No user found with this email address',
        });
      }
      // get the username
      const userName = result.username;

      // encrypt the reset password token
      const token = await jwt.sign({ email }, process.env.JWT_SECRET_KEY, { expiresIn: '24h' });

      // send the user the token to reset password
      const sendEmailResponse = await Password.sendEmail(email, userName, token);

      if (sendEmailResponse.sent) {
        return res.status(200).json({
          message: 'Reset Password email successfully delivered',
          data: { email, token }
        });
      }

      return res.status(500).json({
        message: 'Fail to send the reset email',
        error: sendEmailResponse,
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Fail to send the reset email',
      });
    }
  }

  /**
   * Send a link containing a token to reset the password,
   * returns an object with a {sent} property
   *
   * @param {string} email
   * @param {string} name
   * @param {string} token
   * @returns {object} {sent,error}
   */
  static async sendEmail(email, name, token) {
    const link = `${resetLink}/${token}`;
    const body = `
      You have requested for a password reset. 
      Tap the button below to reset your account password.
      Ignore the email if you didnt request for a new password
    `;

    try {
      const response = await mailer({
        email,
        subject: 'Reset password',
        text: `${name}`,
        link,
        linkText: 'RESET PASSWORD',
        name,
        title: 'Reset your password',
        body
      });

      return response;
    } catch (error) {
      return {
        sent: false,
        error
      };
    }
  }

  /**
   * Update the user password
   *
   * @param {object} req request
   * @param {object} res response
   * @returns {object} response
   */
  static async updatePassword(req, res) {
    const { token } = req.params;
    const { password } = req.body;
    try {
      await jwt.verify(token, process.env.JWT_SECRET_KEY, async (error, decoded) => {
        if (error) {
          return res.status(400).json({
            message: 'The link appears to be invalid or already expired'
          });
        }

        // check if the email exist in the DB
        User.findOne({
          where: {
            email: decoded.email,
          }
        }).then(async (result) => {
          if (!result) {
            return res.status(404).json({
              message: 'No user found with this email address'
            });
          }

          // encrypt the new password
          const hashNewPassword = await bcrypt.hashSync(password, bcrypt.genSaltSync(8));

          // compare the new pwd with the hash version of the old pwd
          const matchPasswords = await bcrypt.compareSync(
            password, result.password
          );

          if (matchPasswords) {
            return res.status(400).json({
              message: 'New password must be different from the current'
            });
          }
          await result.update({ password: hashNewPassword });
          return res.status(200).json({
            message: 'Password updated successfully'
          });
        });
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Failed to update the password',
      });
    }
  }
}

export default Password;
