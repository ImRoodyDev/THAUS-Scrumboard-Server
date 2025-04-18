const router = require('express').Router();
const Sprint = require('../../models/sprint');
const UserGroup = require('../../models/usergroup');

router.post('/', async (req, res) => {
	try {
		// Validate request body
		const { groupId, sprintId } = req.body;

		// Check if postBody is safe
		if (validationError) {
			return res.status(400).send({ message: validationError.message.replace(/'/g, '') });
		}

		// Check if the user is a group member
		const userGroup = await UserGroup.findOne({
			where: { id: req.uuid, groupId: groupId },
		});

		if (!userGroup || userGroup.role !== 'admin') {
			return res.status(403).send({ message: 'Je hebt geen toegang tot deze functie' });
		}

		// Find the sprint and add date
		const sprint = await Sprint.findByPk(sprintId);

		if (!sprint) {
			return res.status(404).send({ message: 'Sprint niet gevonden' });
		}

		// Check if the sprint is already started
		if (sprint.startDate) {
			return res.status(400).send({ message: 'Sprint is al gestart' });
		}

		// Check if the sprint have stories
		const stories = await sprint.getStories();

		if (stories.length === 0) {
			return res.status(400).send({ message: 'Sprint heeft geen stories' });
		}

		// Update the sprint with start date
		sprint.startDate = new Date();
		await sprint.save();

		res.status(200).send({
			message: 'Sprint is succesvol aangemaakt',
			sprint,
		});
	} catch (error) {
		console.error('Error in Sprint creation:', error);
		res.status(500).send({ message: 'Interne serverfout' });
	}
});

module.exports = router;
