module.exports = (sequelize, DataTypes) => {
  let Permission = sequelize.define(
    'Permission',
    {
      resource: {
        allowNull: false,
        unique: true,
        type: DataTypes.STRING
      },
      canCreate: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      canRead: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      canUpdate: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      canDelete: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      roleId: DataTypes.INTEGER
    },
  );
  Permission.associate = models => {
    Permission.belongsTo(models.Role, {
      foreignKey: "roleId",
      targetKey: 'id',
      onDelete: "SET NULL"
    });
  };
  return Permission;
};
