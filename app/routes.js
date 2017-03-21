module.exports = function(app, passport) {

// normal routes ===============================================================

    const agentController = require('./controllers/agent')
    const adsController = require('./controllers/ads')
    const advController = require('./controllers/adv')
    const subscriberController = require('./controllers/subscriber')
    const homeController = require('./controllers/home')
    // Agents
    app.get('/', homeController.home);
    app.get('/advert', homeController.advert);

    app.get('/admin/addagents', isLoggedIn, agentController.addAgentDisplay);
    app.post('/admin/addagents', isLoggedIn, agentController.insert);
    app.get('/admin/agents/:id', isLoggedIn, agentController.detail);
    app.get('/admin/deleteagents/:id', isLoggedIn, agentController.deleteOne);
    app.get('/admin/editVoucherAgent/:id', isLoggedIn, agentController.editAgentDisplay);
    app.get('/admin/deleteVoucherAgent/:id', isLoggedIn, agentController.deleteVoucherAgent);
    app.post('/admin/editVoucherAgent', isLoggedIn, agentController.saveVoucherAgent);

    app.get('/admin/ads', isLoggedIn, adsController.getAll);
    app.get('/admin/addads', isLoggedIn, adsController.getAllDetail);
    app.post('/admin/addads', isLoggedIn, adsController.insert);
    app.post('/admin/updateads', isLoggedIn, adsController.updateAds);
    app.get('/admin/deleteads/:id', isLoggedIn, adsController.deleteOne);
    app.get('/admin/detailads/:id', isLoggedIn, adsController.detailads);

    app.get('/admin/subscribers', isLoggedIn, subscriberController.getAll);


    app.get('/v/:id', advController.getAdvByVoucherId);
    app.post('/addSubscriber', advController.addSubscriber);


    // show the home page (will also have our login links)
    app.get('/admin', function(req, res) {
        res.render('index.ejs');
    });

    // HOME SECTION =========================
    app.get('/admin/home', isLoggedIn, agentController.getAll);

    // LOGOUT ==============================
    app.get('/admin/logout', function(req, res) {
        req.logout();
        res.redirect('/admin');
    });

    app.get('/:nickname', advController.getAdvByNickname);

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/admin/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });

        // process the login form
        app.post('/admin/login', passport.authenticate('local-login', {
            successRedirect : '/admin/home', // redirect to the secure home section
            failureRedirect : '/admin/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        // app.get('/admin/signup', function(req, res) {
        //     res.render('signup.ejs', { message: req.flash('signupMessage') });
        // });

        // process the signup form
        // app.post('/admin/signup', passport.authenticate('local-signup', {
        //     successRedirect : '/admin/home', // redirect to the secure home section
        //     failureRedirect : '/admin/signup', // redirect back to the signup page if there is an error
        //     failureFlash : true // allow flash messages
        // }));

// =============================================================================
// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
// =============================================================================

    // locally --------------------------------
        app.get('/admin/connect/local', function(req, res) {
            res.render('connect-local.ejs', { message: req.flash('loginMessage') });
        });
        app.post('/admin/connect/local', passport.authenticate('local-signup', {
            successRedirect : '/admin/home', // redirect to the secure home section
            failureRedirect : '/admin/connect/local', // redirect back to the signup page if there is an error
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
            res.redirect('/admin/home');
        });
    });
};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
