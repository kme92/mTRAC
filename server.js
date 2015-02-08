// server.js

require('newrelic');

var express = require('express');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var passportSocketIo = require("passport.socketio");
var port = process.env.PORT || 2000; // heroku or local deployment

var mongoose = require('mongoose');
var favicon  = require('serve-favicon');
var passport = require('passport');
var flash 	 = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var MongoStore   = require('connect-mongo')(session);
var configDB = require('./config/database.js');

// config
mongoose.connect(configDB.url);
var sessionStore = new MongoStore({ mongooseConnection: mongoose.connection });

require('./config/passport')(passport);

// express
app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser());

app.set('view engine', 'ejs');

app.use(session({
    key: 'connect.sid',
    secret: 'C2L2',
    store: sessionStore,
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// routes
require('./app/routes.js')(app, passport);

// launch
server.listen(port);

// start socket server
io.use(passportSocketIo.authorize({
    passport:     passport,
    cookieParser: cookieParser,
    key:          'connect.sid',
    secret:       'C2L2',
    store:        sessionStore,
    success:      onAuthorizeSuccess,
    fail:         onAuthorizeFail
}));

function onAuthorizeSuccess(data, accept){
    accept(null, true);
}

function onAuthorizeFail(data, message, error, accept){
    if(error)
        throw new Error(message);
    accept(null, false);
}
require('./controllers/sockets')(io);

console.log('mTRAC started');