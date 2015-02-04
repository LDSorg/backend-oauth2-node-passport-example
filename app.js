'use strict';

var express = require('express')
  , Passport = require('passport').Passport
  , passport = new Passport()
  //, path = require('path')
  , LdsConnectStrategy = require('passport-lds-connect').Strategy
  //, logger = require('morgan')
  , session = require('express-session')
  , bodyParser = require("body-parser")
  , cookieParser = require("cookie-parser")
  , methodOverride = require('method-override')
  , fbStrategy = require('./lib/facebook-connect')
  //, PromiseA = require('bluebird').Promise
  ;

function create(server, host, port, publicDir) {
  var memdb = []
    , ldsConnectProxy
    ;

  var LDS_CONNECT_ID = "55c7-test-bd03";
  var LDS_CONNECT_SECRET = "6b2fc4f5-test-8126-64e0-b9aa0ce9a50d";
  var APP_BASE_URL = "https://" + host + ":" + port;

  function getAccessTokenFromSession(req) {
    // flavor to the way you handle sessions in your app
    return req.user && req.user.accessToken;
  }
  function getUserIdFromSession(req) {
    return req.user && req.user.profile && req.user.profile.id;
  }
  ldsConnectProxy = require('lds-connect-proxy')
    .create(getAccessTokenFromSession, getUserIdFromSession);


  // Passport session setup.
  //   To support persistent login sessions, Passport needs to be able to
  //   serialize users into and deserialize users out of the session.  Typically,
  //   this will be as simple as storing the user ID when serializing, and finding
  //   the user by ID when deserializing.  For simplicity of this example, the
  //   `memdb` array is used instead of a database of user records.
  passport.serializeUser(function (user, done) {
    var id = memdb.length;
    memdb.push(user);
    done(null, { id: id });
  });

  passport.deserializeUser(function (obj, done) {
    var user = memdb[obj.id];
    done(null, user);
  });


  // Use the LdsConnectStrategy within Passport.
  //   Strategies in Passport require a `verify` function, which accept
  //   credentials (in this case, an accessToken, refreshToken, and LdsConnect
  //   profile), and invoke a callback with a user object.
  passport.use('lds-strategy-1', new LdsConnectStrategy({
      clientID: LDS_CONNECT_ID
    , clientSecret: LDS_CONNECT_SECRET
    , callbackURL: APP_BASE_URL + "/auth/ldsconnect/callback"
    , profileUrl: '/api/ldsconnect/me'
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


  var app = express();

  // configure Express
  //app.set('views', __dirname + '/views');
  //app.set('view engine', 'jade');
  //app.use(logger());
  app.use(cookieParser());
  app.use(bodyParser.json({ limit: 10 * 1024 * 1024 }));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(methodOverride());
  app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));
  // Initialize Passport!  Also use passport.session() middleware, to support
  // persistent login sessions (recommended).
  app.use(passport.initialize());
  app.use(passport.session());

  /*
  app.get('/', function (req, res) {
    res.render('index', { user: req.user && req.user.profile });
  });
  */

  // Simple route middleware to ensure user is authenticated.
  //   Use this route middleware on any resource that needs to be protected.  If
  //   the request is authenticated (typically via a persistent login session),
  //   the request will proceed.  Otherwise, the user will be redirected to the
  //   login page.
  function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.send({ error: { message: "no session. please login" } });
  }
  app.get('/account.json', ensureAuthenticated, function (req, res) {
    res.send({ user: req.user && req.user.profile });
  });

  // GET /auth/ldsconnect
  //   Use passport.authenticate() as route middleware to authenticate the
  //   request.  The first step in LdsConnect authentication will involve
  //   redirecting the user to ldsconnect.com.  After authorization, LdsConnect will
  //   redirect the user back to this application at /auth/ldsconnect/callback
  app.get('/auth/ldsconnect',
    passport.authenticate('lds-strategy-1', { scope: ['ward.adults:name,photo:::'] }),
    function (req, res) {
      // The request will be redirected to LdsConnect for authentication,
      // so this function will not be called.
      res.end("[Error] this would never get called");
    });

  // GET /auth/ldsconnect/callback
  //   Use passport.authenticate() as route middleware to authenticate the
  //   request.  If authentication fails, the user will be redirected back to the
  //   login page.  Otherwise, the primary route function function will be called,
  //   which, in this example, will redirect the user to the home page.
  app.get('/auth/ldsconnect/callback', 
    passport.authenticate('lds-strategy-1'/*, { failureRedirect: '/login' }*/),
    function (req, res, next) {
      req.url = '/oauth-close.html';
      next();
      //res.redirect('/');
    });

  app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
  });

  fbStrategy.create(app, passport, {
    id: '1592518370979179'
  , secret: 'dd067af5becc203524507dba86eb3020'
  , url: APP_BASE_URL
  });

  //
  // the proxy must come *after* the authentication
  //
  ldsConnectProxy(app);

  app.use(express.static(publicDir));

  //return PromiseA.resolve(app);
  return app;
}

exports.create = create;
