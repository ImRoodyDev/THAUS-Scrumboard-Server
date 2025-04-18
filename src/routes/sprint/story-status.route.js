const router = require('express').Router();
const Story = require('../../models/story');
const Sprint = require('../../models/sprint');
const UserGroup = require('../../models/usergroup');

router.post('/', async (req, res) => {
	try {
		const { sprintId, storyId, start, end } = req.body;
		const userId = req.uuid;

		// Validate input
		if (!sprintId || !storyId) {
			return res.status(400).json({ error: 'Missing required fields' });
		}

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
			return res.status(403).json({ message: 'You are not authorized to update story status in this sprint' });
		}

		// Find the story and check if it exists
		const story = await Story.findByPk(storyId);
		if (!story) {
			return res.status(404).json({ message: 'Story not found' });
		}

		// Check if the story is actually linked to this sprint
		if (story.sprintId !== sprintId) {
			return res.status(404).json({ message: 'Story is not linked to this sprint' });
		}

		// Check if the story is already started or ended
		if (story.endDate) {
			return res.status(400).json({ message: 'Story is already completed' });
		}

		// Update the story status
		if (start && story.startDate) {
			await story.update({ userId, startDate: new Date() });

			if (!sprint.startDate) {
				await sprint.update({ startDate: new Date() });
			}
		}
		if (end && !story.endDate) {
			// Chwck if was started by user
			if (story.userId !== userId) {
				return res.status(400).json({ message: 'You are not the one to working on this user story' });
			}

			await story.update({ endDate: new Date() });
		}

		// Check if all the stories in the sprint are completed
		const allStories = await Story.findAll({ where: { sprintId } });
		const allCompleted = allStories.every((story) => story.endDate != null);

		if (allCompleted) {
			await sprint.update({ endDate: new Date() });
		}

		return res.status(200).json({
			success: true,
			message: 'Story status updated successfully',
			sprintCompleted: allCompleted,
		});
	} catch (error) {
		console.error('Error updating story status:', error);
		return res.status(500).json({ error: 'Internal server error' });
	}
});

module.exports = router;
