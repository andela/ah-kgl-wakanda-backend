import { User } from '../models/index';

class Users {
  /**
   * @param  {} req
   * @param  {} res
   * @param  {} {try{awaitUser.create(req.user
   * @param  {} ;}catch(error
   * @param  {} {returnres.status(400
   * @param  {400} .json({status
   * @param  {'errormessage'} message
   * @param  {} }
   */
  static async create(req, res) {
    try {
      await User.create(req.user);
    } catch (error) {
      return res.status(400).json({
        status: 400,
        message: 'error message',
      });
    }
  }
}

export default Users;
