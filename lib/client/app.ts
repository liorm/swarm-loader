///<reference path='../../typings/tsd.d.ts' />

'use strict';

import io = require('socket.io-client');
import uuid = require('node-uuid');

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

if (!process.env.SWARM_SERVER) {
    console.error("SWARM_SERVER wasn't specified!");
    process.exit();
}

var socket = io.connect(process.env.SWARM_SERVER);

socket.on('hello', function (data: any) {
    console.log('Logged in with ID "' + data.id + '"');
});
socket.on('userLogin', function (data: any) {
    console.log('Greetings "' + data.name + '" with ID "' + data.id + '"');
});
socket.on('userLogout', function (data: any) {
    console.log('Bye bye ID "' + data.id + '"');
});
socket.on('message', function (data: any) {
    console.log('ID "' + data.id + '" says: "' + data.message + '"');
});

socket.on('disconnect', function () {
    console.log('disconnected!');
});
socket.on('connect', function () {
    // Register upon connection.
    socket.emit('register', 'user-' + uuid.v1());
});
socket.on('reconnect', function () {
    console.log('reconnected!');
});

function sendRandomMessage() {
    socket.emit('sendMessage', "Dummy message #" + uuid.v1());

    setTimeout(sendRandomMessage, 500);
}

console.log('Swarm client running.');
sendRandomMessage();
