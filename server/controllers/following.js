import { User, Following } from '../models';
import errorHandler from '../helpers/errorHandler';
/**
 *
 *
 * @class Follows
 */
class Follows {
  /**
       *
       *
       * @static
       * @param {object} req
       * @param {object} res
       * @param {string} string
       * @returns {object} response
       * @memberof Follows
       */
  static async followingInfo(req, res) {
    try {
      const follower = req.user;
      const user = await User.findOne({
        attributes: ['id', 'username', 'email', 'bio', 'image'],
        where: { username: req.params.username }
      });
      if (!user) {
        return res.status(404).json({
          status: 404,
          message: 'We don\'t find who you want to follow'
        });
      }

      return { follower, user };
    } catch (e) {
      errorHandler.errorResponse(res, e);
    }
  }

  /**
       *
       *
       * @static
       * @param {object} req
       * @param {object} res
       * @param {string} string
       * @returns {object} response
       * @memberof Follows
       */
  static async follow(req, res) {
    try {
      if (await Follows.followingInfo(req, res)) {
        const response = await Follows.followingInfo(req, res);
        
        const followedId = response.user.id;
        const followerId = response.follower.id;
        const followed = await Following.findOrCreate({
          where: {
            followedId,
            followerId
          },
        });
        if (!followed[1]) {
          return res.status(400).json({
            status: 400,
            message: 'You\'re alredy a follower of this user',
          });
        }
        return res.status(200).json({
          status: 200,
          message: `Successfully followed user ${req.params.username}`,
          profile: {
            username: response.user.username,
            email: response.user.email,
            bio: response.user.bio,
            image: response.user.image
          }
        });
      }
    } catch (e) {
      errorHandler.errorResponse(res, e);
    }
  }

  /**
       *
       *
       * @param {object} req
       *  @param {object} res
       * @param {string} string
       * @returns {object} response
       * @memberof Follows
       */
  static async unfollow(req, res) {
    try {
      if (await Follows.followingInfo(req, res)) {
        const response = await Follows.followingInfo(req, res);
        const followed = await Following.findOne({
          where: {
            followedId: response.user.id,
            followerId: response.follower.id
          },
        });
        if (followed) {
          await Following.destroy({
            where: {
              followedId: response.user.id,
              followerId: response.follower.id
            }

          });
          return res.status(200).json({
            status: 200,
            message: `Successfully unfollowed user ${req.params.username}`,
            profile: {
              username: response.user.username,
              email: response.user.email,
              bio: response.user.bio
            }
          });
        }
        return res.status(404).json({
          status: 404,
          message: 'You\'re not a follower of this user',
        });
      }
    } catch (e) {
      errorHandler.errorResponse(res, e);
    }
  }

  /**
       *
       *
       * @param {object} req
       *  @param {object} res
       * @param {string} string
       * @returns {object} response
       * @memberof Follows
       */
  static async follows(req, res) {
    try {
      const followers = await Following.findAll({
        include: [{
          model: User,
          as: 'followers',
          attributes: ['id', 'username', 'email', 'bio']
        }],
        where: {
          followedId: req.user.id,
        },
      });

      const followees = await Following.findAll({
        include: [{
          model: User,
          as: 'followees',
          attributes: ['id', 'username', 'email', 'bio']
        }],
        where: {
          followerId: req.user.id,
        },
      });
      return res.json({ followees, followers });
    } catch (e) {
      errorHandler.errorResponse(res, e);
    }
  }
}
export default Follows;
