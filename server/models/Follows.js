'use strict';
export default (sequelize, DataTypes) => {
	const Follows = sequelize.define(
        'Follows', 
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
	return Follows;
};
