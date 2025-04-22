const router = require('express').Router();
const Group = require('../../models/group');
const User = require('../../models/user');
const Feature = require('../../models/feature');
const Epic = require('../../models/epic');
const Story = require('../../models/story');
const Sprint = require('../../models/sprint');
const UserGroup = require('../../models/usergroup');
const Chat = require('../../models/chat');
const Message = require('../../models/message');

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
											attributes: ['id', 'name', 'description', 'startDate', 'endDate', 'sprintId', 'userId'],
										},
									],
								},
							],
						},
						{
							model: UserGroup,
							attributes: ['role', 'userId', 'createdAt'],
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
						{
							model: Chat,
							attributes: ['id'],
							include: [
								{
									model: Message,
									attributes: ['message', 'createdAt', 'userId'],
									include: [
										{
											model: User,
											attributes: ['username'],
										},
									],
								},
							],
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
				createdAt: group.createdAt,
				updatedAt: group.updatedAt,
				currentUserRole: usergroup.role,

				// Map members - Fix: changed usergroup to UserGroups with optional chaining
				members:
					group.UserGroups?.map((member) => ({
						userId: member.userId,
						username: member.User?.username,
						role: member.role,
						createdAt: member.createdAt,
					})) || [],

				// Map sprints
				sprints:
					group.Sprints?.map((sprint) => ({
						id: sprint.id,
						name: sprint.name,
						startDate: sprint.startDate,
						endDate: sprint.endDate,
						createdAt: sprint.createdAt,
					})) || [],

				// Map features and nested items
				features:
					group.Features?.map((feature) => ({
						id: feature.id,
						name: feature.name,
						description: feature.description,
						createdAt: feature.createdAt,

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
										createdAt: story.createdAt,
									})) || [],
							})) || [],
					})) || [],

				// Map chat messages
				messages:
					group.Chats[0]?.Messages?.map((message) => ({
						message: message.message,
						createdAt: message.createdAt,
						userId: message.userId,
						username: message.User?.username,
						isYours: message.userId === req.uuid,
					})) || [],
			};
		})();

		// Send response to client
		res.status(200).send({
			message: 'Groups fetched successfully',
			group: group,
		});
	} catch (error) {
		console.error('Error in fetching groups:', error);
		res.status(500).send({ message: 'Internal server error' });
	}
});

module.exports = router;
