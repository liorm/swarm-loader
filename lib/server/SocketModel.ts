///<reference path='../../typings/tsd.d.ts' />

'use strict';

import http = require('http');
import io = require('socket.io');
import uuid = require('node-uuid');

module SocketModel {

    interface Socket extends io.Socket {
        /**
         * The associated user name.
         * Undefined if not registered.
         */
        username?: string;

        /**
         * The generated user ID after login.
         */
        userId?: string
    }

    /**
     * Handles all the socket.io stuff.
     */
    export class SocketIO {
        initialize(server: http.Server) {
            this._ioServer = (<any>io)(server);

            var self = this;
            this._ioServer.on('connection', (socket: io.Socket) => self.onConnection(socket));
        }

        // The socket.io server.
        private _ioServer: any;

        // All the clients.
        private _allClients: { [index: string]: Socket; } = {};


        /**
         * Event handler for socket connection.
         * @param socket
         * @constructor
         */
        private onConnection(socket: Socket) {
            var isLoggedIn = false;

            // Register events.
            socket.on('disconnect', () => {
                if (!isLoggedIn)
                    return;

                this._ioServer.emit('userLogout', {id: socket.userId});

                delete this._allClients[socket.userId];
            });
            socket.on('sendMessage', (data: string) => {
                if (!isLoggedIn)
                    return;

                socket.broadcast.emit('message', {
                    id: socket.userId,
                    message: data
                });
            });
            socket.on('register', (data: string) => {
                isLoggedIn = true;

                console.log('User "' + data + '" registered');

                socket.username = data;

                // Generate unique id.
                do {
                    socket.userId = uuid.v1();
                } while (socket.userId in this._allClients);

                // Add to the list.
                this._allClients[socket.userId] = socket;

                // Notify everyone of the new user.
                socket.broadcast.emit('userLogin', {
                    name: socket.username,
                    id: socket.userId
                });

                // Inform the new user of his ID.
                socket.emit('hello', {
                    id: socket.userId
                });
            });
        }
    }
}

export = SocketModel;
