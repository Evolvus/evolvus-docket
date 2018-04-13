const mongoose = require('mongoose');
var validate = require('mongoose-validator');

var Validator = [
  validate({
    validator: 'isLength',
    arguments: [3, 50],
    message: 'Path {PATH} should be between {ARGS[0]} and {ARGS[1]} characters',
  }),
  validate({
    validator: 'isAlphanumeric',
    passIfEmpty: true,
    message: 'Path {PATH} should contain alpha-numeric characters only',
  }),
];

var docketSchema = new mongoose.Schema({
  createdBy: {
    type: String,
    required: true,
    validate: Validator
  },
  name: {
    type: String,
    required: true,
    validate: Validator
  },
  application: {
    type: String,
    required: true,
    validate: Validator
  },
  source: {
    type: String,
    required: true,
    validate: Validator
  },
  ipAddress: {
    type: String,
    required: true
  },
  level: {
    type: String,
    required: false
  },
  status: {
    type: String,
    required: true,
    enum: ["SUCCESS", "FAILURE", "success", "failure"]
  },
  eventDateTime: {
    type: String,
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
  keywords: {
    type: String,
    required: false
  }
});


module.exports = docketSchema;