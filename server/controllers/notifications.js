import { User, Notification, Article } from '../models';
import removeDuplicates from '../helpers/removeDuplicates';
import NotificationReceivers from '../helpers/notificationReceivers';
import sendNotificationEmail from '../helpers/sendNotificationEmail';
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
    if (!user.email) {
      res.status(400).json({
        status: 400,
        message: 'Please, provide an email address by updating your profile'
      });
    }
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

  /**
   * @static
   * @param {object} params
   * @param {string} userId
   * @param {string} title
   * @param {integer} [articleId = null]
   * @param {Array} [followedId = null]
   * @returns {object} response
   * @memberof Notifications
   */
  static async create(params) {
    try {
      const {
        userId,
        title,
        articleId = null,
        followedId = null
      } = params;
      const user = await User.findOne({ where: { id: userId } });

      let content;
      let receiverIds = [];
      switch (title) {
        case 'NEW Article':
          receiverIds = await NotificationReceivers.getFollowers(userId);
          content = `${user.username} has created a new article`;
          break;
        case 'NEW Comment': {
          const authorId = await NotificationReceivers.getAuthor(articleId);
          const commenters = await NotificationReceivers.getCommenters(articleId);
          const likers = await NotificationReceivers.getLikers(articleId);
          receiverIds = [...[authorId], ...commenters, ...likers];
          content = `${user.username} has commented on this article`;
          break;
        }
        case 'NEW Like': {
          const authorId = await NotificationReceivers.getAuthor(articleId);
          const commenters = await NotificationReceivers.getCommenters(articleId);
          const likers = await NotificationReceivers.getLikers(articleId);
          receiverIds = [...[authorId], ...commenters, ...likers];
          content = `${user.username} has like this article`;
          break;
        }
        case 'NEW Follower':
          receiverIds = [followedId];
          content = `${user.username} has started to follow you`;
          break;
        default: return null;
      }
      receiverIds = removeDuplicates(receiverIds);
      // removing the notifier from receivers
      receiverIds = receiverIds.filter(item => item !== userId);
      const notifications = receiverIds.map((receiverId) => {
        const notification = {
          userId,
          receiverId,
          articleId,
          content,
          title,
        };
        return notification;
      });

      const createdNotifications = await Notification.bulkCreate(
        notifications,
        { returning: true }
      );

      if (process.env.NODE_ENV !== 'test') sendNotificationEmail(receiverIds, content, title, articleId);

      return createdNotifications;
    } catch (e) {
      return e;
    }
  }

  /**
   * @static
   * @param {object} req
   * @param {object} res
   * @returns {object} response
   * @memberof Notifications
   */
  static async getAll(req, res) {
    const notifications = await Notification.findAndCountAll({
      where: { receiverId: req.user.id },
      attributes: ['id', 'userId', 'content', 'title', 'isRead', 'createdAt'],
      include: [{
        model: Article,
        attributes: ['slug', 'title']
      }, {
        model: User,
        attributes: ['username', 'image']
      }],
      order: [['createdAt', 'DESC']]
    });
    const { count, rows } = notifications;
    return res.status(200).json({
      status: 200,
      notifications: rows,
      notificationsCount: count
    });
  }

  /**
   * @static
   * @param {object} req
   * @param {object} res
   * @returns {object} response
   * @memberof Notifications
   */
  static async readAll(req, res) {
    const notifications = await Notification.update(
      { isRead: true },
      {
        where: { receiverId: req.user.id, isRead: false },
        returning: true,
      }
    );
    return res.status(200).json({
      status: 200,
      notifications: notifications[1],
      notificationsCount: notifications[0],
    });
  }

  /**
   * @static
   * @param {object} req
   * @param {object} res
   * @returns {object} response
   * @memberof Notifications
   */
  static async readOne(req, res) {
    const notification = await Notification.update(
      { isRead: true },
      {
        where: { id: req.params.id, isRead: false },
        returning: true,
      }
    );

    if (!notification[1][0]) {
      return res.status(404).json({
        status: 404,
        message: 'This notification is either read or does not exist',
      });
    }

    return res.status(200).json({
      status: 200,
      notification: notification[1][0],
    });
  }
}

export default Notifications;
