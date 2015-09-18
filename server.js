var express = require('express'),
    app = express(),
    server = require('http').Server(app),
    io = require('socket.io')(server),
    imuduino = require('imuduino-raw');

server.listen(4200);
console.log('http://localhost:4200');

app.use(express.static('dist'));

var ble = new imuduino({ autoConnect: true });
ble.on('packet', function (p) {
	if (p.type == 'position') {
		io.emit(p.type, p);		
	}
});