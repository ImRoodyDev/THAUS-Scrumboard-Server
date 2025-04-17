'use strict';
const { sequelize } = require('../../database');
const { Model, DataTypes } = require('sequelize');

class Story extends Model {
	// Initialize Sequelize model
	static associate(models) {
		// Belongs to a Group
		Story.belongsTo(models.Group, {
			foreignKey: 'groupId',
			onDelete: 'CASCADE', // Automatically delete Epics when the associated Group is deleted
		});

		// Belongs to a Feature
		Story.belongsTo(models.Feature, {
			foreignKey: 'featureId',
			onDelete: 'CASCADE', // Automatically delete Epics when the associated Feature is deleted
		});

		// Belongs to an Epic
		Story.belongsTo(models.Epic, {
			foreignKey: 'epicId',
			onDelete: 'CASCADE', // Automatically delete Epics when the associated Feature is deleted
		});

		// Belongs to a Sprint
		Story.belongsTo(models.Sprint, {
			foreignKey: 'sprintId',
			onDelete: 'SET NULL', // Sprint is deleted, set to null
		});

		// Has one Chat
		Story.hasOne(models.Chat, {
			foreignKey: 'storyId',
			onDelete: 'CASCADE', // Automatically delete Chat when the associated Story is deleted
		});

		// Story belong to one User
		Story.belongsTo(models.User, {
			foreignKey: 'userId',
			onDelete: 'SET NULL', // User is deleted, set to null
		});
	}
}

Story.init(
	{
		id: {
			type: DataTypes.UUID,
			primaryKey: true,
			allowNull: false,
			defaultValue: DataTypes.UUIDV4,
		},
		name: DataTypes.STRING(100),
		description: {
			type: DataTypes.STRING(1000),
			allowNull: true,
		},
		groupId: {
			type: DataTypes.UUID,
			allowNull: false,
			references: {
				model: 'Groups',
				key: 'id',
			},
		},
		featureId: {
			type: DataTypes.UUID,
			allowNull: false,
			references: {
				model: 'Features',
				key: 'id',
			},
		},
		epicId: {
			type: DataTypes.UUID,
			allowNull: false,
			references: {
				model: 'Epics',
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
		userId: {
			type: DataTypes.UUID,
			allowNull: true,
			references: {
				model: 'Users',
				key: 'id',
			},
		},

		startDate: {
			type: DataTypes.DATE,
			allowNull: true,
		},
		endDate: {
			type: DataTypes.DATE,
			allowNull: true,
		},
	},
	{
		sequelize,
		modelName: 'Story',
		tableName: 'Stories',
		timestamps: true,
		createdAt: true,
	}
);

module.exports = Story;
