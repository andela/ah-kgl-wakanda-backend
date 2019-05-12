module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .createTable('Permissions', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        resource: {
          type: Sequelize.STRING,
          unique: true
        },
        canCreate: {
          type: Sequelize.BOOLEAN
        },
        canRead: {
          type: Sequelize.BOOLEAN
        },
        canUpdate: {
          type: Sequelize.BOOLEAN
        },
        canDelete: {
          type: Sequelize.BOOLEAN
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
    return queryInterface.dropTable('Permissions');
  }
};
