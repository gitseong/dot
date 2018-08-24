
let redis = require('redis');
let client = redis.createClient();
let util = require('./utils');

module.exports = function(io, socket){

     // 방 입장 이벤트
    socket.on('ENTRANCE', (data)=>{
        
        console.log('asdasdasdads');
        console.log('asdasdasdads');
        console.log('asdasdasdads');
        console.log('asdasdasdads');
        
        let result = {};
        let params = [data.room_code, socket.id, data.user_name];
        
        client.hmset(params, (error, reply)=>{

            try{
                if(error)
                    throw new Error(error);
                
                util.findRoom(data.room_code, function(reply){
                    result = {
                        "status" : 1,
                        "room_info" : reply,
                        "msg" : "방에 입장 하였습니다"
                    };
                    
                    console.log('asdasdsa');
                    console.log(result);
               
                });
            }
            catch(exception){
                console.log(exception);

                result = util.errorInfo(0, exception);

            }
            finally{
                console.log(result);
                socket.emit('ENTRANCE', result);
                io.to(data.room_code).emit('ENTRANCE', result);
            }
            
        });
    });
};