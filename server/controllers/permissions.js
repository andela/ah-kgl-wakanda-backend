import { Permission, Role } from '../models';

/**
 * @author Mutombo Jean-vincent
 * @class Permissions
 * @description Handle permissions CRUD activity
 */
class Permissions {
  /**
   *
   * @author Mutombo Jean-vincent
   * @description get all permissions
   * @static
   * @param {req} req
   * @param {res} res
   * @returns {void}
   */
  static async getAll(req, res) {
    try {
      const permission = await Permission.findAll();
      return res.status(200).json({
        data: permission
      });
    } catch (err) {
      return res.status(500).json({
        message: 'Fail to retrieve all permissions'
      });
    }
  }

  /**
   *
   * @author Mutombo Jean-vincent
   * @description get a specific permission
   * @static
   * @param {req} req
   * @param {res} res
   * @returns {void}
   */
  static async get(req, res) {
    try {
      const { permissionId } = req.params;
      const permission = await Permission.findOne({
        where: { id: permissionId }
      });

      if (!permission) {
        return res.status(404).json({
          message: 'The permission was not found'
        });
      }

      return res.status(200).json({
        data: permission
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Fail to get the permission'
      });
    }
  }

  /**
   *
   * @author Mutombo Jean-vincent
   * @description get all permissions for a specific the role
   * @static
   * @param {req} req
   * @param {res} res
   * @returns {void}
   */
  static async getRolePermissions(req, res) {
    try {
      const { roleId } = req.params;

      // check if the role already exist
      const role = await Role.findOne({
        where: { id: roleId }
      });

      if (!role) {
        return res.status(404).json({
          message: 'The role was not found'
        });
      }

      const result = await Permission.findAll({
        where: { roleId },
        attributes: ['roleId'],
        include: [{ model: Role }]
      });

      return res.status(200).json({
        data: result
      });
    } catch (err) {
      return res.status(500).json({
        message:
          'Fail to get the permission list for this role'
      });
    }
  }

  /**
   *
   * @author Mutombo Jean-vincent
   * @description grant permission to a specific role
   * @static
   * @param {req} req
   * @param {res} res
   * @returns {void}
   */
  static async grant(req, res) {
    try {
      const {
        resource,
        canCreate,
        canRead,
        canUpdate,
        canDelete
      } = req.body;
      const { roleId } = req.params;

      // check if the role exist or not
      const role = await Role.findOne({
        where: { id: roleId }
      });

      if (!role) {
        return res.status(404).json({
          message: 'The role was not found'
        });
      }

      const permission = await Permission.create({
        resource,
        roleId,
        canCreate,
        canRead,
        canUpdate,
        canDelete,
      });
      return res.status(201).json({
        message: 'The Permission was successfully granted',
        data: permission
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Fail to grant permissions to this role'
      });
    }
  }

  /**
   *
   * @author Mutombo Jean-vincent
   * @description revoke permission from a specific role
   * @static
   * @param {req} req
   * @param {res} res
   * @returns {void}
   */
  static async revoke(req, res) {
    try {
      const { permissionId } = req.params;

      // check if the permission exist or not
      const permission = await Permission.findOne({
        where: { id: permissionId }
      });

      if (!permission) {
        return res.status(404).json({
          message: 'The permission was not found'
        });
      }

      await Permission.destroy({
        where: {
          id: permissionId
        }
      });
      return res.status(200).json({
        message: 'The permission was successfully revoked'
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Fail to revoke the permission'
      });
    }
  }

  /**
   *
   * @author Mutombo Jean-vincent
   * @description update a specific permission
   * @static
   * @param {req} req
   * @param {res} res
   * @returns {void}
   */
  static async update(req, res) {
    try {
      const { permissionId } = req.params;
      const {
        resource,
        canCreate,
        canRead,
        canUpdate,
        canDelete,
      } = req.body;

      // check if the permission exist or not
      const permission = await Permission.findOne({
        where: { id: permissionId }
      });

      if (!permission) {
        return res.status(404).json({
          message: 'The permission was not found'
        });
      }

      const update = await permission.update({
        resource,
        canCreate,
        canRead,
        canUpdate,
        canDelete,
      });

      return res.status(200).json({
        message: 'The permission was successfully updated',
        data: update
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Fail to update the permission'
      });
    }
  }
}

export default Permissions;
