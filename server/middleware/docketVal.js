const _ = require('lodash');

var validateDocket = ((req, res, next) => {
  if (typeof req.body !== undefined) {
    var body = _.pick(req.body, ['name', 'createdBy', 'application', 'source', 'ipAddress', 'level',
      'status', 'eventDateTime', 'details', 'keywords'
    ]);
    if (typeof body.name === undefined || typeof body.createdBy === undefined || typeof body.application === undefined || typeof body.source === undefined || typeof body.ipAddress === undefined || typeof body.status === undefined || typeof body.details === undefined) {
      res.status(400).send("Provide All the mandatory inputs");
    } else {
      next();
    }
  } else {
    res.status(400).send("Request body is missing");
  }
});

module.exports = validateDocket;