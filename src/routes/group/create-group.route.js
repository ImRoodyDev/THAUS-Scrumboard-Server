const router = require('express').Router();
const Group = require('../../models/group');
const UserGroup = require('../../models/usergroup');
const {validateTextName} = require('../../utils/validationUtils');

router.post('/', async (req, res) => {
	try {
		// Validate request body
		const { groupType } = req.body;
		const [groupError, groupName] = validateTextName(req.body.groupName);

		// Check if postBody is safe
		if (groupError) {
			return res.status(400).send({ message:  groupError.message.replace(/'/g, '')  });
		}

		// Check if groupType is safe
		if ( !groupType  ) {
			return res.status(400).send({ message: 'Invalid group type' });
		}

		// Create new group in the database
		const newGroup = await Group.create({
			name: groupName,
			type: groupType,
			ownerId: req.uuid
		});


		// Add the user to the group with a role
		await UserGroup.create({
			userId: req.uuid,
			groupId: newGroup.id,
			role: 'admin',
		});

		// Send response to client
		res.status(201).send({
			message: 'Group created successfully',
			group: newGroup,
		});
	}
	catch (error) {
		console.error('Error in group creation:', error);
		res.status(500).send({ message: 'Internal server error' });
	}
});

module.exports = router;
