
module.exports = {
	up: (queryInterface, Sequelize) => queryInterface.createTable('Articles', {
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: Sequelize.INTEGER
		},
		slug: {
			type: Sequelize.STRING
		},
		title: {
			type: Sequelize.STRING
		},
		description: {
			type: Sequelize.TEXT
		},
		body: {
			type: Sequelize.TEXT
		},
		images: {
			type: Sequelize.ARRAY(Sequelize.STRING)
		},
		favorited: {
			type: Sequelize.BOOLEAN
		},
		favoritesCount: {
			type: Sequelize.INTEGER
		},
		active: {
			type: Sequelize.BOOLEAN
		},
		userId: {
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
	down: (queryInterface, Sequelize) => queryInterface.dropTable('Articles')
};
