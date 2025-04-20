const router = require('express').Router();
const User = require('../../models/user');
const { generateAccessToken, generateRefreshToken, saveRefreshToken } = require('../../controllers/authentication');
const { validateRegister } = require('../../utils/validationUtils');

router.post('/', async (req, res) => {
	try {
		// Validate request body
		const [registerError, register] = validateRegister(req.body);
		console.log('Register:', req.body);

		// Check if postBody is safe
		if (registerError) {
			return res.status(400).send({ message: registerError.message.replace(/'/g, '') });
		}

		// Find or create User , automatically it will hash the passwoord before storing it on the database
		const [user, created] = await User.findOrCreate({
			where: { username: register.username },
			defaults: {
				...register,
			},
		});

		// If user is already created / existing user
		if (!created) {
			return res.status(409).send({ message: 'Gebruiker met deze gebruikersnaam bestaat al!' });
		}

		// Handle authentication tokens
		const refreshToken = generateRefreshToken(user.id);
		const accessToken = generateAccessToken(user.id);

		// Save and send request
		saveRefreshToken(res, refreshToken);

		res.status(200).send({
			refreshToken,
			accessToken,
			user,
			message: 'Gebruiker is succesvol aangemaakt',
			groups: [],
		});
	} catch (error) {
		console.error('Error in user registration:', error);
		res.status(500).send({ message: 'Interne serverfout' });
	}
});

module.exports = router;
