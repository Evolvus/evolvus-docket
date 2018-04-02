const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var ObjectId = require('mongodb').ObjectID;
const _ = require('lodash');
const express = require('express');
var app = express();
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
  extended: false,
  limit: '50mb'
}));
app.use(bodyParser.json({
  limit: '50mb'
}));
var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./scratch');

var {
  User
} = require('./user');
const {
  SHA256
} = require('crypto-js');
const jwt = require('jsonwebtoken');
var {
  authenticate
} = require('./middleware/authenticate');
var {
  loginauth
} = require('./middleware/loginauth');
var path = require('path');
const validator = require('validator');
var {
  Docket
} = require('./dockerSchema.js');
var moment = require('moment');
var postDocket = require('./postDocket');
var {
  regValidation,
  isEmailUnique,
  isNameUnique
} = require('./middleware/registerVal');
var logValidation = require('./middleware/loginVal');
var validateDocket = require('./middleware/docketVal');

mongoose.connect('mongodb://localhost:27017/Docket', (err, db) => {
  if (err) {
    console.log('Failed to connect to the database');
  } else {
    console.log('connected to mongodb');
  }
});

var router = express.Router();

app.get('/register', (req, res) => {
  res.render('pages/register', {
    message: ""
  });
});

app.post('/register', regValidation, isNameUnique, isEmailUnique, (req, res) => {
  var body = _.pick(req.body, ['username', 'email', 'password']);
  var user = new User(body);
  user.save().then(() => {
    user.generateAuthToken();
  }).then((token) => {
    res.render('pages/single', {
      message: "registered Successfully"
    });
  }).catch((e) => {
    res.status(400).render('pages/register', {
      message: e.message
    });
  });
});

app.get('/login', (req, res) => {
  res.render('pages/single', {
    message: ""
  });
});

app.post('/login', logValidation, (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  User.findByCredentials(body.email, body.password).then((user) => {
    user.generateAuthToken().then((token) => {
      localStorage.setItem('token', token);
      res.status(302).redirect('/docket');
    });
  }).catch((e) => {
    res.status(401).render('pages/single', {
      message: e
    });
  });
});

router.use((req, res, next) => {
  if (localStorage.getItem('token') === null) {
    if (req.url === '/docket' || req.url === '/audit') {
      res.status(401).render('pages/single', {
        message: "Please Login"
      });
    } else {
      res.send({
        error: "Please Login",
        status: 401
      });
    }
  } else {
    next();
  }
});

router.get('/docket', (req, res) => {
  var docarray = [],
    application = [],
    source = [],
    createdBy = [],
    ipAddress = [],
    level = [],
    status = [];
  var mysort = {
    eventDateTime: -1
  };
  Docket.find().sort(mysort).then((docs) => {
    docarray = docs;
    docarray.forEach((doc) => {
      application.push(doc.application);
      source.push(doc.source);
      createdBy.push(doc.createdBy);
      ipAddress.push(doc.ipAddress);
      level.push(doc.level);
      status.push(doc.status);
    });
    application = _.uniq(application);
    source = _.uniq(source);
    createdBy = _.uniq(createdBy);
    level = _.uniq(level);
    status = _.uniq(status);
    ipAddress = _.uniq(ipAddress);
    res.render('pages/single', {
      message: 'SUCCESS',
      docarray,
      application,
      source,
      level,
      createdBy,
      ipAddress,
      status
    });
  });
});

app.post('/audit', validateDocket, (req, res) => {
  postDocket(req, res);
});

router.get('/audit', (req, res) => {
  var query = _.pick(req.query, ['application', 'source', 'ipAddress', 'createdBy', 'fromDate', 'toDate', 'level', 'status']);
  var apply;
  var date1 = moment(query.fromDate, "DD MM YYYY").toDate();
  var date2 = moment(query.toDate, "DD MM YYYY").toDate();
  if (typeof query.fromDate !== 'undefined' && typeof query.toDate !== 'undefined') {
    apply = {
      $and: [{
          $and: [{
            application: query.application
          }, {
            source: query.source
          }, {
            ipAddress: query.ipAddress
          }, {
            createdBy: query.createdBy
          }, {
            level: query.level
          }, {
            status: query.status
          }]
        },
        {
          $and: [{
            eventDateTime: {
              $gt: date1
            }
          }, {
            eventDateTime: {
              $lt: date2
            }
          }]
        }
      ]
    };
  } else {
    apply = req.query;
  }
  Docket.find(apply).then((docs) => {
    var docarray = docs;
    res.render('pages/table', {
      docarray: docarray
    });
  }).catch((e) => {
    res.status(400).send(e);
  });
});

app.post('/logout', authenticate, (req, res) => {
  localStorage.removeItem('token');
  req.user.removeToken(req.token).then(() => {
    res.redirect('/login');
  }).catch((e) => {
    res.status(400).send(e);
  });
});

router.get('/rowDetails', (req, res) => {
  Docket.findById({
    _id: ObjectId(req.query.id)
  }).then((docker) => {
    res.render('pages/row', {
      docker: docker
    });
    //res.send(docker);
  }).catch((e) => {
    res.status(400).send(e);
  });
});

router.get('/topNoOfRecords', (req, res) => {
  if (!(isNaN(req.query.value))) {
    if (req.query.value == 0) {
      res.status(400).send("Enter a value greater than zero");
    } else {
      var mysort = {
        eventDateTime: -1
      };
      Docket.find().sort(mysort).limit(parseInt(req.query.value)).then((docs) => {
        res.render('partials/body', {
          docarray: docs
        });
        //res.send(docs);
      }).catch((e) => {
        res.status(400).send({
          error: e
        });
      });
    }
  } else {
    res.status(400).send("Enter a integer value");
  }
});

router.get('/updateTimeline', (req, res) => {
  var mysort = {
    eventDateTime: -1
  };
  Docket.find().sort(mysort).then((docs) => {
    res.render('partials/body', {
      docarray: docs
    });
    //  res.send(docs);
  }).catch((e) => {
    res.send(e);
  });
});

app.use('/', router);

const server = app.listen('3000', () => {
  console.log('server is up on port 3000');
});

module.exports = {
  app,
  server,
  localStorage
};