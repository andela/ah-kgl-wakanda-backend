'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Following', {
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: Sequelize.INTEGER
		},
		followedId: {
			type: Sequelize.TEXT
		},
		followerId: {
			type: Sequelize.INTEGER
    }
	}),
	down: queryInterface => queryInterface.dropTable('Following')
};
