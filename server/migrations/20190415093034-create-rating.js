
module.exports = {
	up: (queryInterface, Sequelize) => queryInterface.createTable('Ratings', {
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: Sequelize.INTEGER
		},
		userId: {
			type: Sequelize.INTEGER
		},
		articleId: {
			type: Sequelize.INTEGER
		},
		rate: {
			type: Sequelize.INTEGER,
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
	down: (queryInterface, Sequelize) => queryInterface.dropTable('Ratings')
};