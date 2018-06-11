const debug = require("debug")("evolvus-docket.test.db.docket");
const chai = require("chai");
const mongoose = require("mongoose");
var MONGO_DB_URL = process.env.MONGO_DB_URL || "mongodb://localhost/TestDocket";
/*
 ** chaiAsPromised is needed to test promises
 ** it adds the "eventually" property
 **
 ** chai and others do not support async / await
 */
const chaiAsPromised = require("chai-as-promised");

const expect = chai.expect;
chai.use(chaiAsPromised);

const docket = require("../index");
const db = require("../db/docket");

describe('docket model validation', () => {
  let docketObject = {
    name: 'LOGIN_EVENT',
    application: 'FLUX-CDA',
    source: 'APPLICATION',
    ipAddress: "193.168.11.115",
    status: "success",
    level: "info",
    createdBy: "meghad",
    details: "User meghad logged into the application Platform",
    eventDateTime: new Date().toISOString(),
    keyDataAsJSON: "keydata"
  };

  let invalidObject={
    name: 'LOGIN_EVENT',
    application: 'FLUX-CDA',
    source: 'APPLICATION',
    ipAddress: "193.168.11.115",
    status: "success",
    level: "info"
  };

  describe("docket model validation", () => {
    before((done) => {
      mongoose.connect(MONGO_DB_URL);
      let connection = mongoose.connection;
      connection.once("open", () => {
        debug("ok got the connection");
        done();
      });
    });


    it("valid user should validate successfully", (done) => {
      try {
        var res = docket.validate(docketObject);
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
        var res = docket.validate(invalidObject);
        expect(res)
          .to.be.rejected
          .notify(done);
        // if notify is not done the test will fail
        // with timeout
      } catch (e) {
        expect.fail(e, null, `valid docket object should not throw exception: ${e}`);
      }
    });


    it('should save a docket object to database', (done) => {
      try {
        var result = docket.save(docketObject);
        expect(result)
          .to.eventually.have.property('name')
          .to.eql(docketObject.name)
          .notify(done);
      } catch (e) {
        expect.fail(e, null, `saving docket object should not throw exception: ${e}`);
      }
    });
  });

  describe('testing getAuditRecords', () => {

    beforeEach((done) => {
      db.deleteAll().then((res) => {
        db.save(docketObject).then((res) => {
          db.save(docketObject).then((res) => {
            db.save(docketObject).then((res) => {
              done();
            });
          });
        });
      });
    });

    it('should return limited number of records', (done) => {
      let res = docket.getAll(3);
      expect(res)
        .to.be.fulfilled.then((docs) => {
          expect(docs)
            .to.be.a('array');
          expect(docs.length)
            .to.equal(3);
          done();
        });
    });

    it('should return all records if limit is less than 1', (done) => {
      let res = docket.getAll(0);
      expect(res)
        .to.be.fulfilled.then((docs) => {
          expect(docs)
            .to.be.a('array');
          expect(docs.length)
            .to.equal(3);
          done();
        });
    });
  });

  describe('testing getAuditRecords when there is no data', () => {

    beforeEach((done) => {
      db.deleteAll().then((res) => {
        done();
      });
    });

    it('should return empty array', (done) => {
      let res = docket.getAll(3);
      expect(res)
        .to.be.fulfilled.then((docs) => {
          expect(docs)
            .to.be.a('array');
          expect(docs.length)
            .to.equal(0);
          expect(docs)
            .to.eql([]);
          done();
        });
    });
  });

  describe('testing getById', () => {
    // Insert one record , get its id
    // 1. Query by this id and it should return one docket object
    // 2. Query by an arbitrary id and it should return {}
    // 3. Query with null id and it should throw IllegalArgumentException
    // 4. Query with undefined and it should throw IllegalArgumentException
    var id;
    beforeEach((done) => {
      db.save(docketObject).then((res) => {
        id = res._id;
        done();
      });
    });

    it('should return one audit matching parameter id', (done) => {
      var res = docket.getById(id);
      expect(res).to.eventually.have.property('_id')
        .to.eql(id)
        .notify(done);
    });

    it('should return empty object i.e. {} as no user is identified by this Id ', (done) => {
      let badId = new mongoose.mongo.ObjectId();
      var res = docket.getById(badId);
      expect(res).to.eventually.to.eql({})
        .notify(done);
    });

    it("should throw IllegalArgumentException for undefined Id parameter ", (done) => {
      let undefinedId;
      let res = docket.getById(undefinedId);
      expect(res)
        .to.eventually.to.be.rejectedWith("IllegalArgumentException")
        .notify(done);
    });

    it("should throw IllegalArgumentException for null Id parameter ", (done) => {
      let res = docket.getById(null);
      expect(res)
        .to.eventually.to.be.rejectedWith("IllegalArgumentException")
        .notify(done);
    });
  });

  describe('testing getByLimit', () => {
    // 1.Insert 3 records to database
    // 2.Query database with limit=2,should return 2 records
    // 3.For limit 0, less than 0 and for not a number should throw IllegalArgumentException
    beforeEach((done) => {
      db.deleteAll().then((res) => {
        db.save(docketObject).then((res) => {
          db.save(docketObject).then((res) => {
            db.save(docketObject).then((res) => {
              done();
            });
          });
        });
      });
    });

    it('should return 2 records', (done) => {
      let res = docket.getByLimit(2);
      expect(res)
        .to.be.fulfilled.then((docs) => {
          expect(docs)
            .to.be.a('array');
          expect(docs.length)
            .to.equal(2);
          expect(docs[0].name)
            .to.equal(docketObject.name);
          done();
        });
    });

    it('should throw IllegalArgumentException if limit is 0', (done) => {
      let res = docket.getByLimit(0);
      expect(res)
        .to.eventually.to.be.rejectedWith("IllegalArgumentException")
        .notify(done);
    });

    it('should throw failed to parse error if limit is not a number', (done) => {
      let res = docket.getByLimit('shgahga');
      expect(res)
        .to.eventually.to.be.rejectedWith("Failed to parse")
        .notify(done);
    });

    it("should throw IllegalArgumentException for negative limit parameter ", (done) => {
      let res = docket.getByLimit(-3);
      expect(res)
        .to.eventually.to.be.rejectedWith("IllegalArgumentException")
        .notify(done);
    });
  });

  describe('testing getByParameters', () => {

    beforeEach((done) => {
      db.deleteAll().then((res) => {
        db.save(docketObject).then((res) => {
          db.save(docketObject).then((res) => {
            db.save(docketObject).then((res) => {
              done();
            });
          });
        });
      });
    });

    it('should return 2 records', (done) => {
      let parameters = {
        application: 'FLUX-CDA'
      };
      let res = docket.getByParameters(parameters);
      expect(res)
        .to.be.fulfilled.then((docs) => {
          expect(docs)
            .to.be.a('array');
          expect(docs.length)
            .to.equal(3);
          done();
        });
    });

    it('should not return any records if parameters are not valid', (done) => {
      let parameters = {
        application: 'RTP'
      };
      let res = docket.getByParameters(parameters);
      expect(res)
        .to.be.fulfilled.then((docs) => {
          expect(docs)
            .to.be.a('array');
          expect(docs.length)
            .to.equal(0);
          done();
        });
    });

    it('should return documents based on eventdateTime', (done) => {
      let parameters = {
        toDate: Date.now(),
        fromDate: "2018-04-18T05:37:47.199Z",
        application: 'FLUX-CDA',
        source: 'APPLICATION',
        ipAddress: "193.168.11.115",
        status: "success",
        level: "info",
        createdBy: "meghad",
      };
      let res = docket.getByParameters(parameters);
      expect(res)
        .to.be.fulfilled.then((docs) => {
          expect(docs)
            .to.be.a('array');
          expect(docs.length)
            .to.equal(3);
          done();
        });
    });
  });
});
