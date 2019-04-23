module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Ratings', [{
      articleId: 12,
      rate: 3,
      userId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      articleId: 12,
      rate: 3,
      userId: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      articleId: 12,
      rate: 3,
      userId: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      articleId: 12,
      rate: 3,
      userId: 4,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Ratings', null, {});
  }
};
