const router = require('express').Router();
const User = require('../../models/user');
const Group = require('../../models/group');
const { generateAccessToken, generateRefreshToken, saveRefreshToken } = require('../../controllers/authentication');
const { validateLogin } = require('../../utils/validationUtils');

router.post('/', async (req, res) => {
	try {
		// Validate request body
		const [loginError, login] = validateLogin(req.body);
		console.log('Login:', req.body);

		// Check if loginBody is safe
		if (loginError) {
			return res.status(400).send({ message: loginError.message.replace(/'/g, '') });
		}

		// Find user in the database
		const user = await User.findOne({ where: { username: login.username } });

		// Check wheather user exsist
		if (!user) {
			return res.status(401).send({ message: 'Ongeldige inloggegevens' });
		}

		// Combined your password with the hash password
		const validPassword = await User.compareHashPassword(login.password, user.password);

		// Check if the password is valid
		if (!validPassword) {
			return res.status(401).send({ message: 'Ongeldig wachtwoord' });
		}

		// Handle authentication tokens
		const refreshToken = generateRefreshToken(user.id);
		const accessToken = generateAccessToken(user.id);

		// Save refresh token
		saveRefreshToken(res, refreshToken);

		// Send only groups
		const usergroup = await user.getUserGroups({
			attributes: ['role'],
			include: [
				{
					model: Group,
					attributes: ['id', 'name', 'type'],
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
			};
		});

		// Send response to client
		res.status(200).send({
			accessToken,
			message: 'Gebruiker succesvol ingelogd',
			groups,
		});
	} catch (error) {
		console.error('Error in user login:', error);
		res.status(500).send({ message: 'Interne serverfout' });
	}
});

module.exports = router;
