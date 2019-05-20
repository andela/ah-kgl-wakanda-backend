const models = require('../models');
import { defaultRoles } from '../config/constant';
const Role = models.Role;
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Roles', [
      {
        name: defaultRoles.USER,
        description: 'user can visit our platform to read or write',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ], {});

    // get the id of the role
    const role = await Role.findOne({
      where: {
        name: defaultRoles.USER
      },
    });

    // insert permission
    return await queryInterface.bulkInsert('Permissions', [
      {
        roleId: role.id,
        resource: 'articles',
        canCreate: true,
        canRead: true,
        canUpdate: true,
        canDelete: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        roleId: role.id,
        resource: 'users',
        canCreate: false,
        canRead: true,
        canUpdate: true,
        canDelete: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        roleId: role.id,
        resource: 'profiles',
        canCreate: true,
        canRead: true,
        canUpdate: true,
        canDelete: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        roleId: role.id,
        resource: 'auth',
        canCreate: true,
        canRead: true,
        canUpdate: true,
        canDelete: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('Permissions', null, {});
    await queryInterface.bulkDelete('Roles', null, {});
  }
};