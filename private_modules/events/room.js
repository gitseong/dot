let redis = require('redis');
let client = redis.createClient();
let util = require('./utils');
let randomstring = require('randomstring');
    
module.exports = function(io, socket){
    socket.on('ROOM', (data)=>{
          
        // 중복될 확률
        // 1/(26+26+9)^10 => 1/2^60;
        let room_code = randomstring.generate(10);
        let params = [room_code, "room_name", data.room_name, "room_status" , "진행중"];
        
        client.hmset(params, (error, reply)=>{
        
            let result = {};
            
            try{
                if(error)
                    throw new Error("방 생성중 에러 발생");
                
                
                result = {
                    "status" : 1,
                    "room_code" : room_code,
                    "room_name" : data.room_name,
                    "msg" : "방 생성 성공"
                };  
                console.log(reply);

            }
            catch(exception){
                result = errorInfo(0, exception);
                console.log(error);
            }finally{
                socket.emit('ROOM', result);
            }
        });
    });
}