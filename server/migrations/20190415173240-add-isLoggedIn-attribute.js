'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn(
    'Users',
    'isLoggedIn',
    {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    }
  ),

  down: (queryInterface, Sequelize) => queryInterface.removeColumn('Users', 'isLoggedIn'),
}