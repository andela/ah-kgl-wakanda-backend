'use strict';
module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define('Notification', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    receiverId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    articleId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    commentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    isRead: {
      type: DataTypes.BOOLEAN,
    },
    content: DataTypes.STRING,
    title: {
      type: DataTypes.ENUM,
      values: ['NEW Article', 'NEW Comment', 'NEW Like', 'NEW Follower', 'NEW Like on Comment'],
    },
  }, {});
  Notification.associate = function (models) {
    Notification.belongsTo(models.Article, {
      foreignKey: 'articleId',
      targetKey: 'id'
    });
    Notification.belongsTo(models.Comment, {
      foreignKey: 'commentId',
      targetKey: 'id'
    });
    Notification.belongsTo(models.User, {
      foreignKey: 'userId',
      targetKey: 'id'
    });
  };
  return Notification;
};