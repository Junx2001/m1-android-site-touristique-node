require('dotenv').config();


var express = require('express');
var logger = require('morgan');
const cors = require('cors');
//const mongoose = require('./src/database/DatabaseManager').mongo;
const bodyParser = require('body-parser');

var serverRouter = require('./src/routes/server/server.routes');
var usersRouter = require('./src/routes/users/user.routes');
var sitesRouter = require('./src/routes/sites/site.routes');
var regionsRouter = require('./src/routes/regions/region.routes');
var notifsRouter = require('./src/routes/notifications/notification.routes');



var app = express();


app.use(cors());

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



// Routes list
app.use('/', serverRouter);
app.use('/users', usersRouter);
app.use('/sites', sitesRouter);
app.use('/regions', regionsRouter);
app.use('/notifications', notifsRouter);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.status(404).json({
    message: "No such route exists"
  })
});

// error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500).json({
    message: "Error Message"
  })
});

module.exports = app;