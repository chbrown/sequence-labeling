#!/usr/bin/env node
var __ = require('underscore')._,
    fs = require('fs'),
    path = require('path'),
    http = require('http'),
    Cookies = require('cookies'),
    redis = require('redis').createClient(),
    amulet = require('amulet'),
    wrappers = require('wrappers'),
    schema = require('./schema'),
    Submission = schema.Submission,
    argv = require('optimist').argv,
    host = argv.host || '127.0.0.1',
    port = argv.port || 4505;

amulet.set({minify: true, root: path.join(__dirname, 'templates')});

// Cookies.prototype.defaults = function() {
//   return {expires: new Date().addDays(31), httpOnly: false};
// };

// var datetime_format = 'mmmm d, yyyy, h:MM TT';

// render LESS so it doesn't have to in the browser
// convert.lessToCss('static/css/base.less', 'static/css/base.css');

http.createServer(function(req, res) {
  // req.cookies = new Cookies(req, res);
  req.data = '';
  req.on('data', function(chunk) { req.data += chunk; });

  console.log(req.url);
  if (req.url === '/') {
    var blank = new Submission({created: new Date()});
    blank.save(function(err) {
      res.writeHead(302, {Location: '/' + blank._id});
      res.end();
    });
  }
  else if (req.url.match(/\/[a-f0-9]{24}$/)) {
    var m = req.url.match(/\/([a-f0-9]{24})$/);
    Submission.findById(m[1], function(err, submission) {
      res.writeHead(200, {"Content-Type": "text/html"});
      amulet.render(res, ['layout.mu', 'show.mu']);
    });
  }
}).listen(port, host, function() {
  console.log(__filename + ' server running on ' + host + ':' + port);
});
