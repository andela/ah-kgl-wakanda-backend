
module.exports = {
<<<<<<< HEAD
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
=======
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
    rates:{
      type: Sequelize.ARRAY(Sequelize.INTEGER)
    },
    favorited: {
      type: Sequelize.BOOLEAN
    },
    favoritesCount: {
      type: Sequelize.INTEGER
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
>>>>>>> 165020126 implement the fetch average rating of an article endpoint
};
