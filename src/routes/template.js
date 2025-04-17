const router = require('express').Router();

router.post('/', async (req, res) => {
	try{

	}
	catch (error) {
 		res.status(500).send({ message: 'Internal server error' });
	}
});

module.exports = router;


const router = require('express').Router();

router.get('/', async (req, res) => {
	try{

	}
	catch (error) {
 		res.status(500).send({ message: 'Internal server error' });
	}
});

module.exports = router;
