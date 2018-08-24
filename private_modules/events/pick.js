let redis = require('redis');
let client = redis.createClient();
let util = require('./utils');

module.exports = function(io, socket){
    socket.on('PICK', (data)=>{
           
        let result = {};
        
        //사용자가 찍은 위치의 위도, 경도
        let pos = {
            "lat" : data.lat,
            "long" : data.long
        };

        //room_code, socket id, 위치정보
        let params = [
            data.room_code,             
            socket.id, JSON.stringify(pos)
        ];

        // room_code 에 사용자의 위치 정보를 string으로 저장
        client.hmset(params, (error, reply)=>{

            try{
                if(error)
                    throw new Error("사용자 위치 입력 redis 접근 에러");
                
                //데이터 만들어 주고
                result = {
                    "status" : 1,
                    "room_code" : data.room_code,
                    "room_name" : data.room_name,
                    "lat" : data.lat,
                    "long" : data.long,
                    "msg" : '사용자 위치 입력 이벤트 발생'
                }; 
                console.log(reply);
                     
            }
            catch(exception){
                result = errorInfo(0, exception);
                console.log(exception);
            }
            finally{
                //방에 속한 모든 사람들에게 데이터를 보낸다.
                io.to(data.room_code).emit('PICK', result);
            }
        });    
    });
}