const router = require('express').Router();
const Feature = require('../../models/feature');
const UserGroup = require('../../models/usergroup');
const { validateTextName } = require('../../utils/validationUtils');

router.post('/', async (req, res) => {
	try {
		// Validate request body
		const { groupId, featureId } = req.body;
		const [validationError, epicName] = validateTextName(req.body.name);

		if (validationError) {
			return res.status(400).send({ message: validationError.message.replace(/'/g, '') });
		}

		// Check if the user is a group member
		const userGroup = await UserGroup.findOne({
			where: { id: req.uuid, groupId: groupId },
		});

		if (!userGroup) {
			return res.status(403).send({ message: 'Je hebt geen toegang tot deze functie' });
		}

		// Find the feature by its ID
		const feature = await Feature.findByPk(featureId);

		if (!feature) {
			return res.status(404).send({ message: 'Feature niet gevonden' });
		}

		// Use the hasMany association to create an epic for the feature
		const newEpic = await feature.createEpic({ name: epicName, groupId: groupId });

		if (!newEpic) {
			return res.status(409).send({ message: 'Feauture is niet gemmakt' });
		}

		// Send response
		res.status(201).send({ message: 'Feature is succesvol aangemaakt', feature });
	} catch (error) {
		console.error('Error in creating feature:', error);
		res.status(500).send({ message: 'Interne serverfout' });
	}
});

module.exports = router;
