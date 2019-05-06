import { User } from '../models';
/**
 *
 *
 * @class Notifications
 */
class Notifications {
  /**
         *
         *
         * @static
         * @param {object} req
         * @param {object} res
         * @returns {object} response
         * @memberof Notifications
         */
  static async subscribe(req, res) {
    const { id } = req.user;
    const user = await User.findOne({ where: { id } });
    let allow;
    if (user.allowEmailNotification) {
      allow = false;
    } else {
      allow = true;
    }
    const updatedUser = await User.update(
      { allowEmailNotification: allow },
      {
        where: { id },
        returning: true,
        plain: true,
      },
    );
    const newUser = {
      username: updatedUser[1].username,
      email: updatedUser[1].email,
      bio: updatedUser[1].bio,
      image: updatedUser[1].image,
      allowEmailNotification: updatedUser[1].allowEmailNotification
    };
    res.status(200).json({ status: 200, user: newUser });
  }
}

export default Notifications;
