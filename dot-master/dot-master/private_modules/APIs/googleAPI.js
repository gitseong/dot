const request = require('request');

const googleAPISet = require('../../config/APIs/googleAPISet.json');
const mappingSet = require('../../config/appData/mappingSet.json');

module.exports.coordinateToAddress = function(latitude, longtitude, callbackFunction) {
	let targetURL = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + latitude + ', ' + longtitude + '&key=' + googleAPISet.accessKey + '&language=ko';

	request.get(targetURL, (error, response, body) => {
		if(!error && response.statusCode == 200) callbackFunction(null, JSON.parse(body).results[0]['formatted_address']);
		else callbackFunction(error, null);
	});
};

module.exports.searchStation = function(latitude, longtitude, callbackFunction) {
	let targetURL = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' + latitude + ', ' + longtitude + '&type=subway_station&key=' + googleAPISet.accessKey + '&rankby=distance&language=ko';

	request.get(targetURL, (error, response, body) => {
		if(!error && response.statusCode == 200) {
			let stationNameArray = [];

			for(let i = 0; i < JSON.parse(body).results.length; i++) {
				if(JSON.parse(body).results[i].name.indexOf('역') != -1) {
					stationNameArray.push(JSON.parse(body).results[i].name);
				}

				if(stationNameArray.length === 3 || i === JSON.parse(body).results.length) {
					callbackFunction(null, stationNameArray);

					break;
				}
			}
		} else callbackFunction(error, null);
	});
};

module.exports.searchCategory = function(latitude, longtitude, categoryNumber, callbackFunction) {
	let targetURL = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?' +
		'key=' + encodeURI(googleAPISet.accessKey) +
		'&location=' + latitude + ',' + longtitude + 
		'&rankby=distance' +
		'&keyword=' + encodeURI(mappingSet.category[categoryNumber + '']) +
		'&language=ko';
	
	let searchCategoryArray = [];

	request.get(targetURL, (error, response, body) => {
		if(!error && response.statusCode === 200) {
			searchCategoryArray.push({nextPageToken : JSON.parse(body)['next_page_token']});

			for(let i = 0; i < JSON.parse(body).results.length; i++) {
				searchCategoryArray.push(
					{
						placeName : JSON.parse(body).results[i].name,
						placeLatitude : JSON.parse(body).results[i].geometry.location.lat,
						placeLongtitude : JSON.parse(body).results[i].geometry.location.lng,
						placeRating : JSON.parse(body).results[i].rating
					}	
				);

				if(i === JSON.parse(body).results.length - 1) {
					callbackFunction(null, searchCategoryArray);
				}
			}
		} else {
			callbackFunction(error);
		}
	});
};

module.exports.searchNextCategory = function(nextPageToken, callbackFunction) {
	let targetURL = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?' +
		'key=' + encodeURI(googleAPISet.accessKey) +
		'&pagetoken=' + encodeURI(nextPageToken);
	
	let searchNextCategoryArray = [];

	request.get(targetURL, (error, response, body) => {
		if(!error && response.statusCode === 200) {
			if(JSON.parse(body)['next_page_token'] === undefined) {
				searchNextCategoryArray.push({nextPageToken : 'No next page'});
			} else {
				searchNextCategoryArray.push({nextPageToken : JSON.parse(body)['next_page_token']});
			}
			for(let i = 0; i < JSON.parse(body).results.length; i++) {
				searchNextCategoryArray.push(
					{
						placeName : JSON.parse(body).results[i].name,
						placeLatitude : JSON.parse(body).results[i].geometry.location.lat,
						placeLongtitude : JSON.parse(body).results[i].geometry.location.lng,
						placeRating : JSON.parse(body).results[i].rating
					}	
				);

				if(i === JSON.parse(body).results.length - 1) {
					callbackFunction(null, searchNextCategoryArray);
				}
			}
		} else {
			callbackFunction(error);
		}
	});
};