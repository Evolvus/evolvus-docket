var {
  User
} = require('./../user.js');

var loginauth = (req, res, next) => {
  var token = req.header('x-auth');
  User.findByToken(token).then((user) => {
    if (!user || (user.tokens[0].token === token)) {
      return Promise.reject();
    }
    next();
  }).catch((e) => {
    res.status(401).send();
  });
}

module.exports = {
  loginauth
};