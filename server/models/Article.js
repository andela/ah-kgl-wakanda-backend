'use strict';
module.exports = (sequelize, DataTypes) => {
  let Article = sequelize.define(
    'Article',
    {
      slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      body: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      images: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
        validate: {
          is: ['(http(s?):)([/|.|[A-Za-z0-9_-]| |-])*.(?:jpg|jpeg|gif|png)', 'i']
        }
      },
      reads: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
      },
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
      active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      userId: DataTypes.INTEGER
    },
    {}
  );

  Article.associate = function (models) {
    Article.belongsTo(models.User, {
      foreignKey: 'userId',
      targetKey: 'id'
    });
    Article.hasMany(models.Comment, {
      foreignKey: 'articleId',
      sourceKey: 'id'
    });
    Article.belongsToMany(models.Tags, {
      through: 'TagsArticle',
      foreignKey: 'articleId',
      targetKey: 'id',
    });
    Article.hasMany(models.Rating, {
      foreignKey: 'articleId',
      sourceKey: 'id'
    });
    Article.belongsToMany(models.User, {
      through: 'ArticleLikes',
      foreignKey: 'articleId',
      targetKey: 'id',
    });
  };

  return Article;
};
