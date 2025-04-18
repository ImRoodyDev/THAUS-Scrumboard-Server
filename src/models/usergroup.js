'use strict';
const { sequelize } = require('../../database');
const { Model, DataTypes } = require('sequelize');

class UserGroup extends Model {
	// Initialize Sequelize model
	static associate(models) {
		// UserGroup belongs to User
		UserGroup.belongsTo(models.User, { foreignKey: 'userId' });
		// UserGroup belongs to Group
		UserGroup.belongsTo(models.Group, { foreignKey: 'groupId' });
	}
}

UserGroup.init(
	{
		role: {
			type: DataTypes.STRING(15),
			allowNull: false,
			defaultValue: 'member',
		},
		userId: {
			type: DataTypes.UUID,
			references: {
				model: 'Users',
				key: 'id',
			},
		},
		groupId: {
			type: DataTypes.UUID,
			references: {
				model: 'Groups',
				key: 'id',
			},
		},
	},
	{
		sequelize,
		modelName: 'UserGroup',
		tableName: 'UserGroups',
		timestamps: true,
		indexes: [
			// This index ensures only one admin per group
			{
				unique: true,
				fields: ['groupId', 'role'],
				where: {
					role: 'admin',
				},
				name: 'unique_role_admin',
			},
			// This index ensures a user can only be in a group once
			{
				unique: true,
				fields: ['userId', 'groupId'],
				name: 'unique_user_group',
			},
		],
	}
);

module.exports = UserGroup;
