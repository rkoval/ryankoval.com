
/**
 * Module dependencies.
 */

var express = require('express'),
  http = require('http'),
  path = require('path'),
  config = require('./config'),
  mongodb = require('mongodb'),
  favicon = require('static-favicon'),
  logger = require('morgan'),
  bodyParser = require('body-parser'),
  methodOverride = require('method-override'),
  compress = require('compression'),
  lessMiddleware = require('less-middleware'),
  app = express();

// all environments
var isDev = 'development' == app.get('env');
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
//app.use(methodOverride);
//app.use(compress);
app.use(lessMiddleware(path.join(__dirname, 'src/less'), {
  force: isDev,
  debug: true,
  compiler: {
    compress: true
  },
  dest: path.join(__dirname, 'public'),
  preprocess: {
    path: function(pathname, req) {
      return pathname.replace(/\/css\//, '/');
    }
  }
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components')));
app.use(express.static(path.join(__dirname, 'bower_components/font-awesome')));

// expose libraries to jade templates
app.locals.moment = require('moment');
app.locals._ = require('lodash');

// development only
if (isDev) {

}

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

// Set up the connection to the local db
var mongoclient = new mongodb.MongoClient(new mongodb.Server(config.db.host, config.db.port), {native_parser: true});
mongoclient.open(function(err, mongoclient) {
  if (err) {
    throw err;
  }
  var db = mongoclient.db(config.db.name);
  exports.db = function() {
    return db;
  };
  console.log('Mongo driver listening on ' + config.db.host + ':' + config.db.port + ', connected to db "' + db.databaseName + '"');
});

exports.mongoclient = function() {
  return mongoclient;
};

var routes = require('./routes/index');

app.get('/', routes.index);
app.get('/about', routes.about);
app.get('/dotfiles', function(req, res) {
  res.redirect('https://raw.github.com/rkoval/.dotfiles/master/bin/dotfiles')
});

