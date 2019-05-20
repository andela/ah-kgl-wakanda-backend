const models = require('../models');
const Article = models.Article;
const Tags = models.Tags;
module.exports = {
	up: async (queryInterface, Sequelize) => {
		queryInterface.bulkInsert('Articles', [
			{
				title: 'How to train your dragon',
				description: 'Ever wonder how?',
				body: 'It takes a Jacobian',
				slug: 'how-to-train-your-dragon',
				images: ['https://image.jpg'],
				createdAt: new Date(),
				updatedAt: new Date(),
				userId: 1,
				active: true
			},
			{
				title: 'How to train your cat',
				description: 'Ever wonder how?',
				body: 'It takes a Jacobian',
				slug: 'how-to-train-your-cat',
				images: ['https://image.jpg'],
				createdAt: new Date(),
				updatedAt: new Date(),
				userId: 1,
				active: true
			},
			{
				title: 'How to train your dog',
				description: 'Ever wonder how?',
				body: 'It takes a Jacobian',
				slug: 'how-to-train-your-dog',
				images: ['https://image.jpg'],
				createdAt: new Date(),
				updatedAt: new Date(),
				userId: 1,
				active: true
			}
		], {});

		// get the id from article
		const article = await Article.findOne({
			where: {
				userId: 1,
				slug: 'how-to-train-your-dog',
			},
		});

		//insert the tagName
		await queryInterface.bulkInsert('Tags', [
			{
				tagName: 'cat',
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				tagName: 'dog',
				createdAt: new Date(),
				updatedAt: new Date(),
			}
		], {});

		// get tags id
		const tags = await Tags.findAll({});

		// insert the TagArticle
		return await queryInterface.bulkInsert('TagsArticles', [
			{
				articleId: article.id,
				tagId: tags[0].get().id,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				articleId: article.id,
				tagId: tags[1].get().id,
				createdAt: new Date(),
				updatedAt: new Date(),
			}
		], {});
	},

	down: async (queryInterface) => {
		await queryInterface.bulkDelete('TagsArticles', null, {});
		await queryInterface.bulkDelete('Tags', null, {});
		await queryInterface.bulkDelete('Articles', null, {});
	}
};