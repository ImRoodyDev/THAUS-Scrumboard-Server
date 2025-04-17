'use strict';
const { sequelize } = require('../../database');
const { Model, DataTypes } = require('sequelize');

class Sprint extends Model {
	// Initialize Sequelize model
	static associate(models) {
		// Define associations here if needed
	}

}

Sprint.init(
	{
		id: {
			type: DataTypes.UUID,
			primaryKey: true,
			allowNull: false,
			defaultValue: DataTypes.UUIDV4,
		},
 		startDate: DataTypes.DATE,
		endDate: DataTypes.DATE,
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
		modelName: 'Sprint',
		tableName: 'Sprints',
		timestamps: true,
		createdAt: true,
	}
);

module.exports = Sprint;