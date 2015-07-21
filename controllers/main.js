var app = require('../app'),
  db = app.mongoclient();
  Promise = app.Promise;

exports.index = function (req, res) {
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
  var skillsPromise = skilCol.then(function(col) {
    return col.find().sort({'name': 1}).toArray();
  });

  var promises = [currentPromise, previousPromise, educationPromise, skillsPromise];

  Promise.all(promises).spread(function(current, previous, education, skills) {
    res.render('about', {
      experience: {
        current: current,
        previous: previous,
        education: education
      },
      skills: skills
    });
  }).done();
};

exports.dotfiles = function (req, res) {
  res.redirect('https://raw.github.com/rkoval/dotfiles/master/bin/dotfiles')
};
