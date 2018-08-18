const express = require('express');
const router = express.Router();

/* Set router */
const address = require('./address');
const nearbyStation = require('./nearbyStation');
const category = require('./category');
const nextCategory = require('./nextCategory');

/* Connect router */
router.use('/address', address);
router.use('/nearby-station', nearbyStation);
router.use('/category', category);
router.use('/nextCategory', nextCategory);

/* Get page */
router.get('/', (req, res) => {
	res.status(200).send({
		stat : 'Success',
		msg : 'It\s test'
	});
});

module.exports = router;