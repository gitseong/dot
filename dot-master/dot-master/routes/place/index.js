const express = require('express');
const router = express.Router();

const address = require('./address');
const nearbyStation = require('./nearbyStation');
const category = require('./category');
const nextCategory = require('./nextCategory');

router.use('/address', address);
router.use('/nearby-station', nearbyStation);
router.use('/category', category);
router.use('/next-category', nextCategory);

router.get('/', (req, res) => {
	res.status(200).send({
		stat : 'Success',
		msg : 'It\s test'
	});
});

module.exports = router;