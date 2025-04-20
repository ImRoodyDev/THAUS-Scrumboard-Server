const router = require('express').Router();
const User = require('../../models/user');
const Group = require('../../models/group');
const { generateAccessToken, generateRefreshToken, saveRefreshToken } = require('../../controllers/authentication');
const { validateLogin } = require('../../utils/validationUtils');

router.get('/', async (req, res) => {
	try {
		// Find user in the database
		const user = await User.findByPk(req.uuid);

		// Check wheather user exsist
		if (!user) {
			return res.status(401).send({ message: 'Ongeldige user' });
		}

		// Send only groups
		const usergroup = await user.getUserGroups({
			attributes: ['role'],
			include: [
				{
					model: Group,
					attributes: ['id', 'name', 'type', 'createdAt'],
				},
			],
		});

		const groups = usergroup.map((usergroup) => {
			const group = usergroup.Group;
			return {
				id: group.id,
				name: group.name,
				type: group.type,
				role: usergroup.role,
				createdAt: group.createdAt,
			};
		});

		// Send response to client
		res.status(200).send({
			message: 'Gebruiker succesvol ingelogd',
			user,
			groups: groups || [],
		});
	} catch (error) {
		console.error('Error in user login:', error);
		res.status(500).send({ message: 'Interne serverfout' });
	}
});

module.exports = router;
