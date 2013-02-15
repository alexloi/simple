var env = process.env.NODE_ENV || 'development'
  , config = require('../../config/config')[env];

var mongoose = require('mongoose')
  , User = mongoose.model('User')
  , dbox = require('dbox')
  , randomString = require('randomstring')
  , dropbox = dbox.app({"app_key": config.dropbox.appKey, "app_secret": config.dropbox.appSecret})
  , url = require('url')
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

// Forgot password
exports.reset = function(req, res){
  res.render('users/reset');
}

// Restore new password - send out email
exports.restore = function(req, res){
  if(req.body.email == req.body.ver_email){
    User
    .findOne({ email : req.body.email })
      .exec(function (err, user) {
        if(!user || err){
          console.log("ENESHI ETSI USER!");
          res.render('users/signup', { msg: "This user does not exist. Please create a new account!", user: new User()});
          return;

        }
        user = _.extend(user, { password: randomString.generate(7) });
        user.provider = 'local';

        user.save(function(err){
          if(err){
            console.log("Pao na kamo save je en mporo!");
            res.render('users/signup', { msg: "This user does not exist. Create a new account please!", user: new User()});
          }else{
            console.log("Send out email dame!");
            res.render('users/reset', { msg: "A new password was sent to your e-mail"} );
          }
        });
      });  
  } else {
      console.log('EMAILS DONT MATCH!');
      res.render('users/reset', { msg: "Your emails do not match!" });
  }
}

// session
exports.session = function (req, res) {
  var user = req.user;

  console.log("THIS IS THE USER:", user);

  if(user.integration) res.redirect('/dashboard');
  else res.redirect('/connect');
}

// signup
exports.create = function (req, res) {
  var user = new User(req.body);
  user.provider = 'local';
  user.save(function (err) {
    if (err) {
      return res.render('users/signup', { msg: "Please fill out all form elements", user: new User() });
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
exports.connect = function(req, res){
  var user = req.user
    , callbackURL = config.app.url + config.dropbox.callbackURL;

  console.log("CALLBACK URL: ", callbackURL);
  dropbox.requesttoken(function(status, request_token){
      user = _.extend(user, { dropbox_req_token: request_token });
      user.save(function(err,doc){
        res.render('users/connect', {
          status: status,
          dbox_url: 'https://www.dropbox.com/1/oauth/authorize?oauth_token='+request_token.oauth_token+'&oauth_callback='+callbackURL
        });  
      });
  });
}

exports.dropbox = function(req,res){
  var user = req.user
    , urlParams = url.parse(req.url, true);

  // OFFLOAD THAT AS A MIDDLEWARE FUNCTION!
  // Check params to find if user has accepted  
  console.log("URL PARAMS:", urlParams);
  if(urlParams.query.not_approved){
    user = _.extend(user, { integration: false });
    user.save(function(err,doc){
      if(err){
        console.log("SAVE USER INTEGRATION FALSE ON DROPBOX FAIL", doc);
        res.redirect('/connect');
        return;
      }else{
        console.log('INTEGRATION SUCCESS:', doc);
        res.redirect('/connect');
      }
    });
    
    return;
  }else{
    user = _.extend(user, { integration: true });
    
    user.save(function(err,doc){
      if(err){
        console.log("SAVE USER INTEGRATION TRUE ON DROPBOX FAIL");
        res.redirect('/connect');
        return;
      }
    });

    dropbox.accesstoken(user.dropbox_req_token, function(status, access_token){
       user = _.extend(user, { dropbox_acc_token: access_token });
       user.save(function(err,doc){
          res.render('dashboard/tutorial',{
            status: status,
            service: 'Dropbox'
          });  
          return;
        });
    }); 
  }
}
