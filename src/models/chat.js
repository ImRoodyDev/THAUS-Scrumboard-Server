'use strict';
const { sequelize } = require('../../database');
const { Model, DataTypes } = require('sequelize');

class Chat extends Model {
	// Initialize Sequelize model
	static associate(models) {
		// One-to-many: Chat has many messages
		Chat.hasMany(models.Message, { foreignKey: 'chatId' });

		// Belongs to a Group
		Chat.belongsTo(models.Group, { foreignKey: 'groupId', onDelete: 'CASCADE' });

		// Belongs to a Story
		Chat.belongsTo(models.Story, { foreignKey: 'storyId', onDelete: 'CASCADE' });

		// Chat belong to Sprint
		Chat.belongsTo(models.Sprint, { foreignKey: 'sprintId', onDelete: 'CASCADE' });
	}

	static async sendGroupMessage({ groupId, message, userId }) {
		// Check if the group exists
		if (!groupId) {
			throw new Error('Group ID is required');
		}

		const [chat, created] = await this.findOrCreate({ where: { groupId } });

		if (created) {
			console.log('Chat created for group:', groupId);
		}

		if (!chat) {
			throw new Error('Chat not found');
		}

		const messageInstance = await chat.createMessage({ message, userId, chatId: chat.id });
		return messageInstance;
	}

	static async sendStoryMessage({ storyId, message, userId }) {
		// Check if the story exists
		if(!storyId) {
			throw new Error('Story ID is required');
		}

		const [chat, created] = await this.findOrCreate({ where: { storyId } });

		if (created) {
			console.log('Chat created for story:', storyId);
		}

		if (!chat) {
			throw new Error('Chat not found');
		}

		const messageInstance = await chat.createMessage({ message, userId, chatId: chat.id });
		return messageInstance;
	}

	static async sendSprintMessage({ sprintId, message, userId }) {
		// if sprint is empty or null
		if (!sprintId) {
			throw new Error('Sprint ID is required');
		}

		const [chat, created] = await this.findOrCreate({ where: { sprintId } });

		if (created) {
			console.log('Chat created for sprint:', sprintId);
		}

		if (!chat) {
			throw new Error('Chat not found');
		}

		const messageInstance = await chat.createMessage({ message, userId, chatId: chat.id });
		return messageInstance;
	}

	static async getGroupMessages({ groupId }) {
		if (!groupId) {
			throw new Error('Group ID is required');
		}

		const chat = await this.findOne({ where: { groupId } });
		if (!chat) {
			throw new Error('Chat not found');
		}

		const messages = await chat.getMessages();
		return messages;
	}

	static async getStoryMessages({ storyId }) {
		if (!storyId) {
			throw new Error('Story ID is required');
		}

		const chat = await this.findOne({ where: { storyId } });
		if (!chat) {
			throw new Error('Chat not found');
		}

		const messages = await chat.getMessages();
		return messages;
	}

	static async getSprintMessages({ sprintId }) {
		if (!sprintId) {
			throw new Error('Sprint ID is required');
		}

		const chat = await this.findOne({ where: { sprintId } });
		if (!chat) {
			throw new Error('Chat not found');
		}

		const messages = await chat.getMessages();
		return messages;
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
