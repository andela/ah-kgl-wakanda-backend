'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Notifications', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      receiverId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      articleId: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      content: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      title: {
        type: Sequelize.ENUM,
        values: ['NEW Article', 'NEW Comment', 'NEW Like', 'NEW Follower'],
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Notifications');
  }
};