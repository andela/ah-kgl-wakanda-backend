"use strict";
import moment from 'moment';

// generate createdDate and updateDate
const createdAt = moment().format();
const updatedAt = createdAt;

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.bulkInsert('Articles', [{
			slug: 'how-to-train-your-dragon-177804958',
			title: 'How to Train Your Dragon',
			description: 'Dragons need to be trained to be more responsive and more friendly',
			body: 'Consectetur qui cupidatat magna dolor. Reprehenderit esse minim labore consectetur Lorem ex veniam. Adipisicing reprehenderit do occaecat id sit incididunt sit amet incididunt. Cupidatat id officia ullamco ad labore cupidatat nostrud proident consequat.',
			images: ['https://dougie.jpg'],
			favorited: false,
			favoritesCount: 0,
			createdAt,
			updatedAt,
			userId: 1,
		}], {});
	},
	down: (queryInterface, Sequelize) =>
		queryInterface.bulkDelete('Articles', null, {})
};
