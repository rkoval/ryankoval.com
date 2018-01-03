const moment = require('moment')
const _ = require('lodash')
const YAML = require('yamljs')
const resume = YAML.load('./src/resume.yml')

const sortedSkills = _.sortBy(resume.skills, skill =>
  skill.skill.name.toUpperCase()
)

resume.skills = sortedSkills

// https://github.com/jantimon/html-webpack-plugin/issues/597#issuecomment-281663833
export default () => {
  const template = require('./src/views/about.pug')
  return template(
    Object.assign(
      {
        moment,
        _,
      },
      resume
    )
  )
}
