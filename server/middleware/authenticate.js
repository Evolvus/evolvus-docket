var {
  User
} = require('./../user.js');
var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./scratch');

var authenticate = (req, res, next) => {
  var token = localStorage.getItem('token');
  User.findByToken(token).then((user) => {
    if (!user) {
      return Promise.reject();
    }
    req.user = user;
    req.token = token;
    next();
  }).catch((e) => {
    res.status(400).send();
  });
}

module.exports = {
  authenticate
};