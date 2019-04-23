import jwt from 'jsonwebtoken';
import { User } from '../models';

const checkToken = async (req, res, next) => {
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
    next();
  } catch (error) {
    return res.status(400).json({
      status: 400,
      message: error.message,
    });
  }
};

export default checkToken;
