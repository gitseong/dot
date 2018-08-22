const express = require('express');
const router = express.Router();
const async = require('async')

const googleAPI = require('../../private_modules/APIs/googleAPI');

const mappingSet = require('../../config/appData/mappingSet.json');

router.get('/:categoryNumber/:sortNumber', (req, res) => {
	let latitude = req.query.latitude;
	let longtitude = req.query.longtitude;
	let categoryNumber = req.params.categoryNumber;
	let sortNumber = '' + req.params.sortNumber;

	let categoryTaskArray = [
		(callback) => {
			googleAPI.searchCategory(latitude, longtitude, categoryNumber, (error, result) => {
				if(error) {
					callback('Search category with distance has error : ' + error);

					res.status(500).send({
						stat : 'Fail',
						msg : 'Search category with distance has error'
					});
				} else if(mappingSet.sortMethod[sortNumber] === 'distance') {
					let nextPageToken = result[0].nextPageToken;
					result.splice(0,1);
					let categoryData = result;

					callback(null, 'Search category with distance has success');

					res.status(200).send({
						stat : 'Success',
						msg : 'Search category with distance has success',
						nextPageToken : nextPageToken,
						data : categoryData
					});
				} else {
					let nextPageToken = result[0].nextPageToken;
					result.splice(0,1);
					let categoryData = result;
					let sortingField = 'placeRating';
					
					categoryData.sort(function(a, b) {
						return b[sortingField] - a[sortingField];
					});

					callback(null, 'Search category with rating has success');

					res.status(200).send({
						stat : 'Success',
						msg : 'Search category with distance has success',
						nextPageToken : nextPageToken,
						data : categoryData
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