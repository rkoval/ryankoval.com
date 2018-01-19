import moment from 'moment-timezone'
import _ from 'lodash'
import resume from './src/resume.yml'

// https://github.com/jantimon/html-webpack-plugin/issues/597#issuecomment-281663833
export default () => {
  const template = require('./src/views/resume.pug')
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
