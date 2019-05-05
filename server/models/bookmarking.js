'use strict';
export default (sequelize, DataTypes) => {
	const Bookmarking = sequelize.define(
        'Bookmarking', 
        {
            userId: DataTypes.INTEGER,
            articleId:DataTypes.STRING
        }, {});
	Bookmarking.associate = (models) => {
		Bookmarking.belongsTo(models.User, {
			foreignKey: 'userId',
			targetKey: 'id'
		});
		Bookmarking.belongsTo(models.Article, {
			foreignKey: 'articleId',
			targetKey: 'id'
		});
	};
	return Bookmarking;
};
