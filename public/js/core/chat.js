var socket = io.connect('/');

$(document).ready(function(){
    pingServer(socket); //initial ping - heroku will close connection if no ping within 30s of connection

    // ping server every 30s (heroku timeout is 55s)
    setInterval(function ()
    {
        pingServer(socket);
    }, 30000);

    $('form').submit(function(){
        socket.emit('chat message', $('#m').val());
        $('#m').val('');
        return false;
    });

});

function pingServer(socket)
{
    //console.log('pinging server at: ' + new Date());
    socket.emit('ping');
}