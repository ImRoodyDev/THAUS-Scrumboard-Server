'use strict';
const { sequelize } = require('../../database');
const { Model, DataTypes } = require('sequelize');

class Epic extends Model {
	// Initialize Sequelize model
	static associate(models) {
		// Belongs to a Group
		Epic.belongsTo(models.Group, {
			foreignKey: 'groupId',
			onDelete: 'CASCADE', // Automatically delete Epics when the associated Group is deleted
		});

		// Belongs to a Feature
		Epic.belongsTo(models.Feature, {
			foreignKey: 'featureId',
			onDelete: 'CASCADE', // Automatically delete Epics when the associated Feature is deleted
		});

		// Has many Stories
		Epic.hasMany(models.Story, {
			foreignKey: 'epicId',
			onDelete: 'CASCADE', // Automatically delete Stories when the associated Epic is deleted
		});
	}
}

Epic.init(
	{
		id: {
			type: DataTypes.UUID,
			primaryKey: true,
			allowNull: false,
			defaultValue: DataTypes.UUIDV4,
		},
		name: DataTypes.STRING(100),
		groupId: {
			type: DataTypes.UUID,
			references: {
				model: 'Groups',
				key: 'id',
			},
		},
		featureId: {
			type: DataTypes.UUID,
			references: {
				model: 'Features',
				key: 'id',
			},
		},
	},
	{
		sequelize,
		modelName: 'Epic',
		tableName: 'Epics',
		timestamps: true,
		createdAt: true,
	}
);

module.exports = Epic;
