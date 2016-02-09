const MongoClient = require('mongodb').MongoClient;
const config = require('config');
const mongoUrl = config.get('MONGO_URL');

const getDb = () => {
  return MongoClient.connect(mongoUrl)
    .catch(console.error);
};

module.exports = {
  getDb
};
