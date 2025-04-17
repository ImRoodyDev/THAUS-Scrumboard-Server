const router = require('express').Router();
const Sprint = require('../../models/sprint');
const Story = require('../../models/story');
const UserGroup = require('../../models/usergroup');

router.post('/', async (req, res) => {
	try {
		const { sprintId, storyId } = req.query;
		const userId = req.uuid;

		// Find the sprint and check if it exists
		const sprint = await Sprint.findByPk(sprintId);
		if (!sprint) {
			return res.status(404).json({ message: 'Sprint not found' });
		}

		// Find the story and check if it exists
		const story = await Story.findByPk(storyId);

		if (!story) {
			return res.status(404).json({ message: 'Story not found' });
		}

		// Check if user belongs to the group that owns the sprint
		const isMember = await UserGroup.findOne({
			where: {
				userId,
				groupId: sprint.groupId,
			},
		});

		if (!isMember) {
			return res.status(403).json({ message: 'You are not authorized to link stories to this sprint' });
		}

		// Update the story with the sprint ID
		await story.update({ sprintId });

		return res.status(200).json({
			success: true,
			message: 'Story linked to sprint successfully',
			data: { storyId, sprintId },
		});
	} catch (error) {
		console.error('Error linking story to sprint:', error);
		return res.status(500).json({ message: 'Internal server error' });
	}
});

module.exports = router;
