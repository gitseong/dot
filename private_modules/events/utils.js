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
utils.findCenter = function(list){
    
    // let list = [];
    // let pos1 = {
    //     "lat" : 37.510089, 
    //     "long" : 127.011604
    // };
    // let pos2 = {
    //     "lat" : 37.486137, 
    //     "long" : 127.053893
    // };
    // let pos3 = {
    //     "lat" : 37.471954, 
    //     "long"  :127.003841
    // };
    
    // list.push(pos1);
    // list.push(pos2);
    // list.push(pos3);

    let x = 0, 
        y = 0, 
        z = 0;
    
    list.forEach((pos, index)=>{
        let lat = pos.lat * Math.PI / 180;
        let long = pos.long * Math.PI / 180;

        x += Math.cos(lat) * Math.cos(long);
        y += Math.cos(lat) * Math.sin(long);
        z += Math.sin(lat);
    });

    x = x/list.length;
    y = y/list.length;
    z = z / list.length;

    let centLat = Math.atan2(y, x);
    let centalSeq = Math.sqrt(x * x + y * y);
    let centLong = Math.atan2(z, centalSeq);

    let resLat = centLat * 180 / Math.PI;
    let resLong = centLong * 180 / Math.PI;

    let center = {
        "lat" : resLat.toFixed(7),
        "long" : resLong.toFixed(7)
    };

    // console.log("----lat long-----");
    // console.log(resLat.toFixed(7));
    // console.log(resLong.toFixed(7));
    // console.log("----lat long-----");
    
    return center;

}
module.exports = utils;