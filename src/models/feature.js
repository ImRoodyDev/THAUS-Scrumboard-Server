'use strict';
const { sequelize } = require('../../database');
const { Model, DataTypes } = require('sequelize');

class Feature extends Model {
	// Initialize Sequelize model
	static associate(models) {
		// Belongs to a Group
		Feature.belongsTo(models.Group, {
			foreignKey: 'groupId',
			onDelete: 'CASCADE', // This will automatically delete child entries
		});

		// One-to-many: Feature has many epics
		Feature.hasMany(models.Epic, {
			foreignKey: 'featureId',
			onDelete: 'CASCADE', // This will automatically delete child entries
		});

		// One-to-many: Feature has many stories
		Feature.hasMany(models.Story, {
			foreignKey: 'featureId',
			onDelete: 'CASCADE', // This will automatically delete child entries
		});
	}
}

Feature.init(
	{
		id: {
			type: DataTypes.UUID,
			primaryKey: true,
			allowNull: false,
			defaultValue: DataTypes.UUIDV4,
		},
		name: DataTypes.STRING(100),
		groupId: {
			allowNull: false,
			type: DataTypes.UUID,
			references: {
				model: 'Groups',
				key: 'id',
			},
		},
	},
	{
		sequelize,
		modelName: 'Feature',
		tableName: 'Features',
		timestamps: true,
		createdAt: true,
	}
);

module.exports = Feature;
