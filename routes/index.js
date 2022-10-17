var express = require('express');
var router = express.Router();

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

module.exports = router;
