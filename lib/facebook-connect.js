'use strict';

var FacebookStrategy = require('passport-facebook').Strategy
  ;

module.exports.create = function (app, passport, conf) {

  // Use the FacebookStrategy within Passport.
  //   Strategies in Passport require a `verify` function, which accept
  //   credentials (in this case, an accessToken, refreshToken, and Facebook
  //   profile), and invoke a callback with a user object.
  passport.use('fb-strategy-1', new FacebookStrategy({
      clientID: conf.id
    , clientSecret: conf.secret
    , callbackURL: conf.url + "/auth/facebook/callback"
    },
    function (accessToken, refreshToken, profile, done) {
      // asynchronous verification, for effect...
      process.nextTick(function () {
        // To keep the example simple, the user's Facebook profile is returned to
        // represent the logged-in user.  In a typical application, you would want
        // to associate the Facebook account with a user record in your database,
        // and return that user instead.
        return done(null, { accessToken: accessToken, refreshToken: refreshToken, profile: profile });
      });
    }
  ));

  // GET /auth/facebook
  //   Use passport.authenticate() as route middleware to authenticate the
  //   request.  The first step in Facebook authentication will involve
  //   redirecting the user to facebook.com.  After authorization, Facebook will
  //   redirect the user back to this application at /auth/facebook/callback
  app.get('/auth/facebook',
    passport.authenticate('fb-strategy-1', { scope: ['public_profile', 'email'] }),
    function (req, res) {
      // The request will be redirected to Facebook for authentication,
      // so this function will not be called.
      res.end("[Error] this would never get called");
    });

  // GET /auth/facebook/callback
  //   Use passport.authenticate() as route middleware to authenticate the
  //   request.  If authentication fails, the user will be redirected back to the
  //   login page.  Otherwise, the primary route function function will be called,
  //   which, in this example, will redirect the user to the home page.
  app.get('/auth/facebook/callback',
    passport.authenticate('fb-strategy-1'/*, { failureRedirect: '/login' }*/),
    function (req, res, next) {
      req.url = '/oauth-close.html';
      next();
      //res.redirect('/');
    });
};
