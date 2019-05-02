'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Followings', {
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: Sequelize.INTEGER
		},
		followedId: {
			type: Sequelize.INTEGER
		},
		followerId: {
			type: Sequelize.INTEGER
		},
		createdAt: {
			allowNull: false,
			type: Sequelize.DATE
		},
		updatedAt: {
			allowNull: false,
			type: Sequelize.DATE
		}
	}),
	down: queryInterface => queryInterface.dropTable('Followings')
};
