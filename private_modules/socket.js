

module.exports = (server)=>{

    
    let io = require('socket.io')(server);
    let redis = require('redis');
    let client = redis.createClient();
    let randomstring = require('randomstring');

    client.on('error', (err)=>{
        console.log(err);
    });


    // client.hgetall('asdasd',(error, result)=>{
    //     if(error){
    //         console.log("error");
    //         console.log(error);
    //         return ;
    //     }
    //     console.log('success');
    //     console.log(result);
    //     if(result)
    //         console.log("asdasd");
    //     else
    //         console.log("123123");
    // })
    // client.set("testKey", "testValue", redis.print);
    // client.hmset('frameworks', {
    //     'javascript': 'AngularJS',
    //     'css': 'Bootstrap',
    //     'node': 'Express'
    // });

    // client.hgetall('frameworks', (error, reply)=>{
    //     console.log(error);
    //     console.log(reply);
    // });

    // 필요한 이벤트
    /*
        
        1. CONNECTION 
        2. CREATE_ROOM
        3. PICK
        4. COMPLETE
        5. RELOAD_ROOM

    */
    
    //1. CONNECTION
    io.on('connection',(socket)=>{

        console.log('[SERVER] => Connection Establish....');
        console.log(socket.id);
        console.log(socket.handshake.address);
        socket.emit('CONNECTION', {msg : "SUCCESS"});

        //2. 방 코드 생성 이벤트
        socket.on('ROOM_CODE', (data)=>{
            
            let result  = {};

            try{
                
                // 중복될 확률
                // 1/(26+26+9)^10 => 1/2^60;
                resutl = {
                    "status" : 1,
                    "room_code" : randomstring.generate(10),
                    "msg" : "방 코드 생성 성공"
                };
            }
            catch(error){

                result = errorInfo(0, "방 코드 생성 에러");
                console.log(error);
            }
            finally{
                socket.emit('ROOM_CODE', result);
            }

        });
        //3. 방 생성 이벤트
        socket.on('ROOM', (data)=>{
          
            let params = [
                data.room.code
                ,"room_name", data.room_name
                ,"room_status", "진행중",
            ];
        
            client.hmset(params, (error, reply)=>{
            
                let result = {};
                
                try{
                    if(error)
                        throw new Error("방 생성중 에러 발생");
                    
                    
                    result = {
                        "status" : 1,
                        "room_code" : data.room_code,
                        "room_name" : data.room_name,
                        "msg" : "방 생성 성공"
                    };  
                    console.log(reply);

                }
                catch(error){
                    result = errorInfo(0, "방 생성 중 에러 발생");
                    console.log(error);
                }finally{
                    socket.emit('ROOM', result);
                }
            });
        });
        
        //3. 사용자 위치 입력 이벤트
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
                socket_id, JSON.stringify(pos)
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
                catch(error){
                    result = errorInfo(0, "사용자 위치 입력 redis 접근 에러");
                    console.log(error);
                }
                finally{
                    //방에 속한 모든 사람들에게 데이터를 보낸다.
                    io.to(data.room_code).emit('PICK', result);
                }
            });    
        });
        
        //4. 입력 완료 이벤트
        socket.on('COMPLETE', (data)=>{
            // 레디스에서 room이름의 데이터를 가져와서
            // 위도 경도 정보를 뽑아내서
            // 중점 좌료를 계산
            // API를 호출하여 추천 위치리스트를 받음.
            // 사용자들에게 뿌려준다.
            
        });
        
        //5. 기존 방정보 리스트
        socket.on('ROOM_LIST', (data)=>{
            
            let list = data.room_codes;
        });
    });

    // 에러 객체 생성 함수
    function errorInfo(status, msg){
        
        let result = {
            "status" : status,
            "msg" : msg
        };

        return result;
    };

    // 방코드를 키로 하여 방정보를 찾는다.
    function findRoom(room_code, callback){        
        client.hgetall(room_code, (error, reply)=>{
            let result;

            try{
                if(error)
                    throw new Error("[방 코드 :], "+room_code+"방 정보 찾기 에러" );
                    
                result = reply;
                console.log(reply);
            }
            catch(exception){
                
                result = errorInfo(0, "방 정보 찾기 실패");
                console.log(exception);
            }
            finally{
                callback(result);
            }
        });
    }
}