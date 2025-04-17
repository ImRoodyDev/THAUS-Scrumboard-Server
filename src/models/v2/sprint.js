'use strict';
const { sequelize } = require('../../../database');
const { Model, DataTypes } = require('sequelize');

class Sprint extends Model {
	static associate(models) {
		// A sprint can have many UserStories
		Sprint.hasMany(models.UserStory, { foreignKey: 'sprintId' });
		// Belongs to a Group
		Sprint.belongsTo(models.Group, { foreignKey: 'groupId' });
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
		startedAt: DataTypes.DATE,
		endedAt: DataTypes.DATE,
	},
	{
		sequelize,
		modelName: 'Sprint',
		tableName: 'Sprints',
		timestamps: true,
	}
);

module.exports = Sprint;
