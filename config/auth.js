module.exports = {
    // check if authenticated
    ensureAuthenticated: function (req, res, next) {
      // if authenticated, go next
      if (req.isAuthenticated()) {
        return next();
      }
      // if not, then redirect to login
      req.flash('error', 'Please log in to view that resource');
      res.redirect('/login');
    },
    forwardAuthenticated: function (req, res, next) {
      if (!req.isAuthenticated()) {
        return next();
      }
      // if already authenticated, forward to next
      res.redirect('/dashboard');
    },
  };
  