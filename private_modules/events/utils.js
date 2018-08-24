let utils = {}; 
let redis = require('redis');
let client = redis.createClient();

 // 에러 객체 생성 함수
 utils.errorInfo = function(status, msg){
        
    let result = {
        "status" : status,
        "msg" : msg
    };

    return result;
};

// 방코드를 키로 하여 방정보를 찾는다.
utils.findRoom = function(room_code, callback){        
    client.hgetall(room_code, (error, reply)=>{
        let result;

        try{
            if(error)
                throw new Error("[방 코드 : "+room_code+"], 방 정보 찾기 에러" );
                
            result = reply;
            console.log('findRoom 함수 안에서');
            console.log(reply);
        }
        catch(exception){
            
            result = errorInfo(0, exception);
            console.log(exception);
        }
        finally{
            callback(result);
        }
    });
}

module.exports = utils;