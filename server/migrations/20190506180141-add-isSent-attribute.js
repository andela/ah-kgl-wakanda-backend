'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn(
    'Notifications',
    'isRead',
    {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    }
  ),

  down: (queryInterface, Sequelize) => queryInterface.removeColumn('Notifications', 'isRead'),
}