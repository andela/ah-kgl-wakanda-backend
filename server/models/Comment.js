module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'User',
        Key: 'id'
      }
    },
    articleId: DataTypes.INTEGER,
    HighlightId: DataTypes.INTEGER,
    favorited: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    favoritesCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
  }, {});
  Comment.associate = function (models) {
    Comment.belongsTo(models.Article, {
      foreignKey: 'articleId',
      targetKey: 'id'
    });
    Comment.belongsTo(models.User, {
      foreignKey: 'userId',
      targetKey: 'id'
    });
    Comment.belongsToMany(models.User, {
      through: 'CommentLikes',
      foreignKey: 'commentId',
      targetKey: 'id',
    });
    Comment.hasOne(models.Highlight, {
      foreignKey: 'id',
      targetKey: 'HighlightId',
      onDelete: "CASCADE"
    });
  };
  return Comment;
};
