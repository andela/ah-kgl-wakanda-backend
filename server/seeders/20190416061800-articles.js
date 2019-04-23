module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert('Articles', [{
      title: 'How to train your dragon',
      id: 12,
      description: 'Ever wonder how?',
      body: 'It takes a Jacobian',
      slug: 'how-to-train-your-dragon',
      images: ['https://image.jpg'],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      title: 'How to train your cat',
      id: 13,
      description: 'Ever wonder how?',
      body: 'It takes a Jacobian',
      slug: 'how-to-train-your-cat',
      images: ['https://image.jpg'],
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: (queryInterface) => { return queryInterface.bulkDelete('Articles', null, {}); }
};
