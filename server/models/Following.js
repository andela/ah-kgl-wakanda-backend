'use strict';
export default (sequelize, DataTypes) => {
	const Following = sequelize.define(
        'Following', 
        {
            followedId: DataTypes.INTEGER,
            followerId: DataTypes.INTEGER
        }, {});
	Following.associate = (models) => {
		// associations can be defined here
		Following.belongsTo(models.User, {
			foreignKey: 'followedId',
			targetKey: 'id'
		});
		Following.belongsTo(models.User, {
			foreignKey: 'followerId',
			targetKey: 'id'
		});
	};
	return Following;
};
