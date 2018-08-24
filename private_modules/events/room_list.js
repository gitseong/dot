
let redis = require('redis');
let client = redis.createClient();
let util = require('./utils');

module.exports = function(io, socket){
    socket.on('ROOM_LIST', (data)=>{
            
        let list = {};
       
        // 방정보들을 가져온다.
        data.room_codes.forEach(code => {
            findRoom(room, function(reply){
                list[code] = reply;
            });
        });

        let result = {
            "status" : 1,
            "room_list" : list,
            "msg" : "방 정보 찾기 성공"
        }
        // 방정보 리스트 이벤트 발생.
        socket.emit('ROOM_LIST', result);
    });
}