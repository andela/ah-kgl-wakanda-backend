'use strict';
export default (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    firstname: {
      type: DataTypes.STRING,
    },
    lastname: {
      type: DataTypes.STRING,
    },
    roles: {
      type: DataTypes.STRING,
    },
    isDisabled: {
      type: DataTypes.BOOLEAN,
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
    roleId: {
      type: DataTypes.INTEGER,
    },
  }, {});
  User.associate = (models) => {
    User.hasMany(models.Article, {
      foreignKey: 'userId',
      sourceKey: 'id'
    });
    User.hasMany(models.Comment, {
      foreignKey: 'userId',
    });
    User.belongsToMany(models.Article, {
      through: 'ArticleLikes',
      foreignKey: 'userId',
      targetKey: 'id',
    });
    User.belongsToMany(models.Comment, {
      through: 'CommentLikes',
      foreignKey: 'userId',
    });
    User.belongsTo(models.Role, {
      foreignKey: 'roleId',
      targetKey: 'id',
    });
  };

  return User;
};
