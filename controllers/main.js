'use strict';

const mongo = require('../mongo')
const _ = require('lodash');

class Accumulator {
  constructor(db, results) {
    this.db = db;
    this.results = results || [];
  }
}

const setupQuery = (getResults, accumulator) => {
  const db = accumulator.db;
  const resultPromises = getResults(db);
  const resultsPromise = Promise.all(resultPromises);
  return resultsPromise.then((results) => {
    return Promise.resolve(
      new Accumulator(db, [...accumulator.results, ...results])
    );
  });
};

const setupAccumulator = (db) => {
  return Promise.resolve(new Accumulator(db));
}

const getExperience = _.partial(setupQuery, (db) => {
  const experienceCollection = db.collection('experience');
  const current = experienceCollection.findOne({type: "current"});
  const previous = experienceCollection.find({type: "previous"})
    .sort({'dates.0.end': -1}).toArray();
  const education = experienceCollection.findOne({type: "education"});

  return [current, previous, education];
});

const getSkills = _.partial(setupQuery, (db) => {
  const skillsCollection = db.collection('skills');
  const skills = skillsCollection.find({}).sort({'name': 1}).toArray();

  return [skills];
});

const renderPage = (res) => {
  return (accumulator) => {
    accumulator.db.close();
    const results = accumulator.results;
    const locals = {
      experience: {
        current: results[0],
        previous: results[1],
        education: results[2]
      },
      skills: results[3]
    }

    console.log(locals)

    res.render('about', locals);
  };
};

exports.index = (req, res) => {
  return mongo.getDb()
    .then(setupAccumulator)
    .then(getExperience)
    .then(getSkills)
    .then(renderPage(res))
    .catch(console.error);
};

