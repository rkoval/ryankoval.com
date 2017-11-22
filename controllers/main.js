'use strict';

const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const YAML = require('yamljs');
const resume = YAML.load(path.join(__dirname, '..', 'resume.yml'))

const sortedSkills = _.sortBy(resume.skills, (skill) => skill.skill.name.toUpperCase());
resume.skills = sortedSkills;

exports.index = (req, res) => {
  res.render('about', resume);
};

