var trackOutboundLink = function(url) {
  ga('send', 'event', 'outbound', 'click', url, {'hitCallback': function () { document.location = url; } });
};
// dynamically append function to links with href
$(document).ready(function() {
  var hrefLinks = $('a.tracked');
  hrefLinks.each(function() {
    $(this).attr('onclick', 'trackOutboundLink("' + this.href + '"); return false;');
  });
});
