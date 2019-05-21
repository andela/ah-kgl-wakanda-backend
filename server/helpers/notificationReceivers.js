/* eslint-disable object-curly-newline */
import Sequelize from 'sequelize';
import { Following, Comment, ArticleLikes, Article, User } from '../models';

/**
 * Get notification receivers
 *
 * @class errorHandler
 */
class NotificationReceivers {
  /**
     *
     *
     * @static
     * @param {integer} followedId
     * @returns {array} Ids of followers
     * @memberof NotificationReceivers
     */
  static async getFollowers(followedId) {
    const followers = await Following.findAll({ where: { followedId, }, attributes: ['followerId'] });
    const followerIds = followers.map(follower => follower.followerId);
    return followerIds;
  }

  /**
      *
      *
      * @static
      * @param {integer} id
      * @returns {integer} Ids of the article
      * @memberof NotificationReceivers
      */
  static async getAuthor(id) {
    const author = await Article.findOne({ where: { id, }, attributes: ['userId'] });
    return author.userId;
  }

  /**
     *
     *
     * @static
     * @param {integer} commentId
     * @returns {array} Ids of users who have commented on this article
     * @memberof NotificationReceivers
     */
  static async getCommenter(commentId) {
    const commenter = await Comment.findOne({
      where: {
        id: commentId
      },
      attributes: ['userId']
    });
    return commenter;
  }

  /**
       *
       *
       * @static
       * @param {integer} articleId
       * @returns {array} Ids of users who have commented on this article
       * @memberof NotificationReceivers
       */
  static async getCommenters(articleId) {
    const commenters = await Comment.findAll({
      where: {
        articleId
      },
      attributes: ['userId']
    });
    const commenterIds = commenters.map(commenter => commenter.userId);
    return commenterIds;
  }

  /**
     *
     *
     * @static
     * @param {integer} articleId
     * @returns {array} Ids of users who have liked this article
     * @memberof NotificationReceivers
     */
  static async getLikers(articleId) {
    const likers = await ArticleLikes.findAll({
      where: {
        articleId,
      },
      attributes: ['userId']
    });
    const likerIds = likers.map(liker => liker.userId);
    return likerIds;
  }

  /**
   * @static
   * @returns {array} Ids of admins
   * @memberof NotificationReceivers
   */
  static async getAdmins() {
    const admins = await User.findAll({
      where: {
        [Sequelize.Op.or]: [{ roles: 'admin' }, { roles: 'superadmin' }],
        allowEmailNotification: true,
      },
      attributes: ['id']
    });
    const adminIds = admins.map(admin => admin.id);
    return adminIds;
  }
}

export default NotificationReceivers;
