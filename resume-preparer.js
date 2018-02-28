import moment from 'moment-timezone'
import _ from 'lodash'
import resume from './src/resume.yml'

import fontawesome from '@fortawesome/fontawesome'
import { faFilePdf } from '@fortawesome/fontawesome-free-solid'

const sort = [
  'Programming Languages',
  'Infrastructure',
  'Data Stores',
  'Frameworks & Libraries',
  'Automation',
  'Miscellaneous',
]

resume.chunkedGroupedSkills = _.chain(resume.skills)
  .map('skill')
  .filter('resume')
  .groupBy('tag')
  .entries()
  .sortBy(([group, skills]) => _.indexOf(sort, group))
  .chunk(3)
  .value()

// https://github.com/jantimon/html-webpack-plugin/issues/597#issuecomment-281663833
export default () => {
  const template = require('./src/views/resume.pug')
  return template(
    Object.assign(
      {
        moment,
        _,
        iconStyles: fontawesome.dom.css(),
        icons: {
          faFilePdf: fontawesome.icon(faFilePdf).html[0],
        },
      },
      resume
    )
  )
}
