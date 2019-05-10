'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn(
    'Users',
    'roles',
    {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: 'user',
    }
  ),

  down: (queryInterface, Sequelize) => queryInterface.removeColumn('Users', 'roles'),
}