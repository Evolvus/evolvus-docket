const _ = require('lodash');
var passwordValidator = require('password-validator');
var validator = require("validator");

var passwordVal = new passwordValidator();
var usernameVal = new passwordValidator();
passwordVal
  .is()
  .is().min(5)
  .is().max(20)
  .has().uppercase()
  .has().lowercase()
  .has().digits()
  .has().not().spaces();

usernameVal
  .is()
  .is().min(5)
  .is().max(20)
  .has().lowercase()
  .has().not().digits()
  .has().not().spaces();

module.exports = {
  _,
  passwordVal,
  usernameVal,
  validator
}