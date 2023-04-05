$(function () {

});

//search
$(".search").click(function(){
    if($(this).hasClass("on")){
        $(this).removeClass("on");
        $(this).siblings(".sh_03").fadeOut(500);
        $(".ul_02").fadeIn(300);
    }
    else{
        $(this).addClass("on");
        $(this).siblings(".sh_03").fadeIn(500);
        $(".ul_02").fadeOut(300);
    }
})

//scroll
$(document).ready(function(){
    var p=0;
    $(window).scroll(function(e){
        p = $(this).scrollTop();
        if(p>145){
            $(".h-a").slideUp(200);
        }
        else{
            $(".h-a").slideDown(200);
        }
    });
});


//浜岀骇瀵艰埅鏍�
$(".ul_02 .li").hover(function(){
    $(this).children(".sub").stop(true,true).slideDown(500);
},function(){
    $(this).children(".sub").stop(true,true).slideUp(0);
})

function  show(data) {
    var b;
    //鐢ㄦ鍒欒繃鍘婚潪娉曡姹�
    var pattern = new RegExp("[`~!#$^&*()=|{}';',\\[\\]<>銆娿€�/?~锛�#锟モ€︹€�&*锛堬級鈥斺€攟{}銆愩€慮");
    if(pattern.test(data)){
        alert("鎿嶄綔涓嶅悎娉�");
        b= false;
    }
    var pattern1 = new RegExp("/((\\%3C)|<)((\\%2F)|\\/)*[a-z0-9\\%]+((\\%3E)|>)/ix");
    if(pattern1.test(data)){
        alert("鎿嶄綔涓嶅悎娉�");
        b= false;
    }
    var pattern2 = new RegExp("/((\\%3C)|<)[^\\n]+((\\%3E)|>)/I");
    if(pattern2.test(data)){
        alert("鎿嶄綔涓嶅悎娉�");
        b= false;
    }
    return b;
}