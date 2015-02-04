'use strict';

var express = require('express')
  , Passport = require('passport').Passport
  , passport = new Passport()
  //, logger = require('morgan')
  , session = require('express-session')
  , bodyParser = require("body-parser")
  , cookieParser = require("cookie-parser")
  , methodOverride = require('method-override')
  , fbStrategy = require('./lib/facebook-connect')
  , ldsStrategy = require('./lib/lds-connect')
  //, PromiseA = require('bluebird').Promise
  ;

function create(server, host, port, publicDir) {
  var memdb = []
    ;

  var APP_BASE_URL = "https://" + host + ":" + port;

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
  // how you would render to jade/ejs if you needed to... but you won't
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

  app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
  });

  fbStrategy.create(app, passport, {
    id: '1592518370979179'
  , secret: 'dd067af5becc203524507dba86eb3020'
  , url: APP_BASE_URL
  });

  ldsStrategy.create(app, passport, {
    id: "55c7-test-bd03"
  , secret: "6b2fc4f5-test-8126-64e0-b9aa0ce9a50d"
  , url: APP_BASE_URL
  });

  app.use(express.static(publicDir));

  //return PromiseA.resolve(app);
  return app;
}

exports.create = create;
