'use strict';
const { sequelize } = require('../../../database');
const { Model, DataTypes } = require('sequelize');

class Feature extends Model {
	static associate(models) {
		// A feature can have many Epics
		this.belongsTo(models.Group, { foreignKey: 'groupId' });
		this.hasMany(models.Epic, { foreignKey: 'featureId' });
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
		name: DataTypes.STRING,
	},
	{
		sequelize,
		modelName: 'Feature',
		tableName: 'Features',
		timestamps: true,
	}
);

module.exports = Feature;
