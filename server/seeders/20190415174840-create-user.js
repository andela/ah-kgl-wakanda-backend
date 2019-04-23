module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert('Users', [{
      username: 'karl',
      email: 'karl@gmail.com',
      bio: 'Consectetur qui cupidatat magna dolor. Reprehenderit esse minim labore consectetur Lorem ex veniam. Adipisicing reprehenderit do occaecat id sit incididunt sit amet incididunt. Cupidatat id officia ullamco ad labore cupidatat nostrud proident consequat.',
      image: 'img/karl.jpg',
      isLoggedIn: true,
      following: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      password: 'password',
    }], {});
  },

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Users', null, {}),
};
