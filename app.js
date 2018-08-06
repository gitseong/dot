let express = require('express');
let app = express();

let path = require('path');
let server = require("http").createServer(app);
let indexRouter = require('./routes/index');

let socketModuleLoader= require('./modules/socket_module');

// app.set
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//app.use
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);

server.listen(3000, ()=>{
    console.log('Socket IO Server listening on port 3000');
});

// 소켓모듈 로딩
socketModuleLoader(server);
