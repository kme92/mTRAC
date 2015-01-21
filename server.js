// server.js

//require('newrelic');
var express  = require('express');
var app      = express();
gi
var port     = process.env.PORT || 2000;

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
require('./config/passport')(passport); // pass passport for config

// express
app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser());

app.set('view engine', 'ejs');

// required for passport
app.use(session({ secret: 'DRDC4' }));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes
require('./app/routes.js')(app, passport); 

// launch
app.listen(port);
console.log('mTRAC started');