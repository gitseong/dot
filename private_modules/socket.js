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
        
        let connectionMsg = {
            msg : "SUCCESS"
        };

        socket.emit('CONNECTION', connectionMsg);

        //2. 방 코드 생성 이벤트
        socket.on('ROOM_CODE', (data)=>{
            
            let return_data  = {};

            try{
                
                // 중복될 확률
                // 1/(26+26+9)^10 => 1/2^60;
                let room_code = randomstring.generate(10);

                return_data.status = 1;
                return_data.room_code = room_code;
                return_data.msg = "방 코드 생성 성공";
            }
            catch(error){
                return_data.status = 0;
                return_data.msg = "방 코드 생성 오류";
                console.log(error);
            }

            socket.emit('ROOM_CODE', return_data);
        });
        //3. 방 생성 이벤트
        socket.on('ROOM', (data)=>{

        });
        
        //3. 사용자 위치 입력 이벤트
        socket.on('PICK', (data)=>{
           
            let return_data = {};
            let room_code = data.room_code;

            client.hmset(data.room_code, (error, data)=>{

                //에러 발생 예외 처리
                if(error){
                    return_data.status = 0;
                    return_data.msg ="사용자 위치 입력 redis 접근 에러";
                    socket.emit('PICK', return_data);
                    return ;
                }    


                //데이터 만들어 주고
                return_data = {
                    status : 1,
                    room_code : data.room_code,
                    room_name : data.room_name,
                    lat : data.lat,
                    long : data.long,
                    msg : '사용자 위치 입력 이벤트 발생'
                };

                //방에 속한 모든 사람들에게 데이터를 보낸다.
                io.to(data.room_code).emit('PICK', return_data);
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

        });
        
        // 방 이름 입력했을때 이벤트
        socket.on('APP_GROUP', (data)=>{
            
            //입력으로 넘어온 방 이름의 정보를 가져온다.
            let isExistRoom =  io.sockets.adapter.rooms[data.room];
            if(typeof(isExistRoom) === 'undefined'){
                // 처음 생성하는 방이면 친구초대 화면으로
                socket.emit('FRIEND_INVITE',{});
            }
            else{
                // 기존에 생성된 방이면 지도검색 화면으로
                socket.emit('STEP1', {});
                console.log('기존에 있는 방');
            }

            socket.join(data.room);
            io.to(data.room).emit("chat", "누군가 입장했어");
            console.log(socket.rooms[Object.keys(socket.rooms)[0]]);

        });

        //사용자별 위치 입력 이벤트
        socket.on('MAP_PICK', (data)=>{

            let lat = data.lat;
            let long = data.long;
            
            let point = {
                lat : lat,
                long : long
            };

            io.to(data.room).emit("MAP_PICK", point);
            
            
        });

        //완료 버튼 눌렀을때
        socket.on('COMPLETE', (data)=>{
            // 중점찾기 알고리즘돌리고
            
            let point = {
                lat : "위도",
                long : "경도"
            };

            io.to(data.room).emit('COMPLETE', point );
        });


        //추천 리스트에서 선택 이벤트
        socket.on('LIST_PICK', (data)=>{

        })
        socket.on('chat', (data)=>{
            console.log(data);
            
            let name = socket.name = data.name;
            let room = socket.room = data.room;
            
            socket.join(room);
            io.emit('chat', data.msg);

        })
    });
}