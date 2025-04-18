const router = require('express').Router();
const User = require('../../models/user');
const UserGroup = require('../../models/usergroup');

router.get('/', async (req, res) => {
	try {
		const { groupId, username } = req.query;

		// Check if the user is an admin of this group
		const userRole = await UserGroup.findOne({
			where: {
				userId: req.uuid,
				groupId: groupId,
			},
		});

		if (!userRole || userRole.role !== 'admin') {
			return res.status(403).send({ message: 'You are not authorized to add members to this group' });
		}

		// Add the user to the group
		const user = await User.findOne({
			where: {
				username: username,
			},
		});

		if (!user) {
			return res.status(404).send({ message: 'User not found' });
		}

		// Check if the user is already a member of the group
		await UserGroup.create({
			userId: user.id,
			groupId: groupId,
			role: 'member',
		});

		res.status(200).send({
			message: 'User added to group successfully',
		});
	} catch (error) {
		if (error.name === 'SequelizeUniqueConstraintError') {
			return res.status(409).send({ message: 'User is already a member of this group' });
		}

		console.error('Error in adding user to group:', error);
		res.status(500).send({ message: 'Internal server error' });
	}
});

module.exports = router;
