import db from '../../models';
// import Sequelize from 'sequelize';
// import { test as config } from '../../config/config';

// sequelize = new Sequelize(config.database, config.username, config.password, config)
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
      .then((dby) => {
        console.log('Connection has been established successfully.', dby);
      })
      .catch((err) => {
        console.error('Unable to connect to the database:', err);
      });
  }

  /**
   * The controller to create a user.
   * @returns {void}
  */
  static async truncateUser() {
    await User.destroy({ truncate: true, cascade: true });
    db.sequelize.close();
  }
}

export default dbTest;
