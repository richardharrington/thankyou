//=====================================//
//======== Font license info  =========//
//=====================================//
/*    
## Entypo
   Copyright (C) 2012 by Daniel Bruce
   Author:    Daniel Buce
   License:   SIL (http://scripts.sil.org/OFL)
   Homepage:  http://www.entypo.com

## Font Awesome
   Copyright (C) 2012 by Dave Gandy
   Author:    Dave Gandy
   License:   CC BY 3.0 (http://creativecommons.org/licenses/by/3.0/)
   Homepage:  http://fortawesome.github.com/Font-Awesome/

## Web Symbols
   Copyright (c) 2011 by Just Be Nice studio. All rights reserved.
   Author:    Just Be Nice studio
   License:   SIL (http://scripts.sil.org/OFL)
   Homepage:  http://www.justbenicestudio.com/studio/websymbols/
*/
//=====================================//

$(document).on('keydown',function(e){
	if(e.which==40) {
		scrollToNext();
	} else if(e.which==38) {
		scrollToPrev();
	}
});

$('div#timeline_container').on('click','li', function(){
	showNext($(this));
});

function showNext(li){
	var $itms=$('div#timeline_container li');
	$itms.removeClass('active');
	$(li).addClass('active');
	$('html,body').stop().animate({ scrollTop: $(li).offset().top-$(li).height()}, 500,function(){
		$('html,body').stop();
	});
}

function scrollToNext() {
	var $itms=$('div#timeline_container > ul > li');
	var $current=$itms.index($('div#timeline_container li.active'));
	
	if ($($itms[$current+1]).length>0 && !$($itms[$current+1]).hasClass('hidden')) {
		$itms.removeClass('active');
		$($itms[$current+1]).addClass('active');
		$('html,body').stop().animate({ scrollTop: $($itms[$current+1]).offset().top-$($itms[$current+1]).height()}, 500);
	} else {
		$('html,body').stop().animate({ scrollTop: $(document).height()}, 500);
	}
}
function scrollToPrev() {
	var $itms=$('div#timeline_container > ul > li');
	var $current=$itms.index($('div#timeline_container li.active'));
	
	if ($($itms[$current-1]).length>0 && !$($itms[$current-1]).hasClass('hidden')) {
		$itms.removeClass('active');
		$($itms[$current-1]).addClass('active');
		$('html,body').stop().animate({ scrollTop: $($itms[$current-1]).offset().top-$($itms[$current-1]).height()}, 500);
	} else {
		$('html,body').stop().animate({ scrollTop: 0}, 500);
	}
}
