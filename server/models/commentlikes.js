'use strict';
module.exports = (sequelize, DataTypes) => {
  const CommentLikes = sequelize.define('CommentLikes', {
    userId: DataTypes.INTEGER,
    commentId: DataTypes.INTEGER
  }, {});
  CommentLikes.associate = function (models) {
    CommentLikes.belongsTo(models.Comment, {
      foreignKey: 'commentId',
      targetKey: 'id'
    });
    CommentLikes.belongsTo(models.User, {
      foreignKey: 'userId',
      targetKey: 'id'
    });
  };
  return CommentLikes;
};
