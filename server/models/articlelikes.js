'use strict';
module.exports = (sequelize, DataTypes) => {
  const ArticleLikes = sequelize.define('ArticleLikes', {
    articleId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER
  }, {});
  ArticleLikes.associate = function(models) {
    // associations can be defined here
  };
  return ArticleLikes;
};