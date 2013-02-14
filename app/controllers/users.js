var mongoose = require('mongoose')
  , User = mongoose.model('User')
  , dbox = require('dbox')
  , dropbox = dbox.app({"app_key": "7is17xce4pu49m1", "app_secret": "277e15u3lk5xjdu"})
  , _ = require('underscore');

exports.signin = function (req, res) {}

// auth callback
exports.authCallback = function (req, res, next) {
  res.redirect('/');
}

// login
exports.login = function (req, res) {
  if(req.user){
    console.log('User already logged in');
    res.redirect('dashboard');

  } else {  
    console.log('No user object found');
    res.render('users/login', {
        title: 'Login'
      , message: req.flash('error')
    });
  }
}

// sign up
exports.signup = function (req, res) {
  if(req.user){
    console.log('User already logged in');
    res.redirect('/');
  }else{
    res.render('users/signup', {
        title: 'Sign up'
      , user: new User()
    });
  }
}

// logout
exports.logout = function (req, res) {
  req.logout();
  res.redirect('/');
}

// session
exports.session = function (req, res) {
  res.redirect('/dashboard');
}

// signup
exports.create = function (req, res) {
  var user = new User(req.body);
  user.provider = 'local';
  user.save(function (err) {
    if (err) {
      return res.render('users/signup', { errors: err.errors, user: user });
    }
    req.logIn(user, function(err) {
      if (err) return next(err);
      return res.redirect('/connect');
    });
  });
}

// show profile
exports.show = function (req, res) {
  var user = req.profile;

  console.log('user:: ', user);
  res.render('users/show', {
      title: user.name
    , user: user
  });
}

// find requested user
exports.user = function (req, res, next, id) {
  User
    .findOne({ _id : id })
    .exec(function (err, user) {
      if (err) return next(err);
      if (!user) return next(new Error('Failed to load User ' + id));
      req.profile = user;
      next();
    });
}


// Dropbox Connect
exports.connect = function(req,res){
  var user = req.user
    , callbackUrl = 'http://localhost:3000/connect/dropbox/';

  dropbox.requesttoken(function(status, request_token){
      user = _.extend(user, { dropbox_req_token: request_token });
      user.save(function(err,doc){
        res.render('users/connect', {
          status: status,
          dbox_url: 'https://www.dropbox.com/1/oauth/authorize?oauth_token='+request_token.oauth_token+'&oauth_callback='+callbackUrl
        });  
      });
  });
}

exports.dropbox = function(req,res){
  var user = req.user;

  dropbox.accesstoken(user.dropbox_req_token, function(status, access_token){
     user = _.extend(user, { dropbox_acc_token: access_token });
     user.save(function(err,doc){
        res.render('dashboard/tutorial',{
          status: status,
          service: 'Dropbox'
        });  
      }); 
  }); 
}
