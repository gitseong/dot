let redis = require('redis');
let client = redis.createClient();
let util = require('./utils');

module.exports = function(io, socket){

    socket.on('ROOM_INFO', (data)=>{
        util.findRoom(data.room_code, function(reply){
            
            if(reply.status == 0){
                socket.emit('ROOM_INFO', reply);    
            }
            else{
                let result = {
                    "status" : reply.status,
                    "room_info" : reply,
                    "msg" : reply.msg
                };
                
                socket.emit('ROOM_INFO', result);
            }                
        });
    });
}