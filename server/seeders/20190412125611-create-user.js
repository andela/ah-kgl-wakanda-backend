'use strict';
import moment from 'moment';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

// generate encryoted password
const plainPwd = process.env.USER_PASSWORD;
const password = bcrypt.hashSync(plainPwd, bcrypt.genSaltSync(8));

// generate createdDate and updateDate
const createdAt = moment().format();
const updatedAt = createdAt;

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.bulkInsert('Users', [{
			username: 'mutombo',
			email: 'sigmacool@gmail.com',
			bio: 'Consectetur qui cupidatat magna dolor. Reprehenderit esse minim labore consectetur Lorem ex veniam. Adipisicing reprehenderit do occaecat id sit incididunt sit amet incididunt. Cupidatat id officia ullamco ad labore cupidatat nostrud proident consequat.',
			image: 'img/mutombo.jpg',
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