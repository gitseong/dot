const express = require('express');
const router = express.Router();
const async = require('async');

const googleAPI = require('../../private_modules/APIs/googleAPI');
const seoulAPI = require('../../private_modules/APIs/seoulAPI');

router.get('/', (req, res) => {
	let latitude = req.query.latitude;
	let longtitude = req.query.longtitude;

	let nearbyStationTaskArray = [
		(callback) => {
			googleAPI.searchStation(latitude, longtitude, (error, result) => {
				if(error) {
					callback('Search station fail : ' + error);

					res.status(500).send({
						stat : 'Fail',
						msg : 'Search station fail'
					});
				} else {
					callback(null, result);
				}
			});
		},
		(stationNameArray, callback) => {
			seoulAPI.getStationLineNumber(stationNameArray, (error, result) => {
				if(error) {
					callback('Get station line number fail : ' + error);

					res.status(500).send({
						stat : 'Fail',
						msg : 'Get station line number fail'
					});
				} else {
					callback(null, result);
				}
			});
		},
		(stationInfoArray, callback) => {
			res.status(200).send({
				stat : 'Success',
				msg : 'Get station line number success',
				stationInfo : stationInfoArray
			});
		}
	];

	async.waterfall(nearbyStationTaskArray, (error, result) => {
		if(error) console.log('Async fail : ' + error);
		else console.log('Async success : ' + result);
	})
})

module.exports = router;