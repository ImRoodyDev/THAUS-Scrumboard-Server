const router = require('express').Router();
const UserGroup = require('../../models/usergroup');
const Feature = require('../../models/feature');

router.get('/', async (req, res) => {
	try {
		const groupId = req.query.groupId;
		const featureId = req.body.featureId;

		if (!featureId) {
			return res.status(400).send({ message: 'Feature ID is vereist' });
		}

		// Check if the user is a group member
 		const userGroup = await UserGroup.findOne({
			where: { id: req.uuid , groupId: groupId },
		});

		if (!userGroup) {
			return res.status(403).send({ message: 'Je hebt geen toegang tot deze functie' });
		}

		const feature = await Feature.findByPk(featureId);

		if (!feature) {
			return res.status(404).send({ message: 'Feature niet gevonden' });
		}

		await feature.destroy({ force: true });

		res.status(200).send({
			message: 'Feature succesvol verwijderd',
		});
	} catch (error) {
		console.error('Error in feature deletion:', error);
		res.status(500).send({ message: 'Interne serverfout' });
	}
}   );

module.exports = router;