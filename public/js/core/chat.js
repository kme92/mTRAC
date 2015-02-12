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
    $('#message-input-form').keydown(function(evt){

        var msg = $('#message-input').val();
        var color = "green";
        msgOb = {
            msg: msg,
            color: color
        };

        if (evt.keyCode == 13 && !evt.shiftKey) {
            $('#message-input').val('');
            socket.emit('chat message', msgOb);
            return false;
        }
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