const router = require('express').Router();
const UserGroup = require('../../models/usergroup');
const Story = require('../../models/story');

router.get('/', async (req, res) => {
	try {
		const { groupId, storyId } = req.query;

		if (!storyId) {
			return res.status(404).send({ message: 'Story ID is vereist' });
		}

		// Check if the user is a group member
		const userGroup = await UserGroup.findOne({
			where: { userId: req.uuid, groupId: groupId },
		});

		if (!userGroup) {
			return res.status(403).send({ message: 'Je hebt geen toegang tot deze functie' });
		}

		// Find the story to delete
		const story = await Story.findByPk(storyId);

		if (!story) {
			return res.status(404).send({ message: 'Story niet gevonden' });
		}

		// Check if you have a sprint id if yes only owner can delete
		if (story.sprintId && userGroup.role !== 'owner') {
			return res.status(403).send({ message: 'Je hebt geen toegang tot deze functie' });
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
