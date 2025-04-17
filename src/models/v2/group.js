'use strict';
const { sequelize } = require('../../../database');
const { Model, DataTypes } = require('sequelize');

class Group extends Model {
	static associate(models) {
		// Belongs to the owner (User)
		Group.belongsTo(models.User, { foreignKey: 'ownerId', as: 'owner' });
		// Many-to-many: group memberships
		Group.belongsToMany(models.User, { through: 'UserGroups', foreignKey: 'groupId', as: 'members' });
		// Has many Features
		Group.hasMany(models.Feature, { foreignKey: 'groupId' });
		// Has many Sprints
		Group.hasMany(models.Sprint, { foreignKey: 'groupId' });
		// Has one general chat
		Group.hasOne(models.Chat, { foreignKey: 'groupId', as: 'generalChat' });
	}
}

Group.init(
	{
		id: {
			type: DataTypes.UUID,
			primaryKey: true,
			allowNull: false,
			defaultValue: DataTypes.UUIDV4,
		},
		name: DataTypes.STRING,
		type: DataTypes.STRING,
		ownerId: DataTypes.INTEGER,
	},
	{
		sequelize,
		modelName: 'Group',
		tableName: 'Groups',
		timestamps: true,
	}
);

module.exports = Group;
