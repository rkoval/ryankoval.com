require('../node_modules/skeleton-css/css/normalize.css')
require('../node_modules/skeleton-css/css/skeleton.css')
require('../node_modules/paper-css/paper.css')

require('./js/smart-underline')

require('./less/resume.less')
require('./less/font.less')

// google analytics
if (PRODUCTION) {
  require('./js/ga/pageviews')
  require('./js/ga/track-outbound-clicks')
}
