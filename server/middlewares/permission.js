import { Permission } from '../models';
import checkToken from './checkToken';

/**
 * @author Mutombo Jean-vincent
 * The middleware should be placed to a group of endpoints
 * For data access control and permission
 * It can require an additional middleware for authorization
 *
 * @param {object} req
 * @param {object} res
 * @param {object} next
 * @returns {void}
 */
const accessAuth = async (req, res, next) => {
  // get resource from endpoint URL
  const { path } = req;
  const [...resource] = path.split('/');


  await checkToken(req, res, async () => {
    // now check role and permission
    const { roleId } = req.user;
    const permissionsList = await Permission.findAll({
      where: { roleId },
      raw: true
    });

    let access = false;

    // iterate on each permissions
    permissionsList.map((perms) => {
      // find the first permission resource matching
      // any resource from the endpoint URL
      const resourceMatching = resource.find(el => perms.resource === el);
      if (perms.resource === resourceMatching) {
        if (req.method === 'POST' && perms.canCreate) access = true;
        else if (req.method === 'GET' && perms.canRead) access = true;
        else if (req.method === 'PUT' && perms.canUpdate) access = true;
        else if (req.method === 'DELETE' && perms.canDelete) access = true;
      }
      return access;
    });

    if (access) next();
    else return res.status(403).json({ message: 'Access not Granted' });
  });
};

export default accessAuth;
