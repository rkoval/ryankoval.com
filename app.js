
/**
 * Module dependencies.
 */

const express = require('express');
const http = require('http');
const path = require('path')
const config = require('config');
const favicon = require('serve-favicon');
const logger = require('morgan');
const bodyParser = require('body-parser');
const compression = require('compression');
const lessMiddleware = require('less-middleware');

const app = express();
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(compression());

const isDev = 'development' == app.get('env');
app.locals.isDev = isDev;
app.use(lessMiddleware(path.join(__dirname, 'src/less'), {
  force: isDev,
  debug: true,
  compiler: {
    compress: true
  },
  dest: path.join(__dirname, 'public'),
  preprocess: {
    path(pathname) {
      return pathname.replace(/\/css\//, '/');
    }
  }
}));

const setupStaticDirectory = (directory) => {
  const oneHour = 1000 * 60 * 60;
  app.use(express.static(path.join(__dirname, directory), { maxAge: oneHour * 24}));
};
setupStaticDirectory('public');
setupStaticDirectory('bower_components');
setupStaticDirectory('bower_components/font-awesome');

// expose libraries to pug templates
app.locals.moment = require('moment');
app.locals._ = require('lodash');

http.createServer(app).listen(app.get('port'), () => {
  console.log('Express server listening on port ' + app.get('port'));
});

module.exports = app;
require('./routes');
