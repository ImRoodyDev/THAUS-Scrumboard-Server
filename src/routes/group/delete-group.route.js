const router = require('express').Router();
const Group = require('../../models/group');
const UserGroup = require('../../models/userGroup');
const {validateTextName} = require('../../utils/validationUtils');

router.get('/:groupId', async (req, res) => {
	try {
		const groupId = req.params.groupId;

		// Validate request body
		const [groupError, groupName] = validateTextName({name: groupId});

		// Check if postBody is safe
		if (groupError) {
			return res.status(400).send({ message:  groupError.message.replace(/'/g, '')  });
		}

		// 1. Check if the user is an admin of this group
		const userRole = await UserGroup.findOne({
			where: {
				userId: req.uuid,
				groupId: groupId
			}
		});

		if (!userRole || userRole.role !== 'admin') {
			return res.status(403).send({ message: 'You are not authorized to delete this group' });
		}

		// Delete the group
		await Group.destroy({
			where: {
				id: groupId
			}
			,force: true
		});

		res.status(200).send({
			message: 'Group deleted successfully',
 		});
	} catch (error) {
		console.error('Error in group deletion:', error);
		res.status(500).send({ message: 'Internal server error' });
	}
}
);

module.exports = router;