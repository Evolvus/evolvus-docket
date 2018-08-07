const mongoose = require('mongoose');
var validate = require('mongoose-validator');

var Validator = [
  validate({
    validator: 'isAlphanumeric',
    passIfEmpty: true,
    message: 'Path {PATH} should contain alpha-numeric characters only',
  })
];

var docketSchema = new mongoose.Schema({

  name: {
    type: String,
    min: 5,
    max: 35,
    required: true
  },
  eventCode: {
    type: String
  },
  application: {
    type: String,
    minlength: 3,
    maxlength: 20
  },
  source: {
    type: String,
    required: true,
    min: 3,
    max: 50,
    validate: Validator
  },
  ipAddress: {
    type: String,
    required: true
  },
  level: {
    type: String
  },
  status: {
    type: String,
    required: true,
    enum: ["SUCCESS", "FAILURE", "PENDING"]
  },
  eventDateTime: {
    type: Date,
    required: true
  },
  details: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 250
  },
  keyDataAsJSON: {
    type: String,
    required: true
  },
  createdBy: {
    type: String,
    required: true
  },
  keywords: {
    type: String
  }
});


module.exports = docketSchema;