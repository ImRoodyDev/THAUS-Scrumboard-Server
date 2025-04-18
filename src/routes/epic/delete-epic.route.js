const router = require('express').Router();
const UserGroup = require('../../models/usergroup');
const Epic = require('../../models/epic');

router.get('/', async (req, res) => {
	try {
		const { groupId, epicId } = req.query;

		if (!epicId) {
			return res.status(400).send({ message: 'Epic ID is vereist' });
		}

		// Check if the user is a group member
		const userGroup = await UserGroup.findOne({
			where: { userId: req.uuid, groupId: groupId },
		});

		if (!userGroup || userGroup.role !== 'admin') {
			return res.status(403).send({ message: 'Je hebt geen toegang tot deze functie' });
		}

		const epic = await Epic.findByPk(epicId);

		if (!epic) {
			return res.status(404).send({ message: 'Epic niet gevonden' });
		}

		await epic.destroy({ force: true });

		res.status(200).send({
			message: 'Epic succesvol verwijderd',
		});
	} catch (error) {
		console.error('Error in epic deletion:', error);
		res.status(500).send({ message: 'Interne serverfout' });
	}
});

module.exports = router;
