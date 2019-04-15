
module.exports = (sequelize, DataTypes) => {
  const Tags = sequelize.define('Tags', {
    tagName: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        is: ['^[#a-zA-Z0-9]+$', 'i']
      }
    },
  }, {});
  Tags.associate = function (models) {
    Tags.belongsToMany(models.Article, {
      through: 'TagsArticle',
      foreignKey: 'tagId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  };
  return Tags;
};
