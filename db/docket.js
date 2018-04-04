const mongoose = require('mongoose');
var {
  docketCollection
} = require('../docketModel/docketSchema');

mongoose.Promise = global.Promise;
var ObjectId = require('mongodb')
  .ObjectID;

var dbUrl = process.env.MONGO_DB_URL || 'mongodb://localhost:27017/TestDocket';

mongoose.connect(dbUrl, (err, db) => {
  if (err) {
    console.log('Failed to connect to the database');
  } else {
    console.log('connected to mongodb');
  }
});

/*
 ** Saves the object to the database and returns a Promise
 */
module.exports.save = (docket) => {
  var docketobj = new docketCollection(docket);
  return docketobj.save();
}

/*
 ** Returns all the documents
 */
module.exports.find = () => {
  return docketCollection.find();
}

/*
 ** Returns the documents based on sort parameter
 */
module.exports.findBySort = (sortvalue) => {
  return docketCollection.find().sort(sortvalue);
}

/*
 ** Returns the documents based on limit parameter
 */
module.exports.findByLimit = (limit) => {
  return docketCollection.find().sort({
    eventDateTime: -1
  }).limit(limit);
}

/*
 ** Finds the object for the id parameter from the docketCollection
 ** Should return a promise
 */
module.exports.findById = (id) => {
  return docketCollection.findById({
    _id: ObjectId(id)
  });
}

module.exports.remove = () => {
  return docketCollection.remove({});
}