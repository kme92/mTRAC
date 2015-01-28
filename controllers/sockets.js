module.exports = function (io) {
    'use strict';

    io.sockets.on('connection', function (socket) {

        var user = socket.request.user;

        socket.on('chat message', function (msgOb) {
console.log(msgOb);
            socket.emit('chat message', {
                msg: msgOb.msg,
                color: msgOb.color,
                user: user.local.name
            });
        });
    });



};