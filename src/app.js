require('./less/font.less')
require('./less/style.less')

require('./js/wow')
require('./js/showmore')

// google analytics
if (PRODUCTION) {
  require('./js/ga/ga')
  require('./js/ga/track-outbound-clicks')
}
