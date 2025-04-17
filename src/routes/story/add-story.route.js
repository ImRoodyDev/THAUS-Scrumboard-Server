const router = require('express').Router();
const Epic = require('../../models/epic');
const UserGroup = require('../../models/usergroup');
const { validateTextName } = require('../../utils/validationUtils');


router.post('/', async (req, res) => {
	try{
		// Validate request body
		const {groupId, epicId, description } = req.body;
		const [validationError, storyName] = validateTextName(req.body.name);

		// Check if postBody is safe
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

		// Check if the epic exists
		const epic = await Epic.findOne({
			where: { id: epicId },
		});

		if (!epic) {
			return res.status(404).send({ message: 'Epic niet gevonden' });
		}

		// Create the story
		const story = await epic.createStory({
			name: storyName,
			description: description,
			groupId: groupId,
			epicId: epicId,
			featureId: epic.featureId,
 		});


		if (!story) {
			return res.status(500).send({ message: 'Er is een fout opgetreden bij het aanmaken van het user story' });
		}

		// Send the response
		res.status(200).send({
			message: 'User story succesvol aangemaakt',
			story: story,
		});
	}
	catch (error) {
		console.error('Error in creating story:', error);
		res.status(500).send({ message: 'Internal server error' });
	}
});
