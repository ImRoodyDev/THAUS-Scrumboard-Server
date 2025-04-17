const router = require('express').Router();
const UserGroup = require('../../models/usergroup');
const Story = require('../../models/story');

router.get('/', async (req, res) => {
	try {
		const groupId = req.query.groupId;
		const storyId = req.body.storyId;

		if (!storyId) {
			return res.status(400).send({ message: 'Story ID is vereist' });
		}

		// Check if the user is a group member
		const userGroup = await UserGroup.findOne({
			where: { id: req.uuid, groupId: groupId },
		});

		if (!userGroup) {
			return res.status(403).send({ message: 'Je hebt geen toegang tot deze functie' });
		}

		// Find the story to delete
		const story = await Story.findByPk(storyId);

		if (!story) {
			return res.status(404).send({ message: 'Story niet gevonden' });
		}

		// Delete the story
		await story.destroy({ force: true });

		// Send the response
		res.status(200).send({
			message: 'User story succesvol verwijderd',
		});
	} catch (error) {
		console.error('Error in deleting story:', error);
		res.status(500).send({ message: 'Interne serverfout' });
	}
});

module.exports = router;
