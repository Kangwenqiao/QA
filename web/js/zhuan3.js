$(function(){
    var t=$('.main-relative')[0].offsetTop;
    var H=parseInt($('.main-relative').css('height'));
    var h=parseInt($('.nav-position').css('height'));

    $(window).on('scroll',function(e){
        var scroll=$('html').scrollTop()||$('body').scrollTop();
        if(((scroll-t) > 0) && ((scroll-t) < (H-h))){
            $('.nav-position').addClass('nav-fixed');
            $('.nav-position').removeClass('nav-absolute');
        }else if((scroll-t) > (H-h)){
            $('.nav-position').removeClass('nav-fixed');
            $('.nav-position').addClass('nav-absolute');
        }else{
            $('.nav-position').removeClass('nav-fixed');
            $('.nav-position').removeClass('nav-absolute');
        }
    })
});