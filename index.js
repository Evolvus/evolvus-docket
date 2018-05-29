const docketSchema = require("./model/docketSchema").schema;
const docket = require("./db/docket");
const validate = require("jsonschema")
  .validate;

module.exports.validate = (docket) => {
  return new Promise((resolve, reject) => {
    try {
      var res = validate(docket, docketSchema);
      if(res.valid){
        resolve(res.valid);
      } else {
        reject(res.errors);
      }
    } catch (err) {
      reject(err);
    }
  });
};

module.exports.save = (docketObject) => {
  return new Promise((resolve, reject) => {
    try {
      docket.save(docketObject).then((result) => {
        resolve(result);
      }).catch((e) => {
        reject(e);
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports.getAll = () => {
  return new Promise((resolve, reject) => {
    try {
      docket.findAll().then((docs) => {
        resolve(docs);
      }).catch((e) => {
        reject(e);
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports.getById = (id) => {
  return new Promise((resolve, reject) => {
    try {
      if (typeof(id) == "undefined" || id == null) {
        throw new Error("IllegalArgumentException: id is null or undefined");
      }
      docket.findById(id)
        .then((res) => {
          resolve(res);
        }).catch((e) => {
          reject(e);
        });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports.getByLimit = (limit) => {
  return new Promise((resolve, reject) => {
    try {
      if (limit === 0 || limit < 0) {
        throw new Error("IllegalArgumentException:limit value cannot be negative/zero ");
      }
      if (isNaN(limit)) {
        throw new Error("MongoError:Failed to parse,'limit' field must be numeric.");
      }
      docket.findByLimit(limit).then((docs) => {
        resolve(docs);
      }).catch((e) => {
        reject(e);
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports.getByParameters = (parameters) => {
  return new Promise((resolve, reject) => {
    try {
      if (typeof parameters.fromDate !== 'undefined' && typeof parameters.toDate !== 'undefined') {
        parameters = {
          $and: [{
              $and: [{
                application: parameters.application
              }, {
                source: parameters.source
              }, {
                ipAddress: parameters.ipAddress
              }, {
                createdBy: parameters.createdBy
              }, {
                level: parameters.level
              }, {
                status: parameters.status
              }]
            },
            {
              $and: [{
                eventDateTime: {
                  $gt: parameters.fromDate
                }
              }, {
                eventDateTime: {
                  $lt: parameters.toDate
                }
              }]
            }
          ]
        };
      }
      docket.findByParameters(parameters).then((docs) => {
        resolve(docs);
      }).catch((e) => {
        reject(e);
      });
    } catch (e) {
      reject(e);
    }
  });
};
