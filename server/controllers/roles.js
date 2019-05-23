import { Role } from '../models';

/**
 * @author Mutombo Jean-vincent
 * @class Roles
 * @description Handle roles CRUD activity
 */
class Roles {
  /**
   *
   * @author Mutombo Jean-vincent
   * @description get all roles
   * @static
   * @param {req} req
   * @param {res} res
   * @returns {void}
   */
  static async getAll(req, res) {
    try {
      const roles = await Role.findAll({ raw: true });
      return res.status(200).json({
        data: roles
      });
    } catch (err) {
      return res.status(500).json({
        message: 'Fail to get all roles',
      });
    }
  }

  /**
   *
   * @author Mutombo Jean-vincent
   * @description get a specific the role
   * @static
   * @param {req} req
   * @param {res} res
   * @returns {void}
   */
  static async get(req, res) {
    const { id } = req.params;

    try {
      const role = await Role.findOne({
        where: { id }
      });

      if (!role) {
        return res.status(404).json({
          message: 'The role was not found'
        });
      }
      return res.status(200).json({
        data: role
      });
    } catch (err) {
      return res.status(500).json({
        message: 'Fail to retrieve the role',
      });
    }
  }

  /**
   *
   * @author Mutombo Jean-vincent
   * @description update specific the role
   * @static
   * @param {req} req
   * @param {res} res
   * @returns {void}
   */
  static async update(req, res) {
    try {
      const { id } = req.params;
      const { name, description } = req.body;

      const role = await Role.findOne({
        where: { id }
      });

      if (!role) {
        return res.status(404).json({
          message: 'The role was not found'
        });
      }

      const update = await role.update({
        name: name.toLowerCase(),
        description,
      });

      return res.status(200).json({
        message: 'The role was successfully updated',
        data: update
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Fail to update the role'
      });
    }
  }
}

export default Roles;
