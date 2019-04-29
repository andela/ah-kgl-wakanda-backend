import { Users, Follows } from '../models';
import errorHandler from '../helpers/errorHandler';
/**
 *
 *
 * @class Following
 */
class Following {
  //   static async existance(req, res) {
  //     try {
  //       const followed = await Users.findOne({
  //         where: { id: req.body.id }
  //       });
  //       const follower = await Users.findOne({
  //         where: { id: req.body.id }
  //       });

  //       if (!followed) {
  //         return res.status(404).json({
  //           status: 404,
  //           message: 'We don\'t find who you want to follow/unfollow'
  //         });
  //       } if (!follower) {
  //         return res.status(404).json({
  //           status: 404,
  //           message: 'You\'re not a user to follow'
  //         });
  //       }
  //       return res.status(200).json({
  //         followed,
  //         follower,
  //       });
  //     } catch (e) {
  //       errorHandler.errorResponse(res, e);
  //     }
  //   }

  /**
       *
       *
       * @static
        * @param {object} req
        * @param {object} res
       * @param {int} int
       * @returns {object} response
       * @memberof Following
       */
  static async follow(req, res) {
    try {
      const user = await Users.findOne({
        where: { id: req.body.id }
      });
      const follower = await Users.findOne({
        where: { id: req.body.id }
      });

      if (!user) {
        return res.status(404).json({
          status: 404,
          message: 'We don\'t find who you want to follow'
        });
      } if (!follower) {
        return res.status(404).json({
          status: 404,
          message: 'You\'re not a user to follow'
        });
      }
      const followed = await Follows.findOne({
        where: {
          user, follower
        },
      });
      if (!followed) {
        const follow = await Follows.create({
          user, followed
        });
        return res.status(201).json({
          status: 201,
          data: follow,
        });
      }
      return res.status(201).json({
        status: 201,
        message: 'You\'re alredy a follower of this user',
      });
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
       * @returns {object} response
       * @memberof Following
       */
  static async unfollow(req, res) {
    try {
      const user = await Users.findOne({
        where: { id: req.body.id }
      });
      const follower = await Users.findOne({
        where: { id: req.body.id }
      });

      if (!user) {
        return res.status(404).json({
          status: 404,
          message: 'We don\'t find who you want to unfollow'
        });
      } if (!follower) {
        return res.status(404).json({
          status: 404,
          message: 'You\'re not a user to unfollow'
        });
      }
      const followed = await Follows.findOne({
        where: {
          user, follower
        },
      });
      if (followed) {
        const unfollow = await Follows.delete({
          where: {
            followed,
          }
        });
        return res.status(200).json({
          status: 200,
          data: unfollow,
        });
      }
      return res.status(200).json({
        status: 200,
        message: 'You\'re not a follower of this user',
      });
    } catch (e) {
      errorHandler.errorResponse(res, e);
    }
  }
}
export default Following;
