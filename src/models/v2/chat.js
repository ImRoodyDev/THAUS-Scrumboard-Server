const { sequelize } = require('../../../database');
const { Model, DataTypes } = require('sequelize');

class Chat extends Model {
	static associate(models) {
		// Chat may be linked to a Group or a UserStory
		Chat.belongsTo(models.Group, { foreignKey: 'groupId', as: 'group', constraints: false });
		Chat.belongsTo(models.UserStory, { foreignKey: 'userStoryId', as: 'userStory', constraints: false });
		// ...additional associations such as Messages can be implemented separately
	}
}

Chat.init(
	{
		unreadCount: { type: DataTypes.INTEGER, defaultValue: 0 },
	},
	{
		sequelize,
		modelName: 'Chat',
		timestamps: true,
	}
);

module.exports = Chat;
