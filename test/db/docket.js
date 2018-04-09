const debug = require("debug")("evolvus-docket.test.db.docket");
const mongoose = require("mongoose");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const expect = chai.expect;
const docket = require("../../db/docket");
//const userSchema = require("../../db/userSchema");

var MONGO_DB_URL = process.env.MONGO_DB_URL || "mongodb://localhost/TestDocket";

chai.use(chaiAsPromised);

// High level wrapper
// Testing db/docket.js
describe('db Docket testing', () => {
  let testDocket = {
    name: 'EVENT',
    application: 'platform',
    source: 'application',
    ipAddress: "193.168.11.115",
    level: "info",
    createdBy: "Kavya",
    status: "success",
    details: "User Kavya logged into the application Platform",
    eventDateTime: Date.now(),
    keyDataAsJSON: "keydata"
  };

  /*
   ** Before doing any tests, first get the connection.
   */
  before((done) => {
    mongoose.connect(MONGO_DB_URL);
    let connection = mongoose.connection;
    connection.once("open", () => {
      debug("ok got the connection");
      done();
    });
  });

  describe('testing docket.save', () => {
    // Testing save
    // 1. Valid docket object should be saved.
    // 2. invalid docket object should not be saved.
    beforeEach((done) => {
      docket.deleteAll()
        .then(() => {
          docket.save(testDocket).then(() => {
            done();
          });
        });
    });

    it('should save a docket object to database', (done) => {
      let res = docket.save(testDocket);
      expect(res)
        .to.eventually.have.property('name')
        .to.equal(testDocket.name)
        .notify(done);
    });

    it('should save a docket object to database', (done) => {
      let testDocket = {
        name: 'Event',
        application: 'platform',
        source: 'application'
      };
      let res = docket.save(testDocket);
      expect(res)
        .to.eventually.rejectedWith('Docket validation failed')
        .notify(done);
    });

  });

});