var app = require('./app').app,
   mainController = require('./controllers/main');

app.get('/', mainController.index);
app.get('/dotfiles', mainController.dotfiles);

