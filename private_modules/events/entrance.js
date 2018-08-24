
let redis = require('redis');
let client = redis.createClient();
let util = require('./utils');

module.exports = function(io, socket){

     // 방 입장 이벤트
    socket.on('ENTRANCE', (data)=>{
        
        
        let result = {};
        let params = [data.room_code, socket.id, data.user_name];
        
        client.hmset(params, (error, reply)=>{

            try{
                if(error)
                    throw new Error(error);
                
                util.findRoom(data.room_code, function(reply){
                    

                    if(reply.status == 0){
                        io.to(data.room_code).emit('ENTRANCE', util.errorInfo(0, '[ ENTRANCE ] 방정보를 찾는데 실패하였습니다.'));
                    }
                    else{

                        result = {
                            "status" : reply.status,
                            "room_info" : reply,
                            "msg" : "방에 입장 하였습니다"
                        };
                        console.log("entrance 안에서");
                        console.log(result);
                        io.to(data.room_code).emit('ENTRANCE', result); 
                    }
               
                });
            }
            catch(exception){
                console.log(exception);
                result = util.errorInfo(0, exception);

            }
            finally{
                socket.emit('ENTRANCE', result);
                io.to(data.room_code).emit('ENTRANCE', result);
            }
        });
    });
};