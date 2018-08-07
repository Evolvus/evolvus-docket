const debug = require("debug")("evolvus-docket:index");
const _ = require("lodash");
const model = require("./model/docketSchema");
const dbSchema = require("./db/docketSchema");
// const docket = require("./db/docket");
const Dao = require("@evolvus/evolvus-mongo-dao").Dao;
const collection = new Dao("audit", dbSchema);

const validate = require("jsonschema")
  .validate;

var filterAttributes = model.filterAttributes;
var sortAttributes = model.sortableAttributes;

module.exports = {
  model,
  dbSchema,
  filterAttributes,
  sortAttributes
};


module.exports.validate = (docket) => {
  return new Promise((resolve, reject) => {
    try {
      debug(`Input object is ${JSON.stringify(docket)}`);
      var res = validate(docket, model.schema);
      if (res.valid) {
        debug(`Validation against JSON schema: Successfull`);
        resolve(res.valid);
      } else {
        debug(`Validation against JSON schema: Validation failed due to: ${JSON.stringify(res.errors)}`);
        reject(res.errors);
      }
    } catch (err) {
      debug(`Try-catch failed due to: ${e}`);
      reject(err);
    }
  });
};


module.exports.save = (docketObject) => {
  return new Promise((resolve, reject) => {
    try {
      debug(`Input docket object: ${JSON.stringify(docketObject)}`);
      if (docketObject == null) {
        throw new Error(`IllegalArgumentException: docketObject is ${docketObject}`);
      }
      let res = validate(docketObject, model.schema);
      debug(`Validation against JSON schema:result:${JSON.stringify(res)}`);
      if (res.errors.length != 0) {
        reject(res.errors);
      } else {
        docketObject.status = docketObject.status.toUpperCase();
        collection.save(docketObject).then((result) => {
          debug(`Audit saved successfully: ${result}`);
          resolve(result);
        }).catch((e) => {
          debug(`collection.save promise failed: ${e}`);
          reject(e);
        });
      }
    } catch (e) {
      debug(`Try-catch failed: ${e}`);
      reject(e);
    }
  });
};

module.exports.find = (filter, orderby, skipCount, limit) => {
  return new Promise((resolve, reject) => {
    try {
      let filterObject = _.pick(filter, filterAttributes);
      if (filter.fromDate != null && filter.toDate != null) {
        filterObject = {
          $and: [{
              $and: [filterObject]
            },
            {
              $and: [{
                eventDateTime: {
                  $gte: filter.fromDate
                }
              }, {
                eventDateTime: {
                  $lte: filter.toDate
                }
              }]
            }
          ]
        };
      }
      debug(`FilterObject is: ${JSON.stringify(filterObject)}`);
      collection.find(filterObject, orderby, skipCount, limit).then((audits) => {
        debug(`Audits stored in database are: ${audits.length}`);
        resolve(audits);
      }).catch((e) => {
        debug(`Collection.find promise failed: ${e}`);
        reject(e);
      });
    } catch (e) {
      debug(`Try-catch failed: ${e}`);
      reject(e);
    }
  });
};