var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/classrm');
var SubmissionSchema = new mongoose.Schema({
  text: { type: String, default: ''},
  annotations: [{
    start: Number,
    end: Number,
    color: String,
    text: String,
    tag: String
  }],
  created: { type: Date, default: Date.now }
});

var Submission = mongoose.model('submission', SubmissionSchema);

exports.Submission = Submission;