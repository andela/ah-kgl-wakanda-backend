'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn(
    'Users',
    'isDisabled',
    {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    }
  ),

  down: (queryInterface, Sequelize) => queryInterface.removeColumn('Users', 'isDisabled'),
}