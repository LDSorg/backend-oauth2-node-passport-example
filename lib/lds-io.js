'use strict';

module.exports.create = function (app, passport, conf) {
  var LdsConnectStrategy = require('passport-lds-io').Strategy;
  // TODO var LdsConnectStrategy = require('passport-lds-io').Strategy;
  var providerConfig = {
    "profile_url": '/api/ldsio/accounts'
  };

  // TODO requestAsync({ url: "https://lds.io/oauth3.json" });

  // Use the LdsConnectStrategy within Passport.
  //   Strategies in Passport require a `verify` function, which accept
  //   credentials (in this case, an accessToken, refreshToken, and LdsConnect
  //   profile), and invoke a callback with a user object.
  passport.use('lds-strategy-1', new LdsConnectStrategy({
      clientID: conf.id
    , clientSecret: conf.secret
    , callbackURL: conf.url + "/api/oauth3/providers/lds.io/callback"
    , profileUrl: providerConfig.profile_url 
    },
    function (accessToken, refreshToken, profile, done) {
      // asynchronous verification, for effect...
      process.nextTick(function () {
        
        // To keep the example simple, the user's LdsConnect profile is returned to
        // represent the logged-in user.  In a typical application, you would want
        // to associate the LdsConnect account with a user record in your database,
        // and return that user instead.
        return done(null, { accessToken: accessToken, refreshToken: refreshToken, profile: profile });
      });
    }
  ));

  // GET /auth/ldsconnect
  //   Use passport.authenticate() as route middleware to authenticate the
  //   request.  The first step in LdsConnect authentication will involve
  //   redirecting the user to ldsconnect.com.  After authorization, LdsConnect will
  //   redirect the user back to this application at /auth/ldsconnect/callback
  app.get('/api/oauth3/providers/lds.io', function (req, res, next) {
      var scope;

      if (req.query && req.query.scope) {
        scope = req.query.scope.split(/[, ]/g);
      } else {
        scope = ['me'];
      }

      passport.authenticate('lds-strategy-1', { scope: scope })(req, res, next);
    },
    function (req, res) {
      // The request will be redirected to LdsConnect for authentication,
      // so this function will not be called.

      // NOTE: I think the reason this function is here is that there's a bug
      // in some versions of urlrouter / express that require a "final" middleware
      res.end("[Error] this would never get called");
    });

  // GET /auth/ldsconnect/callback
  //   Use passport.authenticate() as route middleware to authenticate the
  //   request.  If authentication fails, the user will be redirected back to the
  //   login page.  Otherwise, the primary route function function will be called,
  //   which, in this example, will redirect the user to the home page.
  app.get('/api/oauth3/providers/lds.io/callback', 
    passport.authenticate('lds-strategy-1'/*, { failureRedirect: '/login' }*/),
    function (req, res, next) {
      req.url = '/oauth-close.html';
      next();
      //res.redirect('/');
    });
};
