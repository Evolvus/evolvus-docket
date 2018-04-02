const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');
var uniqueValidator = require('mongoose-unique-validator');

var passwordValidator = require('password-validator');
var schema = new passwordValidator();
schema
  .is().min(8)
  .is().max(100)
  .has().uppercase()
  .has().lowercase()
  .has().digits()
  .has().not().spaces();

var UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
    validate: {
      validator: (value) => {
        return validator.isEmail(value);
      },
      message: '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator: (val) => {
        return schema.validate(val);
      },
      message: 'Password must contain atleast one uppercase,lowercase,digit and should not have spaces.'
    }
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
});
UserSchema.plugin(uniqueValidator);


UserSchema.methods.toJSON = function() {
  var user = this;
  var userObject = user.toObject();

  return _.pick(userObject, ['_id', 'email']);
};

UserSchema.methods.generateAuthToken = function() {
  var user = this;
  var access = 'auth';
  var token = jwt.sign({
    _id: user._id.toHexString(),
    access
  }, 'abc123').toString();
  if (user.tokens.length == 0 || user.tokens.length == 1) {
    user.tokens.push({
      access,
      token
    });
  } else {
    user.tokens[1].token = token;
    user.tokens[1].access = access;
  }
  return user.save().then(() => {
    return token;
  });
};

UserSchema.methods.removeToken = function(token) {
  var user = this;
  return user.update({
    $pull: {
      tokens: {
        token
      }
    }
  });
};

UserSchema.statics.findByToken = function(token) {
  var User = this;
  var decoded;
  try {
    decoded = jwt.verify(token, 'abc123');
  } catch (e) {
    // return new Promise((resolve,reject)=> {
    //   reject();
    // });
    return Promise.reject();
  }
  return User.findOne({
    _id: decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });

};

UserSchema.statics.findByCredentials = function(email, password) {
  var User = this;
  return User.findOne({
    email
  }).then((user) => {
    if (!user) {
      return Promise.reject('Email doesnt exixts , Invalid User');
    }
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          resolve(user);
        } else {
          reject('Password Error');
        }
      });
    });
  });
};

UserSchema.pre('save', function(next) {
  var user = this;
  if (user.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

var User = mongoose.model('User', UserSchema);

module.exports = {
  User
};