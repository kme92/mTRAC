module.exports = function (io) {
    'use strict';

    io.sockets.on('connection', function (socket) {

        var user = socket.request.user;

        socket.on('chat message', function (msgOb) {

            io.emit('chat message', {
                msg: user.local.name + ": " + msgOb.msg,
                color: msgOb.color,
                user: user.local.name
            });
        });

        socket.on('user connected', function(){
            io.emit('user connected', {
                msg: user.local.name + " connected.",
                color: "green",
                user: user.local.name
            });
        });
    });



};