
export default {
<<<<<<< HEAD
	up: (queryInterface, Sequelize) => queryInterface.createTable('Comments', {
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: Sequelize.INTEGER
		},
		body: {
			type: Sequelize.TEXT
		},
		userId: {
			type: Sequelize.INTEGER
		},
		articleId: {
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
	down: queryInterface => queryInterface.dropTable('Comments')
=======
  up: (queryInterface, Sequelize) => queryInterface.createTable('Comments', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    body: {
      type: Sequelize.TEXT
    },
    userId: {
      type: Sequelize.INTEGER
    },
    articleId: {
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
  down: queryInterface => queryInterface.dropTable('Comments')
>>>>>>> 165020126 implement the fetch average rating of an article endpoint
};
