var app = require('../app'),
  mongoclient = app.mongoclient(),
  db = mongoclient.db('ryankoval');

exports.index = function (req, res) {
  res.render('index', { title: 'Express' });
};

exports.about = function (req, res) {
  var collection = db.collection('experience'),
    current,
    previous,
    education;

    collection.findOne({type: "current"}, function(err, doc) {
      if (err) throw err;
      current = doc;

      collection.find({type: "previous"}).toArray(function(err, docs) {
        if (err) throw err;
        previous = docs;

        collection.findOne({type: "education"}, function(err, doc) {
          if (err) throw err;
          education = doc;

          res.render('about', {
            experience: {
              current: current,
              previous: previous,
              education: education
            }
          });
        });
      });
    });
};
