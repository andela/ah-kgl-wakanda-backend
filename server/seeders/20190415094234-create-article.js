'use strict';
import moment from 'moment';
import dotenv from 'dotenv';

dotenv.config();

// generate createdDate and updateDate
const createdAt = moment().format();
const updatedAt = createdAt;

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.bulkInsert('Articles', [{
			slug: 'how-to-dougie-177804958',
			title: 'How to Doggie',
			description: 'Dragons need to be trained to be more responsive and more friendly',
			body: 'Consectetur qui cupidatat  magna dolor.Reprehenderit esse minim labore consectetur Lorem ex veniam.Adipisicing reprehenderit do occaecat id sit incididunt sit amet incididunt.Cupidatat id officia ullamco ad labore cupidatat nostrud proident consequat.',
			images: ['https://dougie.jpg'],
			favorited: false,
			favoritesCount: 0,
			userId: 1,
			createdAt,
			updatedAt,
		}], {});
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.bulkDelete('Articles', null, {});
	}
};
