const {
  ObjectID
} = require('mongodb');
var {
  User
} = require('../server/user');
var {
  Docket
} = require('../server/dockerSchema');
const jwt = require('jsonwebtoken')


var userOneId = new ObjectID();
var userTwoId = new ObjectID();
const users = [{
  _id: userOneId,
  username: "kavya",
  email: "kavya@gmail.com",
  password: "*Evolvus5",
  tokens: [{
    access: 'auth',
    token: jwt.sign({
      _id: userOneId,
      access: 'auth'
    }, 'abc123').toString()
  }]
}, {
  _id: userTwoId,
  username: "navya",
  email: "navya@gmail.com",
  password: "*Evolvus5"
}]


const populateUsers = (done) => {
  User.remove({}).then(() => {
    var userOne = new User(users[0]).save();
    var userTwo = new User(users[1]).save();
    return Promise.all([userOne, userTwo]);
  }).then(() => done());
};


const dockets = [{
  _id: '5ab4e8135267c811eff704f6',
  name: 'Login Event',
  createdBy: 'kavya',
  application: 'platform',
  source: 'security',
  details: 'some details',
  ipAddress: '121.34.33.222',
  status: 'success'
}, {
  _id: '5ab4e8135267c811eff704f7',
  name: 'session Event',
  createdBy: 'kavya',
  application: 'platform',
  source: 'application',
  details: 'some details',
  ipAddress: '121.34.33.222',
  status: 'success'
}];

const populateDocket = (done) => {
  Docket.remove({}).then(() => {
    var docket1 = new Docket(dockets[0]).save();
    var docket2 = new Docket(dockets[1]).save();
    return Promise.all([docket1, docket2]);
  }).then(() => done());
};

module.exports = {
  users,
  populateUsers,
  dockets,
  populateDocket
};