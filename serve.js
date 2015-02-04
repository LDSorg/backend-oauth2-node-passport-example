#!/usr/bin/env node
'use strict';

var https = require('https')
  //, http = require('http')
  , port = process.argv[2] || 8043
  , fs = require('fs')
  , path = require('path')
  , checkip = require('check-ip-address')
  , server
  //, insecureServer
  , options
  , certsPath = path.join(__dirname, 'certs', 'server')
  , caCertsPath = path.join(__dirname, 'certs', 'ca')
  , publicDir = process.argv[3] 
  ;

//require('ssl-root-cas').inject();

if (!publicDir) {
  publicDir = path.join(__dirname, 'public');
}
else if ('/' !== publicDir[0]) {
  publicDir = path.join('.', publicDir);
}

options = {
  key: fs.readFileSync(path.join(certsPath, 'my-server.key.pem'))
, cert: fs.readFileSync(path.join(certsPath, 'my-server.crt.pem'))
// Recent version of node.js / io.js already have this intermediate in the bundled chain
// adding it again would cause a failure.
// See https://github.com/LDSorg/passport-lds-connect-example/issues/3
, ca: [
    fs.readFileSync(path.join(caCertsPath, 'intermediate.crt.pem'))
  ]
, requestCert: false
, rejectUnauthorized: false
};

server = https.createServer(options);
//insecureServer = http.createServer();
checkip.getExternalIp().then(function (ip) {
  function listen(app) {
    server.on('request', app);
    server.listen(port, function () {
      port = server.address().port;
      console.log('Listening on https://127.0.0.1:' + port);
      console.log('Listening on https://local.ldsconnect.org:' + port);
      if (ip) {
        console.log('Listening on https://' + ip + ':' + port);
      }
    });
  }

  var host = ip || 'local.ldsconnect.org'
    , app = require('./app')
        .create(server, host, port, publicDir)
    ;

  listen(app);
});
