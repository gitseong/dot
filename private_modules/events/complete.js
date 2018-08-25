let redis = require('redis');
let client = redis.createClient();
let util = require('./utils');

module.exports = function(io, socket){
    socket.on('COMPLETE', (data)=>{
           
        // 레디스에서 room이름의 데이터를 가져와서
        // 위도 경도 정보를 뽑아내서
        // 중점 좌료를 계산
        // API를 호출하여 추천 위치리스트를 받음.
        // 사용자들에게 뿌려준다.
        client.hgetall(data.room_code, (error, reply)=>{

            try{
                if(error)
                    throw new Error("중점 찾기 중 방 정보 가져오기 실패");

                let list = [];
                let json, pos;
                for( key in reply){
                    if(reply[key].indexOf('{') == -1)
                        continue;
                    
                    json = JSON.parse(reply[key]);
                    pos = { "lat" : json.lat,"long" : json.long };
                    list.push(pos);
                }

                let center = util.findCenter(list);

                client.hmset([data.room_code, "room_status" , "완료"], (error, reply)=>{
                    
                    try{
                        if(error)
                            throw new Error("방 상태정보 갱신 실패");
        
                        pos = {
                            "lat" : 37.4979462,
                            "long" : 127.025427
                        };
                        
                        result = {
                            "status" : 1,
                            "room_code" : data.room_code,
                            "pick_list" : center,
                            "msg" : "입력 완료 이벤트 성공"
                        }
                       
                        console.log("function : COMPLETE");
                        console.log(center);
                        console.log("function : COMPLETE");
                    }
                    catch(exception){
                        result = errorInfo(0, exception);
                        console.log(exception);
                    }
                    finally{
                        io.to(data.room_code).emit('COMPLETE', result);
                    }
                }); 

            }
            catch(exception){
                console.log(exception);
                socket.emit('COMPLETE', util.errorInfo(0, exception));
                return ;
            }
        });
    });
}