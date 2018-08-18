const express = require('express');
const router = express.Router();
const async = require('async');

const googleAPI = require('../../private_modules/APIs/googleAPI');

router.get('/', (req, res) => {
	let nextPageToken = req.query.nextPageToken;

	let nextCategoryTaskArray = [
		(callback) => {
			googleAPI.searchNextCategory(nextPageToken, (error, result) => {
				if(error) {
					callback('Search next category fail : ' + error);
					
					res.status(500).send({
						stat : 'Fail',
						msg : 'Search next category fail'
					});
				} else {
					callback(null, 'Search next category success');

					res.status(200).send({
						stat : 'Success',
						msg : 'Search next category success',
						nextCategoryinfo : result
					});
				}
			});	
		},
	];

	async.waterfall(nextCategoryTaskArray, (error, result) => {
		if(error) console.log('Async fail : ' + error);
		else console.log('Async success : ' + result);
	});
});

module.exports = router;