///<reference path='../../typings/tsd.d.ts' />
'use strict';
var io = require('socket.io');
var uuid = require('node-uuid');

var SocketModel;
(function (SocketModel) {
    /**
    * Handles all the socket.io stuff.
    */
    var SocketIO = (function () {
        function SocketIO() {
            // All the clients.
            this._allClients = {};
        }
        SocketIO.prototype.initialize = function (server) {
            this._ioServer = io(server);

            var self = this;
            this._ioServer.on('connection', function (socket) {
                return self.onConnection(socket);
            });
        };

        /**
        * Event handler for socket connection.
        * @param socket
        * @constructor
        */
        SocketIO.prototype.onConnection = function (socket) {
            var _this = this;
            var isLoggedIn = false;

            // Register events.
            socket.on('disconnection', function () {
                if (!isLoggedIn)
                    return;

                socket.broadcast.to('userLogout', socket.userId);

                delete _this._allClients[socket.userId];
            });
            socket.on('sendMessage', function (data) {
                socket.broadcast.to('message', {
                    id: socket.userId,
                    message: data
                });
            });
            socket.on('register', function (data) {
                isLoggedIn = true;

                socket.username = data;

                do {
                    socket.userId = uuid.v1();
                } while(socket.userId in _this._allClients);

                // Add to the list.
                _this._allClients[socket.userId] = socket;

                // Notify everyone of the new user.
                socket.broadcast.to('userLogin', {
                    name: socket.username,
                    id: socket.userId
                });

                // Inform the new user of his ID.
                socket.emit('hello', {
                    id: socket.userId
                });
            });
        };
        return SocketIO;
    })();
    SocketModel.SocketIO = SocketIO;
})(SocketModel || (SocketModel = {}));

module.exports = SocketModel;
//# sourceMappingURL=SocketModel.js.map
