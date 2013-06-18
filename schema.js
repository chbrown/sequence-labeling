'use strict'; /*jslint node: true, es5: true, indent: 2 */
var mongoose = require('mongoose');
var db = mongoose.createConnection('localhost', 'classrm');

var SubmissionSchema = new mongoose.Schema({
  text: { 'type': String, 'default': ''},
  annotations: [{
    start: Number,
    end: Number,
    color: String,
    text: String,
    tag: String
  }],
  created: { 'type': Date, 'default': Date.now }
});

var Submission = exports.Submission = db.model('submission', SubmissionSchema);
