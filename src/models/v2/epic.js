'use strict';
const { sequelize } = require('../../../database');
const { Model, DataTypes } = require('sequelize');

class Epic extends Model {
	static associate(models) {
		// An epic can have many UserStories
		this.belongsTo(models.Feature, { foreignKey: 'featureId' });
		this.hasMany(models.UserStory, { foreignKey: 'epicId' });
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
		name: DataTypes.STRING,
	},
	{
		sequelize,
		modelName: 'Epic',
		tableName: 'Epics',
		timestamps: true,
	}
);

module.exports = Epic;
