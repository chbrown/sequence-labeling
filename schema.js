var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/classrm');
var SubmissionSchema = new mongoose.Schema({
  text: String,
  annotations: [{
    start: Number,
    end: Number,
    color: String,
    text: String
  }],
  created: Date
});

var Submission = mongoose.model('submission', SubmissionSchema);

exports.Submission = Submission;