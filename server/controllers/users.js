import { User } from '../models/index';

class Users {
  async static create (req, res) {
    try {
      await User.create(req.user);
    } catch (error) {
      return res.status(400).json({
      status: 400,
      message: 'error message',
    })
    }
  }
}

export default Users