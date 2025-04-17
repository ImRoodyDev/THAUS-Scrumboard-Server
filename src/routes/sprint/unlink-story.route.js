const router = require('express').Router();
const Sprint = require('../../models/sprint');
const Story = require('../../models/story');
const UserGroup = require('../../models/usergroup');

router.post('/unlink', async (req, res) => {
	try {
		const { sprintId, storyId } = req.query;
		const userId = req.uuid;

		// Find the sprint and check if it exists
		const sprint = await Sprint.findByPk(sprintId);
		if (!sprint) {
			return res.status(404).json({ message: 'Sprint not found' });
		}

		// Check if user belongs to the group that owns the sprint
		const isMember = await UserGroup.findOne({
			where: {
				userId,
				groupId: sprint.groupId,
			},
		});

		if (!isMember) {
			return res.status(403).json({ message: 'You are not authorized to unlink stories from this sprint' });
		}

		// If the sprint is started or finished, do not allow unlinking stories
		if (sprint.startDate && sprint.endDate) {
			return res.status(400).json({ message: 'Cannot unlink stories from a sprint that is in progress' });
		}

		// Find the story and check if it exists
		const story = await Story.findByPk(storyId);
		if (!story) {
			return res.status(404).json({ message: 'Story not found' });
		}

		// Check if the story is actually linked to this sprint
		if (story.sprintId !== sprintId) {
			return res.status(400).json({ message: 'Story is not linked to this sprint' });
		}

		// Update the story to remove the sprint ID
		await story.update({ sprintId: null });

		return res.status(200).json({
			success: true,
			message: 'Story unlinked from sprint successfully',
			data: { storyId, sprintId },
		});
	} catch (error) {
		console.error('Error unlinking story from sprint:', error);
		return res.status(500).json({ message: 'Internal server error' });
	}
});

module.exports = router;
