const express = require('express');
const router = express.Router();
const async = require('async');

const googleAPI = require('../../private_modules/APIs/googleAPI');

router.get('/', (req, res) => {
	let latitude = req.query.latitude;
	let longtitude = req.query.longtitude;

	let addressTaskArray = [
		(callback) => {
			googleAPI.coordinateToAddress(latitude, longtitude, (error, result) => {
				if(error) {
					callback(error);

					res.status(500).send({
						stat : 'Fail',
						msg : 'Coordinate to address fail'
					});
				} else {
					callback(null, 'Coordinate to address success');
				
					res.status(200).send({
						stat : 'Success',
						msg : 'Coordinate to address success',
						address : result
					});
				}
			});
		}
	];

	async.waterfall(addressTaskArray, (error, result) => {
		if(error) console.log('Async fail : ' + error);
		else console.log('Async success : ' + result);
	})
});

module.exports = router;