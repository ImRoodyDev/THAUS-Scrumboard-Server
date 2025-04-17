'use strict';
const { sequelize } = require('../../database');
const { Model, DataTypes } = require('sequelize');

class Story extends Model {
	// Initialize Sequelize model
	static associate(models) {
		// Define associations here if needed
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
		groupId: {
			type: DataTypes.UUID,
			references: {
				model: 'Groups',
				key: 'id',
			},
		},
		epicId: {
			type: DataTypes.UUID,
			references: {
				model: 'Epics',
				key: 'id',
			},
		},
		sprintId: {
			type: DataTypes.UUID,
			allowNull : true,
			references: {
				model: 'Sprints',
				key: 'id',
			},
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