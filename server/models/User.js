'use strict';
export default (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
    },
    provider: DataTypes.STRING,
    isLoggedIn: {
      type: DataTypes.BOOLEAN,
    },
    allowEmailNotification: {
      type: DataTypes.BOOLEAN,
    },
    bio: DataTypes.TEXT,
    image: {
      type: DataTypes.STRING,
    },
    following: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        min: 8
      }
    },
  }, {});
  User.associate = (models) => {
    User.hasMany(models.Article, {
      foreignKey: 'userId',
      sourceKey: 'id'
    });
    User.hasMany(models.Comment,{
      foreignKey: 'userId',
      targetKey: 'id',
    });
    User.belongsToMany(models.Article, {
      through: 'ArticleLikes',
      foreignKey: 'userId',
      targetKey: 'id',
    });
    User.belongsToMany(models.Comment, {
      through: 'CommentLikes',
      foreignKey: 'userId',
      targetKey: 'id',
    });
  };

	return User;
};
