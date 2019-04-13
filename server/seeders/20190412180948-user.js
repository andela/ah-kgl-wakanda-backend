'use strict';
import moment from 'moment';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

// generate encrypted password
const plainPwd = process.env.USER_PASSWORD;
// const password = bcrypt.hashSync(plainPwd, bcrypt.genSaltSync(8));

const password = bcrypt.genSalt(10,(err,salt) => {
  bcrypt.hash(plainPwd, salt , (err, hash) =>{
     if(!err) 
    //  throw (err);
      plainPwd=hash;
  });
});

// generate createdDate and updateDate
const createdAt = moment().format();
const updatedAt = createdAt;

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [{
      username: 'mutombo',
      email: 'mutombo@gmail.com',
      bio: 'Consectetur qui cupidatat magna dolor. Reprehenderit esse minim labore consectetur Lorem ex veniam. Adipisicing reprehenderit do occaecat id sit incididunt sit amet incididunt. Cupidatat id officia ullamco ad labore cupidatat nostrud proident consequat.',
      image: null,
      following: false,
      password: password,
      createdAt,
      updatedAt,
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};