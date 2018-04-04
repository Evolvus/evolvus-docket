const {
  ObjectID
} = require('mongodb');

var {
  docketCollection
} = require('../docketModel/docketSchema');

var docketOneId = new ObjectID();
var docketTwoId = new ObjectID();

const dockets = [{
  _id: '5ab4e8135267c811eff704f6',
  name: 'Login Event',
  createdBy: 'Navya',
  application: 'platform',
  source: 'security',
  details: 'some details',
  ipAddress: '121.34.33.222',
  status: 'success',
  eventDateTime: Date.now()
}, {
  _id: '5ab4e8135267c811eff704f7',
  name: 'session Event',
  createdBy: 'kavya',
  application: 'platform',
  source: 'application',
  details: 'some details',
  ipAddress: '121.34.33.222',
  status: 'success',
  eventDateTime: Date.now()
}];

const populateDocket = (done) => {
  docketCollection.remove({}).then(() => {
    var docket1 = new docketCollection(dockets[0]).save();
    var docket2 = new docketCollection(dockets[1]).save();
    return Promise.all([docket1, docket2]);
  }).then(() => {
    done();
  });
};

module.exports = {
  dockets,
  populateDocket
};