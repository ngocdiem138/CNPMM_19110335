/* eslint-disable guard-for-in */
const bodyParser = require('body-parser');
const express = require('express');
const _ = require('lodash');

const createError = require('http-errors');
const hbs = require('hbs');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const userRoutes = require('./routes');
const helpers = require('./components/hbsHelpers');
const AccessDenied = require('./utils/errors/AccessDenied');

const app = express();
hbs.registerPartials(path.join(__dirname, 'views/partials'), (err) => { });

/* eslint guard-for-in: "error" */
for (const helper in helpers) {
  hbs.registerHelper(helper, helpers[helper]);
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());

// allow cors
app.use((req, res, next) => {
  console.log(`URL: ${req.method}  ${req.url}`);
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Max-Age', 3600);
  next();
});

// add router
userRoutes(app);

// handle error controller
// need exactly 4 params for express to regconize
// http://expressjs.com/en/guide/error-handling.html#the-default-error-handler
/* eslint-disable no-unused-vars */
app.use((err, req, res, next) => {
  console.log(JSON.stringify({ stack: err.stack, message: err.message }));
  if (res.headerSent) return next(err);
  const errorType = _.get(err, 'constructor.name', 'Error');
  switch (errorType) {
    // case DbdiagramError.name:
    //   return res.sendStatus(403);
    case AccessDenied.name:
      return res.status(err.status).send(err.message);
    default:
      return res.sendStatus(500);
  }
});
// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

module.exports = app;
