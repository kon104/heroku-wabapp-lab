
$(function(){
	$('.hamburger').click(function(){
		$('.hamburger').toggleClass('active');
		$('.menu').toggleClass('open');
	});
	$('.close-menu').click(function(){
		$('.hamburger').removeClass('active');
		$('.menu').removeClass('open');
	});
});

