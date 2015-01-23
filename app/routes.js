// app/routes.js
module.exports = function(app, passport) {

	// =====================================
	// HOME PAGE ========
	// =====================================

	app.get('/', function(req, res) {
		res.render('index.ejs', { message: req.flash('loginMessage') }); // load the index.ejs file
	});

	// process the login form
	app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/home', // redirect to secure home
		failureRedirect : '/', // redirect back to the login page if there is an error
		failureFlash : true // allow flash messages
	}));


    // ===================================
    // UI Views ==========================
    // ===================================

    app.get('/ui/:view', isLoggedIn, function(req, res) {

        var viewString = 'uis/' + req.param('view') + '.ejs';

        res.render(viewString, {
            user : req.user // get the user out of session and pass to template
        });
    });

	// ===================================
	// Home ==============================
	// ===================================
	
	app.get('/home', isLoggedIn, function(req, res) {
		res.render('home.ejs', {
			user : req.user // get the user out of session and pass to template
		});
	});
	
	// =====================================
	// SIGNUP ==============================
	// =====================================
	// show the signup form
	app.get('/signup', function(req, res) {

		// render the page and pass in any flash data if it exists
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	});

	// process the signup form
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/home', // redirect to secure home
		failureRedirect : '/signup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	// =====================================
	// USERS SECTION =====================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	app.get('/users', isLoggedIn, function(req, res) {
		res.render('users.ejs', {
			user : req.user // get the user out of session and pass to template
		});
	});

	// =====================================
	// LOGOUT ==============================
	// =====================================
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
	
	
//handle 404	
	
	app.get('*', function(req, res) {
		res.render('error404.ejs');
		
	});
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on 
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}