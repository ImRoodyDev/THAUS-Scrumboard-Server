const router = require('express').Router();
const Sprint = require('../../models/sprint');
const UserGroup = require('../../models/usergroup');

router.post('/', async (req, res) => {
	try {
		// Validate request body
		const groupId = req.body.groupId;

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

		// Find or create Feature
		const sprint = await Sprint.create({
			groupId: groupId,
		});

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
