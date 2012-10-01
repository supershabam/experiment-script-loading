'use strict';

var express = require('express')
  , http = require('http')
  , path = require('path')
  ;

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 8080);
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', function(req, res) {
  res.render('index');
});

app.get('/experiment/:id', function(req, res) {
  // normalize id against trying to view things that you shouldn't be viewing
  var view = req.param('id').replace(/[A-Z0-9]^/gi, '');
  res.render('experiment/' + view);
});

/**
 * Generate javascript that simply does console.log(#{message})
 *
 * Returns the javascript after specified delay
 */
app.get('/javascript/generate', function(req, res) {
  var delay
    , message
    ;

  delay = req.query.delay ? req.query.delay : 0;
  message = req.query.message || '';

  // convert to int [0, 3000]
  delay = parseInt(delay, 10);
  if (delay < 0) delay = 0;
  if (delay > 3000) delay = 3000;

  // normalize message
  if (typeof message !== 'string' || message.length === 0 || message.length > 3000) {
    message = 'just the default message';
  }
  message = message.replace(/\'/g, '\\\'');

  setTimeout(function() {
    res.type('.js');
    res.end('console.log((new Date()).valueOf(), \'' + message + '\');');
  }, delay);
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
