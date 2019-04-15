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
    bio: DataTypes.TEXT,
    image: {
      type: DataTypes.STRING,
      validate: {
        is: ['(http(s?):)([/|.|[A-Za-z0-9_-]| |-])*.(?:jpg|jpeg|gif|png)', 'i']
      }
    },
    following: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        min: 8
      }
    },
  }, {});
  User.associate = (models) => {
    User.hasMany(models.Article);
    User.hasMany(models.Comment);
  };
  return User;
};
