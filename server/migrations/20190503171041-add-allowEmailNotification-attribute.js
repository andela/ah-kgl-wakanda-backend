'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn(
    'Users',
    'allowEmailNotification',
    {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    }
  ),

  down: (queryInterface, Sequelize) => queryInterface.removeColumn('Users', 'allowEmailNotification'),
};
