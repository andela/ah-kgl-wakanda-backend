import jwt from 'jsonwebtoken';
import { User, Role } from '../models';
import { defaultRoles } from '../config/constant';

/**
 * Middleware to verify admin access
 * @param {object} req
 * @param {object} res
 * @param {object} next
 * @returns {void}
 */
const admin = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({
      status: 401,
      message: 'Authorization is missing',
    });
  }

  const token = authorization.split(' ')[1];

  try {
    const jwtPayload = jwt.verify(token, process.env.SECRET);
    const user = await User.findOne({ where: { id: jwtPayload.id } });
    
    
    if (!user.isLoggedIn) {
      return res.status(403).json({
        status: 403,
        message: 'You need to first log in',
      });
    }
    req.user = jwtPayload;

    // get the roleId
    const { roleId } = req.user;

    // get the roleId for the user
    const role = Role.findOne({
      where: {
        id: roleId
      }
    });

    // get the role name by roleId
    const roleName = role.name;

    // check if it is admin
    if (roleName === defaultRoles.ADMIN) {
      return next();
    }

    return res.status(403).json({
      status: 403,
      message: 'Access forbidden: only admin is authorized',
    });
  } catch (error) {
    return res.status(400).json({
      status: 400,
      message: error.message,
    });
  }
};

/**
 * Middleware to verify super admin access
 * @param {object} req
 * @param {object} res
 * @param {object} next
 * @returns {void}
 */
const superAdmin = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({
      status: 401,
      message: 'Authorization is missing',
    });
  }

  const token = authorization.split(' ')[1];

  try {
    const jwtPayload = jwt.verify(token, process.env.SECRET);
    const user = await User.findOne({ where: { id: jwtPayload.id } });
    if (!user.isLoggedIn) {
      return res.status(403).json({
        status: 403,
        message: 'You need to first log in',
      });
    }
    req.user = jwtPayload;

    // get the roleId
    const { roleId } = req.user;

    // get the roleId for the user
    const role = await Role.findOne({
      where: {
        id: roleId
      }
    });
    // get the role name by roleId
    const roleName = role.name;

    // check if it is admin
    if (roleName === defaultRoles.SUPER_ADMIN) {
      return next();
    }

    return res.status(403).json({
      status: 403,
      message: 'Access forbidden: only super-admin is authorized',
    });
  } catch (error) {
    return res.status(400).json({
      status: 400,
      message: error.message,
    });
  }
};

/**
 * Middleware to verify admin and super_admin access
 * @param {object} req
 * @param {object} res
 * @param {object} next
 * @returns {void}
 */
const adminOrSuperAdmin = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({
      status: 401,
      message: 'Authorization is missing',
    });
  }

  const token = authorization.split(' ')[1];

  try {
    const jwtPayload = jwt.verify(token, process.env.SECRET);
    const user = await User.findOne({ where: { id: jwtPayload.id } });
    if (!user.isLoggedIn) {
      return res.status(403).json({
        status: 403,
        message: 'You need to first log in',
      });
    }
    req.user = jwtPayload;


    // get the roleId
    const { roleId } = req.user;

    // get the roleId for the user
    const role = await Role.findOne({
      where: {
        id: roleId
      }
    });

    // get the role name by roleId
    const roleName = role.name;

    // check if it is admin
    if (roleName === defaultRoles.ADMIN || roleName === defaultRoles.SUPER_ADMIN) {
      return next();
    }

    return res.status(403).json({
      status: 403,
      message: 'Access forbidden: only super-admin and admin are authorized',
    });
  } catch (error) {
    return res.status(400).json({
      status: 400,
      message: error.message,
    });
  }
};

export default {
  admin, superAdmin, adminOrSuperAdmin
};
