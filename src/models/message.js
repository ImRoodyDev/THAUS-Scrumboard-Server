'use strict';
const { sequelize } = require('../../database');
const { Model, DataTypes } = require('sequelize');

class Message extends Model {
	static associate(models) {
		// define association here
		Message.belongsTo(models['User'], {
			foreignKey: 'userId',
			as: 'user',
		});

		Message.belongsTo(models['Chat'], {
			foreignKey: 'chatId',
			as: 'chat',
		});
	}

}

Message.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		userId: {
			type: DataTypes.UUID,
			references: {
				allowNull: true,
				model: 'Users',
				key: 'id',
			},
		},
		message: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		chatId: {
			type: DataTypes.UUID,
			references: {
				model: 'Chats',
				key: 'id',
			},
		},
	},
	{
		sequelize,
		modelName: 'Message',
		tableName: 'messages',
		timestamps: true,
		createdAt: true,
	}
);

module.exports = Message;