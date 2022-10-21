var express = require('express');
const User = require('../models/User');
var router = express.Router();
const bcrypt = require('bcrypt');
var passport = require('passport');
const { forwardAuthenticated, ensureAuthenticated } = require('../config/auth');

// welcome
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Gursimran Kaur Sandhu' });
});

// about
router.get('/about', function (req, res, next) {
  res.render('about', { title: 'About' });
});

// projects
router.get('/projects', function (req, res, next) {
  res.render('projects', { title: 'Projects' });
});

// services
router.get('/services', function (req, res, next) {
  res.render('services', { title: 'Services' });
});

// contact
router.get('/contact', function (req, res, next) {
  res.render('contact', { title: 'Contact' });
});

// login
router.get('/login', forwardAuthenticated, function (req, res, next) {
  res.render('login', { title: 'Login' });
});

// login functionality
router.post('/login', function (req, res, next) {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true,
  })(req, res, next);
});

// register
router.get('/register', forwardAuthenticated, function (req, res) {
  res.render('register', { title: 'Register' });
});

router.post('/register', async function (req, res) {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;

  try {
    const user = await User.findOne({ email });

    // if user exists
    if (user) {
      req.flash('error', 'User already exists!');
      res.render('register', { title: 'Register' });
    } else {
      const salt = await bcrypt.genSalt(10);

      // hash password before storing to DB
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = new User({
        username,
        email,
        password: hashedPassword,
      });

      await newUser.save();
      req.flash('success', 'Registered successfully!');
      res.redirect('/login');
    }
  } catch (error) {
    req.flash('error', error.message);
    res.redirect('/register');
  }
});

// logout
router.get('/logout', (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash('success', 'You are logged out');
    res.redirect('/login');
  });
});

module.exports = router;
