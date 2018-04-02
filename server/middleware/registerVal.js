const {
  _,
  passwordVal,
  usernameVal,
  validator
} = require('../utils/util');
var {
  User
} = require('../user');
var message;

var regValidation = (req, res, next) => {
  var reg = _.pick(req.body, ['email', 'username', 'password']);
  if (!(validator.isEmpty(reg.email.trim()) || validator.isEmpty(reg.password.trim()) || validator.isEmpty(reg.username.trim()))) {
    if (!(usernameVal.validate(reg.username))) {
      message = "Please enter a valid username of length 5-20 characters in Lowercase";
    } else if (!(passwordVal.validate(reg.password))) {
      message = "Password should have min length of 5 and max of 8, must have one uppercase,one lowercase,one digit and should not have spaces";
    } else if (!(validator.isEmail(reg.email) || validator.isEmpty(reg.email))) {
      message = "Valid email is required";
    } else {
      message = 'Valid';
    }
  } else {
    message = "All the fields are mandatory";
  }
  if (message !== 'Valid') {
    res.status(400).render('pages/register', {
      message: message
    });
  } else {
    next();
  }
}

var isEmailUnique = (req, res, next) => {
  User.findOne({
    email: req.body.email
  }).then((user) => {
    if (user !== null) {
      message = "Email is already in use";
    }
    if (message !== 'Valid') {
      res.status(400).render('pages/register', {
        message: message
      });
    } else {
      next();
    }
  });
}

var isNameUnique = (req, res, next) => {
  User.findOne({
    username: req.body.username
  }).then((user) => {
    if (user !== null) {
      message = "Username is already in use";
    }
    if (message !== 'Valid') {
      res.status(400).render('pages/register', {
        message: message
      });
    } else {
      next();
    }
  });
}

module.exports = {
  regValidation,
  isEmailUnique,
  isNameUnique
};