
module.exports = (sequelize, DataTypes) => {
  const TagsArticle = sequelize.define('TagsArticle', {
    articleid: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tagId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  }, {});
  TagsArticle.associate = function (models) {
    // associations can be defined here
  };
  return TagsArticle;
};
