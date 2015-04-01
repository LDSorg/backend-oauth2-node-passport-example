'use strict';

module.exports.create = function (app, passport, conf) {
  var PromiseA = require('bluebird').Promise;

  var OAuth3Strategy = require('passport-oauth3').Strategy;
  // These strings are arbitrary
  var authorizationRedirect = "/api/oauth3/authorization_redirect";
  var authorizationCodeCallback = "/api/oauth3/authorization_code_callback";
  var accessTokenCallback = "/api/oauth3/access_token_callback";

  // Note that "App", "Client", and "Consumer" are different names for the same thing
  // One site's docs will say "App ID" another will say "Consumer Public Key", etc - but they're the same.
  //
  // For sites that don't support OAuth3 automatic registration
  // you can provide the pre-registered OAuth2 client id and secret here
  var providerConfig = {
    'ldsconnect.org': {
      id: conf.id
    , secret: conf.secret
    }
  };

  //
  // Example for getting and setting registration information
  // (OAuth3 can automatically register app id / app secret)
  //
  function stripLeadingProtocolAndTrailingSlash(uri) {
    return uri.replace(/^(https?:\/\/)?(www\.)?/, '').replace(/\/$/, '');
  }

  //
  // Automatic Registration
  //
  // For services that support automatic registration, 
  // tell the service your security policy.
  //
  // DRAFT (this is not yet spec'd)
  function getRegistrationOptions(/*providerUri*/) {
    return {
      allowed_domains: [ "https://awesome.com", "https://partner-site.com" ]
    , allowed_ips: [ "10.0.0.0/24", "10.100.100.100" ]
    , allowed_redirects: [ "https://awesome.com/oauth3.html", "https://api.awesome.com/oauth3/" ]
    };
  }

  function getRegistrationValues(providerUri) {
    var key = stripLeadingProtocolAndTrailingSlash(providerUri);

    return PromiseA.resolve(providerConfig[key]);
  }

  function setRegistrationValues(providerUri, registration) {
    // registration is not yet implemented
    var key = stripLeadingProtocolAndTrailingSlash(providerUri);

    providerConfig[key] = registration;

    return PromiseA.resolve();
  }

  //
  // This will be used by passport to set `req.user`
  //
  function getUserFromToken(req, providerUri, info/*, params*/) {
    // info = { accessToken, refreshToken, appScopedId, grantedScopes, profile }
    return PromiseA.resolve({ user: info.profile, info: info });
  }

  // Note that you don't need to provide any urls or client ids
  // You don't need separate routes for different providers either
  passport.use('oauth3-strategy-1', new OAuth3Strategy({
    providerCallback: getRegistrationValues 
  , registrationCallback: setRegistrationValues
  , securityCallback: getRegistrationOptions
  , authorizationCodeCallbackUrl: conf.url + authorizationCodeCallback 
  , accessTokenCallbackUrl: conf.url + accessTokenCallback 
  }
  , getUserFromToken
  ));

  app.get(authorizationRedirect, passport.authenticate('oauth3-strategy-1'));

  app.get(authorizationCodeCallback, passport.authenticate('oauth3-strategy-1'));

  // This looks a little convoluted only because passport doesn't have a method
  // for passing some of the necessary parameters back to the caller and there's
  // no way to wrap it inside of OAuth3Strategy#authenticate
  function handleOauth3Response(req, res, next, err, user, info/*, status*/) {
    // info = { accessToken, refreshToken, grantedScopes, appScopedId, profile }
    // req.query = { provider_uri, code, state }
    // user = { ... } // profile

    var params = { 'provider_uri': req.query.provider_uri };

    if (err) {
      params.error = err.message;
      params.error_description = err.message;
    }

    if (!user) {
      return PromiseA.reject(params);
    }

    return new PromiseA(function (resolve, reject) {
      req.login({ profile: user, info: info }, function (err) {
        if (err) {
          params.error = err.message;
          params.error_description = err.message;
          reject(params);
          return;
        }

        // NOTE: refreshToken does *not* go to the browser
        params.access_token = info.accessToken;
        params.expires_at = info.expiresAt;
        params.app_scoped_id = info.appScopedId;
        params.granted_scopes = info.grantedScopes;

        resolve(params);
      });
    });
  }

  app.get(accessTokenCallback, function (req, res, next) {
    passport.authenticate('oauth3-strategy-1', function (err, user, info, status) {
      var querystring = require('querystring');

      handleOauth3Response(req, res, next, err, user, info, status).then(function (params) {
        res.redirect('/oauth-close.html?' + querystring.stringify(params));
      }, function (err) {
        var params;
        if (err.error_description) {
          params = err;
          res.redirect('/oauth-close.html?' + querystring.stringify(params));
        } else {
          res.end("Error: " + err.message);
        }
      });
    })(req, res, next);
  });
};
