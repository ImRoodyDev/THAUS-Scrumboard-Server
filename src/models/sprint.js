'use strict';
const { sequelize } = require('../../database');
const { Model, DataTypes } = require('sequelize');

class Sprint extends Model {
	// Initialize Sequelize model
	static associate(models) {
 		// Belongs to a Group
		Sprint.belongsTo(models.Group, {
			foreignKey: 'groupId',
			onDelete: 'CASCADE', // Automatically delete Sprints when the associated Group is deleted
		});

		// Has many Stories
		Sprint.hasMany(models.Story, {
			foreignKey: 'sprintId',
			onDelete: 'SET NULL', // Sprint is deleted, set to null
		});

		// Sprint has one chat
		Sprint.hasOne(models.Chat, {
			foreignKey: 'sprintId',
			onDelete: 'CASCADE', // Automatically delete Chat when the associated Sprint is deleted
		});
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
 		startDate:{
			type: DataTypes.DATE,
            allowNull: true,
	    },
		endDate:{
			type: DataTypes.DATE,
			allowNull: true,
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
		modelName: 'Sprint',
		tableName: 'Sprints',
		timestamps: true,
		createdAt: true,
	}
);

module.exports = Sprint;