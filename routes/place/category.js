const express = require('express');
const router = express.Router();
const async = require('async')

const googleAPI = require('../../private_modules/APIs/googleAPI');

router.get('/:categoryNumber', (req, res) => {
	let latitude = req.query.latitude;
	let longtitude = req.query.longtitude;
	let categoryNumber = req.params.categoryNumber;

	let categoryTaskArray = [
		(callback) => {
			googleAPI.searchCategory(latitude, longtitude, categoryNumber, (error, result) => {
				if(error) {
					callback('Search category fail : ' + error);

					res.status(500).send({
						stat : 'Fail',
						msg : 'Search category fail'
					});
				} else {
					callback(null, 'Search category success');

					res.status(200).send({
						stat : 'Success',
						msg : 'Search category success',
						categoryInfo : result
					});
				}
			});
		}
	];

	async.waterfall(categoryTaskArray, (error, result) => {
		if(error) console.log('Async fail : ' + error);
		else console.log('Async success : ' + result);
	});
});

module.exports = router;