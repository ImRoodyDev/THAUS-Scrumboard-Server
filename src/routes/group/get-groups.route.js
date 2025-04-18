const router = require('express').Router();
const Group = require('../../models/group');
const User = require('../../models/user');
const Feature = require('../../models/feature');
const Epic = require('../../models/epic');
const Story = require('../../models/story');
const Sprint = require('../../models/sprint');

router.get('/', async (req, res) => {
	try {
		// Fetch groups with related data
		const groups = await Group.findAll({
			where: { users: { $contains: [req.uuid] } }, // Assuming a structure where users are stored in a group
			include: [
				{
					model: User,
					attributes: ['id', 'name'], // Include user details
					through: { attributes: ['role'] }, // Exclude join table details
				},
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
					model: Sprint,
					attributes: ['id', 'name', 'startDate', 'endDate'],
				},
			],
		});

		// Check if groups exist
		if (!groups || groups.length === 0) {
			return res.status(404).send({ message: 'No groups found' });
		}

		// Send response to client
		res.status(200).send({
			message: 'Groups fetched successfully',
			groups,
		});
	} catch (error) {
		console.error('Error in fetching groups:', error);
		res.status(500).send({ message: 'Internal server error' });
	}
});

module.exports = router;
