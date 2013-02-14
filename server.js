/*
  Main app 
  - load dependencies
  - setup routes / models
  - load configs
  - start app
*/

var express = require('express')
  , fs = require('fs');

// Load config
var env = process.env.NODE_ENV || 'development'
  , config = require('./config/config')[env]
  , passport = require('passport')
  , auth = require('./config/middlewares/authorization')
  , mongoose = require('mongoose');

// Set db connection
mongoose.connect(config.db);

// Set models
var models_path = __dirname + '/app/models';
fs.readdirSync(models_path).forEach(function(file){
  require(models_path + '/' + file);
});

// Set express
var app = express();

// Setup passport settings
require('./config/passport')(passport, config);

// Express settings
require('./config/express')(app, config, passport);

// Set routes
require('./config/routes')(app, passport, auth);

// Start app
var port = process.env.PORT || 3000;
app.listen(port);
console.log('Express app started - port '+port);


