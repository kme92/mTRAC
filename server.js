// server.js

//require('newrelic');
var express  = require('express');
var app = require('express')();
var http = require('http').Server(app);
var port     = process.env.PORT || 2000; // heroku or local deployment

var mongoose = require('mongoose');
var favicon  = require('serve-favicon');
var passport = require('passport');
var flash 	 = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var configDB = require('./config/database.js');

// config
mongoose.connect(configDB.url); 
require('./config/passport')(passport);

// express
app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser());

app.set('view engine', 'ejs');

app.use(session({ secret: 'DRDC4' }));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash());

// routes
require('./app/routes.js')(app, passport);

// start sockets

var io = require('./controllers/sockets').listen(app)

// launch
app.listen(port);
console.log('mTRAC started');