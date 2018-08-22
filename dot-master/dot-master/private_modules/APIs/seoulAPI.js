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

	request.get(targetURLArray[0], (error, response, body) => {
		if(!error && response.statusCode === 200) {
			for(let i = 0; i < JSON.parse(body).SearchInfoBySubwayNameService.row.length; i++) {
				stationInfoArray[0].stationLineNumber.push(JSON.parse(body).SearchInfoBySubwayNameService.row[i]['LINE_NUM']);

				if(i === JSON.parse(body).SearchInfoBySubwayNameService.row.length - 1) {
					request.get(targetURLArray[1], (error1, response1, body1) => {
						if(!error1 && response1.statusCode === 200) {
							for(let j = 0; j < JSON.parse(body1).SearchInfoBySubwayNameService.row.length; j++) {
								stationInfoArray[1].stationLineNumber.push(JSON.parse(body1).SearchInfoBySubwayNameService.row[j]['LINE_NUM']);

								if(j === JSON.parse(body1).SearchInfoBySubwayNameService.row.length - 1) {
									request.get(targetURLArray[2], (error2, response2, body2) => {
										if(!error2 && response2.statusCode === 200) {
											for(let k = 0; k < JSON.parse(body2).SearchInfoBySubwayNameService.row.length; k++) {
												stationInfoArray[2].stationLineNumber.push(JSON.parse(body2).SearchInfoBySubwayNameService.row[k]['LINE_NUM']);

												if(k === JSON.parse(body2).SearchInfoBySubwayNameService.row.length - 1) {
													callbackFunction(null, stationInfoArray);
												}
											}
										} else {
											callbackFunction(error2);
										}
									})
								}
							}
						} else {
							callbackFunction(error1);
						}
					});
				}
			}
		} else {
			callbackFunction(error);
		}
	})
};	