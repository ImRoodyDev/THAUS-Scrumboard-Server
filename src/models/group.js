'use strict';
const { sequelize } = require('../../database');
const { Model, DataTypes } = require('sequelize');

class Group extends Model {
    // Initialize Sequelize model
    static associate(models) {
        // Many-to-many with User
        Group.belongsToMany(models.User, { through: 'UserGroups', foreignKey: 'groupId',
            onDelete: 'CASCADE' // This will automatically delete UserGroup entries when a Group is deleted
        });
        // One-to-many: Group has many sprints
        Group.hasMany(models.Sprint, { foreignKey: 'groupId',
            onDelete: 'CASCADE' // This will automatically delete child entries
        });
        // One-to-many: Group has many features
        Group.hasMany(models.Feature, { foreignKey: 'groupId',
            onDelete: 'CASCADE' // This will automatically delete child entries
        });
        // One-to-many: Group has many chats
        Group.hasMany(models.Chat, { foreignKey: 'groupId' ,
            onDelete: 'CASCADE' // This will automatically delete child entries
        });

        // Group belong to one user
        Group.belongsTo(models.User, { foreignKey: 'ownerId' });
    }
}

Group.init(
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: DataTypes.UUIDV4,
        },
        name: DataTypes.STRING(50),
        type: DataTypes.STRING(10),
     },
    {
        sequelize,
        modelName: 'Group',
        tableName: 'Groups',
        timestamps: true,
        createdAt: true,
    }
);

module.exports = Group;