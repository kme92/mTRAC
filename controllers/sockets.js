module.exports = function (io) {

    'use strict';

    io.sockets.on('connection', function (socket) {

        socket.on('chat message', function(msg){
            console.log('message: ' + msg);
        });

        socket.on('message', function (source, msg) {

            io.sockets.emit('broadcast', {
                "msg": msg,
                "source": source
            });
        });

        socket.on('disconnect', function(){
            //emit disconnect
        });
    });



};