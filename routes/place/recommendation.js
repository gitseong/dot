const express = require('express');
const router = express.Router();
const async = require('async');

const googleAPI = require('../../private_modules/APIs/googleAPI');
const seoulAPI = require('../../private_modules/APIs/seoulAPI');

router.get('/:categoryNumber', (req, res) => {
	let	latitude = req.query.latitude;
	let	longtitude = req.query.longtitude;
	let address = req.query.address;
	
	let recommendationTaskArray = [
		(callback) => {
			if(address !== undefined) {
				callback(null, address);
			} else if(latitude !== undefined && longtitude !== undefined) {
				googleAPI.coordinateToAddress(latitude, longtitude, (error, result) => {
					if(error) {
						callback('Google API fail : ' + error);

						res.status(500).send({
							stat : 'Fail',
							msg : 'Google API fail'
						});
					} else {
						callback(null, result);
					}
				});
			} else {
				callback('Not enough data input');

				res.status(500).send({
					stat : 'Fail',
					msg : 'Not enough data input'
				});
			}
		},
		(address, callback) => {
			googleAPI.searchStation(latitude, longtitude, (error, result) => {
				if(error) {
					callback('Google API fail : ' + error);

					res.status(500).send({
						stat : 'Fail',
						msg : 'Google API fail'
					});
				} else {
					let stationNameArray = [];

					for(let i = 0; i < result.results.length; i++) {
						if(result.results[i].name.indexOf('역') != -1) {
							stationNameArray.push(result.results[i].name);
						}

						if(stationNameArray.length === 3 || i === result.results.length) {
							callback(null, stationNameArray);

							break;
						}
					}
				}
			});
		},
		(stationNameArray, callback) => {
			seoulAPI.getStationLineNumber(stationNameArray, (error, result) => {
				if(error) callback('Seoul API fail : ' + error);
				else callback(null, result);
			})
		},
		(stationInfoArray, callback) => {
			googleAPI.searchCategory(latitude, longtitude, req.params.categoryNumber, (error, result) => {
				if(error) callback('Google API fail : ' + error);
				else {
					res.status(200).send({
						stat : 'Success',
						msg : 'Recommendation list',
						stations : stationInfoArray,
						categoryInfos : result
					});
				}
			});
		}
	];

	async.waterfall(recommendationTaskArray, (error, result) => {
		if(error) console.log('Async fail : ' + error);
		else console.log('Async success : ' + result);
	});
});

module.exports = router;