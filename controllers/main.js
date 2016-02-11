'use strict';

const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const resume = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'resume.json'))
);

const sortedSkills = _.sortBy(resume.skills, (skill) => skill.name.toUpperCase());
resume.skills = sortedSkills;

exports.index = (req, res) => {
  res.render('about', resume);
};

