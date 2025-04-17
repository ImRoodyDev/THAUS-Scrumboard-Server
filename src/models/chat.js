'use strict';
const { sequelize } = require('../../database');
const { Model, DataTypes } = require('sequelize');

class Chat extends Model {
	// Initialize Sequelize model
	static associate(models) {
		// One-to-many: Chat has many messages
		Chat.hasMany(models.Message, { foreignKey: 'chatId' });
		// Belongs to a Group
		Chat.belongsTo(models.Group, { foreignKey: 'groupId' });
		// Belongs to a Story
		Chat.belongsTo(models.Story, { foreignKey: 'storyId' });
		// Chat belong to Sprint
		Chat.belongsTo(models.Sprint, { foreignKey: 'sprintId' });
	}
}

Chat.init(
	{
		id: {
			type: DataTypes.UUID,
			primaryKey: true,
			allowNull: false,
			defaultValue: DataTypes.UUIDV4,
		},
		groupId: {
			type: DataTypes.UUID,
			allowNull: true,
			references: {
				model: 'Groups',
				key: 'id',
			},
		},
		storyId: {
			type: DataTypes.UUID,
			allowNull: true,
			references: {
				model: 'Stories',
				key: 'id',
			},
		},
		sprintId: {
			type: DataTypes.UUID,
			allowNull: true,
			references: {
				model: 'Sprints',
				key: 'id',
			},
		},
	},
	{
		sequelize,
		modelName: 'Chat',
		timestamps: true,
	}
);

module.exports = Chat;
