'use strict';
const { sequelize } = require('../../database');
const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

class User extends Model {
 		// Initialize Sequelize model
	static associate(models) {
		// Many-to-many with Group (membership)
		User.belongsToMany(models.Group, { through: 'UserGroups', foreignKey: 'userId',
			onDelete: 'CASCADE' // This will automatically delete UserGroup entries when a User is deleted
		});
		// One-to-many: User owns groups
		User.hasMany(models.Group, { foreignKey: 'ownerId' });
		// One-to-many: User has many messages
		User.hasMany(models.Message, { foreignKey: 'userId' });
	}

	/* Compare User hash-password */
	static async compareHashPassword(password = '', hashPassword = '') {
		return await bcrypt.compare(password, hashPassword);
	}
}

// Initialize Sequelize schema
User.init(
	{
		id: {
			type: DataTypes.UUID,
			primaryKey: true,
			allowNull: false,
			defaultValue: DataTypes.UUIDV4,
		},
		username: {
			type: DataTypes.STRING(50),
			allowNull: false,
			unique: true,
		},
		password: {
			type: DataTypes.STRING(200),
			allowNull: false,
			async set(value) {
				const HashKey = bcrypt.genSaltSync(Number(10));
				const hashPassword = bcrypt.hashSync(value, HashKey);

				// Hashing the value with an appropriate cryptographic hash function is better.
				this.setDataValue('password', hashPassword);
			},
		},
		notifications: {
			type: DataTypes.TEXT,
			allowNull: true,
 		},
	},
	{
		sequelize,
		modelName: 'User',
		tableName: 'Users',
		// don't forget to enable timestamps!
		timestamps: true,
		createdAt: true
	}
);

// On create or update change the notications array to a string
User.beforeCreate((user) => {
	user.notifications = JSON.stringify(user.notifications);
});

User.beforeUpdate((user) => {
	user.notifications = JSON.stringify(user.notifications);
});

module.exports = User;
