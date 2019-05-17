import Sequelize from 'sequelize';
import dotenv from 'dotenv';
import mailer from './mailer';
import { Article, User } from '../models';

dotenv.config();

/**
 * Send an email notification ,
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
      link = `${process.env.URL}/api/articles/${article.slug}`;
    } else {
      link = `${process.env.URL}`;
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
        allowEmailNotification: true,
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
    if (process.env.NODE_ENV !== 'test') {
      const response = await mailer({
        subject,
        link,
        linkText: 'Go to Authors Haven',
        name: ' Sir/Mrs ',
        title: 'Notification from Authors Haven',
        body,
        usersInfo,
      });
      return response;
    }
  } catch (error) {
    return {
      sent: false,
      error
    };
  }
};

export default sendNotifications;
