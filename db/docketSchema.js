var mongoose = require('mongoose');
//var uniqueValidator = require('mongoose-unique-validator');
var validate = require('mongoose-validator');
var nameValidator = [
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
    validate: nameValidator
  },
  name: {
    type: String,
    required: true,
    validate: nameValidator
  },
  application: {
    type: String,
    required: true,
    validate: nameValidator
  },
  source: {
    type: String,
    required: true,
    validate: nameValidator
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
  keywords: {
    type: String,
    required: false
  }
});


module.exports = docketSchema;