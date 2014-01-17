
/**
 * Module dependencies.
 */

var express = require('express'),
  http = require('http'),
  path = require('path'),
  config = require('./config'),
  mongodb = require('mongodb'),
  app = express();

// all environments
var isDev = 'development' == app.get('env');
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.compress());
app.use(require('less-middleware')({
  force: isDev,
  compress: true,
  src: path.join(__dirname, 'src/less'),
  dest: path.join(__dirname, 'public/css'),
  prefix: '/css'
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components')));
app.use(express.static(path.join(__dirname, 'bower_components/font-awesome')));

// expose libraries to jade templates
app.locals.moment = require('moment');

// development only
if (isDev) {
  app.use(express.errorHandler());
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

