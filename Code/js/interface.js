/*
* Based on http://codepen.io/hendrysadrak/pen/yNKZWO
* @PROD: need to be optimized for 60fps
* @TODO: handle click events
*/
$(document).on('mouseover', '.ripple', function(e) {
	var $rippleElement = $('<span class="ripple-effect" />'),
    $buttonElement = $(this),
    btnOffset = $buttonElement.offset(),
    xPos = e.pageX - btnOffset.left,
    yPos = e.pageY - btnOffset.top,
    size = parseInt(Math.max($buttonElement.height(), $buttonElement.width())),
    animateSize = parseInt(Math.max($buttonElement.width(), $buttonElement.height()) * Math.PI);
  $rippleElement
    .css({
      top: yPos,
      left: xPos,
      width: size,
      height: size,
			color: 'white',
      backgroundColor: $buttonElement.attr('color'),
			opacity: 0
    })
    .appendTo($buttonElement)
		.data('created', new Date().getTime())
		.delay(250)
    .animate({
      width: animateSize,
      height: animateSize,
      opacity: 0.5
    }, { duration: 500, easing: 'swing' });
});
$(document).on('mouseout', '.ripple', function(e) {
	var $rippleElement = $('.ripple-effect', this);
	if (new Date().getTime() - $rippleElement.data('created') <= 250)
		$rippleElement.remove();
	else
		$rippleElement.animate({
			width: 10,
			height: 10,
			opacity: 0
		}, 350, function() {
			$(this).remove();
		});
});


$(function(){
  if (!settings.data().ui.scale.isSet())
    settings.data().ui.scale.set(1);

  var vh = settings.data().ui.scale.get()*450;
  var vw = settings.data().ui.scale.get()*350;

  $('html').css({
    width: vh+'px',
    height: vw+'px'
  });

  browser.getView().view.update();
});