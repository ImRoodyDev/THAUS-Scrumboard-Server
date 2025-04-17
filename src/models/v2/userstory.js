'use strict';

const { sequelize } = require('../../../database');
const { Model, DataTypes } = require('sequelize');

class UserStory extends Model {
	static associate(models) {
		// Associate with Sprint
		UserStory.belongsTo(models.Sprint, { foreignKey: 'sprintId' });
		// Associate with Epic
		UserStory.belongsTo(models.Epic, { foreignKey: 'epicId' });
		// One-to-one: UserStory has its own chat
		UserStory.hasOne(models.Chat, { foreignKey: 'userStoryId', as: 'storyChat' });
	}
}

UserStory.init(
	{
		name: DataTypes.STRING,
		description: DataTypes.TEXT,
		status: DataTypes.STRING,
		sprintId: DataTypes.INTEGER,
		epicId: DataTypes.INTEGER,
		// Count for unread messages in its own chat
		unreadMessages: { type: DataTypes.INTEGER, defaultValue: 0 },
	},
	{
		sequelize,
		modelName: 'UserStory',
		timestamps: true,
	}
);

module.exports = UserStory;
