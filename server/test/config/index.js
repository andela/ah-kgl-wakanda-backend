import db from '../../models';

const { User } = db;

/**
 * The class handle everything about the user
 */
class dbTest {
  /**
   * The controller to create a user.
   * @returns {void}
  */
  static async testDbConnection() {
    db.sequelize
      .authenticate()
      .then()
      .catch(err => ({
        type: 'testDbConnection',
        error: err,
      }));
  }

  /**
   * The controller to create a user.
   * @returns {void}
  */
  static async truncateUser() {
    await User.destroy({ truncate: true, cascade: true });
  }
}

export default dbTest;
