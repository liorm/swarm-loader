///<reference path='../typings/tsd.d.ts' />
'use strict';
var http = require('http');
var express = require('express');
var SocketModel = require('./models/SocketModel');

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

//
// Chat sample taken from socket.io example.
//
var app = express();
var server = http.createServer(app);

var port = process.env.PORT || 3000;
server.listen(port, function () {
    console.log('Server listening at port %d', port);
});

var socketio = new SocketModel.SocketIO();
socketio.initialize(server);
//# sourceMappingURL=app.js.map
