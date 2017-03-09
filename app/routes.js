module.exports = function(app, passport) {

// normal routes ===============================================================

    const agentController = require('./controllers/agent')
    const adsController = require('./controllers/ads')
    const advController = require('./controllers/adv')
    // Agents
    app.get('/addagents', isLoggedIn, agentController.addAgentDisplay);
    app.post('/addagents', isLoggedIn, agentController.insert);
    app.get('/agents/:id', isLoggedIn, agentController.detail);
    app.get('/deleteagents/:id', isLoggedIn, agentController.deleteOne);
    app.get('/editVoucherAgent/:id', isLoggedIn, agentController.editAgentDisplay);
    app.get('/deleteVoucherAgent/:id', isLoggedIn, agentController.deleteVoucherAgent);
    app.post('/editVoucherAgent', isLoggedIn, agentController.saveVoucherAgent);

    app.get('/adv/:nickname', advController.getAdvByNickname);
    app.get('/v/:id', advController.getAdvByVoucherId);

    app.get('/ads', isLoggedIn, adsController.getAll);
    app.get('/addads', isLoggedIn, adsController.getAllDetail);
    app.post('/addads', isLoggedIn, adsController.insert);
    app.post('/updateads', isLoggedIn, adsController.updateAds);
    app.get('/deleteads/:id', isLoggedIn, adsController.deleteOne);
    app.get('/detailads/:id', isLoggedIn, adsController.detailads);


    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

    // HOME SECTION =========================
    app.get('/home', isLoggedIn, agentController.getAll);

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/home', // redirect to the secure home section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/home', // redirect to the secure home section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

// =============================================================================
// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
// =============================================================================

    // locally --------------------------------
        app.get('/connect/local', function(req, res) {
            res.render('connect-local.ejs', { message: req.flash('loginMessage') });
        });
        app.post('/connect/local', passport.authenticate('local-signup', {
            successRedirect : '/home', // redirect to the secure home section
            failureRedirect : '/connect/local', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));


// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/home');
        });
    });
};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
