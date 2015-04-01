'use strict';

module.exports.create = function (app, passport, conf) {
  var PromiseA = require('bluebird').Promise;
  var OAuth3Strategy = require('passport-oauth3').Strategy;
  var authorizationRedirect = "/api/oauth3/authorization_redirect";
  var authorizationCodeCallback = "/api/oauth3/authorization_code_callback";
  //var authorizationTokenCallback = "/api/oauth3/access_token_callback";
  var providerConfig = {
    'ldsconnect.org': {
      id: conf.id
    , secret: conf.secret
    }
  };

  // TODO requestAsync({ url: "https://lds.io/oauth3.json" });

  // Use the LdsConnectStrategy within Passport.
  //   Strategies in Passport require a `verify` function, which accept
  //   credentials (in this case, an accessToken, refreshToken, and LdsConnect
  //   profile), and invoke a callback with a user object.
  passport.use('oauth3-strategy-1', new OAuth3Strategy({
    providerCallback: function (providerUri) {
      var key = providerUri.replace(/^(https?:\/\/)?(www\.)?/, '').replace(/\/$/, '');

      return PromiseA.resolve(providerConfig[key]);
    }
  , registrationCallback: function (providerUri, conf) {
      // TODO registration is not yet implemented
      var key = providerUri.replace(/^(https?:\/\/)?(www\.)?/, '').replace(/\/$/, '');

      // TODO enforce state to prevent false writes
      if (providerConfig[key] && !providerConfig[key].dynamic) {
        return PromiseA.reject("Attack! someone is trying to overwrite the config");
      }

      providerConfig[key] = conf;
      providerConfig[key].dynamic = true;

      return PromiseA.resolve();
    }
  , callbackURL: conf.url + authorizationCodeCallback 
  }
  , function (req, providerUri, info, params) {
      // To keep the example simple, the user's LdsConnect profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the LdsConnect account with a user record in your database,
      // and return that user instead.
      // info = { accessToken, refreshToken, appScopedId, grantedScopes, profile }
      return PromiseA.resolve({ user: info.profile, info: info, params: params });
    }
  ));

  // GET /auth/ldsconnect
  //   Use passport.authenticate() as route middleware to authenticate the
  //   request.  The first step in LdsConnect authentication will involve
  //   redirecting the user to ldsconnect.com.  After authorization, LdsConnect will
  //   redirect the user back to this application at /auth/ldsconnect/callback
  //
  //  'https://lds.io/api/oauth3/authorization_redirect?provider_uri=' + encodeURIComponent('https://ldsconnect.org')
  app.get(authorizationRedirect, passport.authenticate('oauth3-strategy-1'), function (req, res) {
    // handle an error?
    res.end("probably an error?");
  });
  /*
    (...
    function (req, res) {
      // The request will be redirected to LdsConnect for authentication,
      // so this function will not be called.

      // NOTE: I think the reason this function is here is that there's a bug
      // in some versions of urlrouter / express that require a "final" middleware
      res.end("[Error] this would never get called");
    });
  */

  // GET /auth/ldsconnect/callback
  //   Use passport.authenticate() as route middleware to authenticate the
  //   request.  If authentication fails, the user will be redirected back to the
  //   login page.  Otherwise, the primary route function function will be called,
  //   which, in this example, will redirect the user to the home page.
  app.get(authorizationCodeCallback, function (req, res, next) {
    // This route get hits the first time with the code and the second time 

    passport.authenticate('oauth3-strategy-1', function (err, user, info, status) {
      // info = { accessToken, refreshToken, grantedScopes, appScopedId, profile }
      // req.query = { provider_uri, code, state }
      // user = { ... } // profile

      var querystring = require('querystring');
      var params = { 'provider_uri': req.query.provider_uri };
      var challenge;

      req.url = '/oauth-close.html?';

      if (!user) {
        // because passport multiplexes this callback for both success and failure
        challenge = info;
        info = null;
      }

      if (err) {
        params.status_code = status;
        params.error = err.message;
        params.error_description = err.message;
      }

      if (!user) {
        res.redirect(req.url + querystring.stringify(params));
        return;
      } else {
        // NOTE: refreshToken must *not* go to the browser
        params.access_token = info.accessToken;
        params.expires_at = info.expiresAt;
        params.app_scoped_id = info.appScopedId;
        params.granted_scopes = info.grantedScopes;
      }

      req.login({
        profile: user
      , accessToken: info.accessToken
      , refreshToken: info.refreshToken
      , expiresAt: info.expiresAt
      }, function (err) {
        params.error = err.message;
        params.error_description = err.message;
        res.redirect(req.url + querystring.stringify(params));
      });
    })(req, res, next);
  });
};
