$(function (){
    //璁㊣E10浠ヤ笅鐨処E鏀寔placeholder
    $('input, textarea').placeholder();
    $(".h-d").click(function(){
        var h = $(".header")
        if(h.hasClass("search-state")){
            $(".header").removeClass("search-state");
        }else{
            $(".header").addClass("search-state");
            setTimeout(function(){
                $(".h-j").focus();
            },300)
        }
    })
    $(".h-f").each(function(){
        if($(this).children("div").length){
            $(this).addClass("has-nav")
        }
    })
    $(".sub-one").each(function(){
        $(this).parents(".h-f").css("position","relative")
    })

    $(".h-f").mouseenter(function(){
        $(this).find(".sub-a").stop().slideDown(300);
    })

    $(".h-f").mouseleave(function(){
        $(this).find(".sub-a").stop().slideUp(200);
    })

    $(".sub-a").mouseenter(function(){
        $(this).stop().slideDown(300);
    })

    $(".sub-a").mouseleave(function(){
        $(this).stop().slideUp(200);
    })
});