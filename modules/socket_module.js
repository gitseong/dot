module.exports = (server)=>{

    let io = require('socket.io')(server);


    // 필요한 이벤트
    /*
        
        1. 방정보 입력 이벤트
        2. 사용자별 위치 입력 이벤트
        3. 위치 추천 정보 발생 이벤트.
        4. 추천 리스트에서 선택 이벤트.

    */
    io.on('connection',(socket)=>{

        console.log('[SERVER] => Connection Establish....');
        socket.emit('connection', 'SUCCESS');

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
          
        });

        //사용자별 위치 입력 이벤트
        socket.on('MAP_PICK', (data)=>{

        });

        //위치 추천 정보 발생 이벤트.
        socket.on('RECOMMAND', (data)=>{

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