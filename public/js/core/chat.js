var socket = io.connect('/');
var chatColor = '#FFFFFF';

$(document).ready(function(){
    initPingTimer();
    bindChatEvents(socket);

    $("#messages").scroll(function(){

        var scrollPosition = $("#messages").scrollTop() + $("#messages").height();
        console.log(scrollPosition + "x" + $('#messages')[0].scrollHeight);
        if(scrollPosition == $('#messages')[0].scrollHeight)
        {
        $('#new-messages-notification').hide();
        }
    });
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
        appendMessage(msgOb);
    });
}

function appendMessage(msgOb) {
    var scrolling = 0;
    var scrollPosition = $("#messages").scrollTop() + $("#messages").height();
    if(scrollPosition != $('#messages')[0].scrollHeight)
    {
        scrolling = 1;
    }
    $('#messages')
        .append($('<li style=\"color:'+ msgOb.color  + '\">')
        .text(msgOb.user + ": " + msgOb.msg));
    if(scrolling == 0)
    {
        $("#messages").scrollTop($('#messages')[0].scrollHeight);
    }
    else
    {
        $("#new-messages-notification").show();
    }


}