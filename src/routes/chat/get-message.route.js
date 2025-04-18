const router = require('express').Router();
const UserGroup = require('../../models/usergroup');
const Chat = require('../../models/chat');

router.get('/:type', async (req, res) => {
	try {
		const { type } = req.params;
		const { groupId, storyId, sprintId } = req.query;

		// Validate groupId for group messages
		if (type === 'group' && !groupId) {
			return res.status(400).send({ message: 'Group ID is required' });
		}

		// Check if the user is a group member
		if (type === 'group') {
			const userGroup = await UserGroup.findOne({
				where: { id: req.uuid, groupId: groupId },
			});

			if (!userGroup) {
				return res.status(403).send({ message: 'Je hebt geen toegang tot deze functie' });
			}
		}

		try {
			let messages;
			switch (type) {
				case 'group':
					messages = await Chat.getGroupMessages({ groupId });
					break;
				case 'story':
					messages = await Chat.getStoryMessages({ storyId });
					break;
				case 'sprint':
					messages = await Chat.getSprintMessages({ sprintId });
					break;
				default:
					return res.status(400).send({ message: 'Invalid type' });
			}

			return res.status(200).send({ messages });
		} catch (error) {
			console.error('Error in retrieving messages:', error);
			return res.status(400).send({ message: 'Failed to retrieve messages' });
		}
	} catch (error) {
		console.error('Error in retrieving messages:', error);
		res.status(500).send({ message: 'Internal server error' });
	}
});

module.exports = router;
