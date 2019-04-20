'use strict';
module.exports = (sequelize, DataTypes) => {
	const Comment = sequelize.define('Comment', {
		body: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		userId: DataTypes.INTEGER,
		articleId: DataTypes.INTEGER
	}, {});
	Comment.associate = function (models) {
		// associations can be defined here
		Comment.belongsTo(models.Article, {
			foreignKey: 'articleId',
			targetKey: 'id'
		});
		Comment.belongsTo(models.User, {
			foreignKey: 'userId',
			targetKey: 'id'
		});
	};
	return Comment;
};
