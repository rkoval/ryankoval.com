const MongoClient = require('mongodb').MongoClient;
const config = require('config');
const mongoUrl = config.get('mongoUrl');

console.log(`using ${mongoUrl} as mongo URL...`)
const getDb = () => {
  return MongoClient.connect(mongoUrl)
    .catch(console.error);
};

module.exports = {
  getDb
};
