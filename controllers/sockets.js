module.exports = function (io) {

    'use strict';

    io.sockets.on('connection', function (socket) {

        socket.on('chat message', function (msgOb) {

            socket.broadcast.emit('chat message', {
                msg: msgOb.msg,
                color: msgOb.color
            });
        });

        socket.on('disconnect', function(){
            //emit disconnect
        });
    });



};