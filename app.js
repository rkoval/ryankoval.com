
/**
 * Module dependencies.
 */

var express = require('express'),
  http = require('http'),
  path = require('path'),
  config = require('./config'),
  mongodb = require('poseidon-mongo'),
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
var Mongo = mongodb,
Driver = Mongo.Driver,
Database = Mongo.Database;
Driver.configure('ryankoval', {
  hosts: [config.db.host + ":" + config.db.port],
  database: config.db.name,
  options: { w: 1 }
});
var mongoclient = new Database('ryankoval');

exports.app = app;
exports.Promise = mongodb.Promise
exports.mongoclient = function() {
  return mongoclient;
};

// load routes
require('./routes');