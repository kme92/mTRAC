var socket = io.connect('/');
var chatColor = '#FFFFFF';

$(document).ready(function(){
    initPingTimer();
    bindChatEvents(socket);
});

function pingServer(socket)
{
    //console.log('pinging server at: ' + new Date());
    socket.emit('ping');
}

function initPingTimer()
{
    pingServer(socket); //initial ping - heroku will close connection if no ping within 30s of connection

    // ping server every 30s (heroku timeout is 55s)
    setInterval(function ()
    {
        pingServer(socket);
    }, 30000);
}

function bindChatEvents(socket)
{
    $('form').submit(function(){
        var msg = $('#m').val();
        var color = "green";
        msgOb = {
            msg: msg,
            color: color
        };
        socket.emit('chat message', msgOb);
        $('#m').val('');
        return false;
    });

    //listen for events
    socket.on('chat message', function(msgOb){
        console.log(msgOb);
        appendMessage(msgOb);
    });
}

function appendMessage(msgOb) {
    $('#messages')
        .append($('<li style=\"color:'+ msgOb.color  + '\">')
        .text(msgOb.user + ": " + msgOb.msg));
}