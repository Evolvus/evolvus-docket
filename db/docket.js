const debug = require("debug")("evolvus-docket:db:docket");
const mongoose = require("mongoose");
const ObjectId = require('mongodb')
  .ObjectID;

const docketSchema = require("./docketSchema");

// Creates docket Collection in the database
var Docket = mongoose.model("Docket", docketSchema);


// Saves the docket object to the database and returns a Promise

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


// Returns all the documents in natural(inserted) order

module.exports.findAll = () => {
  return Docket.find({});
};


// Returns the documents based on sort parameter(non-natural order)

module.exports.findBySort = (sortvalue) => {
  return Docket.find().sort(sortvalue);
};

// Returns the documents in LIFO order based on limit parameter

module.exports.findByLimit = (limit) => {
  return Docket.find().sort({
    eventDateTime: -1
  }).limit(limit);
};

// Finds the docket object for the id parameter from the Docket collection
// If there is no object matching the id, return empty object i.e. {}
// Should return a Promise

module.exports.findById = (id) => {
  return new Promise((resolve, reject) => {
    try {
      Docket.findById({
          _id: new ObjectId(id)
        })
        .then((res) => {
          debug("successfull: ", res);
          if (res) {
            resolve(res);
          } else {
            // return empty object in place of null
            resolve({});
          }
        }, (err) => {
          debug(`rejected finding docket object.. ${err}`);
          reject(err);
        })
        .catch((e) => {
          debug(`exception on finding docket object: ${e}`);
          reject(e);
        });
    } catch (e) {
      debug(`caught exception: ${e}`);
      reject(e);
    }
  });
};

// Deletes all the docket records
// To be used by test only
module.exports.deleteAll = () => {
  return Docket.remove({});
};