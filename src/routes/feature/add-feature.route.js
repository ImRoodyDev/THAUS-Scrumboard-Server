const router = require('express').Router();
const Feature = require('../../models/feature');
const UserGroup = require('../../models/usergroup');
const { validateTextName } = require('../../utils/validationUtils');

router.post('/', async (req, res) => {
	try {
		// Validate request body
		const groupId = req.body.groupId;
		const [validationError, featureName] = validateTextName(req.body.name);

		// Check if postBody is safe
		if (validationError) {
			return res.status(400).send({ message: validationError.message.replace(/'/g, '') });
		}

		// Check if the user is a group member
		const userGroup = await UserGroup.findOne({
			where: { userId: req.uuid, groupId: groupId },
		});

		if (!userGroup) {
			return res.status(403).send({ message: 'Je hebt geen toegang tot deze functie' });
		}

		// Find or create Feature
		const [newFeature, created] = await Feature.findOrCreate({
			where: { groupId: groupId, name: featureName },
			defaults: {
				name: featureName,
				groupId: groupId,
			},
		});

		if (!created) {
			return res.status(400).send({ message: 'Feature met deze naam bestaat al!' });
		}

		res.status(200).send({
			message: 'Feature is succesvol aangemaakt',
			feature: newFeature,
		});
	} catch (error) {
		console.error('Error in feature creation:', error);
		res.status(500).send({ message: 'Interne serverfout' });
	}
});

module.exports = router;
