const {
  _,
  passwordVal,
  usernameVal,
  validator
} = require('../utils/util');

var logValidation = (req, res, next) => {
  var message;
  if (!(passwordVal.validate(req.body.password))) {
    message = "Password should have min length of 5 and max of 8, must have one uppercase,one lowercase,one digit and should not have spaces";
  } else if (!(validator.isEmail(req.body.email) || validator.isEmpty(req.body.email))) {
    message = "Valid email is required";
  } else {
    message = "Valid"
  }
  if (message !== 'Valid') {
    res.status(400).render('pages/single', {
      message: message
    });
  } else {
    next();
  }
}

module.exports = logValidation;