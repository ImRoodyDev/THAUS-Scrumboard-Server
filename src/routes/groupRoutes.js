const express = require('express');
const router = express.Router();
const { Group } = require('../models');

router.post('/groups', async (req, res) => {
	// ...create group logic...
});

router.put('/groups/:id', async (req, res) => {
	// ...update group logic...
});

router.get('/groups/:id', async (req, res) => {
	// ...retrieve group logic...
});

// Only the owner (from req.user) can delete the group
router.delete('/:id', async (req, res) => {
	try {
		const group = await Group.findByPk(req.params.id);
		if (!group) return res.status(404).json({ error: 'Group not found' });
		if (group.ownerId !== req.user.id) return res.status(403).json({ error: 'Not authorized' });
		await group.destroy();
		res.json({ message: 'Group deleted' });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// ...other endpoints (add member, chat, etc)...

module.exports = router;
