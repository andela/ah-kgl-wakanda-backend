

module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('Role',
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      description: {
        type: DataTypes.STRING
      }
    },);
  Role.associate = (models) => {
    Role.hasMany(models.User, {
      foreignKey: 'roleId',
      sourceKey: 'id'
    });

    Role.hasMany(models.Permission, {
      foreignKey: 'roleId',
      sourceKey: 'id',
    });
  };
  return Role;
};
