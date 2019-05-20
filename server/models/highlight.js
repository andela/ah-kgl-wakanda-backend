'use strict';
module.exports = (sequelize, DataTypes) => {
  const Highlight = sequelize.define('Highlight', {
    text: DataTypes.STRING,
    start: DataTypes.INTEGER,
    end: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    articleId: DataTypes.INTEGER
  }, {});
  Highlight.associate = function (models) {
    Highlight.belongsTo(models.Article, {
      foreignKey: "articleId",
      targetKey: 'id',
      onDelete: "CASCADE"
    });
    Highlight.belongsTo(models.User, {
      foreignKey: "userId",
      targetKey: 'id',
      onDelete: "CASCADE"
    });
    Highlight.hasOne(models.Comment, {
      foreignKey: 'HighlightId',
      sourceKey: 'id',
      onDelete: "CASCADE"
    });
  };
  return Highlight;
};