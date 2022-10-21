var express = require('express');
var router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const Contact = require('../models/Contact');

// GET - Dashboard page
router.get('/', ensureAuthenticated, async (req, res) => {
  try {
    // sort list alphabetically
    const newListItems = await Contact.find()
      .collation({ locale: 'en', strength: 2 })
      .sort({ name: 1 });
    res.render('dashboard', {
      title: 'Dashboard',
      name: req.user.username,
      newListItems,
    });
  } catch (error) {
    console.log(error);
    req.flash('error', error.message);
    res.render('dashboard', { title: 'Dashbaord' });
  }
});

// GET - update contact page
router.get('/update/:contactId', ensureAuthenticated, async (req, res) => {
  try {
    console.log(req.params.contactId);
    const contact = await Contact.findById(req.params.contactId);

    if (!contact) {
      req.flash('error', 'No such contact found');
      res.redirect('/dashboard');
    } else {
      res.render('update', {
        title: 'Update',
        name: req.user.username,
        contact: contact,
      });
    }
  } catch (error) {
    console.log(error);
    req.flash('error', error.message);
    res.redirect('/dashboard');
  }
});

// POST - update contact functionality
router.post('/update/:contactId', ensureAuthenticated, async (req, res) => {
  try {
    await Contact.findOneAndUpdate(req.params.contactId, { $set: req.body });
    req.flash('success', 'Contact updated successfully!');
    res.redirect('/dashboard');
  } catch (error) {
    console.log(err);
  }
});

// GET - add contact page
router.get('/add-contact', ensureAuthenticated, (req, res) => {
  res.render('add', {
    title: 'Add',
    name: req.user.username,
  });
});

// POST - add contact
router.post('/add-contact', ensureAuthenticated, async (req, res) => {
  console.log(req.body);

  try {
    new Contact({
      name: req.body.name,
      number: req.body.number,
      email: req.body.email,
    }).save();

    req.flash('success', 'Contact added successfully');
    res.redirect('/dashboard');
  } catch (error) {
    console.log(error);
    req.flash('error', error.message);
    res.redirect('/dashboard/add-contact');
  }
});

router.get('/delete/:contactId', ensureAuthenticated, async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.contactId);
    req.flash('success', 'Contact deleted successfully');
    res.redirect('/dashboard');
  } catch (error) {
    console.log(error);
    req.flash('error', error.message);
    res.redirect('/dashboard');
  }
});

module.exports = router;
