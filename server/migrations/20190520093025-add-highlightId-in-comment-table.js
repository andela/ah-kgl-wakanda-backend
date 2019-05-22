'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn(
    'Comments',
    'HighlightId',
    {
      type: Sequelize.INTEGER,
      allowNull: true,
    }
  ),

  down: (queryInterface, Sequelize) => queryInterface.removeColumn('Comments', 'HighlightId'),
}