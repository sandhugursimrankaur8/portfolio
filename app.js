var dotenv = require('dotenv');
var createError = require('http-errors');
var express = require('express');
var flash = require('express-flash');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var connectDB = require('./db');
var passport = require('passport');
var session = require('express-session');
require('./config/passport')(passport);
var indexRouter = require('./routes/index');
var dashboardRouter = require('./routes/dashboard');

// config env variables
dotenv.config();

// start express app
var app = express();

// logging api routes to console
app.use(logger('dev'));
// parse incoming request
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
  })
);
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.get('*', function (req, res, next) {
  res.locals.user = req.user || null;
  next();
});

// set up routes
app.use('/', indexRouter);
app.use('/dashboard', dashboardRouter);

// connect databse
connectDB();

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

module.exports = app;
