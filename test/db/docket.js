const debug = require("debug")("evolvus-docket.test.db.docket");
const mongoose = require("mongoose");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const expect = chai.expect;
const docket = require("../../db/docket");

var MONGO_DB_URL = process.env.MONGO_DB_URL || "mongodb://localhost/TestDocket";

chai.use(chaiAsPromised);

// High level wrapper
// Testing db/docket.js
describe('db Docket testing', () => {
  let testDocket = {
    name: 'EVENT',
    application: 'FLUX-CDA',
    source: 'APPLICATION',
    ipAddress: "193.168.11.115",
    level: "info",
    createdBy: "Kavya",
    status: "success",
    details: "User Kavya logged into the application Platform",
    eventDateTime: Date.now(),
    keyDataAsJSON: "keydata"
  };
  let testDocket1 = {
    name: 'LOGINEVENT',
    application: 'RTP',
    source: 'application',
    ipAddress: "193.168.11.115",
    level: "info",
    createdBy: "Ramya",
    status: "SUCCESS",
    details: "User Ramya logged into the application RTP",
    eventDateTime: Date.now(),
    keyDataAsJSON: "keydata"
  };
  let testDocket2 = {
    name: 'LOGINEVENT',
    application: 'RTP',
    source: 'APPLICATION',
    ipAddress: "193.168.11.115",
    level: "info",
    createdBy: "Swathi",
    status: "SUCCESS",
    details: "User Swathi logged into the application RTP",
    eventDateTime: Date.now(),
    keyDataAsJSON: "keydata"
  };

  // Before doing any tests, first get the connection.

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

  describe("testing docket.findById", () => {
    // Delete all records, insert one record , get its id
    // 1. Query by this id and it should return one docket object
    // 2. Query by an arbitrary id and it should return {}
    // 3. Query with null id and it should throw IllegalArgumentException
    // 4. Query with undefined and it should throw IllegalArgumentException
    // 3. Query with arbitrary object

    var id;
    beforeEach((done) => {
      docket.deleteAll()
        .then((res) => {
          docket.save(testDocket)
            .then((savedObj) => {
              id = savedObj._id;
              done();
            });
        });
    });

    it("should return docket object identified by Id ", (done) => {
      let res = docket.findById(id);
      expect(res)
        .to.eventually.have.property('_id')
        .to.deep.equal(id)
        .notify(done);
    });

    it("should return empty object i.e. {} as no user is identified by this Id ", (done) => {
      let badId = new mongoose.mongo.ObjectId();
      let res = docket.findById(badId);
      expect(res)
        .to.eventually.to.eql({})
        .notify(done);
    });

    it("should be rejected for arbitrary object as Id parameter ", (done) => {
      let id = testDocket;
      let res = docket.findById(testDocket);
      expect(res)
        .to.eventually.to.be.rejectedWith("must be a single String of 12 bytes")
        .notify(done);
    });
  });

  describe('testing docket.findAll when data present', () => {
    // 1. Delete all records in the table and Insert two new records.
    // 2. Find -should return an array of size 2 with the  two docket objects.

    beforeEach((done) => {
      docket.deleteAll()
        .then((res) => {
          docket.save(testDocket)
            .then((res) => {
              docket.save(testDocket1)
                .then((res) => {
                  done();
                });
            });
        });
    });

    it('should return 2 docket objects', (done) => {
      let res = docket.findAll(2);
      expect(res)
        .to.be.fulfilled.then((docs) => {
          expect(docs)
            .to.be.a('array');
          expect(docs.length)
            .to.equal(2);
          expect(docs[0].name)
            .to.equal(testDocket.name);
          done();
        });
    });

    it('should return all docket objects when limit is less than 1', (done) => {
      let res = docket.findAll(-1);
      expect(res)
        .to.be.fulfilled.then((docs) => {
          expect(docs)
            .to.be.a('array');
          expect(docs.length)
            .to.equal(2);
          expect(docs[0].name)
            .to.equal(testDocket.name);
          done();
        });
    });
  });

  describe('testing docket.findAll when there is no data in database', () => {
    // 1.Delete all the records from database
    // 2.Query the databse , should return empty array
    beforeEach((done) => {
      docket.deleteAll()
        .then(() => {
          done();
        });
    });

    it('should return empty array', (done) => {
      let res = docket.findAll(1);
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

  describe('testing findByLimit', () => {
    // 1.Insert 3 records to database
    // 2.Query database with limit=2,should return 2 records
    // 3.For limit 0, less than 0 and for not a number should throw IllegalArgumentException
    beforeEach((done) => {
      docket.deleteAll().then((res) => {
        docket.save(testDocket).then((res) => {
          docket.save(testDocket1).then((res) => {
            docket.save(testDocket).then((res) => {
              done();
            });
          });
        });
      });
    });

    it('should return 2 records', (done) => {
      let res = docket.findByLimit(2);
      expect(res)
        .to.be.fulfilled.then((docs) => {
          expect(docs)
            .to.be.a('array');
          expect(docs.length)
            .to.equal(2);
          expect(docs[0].name)
            .to.equal(testDocket.name);
          done();
        });
    });
  });

  describe('testing findBySort', () => {
    // 1.Insert 3 records to database
    // 2.Query database with sort parameter 'createdBy'

    beforeEach((done) => {
      docket.deleteAll().then((res) => {
        docket.save(testDocket).then((res) => {
          docket.save(testDocket1).then((res) => {
            docket.save(testDocket2).then((res) => {
              done();
            });
          });
        });
      });
    });

    it('should return 3 records in inserted order', (done) => {
      let res = docket.findBySort({
        createdBy: 1
      });
      expect(res)
        .to.be.fulfilled.then((docs) => {
          expect(docs)
            .to.be.a('array');
          expect(docs.length)
            .to.equal(3);
          expect(docs[0].createdBy)
            .to.equal(testDocket.createdBy);
          done();
        });
    });

    it('should return 3 records in non-inserted order', (done) => {
      let res = docket.findBySort({
        createdBy: -1
      });
      expect(res)
        .to.be.fulfilled.then((docs) => {
          expect(docs)
            .to.be.a('array');
          expect(docs.length)
            .to.equal(3);
          expect(docs[0].createdBy)
            .to.equal(testDocket2.createdBy);
          expect(docs[2].createdBy)
            .to.equal(testDocket.createdBy);
          done();
        });
    });
  });

  describe('testing findByParameters', () => {
    beforeEach((done) => {
      docket.deleteAll().then((res) => {
        docket.save(testDocket).then((res) => {
          docket.save(testDocket1).then((res) => {
            docket.save(testDocket2).then((res) => {
              done();
            });
          });
        });
      });
    });

    it('should return filtered documents', (done) => {
      let query = {
        application: 'RTP'
      };
      var res = docket.findByParameters(query);
      expect(res).to.be.fulfilled.then((docs) => {
        expect(docs)
          .to.be.a('array');
        expect(docs.length)
          .to.equal(2);
        expect(docs[0].application)
          .to.equal(testDocket2.application);
        done();
      });
    });

    it('should return empty array when parameter is not valid', (done) => {
      let query = {
        application: 'RTPa'
      };
      var res = docket.findByParameters(query);
      expect(res).to.be.fulfilled.then((docs) => {
        expect(docs)
          .to.be.a('array');
        expect(docs.length)
          .to.equal(0);
        expect(docs)
          .to.eql([]);
        done();
      });
    });

    it('should return empty array when parameter is not valid', (done) => {
      let query = {
        $and: [{
          application: 'RTP'
        }, {
          source: 'APPLICATION'
        }]
      };
      var res = docket.findByParameters(query);
      expect(res).to.be.fulfilled.then((docs) => {
        expect(docs)
          .to.be.a('array');
        expect(docs.length)
          .to.equal(1);
        // expect(docs)
        //   .to.eql([]);
        done();
      });
    });

    it('should return 3 records according to eventDateTime', (done) => {
      let query = {
        $and: [{
          eventDateTime: {
            $gt: '2018-04-20T05:37:47.199Z'
          }
        }, {
          eventDateTime: {
            $lt: Date.now()
          }
        }]
      };
      var res = docket.findByParameters(query);
      expect(res).to.be.fulfilled.then((docs) => {

        expect(docs)
          .to.be.a('array');
        expect(docs.length)
          .to.equal(3);
        done();
      });
    });

    it('should return 1 record matching query', (done) => {
      let query = {
        $and: [{
            $and: [{
              application: testDocket.application
            }, {
              source: testDocket.source
            }, {
              ipAddress: testDocket.ipAddress
            }, {
              createdBy: testDocket.createdBy
            }, {
              level: testDocket.level
            }, {
              status: testDocket.status
            }]
          },
          {
            $and: [{
              eventDateTime: {
                $gt: '2018-04-20T05:37:47.199Z'
              }
            }, {
              eventDateTime: {
                $lt: Date.now()
              }
            }]
          }
        ]
      };
      var res = docket.findByParameters(query);
      expect(res).to.be.fulfilled.then((docs) => {
        expect(docs)
          .to.be.a('array');
        expect(docs.length)
          .to.equal(1);
        done();
      });
    });
  });
});
