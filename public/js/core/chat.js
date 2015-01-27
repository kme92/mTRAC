var socket = io.connect('/');

$(document).ready(function(){
    pingServer(socket); //initial ping - heroku will close connection if no ping within 30s of connection

    // ping server every 30s (heroku timeout is 55s)
    setInterval(function ()
    {
        pingServer(socket);
    }, 30000);

    $('form').submit(function(){
        var msg = $('#m').val();
        var color = "green";
        msgOb = {
                msg: msg,
                color: color
        };
        socket.emit('chat message', msgOb);
        appendMessage(msgOb);
        $('#m').val('');
        return false;
    });

    socket.on('chat message', function(msgOb){
        appendMessage(msgOb);
    });

});

function pingServer(socket)
{
    //console.log('pinging server at: ' + new Date());
    socket.emit('ping');
}

function appendMessage(msgOb) {
    $('#messages').append($('<li style=\"color:'+ msgOb.color  + '\">').text(msgOb.msg));
}