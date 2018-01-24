import moment from 'moment'
import _ from 'lodash'

import fontawesome from '@fortawesome/fontawesome'
import {
  faFilePdf,
  faEnvelope,
  faBookmark,
} from '@fortawesome/fontawesome-free-regular'
import { faLinkedin, faGithub } from '@fortawesome/fontawesome-free-brands'
import { faAngleDoubleRight } from '@fortawesome/fontawesome-free-solid'

const resume = require('./src/resume.yml')

// https://github.com/jantimon/html-webpack-plugin/issues/597#issuecomment-281663833
export default () => {
  const template = require('./src/views/about.pug')
  return template(
    Object.assign(
      {
        moment,
        _,
        iconStyles: fontawesome.dom.css(),
        icons: {
          // TODO update these to be fixed-width when they document how to?
          faFilePdf: fontawesome.icon(faFilePdf).html[0],
          faEnvelope: fontawesome.icon(faEnvelope).html[0],
          faBookmark: fontawesome.icon(faBookmark).html[0],
          faGithub: fontawesome.icon(faGithub).html[0],
          faLinkedin: fontawesome.icon(faLinkedin).html[0],
          faAngleDoubleRight: fontawesome.icon(faAngleDoubleRight).html[0],
        },
      },
      resume
    )
  )
}
