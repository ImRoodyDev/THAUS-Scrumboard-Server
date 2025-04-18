const router = require('express').Router();
const Group = require('../../models/group');
const User = require('../../models/user');
const Feature = require('../../models/feature');
const Epic = require('../../models/epic');
const Story = require('../../models/story');
const Sprint = require('../../models/sprint');
const UserGroup = require('../../models/usergroup');

router.get('/:groupId', async (req, res) => {
	try {
		const groupId = req.params.groupId;

		// Fetch groups with related data
		const usergroup = await UserGroup.findOne({
			where: { userId: req.uuid, groupId: groupId },
			attributes: ['role'], // Fetch only the role of the user in the group
			include: [
				{
					model: Group,
					include: [
						{
							model: Feature,
							include: [
								{
									model: Epic,
									include: [
										{
											model: Story,
											attributes: ['id', 'name', 'description', 'startDate', 'endDate'],
										},
									],
								},
							],
						},
						{
							model: UserGroup,
							attributes: ['role', 'userId'],
							include: [
								{
									model: User,
									attributes: ['id', 'username'],
								},
							],
						},
						{
							model: Sprint,
							attributes: ['id', 'startDate', 'endDate'],
						},
					],
				},
			],
		});

		// Check if groups exist
		if (!usergroup || usergroup.length === 0) {
			return res.status(404).send({ message: 'No groups found' });
		}

		// Format response data
		const group = (function () {
			const group = usergroup.Group;

			return {
				id: group.id,
				name: group.name,
				type: group.type,
				// ownerId: group.ownerId,
				createdAt: group.createdAt,
				updatedAt: group.updatedAt,
				currentUserRole: usergroup.role,

				// Map members - Fix: changed usergroup to UserGroups with optional chaining
				members:
					group.UserGroups?.map((member) => ({
						userId: member.userId,
						username: member.User?.username,
						role: member.role,
					})) || [],

				// Map sprints
				sprints:
					group.Sprints?.map((sprint) => ({
						id: sprint.id,
						name: sprint.name,
						startDate: sprint.startDate,
						endDate: sprint.endDate,
					})) || [],

				// Map features and nested items
				features:
					group.Features?.map((feature) => ({
						id: feature.id,
						name: feature.name,
						description: feature.description,

						epics:
							feature.Epics?.map((epic) => ({
								id: epic.id,
								name: epic.name,
								description: epic.description,

								stories:
									epic.Stories?.map((story) => ({
										id: story.id,
										name: story.name,
										description: story.description,
										startDate: story.startDate,
										endDate: story.endDate,
										sprintId: story.sprintId,
										userId: story.userId,
									})) || [],
							})) || [],
					})) || [],
			};
		})();

		// Send response to client
		res.status(200).send({
			message: 'Groups fetched successfully',
			groups: group,
		});
	} catch (error) {
		console.error('Error in fetching groups:', error);
		res.status(500).send({ message: 'Internal server error' });
	}
});

module.exports = router;
