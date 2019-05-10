
module.exports = {
	up: (queryInterface, Sequelize) => queryInterface.createTable('Users', {
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: Sequelize.INTEGER
		},
		username: {
			type: Sequelize.STRING,
			unique: true
		},
		email: {
			type: Sequelize.STRING,
			unique: true
		},
		provider: {
			type: Sequelize.STRING,
			defaultValue: 'local',
		},
		bio: {
			type: Sequelize.TEXT
		},
		image: {
			type: Sequelize.STRING
		},
		following: {
			type: Sequelize.BOOLEAN
		},
		password: {
			type: Sequelize.STRING
		},
		roleId: {
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
	down: (queryInterface, Sequelize) => queryInterface.dropTable('Users')
};
