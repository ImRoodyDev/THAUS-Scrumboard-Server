'use strict';
const { sequelize } = require('../../database');
const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

class User extends Model {
	/**
	 * Helper method for defining associations.
	 * This method is not a part of Sequelize lifecycle.
	 * The `models/index` file will call this method automatically.
	 */
	static associate(models) {
		/*// Many-to-many with Group (membership)
		User.belongsToMany(models.Group, { through: 'UserGroups', foreignKey: 'userId' });
		// One-to-many: User owns groups
		User.hasMany(models.Group, { foreignKey: 'ownerId' });
		// e.g. user has many groups
		this.hasMany(models.Group, { foreignKey: 'userId' });*/
	}

	/* Compare User hash-password */
	static async compareHashPassword(password = '', hashPassword = '') {
		const validPassword = await bcrypt.compare(password, hashPassword);
		return validPassword;
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
	},
	{
		sequelize,
		modelName: 'User',
		tableName: 'Users',
		// don't forget to enable timestamps!
		timestamps: true,
	}
);

module.exports = User;
