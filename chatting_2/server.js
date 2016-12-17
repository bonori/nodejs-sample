var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

server.listen(3000);

var connections = [];

io.sockets.on('connection', function(socket){
	console.log(socket.id + ' connected');

	socket.on('disconnect', function(){
		console.log(socket.id + ' disconnect');
		if(socket.userName){
			socket.broadcast.emit('new message', {
				from : '',
				msg : socket.userName + ' 님이 나가셨습니다.'
			});
		}
		connections.splice(connections.indexOf(socket),1);
		refreshUsers();
	});

	socket.on('new user', function(userName, callback){
		if(getSocketByName(userName)){
			callback(false);
		}else{
			socket.userName = userName;
			socket.broadcast.emit('new message', {
				from : '',
				msg : userName + ' 님이 접속하셨습니다.'
			});
			connections.push(socket);
			callback(true);
			refreshUsers();
		}
	});

	socket.on('send message', function(msg){
		io.sockets.emit('new message', {
			from : socket.userName,
			msg : msg
		});
	});
});

function getSocketByName(userName){
	return connections.find(socket => socket.userName === userName)
}

function getUserNames(){
	return connections.map(socket => socket.userName);
}

function refreshUsers(){
	io.sockets.emit('refresh users', getUserNames());
}
