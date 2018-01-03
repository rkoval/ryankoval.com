require('./less/main.less')

require('./js/wow')
require('./js/showmore')

// google analytics
if (PRODUCTION) {
  require('./js/ga/ga')
  require('./js/ga/track-outbound-clicks')
}
