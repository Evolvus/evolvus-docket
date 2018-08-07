const debug = require("debug")("evolvus-docket.test.db.docket");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");

/*
 ** chaiAsPromised is needed to test promises
 ** it adds the "eventually" property
 **
 ** chai and others do not support async / await
 */

const expect = chai.expect;
chai.use(chaiAsPromised);

const docket = require("../index");
const dbSchema = require("../db/docketSchema");
const testData = require("./docketTestData");

const Dao = require("@evolvus/evolvus-mongo-dao").Dao;
const collection = new Dao("audit", dbSchema);
const connection = require("@evolvus/evolvus-mongo-dao").connection;

describe('Docket validation', () => {
  // before we start the tests, connect to the database
  before((done) => {
    var dbConnection = connection.connect("DOCKET").then(() => {
      done();
    }).catch((e) => {
      done(e);
    });
  });

  describe("docket model validation", () => {
    it("valid audit record should validate successfully", (done) => {
      try {
        var res = docket.validate(testData.docketObject1);
        expect(res)
          .to.eventually.equal(true)
          .notify(done);
        // if notify is not done the test will fail
        // with timeout
      } catch (e) {
        expect.fail(e, null, `valid docket object should not throw exception: ${e}`);
      }
    });

    it("should return validation errors", (done) => {
      try {
        var res = docket.validate(testData.invalidObject);
        expect(res)
          .to.be.rejected
          .notify(done);
        // if notify is not done the test will fail
        // with timeout
      } catch (e) {
        expect.fail(e, null, `valid docket object should not throw exception: ${e}`);
      }
    });

  });

  describe("tesing save method", () => {

    beforeEach(function(done) {
      // this.timeout(10000);
      collection.deleteAll({})
        .then((data) => {

          done();
        });
    });

    it('should save a docket object to database', (done) => {
      try {
        var result = docket.save(testData.docketObject1);
        expect(result)
          .to.eventually.have.property('_id')
          .notify(done);
      } catch (e) {
        expect.fail(e, null, `saving docket object should not throw exception: ${e}`);
      }
    });

    it('should not save a invalid user object to database', (done) => {
      try {
        var result = docket.save(testData.invalidObject);
        expect(result)
          .to.be.rejected
          .notify(done);
      } catch (e) {
        expect.fail(e, null, `exception: ${e}`);
      }
    });

  });


  describe("tesing find method", () => {

    beforeEach(function(done) {
      // this.timeout(10000);
      collection.deleteAll({})
        .then((data) => {
          return collection.save(testData.docketObject1);
        }).then(() => {
          return collection.save(testData.docketObject2);
        }).then(() => {
          return collection.save(testData.docketObject3);
        }).then(() => {
          return collection.save(testData.docketObject4);
        }).then(() => {
          return collection.save(testData.docketObject5);
        }).then(() => {
          return collection.save(testData.docketObject6);
        }).then(() => {
          done();
        });
    });

    it('should return all records', (done) => {
      try {
        var result = docket.find({}, {}, 0, 0);
        expect(result)
          .to.eventually.have.lengthOf(6)
          .notify(done);
      } catch (e) {
        expect.fail(e, null, `find should not throw exception: ${e}`);
      }
    });

    it('should return only SANDSTORM application audit records', (done) => {
      try {
        var result = docket.find({
          application: "SANDSTORM_CONSOLE"
        }, {}, 0, 0);
        expect(result)
          .to.eventually.have.lengthOf(2)
          .notify(done);
      } catch (e) {
        expect.fail(e, null, `find should not throw exception: ${e}`);
      }
    });

    it('should return only FAILURE audit records', (done) => {
      try {
        var result = docket.find({
          status: "FAILURE"
        }, {}, 0, 0);
        expect(result)
          .to.eventually.have.lengthOf(2)
          .notify(done);
      } catch (e) {
        expect.fail(e, null, `find should not throw exception: ${e}`);
      }
    });

    //There are 4 records between eventDateTime 07/08/2018 to 09/08/2018
    it('should return only audit records between eventDateTime 07/08/2018 to 09/08/2018', (done) => {
      try {
        var result = docket.find({
          fromDate: "2018-08-07T09:26:07.990Z",
          toDate: "2018-08-09T09:26:07.990Z"
        }, {}, 0, 0);
        expect(result)
          .to.eventually.have.lengthOf(4)
          .notify(done);
      } catch (e) {
        expect.fail(e, null, `find should not throw exception: ${e}`);
      }
    });


  });



});