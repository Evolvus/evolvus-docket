const request = require('supertest');
const expect = require('expect');
var {
  app,
  server,
  localStorage
} = require('../server/server.js');
const {
  users,
  populateUsers,
  dockets,
  populateDocket
} = require('./seed.js');
var {
  User
} = require('../server/user');
var {
  Docket
} = require('../server/dockerSchema');
var ObjectId = require('mongodb').ObjectID;

describe('MOCHA TESTING', () => {

  before((done) => {
    server.close();
    done();
  });

  beforeEach(populateUsers);
  beforeEach(populateDocket);

  describe('GET /register', () => {

    it("renders successfully", (done) => {
      request(app)
        .get('/register')
        .expect(200)
        .end(done)
    });

  });

  describe('POST /register', () => {

    it('should create a user', (done) => {
      var username = 'mongoose';
      var email = 'mobngopdf@gmail.com';
      var password = '*Evolvus5';
      request(app)
        .post('/register')
        .send({
          username,
          email,
          password
        })
        .expect(200)
        .end((err) => {
          if (err) {
            return done(err);
          }
          User.findOne({
            email
          }).then((user) => {
            expect(user).toBeTruthy();
            expect(user.password).not.toBe(password);
            done();
          });
        });
    });

    it('should return validation errors if request is invalid', (done) => {
      request(app)
        .post('/register')
        .send({
          username: '',
          email: 'kavyashree@gmail.com',
          password: '*volvus5'
        })
        .expect(400)
        .end(done)
    });

    it('should not create a user if email/username is in use', (done) => {
      request(app)
        .post('/register')
        .send({
          username: 'kavya',
          email: 'kavya@gmail.com',
          password: 'Evolvus5'
        })
        .expect(400)
        .end(done)
    });

    it('should not create a user if password doesnt contain one uppercase,one lowercase, one numeric value', (done) => {
      request(app)
        .post('/register')
        .send({
          username: 'kavy2131a',
          email: 'kavya23login2@gmail.com',
          password: 'ADSFSDF5'
        })
        .expect(400)
        .end(done)
    });

  });

  describe('GET /login', () => {
    it("renders successfully", (done) => {
      request(app)
        .get('/login')
        .expect(200)
        .end(done)
    });
  });

  describe("POST /login", () => {
    beforeEach((done) => {
      localStorage.removeItem('token');
      done();
    });

    it('should login the user and redirect to homepage if authentication succeeded', (done) => {
      request(app)
        .post('/login')
        .send({
          email: users[1].email,
          password: users[1].password
        })
        .expect(302)
        .end((err, res) => {
          if (err) {
            done(err);
          }
          expect(res.header.location).toEqual('/docket');
          expect(localStorage.getItem('token')).toBeTruthy();
          done();
        })
    });

    it('should reject the invalid login', (done) => {
      request(app)
        .post('/login')
        .send({
          email: users[1].email,
          password: users[1].password + 1
        })
        .expect(401)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          User.findById(users[1]._id).then((user) => {
            expect(user.tokens.length).toBe(0);
            expect(localStorage.getItem('token')).not.toBeTruthy();
            done();
          }).catch((e) => {
            done(e);
          });
        })
    });
  });

  describe('GET /docket', () => {

    it('should redirect to login page if the request comes for homepage without login', (done) => {
      request(app)
        .get('/docket')
        .expect(401)
        .end((err, res) => {
          if (err) {
            done(err);
          }
          expect(localStorage.getItem('token')).not.toBeTruthy();
          done();
        })
    });

    it('should enter into homepage if already loggedin', (done) => {
      localStorage.setItem('token', users[0].tokens[0].token);
      request(app)
        .get('/docket')
        .expect(200)
        .end((err, res) => {
          if (err) {
            done(err);
          }
          expect(localStorage.getItem('token')).toBeTruthy();
          done();
        })
    });

  });

  describe('POST /audit', () => {
    it('should post a docket object and return status 200', (done) => {
      request(app)
        .post('/audit')
        .send({
          name: 'Login Event',
          createdBy: 'kavya',
          application: 'platform',
          source: 'security',
          details: 'some details',
          ipAddress: '121.34.33.222',
          status: 'success'
        })
        .expect(200)
        .end((err, res) => {
          if (err) {
            done(err);
          }
          Docket.find().then((docs) => {
            expect(docs.length).toBe(3);
            done();
          });
        })
    });

    it('should return status 400 if the request is invalid', (done) => {
      request(app)
        .post('/audit')
        .send({
          name: 'Login Event',
          createdBy: 'kavya',
        })
        .expect(400)
        .end((err) => {
          Docket.find().then((docs) => {
            expect(docs.length).toBe(2);
            done();
          });
        })
    });

  });

  describe('GET /audit', () => {
    it('should return audit records', (done) => {
      request(app)
        .get('/audit')
        .send({
          source: 'security'
        })
        .expect(200)
        .end((err, res) => {
          if (err) {
            done(err)
          }
          Docket.find({
            source: 'security'
          }).then((docs) => {
            expect(docs.length).toBe(1);
            done();
          });
        })
    });

    it('should return zero records if the condition doesnt match', (done) => {
      request(app)
        .get('/audit')
        .send({
          source: 'kavya'
        })
        .expect(200)
        .end((err, res) => {
          if (err) {
            done(err)
          }
          Docket.find({
            source: 'kavya'
          }).then((docs) => {
            expect(docs.length).toBe(0);
            done();
          });
        })
    });

    it('should return 401 and redirect to login if unauthorized', (done) => {
      localStorage.removeItem('token');
      request(app)
        .get('/audit')
        .expect(401)
        .end(done)
    });
  });

  describe('GET /rowDetails', () => {

    it('should return row details if loggedin', (done) => {
      localStorage.setItem('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YWI0ZTdjNDUyOTE1ZTExYWQyYTY4NTMiLCJhY2Nlc3MiOiJhdXRoIiwiaWF0IjoxNTIxODA1MjUyfQ.hv4Ttm_J8iyDavIy4yac32sSVAlOPfrFRtTY87XtvNs');
      request(app)
        .get('/rowDetails')
        .query({
          id: '5ab4e8135267c811eff704f7'
        })
        .expect(200)
        .end((err, res) => {
          Docket.findById({
            _id: ObjectId('5ab4e8135267c811eff704f7')
          }).then((doc) => {
            expect(JSON.stringify(doc)).toEqual(JSON.stringify(res.body));
            done();
          });
        })
    });

    it('should return 401 if unauthorized', (done) => {
      localStorage.removeItem('token');
      request(app)
        .get('/rowDetails')
        .send({
          id: '5ab4e8135267c811eff704f7'
        })
        .end((err, res) => {
          if (err) {
            done(err)
          }
          expect(res.body.status).toEqual(401);
          done();
        })
    });
  });

  describe('GET /topNoOfRecords', () => {
    beforeEach((done) => {
      localStorage.setItem('token', users[0].tokens[0].token);
      done();
    });
    it("should send status code 400 if the input is not an integer", (done) => {
      request(app)
        .get('/topNoOfRecords')
        .query({
          value: "asgdh"
        })
        .expect(400)
        .end((err, res) => {
          expect(res.text).toEqual('Enter a integer value');
          done();
        })
    });

    it('should return 400 with an error message "enter a value greater than zero" if the input is zero', (done) => {
      request(app)
        .get('/topNoOfRecords')
        .query({
          value: "0"
        })
        .expect(400)
        .end((err, res) => {
          expect(res.text).toEqual('Enter a value greater than zero');
          done();
        })
    });

    it('should return specified number of records', (done) => {
      request(app)
        .get('/topNoOfRecords')
        .query({
          value: "1"
        })
        .end((err, res) => {
          expect(res.status).toBe(200);
          Docket.find().limit(1).then((docs) => {
            expect(docs.length).toEqual(res.body.length);
          })
          done();
        })
    });

    it("should redirect to login page if unauthorized", (done) => {
      localStorage.removeItem('token');
      request(app)
        .get('/topNoOfRecords')
        .query({
          value: "1"
        })
        .expect((res) => {
          expect(res.body.status).toBe(401);
        })
        .end(done);
    });

  });

  describe('GET /updateTimeline', () => {

    it("should redirect to login page if unauthorized", (done) => {
      localStorage.removeItem('token');
      request(app)
        .get('/updateTimeline')
        .expect((res) => {
          expect(res.body.status).toBe(401);
        })
        .end(done);
    });

    it("should update the timeline ", (done) => {
      localStorage.setItem('token', users[0].tokens[0].token);
      request(app)
        .get('/updateTimeline')
        .expect(200)
        .end((err, res) => {
          Docket.find().then((docs) => {
            expect(JSON.stringify(docs)).toEqual(JSON.stringify(res.body));
            done();
          })
        })
    });
  });

  describe('POST /logout', () => {

    it('should remove token and redirect to login page', (done) => {
      localStorage.setItem('token', users[0].tokens[0].token);
      request(app)
        .post('/logout')
        .expect(302)
        .expect((res) => {
          expect(res.header.location).toBe('/login');
          expect(localStorage.getItem('token')).not.toBeTruthy();
        })
        .end(done)
    });

    it('should return 400 for the invalid request', (done) => {
      localStorage.setItem('token', "token");
      request(app)
        .post('/logout')
        .expect(400)
        .end(done)
    });

  });
});