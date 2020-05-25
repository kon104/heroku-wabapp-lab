
$(function(){
	$('.hamburger').click(function(){
		$('.hamburger').toggleClass('active');
		$('.manual').toggleClass('open');
	});
	$('.close-manual').click(function(){
		$('.hamburger').removeClass('active');
		$('.manual').removeClass('open');
	});
});

