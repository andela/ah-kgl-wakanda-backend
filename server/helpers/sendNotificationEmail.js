import Sequelize from 'sequelize';
import mailer from './mailer';
import { Article, User } from '../models';

/**
 * Send a link containing a token,
 * returns an object with a sent
 * property
 *
 * @param {string} receiverIds
 * @param {string} body
 * @param {string} subject
 * @param {string} [articleId = null]
 * @returns {object} {sent,error}
 */
const sendNotifications = async (receiverIds, body, subject, articleId = null) => {
  let link;
  let users;
  let usersInfo;

  try {
    if (articleId) {
      const article = await Article.findOne({
        where: { id: articleId }
      });
      link = `https://ah-kgl-wakanda-staging.herokuapp.com/api/articles/${article.slug}`;
    } else {
      link = 'https://ah-kgl-wakanda-staging.herokuapp.com/';
    }

    const objIds = receiverIds.map((id) => {
      const objId = {
        id,
      };
      return objId;
    });
    users = await User.findAll({
      attributes: ['username', 'email'],
      where: {
        [Sequelize.Op.or]: objIds,
      }
    });

    usersInfo = users.map((user) => {
      const userInfo = {
        email: user.email,
        name: user.username,
      };
      return userInfo;
    });
  } catch (e) {
    return e;
  }

  try {
    const response = await mailer({
      subject,
      link,
      linkText: 'Go to Authors Haven',
      name: 'Authors Haven',
      title: 'Notification from Authors Haven',
      body,
      usersInfo,
    });

    return response;
  } catch (error) {
    return {
      sent: false,
      error
    };
  }
};

export default sendNotifications;
