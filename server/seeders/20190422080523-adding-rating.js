module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Ratings', [{
			articleId: 1,
			rate: 3,
			userId: 1,
			createdAt: new Date(),
      updatedAt: new Date()
		}], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Ratings', null, {});
  }
};
