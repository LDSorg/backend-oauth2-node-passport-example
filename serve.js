#!/usr/bin/env node
'use strict';

var https = require('https')
  , port = process.argv[2] || 8043
  , fs = require('fs')
  , path = require('path')
  , checkip = require('check-ip-address')
  , server
  , options
  , certsPath = path.join(__dirname, 'certs', 'server')
  , caCertsPath = path.join(__dirname, 'certs', 'ca')
  , publicDir = process.argv[3] || (__dirname + '/public')
  ;

publicDir = path.join('.', publicDir);

options = {
  key: fs.readFileSync(path.join(certsPath, 'my-server.key.pem'))
, ca: [
    fs.readFileSync(path.join(caCertsPath, 'intermediate.crt.pem'))
  ]
, cert: fs.readFileSync(path.join(certsPath, 'my-server.crt.pem'))
, requestCert: false
, rejectUnauthorized: true
};

server = https.createServer(options);
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
