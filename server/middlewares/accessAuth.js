import jwt from 'jsonwebtoken';
import { User, Permission } from '../models';

const checkToken = async (req, res, next) => {
  // get resource from endpoint URL
  const { originalUrl } = req;
  const [, , , resource] = originalUrl.split('/');

  // get the token from header
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

    // now check role and permission
    const { roleId } = req.user;
    const permissionsList = await Permission.findAll({
      where: { roleId },
      raw: true
    });

    let access = false;
    permissionsList.map((perms) => {
      if (perms.resource === resource) {
        if (req.method === 'POST' && perms.canCreate) access = true;
        else if (req.method === 'GET' && perms.canRead) access = true;
        else if (req.method === 'PUT' && perms.canUpdate) access = true;
        else if (req.method === 'DELETE' && perms.canDelete) access = true;
      }
      return access;
    });

    if (access) next();
    else return res.status(403).json({ message: 'Access not Granted' });
  } catch (error) {
    return res.status(400).json({
      status: 400,
      message: error.message,
    });
  }
};

export default checkToken;
