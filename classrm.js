#!/usr/bin/env node
var fs = require('fs'),
    path = require('path'),
    http = require('http'),
    amulet = require('amulet'),
    wrappers = require('wrappers'),
    schema = require('./schema'),
    Submission = schema.Submission,
    argv = require('optimist').argv,
    host = argv.host || '127.0.0.1',
    port = argv.port || 4505;

amulet.set({minify: true, root: path.join(__dirname, 'templates')});

// var datetime_format = 'mmmm d, yyyy, h:MM TT';

http.createServer(function(req, res) {
  var m;
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
  else if (req.url.match(/\/update\/[a-f0-9]{24}$/)) {
    m = req.url.match(/\/update\/([a-f0-9]{24})$/);
    Submission.findById(m[1], function(err, submission) {
      wrappers.http.waitUntilComplete(req, function() {
        var payload = JSON.parse(req.data);
        // console.log('payload', payload);
        submission.text = payload.text;
        submission.annotations = payload.annotations;
        submission.save(function(err) {
          var result = {success: true, message: 'Saved!' };
          if (err)
            result = {success: false, message: 'Error: ' + err.toString() };
          res.writeHead(200, {"Content-Type": "application/json"});
          res.end(JSON.stringify(result));
        });
      });
    });
  }
  else if (req.url.match(/\/[a-f0-9]{24}$/)) {
    m = req.url.match(/\/([a-f0-9]{24})$/);
    Submission.findById(m[1], function(err, submission) {
      res.writeHead(200, {"Content-Type": "text/html"});
      amulet.render(res, ['layout.mu', 'show.mu'], {submission: submission});
    });
  }
}).listen(port, host, function() {
  console.log(__filename + ' server running on ' + host + ':' + port);
});
