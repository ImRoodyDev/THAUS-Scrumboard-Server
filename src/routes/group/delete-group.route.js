const router = require('express').Router();
const Group = require('../../models/group');
const UserGroup = require('../../models/usergroup');
const { validateTextName } = require('../../utils/validationUtils');

router.get('/:groupId', async (req, res) => {
	try {
		const groupId = req.params.groupId;

		// 1. Check if the user is an admin of this group
		const userRole = await UserGroup.findOne({
			where: {
				userId: req.uuid,
				groupId: groupId,
			},
		});

		if (!userRole || userRole.role !== 'admin') {
			return res.status(403).send({ message: 'You are not authorized to delete this group' });
		}

		// Delete the group
		await Group.destroy({
			where: {
				id: groupId,
			},
			force: true,
		});

		res.status(200).send({
			message: 'Group deleted successfully',
		});
	} catch (error) {
		console.error('Error in group deletion:', error);
		res.status(500).send({ message: 'Internal server error' });
	}
});

module.exports = router;
