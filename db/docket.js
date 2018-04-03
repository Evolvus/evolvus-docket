const mongoose = require('mongoose');
const docketCollection = require('./docketSchema');

mongoose.Promise = global.Promise;
var ObjectId = require('mongodb')
  .ObjectID;

var dbUrl = process.env.MONGO_DB_URL || 'mongodb://localhost:27017/Docket';

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
