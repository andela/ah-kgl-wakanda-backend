import { Role, Permission } from '../models';
import { defaultRoles } from '../config/constant';

const roles = {
  name: defaultRoles.USER,
  description: 'user can visit our platform to read or write'
};
const permissions = [
  {
    resource: 'articles',
    canCreate: true,
    canRead: true,
    canUpdate: true,
    canDelete: true
  },
  {
    resource: 'users',
    canCreate: true,
    canRead: true,
    canUpdate: true,
    canDelete: false
  },
  {
    resource: 'profiles',
    canCreate: true,
    canRead: true,
    canUpdate: true,
    canDelete: false
  },
  {
    resource: 'auth',
    canCreate: true,
    canRead: true,
    canUpdate: true,
    canDelete: false
  }
];

// create roles and attach permissions to them
export default async () => {
  const [role, wasCreated] = await Role.findOrCreate({ where: roles });
  if (wasCreated) {
    await permissions.map(async (item) => {
      const permission = await Permission.findOrCreate({
        where: { ...item, roleId: role.id }
      });
      return permission;
    });
  }
  return role;
};
