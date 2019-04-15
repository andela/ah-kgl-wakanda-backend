
module.exports = (sequelize, DataTypes) => {
  const Article = sequelize.define(
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
      userId: DataTypes.INTEGER
    },
    {}
  );
  Article.associate = function (models) {
    Article.belongsTo(models.User, { foreignKey: 'userId' });
    Article.hasMany(models.Comment);
    Article.belongsToMany(models.Tags, {
      through: 'TagsArticle',
      foreignKey: 'articleId'
    });
  };
  return Article;
};
