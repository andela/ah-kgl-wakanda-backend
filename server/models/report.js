'use strict';
module.exports = (sequelize, DataTypes) => {
  const Report = sequelize.define('Report', {
    articleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    reporter: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    }
  }, {});
  Report.associate = function (models) {
    Report.belongsTo(models.User, {
      foreignKey: 'reporter',
      targetKey: 'id',
      onDelete: 'CASCADE'
    });
    Report.belongsTo(models.Article, {
      foreignKey: 'articleId',
      targetKey: 'id',
      onDelete: 'CASCADE'
    });
  };
  return Report;
};