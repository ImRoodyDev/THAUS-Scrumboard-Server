'use strict';
const { sequelize } = require('../../database');
const { Model, DataTypes } = require('sequelize');

class Epic extends Model {
    // Initialize Sequelize model
    static associate(models) {
        // Define associations here if needed
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
        description: DataTypes.STRING(200),
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