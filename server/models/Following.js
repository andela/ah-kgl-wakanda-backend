'use strict';
export default (sequelize, DataTypes) => {
  const Following = sequelize.define(
    'Following',
    {
      followedId: DataTypes.INTEGER,
      followerId: DataTypes.INTEGER
    }, {}
  );
  Following.associate = (models) => {
    Following.belongsTo(models.User, {
      foreignKey: 'followedId',
      as: 'followees'
    });
    Following.belongsTo(models.User, {
      foreignKey: 'followerId',
      as: 'followers'
    });
  };
  return Following;
};
