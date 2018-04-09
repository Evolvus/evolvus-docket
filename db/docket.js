const debug = require("debug")("evolvus-docket:db:docket");
const mongoose = require("mongoose");
const ObjectId = require('mongodb')
  .ObjectID;

const docketSchema = require("./docketSchema");

//Creates docket Collection in the database
var Docket = mongoose.model("Docket", docketSchema);

/*
 ** Saves the object to the database and returns a Promise
 */
module.exports.save = (docket) => {
  return new Promise((resolve, reject) => {
    try {
      let docketobj = new Docket(docket);

      docketobj.save().then((res) => {
          debug('saved successfully', res._id);
          resolve(res);
        }, (err) => {
          debug(`failed to save with an error ${err}`);
          reject(err);
        })
        .catch((e) => {
          debug('exception on save', err);
          reject(e);
        });
    } catch (e) {
      debug(`caught exception: ${e}`);
      reject(e);
    }
  });
};

/*
 ** Returns all the documents
 */
module.exports.find = () => {
  return Docket.find();
};

/*
 ** Returns the documents based on sort parameter
 */
module.exports.findBySort = (sortvalue) => {
  return Docket.find().sort(sortvalue);
};

/*
 ** Returns the documents based on limit parameter
 */
module.exports.findByLimit = (limit) => {
  return Docket.find().sort({
    eventDateTime: -1
  }).limit(limit);
};
/*
 ** Finds the object for the id parameter from the Docket
 ** Should return a promise
 */
module.exports.findById = (id) => {
  return Docket.findById({
    _id: ObjectId(id)
  });
};

module.exports.deleteAll = () => {
  return Docket.remove({});
};