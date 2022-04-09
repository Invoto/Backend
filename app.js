var createError = require('http-errors');
require('dotenv').config();
var express = require('express');
var fs = require("fs");
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var db = require("./models");
var app = express();

function initApp() {
  var indexRouter = require('./routes/index');

  // Create Uploads Directory.
  try {
    fs.mkdirSync(path.join(__dirname, '/uploads/'));
  } catch (err) { }

  // view engine setup
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'jade');

  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public')));

  app.use('/', indexRouter);

  // catch 404 and forward to error handler
  app.use(function (req, res, next) {
    next(createError(404));
  });

  // error handler
  app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });
}

// Start Procedures.
if (!process.env["INVOTO_DATABASE_SYNC"] || process.env["INVOTO_DATABASE_SYNC"] == 1) {
  db.sync(() => {
    if (!process.env["INVOTO_POPULATE_DATA"] || process.env["INVOTO_POPULATE_DATA"] == 1) {
      db.populateInitialPlans(initApp);
    }
    else {
      initApp();
    }
  });
}
else if (!process.env["INVOTO_POPULATE_DATA"] || process.env["INVOTO_POPULATE_DATA"] == 1) {
  db.populateInitialPlans(initApp);
}
else {
  initApp();
}

module.exports = app;
