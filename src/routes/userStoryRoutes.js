const express = require('express');
const router = express.Router();
const { UserStory } = require('../models');

router.post('/', async (req, res) => {
	try {
		const story = await UserStory.create(req.body);
		res.json(story);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

router.get('/', async (req, res) => {
	try {
		const stories = await UserStory.findAll();
		res.json(stories);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

module.exports = router;
