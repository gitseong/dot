const express = require('express');
const router = express.Router();
const async = require('async');

const googleAPI = require('../../private_modules/APIs/googleAPI');

const mappingSet = require('../../config/appData/mappingSet.json');

router.get('/:sortNumber', (req, res) => {
	let nextPageToken = req.query.nextPageToken;
	let sortNumber = '' + req.params.sortNumber;

	let nextCategoryTaskArray = [
		(callback) => {
			googleAPI.searchNextCategory(nextPageToken, (error, result) => {
				if(error) {
					callback('Search next category fail : ' + error);
					
					res.status(500).send({
						stat : 'Fail',
						msg : 'Search next category fail'
					});
				} else if(mappingSet.sortMethod[sortNumber] === 'distance') {
					let nextPageToken = result[0].nextPageToken;
					result.splice(0, 1);
					let categoryData = result;

					callback(null, 'Search next category success');

					res.status(200).send({
						stat : 'Success',
						msg : 'Search next category success',
						nextPageToken : nextPageToken,
						data : categoryData
					});
				} else {
					let nextPageToken = result[0].nextPageToken;
					result.splice(0, 1);
					let categoryData = result;
					let sortingField = 'placeRating';

					categoryData.sort(function(a, b) {
						return b[sortingField] - a[sortingField];
					});

					callback(null, 'Search next Category with rating success');

					res.status(200).send({
						stat : 'Success',
						msg : 'Search next category with rating has success',
						nextPageToken : nextPageToken,
						data : categoryData
					});
				}
			});	
		}
	];

	async.waterfall(nextCategoryTaskArray, (error, result) => {
		if(error) console.log('Async fail : ' + error);
		else console.log('Async success : ' + result);
	});
});

module.exports = router;