var {
  User
} = require('./user');
const _ = require('lodash');
var {
  Docket
} = require('./dockerSchema.js');
var moment = require('moment');

var postDocket = (req, res) => {
  var body = _.pick(req.body, ['name', 'createdBy', 'application', 'source', 'ipAddress', 'level',
    'createdBy', 'status', 'eventDateTime', 'details', 'keywords'
  ]);
  body.eventDateTime = new Date().getTime();
  const date1 = moment(body.fromDate, 'DD-MM-YYYY').toDate();
  body.fromDate = date1;
  const date2 = moment(body.toDate, 'DD-MM-YYYY').toDate();
  body.toDate = date2;
  var dockeruser = new Docket(body);
  dockeruser.save().then(() => {
    res.send(`${dockeruser.name} "User session created for user " ${dockeruser.createdBy} at ${dockeruser.eventDateTime}`);
  }).catch((e) => {
    res.status(400).send(e);
  });
}
module.exports = postDocket;