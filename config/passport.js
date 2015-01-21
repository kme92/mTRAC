// config/passport.js

// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;

// load models
var User       		= require('../app/models/user.js');
/*var Section       	= require('../app/models/section.js');
var Profile       	= require('../app/models/profile.js');
var Personal       	= require('../app/models/personal.js');*/

// expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

 	// =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
	// by default, if there was no name, it would just be called 'local'

    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, name, password, done) {

        // asynchronous
        // User.findOne wont fire unless data is sent back
        process.nextTick(function() {

		// find a user whose email is the same as the forms email
		// we are checking to see if the user trying to login already exists
        User.findOne({ 'local.name' :  name }, function(err, user) {
            // if there are any errors, return the error
            if (err)
                return done(err);

            // check to see if there is already a user with that username
            if (user) {
                return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
            } else {

				// if there is no user with that email
                // create the user
                var newUser            = new User();

                // set the user's local credentials
                newUser.local.name    = name;
                newUser.local.password = newUser.generateHash(password);

				// save the user
                newUser.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, newUser);
                });
            }

        });    

        });

    }));
    
    passport.use('local-login', new LocalStrategy({
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true
    },
    function(req, name, password, done) {

        User.findOne({ 'local.name' :  name }, function(err, user) {

            if (err)
                return done(err);

            if (!user || !user.validPassword(password))
                return done(null, false, req.flash('loginMessage', 'Incorrect credentials.'));

            return done(null, user);
        });

    }));


};