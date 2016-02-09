const app = require('./app');
const mainController = require('./controllers/main');

app.get('/', mainController.index);
