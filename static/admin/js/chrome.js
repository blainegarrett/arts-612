/* */

$(document).ready(function () {
  $(window).bind('resize', set_chrome_height).trigger('resize');
});

function set_chrome_height() {
	var window_height = $(window).height();
	
	window_height = window_height - $('#main-content-footer').outerHeight();
	window_height = window_height - 75; /* Account for fixed menu padding*/
	$('#main-content-container').css({'minHeight': window_height}).height(window_height);
	
	//TODO: Do not set height if there is content...
}
