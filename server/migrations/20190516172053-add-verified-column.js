'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn(
    'Users',
    'verified',
    {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    }
  ),

  down: (queryInterface, Sequelize) => queryInterface.removeColumn('Users', 'verified'),
}