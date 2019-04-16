module.exports = (sequelize, DataTypes) => {
	let Rating = sequelize.define(
		'Rating',
		{
			articleId: {
				type: DataTypes.INTEGER,
				allowNull: false
			},
			userId: {
				type: DataTypes.INTEGER,
				allowNull: false
			},
			rate: {
				type: DataTypes.INTEGER,
				allowNull: false
			},
		},
		{}
	);

	Rating.associate = function (models) {
		Rating.belongsTo(models.User, { foreignKey: 'userId' });
		Rating.belongsTo(models.Article, { foreignKey: 'articleId' });
	};

	return Rating;
};
