'use strict'; /*jslint node: true, es5: true, indent: 2 */
var mongoose = require('mongoose');
var db = mongoose.createConnection('localhost', 'classrm');

var submissionSchema = new mongoose.Schema({
  text: { 'type': String, 'default': ''},
  created: { 'type': Date, 'default': Date.now },
  annotations: [{
    start: Number,
    end: Number,
    color: String,
    text: String,
    tag: String
  }],
});

exports.Submission = db.model('submission', submissionSchema);
