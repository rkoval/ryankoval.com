var app = require('../app'),
  db = app.mongoclient();
  Promise = app.Promise

exports.index = function (req, res) {
  res.render('index', { title: 'Express' });
};

exports.about = function (req, res) {
  var expCol = db.collection('experience'),
    skilCol = db.collection('skills');

  var currentPromise = expCol.then(function(col) {
    return col.findOne({type: "current"});
  });
  var previousPromise = expCol.then(function(col) {
    return col.find({type: "previous"}).sort({'dates.0.end': -1}).toArray();
  });
  var educationPromise = expCol.then(function(col) {
    return col.findOne({type: "education"});
  });

  Promise.all([currentPromise, previousPromise, educationPromise]).spread(function(current, previous, education) {
    res.render('about', {
      experience: {
        current: current,
        previous: previous,
        education: education
      }
    });
  }).done();
};
