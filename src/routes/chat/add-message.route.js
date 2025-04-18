const router = require('express').Router();
const UserGroup = require('../../models/usergroup');
const Chat = require('../../models/chat');

router.post('/:type', async (req, res) => {
	try {
		const { type } = req.params;
		const { message, groupId, storyId, sprintId } = req.body;

		if (!message) {
			return res.status(400).send({ message: 'Message is required' });
		}

		// if group is null
		if (!groupId) {
			return res.status(400).send({ message: 'Group ID is required' });
		}

		// Check if the user is a group member
		const userGroup = await UserGroup.findOne({
			where: { id: req.uuid, groupId: groupId },
		});

		if (!userGroup) {
			return res.status(403).send({ message: 'Je hebt geen toegang tot deze functie' });
		}

		const userId = req.uuid; // Assuming you have the user ID in the request

		try {
			switch (type) {
				case 'group':
					await Chat.sendGroupMessage({groupId, message, userId});
					return res.status(200).send({message: 'Message sent successfully'});
				case 'story':
					await Chat.sendStoryMessage({storyId, message, userId});
					return res.status(200).send({message: 'Message sent successfully'});
				case 'sprint':
					await Chat.sendSprintMessage({sprintId, message, userId});
					return res.status(200).send({message: 'Message sent successfully'});
				default:
					return res.status(400).send({message: 'Invalid type'});
			}
		}
		catch (error) {
			console.error('Error in sending message:', error);
			return res.status(400).send({message: 'Failed to send message'});
		}


	} catch (error) {
		console.error('Error in adding user to group:', error);
		res.status(500).send({ message: 'Internal server error' });
	}
});

module.exports = router;
