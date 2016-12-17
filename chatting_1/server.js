var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

server.listen(3000, function(){
	console.log('웹 서버가 구동되었습니다.');
});

io.sockets.on('connection', function(socket){
	console.log(socket.id + ' 클라이언트가 연결되었습니다.');

	socket.on('disconnect', function(data){
		console.log(socket.id + ' 클라이언트가 나갔습니다.');
	});

	socket.on('send message', function(msg){
		io.sockets.emit('new message', {msg:msg});
	});
});
