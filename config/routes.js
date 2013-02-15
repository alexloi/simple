var mongoose = require('mongoose')
  , Demo = mongoose.model('Demo')
  , User = mongoose.model('User')
  , async = require('async');

module.exports = function (app, passport, auth) {
  // Page routes
  var pages = require('../app/controllers/pages');
  
  // If authenticated take to dashboard
  app.get('/', auth.checkAuth, pages.index);

  // Dashboard
  var dashboard = require('../app/controllers/dashboard');
  app.get('/dashboard', auth.requiresLogin, dashboard.index);
  app.get('/dashboard/tutorial', auth.requiresLogin, dashboard.tutorial);

  // User routes
  var users = require('../app/controllers/users');
  app.get('/login', users.login);
  app.get('/signup', users.signup);
  app.get('/reset', users.reset);
  app.post('/reset', users.restore);
  app.get('/logout', auth.requiresLogin, users.logout);
  app.post('/users', users.create);
  app.get('/connect', auth.requiresLogin, users.connect);
  app.get('/connect/dropbox', auth.requiresLogin, users.dropbox);
  app.post('/users/session', passport.authenticate('local', {failureRedirect: '/login', failureFlash: 'Invalid email or password.'}), users.session);
  app.get('/users/:userId', users.show);
  
  // Data routes
  var data = require('../app/controllers/data');
  app.post('/data/store', auth.requiresLogin, data.store);
  app.post('/data/retrieve', auth.requiresLogin, data.retrieve);
  // 
  // app.param('id', function(req, res, next, id){
  //   Article
  //     .findOne({ _id : id })
  //     .populate('user', 'name')
  //     .populate('comments')
  //     .exec(function (err, article) {
  //       if (err) return next(err)
  //       if (!article) return next(new Error('Failed to load article ' + id))
  //       req.article = article

  //       var populateComments = function (comment, cb) {
  //         User
  //           .findOne({ _id: comment._user })
  //           .select('name')
  //           .exec(function (err, user) {
  //             if (err) return next(err)
  //             comment.user = user
  //             cb(null, comment)
  //           })
  //       }

  //       if (article.comments.length) {
  //         async.map(req.article.comments, populateComments, function (err, results) {
  //           next(err)
  //         })
  //       }
  //       else
  //         next()
  //     })
  // })
// Demo routes
  //var demos = require('../app/controllers/demos');

  //app.get('/', demos.index);
  //app.get('/connect', demos.connect);
  

}
