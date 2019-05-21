module.exports = (sequelize, DataTypes) => {
  const History = sequelize.define('History', {
    commentId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Comment',
        Key: 'id'
      }
    },
    body: DataTypes.TEXT
  }, {});
  History.associate = function (models) {
    History.belongsTo(models.Comment, {
      foreignKey: 'body'
    });
    History.belongsTo(models.Comment, {
      foreignKey: 'commentId',
      targetKey: 'id'
    });
  };
  return History;
};
