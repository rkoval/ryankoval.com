import moment from 'moment-timezone'
import _ from 'lodash'
import resume from './src/resume.yml'

import fontawesome from '@fortawesome/fontawesome'
import { faFilePdf } from '@fortawesome/fontawesome-free-solid'

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
