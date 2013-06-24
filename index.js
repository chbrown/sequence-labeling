#!/usr/bin/env node
'use strict'; /*jslint node: true, es5: true, indent: 2 */
var fs = require('fs');
var path = require('path');
var http = require('http-enhanced');
var amulet = require('amulet');
var logger = require('winston');
var Router = require('regex-router');
var Submission = require('./models').Submission;
var argv = require('optimist').default({
  port: 4505,
  hostname: '127.0.0.1'
}).argv;

amulet.set({minify: true, root: path.join(__dirname, 'templates')});

function parseJSON(string, callback) {
  try {
    return callback(null, JSON.parse(string));
  }
  catch (exc) {
    return callback(exc);
  }
}


var R = new Router();

// GET /favicon.ico -> favicon deadend (for chrome inference)
R.get(/^\/favicon.ico/, function(m, req, res) {
  res.writeHead(404);
  res.end();
});

// POST /update/:submission_id -> update existing submission
R.post(/\/update\/([a-f0-9]{24})$/, function(m, req, res) {
  Submission.findById(m[1], function(err, submission) {
    req.readToEnd('utf8', function(err, string) {
      if (err) res.die(err.toString());
      parseJSON(string, function(err, attrs) {
        if (err) res.die(err.toString());
        submission.text = attrs.text;
        submission.annotations = attrs.annotations;
        submission.save(function(err) {
          if (err) res.die(err.toString());
          res.json({success: true, message: 'Saved!'});
        });
      });
    });
  });
});

// GET /:submission_id -> retrieve submission
R.get(/\/([a-f0-9]{24})$/, function(m, req, res) {
  Submission.findById(m[1], function(err, submission) {
    res.writeHead(200, {"Content-Type": "text/html"});
    amulet.stream(['layout.mu', 'show.mu'], {submission: submission}).pipe(res);
  });
});

// GET / -> create a new submission and redirect to its own page
R.default = function(m, req, res) {
  var blank = new Submission();
  blank.save(function(err) {
    if (err) logger.error(err);
    res.redirect('/' + blank._id);
  });
};

http.createServer(function(req, res) {
  var started = Date.now();
  res.on('finish', function() {
    logger.info('duration', {url: req.url, method: req.method, ms: Date.now() - started});
  });

  R.route(req, res);
}).listen(argv.port, argv.hostname, function() {
  logger.info('sequence-labeling server running at ' + argv.hostname + ':' + argv.port);
});
