'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
      await queryInterface.addColumn(
        'Users',
        'firstname',
        {
          type: Sequelize.STRING,
          allowNull: true,
          after: "username"
        }
      );
      await queryInterface.addColumn(
        'Users',
        'lastname',
        {
          type: Sequelize.STRING,
          allowNull: true,
          after: "firstname"
        }
      )
      },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'firstname');
    await queryInterface.removeColumn('Users', 'lastname');
  },
}
