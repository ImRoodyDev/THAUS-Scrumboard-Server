const router = require('express').Router();
const UserGroup = require('../../models/usergroup');
const Sprint = require('../../models/sprint');

router.get('/', async (req, res) => {
	try {
		const { groupId, sprintId } = req.query;

		if (!sprintId) {
			return res.status(400).send({ message: 'Sprint ID is vereist' });
		}

		// Check if the user is a group member
		const userGroup = await UserGroup.findOne({
			where: { groupId: req.uuid, groupId: groupId },
		});

		if (!userGroup || userGroup.role !== 'admin') {
			return res.status(403).send({ message: 'Je hebt geen toegang tot deze functie' });
		}

		const sprint = await Sprint.findByPk(sprintId);

		if (!sprint) {
			return res.status(404).send({ message: 'Sprint niet gevonden' });
		}

		await sprint.destroy({ force: true });

		res.status(200).send({
			message: 'Sprint succesvol verwijderd',
		});
	} catch (error) {
		console.error('Error in Sprint deletion:', error);
		res.status(500).send({ message: 'Interne serverfout' });
	}
});

module.exports = router;
