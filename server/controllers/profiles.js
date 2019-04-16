import { User } from '../models';
/**
 *
 *
 * @class Profiles
 */
class Profiles {
  /**
   * @static
   * @param {req} req the request.
   * @param {res} res the response.
   * @returns {Object} the updated user information.
  */
  static async updateProfile(req, res) {
    try {
      const { userName } = req.params.username;
      console.log(userName);
      
      // const foundUser = await User.findOne({
      //   attributes: ['id'],
      //   //   include: [{ model: User, as: 'author', attributes: ['id', 'username', 'image'] }],
      //   where: {
      //     username: userName,
      //   }
      // });
      // console.log(foundUser);
      
      // if (!foundUser) {
      //   return res.status(404).json({
      //     status: 404,
      //     message: 'User not found',
      //   });
      // }
      const profile = await User.update({
        email: req.body.email,
        bio: req.body.bio,
        image: req.body.image,
        returning: true,
        where: {
          userName,
        }
      });
      return res.status(200).json({
        status: 200,
        profile,
      });
    } catch (error) {
      return res.status(400).json({
        status: 400,
        message: 'error message',
      });
    }
  }
}
export default Profiles;
