

module.exports = (server)=>{

    
    let io = require('socket.io')(server);
    
    // event 모듈
    let entrance    = require('./events/entrance'); 
    let room_info   = require('./events/room_info');
    let room        = require('./events/room');
    let pick        = require('./events/pick');
    let complete    = require('./events/complete');
    let room_list   = require('./events/room_list');

    //1. CONNECTION
    io.on('connection',(socket)=>{

        
        console.log('[SERVER] => Connection Establish....');
        //console.log(socket.id);
        //console.log(socket.handshake.address);
        
        socket.emit('CONNECTION', {msg : "SUCCESS"});

        entrance(io, socket);       // 방 입장 이벤트
        room_info(io, socket);      // 방 정보 요청 이벤트
        room(io, socket);           // 방 생성 이벤트
        pick(io, socket);           // 위치 입력 이벤트
        complete(io, socket);       // 완료 이벤트
        room_list(io, socket);      // 방 정보 불러오기 이벤트
    });
}