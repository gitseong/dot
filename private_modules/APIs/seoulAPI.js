const request = require('request');

const seoulAPISet = require('../../config/APIs/seoulAPISet.json');

module.exports.getStationLineNumber = function(stationNameArray, callbackFunction) {
	let targetURLArray = [
		'http://openAPI.seoul.go.kr:8088/' + encodeURI(seoulAPISet.accessKey) + '/json/SearchInfoBySubwayNameService/1/5/' + encodeURI(stationNameArray[0].replace('역', '')) + '/ ',
		'http://openAPI.seoul.go.kr:8088/' + encodeURI(seoulAPISet.accessKey) + '/json/SearchInfoBySubwayNameService/1/5/' + encodeURI(stationNameArray[1].replace('역', '')) + '/ ',
		'http://openAPI.seoul.go.kr:8088/' + encodeURI(seoulAPISet.accessKey) + '/json/SearchInfoBySubwayNameService/1/5/' + encodeURI(stationNameArray[2].replace('역', '')) + '/ '
	];

	let stationInfoArray = [
		{stationName : stationNameArray[0], stationLineNumber : []},
		{stationName : stationNameArray[1], stationLineNumber : []},
		{stationName : stationNameArray[2], stationLineNumber : []}
	];

	for(let i = 0; i < targetURLArray.length; i++) {
		console.log(i);
		request.get(targetURLArray[i], (error, response, body) => {
			if(!error && response.statusCode === 200) {
				for(let j = 0; j < JSON.parse(body).SearchInfoBySubwayNameService.row.length; j++) {
					stationInfoArray[i].stationLineNumber.push(JSON.parse(body).SearchInfoBySubwayNameService.row[j]['LINE_NUM']);
					console.log(JSON.parse(body).SearchInfoBySubwayNameService.row[j]['LINE_NUM']);
				
					if(i === targetURLArray.length - 1 && j === JSON.parse(body).SearchInfoBySubwayNameService.row.length - 1) {
						console.log(stationInfoArray);
						callbackFunction(null, stationInfoArray);
					}
				}
			} else {
				callbackFunction(error);
			}
		});
	}
};