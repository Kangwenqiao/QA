;$(function () {
  var $headerComponent = $("#header");
  var isGlobalNewHeader = $('#header').hasClass('global-header')
  var $navLeft = $headerComponent.find('.header-navbar').find('.nav-left-item');
  $('.search.new-search').on('click', function(e){
      e.stopPropagation()
      $(".nav-box").parent().removeClass('active')
      $('.header-all').hide().siblings('.search-div').show().find('input').focus()
  })
  $('.mobile-search-icon').on('click', function(){
    $('.header-all').hide().siblings('.search-div').show().find('input').focus()
  })
  var clearDiv =  $('.search-wrap').find('.clear')
  clearDiv.on('click', function(){
    $('body .layout').remove();
    if($(document).width()<1024){
      $('.search-div').hide()
      $(this).siblings('#headerSerachInput').val('')
    }else{
      $('.search-div').hide().siblings('.header-all').show()
    }
  })
  $('.search-div').on('click', function(e){
     e.stopPropagation()
  })
  // $(document).on('click', function(){
  //     if($(document).width()>1024) {
  //       $('.search-div').hide().siblings('.header-all').show()
  //     }
  // })
  // var $expandArrow = $('#header .mobile-bottom-nav .title:not(.no-expand)');
  var $expandArrow = $('.mobile-nav-li').find('p.title');
  $expandArrow.on('click', function(e){
    e.stopPropagation()
    var _this=$(this)
    var hasDownClass = $(this).find('img').hasClass('down-expand')
    var hasLangClass = $(this).parent().hasClass('lang')
    if(hasDownClass){
      $(this).find('img').removeClass('down-expand')
      if($(this).parent().parent().find('.second-nav-box').length){
        $(this).parent().parent().find('.second-nav-box').hide()
      } else {
        $(this).parent().parent().find('.second-nav').hide()
        $(this).parent().parent().find('.second-nav .mobile-nav-li img.down-expand').removeClass('down-expand')
      }
    } else {
      if (!hasLangClass) {
        var arrowParent = $(this).closest('.product-menu');
        if(arrowParent.hasClass('product-software')) {
              var subCategoryUl = $(this).parent().next('.second-nav-box');
              var resourcePath = $(this).attr("data-resource");
              requestSubProductRequest(resourcePath, function(data){
                  data.categoryName=_this.data('category')
                  subCategoryUl.html(tmpl('tmpl-mob-software-product-category', data));
                  cnAltLink('.mobile-bottom-nav .product-software .second-nav-box .alt-link-lazy',true);
                  $('.product-dd-box .product-dd-title').on('click', function(e){
                    e.stopPropagation();
                    $(this).parent('.product-dd-box').hide();
                  })
                  $('.second-nav-box dd.has-next').on('click', function(){
                    var $this = $(this);
                    $this.find('.product-dd-box').show();

                   })
                   $('.second-nav-box dd p a').on('click', function(e){
                     e.stopPropagation();
                   })
              }, "cn");
        } else {
          var template = 'tmpl-mob-product-sub-category';
          var subCategoryUl = $(this).parent().parent().find('.second-nav-box');
          var path= $(this).find('a').attr('href');
          var category = $(this).attr('data-category');

          if(typeof(path) !== 'undefined' && typeof(path.replaceAll) !== 'undefined') {
          getChildNavInfo(path.replaceAll(".html", ""), category, subCategoryUl, template, function () {
            $('.product-dd-box .product-dd-title').on('click', function(e) {
              e.stopPropagation();
              $(this).parent('.product-dd-box').hide();
            });
            // mob导航埋点二级
            $.each($('.mobile-bottom-nav .bottom-product-box.product .mobile-nav-li .second-nav-box dl dd a'), function (index, item) {
              var href = $(this).attr('href')
              var preModule = 'main_menu::products_sub_category::'
              var lastHrefIndex = lastNode(href);
              $(this).attr('data-at-module', preModule + lastHrefIndex);
            })
                //mobile  solution 二级导航
            $.each($('.mobile-bottom-nav .bottom-product-box.solution .mobile-nav-li .second-nav-box dl dd a'), function (index, item) {
              var href = $(this).attr('href')
              var preModule = 'main_menu::solution::'
              var lastHrefIndex = lastNode(href);
              $(this).attr('data-at-module', preModule + lastHrefIndex);
            })
                // support  二级埋点
            $.each($('.mobile-bottom-nav .bottom-product-box.support .mobile-nav-li .second-nav-box dl dd a'), function (index, item) {
              var href = $(this).attr('href')
              var preModule = 'main_menu::support::'
              var lastHrefIndex = lastNode(href);
              $(this).attr('data-at-module', preModule + lastHrefIndex);
            })
            cnAltLink('.mobile-bottom-nav .product-hardware .second-nav-box .icon-next .fis-a.alt-link-lazy',true)
            
            lazyLink();

            $('.second-nav-box dd.has-next').on('click', function() {
              var $this = $(this);
              var path= $(this).find('p').find('a').attr('href');
              var categoryName=$this.attr('data-category');
              var subCategoryName=$this.attr('data-subcategory');
              getChildNavInfo(path.replaceAll(".html", ""), categoryName, $(this).find('.product-dd-box').find('.box'), "tmpl-mob-tertiary-category",function() {
                $this.find('.product-dd-box').show();
                $.each($this.find('.product-image').find('img'), function(i, t){
                  if($(this).data('original')){
                    $(this).attr('src', $(this).data('original'))
                  }
                })
                //中文站移动端三级导航埋点
                cnAltLink('.mobile-bottom-nav .product-hardware .second-nav-box .product-dd-box .alt-link-lazy',true)
              },subCategoryName);
            });
            $('.second-nav-box dd p a').on('click', function(e) {
              e.stopPropagation();
            });
          });
          }
        }
      }

      $(this).find('img').addClass('down-expand');

      if($(this).parent().parent().find('.second-nav-box').length){
        $(this).parent().siblings('.second-nav-box').show().parent().css({height: 'auto'})
      } else {
        $(this).parent().siblings('.second-nav').show().parent().css({height: 'auto'})
      }

    }
  })

  var backTopTo = $('.mobile-nav-box').find('ul').find('li.top')
  backTopTo.on('click', function(e){
    e.stopPropagation()
    $(this).parent().parent().hide()
  })
  var mobileLi = $('.mobile-nav').find('ul').find('li')
  var lanLi = $('.lang-box').find('.lang-span')
  mobileLi.on('click', function(e){
    e.stopPropagation()
    $(this).find('.mobile-nav-box').show()
  })
  lanLi.on('click', function(e){
    e.stopPropagation()
    $(this).parent().find('.mobile-nav-box').show()
  })
  $('.navigation').on('click', function(){
    var isHideClass = $(this).find('.nav-cha').is(":hidden")
    $('.mobile-nav-box').hide()
    $('.mobile-bottom-nav').find('li').removeClass('active')
    $('.image-text-div').removeClass('active')
   // $('.bottom-product-box').hide()
    if(isHideClass){
      $(this).find('.nav-cha').show()
      $(this).find('.navigation-span-warp').hide()
      $(this).siblings('.mobile-nav').show()
      $('#header.cn-header .mobile-right-mini-menu').removeClass('show-close')
      $('#header.cn-header .mobile-nav-right-menu').hide()
      $('#header').css({'z-index': '3333333'})
      $('html').addClass('overflow-prevent')
    } else {
      $(this).find('.nav-cha').hide()
      $(this).find('.navigation-span-warp').show()
      $(this).siblings('.mobile-nav').hide()
      $('#header').css({'z-index': '3'})
      $('html').removeClass('overflow-prevent')
    }
  })
  var mobLi = $('#header .mobile-bottom-nav').find('li').find('.image-text-div');
  var cha = $('#header .mobile-bottom-nav').find('li').find('.bottom-product-box').find('.cha');
  var mask = $('#header .mobile-bottom-nav').find('li').find('.bottom-product-box').find('.mask');
  var productTab= $('#header .mobile-bottom-nav').find('li').find('.bottom-product-box').find('.mask').find('.product-tab');
  var chaMask = $('#header .mobile-bottom-nav').find('li').find('.bottom-product-box').find('.cha-mask');
  var maskProduct= $('#header .mobile-bottom-nav').find('li').find('.bottom-product-box').find('.mask').find('.product');
  mobLi.on('click', function(){
    $(this).addClass('active')
    $(this).parent().addClass('active')
    $(this).parent().siblings().removeClass('active')
    $(this).parent().siblings().find('.image-text-div').removeClass('active')
    $("body").css({
      overflow:'hidden'
    })
    var isHideClass = $('.nav-cha').is(":hidden")
    $('#header').css({'z-index': '3333333'})
    if(!isHideClass){
      $('.nav-cha').parent().find('.nav-cha').hide()
      $('.nav-cha').parent().find('.navigation-span-warp').show()
      $('.nav-cha').parent().siblings('.mobile-nav').hide()
    }
  })
 cha.on('click', function(){
   $(this).parent().parent().parent().parent().removeClass('active')
   $(this).parent().parent().parent().siblings().removeClass('active')
   $('#header').css({'z-index': '3'})
   $('body').css({
     overflow:'auto'
   })
 })
 maskProduct.each(function () {
    $(this).on('click', function(e){
     stopPropagation(e);
   })
 });
 chaMask.each(function () {
    $(this).on('click', function(e){
     stopPropagation(e);
    })
 });
 mask.each(function(index){
    var _this = $(this);
    $(this).on('click', function(e){
      closeTab(_this);
      stopPropagation(e);
    })
 })
 if(productTab.length) {
    productTab.on('click',function(e) {
       stopPropagation(e);
    })
 }
 var closeTab = function(_this){
   _this.parent().parent().removeClass('active')
   _this.parent().siblings().removeClass('active')
   $('#header').css({'z-index': '3'})
   $('body').css({
     overflow:'auto'
   })
 }
 var stopPropagation = function(e) {
   if ( e && e.stopPropagation )
    e.stopPropagation();
 else
    window.event.cancelBubble = true;
 }

  var $hardwareBox = $('#header .mobile-bottom-nav .product-hardware');
  var $softwareBox = $('#header .mobile-bottom-nav .product-software');
  var $hardwareTab = $('#header .mobile-bottom-nav .tab-hardware');
  var $softwareTab = $('#header .mobile-bottom-nav .tab-software');
  $hardwareTab.on('click', function(e){
     $softwareTab.removeClass('active');
     $hardwareTab.addClass('active');
     $hardwareBox.show();
     $softwareBox.hide();
  });

  $softwareTab.on('click', function(e){
     $softwareTab.addClass('active');
     $hardwareTab.removeClass('active');
     $hardwareBox.hide();
     $softwareBox.show();
  });

 $('.clear-mask').on('click', function(e){
    e.stopPropagation()
     $(this).parent().parent().parent().parent().removeClass('active')
     $('.nav-left-item').removeClass('active')
 })
 $('.lang-clear-mask').on('click', function(e){
  e.stopPropagation()
   $(this).parent().parent().parent().parent().removeClass('active')
  // $(this).parent().parent().parent().hide()
   $('.nav-left-item').removeClass('active')
   $('.nav-left-item').removeClass('activeLan')
})
$('#header .nav-box .mask').on('click', function(e){
   e.stopPropagation();
})
 $('.nav-box').on('click', function(e){
   e.stopPropagation()
   $(this).parent().removeClass('active')
   if($(this).parent().hasClass('lang')){
     $(this).hide()
   }
 })
 $('.nav-box').on('mousemove', function(){
   $(this).parent().removeClass('active')
  if($(this).parent().hasClass('lang')){
    $(this).hide()
  }
 })
 $('.nav-box .mask').on('mousemove', function(e){
   e.stopPropagation()
})

 $('.product-dd-box .product-dd-title').on('click', function(e){
   e.stopPropagation()
   $(this).parent('.product-dd-box').hide()
 })
 var tid = null;
  $navLeft.hover(function(e){
     e.stopPropagation()
     var self = this
      tid = setTimeout( function() {
      $(self).addClass('active', function(){
        if($(this).find('.support-mask').length) {
         // $(self).find('.box-fis-li.active').trigger('mouseover')
          var mHeight =  $(this).find('.support-mask').height()<634 ? $(this).find('.support-mask').height() : 700
        //  $(this).find('.support-mask').find('.support-line-box').css({height: mHeight + 'px'})
        }
        // find('.mask').find('.support-line-box').css({height: '700px'})
      })
      $(self).siblings().removeClass('active')
      if(isGlobalNewHeader){
         // $('.nav-left-item.lang').find('.nav-box').hide()
      var divSecond = $(self).find('.box-fis-li.active')
      var dWidth = $(document).width()
      var solutionMask = $(divSecond).parent().parent().parent().hasClass('solution-mask')
      var productMask = $(divSecond).parent().parent().parent().hasClass('product-mask')
      var supportMask = $(divSecond).parent().parent().parent().hasClass('support-mask')
      var maskDdLength = $(divSecond).find('.second-dl dl dd')
      var maskHeight = (solutionMask? maskDdLength.length>=7?7:isOdd(maskDdLength.length):maskDdLength.length)*(solutionMask ? dWidth>=1440?65:50 : (dWidth>=1440?36:28))
      var parentHeight = $(divSecond).parent().height()-55
      if(parentHeight <220){
        parentHeight = 220
      }
      if(maskHeight < 220){
        maskHeight = 220
      }
      if(maskDdLength){
        if(maskHeight>=parentHeight) {
          if($(divSecond).parent().parent().parent().hasClass('product-mask')){
            $(divSecond).parent().parent().css({
              height: maskHeight + (dWidth<=1440?-50:22) +'px'
            })
          } else if($(divSecond).parent().parent().parent().hasClass('solution-mask')){
            $(divSecond).parent().parent().css({
              height: maskHeight + (maskDdLength.length>6 ? 160 : 100) +'px'
            })
          } else if($(divSecond).parent().parent().parent().hasClass('about-mask')){
            var img = new Image();
            img.src = $(divSecond).find('.nav-detail-box .lazy-image').attr('src');
            var imgHeight = img.height >=400 ? 400 :img.height
            $(divSecond).parent().parent().css({
                height: (maskHeight>imgHeight?maskHeight:imgHeight-80) + (dWidth<=1440?80:120) +'px'
            })
          } else if($(divSecond).parent().parent().parent().hasClass('support-mask')){
            var activeProductDdliLen = $(divSecond).find('.nav-detail-box li').length
            $(divSecond).parent().parent().css({
              height: maskHeight + (activeProductDdliLen ? 162: 62) +'px'
            })
          } else {
            $(divSecond).parent().parent().css({
              height: maskHeight + (dWidth<=1440?90:140) +'px'
            })
          }
        } else {
          var rHeight = $(divSecond).parent().find('.box-fis-li').length>=15 ? 100 : (dWidth >= 1440? solutionMask ? 160: 80:80)
          $(divSecond).parent().parent().css({
                  height: parentHeight + (productMask ? rHeight-15: supportMask ? rHeight-20 : rHeight) +'px'
                })
        }
      }
      }

    //  defaultOpenMenu()
      // if($(this).find('.mask').hasClass('support-mask')) {
      //   var mHeight =  $(this).find('.mask').height()<=720 ?  $$(this).find('.mask').height() : 700
      //    console.log('mHeight66', mHeight)
      //    $(this).find('.mask').find('.support-line-box').css({height: mHeight+ 'px'})
      // }
    //  countMaskHeight($(self).find('.nav-box').find('.box-ul>li')[1])
      var liLens = $(self).find('.nav-box').find('.box-ul>li').length
      if(liLens>=14){
          $(self).find('.nav-box').find('.fmore').show()
          // if($(self).find('nav-box .mask').hasClass('global-solution-mask')){
          //   $(self).find('.nav-box .mask.global-solution-mask').css({height:'800px'})
          // } else {
          //   $(self).find('.nav-box .mask.solution-mask').css({height:'880px'})
          // }
          $(self).find('.nav-box .mask.solution-mask').css({height:'880px'})
      }
      if(liLens>=16){
        $(self).find('.nav-box').find('.global-product-more').show()
      }
       }, 200 );
     },
     function(e){
       e.stopPropagation()
       clearTimeout( tid );
      }
     )
 var tidlan = null
 var countBoolean = false
  $('.navbar-nav-list.right').find('.nav-left-item').hover(function(e){
    e.stopPropagation()
     var self = this
     if($(self).hasClass('lang')){
      countBoolean = true
     }
     tidlan = setTimeout(function(){
       if($(self).hasClass('lang')){
        $(self).addClass('activeLan').addClass('active')
        $(self).siblings().removeClass('activeLan').removeClass('active')
       } else {
      //  $(self).siblings('.lang').addClass('activeLan')
      //  $(self).siblings().removeClass('activeLan')
       }
      }, 300)
    }, function(e){
      e.stopPropagation()
      var self =  this
      countBoolean = false
      clearTimeout(tidlan)
      // if($(self).hasClass('lang')){
      //   $(self).removeClass('activeLan').removeClass('active')
      //  }
      setTimeout(function(){
        if($(self).hasClass('lang') &&  !countBoolean){
            $(self).removeClass('activeLan').removeClass('active')
        }
        //$(self).siblings('.lang').removeClass('activeLan').removeClass('active')
       // $('.new-banner-full').show()
      }, 300)
    }
  )
  $('.navbar-nav-list.right').find('.nav-left-item').on('mouseover', function(e){
     e.stopPropagation();
  })

   $('.nav-left-item').on('mousemove', function(e){
     e.stopPropagation()
   })

    $('#header').hover(function(){
      $('.nav-left-item').removeClass('has-active')
      }, function(){
        $('.nav-left-item').removeClass('has-active')
    })

  var timend= null
  $('.boxli').hover(function(e){
    e.stopPropagation()
    var self = this
    timend = setTimeout(function(){
      $(self).siblings().removeClass('active')
      $(self).parent().siblings().removeClass('active')
      $(self).parent().parent().parent().parent().siblings().removeClass('active')
      $(self).parent().siblings().find('li').removeClass('active')
      $(self).addClass('active')
    }, 150)
  }, function(e){
    e.stopPropagation()
    clearTimeout(timend)
  })
  function isOdd(length){
    if(length%2 === 0){
      return length
    } else {
      return length + 1
    }
  }
  var time3 = null;
  $('#header .box-fis-li .second-dl').hover(function (e) {
    e.stopPropagation()
  })
  $('#header .box-fis-li').hover(function (e) {
    e.stopPropagation()
    var self = this
    var dWidth = $(document).width()
    var solutionMask = $(self).parent().parent().parent().hasClass('solution-mask')
    var productMask = $(self).parent().parent().parent().hasClass('product-mask')
    var supportMask = $(self).parent().parent().parent().hasClass('support-mask')
    var partnerMask = $(self).parent().parent().parent().hasClass('about-mask')
    time3 = setTimeout(function () {
      $(self).siblings().removeClass('active')
      $(self).find('.second-dl').find('dd').removeClass('active')
      $(self).find('.second-dl').find('dd').find('li').removeClass('active')
      $(self).find('.second-dl').find('dl').find('dd:nth-of-type(1)').addClass('active')
      $(self).find('.second-dl').find('dd:nth-of-type(1)').find('li:nth-of-type(1)').addClass('active')
      $(self).addClass('active')
      if (productMask) {
        var $div = $(self).find('.second-dl');
        var $mask = $('#header.global-header .product-mask');
        initHeight($div, $mask);
      }
      if (supportMask) {
        var $div = $(self).find('.second-dl');
        var $mask = $('#header.global-header .support-mask');
        initHeight($div, $mask);
      }
      if (partnerMask) {
        var $div = $(self).find('.second-dl');
        var $mask = $('#header.global-header .about-mask');
        initPartner($div, $mask);
      }
      if (!$(self).parent().parent().hasClass("product-software-container")) {
        initCategoryHover($(self));
        cnAltLink('.product-software-container .sections-detail .sub-item.alt-link-lazy ', true)
      } else {
        var subCategoryUl = $(self).find('.sections-detail');
        var resourcePath = $(self).attr("data-resource");
        if (resourcePath) {
          requestSubProductRequest(resourcePath, function (data) {
            data.categoryName = $(self).data('category')
            subCategoryUl.html(tmpl('tmpl-software-product-category', data));
            //中文站软件产品pc端埋点
            cnAltLink('.product-software-container .sections-detail .sub-item.alt-link-lazy ', true)
          }, "cn");
        }
      }
    }, 100)
  }, function (e) {
    e.stopPropagation()
    clearTimeout(time3)
  })
  $('.lanli').on('click', function(e){
      e.stopPropagation()
      var aHref = $(this).attr('data-href')
      window.open(aHref, '_self')
  })
  var headTimer, delayTime = 30;
   /*
   计算最外层mask的高度
  */
 var countMaskHeight = function(self){
  var countCurrent = $(self).find('.second-dl')
  if(countCurrent) {
   var ddLens = countCurrent.find('dl').find('dd')
   if(!$(self).parent().parent().parent().parent().parent().hasClass('lang')){
    $(self).parent().parent().parent().removeClass('lang-active')
    if(ddLens.length>4){
      $(self).find('.more:not(".global-slution-more")').show()
      $(self).parent().parent().parent().addClass('max-height')
    } else {
      $(self).parent().parent().parent().removeClass('max-height')
      $(self).find('.more:not(".global-slution-more")').hide()
    }
   } else {
    if(ddLens.length>10){
      $(self).parent().parent().parent().addClass('lang-active')
    } else {
      $(self).parent().parent().parent().removeClass('lang-active')
    }
   }
  }
 }

  $(".nav-left-item.lang").on('click', function (e) {
     e.stopPropagation()
     $(this).addClass('active')
      $(this).find('.nav-box').show()
  });

    var $productPCTab = $('#header .nav-left-item .product-software-hardware-tab .item');
    var SUPPORTTOUCH = 'ontouchstart' in window || navigator.msMaxTouchPoints;
    if(SUPPORTTOUCH) {
        $productPCTab.on('click', function(e) {
            switchTab(e, $(this));
        });
    } else {
        $productPCTab.on('click', function(e) {
            var aHref = $(this).attr('data-href')
            window.open(aHref, '_self')
        });
        var time = null;
        $productPCTab.hover(function(e) {
            var _this = $(this);
            time = setTimeout(function() {
                switchTab(e, _this);
            },150)
        }, function(e){
                e.stopPropagation();
                clearTimeout(time);
          }
        );
    }
    var switchTab = function(e, _this) {
        var $outerContainer = _this.closest('.product-nav-item');
        var $hardwareContainer = $outerContainer.find('.product-hardware-container');
        var $softwareContainer = $outerContainer.find('.product-software-container');

        e.stopPropagation();
        _this.addClass('active');
        _this.siblings().removeClass('active');
        if (_this.hasClass('hardware-tab')) {
            $hardwareContainer.addClass('active');
            $softwareContainer.removeClass('active');
        } else {
            $hardwareContainer.removeClass('active');
            $softwareContainer.addClass('active');
        }
    }
    /**
     * lazy load product data
     * @param container
     */
    var time4 = null
    var initProductSubCategoryHover = function (container) {
        if (container) {
            container.find('.product-nav-dd').hover(function (e) {
                e.stopPropagation();
                var $this = $(this);
                time4 = setTimeout(function(){
                  $this.siblings().removeClass('active');
                  $this.siblings().find('li').removeClass('active');
                  $this.addClass('active');
                  $this.find('li').removeClass('active');
                  $this.find('li:nth-of-type(1)').addClass('active');
                }, 150)
            }, function(e){
                e.stopPropagation();
                clearTimeout(time4)
            });
        }
    };
    /**
     * lazy load product data
     */
    var initCategoryHover = function (categoryItem) {
        var navProduct = categoryItem.find('.nav-product');
        var $this = $(this);
        if (navProduct.length > 0) {
            var subCategoryContainer = categoryItem.find('.second-dl');
            var productNavDd = subCategoryContainer.find(".product-nav-dd");
            if (!productNavDd || productNavDd.length === 0) {
                clearTimeout(headTimer);
                headTimer = setTimeout(function () {
                    var link = navProduct.find(".at-navigation");
                    if (link.length === 0) {
                        link = navProduct.find(".at-lazy");
                    }

                    var path = link.attr("href");
                    if (path && path.indexOf("products") > 0) {
                        var subCategoryUl = subCategoryContainer.find(".product-config");
                        if(subCategoryUl.length == 0){
                            //中文站
                            subCategoryUl = subCategoryContainer.find("dl");
                        }
                        var category = subCategoryUl.data("category");
                        var template = "tmpl-product-sub-category";
                        getChildNavInfo(path.replaceAll(".html", ""), category, subCategoryUl, template, function () {
                            categoryItem.find(".product-nav-dd[data-index=0]").addClass("active");
                            categoryItem.find(".product-dd-li[data-index=0]").addClass("active");
                            initProductSubCategoryHover(subCategoryContainer);
                            var $mask = $('#header.global-header .product-mask');
                            initHeight($(subCategoryContainer), $mask);
                            var time5 = null;
                            // pc端products二级导航埋点
                            cnAltLink('.product-nav-dd .fis-a.alt-link-lazy',true) //二级导航埋点
                            $.each($('.navbar-nav-list.clearfix .nav-left-item .box-ul .box-fis-li.clearfix.product-li .second-dl.clearfix .product-config .product-config-column .new-subcategory .new-title'), function (index, item) {
                              var href = $(this).attr('href')
                              var preModule = 'main_menu::products_sub_category::'
                              var lastHrefIndex = lastNode(href);
                              $(this).attr('data-at-module', preModule + lastHrefIndex);
                            })
                            // pc端products三级导航埋点
                              $.each($('.navbar-nav-list.clearfix .nav-left-item .box-ul .box-fis-li.clearfix.product-li .second-dl.clearfix .product-config .product-config-column .new-subcategory .new-content-wrap .new-content a'), function (index, item) {
                              var href = $(this).attr('href')
                              var preModule = 'main_menu::series::'
                              var lastHrefIndex = lastNode(href);
                              $(this).attr('data-at-module', preModule + lastHrefIndex);
                            })
                            lazyLink();
                            $('.boxli').hover(function(e){
                              e.stopPropagation()
                              var $this = $(this)
                              time5 = setTimeout(function(){
                                $this.siblings().removeClass('active')
                                $this.parent().siblings().removeClass('active')
                                $this.parent().parent().parent().parent().siblings().removeClass('active')
                                $this.parent().siblings().find('li').removeClass('active')
                                $this.addClass('active')
                              }, 150)


                            }, function(e) {
                              e.stopPropagation();
                              clearTimeout(time5);
                            });
                        });
                    }
                }, delayTime);
            }
        }
    };

    /**
     * ajax request child navigation
     */
    var getChildNavInfo = function (path, categoryName, ul, tmplName, callback,subCategoryName) {
        if (path && path.indexOf("products") > 0 && $.trim(ul.html()).length <= 0) {
            requestSubProductRequest(path, function (data) {
                if (data && data.result && data.result.length > 0) {
                    data.categoryName = categoryName;
                    data.path = path + ".html";
                    data.isIe = isIe();
                    data.subCategoryName = subCategoryName;
                    data.columns = ["1","2","3"];
                    ul.html(tmpl(tmplName, data));
                    if (callback) {
                        callback();
                    }
                } else {
                    if (callback) {
                        callback();
                    }
                }
                // for at sub category/tertiary category async at event
                var atTarge = ul.find("a.at-lazy");
                atModel.initAtNavigation(true, atTarge);
            });
        }
    };
    String.prototype.endsWith = String.prototype.endsWith || function (str) {
        var reg = new RegExp(str + "$");
        return reg.test(this);
    }
    /**
     * ajax request sub product
     */
    var requestSubProductRequest = function (path, callback, type) {
        var getCurrentPath = window.location.pathname.replace(".html", "");
        if (getCurrentPath.indexOf("/content/hikvision") < 0) {
            getCurrentPath = "/content/hikvision" + getCurrentPath;
        }
        if (getCurrentPath.endsWith("/")) {
            getCurrentPath = getCurrentPath.substring(0, getCurrentPath.length - 1);
        }
        $.ajax({
            type: "GET",
            url: getCurrentPath + ".getHeaderProduct.json",
            data: {
                "path": path,
                "type": type
            },
            dataType: "json",
            success: function (resp) {
                if (callback) {
                    callback(resp);
                }
            },
            error: function () {
                console.log("get SubProductInfo by path failed");
            }
        });
    };
    function defaultOpenMenu(){
      $('.nav-left-item').find('dd').removeClass('active')
      $('.nav-left-item').find('li').removeClass('active')
      $.each($('.nav-left-item'), function(index, item){
          var currentBoxUlLis = $(this).find('.box-ul').find('.box-fis-li')
          var firstLi = currentBoxUlLis[0]
          if(firstLi){
              $(firstLi).addClass('active')
              var firstDd = $(firstLi).find('.second-dl').find('dl').find('dd')[0]
              if(firstDd){
                  $(firstDd).addClass('active')
                  $(firstDd).find('li').removeClass('active')
                  $(firstDd).find('li:nth-of-type(1)').addClass('active')
              }
              if($(firstLi).parent().parent().parent().hasClass('.support-mask')) {
                var mHeight =  $(firstLi).parent().parent().parent('.support-mask').height()<484 ?  $(firstLi).parent().parent().parent('.support-mask').height() : 700
               //  $(firstLi).parent().parent('.support-line-box').css({height: mHeight+ 'px'})
              }
          }

          if($(this).hasClass('product-nav-item')) {
              $(this).find('.product-software-container .box-fis-li:first-child').addClass('active');
          }
      })
  }
  function isIe(){
    return window.ActiveXObject || "ActiveXObject" in window
  }
  function lazyLink(){
    $('.cn-header-a').on('click', function(e){
      e.preventDefault()
      var ahref = $(this).data('href') || $(this).attr('href')
      // e.preventDefault有时不生效，为了防止a标签的跳转行为，这里手动去掉href属性。
      if ($(this).attr('href')) {
        $(this).removeAttr('href')
      }
   
      // 判断是否为本站地址是的话当前页打开，不是的话就新页面打开
      if((ahref.indexOf('http://') === -1 || ahref.indexOf('https://') === -1) && $(this).attr('target') != '_blank'){
        setTimeout(function() {
          window.open(ahref, '_self')
        }, 1000)
      } else {
        window.open(ahref, '_blank')
      }
    })
  }
  function ieTextOverllow(_self){
    if(isIe()){
        $.each($('.content-div .content-wrap'), function(index, element){
          if($(element).text().length>300){
            $(element).addClass('ie-content')
          }
        })
    }
  }

  //中文站导航埋点
  function cnAltLink(itemClass,lazy) {
    $(itemClass).unbind('click').on('click',function(e){
      e.preventDefault()
      var ahref = $(this).data('href') || $(this).attr('href')
      if(ahref && (ahref.indexOf('http://') === -1 || ahref.indexOf('https://') === -1) && $(this).attr('target') != '_blank'){
        setTimeout(function() {
          window.open(ahref, '_self')
        }, 1000)
      } else if(ahref) {
        setTimeout(function() {
          window.open(ahref, '_blank')
        }, 1000)
      }
      var pageTitle=$("#header").attr('data-page-title')
      var analyticsStr=$(this).attr('data-analytics')
      HiAnalyticsCn.clickDown( lazy ? analyticsStr+pageTitle : analyticsStr)
    })
    
  }

    function displayCnLogin(isShow, userName) {
        if (isShow) {
            $(".cn-header .login-username-dropdown.ul-dropdown.login").show();
            $(".cn-header .login-username-dropdown.ul-dropdown.no-login").hide();
            $('.cn-header .nav-left-item.login-username').addClass('logined');
            $('.cn-header .header-nav .mobile-right-mini-menu').addClass('logined');
            $(".cn-header .mobile-nav-right-menu").find(".login-li.login").show();
            $(".cn-header .mobile-nav-right-menu").find(".login-li.no-login").hide();

            // $(".login-username-dropdown.ul-dropdown.login .user-profile").find("a").text(userName);
            // $(".login-username-dropdown.ul-dropdown.login .user-profile").find("a").attr("title", userName);
            // $(".mobile-nav-right-menu").find(".hik-username").text(userName);
        } else {
            $(".cn-header .login-username-dropdown.ul-dropdown.login").hide();
            $(".cn-header .login-username-dropdown.ul-dropdown.no-login").show();
            $('.cn-header .nav-left-item.login-username').removeClass('logined');
            $('.cn-header .header-nav .mobile-right-mini-menu').removeClass('logined');
            $(".cn-header .mobile-nav-right-menu").find(".login-li.login").hide();
            $(".cn-header .mobile-nav-right-menu").find(".login-li.no-login").show();
        }
    }

    function changeContactUsPopLink(isLogin, id) {
        var $changeItem = $(".customer-service .item-need-login");
        if (isLogin) {
            var path = $changeItem.attr("href");
            path = path + "&sessionId=" + id;
            $changeItem.attr("href", path)
        } else {
            $changeItem.attr("href", $(".new-header-login").attr("data-path"))
        }
    }

    $('.new-header-login').unbind("click").click(function (e) {
        e.stopPropagation();
        setLoginCookie("redirectUrl", window.location.href);
        window.open($(this).attr('data-path'), '_self')
    });

    function buttonLoginHandle(isLogin){
        //button两种样式
        var $button = $('.hiknow-button, .hiknow-view');
        var loginPath = $(".new-header-login").attr("data-path");
        $button.each(function(){
            var checkLogin = $(this).find('a').data('download-checklogin-cn');
            if(checkLogin){
                if(!isLogin){
                    //未登录 弹框
                    $(this).find('a').unbind("click").click(function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        $(".login-required-comp-cn").show();
                    });
                }
            }
        })
    }

  $(document).ready(function () {
      initProductSubCategoryHover($(".product-nav-item"));
      defaultOpenMenu();
      ieTextOverllow();
      lazyLink();
      cnAltLink('.alt-link',false); 

      // cn站session认证
      var site = parseSiteFromUrl();
      if (site === "cn") {
          $('.cn-header .login-username.login').unbind("hover").hover(function (e) {
              e.stopPropagation();
              var loginClass = $(this).hasClass("logined") ? '.login' : '.no-login';
              $('.cn-header .login-username-dropdown.ul-dropdown' + loginClass).css({
                  'z-index': 999999,
                  'opacity': 1,
                  'top': '58px',
                  'display': 'block'
              })
          }, function (e) {
              e.stopPropagation();
              $('.cn-header .login-username-dropdown.ul-dropdown').css({
                  'z-index': -1,
                  'opacity': 1,
                  'top': '-600px',
                  'display': 'none'
              })
          });
          var hiknowId = storeManager.cookie.get("hiknow-id");
          if (!isNull(hiknowId)) {
              var url = $("#header.cn-header").attr("data-path");
              $.ajax({
                  type: "GET",
                  url: url + ".ticket." + hiknowId + ".json",
                  dataType: "json",
                  contentType: "application/json",
                  success: function (resultData) {
                      if (resultData.data && resultData.data.hikId) {
                          if (window.location.search.indexOf("ticket=") > -1 && window.history) {
                              // 支持History API
                              window.history.replaceState(null, "", window.location.href.split("?")[0])
                          }
                          displayCnLogin(true);
                          changeContactUsPopLink(true, resultData.data.hikId);
                          buttonLoginHandle(true);
                      } else {
                          displayCnLogin(false);
                          changeContactUsPopLink(false);
                          buttonLoginHandle(false);
                      }
                  }
              });
          } else {
              displayCnLogin(false);
              changeContactUsPopLink(false);
              buttonLoginHandle(false);
          }
      }
  });
  $('#header.global-header .product-nav-item').hover(function (e) {
    var $this = $(this);
    var liItem = $this.find(".box-fis-li.product-li.active");
    
    var $div = liItem.find('.second-dl');
    var $mask = $('#header.global-header .product-mask');
    initHeight($div, $mask);
  });
  $('#header.global-header .header-navbar').hover(function (e) {
    var $this = $(this);
    var productLiItem = $this.find(".nav-left-item.product-nav-item.active .box-fis-li.product-li.active");
    if(productLiItem) {
      var $div = productLiItem.find('.second-dl');
      var $mask = $('#header.global-header .product-mask');
      initHeight($div, $mask);
    }
    var supportLiItem = $this.find(".nav-left-item.support-nav-item.active .box-fis-li.active");
    if(supportLiItem) {
      var $div = supportLiItem.find('.second-dl');
      var $mask = $('#header.global-header .support-mask');
      initHeight($div, $mask);
    }
    var partnerLiItem = $this.find(".nav-left-item.partner-nav-item.active .box-fis-li.active");
    if(partnerLiItem) {
      var $div = partnerLiItem.find('.second-dl');
      var $mask = $('#header.global-header .about-mask');
      initPartner($div, $mask);
    }
  });
  var cl = 3;
  function initWaterfall($this,time) {
    if(!time)
      time = 300;
    setTimeout(function () {
      var items = $this.find(".waterfall-item");
      var heights = [];
      for (var i = 0; i < items.length; i++) {
        if (i < cl) {
          heights[i] = 0;
        } else {
          heights[i] = 0;
          var row = parseInt(i / cl);
          var column = i % cl;
          for (var temprow = 0; temprow < row; temprow++) {
            heights[i] += items[parseInt(temprow * cl + column)].offsetHeight;
          }
        }
      }
      var mxh = getMaxOfArray(heights);
      var mnh = $('#header.global-header .mask.product-mask .box-ul').height();
      var highlight = $this.find('.new-header-product-highlight-wrap');
      highlight ? highlight = highlight[0] : highlight = null;
      var $secondDL = $this.find('.second-dl');
      var top = parseInt($secondDL.css('top') ? $secondDL.css('top').split('px') : 0);
      var paddingTop = parseInt($this.closest('.mask').css('padding-top') ? $this.closest('.mask').css('padding-top').split('px') : 0);
      var definiteSpace = 6; //20(固定底部间距) - 14（二级间距/三级间间距/三四级间间距，目前均为14）
      var hhh = highlight ? highlight.offsetHeight : 0;
      
      if (mxh && !isNaN(mxh) && heights.indexOf(mxh) != -1) {
        mxh += items[heights.indexOf(mxh)].offsetHeight;

        if(mxh > mnh) {
          hhh += mxh + definiteSpace + top - paddingTop;
          $('#header.global-header .mask.product-mask').height(hhh);
          highlight ? highlight.style.top = mxh + definiteSpace + 'px' : '';
        } else {
          if(mnh - mxh >= 20) {
            hhh += mnh + definiteSpace - paddingTop;
            $('#header.global-header .mask.product-mask').height(hhh);
            highlight ? highlight.style.top = hhh - highlight.offsetHeight + 'px' : '';
          } else {
            hhh += mxh + definiteSpace + top - paddingTop;
            $('#header.global-header .mask.product-mask').height(hhh);
            highlight ? highlight.style.top = mxh + definiteSpace + 'px' : '';
          }
        }
      } else {
        hhh += mnh + definiteSpace - paddingTop;
        $('#header.global-header .mask.product-mask').height(hhh);
        highlight ? highlight.style.top = hhh - highlight.offsetHeight + 'px' : '';
        highlight ? highlight.style.visibility = 'visible' : '';
      }

      if ((items[0] && items[0].style.visibility != 'visible') ||
        (items[3] && (parseInt(items[3].style.top) < 50 || items[3].style.top == ''))) {
        for (var i = 0; i < items.length; i++) {
          var left = 0;
          if (i % cl == 0) {
            left = '0%';
          }
          if (i % cl == 1) {
            left = '33%';
          }
          if (i % cl == 2) {
            left = '66%';
          }
          items[i].style.top = heights[i] + 'px';
          items[i].style.visibility = 'visible';
          items[i].style.left = left;
        }
      }
      highlight ? highlight.style.visibility = 'visible' : '';
    }, time)
  }

  var dltime = 150;
  $('#header.global-header .support-nav-item').hover(function () {
    var $div = $(this).find('.box-fis-li.active .second-dl');
    var $mask = $('#header.global-header .support-mask');
    initHeight($div, $mask);
  });
  function initHeight($div, $mask) {
    setTimeout(function () {
      var height = $div.height();
      var mnh = $mask.find('.box-ul').height();
      var highlight = $div.find('.new-header-product-highlight-wrap');
      var top = parseInt($div.css('top') ? $div.css('top').split('px') : 0);
      var paddingTop = parseInt($div.closest('.mask').css('padding-top') ? $div.closest('.mask').css('padding-top').split('px') : 0);
      var definiteSpace = 6; //20(固定底部间距) - 14（二级间距/三级间间距/三四级间间距，目前均为14）

      if(highlight.length > 0) {
        highlight = highlight[0];
        highlight.style.visibility = 'visible';
        if (height != null && height > mnh) {
          highlight.style.top = height + definiteSpace + 'px';
          height = height + highlight.offsetHeight + definiteSpace + top - paddingTop;
        } else {
          if (mnh - height - highlight.offsetHeight >= 20) {
            //height + 20(固定间距) - 30（上边距）
            height = mnh + definiteSpace - paddingTop;
            highlight.style.top = height + paddingTop - top - highlight.offsetHeight + 'px';
          } else {
            highlight.style.top = height + definiteSpace + 'px';
            height = height + highlight.offsetHeight + definiteSpace + top - paddingTop;
          }
        }
      } else {
        if (height != null && height > mnh) {
          //height + 20(固定间距) + top - 30（上边距）
          height = height + definiteSpace + top - paddingTop;
        } else {
          //height + 20(固定间距) - 30（上边距）
          height = mnh + definiteSpace - paddingTop;
        }
      }
      $mask.height(height);
    }, dltime)
  }
  function getMaxOfArray(numArray) {
    return Math.max.apply(null, numArray);
  }
  function getMaxOfArray(numArray) {
    return Math.max.apply(null, numArray);
  }
  $('#header.global-header .partner-nav-item').hover(function () {
    var $div = $(this).find('.box-fis-li.active .second-dl');
    var $mask = $('#header.global-header .about-mask');
    initPartner($div, $mask);
  })
  function initPartner($div, $mask){
    setTimeout(function () {
      var height = $div.height();
      var mnh = $mask.find('.box-ul').height();
      var top = parseInt($div.css('top') ? $div.css('top').split('px') : 0);
      var paddingTop = parseInt($div.closest('.mask').css('padding-top') ? $div.closest('.mask').css('padding-top').split('px') : 0);
      var definiteSpace = 6; //20(固定底部间距) - 14（二级间距/三级间间距/三四级间间距，目前均为14）

      if (height != null && height > mnh) {
        //height + 20(固定底部间距) + top - padding-top
        height = height + definiteSpace + top - paddingTop;
      } else {
        //height + 20(固定间距) - padding-top
        height = mnh + definiteSpace - paddingTop;
      }
      $mask.height(height);
    }, dltime - 100)
  }
});
/*
 * Summary.
 *  This code is responsible for driving header functionality
 *
 * Description.
 *  Header Js is responsible for :
 *  AutoSuggestions result
 *  Secondary Navigation functionality
 *  Hamburger click of header Navigations
 *  Hover effect on header
 *  Search button functionality on header
 *
 * Version.
 *  1.0
 */
;
var header = (function ($) {
  var header = {};
  header.checkLoginStatusForDownload = function (targetLink, target, child, type) {
    var _actionTarget = child ? $(child) : $(target);
    var checkLogin = isCN ? $(target).data('download-checklogin-cn') : $(target).data('download-checklogin');
    var hasForm = $(target).data('has-form');

    if (checkLogin) { 
      var loginId = isCN ? storeManager.cookie.get("hiknow-id") : getLoginCookie("ticket");
      if(!(loginId && loginId != "123")) {
          _actionTarget.attr("target", "_self");      
          if(type){
            loginUtil.popupLoginConfirmModal();
          } else {
            _actionTarget.unbind().on("click", function (e) {
              loginUtil.popupLoginConfirmModal();
            });
          }
          return "javascript:;";
      } else {
          _actionTarget.on("click", function (e) {
            if (_actionTarget.attr("target") == "_self") {
              window.location.href = targetLink;
            } else {
              window.open(targetLink);
            }
          });
          return targetLink;
      }
    } else {
      if (hasForm || targetLink == "#download-agreement") {
        return targetLink;
      } else {
        _actionTarget.on("click", function (e) {
          if (_actionTarget.attr("target") == "_self") {
            window.location.href = targetLink;
          } else {
            window.open(targetLink);
          }
        });
        return "javascript:;";
      }
    }
  };
  return header;
})($);
;
(function (document, $) {
  var initSecondaryNavClick = function () {
      if(!$('.global-header').length) return false
      $('.global-header .nav-left-item.lang').on('click', function(e){
          e.preventDefault();
          var $secondaryNavPosition = $(".navbar-nav-list.right li:first-child").offset().left;
          var hasNav = $(".global-header .header-rightBar").hasClass('on-secondary-nav')

         if(!hasNav){
          $("html,body").addClass("preventScroll");
          $(".secondary-nav-wrapper").css({
            "left": $secondaryNavPosition - 60 <=1188.81 ?$secondaryNavPosition -60: 1188.81,
            "display": 'block'
         });
         $('.global-header .header-rightBar').addClass("on-secondary-nav")

         } else {
          $("html,body").removeClass("preventScroll");
          $('.global-header .header-rightBar').removeClass("on-secondary-nav")
          $(".secondary-nav-wrapper").hide()
         }
      })
      $(document).on('click', function(){
          $('.global-header .header-rightBar').removeClass("on-secondary-nav")
          $(".secondary-nav-wrapper").hide()
      })
      $('.secondary-nav-wrapper').on('click', function(e){
          e.stopPropagation();
      })
     };
  var initSearchBtn = function(){
    $('.search-box, .search-icon').on('click',function(e){
      $('.header-rightBar').removeClass("on-secondary-nav");
      $(".secondary-nav-wrapper").hide();
    })
    $('#headerSerachInput').on('keydown', function(e){
      var searchWebsite = $(this).closest('form.search-form').attr('action')
      if(e.keyCode === 13){
        $(".loading-wrap").show()
        window.open(searchWebsite + '?q='  +  e.target.value, '_self')
      }
    })
    $('#headerSerachInput').on('focus', function(e){
      e.stopPropagation();
      var $parent = $(this).parent().parent();
      var $list = $parent.find('.search-categories-container');
      var val = $(this).val();
      if($('.global-header').length > 0) {
        $('body .layout').remove();
        if(!val) {
          $list.addClass('active');
          $('body').append('<div class="layout"></div>');
        }
      }
    })
    $('#headerSerachInput').on('click input', function(e){
      e.stopPropagation();
      var value = $(this).val();
      var $parent = $(this).parent().parent();
      var $list = $parent.find('.search-categories-container');
      if($('.global-header').length > 0) {
        $('body .layout').remove();
        if(!value) {
          $list.addClass('active');
          $('body').append('<div class="layout"></div>');
        } else {
          $list.removeClass('active');
        }
      }
    })
    $('.search-wrap img').on('touchstart', function(e){
      e.stopPropagation()
      var searchWebsite = $(this).parent().parent().parent().attr('action')
      $(".loading-wrap").show()
      window.open(searchWebsite+'?q='  +  $('#headerSerachInput').val(), '_self')
    })
  }
  var boundSearchListClick = function(){
    var $searchContainer = $('.search-categories-container');
    var $input = $('#headerSerachInput');
    $searchContainer.find('.search-category-item').on('click', function() {
      var value = $(this).html();
      $input.val(value);
      searchWebsite = $input.closest('form.search-form').attr('action');
      $(".loading-wrap").show()
      window.open(searchWebsite + '?q='  +  value, '_self')
    })
  }
  var initMobileMenu = function(){
    var $mobileTarget = $('.mobile-nav-right-menu li p')
    $mobileTarget.on('click', function(){
      var hasDownClass = $(this).find('img').hasClass('down-expand')
      if(hasDownClass){
        $(this).find('img').removeClass('down-expand')
        $(this).parent().css({height: '56px'}).find('.right-menu-ul').hide()
      } else {
        $(this).find('img').addClass('down-expand')
        if($(this).parent().find('.right-menu-ul').length){
          $(this).parent().css({height: 'auto'}).find('.right-menu-ul').show()
        } else {
          $(this).parent().find('.right-menu-ul').hide()
        }
      }
    })
    var $moblieMenu = $('.mobile-right-mini-menu')
    $moblieMenu.on('click', function(){
     var isHidden =  $('.mobile-nav-right-menu').is(":hidden")
     if(isHidden){
      $('.mobile-nav-right-menu').show()
      $('html').addClass('overflow-prevent')
      $(this).addClass('show-close');
      $('#header.cn-header .header-wrap').find('.nav-cha').hide()
      $('#header.cn-header .header-wrap').find('.mobile-nav-left-menu.mobile-nav').hide()
      $('#header.cn-header .header-wrap').find('.navigation-span-warp').show()
     } else {
      $('.mobile-nav-right-menu').hide()
      $(this).removeClass('show-close')
      $('html').removeClass('overflow-prevent')
     }
    })
    $('#header.cn-header .mobile-nav-right-menu .user-info ,#header.cn-header .login-username-dropdown .user-info').on('click',function(){
      var ssoUrl=$(this).data('ssourl')
      var href=$(this).data('href')
      if(ssoUrl){
        ssoUrl=ssoUrl.split('/');
        $(this).attr('data-href','http://'+ssoUrl[2]+href);
        window.open($(this).attr('data-href'),'_blank')
      }
    })
    $("#header.cn-header .mobile-nav-right-menu.mobile-nav").on("touchmove",function(event){
      event.preventDefault();
      });
  }
 function removeLoginCookie (name) {
    var oDate = new Date();
    oDate.setDate(new Date().getDate() - 1);
    document.cookie = name + "=;expires=" + oDate + ";path=/;domain=.hikvision.com";
}
function initIl8nNav(){
  $.each($('.global-header .navbar-nav-list.clearfix .nav-left-item .box-ul .title a, .title-section a'), function (index, item) {
    var newTitle=Granite.I18n.get($(this).data('nav-type')+' Home');
    $(item).text(newTitle)
  })
}
  function removeAllLoginCookie (){
    removeLoginCookie("ticket");
    removeLoginCookie("redirectUrl");
    removeLoginCookie("HIKID");
    removeLoginCookie("HIKUSERID");
    removeLoginCookie("HIKUSERNAME");
    removeLoginCookie("HIKEMAIL");
    removeLoginCookie("HIKROLE");
    removeLoginCookie("SourceSystem");
    removeLoginCookie("hik-login-user");
}
//--new solution menu start--//
    function defaultGlobalSolutionMenu() {
        if(!$('.global-header').length) return false;
        var $topicList =  $('.global-header .nav-left-item .solution-topic-list .item');
        var $subList =  $('.global-header .nav-left-item .solution-sub-list .item');
        $topicList.removeClass('activated');
        $subList.removeClass('activated');
        $topicList.eq(0).addClass('activated');
        $subList.eq(0).addClass('activated');
    }

    function searchOptionListScroll($list, $option) {
        var lt = $list.offset().top;
        var lh = $list.height();
        var ot = $option.offset().top;
        var oh = $option.outerHeight();
        var bt = $list.get(0).scrollTop;

        if(ot < lt ) {
            $list.get(0).scrollTop = bt - oh;
        } else if ((ot + oh)  > (lt + lh)) {
            $list.get(0).scrollTop = bt + oh;
        }
    }

    function updateSearchOptionStatus(type, $list, $activeOption, $searchInput) {
        $activeOption.removeClass('activated');
        var $options = $list.find('.option');
        if (type === 'prev' && $activeOption.index() !== 0) {
            $activeOption.prev().addClass('activated');
            searchOptionListScroll($list, $activeOption.prev());
        } else if (type === 'next' && $activeOption.index() !== $options.length) {
            $activeOption.next().addClass('activated');
            searchOptionListScroll($list, $activeOption.next());
        }

        $searchInput.val($list.find('.option.activated').text());
    }

    function renderSolutionSuggest(keyword) {
        var $list = $('.global-header .solution-nav-item .search-options');
        $list.empty();
        $list.removeClass('activated');
        fessSearchProvider.doFessSearch({
            keyword: keyword,
            subcategory: 'Solutions',
            callback: function (data) {
                if (data.result && data.result.length) {
                    data.result.forEach(function(value) {
                        var textHtml = value["fess_title"].replace(keyword,'<span class="key-word">'+ keyword + '</span>') ;
                        var html =  '<li class="option" ><a class="link" data-at-module="main_menu::solution_search::'+ value["fess_title"] +'" href="' + value["url"] + '" target="blank">'+ textHtml + '<span class="a-action-btn"></span></a></li>';
                        $('.global-header .solution-nav-item .search-options').append(html);
                    });
                    $list.addClass('activated');
                }else {
                    $list.removeClass('activated');
                }
            },
            error: function() {
                $list.removeClass('activated');
            }
        });
    }

    function bindSolutionRelatedEvent() {
        if(!$('.global-header').length) return false;
        $('.global-header .nav-left-item.solution-nav-item').on('mouseenter', function() {
            defaultGlobalSolutionMenu();
        });

        var timer0;
        $('.global-header .nav-left-item .solution-topic-list .item').hover(function(){
            var $this = $(this);
            timer0 = setTimeout(function() {
                var index = $this.index();
                var $subItem = $this.closest('.list-box').find('.detail-list .item').eq(index);
                $this.addClass('activated');
                $this.siblings().removeClass('activated');
                $subItem.addClass('activated');
                $subItem.siblings().removeClass('activated');
                $this.closest('.list-box');
                $('.global-header .solution-nav-item .solution-search').trigger('blur');
            },150);
        }, function(){
            clearTimeout(timer0);
        });

        $('.global-header .mobile-bottom-nav .solution-items .second-nav-title').on('click', function() {
            var $outerBox = $(this).closest('.clearfix');
            $outerBox.find('img').toggleClass('down-expand');
            $outerBox.find('.third-nav-box').toggleClass('expand');
        });

        $('.global-header .solution-nav-item .solution-search').on('blur', function() {
            $(this).val('');
            $('.global-header .solution-nav-item .search-options').removeClass('activated');
        });

        $('.global-header .solution-nav-item .solution-search').on('keyup', function(e) {
            var $list = $('.global-header .solution-nav-item .search-options');
            var $options = $list.find('.option');
            var $activeOption = $list.find('.option.activated');
            var $searchInput = $(this);
            if (!$list.hasClass('activated')) return;
            if (e.keyCode === 13 && $activeOption.length) { //enter
                  $activeOption.find('.link .a-action-btn').trigger('click');
            }

            if (e.keyCode === 38 ) { //top arrow
                if (!$activeOption.length || $activeOption.index() === 0) return;
                updateSearchOptionStatus("prev", $list, $activeOption, $searchInput);
            }

            if (e.keyCode === 40 ) { //down arrow
                if ($activeOption.length) {
                     if($activeOption.index() === $options.length - 1) return;
                     updateSearchOptionStatus("next", $list, $activeOption, $searchInput);
                } else {
                     $options.eq(0).addClass('activated');
                     $searchInput.val($list.find('.option.activated').text());
                }
            }
        });


        $('.global-header .solution-nav-item .search-options').on('click', '.option .link', function(e) {
             var module = $(this).attr('data-at-module') + atModel.atSpliter + window.location.href;
             atModel.doAtEvent(module, 'navigation', e);
        });

        var inputTimer;
        $('.global-header .solution-nav-item .solution-search').on('input propertychange', function() {
            if (inputTimer) {
                clearTimeout(inputTimer);
            }
            var keyword = $(this).val();
            inputTimer = setTimeout(function() {
                renderSolutionSuggest(keyword);
            }, 300);
        });

        $('.global-header .solution-nav-item').on('mousedown','.option .link', function() {
            $(this).find('.a-action-btn').trigger('click');
        });
    }

    function initSolutionMenu() {
        bindSolutionRelatedEvent();
    }
//--new solution menu end--//
//--old solution menu end--//
var initDefaultSolutionMore = function(){
  $('.solution-nav-item.old-solution').hover(function(){
    var childDDLens = $($(this).find('.box-ul').find('li.solution-li')[0]).find('dl dd').length
    if(childDDLens>=8){
      $($(this).find('.box-ul').find('li.solution-li')[0]).find('.more').show()
      $($(this).find('.box-ul').find('li.solution-li')[0]).find('.solution-top-more').show()
    }
  })
  $('.old-solution .solution-li').hover(function(){
     var ddLens = $(this).find('.second-dl').find('dd').length
     if(ddLens>8){
      $(this).find('.more').show()
     } else {
      $(this).find('.more').hide()
     }
  })
}
//--old solution menu end--//
function checkLoginStatus () {
  var userId = $.cookie("HIKUSERNAME");
  var userName = "";
  try {
    // userName = atob(userId);
    userName = decodeURIComponent(escape(window.atob(userId)))
  } catch (error) {
    console.log("Login Error:" + error);
  }
  var ticket = $.cookie("ticket")
  if (ticket&&userName&&ticket!='123') {
    $(".global-header .login-username-dropdown.ul-dropdown.login").show();
    $(".global-header .login-username-dropdown.ul-dropdown.no-login").hide();
    $(".global-header .login-username-dropdown.ul-dropdown.login .user-profile").find("a").text(userName);
    $(".global-header .login-username-dropdown.ul-dropdown.login .user-profile").find("a").attr("title", userName);
    $('.global-header .nav-left-item.login-username').addClass('logined')
    $(".global-header .mobile-nav-right-menu").find(".login-li.no-login").hide()
    $(".global-header .mobile-nav-right-menu").find(".hik-username").text(userName)
  } else {
    $(".global-header .login-username-dropdown.ul-dropdown.login").hide();
    $(".global-header .login-username-dropdown.ul-dropdown.no-login").show();
    $(".global-header .mobile-nav-right-menu").find(".login-li.login").hide()
    $(".global-header .mobile-nav-right-menu").find(".login-li.no-login").show()
    $('.global-header .nav-left-item.login-username').removeClass('logined')
  }
};

function stopAPropagation() {
  $('#header.global-header .mobile-nav .title .first-nav-a').on('click', function(e) {
    e.stopPropagation();
  })
}

    $(document).ready(function () {
        initSecondaryNavClick()
        initSearchBtn()
        boundSearchListClick();
        initMobileMenu();
        initSolutionMenu();
        initDefaultSolutionMore();
        checkLoginStatus();
        $('.link-logout').on('click', function(){
          removeAllLoginCookie();
          window.open($(this).data('href'), '_self')
        })
        $('.secondary-nav-content-wrapper').hover(function(e){
          var $ulDropdown = $('.login-username-dropdown.ul-dropdown')
          $ulDropdown.css({
            'top': '-600px'
          })
        }, function(){
          var $ulDropdown = $('.login-username-dropdown.ul-dropdown')
          $ulDropdown.css({
            'top': '58px',
           // 'z-index': '9999'
          })
        })
        $('.global-header .login-username.login .login-btn').click(function () {
          var hasHikId = $.cookie("HIKID")
          if(!hasHikId) {
            window.location.href = $('.global-header .login-btn.new-login').attr('data-login-url');
          }
        })
        $('.global-header .login-username.login').hover(function () {
          var hasHikId = $.cookie("HIKID")
          var loginClass = hasHikId ? '.login' : '.no-login'
          if (hasHikId) {
            $('.global-header .login-username-dropdown.ul-dropdown' + loginClass).css({
              'z-index': 999,
              'opacity': 1,
              'top': '58px',
              'display': 'block'
            })
          } else {
            var tipPd = 30;
            if($(document).width() < 1066) {
              tipPd = 20;
            }
            $('.global-header .login-tip').css({
              'display': 'block',
              'left': tipPd - $('.global-header .login-tip').width()/2 + 'px'
            })
          }
        }, function () {
          $('.global-header .login-tip').css({
            'display': 'none'
          })
          $('.global-header .login-username-dropdown.ul-dropdown').css({
            'z-index': -1,
            'opacity': 1,
            'top': '-600px',
            'display': 'none'
          })
        })
        initIl8nNav();
        // Mobile
        initMobileLogin();
        initMobileLan();
        initMobileSearch();
        function initMobileLogin(){
          $('#header.global-header .navigation .navigation-span-warp').on('click', function(){
            var mld = $("#header.global-header .mobile-new-login-dropdown");
              if(mld.css('display') == "block") {
                $("#header.global-header .mobile-new-login-icon .logined").click();
              }
          });
          var $this = $("#header.global-header .mobile-new-login-icon");
          var hasHikId = $.cookie("HIKID")
          if(hasHikId) {
            $this.find(".not-login").toggle();
            $this.find(".logined").toggle();
            $this.find(".logined").click(function(){
              $('#header.global-header .header-wrap .cancel-search').click();
              $(".mobile-new-login-dropdown").toggle();
              $this.find(".logined").toggle();
              $this.find(".logined-x").toggle();
              $("#header.global-header .header-wrap .mobile-new-login-mask").toggle();

              var bum = $("#header.global-header .mobile-nav");
              if(bum.css('display') == "block") {
                $("#header.global-header .navigation .nav-cha").click();
              }
            })
            $this.find(".logined-x").click(function(){
              $(".mobile-new-login-dropdown").toggle();
              $this.find(".logined").toggle();
              $this.find(".logined-x").toggle();
              $("#header.global-header .header-wrap .mobile-new-login-mask").toggle();
            })
          }
        }
        function initMobileLan() {
          var $this = $("#header.global-header .mobile-new-country");
          $this.find(".country-wrap, .country-back").click(function(){
            $this.find(".select-country").toggle();
            $this.find(".country-wrap").toggle();
            $('html').toggleClass('overflow-prevent')
          })
          $this.find(".country-title").click(function(){
            $(this).siblings(".country-details").toggle();
            $(this).find("img").toggleClass('flip-icon');
          })
          var $self = $this;
          $("#header.global-header .navigation .nav-cha").click(function(){
            $('#header.global-header .header-wrap .cancel-search').click();
            $self.find(".select-country").hide();
            $self.find(".country-wrap").show();
            $('html').addClass('overflow-prevent')
          })
        }
        function initMobileSearch(){
          var $this = $("#header.global-header .mobile-new-search");
          $this.find('.mobile-search').click(function() {
            $this.find('.search-categories-container').show();
            $this.find("#headerSerachInputMobile").trigger('focus').trigger('click');
          })
          $this.find('.search-category-item').click(function() {
            var value = $(this).html();
            $('#headerSerachInputMobile').val(value);
            var searchWebsite = $(this).attr('action');
            $(".loading-wrap").show()
            window.open(searchWebsite + '?q='  +  e.target.value, '_self');
          })
          $this.find("#headerSerachInputMobile").click(function(){
            $this.find(".cancel-search").show();
          })
          $this.find(".cancel-search").click(function(){
            $(this).hide();
            $(this).parent().parent().hide();
            $this.find("#headerSerachInputMobile").val("");
          })
        }
        $('#header.global-header .mobile-four-view-all').click(function(){
          var $this = $(this);
          $this.toggleClass("flip-icon");
          if($.trim($this.find('.expand-text').text()) == Granite.I18n.get('Expand')) {
            $this.find('.expand-text').text(Granite.I18n.get('Collapse'));
          } else if($.trim($this.find('.expand-text').text()) == Granite.I18n.get('Collapse')) {
            $this.find('.expand-text').text(Granite.I18n.get('Expand'));
          }
          $this.parent().find('.mobile-four-item.hide').toggle();
        }) 
        $('#header.global-header #headerSerachInputMobile').on('keydown', function(e){
          var searchWebsite = $(this).attr('action')
          if(e.keyCode === 13){
            $(".loading-wrap").show()
            window.open(searchWebsite + '?q='  +  e.target.value, '_self')
          }
        })
        stopAPropagation();
        var winHeight = $(window).height();
        $(window).resize(function () {
          var thisHeight = $(this).height();
          if (winHeight - thisHeight > 140) {
            $('#header.global-header .mobile-new-country').hide();
          } else {
            $('#header.global-header .mobile-new-country').show();
          }
        })
    });
})(document, $);
;
(function (document, $) {
    $(document).ready(function () {
        var $expandElement = $(".footer-navigation-block:not(.contact-group)");
        $expandElement.on("click", function () {
            //$('.footer-navigation-block').removeClass('active')
            $(this).siblings().removeClass("active");
            $(this).toggleClass("active");
        });
        var $headQuarterDropdown = $(
            ".footer-body.global-footer .contact-group__items--dropdown-styled-select"
        );
        $headQuarterDropdown.on("click", function (e) {
            e.stopPropagation();
            $(this).toggleClass("active");
        });
        $.each($(".footer-body-content .icon-contact-us a"), function () {
            var socailIcon = lastNode($(this).attr("data-socail-icon"));
            $(this).attr("data-at-module", "footer::social::" + socailIcon);
        });
        $expandElement.find("a").on("click", function (e) {
            var title =
                "footer::" +
                lastNode($(this).attr("href")) +
                "::" +
                window.location.href;
            atModel.doAtEvent(title, "navigation", e);
        });
        $(".footer-navigation-block.contact-group")
            .find("a")
            .on("click", function (e) {
                var title =
                    "footer::button::" +
                    lastNode($(this).attr("href")) +
                    "::" +
                    window.location.href;
                atModel.doAtEvent(title, "navigation", e);
            });
        $.each(
            $(".footer-navigation-block a , .icon-contact-us a"),
            function () {
                var href = $(this).attr("href");
                if (href && startsWith(href, "http")) {
                    $(this).attr("target", "_blank");
                } else {
                    $(this).attr("target", "_self");
                }
            }
        );
    });
    var startsWith = function (text, prefix) {
        if (!!text && !!prefix) {
            return false;
        }
        return text.slice(0, prefix.length) == prefix;
    };
})(document, $);

var subHeader = (function ($) {
  var subHeader = {};
  var sticky;
  subHeader.generateLinks = function () {
    var $subHeaderContainer = $('.cmp-subheader-container');
    var $anchorElements = $('[data-isAnchor="true"]');
    var $anchorLinksContainer = $subHeaderContainer.find(".subnav-bar");
    $anchorLinksContainer.empty();
    $anchorElements.each(function () {
      var value = $(this).attr("data-anchorText");
      var li = $('<li class="menu-item at-action" data-at-module="header2::' + value + '" />');
      var span = $('<span/>');
      span.text(value);
     span.appendTo(li);
     li.appendTo($anchorLinksContainer);
    });
  };

  subHeader.initDropdownClick = function () {
    var $subHeaderContainer = $('.cmp-subheader-container');
    $(".header2-container-wrapper .header-nav-wrapper .triangle-indicator").click(function (e) {
      if ($(this).siblings(".dropdown-1").length > 0) {
        $(this).siblings(".dropdown-1").toggle();
        $(this).siblings(".fa-caret-right").toggleClass("dropdown-open-caret");
        $(this).siblings('.link-drp').toggleClass("dropdown-open");
        if ($(this).siblings('.link-drp').hasClass('dropdown-open')) {
          $('.header-nav-dw').removeClass('header-nav-dw-after').find(".link-drp").not(
            $(this).siblings('.link-drp')).siblings(".dropdown-1").hide();
          $('.header-nav-dw').find(".link-drp").not($(this).siblings('.link-drp')).removeClass(
            'dropdown-open');
          $(this).closest('.header-nav-dw').addClass('header-nav-dw-after');
        } else {
          $(this).closest('.header-nav-dw').removeClass('header-nav-dw-after');
        }
      }
      e.stopPropagation();
    });
    $(document).click(function () {
      $(".dropdown-1").hide();
      $('.link-drp').removeClass('dropdown-open').closest('.header-nav-dw').removeClass('header-nav-dw-after');
    });
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE ");
    if (!(msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))) {
      if ($('[data-toggle="tooltip"]').tooltip) {
        $('[data-toggle="tooltip"]').tooltip();
      }
    }

  };

  subHeader.initLinkClick = function () {
    var $subHeaderContainer = $('.cmp-subheader-container');
    if (!$subHeaderContainer || $subHeaderContainer.length == 0) {
      return;
    }
    $subHeaderContainer.find('.menu-item').on('click', function (e) {
      if ($(this)[0].innerText == $('.subnav-bar .menu-item:first-child span').text()) {
        $('.subnav-bar .menu-item:first-child').addClass('bottomLine');
      } else {
        $('.subnav-bar .menu-item:first-child').removeClass('bottomLine');
      }
      var linkText = $(this).find('span').text();
      var $selectedAnchorElement = $('[data-anchorText="' + linkText + '"]');
      var headerHeight = $('.header-wrapper').outerHeight();
      var subHeaderHeight = $('.cmp-subheader-container').outerHeight();
      // $subHeaderContainer.addClass('cmp-subheader-container-new');
      setTimeout(function () {
        $('html,body').animate({
          scrollTop: $selectedAnchorElement.parent().offset().top - (subHeaderHeight)
        }, 400);
      }, 100);
      e.stopPropagation();
      return false;

    });
  }

  var stickyHeader = function () {

    var header = document.getElementById("cmp-subheader-selector");
    if (header) {
      var $burgerMenu = $(".burgur-menu-icon");
      var headerHeight = $('.header-wrapper').outerHeight();
      $burgerMenu.click(function (e) {
        $('body').toggleClass('topPadding');
      });

      sticky = header.offsetTop;
      window.onscroll = function () {
        if ($(".cmp-subheader-container").hasClass("cmp-subheader-container-new")) {
          $(".product-spotlight-header-wrapper")
            .each(
              function (key, val) {
                if (val.attributes["data-anchortext"]) {
                  var text = val.attributes["data-anchortext"].value;
                  var elementOffset = $(
                    ".product-spotlight-header-wrapper[data-anchortext='" + text + "']")
                    .offset().top - 100;
                  var subHeaderOffset = $(".cmp-subheader-container .cmp-subheader-wrap")
                    .offset().top;
                  $('.subnav-bar .menu-item span').each(
                    function (key, val) {
                      if (text == val.innerText) {
                        if (subHeaderOffset >= elementOffset) {
                          $('.subnav-bar .menu-item').css('border-bottom',
                            '4px solid transparent');
                          if (!key == 0) {
                            $('.subnav-bar .menu-item:first-child').removeClass(
                              'bottomLine');
                          }
                          val.parentElement.style.borderBottom = "4px solid #D7000F";
                        }
                      }
                    })
                }
              });
        } else {
          $('.subnav-bar .menu-item').css('border-bottom', '4px solid transparent');
        }
        setMargin(header);
      };

    } else {
      // remove paddingTop 20191022, bitter
      // var headerHeight = $('.header-wrapper').outerHeight();
      // $('body').css({
      //     'paddingTop' : headerHeight
      // });
      $('#header-wrapper-selector').addClass('header-wrapper-new');
    }

  }

  function setMargin(header) {
    var headerHeight = $('.header-wrapper').outerHeight();
    if (window.pageYOffset > sticky && !hideForProductSelector()) {
      header.classList.add("cmp-subheader-container-new");
      $('#cmp-subheader-selector').siblings().css('margin-top', headerHeight);

    } else {
      header.classList.remove("cmp-subheader-container-new");
      $('#cmp-subheader-selector').siblings().css('margin-top', 0);
    }
  } 
  
  
  function hideForProductSelector() {
    if ($(document).width() < 992) {
      return false
    }
    var $prodSelector = $('.search-list-comp');
    if (!$prodSelector.length) { return false; }

    var $header = $('.cmp-subheader-container.header-container2');
    var headerHeight = $header.outerHeight();

    var selectorTop = $prodSelector[0].getBoundingClientRect().top;

    if (selectorTop < headerHeight) {
      return true;
    }

    return false;
  }
  function mobileNav () {
    var navList = $('.cmp-subheader-wrap .logo-title-search-wrap .header2-container-wrapper .header-nav-dw')
    var navMobile = $('.cmp-subheader-wrap .back-button')
    if(navList.eq('-2').length){
      navMobile.attr('href',navList.eq('-2').find('.link-drp').attr('href'))
    }else{
      navMobile.hide()
    }
  }

  function headerHeight(){
    if( $('[data-isAnchor="true"]').length==0){
      if(getCurrentBreakPoint() == 'DESKTOP') {
        $('.cmp-subheader-container.header-container2').css('height','56px')
      } else {
        $('.cmp-subheader-container.header-container2').css('height','46px')
      }
    }else{
      $('.cmp-subheader-container.header-container2').css('height','auto')
    }

  }
    function  onlyTitle(){
      var menuNum=$('.subnav-bar .menu-item').length
      if(menuNum==0 ){
        if(getCurrentBreakPoint() == 'DESKTOP') {
          $('.logo-title-wrap .title').css('padding-top','16px')
        }
        $('.logo-title-wrap').addClass('mob-onlytitle')
        $('.header-2-container .header-nav-ul').css('padding-top','3px')
        $('.header2-container-wrapper').css('z-index','5')
      }else{
        $('.header2-container-wrapper').css('z-index','0')

      }
    }
    //计算navbox高度 header2.0的定位
    function countHeader2(){
     var aDiv = document.getElementById('header-wrapper-selector') || document.getElementById('header')
      if(aDiv){
         var headerTop=aDiv.getBoundingClientRect().top
      }
       var cHeight =  document.body.offsetHeight - 78
       var documentW = $(document).width()
       $('.nav-box').css({height:cHeight + 'px'})
        if($(window).scrollTop()>=78){
            $('#cmp-subheader-selector').css({
              position:'fixed',
              top: documentW > 991 ||  (headerTop < -55) ? '0px' : '55px'
            })
          } else{
       $('#cmp-subheader-selector').css({
            position:'relative',
            top: '0px'
       })
     }
   }
  subHeader.init = function () {
    $(document).ready(function () {
      headerHeight()
      subHeader.generateLinks();
      subHeader.initDropdownClick();
      subHeader.initLinkClick();
      mobileNav()
      stickyHeader();
      onlyTitle()
     // $(window).on('scroll', _.throttle(countHeader2, 1000));
    });

  };
  return subHeader;

})($);
subHeader.init();

;
$(function () {
    if(isCN){
        var hiknowId = storeManager.cookie.get("hiknow-id");
        $.each($(".banner-btn-link"), function(){
         var bannrHerf = $(this).attr("data-href");
         var target = $(this).attr("data-target")
         var isLoginCn = $(this).attr("data-loginInCn")
         if(isLoginCn &&　isNull(hiknowId)){
            $(this).removeAttr("data-href");
         }
        if (isNull(hiknowId)) {
            var isvideoLoginCn = $(".video-btn").attr("data-loginInCn")
            if(isvideoLoginCn == "false"){
                $(".video-btn").addClass("hik-video-trigger")
            }
            $(this).unbind("click").bind("click", function(e){
                if(isLoginCn == "true"){
                    e.preventDefault();
                    e.stopPropagation();
                    $(this).removeAttr("data-video-path");
                    $("body").addClass("overflow-hidden");
                    $(".login-required-comp-cn").show();
                } else {
                    if(!$(this).hasClass("video-btn")){
                        window.open(bannrHerf, target)
                    }
                }
        }) 
        }  else {
            if(!$(this).hasClass("video-btn")){
            } else {
                $(".banner-btn-link.video-btn").addClass("hik-video-trigger")
            }
        } 
        })
    } else {
        if($(".banner-btn-link").hasClass("video-btn")){
            $(".banner-btn-link.video-btn").addClass("hik-video-trigger")
        }
    }
});
/**老版本的banner-carousel inline到页面里面**/
$(function () {
  var backgroundUrlmobile=$('.carousel-inner .carousel-item').attr('data-original-mobile')
  var backgroundUrl=$('.carousel-inner .carousel-item').attr(window.innerWidth <= 768 && backgroundUrlmobile ? 'data-original-mobile' : 'data-original')
    if(!isNull(backgroundUrl)) {
        $('.thin-banner-carousel .carousel-inner .carousel-item').css('background-image', 'url("' + backgroundUrl + '")');
    }
  var $targetButton = $('.small-banner-full__item--button').parent()
  $targetButton.on('click', function(e){
    var url = $(this).attr("href");
    var currentUrl = window.location.href;
    var dataModule = $(this).data('at-module')
    atModel.doAtEvent(dataModule + '::' + currentUrl, 'navigation', e)
        if(url.indexOf('software-apply-trial') > -1){
            setLoginCookie("applyTrialUrl", currentUrl);
        }
        if(url){
          var buttonText=$(this).find("button").text()
          var linkStr= url.indexOf('/content/dam') > -1 ? '下载::[file-link]' + url : '跳转页面::[complete-link]'+ url
          var analyticsStr =buttonText+"::Thin Banner Carousel::"+linkStr +"::"+$("#header").attr('data-page-title')
          HiAnalyticsCn.clickDown(analyticsStr); 
        }

  })
})
$(function () {
    var replaceOriginal = function (imageElement) {
        var $bannerImg = $(imageElement);
        var originalImage;
        if (window.innerWidth > 768) {
            originalImage = $bannerImg.data('original');
        } else {
            originalImage = $bannerImg.data('original-mobile');
        }
        $bannerImg.css('background-image', 'url("' + originalImage+'")');
    };

    function bgVideoPositionCenter($target, $container) {
        var boxRatio = $container.width() / $container.height();
        var videoRatio = $target[0].videoWidth / $target[0].videoHeight;
        if (boxRatio && videoRatio) {
            if (boxRatio > videoRatio) {
                $target.addClass('video-height-auto');
                $target.removeClass('video-width-auto');
            } else {
                $target.addClass('video-width-auto');
                $target.removeClass('video-height-auto');
            }
        }
    }

    function bgVideoinit($video,$bannerContainer){
        replaceOriginal($bannerContainer)
        if($video){
            bgVideoPositionCenter($video, $('.video-box'));
        }
        window.innerWidth < 768 ? $('.video-box').hide() : $('.video-box').show()
    }

    $(document).ready(function () {
        var $videoContainer = $('.publicity-banner-comp').find('.background-video');
        var $bannerContainer= $('.publicity-banner-comp').find('.banner-info-wrapper');
        replaceOriginal($bannerContainer)
        var $video, videoLink;
        if($videoContainer.length > 0){
            videoLink = $videoContainer.attr('data-video-path');
            $video = $('<video class="video-height-auto" loop muted autoplay removeControl mobileAutoPlayEnable playsinline/>').append('<source src="' + videoLink + '">');
            $videoContainer.find('.video-box').append($video);
            $video.get(0).addEventListener('play', function () {
                $video.show()
            });
        }
        bgVideoinit($video,$bannerContainer)
        window.onresize =function(){
            bgVideoinit($video,$bannerContainer)
        }
    })
});
var productCarousel = (function ($) {
  var productCarousel = {};
  // product-carousel
  productCarousel.init = function () {
    $(document)
      .ready(
        function () {
          if(isCN){
            $(".product-carousel-wrap .slide-image").addClass("lazy-product").find("picture").remove()
          }
          var $productCarousel = $(".product-carousel-wrap.carousel");
          var $productCarouselThumb = $("#productCarouselThumb");
          var mainSlideCount = $('#productCarouselComp .carousel-item').length;
          if (mainSlideCount <= 1) {
            $('.product-carousel-wrap').addClass('bot');
          } else {
            $('.product-carousel-wrap').removeClass('bot');
          }

          if (mainSlideCount < 2) {
            $(
              '.product-carousel-wrap .carousel-control-prev, .product-carousel-wrap .carousel-control-next')
              .hide();
          } else {
            $(
              '.product-carousel-wrap .carousel-control-prev, .product-carousel-wrap .carousel-control-next')
              .show();

          }

          $productCarousel.bind('slid.bs.carousel', function (e) {
            // for (var i = 0; i < customVideoPlayers.length; i++) {
            // customVideoPlayers[i].stop();
            // }
            $productCarouselThumb.carousel($(this).find('.carousel-item.active').index());
          });

          // Thumbnail carousel
          var thumbCount = $('#productCarouselThumb .carousel-item').length;


          var isMobile = $(window).width() < 768;
          var isTablet = $(window).width() >= 768 && $(window).width() <= 1024;
          var thumbCount = $('.product-carousel-thumb .carousel-item').length;
          var rotateThumbnails = function () {
            $('#productCarouselThumb .carousel-item').each(function () {
              var next = $(this).next();
              if (!next.length) {
                next = $(this).siblings(':first');
              }
              next.children(':first-child').clone().appendTo($(this));

              for (var i = 0; i < thumbCount; i++) {
                next = next.next();
                if (!next.length) {
                  next = $(this).siblings(':first');
                }

                next.children(':first-child').clone().appendTo($(this));
              }
            });
          };
         // 轮播图片处理
         var productCarouselImage = function(){
          setTimeout(function(){
          var $fistLazyImage = $(".lazy-carousel .carousel-item.active").find(".lazy-product")
             $fistLazyImage.lazyload();
            }, 1000)
         }
          productCarouselImage();
          var activeThumbnail = function () {
            $("#productCarouselThumb .carousel-item .slide-image").each(function () {
              var $this = $(this);
              var imgIndex = $this.data("index-number");
              if (imgIndex === $('#productCarouselComp .carousel-item.active .show-image').data('index')) {
                $this.addClass('active');
              } else {
                $this.removeClass('active');
              }
            });
          }

          activeThumbnail();
         // 视频如果没有封面取第一个banner做封面
        //  var firstBanner = $('.show-image').find(function(item, index){
        //    console.log('item',$(item), index)
        //    // return $(item).attr('data-original')
        //  })
        var firstBanner =  Array.prototype.slice.call($('.show-image')).find(function(item, index){
          return $(item).attr('data-original')
        })
        var firstNBanner = Array.prototype.slice.call($('.number-image')).find(function(item, index){
          return $(item).attr('data-original')
        })
        $.each(Array.prototype.slice.call($('.show-image')), function(index, item){
           if($(item).parent().parent().attr('data-video') === 'true' && !$(item).attr('data-original')){
            $(item).parent().parent('.carousel-item').next().addClass('hide-image')
            $(item).attr('data-original', $(firstBanner).attr('data-original'))
            $(firstBanner).parent().parent().remove()
           }
         })
         $.each(Array.prototype.slice.call($('.number-image')), function(index, item){
          if($('.show-image').length === 1){
            $(item).parent().parent().hide()
          }
          if($(item).parent().parent().attr('data-video') === 'true'){
            if(!$(item).attr('data-original')){
              $(item).attr('data-original', $(firstBanner).attr('data-original'))
              $(firstNBanner).parent().parent().remove()
            }
          }
        })
        if($('.show-image').length === 1) {

          $('.carousel-control-prev').hide()
          $('.carousel-control-next').hide()
        }
          // if (!(isMobile || isTablet)) {
          //   if (thumbCount > 6) {
          //     $(
          //       '.product-carousel-thumb .carousel-control-prev, .product-carousel-thumb .carousel-control-next')
          //       .show();
          //     $('#productCarouselThumb').removeClass('hide-thumb-controls');
          //     rotateThumbnails();
          //   }
          // }

          // if (isMobile || isTablet) {
          //   if (thumbCount > 4) {
          //     $(
          //       '.product-carousel-thumb .carousel-control-prev, .product-carousel-thumb .carousel-control-next')
          //       .show();
          //     $('#productCarouselThumb').removeClass('hide-thumb-controls');
          //     rotateThumbnails();
          //   }
          // }

          if (thumbCount < 2) {
            $('#productCarouselThumb').addClass('hide-thumb');
          } else {
            $('#productCarouselThumb').removeClass('hide-thumb');
          }

          $('#productCarouselThumb .item-inner').click(function () {
             var $this = $(this).find('.slide-image')
             var carousels = $productCarousel.find('.carousel-item')
             $.each(Array.prototype.slice.call(carousels), function(index, item){
               if($(item).find('.show-image').data('index') === $this.data('index-number')){
                $productCarousel.carousel(index);
               }
             })
          });

          $productCarouselThumb.bind('slid.bs.carousel', function (e) {
            $productCarouselThumb.carousel($(this).find('.carousel-item.active').index());
            activeThumbnail();
          });
          $('#productCarouselComp').bind('slid.bs.carousel', function(){
            $(this).find(".carousel-item.active .lazy-product").lazyload();
        });
      })
  };

  return productCarousel;
}($));

productCarousel.init();

$(document).ready(function () {
    /**
     * 2020/09/02 
     * product-description=page
     */
    var productNumber = $(".product_description-wrapper").attr("data-product-number");
    var productName = $(".product_description-wrapper").attr("data-product-name");
    var productUrl = $(".product-description-container").attr("data-product-description-path");
    var addOrRemoveUrl = productUrl + ".myFavorites.json";
    var isCollectedUrl = productUrl + ".isCollect.json";
    var currentPath = $(".product_description-wrapper").attr("data-product-page");
    var listHeight = $('.product_description_item-list').height();
    var wrapperContent = $('.product_description-wrapper');
    var lessBtn = $('.viewLessBtn');
    var moreBtn = $('.viewMoreBtn');
    moreBtn.on('click',function (e) {
        wrapperContent.toggleClass('active');
        lessBtn.show();
        // for at event
        var module = "product_description::view_more::" + productName;
        atModel.doAtEvent(module, 'action', e);
    });
    lessBtn.on('click',function () {
        wrapperContent.toggleClass('active');
        lessBtn.hide();
    });
    if ($(window).width() < 768 && listHeight >= 130) {
        wrapperContent.toggleClass('active')
    };
    var ssoCheckParameters = {
        "ticket": getLoginCookie("ticket"),
        "service": getServiceUrl()
    }
    var productIconUrl = false
    if (window.location.href.indexOf('/cn/') >= 0) {
        $(".product_description-like-btn").hide()
    } else {
        $(".product_description_likes").append("<a class='product_description-like-btn btn at-action' data-at-module='add to my favorites::login' href='javascript:;'><img class='like-btn-inner-icon' src='/etc/clientlibs/it/resources/icons/icon-noCollect.svg'><span class='like-btn-inner-text'>" + Granite.I18n.get("Add to Favorites") + "</span></a><a class='product_description-liked-btn btn at-action' data-at-module='add to my favorites::login' href='javascript:;' style='display: none;'><img class='liked-btn-inner-icon' src='/etc/clientlibs/it/resources/icons/icon-collect.svg'><span class='liked-btn-inner-text'>" + Granite.I18n.get("Add to Favorites") + "</span></a>")
    }
    $(".product_description-like-btn").on("click", function () {
        var ticket = getLoginCookie("ticket");
        if (ticket && ticket != "123") {
            addToMyFavorites();
        } else {
            loginUtil.popupLoginConfirmModal();
        }

    });
    var flag = true
    var productMore = $(".product_more_out")
    $(".product_more_out").css({"padding-top":"10px"})
    var productLi = $(".product_description_item-list").children()
    if (productLi.length > 14) {
        productMore.html("<span class='product_more more-action'>" + Granite.I18n.get("More") + "</span> <img class='product_more_icon'>")
        var productMoreIcon = $(".product_more_icon")
        productMoreIcon.get(0).src = "/etc/clientlibs/it/resources/icons/xiala-2@2x.png"
        $(".product_more").on("click", function () {
            if (flag) { 
                flag = false
                $(".product_hide").attr("class", "product_description_item")
                $.each(productLi, function (i, item) {
                    if (i > 14) {
                        productMoreIcon.get(0).src = "/etc/clientlibs/it/resources/icons/xiala-2@2x.png"
                        item.className = "product_more_li"
                    }
                })
                $(".product_more").text(Granite.I18n.get("Less"))
                productMoreIcon.get(0).src = productIconUrl ? "/etc/clientlibs/it/resources/icons/xiala-2@2x.png" : "/etc/clientlibs/it/resources/icons/xiala-active-2@2x.png"
            } else {
                $.each(productLi, function (i, item) {
                    if (i > 14) {
                        productMoreIcon.get(0).src = "/etc/clientlibs/it/resources/icons/xiala-2@2x.png"
                        item.className = "product_more_li"
                    }
                })
                productMoreIcon.get(0).src = !productIconUrl ? "/etc/clientlibs/it/resources/icons/xiala-2@2x.png" : "/etc/clientlibs/it/resources/icons/xiala-active-2@2x.png"
                if (productIconUrl) {
                    $(".product_more").text(Granite.I18n.get("Less"))
                } else {
                    $(".product_more").text(Granite.I18n.get("More"))
                }
                productIconUrl = !productIconUrl
                $(".product_more_li").toggle(500)
            }
        })
    }
    $(".product_description-liked-btn").on("click", function () {
        removeMyFavorites();
    });
    function getLoginCookie (name) {
        var reg = /\s/g;
        var result = document.cookie.replace(reg, "");
        var resultArr = result.split(";");
        for (var i = 0; i < resultArr.length; i++) {
            var nameArr = resultArr[i].split("=");
            if (nameArr[0] == name) {
                return nameArr[1];
            }
        }
    }
    var addToMyFavorites = function () {
        if (productNumber) {
            var product = {
                "hikId": getHikId(),
                "site": getSiteCode(),
                "productNumber": productNumber,
                "page": currentPath,
                "productName": productName
            };
            var params = {
                "product": JSON.stringify(product),
                "type": "add",
            };
            params = $.extend({}, params, ssoCheckParameters);
            var success = function (resp) {
                if (resp.data.code == 0 || resp.data.message == "already exist") {
                    console.log("add To My Favorites success");
                    $(".product_description-like-btn").hide();
                    $(".product_description-liked-btn").show();
                } else {
                    console.log("add To My Favorites failed. Error message: " + resp.data.message);
                }
            }

            var error = function () {
                console.log("add To My Favorites failed");
            }
            loginUtil.requestServerData("POST", addOrRemoveUrl, params, success, error);
        }
    };

    var removeMyFavorites = function () {
        if (productNumber) {
            var product = {
                "hikId": getHikId(),
                "site": getSiteCode(),
                "productNumber": productNumber,
                "page": currentPath,
                "productName": productName
            };
            var params = {
                "product": JSON.stringify(product),
                "type": "remove"
            };
            params = $.extend({}, params, ssoCheckParameters);
            var success = function (resp) {
                if (resp.data.code == 0 || resp.data.message == "not exist") {
                    console.log("remove To My Favorites success");
                    $(".product_description-like-btn").show();
                    $(".product_description-liked-btn").hide();
                } else {
                    console.log("remove To My Favorites failed. Error message: " + resp.data.message);
                }
            }
            var error = function () {
                console.log("remove To My Favorites failed");
            }
            loginUtil.requestServerData("POST", addOrRemoveUrl, params, success, error);
        }
    };

    var isCollected = function () {
        var params = {
            "hikId": getHikId(),
            "site": getSiteCode(),
            "productNumber": productNumber,
            "page": currentPath,
        };
        params = $.extend({}, params, ssoCheckParameters);
        var success = function (resp) {
            if (resp.data.code == 0) {
                //查询成功
                if (resp.data.data.isCollected) {
                    $(this).attr('data-at-module', "add to my favorites::cancel");
                    console.log("product is collected");
                    $(".product_description-liked-btn").show();
                    $(".product_description-like-btn").hide();
                } else {
                    $(this).attr('data-at-module', "add to my favorites::add");
                    console.log("product is not collected");
                    $(".product_description-like-btn").show();
                    $(".product_description-liked-btn").hide();
                }
            } else {
                console.log(resp.data.message);
            }

        }

        var error = function () {
            console.log("product is not collected");
            $(".product_description-like-btn").show();
            $(".product_description-liked-btn").hide();
        }
        loginUtil.requestServerData("GET", isCollectedUrl, params, success, error);
    };

    var getHikId = function () {
        var hikId = $.cookie("HIKID");
        //ticket 有效
        try {
            hikId = atob(hikId);
        } catch (error) {
            console.log("Login Error:" + error);
        }
        return hikId;
    }

    var getSiteCode = function () {
        var regex = new RegExp('/hikvision/(.*?)/'),
            language = regex.exec(currentPath);
        return decodeURIComponent(language[1]);
    }

    if (storeManager.cookie.get("ticket") && productUrl) {
        //登录状态下获取产品收藏状�
        isCollected();
    }
    //console.log('watin...')
    if($('.product-description-container').length){
        var currentSite = location.href.indexOf('/uk')
        if(currentSite===-1)return
        var eolsArr = $('.product-description-container')
       $.each(eolsArr, function(index,item){
           console.log(item)
           console.log($(item))
        var baseUrl = $(item).attr('data-product-description-path').replace('product-description/', '');
        var productNumber = $(item).find('.eols-wrapper').attr('data-product-number')
              $.ajax({
                type : "GET",
                url : baseUrl+".isEol.json",
                data: {
                  site: 'uk',
                  productNumber: productNumber
                },
                dataType : "json",
                success : function(data) {
                if(data.data){
                    var signStatus = data.data.signStatus
                    if(signStatus === 1){
                        $('.product-carousel-container').find('.tag-eol').show().text('EOL')
                        $('.product-carousel-container').find('.tag-other').hide()
                    //  $(".product-eols").find('.eols-wrapper').find('.tag.tag-eol').show()
                    }      
                 }
                }
              })
       })
    }

});
var productSpotlight = (function ($) {
  var productSpotlight = {};

  productSpotlight.productSelector = function (selectedCategory, productSpotlightCarousel) {
    var $productSpotlightCarousel = productSpotlightCarousel;
    var productItems = [];

    var filteredProducts = productItems.filter(function (val) {
      return val.category.toString().toLowerCase() == selectedCategory.toLowerCase();
    });

    $.each(filteredProducts, function (i, val) {
      var $productItemWrapperElement = $('<div class="product-item-wrapper"/>');
      var $productItemElement = $('<div class="product-item"/>');
      var $productImageWrapper = $('<div class="product-item-img-wrapper"/>');
      var $productTag = $('<div class="tag"/>');
      var $productImage = $('<img/>');
      var $productItemInfo = $('<div class="product-item-info"/>');
      var $productTitle = $('<div class="title"/>');
      var $productDescription = $('<div class="description"/>');
      var $addToCompareWrapper = $('<div class="add-to-compare"/>');
      var $addToCompareInput = $('<input type="checkbox" name="addToCompare"/>');
      var $addToCompareLabel = $('<label for="addToCompare"/>');
      var $btnGo = $('<div class="btn-go"/>');

      $productImage.attr('src', val.imageSrc);
      $productTag.text(val.tag);
      $productTag.appendTo($productImageWrapper);
      $productImage.appendTo($productImageWrapper);
      $productTitle.text(val.name).appendTo($productItemInfo);
      $productDescription.text(val.description).appendTo($productItemInfo);
      $addToCompareInput.appendTo($addToCompareWrapper);
      $addToCompareLabel.text('Compare');
      $addToCompareLabel.appendTo($addToCompareWrapper);
      $addToCompareWrapper.appendTo($productItemInfo);
      $btnGo.appendTo($productItemInfo);
      $productImageWrapper.appendTo($productItemElement);
      $productItemInfo.appendTo($productItemElement);
      $productItemElement.appendTo($productItemWrapperElement);
      $productItemWrapperElement.appendTo($productSpotlightCarousel.find('.slideshow'));
    });

    productSpotlight.initCarousel();

  };

  productSpotlight.initCarousel = function (productSpotlightCarousel) {
    var $productSpotlightCarousel = $(productSpotlightCarousel);
    if (!$productSpotlightCarousel) {
      return;
    }
    var interval = $productSpotlightCarousel.attr('data-interval');
    var $dotsContainer = $productSpotlightCarousel.find('.product-carousel-dots');
    var ITEM_COUNT_IN_VIEW = 4;
    var MOBILE_WIDTH = 991;
    var clientWidth = document.body.width || window.innerWidth;
    if (clientWidth > MOBILE_WIDTH) {
      $productSpotlightCarousel.find('.slideshow').slick({
        autoplay: true,
        infinite: true,
        autoplaySpeed: interval,
        dots: true,
        appendDots: $dotsContainer,
        prevArrow: '<div class="product-carousel-pre-btn slick-pre"></div>',
        nextArrow: '<div class="product-carousel-next-btn slick-next"></div>',
        slidesToShow: ITEM_COUNT_IN_VIEW,
        slidesToScroll: 4
      })
    }
  };

  productSpotlight.initCategorySelector = function (productSpotlightCarousel) {
    var $categorySelector = $('.product-spotlight-wrapper .product-category-dropdown-wrapper');
    var $categoryDropdown = $categorySelector.find('.dropdown');
    var $categorySelectedOption = $categorySelector.find('.selected-option-wrapper .selected-option');

    $categorySelector.find('.dropdown li').on('click', function (e) {
      e.stopPropagation();
      $categorySelectedOption.text($(this).text());
      $categoryDropdown.removeClass('show remove-border');
      $categorySelector.removeClass('remove-border').find('.arrow-icon').removeClass('arrow-up');
      productSpotlight.productSelector($(this).text(), productSpotlightCarousel);
    });

    $categorySelectedOption.on('click', function (e) {
      e.stopPropagation();
      $categoryDropdown.toggleClass('show remove-border');
      $categorySelector.toggleClass('remove-border');
      $categorySelector.find('.arrow-icon').toggleClass('arrow-up');
    });

    $('body').on('click', function () {
      $categoryDropdown.removeClass('show remove-border');
      $categorySelector.removeClass('remove-border').find('.arrow-icon').removeClass('arrow-up');
    });
  };

  productSpotlight.init = function () {
    $(document).ready(function () {
      var $productSpotlightCarousel = $('.product-spotlight-wrapper');

      $.each($productSpotlightCarousel, function (key, val) {
        productSpotlight.initCarousel(val);
        productSpotlight.initCategorySelector(val);
      });

      $(".product-spotlight-container .feature-tag").click(function(e){
        var link = $(this).attr("data-href");
        if(link){
            window.open(link);
        }
        return false;
      });
    });
  };

  return productSpotlight;
}($));

productSpotlight.init();
$(document).ready(function () {
  $(".gdpr-wrapper .gdpr-button-manage").on('click', function () {
    var link = $(this).data('href');
    window.location.href = link;
  });
  $(".gdpr-wrapper .gdpr-button-accept").on('click', function () {
    storeManager.cookie.set({
      name: storeManager.STORE_NAMES.cookieDisclaimer,
      value: 0,
      path: '/',
      expirationDays: 180
    }, true);
    $(".gdpr-wrapper").css("display", "none");

      // when click accept then set all cookie category to check
      var categories = cookieEvents.getCategories();
      if (categories) {
        categories.forEach(function (value, index) {
          if (value.necessary.toString().toLowerCase() === "false") {
            value.alwaysOn = "true";
          }
        });
      }
      storeManager.cookieDisclaimerUtil.setCategories(categories);
  });
  $(".gdpr-wrapper .gdpr-button-reject").on('click', function () {
      storeManager.cookie.set({
        name: storeManager.STORE_NAMES.cookieDisclaimer,
        value: 1,
        path: '/',
        expirationDays: 180
      }, true);
      $(".gdpr-wrapper").css("display", "none");

      var categories = cookieEvents.getCategories();
      if (categories) {
        categories.forEach(function (value, index) {
          if (value.necessary.toString().toLowerCase() === "false") {
            value.alwaysOn = false;
            storeManager.cookieDisclaimerUtil.cleanCookies(value.cookieId);
          }
        });
      }
      storeManager.cookieDisclaimerUtil.setCategories(categories);
    });
});


$(document).ready(function () {
  $('#carousel-example-generic').carousel();
  $('.carousel-indicators li:first').addClass('active')
  $('.blog-top-card.carousel-item:first').addClass('active')
  $('.blog-top-card-sub-title .author').click(function (e) {
    e.stopPropagation();
    e.preventDefault();
    var link = $(this).attr('data-link');
    window.location.href = link;
  });

  var carouselItemsLength = $('.blog_content.carousel-inner').find(".blog-top-card.carousel-item").length;
    $.each($('.carousel-indicators .blog_nav'),function(index,item){
      if(index === 0 ){
        $(this).addClass('active')
      }
      $(this).attr('data-slide-to',index)
    })

  // 导航是否显示
  if (carouselItemsLength == 1) {
    $('.blog_wrap.carousel').find(".carousel-indicators").hide();
  } else {
    $('.blog_wrap.carousel').find(".carousel-indicators").show();
  }
  //time
  
  $('#carousel-example-generic').carousel({
    interval: 3000,
    pause: null,
    
  });
  // $('.blog_content.carousel-inner').carousel('cycle')

// lazyload
var $item = $('.blog-top-card-img-container.lazy-blog');
$.each($item, function(){
  var originalImage;
  if (window.innerWidth > 768) {
      originalImage = $(this).data('original');
  } else {
      originalImage = $(this).data('original-mobile');
      if (!originalImage) {
          originalImage = $(this).data('original');
      }
  }
  if ($(this).is('div') ||$(this).is('article')) {
    $(this).css('background-image', 'url("' + originalImage + '")');
  } else if ($(this).is('img')) {
    $(this).attr('src', originalImage);
  }
  });
})

/*eslint-disable*/
$(document).ready(function () {
    $('.blog-recommended .mult-column .label').click(function() {
      var index = $(this).index();
      var $targetItem = $(this).closest('.blog-recommended').find('.items').eq(index);
      $(this).addClass('active');
      $(this).siblings().removeClass('active');
      $targetItem.addClass('active');
      $targetItem.siblings().removeClass('active');
    });
});

$(document).ready(function() {
    function isMobileBreakPoint() {
        if ($(window).width() < 992) {
            return true;
        }

        return false;
    }

    function updateAssetDescMoreBtnState($targetComp) {
        $targetComp.find('.assets-list-items .asset-list-item:not(.jp-hidden) .description-section').each(function() {
            var $description = $(this).find('.description');
            var $moreBtn = $(this).find('.more-btn');
            var descriptionHeight = $description.height();
    
            if ((isMobileBreakPoint() && descriptionHeight > 56) || descriptionHeight > 66) {
                if(!($moreBtn.hasClass('active-more') || $moreBtn.hasClass('active-less'))) {
                    $moreBtn.addClass('active-more');
                }
            } else {
                $moreBtn.removeClass('active-more active-less');
                $(this).removeClass('description-open');
            }
        });
    }

    function updateFilterMoreBtnState($targetComp) {
        var $filterSection = $targetComp.find('.filter-section.active');
        var $moreBtn = $targetComp.find('.assets-list-filter-bar .more-btn');
        var $filterItems = $moreBtn.closest('.filter-items-container').find('.filter-items');
        var filterContainerHeight = $filterSection.height();

        if (isMobileBreakPoint()) {
            $moreBtn.removeClass('active-more active-less');
            $filterItems.removeClass('filter-open');
        } else {
            if (filterContainerHeight > 35) {
                if(!($moreBtn.hasClass('active-more') || $moreBtn.hasClass('active-less'))) {
                    $moreBtn.addClass('active-more');
                }
            } else {
                $moreBtn.removeClass('active-more active-less');
                $filterItems.removeClass('filter-open');
            }
        }
    }
    function moreAndLess($targetComp){
        var $topics = $targetComp.find('.filter-tabs')
        if (isMobileBreakPoint()) {
            $('.assets-list-download-filter .filter-tabs .more-btn-topic').hide()
        } else {
            if($topics.height() < 33){
                $('.assets-list-download-filter .filter-tabs .more-btn-topic').hide()
            }else{
                $('.assets-list-download-filter .filter-tabs .more-btn-topic').show()
            }
        }
    }

    function addBackdrop() {
        var backdrop = '<div class="asset-list-backdrop"></div>';
        var topics = $('.assets-list-download-filter .filter-tabs .filter-topics').find('.filter-topic')
        var flag = 0
        topics.each(function(i){
            if($(this).hasClass('active')){
                flag = i
            }
        })
        if(flag != 0){
            if(!$('.asset-list-backdrop').length) {
                $('body').append(backdrop);
                $('body').addClass('asset-backdrop-open');
                updateBackdropPosition();
            }
        }else{
            removeBackdrop()
        }
    }

    function removeBackdrop() {
        $('.asset-list-backdrop').remove();
        $('body').removeClass('asset-backdrop-open');
    }

    function updateBackdropPosition() {
        if(isMobileBreakPoint && $('.filter-section.active.mobile-open').length) {
            var $filterContainer = $('.filter-section.active.mobile-open').closest('.assets-list-filter-bar').find('.filter-items-container');
            var containerTop = $filterContainer.offset().top - $(window).scrollTop();
            var containerHeight = $filterContainer.outerHeight();
            var dropTop = containerHeight + containerTop;
            $('.asset-list-backdrop').css('top', dropTop);
        }
    }

    function initPagination($targetComp, count) { 
        var title = $targetComp.find(".title")
        title.each(function(i){
            if($(this).data("url").slice(-5) === ".html"){
                $(this).addClass("at-navigation")
                $(this).attr("data-at-module",'asset and page list::' + $(this).text()+"::" + lastNode($(this).attr('data-url')))
            }else{
                $(this).addClass("at-download")
                $(this).attr("data-at-module",'asset and page list|'+$(this).text()+'-download' )
            }
        })
        var filterTopicTitle = $targetComp.find(".filter-topic-title")
        filterTopicTitle.each(function(i){
            if($(this).attr("data-filterTopic")){
                $(this).attr("data-at-module","asset and page list::filter::" + $(this).attr("data-filterTopic").replace(/\s/ig,"_"))
            }
        })
        var $listItems = $targetComp.find('.assets-list-items .asset-list-item:visible');
        var listID = $targetComp.find('.assets-list-items').attr('id');
        var $pagination = $targetComp.find('.asstes-filter-pagination');
        
        var monthsArray = {
            '0': Granite.I18n.get('January'),
            '1': Granite.I18n.get('February'),
            '2': Granite.I18n.get('March'),
            '3': Granite.I18n.get('April'),
            '4': Granite.I18n.get('May'),
            '5': Granite.I18n.get('June'),
            '6': Granite.I18n.get('July'),
            '7': Granite.I18n.get('August'),
            '8': Granite.I18n.get('September'),
            '9': Granite.I18n.get('October'),
            '10': Granite.I18n.get('November'),
            '11': Granite.I18n.get('December'),
        }   
        $.each($('.asset-time'), function(index, item){
            if($(item).data('date')){
                var currentDateText = new Date($(item).data('date'))
                var currentDate = currentDateText.getDate()
                var currentMonth = monthsArray[currentDateText.getMonth()]
                var currentYear = currentDateText.getFullYear()
                var dateString = currentMonth + ' ' + currentDate + ','+currentYear
                $(item).text(dateString)
            } else {
                $(item).text('')
            }
        })
        if($listItems.length > count) {
            $pagination.jPages({
                containerID: listID,
                perPage: count,
                previous: Granite.I18n.get("back"),
                next: Granite.I18n.get("next"),
                keyBrowse: true,
                animation: "slideInRight"
            });
        }
    }

    function updatePagination($targetComp) {
        var $pagination = $targetComp.find('.asstes-filter-pagination');
        if ($pagination.children().length) {
            $pagination.jPages('destroy');
        }

        updateAssetDescMoreBtnState($targetComp);
        initPagination($targetComp, 10);
    }

    function ifShowAsset($targetComp, dataInfo) {
        var searchValue = $targetComp.find('.asset-list-search').attr('data-searchval');
        var $filterValue = $targetComp.find('.filter-section .filter-item.active:not(.filter-all)');
        var dataTitle = dataInfo.title.toLowerCase().trim();
        var dataDescription = dataInfo.description.toLowerCase().trim();
        var $filterTopicFirst = $('.assets-list-download-filter .filter-tabs .filter-topics .filter-topic-first');
        var first = $filterTopicFirst.hasClass('active');
        //search
        if(dataTitle.indexOf(searchValue) < 0 && dataDescription.indexOf(searchValue) < 0) {
            return false;
        }
        //filter
        if($filterTopicFirst.length !== 0 && !first){
            if($filterValue.length) {
                var filterBy = $targetComp.attr('data-filter-by');
                if(filterBy === 'category') {
                    return dataInfo.category === $filterValue.attr('data-tag');
                } else {
                    return dataInfo.tags.indexOf($filterValue.attr('data-tag')) >= 0;
                }
            } else {
                var filterBy = $targetComp.attr('data-filter-by');
                var activeTopicAll = $targetComp.find('.filter-section.active').find('.filter-item:not(.filter-all)');
                var arr = []
                if(activeTopicAll.length){
                    activeTopicAll.each(function() {
                        arr.push($(this).attr('data-tag'))
                    })
                    if(filterBy === 'category') {
                        return arr.indexOf(dataInfo.category) >= 0;
                    } else {
                        var qwe = false
                        qwe = dataInfo.tags.some( function( item, index, array ){  
                            return arr.indexOf(item) >= 0 
                        })
                        return qwe
                    }
                }else{
                    return false
                }
            }
        }else{
            return true
        }
    }
    
     function ifShowNoResultIcon($targetComp) {
        var $visibleAsset = $targetComp.find('.assets-list-items .asset-list-item:visible');
        if($visibleAsset.length) {
            $targetComp.find('.no-result-found').removeClass('show');
        } else {
            $targetComp.find('.no-result-found').addClass('show');
        }
    }

    function filterAsset($targetComp) {
        var $assetList = $targetComp.find('.assets-list-items .asset-list-item');
        $assetList.each(function() {
            var dataInfo = JSON.parse($(this).attr('data-info'));
            var showAsset = true;
            showAsset = ifShowAsset($targetComp, dataInfo);
            showAsset? $(this).show() : $(this).hide();
        });
        updatePagination($targetComp);
        ifShowNoResultIcon($targetComp);
    }

    function updateURL($targetFilter) {
        var filter = $targetFilter.attr('data-tag');
        var index = $targetFilter.closest('.filter-section').index();
        var group = $targetFilter.closest('.assets-list-filter-bar').find('.filter-topic').eq(index).attr('data-tag');
        var oldURL = window.location.href;
        var newURL;
        var re1 = new RegExp('([?&])' + 'filtergroup=.*?(&|$)', 'i');
        var re2 = new RegExp('([?&])' + 'filter=.*?(&|$)', 'i');
        var separator = oldURL.indexOf('?') !== -1 ? '&' : '?';
        if (oldURL.match(re1) && oldURL.match(re2)) {
            oldURL = oldURL.replace(re1, '$1' + 'filtergroup=' + group + '$2');
            newURL = oldURL.replace(re2, '$1' + 'filter=' + filter + '$2');
        } else {
            newURL = oldURL + separator + 'filtergroup=' + group +'&filter=' + filter;
        }

        window.history.replaceState({
            path: newURL
        }, null, newURL);
    }

    function getURLParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var value = window.location.search.substr(1).match(reg);
        if (value) {
            return decodeURI(value[2]);
        }
        return '';
    }

    function initListBaseOnURL($targetComp) {
        var group = getURLParam('filtergroup');
        var filter = getURLParam('filter');
        var container = $('.filter-items-container')
        if(group && filter) {
            var $filterTopic = $targetComp.find('.assets-list-filter-bar .filter-topic[data-tag="' + group + '"]');
            if($filterTopic.length) {
                var index = $filterTopic.index();
                var $filterItem = $targetComp.find('.assets-list-filter-bar .filter-section').eq(index).find('.filter-item[data-tag="' + filter + '"]');
                $filterTopic.click();
                $filterItem.click();
            }
        }else{
            container.addClass('hide')
            container.removeClass('show')
        }
    }
    var clickTopicIndex = 0
    $('.assets-list-download-filter .filter-tabs .filter-topic').on('click', function() {
        var $filterBar = $(this).closest('.assets-list-filter-bar');
        var category = $(this).data("tag");
        var filterIndex = $(this).index();
            if (isMobileBreakPoint()) {
                // if(filterIndex != 0){
                    var path = window.location.origin + window.location.pathname
                    window.history.replaceState({
                        path: path
                    }, null, path);
                    if ($(this).hasClass('active mobile-open')) {
                        $filterBar.find('.filter-section[data-category="'+category+'"]').removeClass('mobile-open');
                        $(this).removeClass('mobile-open');
                        removeBackdrop();
                    } else {
                        $filterBar.find('.filter-topic').removeClass('active mobile-open');
                        $filterBar.find('.filter-section').removeClass('active mobile-open');
                        $(this).addClass('active mobile-open');
                        $filterBar.find('.filter-section[data-category="'+category+'"]').addClass('active mobile-open');
                        addBackdrop();
                    }
                    filterAsset($(this).closest('.assets-list-download-filter'))
                // }else{
                //     console.log('1')
                //     $filterBar.find('.filter-topic').removeClass('active mobile-open');
                //     $filterBar.find('.filter-section').removeClass('active mobile-open');
                //     removeBackdrop();
                //     $('.assets-list-items').find('.asset-list-item').show()
                //     updatePagination($filterBar.closest('.assets-list-download-filter'));
                //     ifShowNoResultIcon($filterBar.closest('.assets-list-download-filter'));
                //     // filterAsset($(this).closest('.assets-list-download-filter'))
                //     // var path = window.location.origin + window.location.pathname
                //     // window.history.replaceState({
                //     //     path: path
                //     // }, null, path);
                // }
            } else {
                    $filterBar.find('.filter-section').removeClass('active mobile-open');
                    $filterBar.find('.filter-topic').removeClass('active mobile-open');
                    $(this).addClass('active mobile-open');
                    $filterBar.find('.filter-section[data-category="'+category+'"]').addClass('active mobile-open');
                    addBackdrop();
                    var container = $('.filter-items-container')
                    if(filterIndex == 0){
                        // $('.assets-list-items').find('.asset-list-item').show()
                        updatePagination($filterBar.closest('.assets-list-download-filter'));
                        ifShowNoResultIcon($filterBar.closest('.assets-list-download-filter'));
                        container.addClass('hide')
                        container.removeClass('show')
                        filterAsset($(this).closest('.assets-list-download-filter'))
                        var path = window.location.origin + window.location.pathname
                        window.history.replaceState({
                            path: path
                        }, null, path);
                    }else{
                        if(clickTopicIndex != filterIndex){
                            container.removeClass('hide')
                            container.addClass('show')
                            clickTopicIndex = filterIndex
                        }else {
                            container.toggleClass('hide')
                            container.toggleClass('show')
                        }
                    }
            } 
        $(this).closest('.assets-list-filter-bar').find('.filter-items-container .filter-items .filter-section.active .filter-item.active').click()
        updateFilterMoreBtnState($filterBar.closest('.assets-list-download-filter'));
        updateBackdropPosition();
        calculateElementLocation($(this));
    });

    $('.assets-list-download-filter .filter-items-container .more-btn').on('click', function() {
        $(this).toggleClass('active-more active-less');
        $(this).closest('.filter-items-container').find('.filter-items').toggleClass('filter-open');
    });
    $('.assets-list-download-filter .filter-tabs .more-btn-topic').on('click', function() {
        var more = $(this).find('.btn-topic-more')
        var less = $(this).find('.btn-topic-less')
        var topics = $(this).parent().find('.filter-topics')
        more.toggleClass('btn-topic-none');
        less.toggleClass('btn-topic-none');
        topics.toggleClass('asset-list-less')
    });
    $('.assets-list-download-filter .filter-items-container .filter-item').on('click', function() {
        var $brotherTopicFilter = $(this).closest('.filter-section').siblings();
        $brotherTopicFilter.find('.filter-item').removeClass('active');
        $brotherTopicFilter.find('.filter-item.filter-all').addClass('active');
        $(this).addClass('active');
        $(this).siblings().removeClass('active');
        // $(this).closest('.assets-list-filter-bar').find('.filter-topic.active').click();
        filterAsset($(this).closest('.assets-list-download-filter'));
        updateURL($(this));
    });

    $('body').on('click', '.asset-list-backdrop', function() {
        $('.assets-list-download-filter .filter-tabs .filter-topic.active.mobile-open').click();
    });
    $('body').on('click',function(e) {
        var container = $('.filter-items-container')
        var arr = ['filter-topic','filter-topic-title','filter-item','filter-items-container','filter-items','filter-section']
        var flag = true
        arr.forEach(function (i) {
            if($(e.target).hasClass(i)){
                flag = false
                return
            }
        })
        if( flag ){
            container.addClass('hide')
        }
    });

    $('.assets-list-download-filter .assets-list-items .more-btn').on('click', function() {
        $(this).toggleClass('active-more active-less');
        $(this).closest('.description-section').toggleClass('description-open');
    });

    $('.assets-list-download-filter .asset-search-btn').on('click', function() {
        var searchValue = $(this).closest('.asset-list-search').find('.search').val();
        searchValue = searchValue.trim().toLowerCase();
        $(this).closest('.asset-list-search').attr('data-searchval', searchValue);
        filterAsset($(this).closest('.assets-list-download-filter'));
    });

    $('.assets-list-download-filter .asset-list-search .search').on('keydown', function(e) {
        if (e.keyCode == 13){
            $(this).parent().find('.asset-search-btn').click();
        }
    });

    function downloadCheckLoginHandle($targetComp){
        var $assetList = $targetComp.find(".assets-list-items");
        var checkLogin = $assetList.data("download-check-login");
        var showAgreement = $assetList.data("show-agreement");
        if(checkLogin && !showAgreement){
            $assetList.find(".download-link").each(function(){
                $(this).on('click',function(){
                    var ticket = getLoginCookie("ticket");
                    if(ticket && ticket!="123"){
                        loginUtil.checkLogin();
                    }else{
                        loginUtil.popupLoginConfirmModal();
                        return false;
                    }
                })
            });
            $assetList.find(".title").each(function(){
                $(this).on('click',function(){
                    var ticket = getLoginCookie("ticket");
                    if(ticket && ticket!="123"){
                        loginUtil.checkLogin();
                    }else{
                        loginUtil.popupLoginConfirmModal();
                        return false;
                    }
                })
            });
        }
        if(!checkLogin && showAgreement) {
            var downloadLinks = $assetList.find(".download-link");
            $.each(downloadLinks, function (key, val) {
                var btnUrlOrg = $(val).attr('href');
                var btnUrl = btnUrlOrg;
                btnUrl = header.checkLoginStatusForDownload(btnUrl, $assetList);
                $(val).attr('href', btnUrl);
            });
            var downloadLinks2 = $assetList.find(".title");
            $.each(downloadLinks2, function (key, val) {
                var btnUrlOrg = $(val).attr('href');
                var btnUrl = btnUrlOrg;
                btnUrl = header.checkLoginStatusForDownload(btnUrl, $assetList);
                $(val).attr('href', btnUrl);
            });
        }
        
        // if(checkLogin && showAgreement) {
        //     $assetList.find(".download-link").each(function(){
        //         $(this).on('click',function(){
        //             var ticket = getLoginCookie("ticket");
        //             if(ticket && ticket!="123"){
        //                 loginUtil.checkLogin();
        //             }else{
        //                 loginUtil.popupLoginConfirmModal();
        //                 return false;
        //             }
        //         })
        //     });
        //     $assetList.find(".title").each(function(){
        //         $(this).on('click',function(){
        //             var ticket = getLoginCookie("ticket");
        //             if(ticket && ticket!="123"){
        //                 loginUtil.checkLogin();
        //             }else{
        //                 loginUtil.popupLoginConfirmModal();
        //                 return false;
        //             }
        //         })
        //     });
        // }
    };
    
    function touchMove(){
        var startx;
        var endx;  
        var itemContainer = $('.filter-items-container')
        function judge() { 
            var flag = 0;
            var topic = $('.assets-list-download-filter .filter-tabs .filter-topic')
            topic.each(function(index,item) {
                if($(this).hasClass('active')){
                    flag = index
                }
            })
            if ( (endx - startx) < -20 ) {  //判断左右移动程序  
                if(flag != (topic.length - 1)){ 
                    // 向右
                    topic.eq(flag+1).click()
                }
            } else if((endx - startx) > 20) {  
                if(flag > 0){
                    // 向左
                    topic.eq(flag-1).click()
                 }
            }  
        }  
        itemContainer.on('touchstart', function (e) {  
            startx = e.originalEvent.changedTouches[0].pageX;
            // startY = e.originalEvent.changedTouches[0].pageY;
        });  
        itemContainer.on('touchend', function (e) {  
            endx = e.originalEvent.changedTouches[0].pageX;
            // endy = e.originalEvent.changedTouches[0].pageY;  
            judge();  
        });  
    }

    // 计算二级导航栏位置
    function calculateElementLocation($positioningElement) {
        if($(window).width() > 992 && $positioningElement.index() != 0 ){
            var positionTop = $positioningElement.position().top + $positioningElement.outerHeight();
            var positionLeft = $positioningElement.position().left + 11;
            var $contaoner = $('.assets-list-download-filter .filter-items-container')
            var top = $contaoner.find('.filter-top')
            if($contaoner.find('.filter-section').hasClass('active')){
                $contaoner.removeClass('hide')
                if($(window).width() - positionLeft < 400){
                    $contaoner.css({
                        'top' : positionTop + 8 + 'px',
                        'left' : $(window).width() -422 + 'px',
                    })
                    top.css({
                        left: positionLeft - $(window).width() + 422 + 'px'
                    })
                }else{
                    $contaoner.css({
                        'top' : positionTop + 8 + 'px',
                        'left' : positionLeft + 'px',
                    })
                    
                    top.css({
                        left: '20px'
                    })
                }
            }else{
                $contaoner.addClass('hide')
            }
        }
    }
    $('.assets-list-download-filter').each(function() {
        var $targetComp = $(this);
        moreAndLess($targetComp)
        updateFilterMoreBtnState($targetComp);
        updateAssetDescMoreBtnState($targetComp);
        downloadCheckLoginHandle($targetComp);
        initPagination($targetComp, 10);
        initListBaseOnURL($targetComp);
        touchMove()

        var $listItems = $targetComp.find('.assets-list-items .asset-list-item')
        $.each($listItems, function(index, item){
            $(item).find('a.title').on('click', function(e){
               e.stopPropagation()
               e.preventDefault()
               window.open($(this).data('url'), '_blank')
            })
        })
        $(window).resize(function() {
            moreAndLess($targetComp)
            updateFilterMoreBtnState($targetComp);
            updateAssetDescMoreBtnState($targetComp);
            downloadCheckLoginHandle($targetComp);
            updateBackdropPosition();
            if($(window).width() <= 992){
                touchMove()
            }
        });
    });
});

var cookieEvents = (function ($) {
  var cookieEvents = {};
  cookieEvents.switchButtonClick = function () {
    $('.cookie-policy-switch').change(function (e) {
      var isOn = $(this).prop('checked');
      var id = $(this).data('id');
      var title = $(this).data('title');
      var necessary = $(this).data('necessary');
      var enabledDefault = $(this).data('enabledDefault');

      var categories = cookieEvents.getCategories();
      var index = _.findIndex(categories, function (item) {
        return item.cookieId === id;
      });
      if (index >= 0) {
        categories[index].alwaysOn = isOn;
      } else {
        var cookiePolicy = {
          "cookieId": id,
          "cookieTitle": title,
          "necessary": necessary,
          "enabledDefault": enabledDefault,
          "alwaysOn": isOn.toString()
        };
        categories.push(cookiePolicy);
      }

      cookieEvents.setCategories(categories);
      if (!isOn) {
        storeManager.cookieDisclaimerUtil.cleanCookies(id);
      }

      var gdprConsentCookie = storeManager.cookie.get(storeManager.STORE_NAMES.cookieDisclaimer);
      if (!gdprConsentCookie || gdprConsentCookie === "0") {
        storeManager.cookie.set({
          name: storeManager.STORE_NAMES.cookieDisclaimer,
          value: storeManager.cookieDisclaimerUtil.getCookieDisclaimer().timestamp,
          path: '/',
          expirationDays: 180
        });
      }
      $(".gdpr-wrapper").css("display", "none");

      if (atModel.checkAtSdk()) {
        var title = $(this).data('at-module');
        if (!isNull(title)) {
          title = title.split(' ').join('_');
          title = title + (isOn ? "::on" : "::off");
        }
        // at event
        atModel.doAtEvent(title, 'action', e);
      }

    });
  };
  cookieEvents.setCookieDisclaimer = function (cookieDisclaimer) {
    storeManager.cookieDisclaimerUtil.setCookieDisclaimer(cookieDisclaimer);
  };
  cookieEvents.getCookieDisclaimer = function () {
    return storeManager.cookieDisclaimerUtil.getCookieDisclaimer();
  };
  cookieEvents.getCategories = function () {
    return storeManager.cookieDisclaimerUtil.getCategories();
  };
  cookieEvents.setCategories = function (categories) {
    return storeManager.cookieDisclaimerUtil.setCategories(categories);
  };
  cookieEvents.initCookiePolicy = function () {
    var categories = cookieEvents.getCategories();
    if (categories) {
      var gdprConsentCookie = storeManager.cookie.get(storeManager.STORE_NAMES.cookieDisclaimer);
      var accept = gdprConsentCookie === "0";
      categories.forEach(function (value, index) {
        var switchVaule = "off";
        if (accept) {
          switchVaule = "on";
        } else {
          switchVaule = value.alwaysOn.toString().toLowerCase() === "true" ? 'on' : 'off'
        }
        if (value.necessary.toString().toLowerCase() === "false") {
          $('.cookie-policy-switch[data-id="' + value.cookieId + '"]').bootstrapToggle(switchVaule);
        }
      });
    }
  };
  cookieEvents.init = function () {
    $(document).ready(function () {
      cookieEvents.initCookiePolicy();
      cookieEvents.switchButtonClick();
    });
  };
  return cookieEvents;
}($));
cookieEvents.init();

var offerings = (function ($) {
  var offerings = {};

  offerings.isTouchDevice = function () {
    var prefixes = ' -webkit- -moz- -o- -ms- '.split(' ');
    var mq = function (query) {
      return window.matchMedia(query).matches;
    }

    if (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
      return true;
    }
    var query = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join('');
    return mq(query);
  }

  offerings.showContactBtn = function () {

    var $offeringsContactbtn = $(".button-wrapper");
    var $offeringsContent = $(".offering-content");
    var $offeringsWrapper = $('.offerings-container');
    if ($(window).width() >= 768 && $(window).width() < 992) {
      //if (offerings.isTouchDevice()) {
      //  $offeringsWrapper.find($offeringsContactbtn).show();
      //}
      $offeringsWrapper.find($offeringsContactbtn).show();
    } else if ($(window).width() < 768) {
      $offeringsWrapper.find($offeringsContactbtn).hide();
    } else {
      $offeringsContent.on("mouseover", function (e) {
        if ($(window).width() > 991.98) {
          var ctaBtn= $(this).find($offeringsContactbtn);
          $(ctaBtn).stop().slideDown(500,function () {
            $(ctaBtn).css('padding-top', '0px');
            $(ctaBtn).css('padding-bottom', '0px');
          });
        }
      });

      $offeringsContent.on("mouseleave", function (e) {
        if ($(window).width() > 991.98) {
          $(this).find($offeringsContactbtn).stop().slideUp(500);
        }
      });
    }
  };
  offerings.init = function () {
    $(document).ready(function () {
      /* offerings  annimation */
      var $offeringsContactbtn = $(".button-wrapper");
      var $offeringsContent = $(".offering-content");
      var $offeringsWrapper = $('.offerings-container');
      $offeringsContactbtn.hide();
      offerings.showContactBtn();
      $(window).resize(function () {
        offerings.showContactBtn();
      });

      // Contact Us to download.
      var btns = $('.offering-container-wrapper .offerings-wrapper .offerings-content-wrapper .offering-content .button-wrapper a.btn-contact');

      $.each(btns, function (key, val) {
        var btnUrlOrg = $(val).attr('href');
        var btnUrl = btnUrlOrg;

        if (btnUrl) {
            var paths = btnUrlOrg.split('.');
            if (paths > 1) {
              var extension = paths[1];
              if (extension.toLowerCase() != 'html') {
                $(val).removeClass('at-navigation');
                $(val).addClass('at-download');
              }
            }
        }
        btnUrl =  header.checkLoginStatusForDownload(btnUrl, val);
        $(val).attr('href', btnUrl);
        if (btnUrl !== '#download-agreement') {
          $(val).removeAttr('data-toggle');

          $(val).removeClass('at-action');
          if (btnUrl == btnUrlOrg) {
            $(val).removeClass('at-exit');
            $(val).addClass('at-download');
          } else if (btnUrl.toLowerCase().indexOf("javascript")>=0) {
              $(val).removeClass('at-exit');
              $(val).addClass('at-download');
          } else {
              $(val).removeClass('at-download');
              $(val).addClass('at-exit');
          }
        }
      });

    });
  };

  return offerings;
}($));

offerings.init();
var contentGallery = (function($) {
    var contentGallery = {};
    contentGallery.allowThumbnailScroll = function() {
        var $contentGallery = $('.content-gallery-wrapper');
        var $thumbnails = $contentGallery.find('.thumbnail');
        var thumbnailsTotalHeight = 0;

        $thumbnails.each(function() {
            thumbnailsTotalHeight += $(this).outerHeight(true);
        });

        $contentGallery.find('#contentGallery').on(
                'shown.bs.modal',
                function(e) {
                    if (thumbnailsTotalHeight > $contentGallery.find('.modal-body').outerHeight(true)) {
                        if ($(window).width() < 992) {
                            $contentGallery.find('.thumbnails-wrapper').removeClass('allow-scroll-vertical').addClass(
                                    'allow-scroll-horizontal');
                        } else {
                            $contentGallery.find('.thumbnails-wrapper').removeClass('allow-scroll-horizontal')
                                    .addClass('allow-scroll-vertical');
                        }
                    } else {
                        $contentGallery.find('.thumbnails-wrapper').removeClass(
                                'allow-scroll-horizontal allow-scroll-vertical');
                    }
                });
    };

    contentGallery.initImageDownload = function() {
        var $contentGallery = $('.content-gallery-wrapper');
        var $highlightsParallexWrapper = $('.highlights-parallex');
        // add download action.
        $contentGallery.find('.download').on('click', function() {
            var url = $contentGallery.find('.cycle-slide-active .original-img').attr('src');
            var fileName = $contentGallery.find('.cycle-slide-active .original-img').attr('data-file-name');

            var link = document.createElement('a');
            link.setAttribute('href', url);
            link.setAttribute('download', fileName);
            link.setAttribute('target', '_blank');
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
        var currentIndex = 0;
        $highlightsParallexWrapper.find('.highlights-image-item a').on(
                'click',
                function() {
                    currentIndex = $(this).closest('.highlights-image-item').index();
                    $contentGallery.find('.cycle-slideshow').cycle('goto', currentIndex);

                    setTimeout(function() {
                        var windowWidth = $(window).width();
                        if (windowWidth > 992) {
                            var imageContainerWidth = $(".content-gallery-wrapper .modal-body .cycle-slideshow")
                                    .width();

                            var calculateHeight = imageContainerWidth / 1.777;

                            $('.content-gallery-wrapper .modal-body .cycle-slideshow .original-img').css('height',
                                    calculateHeight);
                            $('.content-gallery-wrapper .modal-body').height(calculateHeight);
                            $('.content-gallery-wrapper .modal-body .cycle-slideshow').height(calculateHeight);

                            var calheight = $(".content-gallery-wrapper .modal-body .cycle-slideshow").height();

                            $('.content-gallery-wrapper .thumbnails-wrapper').css("max-height", calheight);
                            console.log("max-height", calheight);
                            $('.content-gallery-wrapper .thumbnails-wrapper').css("overflow", "auto");

                        }
                        $(window).on('resize orientationchange', function() {

                            var tempwindowWidth = $(window).width();
                            console.log(tempwindowWidth);

                            if (tempwindowWidth > 992) {

                                var calheight = $(".content-gallery-wrapper .modal-body .cycle-slideshow").height();

                                $('.content-gallery-wrapper .thumbnails-wrapper').css("max-height", calheight);

                                $('.content-gallery-wrapper .thumbnails-wrapper').css("overflow", "auto");
                            } else if (tempwindowWidth < 992) {
                                console.log("inside if  less than 992");
                                var calheight = $(".content-gallery-wrapper .modal-body .cycle-slideshow").height();

                                $('.content-gallery-wrapper .thumbnails-wrapper').css("max-height", calheight);

                                $('.content-gallery-wrapper .thumbnails-wrapper').css("overflow", "auto");
                            }
                        });

                    }, 500);
                });

    };

    var computedMobileHeight = function(){
        var highlightsParallex = $(".highlights-parallex")
        var titleMobile = highlightsParallex.find(".highlights-item-title-mobile")
        var mobileHeight = 0
        if(titleMobile.css("display") == 'block'){
            titleMobile.css({
                height:'auto'
            })
            titleMobile.length > 0 && titleMobile.each(function(){
                mobileHeight < $(this).height() && ( mobileHeight = $(this).height() ) 
            })
            titleMobile.css({
                height:mobileHeight+'px'
            })
        }
    }
    contentGallery.mobileDesStyle = function () {
        computedMobileHeight()
        $(window).resize(function () {
            computedMobileHeight()
        })
    }

    contentGallery.init = function() {
        $(document).ready(function() {
            contentGallery.initImageDownload();
            contentGallery.allowThumbnailScroll();
            contentGallery.mobileDesStyle()
        });
    };

    return contentGallery;

})($);

contentGallery.init();

/**
 * NewsRoom Carousel. Its cyclic carousel.
 */
var newsroomCarousel = (function ($) {
    var newsroomCarousel = {};
    var currentDate = $(".newsrroom-newDate")
    currentDate && currentDate.length > 0 && currentDate.each(function () {
        if ( window.location.href.indexOf('/cn') > -1 && $(this).attr("data-newDate")) {
            var tmpStr = $(this).attr("data-newDate").replace(",", "")
            var tmpArr = tmpStr.split(" ")
            var tmpNum = ''
            switch (tmpArr[0]) {
                case "January":
                    tmpNum = 1
                    break;
                case "February":
                    tmpNum = 2
                    break;
                case "March":
                    tmpNum = 3
                    break;
                case "April":
                    tmpNum = 4
                    break;
                case "May":
                    tmpNum = 5
                    break;
                case "June":
                    tmpNum = 6
                    break;
                case "July":
                    tmpNum = 7
                    break;
                case "August":
                    tmpNum = 8
                    break;
                case "September":
                    tmpNum = 9
                    break;
                case "October":
                    tmpNum = 10
                    break;
                case "November":
                    tmpNum = 11
                    break;
                case "December":
                    tmpNum = 12
                    break;

                default:
                    break;
            }
            $(this).text(tmpArr[2] + "年" + tmpNum + "月" + tmpArr[1] + "日")
        } else {
            $(this).text($(this).attr("data-newDate"))
        }
    })

    var currentDateMobel = $(".newsroom-mobile-view__image-info--title")
    currentDateMobel && currentDateMobel.length > 0 && currentDateMobel.each(function () {
        if ( window.location.href.indexOf('/cn') > -1  &&  $(this).attr("data-newDate")) {
            var tmpStrMobel = $(this).attr("data-newDate").replace(",", "")
            var tmpArrMobel = tmpStrMobel.split(" ")
            var tmpNumMobel = ''
            switch (tmpArrMobel[0]) {
                case "January":
                    tmpNumMobel = 1
                    break;
                case "February":
                    tmpNumMobel = 2
                    break;
                case "March":
                    tmpNumMobel = 3
                    break;
                case "April":
                    tmpNumMobel = 4
                    break;
                case "May":
                    tmpNumMobel = 5
                    break;
                case "June":
                    tmpNumMobel = 6
                    break;
                case "July":
                    tmpNumMobel = 7
                    break;
                case "August":
                    tmpNumMobel = 8
                    break;
                case "September":
                    tmpNumMobel = 9
                    break;
                case "October":
                    tmpNumMobel = 10
                    break;
                case "November":
                    tmpNumMobel = 11
                    break;
                case "December":
                    tmpNumMobel = 12
                    break;

                default:
                    break;
            }
            $(this).text(tmpArrMobel[2] + "年" + tmpNumMobel + "月" + tmpArrMobel[1] + "日")
        } else {
            $(this).text($(this).attr("data-newDate"))
        }
    })
    var currentDateMobel = $(".newsroom-mobile-view__image-info--title")
    currentDateMobel && currentDateMobel.length > 0 && currentDateMobel.each(function () {
        if ( window.location.href.indexOf('/cn') > -1 && $(this).attr("data-newDate")) {
            var tmpStrMobel = $(this).attr("data-newDate").replace(",", "")
            var tmpArrMobel = tmpStrMobel.split(" ")
            var tmpNumMobel = ''
            switch (tmpArrMobel[0]) {
                case "January":
                    tmpNumMobel = 1
                    break;
                case "February":
                    tmpNumMobel = 2
                    break;
                case "March":
                    tmpNumMobel = 3
                    break;
                case "April":
                    tmpNumMobel = 4
                    break;
                case "May":
                    tmpNumMobel = 5
                    break;
                case "June":
                    tmpNumMobel = 6
                    break;
                case "July":
                    tmpNumMobel = 7
                    break;
                case "August":
                    tmpNumMobel = 8
                    break;
                case "September":
                    tmpNumMobel = 9
                    break;
                case "October":
                    tmpNumMobel = 10
                    break;
                case "November":
                    tmpNumMobel = 11
                    break;
                case "December":
                    tmpNumMobel = 12
                    break;

                default:
                    break;
            }
            $(this).text(tmpArrMobel[2] + "年" + tmpNumMobel + "月" + tmpArrMobel[1] + "日")
        } else {
            $(this).text($(this).attr("data-newDate"))
        }
    })


    /**
     * Initialise carousel Read transition time from data attr.
     */
    newsroomCarousel.initCarousel = function () {
        var $newsroomCarouselWrapper = $('#newsroom-carousel');

        if ($newsroomCarouselWrapper.css('display') !== 'none') {
            $newsroomCarouselWrapper
                .find('.carousel-inner')
                .slick(
                    {
                        infinite: true,
                        useCSS: false,
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        centerMode: true,
                        centerPadding: '305px',
                        prevArrow: newsroomCarousel.rtlPrev(),
                        nextArrow: newsroomCarousel.rtlNext(),
                        autoplay: true,
                        autoplaySpeed: $newsroomCarouselWrapper.attr('data-interval'),
                        responsive: [{
                            breakpoint: 1024,
                            settings: {
                                centerMode: true,
                                centerPadding: '180px',
                            }
                        }],
                        rtl: newsroomCarousel.isRtl()
                    });
        }
    }

    newsroomCarousel.init = function () {
        $(document).ready(function () {
            newsroomCarousel.initCarousel();
            // newsroomCarousel.buildCarouselItems();
        });
    };

    newsroomCarousel.isRtl = function () {
        if ($('body').hasClass("rtl")) {
            $('#newsroom-carousel').find(".carousel-inner").attr("dir", "rtl");
            return true;
        } else {
            return false;
        }
    };

    newsroomCarousel.rtlPrev = function () {
        if (newsroomCarousel.isRtl()) {
            return '<a class="carousel-control-next" href="#newsroom-carousel" role="button" data-slide="next"> <span class="carousel-control-next-icon" aria-hidden="true"> </span><span class="sr-only">Previous </span></a>';
        } else {
            return '<a class="carousel-control-prev" href="#newsroom-carousel" role="button" data-slide="prev"> <span class="carousel-control-prev-icon" aria-hidden="true"> </span><span class="sr-only">Previous</span></a> ';
        }
    };

    newsroomCarousel.rtlNext = function () {
        if (newsroomCarousel.isRtl()) {
            return '<a class="carousel-control-prev" href="#newsroom-carousel" role="button" data-slide="prev"> <span class="carousel-control-prev-icon" aria-hidden="true"> </span><span class="sr-only">Next</span></a> ';
        } else {
            return '<a class="carousel-control-next" href="#newsroom-carousel" role="button" data-slide="next"> <span class="carousel-control-next-icon" aria-hidden="true"> </span><span class="sr-only">Next </span></a>';
        }
    };

    return newsroomCarousel;
}($));

newsroomCarousel.init();

;(function ($) {
    /**
     * 2a: 70-30
     * 3: 33-33-33
     * 2b: 30-70
     * 1: 50-50
     * */
    var LAYOUT_CLASS_LIST = ['layout2a', 'layout3', 'layout2b', 'layout1']
    var PROPOSED_WIDTH = 1370
    var MOBILE_WIDTH = 992
    var BASIC_HEIGHT = 400
    var FONT_MIN_RATIO = 12 / 18
    var PADDING_SPACE = 30 * 2
    var MARGIN_SPACE = 25 * 2

    var setSplitBannerSize = function () {
        // 用window.innerWidth会把滚动条的宽度一并计算进来，导致问题，因此这里用document.body.client
        // document.body.clientWidth 有些情况下会报错
        var screenWidth = $('body').width()
        if(document.body&&document.body.clientWidth){
            screenWidth = document.body.clientWidth
        }
        var ratio = screenWidth / PROPOSED_WIDTH
        var respectiveWidth = (screenWidth - PADDING_SPACE - MARGIN_SPACE) / 3
        LAYOUT_CLASS_LIST.forEach(function (cls) {
            $('.split-banner-wrapper').find('.' + cls).each(function () {
                var $carouselWrapper1 = $(this).find('.split-banner-wrapper.carousel1')
                var $carouselWrapper2 = $(this).find('.split-banner-wrapper.carousel2')
                var $carouselWrapper3 = $(this).find('.split-banner-wrapper.carousel3')
                if (screenWidth <= MOBILE_WIDTH || screenWidth >= PROPOSED_WIDTH) {
                    $carouselWrapper1.removeAttr('style')
                    $carouselWrapper2.removeAttr('style')
                    $carouselWrapper3.removeAttr('style')
                    $(this).removeAttr('style')
                    $(this).find('.split-banner-wrapper').each(function () {
                        $(this).find('.split-banner-content__header').removeAttr('style')
                        $(this).find('.split-banner-content__subheader').removeAttr('style')
                        $(this).find('.split-banner-content__item-detail').removeAttr('style')
                    })
                } else {
                    // 992-1370之间不同布局随比例调整宽高
                    $(this).css('height', BASIC_HEIGHT * ratio)
                    $(this).find('.split-banner-wrapper').each(function () {
                        $(this).find('.split-banner-content__header').css('font-size', 24 * Math.max(ratio, FONT_MIN_RATIO))
                        $(this).find('.split-banner-content__subheader').css('font-size', 18 * Math.max(ratio, FONT_MIN_RATIO))
                        $(this).find('.split-banner-content__item-detail').css('font-size', 18 * Math.max(ratio, FONT_MIN_RATIO))
                    })
                    if (cls === 'layout2a') {
                        $carouselWrapper2.css('width', respectiveWidth)
                    }
                    if (cls === 'layout3') {
                        $carouselWrapper1.css('width', respectiveWidth)
                        $carouselWrapper2.css('width', respectiveWidth)
                        $carouselWrapper3.css('width', respectiveWidth)
                    }
                    if (cls === 'layout2b') {
                        $carouselWrapper1.css('width', respectiveWidth)
                    }
                }
            })
        })
    }

    setSplitBannerSize()
    $(window).resize(setSplitBannerSize)
    function BuryingPointFn(element, preModule) {
        var href = $(element).attr('href')
        var lastHrefIndex = lastNode(href);
        $(element).attr('data-at-module', preModule + lastHrefIndex);
    }

    $.each($('.carousel-inner .carousel-item a.at-navigation'), function (index, item) {
        if ($(this).attr('href')) {
            var preModule = $(this).attr('data-at-module')
            BuryingPointFn(item, preModule)
            var ahref = $(this).attr('href')
            var target = $(this).attr('target')
            $(this).on('click', function (e) {
                e.preventDefault()
                setTimeout(function () {
                    window.open(ahref, target || '_self')
                }, 500)
            })
        }
    })
    $.each($('.carousel-inner .carousel-item .video-play-btn-center a'), function (index, item) {
        if ($(this).attr('data-video-path')) {
            var preModule = $(this).attr('data-at-module')
            var path = $(this).attr('data-video-path')
            var lastHrefIndex = lastNode(path);
            $(this).attr('data-at-module', preModule + lastHrefIndex);
        }
    })

    $.each($('.split-banner-carousel'),function(){
        if($(this).prev().hasClass('split-banner-carousel')){
            $(this).css('padding-top','0px');
            window.innerWidth > 991 ? $(this).prev().css('padding-bottom','25px') : false ;
        }
    })

    $('.split-banner-carousel .at-navigation:not(.hik-video-trigger)').on('click',function(){
        var analyticsStr=$(this).attr('data-analytics')
        HiAnalyticsCn.clickDown(analyticsStr)
    })

    // if($('.split-banner-wrapper').length){
    //     $.ajax({
    //         type:"get",
    //         url:"./css/split-banner-css.html", //需要获取的页面内容
    //         async:true,
    //         success:function(data){
    //         console.log('data666', data)
    //         $('head').append(data);
    //       }
    //    })
    // }
})($);
function isEmpty(val) {
    return (val === undefined || val == null || val.length <= 0) ? true : false;
}

function postAjax(form) {

    var alertMessage = function(msg) {
        if (isEmpty(msg) || msg === "null") {
            msg = "Error occured";
        }
        $('.subscribe-failed-msg').html(msg);
        $('.subscribe-failed-msg').show();
        $('.subscribe-success-msg').hide();
    };
    var formData = $(form).serializeArray();
    $.ajax({
        url : form.action,
        type : 'POST',
        data : formData,
        processData : true
    }).done(function(result) {
        $('.subscribe-failed-msg').hide();
        $('.subscribe-success-msg').hide();
        if (result && result.status == 200) {
            $('.subscribe-success-msg').show();
            setTimeout(function() {
                $('.subscribe-modal').modal('hide');
            }, 3000);
        } else if (result && result.message) {
            alertMessage(result.message);
        } else {
            console.warn("Unrecognized response detected:" + result.toString());
        }
    }).fail(function(data) {

        var resultBean = null;
        try {
            resultBean = JSON.parse(data.responseText);
        } catch (error) {
            console.log(error.message);
        }
        if (resultBean) {
            alertMessage(resultBean.message);
        } else {
            alertMessage("Unknown Error occurred!");
        }
    })
    // using the done promise callback
    .always(function(data) {
        // log data to the console so we can see
        console.log(data);
        // here we will handle errors and validation messages
    });
}

var subscribeForm = (function($) {
    var subscribeForm = {};

    subscribeForm.init = function() {
        $(document).ready(function() {
            var form = $('.subscribe-modal form');
            $.validator.setDefaults({

                submitHandler : function(form, evt) {
                    // stop the form from submitting the normal way and refreshing the page
                    // $('.subscribe-failed-msg').hide();
                    $('.subscribe-success-msg').hide();

                    postAjax(form);
                }
            });

            // custom method to add regex
            $.validator.addMethod("regex", function(value, element, regexp) {
                var check = false;
                return this.optional(element) || regexp.test(value);
            }, "Please enter a valid value.");

            form.validate({
                rules : {
                    FirstName : {
                        required : $(this).find('input[name="FirstName"]').data('required'),
                        regex : /^[a-zA-Z]+$/
                    },
                    LastName : {
                        required : $(this).find('input[name="LastName"]').data('required'),
                        regex : /^[a-zA-Z]+$/
                    },
                    email : {
                        required : $(this).find('input[name="email"]').data('required'),
                        email : true
                    },
                    Company : {
                        required : $(this).find('input[name="Company"]').data('required')
                    },

                    Type : {
                        required : $(this).find('select[name="Type"]').data('required')
                    }

                },
                messages : {
                    FirstName : {
                        regex : $(this).find('input[name="FirstName"]').data('errormsg')
                    },
                    LastName : {
                        regex : $(this).find('input[name="LastName"]').data('errormsg')
                    },
                    email : {
                        regex : $(this).find('input[name="email"]').data('errormsg')
                    }
                },
                errorElement : "em",
                errorPlacement : function(error, element) {
                    // Add the `help-block` class to the error element
                    error.addClass("help-block");

                    if (element.prop("type") === "checkbox") {
                        error.insertAfter(element.parent("label"));
                    } else {
                        error.insertAfter(element);
                    }
                },
                highlight : function(element, errorClass, validClass) {
                    $(element).parents(".col-sm-5").addClass("has-error").removeClass("has-success");
                },
                unhighlight : function(element, errorClass, validClass) {
                    $(element).parents(".col-sm-5").addClass("has-success").removeClass("has-error");
                }
            });

            $('.subscribe-modal').on('hidden.bs.modal', function() {
                $('.subscribe-failed-msg').hide();
                $('.subscribe-success-msg').hide();

                form.validate().resetForm();
                form[0].reset();
                $('.subscribe-success-msg').hide();
            });

        });
    };

    return subscribeForm;
}($));

subscribeForm.init();

var stories = (function($) {
    var stories = {};

    stories.init = function() {
        $(document).ready(
                function() {
                    $.each($(".stories__image-container-parent"), function(){
                        $(this).on("mouseover", function(){
                            $(".stories__image-container-parent").removeClass("active")
                            $(this).addClass("active")
                        })
                    })
                    $(".swiper-button-prev, .swiper-button-next").on("click", function(){
                        setTimeout(function(){
                            $(".stories__image-container-parent").removeClass("active")
                        }, 100)
                    })
                    $(".stories-carousel-wrapper").show();
                    var mySwiper =  new Swiper('.swiper-container', {
                        slidesPerView: $(window).width() > 991 ? 3 : 1.5,
                        spaceBetween: $(window).width() > 991 ? 5 : 0,
                        direction: 'horizontal',
                        navigation: {
                            nextEl: '.swiper-button-next',
                            prevEl: '.swiper-button-prev'
                        }
                    });
                    if(isCN && isIe()){
                        if($(".stories__image-info--success-stories").text().length>=52){
                            $(".stories__image-info--success-stories").addClass("ie")
                        }
                        if($(".stories__image-info--heading .title").text().length>=45){
                            $(".stories__image-info--heading .title").addClass("ie")
                        }
                    }
                    
                    var currentBreakpoint = getCurrentBreakpoint();
                    if(!isCN){
                        initSuccessTags();
                    }
                    function initSuccessTags (){
                     var baseUrl = $(".swiper-wrapper").attr("data-baseUrl");
                     var filterName = $(".swiper-wrapper").attr("data-filter-type");
                     if (baseUrl && filterName) {
                        $.ajax({
                          type: "GET",
                          url: baseUrl +  ".json",
                          success: function (data) {
                            if (data && data.content) {
                             handleSuccessTags(data.content.data.dataArray);
                            }
                          },
                        });
                      }
                    };
                    function handleSuccessTags(data){
                        var industryArr = []
                        var locationArr = []
                        if(currentBreakpoint !== 'DESKTOP'){
                            $.each($(".stories-mobile-view__image-container"), function(){
                                var title = $(this).find(".stories-mobile-view__image-info--heading").attr("data-title")
                                var findTagItem = data.find(function(item){
                                    return item.title == title
                                })
                                if(findTagItem&& findTagItem.tags){
                                    if(findTagItem.tags.industry.length){
                                        $(this).find(".stories-mobile-view__image-info--heading").before("<div class='industry_tag' style='margin-bottom:10px;font-size:14px;'>"+findTagItem.tags.industry[0]+"</div>")
                                        $(this).find(".stories__image-info").addClass("industry-mob-tags-info")
                                    }
                                    if(findTagItem.tags.location.length){
                                        $(this).find(".stories-mobile-view__image-info--heading").after("<div class='location_tag' style='margin-top:10px;font-size:14px;'>"+findTagItem.tags.location[0]+"</div>")
                                        $(this).find(".stories__image-info").addClass("location-mob-tags-info")
                                    }   
                                }
                            })
                        } else {
                            $.each($(".stories-carousel-wrapper .swiper-slide"), function(){
                                var title = $(this).find(".stories__image-info--heading").attr("data-title")
                                var findTagItem = data.find(function(item){
                                    return item.title == title
                                })
                                if(findTagItem&& findTagItem.tags){
                                    if(findTagItem.tags.industry.length){
                                        $(this).find(".stories__image-info--heading").before("<div class='industry_tag'>"+findTagItem.tags.industry[0]+"</div>")
                                        $(this).find(".stories__image-info").addClass("industry-tags-info")
                                    } else {
                                        $(this).find(".stories__image-info--heading").before("<div class='industry_tag' style='height:1px;margin-top:15px'></div>")
                                    }
                                    if(findTagItem.tags.location.length){
                                        $(this).find(".stories__image-info--heading").after("<div class='location_tag'>"+findTagItem.tags.location[0]+"</div>")
                                        $(this).find(".stories__image-info").addClass("location-tags-info")
                                    } else {
                                        $(this).find(".stories__image-info--heading").after("<div class='location_tag' style='height:1px;margin-bottom:15px'></div>")
                                    }
                                }   
                            })
                        }
                        setTimeout(function(){
                            $.each($(".stories-carousel-wrapper .swiper-slide"), function(){
                                if(!$(this).find(".stories__image-info--heading .title").text()){
                                    $(this).remove()
                                }
                                if($(this).find(".industry_tag").text()){
                                    industryArr.push($(this).find(".industry_tag").text())
                                }
                                if($(this).find(".location_tag").text()){
                                    locationArr.push($(this).find(".location_tag").text())
                                }
                            })
                            if(!industryArr.length){
                                $(".industry_tag").hide()
                            }
                            if(!locationArr.length){
                                $(".location_tag").hide()
                            }
                        }, 1000)
                    }
                    // Global variable
                    var storiesCarouselWrapper = $('.stories-carousel-wrapper');

                    // Dynamically generate carousel items and indicators.
                    var itemWraps = $(storiesCarouselWrapper).find('.carousel-inner')
                     $.each(itemWraps, function(index, item){
                         $(item).parent().attr('id', 'stories-carousel' + index)
                        var items = $(item).find('.stories__image-container-parent');
                        var carouselId = $(item).parent().parent().find('.carousel').attr('id');
                        var slideCount =  -1;
                        for (var i = 0; i < items.length; i += 3) {
                            slideCount++;
                            items.slice(i, i + 3).wrapAll('<div class="carousel-item"></div>');
                            if (i === 0) {
                                $(item).parent().find('.carousel-indicators').append(
                                        '<li data-target="#' + carouselId  + '" data-slide-to="' + slideCount
                                                + '" class="active"></li>');
                            } else {
                                $(item).parent().find('.carousel-indicators').append(
                                        '<li data-target="#' + carouselId + '" data-slide-to="' + slideCount + '"></li>');
                            }
                        }
                        $(item).find('.carousel-item:first-child').addClass('active');
                     })   
                  //  $(storiesCarouselWrapper).find('.carousel-inner .carousel-item:first-child').addClass('active');

                  //  For carousel slide
                    var $storiesCarousel = $(storiesCarouselWrapper).find(".desktop-tab-view");
                    for (var i = 0; i < $storiesCarousel.length; i++) {
                        var carouselItemsLength = $($storiesCarousel[i]).find(".carousel-item").length;
                        if (carouselItemsLength == 1) {
                            $($storiesCarousel[i]).find(".carousel-indicators").hide();
                        } else {
                            $($storiesCarousel[i]).find(".carousel-indicators").show();
                        }
                    }

                    // Card-info animation
                    $(storiesCarouselWrapper).find(".stories__image-info--success-stories-description").hide();
                    $(storiesCarouselWrapper).find(".desktop-tab-view .stories__image-container-parent").on(
                            "mouseover",
                            function(e) {
                                $(this).addClass('hover');
                                $(this).find('.stories__image-container').addClass('hover');
                                if (!$(this).find(".stories__image-info--success-stories-description").is(":empty")
                                        && $.trim($(this).find(".stories__image-info--success-stories-description")
                                                .text()) != "") {
                                    $(this).find(".stories__image-info--success-stories-description").show();
                                }
                            });

                    $(storiesCarouselWrapper).find(".desktop-tab-view .stories__image-container-parent").on(
                            "mouseleave",
                            function(e) {
                                $(this).removeClass('hover');
                                $(this).find('.stories__image-container').removeClass('hover');

                                if (!$(this).find(".stories__image-info--success-stories-description").is(":empty")
                                        && $.trim($(this).find(".stories__image-info--success-stories-description")
                                                .text()) != "") {
                                    $(this).find(".stories__image-info--success-stories-description").hide();
                                }
                            });

                    $(storiesCarouselWrapper).find(".desktop-tab-view .stories__image-info").on("mouseover",
                            function(e) {
                                $(this).find('.stories__image-info--success-stories').css({
                                    'overflow' : 'hidden',
                                });
                            });

                    $(storiesCarouselWrapper).find(".desktop-tab-view .stories__image-info").on("mouseleave",
                            function(e) {
                                $(this).find('.stories__image-info--success-stories').css({
                                    'overflow' : 'hidden',
                                });
                            });
                  //计算pc端stories__image-container-parent的最大的高度
                  var hArr = []
                  $.each($(".stories__image-container-parent"), function(){
                    hArr.push($(this).find(".stories__image-info .stories_heading-wrapper").outerHeight())
                  }) 
                  $("body .stories__image-container-parent .stories__image-info .stories__image-info--heading").css({
                    "height": hArr.sort()[hArr.length-1] + "px"
                  })   
                });
    };

    return stories;
}($));
function isIe(){
    return window.ActiveXObject || "ActiveXObject" in window
  }
stories.init();
/**!

 @license
 handlebars v4.1.2

Copyright (C) 2011-2017 by Yehuda Katz

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Handlebars"] = factory();
	else
		root["Handlebars"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _interopRequireDefault = __webpack_require__(1)['default'];

	exports.__esModule = true;

	var _handlebarsRuntime = __webpack_require__(2);

	var _handlebarsRuntime2 = _interopRequireDefault(_handlebarsRuntime);

	// Compiler imports

	var _handlebarsCompilerAst = __webpack_require__(35);

	var _handlebarsCompilerAst2 = _interopRequireDefault(_handlebarsCompilerAst);

	var _handlebarsCompilerBase = __webpack_require__(36);

	var _handlebarsCompilerCompiler = __webpack_require__(41);

	var _handlebarsCompilerJavascriptCompiler = __webpack_require__(42);

	var _handlebarsCompilerJavascriptCompiler2 = _interopRequireDefault(_handlebarsCompilerJavascriptCompiler);

	var _handlebarsCompilerVisitor = __webpack_require__(39);

	var _handlebarsCompilerVisitor2 = _interopRequireDefault(_handlebarsCompilerVisitor);

	var _handlebarsNoConflict = __webpack_require__(34);

	var _handlebarsNoConflict2 = _interopRequireDefault(_handlebarsNoConflict);

	var _create = _handlebarsRuntime2['default'].create;
	function create() {
	  var hb = _create();

	  hb.compile = function (input, options) {
	    return _handlebarsCompilerCompiler.compile(input, options, hb);
	  };
	  hb.precompile = function (input, options) {
	    return _handlebarsCompilerCompiler.precompile(input, options, hb);
	  };

	  hb.AST = _handlebarsCompilerAst2['default'];
	  hb.Compiler = _handlebarsCompilerCompiler.Compiler;
	  hb.JavaScriptCompiler = _handlebarsCompilerJavascriptCompiler2['default'];
	  hb.Parser = _handlebarsCompilerBase.parser;
	  hb.parse = _handlebarsCompilerBase.parse;

	  return hb;
	}

	var inst = create();
	inst.create = create;

	_handlebarsNoConflict2['default'](inst);

	inst.Visitor = _handlebarsCompilerVisitor2['default'];

	inst['default'] = inst;

	exports['default'] = inst;
	module.exports = exports['default'];

/***/ }),
/* 1 */
/***/ (function(module, exports) {

	"use strict";

	exports["default"] = function (obj) {
	  return obj && obj.__esModule ? obj : {
	    "default": obj
	  };
	};

	exports.__esModule = true;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _interopRequireWildcard = __webpack_require__(3)['default'];

	var _interopRequireDefault = __webpack_require__(1)['default'];

	exports.__esModule = true;

	var _handlebarsBase = __webpack_require__(4);

	var base = _interopRequireWildcard(_handlebarsBase);

	// Each of these augment the Handlebars object. No need to setup here.
	// (This is done to easily share code between commonjs and browse envs)

	var _handlebarsSafeString = __webpack_require__(21);

	var _handlebarsSafeString2 = _interopRequireDefault(_handlebarsSafeString);

	var _handlebarsException = __webpack_require__(6);

	var _handlebarsException2 = _interopRequireDefault(_handlebarsException);

	var _handlebarsUtils = __webpack_require__(5);

	var Utils = _interopRequireWildcard(_handlebarsUtils);

	var _handlebarsRuntime = __webpack_require__(22);

	var runtime = _interopRequireWildcard(_handlebarsRuntime);

	var _handlebarsNoConflict = __webpack_require__(34);

	var _handlebarsNoConflict2 = _interopRequireDefault(_handlebarsNoConflict);

	// For compatibility and usage outside of module systems, make the Handlebars object a namespace
	function create() {
	  var hb = new base.HandlebarsEnvironment();

	  Utils.extend(hb, base);
	  hb.SafeString = _handlebarsSafeString2['default'];
	  hb.Exception = _handlebarsException2['default'];
	  hb.Utils = Utils;
	  hb.escapeExpression = Utils.escapeExpression;

	  hb.VM = runtime;
	  hb.template = function (spec) {
	    return runtime.template(spec, hb);
	  };

	  return hb;
	}

	var inst = create();
	inst.create = create;

	_handlebarsNoConflict2['default'](inst);

	inst['default'] = inst;

	exports['default'] = inst;
	module.exports = exports['default'];

/***/ }),
/* 3 */
/***/ (function(module, exports) {

	"use strict";

	exports["default"] = function (obj) {
	  if (obj && obj.__esModule) {
	    return obj;
	  } else {
	    var newObj = {};

	    if (obj != null) {
	      for (var key in obj) {
	        if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
	      }
	    }

	    newObj["default"] = obj;
	    return newObj;
	  }
	};

	exports.__esModule = true;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _interopRequireDefault = __webpack_require__(1)['default'];

	exports.__esModule = true;
	exports.HandlebarsEnvironment = HandlebarsEnvironment;

	var _utils = __webpack_require__(5);

	var _exception = __webpack_require__(6);

	var _exception2 = _interopRequireDefault(_exception);

	var _helpers = __webpack_require__(10);

	var _decorators = __webpack_require__(18);

	var _logger = __webpack_require__(20);

	var _logger2 = _interopRequireDefault(_logger);

	var VERSION = '4.1.2';
	exports.VERSION = VERSION;
	var COMPILER_REVISION = 7;

	exports.COMPILER_REVISION = COMPILER_REVISION;
	var REVISION_CHANGES = {
	  1: '<= 1.0.rc.2', // 1.0.rc.2 is actually rev2 but doesn't report it
	  2: '== 1.0.0-rc.3',
	  3: '== 1.0.0-rc.4',
	  4: '== 1.x.x',
	  5: '== 2.0.0-alpha.x',
	  6: '>= 2.0.0-beta.1',
	  7: '>= 4.0.0'
	};

	exports.REVISION_CHANGES = REVISION_CHANGES;
	var objectType = '[object Object]';

	function HandlebarsEnvironment(helpers, partials, decorators) {
	  this.helpers = helpers || {};
	  this.partials = partials || {};
	  this.decorators = decorators || {};

	  _helpers.registerDefaultHelpers(this);
	  _decorators.registerDefaultDecorators(this);
	}

	HandlebarsEnvironment.prototype = {
	  constructor: HandlebarsEnvironment,

	  logger: _logger2['default'],
	  log: _logger2['default'].log,

	  registerHelper: function registerHelper(name, fn) {
	    if (_utils.toString.call(name) === objectType) {
	      if (fn) {
	        throw new _exception2['default']('Arg not supported with multiple helpers');
	      }
	      _utils.extend(this.helpers, name);
	    } else {
	      this.helpers[name] = fn;
	    }
	  },
	  unregisterHelper: function unregisterHelper(name) {
	    delete this.helpers[name];
	  },

	  registerPartial: function registerPartial(name, partial) {
	    if (_utils.toString.call(name) === objectType) {
	      _utils.extend(this.partials, name);
	    } else {
	      if (typeof partial === 'undefined') {
	        throw new _exception2['default']('Attempting to register a partial called "' + name + '" as undefined');
	      }
	      this.partials[name] = partial;
	    }
	  },
	  unregisterPartial: function unregisterPartial(name) {
	    delete this.partials[name];
	  },

	  registerDecorator: function registerDecorator(name, fn) {
	    if (_utils.toString.call(name) === objectType) {
	      if (fn) {
	        throw new _exception2['default']('Arg not supported with multiple decorators');
	      }
	      _utils.extend(this.decorators, name);
	    } else {
	      this.decorators[name] = fn;
	    }
	  },
	  unregisterDecorator: function unregisterDecorator(name) {
	    delete this.decorators[name];
	  }
	};

	var log = _logger2['default'].log;

	exports.log = log;
	exports.createFrame = _utils.createFrame;
	exports.logger = _logger2['default'];

/***/ }),
/* 5 */
/***/ (function(module, exports) {

	'use strict';

	exports.__esModule = true;
	exports.extend = extend;
	exports.indexOf = indexOf;
	exports.escapeExpression = escapeExpression;
	exports.isEmpty = isEmpty;
	exports.createFrame = createFrame;
	exports.blockParams = blockParams;
	exports.appendContextPath = appendContextPath;
	var escape = {
	  '&': '&amp;',
	  '<': '&lt;',
	  '>': '&gt;',
	  '"': '&quot;',
	  "'": '&#x27;',
	  '`': '&#x60;',
	  '=': '&#x3D;'
	};

	var badChars = /[&<>"'`=]/g,
	    possible = /[&<>"'`=]/;

	function escapeChar(chr) {
	  return escape[chr];
	}

	function extend(obj /* , ...source */) {
	  for (var i = 1; i < arguments.length; i++) {
	    for (var key in arguments[i]) {
	      if (Object.prototype.hasOwnProperty.call(arguments[i], key)) {
	        obj[key] = arguments[i][key];
	      }
	    }
	  }

	  return obj;
	}

	var toString = Object.prototype.toString;

	exports.toString = toString;
	// Sourced from lodash
	// https://github.com/bestiejs/lodash/blob/master/LICENSE.txt
	/* eslint-disable func-style */
	var isFunction = function isFunction(value) {
	  return typeof value === 'function';
	};
	// fallback for older versions of Chrome and Safari
	/* istanbul ignore next */
	if (isFunction(/x/)) {
	  exports.isFunction = isFunction = function (value) {
	    return typeof value === 'function' && toString.call(value) === '[object Function]';
	  };
	}
	exports.isFunction = isFunction;

	/* eslint-enable func-style */

	/* istanbul ignore next */
	var isArray = Array.isArray || function (value) {
	  return value && typeof value === 'object' ? toString.call(value) === '[object Array]' : false;
	};

	exports.isArray = isArray;
	// Older IE versions do not directly support indexOf so we must implement our own, sadly.

	function indexOf(array, value) {
	  for (var i = 0, len = array.length; i < len; i++) {
	    if (array[i] === value) {
	      return i;
	    }
	  }
	  return -1;
	}

	function escapeExpression(string) {
	  if (typeof string !== 'string') {
	    // don't escape SafeStrings, since they're already safe
	    if (string && string.toHTML) {
	      return string.toHTML();
	    } else if (string == null) {
	      return '';
	    } else if (!string) {
	      return string + '';
	    }

	    // Force a string conversion as this will be done by the append regardless and
	    // the regex test will do this transparently behind the scenes, causing issues if
	    // an object's to string has escaped characters in it.
	    string = '' + string;
	  }

	  if (!possible.test(string)) {
	    return string;
	  }
	  return string.replace(badChars, escapeChar);
	}

	function isEmpty(value) {
	  if (!value && value !== 0) {
	    return true;
	  } else if (isArray(value) && value.length === 0) {
	    return true;
	  } else {
	    return false;
	  }
	}

	function createFrame(object) {
	  var frame = extend({}, object);
	  frame._parent = object;
	  return frame;
	}

	function blockParams(params, ids) {
	  params.path = ids;
	  return params;
	}

	function appendContextPath(contextPath, id) {
	  return (contextPath ? contextPath + '.' : '') + id;
	}

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _Object$defineProperty = __webpack_require__(7)['default'];

	exports.__esModule = true;

	var errorProps = ['description', 'fileName', 'lineNumber', 'message', 'name', 'number', 'stack'];

	function Exception(message, node) {
	  var loc = node && node.loc,
	      line = undefined,
	      column = undefined;
	  if (loc) {
	    line = loc.start.line;
	    column = loc.start.column;

	    message += ' - ' + line + ':' + column;
	  }

	  var tmp = Error.prototype.constructor.call(this, message);

	  // Unfortunately errors are not enumerable in Chrome (at least), so `for prop in tmp` doesn't work.
	  for (var idx = 0; idx < errorProps.length; idx++) {
	    this[errorProps[idx]] = tmp[errorProps[idx]];
	  }

	  /* istanbul ignore else */
	  if (Error.captureStackTrace) {
	    Error.captureStackTrace(this, Exception);
	  }

	  try {
	    if (loc) {
	      this.lineNumber = line;

	      // Work around issue under safari where we can't directly set the column value
	      /* istanbul ignore next */
	      if (_Object$defineProperty) {
	        Object.defineProperty(this, 'column', {
	          value: column,
	          enumerable: true
	        });
	      } else {
	        this.column = column;
	      }
	    }
	  } catch (nop) {
	    /* Ignore if the browser is very particular */
	  }
	}

	Exception.prototype = new Error();

	exports['default'] = Exception;
	module.exports = exports['default'];

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(8), __esModule: true };

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

	var $ = __webpack_require__(9);
	module.exports = function defineProperty(it, key, desc){
	  return $.setDesc(it, key, desc);
	};

/***/ }),
/* 9 */
/***/ (function(module, exports) {

	var $Object = Object;
	module.exports = {
	  create:     $Object.create,
	  getProto:   $Object.getPrototypeOf,
	  isEnum:     {}.propertyIsEnumerable,
	  getDesc:    $Object.getOwnPropertyDescriptor,
	  setDesc:    $Object.defineProperty,
	  setDescs:   $Object.defineProperties,
	  getKeys:    $Object.keys,
	  getNames:   $Object.getOwnPropertyNames,
	  getSymbols: $Object.getOwnPropertySymbols,
	  each:       [].forEach
	};

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _interopRequireDefault = __webpack_require__(1)['default'];

	exports.__esModule = true;
	exports.registerDefaultHelpers = registerDefaultHelpers;

	var _helpersBlockHelperMissing = __webpack_require__(11);

	var _helpersBlockHelperMissing2 = _interopRequireDefault(_helpersBlockHelperMissing);

	var _helpersEach = __webpack_require__(12);

	var _helpersEach2 = _interopRequireDefault(_helpersEach);

	var _helpersHelperMissing = __webpack_require__(13);

	var _helpersHelperMissing2 = _interopRequireDefault(_helpersHelperMissing);

	var _helpersIf = __webpack_require__(14);

	var _helpersIf2 = _interopRequireDefault(_helpersIf);

	var _helpersLog = __webpack_require__(15);

	var _helpersLog2 = _interopRequireDefault(_helpersLog);

	var _helpersLookup = __webpack_require__(16);

	var _helpersLookup2 = _interopRequireDefault(_helpersLookup);

	var _helpersWith = __webpack_require__(17);

	var _helpersWith2 = _interopRequireDefault(_helpersWith);

	function registerDefaultHelpers(instance) {
	  _helpersBlockHelperMissing2['default'](instance);
	  _helpersEach2['default'](instance);
	  _helpersHelperMissing2['default'](instance);
	  _helpersIf2['default'](instance);
	  _helpersLog2['default'](instance);
	  _helpersLookup2['default'](instance);
	  _helpersWith2['default'](instance);
	}

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _utils = __webpack_require__(5);

	exports['default'] = function (instance) {
	  instance.registerHelper('blockHelperMissing', function (context, options) {
	    var inverse = options.inverse,
	        fn = options.fn;

	    if (context === true) {
	      return fn(this);
	    } else if (context === false || context == null) {
	      return inverse(this);
	    } else if (_utils.isArray(context)) {
	      if (context.length > 0) {
	        if (options.ids) {
	          options.ids = [options.name];
	        }

	        return instance.helpers.each(context, options);
	      } else {
	        return inverse(this);
	      }
	    } else {
	      if (options.data && options.ids) {
	        var data = _utils.createFrame(options.data);
	        data.contextPath = _utils.appendContextPath(options.data.contextPath, options.name);
	        options = { data: data };
	      }

	      return fn(context, options);
	    }
	  });
	};

	module.exports = exports['default'];

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _interopRequireDefault = __webpack_require__(1)['default'];

	exports.__esModule = true;

	var _utils = __webpack_require__(5);

	var _exception = __webpack_require__(6);

	var _exception2 = _interopRequireDefault(_exception);

	exports['default'] = function (instance) {
	  instance.registerHelper('each', function (context, options) {
	    if (!options) {
	      throw new _exception2['default']('Must pass iterator to #each');
	    }

	    var fn = options.fn,
	        inverse = options.inverse,
	        i = 0,
	        ret = '',
	        data = undefined,
	        contextPath = undefined;

	    if (options.data && options.ids) {
	      contextPath = _utils.appendContextPath(options.data.contextPath, options.ids[0]) + '.';
	    }

	    if (_utils.isFunction(context)) {
	      context = context.call(this);
	    }

	    if (options.data) {
	      data = _utils.createFrame(options.data);
	    }

	    function execIteration(field, index, last) {
	      if (data) {
	        data.key = field;
	        data.index = index;
	        data.first = index === 0;
	        data.last = !!last;

	        if (contextPath) {
	          data.contextPath = contextPath + field;
	        }
	      }

	      ret = ret + fn(context[field], {
	        data: data,
	        blockParams: _utils.blockParams([context[field], field], [contextPath + field, null])
	      });
	    }

	    if (context && typeof context === 'object') {
	      if (_utils.isArray(context)) {
	        for (var j = context.length; i < j; i++) {
	          if (i in context) {
	            execIteration(i, i, i === context.length - 1);
	          }
	        }
	      } else {
	        var priorKey = undefined;

	        for (var key in context) {
	          if (context.hasOwnProperty(key)) {
	            // We're running the iterations one step out of sync so we can detect
	            // the last iteration without have to scan the object twice and create
	            // an itermediate keys array.
	            if (priorKey !== undefined) {
	              execIteration(priorKey, i - 1);
	            }
	            priorKey = key;
	            i++;
	          }
	        }
	        if (priorKey !== undefined) {
	          execIteration(priorKey, i - 1, true);
	        }
	      }
	    }

	    if (i === 0) {
	      ret = inverse(this);
	    }

	    return ret;
	  });
	};

	module.exports = exports['default'];

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _interopRequireDefault = __webpack_require__(1)['default'];

	exports.__esModule = true;

	var _exception = __webpack_require__(6);

	var _exception2 = _interopRequireDefault(_exception);

	exports['default'] = function (instance) {
	  instance.registerHelper('helperMissing', function () /* [args, ]options */{
	    if (arguments.length === 1) {
	      // A missing field in a {{foo}} construct.
	      return undefined;
	    } else {
	      // Someone is actually trying to call something, blow up.
	      throw new _exception2['default']('Missing helper: "' + arguments[arguments.length - 1].name + '"');
	    }
	  });
	};

	module.exports = exports['default'];

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _utils = __webpack_require__(5);

	exports['default'] = function (instance) {
	  instance.registerHelper('if', function (conditional, options) {
	    if (_utils.isFunction(conditional)) {
	      conditional = conditional.call(this);
	    }

	    // Default behavior is to render the positive path if the value is truthy and not empty.
	    // The `includeZero` option may be set to treat the condtional as purely not empty based on the
	    // behavior of isEmpty. Effectively this determines if 0 is handled by the positive path or negative.
	    if (!options.hash.includeZero && !conditional || _utils.isEmpty(conditional)) {
	      return options.inverse(this);
	    } else {
	      return options.fn(this);
	    }
	  });

	  instance.registerHelper('unless', function (conditional, options) {
	    return instance.helpers['if'].call(this, conditional, { fn: options.inverse, inverse: options.fn, hash: options.hash });
	  });
	};

	module.exports = exports['default'];

/***/ }),
/* 15 */
/***/ (function(module, exports) {

	'use strict';

	exports.__esModule = true;

	exports['default'] = function (instance) {
	  instance.registerHelper('log', function () /* message, options */{
	    var args = [undefined],
	        options = arguments[arguments.length - 1];
	    for (var i = 0; i < arguments.length - 1; i++) {
	      args.push(arguments[i]);
	    }

	    var level = 1;
	    if (options.hash.level != null) {
	      level = options.hash.level;
	    } else if (options.data && options.data.level != null) {
	      level = options.data.level;
	    }
	    args[0] = level;

	    instance.log.apply(instance, args);
	  });
	};

	module.exports = exports['default'];

/***/ }),
/* 16 */
/***/ (function(module, exports) {

	'use strict';

	exports.__esModule = true;

	exports['default'] = function (instance) {
	  instance.registerHelper('lookup', function (obj, field) {
	    if (!obj) {
	      return obj;
	    }
	    if (field === 'constructor' && !obj.propertyIsEnumerable(field)) {
	      return undefined;
	    }
	    return obj[field];
	  });
	};

	module.exports = exports['default'];

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _utils = __webpack_require__(5);

	exports['default'] = function (instance) {
	  instance.registerHelper('with', function (context, options) {
	    if (_utils.isFunction(context)) {
	      context = context.call(this);
	    }

	    var fn = options.fn;

	    if (!_utils.isEmpty(context)) {
	      var data = options.data;
	      if (options.data && options.ids) {
	        data = _utils.createFrame(options.data);
	        data.contextPath = _utils.appendContextPath(options.data.contextPath, options.ids[0]);
	      }

	      return fn(context, {
	        data: data,
	        blockParams: _utils.blockParams([context], [data && data.contextPath])
	      });
	    } else {
	      return options.inverse(this);
	    }
	  });
	};

	module.exports = exports['default'];

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _interopRequireDefault = __webpack_require__(1)['default'];

	exports.__esModule = true;
	exports.registerDefaultDecorators = registerDefaultDecorators;

	var _decoratorsInline = __webpack_require__(19);

	var _decoratorsInline2 = _interopRequireDefault(_decoratorsInline);

	function registerDefaultDecorators(instance) {
	  _decoratorsInline2['default'](instance);
	}

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _utils = __webpack_require__(5);

	exports['default'] = function (instance) {
	  instance.registerDecorator('inline', function (fn, props, container, options) {
	    var ret = fn;
	    if (!props.partials) {
	      props.partials = {};
	      ret = function (context, options) {
	        // Create a new partials stack frame prior to exec.
	        var original = container.partials;
	        container.partials = _utils.extend({}, original, props.partials);
	        var ret = fn(context, options);
	        container.partials = original;
	        return ret;
	      };
	    }

	    props.partials[options.args[0]] = options.fn;

	    return ret;
	  });
	};

	module.exports = exports['default'];

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _utils = __webpack_require__(5);

	var logger = {
	  methodMap: ['debug', 'info', 'warn', 'error'],
	  level: 'info',

	  // Maps a given level value to the `methodMap` indexes above.
	  lookupLevel: function lookupLevel(level) {
	    if (typeof level === 'string') {
	      var levelMap = _utils.indexOf(logger.methodMap, level.toLowerCase());
	      if (levelMap >= 0) {
	        level = levelMap;
	      } else {
	        level = parseInt(level, 10);
	      }
	    }

	    return level;
	  },

	  // Can be overridden in the host environment
	  log: function log(level) {
	    level = logger.lookupLevel(level);

	    if (typeof console !== 'undefined' && logger.lookupLevel(logger.level) <= level) {
	      var method = logger.methodMap[level];
	      if (!console[method]) {
	        // eslint-disable-line no-console
	        method = 'log';
	      }

	      for (var _len = arguments.length, message = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	        message[_key - 1] = arguments[_key];
	      }

	      console[method].apply(console, message); // eslint-disable-line no-console
	    }
	  }
	};

	exports['default'] = logger;
	module.exports = exports['default'];

/***/ }),
/* 21 */
/***/ (function(module, exports) {

	// Build out our basic SafeString type
	'use strict';

	exports.__esModule = true;
	function SafeString(string) {
	  this.string = string;
	}

	SafeString.prototype.toString = SafeString.prototype.toHTML = function () {
	  return '' + this.string;
	};

	exports['default'] = SafeString;
	module.exports = exports['default'];

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _Object$seal = __webpack_require__(23)['default'];

	var _interopRequireWildcard = __webpack_require__(3)['default'];

	var _interopRequireDefault = __webpack_require__(1)['default'];

	exports.__esModule = true;
	exports.checkRevision = checkRevision;
	exports.template = template;
	exports.wrapProgram = wrapProgram;
	exports.resolvePartial = resolvePartial;
	exports.invokePartial = invokePartial;
	exports.noop = noop;

	var _utils = __webpack_require__(5);

	var Utils = _interopRequireWildcard(_utils);

	var _exception = __webpack_require__(6);

	var _exception2 = _interopRequireDefault(_exception);

	var _base = __webpack_require__(4);

	function checkRevision(compilerInfo) {
	  var compilerRevision = compilerInfo && compilerInfo[0] || 1,
	      currentRevision = _base.COMPILER_REVISION;

	  if (compilerRevision !== currentRevision) {
	    if (compilerRevision < currentRevision) {
	      var runtimeVersions = _base.REVISION_CHANGES[currentRevision],
	          compilerVersions = _base.REVISION_CHANGES[compilerRevision];
	      throw new _exception2['default']('Template was precompiled with an older version of Handlebars than the current runtime. ' + 'Please update your precompiler to a newer version (' + runtimeVersions + ') or downgrade your runtime to an older version (' + compilerVersions + ').');
	    } else {
	      // Use the embedded version info since the runtime doesn't know about this revision yet
	      throw new _exception2['default']('Template was precompiled with a newer version of Handlebars than the current runtime. ' + 'Please update your runtime to a newer version (' + compilerInfo[1] + ').');
	    }
	  }
	}

	function template(templateSpec, env) {
	  /* istanbul ignore next */
	  if (!env) {
	    throw new _exception2['default']('No environment passed to template');
	  }
	  if (!templateSpec || !templateSpec.main) {
	    throw new _exception2['default']('Unknown template object: ' + typeof templateSpec);
	  }

	  templateSpec.main.decorator = templateSpec.main_d;

	  // Note: Using env.VM references rather than local var references throughout this section to allow
	  // for external users to override these as psuedo-supported APIs.
	  env.VM.checkRevision(templateSpec.compiler);

	  function invokePartialWrapper(partial, context, options) {
	    if (options.hash) {
	      context = Utils.extend({}, context, options.hash);
	      if (options.ids) {
	        options.ids[0] = true;
	      }
	    }

	    partial = env.VM.resolvePartial.call(this, partial, context, options);
	    var result = env.VM.invokePartial.call(this, partial, context, options);

	    if (result == null && env.compile) {
	      options.partials[options.name] = env.compile(partial, templateSpec.compilerOptions, env);
	      result = options.partials[options.name](context, options);
	    }
	    if (result != null) {
	      if (options.indent) {
	        var lines = result.split('\n');
	        for (var i = 0, l = lines.length; i < l; i++) {
	          if (!lines[i] && i + 1 === l) {
	            break;
	          }

	          lines[i] = options.indent + lines[i];
	        }
	        result = lines.join('\n');
	      }
	      return result;
	    } else {
	      throw new _exception2['default']('The partial ' + options.name + ' could not be compiled when running in runtime-only mode');
	    }
	  }

	  // Just add water
	  var container = {
	    strict: function strict(obj, name) {
	      if (!(name in obj)) {
	        throw new _exception2['default']('"' + name + '" not defined in ' + obj);
	      }
	      return obj[name];
	    },
	    lookup: function lookup(depths, name) {
	      var len = depths.length;
	      for (var i = 0; i < len; i++) {
	        if (depths[i] && depths[i][name] != null) {
	          return depths[i][name];
	        }
	      }
	    },
	    lambda: function lambda(current, context) {
	      return typeof current === 'function' ? current.call(context) : current;
	    },

	    escapeExpression: Utils.escapeExpression,
	    invokePartial: invokePartialWrapper,

	    fn: function fn(i) {
	      var ret = templateSpec[i];
	      ret.decorator = templateSpec[i + '_d'];
	      return ret;
	    },

	    programs: [],
	    program: function program(i, data, declaredBlockParams, blockParams, depths) {
	      var programWrapper = this.programs[i],
	          fn = this.fn(i);
	      if (data || depths || blockParams || declaredBlockParams) {
	        programWrapper = wrapProgram(this, i, fn, data, declaredBlockParams, blockParams, depths);
	      } else if (!programWrapper) {
	        programWrapper = this.programs[i] = wrapProgram(this, i, fn);
	      }
	      return programWrapper;
	    },

	    data: function data(value, depth) {
	      while (value && depth--) {
	        value = value._parent;
	      }
	      return value;
	    },
	    merge: function merge(param, common) {
	      var obj = param || common;

	      if (param && common && param !== common) {
	        obj = Utils.extend({}, common, param);
	      }

	      return obj;
	    },
	    // An empty object to use as replacement for null-contexts
	    nullContext: _Object$seal({}),

	    noop: env.VM.noop,
	    compilerInfo: templateSpec.compiler
	  };

	  function ret(context) {
	    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	    var data = options.data;

	    ret._setup(options);
	    if (!options.partial && templateSpec.useData) {
	      data = initData(context, data);
	    }
	    var depths = undefined,
	        blockParams = templateSpec.useBlockParams ? [] : undefined;
	    if (templateSpec.useDepths) {
	      if (options.depths) {
	        depths = context != options.depths[0] ? [context].concat(options.depths) : options.depths;
	      } else {
	        depths = [context];
	      }
	    }

	    function main(context /*, options*/) {
	      return '' + templateSpec.main(container, context, container.helpers, container.partials, data, blockParams, depths);
	    }
	    main = executeDecorators(templateSpec.main, main, container, options.depths || [], data, blockParams);
	    return main(context);
	  }
	  ret.isTop = true;

	  ret._setup = function (options) {
	    if (!options.partial) {
	      container.helpers = container.merge(options.helpers, env.helpers);

	      if (templateSpec.usePartial) {
	        container.partials = container.merge(options.partials, env.partials);
	      }
	      if (templateSpec.usePartial || templateSpec.useDecorators) {
	        container.decorators = container.merge(options.decorators, env.decorators);
	      }
	    } else {
	      container.helpers = options.helpers;
	      container.partials = options.partials;
	      container.decorators = options.decorators;
	    }
	  };

	  ret._child = function (i, data, blockParams, depths) {
	    if (templateSpec.useBlockParams && !blockParams) {
	      throw new _exception2['default']('must pass block params');
	    }
	    if (templateSpec.useDepths && !depths) {
	      throw new _exception2['default']('must pass parent depths');
	    }

	    return wrapProgram(container, i, templateSpec[i], data, 0, blockParams, depths);
	  };
	  return ret;
	}

	function wrapProgram(container, i, fn, data, declaredBlockParams, blockParams, depths) {
	  function prog(context) {
	    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	    var currentDepths = depths;
	    if (depths && context != depths[0] && !(context === container.nullContext && depths[0] === null)) {
	      currentDepths = [context].concat(depths);
	    }

	    return fn(container, context, container.helpers, container.partials, options.data || data, blockParams && [options.blockParams].concat(blockParams), currentDepths);
	  }

	  prog = executeDecorators(fn, prog, container, depths, data, blockParams);

	  prog.program = i;
	  prog.depth = depths ? depths.length : 0;
	  prog.blockParams = declaredBlockParams || 0;
	  return prog;
	}

	function resolvePartial(partial, context, options) {
	  if (!partial) {
	    if (options.name === '@partial-block') {
	      partial = options.data['partial-block'];
	    } else {
	      partial = options.partials[options.name];
	    }
	  } else if (!partial.call && !options.name) {
	    // This is a dynamic partial that returned a string
	    options.name = partial;
	    partial = options.partials[partial];
	  }
	  return partial;
	}

	function invokePartial(partial, context, options) {
	  // Use the current closure context to save the partial-block if this partial
	  var currentPartialBlock = options.data && options.data['partial-block'];
	  options.partial = true;
	  if (options.ids) {
	    options.data.contextPath = options.ids[0] || options.data.contextPath;
	  }

	  var partialBlock = undefined;
	  if (options.fn && options.fn !== noop) {
	    (function () {
	      options.data = _base.createFrame(options.data);
	      // Wrapper function to get access to currentPartialBlock from the closure
	      var fn = options.fn;
	      partialBlock = options.data['partial-block'] = function partialBlockWrapper(context) {
	        var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	        // Restore the partial-block from the closure for the execution of the block
	        // i.e. the part inside the block of the partial call.
	        options.data = _base.createFrame(options.data);
	        options.data['partial-block'] = currentPartialBlock;
	        return fn(context, options);
	      };
	      if (fn.partials) {
	        options.partials = Utils.extend({}, options.partials, fn.partials);
	      }
	    })();
	  }

	  if (partial === undefined && partialBlock) {
	    partial = partialBlock;
	  }

	  if (partial === undefined) {
	    throw new _exception2['default']('The partial ' + options.name + ' could not be found');
	  } else if (partial instanceof Function) {
	    return partial(context, options);
	  }
	}

	function noop() {
	  return '';
	}

	function initData(context, data) {
	  if (!data || !('root' in data)) {
	    data = data ? _base.createFrame(data) : {};
	    data.root = context;
	  }
	  return data;
	}

	function executeDecorators(fn, prog, container, depths, data, blockParams) {
	  if (fn.decorator) {
	    var props = {};
	    prog = fn.decorator(prog, props, container, depths && depths[0], data, blockParams, depths);
	    Utils.extend(prog, props);
	  }
	  return prog;
	}

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(24), __esModule: true };

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(25);
	module.exports = __webpack_require__(30).Object.seal;

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.17 Object.seal(O)
	var isObject = __webpack_require__(26);

	__webpack_require__(27)('seal', function($seal){
	  return function seal(it){
	    return $seal && isObject(it) ? $seal(it) : it;
	  };
	});

/***/ }),
/* 26 */
/***/ (function(module, exports) {

	module.exports = function(it){
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

	// most Object methods by ES6 should accept primitives
	var $export = __webpack_require__(28)
	  , core    = __webpack_require__(30)
	  , fails   = __webpack_require__(33);
	module.exports = function(KEY, exec){
	  var fn  = (core.Object || {})[KEY] || Object[KEY]
	    , exp = {};
	  exp[KEY] = exec(fn);
	  $export($export.S + $export.F * fails(function(){ fn(1); }), 'Object', exp);
	};

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

	var global    = __webpack_require__(29)
	  , core      = __webpack_require__(30)
	  , ctx       = __webpack_require__(31)
	  , PROTOTYPE = 'prototype';

	var $export = function(type, name, source){
	  var IS_FORCED = type & $export.F
	    , IS_GLOBAL = type & $export.G
	    , IS_STATIC = type & $export.S
	    , IS_PROTO  = type & $export.P
	    , IS_BIND   = type & $export.B
	    , IS_WRAP   = type & $export.W
	    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
	    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE]
	    , key, own, out;
	  if(IS_GLOBAL)source = name;
	  for(key in source){
	    // contains in native
	    own = !IS_FORCED && target && key in target;
	    if(own && key in exports)continue;
	    // export native or passed
	    out = own ? target[key] : source[key];
	    // prevent global pollution for namespaces
	    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
	    // bind timers to global for call from export context
	    : IS_BIND && own ? ctx(out, global)
	    // wrap global constructors for prevent change them in library
	    : IS_WRAP && target[key] == out ? (function(C){
	      var F = function(param){
	        return this instanceof C ? new C(param) : C(param);
	      };
	      F[PROTOTYPE] = C[PROTOTYPE];
	      return F;
	    // make static versions for prototype methods
	    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
	    if(IS_PROTO)(exports[PROTOTYPE] || (exports[PROTOTYPE] = {}))[key] = out;
	  }
	};
	// type bitmap
	$export.F = 1;  // forced
	$export.G = 2;  // global
	$export.S = 4;  // static
	$export.P = 8;  // proto
	$export.B = 16; // bind
	$export.W = 32; // wrap
	module.exports = $export;

/***/ }),
/* 29 */
/***/ (function(module, exports) {

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global = module.exports = typeof window != 'undefined' && window.Math == Math
	  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
	if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef

/***/ }),
/* 30 */
/***/ (function(module, exports) {

	var core = module.exports = {version: '1.2.6'};
	if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

	// optional / simple context binding
	var aFunction = __webpack_require__(32);
	module.exports = function(fn, that, length){
	  aFunction(fn);
	  if(that === undefined)return fn;
	  switch(length){
	    case 1: return function(a){
	      return fn.call(that, a);
	    };
	    case 2: return function(a, b){
	      return fn.call(that, a, b);
	    };
	    case 3: return function(a, b, c){
	      return fn.call(that, a, b, c);
	    };
	  }
	  return function(/* ...args */){
	    return fn.apply(that, arguments);
	  };
	};

/***/ }),
/* 32 */
/***/ (function(module, exports) {

	module.exports = function(it){
	  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
	  return it;
	};

/***/ }),
/* 33 */
/***/ (function(module, exports) {

	module.exports = function(exec){
	  try {
	    return !!exec();
	  } catch(e){
	    return true;
	  }
	};

/***/ }),
/* 34 */
/***/ (function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {/* global window */
	'use strict';

	exports.__esModule = true;

	exports['default'] = function (Handlebars) {
	  /* istanbul ignore next */
	  var root = typeof global !== 'undefined' ? global : window,
	      $Handlebars = root.Handlebars;
	  /* istanbul ignore next */
	  Handlebars.noConflict = function () {
	    if (root.Handlebars === Handlebars) {
	      root.Handlebars = $Handlebars;
	    }
	    return Handlebars;
	  };
	};

	module.exports = exports['default'];
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ }),
/* 35 */
/***/ (function(module, exports) {

	'use strict';

	exports.__esModule = true;
	var AST = {
	  // Public API used to evaluate derived attributes regarding AST nodes
	  helpers: {
	    // a mustache is definitely a helper if:
	    // * it is an eligible helper, and
	    // * it has at least one parameter or hash segment
	    helperExpression: function helperExpression(node) {
	      return node.type === 'SubExpression' || (node.type === 'MustacheStatement' || node.type === 'BlockStatement') && !!(node.params && node.params.length || node.hash);
	    },

	    scopedId: function scopedId(path) {
	      return (/^\.|this\b/.test(path.original)
	      );
	    },

	    // an ID is simple if it only has one part, and that part is not
	    // `..` or `this`.
	    simpleId: function simpleId(path) {
	      return path.parts.length === 1 && !AST.helpers.scopedId(path) && !path.depth;
	    }
	  }
	};

	// Must be exported as an object rather than the root of the module as the jison lexer
	// must modify the object to operate properly.
	exports['default'] = AST;
	module.exports = exports['default'];

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _interopRequireDefault = __webpack_require__(1)['default'];

	var _interopRequireWildcard = __webpack_require__(3)['default'];

	exports.__esModule = true;
	exports.parse = parse;

	var _parser = __webpack_require__(37);

	var _parser2 = _interopRequireDefault(_parser);

	var _whitespaceControl = __webpack_require__(38);

	var _whitespaceControl2 = _interopRequireDefault(_whitespaceControl);

	var _helpers = __webpack_require__(40);

	var Helpers = _interopRequireWildcard(_helpers);

	var _utils = __webpack_require__(5);

	exports.parser = _parser2['default'];

	var yy = {};
	_utils.extend(yy, Helpers);

	function parse(input, options) {
	  // Just return if an already-compiled AST was passed in.
	  if (input.type === 'Program') {
	    return input;
	  }

	  _parser2['default'].yy = yy;

	  // Altering the shared object here, but this is ok as parser is a sync operation
	  yy.locInfo = function (locInfo) {
	    return new yy.SourceLocation(options && options.srcName, locInfo);
	  };

	  var strip = new _whitespaceControl2['default'](options);
	  return strip.accept(_parser2['default'].parse(input));
	}

/***/ }),
/* 37 */
/***/ (function(module, exports) {

	// File ignored in coverage tests via setting in .istanbul.yml
	/* Jison generated parser */
	"use strict";

	exports.__esModule = true;
	var handlebars = (function () {
	    var parser = { trace: function trace() {},
	        yy: {},
	        symbols_: { "error": 2, "root": 3, "program": 4, "EOF": 5, "program_repetition0": 6, "statement": 7, "mustache": 8, "block": 9, "rawBlock": 10, "partial": 11, "partialBlock": 12, "content": 13, "COMMENT": 14, "CONTENT": 15, "openRawBlock": 16, "rawBlock_repetition_plus0": 17, "END_RAW_BLOCK": 18, "OPEN_RAW_BLOCK": 19, "helperName": 20, "openRawBlock_repetition0": 21, "openRawBlock_option0": 22, "CLOSE_RAW_BLOCK": 23, "openBlock": 24, "block_option0": 25, "closeBlock": 26, "openInverse": 27, "block_option1": 28, "OPEN_BLOCK": 29, "openBlock_repetition0": 30, "openBlock_option0": 31, "openBlock_option1": 32, "CLOSE": 33, "OPEN_INVERSE": 34, "openInverse_repetition0": 35, "openInverse_option0": 36, "openInverse_option1": 37, "openInverseChain": 38, "OPEN_INVERSE_CHAIN": 39, "openInverseChain_repetition0": 40, "openInverseChain_option0": 41, "openInverseChain_option1": 42, "inverseAndProgram": 43, "INVERSE": 44, "inverseChain": 45, "inverseChain_option0": 46, "OPEN_ENDBLOCK": 47, "OPEN": 48, "mustache_repetition0": 49, "mustache_option0": 50, "OPEN_UNESCAPED": 51, "mustache_repetition1": 52, "mustache_option1": 53, "CLOSE_UNESCAPED": 54, "OPEN_PARTIAL": 55, "partialName": 56, "partial_repetition0": 57, "partial_option0": 58, "openPartialBlock": 59, "OPEN_PARTIAL_BLOCK": 60, "openPartialBlock_repetition0": 61, "openPartialBlock_option0": 62, "param": 63, "sexpr": 64, "OPEN_SEXPR": 65, "sexpr_repetition0": 66, "sexpr_option0": 67, "CLOSE_SEXPR": 68, "hash": 69, "hash_repetition_plus0": 70, "hashSegment": 71, "ID": 72, "EQUALS": 73, "blockParams": 74, "OPEN_BLOCK_PARAMS": 75, "blockParams_repetition_plus0": 76, "CLOSE_BLOCK_PARAMS": 77, "path": 78, "dataName": 79, "STRING": 80, "NUMBER": 81, "BOOLEAN": 82, "UNDEFINED": 83, "NULL": 84, "DATA": 85, "pathSegments": 86, "SEP": 87, "$accept": 0, "$end": 1 },
	        terminals_: { 2: "error", 5: "EOF", 14: "COMMENT", 15: "CONTENT", 18: "END_RAW_BLOCK", 19: "OPEN_RAW_BLOCK", 23: "CLOSE_RAW_BLOCK", 29: "OPEN_BLOCK", 33: "CLOSE", 34: "OPEN_INVERSE", 39: "OPEN_INVERSE_CHAIN", 44: "INVERSE", 47: "OPEN_ENDBLOCK", 48: "OPEN", 51: "OPEN_UNESCAPED", 54: "CLOSE_UNESCAPED", 55: "OPEN_PARTIAL", 60: "OPEN_PARTIAL_BLOCK", 65: "OPEN_SEXPR", 68: "CLOSE_SEXPR", 72: "ID", 73: "EQUALS", 75: "OPEN_BLOCK_PARAMS", 77: "CLOSE_BLOCK_PARAMS", 80: "STRING", 81: "NUMBER", 82: "BOOLEAN", 83: "UNDEFINED", 84: "NULL", 85: "DATA", 87: "SEP" },
	        productions_: [0, [3, 2], [4, 1], [7, 1], [7, 1], [7, 1], [7, 1], [7, 1], [7, 1], [7, 1], [13, 1], [10, 3], [16, 5], [9, 4], [9, 4], [24, 6], [27, 6], [38, 6], [43, 2], [45, 3], [45, 1], [26, 3], [8, 5], [8, 5], [11, 5], [12, 3], [59, 5], [63, 1], [63, 1], [64, 5], [69, 1], [71, 3], [74, 3], [20, 1], [20, 1], [20, 1], [20, 1], [20, 1], [20, 1], [20, 1], [56, 1], [56, 1], [79, 2], [78, 1], [86, 3], [86, 1], [6, 0], [6, 2], [17, 1], [17, 2], [21, 0], [21, 2], [22, 0], [22, 1], [25, 0], [25, 1], [28, 0], [28, 1], [30, 0], [30, 2], [31, 0], [31, 1], [32, 0], [32, 1], [35, 0], [35, 2], [36, 0], [36, 1], [37, 0], [37, 1], [40, 0], [40, 2], [41, 0], [41, 1], [42, 0], [42, 1], [46, 0], [46, 1], [49, 0], [49, 2], [50, 0], [50, 1], [52, 0], [52, 2], [53, 0], [53, 1], [57, 0], [57, 2], [58, 0], [58, 1], [61, 0], [61, 2], [62, 0], [62, 1], [66, 0], [66, 2], [67, 0], [67, 1], [70, 1], [70, 2], [76, 1], [76, 2]],
	        performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$) {

	            var $0 = $$.length - 1;
	            switch (yystate) {
	                case 1:
	                    return $$[$0 - 1];
	                    break;
	                case 2:
	                    this.$ = yy.prepareProgram($$[$0]);
	                    break;
	                case 3:
	                    this.$ = $$[$0];
	                    break;
	                case 4:
	                    this.$ = $$[$0];
	                    break;
	                case 5:
	                    this.$ = $$[$0];
	                    break;
	                case 6:
	                    this.$ = $$[$0];
	                    break;
	                case 7:
	                    this.$ = $$[$0];
	                    break;
	                case 8:
	                    this.$ = $$[$0];
	                    break;
	                case 9:
	                    this.$ = {
	                        type: 'CommentStatement',
	                        value: yy.stripComment($$[$0]),
	                        strip: yy.stripFlags($$[$0], $$[$0]),
	                        loc: yy.locInfo(this._$)
	                    };

	                    break;
	                case 10:
	                    this.$ = {
	                        type: 'ContentStatement',
	                        original: $$[$0],
	                        value: $$[$0],
	                        loc: yy.locInfo(this._$)
	                    };

	                    break;
	                case 11:
	                    this.$ = yy.prepareRawBlock($$[$0 - 2], $$[$0 - 1], $$[$0], this._$);
	                    break;
	                case 12:
	                    this.$ = { path: $$[$0 - 3], params: $$[$0 - 2], hash: $$[$0 - 1] };
	                    break;
	                case 13:
	                    this.$ = yy.prepareBlock($$[$0 - 3], $$[$0 - 2], $$[$0 - 1], $$[$0], false, this._$);
	                    break;
	                case 14:
	                    this.$ = yy.prepareBlock($$[$0 - 3], $$[$0 - 2], $$[$0 - 1], $$[$0], true, this._$);
	                    break;
	                case 15:
	                    this.$ = { open: $$[$0 - 5], path: $$[$0 - 4], params: $$[$0 - 3], hash: $$[$0 - 2], blockParams: $$[$0 - 1], strip: yy.stripFlags($$[$0 - 5], $$[$0]) };
	                    break;
	                case 16:
	                    this.$ = { path: $$[$0 - 4], params: $$[$0 - 3], hash: $$[$0 - 2], blockParams: $$[$0 - 1], strip: yy.stripFlags($$[$0 - 5], $$[$0]) };
	                    break;
	                case 17:
	                    this.$ = { path: $$[$0 - 4], params: $$[$0 - 3], hash: $$[$0 - 2], blockParams: $$[$0 - 1], strip: yy.stripFlags($$[$0 - 5], $$[$0]) };
	                    break;
	                case 18:
	                    this.$ = { strip: yy.stripFlags($$[$0 - 1], $$[$0 - 1]), program: $$[$0] };
	                    break;
	                case 19:
	                    var inverse = yy.prepareBlock($$[$0 - 2], $$[$0 - 1], $$[$0], $$[$0], false, this._$),
	                        program = yy.prepareProgram([inverse], $$[$0 - 1].loc);
	                    program.chained = true;

	                    this.$ = { strip: $$[$0 - 2].strip, program: program, chain: true };

	                    break;
	                case 20:
	                    this.$ = $$[$0];
	                    break;
	                case 21:
	                    this.$ = { path: $$[$0 - 1], strip: yy.stripFlags($$[$0 - 2], $$[$0]) };
	                    break;
	                case 22:
	                    this.$ = yy.prepareMustache($$[$0 - 3], $$[$0 - 2], $$[$0 - 1], $$[$0 - 4], yy.stripFlags($$[$0 - 4], $$[$0]), this._$);
	                    break;
	                case 23:
	                    this.$ = yy.prepareMustache($$[$0 - 3], $$[$0 - 2], $$[$0 - 1], $$[$0 - 4], yy.stripFlags($$[$0 - 4], $$[$0]), this._$);
	                    break;
	                case 24:
	                    this.$ = {
	                        type: 'PartialStatement',
	                        name: $$[$0 - 3],
	                        params: $$[$0 - 2],
	                        hash: $$[$0 - 1],
	                        indent: '',
	                        strip: yy.stripFlags($$[$0 - 4], $$[$0]),
	                        loc: yy.locInfo(this._$)
	                    };

	                    break;
	                case 25:
	                    this.$ = yy.preparePartialBlock($$[$0 - 2], $$[$0 - 1], $$[$0], this._$);
	                    break;
	                case 26:
	                    this.$ = { path: $$[$0 - 3], params: $$[$0 - 2], hash: $$[$0 - 1], strip: yy.stripFlags($$[$0 - 4], $$[$0]) };
	                    break;
	                case 27:
	                    this.$ = $$[$0];
	                    break;
	                case 28:
	                    this.$ = $$[$0];
	                    break;
	                case 29:
	                    this.$ = {
	                        type: 'SubExpression',
	                        path: $$[$0 - 3],
	                        params: $$[$0 - 2],
	                        hash: $$[$0 - 1],
	                        loc: yy.locInfo(this._$)
	                    };

	                    break;
	                case 30:
	                    this.$ = { type: 'Hash', pairs: $$[$0], loc: yy.locInfo(this._$) };
	                    break;
	                case 31:
	                    this.$ = { type: 'HashPair', key: yy.id($$[$0 - 2]), value: $$[$0], loc: yy.locInfo(this._$) };
	                    break;
	                case 32:
	                    this.$ = yy.id($$[$0 - 1]);
	                    break;
	                case 33:
	                    this.$ = $$[$0];
	                    break;
	                case 34:
	                    this.$ = $$[$0];
	                    break;
	                case 35:
	                    this.$ = { type: 'StringLiteral', value: $$[$0], original: $$[$0], loc: yy.locInfo(this._$) };
	                    break;
	                case 36:
	                    this.$ = { type: 'NumberLiteral', value: Number($$[$0]), original: Number($$[$0]), loc: yy.locInfo(this._$) };
	                    break;
	                case 37:
	                    this.$ = { type: 'BooleanLiteral', value: $$[$0] === 'true', original: $$[$0] === 'true', loc: yy.locInfo(this._$) };
	                    break;
	                case 38:
	                    this.$ = { type: 'UndefinedLiteral', original: undefined, value: undefined, loc: yy.locInfo(this._$) };
	                    break;
	                case 39:
	                    this.$ = { type: 'NullLiteral', original: null, value: null, loc: yy.locInfo(this._$) };
	                    break;
	                case 40:
	                    this.$ = $$[$0];
	                    break;
	                case 41:
	                    this.$ = $$[$0];
	                    break;
	                case 42:
	                    this.$ = yy.preparePath(true, $$[$0], this._$);
	                    break;
	                case 43:
	                    this.$ = yy.preparePath(false, $$[$0], this._$);
	                    break;
	                case 44:
	                    $$[$0 - 2].push({ part: yy.id($$[$0]), original: $$[$0], separator: $$[$0 - 1] });this.$ = $$[$0 - 2];
	                    break;
	                case 45:
	                    this.$ = [{ part: yy.id($$[$0]), original: $$[$0] }];
	                    break;
	                case 46:
	                    this.$ = [];
	                    break;
	                case 47:
	                    $$[$0 - 1].push($$[$0]);
	                    break;
	                case 48:
	                    this.$ = [$$[$0]];
	                    break;
	                case 49:
	                    $$[$0 - 1].push($$[$0]);
	                    break;
	                case 50:
	                    this.$ = [];
	                    break;
	                case 51:
	                    $$[$0 - 1].push($$[$0]);
	                    break;
	                case 58:
	                    this.$ = [];
	                    break;
	                case 59:
	                    $$[$0 - 1].push($$[$0]);
	                    break;
	                case 64:
	                    this.$ = [];
	                    break;
	                case 65:
	                    $$[$0 - 1].push($$[$0]);
	                    break;
	                case 70:
	                    this.$ = [];
	                    break;
	                case 71:
	                    $$[$0 - 1].push($$[$0]);
	                    break;
	                case 78:
	                    this.$ = [];
	                    break;
	                case 79:
	                    $$[$0 - 1].push($$[$0]);
	                    break;
	                case 82:
	                    this.$ = [];
	                    break;
	                case 83:
	                    $$[$0 - 1].push($$[$0]);
	                    break;
	                case 86:
	                    this.$ = [];
	                    break;
	                case 87:
	                    $$[$0 - 1].push($$[$0]);
	                    break;
	                case 90:
	                    this.$ = [];
	                    break;
	                case 91:
	                    $$[$0 - 1].push($$[$0]);
	                    break;
	                case 94:
	                    this.$ = [];
	                    break;
	                case 95:
	                    $$[$0 - 1].push($$[$0]);
	                    break;
	                case 98:
	                    this.$ = [$$[$0]];
	                    break;
	                case 99:
	                    $$[$0 - 1].push($$[$0]);
	                    break;
	                case 100:
	                    this.$ = [$$[$0]];
	                    break;
	                case 101:
	                    $$[$0 - 1].push($$[$0]);
	                    break;
	            }
	        },
	        table: [{ 3: 1, 4: 2, 5: [2, 46], 6: 3, 14: [2, 46], 15: [2, 46], 19: [2, 46], 29: [2, 46], 34: [2, 46], 48: [2, 46], 51: [2, 46], 55: [2, 46], 60: [2, 46] }, { 1: [3] }, { 5: [1, 4] }, { 5: [2, 2], 7: 5, 8: 6, 9: 7, 10: 8, 11: 9, 12: 10, 13: 11, 14: [1, 12], 15: [1, 20], 16: 17, 19: [1, 23], 24: 15, 27: 16, 29: [1, 21], 34: [1, 22], 39: [2, 2], 44: [2, 2], 47: [2, 2], 48: [1, 13], 51: [1, 14], 55: [1, 18], 59: 19, 60: [1, 24] }, { 1: [2, 1] }, { 5: [2, 47], 14: [2, 47], 15: [2, 47], 19: [2, 47], 29: [2, 47], 34: [2, 47], 39: [2, 47], 44: [2, 47], 47: [2, 47], 48: [2, 47], 51: [2, 47], 55: [2, 47], 60: [2, 47] }, { 5: [2, 3], 14: [2, 3], 15: [2, 3], 19: [2, 3], 29: [2, 3], 34: [2, 3], 39: [2, 3], 44: [2, 3], 47: [2, 3], 48: [2, 3], 51: [2, 3], 55: [2, 3], 60: [2, 3] }, { 5: [2, 4], 14: [2, 4], 15: [2, 4], 19: [2, 4], 29: [2, 4], 34: [2, 4], 39: [2, 4], 44: [2, 4], 47: [2, 4], 48: [2, 4], 51: [2, 4], 55: [2, 4], 60: [2, 4] }, { 5: [2, 5], 14: [2, 5], 15: [2, 5], 19: [2, 5], 29: [2, 5], 34: [2, 5], 39: [2, 5], 44: [2, 5], 47: [2, 5], 48: [2, 5], 51: [2, 5], 55: [2, 5], 60: [2, 5] }, { 5: [2, 6], 14: [2, 6], 15: [2, 6], 19: [2, 6], 29: [2, 6], 34: [2, 6], 39: [2, 6], 44: [2, 6], 47: [2, 6], 48: [2, 6], 51: [2, 6], 55: [2, 6], 60: [2, 6] }, { 5: [2, 7], 14: [2, 7], 15: [2, 7], 19: [2, 7], 29: [2, 7], 34: [2, 7], 39: [2, 7], 44: [2, 7], 47: [2, 7], 48: [2, 7], 51: [2, 7], 55: [2, 7], 60: [2, 7] }, { 5: [2, 8], 14: [2, 8], 15: [2, 8], 19: [2, 8], 29: [2, 8], 34: [2, 8], 39: [2, 8], 44: [2, 8], 47: [2, 8], 48: [2, 8], 51: [2, 8], 55: [2, 8], 60: [2, 8] }, { 5: [2, 9], 14: [2, 9], 15: [2, 9], 19: [2, 9], 29: [2, 9], 34: [2, 9], 39: [2, 9], 44: [2, 9], 47: [2, 9], 48: [2, 9], 51: [2, 9], 55: [2, 9], 60: [2, 9] }, { 20: 25, 72: [1, 35], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 20: 36, 72: [1, 35], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 4: 37, 6: 3, 14: [2, 46], 15: [2, 46], 19: [2, 46], 29: [2, 46], 34: [2, 46], 39: [2, 46], 44: [2, 46], 47: [2, 46], 48: [2, 46], 51: [2, 46], 55: [2, 46], 60: [2, 46] }, { 4: 38, 6: 3, 14: [2, 46], 15: [2, 46], 19: [2, 46], 29: [2, 46], 34: [2, 46], 44: [2, 46], 47: [2, 46], 48: [2, 46], 51: [2, 46], 55: [2, 46], 60: [2, 46] }, { 13: 40, 15: [1, 20], 17: 39 }, { 20: 42, 56: 41, 64: 43, 65: [1, 44], 72: [1, 35], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 4: 45, 6: 3, 14: [2, 46], 15: [2, 46], 19: [2, 46], 29: [2, 46], 34: [2, 46], 47: [2, 46], 48: [2, 46], 51: [2, 46], 55: [2, 46], 60: [2, 46] }, { 5: [2, 10], 14: [2, 10], 15: [2, 10], 18: [2, 10], 19: [2, 10], 29: [2, 10], 34: [2, 10], 39: [2, 10], 44: [2, 10], 47: [2, 10], 48: [2, 10], 51: [2, 10], 55: [2, 10], 60: [2, 10] }, { 20: 46, 72: [1, 35], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 20: 47, 72: [1, 35], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 20: 48, 72: [1, 35], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 20: 42, 56: 49, 64: 43, 65: [1, 44], 72: [1, 35], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 33: [2, 78], 49: 50, 65: [2, 78], 72: [2, 78], 80: [2, 78], 81: [2, 78], 82: [2, 78], 83: [2, 78], 84: [2, 78], 85: [2, 78] }, { 23: [2, 33], 33: [2, 33], 54: [2, 33], 65: [2, 33], 68: [2, 33], 72: [2, 33], 75: [2, 33], 80: [2, 33], 81: [2, 33], 82: [2, 33], 83: [2, 33], 84: [2, 33], 85: [2, 33] }, { 23: [2, 34], 33: [2, 34], 54: [2, 34], 65: [2, 34], 68: [2, 34], 72: [2, 34], 75: [2, 34], 80: [2, 34], 81: [2, 34], 82: [2, 34], 83: [2, 34], 84: [2, 34], 85: [2, 34] }, { 23: [2, 35], 33: [2, 35], 54: [2, 35], 65: [2, 35], 68: [2, 35], 72: [2, 35], 75: [2, 35], 80: [2, 35], 81: [2, 35], 82: [2, 35], 83: [2, 35], 84: [2, 35], 85: [2, 35] }, { 23: [2, 36], 33: [2, 36], 54: [2, 36], 65: [2, 36], 68: [2, 36], 72: [2, 36], 75: [2, 36], 80: [2, 36], 81: [2, 36], 82: [2, 36], 83: [2, 36], 84: [2, 36], 85: [2, 36] }, { 23: [2, 37], 33: [2, 37], 54: [2, 37], 65: [2, 37], 68: [2, 37], 72: [2, 37], 75: [2, 37], 80: [2, 37], 81: [2, 37], 82: [2, 37], 83: [2, 37], 84: [2, 37], 85: [2, 37] }, { 23: [2, 38], 33: [2, 38], 54: [2, 38], 65: [2, 38], 68: [2, 38], 72: [2, 38], 75: [2, 38], 80: [2, 38], 81: [2, 38], 82: [2, 38], 83: [2, 38], 84: [2, 38], 85: [2, 38] }, { 23: [2, 39], 33: [2, 39], 54: [2, 39], 65: [2, 39], 68: [2, 39], 72: [2, 39], 75: [2, 39], 80: [2, 39], 81: [2, 39], 82: [2, 39], 83: [2, 39], 84: [2, 39], 85: [2, 39] }, { 23: [2, 43], 33: [2, 43], 54: [2, 43], 65: [2, 43], 68: [2, 43], 72: [2, 43], 75: [2, 43], 80: [2, 43], 81: [2, 43], 82: [2, 43], 83: [2, 43], 84: [2, 43], 85: [2, 43], 87: [1, 51] }, { 72: [1, 35], 86: 52 }, { 23: [2, 45], 33: [2, 45], 54: [2, 45], 65: [2, 45], 68: [2, 45], 72: [2, 45], 75: [2, 45], 80: [2, 45], 81: [2, 45], 82: [2, 45], 83: [2, 45], 84: [2, 45], 85: [2, 45], 87: [2, 45] }, { 52: 53, 54: [2, 82], 65: [2, 82], 72: [2, 82], 80: [2, 82], 81: [2, 82], 82: [2, 82], 83: [2, 82], 84: [2, 82], 85: [2, 82] }, { 25: 54, 38: 56, 39: [1, 58], 43: 57, 44: [1, 59], 45: 55, 47: [2, 54] }, { 28: 60, 43: 61, 44: [1, 59], 47: [2, 56] }, { 13: 63, 15: [1, 20], 18: [1, 62] }, { 15: [2, 48], 18: [2, 48] }, { 33: [2, 86], 57: 64, 65: [2, 86], 72: [2, 86], 80: [2, 86], 81: [2, 86], 82: [2, 86], 83: [2, 86], 84: [2, 86], 85: [2, 86] }, { 33: [2, 40], 65: [2, 40], 72: [2, 40], 80: [2, 40], 81: [2, 40], 82: [2, 40], 83: [2, 40], 84: [2, 40], 85: [2, 40] }, { 33: [2, 41], 65: [2, 41], 72: [2, 41], 80: [2, 41], 81: [2, 41], 82: [2, 41], 83: [2, 41], 84: [2, 41], 85: [2, 41] }, { 20: 65, 72: [1, 35], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 26: 66, 47: [1, 67] }, { 30: 68, 33: [2, 58], 65: [2, 58], 72: [2, 58], 75: [2, 58], 80: [2, 58], 81: [2, 58], 82: [2, 58], 83: [2, 58], 84: [2, 58], 85: [2, 58] }, { 33: [2, 64], 35: 69, 65: [2, 64], 72: [2, 64], 75: [2, 64], 80: [2, 64], 81: [2, 64], 82: [2, 64], 83: [2, 64], 84: [2, 64], 85: [2, 64] }, { 21: 70, 23: [2, 50], 65: [2, 50], 72: [2, 50], 80: [2, 50], 81: [2, 50], 82: [2, 50], 83: [2, 50], 84: [2, 50], 85: [2, 50] }, { 33: [2, 90], 61: 71, 65: [2, 90], 72: [2, 90], 80: [2, 90], 81: [2, 90], 82: [2, 90], 83: [2, 90], 84: [2, 90], 85: [2, 90] }, { 20: 75, 33: [2, 80], 50: 72, 63: 73, 64: 76, 65: [1, 44], 69: 74, 70: 77, 71: 78, 72: [1, 79], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 72: [1, 80] }, { 23: [2, 42], 33: [2, 42], 54: [2, 42], 65: [2, 42], 68: [2, 42], 72: [2, 42], 75: [2, 42], 80: [2, 42], 81: [2, 42], 82: [2, 42], 83: [2, 42], 84: [2, 42], 85: [2, 42], 87: [1, 51] }, { 20: 75, 53: 81, 54: [2, 84], 63: 82, 64: 76, 65: [1, 44], 69: 83, 70: 77, 71: 78, 72: [1, 79], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 26: 84, 47: [1, 67] }, { 47: [2, 55] }, { 4: 85, 6: 3, 14: [2, 46], 15: [2, 46], 19: [2, 46], 29: [2, 46], 34: [2, 46], 39: [2, 46], 44: [2, 46], 47: [2, 46], 48: [2, 46], 51: [2, 46], 55: [2, 46], 60: [2, 46] }, { 47: [2, 20] }, { 20: 86, 72: [1, 35], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 4: 87, 6: 3, 14: [2, 46], 15: [2, 46], 19: [2, 46], 29: [2, 46], 34: [2, 46], 47: [2, 46], 48: [2, 46], 51: [2, 46], 55: [2, 46], 60: [2, 46] }, { 26: 88, 47: [1, 67] }, { 47: [2, 57] }, { 5: [2, 11], 14: [2, 11], 15: [2, 11], 19: [2, 11], 29: [2, 11], 34: [2, 11], 39: [2, 11], 44: [2, 11], 47: [2, 11], 48: [2, 11], 51: [2, 11], 55: [2, 11], 60: [2, 11] }, { 15: [2, 49], 18: [2, 49] }, { 20: 75, 33: [2, 88], 58: 89, 63: 90, 64: 76, 65: [1, 44], 69: 91, 70: 77, 71: 78, 72: [1, 79], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 65: [2, 94], 66: 92, 68: [2, 94], 72: [2, 94], 80: [2, 94], 81: [2, 94], 82: [2, 94], 83: [2, 94], 84: [2, 94], 85: [2, 94] }, { 5: [2, 25], 14: [2, 25], 15: [2, 25], 19: [2, 25], 29: [2, 25], 34: [2, 25], 39: [2, 25], 44: [2, 25], 47: [2, 25], 48: [2, 25], 51: [2, 25], 55: [2, 25], 60: [2, 25] }, { 20: 93, 72: [1, 35], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 20: 75, 31: 94, 33: [2, 60], 63: 95, 64: 76, 65: [1, 44], 69: 96, 70: 77, 71: 78, 72: [1, 79], 75: [2, 60], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 20: 75, 33: [2, 66], 36: 97, 63: 98, 64: 76, 65: [1, 44], 69: 99, 70: 77, 71: 78, 72: [1, 79], 75: [2, 66], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 20: 75, 22: 100, 23: [2, 52], 63: 101, 64: 76, 65: [1, 44], 69: 102, 70: 77, 71: 78, 72: [1, 79], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 20: 75, 33: [2, 92], 62: 103, 63: 104, 64: 76, 65: [1, 44], 69: 105, 70: 77, 71: 78, 72: [1, 79], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 33: [1, 106] }, { 33: [2, 79], 65: [2, 79], 72: [2, 79], 80: [2, 79], 81: [2, 79], 82: [2, 79], 83: [2, 79], 84: [2, 79], 85: [2, 79] }, { 33: [2, 81] }, { 23: [2, 27], 33: [2, 27], 54: [2, 27], 65: [2, 27], 68: [2, 27], 72: [2, 27], 75: [2, 27], 80: [2, 27], 81: [2, 27], 82: [2, 27], 83: [2, 27], 84: [2, 27], 85: [2, 27] }, { 23: [2, 28], 33: [2, 28], 54: [2, 28], 65: [2, 28], 68: [2, 28], 72: [2, 28], 75: [2, 28], 80: [2, 28], 81: [2, 28], 82: [2, 28], 83: [2, 28], 84: [2, 28], 85: [2, 28] }, { 23: [2, 30], 33: [2, 30], 54: [2, 30], 68: [2, 30], 71: 107, 72: [1, 108], 75: [2, 30] }, { 23: [2, 98], 33: [2, 98], 54: [2, 98], 68: [2, 98], 72: [2, 98], 75: [2, 98] }, { 23: [2, 45], 33: [2, 45], 54: [2, 45], 65: [2, 45], 68: [2, 45], 72: [2, 45], 73: [1, 109], 75: [2, 45], 80: [2, 45], 81: [2, 45], 82: [2, 45], 83: [2, 45], 84: [2, 45], 85: [2, 45], 87: [2, 45] }, { 23: [2, 44], 33: [2, 44], 54: [2, 44], 65: [2, 44], 68: [2, 44], 72: [2, 44], 75: [2, 44], 80: [2, 44], 81: [2, 44], 82: [2, 44], 83: [2, 44], 84: [2, 44], 85: [2, 44], 87: [2, 44] }, { 54: [1, 110] }, { 54: [2, 83], 65: [2, 83], 72: [2, 83], 80: [2, 83], 81: [2, 83], 82: [2, 83], 83: [2, 83], 84: [2, 83], 85: [2, 83] }, { 54: [2, 85] }, { 5: [2, 13], 14: [2, 13], 15: [2, 13], 19: [2, 13], 29: [2, 13], 34: [2, 13], 39: [2, 13], 44: [2, 13], 47: [2, 13], 48: [2, 13], 51: [2, 13], 55: [2, 13], 60: [2, 13] }, { 38: 56, 39: [1, 58], 43: 57, 44: [1, 59], 45: 112, 46: 111, 47: [2, 76] }, { 33: [2, 70], 40: 113, 65: [2, 70], 72: [2, 70], 75: [2, 70], 80: [2, 70], 81: [2, 70], 82: [2, 70], 83: [2, 70], 84: [2, 70], 85: [2, 70] }, { 47: [2, 18] }, { 5: [2, 14], 14: [2, 14], 15: [2, 14], 19: [2, 14], 29: [2, 14], 34: [2, 14], 39: [2, 14], 44: [2, 14], 47: [2, 14], 48: [2, 14], 51: [2, 14], 55: [2, 14], 60: [2, 14] }, { 33: [1, 114] }, { 33: [2, 87], 65: [2, 87], 72: [2, 87], 80: [2, 87], 81: [2, 87], 82: [2, 87], 83: [2, 87], 84: [2, 87], 85: [2, 87] }, { 33: [2, 89] }, { 20: 75, 63: 116, 64: 76, 65: [1, 44], 67: 115, 68: [2, 96], 69: 117, 70: 77, 71: 78, 72: [1, 79], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 33: [1, 118] }, { 32: 119, 33: [2, 62], 74: 120, 75: [1, 121] }, { 33: [2, 59], 65: [2, 59], 72: [2, 59], 75: [2, 59], 80: [2, 59], 81: [2, 59], 82: [2, 59], 83: [2, 59], 84: [2, 59], 85: [2, 59] }, { 33: [2, 61], 75: [2, 61] }, { 33: [2, 68], 37: 122, 74: 123, 75: [1, 121] }, { 33: [2, 65], 65: [2, 65], 72: [2, 65], 75: [2, 65], 80: [2, 65], 81: [2, 65], 82: [2, 65], 83: [2, 65], 84: [2, 65], 85: [2, 65] }, { 33: [2, 67], 75: [2, 67] }, { 23: [1, 124] }, { 23: [2, 51], 65: [2, 51], 72: [2, 51], 80: [2, 51], 81: [2, 51], 82: [2, 51], 83: [2, 51], 84: [2, 51], 85: [2, 51] }, { 23: [2, 53] }, { 33: [1, 125] }, { 33: [2, 91], 65: [2, 91], 72: [2, 91], 80: [2, 91], 81: [2, 91], 82: [2, 91], 83: [2, 91], 84: [2, 91], 85: [2, 91] }, { 33: [2, 93] }, { 5: [2, 22], 14: [2, 22], 15: [2, 22], 19: [2, 22], 29: [2, 22], 34: [2, 22], 39: [2, 22], 44: [2, 22], 47: [2, 22], 48: [2, 22], 51: [2, 22], 55: [2, 22], 60: [2, 22] }, { 23: [2, 99], 33: [2, 99], 54: [2, 99], 68: [2, 99], 72: [2, 99], 75: [2, 99] }, { 73: [1, 109] }, { 20: 75, 63: 126, 64: 76, 65: [1, 44], 72: [1, 35], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 5: [2, 23], 14: [2, 23], 15: [2, 23], 19: [2, 23], 29: [2, 23], 34: [2, 23], 39: [2, 23], 44: [2, 23], 47: [2, 23], 48: [2, 23], 51: [2, 23], 55: [2, 23], 60: [2, 23] }, { 47: [2, 19] }, { 47: [2, 77] }, { 20: 75, 33: [2, 72], 41: 127, 63: 128, 64: 76, 65: [1, 44], 69: 129, 70: 77, 71: 78, 72: [1, 79], 75: [2, 72], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 5: [2, 24], 14: [2, 24], 15: [2, 24], 19: [2, 24], 29: [2, 24], 34: [2, 24], 39: [2, 24], 44: [2, 24], 47: [2, 24], 48: [2, 24], 51: [2, 24], 55: [2, 24], 60: [2, 24] }, { 68: [1, 130] }, { 65: [2, 95], 68: [2, 95], 72: [2, 95], 80: [2, 95], 81: [2, 95], 82: [2, 95], 83: [2, 95], 84: [2, 95], 85: [2, 95] }, { 68: [2, 97] }, { 5: [2, 21], 14: [2, 21], 15: [2, 21], 19: [2, 21], 29: [2, 21], 34: [2, 21], 39: [2, 21], 44: [2, 21], 47: [2, 21], 48: [2, 21], 51: [2, 21], 55: [2, 21], 60: [2, 21] }, { 33: [1, 131] }, { 33: [2, 63] }, { 72: [1, 133], 76: 132 }, { 33: [1, 134] }, { 33: [2, 69] }, { 15: [2, 12] }, { 14: [2, 26], 15: [2, 26], 19: [2, 26], 29: [2, 26], 34: [2, 26], 47: [2, 26], 48: [2, 26], 51: [2, 26], 55: [2, 26], 60: [2, 26] }, { 23: [2, 31], 33: [2, 31], 54: [2, 31], 68: [2, 31], 72: [2, 31], 75: [2, 31] }, { 33: [2, 74], 42: 135, 74: 136, 75: [1, 121] }, { 33: [2, 71], 65: [2, 71], 72: [2, 71], 75: [2, 71], 80: [2, 71], 81: [2, 71], 82: [2, 71], 83: [2, 71], 84: [2, 71], 85: [2, 71] }, { 33: [2, 73], 75: [2, 73] }, { 23: [2, 29], 33: [2, 29], 54: [2, 29], 65: [2, 29], 68: [2, 29], 72: [2, 29], 75: [2, 29], 80: [2, 29], 81: [2, 29], 82: [2, 29], 83: [2, 29], 84: [2, 29], 85: [2, 29] }, { 14: [2, 15], 15: [2, 15], 19: [2, 15], 29: [2, 15], 34: [2, 15], 39: [2, 15], 44: [2, 15], 47: [2, 15], 48: [2, 15], 51: [2, 15], 55: [2, 15], 60: [2, 15] }, { 72: [1, 138], 77: [1, 137] }, { 72: [2, 100], 77: [2, 100] }, { 14: [2, 16], 15: [2, 16], 19: [2, 16], 29: [2, 16], 34: [2, 16], 44: [2, 16], 47: [2, 16], 48: [2, 16], 51: [2, 16], 55: [2, 16], 60: [2, 16] }, { 33: [1, 139] }, { 33: [2, 75] }, { 33: [2, 32] }, { 72: [2, 101], 77: [2, 101] }, { 14: [2, 17], 15: [2, 17], 19: [2, 17], 29: [2, 17], 34: [2, 17], 39: [2, 17], 44: [2, 17], 47: [2, 17], 48: [2, 17], 51: [2, 17], 55: [2, 17], 60: [2, 17] }],
	        defaultActions: { 4: [2, 1], 55: [2, 55], 57: [2, 20], 61: [2, 57], 74: [2, 81], 83: [2, 85], 87: [2, 18], 91: [2, 89], 102: [2, 53], 105: [2, 93], 111: [2, 19], 112: [2, 77], 117: [2, 97], 120: [2, 63], 123: [2, 69], 124: [2, 12], 136: [2, 75], 137: [2, 32] },
	        parseError: function parseError(str, hash) {
	            throw new Error(str);
	        },
	        parse: function parse(input) {
	            var self = this,
	                stack = [0],
	                vstack = [null],
	                lstack = [],
	                table = this.table,
	                yytext = "",
	                yylineno = 0,
	                yyleng = 0,
	                recovering = 0,
	                TERROR = 2,
	                EOF = 1;
	            this.lexer.setInput(input);
	            this.lexer.yy = this.yy;
	            this.yy.lexer = this.lexer;
	            this.yy.parser = this;
	            if (typeof this.lexer.yylloc == "undefined") this.lexer.yylloc = {};
	            var yyloc = this.lexer.yylloc;
	            lstack.push(yyloc);
	            var ranges = this.lexer.options && this.lexer.options.ranges;
	            if (typeof this.yy.parseError === "function") this.parseError = this.yy.parseError;
	            function popStack(n) {
	                stack.length = stack.length - 2 * n;
	                vstack.length = vstack.length - n;
	                lstack.length = lstack.length - n;
	            }
	            function lex() {
	                var token;
	                token = self.lexer.lex() || 1;
	                if (typeof token !== "number") {
	                    token = self.symbols_[token] || token;
	                }
	                return token;
	            }
	            var symbol,
	                preErrorSymbol,
	                state,
	                action,
	                a,
	                r,
	                yyval = {},
	                p,
	                len,
	                newState,
	                expected;
	            while (true) {
	                state = stack[stack.length - 1];
	                if (this.defaultActions[state]) {
	                    action = this.defaultActions[state];
	                } else {
	                    if (symbol === null || typeof symbol == "undefined") {
	                        symbol = lex();
	                    }
	                    action = table[state] && table[state][symbol];
	                }
	                if (typeof action === "undefined" || !action.length || !action[0]) {
	                    var errStr = "";
	                    if (!recovering) {
	                        expected = [];
	                        for (p in table[state]) if (this.terminals_[p] && p > 2) {
	                            expected.push("'" + this.terminals_[p] + "'");
	                        }
	                        if (this.lexer.showPosition) {
	                            errStr = "Parse error on line " + (yylineno + 1) + ":\n" + this.lexer.showPosition() + "\nExpecting " + expected.join(", ") + ", got '" + (this.terminals_[symbol] || symbol) + "'";
	                        } else {
	                            errStr = "Parse error on line " + (yylineno + 1) + ": Unexpected " + (symbol == 1 ? "end of input" : "'" + (this.terminals_[symbol] || symbol) + "'");
	                        }
	                        this.parseError(errStr, { text: this.lexer.match, token: this.terminals_[symbol] || symbol, line: this.lexer.yylineno, loc: yyloc, expected: expected });
	                    }
	                }
	                if (action[0] instanceof Array && action.length > 1) {
	                    throw new Error("Parse Error: multiple actions possible at state: " + state + ", token: " + symbol);
	                }
	                switch (action[0]) {
	                    case 1:
	                        stack.push(symbol);
	                        vstack.push(this.lexer.yytext);
	                        lstack.push(this.lexer.yylloc);
	                        stack.push(action[1]);
	                        symbol = null;
	                        if (!preErrorSymbol) {
	                            yyleng = this.lexer.yyleng;
	                            yytext = this.lexer.yytext;
	                            yylineno = this.lexer.yylineno;
	                            yyloc = this.lexer.yylloc;
	                            if (recovering > 0) recovering--;
	                        } else {
	                            symbol = preErrorSymbol;
	                            preErrorSymbol = null;
	                        }
	                        break;
	                    case 2:
	                        len = this.productions_[action[1]][1];
	                        yyval.$ = vstack[vstack.length - len];
	                        yyval._$ = { first_line: lstack[lstack.length - (len || 1)].first_line, last_line: lstack[lstack.length - 1].last_line, first_column: lstack[lstack.length - (len || 1)].first_column, last_column: lstack[lstack.length - 1].last_column };
	                        if (ranges) {
	                            yyval._$.range = [lstack[lstack.length - (len || 1)].range[0], lstack[lstack.length - 1].range[1]];
	                        }
	                        r = this.performAction.call(yyval, yytext, yyleng, yylineno, this.yy, action[1], vstack, lstack);
	                        if (typeof r !== "undefined") {
	                            return r;
	                        }
	                        if (len) {
	                            stack = stack.slice(0, -1 * len * 2);
	                            vstack = vstack.slice(0, -1 * len);
	                            lstack = lstack.slice(0, -1 * len);
	                        }
	                        stack.push(this.productions_[action[1]][0]);
	                        vstack.push(yyval.$);
	                        lstack.push(yyval._$);
	                        newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
	                        stack.push(newState);
	                        break;
	                    case 3:
	                        return true;
	                }
	            }
	            return true;
	        }
	    };
	    /* Jison generated lexer */
	    var lexer = (function () {
	        var lexer = { EOF: 1,
	            parseError: function parseError(str, hash) {
	                if (this.yy.parser) {
	                    this.yy.parser.parseError(str, hash);
	                } else {
	                    throw new Error(str);
	                }
	            },
	            setInput: function setInput(input) {
	                this._input = input;
	                this._more = this._less = this.done = false;
	                this.yylineno = this.yyleng = 0;
	                this.yytext = this.matched = this.match = '';
	                this.conditionStack = ['INITIAL'];
	                this.yylloc = { first_line: 1, first_column: 0, last_line: 1, last_column: 0 };
	                if (this.options.ranges) this.yylloc.range = [0, 0];
	                this.offset = 0;
	                return this;
	            },
	            input: function input() {
	                var ch = this._input[0];
	                this.yytext += ch;
	                this.yyleng++;
	                this.offset++;
	                this.match += ch;
	                this.matched += ch;
	                var lines = ch.match(/(?:\r\n?|\n).*/g);
	                if (lines) {
	                    this.yylineno++;
	                    this.yylloc.last_line++;
	                } else {
	                    this.yylloc.last_column++;
	                }
	                if (this.options.ranges) this.yylloc.range[1]++;

	                this._input = this._input.slice(1);
	                return ch;
	            },
	            unput: function unput(ch) {
	                var len = ch.length;
	                var lines = ch.split(/(?:\r\n?|\n)/g);

	                this._input = ch + this._input;
	                this.yytext = this.yytext.substr(0, this.yytext.length - len - 1);
	                //this.yyleng -= len;
	                this.offset -= len;
	                var oldLines = this.match.split(/(?:\r\n?|\n)/g);
	                this.match = this.match.substr(0, this.match.length - 1);
	                this.matched = this.matched.substr(0, this.matched.length - 1);

	                if (lines.length - 1) this.yylineno -= lines.length - 1;
	                var r = this.yylloc.range;

	                this.yylloc = { first_line: this.yylloc.first_line,
	                    last_line: this.yylineno + 1,
	                    first_column: this.yylloc.first_column,
	                    last_column: lines ? (lines.length === oldLines.length ? this.yylloc.first_column : 0) + oldLines[oldLines.length - lines.length].length - lines[0].length : this.yylloc.first_column - len
	                };

	                if (this.options.ranges) {
	                    this.yylloc.range = [r[0], r[0] + this.yyleng - len];
	                }
	                return this;
	            },
	            more: function more() {
	                this._more = true;
	                return this;
	            },
	            less: function less(n) {
	                this.unput(this.match.slice(n));
	            },
	            pastInput: function pastInput() {
	                var past = this.matched.substr(0, this.matched.length - this.match.length);
	                return (past.length > 20 ? '...' : '') + past.substr(-20).replace(/\n/g, "");
	            },
	            upcomingInput: function upcomingInput() {
	                var next = this.match;
	                if (next.length < 20) {
	                    next += this._input.substr(0, 20 - next.length);
	                }
	                return (next.substr(0, 20) + (next.length > 20 ? '...' : '')).replace(/\n/g, "");
	            },
	            showPosition: function showPosition() {
	                var pre = this.pastInput();
	                var c = new Array(pre.length + 1).join("-");
	                return pre + this.upcomingInput() + "\n" + c + "^";
	            },
	            next: function next() {
	                if (this.done) {
	                    return this.EOF;
	                }
	                if (!this._input) this.done = true;

	                var token, match, tempMatch, index, col, lines;
	                if (!this._more) {
	                    this.yytext = '';
	                    this.match = '';
	                }
	                var rules = this._currentRules();
	                for (var i = 0; i < rules.length; i++) {
	                    tempMatch = this._input.match(this.rules[rules[i]]);
	                    if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
	                        match = tempMatch;
	                        index = i;
	                        if (!this.options.flex) break;
	                    }
	                }
	                if (match) {
	                    lines = match[0].match(/(?:\r\n?|\n).*/g);
	                    if (lines) this.yylineno += lines.length;
	                    this.yylloc = { first_line: this.yylloc.last_line,
	                        last_line: this.yylineno + 1,
	                        first_column: this.yylloc.last_column,
	                        last_column: lines ? lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length : this.yylloc.last_column + match[0].length };
	                    this.yytext += match[0];
	                    this.match += match[0];
	                    this.matches = match;
	                    this.yyleng = this.yytext.length;
	                    if (this.options.ranges) {
	                        this.yylloc.range = [this.offset, this.offset += this.yyleng];
	                    }
	                    this._more = false;
	                    this._input = this._input.slice(match[0].length);
	                    this.matched += match[0];
	                    token = this.performAction.call(this, this.yy, this, rules[index], this.conditionStack[this.conditionStack.length - 1]);
	                    if (this.done && this._input) this.done = false;
	                    if (token) return token;else return;
	                }
	                if (this._input === "") {
	                    return this.EOF;
	                } else {
	                    return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. Unrecognized text.\n' + this.showPosition(), { text: "", token: null, line: this.yylineno });
	                }
	            },
	            lex: function lex() {
	                var r = this.next();
	                if (typeof r !== 'undefined') {
	                    return r;
	                } else {
	                    return this.lex();
	                }
	            },
	            begin: function begin(condition) {
	                this.conditionStack.push(condition);
	            },
	            popState: function popState() {
	                return this.conditionStack.pop();
	            },
	            _currentRules: function _currentRules() {
	                return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
	            },
	            topState: function topState() {
	                return this.conditionStack[this.conditionStack.length - 2];
	            },
	            pushState: function begin(condition) {
	                this.begin(condition);
	            } };
	        lexer.options = {};
	        lexer.performAction = function anonymous(yy, yy_, $avoiding_name_collisions, YY_START) {

	            function strip(start, end) {
	                return yy_.yytext = yy_.yytext.substring(start, yy_.yyleng - end + start);
	            }

	            var YYSTATE = YY_START;
	            switch ($avoiding_name_collisions) {
	                case 0:
	                    if (yy_.yytext.slice(-2) === "\\\\") {
	                        strip(0, 1);
	                        this.begin("mu");
	                    } else if (yy_.yytext.slice(-1) === "\\") {
	                        strip(0, 1);
	                        this.begin("emu");
	                    } else {
	                        this.begin("mu");
	                    }
	                    if (yy_.yytext) return 15;

	                    break;
	                case 1:
	                    return 15;
	                    break;
	                case 2:
	                    this.popState();
	                    return 15;

	                    break;
	                case 3:
	                    this.begin('raw');return 15;
	                    break;
	                case 4:
	                    this.popState();
	                    // Should be using `this.topState()` below, but it currently
	                    // returns the second top instead of the first top. Opened an
	                    // issue about it at https://github.com/zaach/jison/issues/291
	                    if (this.conditionStack[this.conditionStack.length - 1] === 'raw') {
	                        return 15;
	                    } else {
	                        strip(5, 9);
	                        return 'END_RAW_BLOCK';
	                    }

	                    break;
	                case 5:
	                    return 15;
	                    break;
	                case 6:
	                    this.popState();
	                    return 14;

	                    break;
	                case 7:
	                    return 65;
	                    break;
	                case 8:
	                    return 68;
	                    break;
	                case 9:
	                    return 19;
	                    break;
	                case 10:
	                    this.popState();
	                    this.begin('raw');
	                    return 23;

	                    break;
	                case 11:
	                    return 55;
	                    break;
	                case 12:
	                    return 60;
	                    break;
	                case 13:
	                    return 29;
	                    break;
	                case 14:
	                    return 47;
	                    break;
	                case 15:
	                    this.popState();return 44;
	                    break;
	                case 16:
	                    this.popState();return 44;
	                    break;
	                case 17:
	                    return 34;
	                    break;
	                case 18:
	                    return 39;
	                    break;
	                case 19:
	                    return 51;
	                    break;
	                case 20:
	                    return 48;
	                    break;
	                case 21:
	                    this.unput(yy_.yytext);
	                    this.popState();
	                    this.begin('com');

	                    break;
	                case 22:
	                    this.popState();
	                    return 14;

	                    break;
	                case 23:
	                    return 48;
	                    break;
	                case 24:
	                    return 73;
	                    break;
	                case 25:
	                    return 72;
	                    break;
	                case 26:
	                    return 72;
	                    break;
	                case 27:
	                    return 87;
	                    break;
	                case 28:
	                    // ignore whitespace
	                    break;
	                case 29:
	                    this.popState();return 54;
	                    break;
	                case 30:
	                    this.popState();return 33;
	                    break;
	                case 31:
	                    yy_.yytext = strip(1, 2).replace(/\\"/g, '"');return 80;
	                    break;
	                case 32:
	                    yy_.yytext = strip(1, 2).replace(/\\'/g, "'");return 80;
	                    break;
	                case 33:
	                    return 85;
	                    break;
	                case 34:
	                    return 82;
	                    break;
	                case 35:
	                    return 82;
	                    break;
	                case 36:
	                    return 83;
	                    break;
	                case 37:
	                    return 84;
	                    break;
	                case 38:
	                    return 81;
	                    break;
	                case 39:
	                    return 75;
	                    break;
	                case 40:
	                    return 77;
	                    break;
	                case 41:
	                    return 72;
	                    break;
	                case 42:
	                    yy_.yytext = yy_.yytext.replace(/\\([\\\]])/g, '$1');return 72;
	                    break;
	                case 43:
	                    return 'INVALID';
	                    break;
	                case 44:
	                    return 5;
	                    break;
	            }
	        };
	        lexer.rules = [/^(?:[^\x00]*?(?=(\{\{)))/, /^(?:[^\x00]+)/, /^(?:[^\x00]{2,}?(?=(\{\{|\\\{\{|\\\\\{\{|$)))/, /^(?:\{\{\{\{(?=[^\/]))/, /^(?:\{\{\{\{\/[^\s!"#%-,\.\/;->@\[-\^`\{-~]+(?=[=}\s\/.])\}\}\}\})/, /^(?:[^\x00]*?(?=(\{\{\{\{)))/, /^(?:[\s\S]*?--(~)?\}\})/, /^(?:\()/, /^(?:\))/, /^(?:\{\{\{\{)/, /^(?:\}\}\}\})/, /^(?:\{\{(~)?>)/, /^(?:\{\{(~)?#>)/, /^(?:\{\{(~)?#\*?)/, /^(?:\{\{(~)?\/)/, /^(?:\{\{(~)?\^\s*(~)?\}\})/, /^(?:\{\{(~)?\s*else\s*(~)?\}\})/, /^(?:\{\{(~)?\^)/, /^(?:\{\{(~)?\s*else\b)/, /^(?:\{\{(~)?\{)/, /^(?:\{\{(~)?&)/, /^(?:\{\{(~)?!--)/, /^(?:\{\{(~)?![\s\S]*?\}\})/, /^(?:\{\{(~)?\*?)/, /^(?:=)/, /^(?:\.\.)/, /^(?:\.(?=([=~}\s\/.)|])))/, /^(?:[\/.])/, /^(?:\s+)/, /^(?:\}(~)?\}\})/, /^(?:(~)?\}\})/, /^(?:"(\\["]|[^"])*")/, /^(?:'(\\[']|[^'])*')/, /^(?:@)/, /^(?:true(?=([~}\s)])))/, /^(?:false(?=([~}\s)])))/, /^(?:undefined(?=([~}\s)])))/, /^(?:null(?=([~}\s)])))/, /^(?:-?[0-9]+(?:\.[0-9]+)?(?=([~}\s)])))/, /^(?:as\s+\|)/, /^(?:\|)/, /^(?:([^\s!"#%-,\.\/;->@\[-\^`\{-~]+(?=([=~}\s\/.)|]))))/, /^(?:\[(\\\]|[^\]])*\])/, /^(?:.)/, /^(?:$)/];
	        lexer.conditions = { "mu": { "rules": [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44], "inclusive": false }, "emu": { "rules": [2], "inclusive": false }, "com": { "rules": [6], "inclusive": false }, "raw": { "rules": [3, 4, 5], "inclusive": false }, "INITIAL": { "rules": [0, 1, 44], "inclusive": true } };
	        return lexer;
	    })();
	    parser.lexer = lexer;
	    function Parser() {
	        this.yy = {};
	    }Parser.prototype = parser;parser.Parser = Parser;
	    return new Parser();
	})();exports["default"] = handlebars;
	module.exports = exports["default"];

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _interopRequireDefault = __webpack_require__(1)['default'];

	exports.__esModule = true;

	var _visitor = __webpack_require__(39);

	var _visitor2 = _interopRequireDefault(_visitor);

	function WhitespaceControl() {
	  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	  this.options = options;
	}
	WhitespaceControl.prototype = new _visitor2['default']();

	WhitespaceControl.prototype.Program = function (program) {
	  var doStandalone = !this.options.ignoreStandalone;

	  var isRoot = !this.isRootSeen;
	  this.isRootSeen = true;

	  var body = program.body;
	  for (var i = 0, l = body.length; i < l; i++) {
	    var current = body[i],
	        strip = this.accept(current);

	    if (!strip) {
	      continue;
	    }

	    var _isPrevWhitespace = isPrevWhitespace(body, i, isRoot),
	        _isNextWhitespace = isNextWhitespace(body, i, isRoot),
	        openStandalone = strip.openStandalone && _isPrevWhitespace,
	        closeStandalone = strip.closeStandalone && _isNextWhitespace,
	        inlineStandalone = strip.inlineStandalone && _isPrevWhitespace && _isNextWhitespace;

	    if (strip.close) {
	      omitRight(body, i, true);
	    }
	    if (strip.open) {
	      omitLeft(body, i, true);
	    }

	    if (doStandalone && inlineStandalone) {
	      omitRight(body, i);

	      if (omitLeft(body, i)) {
	        // If we are on a standalone node, save the indent info for partials
	        if (current.type === 'PartialStatement') {
	          // Pull out the whitespace from the final line
	          current.indent = /([ \t]+$)/.exec(body[i - 1].original)[1];
	        }
	      }
	    }
	    if (doStandalone && openStandalone) {
	      omitRight((current.program || current.inverse).body);

	      // Strip out the previous content node if it's whitespace only
	      omitLeft(body, i);
	    }
	    if (doStandalone && closeStandalone) {
	      // Always strip the next node
	      omitRight(body, i);

	      omitLeft((current.inverse || current.program).body);
	    }
	  }

	  return program;
	};

	WhitespaceControl.prototype.BlockStatement = WhitespaceControl.prototype.DecoratorBlock = WhitespaceControl.prototype.PartialBlockStatement = function (block) {
	  this.accept(block.program);
	  this.accept(block.inverse);

	  // Find the inverse program that is involed with whitespace stripping.
	  var program = block.program || block.inverse,
	      inverse = block.program && block.inverse,
	      firstInverse = inverse,
	      lastInverse = inverse;

	  if (inverse && inverse.chained) {
	    firstInverse = inverse.body[0].program;

	    // Walk the inverse chain to find the last inverse that is actually in the chain.
	    while (lastInverse.chained) {
	      lastInverse = lastInverse.body[lastInverse.body.length - 1].program;
	    }
	  }

	  var strip = {
	    open: block.openStrip.open,
	    close: block.closeStrip.close,

	    // Determine the standalone candiacy. Basically flag our content as being possibly standalone
	    // so our parent can determine if we actually are standalone
	    openStandalone: isNextWhitespace(program.body),
	    closeStandalone: isPrevWhitespace((firstInverse || program).body)
	  };

	  if (block.openStrip.close) {
	    omitRight(program.body, null, true);
	  }

	  if (inverse) {
	    var inverseStrip = block.inverseStrip;

	    if (inverseStrip.open) {
	      omitLeft(program.body, null, true);
	    }

	    if (inverseStrip.close) {
	      omitRight(firstInverse.body, null, true);
	    }
	    if (block.closeStrip.open) {
	      omitLeft(lastInverse.body, null, true);
	    }

	    // Find standalone else statments
	    if (!this.options.ignoreStandalone && isPrevWhitespace(program.body) && isNextWhitespace(firstInverse.body)) {
	      omitLeft(program.body);
	      omitRight(firstInverse.body);
	    }
	  } else if (block.closeStrip.open) {
	    omitLeft(program.body, null, true);
	  }

	  return strip;
	};

	WhitespaceControl.prototype.Decorator = WhitespaceControl.prototype.MustacheStatement = function (mustache) {
	  return mustache.strip;
	};

	WhitespaceControl.prototype.PartialStatement = WhitespaceControl.prototype.CommentStatement = function (node) {
	  /* istanbul ignore next */
	  var strip = node.strip || {};
	  return {
	    inlineStandalone: true,
	    open: strip.open,
	    close: strip.close
	  };
	};

	function isPrevWhitespace(body, i, isRoot) {
	  if (i === undefined) {
	    i = body.length;
	  }

	  // Nodes that end with newlines are considered whitespace (but are special
	  // cased for strip operations)
	  var prev = body[i - 1],
	      sibling = body[i - 2];
	  if (!prev) {
	    return isRoot;
	  }

	  if (prev.type === 'ContentStatement') {
	    return (sibling || !isRoot ? /\r?\n\s*?$/ : /(^|\r?\n)\s*?$/).test(prev.original);
	  }
	}
	function isNextWhitespace(body, i, isRoot) {
	  if (i === undefined) {
	    i = -1;
	  }

	  var next = body[i + 1],
	      sibling = body[i + 2];
	  if (!next) {
	    return isRoot;
	  }

	  if (next.type === 'ContentStatement') {
	    return (sibling || !isRoot ? /^\s*?\r?\n/ : /^\s*?(\r?\n|$)/).test(next.original);
	  }
	}

	// Marks the node to the right of the position as omitted.
	// I.e. {{foo}}' ' will mark the ' ' node as omitted.
	//
	// If i is undefined, then the first child will be marked as such.
	//
	// If mulitple is truthy then all whitespace will be stripped out until non-whitespace
	// content is met.
	function omitRight(body, i, multiple) {
	  var current = body[i == null ? 0 : i + 1];
	  if (!current || current.type !== 'ContentStatement' || !multiple && current.rightStripped) {
	    return;
	  }

	  var original = current.value;
	  current.value = current.value.replace(multiple ? /^\s+/ : /^[ \t]*\r?\n?/, '');
	  current.rightStripped = current.value !== original;
	}

	// Marks the node to the left of the position as omitted.
	// I.e. ' '{{foo}} will mark the ' ' node as omitted.
	//
	// If i is undefined then the last child will be marked as such.
	//
	// If mulitple is truthy then all whitespace will be stripped out until non-whitespace
	// content is met.
	function omitLeft(body, i, multiple) {
	  var current = body[i == null ? body.length - 1 : i - 1];
	  if (!current || current.type !== 'ContentStatement' || !multiple && current.leftStripped) {
	    return;
	  }

	  // We omit the last node if it's whitespace only and not preceeded by a non-content node.
	  var original = current.value;
	  current.value = current.value.replace(multiple ? /\s+$/ : /[ \t]+$/, '');
	  current.leftStripped = current.value !== original;
	  return current.leftStripped;
	}

	exports['default'] = WhitespaceControl;
	module.exports = exports['default'];

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _interopRequireDefault = __webpack_require__(1)['default'];

	exports.__esModule = true;

	var _exception = __webpack_require__(6);

	var _exception2 = _interopRequireDefault(_exception);

	function Visitor() {
	  this.parents = [];
	}

	Visitor.prototype = {
	  constructor: Visitor,
	  mutating: false,

	  // Visits a given value. If mutating, will replace the value if necessary.
	  acceptKey: function acceptKey(node, name) {
	    var value = this.accept(node[name]);
	    if (this.mutating) {
	      // Hacky sanity check: This may have a few false positives for type for the helper
	      // methods but will generally do the right thing without a lot of overhead.
	      if (value && !Visitor.prototype[value.type]) {
	        throw new _exception2['default']('Unexpected node type "' + value.type + '" found when accepting ' + name + ' on ' + node.type);
	      }
	      node[name] = value;
	    }
	  },

	  // Performs an accept operation with added sanity check to ensure
	  // required keys are not removed.
	  acceptRequired: function acceptRequired(node, name) {
	    this.acceptKey(node, name);

	    if (!node[name]) {
	      throw new _exception2['default'](node.type + ' requires ' + name);
	    }
	  },

	  // Traverses a given array. If mutating, empty respnses will be removed
	  // for child elements.
	  acceptArray: function acceptArray(array) {
	    for (var i = 0, l = array.length; i < l; i++) {
	      this.acceptKey(array, i);

	      if (!array[i]) {
	        array.splice(i, 1);
	        i--;
	        l--;
	      }
	    }
	  },

	  accept: function accept(object) {
	    if (!object) {
	      return;
	    }

	    /* istanbul ignore next: Sanity code */
	    if (!this[object.type]) {
	      throw new _exception2['default']('Unknown type: ' + object.type, object);
	    }

	    if (this.current) {
	      this.parents.unshift(this.current);
	    }
	    this.current = object;

	    var ret = this[object.type](object);

	    this.current = this.parents.shift();

	    if (!this.mutating || ret) {
	      return ret;
	    } else if (ret !== false) {
	      return object;
	    }
	  },

	  Program: function Program(program) {
	    this.acceptArray(program.body);
	  },

	  MustacheStatement: visitSubExpression,
	  Decorator: visitSubExpression,

	  BlockStatement: visitBlock,
	  DecoratorBlock: visitBlock,

	  PartialStatement: visitPartial,
	  PartialBlockStatement: function PartialBlockStatement(partial) {
	    visitPartial.call(this, partial);

	    this.acceptKey(partial, 'program');
	  },

	  ContentStatement: function ContentStatement() /* content */{},
	  CommentStatement: function CommentStatement() /* comment */{},

	  SubExpression: visitSubExpression,

	  PathExpression: function PathExpression() /* path */{},

	  StringLiteral: function StringLiteral() /* string */{},
	  NumberLiteral: function NumberLiteral() /* number */{},
	  BooleanLiteral: function BooleanLiteral() /* bool */{},
	  UndefinedLiteral: function UndefinedLiteral() /* literal */{},
	  NullLiteral: function NullLiteral() /* literal */{},

	  Hash: function Hash(hash) {
	    this.acceptArray(hash.pairs);
	  },
	  HashPair: function HashPair(pair) {
	    this.acceptRequired(pair, 'value');
	  }
	};

	function visitSubExpression(mustache) {
	  this.acceptRequired(mustache, 'path');
	  this.acceptArray(mustache.params);
	  this.acceptKey(mustache, 'hash');
	}
	function visitBlock(block) {
	  visitSubExpression.call(this, block);

	  this.acceptKey(block, 'program');
	  this.acceptKey(block, 'inverse');
	}
	function visitPartial(partial) {
	  this.acceptRequired(partial, 'name');
	  this.acceptArray(partial.params);
	  this.acceptKey(partial, 'hash');
	}

	exports['default'] = Visitor;
	module.exports = exports['default'];

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _interopRequireDefault = __webpack_require__(1)['default'];

	exports.__esModule = true;
	exports.SourceLocation = SourceLocation;
	exports.id = id;
	exports.stripFlags = stripFlags;
	exports.stripComment = stripComment;
	exports.preparePath = preparePath;
	exports.prepareMustache = prepareMustache;
	exports.prepareRawBlock = prepareRawBlock;
	exports.prepareBlock = prepareBlock;
	exports.prepareProgram = prepareProgram;
	exports.preparePartialBlock = preparePartialBlock;

	var _exception = __webpack_require__(6);

	var _exception2 = _interopRequireDefault(_exception);

	function validateClose(open, close) {
	  close = close.path ? close.path.original : close;

	  if (open.path.original !== close) {
	    var errorNode = { loc: open.path.loc };

	    throw new _exception2['default'](open.path.original + " doesn't match " + close, errorNode);
	  }
	}

	function SourceLocation(source, locInfo) {
	  this.source = source;
	  this.start = {
	    line: locInfo.first_line,
	    column: locInfo.first_column
	  };
	  this.end = {
	    line: locInfo.last_line,
	    column: locInfo.last_column
	  };
	}

	function id(token) {
	  if (/^\[.*\]$/.test(token)) {
	    return token.substring(1, token.length - 1);
	  } else {
	    return token;
	  }
	}

	function stripFlags(open, close) {
	  return {
	    open: open.charAt(2) === '~',
	    close: close.charAt(close.length - 3) === '~'
	  };
	}

	function stripComment(comment) {
	  return comment.replace(/^\{\{~?!-?-?/, '').replace(/-?-?~?\}\}$/, '');
	}

	function preparePath(data, parts, loc) {
	  loc = this.locInfo(loc);

	  var original = data ? '@' : '',
	      dig = [],
	      depth = 0;

	  for (var i = 0, l = parts.length; i < l; i++) {
	    var part = parts[i].part,

	    // If we have [] syntax then we do not treat path references as operators,
	    // i.e. foo.[this] resolves to approximately context.foo['this']
	    isLiteral = parts[i].original !== part;
	    original += (parts[i].separator || '') + part;

	    if (!isLiteral && (part === '..' || part === '.' || part === 'this')) {
	      if (dig.length > 0) {
	        throw new _exception2['default']('Invalid path: ' + original, { loc: loc });
	      } else if (part === '..') {
	        depth++;
	      }
	    } else {
	      dig.push(part);
	    }
	  }

	  return {
	    type: 'PathExpression',
	    data: data,
	    depth: depth,
	    parts: dig,
	    original: original,
	    loc: loc
	  };
	}

	function prepareMustache(path, params, hash, open, strip, locInfo) {
	  // Must use charAt to support IE pre-10
	  var escapeFlag = open.charAt(3) || open.charAt(2),
	      escaped = escapeFlag !== '{' && escapeFlag !== '&';

	  var decorator = /\*/.test(open);
	  return {
	    type: decorator ? 'Decorator' : 'MustacheStatement',
	    path: path,
	    params: params,
	    hash: hash,
	    escaped: escaped,
	    strip: strip,
	    loc: this.locInfo(locInfo)
	  };
	}

	function prepareRawBlock(openRawBlock, contents, close, locInfo) {
	  validateClose(openRawBlock, close);

	  locInfo = this.locInfo(locInfo);
	  var program = {
	    type: 'Program',
	    body: contents,
	    strip: {},
	    loc: locInfo
	  };

	  return {
	    type: 'BlockStatement',
	    path: openRawBlock.path,
	    params: openRawBlock.params,
	    hash: openRawBlock.hash,
	    program: program,
	    openStrip: {},
	    inverseStrip: {},
	    closeStrip: {},
	    loc: locInfo
	  };
	}

	function prepareBlock(openBlock, program, inverseAndProgram, close, inverted, locInfo) {
	  if (close && close.path) {
	    validateClose(openBlock, close);
	  }

	  var decorator = /\*/.test(openBlock.open);

	  program.blockParams = openBlock.blockParams;

	  var inverse = undefined,
	      inverseStrip = undefined;

	  if (inverseAndProgram) {
	    if (decorator) {
	      throw new _exception2['default']('Unexpected inverse block on decorator', inverseAndProgram);
	    }

	    if (inverseAndProgram.chain) {
	      inverseAndProgram.program.body[0].closeStrip = close.strip;
	    }

	    inverseStrip = inverseAndProgram.strip;
	    inverse = inverseAndProgram.program;
	  }

	  if (inverted) {
	    inverted = inverse;
	    inverse = program;
	    program = inverted;
	  }

	  return {
	    type: decorator ? 'DecoratorBlock' : 'BlockStatement',
	    path: openBlock.path,
	    params: openBlock.params,
	    hash: openBlock.hash,
	    program: program,
	    inverse: inverse,
	    openStrip: openBlock.strip,
	    inverseStrip: inverseStrip,
	    closeStrip: close && close.strip,
	    loc: this.locInfo(locInfo)
	  };
	}

	function prepareProgram(statements, loc) {
	  if (!loc && statements.length) {
	    var firstLoc = statements[0].loc,
	        lastLoc = statements[statements.length - 1].loc;

	    /* istanbul ignore else */
	    if (firstLoc && lastLoc) {
	      loc = {
	        source: firstLoc.source,
	        start: {
	          line: firstLoc.start.line,
	          column: firstLoc.start.column
	        },
	        end: {
	          line: lastLoc.end.line,
	          column: lastLoc.end.column
	        }
	      };
	    }
	  }

	  return {
	    type: 'Program',
	    body: statements,
	    strip: {},
	    loc: loc
	  };
	}

	function preparePartialBlock(open, program, close, locInfo) {
	  validateClose(open, close);

	  return {
	    type: 'PartialBlockStatement',
	    name: open.path,
	    params: open.params,
	    hash: open.hash,
	    program: program,
	    openStrip: open.strip,
	    closeStrip: close && close.strip,
	    loc: this.locInfo(locInfo)
	  };
	}

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

	/* eslint-disable new-cap */

	'use strict';

	var _interopRequireDefault = __webpack_require__(1)['default'];

	exports.__esModule = true;
	exports.Compiler = Compiler;
	exports.precompile = precompile;
	exports.compile = compile;

	var _exception = __webpack_require__(6);

	var _exception2 = _interopRequireDefault(_exception);

	var _utils = __webpack_require__(5);

	var _ast = __webpack_require__(35);

	var _ast2 = _interopRequireDefault(_ast);

	var slice = [].slice;

	function Compiler() {}

	// the foundHelper register will disambiguate helper lookup from finding a
	// function in a context. This is necessary for mustache compatibility, which
	// requires that context functions in blocks are evaluated by blockHelperMissing,
	// and then proceed as if the resulting value was provided to blockHelperMissing.

	Compiler.prototype = {
	  compiler: Compiler,

	  equals: function equals(other) {
	    var len = this.opcodes.length;
	    if (other.opcodes.length !== len) {
	      return false;
	    }

	    for (var i = 0; i < len; i++) {
	      var opcode = this.opcodes[i],
	          otherOpcode = other.opcodes[i];
	      if (opcode.opcode !== otherOpcode.opcode || !argEquals(opcode.args, otherOpcode.args)) {
	        return false;
	      }
	    }

	    // We know that length is the same between the two arrays because they are directly tied
	    // to the opcode behavior above.
	    len = this.children.length;
	    for (var i = 0; i < len; i++) {
	      if (!this.children[i].equals(other.children[i])) {
	        return false;
	      }
	    }

	    return true;
	  },

	  guid: 0,

	  compile: function compile(program, options) {
	    this.sourceNode = [];
	    this.opcodes = [];
	    this.children = [];
	    this.options = options;
	    this.stringParams = options.stringParams;
	    this.trackIds = options.trackIds;

	    options.blockParams = options.blockParams || [];

	    // These changes will propagate to the other compiler components
	    var knownHelpers = options.knownHelpers;
	    options.knownHelpers = {
	      'helperMissing': true,
	      'blockHelperMissing': true,
	      'each': true,
	      'if': true,
	      'unless': true,
	      'with': true,
	      'log': true,
	      'lookup': true
	    };
	    if (knownHelpers) {
	      // the next line should use "Object.keys", but the code has been like this a long time and changing it, might
	      // cause backwards-compatibility issues... It's an old library...
	      // eslint-disable-next-line guard-for-in
	      for (var _name in knownHelpers) {
	        this.options.knownHelpers[_name] = knownHelpers[_name];
	      }
	    }

	    return this.accept(program);
	  },

	  compileProgram: function compileProgram(program) {
	    var childCompiler = new this.compiler(),
	        // eslint-disable-line new-cap
	    result = childCompiler.compile(program, this.options),
	        guid = this.guid++;

	    this.usePartial = this.usePartial || result.usePartial;

	    this.children[guid] = result;
	    this.useDepths = this.useDepths || result.useDepths;

	    return guid;
	  },

	  accept: function accept(node) {
	    /* istanbul ignore next: Sanity code */
	    if (!this[node.type]) {
	      throw new _exception2['default']('Unknown type: ' + node.type, node);
	    }

	    this.sourceNode.unshift(node);
	    var ret = this[node.type](node);
	    this.sourceNode.shift();
	    return ret;
	  },

	  Program: function Program(program) {
	    this.options.blockParams.unshift(program.blockParams);

	    var body = program.body,
	        bodyLength = body.length;
	    for (var i = 0; i < bodyLength; i++) {
	      this.accept(body[i]);
	    }

	    this.options.blockParams.shift();

	    this.isSimple = bodyLength === 1;
	    this.blockParams = program.blockParams ? program.blockParams.length : 0;

	    return this;
	  },

	  BlockStatement: function BlockStatement(block) {
	    transformLiteralToPath(block);

	    var program = block.program,
	        inverse = block.inverse;

	    program = program && this.compileProgram(program);
	    inverse = inverse && this.compileProgram(inverse);

	    var type = this.classifySexpr(block);

	    if (type === 'helper') {
	      this.helperSexpr(block, program, inverse);
	    } else if (type === 'simple') {
	      this.simpleSexpr(block);

	      // now that the simple mustache is resolved, we need to
	      // evaluate it by executing `blockHelperMissing`
	      this.opcode('pushProgram', program);
	      this.opcode('pushProgram', inverse);
	      this.opcode('emptyHash');
	      this.opcode('blockValue', block.path.original);
	    } else {
	      this.ambiguousSexpr(block, program, inverse);

	      // now that the simple mustache is resolved, we need to
	      // evaluate it by executing `blockHelperMissing`
	      this.opcode('pushProgram', program);
	      this.opcode('pushProgram', inverse);
	      this.opcode('emptyHash');
	      this.opcode('ambiguousBlockValue');
	    }

	    this.opcode('append');
	  },

	  DecoratorBlock: function DecoratorBlock(decorator) {
	    var program = decorator.program && this.compileProgram(decorator.program);
	    var params = this.setupFullMustacheParams(decorator, program, undefined),
	        path = decorator.path;

	    this.useDecorators = true;
	    this.opcode('registerDecorator', params.length, path.original);
	  },

	  PartialStatement: function PartialStatement(partial) {
	    this.usePartial = true;

	    var program = partial.program;
	    if (program) {
	      program = this.compileProgram(partial.program);
	    }

	    var params = partial.params;
	    if (params.length > 1) {
	      throw new _exception2['default']('Unsupported number of partial arguments: ' + params.length, partial);
	    } else if (!params.length) {
	      if (this.options.explicitPartialContext) {
	        this.opcode('pushLiteral', 'undefined');
	      } else {
	        params.push({ type: 'PathExpression', parts: [], depth: 0 });
	      }
	    }

	    var partialName = partial.name.original,
	        isDynamic = partial.name.type === 'SubExpression';
	    if (isDynamic) {
	      this.accept(partial.name);
	    }

	    this.setupFullMustacheParams(partial, program, undefined, true);

	    var indent = partial.indent || '';
	    if (this.options.preventIndent && indent) {
	      this.opcode('appendContent', indent);
	      indent = '';
	    }

	    this.opcode('invokePartial', isDynamic, partialName, indent);
	    this.opcode('append');
	  },
	  PartialBlockStatement: function PartialBlockStatement(partialBlock) {
	    this.PartialStatement(partialBlock);
	  },

	  MustacheStatement: function MustacheStatement(mustache) {
	    this.SubExpression(mustache);

	    if (mustache.escaped && !this.options.noEscape) {
	      this.opcode('appendEscaped');
	    } else {
	      this.opcode('append');
	    }
	  },
	  Decorator: function Decorator(decorator) {
	    this.DecoratorBlock(decorator);
	  },

	  ContentStatement: function ContentStatement(content) {
	    if (content.value) {
	      this.opcode('appendContent', content.value);
	    }
	  },

	  CommentStatement: function CommentStatement() {},

	  SubExpression: function SubExpression(sexpr) {
	    transformLiteralToPath(sexpr);
	    var type = this.classifySexpr(sexpr);

	    if (type === 'simple') {
	      this.simpleSexpr(sexpr);
	    } else if (type === 'helper') {
	      this.helperSexpr(sexpr);
	    } else {
	      this.ambiguousSexpr(sexpr);
	    }
	  },
	  ambiguousSexpr: function ambiguousSexpr(sexpr, program, inverse) {
	    var path = sexpr.path,
	        name = path.parts[0],
	        isBlock = program != null || inverse != null;

	    this.opcode('getContext', path.depth);

	    this.opcode('pushProgram', program);
	    this.opcode('pushProgram', inverse);

	    path.strict = true;
	    this.accept(path);

	    this.opcode('invokeAmbiguous', name, isBlock);
	  },

	  simpleSexpr: function simpleSexpr(sexpr) {
	    var path = sexpr.path;
	    path.strict = true;
	    this.accept(path);
	    this.opcode('resolvePossibleLambda');
	  },

	  helperSexpr: function helperSexpr(sexpr, program, inverse) {
	    var params = this.setupFullMustacheParams(sexpr, program, inverse),
	        path = sexpr.path,
	        name = path.parts[0];

	    if (this.options.knownHelpers[name]) {
	      this.opcode('invokeKnownHelper', params.length, name);
	    } else if (this.options.knownHelpersOnly) {
	      throw new _exception2['default']('You specified knownHelpersOnly, but used the unknown helper ' + name, sexpr);
	    } else {
	      path.strict = true;
	      path.falsy = true;

	      this.accept(path);
	      this.opcode('invokeHelper', params.length, path.original, _ast2['default'].helpers.simpleId(path));
	    }
	  },

	  PathExpression: function PathExpression(path) {
	    this.addDepth(path.depth);
	    this.opcode('getContext', path.depth);

	    var name = path.parts[0],
	        scoped = _ast2['default'].helpers.scopedId(path),
	        blockParamId = !path.depth && !scoped && this.blockParamIndex(name);

	    if (blockParamId) {
	      this.opcode('lookupBlockParam', blockParamId, path.parts);
	    } else if (!name) {
	      // Context reference, i.e. `{{foo .}}` or `{{foo ..}}`
	      this.opcode('pushContext');
	    } else if (path.data) {
	      this.options.data = true;
	      this.opcode('lookupData', path.depth, path.parts, path.strict);
	    } else {
	      this.opcode('lookupOnContext', path.parts, path.falsy, path.strict, scoped);
	    }
	  },

	  StringLiteral: function StringLiteral(string) {
	    this.opcode('pushString', string.value);
	  },

	  NumberLiteral: function NumberLiteral(number) {
	    this.opcode('pushLiteral', number.value);
	  },

	  BooleanLiteral: function BooleanLiteral(bool) {
	    this.opcode('pushLiteral', bool.value);
	  },

	  UndefinedLiteral: function UndefinedLiteral() {
	    this.opcode('pushLiteral', 'undefined');
	  },

	  NullLiteral: function NullLiteral() {
	    this.opcode('pushLiteral', 'null');
	  },

	  Hash: function Hash(hash) {
	    var pairs = hash.pairs,
	        i = 0,
	        l = pairs.length;

	    this.opcode('pushHash');

	    for (; i < l; i++) {
	      this.pushParam(pairs[i].value);
	    }
	    while (i--) {
	      this.opcode('assignToHash', pairs[i].key);
	    }
	    this.opcode('popHash');
	  },

	  // HELPERS
	  opcode: function opcode(name) {
	    this.opcodes.push({ opcode: name, args: slice.call(arguments, 1), loc: this.sourceNode[0].loc });
	  },

	  addDepth: function addDepth(depth) {
	    if (!depth) {
	      return;
	    }

	    this.useDepths = true;
	  },

	  classifySexpr: function classifySexpr(sexpr) {
	    var isSimple = _ast2['default'].helpers.simpleId(sexpr.path);

	    var isBlockParam = isSimple && !!this.blockParamIndex(sexpr.path.parts[0]);

	    // a mustache is an eligible helper if:
	    // * its id is simple (a single part, not `this` or `..`)
	    var isHelper = !isBlockParam && _ast2['default'].helpers.helperExpression(sexpr);

	    // if a mustache is an eligible helper but not a definite
	    // helper, it is ambiguous, and will be resolved in a later
	    // pass or at runtime.
	    var isEligible = !isBlockParam && (isHelper || isSimple);

	    // if ambiguous, we can possibly resolve the ambiguity now
	    // An eligible helper is one that does not have a complex path, i.e. `this.foo`, `../foo` etc.
	    if (isEligible && !isHelper) {
	      var _name2 = sexpr.path.parts[0],
	          options = this.options;

	      if (options.knownHelpers[_name2]) {
	        isHelper = true;
	      } else if (options.knownHelpersOnly) {
	        isEligible = false;
	      }
	    }

	    if (isHelper) {
	      return 'helper';
	    } else if (isEligible) {
	      return 'ambiguous';
	    } else {
	      return 'simple';
	    }
	  },

	  pushParams: function pushParams(params) {
	    for (var i = 0, l = params.length; i < l; i++) {
	      this.pushParam(params[i]);
	    }
	  },

	  pushParam: function pushParam(val) {
	    var value = val.value != null ? val.value : val.original || '';

	    if (this.stringParams) {
	      if (value.replace) {
	        value = value.replace(/^(\.?\.\/)*/g, '').replace(/\//g, '.');
	      }

	      if (val.depth) {
	        this.addDepth(val.depth);
	      }
	      this.opcode('getContext', val.depth || 0);
	      this.opcode('pushStringParam', value, val.type);

	      if (val.type === 'SubExpression') {
	        // SubExpressions get evaluated and passed in
	        // in string params mode.
	        this.accept(val);
	      }
	    } else {
	      if (this.trackIds) {
	        var blockParamIndex = undefined;
	        if (val.parts && !_ast2['default'].helpers.scopedId(val) && !val.depth) {
	          blockParamIndex = this.blockParamIndex(val.parts[0]);
	        }
	        if (blockParamIndex) {
	          var blockParamChild = val.parts.slice(1).join('.');
	          this.opcode('pushId', 'BlockParam', blockParamIndex, blockParamChild);
	        } else {
	          value = val.original || value;
	          if (value.replace) {
	            value = value.replace(/^this(?:\.|$)/, '').replace(/^\.\//, '').replace(/^\.$/, '');
	          }

	          this.opcode('pushId', val.type, value);
	        }
	      }
	      this.accept(val);
	    }
	  },

	  setupFullMustacheParams: function setupFullMustacheParams(sexpr, program, inverse, omitEmpty) {
	    var params = sexpr.params;
	    this.pushParams(params);

	    this.opcode('pushProgram', program);
	    this.opcode('pushProgram', inverse);

	    if (sexpr.hash) {
	      this.accept(sexpr.hash);
	    } else {
	      this.opcode('emptyHash', omitEmpty);
	    }

	    return params;
	  },

	  blockParamIndex: function blockParamIndex(name) {
	    for (var depth = 0, len = this.options.blockParams.length; depth < len; depth++) {
	      var blockParams = this.options.blockParams[depth],
	          param = blockParams && _utils.indexOf(blockParams, name);
	      if (blockParams && param >= 0) {
	        return [depth, param];
	      }
	    }
	  }
	};

	function precompile(input, options, env) {
	  if (input == null || typeof input !== 'string' && input.type !== 'Program') {
	    throw new _exception2['default']('You must pass a string or Handlebars AST to Handlebars.precompile. You passed ' + input);
	  }

	  options = options || {};
	  if (!('data' in options)) {
	    options.data = true;
	  }
	  if (options.compat) {
	    options.useDepths = true;
	  }

	  var ast = env.parse(input, options),
	      environment = new env.Compiler().compile(ast, options);
	  return new env.JavaScriptCompiler().compile(environment, options);
	}

	function compile(input, options, env) {
	  if (options === undefined) options = {};

	  if (input == null || typeof input !== 'string' && input.type !== 'Program') {
	    throw new _exception2['default']('You must pass a string or Handlebars AST to Handlebars.compile. You passed ' + input);
	  }

	  options = _utils.extend({}, options);
	  if (!('data' in options)) {
	    options.data = true;
	  }
	  if (options.compat) {
	    options.useDepths = true;
	  }

	  var compiled = undefined;

	  function compileInput() {
	    var ast = env.parse(input, options),
	        environment = new env.Compiler().compile(ast, options),
	        templateSpec = new env.JavaScriptCompiler().compile(environment, options, undefined, true);
	    return env.template(templateSpec);
	  }

	  // Template is only compiled on first use and cached after that point.
	  function ret(context, execOptions) {
	    if (!compiled) {
	      compiled = compileInput();
	    }
	    return compiled.call(this, context, execOptions);
	  }
	  ret._setup = function (setupOptions) {
	    if (!compiled) {
	      compiled = compileInput();
	    }
	    return compiled._setup(setupOptions);
	  };
	  ret._child = function (i, data, blockParams, depths) {
	    if (!compiled) {
	      compiled = compileInput();
	    }
	    return compiled._child(i, data, blockParams, depths);
	  };
	  return ret;
	}

	function argEquals(a, b) {
	  if (a === b) {
	    return true;
	  }

	  if (_utils.isArray(a) && _utils.isArray(b) && a.length === b.length) {
	    for (var i = 0; i < a.length; i++) {
	      if (!argEquals(a[i], b[i])) {
	        return false;
	      }
	    }
	    return true;
	  }
	}

	function transformLiteralToPath(sexpr) {
	  if (!sexpr.path.parts) {
	    var literal = sexpr.path;
	    // Casting to string here to make false and 0 literal values play nicely with the rest
	    // of the system.
	    sexpr.path = {
	      type: 'PathExpression',
	      data: false,
	      depth: 0,
	      parts: [literal.original + ''],
	      original: literal.original + '',
	      loc: literal.loc
	    };
	  }
	}

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _interopRequireDefault = __webpack_require__(1)['default'];

	exports.__esModule = true;

	var _base = __webpack_require__(4);

	var _exception = __webpack_require__(6);

	var _exception2 = _interopRequireDefault(_exception);

	var _utils = __webpack_require__(5);

	var _codeGen = __webpack_require__(43);

	var _codeGen2 = _interopRequireDefault(_codeGen);

	function Literal(value) {
	  this.value = value;
	}

	function JavaScriptCompiler() {}

	JavaScriptCompiler.prototype = {
	  // PUBLIC API: You can override these methods in a subclass to provide
	  // alternative compiled forms for name lookup and buffering semantics
	  nameLookup: function nameLookup(parent, name /* , type*/) {
	    if (name === 'constructor') {
	      return ['(', parent, '.propertyIsEnumerable(\'constructor\') ? ', parent, '.constructor : undefined', ')'];
	    }
	    if (JavaScriptCompiler.isValidJavaScriptVariableName(name)) {
	      return [parent, '.', name];
	    } else {
	      return [parent, '[', JSON.stringify(name), ']'];
	    }
	  },
	  depthedLookup: function depthedLookup(name) {
	    return [this.aliasable('container.lookup'), '(depths, "', name, '")'];
	  },

	  compilerInfo: function compilerInfo() {
	    var revision = _base.COMPILER_REVISION,
	        versions = _base.REVISION_CHANGES[revision];
	    return [revision, versions];
	  },

	  appendToBuffer: function appendToBuffer(source, location, explicit) {
	    // Force a source as this simplifies the merge logic.
	    if (!_utils.isArray(source)) {
	      source = [source];
	    }
	    source = this.source.wrap(source, location);

	    if (this.environment.isSimple) {
	      return ['return ', source, ';'];
	    } else if (explicit) {
	      // This is a case where the buffer operation occurs as a child of another
	      // construct, generally braces. We have to explicitly output these buffer
	      // operations to ensure that the emitted code goes in the correct location.
	      return ['buffer += ', source, ';'];
	    } else {
	      source.appendToBuffer = true;
	      return source;
	    }
	  },

	  initializeBuffer: function initializeBuffer() {
	    return this.quotedString('');
	  },
	  // END PUBLIC API

	  compile: function compile(environment, options, context, asObject) {
	    this.environment = environment;
	    this.options = options;
	    this.stringParams = this.options.stringParams;
	    this.trackIds = this.options.trackIds;
	    this.precompile = !asObject;

	    this.name = this.environment.name;
	    this.isChild = !!context;
	    this.context = context || {
	      decorators: [],
	      programs: [],
	      environments: []
	    };

	    this.preamble();

	    this.stackSlot = 0;
	    this.stackVars = [];
	    this.aliases = {};
	    this.registers = { list: [] };
	    this.hashes = [];
	    this.compileStack = [];
	    this.inlineStack = [];
	    this.blockParams = [];

	    this.compileChildren(environment, options);

	    this.useDepths = this.useDepths || environment.useDepths || environment.useDecorators || this.options.compat;
	    this.useBlockParams = this.useBlockParams || environment.useBlockParams;

	    var opcodes = environment.opcodes,
	        opcode = undefined,
	        firstLoc = undefined,
	        i = undefined,
	        l = undefined;

	    for (i = 0, l = opcodes.length; i < l; i++) {
	      opcode = opcodes[i];

	      this.source.currentLocation = opcode.loc;
	      firstLoc = firstLoc || opcode.loc;
	      this[opcode.opcode].apply(this, opcode.args);
	    }

	    // Flush any trailing content that might be pending.
	    this.source.currentLocation = firstLoc;
	    this.pushSource('');

	    /* istanbul ignore next */
	    if (this.stackSlot || this.inlineStack.length || this.compileStack.length) {
	      throw new _exception2['default']('Compile completed with content left on stack');
	    }

	    if (!this.decorators.isEmpty()) {
	      this.useDecorators = true;

	      this.decorators.prepend('var decorators = container.decorators;\n');
	      this.decorators.push('return fn;');

	      if (asObject) {
	        this.decorators = Function.apply(this, ['fn', 'props', 'container', 'depth0', 'data', 'blockParams', 'depths', this.decorators.merge()]);
	      } else {
	        this.decorators.prepend('function(fn, props, container, depth0, data, blockParams, depths) {\n');
	        this.decorators.push('}\n');
	        this.decorators = this.decorators.merge();
	      }
	    } else {
	      this.decorators = undefined;
	    }

	    var fn = this.createFunctionContext(asObject);
	    if (!this.isChild) {
	      var ret = {
	        compiler: this.compilerInfo(),
	        main: fn
	      };

	      if (this.decorators) {
	        ret.main_d = this.decorators; // eslint-disable-line camelcase
	        ret.useDecorators = true;
	      }

	      var _context = this.context;
	      var programs = _context.programs;
	      var decorators = _context.decorators;

	      for (i = 0, l = programs.length; i < l; i++) {
	        if (programs[i]) {
	          ret[i] = programs[i];
	          if (decorators[i]) {
	            ret[i + '_d'] = decorators[i];
	            ret.useDecorators = true;
	          }
	        }
	      }

	      if (this.environment.usePartial) {
	        ret.usePartial = true;
	      }
	      if (this.options.data) {
	        ret.useData = true;
	      }
	      if (this.useDepths) {
	        ret.useDepths = true;
	      }
	      if (this.useBlockParams) {
	        ret.useBlockParams = true;
	      }
	      if (this.options.compat) {
	        ret.compat = true;
	      }

	      if (!asObject) {
	        ret.compiler = JSON.stringify(ret.compiler);

	        this.source.currentLocation = { start: { line: 1, column: 0 } };
	        ret = this.objectLiteral(ret);

	        if (options.srcName) {
	          ret = ret.toStringWithSourceMap({ file: options.destName });
	          ret.map = ret.map && ret.map.toString();
	        } else {
	          ret = ret.toString();
	        }
	      } else {
	        ret.compilerOptions = this.options;
	      }

	      return ret;
	    } else {
	      return fn;
	    }
	  },

	  preamble: function preamble() {
	    // track the last context pushed into place to allow skipping the
	    // getContext opcode when it would be a noop
	    this.lastContext = 0;
	    this.source = new _codeGen2['default'](this.options.srcName);
	    this.decorators = new _codeGen2['default'](this.options.srcName);
	  },

	  createFunctionContext: function createFunctionContext(asObject) {
	    var varDeclarations = '';

	    var locals = this.stackVars.concat(this.registers.list);
	    if (locals.length > 0) {
	      varDeclarations += ', ' + locals.join(', ');
	    }

	    // Generate minimizer alias mappings
	    //
	    // When using true SourceNodes, this will update all references to the given alias
	    // as the source nodes are reused in situ. For the non-source node compilation mode,
	    // aliases will not be used, but this case is already being run on the client and
	    // we aren't concern about minimizing the template size.
	    var aliasCount = 0;
	    for (var alias in this.aliases) {
	      // eslint-disable-line guard-for-in
	      var node = this.aliases[alias];

	      if (this.aliases.hasOwnProperty(alias) && node.children && node.referenceCount > 1) {
	        varDeclarations += ', alias' + ++aliasCount + '=' + alias;
	        node.children[0] = 'alias' + aliasCount;
	      }
	    }

	    var params = ['container', 'depth0', 'helpers', 'partials', 'data'];

	    if (this.useBlockParams || this.useDepths) {
	      params.push('blockParams');
	    }
	    if (this.useDepths) {
	      params.push('depths');
	    }

	    // Perform a second pass over the output to merge content when possible
	    var source = this.mergeSource(varDeclarations);

	    if (asObject) {
	      params.push(source);

	      return Function.apply(this, params);
	    } else {
	      return this.source.wrap(['function(', params.join(','), ') {\n  ', source, '}']);
	    }
	  },
	  mergeSource: function mergeSource(varDeclarations) {
	    var isSimple = this.environment.isSimple,
	        appendOnly = !this.forceBuffer,
	        appendFirst = undefined,
	        sourceSeen = undefined,
	        bufferStart = undefined,
	        bufferEnd = undefined;
	    this.source.each(function (line) {
	      if (line.appendToBuffer) {
	        if (bufferStart) {
	          line.prepend('  + ');
	        } else {
	          bufferStart = line;
	        }
	        bufferEnd = line;
	      } else {
	        if (bufferStart) {
	          if (!sourceSeen) {
	            appendFirst = true;
	          } else {
	            bufferStart.prepend('buffer += ');
	          }
	          bufferEnd.add(';');
	          bufferStart = bufferEnd = undefined;
	        }

	        sourceSeen = true;
	        if (!isSimple) {
	          appendOnly = false;
	        }
	      }
	    });

	    if (appendOnly) {
	      if (bufferStart) {
	        bufferStart.prepend('return ');
	        bufferEnd.add(';');
	      } else if (!sourceSeen) {
	        this.source.push('return "";');
	      }
	    } else {
	      varDeclarations += ', buffer = ' + (appendFirst ? '' : this.initializeBuffer());

	      if (bufferStart) {
	        bufferStart.prepend('return buffer + ');
	        bufferEnd.add(';');
	      } else {
	        this.source.push('return buffer;');
	      }
	    }

	    if (varDeclarations) {
	      this.source.prepend('var ' + varDeclarations.substring(2) + (appendFirst ? '' : ';\n'));
	    }

	    return this.source.merge();
	  },

	  // [blockValue]
	  //
	  // On stack, before: hash, inverse, program, value
	  // On stack, after: return value of blockHelperMissing
	  //
	  // The purpose of this opcode is to take a block of the form
	  // `{{#this.foo}}...{{/this.foo}}`, resolve the value of `foo`, and
	  // replace it on the stack with the result of properly
	  // invoking blockHelperMissing.
	  blockValue: function blockValue(name) {
	    var blockHelperMissing = this.aliasable('helpers.blockHelperMissing'),
	        params = [this.contextName(0)];
	    this.setupHelperArgs(name, 0, params);

	    var blockName = this.popStack();
	    params.splice(1, 0, blockName);

	    this.push(this.source.functionCall(blockHelperMissing, 'call', params));
	  },

	  // [ambiguousBlockValue]
	  //
	  // On stack, before: hash, inverse, program, value
	  // Compiler value, before: lastHelper=value of last found helper, if any
	  // On stack, after, if no lastHelper: same as [blockValue]
	  // On stack, after, if lastHelper: value
	  ambiguousBlockValue: function ambiguousBlockValue() {
	    // We're being a bit cheeky and reusing the options value from the prior exec
	    var blockHelperMissing = this.aliasable('helpers.blockHelperMissing'),
	        params = [this.contextName(0)];
	    this.setupHelperArgs('', 0, params, true);

	    this.flushInline();

	    var current = this.topStack();
	    params.splice(1, 0, current);

	    this.pushSource(['if (!', this.lastHelper, ') { ', current, ' = ', this.source.functionCall(blockHelperMissing, 'call', params), '}']);
	  },

	  // [appendContent]
	  //
	  // On stack, before: ...
	  // On stack, after: ...
	  //
	  // Appends the string value of `content` to the current buffer
	  appendContent: function appendContent(content) {
	    if (this.pendingContent) {
	      content = this.pendingContent + content;
	    } else {
	      this.pendingLocation = this.source.currentLocation;
	    }

	    this.pendingContent = content;
	  },

	  // [append]
	  //
	  // On stack, before: value, ...
	  // On stack, after: ...
	  //
	  // Coerces `value` to a String and appends it to the current buffer.
	  //
	  // If `value` is truthy, or 0, it is coerced into a string and appended
	  // Otherwise, the empty string is appended
	  append: function append() {
	    if (this.isInline()) {
	      this.replaceStack(function (current) {
	        return [' != null ? ', current, ' : ""'];
	      });

	      this.pushSource(this.appendToBuffer(this.popStack()));
	    } else {
	      var local = this.popStack();
	      this.pushSource(['if (', local, ' != null) { ', this.appendToBuffer(local, undefined, true), ' }']);
	      if (this.environment.isSimple) {
	        this.pushSource(['else { ', this.appendToBuffer("''", undefined, true), ' }']);
	      }
	    }
	  },

	  // [appendEscaped]
	  //
	  // On stack, before: value, ...
	  // On stack, after: ...
	  //
	  // Escape `value` and append it to the buffer
	  appendEscaped: function appendEscaped() {
	    this.pushSource(this.appendToBuffer([this.aliasable('container.escapeExpression'), '(', this.popStack(), ')']));
	  },

	  // [getContext]
	  //
	  // On stack, before: ...
	  // On stack, after: ...
	  // Compiler value, after: lastContext=depth
	  //
	  // Set the value of the `lastContext` compiler value to the depth
	  getContext: function getContext(depth) {
	    this.lastContext = depth;
	  },

	  // [pushContext]
	  //
	  // On stack, before: ...
	  // On stack, after: currentContext, ...
	  //
	  // Pushes the value of the current context onto the stack.
	  pushContext: function pushContext() {
	    this.pushStackLiteral(this.contextName(this.lastContext));
	  },

	  // [lookupOnContext]
	  //
	  // On stack, before: ...
	  // On stack, after: currentContext[name], ...
	  //
	  // Looks up the value of `name` on the current context and pushes
	  // it onto the stack.
	  lookupOnContext: function lookupOnContext(parts, falsy, strict, scoped) {
	    var i = 0;

	    if (!scoped && this.options.compat && !this.lastContext) {
	      // The depthed query is expected to handle the undefined logic for the root level that
	      // is implemented below, so we evaluate that directly in compat mode
	      this.push(this.depthedLookup(parts[i++]));
	    } else {
	      this.pushContext();
	    }

	    this.resolvePath('context', parts, i, falsy, strict);
	  },

	  // [lookupBlockParam]
	  //
	  // On stack, before: ...
	  // On stack, after: blockParam[name], ...
	  //
	  // Looks up the value of `parts` on the given block param and pushes
	  // it onto the stack.
	  lookupBlockParam: function lookupBlockParam(blockParamId, parts) {
	    this.useBlockParams = true;

	    this.push(['blockParams[', blockParamId[0], '][', blockParamId[1], ']']);
	    this.resolvePath('context', parts, 1);
	  },

	  // [lookupData]
	  //
	  // On stack, before: ...
	  // On stack, after: data, ...
	  //
	  // Push the data lookup operator
	  lookupData: function lookupData(depth, parts, strict) {
	    if (!depth) {
	      this.pushStackLiteral('data');
	    } else {
	      this.pushStackLiteral('container.data(data, ' + depth + ')');
	    }

	    this.resolvePath('data', parts, 0, true, strict);
	  },

	  resolvePath: function resolvePath(type, parts, i, falsy, strict) {
	    // istanbul ignore next

	    var _this = this;

	    if (this.options.strict || this.options.assumeObjects) {
	      this.push(strictLookup(this.options.strict && strict, this, parts, type));
	      return;
	    }

	    var len = parts.length;
	    for (; i < len; i++) {
	      /* eslint-disable no-loop-func */
	      this.replaceStack(function (current) {
	        var lookup = _this.nameLookup(current, parts[i], type);
	        // We want to ensure that zero and false are handled properly if the context (falsy flag)
	        // needs to have the special handling for these values.
	        if (!falsy) {
	          return [' != null ? ', lookup, ' : ', current];
	        } else {
	          // Otherwise we can use generic falsy handling
	          return [' && ', lookup];
	        }
	      });
	      /* eslint-enable no-loop-func */
	    }
	  },

	  // [resolvePossibleLambda]
	  //
	  // On stack, before: value, ...
	  // On stack, after: resolved value, ...
	  //
	  // If the `value` is a lambda, replace it on the stack by
	  // the return value of the lambda
	  resolvePossibleLambda: function resolvePossibleLambda() {
	    this.push([this.aliasable('container.lambda'), '(', this.popStack(), ', ', this.contextName(0), ')']);
	  },

	  // [pushStringParam]
	  //
	  // On stack, before: ...
	  // On stack, after: string, currentContext, ...
	  //
	  // This opcode is designed for use in string mode, which
	  // provides the string value of a parameter along with its
	  // depth rather than resolving it immediately.
	  pushStringParam: function pushStringParam(string, type) {
	    this.pushContext();
	    this.pushString(type);

	    // If it's a subexpression, the string result
	    // will be pushed after this opcode.
	    if (type !== 'SubExpression') {
	      if (typeof string === 'string') {
	        this.pushString(string);
	      } else {
	        this.pushStackLiteral(string);
	      }
	    }
	  },

	  emptyHash: function emptyHash(omitEmpty) {
	    if (this.trackIds) {
	      this.push('{}'); // hashIds
	    }
	    if (this.stringParams) {
	      this.push('{}'); // hashContexts
	      this.push('{}'); // hashTypes
	    }
	    this.pushStackLiteral(omitEmpty ? 'undefined' : '{}');
	  },
	  pushHash: function pushHash() {
	    if (this.hash) {
	      this.hashes.push(this.hash);
	    }
	    this.hash = { values: [], types: [], contexts: [], ids: [] };
	  },
	  popHash: function popHash() {
	    var hash = this.hash;
	    this.hash = this.hashes.pop();

	    if (this.trackIds) {
	      this.push(this.objectLiteral(hash.ids));
	    }
	    if (this.stringParams) {
	      this.push(this.objectLiteral(hash.contexts));
	      this.push(this.objectLiteral(hash.types));
	    }

	    this.push(this.objectLiteral(hash.values));
	  },

	  // [pushString]
	  //
	  // On stack, before: ...
	  // On stack, after: quotedString(string), ...
	  //
	  // Push a quoted version of `string` onto the stack
	  pushString: function pushString(string) {
	    this.pushStackLiteral(this.quotedString(string));
	  },

	  // [pushLiteral]
	  //
	  // On stack, before: ...
	  // On stack, after: value, ...
	  //
	  // Pushes a value onto the stack. This operation prevents
	  // the compiler from creating a temporary variable to hold
	  // it.
	  pushLiteral: function pushLiteral(value) {
	    this.pushStackLiteral(value);
	  },

	  // [pushProgram]
	  //
	  // On stack, before: ...
	  // On stack, after: program(guid), ...
	  //
	  // Push a program expression onto the stack. This takes
	  // a compile-time guid and converts it into a runtime-accessible
	  // expression.
	  pushProgram: function pushProgram(guid) {
	    if (guid != null) {
	      this.pushStackLiteral(this.programExpression(guid));
	    } else {
	      this.pushStackLiteral(null);
	    }
	  },

	  // [registerDecorator]
	  //
	  // On stack, before: hash, program, params..., ...
	  // On stack, after: ...
	  //
	  // Pops off the decorator's parameters, invokes the decorator,
	  // and inserts the decorator into the decorators list.
	  registerDecorator: function registerDecorator(paramSize, name) {
	    var foundDecorator = this.nameLookup('decorators', name, 'decorator'),
	        options = this.setupHelperArgs(name, paramSize);

	    this.decorators.push(['fn = ', this.decorators.functionCall(foundDecorator, '', ['fn', 'props', 'container', options]), ' || fn;']);
	  },

	  // [invokeHelper]
	  //
	  // On stack, before: hash, inverse, program, params..., ...
	  // On stack, after: result of helper invocation
	  //
	  // Pops off the helper's parameters, invokes the helper,
	  // and pushes the helper's return value onto the stack.
	  //
	  // If the helper is not found, `helperMissing` is called.
	  invokeHelper: function invokeHelper(paramSize, name, isSimple) {
	    var nonHelper = this.popStack(),
	        helper = this.setupHelper(paramSize, name),
	        simple = isSimple ? [helper.name, ' || '] : '';

	    var lookup = ['('].concat(simple, nonHelper);
	    if (!this.options.strict) {
	      lookup.push(' || ', this.aliasable('helpers.helperMissing'));
	    }
	    lookup.push(')');

	    this.push(this.source.functionCall(lookup, 'call', helper.callParams));
	  },

	  // [invokeKnownHelper]
	  //
	  // On stack, before: hash, inverse, program, params..., ...
	  // On stack, after: result of helper invocation
	  //
	  // This operation is used when the helper is known to exist,
	  // so a `helperMissing` fallback is not required.
	  invokeKnownHelper: function invokeKnownHelper(paramSize, name) {
	    var helper = this.setupHelper(paramSize, name);
	    this.push(this.source.functionCall(helper.name, 'call', helper.callParams));
	  },

	  // [invokeAmbiguous]
	  //
	  // On stack, before: hash, inverse, program, params..., ...
	  // On stack, after: result of disambiguation
	  //
	  // This operation is used when an expression like `{{foo}}`
	  // is provided, but we don't know at compile-time whether it
	  // is a helper or a path.
	  //
	  // This operation emits more code than the other options,
	  // and can be avoided by passing the `knownHelpers` and
	  // `knownHelpersOnly` flags at compile-time.
	  invokeAmbiguous: function invokeAmbiguous(name, helperCall) {
	    this.useRegister('helper');

	    var nonHelper = this.popStack();

	    this.emptyHash();
	    var helper = this.setupHelper(0, name, helperCall);

	    var helperName = this.lastHelper = this.nameLookup('helpers', name, 'helper');

	    var lookup = ['(', '(helper = ', helperName, ' || ', nonHelper, ')'];
	    if (!this.options.strict) {
	      lookup[0] = '(helper = ';
	      lookup.push(' != null ? helper : ', this.aliasable('helpers.helperMissing'));
	    }

	    this.push(['(', lookup, helper.paramsInit ? ['),(', helper.paramsInit] : [], '),', '(typeof helper === ', this.aliasable('"function"'), ' ? ', this.source.functionCall('helper', 'call', helper.callParams), ' : helper))']);
	  },

	  // [invokePartial]
	  //
	  // On stack, before: context, ...
	  // On stack after: result of partial invocation
	  //
	  // This operation pops off a context, invokes a partial with that context,
	  // and pushes the result of the invocation back.
	  invokePartial: function invokePartial(isDynamic, name, indent) {
	    var params = [],
	        options = this.setupParams(name, 1, params);

	    if (isDynamic) {
	      name = this.popStack();
	      delete options.name;
	    }

	    if (indent) {
	      options.indent = JSON.stringify(indent);
	    }
	    options.helpers = 'helpers';
	    options.partials = 'partials';
	    options.decorators = 'container.decorators';

	    if (!isDynamic) {
	      params.unshift(this.nameLookup('partials', name, 'partial'));
	    } else {
	      params.unshift(name);
	    }

	    if (this.options.compat) {
	      options.depths = 'depths';
	    }
	    options = this.objectLiteral(options);
	    params.push(options);

	    this.push(this.source.functionCall('container.invokePartial', '', params));
	  },

	  // [assignToHash]
	  //
	  // On stack, before: value, ..., hash, ...
	  // On stack, after: ..., hash, ...
	  //
	  // Pops a value off the stack and assigns it to the current hash
	  assignToHash: function assignToHash(key) {
	    var value = this.popStack(),
	        context = undefined,
	        type = undefined,
	        id = undefined;

	    if (this.trackIds) {
	      id = this.popStack();
	    }
	    if (this.stringParams) {
	      type = this.popStack();
	      context = this.popStack();
	    }

	    var hash = this.hash;
	    if (context) {
	      hash.contexts[key] = context;
	    }
	    if (type) {
	      hash.types[key] = type;
	    }
	    if (id) {
	      hash.ids[key] = id;
	    }
	    hash.values[key] = value;
	  },

	  pushId: function pushId(type, name, child) {
	    if (type === 'BlockParam') {
	      this.pushStackLiteral('blockParams[' + name[0] + '].path[' + name[1] + ']' + (child ? ' + ' + JSON.stringify('.' + child) : ''));
	    } else if (type === 'PathExpression') {
	      this.pushString(name);
	    } else if (type === 'SubExpression') {
	      this.pushStackLiteral('true');
	    } else {
	      this.pushStackLiteral('null');
	    }
	  },

	  // HELPERS

	  compiler: JavaScriptCompiler,

	  compileChildren: function compileChildren(environment, options) {
	    var children = environment.children,
	        child = undefined,
	        compiler = undefined;

	    for (var i = 0, l = children.length; i < l; i++) {
	      child = children[i];
	      compiler = new this.compiler(); // eslint-disable-line new-cap

	      var existing = this.matchExistingProgram(child);

	      if (existing == null) {
	        this.context.programs.push(''); // Placeholder to prevent name conflicts for nested children
	        var index = this.context.programs.length;
	        child.index = index;
	        child.name = 'program' + index;
	        this.context.programs[index] = compiler.compile(child, options, this.context, !this.precompile);
	        this.context.decorators[index] = compiler.decorators;
	        this.context.environments[index] = child;

	        this.useDepths = this.useDepths || compiler.useDepths;
	        this.useBlockParams = this.useBlockParams || compiler.useBlockParams;
	        child.useDepths = this.useDepths;
	        child.useBlockParams = this.useBlockParams;
	      } else {
	        child.index = existing.index;
	        child.name = 'program' + existing.index;

	        this.useDepths = this.useDepths || existing.useDepths;
	        this.useBlockParams = this.useBlockParams || existing.useBlockParams;
	      }
	    }
	  },
	  matchExistingProgram: function matchExistingProgram(child) {
	    for (var i = 0, len = this.context.environments.length; i < len; i++) {
	      var environment = this.context.environments[i];
	      if (environment && environment.equals(child)) {
	        return environment;
	      }
	    }
	  },

	  programExpression: function programExpression(guid) {
	    var child = this.environment.children[guid],
	        programParams = [child.index, 'data', child.blockParams];

	    if (this.useBlockParams || this.useDepths) {
	      programParams.push('blockParams');
	    }
	    if (this.useDepths) {
	      programParams.push('depths');
	    }

	    return 'container.program(' + programParams.join(', ') + ')';
	  },

	  useRegister: function useRegister(name) {
	    if (!this.registers[name]) {
	      this.registers[name] = true;
	      this.registers.list.push(name);
	    }
	  },

	  push: function push(expr) {
	    if (!(expr instanceof Literal)) {
	      expr = this.source.wrap(expr);
	    }

	    this.inlineStack.push(expr);
	    return expr;
	  },

	  pushStackLiteral: function pushStackLiteral(item) {
	    this.push(new Literal(item));
	  },

	  pushSource: function pushSource(source) {
	    if (this.pendingContent) {
	      this.source.push(this.appendToBuffer(this.source.quotedString(this.pendingContent), this.pendingLocation));
	      this.pendingContent = undefined;
	    }

	    if (source) {
	      this.source.push(source);
	    }
	  },

	  replaceStack: function replaceStack(callback) {
	    var prefix = ['('],
	        stack = undefined,
	        createdStack = undefined,
	        usedLiteral = undefined;

	    /* istanbul ignore next */
	    if (!this.isInline()) {
	      throw new _exception2['default']('replaceStack on non-inline');
	    }

	    // We want to merge the inline statement into the replacement statement via ','
	    var top = this.popStack(true);

	    if (top instanceof Literal) {
	      // Literals do not need to be inlined
	      stack = [top.value];
	      prefix = ['(', stack];
	      usedLiteral = true;
	    } else {
	      // Get or create the current stack name for use by the inline
	      createdStack = true;
	      var _name = this.incrStack();

	      prefix = ['((', this.push(_name), ' = ', top, ')'];
	      stack = this.topStack();
	    }

	    var item = callback.call(this, stack);

	    if (!usedLiteral) {
	      this.popStack();
	    }
	    if (createdStack) {
	      this.stackSlot--;
	    }
	    this.push(prefix.concat(item, ')'));
	  },

	  incrStack: function incrStack() {
	    this.stackSlot++;
	    if (this.stackSlot > this.stackVars.length) {
	      this.stackVars.push('stack' + this.stackSlot);
	    }
	    return this.topStackName();
	  },
	  topStackName: function topStackName() {
	    return 'stack' + this.stackSlot;
	  },
	  flushInline: function flushInline() {
	    var inlineStack = this.inlineStack;
	    this.inlineStack = [];
	    for (var i = 0, len = inlineStack.length; i < len; i++) {
	      var entry = inlineStack[i];
	      /* istanbul ignore if */
	      if (entry instanceof Literal) {
	        this.compileStack.push(entry);
	      } else {
	        var stack = this.incrStack();
	        this.pushSource([stack, ' = ', entry, ';']);
	        this.compileStack.push(stack);
	      }
	    }
	  },
	  isInline: function isInline() {
	    return this.inlineStack.length;
	  },

	  popStack: function popStack(wrapped) {
	    var inline = this.isInline(),
	        item = (inline ? this.inlineStack : this.compileStack).pop();

	    if (!wrapped && item instanceof Literal) {
	      return item.value;
	    } else {
	      if (!inline) {
	        /* istanbul ignore next */
	        if (!this.stackSlot) {
	          throw new _exception2['default']('Invalid stack pop');
	        }
	        this.stackSlot--;
	      }
	      return item;
	    }
	  },

	  topStack: function topStack() {
	    var stack = this.isInline() ? this.inlineStack : this.compileStack,
	        item = stack[stack.length - 1];

	    /* istanbul ignore if */
	    if (item instanceof Literal) {
	      return item.value;
	    } else {
	      return item;
	    }
	  },

	  contextName: function contextName(context) {
	    if (this.useDepths && context) {
	      return 'depths[' + context + ']';
	    } else {
	      return 'depth' + context;
	    }
	  },

	  quotedString: function quotedString(str) {
	    return this.source.quotedString(str);
	  },

	  objectLiteral: function objectLiteral(obj) {
	    return this.source.objectLiteral(obj);
	  },

	  aliasable: function aliasable(name) {
	    var ret = this.aliases[name];
	    if (ret) {
	      ret.referenceCount++;
	      return ret;
	    }

	    ret = this.aliases[name] = this.source.wrap(name);
	    ret.aliasable = true;
	    ret.referenceCount = 1;

	    return ret;
	  },

	  setupHelper: function setupHelper(paramSize, name, blockHelper) {
	    var params = [],
	        paramsInit = this.setupHelperArgs(name, paramSize, params, blockHelper);
	    var foundHelper = this.nameLookup('helpers', name, 'helper'),
	        callContext = this.aliasable(this.contextName(0) + ' != null ? ' + this.contextName(0) + ' : (container.nullContext || {})');

	    return {
	      params: params,
	      paramsInit: paramsInit,
	      name: foundHelper,
	      callParams: [callContext].concat(params)
	    };
	  },

	  setupParams: function setupParams(helper, paramSize, params) {
	    var options = {},
	        contexts = [],
	        types = [],
	        ids = [],
	        objectArgs = !params,
	        param = undefined;

	    if (objectArgs) {
	      params = [];
	    }

	    options.name = this.quotedString(helper);
	    options.hash = this.popStack();

	    if (this.trackIds) {
	      options.hashIds = this.popStack();
	    }
	    if (this.stringParams) {
	      options.hashTypes = this.popStack();
	      options.hashContexts = this.popStack();
	    }

	    var inverse = this.popStack(),
	        program = this.popStack();

	    // Avoid setting fn and inverse if neither are set. This allows
	    // helpers to do a check for `if (options.fn)`
	    if (program || inverse) {
	      options.fn = program || 'container.noop';
	      options.inverse = inverse || 'container.noop';
	    }

	    // The parameters go on to the stack in order (making sure that they are evaluated in order)
	    // so we need to pop them off the stack in reverse order
	    var i = paramSize;
	    while (i--) {
	      param = this.popStack();
	      params[i] = param;

	      if (this.trackIds) {
	        ids[i] = this.popStack();
	      }
	      if (this.stringParams) {
	        types[i] = this.popStack();
	        contexts[i] = this.popStack();
	      }
	    }

	    if (objectArgs) {
	      options.args = this.source.generateArray(params);
	    }

	    if (this.trackIds) {
	      options.ids = this.source.generateArray(ids);
	    }
	    if (this.stringParams) {
	      options.types = this.source.generateArray(types);
	      options.contexts = this.source.generateArray(contexts);
	    }

	    if (this.options.data) {
	      options.data = 'data';
	    }
	    if (this.useBlockParams) {
	      options.blockParams = 'blockParams';
	    }
	    return options;
	  },

	  setupHelperArgs: function setupHelperArgs(helper, paramSize, params, useRegister) {
	    var options = this.setupParams(helper, paramSize, params);
	    options = this.objectLiteral(options);
	    if (useRegister) {
	      this.useRegister('options');
	      params.push('options');
	      return ['options=', options];
	    } else if (params) {
	      params.push(options);
	      return '';
	    } else {
	      return options;
	    }
	  }
	};

	(function () {
	  var reservedWords = ('break else new var' + ' case finally return void' + ' catch for switch while' + ' continue function this with' + ' default if throw' + ' delete in try' + ' do instanceof typeof' + ' abstract enum int short' + ' boolean export interface static' + ' byte extends long super' + ' char final native synchronized' + ' class float package throws' + ' const goto private transient' + ' debugger implements protected volatile' + ' double import public let yield await' + ' null true false').split(' ');

	  var compilerWords = JavaScriptCompiler.RESERVED_WORDS = {};

	  for (var i = 0, l = reservedWords.length; i < l; i++) {
	    compilerWords[reservedWords[i]] = true;
	  }
	})();

	JavaScriptCompiler.isValidJavaScriptVariableName = function (name) {
	  return !JavaScriptCompiler.RESERVED_WORDS[name] && /^[a-zA-Z_$][0-9a-zA-Z_$]*$/.test(name);
	};

	function strictLookup(requireTerminal, compiler, parts, type) {
	  var stack = compiler.popStack(),
	      i = 0,
	      len = parts.length;
	  if (requireTerminal) {
	    len--;
	  }

	  for (; i < len; i++) {
	    stack = compiler.nameLookup(stack, parts[i], type);
	  }

	  if (requireTerminal) {
	    return [compiler.aliasable('container.strict'), '(', stack, ', ', compiler.quotedString(parts[i]), ')'];
	  } else {
	    return stack;
	  }
	}

	exports['default'] = JavaScriptCompiler;
	module.exports = exports['default'];

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

	/* global define */
	'use strict';

	exports.__esModule = true;

	var _utils = __webpack_require__(5);

	var SourceNode = undefined;

	try {
	  /* istanbul ignore next */
	  if (false) {
	    // We don't support this in AMD environments. For these environments, we asusme that
	    // they are running on the browser and thus have no need for the source-map library.
	    var SourceMap = require('source-map');
	    SourceNode = SourceMap.SourceNode;
	  }
	} catch (err) {}
	/* NOP */

	/* istanbul ignore if: tested but not covered in istanbul due to dist build  */
	if (!SourceNode) {
	  SourceNode = function (line, column, srcFile, chunks) {
	    this.src = '';
	    if (chunks) {
	      this.add(chunks);
	    }
	  };
	  /* istanbul ignore next */
	  SourceNode.prototype = {
	    add: function add(chunks) {
	      if (_utils.isArray(chunks)) {
	        chunks = chunks.join('');
	      }
	      this.src += chunks;
	    },
	    prepend: function prepend(chunks) {
	      if (_utils.isArray(chunks)) {
	        chunks = chunks.join('');
	      }
	      this.src = chunks + this.src;
	    },
	    toStringWithSourceMap: function toStringWithSourceMap() {
	      return { code: this.toString() };
	    },
	    toString: function toString() {
	      return this.src;
	    }
	  };
	}

	function castChunk(chunk, codeGen, loc) {
	  if (_utils.isArray(chunk)) {
	    var ret = [];

	    for (var i = 0, len = chunk.length; i < len; i++) {
	      ret.push(codeGen.wrap(chunk[i], loc));
	    }
	    return ret;
	  } else if (typeof chunk === 'boolean' || typeof chunk === 'number') {
	    // Handle primitives that the SourceNode will throw up on
	    return chunk + '';
	  }
	  return chunk;
	}

	function CodeGen(srcFile) {
	  this.srcFile = srcFile;
	  this.source = [];
	}

	CodeGen.prototype = {
	  isEmpty: function isEmpty() {
	    return !this.source.length;
	  },
	  prepend: function prepend(source, loc) {
	    this.source.unshift(this.wrap(source, loc));
	  },
	  push: function push(source, loc) {
	    this.source.push(this.wrap(source, loc));
	  },

	  merge: function merge() {
	    var source = this.empty();
	    this.each(function (line) {
	      source.add(['  ', line, '\n']);
	    });
	    return source;
	  },

	  each: function each(iter) {
	    for (var i = 0, len = this.source.length; i < len; i++) {
	      iter(this.source[i]);
	    }
	  },

	  empty: function empty() {
	    var loc = this.currentLocation || { start: {} };
	    return new SourceNode(loc.start.line, loc.start.column, this.srcFile);
	  },
	  wrap: function wrap(chunk) {
	    var loc = arguments.length <= 1 || arguments[1] === undefined ? this.currentLocation || { start: {} } : arguments[1];

	    if (chunk instanceof SourceNode) {
	      return chunk;
	    }

	    chunk = castChunk(chunk, this, loc);

	    return new SourceNode(loc.start.line, loc.start.column, this.srcFile, chunk);
	  },

	  functionCall: function functionCall(fn, type, params) {
	    params = this.generateList(params);
	    return this.wrap([fn, type ? '.' + type + '(' : '(', params, ')']);
	  },

	  quotedString: function quotedString(str) {
	    return '"' + (str + '').replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\u2028/g, '\\u2028') // Per Ecma-262 7.3 + 7.8.4
	    .replace(/\u2029/g, '\\u2029') + '"';
	  },

	  objectLiteral: function objectLiteral(obj) {
	    var pairs = [];

	    for (var key in obj) {
	      if (obj.hasOwnProperty(key)) {
	        var value = castChunk(obj[key], this);
	        if (value !== 'undefined') {
	          pairs.push([this.quotedString(key), ':', value]);
	        }
	      }
	    }

	    var ret = this.generateList(pairs);
	    ret.prepend('{');
	    ret.add('}');
	    return ret;
	  },

	  generateList: function generateList(entries) {
	    var ret = this.empty();

	    for (var i = 0, len = entries.length; i < len; i++) {
	      if (i) {
	        ret.add(',');
	      }

	      ret.add(castChunk(entries[i], this));
	    }

	    return ret;
	  },

	  generateArray: function generateArray(entries) {
	    var ret = this.generateList(entries);
	    ret.prepend('[');
	    ret.add(']');

	    return ret;
	  }
	};

	exports['default'] = CodeGen;
	module.exports = exports['default'];

/***/ })
/******/ ])
});
;
/**
* simplePagination.js v1.6
* A simple jQuery pagination plugin.
* http://flaviusmatis.github.com/simplePagination.js/
*
* Copyright 2012, Flavius Matis
* Released under the MIT license.
* http://flaviusmatis.github.com/license.html
*/

(function($){

	var methods = {
		init: function(options) {
			var o = $.extend({
				items: 1,
				itemsOnPage: 1,
				pages: 0,
				displayedPages: 5,
				edges: 2,
				currentPage: 0,
				useAnchors: true,
				hrefTextPrefix: '#page-',
				hrefTextSuffix: '',
				prevText: 'Prev',
				nextText: 'Next',
				ellipseText: '&hellip;',
				ellipsePageSet: true,
				cssStyle: 'light-theme',
				listStyle: '',
				labelMap: [],
				selectOnClick: true,
				nextAtFront: false,
				invertPageOrder: false,
				useStartEdge : true,
				useEndEdge : true,
				onPageClick: function(pageNumber, event) {
					// Callback triggered when a page is clicked
					// Page number is given as an optional parameter
				},
				onInit: function() {
					// Callback triggered immediately after initialization
				}
			}, options || {});

			var self = this;

			o.pages = o.pages ? o.pages : Math.ceil(o.items / o.itemsOnPage) ? Math.ceil(o.items / o.itemsOnPage) : 1;
			if (o.currentPage)
				o.currentPage = o.currentPage - 1;
			else
				o.currentPage = !o.invertPageOrder ? 0 : o.pages - 1;
			o.halfDisplayed = o.displayedPages / 2;

			this.each(function() {
				self.addClass(o.cssStyle + ' simple-pagination').data('pagination', o);
				methods._draw.call(self);
			});

			o.onInit();

			return this;
		},

		selectPage: function(page) {
			methods._selectPage.call(this, page - 1);
			return this;
		},

		prevPage: function() {
			var o = this.data('pagination');
			if (!o.invertPageOrder) {
				if (o.currentPage > 0) {
					methods._selectPage.call(this, o.currentPage - 1);
				}
			} else {
				if (o.currentPage < o.pages - 1) {
					methods._selectPage.call(this, o.currentPage + 1);
				}
			}
			return this;
		},

		nextPage: function() {
			var o = this.data('pagination');
			if (!o.invertPageOrder) {
				if (o.currentPage < o.pages - 1) {
					methods._selectPage.call(this, o.currentPage + 1);
				}
			} else {
				if (o.currentPage > 0) {
					methods._selectPage.call(this, o.currentPage - 1);
				}
			}
			return this;
		},

		getPagesCount: function() {
			return this.data('pagination').pages;
		},

		setPagesCount: function(count) {
			this.data('pagination').pages = count;
		},

		getCurrentPage: function () {
			return this.data('pagination').currentPage + 1;
		},

		destroy: function(){
			this.empty();
			return this;
		},

		drawPage: function (page) {
			var o = this.data('pagination');
			o.currentPage = page - 1;
			this.data('pagination', o);
			methods._draw.call(this);
			return this;
		},

		redraw: function(){
			methods._draw.call(this);
			return this;
		},

		disable: function(){
			var o = this.data('pagination');
			o.disabled = true;
			this.data('pagination', o);
			methods._draw.call(this);
			return this;
		},

		enable: function(){
			var o = this.data('pagination');
			o.disabled = false;
			this.data('pagination', o);
			methods._draw.call(this);
			return this;
		},

		updateItems: function (newItems) {
			var o = this.data('pagination');
			o.items = newItems;
			o.pages = methods._getPages(o);
			this.data('pagination', o);
			methods._draw.call(this);
		},

		updateItemsOnPage: function (itemsOnPage) {
			var o = this.data('pagination');
			o.itemsOnPage = itemsOnPage;
			o.pages = methods._getPages(o);
			this.data('pagination', o);
			methods._selectPage.call(this, 0);
			return this;
		},

		getItemsOnPage: function() {
			return this.data('pagination').itemsOnPage;
		},

		_draw: function() {
			var	o = this.data('pagination'),
				interval = methods._getInterval(o),
				i,
				tagName;

			methods.destroy.call(this);

			tagName = (typeof this.prop === 'function') ? this.prop('tagName') : this.attr('tagName');

			var $panel = tagName === 'UL' ? this : $('<ul' + (o.listStyle ? ' class="' + o.listStyle + '"' : '') + '></ul>').appendTo(this);

			// Generate Prev link
			if (o.prevText) {
				methods._appendItem.call(this, !o.invertPageOrder ? o.currentPage - 1 : o.currentPage + 1, {text: o.prevText, classes: 'prev'});
			}

			// Generate Next link (if option set for at front)
			if (o.nextText && o.nextAtFront) {
				methods._appendItem.call(this, !o.invertPageOrder ? o.currentPage + 1 : o.currentPage - 1, {text: o.nextText, classes: 'next'});
			}

			// Generate start edges
			if (!o.invertPageOrder) {
				if (interval.start > 0 && o.edges > 0) {
					if(o.useStartEdge) {
						var end = Math.min(o.edges, interval.start);
						for (i = 0; i < end; i++) {
							methods._appendItem.call(this, i);
						}
					}
					if (o.edges < interval.start && (interval.start - o.edges != 1)) {
						$panel.append('<li class="disabled"><span class="ellipse">' + o.ellipseText + '</span></li>');
					} else if (interval.start - o.edges == 1) {
						methods._appendItem.call(this, o.edges);
					}
				}
			} else {
				if (interval.end < o.pages && o.edges > 0) {
					if(o.useStartEdge) {
						var begin = Math.max(o.pages - o.edges, interval.end);
						for (i = o.pages - 1; i >= begin; i--) {
							methods._appendItem.call(this, i);
						}
					}

					if (o.pages - o.edges > interval.end && (o.pages - o.edges - interval.end != 1)) {
						$panel.append('<li class="disabled"><span class="ellipse">' + o.ellipseText + '</span></li>');
					} else if (o.pages - o.edges - interval.end == 1) {
						methods._appendItem.call(this, interval.end);
					}
				}
			}

			// Generate interval links
			if (!o.invertPageOrder) {
				for (i = interval.start; i < interval.end; i++) {
					methods._appendItem.call(this, i);
				}
			} else {
				for (i = interval.end - 1; i >= interval.start; i--) {
					methods._appendItem.call(this, i);
				}
			}

			// Generate end edges
			if (!o.invertPageOrder) {
				if (interval.end < o.pages && o.edges > 0) {
					if (o.pages - o.edges > interval.end && (o.pages - o.edges - interval.end != 1)) {
						$panel.append('<li class="disabled"><span class="ellipse">' + o.ellipseText + '</span></li>');
					} else if (o.pages - o.edges - interval.end == 1) {
						methods._appendItem.call(this, interval.end);
					}
					if(o.useEndEdge) {
						var begin = Math.max(o.pages - o.edges, interval.end);
						for (i = begin; i < o.pages; i++) {
							methods._appendItem.call(this, i);
						}
					}
				}
			} else {
				if (interval.start > 0 && o.edges > 0) {
					if (o.edges < interval.start && (interval.start - o.edges != 1)) {
						$panel.append('<li class="disabled"><span class="ellipse">' + o.ellipseText + '</span></li>');
					} else if (interval.start - o.edges == 1) {
						methods._appendItem.call(this, o.edges);
					}

					if(o.useEndEdge) {
						var end = Math.min(o.edges, interval.start);
						for (i = end - 1; i >= 0; i--) {
							methods._appendItem.call(this, i);
						}
					}
				}
			}

			// Generate Next link (unless option is set for at front)
			if (o.nextText && !o.nextAtFront) {
				methods._appendItem.call(this, !o.invertPageOrder ? o.currentPage + 1 : o.currentPage - 1, {text: o.nextText, classes: 'next'});
			}

			if (o.ellipsePageSet && !o.disabled) {
				methods._ellipseClick.call(this, $panel);
			}

		},

		_getPages: function(o) {
			var pages = Math.ceil(o.items / o.itemsOnPage);
			return pages || 1;
		},

		_getInterval: function(o) {
			return {
				start: Math.ceil(o.currentPage > o.halfDisplayed ? Math.max(Math.min(o.currentPage - o.halfDisplayed, (o.pages - o.displayedPages)), 0) : 0),
				end: Math.ceil(o.currentPage > o.halfDisplayed ? Math.min(o.currentPage + o.halfDisplayed, o.pages) : Math.min(o.displayedPages, o.pages))
			};
		},

		_appendItem: function(pageIndex, opts) {
			var self = this, options, $link, o = self.data('pagination'), $linkWrapper = $('<li></li>'), $ul = self.find('ul');

			pageIndex = pageIndex < 0 ? 0 : (pageIndex < o.pages ? pageIndex : o.pages - 1);

			options = {
				text: pageIndex + 1,
				classes: ''
			};

			if (o.labelMap.length && o.labelMap[pageIndex]) {
				options.text = o.labelMap[pageIndex];
			}

			options = $.extend(options, opts || {});

			if (pageIndex == o.currentPage || o.disabled) {
				if (o.disabled || options.classes === 'prev' || options.classes === 'next') {
					$linkWrapper.addClass('disabled');
				} else {
					$linkWrapper.addClass('active');
				}
				$link = $('<span class="current">' + (options.text) + '</span>');
			} else {
				if (o.useAnchors) {
					$link = $('<a href="' + o.hrefTextPrefix + (pageIndex + 1) + o.hrefTextSuffix + '" class="page-link">' + (options.text) + '</a>');
				} else {
					$link = $('<span >' + (options.text) + '</span>');
				}
				$link.click(function(event){
					return methods._selectPage.call(self, pageIndex, event);
				});
			}

			if (options.classes) {
				$link.addClass(options.classes);
			}

			$linkWrapper.append($link);

			if ($ul.length) {
				$ul.append($linkWrapper);
			} else {
				self.append($linkWrapper);
			}
		},

		_selectPage: function(pageIndex, event) {
			var o = this.data('pagination');
			o.currentPage = pageIndex;
			if (o.selectOnClick) {
				methods._draw.call(this);
			}
			return o.onPageClick(pageIndex + 1, event);
		},


		_ellipseClick: function($panel) {
			var self = this,
				o = this.data('pagination'),
				$ellip = $panel.find('.ellipse');
			$ellip.addClass('clickable').parent().removeClass('disabled');
			$ellip.click(function(event) {
				if (!o.disable) {
					var $this = $(this),
						val = (parseInt($this.parent().prev().text(), 10) || 0) + 1;
					$this
						.html('<input type="number" min="1" max="' + o.pages + '" step="1" value="' + val + '">')
						.find('input')
						.focus()
						.click(function(event) {
							// prevent input number arrows from bubbling a click event on $ellip
							event.stopPropagation();
						})
						.keyup(function(event) {
							var val = $(this).val();
							if (event.which === 13 && val !== '') {
								// enter to accept
								if ((val>0)&&(val<=o.pages))
								methods._selectPage.call(self, val - 1);
							} else if (event.which === 27) {
								// escape to cancel
								$ellip.empty().html(o.ellipseText);
							}
						})
						.bind('blur', function(event) {
							var val = $(this).val();
							if (val !== '') {
								methods._selectPage.call(self, val - 1);
							}
							$ellip.empty().html(o.ellipseText);
							return false;
						});
				}
				return false;
			});
		}

	};

	$.fn.pagination = function(method) {

		// Method calling logic
		if (methods[method] && method.charAt(0) != '_') {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method ' +  method + ' does not exist on jQuery.pagination');
		}

	};

})(jQuery);

$(document).ready(function () {
    var $navLink = $('.filter-web .nav-link');
    var $megamenu = $(".filter-web .megamenu");

    $megamenu.on("click", function (e) {
        e.stopPropagation();
    });

    if (!$navLink.hasClass('show')) {
        $megamenu.removeClass('show');
    }
    $(this).parent().addClass('show');

    $navLink.click(function () {
        $megamenu.slideUp();
        if ($(this).next('.filter-web .megamenu').is(':visible')) {
            $(this).next('.filter-web .megamenu').slideUp(500);
        } else {
            $(this).next('.filter-web .megamenu').slideDown(500);
        }
    });
    $('.sort-by-header').click(function () {
        $(this).next('.sort-by').slideToggle(500);
    });
});
/* pagination -- number of items per page */
var resultPagination = (function ($) {
    var rp = {};
    var i18n_next = Granite.I18n.get("next");
    var i18n_back = Granite.I18n.get("back");
    var viewAll = Granite.I18n.get("View All");
    var i18n_download = Granite.I18n.get("Download");

    var $filterWeb;
    var $resultGrid;
    var $resultProductGrid;
    var $filterWebInput;
    var fessQueryUrl;
    var type;
    var numPerPage = 30;
    // var sort = $(".filter-header-web #sortSearchOption").val();
    // var timestamp = $(".filter-header-web #asTimestamp").val();
    // var occt = $(".filter-header-web #asOcct").val();

    var urlKeyword;

    /**
     * page load search
     */
    rp.initialFetch = function (keyword) {
        if (keyword) {
            fessSearchProvider.doFessSearch({
                type: type,
                url: fessQueryUrl,
                keyword: keyword || urlKeyword,
                subcategory: null,
                pageNum: null,
                pageSize: numPerPage,
                callback: function (data) {
                    rp.refreshFilter(data);
                    rp.refreshResult(data);
                    rp.refreshPagination(data);
                    rp.bindSubcategoryClick(keyword || urlKeyword);
                    rp.renderNav();
                }
            });
            setQueryString("q", keyword);
        }
    };
    rp.refreshResult = function (data) {
        if (data.result.length === 0) {
            $('#query-result-wrapper').html($('#result-grid-empty-wrapper').html());
        } else {
            var tpl = $resultGrid.html();
            var results = [];
            var checkMode = loginUtil.notEditorOrPreviewMode();
            $(data.result).each(function (index, value) {
                if (this.host && this.url) {
                    var showUrl = this.url.split(this.host)[1];
                    if (!checkMode) {
                        showUrl = this.url.split(this.host)[1];
                        if (showUrl.endsWith('/')) {
                            showUrl = showUrl.substring(0, showUrl.length - 1);
                        }
                        showUrl = "/content/hikvision" + showUrl + ".html";
                    }
                    this.url = showUrl;
                }
                if (this.fess_title) {
                    this.url = this.url + "?q=" + replaceSpecialToMiddleline(this.fess_title) + "&position=" + (index + 1);
                }
                if (type) {
                    this.display = this[type];
                }
                this.download = i18n_download;
                results.push(this);

            });
            var template = Handlebars.compile(tpl);
            $('#query-result-wrapper').html(template(results));
        }
    };
    rp.htmlDecode = function (value) {
        return !value ? value : String(value).replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&quot;/g, '"').replace(/&amp;/g, "&");
    };
    rp.refreshPagination = function (data) {
        $("#layout-pagination-wrapper").pagination({
            items: data.record_count,
            itemsOnPage: data.page_size,
            cssStyle: "light-theme",
            currentPage: data.page_number,
            edges: 1,
            useAnchors: false,
            prevText: i18n_back,
            nextText: i18n_next,
            onPageClick: function (currentPageNumber) {
                var keyword = $filterWebInput.val();
                fessSearchProvider.doFessSearch({
                    type: type,
                    url: fessQueryUrl,
                    keyword: keyword || urlKeyword,
                    subcategory: $('#navbar').data('selected-subcategory'),
                    pageNum: (currentPageNumber - 1) * data.page_size,
                    pageSize: numPerPage,
                    callback: function (data) {
                        rp.refreshResult(data);
                        rp.refreshPagination(data);
                        rp.renderNav();
                    }
                });
            }
        });
        //$("#layout4-pagination").pagination('drawPage', data.page_number);
    };

    /**
     * refresh filter html
     * @param data
     */
    rp.refreshFilter = function (data) {
        data.viewAll = viewAll;
        var tpl = "nav-grid-template";
        $('#navbar .navbar-nav').html(tmpl(tpl, data));
    };

    /**
     * bind subcategory click
     */
    rp.bindSubcategoryClick = function (keyword) {
        $(".filter-web .navbar-nav .sub-item").click(function () {
            var $this = $(this);
            $this.toggleClass('active');
            var dataSubcategory = $this.attr('data-subcategory');
            var parentCategory = dataSubcategory.split('||')[0];

            // remove active
            keyword = $filterWebInput.val();
            if (!$this.hasClass('active')) {
                $(".navbar-nav .nav-link").removeClass('active');
                $this.removeClass('active');
                rp.initialFetch(keyword || urlKeyword);
            } else {
                $(".navbar-nav .sub-item.active").removeClass('active');
                $(".navbar-nav .nav-link.active").removeClass('active');
                $(".navbar-nav .nav-link[data-category='" + parentCategory + "']").addClass('active');
                $this.addClass('active');
                var subcategory = dataSubcategory;
                $('#navbar').data('selected-subcategory', subcategory);

                fessSearchProvider.doFessSearch({
                    type: type,
                    url: fessQueryUrl,
                    keyword: keyword || urlKeyword,
                    subcategory: subcategory,
                    pageNum: null,
                    pageSize: numPerPage,
                    callback: function (data) {
                        rp.refreshResult(data);
                        rp.refreshPagination(data);
                        rp.renderNav();
                    }
                });
            }
        });
    };

    rp.renderNav = function () {
        var $resultItemNav = $(".filter-search-result-en .search-result-item-nav-wrapper");
        var checkMode = loginUtil.notEditorOrPreviewMode();
        for (var index = 0; index < $resultItemNav.length; index++) {
            var item = $($resultItemNav[index]);
            var rootUrl = item.attr("data-root-url");
            var itemTitle = item.parent().find(".search-result-item-title .at-navigation").html();
            rootUrl = rootUrl.replace(".html", "/");
            var paths = rootUrl.split("?")[0].split("/");

            var path = "/" + paths[1] + "/";
            var endStr = "/";
            var startIndex = 2;
            if (!checkMode) {
                startIndex = 4;
                path = "/content/hikvision/" + paths[3] + "/";
                endStr = ".html";
            }
            for (var i = startIndex; i < paths.length - 1; i++) {
                var title = paths[i];
                if (!isNull(title)) {
                    path += paths[i];
                    var showPath = path + endStr;
                    path += "/";
                    if (i === paths.length - 2) {
                        title = itemTitle.replaceAll("\<strong\>", "").replaceAll("\</strong\>", "");
                        item.append('<a class="search-result-item-nav-link" href="' + showPath + '" aria-label="page-title-link">' + title + '</a> ');
                    } else {
                        title = title.replaceAll("-", " ");
                        item.append('<a class="search-result-item-nav-link" href="' + showPath + '" aria-label="page-title-link">' + title + '</a> <i class="search-result-item-nav-icon"></i>');
                    }
                }
            }
        }
    };

    rp.init = function () {
        $(document).ready(function () {
            if ($(".filter-web").length > 0) {
                $filterWeb = $(".filter-header-web");
                $filterWebInput = $(".filter-web .hiknow-search-input");
                $resultGrid = $("#result-grid-common-template");
                fessQueryUrl = $filterWeb.attr("data-search-page");
                type = $filterWeb.attr("data-type");

                urlKeyword = fessSearchProvider.urlParam("q");
                rp.initialFetch(urlKeyword);
            }
        });
    };
    return rp;
})
($);
resultPagination.init();

/*
 * JavaScript Templates
 * https://github.com/blueimp/JavaScript-Templates
 *
 * Copyright 2011, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * https://opensource.org/licenses/MIT
 *
 * Inspired by John Resig's JavaScript Micro-Templating:
 * http://ejohn.org/blog/javascript-micro-templating/
 */

/* global define */

/* eslint-disable strict */

;
(function ($) {
    'use strict'
    var monthsArray = {
        '0': Granite.I18n.get('January'),
        '1': Granite.I18n.get('February'),
        '2': Granite.I18n.get('March'),
        '3': Granite.I18n.get('April'),
        '4': Granite.I18n.get('May'),
        '5': Granite.I18n.get('June'),
        '6': Granite.I18n.get('July'),
        '7': Granite.I18n.get('August'),
        '8': Granite.I18n.get('September'),
        '9': Granite.I18n.get('October'),
        '10': Granite.I18n.get('November'),
        '11': Granite.I18n.get('December'),
    }   
    var cnMonthsArray = {
        '0': '1月',
        '1': '2月',
        '2': '3月',
        '3': '4月',
        '4': '5月',
        '5': '6月',
        '6': '7月',
        '7': '8月',
        '8': '9月',
        '9': '10月',
        '10': '11月',
        '11': '12月',
    }   
    var tmpl = function (str, data) {
        var f = !/[^\w\-.:]/.test(str) ? (tmpl.cache[str] = tmpl.cache[str] || tmpl(tmpl.load(str))) : new Function( // eslint-disable-line
            // no-new-func
            tmpl.arg + ',tmpl', 'var _e=tmpl.encode' + tmpl.helper + ",_s='" + str.replace(tmpl.regexp, tmpl.func)
        + "';return _s;")
      //  中文站日期格式修改
        if (data && data.dataArray && (window.location.href.indexOf('/cn')>-1)) {
            for (var index = 0; index <  data.dataArray.length; index++) {
                if(data.dataArray[index].newsDate){
                    var currentDateText = new Date(data.dataArray[index].newsDate)
                    var currentDate = currentDateText.getDate()
                    var currentMonth = cnMonthsArray[currentDateText.getMonth()]
                    var currentYear = currentDateText.getFullYear()
                    data.dataArray[index].newsDate = currentYear+"年"+currentMonth+currentDate+"日"
                }
            }

        }
        return data ? f(data, tmpl) : function (data) {
            return f(data, tmpl)
        }
    }
    tmpl.cache = {}
    tmpl.load = function (id) {
        return document.getElementById(id).innerHTML
    }
    tmpl.regexp = /([\s'\\])(?!(?:[^{]|\{(?!%))*%\})|(?:\{%(=|#)([\s\S]+?)%\})|(\{%)|(%\})/g
    tmpl.func = function (s, p1, p2, p3, p4, p5) {
        if (p1) {
            // whitespace, quote and backspace in HTML context
            return ({
                '\n': '\\n',
                '\r': '\\r',
                '\t': '\\t',
                ' ': ' '
            }[p1] || '\\' + p1)
        }
        if (p2) {
            // interpolation: {%=prop%}, or unescaped: {%#prop%}
            if (p2 === '=') {
                return "'+_e(" + p3 + ")+'"
            }
            return "'+(" + p3 + "==null?'':" + p3 + ")+'"
        }
        if (p4) {
            // evaluation start tag: {%
            return "';"
        }
        if (p5) {
            // evaluation end tag: %}
            return "_s+='"
        }
    }
    tmpl.encReg = /[<>&"'\x00]/g // eslint-disable-line no-control-regex
    tmpl.encMap = {
        '<': '&lt;',
        '>': '&gt;',
        '&': '&amp;',
        '"': '&quot;',
        "'": '&#39;'
    }
    tmpl.encode = function (s) {
        // eslint-disable-next-line eqeqeq
        return (s == null ? '' : '' + s).replace(tmpl.encReg, function (c) {
            return tmpl.encMap[c] || ''
        })
    }
    tmpl.arg = 'o'
    tmpl.helper = ",print=function(s,e){_s+=e?(s==null?'':s):_e(s);}" + ',include=function(s,d){_s+=tmpl(s,d);}'
    if (typeof define === 'function' && define.amd) {
        define(function () {
            return tmpl
        })
    } else if (typeof module === 'object' && module.exports) {
        module.exports = tmpl
    } else {
        $.tmpl = tmpl
    }
})(this)

$(document)
  .ready(
    function () {
      var $filter = $("#filter-attribute");
      var filterName = $filter.attr("data-filter-type");
      var isJobOpportunitiesFilter = filterName === 'jobOpportunities';
      var originalJSON;
      var currentFilters = {};
      var resultFunction;
      var json = [];
      var i18n_next = Granite.I18n.get("next");
      var i18n_back = Granite.I18n.get("back");
      var currentBreakPoint = getCurrentBreakPoint();
      if (filterName) {
        var baseUrl = $filter.attr("data-baseUrl");
        resultFunction = function (baseUrl, filterName) {
          if (baseUrl && filterName) {
            $.ajax({
              type: "GET",
              url: baseUrl + "." + filterName + ".json",
              success: function (data) {
                if (data && data.content) {
                  originalJSON = data;
                  filterSelector(data);
                  // JSON.parse(JSON.stringify(data))
                 htmlFunc(JSON.parse(JSON.stringify(data)));
                 numberofItemsPerPage(data.content.resultsPerPage);
                }
              },
            });
          }
        }
        resultFunction(baseUrl, filterName);
      }

      var appendFilteredTag = function (filteredTagArray, filterItem, filterKey, filterVal) {
        var filteredTag = $('<button data-value ="'
          + filterVal
          + '" data-key="'
          + filterKey
          + '" class="btn-products btn">'
          + filterVal
          + '<img class="close-btn close-btn-filter" src="/etc/clientlibs/it/resources/icons/baseline-close-24px.svg" alt="Close"></button>');
        filteredTagArray.push(filteredTag);
        // when an item in the filtered tag cloud is
        // clicked, that particular filter will be
        // removed
        filteredTag.on('click', function () {
          filteredTag.remove();
          $('.sub-category', filterItem).removeClass('selectedFilter');
          // remove filter from
          // currentFilters Object
          var filterCopy = currentFilters;
          for (var i = 0; i < filterCopy[filterKey].length; i++) {
            if (currentFilters[filterKey][i] === filterVal) {
              currentFilters[filterKey].splice(i, 1);
            }
          }
          filterCopy = null;
          // refresh the UI
          refreshSearchResults();
        });
        $(".filterTagContainer").append(filteredTag);
      };

        function jsonSort(jsonObj) {
            var arr = [];
            for (var key in jsonObj) {
                arr.push(key)
            }
            arr.sort();
            var result = {};

            arr.forEach(function (value, index) {
                result[value] = jsonObj[value];
            });
            return result;
        }
      var filterSelector = function (data) {
        // var obj = data.content.data.filter;
        var mainData = data.content.data.filter
        if(data.content.data.filter.hasOwnProperty('year') && data.content.data.filter.year.length){
          mainData.year.sort().reverse()
        }
        var obj = mainData;
        var keyLength = 0;
        var filterHTML = $(".filterContainer");
        if(!isJobOpportunitiesFilter){
          filterHTML
          .append('<nav class="navbar navbar-expand-lg navbar-light bg-light rounded filter-dropdown-nav"><div class= "filterIconCont"><img class="filter-icon" src="/etc/clientlibs/it/resources/icons/icon-filter-white.svg" alt="filter-icon" /><a class="navbar-brand" href="#">' + Granite.I18n.get("Filter by") + '</a></div><button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbar" aria-controls="navbars" aria-expanded="false" aria-label="Toggle navigation"><span class="navbar-toggler-icon"></span></button><div class="resetAll resetAllMob">' + Granite.I18n.get("Reset") + '</div><div class="collapse navbar-collapse" id="navbar"><ul class="navbar-nav mr-auto"></ul></div><div class="resetAll resetAllWeb">' + Granite.I18n.get("Reset") + '</div></nav><div class ="filterTagContainer" ></div>');
        }else{
          filterHTML.html(tmpl("tmpl-job-opportunities-nav", obj));
        }

        $('.resetAll', filterHTML).on('click', function () {
          $(".filterTagContainer").empty();
          $.each(currentFilters, function (key, val) {
            currentFilters[key] = [];
          })
          $('.selectedFilter', filterHTML).removeClass('selectedFilter');
          if (isJobOpportunitiesFilter) {
            $('.search-form-input').val('');
          }
          refreshSearchResults();
        });

          if (filterName === 'support-assets') {
              $.each(obj, function (key, value) {
                  // if filter have no items we do not add this filter
                  if (value) {
                      var str = value.filterTopic;
                      if (str) {
                          str = str.replace(/_/g, " ");
                      }
                      var filteredTagArray = [];
                      var navItem = $('<li class="nav-item dropdown megamenu-li"><a class="nav-link dropdown-toggle at-topic" data-at-module="'
                          + filterName + atModel.atSpliter + Granite.I18n.get(str)
                          + '" id="dropdown01" href="javaScript:void(0);" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'
                          + Granite.I18n.get(str)
                          + '</a><div class="dropdown-menu megamenu" id="'
                          + str.replace(/ /g, '-').replace("/", '-')
                          + '" aria-labelledby="dropdown01"><div class="sub-category allBtn at-topic" data-at-module="' + filterName + '::all">' + Granite.I18n.get('all') + '</div><ul></ul></div></li>');

                      filterHTML.find("#navbar>ul").append(navItem);

                      navItem.find('.allBtn').on('click', function (e) {
                          currentFilters[str] = [];
                          filteredTagArray.forEach(function (fTag) {
                              fTag.remove();
                          });
                          navItem.find('.selectedFilter').removeClass('selectedFilter');
                          refreshSearchResults();
                      });

                      keyLength = value.filterItem.length;
                      for (var i = 0; i < keyLength; i++) {
                          (function () {
                              var filterKey = value.filterTopic, filterVal = value.filterItem[i].filterTopic;
                              var filterItem = $('<li><div class="sub-category at-topic" data-at-module="' + filterName + atModel.atSpliter + Granite.I18n.get(str) + atModel.atSpliter + filterVal + '">' + filterVal
                                  + "</div></li>");
                              currentFilters[filterKey] = [];
                              filterItem.on('click', function (e) {
                                  if (!$('.sub-category', this).hasClass('selectedFilter')) {
                                      if (isJobOpportunitiesFilter) {
                                          // clear all filter items in this filter
                                          filterItem.parents(".dropdown-menu.megamenu.show").find('.sub-category').removeClass("selectedFilter");
                                          $('.sub-category', this).addClass('selectedFilter');
                                          // single selection
                                          currentFilters[filterKey] = [filterVal];
                                          refreshSearchResults();
                                          // remove the previously selected filter item
                                          $('.filterContainer').find("button[data-key ='" + filterKey + "']").remove();
                                          appendFilteredTag(filteredTagArray, filterItem, filterKey, filterVal);
                                          return;
                                      }

                                      $('.sub-category', this).addClass('selectedFilter');
                                      currentFilters[filterKey].push(filterVal);
                                      refreshSearchResults();
                                      appendFilteredTag(filteredTagArray, filterItem, filterKey, filterVal);
                                  } else {
                                      $('.filterContainer').find("button[data-value ='" + filterVal + "']").remove();
                                      $(".sub-category", filterItem).removeClass("selectedFilter");
                                      // remove filter from
                                      // currentFilters Object
                                      var filterCopy = currentFilters;
                                      for (var i = 0; i < filterCopy[filterKey].length; i++) {
                                          if (currentFilters[filterKey][i] === filterVal) {
                                              currentFilters[filterKey].splice(i, 1);
                                          }
                                      }
                                      filterCopy = null;

                                      $(".sub-category", this).removeClass("selectedFilter");
                                      var index = currentFilters[filterKey].indexOf(filterVal);
                                      if (index >= 0) {
                                          currentFilters[filterKey].splice(index, 1);
                                      }
                                      refreshSearchResults();
                                  }
                              });
                              filterHTML.find("#" + filterKey.replace(/ /g, '-').replace("/", '-') + ">ul").append(
                                  filterItem);
                          })();
                      }
                      keyLength = 0;
                  }
              });
          }else if(filterName === 'jobOpportunities'){
              $.each($('.navbar .nav-item'), function (index,item) {
                var filterKey = $(this).attr('data-key');
                if(index == 0){
                  $(this).removeClass('collapsed');
                }
                $(this).find('.sub-category').on('click',function(){
                  $(this).addClass('selectedFilter').siblings().removeClass('selectedFilter')
                  var filterVal = $(this).attr('data-value')
                  currentFilters[filterKey] = [filterVal];
                  if(currentBreakPoint === 'DESKTOP'){
                    refreshSearchResults();
                  }
                })
  
                $(this).find('.allBtn').on('click', function (e) {
                  delete currentFilters[filterKey];
                  $(this).addClass('selectedFilter').siblings().removeClass('selectedFilter')
                  if(currentBreakPoint === 'DESKTOP'){
                    refreshSearchResults();
                  }
                });
              });

              if(currentBreakPoint === 'MOBILE'){
                var $navbarMob = filterHTML.find('.navbar')
                $navbarMob.find('.filter-bar-mob').on('click',function(){
                  $navbarMob.find('.nav-wrap').show()
                })
                $navbarMob.find('.submit').on('click',function(){
                  $navbarMob.find('.nav-wrap').hide();
                  !$.isEmptyObject(currentFilters) ? $navbarMob.find('.filter-bar-mob').addClass('active') : $navbarMob.find('.filter-bar-mob').removeClass('active');
                  refreshSearchResults();
                })
                $navbarMob.find('.close-btn').on('click',function(){
                  $navbarMob.find('.nav-wrap').hide();
                })
                $navbarMob.find('.reste').on('click',function(){
                  currentFilters = {};
                  $navbarMob.find('.allBtn').click();
                  $navbarMob.find('.nav-item:first-child').removeClass('collapsed').siblings().addClass('collapsed')
                })
                $navbarMob.find('.nav-title').on('click',function(){
                  $(this).parent().toggleClass('collapsed')
                })
              }

          }else {
              if (filterName === 'download-pages') {
                  obj = jsonSort(obj);
              }
              $.each(obj, function (key, value) {
                  // if filter have no items we do not add this filter
                  if (value.length > 0) {
                      var str = key;
                      str = str.replace(/_/g, " ");
                      var filteredTagArray = [];
                      var navItem = $('<li class="nav-item dropdown megamenu-li"><a class="nav-link dropdown-toggle at-topic" data-at-module="'
                          + filterName + atModel.atSpliter + Granite.I18n.get(str)
                          + '" id="dropdown01" href="javaScript:void(0);" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'
                          + Granite.I18n.get(str)
                          + '</a><div class="dropdown-menu megamenu" id="'
                          + key.replace(/ /g, '-').replace("/", '-')
                          + '" aria-labelledby="dropdown01"><div class="sub-category allBtn at-topic" data-at-module="' + filterName + '::all">' + Granite.I18n.get('all') + '</div><ul></ul></div></li>');

                      filterHTML.find("#navbar>ul").append(navItem);

                      navItem.find('.allBtn').on('click', function (e) {
                          currentFilters[key] = [];
                          filteredTagArray.forEach(function (fTag) {
                              fTag.remove();
                          });
                          navItem.find('.selectedFilter').removeClass('selectedFilter');
                          refreshSearchResults();
                      });

                      keyLength = value.length;
                      for (var i = 0; i < keyLength; i++) {
                          (function () {
                              var filterKey = key, filterVal = value[i];
                              var filterItem = $('<li><div class="sub-category at-topic" data-at-module="' + filterName + atModel.atSpliter + Granite.I18n.get(str) + atModel.atSpliter + value[i] + '">' + value[i]
                                  + "</div></li>");
                              currentFilters[filterKey] = [];
                              filterItem.on('click', function (e) {
                                  if (!$('.sub-category', this).hasClass('selectedFilter')) {
                                      if (isJobOpportunitiesFilter) {
                                          // clear all filter items in this filter
                                          filterItem.parents(".dropdown-menu.megamenu.show").find('.sub-category').removeClass("selectedFilter");
                                          $('.sub-category', this).addClass('selectedFilter');
                                          // single selection
                                          currentFilters[filterKey] = [filterVal];
                                          refreshSearchResults();
                                          // remove the previously selected filter item
                                          $('.filterContainer').find("button[data-key ='" + filterKey + "']").remove();
                                          appendFilteredTag(filteredTagArray, filterItem, filterKey, filterVal);
                                          return;
                                      }

                                      $('.sub-category', this).addClass('selectedFilter');
                                      currentFilters[filterKey].push(filterVal);
                                      refreshSearchResults();
                                      appendFilteredTag(filteredTagArray, filterItem, filterKey, filterVal);
                                  } else {
                                      $('.filterContainer').find("button[data-value ='" + filterVal + "']").remove();
                                      $(".sub-category", filterItem).removeClass("selectedFilter");
                                      // remove filter from
                                      // currentFilters Object
                                      var filterCopy = currentFilters;
                                      for (var i = 0; i < filterCopy[filterKey].length; i++) {
                                          if (currentFilters[filterKey][i] === filterVal) {
                                              currentFilters[filterKey].splice(i, 1);
                                          }
                                      }
                                      filterCopy = null;

                                      $(".sub-category", this).removeClass("selectedFilter");
                                      var index = currentFilters[filterKey].indexOf(filterVal);
                                      if (index >= 0) {
                                          currentFilters[filterKey].splice(index, 1);
                                      }
                                      refreshSearchResults();
                                  }
                              });
                              filterHTML.find("#" + key.replace(/ /g, '-').replace("/", '-') + ">ul").append(
                                  filterItem);
                          })();

                      }
                      keyLength = 0;
                  }
              });
          }
        if (isJobOpportunitiesFilter) {
          var searchItem = $('.search-form-container')
          searchItem.find('.search-form-submit').on('click', function (e) {
            e.preventDefault();
            refreshSearchResults();
          });
        }
      };
      var monthsArray = {
        '0': Granite.I18n.get('January'),
        '1': Granite.I18n.get('February'),
        '2': Granite.I18n.get('March'),
        '3': Granite.I18n.get('April'),
        '4': Granite.I18n.get('May'),
        '5': Granite.I18n.get('June'),
        '6': Granite.I18n.get('July'),
        '7': Granite.I18n.get('August'),
        '8': Granite.I18n.get('September'),
        '9': Granite.I18n.get('October'),
        '10': Granite.I18n.get('November'),
        '11': Granite.I18n.get('December'),
    } 
    var JudgeWebLanguage = function(name) {
      var reg = eval("/" + name + "/g");
      var r = window.location.pathname.substr(1);
      var flag = reg.test(r);
      if (flag) {
          return true;
      } else {
          return false;
      }
    }
      // add all the filter names here
      var htmlFunc = function (d) {
        var assetsTmplId = ($('.articleList').data('show-agreement') ? "tmpl-assets-download-agreement" : "tmpl-assets");
        if (filterName === "event") {
          document.getElementById("article-press-pagination").innerHTML = tmpl("tmpl-events",
            d.content.data);
          $('.layout1-content-wrapper .link-learn-header.event-link-btn').on('click', function () {
            var url = $(this).data('url');
            if (url) {
              window.location = url;
            }
          });
          $('.layout1-content-wrapper .link-learn-header.event-link-btn .buttons-wrapper').on('click', function (e) {
            e.stopPropagation()
          });
        } else if (filterName === "success-story") {
          document.getElementById("article-press-pagination").innerHTML = tmpl("tmpl-success-story",
            d.content.data);
              // 埋点处理
              $('.image-container-link').on('click', function(e){
                var atModule ='article-listing::'+$(this).data('title')+"::" + lastNode($(this).attr('data-href')) + atModel.atSpliter + window.location.href.replace('#download-agreement','')
                atModel.doAtEvent(atModule , 'download', e); 
              })
        } else if (filterName === "blog") {
          document.getElementById("article-press-pagination").innerHTML = tmpl("tmpl-blog-press",
            d.content.data);
        } else if (filterName === "news") {
          document.getElementById("article-press-pagination").innerHTML = tmpl("tmpl-news",
            d.content.data);
            $.each($('.tile-lists .item .details'), function(index, item){
              var date = $(this).attr('data-date')
              // 判断是否返回中文字符
              var testCn = /[\u4e00-\u9fa5]/  
              if(date && !testCn.test(date)){
                var currentDateText = new Date(date)
                var currentDate = currentDateText.getDate()
                var currentMonth = monthsArray[currentDateText.getMonth()]
                var currentYear = currentDateText.getFullYear()
                if(JudgeWebLanguage('gongyi')){ //判断是否为海康公益网站
                  $(this).text(currentYear+'年'+ ' ' + currentMonth + ' ' + currentDate + '日')
                } else {
                 // $(this).text(currentYear+'年'+ ' ' + currentMonth + ' ' + currentDate + '日')
                  $(this).text(currentMonth+' '+currentDate+", "+currentYear)
                }
              }
              // if(date&&date.indexOf('T') !==-1){
              //   $(this).text(date.slice(0, date.indexOf('T')))
              // }
            })
        } else if (filterName === "solutions") {
          document.getElementById("article-press-pagination").innerHTML = tmpl("tmpl-solutions",
            d.content.data);
        } else if (filterName === "introduction") {
          document.getElementById("article-press-pagination").innerHTML = tmpl("tmpl-introduction",
            d.content.data);
        } else if (filterName === "press-mentions") {
          var dataArray = d.content.data.dataArray;
          dataArray.forEach(function (value, i) {
            var lang = $("[lang]").attr("lang");
            if (lang == "ar") {
              lang = "en";
            }
            var date = new Date(value.pressDate);
            dataArray[i].pressDate = date.toLocaleDateString(lang);
          });
          d.content.data.dataArray = dataArray;
          document.getElementById("article-press-pagination").innerHTML = tmpl("tmpl-press-mentions",
            d.content.data);
        } else if (filterName === 'download-pages') {
          document.getElementById("article-press-pagination").innerHTML = tmpl(assetsTmplId,
            d.content.data);

          downloadCheckLogin();
        } else if (filterName === 'support-assets') {
          document.getElementById("article-press-pagination").innerHTML = tmpl(assetsTmplId,
            d.content.data);
          downloadCheckLogin();
        } else if (isJobOpportunitiesFilter) {
          if(currentBreakPoint === 'DESKTOP'){
            document.getElementById("article-press-pagination").innerHTML = tmpl("tmpl-job-opportunities",d.content.data);
            updateDesktopPagination($('.pagination-container.article-new-style'));
          }else{
            document.getElementById("article-press-pagination-mob").innerHTML = tmpl("tmpl-job-opportunities-mob",d.content.data);
            updateMobileList($('.pagination-container.article-new-style'));
          }
          $('tbody#article-press-pagination tr , #article-press-pagination-mob .result-item').on('click', function () {
            var url = $(this).data('url');
            if (url) {
              window.location = url;
            }
          });
        } else if (filterName === "zoom") {
          document.getElementById("article-press-pagination").innerHTML = tmpl("tmpl-zoom",
            d.content.data);
        }
        $.each($('.layout1-content-wrapper .link-learn-header .buttons-wrapper'), function(index, item){
          $(this).find('.i18n-text').text(Granite.I18n.get($(this).find('.i18n-text').text().trim()))
        })
      };
      var downloadCheckLogin = function () {
        var downloadLinks = $('#article-press-pagination .layout3-content-wrapper .links-source a');
        if ($('.articleList').data('show-agreement')) {
          downloadLinks = $('#article-press-pagination .layout3-content-wrapper .links-source a.download-agreement-link');
        }
        $.each(downloadLinks, function (key, val) {
          var btnUrlOrg = $(val).attr('href');
          var btnUrl = btnUrlOrg;
          btnUrl = header.checkLoginStatusForDownload(btnUrl, $('.articleList'), val);
          $(val).attr('href', btnUrl);
          if (btnUrl !== '#download-agreement') {
            $(val).removeAttr('data-toggle');
            $(val).removeClass('at-action');
            if (btnUrl == btnUrlOrg) {
              $(val).removeClass('at-exit');
              $(val).addClass('at-download');
            } else if (btnUrl.toLowerCase().indexOf("javascript")>=0) {
                $(val).removeClass('at-exit');
                $(val).addClass('at-download');
            } else {
                $(val).removeClass('at-download');
                $(val).addClass('at-exit');
            }
          } else {
            $(val).removeClass('at-exit');
            $(val).addClass('at-download');
          }
        });
      };
      var numberofItemsPerPage = function (count) {
        if($(".pagination-container").hasClass('.article-new-style')){
          return
        }
        var $resultgridLayout4wrapper = $(".pagination-container");
        $resultgridLayout4wrapper.find(".holder").jPages({
          containerID: "article-press-pagination",
          perPage: count,
          previous: i18n_back,
          next: i18n_next,
          keyBrowse: true,
          animation: "slideInRight"
        });
        var $articleList = $('#article-press-pagination');
        $articleList.find('.lazy').lazyload();
      };

      function getFilteredData() {

        var copiedJSON = JSON.parse(JSON.stringify(originalJSON));

        var filteredData = copiedJSON.content.data.dataArray.filter(function (dataItem) {
          var dataItemFiltered = true;
          $.each(currentFilters, function (seletedFilterName, seletedFilterTags) {
            if (seletedFilterTags.length > 0) {
              if (dataItem['tags'][seletedFilterName]) {
                var dataItemFilters = dataItem['tags'][seletedFilterName];
                var filterTagPass = false;
                seletedFilterTags.forEach(function (selectedFilter) {
                  if (dataItemFilters.includes(selectedFilter)) {
                    filterTagPass = true;
                  }
                });
                if (dataItemFiltered) {
                  dataItemFiltered = filterTagPass;
                }
              } else {
                dataItemFiltered = false;
              }
            }
          });
          return dataItemFiltered;
        });

        var $searchFormInput = $('.search-form-input');
        var searchValue = $searchFormInput.val();
        if (isJobOpportunitiesFilter && searchValue) {
          var formattedSearchValue = searchValue.trim().toUpperCase();
          filteredData = filteredData.filter(function (item) {
            var positions = item.positions.toUpperCase();
            var functionVal = item['function'].toUpperCase();
            var regionCountry = item.regionCountry.toUpperCase();
            var applicationDeadline = item.applicationDeadline.toUpperCase();
            return positions.indexOf(formattedSearchValue) > -1
              || functionVal.indexOf(formattedSearchValue) > -1
              || regionCountry.indexOf(formattedSearchValue) > -1
              || applicationDeadline.indexOf(formattedSearchValue) > -1;
          });
        }
        copiedJSON.content.data.dataArray = filteredData;
        return copiedJSON;
      }

      function refreshSearchResults() {
        var filteredData = getFilteredData();
        // console.log(filteredData, currentFilters, 'UI data');
        htmlFunc(filteredData);
        numberofItemsPerPage(filteredData.content.resultsPerPage);
        updateDesktopPagination($('.pagination-container.article-new-style'));
      }

      function updateMobileList($comp) {
          destroyPagination($comp);
          $comp.find('#article-press-pagination-mob .result-item:lt(10)').addClass('mobile-active')
          $('.view-more-mob').on('click',function(){
            var $itemNoActive = $comp.find('#article-press-pagination-mob .result-item:not(.mobile-active):lt(10)');
            $itemNoActive.addClass('mobile-active');
            $comp.find('#article-press-pagination-mob .result-item:not(.mobile-active)').length == '0' ? $comp.find('.view-more-mob').hide() : $comp.find('.view-more-mob').show() ;
          })
          $comp.find('#article-press-pagination-mob .result-item').length <= 10 ? $comp.find('.view-more-mob').hide() : $comp.find('.view-more-mob').show() ; 
      }

      function destroyPagination($comp) {
          var $pagination = $comp.find('.pagination-section');
          if($pagination.hasClass('pagination-initialized')) {
              $pagination.jPages('destroy');
              $pagination.removeClass('pagination-initialized');
          }
      }

      function updateDesktopPagination($comp) {
        if(!$(".pagination-container").hasClass('article-new-style')){
          return
        }
          var containerID = $comp.find('.accordion').attr('id');
          var $pagination = $comp.find('.pagination-section');
          var perPage = parseInt($pagination.attr('data-num'));
          destroyPagination($comp);
          $pagination.jPages({
              containerID: containerID,
              perPage: perPage,
              previous: "",
              next: "",
              keyBrowse: true,
              animation: "slideInRight",
          });
          $pagination.addClass('pagination-initialized');
          paginationBindEvent($comp);
          $comp.find('.job-opportunities .result-item').length <= 10 ? $comp.find('.job-opportunities-pagination').hide() : $comp.find('.job-opportunities-pagination').show() ;   
      }

      function paginationBindEvent($comp){
        $comp.find('.item-num-for-page select.number-select').selectpicker({});
        $comp.find('.item-num-for-page select.number-select').on('changed.bs.select', function() {
            var numberVal = $(this).val();
            $comp.find('.pagination-section').attr('data-num', numberVal);
            updateDesktopPagination($comp);
        });
      }      
    });

var events = (function ($) {
	var events = {};

	events.init = function () {
		$(document).ready(function () {
			// For truncate
			// var module = document.querySelector('.events__image-info--sessions .events__image-info--sessions-description');
			//  $clamp(module, {clamp: 3});

			// Global variable

			var eventsCarouselWrapper = $('.events-carousel-wrapper');

			// Dynamically generate carousel items and indicators.
			var items = $(eventsCarouselWrapper).find('.carousel-inner  .events__image-container-parent');
			var carouselId = $(eventsCarouselWrapper).find('.carousel').attr('id');
			var slideCount = -1;

			for (var i = 0; i < items.length; i += 3) {
				slideCount++;
				items.slice(i, i + 3).wrapAll('<div class="carousel-item"></div>');

				if (i === 0) {
					$(eventsCarouselWrapper).find('.carousel-indicators').append('<li data-target="#' + carouselId + '" data-slide-to="' + slideCount + '" class="active"></li>');
				} else {
					$(eventsCarouselWrapper).find('.carousel-indicators').append('<li data-target="#' + carouselId + '" data-slide-to="' + slideCount + '"></li>');
				}
			}
			$(eventsCarouselWrapper).find('.carousel-inner .carousel-item:first-child').addClass('active');


			// For carousel slide
			var eventsCarousel = $(eventsCarouselWrapper).find(".desktop-tab-view");
			for (var i = 0; i < eventsCarousel.length; i++) {
				var carouselItemsLength = $(eventsCarousel[i]).find(".carousel-item").length;
				if (carouselItemsLength == 1) {
					$(eventsCarousel[i]).find(".carousel-indicators").hide();
				} else {
					$(eventsCarousel[i]).find(".carousel-indicators").show();
				}
			}

			// Card-info animation
			$(eventsCarouselWrapper).find(".events__image-info--sessions-description").hide();
			$(eventsCarouselWrapper).find(".desktop-tab-view .events__image-container-parent").on("mouseover", function (e) {
				$(this).addClass('hover');
				$(this).find('.events__image-container').addClass('hover');
				if (!$(this).find(".events__image-info--sessions-description").is(":empty") && $.trim($(this).find(".events__image-info--sessions-description").text()) != "") {
					$(this).find(".events__image-info--sessions-description").show();
				}
			});

			$(eventsCarouselWrapper).find(".desktop-tab-view .events__image-container-parent").on("mouseleave", function (e) {
				$(this).removeClass('hover');
				$(this).find('.events__image-container').removeClass('hover');

				if (!$(this).find(".events__image-info--sessions-description").is(":empty") && $.trim($(this).find(".events__image-info--sessions-description").text()) != "") {
					$(this).find(".events__image-info--sessions-description").hide();
				}
			});

			var module = document.querySelector('.events__image-info .events__image-info--sessions-description');
			if (module) {
				$clamp(module, { clamp: 5 });
			}
			var currentDom = $('.events__image-info--booth')
			currentDom.each(function (i) {
				var startMonth = ""
				var endMonth = ""
				switch ($(this).attr('data-startMonth')) {
					case "Jan":
						startMonth = 1
						break;
					case "Feb":
						startMonth = 2
						break;
					case "Mar":
						startMonth = 3
						break;
					case "Apr":
						startMonth = 4
						break;
					case "May":
						startMonth = 5
						break;
					case "Jun":
						startMonth = 6
						break;
					case "Jul":
						startMonth = 7
						break;
					case "Aug":
						startMonth = 8
						break;
					case "Sep":
						startMonth = 9
						break;
					case "Oct":
						startMonth = 10
						break;
					case "Now":
						startMonth = 11
						break;
					case "Dec":
						startMonth = 12
						break;
					default:
						break;
				}
				switch ($(this).attr('data-endMonth')) {
					case "Jan":
						endMonth = 1
						break;
					case "Feb":
						endMonth = 2
						break;
					case "Mar":
						endMonth = 3
						break;
					case "Apr":
						endMonth = 4
						break;
					case "May":
						endMonth = 5
						break;
					case "Jun":
						endMonth = 6
						break;
					case "Jul":
						endMonth = 7
						break;
					case "Aug":
						endMonth = 8
						break;
					case "Sep":
						endMonth = 9
						break;
					case "Oct":
						endMonth = 10
						break;
					case "Now":
						endMonth = 11
						break;
					case "Dec":
						endMonth = 12
						break;
					default:
						break;
				}
				if (window.location.href.indexOf('/cn') > -1) {
                    $(this).html("<span>" + $(this).attr('data-startYear') + "年" + startMonth + "月" + $(this).attr('data-startDay') + "日" + "</span><span> - </span><span>" + $(this).attr('data-startYear') + "年" + endMonth + "月" + $(this).attr('data-startDay') + "日" + "</span>")
				} else {
					$(this).html("<span>" + $(this).attr('data-startMonth') + $(this).attr('data-startDay') + "," + $(this).attr('data-startYear') + "</span><span> - </span><span>" + $(this).attr('data-endMonth') + $(this).attr('data-endDay') + "," + $(this).attr('data-endYear') + "</span>")
				}
			})
			var currentDomModel = $('.events-mobile-view__image-info--booth')
			currentDomModel.each(function (i) {
				var startMonth = ""
				var endMonth = ""
				switch ($(this).attr('data-startMonth')) {
					case "Jan":
						startMonth = 1
						break;
					case "Feb":
						startMonth = 2
						break;
					case "Mar":
						startMonth = 3
						break;
					case "Apr":
						startMonth = 4
						break;
					case "May":
						startMonth = 5
						break;
					case "Jun":
						startMonth = 6
						break;
					case "Jul":
						startMonth = 7
						break;
					case "Aug":
						startMonth = 8
						break;
					case "Sep":
						startMonth = 9
						break;
					case "Oct":
						startMonth = 10
						break;
					case "Now":
						startMonth = 11
						break;
					case "Dec":
						startMonth = 12
						break;
					default:
						break;
				}
				switch ($(this).attr('data-endMonth')) {
					case "Jan":
						endMonth = 1
						break;
					case "Feb":
						endMonth = 2
						break;
					case "Mar":
						endMonth = 3
						break;
					case "Apr":
						endMonth = 4
						break;
					case "May":
						endMonth = 5
						break;
					case "Jun":
						endMonth = 6
						break;
					case "Jul":
						endMonth = 7
						break;
					case "Aug":
						endMonth = 8
						break;
					case "Sep":
						endMonth = 9
						break;
					case "Oct":
						endMonth = 10
						break;
					case "Now":
						endMonth = 11
						break;
					case "Dec":
						endMonth = 12
						break;
					default:
						break;
				}
				if (window.location.href.indexOf('/cn') > -1) {
                    $(this).html("<span>" + $(this).attr('data-startYear') + "年" + startMonth + "月" + $(this).attr('data-startDay') + "日" + "</span><span> - </span><span>" + $(this).attr('data-startYear') + "年" + endMonth + "月" + $(this).attr('data-startDay') + "日" + "</span>")
				} else {
					$(this).html("<span>" + $(this).attr('data-startMonth') + $(this).attr('data-startDay') + "," + $(this).attr('data-startYear') + "</span><span> - </span><span>" + $(this).attr('data-endMonth') + $(this).attr('data-endDay') + "," + $(this).attr('data-endYear') + "</span>")
				}
			})
		});
	};
	return events;
}($));

events.init();
var textGrids = (function ($) {
  var textGrids = {};


  textGrids.init = function () {
    $(document).ready(function () {
      //category-wrapper  category-content为空的时候 隐藏common title
      // var contentsWarp = $('.title-wrapper')
      // $.each(contentsWarp, function(index, item){
      //   var contents = $(this).parent().parent().siblings('.text-link-wrap').find('.main-category')
      //   if(!contents.length){
      //     $(this).hide()
      //   }
      // })
      //Main Category
      var btns = $('.text-link .category-wrapper .category-content .icon-right-arrow .main-category-link');
      $.each(btns, function (key, val) {
        var btnUrlOrg = $(val).attr('href');
        if(!$(val).attr('href')){
            btnUrlOrg = $(val).data('href');
        }else {
           $(val).removeAttr('href')
        }
        if(btnUrlOrg){
            var btnUrl = btnUrlOrg;

            var paths = btnUrlOrg.split('.');
            if (paths > 1) {
              var extension = paths[1];
              if (extension.toLowerCase() != 'html') {
                $(val).removeClass('at-navigation');
                $(val).addClass('at-download');
              }
            }

            btnUrl =  header.checkLoginStatusForDownload(btnUrl, val);
            if(btnUrl !== 'javascript:;'){
              $(val).attr('href', btnUrl);
            } else {
              $(val).removeAttr('href');
            }
            if (btnUrl !== '#download-agreement') {
              $(val).removeAttr('data-toggle');
              $(val).removeClass('at-action');
              if (btnUrl == btnUrlOrg) {
                $(val).removeClass('at-exit');
                $(val).addClass('at-download');
              }else if (btnUrl.toLowerCase().indexOf("javascript")>=0) {
                  $(val).removeClass('at-exit');
                  $(val).addClass('at-download');
              }else{
                  $(val).removeClass('at-download');
                  $(val).addClass('at-exit');
              }
            }
        }
      });

      // Sub Category
      var downloadBtns = $('.text-link .category-wrapper .category-content .icon-right-arrow .text-grid-sub-category-list li a');
      $.each(downloadBtns, function (key, val) {
        var btnUrlOrg = $(val).attr('href');
        if(!$(val).attr('href')){
            btnUrlOrg = $(val).data('href');
        }
          if(btnUrlOrg) {
              var btnUrl = btnUrlOrg;

              var paths = btnUrlOrg.split('.');
              if (paths > 1) {
                  var extension = paths[1];
                  if (extension.toLowerCase() != 'html') {
                      $(val).removeClass('at-navigation');
                      $(val).addClass('at-download');
                  }
              }
              btnUrl = header.checkLoginStatusForDownload(btnUrl, val);
              if(btnUrl !== 'javascript:;'){
                $(val).attr('href', btnUrl);
              } else {
                $(val).removeAttr('href')
              }
              if (btnUrl !== '#download-agreement') {
                  $(val).removeAttr('data-toggle');
                  $(val).removeClass('at-action');
                  if (btnUrl == btnUrlOrg) {
                      $(val).removeClass('at-exit');
                      $(val).addClass('at-download');
                  } else if (btnUrl.toLowerCase().indexOf("javascript") >= 0) {
                      $(val).removeClass('at-exit');
                      $(val).addClass('at-download');
                  } else {
                      $(val).removeClass('at-download');
                      $(val).addClass('at-exit');
                  }
              }
          }
      });
    });
  };

  return textGrids;
}($));
textGrids.init();
$(document).ready(function () {
    HiAnalyticsCn.clickDownLazy('.text-grid-container  a',isCnAnalytics);
});


var productComparisonBottom = (function ($) {
  var productComparisonBottom = {};
  var compareContBox =  '<div class="compare-contbox"></div>';
  $('body').append(compareContBox);
  productComparisonBottom.getCurrentBreakpoint = function () {
    var contentValue = window.getComputedStyle(
      document.querySelector('.compare-contbox'),'::before'
    ).getPropertyValue('content');
    return contentValue.replace(/\"/g, '');
  };

  productComparisonBottom.addProductToCompare = Granite.I18n.get("Up to 4 products")
  productComparisonBottom.closeCompareBar = function () {
    $(".compare-cont").slideUp();
    var compareArrary = productComparisonBottom.getCompareArray();
    if(compareArrary.length > 0) {
      $("#compareBtm-2").show(800);
    } else {
      $("#compareBtm-2").css("display", "none");
    }
  };
  productComparisonBottom.clearCompareData = function () {
    $('html').removeClass('overflow-prevent');
    productComparisonBottom.setCompareArray([]);
    
    var emptyDesktop = '<div class="empty-cont active-compare-cont"><div class="add-item">' + productComparisonBottom.addProductToCompare + '</div></div>';
    var emptyMobile = '<div class="add-item">' + productComparisonBottom.addProductToCompare + '</div>';
    var html = productComparisonBottom.getCurrentBreakpoint() == 'DESKTOP' ? emptyDesktop : emptyMobile;
    var itemParentNode = productComparisonBottom.getCurrentBreakpoint() == 'DESKTOP' ? '.compare-content > .compare-items-cont' : '.compare-cont > .compare-items-cont';

    $(itemParentNode).empty();
    $(itemParentNode).append('<div class="compare-item" id="item-1">'+ html +'</div>');
    $(itemParentNode).append('<div class="compare-item" id="item-2">'+ html +'</div>');
    $(itemParentNode).append('<div class="compare-item" id="item-3">'+ html +'</div>');
    $(itemParentNode).append('<div class="compare-item" id="item-4">'+ html +'</div>');
    $(".comp-count").text(0);

    $('.compare-btn').addClass('disabled');
    $('.compare-btn').attr('data-at-module', "compare");

    compareTriggers.forEach(function (value) {
      if ($(value).is("input") && ($(value).attr('type') === 'checkbox')) {
        $(value + ':checked').trigger('click');
        $(value + ':checked').prop('checked', false);
      }
    });
    
    if(productComparisonBottom.getCurrentBreakpoint() == 'MOBILE'){
      $('.compare-cont .compare-items-cont').css('display', 'none');
      productComparisonBottom.removeLayout();
      $(".compare-cont").slideToggle('slow');
    }
  };
  productComparisonBottom.setCompareArray = function (compareArrary) {
    if (window.localStorage) {
      localStorage.setItem('compare-products', JSON.stringify(compareArrary));
    }
  };
  productComparisonBottom.getCompareArray = function () {
    if (window.localStorage) {
      var compareArrary = JSON.parse(localStorage.getItem('compare-products'));
      if (!compareArrary)
        compareArrary = [];
      return compareArrary;
    }
    return [];
  };
  var oHtml = "<div id='toast-to' ><img src='/etc/clientlibs/it/resources/icons/toast.png'/>Exceeds the maximum number of options</div>"
  productComparisonBottom.addCompareDataItem = function (productUrl, event) {
    var compareArrary = productComparisonBottom.getCompareArray();
    var title = $(event.currentTarget).data('at-module');
    if (!isNull(title)) {
      title = title.split(' ').join('_');
      title = title + atModel.atSpliter + window.location.href;
    } else {
      var titles = productUrl.replace(/\.html/, '').split('/');
      title = titles.pop();
      if (isNull(title)) {
        title = titles.pop();
      }
      title = "product spotlight::compare::" + title + atModel.atSpliter + window.location.href;
    }
    // at event
    atModel.doAtEvent(title, 'action', event);

    // todo max length of compare array should add to a config
    if (compareArrary.length == 4) {
      // pop message max compare count
      var parentBody = $(window.parent.document.body);
      $(parentBody).append(oHtml);
      setTimeout(function () {
        parentBody.find("#toast-to").remove();
      }, 3000);
      // $(this).prop('checked', false);
      $(event.target).prop('checked', false); 

      return;
    }
    var index = compareArrary.findIndex(function (item) {
      return item.productUrl === productUrl;
    });
    // get product properties form pis system into local storage for compare
    $.getJSON(productUrl.replace(".html", ".model.json"), function (json) {
      json.productUrl = productUrl;
      if (index >= 0) {
        compareArrary[index] = json;
      } else {
        compareArrary.push(json);
      }
      productComparisonBottom.setCompareArray(compareArrary);
      productComparisonBottom.renderCompareDataItem(compareArrary.length, json, index);
      var module = $('.compare-btn').attr('data-at-module');
      if (compareArrary.length === 1) {
        $('.compare-btn').attr('data-at-module', module + atModel.atSpliter + json.productNo);
      } else {
        $('.compare-btn').attr('data-at-module', module + "|" + json.productNo);
      }
    });
  };
  productComparisonBottom.renderCompareDataItem = function (index, productModel, isSame) {
    var same = isSame + 1;
    if (isSame >= 0) {
      $(".compare-cont #item-" + same).empty();
    } else {
      $(".compare-cont #item-" + index).empty();
    }
    var itemDesktop = 
      '<div class="item-cont" style="background: #FFF url(\'' + productModel.productImage + '\') no-repeat center;background-size: auto 88px;">' + 
        '<div class="item-title">' + productModel.productNo + '</div>' +
        '<div class="close-item" data-product-url="' + productModel.productUrl + '">' +
          '<div  class="remove-items" id="remove-item-1" data-at-module="compare_bottom::compare::remove' + productModel.productNo + '" >' +
            '<img src="/etc/clientlibs/it/resources/icons/close-defaults-1.svg" alt="Close">' +
          '</div >' +
        '</div>' +
     '</div>';

    var itemMobile = 
      '<div class="item-cont" style="background: #FFF url(\'' + productModel.productImage + '\') no-repeat center;background-size: contain;"></div>' +
      '<div class="item-title">' + productModel.productNo + '</div>' +
      '<div class="close-item" data-product-url="' + productModel.productUrl + '">' +
        '<div  class="remove-items" id="remove-item-1" data-at-module="compare_bottom::compare::remove' + productModel.productNo + '" >' +
          '<img src="/etc/clientlibs/it/resources/icons/close-defaults-1.svg" alt="Close">' +
        '</div >' +
      '</div>';


      if (isSame >= 0) {
        $(".compare-cont #item-" + same).append(getCurrentBreakpoint() == 'DESKTOP' ? itemDesktop : itemMobile);
      } else {
        $(".compare-cont #item-" + index).append(getCurrentBreakpoint() == 'DESKTOP' ? itemDesktop : itemMobile);
      }


    $('.comp-count').text(index);
    $('.compare-btn').removeClass('disabled');
  };

  productComparisonBottom.removeCompareDataItem = function (productKey, event) {

    var title = $(event.currentTarget).data('at-module');
    if (!isNull(title)) {
      title = title.split(' ').join('_');
      title = title + "::remove::" + window.location.href;
    } else {
      var titles = productKey.replace(/\.html/, '').split('/');
      title = titles.pop();
      if (isNull(title)) {
        title = titles.pop();
      }
      title = "product spotlight::compare::remove" + title + atModel.atSpliter + window.location.href;
    }
    // at event
    atModel.doAtEvent(title, 'action', event);

    // product key is pis url
    var compareArrary = productComparisonBottom.getCompareArray();
    var index = compareArrary.findIndex(function (item) {
      return item.productUrl === productKey;
    });
    if (index >= 0) {
      var module = $('.compare-btn').attr('data-at-module');
      $('.compare-btn').attr('data-at-module', module.replace("|" + compareArrary[index].productNo, ""));

      compareArrary.splice(index, 1);
      productComparisonBottom.setCompareArray(compareArrary);
      productComparisonBottom.initCompareData();
    }
  };
  productComparisonBottom.initCompareData = function () {
    var compareData = productComparisonBottom.getCompareArray();
    compareData.forEach(function (value, index) {
      productComparisonBottom.renderCompareDataItem(index + 1, value);
      $('input[data-product-url="' + value.productUrl + '"]').prop('checked', true);

      var module = $('.compare-btn').attr('data-at-module');
      if (index === 0) {
        $('.compare-btn').attr('data-at-module', module + atModel.atSpliter + compareData[index].productNo);
      } else {
        $('.compare-btn').attr('data-at-module', module + "|" + compareData[index].productNo);
      }
    });
    for ((i = compareData.length + 1); i <= 4; i++) {
      $(".compare-cont #item-" + i).empty();
      $(".compare-cont #item-" + i).append($('.compare-item-empty').html());
    }
    $('.comp-count').text(compareData.length);
    if (compareData.length === 0) {
      $('.compare-btn').addClass('disabled');
      if(productComparisonBottom.getCurrentBreakpoint() == 'MOBILE'){
        $('.compare-cont .compare-items-cont').css('display', 'none');
        $('.compare-cont .compare-items-cont').removeClass('active');
        $('html').removeClass('overflow-prevent');
        productComparisonBottom.removeLayout();
        $(".compare-cont").slideUp('slow');
      }
    } else {
      $('.compare-btn').removeClass('disabled');
    }
  };
  productComparisonBottom.renderCompareBottom = function (isShow) {
    var compareCont = $('.compare-cont');
    if (compareCont.length === 0) {
      var compartPath = $(".header-wrapper").attr('data-compare');

      var compareDesktop =
        '<div class="compare-cont">' +
          '<div class="compare-content">' +
            '<div class="compare-items-cont">' +
              '<div class="compare-item" id="item-1">' +
                  '<div class="empty-cont active-compare-cont">' +
                    '<div class="add-item"></div>' +
                  '</div>' +
              '</div>' +
              '<div class="compare-item" id="item-2">' +
                  '<div class="empty-cont active-compare-cont">' +
                    '<div class="add-item">' + productComparisonBottom.addProductToCompare + '</div>' +
                  '</div>' +
              '</div>' +
              '<div class="compare-item" id="item-3">' +
                  '<div class="empty-cont active-compare-cont">' +
                    '<div class="add-item">' + productComparisonBottom.addProductToCompare + '</div>' +
                  '</div>' +
              '</div>' +
              '<div class="compare-item" id="item-4">' +
                  '<div class="empty-cont active-compare-cont">' +
                    '<div class="add-item">' + productComparisonBottom.addProductToCompare + '</div>' +
                  '</div>' +
              '</div>' +
            '</div>' +
            '<div class="compare-btn-wrapper">' +
              '<div class="comp-clear-btn">' +
                '<div class="clear-all-btn">' + Granite.I18n.get("Clear All") + '</div>' +
              '</div>' +
              '<a class="compare-btn at-navigation" data-at-module="compare" href="' + compartPath + '" target="_blank">' +
                '<div class="comp-btn-text compare-products">' + Granite.I18n.get("Compare") + '</div>' +
                '<div class="comp-count">2</div>' +
              '</a>' +
            '</div>' +
          '</div>' +
          '<div class="close-compare-tab" id="closeCompare">' +
            '<img src="/etc/clientlibs/it/resources/icons/close-defaults-big-1.svg" alt="Close" id="">' +
          '</div>' +
          '<div class="compare-item-empty">' +
            '<div class="empty-cont active-compare-cont">' +
              '<div class="add-item">' + productComparisonBottom.addProductToCompare + '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="compare-btn-cont" id="compareBtm-2">' +
          '<div class="compare-btn">' +
            '<div class="comp-count">2</div>' +
            '<div class="comp-btn-text compare-list">' + Granite.I18n.get("Compare") + '</div>' +
          '</div>' + 
        '</div>';

      var compareMobile = 
        '<div class="compare-cont">' +
          '<div class="compare-items-cont">' +
            '<div class="compare-item" id="item-1">12321421' +
                '<div class="empty-cont active-compare-cont">' +
                  '<div class="add-item">1111111</div>' +
                '</div>' +
            '</div>' +
            '<div class="compare-item" id="item-2">' +
              '<div class="add-item">' + productComparisonBottom.addProductToCompare + '</div>' +
            '</div>' +
            '<div class="compare-item" id="item-3">' +
              '<div class="add-item">' + productComparisonBottom.addProductToCompare + '</div>' +
            '</div>' +
            '<div class="compare-item" id="item-4">' +
              '<div class="add-item">' + productComparisonBottom.addProductToCompare + '</div>' +
            '</div>' +
          '</div>' +
          '<div class="compare-mobile-bar">' + 
            '<div class="compare-bar-sum-container">' +
              '<div class="compare-bar-sum">' + 
                Granite.I18n.get("Compare Products") + ' ('+  '<span class="compare-bar-active-product comp-count">0</span>' + '/4)' +
              '</div>' +
              '<div class="compare-view-detail">' + Granite.I18n.get("View Details") + '</div>' +
            '</div>' +
            '<div class="compare-btn-wrapper">' +
              '<a class="compare-btn at-navigation" data-at-module="compare" href="' + compartPath + '" target="_blank">' +
                '<div class="comp-btn-text compare-products">' + Granite.I18n.get("Compare") + '</div>' +
              '</a>' +
              '<div class="comp-clear-btn">' +
                '<div class="clear-all-btn">' + Granite.I18n.get("Clear All") + '</div>' +
              '</div>' +
            '</div>' +
          '</div>' +
          '<div class="compare-item-empty">' +
            '<div class="add-item">' + productComparisonBottom.addProductToCompare + '</div>' +
          '</div>' +
        '</div>';


      // console.log(productComparisonBottom.getCurrentBreakpoint());
      var html = productComparisonBottom.getCurrentBreakpoint() == 'DESKTOP' ? compareDesktop : compareMobile;

      $('body').append(html);

      $(".compare-cont").css("display", "none");
      $("#compareBtm-2").css("display", "none");

      // for events
      $("body").on("click", ".compare-cont #closeCompare", productComparisonBottom.closeCompareBar);
      $("body").on("click", ".compare-btn-cont#compareBtm-2", function () {
        $(".compare-cont").slideToggle("slow");
        $(".compare-cont").show(800);
        if(productComparisonBottom.getCurrentBreakpoint() == 'DESKTOP') $(".compare-cont").css("display", "block");
        $(".compare-btn-cont#compareBtm-2").hide();
      });

      $("body").on("click", ".compare-cont .compare-item .close-item", function (e) {
        var productUrl = $(this).attr('data-product-url');
        // $('input[data-product-url="' + productUrl + '"]').trigger('click');
        $('input[data-product-url="' + productUrl + '"]').prop('checked', false);
        productComparisonBottom.removeCompareDataItem(productUrl, e);
      });
      $("body").on("click", ".compare-cont .comp-clear-btn", productComparisonBottom.clearCompareData);
      productComparisonBottom.viewAllMobile();
      productComparisonBottom.initCompareData();
    }
    if (isShow && $(".compare-cont").css("display") !== "block") {
      $(".compare-cont").slideToggle("slow");
      $(".compare-cont").show(500);
      if(productComparisonBottom.getCurrentBreakpoint() == 'DESKTOP') $(".compare-cont").css("display", "block");
      $(".compare-btn-cont#compareBtm-2").hide();
    }
  };

  productComparisonBottom.viewAllMobile = function () {
    $('.compare-mobile-bar .compare-view-detail').on('click', function(e){

      e.stopPropagation();
      if (!$('.compare-items-cont').hasClass("active") ){
        $('html').addClass('overflow-prevent');
        $('.compare-items-cont').addClass('active');
        $('.compare-cont .compare-items-cont').slideDown('fast');
        $('body').append('<div class="layout compare"></div>');
      } else {
        $('.compare-items-cont').removeClass('active');
        $('.compare-cont .compare-items-cont').slideUp('fast');
        $('body .layout').remove();
        $('html').removeClass('overflow-prevent');
      }
      $('.layout.compare').on('click', function() {
        $('.compare-cont .compare-items-cont').slideUp('fast');
        $('body .layout').remove();
        $('html').removeClass('overflow-prevent');
        $('.compare-items-cont').removeClass("active")
      })
    })
  }

  productComparisonBottom.initComparetEvent = function (comparetTriggerItem) {
    $(comparetTriggerItem).removeAttr('onclick');
    $(comparetTriggerItem).unbind("click").click(function (e) {
      e.stopPropagation();
      productComparisonBottom.renderCompareBottom(true);
      var productUrl = $(this).attr('data-product-url');
      var isAdd = true;
      // if event target is checkbox checked state is add
      // if not checkbox should add attribute data-isadd
      if ($(this).is("input") && ($(this).attr('type') === 'checkbox')) {
        isAdd = $(this).is(":checked");
      } else {
        isAdd = $(this).attr('data-isadd');
      }
      if (productUrl) {
        if (isAdd) {
          $(this).prop('checked', true);
          productComparisonBottom.addCompareDataItem(productUrl, e);
        } else {
          productComparisonBottom.removeCompareDataItem(productUrl, e);
        }
      }
    });
  };

  productComparisonBottom.removeLayout = function () {
    $('body .layout').remove();
  }

  productComparisonBottom.handleMobileViewCompare = function () {
    var contactUsBtnContent = $(".btn-content .contact-us-btn-content");
    var compareBtnContent = $(".compare-btn-cont");
    if (contactUsBtnContent.length != 0) {
      if ($(window).width() <= 1024) {
        contactUsBtnContent.after(compareBtnContent);
      } else {
        $(".compare-cont").after(compareBtnContent);
      }
    }
  };

  productComparisonBottom.init = function (comparetTriggerItem) {
    $(document).ready(function () {
      productComparisonBottom.renderCompareBottom();
      productComparisonBottom.initComparetEvent(comparetTriggerItem);
      productComparisonBottom.handleMobileViewCompare();
    });

    $(window).resize(function () {
      productComparisonBottom.handleMobileViewCompare();
    });
  };

  return productComparisonBottom;
})($);

var compareTriggers = [".add-to-compare-chk"];
for (var i = 0; i < compareTriggers.length; i++) {
  productComparisonBottom.init(compareTriggers[i]);
};

/* @license 
 * jQuery.print, version 1.6.0
 *  (c) Sathvik Ponangi, Doers' Guild
 * Licence: CC-By (http://creativecommons.org/licenses/by/3.0/)
 *--------------------------------------------------------------------------*/
(function ($) {
    "use strict";
    // A nice closure for our definitions

    function jQueryCloneWithSelectAndTextAreaValues(elmToClone, withDataAndEvents, deepWithDataAndEvents) {
        // Replacement jQuery clone that also clones the values in selects and textareas as jQuery doesn't for performance reasons - https://stackoverflow.com/questions/742810/clone-isnt-cloning-select-values
        // Based on https://github.com/spencertipping/jquery.fix.clone
        var $elmToClone = $(elmToClone),
            $result           = $elmToClone.clone(withDataAndEvents, deepWithDataAndEvents),
            $myTextareas     = $elmToClone.find('textarea').add($elmToClone.filter('textarea')),
            $resultTextareas = $result.find('textarea').add($result.filter('textarea')),
            $mySelects       = $elmToClone.find('select').add($elmToClone.filter('select')),
            $resultSelects   = $result.find('select').add($result.filter('select')),
            i, l, j, m;

        for (i = 0, l = $myTextareas.length; i < l; ++i) {
            $($resultTextareas[i]).val($($myTextareas[i]).val());
        }
        for (i = 0, l = $mySelects.length;   i < l; ++i) {
            for (j = 0, m = $mySelects[i].options.length; j < m; ++j) {
                if ($mySelects[i].options[j].selected === true) {
                    $resultSelects[i].options[j].selected = true;
                }
            }
        }
        return $result;
    }

    function getjQueryObject(string) {
        // Make string a vaild jQuery thing
        var jqObj = $("");
        try {
            jqObj = jQueryCloneWithSelectAndTextAreaValues(string);
        } catch (e) {
            jqObj = $("<span />")
                .html(string);
        }
        return jqObj;
    }

    function printFrame(frameWindow, content, options) {
        // Print the selected window/iframe
        var def = $.Deferred();
        try {
            frameWindow = frameWindow.contentWindow || frameWindow.contentDocument || frameWindow;
            var wdoc = frameWindow.document || frameWindow.contentDocument || frameWindow;
            if(options.doctype) {
                wdoc.write(options.doctype);
            }
            wdoc.write(content);
            wdoc.close();
            var printed = false,
                callPrint = function () {
                    if(printed) {
                        return;
                    }
                    // Fix for IE : Allow it to render the iframe
                    frameWindow.focus();
                    try {
                        // Fix for IE11 - printng the whole page instead of the iframe content
                        if (!frameWindow.document.execCommand('print', false, null)) {
                            // document.execCommand returns false if it failed -http://stackoverflow.com/a/21336448/937891
                            frameWindow.print();
                        }
                        // focus body as it is losing focus in iPad and content not getting printed
                        $('body').focus();
                    } catch (e) {
                        frameWindow.print();
                    }
                    frameWindow.close();
                    printed = true;
                    def.resolve();
                };
            // Print once the frame window loads - seems to work for the new-window option but unreliable for the iframe
            $(frameWindow).on("load", callPrint);
            // Fallback to printing directly if the frame doesn't fire the load event for whatever reason
            setTimeout(callPrint, options.timeout);
        } catch (err) {
            def.reject(err);
        }
        return def;
    }

    function printContentInIFrame(content, options) {
        var $iframe = $(options.iframe + "");
        var iframeCount = $iframe.length;
        if (iframeCount === 0) {
            // Create a new iFrame if none is given
            $iframe = $('<iframe height="0" width="0" border="0" wmode="Opaque"/>')
                .prependTo('body')
                .css({
                    "position": "absolute",
                    "top": -999,
                    "left": -999
                });
        }
        var frameWindow = $iframe.get(0);
        return printFrame(frameWindow, content, options)
            .done(function () {
                // Success
                setTimeout(function () {
                    // Wait for IE
                    if (iframeCount === 0) {
                        // Destroy the iframe if created here
                        $iframe.remove();
                    }
                }, 1000);
            })
            .fail(function (err) {
                // Use the pop-up method if iframe fails for some reason
                console.error("Failed to print from iframe", err);
                printContentInNewWindow(content, options);
            })
            .always(function () {
                try {
                    options.deferred.resolve();
                } catch (err) {
                    console.warn('Error notifying deferred', err);
                }
            });
    }

    function printContentInNewWindow(content, options) {
        // Open a new window and print selected content
        var frameWindow = window.open();
        return printFrame(frameWindow, content, options)
            .always(function () {
                try {
                    options.deferred.resolve();
                } catch (err) {
                    console.warn('Error notifying deferred', err);
                }
            });
    }

    function isNode(o) {
        /* http://stackoverflow.com/a/384380/937891 */
        return !!(typeof Node === "object" ? o instanceof Node : o && typeof o === "object" && typeof o.nodeType === "number" && typeof o.nodeName === "string");
    }
    $.print = $.fn.print = function () {
        // Print a given set of elements
        var options, $this, self = this;
        // console.log("Printing", this, arguments);
        if (self instanceof $) {
            // Get the node if it is a jQuery object
            self = self.get(0);
        }
        if (isNode(self)) {
            // If `this` is a HTML element, i.e. for
            // $(selector).print()
            $this = $(self);
            if (arguments.length > 0) {
                options = arguments[0];
            }
        } else {
            if (arguments.length > 0) {
                // $.print(selector,options)
                $this = $(arguments[0]);
                if (isNode($this[0])) {
                    if (arguments.length > 1) {
                        options = arguments[1];
                    }
                } else {
                    // $.print(options)
                    options = arguments[0];
                    $this = $("html");
                }
            } else {
                // $.print()
                $this = $("html");
            }
        }
        // Default options
        var defaults = {
            globalStyles: true,
            mediaPrint: false,
            stylesheet: null,
            noPrintSelector: ".no-print",
            iframe: true,
            append: null,
            prepend: null,
            manuallyCopyFormValues: true,
            deferred: $.Deferred(),
            timeout: 750,
            title: null,
            doctype: '<!doctype html>'
        };
        // Merge with user-options
        options = $.extend({}, defaults, (options || {}));
        var $styles = $("");
        if (options.globalStyles) {
            // Apply the stlyes from the current sheet to the printed page
            $styles = $("style, link, meta, base, title");
        } else if (options.mediaPrint) {
            // Apply the media-print stylesheet
            $styles = $("link[media=print]");
        }
        if (options.stylesheet) {
            // Add a custom stylesheet if given
            $styles = $.merge($styles, $('<link rel="stylesheet" href="' + options.stylesheet + '">'));
        }
        // Create a copy of the element to print
        var copy = jQueryCloneWithSelectAndTextAreaValues($this);
        // Wrap it in a span to get the HTML markup string
        copy = $("<span/>")
            .append(copy);
        // Remove unwanted elements
        copy.find(options.noPrintSelector)
            .remove();
        // Add in the styles
        copy.append(jQueryCloneWithSelectAndTextAreaValues($styles));
        // Update title
        if (options.title) {
            var title = $("title", copy);
            if (title.length === 0) {
                title = $("<title />");
                copy.append(title);                
            }
            title.text(options.title);            
        }
        // Appedned content
        copy.append(getjQueryObject(options.append));
        // Prepended content
        copy.prepend(getjQueryObject(options.prepend));
        if (options.manuallyCopyFormValues) {
            // Manually copy form values into the HTML for printing user-modified input fields
            // http://stackoverflow.com/a/26707753
            copy.find("input")
                .each(function () {
                    var $field = $(this);
                    if ($field.is("[type='radio']") || $field.is("[type='checkbox']")) {
                        if ($field.prop("checked")) {
                            $field.attr("checked", "checked");
                        }
                    } else {
                        $field.attr("value", $field.val());
                    }
                });
            copy.find("select").each(function () {
                var $field = $(this);
                $field.find(":selected").attr("selected", "selected");
            });
            copy.find("textarea").each(function () {
                // Fix for https://github.com/DoersGuild/jQuery.print/issues/18#issuecomment-96451589
                var $field = $(this);
                $field.text($field.val());
            });
        }
        // Get the HTML markup string
        var content = copy.html();
        // Notify with generated markup & cloned elements - useful for logging, etc
        try {
            options.deferred.notify('generated_markup', content, copy);
        } catch (err) {
            console.warn('Error notifying deferred', err);
        }
        // Destroy the copy
        copy.remove();
        if (options.iframe) {
            // Use an iframe for printing
            try {
                printContentInIFrame(content, options);
            } catch (e) {
                // Use the pop-up method if iframe fails for some reason
                console.error("Failed to print from iframe", e.stack, e.message);
                printContentInNewWindow(content, options);
            }
        } else {
            // Use a new window for printing
            printContentInNewWindow(content, options);
        }
        return this;
    };
})(jQuery);
var productComparison = (function($) {
    var productComparison = {};
    /**
     * string format
     */
    productComparison.stringFormat = function() {
        if (arguments.length === 0)
            return null;
        var str = arguments[0];
        for (var i = 1; i < arguments.length; i++) {
            var re = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
            str = str.replace(re, arguments[i]);
        }
        return str;
    };
    /**
     * remove blank and lower
     */
    productComparison.translateKey = function (value, removeBlank) {
        var result = value;
        if (removeBlank) {
            result = result.replace(/\s+/g, "");
        }
        return result.trim().toLowerCase();
    };
    /**
     * key equals
     */
    productComparison.keyEquals = function (strA, strB) {
        // remove blank and lower
        var a = productComparison.translateKey(strA, true);
        var b = productComparison.translateKey(strB, true);
        return a === b;
    };
    /**
     * value equals
     */
    productComparison.valueEquals = function (arr) {
        // remove blank and lower
        var a = productComparison.translateKey(arr[0], true);
        return arr.every(function(v) {
            var b = productComparison.translateKey(v, true);
            return a === b;
        });
    };
    /**
     * Close Compare table/modal window
     */
    productComparison.closeCompareTable = function() {
        $('.product-comparison').hide();
    };
    /**
     * find key in json data
     */
    productComparison.findJsonObjectByKey = function(jsonData, keyName) {
        var findJson =  jsonData.filter(function(item) {
            return productComparison.keyEquals(item.key, keyName);
        });
        return findJson;
    };
    /**
     * find all keys in json data
     */
    productComparison.findAllByKeys = function(jsonData){
        if(jsonData && jsonData.length){
            var allJson = jsonData.filter(function(x){
                return x
            }).reduce(function(total, item){
                return item && total.concat(item.specItemModelList)
             }, [])
           //  var allKeys = Object.keys(jsonData)
            return allJson
        }
    };
    /**
     * compare
     */
    productComparison.handleCompareArrary = function(compareArrary){
       return compareArrary.reduce(function(total, item){
           return total.concat(item.specModelList)
       }, [])
    };
    /**
     * init Compare Data
     */
    productComparison.initCompareData = function() {
        // compare data
        var compareArrary = productComparisonBottom.getCompareArray();
        if (compareArrary.length > 0) {
            // Main container
            var comparisonTable = $(".pc__content");
            // Header for product image and name
            var comparisonTableHeader = $(comparisonTable).find('.pc__header');
            // Wrapper for details of all products
            var comparisonTableBody = $(comparisonTable).find('.pc__body');

            var headerTemplate = '';
            var bodyTemplate = '';

            // {0} compare product key
            // {1} compare product name
            // {2} compare product other info
            // {3} compare product image
            var compareItemTemplate = '<div class="pc__block pc__mainInfo" data-product-url="{0}">'
                    + '<div class="pc__image" style="background-image:url(\'{3}\');background-size: contain;">'
                    + '<img src="/etc/clientlibs/it/resources/icons/icon-close.svg" class="pc__remove" alt="X">'
                    + '<span class="pc__selectedTag">' + Granite.I18n.get("Selected Product") + '</span>'
                    + '<button class="btn primary-btn small-btn pc__selectBtn at-action" data-at-module="compare::select::{1}"><nav>' + Granite.I18n.get("COMPARE") + '</nav></button>'
                    + '</div>'
                    + '<h4 class="pc__name"><a class="at-navigation" href="{4}">{1}</a></h4>' + '<p class="pc__basicInfo">{2}</p>' + '</div>';

            // {0} compare product property category
            var compareKeyTemplate = '<div class="pc__row pc__property_category">'
                    // + ' <div class="pc__block pc__propertyTitle">'
                    // + '     <h5 class="pc__propertyTitle--category">{0}</h5>' + ' </div>'
                    + ' <div class="pc__block pc__propertyTitle_blank"></div>'
                    + ' <div class="pc__block pc__propertyTitle_blank"></div>'
                    + '  <div class="pc__block pc__propertyTitle_blank"></div>'
                    + ' <div class="pc__block pc__propertyTitle_blank"></div>' + '</div>';

            // {0} compare product property sub category
            var compareItemKeyTemplate = '<div class="pc__row">' + '<div class="pc__block pc__propertyTitle">'
                    + '     <h5 class="pc__propertyTitle--subCategory">{0}</h5>' + '</div>';

            // {0} compare product property should high lighter show
            // {1} compare product property value
            var compareItemValueTemplate = '<div class="pc__block" data-diff-highlighter="{0}">' + '     <p>{1}</p>'
                    + '</div>';
            // Array for all Main category of 1st product
            var baseProductFeaturesMainCategory = [];
            var removeBlankCategory = [];

            // Iterate through Products for HEADER
            $.each(compareArrary, function(index, item) {
                if(item.subProduct){
                    item = item.subProduct;
                }
                headerTemplate += productComparison.stringFormat(compareItemTemplate, item.productUrl, item.productNo,
                        item.productName, item.productImage, item.productUrl);
                // Iterate through First Product to populate Main category array
                if (index === 0) {
                    // find first product specModelList all key into array
                    $.each(item.specModelList, function(key, property) {
                        if (property.specItemModelList.length > 0) {
                            baseProductFeaturesMainCategory.push(property);
                        }
                    });
                }
            });
            // Add empty div if product list length is less than 4 with 1st div having Add to compare button
            for (var i = 0; i < (4 - compareArrary.length); i++) {
                headerTemplate += $('.product-comparison .item-cont-empty').html();
            }

            // Append table header
            $(comparisonTableHeader).find('.pc__row').append(headerTemplate);

            // find all compare keys
            var handleCompareArrarys = productComparison.findAllByKeys(productComparison.handleCompareArrary(compareArrary));

            // Iterate through Product - Loop 3
            // todo :
            $.each(compareArrary, function(index, item){
                var itemSpecModelList = item.specModelList;
                $.each(itemSpecModelList, function(dataIndex, data){
                    $.each(data.specItemModelList, function(xIndex, x){
                        x.productNo = item.productNo
                    })
                })
            })

            // Iterate through Main category array - Loop 1
            // product.specModelList
            $.each(baseProductFeaturesMainCategory,function(indexCategory, compareCategory) {
                bodyTemplate += productComparison.stringFormat(compareKeyTemplate, Granite.I18n.get(compareCategory.key));
                // product.specModelList.specItemModelList
                $.each(compareCategory.specItemModelList, function(indexPropertyItem, comparePropertyItem) {
                    // To compare properties of each product to highlight
                    var subCatPropertyList = [];
                    // Make true if there is difference in Properties
                    var highlightDiffFlag = false;
                    // row for sub-category details START here
                    bodyTemplate += productComparison.stringFormat(
                            compareItemKeyTemplate, Granite.I18n.get(comparePropertyItem.key));
                    var categoryItems = productComparison.findJsonObjectByKey(handleCompareArrarys, comparePropertyItem.key);
                    var copyCateforyItems1 = JSON.stringify(categoryItems);
                    var copyCateforyItems = JSON.parse(copyCateforyItems1);
                    var ccCateforyItems = [];
                    var modelNumbers = compareArrary.map(function(item){
                        return item.productNo
                    })
                    var mapCates = copyCateforyItems.map(function(item){
                        return item.productNo
                    })
                    modelNumbers.forEach(function(item){
                        if(mapCates.indexOf(item) === -1){
                            ccCateforyItems.push({
                                key: copyCateforyItems[0].key,
                                value:  Granite.I18n.get('N.A.'),
                                productNo: item
                            })
                        } else {
                            ccCateforyItems.push(copyCateforyItems.find(function(x){
                                return x.productNo === item
                            }))
                        }
                    });
                    if (ccCateforyItems && ccCateforyItems.length > 0) {
                        $.each(ccCateforyItems, function(index, item){
                            subCatPropertyList.push(item.value);
                            if (!productComparison.valueEquals(subCatPropertyList)) {
                                highlightDiffFlag = true;
                            }
                            bodyTemplate += productComparison.stringFormat(
                                compareItemValueTemplate,
                                highlightDiffFlag,
                                item.value);
                        })
                    } else {
                        bodyTemplate += $('.product-comparison .pc-block-na').html();
                    }

                    // Add empty div if product list length is less than 4
                    if (compareArrary.length < 4) {
                        for (var i = 0; i < (4 - compareArrary.length); i++) {
                            bodyTemplate += '<div class="pc__block bg-white"></div>';
                        }
                    }
                    // row for sub-category details END here
                    bodyTemplate += '</div>';
                });
            });

            // Append table body
            $(comparisonTableBody).append(bodyTemplate);

            $('.pc__row .pc__block[data-diff-highlighter="true"]').closest('.pc__row').addClass(
                    'difference-highlighter');
            productComparison.productCount(comparisonTableHeader);

            var productSelectPath = $(".header-wrapper").attr('data-product-select');
            $('.pc__add_container .btn-add-to-compare').attr('href',productSelectPath);

            // for at
            // atModel.initAtNavigation(true, atModel.atEvents.navigation.join(', '));
            // atModel.initAtAction(true, atModel.atEvents.action.join(', '));
        }
    };
    /**
     * Count number of product
     */
    productComparison.productCount = function(comparisonTableHeader) {
        var compareArrary = productComparisonBottom.getCompareArray();
        $('.product-comparison .product-count').text(compareArrary.length);
        if (compareArrary.length <= 1) {
            $(comparisonTableHeader).find('.pc__remove').hide();
        }
    };
    /**
     * remove compare data
     */
    productComparison.removeFromCompareData = function(e) {
        var productUrl = $(this).closest('.pc__mainInfo').attr('data-product-url');
        productComparisonBottom.removeCompareDataItem(productUrl, e);
        $('.pc__content .pc__header .pc__row .pc__mainInfo').remove();
        // Remove all product image container
        $('.pc__content .pc__body').empty();
        // Empty whole table body
        productComparison.initCompareData();
    };
    /**
     * change compare type
     */
    productComparison.changeCompareType = function(el) {
        if ($(el).val() === 'difference') {
            $('.pc__content__wrapper .pc__body .pc__row').not('.difference-highlighter').not('.pc__property_category')
                    .hide(500);
            // $('.pc__content__wrapper .pc__body').find('.pc__row:has(.pc__propertyTitle--category)').show();
        } else {
            $('.pc__content__wrapper .pc__body .pc__row').not('.difference-highlighter').show(500);
        }
    };
    /**
     * select compare Item
     */
    productComparison.selectCompareItem = function() {
        var compareArrary = productComparisonBottom.getCompareArray();
        var productUrl = $(this).closest('.pc__mainInfo').attr('data-product-url');
        var index = compareArrary.findIndex(function(item) {
            return item.productUrl === productUrl;
        });
        if (index >= 0) {
            compareArrary.unshift(compareArrary.splice(index, 1)[0]);

            // Remove all product image container
            $('.pc__content .pc__header .pc__row .pc__mainInfo').remove();
            // Empty whole table body
            $('.pc__content .pc__body').empty();
            productComparisonBottom.setCompareArray(compareArrary);
            productComparison.initCompareData();
            $('.pc__content .pc__header').find('.radio input[type="radio"][value=all]').prop('checked', true);
        }
    };
    productComparison.init = function() {
        $(document).ready(function() {
            // Main container
            var comparisonTable = $(".pc__content");
            // Header for product image and name
            var comparisonTableHeader = $(comparisonTable).find('.pc__header');
            productComparison.initCompareData();

            $('.pc__close').click(function() {
                productComparison.closeCompareTable();
            });
            $(comparisonTableHeader).on('click', '.pc__close', productComparison.closeCompareTable);
            $(comparisonTableHeader).on('click', '.add_to_compare--btn', productComparison.closeCompareTable);
            // Change Base product on Select Button click
            $(comparisonTableHeader).on('click', '.pc__selectBtn', productComparison.selectCompareItem);
            // remove one compare product
            $('.pc__header').on('click', '.pc__remove', productComparison.removeFromCompareData);
            // Radio buttons
            $(comparisonTableHeader).find('.radio input[type="radio"][value="all"]').prop('checked', true);
            $(comparisonTableHeader).find('.radio input[type="radio"]').click(function() {
                productComparison.changeCompareType(this);
            });

            $(".product-comparison .download-btn").on('click', function() {
                if ($('html, body').hasClass('rtl')){
                    $('.product-comparison-page').addClass('rtl');
                }
                //Print ele4 with custom options
                $(".product-comparison-page").print({
                    //Use Global styles
                    globalStyles : true,
                    //Add link with attrbute media=print
                    mediaPrint : true,
                    //Custom stylesheet
                    stylesheet : "http://fonts.googleapis.com/css?family=Inconsolata",
                    //Print in a hidden iframe
                    iframe : true,
                    //Don't print this
                    noPrintSelector : ".avoid-this",
                    //Log to console when printing is done via a deffered callback
                    deferred: $.Deferred().done(function() { console.log('Printing done', arguments); })
                });
            });
        });
    };

    return productComparison;
}($));

productComparison.init();

/*
  html2canvas 0.4.1 <http://html2canvas.hertzen.com>
  Copyright (c) 2013 Niklas von Hertzen

  Released under MIT License
*/

(function(window, document, undefined){

    "use strict";
    
    var _html2canvas = {},
    previousElement,
    computedCSS,
    html2canvas;
    
    _html2canvas.Util = {};
    
    _html2canvas.Util.log = function(a) {
      if (_html2canvas.logging && window.console && window.console.log) {
        window.console.log(a);
      }
    };
    
    _html2canvas.Util.trimText = (function(isNative){
      return function(input) {
        return isNative ? isNative.apply(input) : ((input || '') + '').replace( /^\s+|\s+$/g , '' );
      };
    })(String.prototype.trim);
    
    _html2canvas.Util.asFloat = function(v) {
      return parseFloat(v);
    };
    
    (function() {
      // TODO: support all possible length values
      var TEXT_SHADOW_PROPERTY = /((rgba|rgb)\([^\)]+\)(\s-?\d+px){0,})/g;
      var TEXT_SHADOW_VALUES = /(-?\d+px)|(#.+)|(rgb\(.+\))|(rgba\(.+\))/g;
      _html2canvas.Util.parseTextShadows = function (value) {
        if (!value || value === 'none') {
          return [];
        }
    
        // find multiple shadow declarations
        var shadows = value.match(TEXT_SHADOW_PROPERTY),
          results = [];
        for (var i = 0; shadows && (i < shadows.length); i++) {
          var s = shadows[i].match(TEXT_SHADOW_VALUES);
          results.push({
            color: s[0],
            offsetX: s[1] ? s[1].replace('px', '') : 0,
            offsetY: s[2] ? s[2].replace('px', '') : 0,
            blur: s[3] ? s[3].replace('px', '') : 0
          });
        }
        return results;
      };
    })();
    
    
    _html2canvas.Util.parseBackgroundImage = function (value) {
        var whitespace = ' \r\n\t',
            method, definition, prefix, prefix_i, block, results = [],
            c, mode = 0, numParen = 0, quote, args;
    
        var appendResult = function(){
            if(method) {
                if(definition.substr( 0, 1 ) === '"') {
                    definition = definition.substr( 1, definition.length - 2 );
                }
                if(definition) {
                    args.push(definition);
                }
                if(method.substr( 0, 1 ) === '-' &&
                        (prefix_i = method.indexOf( '-', 1 ) + 1) > 0) {
                    prefix = method.substr( 0, prefix_i);
                    method = method.substr( prefix_i );
                }
                results.push({
                    prefix: prefix,
                    method: method.toLowerCase(),
                    value: block,
                    args: args
                });
            }
            args = []; //for some odd reason, setting .length = 0 didn't work in safari
            method =
                prefix =
                definition =
                block = '';
        };
    
        appendResult();
        for(var i = 0, ii = value.length; i<ii; i++) {
            c = value[i];
            if(mode === 0 && whitespace.indexOf( c ) > -1){
                continue;
            }
            switch(c) {
                case '"':
                    if(!quote) {
                        quote = c;
                    }
                    else if(quote === c) {
                        quote = null;
                    }
                    break;
    
                case '(':
                    if(quote) { break; }
                    else if(mode === 0) {
                        mode = 1;
                        block += c;
                        continue;
                    } else {
                        numParen++;
                    }
                    break;
    
                case ')':
                    if(quote) { break; }
                    else if(mode === 1) {
                        if(numParen === 0) {
                            mode = 0;
                            block += c;
                            appendResult();
                            continue;
                        } else {
                            numParen--;
                        }
                    }
                    break;
    
                case ',':
                    if(quote) { break; }
                    else if(mode === 0) {
                        appendResult();
                        continue;
                    }
                    else if (mode === 1) {
                        if(numParen === 0 && !method.match(/^url$/i)) {
                            args.push(definition);
                            definition = '';
                            block += c;
                            continue;
                        }
                    }
                    break;
            }
    
            block += c;
            if(mode === 0) { method += c; }
            else { definition += c; }
        }
        appendResult();
    
        return results;
    };
    
    _html2canvas.Util.Bounds = function (element) {
      var clientRect, bounds = {};
    
      if (element.getBoundingClientRect){
        clientRect = element.getBoundingClientRect();
    
        // TODO add scroll position to bounds, so no scrolling of window necessary
        bounds.top = clientRect.top;
        bounds.bottom = clientRect.bottom || (clientRect.top + clientRect.height);
        bounds.left = clientRect.left;
    
        bounds.width = element.offsetWidth;
        bounds.height = element.offsetHeight;
      }
    
      return bounds;
    };
    
    // TODO ideally, we'd want everything to go through this function instead of Util.Bounds,
    // but would require further work to calculate the correct positions for elements with offsetParents
    _html2canvas.Util.OffsetBounds = function (element) {
      var parent = element.offsetParent ? _html2canvas.Util.OffsetBounds(element.offsetParent) : {top: 0, left: 0};
    
      return {
        top: element.offsetTop + parent.top,
        bottom: element.offsetTop + element.offsetHeight + parent.top,
        left: element.offsetLeft + parent.left,
        width: element.offsetWidth,
        height: element.offsetHeight
      };
    };
    
    function toPX(element, attribute, value ) {
        var rsLeft = element.runtimeStyle && element.runtimeStyle[attribute],
            left,
            style = element.style;
    
        // Check if we are not dealing with pixels, (Opera has issues with this)
        // Ported from jQuery css.js
        // From the awesome hack by Dean Edwards
        // http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291
    
        // If we're not dealing with a regular pixel number
        // but a number that has a weird ending, we need to convert it to pixels
    
        if ( !/^-?[0-9]+\.?[0-9]*(?:px)?$/i.test( value ) && /^-?\d/.test(value) ) {
            // Remember the original values
            left = style.left;
    
            // Put in the new values to get a computed value out
            if (rsLeft) {
                element.runtimeStyle.left = element.currentStyle.left;
            }
            style.left = attribute === "fontSize" ? "1em" : (value || 0);
            value = style.pixelLeft + "px";
    
            // Revert the changed values
            style.left = left;
            if (rsLeft) {
                element.runtimeStyle.left = rsLeft;
            }
        }
    
        if (!/^(thin|medium|thick)$/i.test(value)) {
            return Math.round(parseFloat(value)) + "px";
        }
    
        return value;
    }
    
    function asInt(val) {
        return parseInt(val, 10);
    }
    
    function parseBackgroundSizePosition(value, element, attribute, index) {
        value = (value || '').split(',');
        value = value[index || 0] || value[0] || 'auto';
        value = _html2canvas.Util.trimText(value).split(' ');
    
        if(attribute === 'backgroundSize' && (!value[0] || value[0].match(/cover|contain|auto/))) {
            //these values will be handled in the parent function
        } else {
            value[0] = (value[0].indexOf( "%" ) === -1) ? toPX(element, attribute + "X", value[0]) : value[0];
            if(value[1] === undefined) {
                if(attribute === 'backgroundSize') {
                    value[1] = 'auto';
                    return value;
                } else {
                    // IE 9 doesn't return double digit always
                    value[1] = value[0];
                }
            }
            value[1] = (value[1].indexOf("%") === -1) ? toPX(element, attribute + "Y", value[1]) : value[1];
        }
        return value;
    }
    
    _html2canvas.Util.getCSS = function (element, attribute, index) {
        if (previousElement !== element) {
          computedCSS = document.defaultView.getComputedStyle(element, null);
        }
    
        var value = computedCSS[attribute];
    
        if (/^background(Size|Position)$/.test(attribute)) {
            return parseBackgroundSizePosition(value, element, attribute, index);
        } else if (/border(Top|Bottom)(Left|Right)Radius/.test(attribute)) {
          var arr = value.split(" ");
          if (arr.length <= 1) {
              arr[1] = arr[0];
          }
          return arr.map(asInt);
        }
    
      return value;
    };
    
    _html2canvas.Util.resizeBounds = function( current_width, current_height, target_width, target_height, stretch_mode ){
      var target_ratio = target_width / target_height,
        current_ratio = current_width / current_height,
        output_width, output_height;
    
      if(!stretch_mode || stretch_mode === 'auto') {
        output_width = target_width;
        output_height = target_height;
      } else if(target_ratio < current_ratio ^ stretch_mode === 'contain') {
        output_height = target_height;
        output_width = target_height * current_ratio;
      } else {
        output_width = target_width;
        output_height = target_width / current_ratio;
      }
    
      return {
        width: output_width,
        height: output_height
      };
    };
    
    function backgroundBoundsFactory( prop, el, bounds, image, imageIndex, backgroundSize ) {
        var bgposition =  _html2canvas.Util.getCSS( el, prop, imageIndex ) ,
        topPos,
        left,
        percentage,
        val;
    
        if (bgposition.length === 1){
          val = bgposition[0];
    
          bgposition = [];
    
          bgposition[0] = val;
          bgposition[1] = val;
        }
    
        if (bgposition[0].toString().indexOf("%") !== -1){
          percentage = (parseFloat(bgposition[0])/100);
          left = bounds.width * percentage;
          if(prop !== 'backgroundSize') {
            left -= (backgroundSize || image).width*percentage;
          }
        } else {
          if(prop === 'backgroundSize') {
            if(bgposition[0] === 'auto') {
              left = image.width;
            } else {
              if (/contain|cover/.test(bgposition[0])) {
                var resized = _html2canvas.Util.resizeBounds(image.width, image.height, bounds.width, bounds.height, bgposition[0]);
                left = resized.width;
                topPos = resized.height;
              } else {
                left = parseInt(bgposition[0], 10);
              }
            }
          } else {
            left = parseInt( bgposition[0], 10);
          }
        }
    
    
        if(bgposition[1] === 'auto') {
          topPos = left / image.width * image.height;
        } else if (bgposition[1].toString().indexOf("%") !== -1){
          percentage = (parseFloat(bgposition[1])/100);
          topPos =  bounds.height * percentage;
          if(prop !== 'backgroundSize') {
            topPos -= (backgroundSize || image).height * percentage;
          }
    
        } else {
          topPos = parseInt(bgposition[1],10);
        }
    
        return [left, topPos];
    }
    
    _html2canvas.Util.BackgroundPosition = function( el, bounds, image, imageIndex, backgroundSize ) {
        var result = backgroundBoundsFactory( 'backgroundPosition', el, bounds, image, imageIndex, backgroundSize );
        return { left: result[0], top: result[1] };
    };
    
    _html2canvas.Util.BackgroundSize = function( el, bounds, image, imageIndex ) {
        var result = backgroundBoundsFactory( 'backgroundSize', el, bounds, image, imageIndex );
        return { width: result[0], height: result[1] };
    };
    
    _html2canvas.Util.Extend = function (options, defaults) {
      for (var key in options) {
        if (options.hasOwnProperty(key)) {
          defaults[key] = options[key];
        }
      }
      return defaults;
    };
    
    
    /*
     * Derived from jQuery.contents()
     * Copyright 2010, John Resig
     * Dual licensed under the MIT or GPL Version 2 licenses.
     * http://jquery.org/license
     */
    _html2canvas.Util.Children = function( elem ) {
      var children;
      try {
        children = (elem.nodeName && elem.nodeName.toUpperCase() === "IFRAME") ? elem.contentDocument || elem.contentWindow.document : (function(array) {
          var ret = [];
          if (array !== null) {
            (function(first, second ) {
              var i = first.length,
              j = 0;
    
              if (typeof second.length === "number") {
                for (var l = second.length; j < l; j++) {
                  first[i++] = second[j];
                }
              } else {
                while (second[j] !== undefined) {
                  first[i++] = second[j++];
                }
              }
    
              first.length = i;
    
              return first;
            })(ret, array);
          }
          return ret;
        })(elem.childNodes);
    
      } catch (ex) {
        _html2canvas.Util.log("html2canvas.Util.Children failed with exception: " + ex.message);
        children = [];
      }
      return children;
    };
    
    _html2canvas.Util.isTransparent = function(backgroundColor) {
      return (backgroundColor === "transparent" || backgroundColor === "rgba(0, 0, 0, 0)");
    };
    _html2canvas.Util.Font = (function () {
    
      var fontData = {};
    
      return function(font, fontSize, doc) {
        if (fontData[font + "-" + fontSize] !== undefined) {
          return fontData[font + "-" + fontSize];
        }
    
        var container = doc.createElement('div'),
        img = doc.createElement('img'),
        span = doc.createElement('span'),
        sampleText = 'Hidden Text',
        baseline,
        middle,
        metricsObj;
    
        container.style.visibility = "hidden";
        container.style.fontFamily = font;
        container.style.fontSize = fontSize;
        container.style.margin = 0;
        container.style.padding = 0;
    
        doc.body.appendChild(container);
    
        // http://probablyprogramming.com/2009/03/15/the-tiniest-gif-ever (handtinywhite.gif)
        img.src = "data:image/gif;base64,R0lGODlhAQABAIABAP///wAAACwAAAAAAQABAAACAkQBADs=";
        img.width = 1;
        img.height = 1;
    
        img.style.margin = 0;
        img.style.padding = 0;
        img.style.verticalAlign = "baseline";
    
        span.style.fontFamily = font;
        span.style.fontSize = fontSize;
        span.style.margin = 0;
        span.style.padding = 0;
    
        span.appendChild(doc.createTextNode(sampleText));
        container.appendChild(span);
        container.appendChild(img);
        baseline = (img.offsetTop - span.offsetTop) + 1;
    
        container.removeChild(span);
        container.appendChild(doc.createTextNode(sampleText));
    
        container.style.lineHeight = "normal";
        img.style.verticalAlign = "super";
    
        middle = (img.offsetTop-container.offsetTop) + 1;
        metricsObj = {
          baseline: baseline,
          lineWidth: 1,
          middle: middle
        };
    
        fontData[font + "-" + fontSize] = metricsObj;
    
        doc.body.removeChild(container);
    
        return metricsObj;
      };
    })();
    
    (function(){
      var Util = _html2canvas.Util,
        Generate = {};
    
      _html2canvas.Generate = Generate;
    
      var reGradients = [
      /^(-webkit-linear-gradient)\(([a-z\s]+)([\w\d\.\s,%\(\)]+)\)$/,
      /^(-o-linear-gradient)\(([a-z\s]+)([\w\d\.\s,%\(\)]+)\)$/,
      /^(-webkit-gradient)\((linear|radial),\s((?:\d{1,3}%?)\s(?:\d{1,3}%?),\s(?:\d{1,3}%?)\s(?:\d{1,3}%?))([\w\d\.\s,%\(\)\-]+)\)$/,
      /^(-moz-linear-gradient)\(((?:\d{1,3}%?)\s(?:\d{1,3}%?))([\w\d\.\s,%\(\)]+)\)$/,
      /^(-webkit-radial-gradient)\(((?:\d{1,3}%?)\s(?:\d{1,3}%?)),\s(\w+)\s([a-z\-]+)([\w\d\.\s,%\(\)]+)\)$/,
      /^(-moz-radial-gradient)\(((?:\d{1,3}%?)\s(?:\d{1,3}%?)),\s(\w+)\s?([a-z\-]*)([\w\d\.\s,%\(\)]+)\)$/,
      /^(-o-radial-gradient)\(((?:\d{1,3}%?)\s(?:\d{1,3}%?)),\s(\w+)\s([a-z\-]+)([\w\d\.\s,%\(\)]+)\)$/
      ];
    
      /*
     * TODO: Add IE10 vendor prefix (-ms) support
     * TODO: Add W3C gradient (linear-gradient) support
     * TODO: Add old Webkit -webkit-gradient(radial, ...) support
     * TODO: Maybe some RegExp optimizations are possible ;o)
     */
      Generate.parseGradient = function(css, bounds) {
        var gradient, i, len = reGradients.length, m1, stop, m2, m2Len, step, m3, tl,tr,br,bl;
    
        for(i = 0; i < len; i+=1){
          m1 = css.match(reGradients[i]);
          if(m1) {
            break;
          }
        }
    
        if(m1) {
          switch(m1[1]) {
            case '-webkit-linear-gradient':
            case '-o-linear-gradient':
    
              gradient = {
                type: 'linear',
                x0: null,
                y0: null,
                x1: null,
                y1: null,
                colorStops: []
              };
    
              // get coordinates
              m2 = m1[2].match(/\w+/g);
              if(m2){
                m2Len = m2.length;
                for(i = 0; i < m2Len; i+=1){
                  switch(m2[i]) {
                    case 'top':
                      gradient.y0 = 0;
                      gradient.y1 = bounds.height;
                      break;
    
                    case 'right':
                      gradient.x0 = bounds.width;
                      gradient.x1 = 0;
                      break;
    
                    case 'bottom':
                      gradient.y0 = bounds.height;
                      gradient.y1 = 0;
                      break;
    
                    case 'left':
                      gradient.x0 = 0;
                      gradient.x1 = bounds.width;
                      break;
                  }
                }
              }
              if(gradient.x0 === null && gradient.x1 === null){ // center
                gradient.x0 = gradient.x1 = bounds.width / 2;
              }
              if(gradient.y0 === null && gradient.y1 === null){ // center
                gradient.y0 = gradient.y1 = bounds.height / 2;
              }
    
              // get colors and stops
              m2 = m1[3].match(/((?:rgb|rgba)\(\d{1,3},\s\d{1,3},\s\d{1,3}(?:,\s[0-9\.]+)?\)(?:\s\d{1,3}(?:%|px))?)+/g);
              if(m2){
                m2Len = m2.length;
                step = 1 / Math.max(m2Len - 1, 1);
                for(i = 0; i < m2Len; i+=1){
                  m3 = m2[i].match(/((?:rgb|rgba)\(\d{1,3},\s\d{1,3},\s\d{1,3}(?:,\s[0-9\.]+)?\))\s*(\d{1,3})?(%|px)?/);
                  if(m3[2]){
                    stop = parseFloat(m3[2]);
                    if(m3[3] === '%'){
                      stop /= 100;
                    } else { // px - stupid opera
                      stop /= bounds.width;
                    }
                  } else {
                    stop = i * step;
                  }
                  gradient.colorStops.push({
                    color: m3[1],
                    stop: stop
                  });
                }
              }
              break;
    
            case '-webkit-gradient':
    
              gradient = {
                type: m1[2] === 'radial' ? 'circle' : m1[2], // TODO: Add radial gradient support for older mozilla definitions
                x0: 0,
                y0: 0,
                x1: 0,
                y1: 0,
                colorStops: []
              };
    
              // get coordinates
              m2 = m1[3].match(/(\d{1,3})%?\s(\d{1,3})%?,\s(\d{1,3})%?\s(\d{1,3})%?/);
              if(m2){
                gradient.x0 = (m2[1] * bounds.width) / 100;
                gradient.y0 = (m2[2] * bounds.height) / 100;
                gradient.x1 = (m2[3] * bounds.width) / 100;
                gradient.y1 = (m2[4] * bounds.height) / 100;
              }
    
              // get colors and stops
              m2 = m1[4].match(/((?:from|to|color-stop)\((?:[0-9\.]+,\s)?(?:rgb|rgba)\(\d{1,3},\s\d{1,3},\s\d{1,3}(?:,\s[0-9\.]+)?\)\))+/g);
              if(m2){
                m2Len = m2.length;
                for(i = 0; i < m2Len; i+=1){
                  m3 = m2[i].match(/(from|to|color-stop)\(([0-9\.]+)?(?:,\s)?((?:rgb|rgba)\(\d{1,3},\s\d{1,3},\s\d{1,3}(?:,\s[0-9\.]+)?\))\)/);
                  stop = parseFloat(m3[2]);
                  if(m3[1] === 'from') {
                    stop = 0.0;
                  }
                  if(m3[1] === 'to') {
                    stop = 1.0;
                  }
                  gradient.colorStops.push({
                    color: m3[3],
                    stop: stop
                  });
                }
              }
              break;
    
            case '-moz-linear-gradient':
    
              gradient = {
                type: 'linear',
                x0: 0,
                y0: 0,
                x1: 0,
                y1: 0,
                colorStops: []
              };
    
              // get coordinates
              m2 = m1[2].match(/(\d{1,3})%?\s(\d{1,3})%?/);
    
              // m2[1] == 0%   -> left
              // m2[1] == 50%  -> center
              // m2[1] == 100% -> right
    
              // m2[2] == 0%   -> top
              // m2[2] == 50%  -> center
              // m2[2] == 100% -> bottom
    
              if(m2){
                gradient.x0 = (m2[1] * bounds.width) / 100;
                gradient.y0 = (m2[2] * bounds.height) / 100;
                gradient.x1 = bounds.width - gradient.x0;
                gradient.y1 = bounds.height - gradient.y0;
              }
    
              // get colors and stops
              m2 = m1[3].match(/((?:rgb|rgba)\(\d{1,3},\s\d{1,3},\s\d{1,3}(?:,\s[0-9\.]+)?\)(?:\s\d{1,3}%)?)+/g);
              if(m2){
                m2Len = m2.length;
                step = 1 / Math.max(m2Len - 1, 1);
                for(i = 0; i < m2Len; i+=1){
                  m3 = m2[i].match(/((?:rgb|rgba)\(\d{1,3},\s\d{1,3},\s\d{1,3}(?:,\s[0-9\.]+)?\))\s*(\d{1,3})?(%)?/);
                  if(m3[2]){
                    stop = parseFloat(m3[2]);
                    if(m3[3]){ // percentage
                      stop /= 100;
                    }
                  } else {
                    stop = i * step;
                  }
                  gradient.colorStops.push({
                    color: m3[1],
                    stop: stop
                  });
                }
              }
              break;
    
            case '-webkit-radial-gradient':
            case '-moz-radial-gradient':
            case '-o-radial-gradient':
    
              gradient = {
                type: 'circle',
                x0: 0,
                y0: 0,
                x1: bounds.width,
                y1: bounds.height,
                cx: 0,
                cy: 0,
                rx: 0,
                ry: 0,
                colorStops: []
              };
    
              // center
              m2 = m1[2].match(/(\d{1,3})%?\s(\d{1,3})%?/);
              if(m2){
                gradient.cx = (m2[1] * bounds.width) / 100;
                gradient.cy = (m2[2] * bounds.height) / 100;
              }
    
              // size
              m2 = m1[3].match(/\w+/);
              m3 = m1[4].match(/[a-z\-]*/);
              if(m2 && m3){
                switch(m3[0]){
                  case 'farthest-corner':
                  case 'cover': // is equivalent to farthest-corner
                  case '': // mozilla removes "cover" from definition :(
                    tl = Math.sqrt(Math.pow(gradient.cx, 2) + Math.pow(gradient.cy, 2));
                    tr = Math.sqrt(Math.pow(gradient.cx, 2) + Math.pow(gradient.y1 - gradient.cy, 2));
                    br = Math.sqrt(Math.pow(gradient.x1 - gradient.cx, 2) + Math.pow(gradient.y1 - gradient.cy, 2));
                    bl = Math.sqrt(Math.pow(gradient.x1 - gradient.cx, 2) + Math.pow(gradient.cy, 2));
                    gradient.rx = gradient.ry = Math.max(tl, tr, br, bl);
                    break;
                  case 'closest-corner':
                    tl = Math.sqrt(Math.pow(gradient.cx, 2) + Math.pow(gradient.cy, 2));
                    tr = Math.sqrt(Math.pow(gradient.cx, 2) + Math.pow(gradient.y1 - gradient.cy, 2));
                    br = Math.sqrt(Math.pow(gradient.x1 - gradient.cx, 2) + Math.pow(gradient.y1 - gradient.cy, 2));
                    bl = Math.sqrt(Math.pow(gradient.x1 - gradient.cx, 2) + Math.pow(gradient.cy, 2));
                    gradient.rx = gradient.ry = Math.min(tl, tr, br, bl);
                    break;
                  case 'farthest-side':
                    if(m2[0] === 'circle'){
                      gradient.rx = gradient.ry = Math.max(
                        gradient.cx,
                        gradient.cy,
                        gradient.x1 - gradient.cx,
                        gradient.y1 - gradient.cy
                        );
                    } else { // ellipse
    
                      gradient.type = m2[0];
    
                      gradient.rx = Math.max(
                        gradient.cx,
                        gradient.x1 - gradient.cx
                        );
                      gradient.ry = Math.max(
                        gradient.cy,
                        gradient.y1 - gradient.cy
                        );
                    }
                    break;
                  case 'closest-side':
                  case 'contain': // is equivalent to closest-side
                    if(m2[0] === 'circle'){
                      gradient.rx = gradient.ry = Math.min(
                        gradient.cx,
                        gradient.cy,
                        gradient.x1 - gradient.cx,
                        gradient.y1 - gradient.cy
                        );
                    } else { // ellipse
    
                      gradient.type = m2[0];
    
                      gradient.rx = Math.min(
                        gradient.cx,
                        gradient.x1 - gradient.cx
                        );
                      gradient.ry = Math.min(
                        gradient.cy,
                        gradient.y1 - gradient.cy
                        );
                    }
                    break;
    
                // TODO: add support for "30px 40px" sizes (webkit only)
                }
              }
    
              // color stops
              m2 = m1[5].match(/((?:rgb|rgba)\(\d{1,3},\s\d{1,3},\s\d{1,3}(?:,\s[0-9\.]+)?\)(?:\s\d{1,3}(?:%|px))?)+/g);
              if(m2){
                m2Len = m2.length;
                step = 1 / Math.max(m2Len - 1, 1);
                for(i = 0; i < m2Len; i+=1){
                  m3 = m2[i].match(/((?:rgb|rgba)\(\d{1,3},\s\d{1,3},\s\d{1,3}(?:,\s[0-9\.]+)?\))\s*(\d{1,3})?(%|px)?/);
                  if(m3[2]){
                    stop = parseFloat(m3[2]);
                    if(m3[3] === '%'){
                      stop /= 100;
                    } else { // px - stupid opera
                      stop /= bounds.width;
                    }
                  } else {
                    stop = i * step;
                  }
                  gradient.colorStops.push({
                    color: m3[1],
                    stop: stop
                  });
                }
              }
              break;
          }
        }
    
        return gradient;
      };
    
      function addScrollStops(grad) {
        return function(colorStop) {
          try {
            grad.addColorStop(colorStop.stop, colorStop.color);
          }
          catch(e) {
            Util.log(['failed to add color stop: ', e, '; tried to add: ', colorStop]);
          }
        };
      }
    
      Generate.Gradient = function(src, bounds) {
        if(bounds.width === 0 || bounds.height === 0) {
          return;
        }
    
        var canvas = document.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        gradient, grad;
    
        canvas.width = bounds.width;
        canvas.height = bounds.height;
    
        // TODO: add support for multi defined background gradients
        gradient = _html2canvas.Generate.parseGradient(src, bounds);
    
        if(gradient) {
          switch(gradient.type) {
            case 'linear':
              grad = ctx.createLinearGradient(gradient.x0, gradient.y0, gradient.x1, gradient.y1);
              gradient.colorStops.forEach(addScrollStops(grad));
              ctx.fillStyle = grad;
              ctx.fillRect(0, 0, bounds.width, bounds.height);
              break;
    
            case 'circle':
              grad = ctx.createRadialGradient(gradient.cx, gradient.cy, 0, gradient.cx, gradient.cy, gradient.rx);
              gradient.colorStops.forEach(addScrollStops(grad));
              ctx.fillStyle = grad;
              ctx.fillRect(0, 0, bounds.width, bounds.height);
              break;
    
            case 'ellipse':
              var canvasRadial = document.createElement('canvas'),
                ctxRadial = canvasRadial.getContext('2d'),
                ri = Math.max(gradient.rx, gradient.ry),
                di = ri * 2;
    
              canvasRadial.width = canvasRadial.height = di;
    
              grad = ctxRadial.createRadialGradient(gradient.rx, gradient.ry, 0, gradient.rx, gradient.ry, ri);
              gradient.colorStops.forEach(addScrollStops(grad));
    
              ctxRadial.fillStyle = grad;
              ctxRadial.fillRect(0, 0, di, di);
    
              ctx.fillStyle = gradient.colorStops[gradient.colorStops.length - 1].color;
              ctx.fillRect(0, 0, canvas.width, canvas.height);
              ctx.drawImage(canvasRadial, gradient.cx - gradient.rx, gradient.cy - gradient.ry, 2 * gradient.rx, 2 * gradient.ry);
              break;
          }
        }
    
        return canvas;
      };
    
      Generate.ListAlpha = function(number) {
        var tmp = "",
        modulus;
    
        do {
          modulus = number % 26;
          tmp = String.fromCharCode((modulus) + 64) + tmp;
          number = number / 26;
        }while((number*26) > 26);
    
        return tmp;
      };
    
      Generate.ListRoman = function(number) {
        var romanArray = ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"],
        decimal = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1],
        roman = "",
        v,
        len = romanArray.length;
    
        if (number <= 0 || number >= 4000) {
          return number;
        }
    
        for (v=0; v < len; v+=1) {
          while (number >= decimal[v]) {
            number -= decimal[v];
            roman += romanArray[v];
          }
        }
    
        return roman;
      };
    })();
    function h2cRenderContext(width, height) {
      var storage = [];
      return {
        storage: storage,
        width: width,
        height: height,
        clip: function() {
          storage.push({
            type: "function",
            name: "clip",
            'arguments': arguments
          });
        },
        translate: function() {
          storage.push({
            type: "function",
            name: "translate",
            'arguments': arguments
          });
        },
        fill: function() {
          storage.push({
            type: "function",
            name: "fill",
            'arguments': arguments
          });
        },
        save: function() {
          storage.push({
            type: "function",
            name: "save",
            'arguments': arguments
          });
        },
        restore: function() {
          storage.push({
            type: "function",
            name: "restore",
            'arguments': arguments
          });
        },
        fillRect: function () {
          storage.push({
            type: "function",
            name: "fillRect",
            'arguments': arguments
          });
        },
        createPattern: function() {
          storage.push({
            type: "function",
            name: "createPattern",
            'arguments': arguments
          });
        },
        drawShape: function() {
    
          var shape = [];
    
          storage.push({
            type: "function",
            name: "drawShape",
            'arguments': shape
          });
    
          return {
            moveTo: function() {
              shape.push({
                name: "moveTo",
                'arguments': arguments
              });
            },
            lineTo: function() {
              shape.push({
                name: "lineTo",
                'arguments': arguments
              });
            },
            arcTo: function() {
              shape.push({
                name: "arcTo",
                'arguments': arguments
              });
            },
            bezierCurveTo: function() {
              shape.push({
                name: "bezierCurveTo",
                'arguments': arguments
              });
            },
            quadraticCurveTo: function() {
              shape.push({
                name: "quadraticCurveTo",
                'arguments': arguments
              });
            }
          };
    
        },
        drawImage: function () {
          storage.push({
            type: "function",
            name: "drawImage",
            'arguments': arguments
          });
        },
        fillText: function () {
          storage.push({
            type: "function",
            name: "fillText",
            'arguments': arguments
          });
        },
        setVariable: function (variable, value) {
          storage.push({
            type: "variable",
            name: variable,
            'arguments': value
          });
          return value;
        }
      };
    }
    _html2canvas.Parse = function (images, options) {
      window.scroll(0,0);
    
      var element = (( options.elements === undefined ) ? document.body : options.elements[0]), // select body by default
      numDraws = 0,
      doc = element.ownerDocument,
      Util = _html2canvas.Util,
      support = Util.Support(options, doc),
      ignoreElementsRegExp = new RegExp("(" + options.ignoreElements + ")"),
      body = doc.body,
      getCSS = Util.getCSS,
      pseudoHide = "___html2canvas___pseudoelement",
      hidePseudoElements = doc.createElement('style');
    
      hidePseudoElements.innerHTML = '.' + pseudoHide + '-before:before { content: "" !important; display: none !important; }' +
      '.' + pseudoHide + '-after:after { content: "" !important; display: none !important; }';
    
      body.appendChild(hidePseudoElements);
    
      images = images || {};
    
      function documentWidth () {
        return Math.max(
          Math.max(doc.body.scrollWidth, doc.documentElement.scrollWidth),
          Math.max(doc.body.offsetWidth, doc.documentElement.offsetWidth),
          Math.max(doc.body.clientWidth, doc.documentElement.clientWidth)
          );
      }
    
      function documentHeight () {
        return Math.max(
          Math.max(doc.body.scrollHeight, doc.documentElement.scrollHeight),
          Math.max(doc.body.offsetHeight, doc.documentElement.offsetHeight),
          Math.max(doc.body.clientHeight, doc.documentElement.clientHeight)
          );
      }
    
      function getCSSInt(element, attribute) {
        var val = parseInt(getCSS(element, attribute), 10);
        return (isNaN(val)) ? 0 : val; // borders in old IE are throwing 'medium' for demo.html
      }
    
      function renderRect (ctx, x, y, w, h, bgcolor) {
        if (bgcolor !== "transparent"){
          ctx.setVariable("fillStyle", bgcolor);
          ctx.fillRect(x, y, w, h);
          numDraws+=1;
        }
      }
    
      function capitalize(m, p1, p2) {
        if (m.length > 0) {
          return p1 + p2.toUpperCase();
        }
      }
    
      function textTransform (text, transform) {
        switch(transform){
          case "lowercase":
            return text.toLowerCase();
          case "capitalize":
            return text.replace( /(^|\s|:|-|\(|\))([a-z])/g, capitalize);
          case "uppercase":
            return text.toUpperCase();
          default:
            return text;
        }
      }
    
      function noLetterSpacing(letter_spacing) {
        return (/^(normal|none|0px)$/.test(letter_spacing));
      }
    
      function drawText(currentText, x, y, ctx){
        if (currentText !== null && Util.trimText(currentText).length > 0) {
          ctx.fillText(currentText, x, y);
          numDraws+=1;
        }
      }
    
      function setTextVariables(ctx, el, text_decoration, color) {
        var align = false,
        bold = getCSS(el, "fontWeight"),
        family = getCSS(el, "fontFamily"),
        size = getCSS(el, "fontSize"),
        shadows = Util.parseTextShadows(getCSS(el, "textShadow"));
    
        switch(parseInt(bold, 10)){
          case 401:
            bold = "bold";
            break;
          case 400:
            bold = "normal";
            break;
        }
    
        ctx.setVariable("fillStyle", color);
        ctx.setVariable("font", [getCSS(el, "fontStyle"), getCSS(el, "fontVariant"), bold, size, family].join(" "));
        ctx.setVariable("textAlign", (align) ? "right" : "left");
    
        if (shadows.length) {
          // TODO: support multiple text shadows
          // apply the first text shadow
          ctx.setVariable("shadowColor", shadows[0].color);
          ctx.setVariable("shadowOffsetX", shadows[0].offsetX);
          ctx.setVariable("shadowOffsetY", shadows[0].offsetY);
          ctx.setVariable("shadowBlur", shadows[0].blur);
        }
    
        if (text_decoration !== "none"){
          return Util.Font(family, size, doc);
        }
      }
    
      function renderTextDecoration(ctx, text_decoration, bounds, metrics, color) {
        switch(text_decoration) {
          case "underline":
            // Draws a line at the baseline of the font
            // TODO As some browsers display the line as more than 1px if the font-size is big, need to take that into account both in position and size
            renderRect(ctx, bounds.left, Math.round(bounds.top + metrics.baseline + metrics.lineWidth), bounds.width, 1, color);
            break;
          case "overline":
            renderRect(ctx, bounds.left, Math.round(bounds.top), bounds.width, 1, color);
            break;
          case "line-through":
            // TODO try and find exact position for line-through
            renderRect(ctx, bounds.left, Math.ceil(bounds.top + metrics.middle + metrics.lineWidth), bounds.width, 1, color);
            break;
        }
      }
    
      function getTextBounds(state, text, textDecoration, isLast, transform) {
        var bounds;
        if (support.rangeBounds && !transform) {
          if (textDecoration !== "none" || Util.trimText(text).length !== 0) {
            bounds = textRangeBounds(text, state.node, state.textOffset);
          }
          state.textOffset += text.length;
        } else if (state.node && typeof state.node.nodeValue === "string" ){
          var newTextNode = (isLast) ? state.node.splitText(text.length) : null;
          bounds = textWrapperBounds(state.node, transform);
          state.node = newTextNode;
        }
        return bounds;
      }
    
      function textRangeBounds(text, textNode, textOffset) {
        var range = doc.createRange();
        range.setStart(textNode, textOffset);
        range.setEnd(textNode, textOffset + text.length);
        return range.getBoundingClientRect();
      }
    
      function textWrapperBounds(oldTextNode, transform) {
        var parent = oldTextNode.parentNode,
        wrapElement = doc.createElement('wrapper'),
        backupText = oldTextNode.cloneNode(true);
    
        wrapElement.appendChild(oldTextNode.cloneNode(true));
        parent.replaceChild(wrapElement, oldTextNode);
    
        var bounds = transform ? Util.OffsetBounds(wrapElement) : Util.Bounds(wrapElement);
        parent.replaceChild(backupText, wrapElement);
        return bounds;
      }
    
      function renderText(el, textNode, stack) {
        var ctx = stack.ctx,
        color = getCSS(el, "color"),
        textDecoration = getCSS(el, "textDecoration"),
        textAlign = getCSS(el, "textAlign"),
        metrics,
        textList,
        state = {
          node: textNode,
          textOffset: 0
        };
    
        if (Util.trimText(textNode.nodeValue).length > 0) {
          textNode.nodeValue = textTransform(textNode.nodeValue, getCSS(el, "textTransform"));
          textAlign = textAlign.replace(["-webkit-auto"],["auto"]);
    
          textList = (!options.letterRendering && /^(left|right|justify|auto)$/.test(textAlign) && noLetterSpacing(getCSS(el, "letterSpacing"))) ?
          textNode.nodeValue.split(/(\b| )/)
          : textNode.nodeValue.split("");
    
          metrics = setTextVariables(ctx, el, textDecoration, color);
    
          if (options.chinese) {
            textList.forEach(function(word, index) {
              if (/.*[\u4E00-\u9FA5].*$/.test(word)) {
                word = word.split("");
                word.unshift(index, 1);
                textList.splice.apply(textList, word);
              }
            });
          }
    
          textList.forEach(function(text, index) {
            var bounds = getTextBounds(state, text, textDecoration, (index < textList.length - 1), stack.transform.matrix);
            if (bounds) {
              drawText(text, bounds.left, bounds.bottom, ctx);
              renderTextDecoration(ctx, textDecoration, bounds, metrics, color);
            }
          });
        }
      }
    
      function listPosition (element, val) {
        var boundElement = doc.createElement( "boundelement" ),
        originalType,
        bounds;
    
        boundElement.style.display = "inline";
    
        originalType = element.style.listStyleType;
        element.style.listStyleType = "none";
    
        boundElement.appendChild(doc.createTextNode(val));
    
        element.insertBefore(boundElement, element.firstChild);
    
        bounds = Util.Bounds(boundElement);
        element.removeChild(boundElement);
        element.style.listStyleType = originalType;
        return bounds;
      }
    
      function elementIndex(el) {
        var i = -1,
        count = 1,
        childs = el.parentNode.childNodes;
    
        if (el.parentNode) {
          while(childs[++i] !== el) {
            if (childs[i].nodeType === 1) {
              count++;
            }
          }
          return count;
        } else {
          return -1;
        }
      }
    
      function listItemText(element, type) {
        var currentIndex = elementIndex(element), text;
        switch(type){
          case "decimal":
            text = currentIndex;
            break;
          case "decimal-leading-zero":
            text = (currentIndex.toString().length === 1) ? currentIndex = "0" + currentIndex.toString() : currentIndex.toString();
            break;
          case "upper-roman":
            text = _html2canvas.Generate.ListRoman( currentIndex );
            break;
          case "lower-roman":
            text = _html2canvas.Generate.ListRoman( currentIndex ).toLowerCase();
            break;
          case "lower-alpha":
            text = _html2canvas.Generate.ListAlpha( currentIndex ).toLowerCase();
            break;
          case "upper-alpha":
            text = _html2canvas.Generate.ListAlpha( currentIndex );
            break;
        }
    
        return text + ". ";
      }
    
      function renderListItem(element, stack, elBounds) {
        var x,
        text,
        ctx = stack.ctx,
        type = getCSS(element, "listStyleType"),
        listBounds;
    
        if (/^(decimal|decimal-leading-zero|upper-alpha|upper-latin|upper-roman|lower-alpha|lower-greek|lower-latin|lower-roman)$/i.test(type)) {
          text = listItemText(element, type);
          listBounds = listPosition(element, text);
          setTextVariables(ctx, element, "none", getCSS(element, "color"));
    
          if (getCSS(element, "listStylePosition") === "inside") {
            ctx.setVariable("textAlign", "left");
            x = elBounds.left;
          } else {
            return;
          }
    
          drawText(text, x, listBounds.bottom, ctx);
        }
      }
    
      function loadImage (src){
        var img = images[src];
        return (img && img.succeeded === true) ? img.img : false;
      }
    
      function clipBounds(src, dst){
        var x = Math.max(src.left, dst.left),
        y = Math.max(src.top, dst.top),
        x2 = Math.min((src.left + src.width), (dst.left + dst.width)),
        y2 = Math.min((src.top + src.height), (dst.top + dst.height));
    
        return {
          left:x,
          top:y,
          width:x2-x,
          height:y2-y
        };
      }
    
      function setZ(element, stack, parentStack){
        var newContext,
        isPositioned = stack.cssPosition !== 'static',
        zIndex = isPositioned ? getCSS(element, 'zIndex') : 'auto',
        opacity = getCSS(element, 'opacity'),
        isFloated = getCSS(element, 'cssFloat') !== 'none';
    
        // https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Understanding_z_index/The_stacking_context
        // When a new stacking context should be created:
        // the root element (HTML),
        // positioned (absolutely or relatively) with a z-index value other than "auto",
        // elements with an opacity value less than 1. (See the specification for opacity),
        // on mobile WebKit and Chrome 22+, position: fixed always creates a new stacking context, even when z-index is "auto" (See this post)
    
        stack.zIndex = newContext = h2czContext(zIndex);
        newContext.isPositioned = isPositioned;
        newContext.isFloated = isFloated;
        newContext.opacity = opacity;
        newContext.ownStacking = (zIndex !== 'auto' || opacity < 1);
    
        if (parentStack) {
          parentStack.zIndex.children.push(stack);
        }
      }
    
      function renderImage(ctx, element, image, bounds, borders) {
    
        var paddingLeft = getCSSInt(element, 'paddingLeft'),
        paddingTop = getCSSInt(element, 'paddingTop'),
        paddingRight = getCSSInt(element, 'paddingRight'),
        paddingBottom = getCSSInt(element, 'paddingBottom');
    
        drawImage(
          ctx,
          image,
          0, //sx
          0, //sy
          image.width, //sw
          image.height, //sh
          bounds.left + paddingLeft + borders[3].width, //dx
          bounds.top + paddingTop + borders[0].width, // dy
          bounds.width - (borders[1].width + borders[3].width + paddingLeft + paddingRight), //dw
          bounds.height - (borders[0].width + borders[2].width + paddingTop + paddingBottom) //dh
          );
      }
    
      function getBorderData(element) {
        return ["Top", "Right", "Bottom", "Left"].map(function(side) {
          return {
            width: getCSSInt(element, 'border' + side + 'Width'),
            color: getCSS(element, 'border' + side + 'Color')
          };
        });
      }
    
      function getBorderRadiusData(element) {
        return ["TopLeft", "TopRight", "BottomRight", "BottomLeft"].map(function(side) {
          return getCSS(element, 'border' + side + 'Radius');
        });
      }
    
      var getCurvePoints = (function(kappa) {
    
        return function(x, y, r1, r2) {
          var ox = (r1) * kappa, // control point offset horizontal
          oy = (r2) * kappa, // control point offset vertical
          xm = x + r1, // x-middle
          ym = y + r2; // y-middle
          return {
            topLeft: bezierCurve({
              x:x,
              y:ym
            }, {
              x:x,
              y:ym - oy
            }, {
              x:xm - ox,
              y:y
            }, {
              x:xm,
              y:y
            }),
            topRight: bezierCurve({
              x:x,
              y:y
            }, {
              x:x + ox,
              y:y
            }, {
              x:xm,
              y:ym - oy
            }, {
              x:xm,
              y:ym
            }),
            bottomRight: bezierCurve({
              x:xm,
              y:y
            }, {
              x:xm,
              y:y + oy
            }, {
              x:x + ox,
              y:ym
            }, {
              x:x,
              y:ym
            }),
            bottomLeft: bezierCurve({
              x:xm,
              y:ym
            }, {
              x:xm - ox,
              y:ym
            }, {
              x:x,
              y:y + oy
            }, {
              x:x,
              y:y
            })
          };
        };
      })(4 * ((Math.sqrt(2) - 1) / 3));
    
      function bezierCurve(start, startControl, endControl, end) {
    
        var lerp = function (a, b, t) {
          return {
            x:a.x + (b.x - a.x) * t,
            y:a.y + (b.y - a.y) * t
          };
        };
    
        return {
          start: start,
          startControl: startControl,
          endControl: endControl,
          end: end,
          subdivide: function(t) {
            var ab = lerp(start, startControl, t),
            bc = lerp(startControl, endControl, t),
            cd = lerp(endControl, end, t),
            abbc = lerp(ab, bc, t),
            bccd = lerp(bc, cd, t),
            dest = lerp(abbc, bccd, t);
            return [bezierCurve(start, ab, abbc, dest), bezierCurve(dest, bccd, cd, end)];
          },
          curveTo: function(borderArgs) {
            borderArgs.push(["bezierCurve", startControl.x, startControl.y, endControl.x, endControl.y, end.x, end.y]);
          },
          curveToReversed: function(borderArgs) {
            borderArgs.push(["bezierCurve", endControl.x, endControl.y, startControl.x, startControl.y, start.x, start.y]);
          }
        };
      }
    
      function parseCorner(borderArgs, radius1, radius2, corner1, corner2, x, y) {
        if (radius1[0] > 0 || radius1[1] > 0) {
          borderArgs.push(["line", corner1[0].start.x, corner1[0].start.y]);
          corner1[0].curveTo(borderArgs);
          corner1[1].curveTo(borderArgs);
        } else {
          borderArgs.push(["line", x, y]);
        }
    
        if (radius2[0] > 0 || radius2[1] > 0) {
          borderArgs.push(["line", corner2[0].start.x, corner2[0].start.y]);
        }
      }
    
      function drawSide(borderData, radius1, radius2, outer1, inner1, outer2, inner2) {
        var borderArgs = [];
    
        if (radius1[0] > 0 || radius1[1] > 0) {
          borderArgs.push(["line", outer1[1].start.x, outer1[1].start.y]);
          outer1[1].curveTo(borderArgs);
        } else {
          borderArgs.push([ "line", borderData.c1[0], borderData.c1[1]]);
        }
    
        if (radius2[0] > 0 || radius2[1] > 0) {
          borderArgs.push(["line", outer2[0].start.x, outer2[0].start.y]);
          outer2[0].curveTo(borderArgs);
          borderArgs.push(["line", inner2[0].end.x, inner2[0].end.y]);
          inner2[0].curveToReversed(borderArgs);
        } else {
          borderArgs.push([ "line", borderData.c2[0], borderData.c2[1]]);
          borderArgs.push([ "line", borderData.c3[0], borderData.c3[1]]);
        }
    
        if (radius1[0] > 0 || radius1[1] > 0) {
          borderArgs.push(["line", inner1[1].end.x, inner1[1].end.y]);
          inner1[1].curveToReversed(borderArgs);
        } else {
          borderArgs.push([ "line", borderData.c4[0], borderData.c4[1]]);
        }
    
        return borderArgs;
      }
    
      function calculateCurvePoints(bounds, borderRadius, borders) {
    
        var x = bounds.left,
        y = bounds.top,
        width = bounds.width,
        height = bounds.height,
    
        tlh = borderRadius[0][0],
        tlv = borderRadius[0][1],
        trh = borderRadius[1][0],
        trv = borderRadius[1][1],
        brh = borderRadius[2][0],
        brv = borderRadius[2][1],
        blh = borderRadius[3][0],
        blv = borderRadius[3][1],
    
        topWidth = width - trh,
        rightHeight = height - brv,
        bottomWidth = width - brh,
        leftHeight = height - blv;
    
        return {
          topLeftOuter: getCurvePoints(
            x,
            y,
            tlh,
            tlv
            ).topLeft.subdivide(0.5),
    
          topLeftInner: getCurvePoints(
            x + borders[3].width,
            y + borders[0].width,
            Math.max(0, tlh - borders[3].width),
            Math.max(0, tlv - borders[0].width)
            ).topLeft.subdivide(0.5),
    
          topRightOuter: getCurvePoints(
            x + topWidth,
            y,
            trh,
            trv
            ).topRight.subdivide(0.5),
    
          topRightInner: getCurvePoints(
            x + Math.min(topWidth, width + borders[3].width),
            y + borders[0].width,
            (topWidth > width + borders[3].width) ? 0 :trh - borders[3].width,
            trv - borders[0].width
            ).topRight.subdivide(0.5),
    
          bottomRightOuter: getCurvePoints(
            x + bottomWidth,
            y + rightHeight,
            brh,
            brv
            ).bottomRight.subdivide(0.5),
    
          bottomRightInner: getCurvePoints(
            x + Math.min(bottomWidth, width + borders[3].width),
            y + Math.min(rightHeight, height + borders[0].width),
            Math.max(0, brh - borders[1].width),
            Math.max(0, brv - borders[2].width)
            ).bottomRight.subdivide(0.5),
    
          bottomLeftOuter: getCurvePoints(
            x,
            y + leftHeight,
            blh,
            blv
            ).bottomLeft.subdivide(0.5),
    
          bottomLeftInner: getCurvePoints(
            x + borders[3].width,
            y + leftHeight,
            Math.max(0, blh - borders[3].width),
            Math.max(0, blv - borders[2].width)
            ).bottomLeft.subdivide(0.5)
        };
      }
    
      function getBorderClip(element, borderPoints, borders, radius, bounds) {
        var backgroundClip = getCSS(element, 'backgroundClip'),
        borderArgs = [];
    
        switch(backgroundClip) {
          case "content-box":
          case "padding-box":
            parseCorner(borderArgs, radius[0], radius[1], borderPoints.topLeftInner, borderPoints.topRightInner, bounds.left + borders[3].width, bounds.top + borders[0].width);
            parseCorner(borderArgs, radius[1], radius[2], borderPoints.topRightInner, borderPoints.bottomRightInner, bounds.left + bounds.width - borders[1].width, bounds.top + borders[0].width);
            parseCorner(borderArgs, radius[2], radius[3], borderPoints.bottomRightInner, borderPoints.bottomLeftInner, bounds.left + bounds.width - borders[1].width, bounds.top + bounds.height - borders[2].width);
            parseCorner(borderArgs, radius[3], radius[0], borderPoints.bottomLeftInner, borderPoints.topLeftInner, bounds.left + borders[3].width, bounds.top + bounds.height - borders[2].width);
            break;
    
          default:
            parseCorner(borderArgs, radius[0], radius[1], borderPoints.topLeftOuter, borderPoints.topRightOuter, bounds.left, bounds.top);
            parseCorner(borderArgs, radius[1], radius[2], borderPoints.topRightOuter, borderPoints.bottomRightOuter, bounds.left + bounds.width, bounds.top);
            parseCorner(borderArgs, radius[2], radius[3], borderPoints.bottomRightOuter, borderPoints.bottomLeftOuter, bounds.left + bounds.width, bounds.top + bounds.height);
            parseCorner(borderArgs, radius[3], radius[0], borderPoints.bottomLeftOuter, borderPoints.topLeftOuter, bounds.left, bounds.top + bounds.height);
            break;
        }
    
        return borderArgs;
      }
    
      function parseBorders(element, bounds, borders){
        var x = bounds.left,
        y = bounds.top,
        width = bounds.width,
        height = bounds.height,
        borderSide,
        bx,
        by,
        bw,
        bh,
        borderArgs,
        // http://www.w3.org/TR/css3-background/#the-border-radius
        borderRadius = getBorderRadiusData(element),
        borderPoints = calculateCurvePoints(bounds, borderRadius, borders),
        borderData = {
          clip: getBorderClip(element, borderPoints, borders, borderRadius, bounds),
          borders: []
        };
    
        for (borderSide = 0; borderSide < 4; borderSide++) {
    
          if (borders[borderSide].width > 0) {
            bx = x;
            by = y;
            bw = width;
            bh = height - (borders[2].width);
    
            switch(borderSide) {
              case 0:
                // top border
                bh = borders[0].width;
    
                borderArgs = drawSide({
                  c1: [bx, by],
                  c2: [bx + bw, by],
                  c3: [bx + bw - borders[1].width, by + bh],
                  c4: [bx + borders[3].width, by + bh]
                }, borderRadius[0], borderRadius[1],
                borderPoints.topLeftOuter, borderPoints.topLeftInner, borderPoints.topRightOuter, borderPoints.topRightInner);
                break;
              case 1:
                // right border
                bx = x + width - (borders[1].width);
                bw = borders[1].width;
    
                borderArgs = drawSide({
                  c1: [bx + bw, by],
                  c2: [bx + bw, by + bh + borders[2].width],
                  c3: [bx, by + bh],
                  c4: [bx, by + borders[0].width]
                }, borderRadius[1], borderRadius[2],
                borderPoints.topRightOuter, borderPoints.topRightInner, borderPoints.bottomRightOuter, borderPoints.bottomRightInner);
                break;
              case 2:
                // bottom border
                by = (by + height) - (borders[2].width);
                bh = borders[2].width;
    
                borderArgs = drawSide({
                  c1: [bx + bw, by + bh],
                  c2: [bx, by + bh],
                  c3: [bx + borders[3].width, by],
                  c4: [bx + bw - borders[3].width, by]
                }, borderRadius[2], borderRadius[3],
                borderPoints.bottomRightOuter, borderPoints.bottomRightInner, borderPoints.bottomLeftOuter, borderPoints.bottomLeftInner);
                break;
              case 3:
                // left border
                bw = borders[3].width;
    
                borderArgs = drawSide({
                  c1: [bx, by + bh + borders[2].width],
                  c2: [bx, by],
                  c3: [bx + bw, by + borders[0].width],
                  c4: [bx + bw, by + bh]
                }, borderRadius[3], borderRadius[0],
                borderPoints.bottomLeftOuter, borderPoints.bottomLeftInner, borderPoints.topLeftOuter, borderPoints.topLeftInner);
                break;
            }
    
            borderData.borders.push({
              args: borderArgs,
              color: borders[borderSide].color
            });
    
          }
        }
    
        return borderData;
      }
    
      function createShape(ctx, args) {
        var shape = ctx.drawShape();
        args.forEach(function(border, index) {
          shape[(index === 0) ? "moveTo" : border[0] + "To" ].apply(null, border.slice(1));
        });
        return shape;
      }
    
      function renderBorders(ctx, borderArgs, color) {
        if (color !== "transparent") {
          ctx.setVariable( "fillStyle", color);
          createShape(ctx, borderArgs);
          ctx.fill();
          numDraws+=1;
        }
      }
    
      function renderFormValue (el, bounds, stack){
    
        var valueWrap = doc.createElement('valuewrap'),
        cssPropertyArray = ['lineHeight','textAlign','fontFamily','color','fontSize','paddingLeft','paddingTop','width','height','border','borderLeftWidth','borderTopWidth'],
        textValue,
        textNode;
    
        cssPropertyArray.forEach(function(property) {
          try {
            valueWrap.style[property] = getCSS(el, property);
          } catch(e) {
            // Older IE has issues with "border"
            Util.log("html2canvas: Parse: Exception caught in renderFormValue: " + e.message);
          }
        });
    
        valueWrap.style.borderColor = "black";
        valueWrap.style.borderStyle = "solid";
        valueWrap.style.display = "block";
        valueWrap.style.position = "absolute";
    
        if (/^(submit|reset|button|text|password)$/.test(el.type) || el.nodeName === "SELECT"){
          valueWrap.style.lineHeight = getCSS(el, "height");
        }
    
        valueWrap.style.top = bounds.top + "px";
        valueWrap.style.left = bounds.left + "px";
    
        textValue = (el.nodeName === "SELECT") ? (el.options[el.selectedIndex] || 0).text : el.value;
        if(!textValue) {
          textValue = el.placeholder;
        }
    
        textNode = doc.createTextNode(textValue);
    
        valueWrap.appendChild(textNode);
        body.appendChild(valueWrap);
    
        renderText(el, textNode, stack);
        body.removeChild(valueWrap);
      }
    
      function drawImage (ctx) {
        ctx.drawImage.apply(ctx, Array.prototype.slice.call(arguments, 1));
        numDraws+=1;
      }
    
      function getPseudoElement(el, which) {
        var elStyle = window.getComputedStyle(el, which);
        if(!elStyle || !elStyle.content || elStyle.content === "none" || elStyle.content === "-moz-alt-content" || elStyle.display === "none") {
          return;
        }
        var content = elStyle.content + '',
        first = content.substr( 0, 1 );
        //strips quotes
        if(first === content.substr( content.length - 1 ) && first.match(/'|"/)) {
          content = content.substr( 1, content.length - 2 );
        }
    
        var isImage = content.substr( 0, 3 ) === 'url',
        elps = document.createElement( isImage ? 'img' : 'span' );
    
        elps.className = pseudoHide + "-before " + pseudoHide + "-after";
    
        Object.keys(elStyle).filter(indexedProperty).forEach(function(prop) {
          // Prevent assigning of read only CSS Rules, ex. length, parentRule
          try {
            elps.style[prop] = elStyle[prop];
          } catch (e) {
            Util.log(['Tried to assign readonly property ', prop, 'Error:', e]);
          }
        });
    
        if(isImage) {
          elps.src = Util.parseBackgroundImage(content)[0].args[0];
        } else {
          elps.innerHTML = content;
        }
        return elps;
      }
    
      function indexedProperty(property) {
        return (isNaN(window.parseInt(property, 10)));
      }
    
      function injectPseudoElements(el, stack) {
        var before = getPseudoElement(el, ':before'),
        after = getPseudoElement(el, ':after');
        if(!before && !after) {
          return;
        }
    
        if(before) {
          el.className += " " + pseudoHide + "-before";
          el.parentNode.insertBefore(before, el);
          parseElement(before, stack, true);
          el.parentNode.removeChild(before);
          el.className = el.className.replace(pseudoHide + "-before", "").trim();
        }
    
        if (after) {
          el.className += " " + pseudoHide + "-after";
          el.appendChild(after);
          parseElement(after, stack, true);
          el.removeChild(after);
          el.className = el.className.replace(pseudoHide + "-after", "").trim();
        }
    
      }
    
      function renderBackgroundRepeat(ctx, image, backgroundPosition, bounds) {
        var offsetX = Math.round(bounds.left + backgroundPosition.left),
        offsetY = Math.round(bounds.top + backgroundPosition.top);
    
        ctx.createPattern(image);
        ctx.translate(offsetX, offsetY);
        ctx.fill();
        ctx.translate(-offsetX, -offsetY);
      }
    
      function backgroundRepeatShape(ctx, image, backgroundPosition, bounds, left, top, width, height) {
        var args = [];
        args.push(["line", Math.round(left), Math.round(top)]);
        args.push(["line", Math.round(left + width), Math.round(top)]);
        args.push(["line", Math.round(left + width), Math.round(height + top)]);
        args.push(["line", Math.round(left), Math.round(height + top)]);
        createShape(ctx, args);
        ctx.save();
        ctx.clip();
        renderBackgroundRepeat(ctx, image, backgroundPosition, bounds);
        ctx.restore();
      }
    
      function renderBackgroundColor(ctx, backgroundBounds, bgcolor) {
        renderRect(
          ctx,
          backgroundBounds.left,
          backgroundBounds.top,
          backgroundBounds.width,
          backgroundBounds.height,
          bgcolor
          );
      }
    
      function renderBackgroundRepeating(el, bounds, ctx, image, imageIndex) {
        var backgroundSize = Util.BackgroundSize(el, bounds, image, imageIndex),
        backgroundPosition = Util.BackgroundPosition(el, bounds, image, imageIndex, backgroundSize),
        backgroundRepeat = getCSS(el, "backgroundRepeat").split(",").map(Util.trimText);
    
        image = resizeImage(image, backgroundSize);
    
        backgroundRepeat = backgroundRepeat[imageIndex] || backgroundRepeat[0];
    
        switch (backgroundRepeat) {
          case "repeat-x":
            backgroundRepeatShape(ctx, image, backgroundPosition, bounds,
              bounds.left, bounds.top + backgroundPosition.top, 99999, image.height);
            break;
    
          case "repeat-y":
            backgroundRepeatShape(ctx, image, backgroundPosition, bounds,
              bounds.left + backgroundPosition.left, bounds.top, image.width, 99999);
            break;
    
          case "no-repeat":
            backgroundRepeatShape(ctx, image, backgroundPosition, bounds,
              bounds.left + backgroundPosition.left, bounds.top + backgroundPosition.top, image.width, image.height);
            break;
    
          default:
            renderBackgroundRepeat(ctx, image, backgroundPosition, {
              top: bounds.top,
              left: bounds.left,
              width: image.width,
              height: image.height
            });
            break;
        }
      }
    
      function renderBackgroundImage(element, bounds, ctx) {
        var backgroundImage = getCSS(element, "backgroundImage"),
        backgroundImages = Util.parseBackgroundImage(backgroundImage),
        image,
        imageIndex = backgroundImages.length;
    
        while(imageIndex--) {
          backgroundImage = backgroundImages[imageIndex];
    
          if (!backgroundImage.args || backgroundImage.args.length === 0) {
            continue;
          }
    
          var key = backgroundImage.method === 'url' ?
          backgroundImage.args[0] :
          backgroundImage.value;
    
          image = loadImage(key);
    
          // TODO add support for background-origin
          if (image) {
            renderBackgroundRepeating(element, bounds, ctx, image, imageIndex);
          } else {
            Util.log("html2canvas: Error loading background:", backgroundImage);
          }
        }
      }
    
      function resizeImage(image, bounds) {
        if(image.width === bounds.width && image.height === bounds.height) {
          return image;
        }
    
        var ctx, canvas = doc.createElement('canvas');
        canvas.width = bounds.width;
        canvas.height = bounds.height;
        ctx = canvas.getContext("2d");
        drawImage(ctx, image, 0, 0, image.width, image.height, 0, 0, bounds.width, bounds.height );
        return canvas;
      }
    
      function setOpacity(ctx, element, parentStack) {
        return ctx.setVariable("globalAlpha", getCSS(element, "opacity") * ((parentStack) ? parentStack.opacity : 1));
      }
    
      function removePx(str) {
        return str.replace("px", "");
      }
    
      var transformRegExp = /(matrix)\((.+)\)/;
    
      function getTransform(element, parentStack) {
        var transform = getCSS(element, "transform") || getCSS(element, "-webkit-transform") || getCSS(element, "-moz-transform") || getCSS(element, "-ms-transform") || getCSS(element, "-o-transform");
        var transformOrigin = getCSS(element, "transform-origin") || getCSS(element, "-webkit-transform-origin") || getCSS(element, "-moz-transform-origin") || getCSS(element, "-ms-transform-origin") || getCSS(element, "-o-transform-origin") || "0px 0px";
    
        transformOrigin = transformOrigin.split(" ").map(removePx).map(Util.asFloat);
    
        var matrix;
        if (transform && transform !== "none") {
          var match = transform.match(transformRegExp);
          if (match) {
            switch(match[1]) {
              case "matrix":
                matrix = match[2].split(",").map(Util.trimText).map(Util.asFloat);
                break;
            }
          }
        }
    
        return {
          origin: transformOrigin,
          matrix: matrix
        };
      }
    
      function createStack(element, parentStack, bounds, transform) {
        var ctx = h2cRenderContext((!parentStack) ? documentWidth() : bounds.width , (!parentStack) ? documentHeight() : bounds.height),
        stack = {
          ctx: ctx,
          opacity: setOpacity(ctx, element, parentStack),
          cssPosition: getCSS(element, "position"),
          borders: getBorderData(element),
          transform: transform,
          clip: (parentStack && parentStack.clip) ? Util.Extend( {}, parentStack.clip ) : null
        };
    
        setZ(element, stack, parentStack);
    
        // TODO correct overflow for absolute content residing under a static position
        if (options.useOverflow === true && /(hidden|scroll|auto)/.test(getCSS(element, "overflow")) === true && /(BODY)/i.test(element.nodeName) === false){
          stack.clip = (stack.clip) ? clipBounds(stack.clip, bounds) : bounds;
        }
    
        return stack;
      }
    
      function getBackgroundBounds(borders, bounds, clip) {
        var backgroundBounds = {
          left: bounds.left + borders[3].width,
          top: bounds.top + borders[0].width,
          width: bounds.width - (borders[1].width + borders[3].width),
          height: bounds.height - (borders[0].width + borders[2].width)
        };
    
        if (clip) {
          backgroundBounds = clipBounds(backgroundBounds, clip);
        }
    
        return backgroundBounds;
      }
    
      function getBounds(element, transform) {
        var bounds = (transform.matrix) ? Util.OffsetBounds(element) : Util.Bounds(element);
        transform.origin[0] += bounds.left;
        transform.origin[1] += bounds.top;
        return bounds;
      }
    
      function renderElement(element, parentStack, pseudoElement, ignoreBackground) {
        var transform = getTransform(element, parentStack),
        bounds = getBounds(element, transform),
        image,
        stack = createStack(element, parentStack, bounds, transform),
        borders = stack.borders,
        ctx = stack.ctx,
        backgroundBounds = getBackgroundBounds(borders, bounds, stack.clip),
        borderData = parseBorders(element, bounds, borders),
        backgroundColor = (ignoreElementsRegExp.test(element.nodeName)) ? "#efefef" : getCSS(element, "backgroundColor");
    
    
        createShape(ctx, borderData.clip);
    
        ctx.save();
        ctx.clip();
    
        if (backgroundBounds.height > 0 && backgroundBounds.width > 0 && !ignoreBackground) {
          renderBackgroundColor(ctx, bounds, backgroundColor);
          renderBackgroundImage(element, backgroundBounds, ctx);
        } else if (ignoreBackground) {
          stack.backgroundColor =  backgroundColor;
        }
    
        ctx.restore();
    
        borderData.borders.forEach(function(border) {
          renderBorders(ctx, border.args, border.color);
        });
    
        if (!pseudoElement) {
          injectPseudoElements(element, stack);
        }
    
        switch(element.nodeName){
          case "IMG":
            if ((image = loadImage(element.getAttribute('src')))) {
              renderImage(ctx, element, image, bounds, borders);
            } else {
              Util.log("html2canvas: Error loading <img>:" + element.getAttribute('src'));
            }
            break;
          case "INPUT":
            // TODO add all relevant type's, i.e. HTML5 new stuff
            // todo add support for placeholder attribute for browsers which support it
            if (/^(text|url|email|submit|button|reset)$/.test(element.type) && (element.value || element.placeholder || "").length > 0){
              renderFormValue(element, bounds, stack);
            }
            break;
          case "TEXTAREA":
            if ((element.value || element.placeholder || "").length > 0){
              renderFormValue(element, bounds, stack);
            }
            break;
          case "SELECT":
            if ((element.options||element.placeholder || "").length > 0){
              renderFormValue(element, bounds, stack);
            }
            break;
          case "LI":
            renderListItem(element, stack, backgroundBounds);
            break;
          case "CANVAS":
            renderImage(ctx, element, element, bounds, borders);
            break;
        }
    
        return stack;
      }
    
      function isElementVisible(element) {
        return (getCSS(element, 'display') !== "none" && getCSS(element, 'visibility') !== "hidden" && !element.hasAttribute("data-html2canvas-ignore"));
      }
    
      function parseElement (element, stack, pseudoElement) {
        if (isElementVisible(element)) {
          stack = renderElement(element, stack, pseudoElement, false) || stack;
          if (!ignoreElementsRegExp.test(element.nodeName)) {
            parseChildren(element, stack, pseudoElement);
          }
        }
      }
    
      function parseChildren(element, stack, pseudoElement) {
        Util.Children(element).forEach(function(node) {
          if (node.nodeType === node.ELEMENT_NODE) {
            parseElement(node, stack, pseudoElement);
          } else if (node.nodeType === node.TEXT_NODE) {
            renderText(element, node, stack);
          }
        });
      }
    
      function init() {
        var background = getCSS(document.documentElement, "backgroundColor"),
          transparentBackground = (Util.isTransparent(background) && element === document.body),
          stack = renderElement(element, null, false, transparentBackground);
        parseChildren(element, stack);
    
        if (transparentBackground) {
          background = stack.backgroundColor;
        }
    
        body.removeChild(hidePseudoElements);
        return {
          backgroundColor: background,
          stack: stack
        };
      }
    
      return init();
    };
    
    function h2czContext(zindex) {
      return {
        zindex: zindex,
        children: []
      };
    }
    
    _html2canvas.Preload = function( options ) {
    
      var images = {
        numLoaded: 0,   // also failed are counted here
        numFailed: 0,
        numTotal: 0,
        cleanupDone: false
      },
      pageOrigin,
      Util = _html2canvas.Util,
      methods,
      i,
      count = 0,
      element = options.elements[0] || document.body,
      doc = element.ownerDocument,
      domImages = element.getElementsByTagName('img'), // Fetch images of the present element only
      imgLen = domImages.length,
      link = doc.createElement("a"),
      supportCORS = (function( img ){
        return (img.crossOrigin !== undefined);
      })(new Image()),
      timeoutTimer;
    
      link.href = window.location.href;
      pageOrigin  = link.protocol + link.host;
    
      function isSameOrigin(url){
        link.href = url;
        link.href = link.href; // YES, BELIEVE IT OR NOT, that is required for IE9 - http://jsfiddle.net/niklasvh/2e48b/
        var origin = link.protocol + link.host;
        return (origin === pageOrigin);
      }
    
      function start(){
        Util.log("html2canvas: start: images: " + images.numLoaded + " / " + images.numTotal + " (failed: " + images.numFailed + ")");
        if (!images.firstRun && images.numLoaded >= images.numTotal){
          Util.log("Finished loading images: # " + images.numTotal + " (failed: " + images.numFailed + ")");
    
          if (typeof options.complete === "function"){
            options.complete(images);
          }
    
        }
      }
    
      // TODO modify proxy to serve images with CORS enabled, where available
      function proxyGetImage(url, img, imageObj){
        var callback_name,
        scriptUrl = options.proxy,
        script;
    
        link.href = url;
        url = link.href; // work around for pages with base href="" set - WARNING: this may change the url
    
        callback_name = 'html2canvas_' + (count++);
        imageObj.callbackname = callback_name;
    
        if (scriptUrl.indexOf("?") > -1) {
          scriptUrl += "&";
        } else {
          scriptUrl += "?";
        }
        scriptUrl += 'url=' + encodeURIComponent(url) + '&callback=' + callback_name;
        script = doc.createElement("script");
    
        window[callback_name] = function(a){
          if (a.substring(0,6) === "error:"){
            imageObj.succeeded = false;
            images.numLoaded++;
            images.numFailed++;
            start();
          } else {
            setImageLoadHandlers(img, imageObj);
            img.src = a;
          }
          window[callback_name] = undefined; // to work with IE<9  // NOTE: that the undefined callback property-name still exists on the window object (for IE<9)
          try {
            delete window[callback_name];  // for all browser that support this
          } catch(ex) {}
          script.parentNode.removeChild(script);
          script = null;
          delete imageObj.script;
          delete imageObj.callbackname;
        };
    
        script.setAttribute("type", "text/javascript");
        script.setAttribute("src", scriptUrl);
        imageObj.script = script;
        window.document.body.appendChild(script);
    
      }
    
      function loadPseudoElement(element, type) {
        var style = window.getComputedStyle(element, type),
        content = style.content;
        if (content.substr(0, 3) === 'url') {
          methods.loadImage(_html2canvas.Util.parseBackgroundImage(content)[0].args[0]);
        }
        loadBackgroundImages(style.backgroundImage, element);
      }
    
      function loadPseudoElementImages(element) {
        loadPseudoElement(element, ":before");
        loadPseudoElement(element, ":after");
      }
    
      function loadGradientImage(backgroundImage, bounds) {
        var img = _html2canvas.Generate.Gradient(backgroundImage, bounds);
    
        if (img !== undefined){
          images[backgroundImage] = {
            img: img,
            succeeded: true
          };
          images.numTotal++;
          images.numLoaded++;
          start();
        }
      }
    
      function invalidBackgrounds(background_image) {
        return (background_image && background_image.method && background_image.args && background_image.args.length > 0 );
      }
    
      function loadBackgroundImages(background_image, el) {
        var bounds;
    
        _html2canvas.Util.parseBackgroundImage(background_image).filter(invalidBackgrounds).forEach(function(background_image) {
          if (background_image.method === 'url') {
            methods.loadImage(background_image.args[0]);
          } else if(background_image.method.match(/\-?gradient$/)) {
            if(bounds === undefined) {
              bounds = _html2canvas.Util.Bounds(el);
            }
            loadGradientImage(background_image.value, bounds);
          }
        });
      }
    
      function getImages (el) {
        var elNodeType = false;
    
        // Firefox fails with permission denied on pages with iframes
        try {
          Util.Children(el).forEach(getImages);
        }
        catch( e ) {}
    
        try {
          elNodeType = el.nodeType;
        } catch (ex) {
          elNodeType = false;
          Util.log("html2canvas: failed to access some element's nodeType - Exception: " + ex.message);
        }
    
        if (elNodeType === 1 || elNodeType === undefined) {
          loadPseudoElementImages(el);
          try {
            loadBackgroundImages(Util.getCSS(el, 'backgroundImage'), el);
          } catch(e) {
            Util.log("html2canvas: failed to get background-image - Exception: " + e.message);
          }
          loadBackgroundImages(el);
        }
      }
    
      function setImageLoadHandlers(img, imageObj) {
        img.onload = function() {
          if ( imageObj.timer !== undefined ) {
            // CORS succeeded
            window.clearTimeout( imageObj.timer );
          }
    
          images.numLoaded++;
          imageObj.succeeded = true;
          img.onerror = img.onload = null;
          start();
        };
        img.onerror = function() {
          if (img.crossOrigin === "anonymous") {
            // CORS failed
            window.clearTimeout( imageObj.timer );
    
            // let's try with proxy instead
            if ( options.proxy ) {
              var src = img.src;
              img = new Image();
              imageObj.img = img;
              img.src = src;
    
              proxyGetImage( img.src, img, imageObj );
              return;
            }
          }
    
          images.numLoaded++;
          images.numFailed++;
          imageObj.succeeded = false;
          img.onerror = img.onload = null;
          start();
        };
      }
    
      methods = {
        loadImage: function( src ) {
          var img, imageObj;
          if ( src && images[src] === undefined ) {
            img = new Image();
            if ( src.match(/data:image\/.*;base64,/i) ) {
              img.src = src.replace(/url\(['"]{0,}|['"]{0,}\)$/ig, '');
              imageObj = images[src] = {
                img: img
              };
              images.numTotal++;
              setImageLoadHandlers(img, imageObj);
            } else if ( isSameOrigin( src ) || options.allowTaint ===  true ) {
              imageObj = images[src] = {
                img: img
              };
              images.numTotal++;
              setImageLoadHandlers(img, imageObj);
              img.src = src;
            } else if ( supportCORS && !options.allowTaint && options.useCORS ) {
              // attempt to load with CORS
    
              img.crossOrigin = "anonymous";
              imageObj = images[src] = {
                img: img
              };
              images.numTotal++;
              setImageLoadHandlers(img, imageObj);
              img.src = src;
            } else if ( options.proxy ) {
              imageObj = images[src] = {
                img: img
              };
              images.numTotal++;
              proxyGetImage( src, img, imageObj );
            }
          }
    
        },
        cleanupDOM: function(cause) {
          var img, src;
          if (!images.cleanupDone) {
            if (cause && typeof cause === "string") {
              Util.log("html2canvas: Cleanup because: " + cause);
            } else {
              Util.log("html2canvas: Cleanup after timeout: " + options.timeout + " ms.");
            }
    
            for (src in images) {
              if (images.hasOwnProperty(src)) {
                img = images[src];
                if (typeof img === "object" && img.callbackname && img.succeeded === undefined) {
                  // cancel proxy image request
                  window[img.callbackname] = undefined; // to work with IE<9  // NOTE: that the undefined callback property-name still exists on the window object (for IE<9)
                  try {
                    delete window[img.callbackname];  // for all browser that support this
                  } catch(ex) {}
                  if (img.script && img.script.parentNode) {
                    img.script.setAttribute("src", "about:blank");  // try to cancel running request
                    img.script.parentNode.removeChild(img.script);
                  }
                  images.numLoaded++;
                  images.numFailed++;
                  Util.log("html2canvas: Cleaned up failed img: '" + src + "' Steps: " + images.numLoaded + " / " + images.numTotal);
                }
              }
            }
    
            // cancel any pending requests
            if(window.stop !== undefined) {
              window.stop();
            } else if(document.execCommand !== undefined) {
              document.execCommand("Stop", false);
            }
            if (document.close !== undefined) {
              document.close();
            }
            images.cleanupDone = true;
            if (!(cause && typeof cause === "string")) {
              start();
            }
          }
        },
    
        renderingDone: function() {
          if (timeoutTimer) {
            window.clearTimeout(timeoutTimer);
          }
        }
      };
    
      if (options.timeout > 0) {
        timeoutTimer = window.setTimeout(methods.cleanupDOM, options.timeout);
      }
    
      Util.log('html2canvas: Preload starts: finding background-images');
      images.firstRun = true;
    
      getImages(element);
    
      Util.log('html2canvas: Preload: Finding images');
      // load <img> images
      for (i = 0; i < imgLen; i+=1){
        methods.loadImage( domImages[i].getAttribute( "src" ) );
      }
    
      images.firstRun = false;
      Util.log('html2canvas: Preload: Done.');
      if (images.numTotal === images.numLoaded) {
        start();
      }
    
      return methods;
    };
    
    _html2canvas.Renderer = function(parseQueue, options){
    
      // http://www.w3.org/TR/CSS21/zindex.html
      function createRenderQueue(parseQueue) {
        var queue = [],
        rootContext;
    
        rootContext = (function buildStackingContext(rootNode) {
          var rootContext = {};
          function insert(context, node, specialParent) {
            var zi = (node.zIndex.zindex === 'auto') ? 0 : Number(node.zIndex.zindex),
            contextForChildren = context, // the stacking context for children
            isPositioned = node.zIndex.isPositioned,
            isFloated = node.zIndex.isFloated,
            stub = {node: node},
            childrenDest = specialParent; // where children without z-index should be pushed into
    
            if (node.zIndex.ownStacking) {
              // '!' comes before numbers in sorted array
              contextForChildren = stub.context = { '!': [{node:node, children: []}]};
              childrenDest = undefined;
            } else if (isPositioned || isFloated) {
              childrenDest = stub.children = [];
            }
    
            if (zi === 0 && specialParent) {
              specialParent.push(stub);
            } else {
              if (!context[zi]) { context[zi] = []; }
              context[zi].push(stub);
            }
    
            node.zIndex.children.forEach(function(childNode) {
              insert(contextForChildren, childNode, childrenDest);
            });
          }
          insert(rootContext, rootNode);
          return rootContext;
        })(parseQueue);
    
        function sortZ(context) {
          Object.keys(context).sort().forEach(function(zi) {
            var nonPositioned = [],
            floated = [],
            positioned = [],
            list = [];
    
            // positioned after static
            context[zi].forEach(function(v) {
              if (v.node.zIndex.isPositioned || v.node.zIndex.opacity < 1) {
                // http://www.w3.org/TR/css3-color/#transparency
                // non-positioned element with opactiy < 1 should be stacked as if it were a positioned element with ‘z-index: 0’ and ‘opacity: 1’.
                positioned.push(v);
              } else if (v.node.zIndex.isFloated) {
                floated.push(v);
              } else {
                nonPositioned.push(v);
              }
            });
    
            (function walk(arr) {
              arr.forEach(function(v) {
                list.push(v);
                if (v.children) { walk(v.children); }
              });
            })(nonPositioned.concat(floated, positioned));
    
            list.forEach(function(v) {
              if (v.context) {
                sortZ(v.context);
              } else {
                queue.push(v.node);
              }
            });
          });
        }
    
        sortZ(rootContext);
    
        return queue;
      }
    
      function getRenderer(rendererName) {
        var renderer;
    
        if (typeof options.renderer === "string" && _html2canvas.Renderer[rendererName] !== undefined) {
          renderer = _html2canvas.Renderer[rendererName](options);
        } else if (typeof rendererName === "function") {
          renderer = rendererName(options);
        } else {
          throw new Error("Unknown renderer");
        }
    
        if ( typeof renderer !== "function" ) {
          throw new Error("Invalid renderer defined");
        }
        return renderer;
      }
    
      return getRenderer(options.renderer)(parseQueue, options, document, createRenderQueue(parseQueue.stack), _html2canvas);
    };
    
    _html2canvas.Util.Support = function (options, doc) {
    
      function supportSVGRendering() {
        var img = new Image(),
        canvas = doc.createElement("canvas"),
        ctx = (canvas.getContext === undefined) ? false : canvas.getContext("2d");
        if (ctx === false) {
          return false;
        }
        canvas.width = canvas.height = 10;
        img.src = [
        "data:image/svg+xml,",
        "<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10'>",
        "<foreignObject width='10' height='10'>",
        "<div xmlns='http://www.w3.org/1999/xhtml' style='width:10;height:10;'>",
        "sup",
        "</div>",
        "</foreignObject>",
        "</svg>"
        ].join("");
        try {
          ctx.drawImage(img, 0, 0);
          canvas.toDataURL();
        } catch(e) {
          return false;
        }
        _html2canvas.Util.log('html2canvas: Parse: SVG powered rendering available');
        return true;
      }
    
      // Test whether we can use ranges to measure bounding boxes
      // Opera doesn't provide valid bounds.height/bottom even though it supports the method.
    
      function supportRangeBounds() {
        var r, testElement, rangeBounds, rangeHeight, support = false;
    
        if (doc.createRange) {
          r = doc.createRange();
          if (r.getBoundingClientRect) {
            testElement = doc.createElement('boundtest');
            testElement.style.height = "123px";
            testElement.style.display = "block";
            doc.body.appendChild(testElement);
    
            r.selectNode(testElement);
            rangeBounds = r.getBoundingClientRect();
            rangeHeight = rangeBounds.height;
    
            if (rangeHeight === 123) {
              support = true;
            }
            doc.body.removeChild(testElement);
          }
        }
    
        return support;
      }
    
      return {
        rangeBounds: supportRangeBounds(),
        svgRendering: options.svgRendering && supportSVGRendering()
      };
    };
    window.html2canvas = function(elements, opts) {
      elements = (elements.length) ? elements : [elements];
      var queue,
      canvas,
      options = {
        // general
        logging: false,
        elements: elements,
        background: "#fff",
    
        // preload options
        proxy: null,
        timeout: 0,    // no timeout
        useCORS: false, // try to load images as CORS (where available), before falling back to proxy
        allowTaint: false, // whether to allow images to taint the canvas, won't need proxy if set to true
    
        // parse options
        svgRendering: false, // use svg powered rendering where available (FF11+)
        ignoreElements: "IFRAME|OBJECT|PARAM",
        useOverflow: true,
        letterRendering: false,
        chinese: false,
    
        // render options
    
        width: null,
        height: null,
        taintTest: true, // do a taint test with all images before applying to canvas
        renderer: "Canvas"
      };
    
      options = _html2canvas.Util.Extend(opts, options);
    
      _html2canvas.logging = options.logging;
      options.complete = function( images ) {
    
        if (typeof options.onpreloaded === "function") {
          if ( options.onpreloaded( images ) === false ) {
            return;
          }
        }
        queue = _html2canvas.Parse( images, options );
    
        if (typeof options.onparsed === "function") {
          if ( options.onparsed( queue ) === false ) {
            return;
          }
        }
    
        canvas = _html2canvas.Renderer( queue, options );
    
        if (typeof options.onrendered === "function") {
          options.onrendered( canvas );
        }
    
    
      };
    
      // for pages without images, we still want this to be async, i.e. return methods before executing
      window.setTimeout( function(){
        _html2canvas.Preload( options );
      }, 0 );
    
      return {
        render: function( queue, opts ) {
          return _html2canvas.Renderer( queue, _html2canvas.Util.Extend(opts, options) );
        },
        parse: function( images, opts ) {
          return _html2canvas.Parse( images, _html2canvas.Util.Extend(opts, options) );
        },
        preload: function( opts ) {
          return _html2canvas.Preload( _html2canvas.Util.Extend(opts, options) );
        },
        log: _html2canvas.Util.log
      };
    };
    
    window.html2canvas.log = _html2canvas.Util.log; // for renderers
    window.html2canvas.Renderer = {
      Canvas: undefined // We are assuming this will be used
    };
    _html2canvas.Renderer.Canvas = function(options) {
      options = options || {};
    
      var doc = document,
      safeImages = [],
      testCanvas = document.createElement("canvas"),
      testctx = testCanvas.getContext("2d"),
      Util = _html2canvas.Util,
      canvas = options.canvas || doc.createElement('canvas');
    
      function createShape(ctx, args) {
        ctx.beginPath();
        args.forEach(function(arg) {
          ctx[arg.name].apply(ctx, arg['arguments']);
        });
        ctx.closePath();
      }
    
      function safeImage(item) {
        if (safeImages.indexOf(item['arguments'][0].src ) === -1) {
          testctx.drawImage(item['arguments'][0], 0, 0);
          try {
            testctx.getImageData(0, 0, 1, 1);
          } catch(e) {
            testCanvas = doc.createElement("canvas");
            testctx = testCanvas.getContext("2d");
            return false;
          }
          safeImages.push(item['arguments'][0].src);
        }
        return true;
      }
    
      function renderItem(ctx, item) {
        switch(item.type){
          case "variable":
            ctx[item.name] = item['arguments'];
            break;
          case "function":
            switch(item.name) {
              case "createPattern":
                if (item['arguments'][0].width > 0 && item['arguments'][0].height > 0) {
                  try {
                    ctx.fillStyle = ctx.createPattern(item['arguments'][0], "repeat");
                  }
                  catch(e) {
                    Util.log("html2canvas: Renderer: Error creating pattern", e.message);
                  }
                }
                break;
              case "drawShape":
                createShape(ctx, item['arguments']);
                break;
              case "drawImage":
                if (item['arguments'][8] > 0 && item['arguments'][7] > 0) {
                  if (!options.taintTest || (options.taintTest && safeImage(item))) {
                    ctx.drawImage.apply( ctx, item['arguments'] );
                  }
                }
                break;
              default:
                ctx[item.name].apply(ctx, item['arguments']);
            }
            break;
        }
      }
    
      return function(parsedData, options, document, queue, _html2canvas) {
        var ctx = canvas.getContext("2d"),
        newCanvas,
        bounds,
        fstyle,
        zStack = parsedData.stack;
    
        canvas.width = canvas.style.width =  options.width || zStack.ctx.width;
        canvas.height = canvas.style.height = options.height || zStack.ctx.height;
    
        fstyle = ctx.fillStyle;
        ctx.fillStyle = (Util.isTransparent(zStack.backgroundColor) && options.background !== undefined) ? options.background : parsedData.backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = fstyle;
    
        queue.forEach(function(storageContext) {
          // set common settings for canvas
          ctx.textBaseline = "bottom";
          ctx.save();
    
          if (storageContext.transform.matrix) {
            ctx.translate(storageContext.transform.origin[0], storageContext.transform.origin[1]);
            ctx.transform.apply(ctx, storageContext.transform.matrix);
            ctx.translate(-storageContext.transform.origin[0], -storageContext.transform.origin[1]);
          }
    
          if (storageContext.clip){
            ctx.beginPath();
            ctx.rect(storageContext.clip.left, storageContext.clip.top, storageContext.clip.width, storageContext.clip.height);
            ctx.clip();
          }
    
          if (storageContext.ctx.storage) {
            storageContext.ctx.storage.forEach(function(item) {
              renderItem(ctx, item);
            });
          }
    
          ctx.restore();
        });
    
        Util.log("html2canvas: Renderer: Canvas renderer done - returning canvas obj");
    
        if (options.elements.length === 1) {
          if (typeof options.elements[0] === "object" && options.elements[0].nodeName !== "BODY") {
            // crop image to the bounds of selected (single) element
            bounds = _html2canvas.Util.Bounds(options.elements[0]);
            newCanvas = document.createElement('canvas');
            newCanvas.width = Math.ceil(bounds.width);
            newCanvas.height = Math.ceil(bounds.height);
            ctx = newCanvas.getContext("2d");
    
            ctx.drawImage(canvas, bounds.left, bounds.top, bounds.width, bounds.height, 0, 0, bounds.width, bounds.height);
            canvas = null;
            return newCanvas;
          }
        }
    
        return canvas;
      };
    };
    })(window,document);
/** @preserve
 * jsPDF - PDF Document creation from JavaScript
 * Version 1.0.272-git Built on 2014-09-29T15:09
 *                           CommitID d4770725ca
 *
 * Copyright (c) 2010-2014 James Hall, https://github.com/MrRio/jsPDF
 *               2010 Aaron Spike, https://github.com/acspike
 *               2012 Willow Systems Corporation, willow-systems.com
 *               2012 Pablo Hess, https://github.com/pablohess
 *               2012 Florian Jenett, https://github.com/fjenett
 *               2013 Warren Weckesser, https://github.com/warrenweckesser
 *               2013 Youssef Beddad, https://github.com/lifof
 *               2013 Lee Driscoll, https://github.com/lsdriscoll
 *               2013 Stefan Slonevskiy, https://github.com/stefslon
 *               2013 Jeremy Morel, https://github.com/jmorel
 *               2013 Christoph Hartmann, https://github.com/chris-rock
 *               2014 Juan Pablo Gaviria, https://github.com/juanpgaviria
 *               2014 James Makes, https://github.com/dollaruw
 *               2014 Diego Casorran, https://github.com/diegocr
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * Contributor(s):
 *    siefkenj, ahwolf, rickygu, Midnith, saintclair, eaparango,
 *    kim3er, mfo, alnorth,
 */

/**
 * Creates new jsPDF document object instance.
 *
 * @class
 * @param orientation One of "portrait" or "landscape" (or shortcuts "p" (Default), "l")
 * @param unit        Measurement unit to be used when coordinates are specified.
 *                    One of "pt" (points), "mm" (Default), "cm", "in"
 * @param format      One of 'pageFormats' as shown below, default: a4
 * @returns {jsPDF}
 * @name jsPDF
 */
 var jsPDF = (function(global) {
	'use strict';
	var pdfVersion = '1.3',
		pageFormats = { // Size in pt of various paper formats
			'a0'  : [2383.94, 3370.39], 'a1'  : [1683.78, 2383.94],
			'a2'  : [1190.55, 1683.78], 'a3'  : [ 841.89, 1190.55],
			'a4'  : [ 595.28,  841.89], 'a5'  : [ 419.53,  595.28],
			'a6'  : [ 297.64,  419.53], 'a7'  : [ 209.76,  297.64],
			'a8'  : [ 147.40,  209.76], 'a9'  : [ 104.88,  147.40],
			'a10' : [  73.70,  104.88], 'b0'  : [2834.65, 4008.19],
			'b1'  : [2004.09, 2834.65], 'b2'  : [1417.32, 2004.09],
			'b3'  : [1000.63, 1417.32], 'b4'  : [ 708.66, 1000.63],
			'b5'  : [ 498.90,  708.66], 'b6'  : [ 354.33,  498.90],
			'b7'  : [ 249.45,  354.33], 'b8'  : [ 175.75,  249.45],
			'b9'  : [ 124.72,  175.75], 'b10' : [  87.87,  124.72],
			'c0'  : [2599.37, 3676.54], 'c1'  : [1836.85, 2599.37],
			'c2'  : [1298.27, 1836.85], 'c3'  : [ 918.43, 1298.27],
			'c4'  : [ 649.13,  918.43], 'c5'  : [ 459.21,  649.13],
			'c6'  : [ 323.15,  459.21], 'c7'  : [ 229.61,  323.15],
			'c8'  : [ 161.57,  229.61], 'c9'  : [ 113.39,  161.57],
			'c10' : [  79.37,  113.39], 'dl'  : [ 311.81,  623.62],
			'letter'            : [612,   792],
			'government-letter' : [576,   756],
			'legal'             : [612,  1008],
			'junior-legal'      : [576,   360],
			'ledger'            : [1224,  792],
			'tabloid'           : [792,  1224],
			'credit-card'       : [153,   243]
		};

	/**
	 * jsPDF's Internal PubSub Implementation.
	 * See mrrio.github.io/jsPDF/doc/symbols/PubSub.html
	 * Backward compatible rewritten on 2014 by
	 * Diego Casorran, https://github.com/diegocr
	 *
	 * @class
	 * @name PubSub
	 */
	function PubSub(context) {
		var topics = {};

		this.subscribe = function(topic, callback, once) {
			if(typeof callback !== 'function') {
				return false;
			}

			if(!topics.hasOwnProperty(topic)) {
				topics[topic] = {};
			}

			var id = Math.random().toString(35);
			topics[topic][id] = [callback,!!once];

			return id;
		};

		this.unsubscribe = function(token) {
			for(var topic in topics) {
				if(topics[topic][token]) {
					delete topics[topic][token];
					return true;
				}
			}
			return false;
		};

		this.publish = function(topic) {
			if(topics.hasOwnProperty(topic)) {
				var args = Array.prototype.slice.call(arguments, 1), idr = [];

				for(var id in topics[topic]) {
					var sub = topics[topic][id];
					try {
						sub[0].apply(context, args);
					} catch(ex) {
						if(global.console) {
							console.error('jsPDF PubSub Error', ex.message, ex);
						}
					}
					if(sub[1]) idr.push(id);
				}
				if(idr.length) idr.forEach(this.unsubscribe);
			}
		};
	}

	/**
	 * @constructor
	 * @private
	 */
	function jsPDF(orientation, unit, format, compressPdf) {
		var options = {};

		if (typeof orientation === 'object') {
			options = orientation;

			orientation = options.orientation;
			unit = options.unit || unit;
			format = options.format || format;
			compressPdf = options.compress || options.compressPdf || compressPdf;
		}

		// Default options
		unit        = unit || 'mm';
		format      = format || 'a4';
		orientation = ('' + (orientation || 'P')).toLowerCase();

		var format_as_string = ('' + format).toLowerCase(),
			compress = !!compressPdf && typeof Uint8Array === 'function',
			textColor            = options.textColor  || '0 g',
			drawColor            = options.drawColor  || '0 G',
			activeFontSize       = options.fontSize   || 16,
			lineHeightProportion = options.lineHeight || 1.15,
			lineWidth            = options.lineWidth  || 0.200025, // 2mm
			objectNumber =  2,  // 'n' Current object number
			outToPages   = !1,  // switches where out() prints. outToPages true = push to pages obj. outToPages false = doc builder content
			offsets      = [],  // List of offsets. Activated and reset by buildDocument(). Pupulated by various calls buildDocument makes.
			fonts        = {},  // collection of font objects, where key is fontKey - a dynamically created label for a given font.
			fontmap      = {},  // mapping structure fontName > fontStyle > font key - performance layer. See addFont()
			activeFontKey,      // will be string representing the KEY of the font as combination of fontName + fontStyle
			k,                  // Scale factor
			tmp,
			page = 0,
			currentPage,
			pages = [],
			pagedim = {},
			content = [],
			lineCapID = 0,
			lineJoinID = 0,
			content_length = 0,
			pageWidth,
			pageHeight,
			pageMode,
			zoomMode,
			layoutMode,
			documentProperties = {
				'title'    : '',
				'subject'  : '',
				'author'   : '',
				'keywords' : '',
				'creator'  : ''
			},
			API = {},
			events = new PubSub(API),

		/////////////////////
		// Private functions
		/////////////////////
		f2 = function(number) {
			return number.toFixed(2); // Ie, %.2f
		},
		f3 = function(number) {
			return number.toFixed(3); // Ie, %.3f
		},
		padd2 = function(number) {
			return ('0' + parseInt(number)).slice(-2);
		},
		out = function(string) {
			if (outToPages) {
				/* set by beginPage */
				pages[currentPage].push(string);
			} else {
				// +1 for '\n' that will be used to join 'content'
				content_length += string.length + 1;
				content.push(string);
			}
		},
		newObject = function() {
			// Begin a new object
			objectNumber++;
			offsets[objectNumber] = content_length;
			out(objectNumber + ' 0 obj');
			return objectNumber;
		},
		putStream = function(str) {
			out('stream');
			out(str);
			out('endstream');
		},
		putPages = function() {
			var n,p,arr,i,deflater,adler32,adler32cs,wPt,hPt;

			adler32cs = global.adler32cs || jsPDF.adler32cs;
			if (compress && typeof adler32cs === 'undefined') {
				compress = false;
			}

			// outToPages = false as set in endDocument(). out() writes to content.

			for (n = 1; n <= page; n++) {
				newObject();
				wPt = (pageWidth = pagedim[n].width) * k;
				hPt = (pageHeight = pagedim[n].height) * k;
				out('<</Type /Page');
				out('/Parent 1 0 R');
				out('/Resources 2 0 R');
				out('/MediaBox [0 0 ' + f2(wPt) + ' ' + f2(hPt) + ']');
				out('/Contents ' + (objectNumber + 1) + ' 0 R>>');
				out('endobj');

				// Page content
				p = pages[n].join('\n');
				newObject();
				if (compress) {
					arr = [];
					i = p.length;
					while(i--) {
						arr[i] = p.charCodeAt(i);
					}
					adler32 = adler32cs.from(p);
					deflater = new Deflater(6);
					deflater.append(new Uint8Array(arr));
					p = deflater.flush();
					arr = new Uint8Array(p.length + 6);
					arr.set(new Uint8Array([120, 156])),
					arr.set(p, 2);
					arr.set(new Uint8Array([adler32 & 0xFF, (adler32 >> 8) & 0xFF, (adler32 >> 16) & 0xFF, (adler32 >> 24) & 0xFF]), p.length+2);
					p = String.fromCharCode.apply(null, arr);
					out('<</Length ' + p.length + ' /Filter [/FlateDecode]>>');
				} else {
					out('<</Length ' + p.length + '>>');
				}
				putStream(p);
				out('endobj');
			}
			offsets[1] = content_length;
			out('1 0 obj');
			out('<</Type /Pages');
			var kids = '/Kids [';
			for (i = 0; i < page; i++) {
				kids += (3 + 2 * i) + ' 0 R ';
			}
			out(kids + ']');
			out('/Count ' + page);
			out('>>');
			out('endobj');
		},
		putFont = function(font) {
			font.objectNumber = newObject();
			out('<</BaseFont/' + font.PostScriptName + '/Type/Font');
			if (typeof font.encoding === 'string') {
				out('/Encoding/' + font.encoding);
			}
			out('/Subtype/Type1>>');
			out('endobj');
		},
		putFonts = function() {
			for (var fontKey in fonts) {
				if (fonts.hasOwnProperty(fontKey)) {
					putFont(fonts[fontKey]);
				}
			}
		},
		putXobjectDict = function() {
			// Loop through images, or other data objects
			events.publish('putXobjectDict');
		},
		putResourceDictionary = function() {
			out('/ProcSet [/PDF /Text /ImageB /ImageC /ImageI]');
			out('/Font <<');

			// Do this for each font, the '1' bit is the index of the font
			for (var fontKey in fonts) {
				if (fonts.hasOwnProperty(fontKey)) {
					out('/' + fontKey + ' ' + fonts[fontKey].objectNumber + ' 0 R');
				}
			}
			out('>>');
			out('/XObject <<');
			putXobjectDict();
			out('>>');
		},
		putResources = function() {
			putFonts();
			events.publish('putResources');
			// Resource dictionary
			offsets[2] = content_length;
			out('2 0 obj');
			out('<<');
			putResourceDictionary();
			out('>>');
			out('endobj');
			events.publish('postPutResources');
		},
		addToFontDictionary = function(fontKey, fontName, fontStyle) {
			// this is mapping structure for quick font key lookup.
			// returns the KEY of the font (ex: "F1") for a given
			// pair of font name and type (ex: "Arial". "Italic")
			if (!fontmap.hasOwnProperty(fontName)) {
				fontmap[fontName] = {};
			}
			fontmap[fontName][fontStyle] = fontKey;
		},
		/**
		 * FontObject describes a particular font as member of an instnace of jsPDF
		 *
		 * It's a collection of properties like 'id' (to be used in PDF stream),
		 * 'fontName' (font's family name), 'fontStyle' (font's style variant label)
		 *
		 * @class
		 * @public
		 * @property id {String} PDF-document-instance-specific label assinged to the font.
		 * @property PostScriptName {String} PDF specification full name for the font
		 * @property encoding {Object} Encoding_name-to-Font_metrics_object mapping.
		 * @name FontObject
		 */
		addFont = function(PostScriptName, fontName, fontStyle, encoding) {
			var fontKey = 'F' + (Object.keys(fonts).length + 1).toString(10),
			// This is FontObject
			font = fonts[fontKey] = {
				'id'             : fontKey,
				'PostScriptName' : PostScriptName,
				'fontName'       : fontName,
				'fontStyle'      : fontStyle,
				'encoding'       : encoding,
				'metadata'       : {}
			};
			addToFontDictionary(fontKey, fontName, fontStyle);
			events.publish('addFont', font);

			return fontKey;
		},
		addFonts = function() {

			var HELVETICA     = "helvetica",
				TIMES         = "times",
				COURIER       = "courier",
				NORMAL        = "normal",
				BOLD          = "bold",
				ITALIC        = "italic",
				BOLD_ITALIC   = "bolditalic",
				encoding      = 'StandardEncoding',
				standardFonts = [
					['Helvetica', HELVETICA, NORMAL],
					['Helvetica-Bold', HELVETICA, BOLD],
					['Helvetica-Oblique', HELVETICA, ITALIC],
					['Helvetica-BoldOblique', HELVETICA, BOLD_ITALIC],
					['Courier', COURIER, NORMAL],
					['Courier-Bold', COURIER, BOLD],
					['Courier-Oblique', COURIER, ITALIC],
					['Courier-BoldOblique', COURIER, BOLD_ITALIC],
					['Times-Roman', TIMES, NORMAL],
					['Times-Bold', TIMES, BOLD],
					['Times-Italic', TIMES, ITALIC],
					['Times-BoldItalic', TIMES, BOLD_ITALIC]
				];

			for (var i = 0, l = standardFonts.length; i < l; i++) {
				var fontKey = addFont(
						standardFonts[i][0],
						standardFonts[i][1],
						standardFonts[i][2],
						encoding);

				// adding aliases for standard fonts, this time matching the capitalization
				var parts = standardFonts[i][0].split('-');
				addToFontDictionary(fontKey, parts[0], parts[1] || '');
			}
			events.publish('addFonts', { fonts : fonts, dictionary : fontmap });
		},
		SAFE = function __safeCall(fn) {
			fn.foo = function __safeCallWrapper() {
				try {
					return fn.apply(this, arguments);
				} catch (e) {
					var stack = e.stack || '';
					if(~stack.indexOf(' at ')) stack = stack.split(" at ")[1];
					var m = "Error in function " + stack.split("\n")[0].split('<')[0] + ": " + e.message;
					if(global.console) {
						global.console.error(m, e);
						if(global.alert) alert(m);
					} else {
						throw new Error(m);
					}
				}
			};
			fn.foo.bar = fn;
			return fn.foo;
		},
		to8bitStream = function(text, flags) {
		/**
		 * PDF 1.3 spec:
		 * "For text strings encoded in Unicode, the first two bytes must be 254 followed by
		 * 255, representing the Unicode byte order marker, U+FEFF. (This sequence conflicts
		 * with the PDFDocEncoding character sequence thorn ydieresis, which is unlikely
		 * to be a meaningful beginning of a word or phrase.) The remainder of the
		 * string consists of Unicode character codes, according to the UTF-16 encoding
		 * specified in the Unicode standard, version 2.0. Commonly used Unicode values
		 * are represented as 2 bytes per character, with the high-order byte appearing first
		 * in the string."
		 *
		 * In other words, if there are chars in a string with char code above 255, we
		 * recode the string to UCS2 BE - string doubles in length and BOM is prepended.
		 *
		 * HOWEVER!
		 * Actual *content* (body) text (as opposed to strings used in document properties etc)
		 * does NOT expect BOM. There, it is treated as a literal GID (Glyph ID)
		 *
		 * Because of Adobe's focus on "you subset your fonts!" you are not supposed to have
		 * a font that maps directly Unicode (UCS2 / UTF16BE) code to font GID, but you could
		 * fudge it with "Identity-H" encoding and custom CIDtoGID map that mimics Unicode
		 * code page. There, however, all characters in the stream are treated as GIDs,
		 * including BOM, which is the reason we need to skip BOM in content text (i.e. that
		 * that is tied to a font).
		 *
		 * To signal this "special" PDFEscape / to8bitStream handling mode,
		 * API.text() function sets (unless you overwrite it with manual values
		 * given to API.text(.., flags) )
		 * flags.autoencode = true
		 * flags.noBOM = true
		 *
		 * ===================================================================================
		 * `flags` properties relied upon:
		 *   .sourceEncoding = string with encoding label.
		 *                     "Unicode" by default. = encoding of the incoming text.
		 *                     pass some non-existing encoding name
		 *                     (ex: 'Do not touch my strings! I know what I am doing.')
		 *                     to make encoding code skip the encoding step.
		 *   .outputEncoding = Either valid PDF encoding name
		 *                     (must be supported by jsPDF font metrics, otherwise no encoding)
		 *                     or a JS object, where key = sourceCharCode, value = outputCharCode
		 *                     missing keys will be treated as: sourceCharCode === outputCharCode
		 *   .noBOM
		 *       See comment higher above for explanation for why this is important
		 *   .autoencode
		 *       See comment higher above for explanation for why this is important
		 */

			var i,l,sourceEncoding,encodingBlock,outputEncoding,newtext,isUnicode,ch,bch;

			flags = flags || {};
			sourceEncoding = flags.sourceEncoding || 'Unicode';
			outputEncoding = flags.outputEncoding;

			// This 'encoding' section relies on font metrics format
			// attached to font objects by, among others,
			// "Willow Systems' standard_font_metrics plugin"
			// see jspdf.plugin.standard_font_metrics.js for format
			// of the font.metadata.encoding Object.
			// It should be something like
			//   .encoding = {'codePages':['WinANSI....'], 'WinANSI...':{code:code, ...}}
			//   .widths = {0:width, code:width, ..., 'fof':divisor}
			//   .kerning = {code:{previous_char_code:shift, ..., 'fof':-divisor},...}
			if ((flags.autoencode || outputEncoding) &&
				fonts[activeFontKey].metadata &&
				fonts[activeFontKey].metadata[sourceEncoding] &&
				fonts[activeFontKey].metadata[sourceEncoding].encoding) {
				encodingBlock = fonts[activeFontKey].metadata[sourceEncoding].encoding;

				// each font has default encoding. Some have it clearly defined.
				if (!outputEncoding && fonts[activeFontKey].encoding) {
					outputEncoding = fonts[activeFontKey].encoding;
				}

				// Hmmm, the above did not work? Let's try again, in different place.
				if (!outputEncoding && encodingBlock.codePages) {
					outputEncoding = encodingBlock.codePages[0]; // let's say, first one is the default
				}

				if (typeof outputEncoding === 'string') {
					outputEncoding = encodingBlock[outputEncoding];
				}
				// we want output encoding to be a JS Object, where
				// key = sourceEncoding's character code and
				// value = outputEncoding's character code.
				if (outputEncoding) {
					isUnicode = false;
					newtext = [];
					for (i = 0, l = text.length; i < l; i++) {
						ch = outputEncoding[text.charCodeAt(i)];
						if (ch) {
							newtext.push(
								String.fromCharCode(ch));
						} else {
							newtext.push(
								text[i]);
						}

						// since we are looping over chars anyway, might as well
						// check for residual unicodeness
						if (newtext[i].charCodeAt(0) >> 8) {
							/* more than 255 */
							isUnicode = true;
						}
					}
					text = newtext.join('');
				}
			}

			i = text.length;
			// isUnicode may be set to false above. Hence the triple-equal to undefined
			while (isUnicode === undefined && i !== 0) {
				if (text.charCodeAt(i - 1) >> 8) {
					/* more than 255 */
					isUnicode = true;
				}
				i--;
			}
			if (!isUnicode) {
				return text;
			}

			newtext = flags.noBOM ? [] : [254, 255];
			for (i = 0, l = text.length; i < l; i++) {
				ch = text.charCodeAt(i);
				bch = ch >> 8; // divide by 256
				if (bch >> 8) {
					/* something left after dividing by 256 second time */
					throw new Error("Character at position " + i + " of string '"
						+ text + "' exceeds 16bits. Cannot be encoded into UCS-2 BE");
				}
				newtext.push(bch);
				newtext.push(ch - (bch << 8));
			}
			return String.fromCharCode.apply(undefined, newtext);
		},
		pdfEscape = function(text, flags) {
			/**
			 * Replace '/', '(', and ')' with pdf-safe versions
			 *
			 * Doing to8bitStream does NOT make this PDF display unicode text. For that
			 * we also need to reference a unicode font and embed it - royal pain in the rear.
			 *
			 * There is still a benefit to to8bitStream - PDF simply cannot handle 16bit chars,
			 * which JavaScript Strings are happy to provide. So, while we still cannot display
			 * 2-byte characters property, at least CONDITIONALLY converting (entire string containing)
			 * 16bit chars to (USC-2-BE) 2-bytes per char + BOM streams we ensure that entire PDF
			 * is still parseable.
			 * This will allow immediate support for unicode in document properties strings.
			 */
			return to8bitStream(text, flags).replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
		},
		putInfo = function() {
			out('/Producer (jsPDF ' + jsPDF.version + ')');
			for(var key in documentProperties) {
				if(documentProperties.hasOwnProperty(key) && documentProperties[key]) {
					out('/'+key.substr(0,1).toUpperCase() + key.substr(1)
						+' (' + pdfEscape(documentProperties[key]) + ')');
				}
			}
			var created  = new Date(),
				tzoffset = created.getTimezoneOffset(),
				tzsign   = tzoffset < 0 ? '+' : '-',
				tzhour   = Math.floor(Math.abs(tzoffset / 60)),
				tzmin    = Math.abs(tzoffset % 60),
				tzstr    = [tzsign, padd2(tzhour), "'", padd2(tzmin), "'"].join('');
			out(['/CreationDate (D:',
					created.getFullYear(),
					padd2(created.getMonth() + 1),
					padd2(created.getDate()),
					padd2(created.getHours()),
					padd2(created.getMinutes()),
					padd2(created.getSeconds()), tzstr, ')'].join(''));
		},
		putCatalog = function() {
			out('/Type /Catalog');
			out('/Pages 1 0 R');
			// PDF13ref Section 7.2.1
			if (!zoomMode) zoomMode = 'fullwidth';
			switch(zoomMode) {
				case 'fullwidth'  : out('/OpenAction [3 0 R /FitH null]');       break;
				case 'fullheight' : out('/OpenAction [3 0 R /FitV null]');       break;
				case 'fullpage'   : out('/OpenAction [3 0 R /Fit]');             break;
				case 'original'   : out('/OpenAction [3 0 R /XYZ null null 1]'); break;
				default:
					var pcn = '' + zoomMode;
					if (pcn.substr(pcn.length-1) === '%')
						zoomMode = parseInt(zoomMode) / 100;
					if (typeof zoomMode === 'number') {
						out('/OpenAction [3 0 R /XYZ null null '+f2(zoomMode)+']');
					}
			}
			if (!layoutMode) layoutMode = 'continuous';
			switch(layoutMode) {
				case 'continuous' : out('/PageLayout /OneColumn');      break;
				case 'single'     : out('/PageLayout /SinglePage');     break;
				case 'two':
				case 'twoleft'    : out('/PageLayout /TwoColumnLeft');  break;
				case 'tworight'   : out('/PageLayout /TwoColumnRight'); break;
			}
			if (pageMode) {
				/**
				 * A name object specifying how the document should be displayed when opened:
				 * UseNone      : Neither document outline nor thumbnail images visible -- DEFAULT
				 * UseOutlines  : Document outline visible
				 * UseThumbs    : Thumbnail images visible
				 * FullScreen   : Full-screen mode, with no menu bar, window controls, or any other window visible
				 */
				out('/PageMode /' + pageMode);
			}
			events.publish('putCatalog');
		},
		putTrailer = function() {
			out('/Size ' + (objectNumber + 1));
			out('/Root ' + objectNumber + ' 0 R');
			out('/Info ' + (objectNumber - 1) + ' 0 R');
		},
		beginPage = function(width,height) {
			// Dimensions are stored as user units and converted to points on output
			var orientation = typeof height === 'string' && height.toLowerCase();
			if (typeof width === 'string') {
				var format = width.toLowerCase();
				if (pageFormats.hasOwnProperty(format)) {
					width  = pageFormats[format][0] / k;
					height = pageFormats[format][1] / k;
				}
			}
			if (Array.isArray(width)) {
				height = width[1];
				width = width[0];
			}
			if (orientation) {
				switch(orientation.substr(0,1)) {
					case 'l': if (height > width ) orientation = 's'; break;
					case 'p': if (width > height ) orientation = 's'; break;
				}
				if (orientation === 's') { tmp = width; width = height; height = tmp; }
			}
			outToPages = true;
			pages[++page] = [];
			pagedim[page] = {
				width  : Number(width)  || pageWidth,
				height : Number(height) || pageHeight
			};
			_setPage(page);
		},
		_addPage = function() {
			beginPage.apply(this, arguments);
			// Set line width
			out(f2(lineWidth * k) + ' w');
			// Set draw color
			out(drawColor);
			// resurrecting non-default line caps, joins
			if (lineCapID !== 0) {
				out(lineCapID + ' J');
			}
			if (lineJoinID !== 0) {
				out(lineJoinID + ' j');
			}
			events.publish('addPage', { pageNumber : page });
		},
		_setPage = function(n) {
			if (n > 0 && n <= page) {
				currentPage = n;
				pageWidth = pagedim[n].width;
				pageHeight = pagedim[n].height;
			}
		},
		/**
		 * Returns a document-specific font key - a label assigned to a
		 * font name + font type combination at the time the font was added
		 * to the font inventory.
		 *
		 * Font key is used as label for the desired font for a block of text
		 * to be added to the PDF document stream.
		 * @private
		 * @function
		 * @param fontName {String} can be undefined on "falthy" to indicate "use current"
		 * @param fontStyle {String} can be undefined on "falthy" to indicate "use current"
		 * @returns {String} Font key.
		 */
		getFont = function(fontName, fontStyle) {
			var key;

			fontName  = fontName  !== undefined ? fontName  : fonts[activeFontKey].fontName;
			fontStyle = fontStyle !== undefined ? fontStyle : fonts[activeFontKey].fontStyle;

			try {
			 // get a string like 'F3' - the KEY corresponding tot he font + type combination.
				key = fontmap[fontName][fontStyle];
			} catch (e) {}

			if (!key) {
				throw new Error("Unable to look up font label for font '" + fontName + "', '"
					+ fontStyle + "'. Refer to getFontList() for available fonts.");
			}
			return key;
		},
		buildDocument = function() {

			outToPages = false; // switches out() to content
			objectNumber = 2;
			content = [];
			offsets = [];

			// putHeader()
			out('%PDF-' + pdfVersion);

			putPages();

			putResources();

			// Info
			newObject();
			out('<<');
			putInfo();
			out('>>');
			out('endobj');

			// Catalog
			newObject();
			out('<<');
			putCatalog();
			out('>>');
			out('endobj');

			// Cross-ref
			var o = content_length, i, p = "0000000000";
			out('xref');
			out('0 ' + (objectNumber + 1));
			out(p+' 65535 f ');
			for (i = 1; i <= objectNumber; i++) {
				out((p + offsets[i]).slice(-10) + ' 00000 n ');
			}
			// Trailer
			out('trailer');
			out('<<');
			putTrailer();
			out('>>');
			out('startxref');
			out(o);
			out('%%EOF');

			outToPages = true;

			return content.join('\n');
		},
		getStyle = function(style) {
			// see path-painting operators in PDF spec
			var op = 'S'; // stroke
			if (style === 'F') {
				op = 'f'; // fill
			} else if (style === 'FD' || style === 'DF') {
				op = 'B'; // both
			} else if (style === 'f' || style === 'f*' || style === 'B' || style === 'B*') {
				/*
				Allow direct use of these PDF path-painting operators:
				- f	fill using nonzero winding number rule
				- f*	fill using even-odd rule
				- B	fill then stroke with fill using non-zero winding number rule
				- B*	fill then stroke with fill using even-odd rule
				*/
				op = style;
			}
			return op;
		},
		getArrayBuffer = function() {
			var data = buildDocument(), len = data.length,
				ab = new ArrayBuffer(len), u8 = new Uint8Array(ab);

			while(len--) u8[len] = data.charCodeAt(len);
			return ab;
		},
		getBlob = function() {
			return new Blob([getArrayBuffer()], { type : "application/pdf" });
		},
		/**
		 * Generates the PDF document.
		 *
		 * If `type` argument is undefined, output is raw body of resulting PDF returned as a string.
		 *
		 * @param {String} type A string identifying one of the possible output types.
		 * @param {Object} options An object providing some additional signalling to PDF generator.
		 * @function
		 * @returns {jsPDF}
		 * @methodOf jsPDF#
		 * @name output
		 */
		output = SAFE(function(type, options) {
			var datauri = ('' + type).substr(0,6) === 'dataur'
				? 'data:application/pdf;base64,'+btoa(buildDocument()):0;

			switch (type) {
				case undefined:
					return buildDocument();
				case 'save':
					if (navigator.getUserMedia) {
						if (global.URL === undefined
						|| global.URL.createObjectURL === undefined) {
							return API.output('dataurlnewwindow');
						}
					}
					saveAs(getBlob(), options);
					if(typeof saveAs.unload === 'function') {
						if(global.setTimeout) {
							setTimeout(saveAs.unload,911);
						}
					}
					break;
				case 'arraybuffer':
					return getArrayBuffer();
				case 'blob':
					return getBlob();
				case 'bloburi':
				case 'bloburl':
					// User is responsible of calling revokeObjectURL
					return global.URL && global.URL.createObjectURL(getBlob()) || void 0;
				case 'datauristring':
				case 'dataurlstring':
					return datauri;
				case 'dataurlnewwindow':
					var nW = global.open(datauri);
					if (nW || typeof safari === "undefined") return nW;
					/* pass through */
				case 'datauri':
				case 'dataurl':
					return global.document.location.href = datauri;
				default:
					throw new Error('Output type "' + type + '" is not supported.');
			}
			// @TODO: Add different output options
		});

		switch (unit) {
			case 'pt':  k = 1;          break;
			case 'mm':  k = 72 / 25.4;  break;
			case 'cm':  k = 72 / 2.54;  break;
			case 'in':  k = 72;         break;
			case 'px':  k = 96 / 72;    break;
			case 'pc':  k = 12;         break;
			case 'em':  k = 12;         break;
			case 'ex':  k = 6;          break;
			default:
				throw ('Invalid unit: ' + unit);
		}

		//---------------------------------------
		// Public API

		/**
		 * Object exposing internal API to plugins
		 * @public
		 */
		API.internal = {
			'pdfEscape' : pdfEscape,
			'getStyle' : getStyle,
			/**
			 * Returns {FontObject} describing a particular font.
			 * @public
			 * @function
			 * @param fontName {String} (Optional) Font's family name
			 * @param fontStyle {String} (Optional) Font's style variation name (Example:"Italic")
			 * @returns {FontObject}
			 */
			'getFont' : function() {
				return fonts[getFont.apply(API, arguments)];
			},
			'getFontSize' : function() {
				return activeFontSize;
			},
			'getLineHeight' : function() {
				return activeFontSize * lineHeightProportion;
			},
			'write' : function(string1 /*, string2, string3, etc */) {
				out(arguments.length === 1 ? string1 : Array.prototype.join.call(arguments, ' '));
			},
			'getCoordinateString' : function(value) {
				return f2(value * k);
			},
			'getVerticalCoordinateString' : function(value) {
				return f2((pageHeight - value) * k);
			},
			'collections' : {},
			'newObject' : newObject,
			'putStream' : putStream,
			'events' : events,
			// ratio that you use in multiplication of a given "size" number to arrive to 'point'
			// units of measurement.
			// scaleFactor is set at initialization of the document and calculated against the stated
			// default measurement units for the document.
			// If default is "mm", k is the number that will turn number in 'mm' into 'points' number.
			// through multiplication.
			'scaleFactor' : k,
			'pageSize' : {
				get width() {
					return pageWidth
				},
				get height() {
					return pageHeight
				}
			},
			'output' : function(type, options) {
				return output(type, options);
			},
			'getNumberOfPages' : function() {
				return pages.length - 1;
			},
			'pages' : pages
		};

		/**
		 * Adds (and transfers the focus to) new page to the PDF document.
		 * @function
		 * @returns {jsPDF}
		 *
		 * @methodOf jsPDF#
		 * @name addPage
		 */
		API.addPage = function() {
			_addPage.apply(this, arguments);
			return this;
		};
		API.setPage = function() {
			_setPage.apply(this, arguments);
			return this;
		};
		API.setDisplayMode = function(zoom, layout, pmode) {
			zoomMode   = zoom;
			layoutMode = layout;
			pageMode   = pmode;
			return this;
		},

		/**
		 * Adds text to page. Supports adding multiline text when 'text' argument is an Array of Strings.
		 *
		 * @function
		 * @param {String|Array} text String or array of strings to be added to the page. Each line is shifted one line down per font, spacing settings declared before this call.
		 * @param {Number} x Coordinate (in units declared at inception of PDF document) against left edge of the page
		 * @param {Number} y Coordinate (in units declared at inception of PDF document) against upper edge of the page
		 * @param {Object} flags Collection of settings signalling how the text must be encoded. Defaults are sane. If you think you want to pass some flags, you likely can read the source.
		 * @returns {jsPDF}
		 * @methodOf jsPDF#
		 * @name text
		 */
		API.text = function(text, x, y, flags, angle) {
			/**
			 * Inserts something like this into PDF
			 *   BT
			 *    /F1 16 Tf  % Font name + size
			 *    16 TL % How many units down for next line in multiline text
			 *    0 g % color
			 *    28.35 813.54 Td % position
			 *    (line one) Tj
			 *    T* (line two) Tj
			 *    T* (line three) Tj
			 *   ET
			 */
			function ESC(s) {
				s = s.split("\t").join(Array(options.TabLen||9).join(" "));
				return pdfEscape(s, flags);
			}

			// Pre-August-2012 the order of arguments was function(x, y, text, flags)
			// in effort to make all calls have similar signature like
			//   function(data, coordinates... , miscellaneous)
			// this method had its args flipped.
			// code below allows backward compatibility with old arg order.
			if (typeof text === 'number') {
				tmp = y;
				y = x;
				x = text;
				text = tmp;
			}

			// If there are any newlines in text, we assume
			// the user wanted to print multiple lines, so break the
			// text up into an array.  If the text is already an array,
			// we assume the user knows what they are doing.
			if (typeof text === 'string' && text.match(/[\n\r]/)) {
				text = text.split(/\r\n|\r|\n/g);
			}
			if (typeof flags === 'number') {
				angle = flags;
				flags = null;
			}
			var xtra = '',mode = 'Td', todo;
			if (angle) {
				angle *= (Math.PI / 180);
				var c = Math.cos(angle),
				s = Math.sin(angle);
				xtra = [f2(c), f2(s), f2(s * -1), f2(c), ''].join(" ");
				mode = 'Tm';
			}
			flags = flags || {};
			if (!('noBOM' in flags))
				flags.noBOM = true;
			if (!('autoencode' in flags))
				flags.autoencode = true;

			if (typeof text === 'string') {
				text = ESC(text);
			} else if (text instanceof Array) {
				// we don't want to destroy  original text array, so cloning it
				var sa = text.concat(), da = [], len = sa.length;
				// we do array.join('text that must not be PDFescaped")
				// thus, pdfEscape each component separately
				while (len--) {
					da.push(ESC(sa.shift()));
				}
				var linesLeft = Math.ceil((pageHeight - y) * k / (activeFontSize * lineHeightProportion));
				if (0 <= linesLeft && linesLeft < da.length + 1) {
					todo = da.splice(linesLeft-1);
				}
				text = da.join(") Tj\nT* (");
			} else {
				throw new Error('Type of text must be string or Array. "' + text + '" is not recognized.');
			}
			// Using "'" ("go next line and render text" mark) would save space but would complicate our rendering code, templates

			// BT .. ET does NOT have default settings for Tf. You must state that explicitely every time for BT .. ET
			// if you want text transformation matrix (+ multiline) to work reliably (which reads sizes of things from font declarations)
			// Thus, there is NO useful, *reliable* concept of "default" font for a page.
			// The fact that "default" (reuse font used before) font worked before in basic cases is an accident
			// - readers dealing smartly with brokenness of jsPDF's markup.
			out(
				'BT\n/' +
				activeFontKey + ' ' + activeFontSize + ' Tf\n' +     // font face, style, size
				(activeFontSize * lineHeightProportion) + ' TL\n' +  // line spacing
				textColor +
				'\n' + xtra + f2(x * k) + ' ' + f2((pageHeight - y) * k) + ' ' + mode + '\n(' +
				text +
				') Tj\nET');

			if (todo) {
				this.addPage();
				this.text( todo, x, activeFontSize * 1.7 / k);
			}

			return this;
		};

		API.lstext = function(text, x, y, spacing) {
			for (var i = 0, len = text.length ; i < len; i++, x += spacing) this.text(text[i], x, y);
		};

		API.line = function(x1, y1, x2, y2) {
			return this.lines([[x2 - x1, y2 - y1]], x1, y1);
		};

		API.clip = function() {
			// By patrick-roberts, github.com/MrRio/jsPDF/issues/328
			// Call .clip() after calling .rect() with a style argument of null
			out('W') // clip
			out('S') // stroke path; necessary for clip to work
		};

		/**
		 * Adds series of curves (straight lines or cubic bezier curves) to canvas, starting at `x`, `y` coordinates.
		 * All data points in `lines` are relative to last line origin.
		 * `x`, `y` become x1,y1 for first line / curve in the set.
		 * For lines you only need to specify [x2, y2] - (ending point) vector against x1, y1 starting point.
		 * For bezier curves you need to specify [x2,y2,x3,y3,x4,y4] - vectors to control points 1, 2, ending point. All vectors are against the start of the curve - x1,y1.
		 *
		 * @example .lines([[2,2],[-2,2],[1,1,2,2,3,3],[2,1]], 212,110, 10) // line, line, bezier curve, line
		 * @param {Array} lines Array of *vector* shifts as pairs (lines) or sextets (cubic bezier curves).
		 * @param {Number} x Coordinate (in units declared at inception of PDF document) against left edge of the page
		 * @param {Number} y Coordinate (in units declared at inception of PDF document) against upper edge of the page
		 * @param {Number} scale (Defaults to [1.0,1.0]) x,y Scaling factor for all vectors. Elements can be any floating number Sub-one makes drawing smaller. Over-one grows the drawing. Negative flips the direction.
		 * @param {String} style A string specifying the painting style or null.  Valid styles include: 'S' [default] - stroke, 'F' - fill,  and 'DF' (or 'FD') -  fill then stroke. A null value postpones setting the style so that a shape may be composed using multiple method calls. The last drawing method call used to define the shape should not have a null style argument.
		 * @param {Boolean} closed If true, the path is closed with a straight line from the end of the last curve to the starting point.
		 * @function
		 * @returns {jsPDF}
		 * @methodOf jsPDF#
		 * @name lines
		 */
		API.lines = function(lines, x, y, scale, style, closed) {
			var scalex,scaley,i,l,leg,x2,y2,x3,y3,x4,y4;

			// Pre-August-2012 the order of arguments was function(x, y, lines, scale, style)
			// in effort to make all calls have similar signature like
			//   function(content, coordinateX, coordinateY , miscellaneous)
			// this method had its args flipped.
			// code below allows backward compatibility with old arg order.
			if (typeof lines === 'number') {
				tmp = y;
				y = x;
				x = lines;
				lines = tmp;
			}

			scale = scale || [1, 1];

			// starting point
			out(f3(x * k) + ' ' + f3((pageHeight - y) * k) + ' m ');

			scalex = scale[0];
			scaley = scale[1];
			l = lines.length;
			//, x2, y2 // bezier only. In page default measurement "units", *after* scaling
			//, x3, y3 // bezier only. In page default measurement "units", *after* scaling
			// ending point for all, lines and bezier. . In page default measurement "units", *after* scaling
			x4 = x; // last / ending point = starting point for first item.
			y4 = y; // last / ending point = starting point for first item.

			for (i = 0; i < l; i++) {
				leg = lines[i];
				if (leg.length === 2) {
					// simple line
					x4 = leg[0] * scalex + x4; // here last x4 was prior ending point
					y4 = leg[1] * scaley + y4; // here last y4 was prior ending point
					out(f3(x4 * k) + ' ' + f3((pageHeight - y4) * k) + ' l');
				} else {
					// bezier curve
					x2 = leg[0] * scalex + x4; // here last x4 is prior ending point
					y2 = leg[1] * scaley + y4; // here last y4 is prior ending point
					x3 = leg[2] * scalex + x4; // here last x4 is prior ending point
					y3 = leg[3] * scaley + y4; // here last y4 is prior ending point
					x4 = leg[4] * scalex + x4; // here last x4 was prior ending point
					y4 = leg[5] * scaley + y4; // here last y4 was prior ending point
					out(
						f3(x2 * k) + ' ' +
						f3((pageHeight - y2) * k) + ' ' +
						f3(x3 * k) + ' ' +
						f3((pageHeight - y3) * k) + ' ' +
						f3(x4 * k) + ' ' +
						f3((pageHeight - y4) * k) + ' c');
				}
			}

			if (closed) {
				out(' h');
			}

			// stroking / filling / both the path
			if (style !== null) {
				out(getStyle(style));
			}
			return this;
		};

		/**
		 * Adds a rectangle to PDF
		 *
		 * @param {Number} x Coordinate (in units declared at inception of PDF document) against left edge of the page
		 * @param {Number} y Coordinate (in units declared at inception of PDF document) against upper edge of the page
		 * @param {Number} w Width (in units declared at inception of PDF document)
		 * @param {Number} h Height (in units declared at inception of PDF document)
		 * @param {String} style A string specifying the painting style or null.  Valid styles include: 'S' [default] - stroke, 'F' - fill,  and 'DF' (or 'FD') -  fill then stroke. A null value postpones setting the style so that a shape may be composed using multiple method calls. The last drawing method call used to define the shape should not have a null style argument.
		 * @function
		 * @returns {jsPDF}
		 * @methodOf jsPDF#
		 * @name rect
		 */
		API.rect = function(x, y, w, h, style) {
			var op = getStyle(style);
			out([
					f2(x * k),
					f2((pageHeight - y) * k),
					f2(w * k),
					f2(-h * k),
					're'
				].join(' '));

			if (style !== null) {
				out(getStyle(style));
			}

			return this;
		};

		/**
		 * Adds a triangle to PDF
		 *
		 * @param {Number} x1 Coordinate (in units declared at inception of PDF document) against left edge of the page
		 * @param {Number} y1 Coordinate (in units declared at inception of PDF document) against upper edge of the page
		 * @param {Number} x2 Coordinate (in units declared at inception of PDF document) against left edge of the page
		 * @param {Number} y2 Coordinate (in units declared at inception of PDF document) against upper edge of the page
		 * @param {Number} x3 Coordinate (in units declared at inception of PDF document) against left edge of the page
		 * @param {Number} y3 Coordinate (in units declared at inception of PDF document) against upper edge of the page
		 * @param {String} style A string specifying the painting style or null.  Valid styles include: 'S' [default] - stroke, 'F' - fill,  and 'DF' (or 'FD') -  fill then stroke. A null value postpones setting the style so that a shape may be composed using multiple method calls. The last drawing method call used to define the shape should not have a null style argument.
		 * @function
		 * @returns {jsPDF}
		 * @methodOf jsPDF#
		 * @name triangle
		 */
		API.triangle = function(x1, y1, x2, y2, x3, y3, style) {
			this.lines(
				[
					[x2 - x1, y2 - y1], // vector to point 2
					[x3 - x2, y3 - y2], // vector to point 3
					[x1 - x3, y1 - y3]// closing vector back to point 1
				],
				x1,
				y1, // start of path
				[1, 1],
				style,
				true);
			return this;
		};

		/**
		 * Adds a rectangle with rounded corners to PDF
		 *
		 * @param {Number} x Coordinate (in units declared at inception of PDF document) against left edge of the page
		 * @param {Number} y Coordinate (in units declared at inception of PDF document) against upper edge of the page
		 * @param {Number} w Width (in units declared at inception of PDF document)
		 * @param {Number} h Height (in units declared at inception of PDF document)
		 * @param {Number} rx Radius along x axis (in units declared at inception of PDF document)
		 * @param {Number} rx Radius along y axis (in units declared at inception of PDF document)
		 * @param {String} style A string specifying the painting style or null.  Valid styles include: 'S' [default] - stroke, 'F' - fill,  and 'DF' (or 'FD') -  fill then stroke. A null value postpones setting the style so that a shape may be composed using multiple method calls. The last drawing method call used to define the shape should not have a null style argument.
		 * @function
		 * @returns {jsPDF}
		 * @methodOf jsPDF#
		 * @name roundedRect
		 */
		API.roundedRect = function(x, y, w, h, rx, ry, style) {
			var MyArc = 4 / 3 * (Math.SQRT2 - 1);
			this.lines(
				[
					[(w - 2 * rx), 0],
					[(rx * MyArc), 0, rx, ry - (ry * MyArc), rx, ry],
					[0, (h - 2 * ry)],
					[0, (ry * MyArc),  - (rx * MyArc), ry, -rx, ry],
					[(-w + 2 * rx), 0],
					[ - (rx * MyArc), 0, -rx,  - (ry * MyArc), -rx, -ry],
					[0, (-h + 2 * ry)],
					[0,  - (ry * MyArc), (rx * MyArc), -ry, rx, -ry]
				],
				x + rx,
				y, // start of path
				[1, 1],
				style);
			return this;
		};

		/**
		 * Adds an ellipse to PDF
		 *
		 * @param {Number} x Coordinate (in units declared at inception of PDF document) against left edge of the page
		 * @param {Number} y Coordinate (in units declared at inception of PDF document) against upper edge of the page
		 * @param {Number} rx Radius along x axis (in units declared at inception of PDF document)
		 * @param {Number} rx Radius along y axis (in units declared at inception of PDF document)
		 * @param {String} style A string specifying the painting style or null.  Valid styles include: 'S' [default] - stroke, 'F' - fill,  and 'DF' (or 'FD') -  fill then stroke. A null value postpones setting the style so that a shape may be composed using multiple method calls. The last drawing method call used to define the shape should not have a null style argument.
		 * @function
		 * @returns {jsPDF}
		 * @methodOf jsPDF#
		 * @name ellipse
		 */
		API.ellipse = function(x, y, rx, ry, style) {
			var lx = 4 / 3 * (Math.SQRT2 - 1) * rx,
				ly = 4 / 3 * (Math.SQRT2 - 1) * ry;

			out([
					f2((x + rx) * k),
					f2((pageHeight - y) * k),
					'm',
					f2((x + rx) * k),
					f2((pageHeight - (y - ly)) * k),
					f2((x + lx) * k),
					f2((pageHeight - (y - ry)) * k),
					f2(x * k),
					f2((pageHeight - (y - ry)) * k),
					'c'
				].join(' '));
			out([
					f2((x - lx) * k),
					f2((pageHeight - (y - ry)) * k),
					f2((x - rx) * k),
					f2((pageHeight - (y - ly)) * k),
					f2((x - rx) * k),
					f2((pageHeight - y) * k),
					'c'
				].join(' '));
			out([
					f2((x - rx) * k),
					f2((pageHeight - (y + ly)) * k),
					f2((x - lx) * k),
					f2((pageHeight - (y + ry)) * k),
					f2(x * k),
					f2((pageHeight - (y + ry)) * k),
					'c'
				].join(' '));
			out([
					f2((x + lx) * k),
					f2((pageHeight - (y + ry)) * k),
					f2((x + rx) * k),
					f2((pageHeight - (y + ly)) * k),
					f2((x + rx) * k),
					f2((pageHeight - y) * k),
					'c'
				].join(' '));

			if (style !== null) {
				out(getStyle(style));
			}

			return this;
		};

		/**
		 * Adds an circle to PDF
		 *
		 * @param {Number} x Coordinate (in units declared at inception of PDF document) against left edge of the page
		 * @param {Number} y Coordinate (in units declared at inception of PDF document) against upper edge of the page
		 * @param {Number} r Radius (in units declared at inception of PDF document)
		 * @param {String} style A string specifying the painting style or null.  Valid styles include: 'S' [default] - stroke, 'F' - fill,  and 'DF' (or 'FD') -  fill then stroke. A null value postpones setting the style so that a shape may be composed using multiple method calls. The last drawing method call used to define the shape should not have a null style argument.
		 * @function
		 * @returns {jsPDF}
		 * @methodOf jsPDF#
		 * @name circle
		 */
		API.circle = function(x, y, r, style) {
			return this.ellipse(x, y, r, r, style);
		};

		/**
		 * Adds a properties to the PDF document
		 *
		 * @param {Object} A property_name-to-property_value object structure.
		 * @function
		 * @returns {jsPDF}
		 * @methodOf jsPDF#
		 * @name setProperties
		 */
		API.setProperties = function(properties) {
			// copying only those properties we can render.
			for (var property in documentProperties) {
				if (documentProperties.hasOwnProperty(property) && properties[property]) {
					documentProperties[property] = properties[property];
				}
			}
			return this;
		};

		/**
		 * Sets font size for upcoming text elements.
		 *
		 * @param {Number} size Font size in points.
		 * @function
		 * @returns {jsPDF}
		 * @methodOf jsPDF#
		 * @name setFontSize
		 */
		API.setFontSize = function(size) {
			activeFontSize = size;
			return this;
		};

		/**
		 * Sets text font face, variant for upcoming text elements.
		 * See output of jsPDF.getFontList() for possible font names, styles.
		 *
		 * @param {String} fontName Font name or family. Example: "times"
		 * @param {String} fontStyle Font style or variant. Example: "italic"
		 * @function
		 * @returns {jsPDF}
		 * @methodOf jsPDF#
		 * @name setFont
		 */
		API.setFont = function(fontName, fontStyle) {
			activeFontKey = getFont(fontName, fontStyle);
			// if font is not found, the above line blows up and we never go further
			return this;
		};

		/**
		 * Switches font style or variant for upcoming text elements,
		 * while keeping the font face or family same.
		 * See output of jsPDF.getFontList() for possible font names, styles.
		 *
		 * @param {String} style Font style or variant. Example: "italic"
		 * @function
		 * @returns {jsPDF}
		 * @methodOf jsPDF#
		 * @name setFontStyle
		 */
		API.setFontStyle = API.setFontType = function(style) {
			activeFontKey = getFont(undefined, style);
			// if font is not found, the above line blows up and we never go further
			return this;
		};

		/**
		 * Returns an object - a tree of fontName to fontStyle relationships available to
		 * active PDF document.
		 *
		 * @public
		 * @function
		 * @returns {Object} Like {'times':['normal', 'italic', ... ], 'arial':['normal', 'bold', ... ], ... }
		 * @methodOf jsPDF#
		 * @name getFontList
		 */
		API.getFontList = function() {
			// TODO: iterate over fonts array or return copy of fontmap instead in case more are ever added.
			var list = {},fontName,fontStyle,tmp;

			for (fontName in fontmap) {
				if (fontmap.hasOwnProperty(fontName)) {
					list[fontName] = tmp = [];
					for (fontStyle in fontmap[fontName]) {
						if (fontmap[fontName].hasOwnProperty(fontStyle)) {
							tmp.push(fontStyle);
						}
					}
				}
			}

			return list;
		};

		/**
		 * Sets line width for upcoming lines.
		 *
		 * @param {Number} width Line width (in units declared at inception of PDF document)
		 * @function
		 * @returns {jsPDF}
		 * @methodOf jsPDF#
		 * @name setLineWidth
		 */
		API.setLineWidth = function(width) {
			out((width * k).toFixed(2) + ' w');
			return this;
		};

		/**
		 * Sets the stroke color for upcoming elements.
		 *
		 * Depending on the number of arguments given, Gray, RGB, or CMYK
		 * color space is implied.
		 *
		 * When only ch1 is given, "Gray" color space is implied and it
		 * must be a value in the range from 0.00 (solid black) to to 1.00 (white)
		 * if values are communicated as String types, or in range from 0 (black)
		 * to 255 (white) if communicated as Number type.
		 * The RGB-like 0-255 range is provided for backward compatibility.
		 *
		 * When only ch1,ch2,ch3 are given, "RGB" color space is implied and each
		 * value must be in the range from 0.00 (minimum intensity) to to 1.00
		 * (max intensity) if values are communicated as String types, or
		 * from 0 (min intensity) to to 255 (max intensity) if values are communicated
		 * as Number types.
		 * The RGB-like 0-255 range is provided for backward compatibility.
		 *
		 * When ch1,ch2,ch3,ch4 are given, "CMYK" color space is implied and each
		 * value must be a in the range from 0.00 (0% concentration) to to
		 * 1.00 (100% concentration)
		 *
		 * Because JavaScript treats fixed point numbers badly (rounds to
		 * floating point nearest to binary representation) it is highly advised to
		 * communicate the fractional numbers as String types, not JavaScript Number type.
		 *
		 * @param {Number|String} ch1 Color channel value
		 * @param {Number|String} ch2 Color channel value
		 * @param {Number|String} ch3 Color channel value
		 * @param {Number|String} ch4 Color channel value
		 *
		 * @function
		 * @returns {jsPDF}
		 * @methodOf jsPDF#
		 * @name setDrawColor
		 */
		API.setDrawColor = function(ch1, ch2, ch3, ch4) {
			var color;
			if (ch2 === undefined || (ch4 === undefined && ch1 === ch2 === ch3)) {
				// Gray color space.
				if (typeof ch1 === 'string') {
					color = ch1 + ' G';
				} else {
					color = f2(ch1 / 255) + ' G';
				}
			} else if (ch4 === undefined) {
				// RGB
				if (typeof ch1 === 'string') {
					color = [ch1, ch2, ch3, 'RG'].join(' ');
				} else {
					color = [f2(ch1 / 255), f2(ch2 / 255), f2(ch3 / 255), 'RG'].join(' ');
				}
			} else {
				// CMYK
				if (typeof ch1 === 'string') {
					color = [ch1, ch2, ch3, ch4, 'K'].join(' ');
				} else {
					color = [f2(ch1), f2(ch2), f2(ch3), f2(ch4), 'K'].join(' ');
				}
			}

			out(color);
			return this;
		};

		/**
		 * Sets the fill color for upcoming elements.
		 *
		 * Depending on the number of arguments given, Gray, RGB, or CMYK
		 * color space is implied.
		 *
		 * When only ch1 is given, "Gray" color space is implied and it
		 * must be a value in the range from 0.00 (solid black) to to 1.00 (white)
		 * if values are communicated as String types, or in range from 0 (black)
		 * to 255 (white) if communicated as Number type.
		 * The RGB-like 0-255 range is provided for backward compatibility.
		 *
		 * When only ch1,ch2,ch3 are given, "RGB" color space is implied and each
		 * value must be in the range from 0.00 (minimum intensity) to to 1.00
		 * (max intensity) if values are communicated as String types, or
		 * from 0 (min intensity) to to 255 (max intensity) if values are communicated
		 * as Number types.
		 * The RGB-like 0-255 range is provided for backward compatibility.
		 *
		 * When ch1,ch2,ch3,ch4 are given, "CMYK" color space is implied and each
		 * value must be a in the range from 0.00 (0% concentration) to to
		 * 1.00 (100% concentration)
		 *
		 * Because JavaScript treats fixed point numbers badly (rounds to
		 * floating point nearest to binary representation) it is highly advised to
		 * communicate the fractional numbers as String types, not JavaScript Number type.
		 *
		 * @param {Number|String} ch1 Color channel value
		 * @param {Number|String} ch2 Color channel value
		 * @param {Number|String} ch3 Color channel value
		 * @param {Number|String} ch4 Color channel value
		 *
		 * @function
		 * @returns {jsPDF}
		 * @methodOf jsPDF#
		 * @name setFillColor
		 */
		API.setFillColor = function(ch1, ch2, ch3, ch4) {
			var color;

			if (ch2 === undefined || (ch4 === undefined && ch1 === ch2 === ch3)) {
				// Gray color space.
				if (typeof ch1 === 'string') {
					color = ch1 + ' g';
				} else {
					color = f2(ch1 / 255) + ' g';
				}
			} else if (ch4 === undefined) {
				// RGB
				if (typeof ch1 === 'string') {
					color = [ch1, ch2, ch3, 'rg'].join(' ');
				} else {
					color = [f2(ch1 / 255), f2(ch2 / 255), f2(ch3 / 255), 'rg'].join(' ');
				}
			} else {
				// CMYK
				if (typeof ch1 === 'string') {
					color = [ch1, ch2, ch3, ch4, 'k'].join(' ');
				} else {
					color = [f2(ch1), f2(ch2), f2(ch3), f2(ch4), 'k'].join(' ');
				}
			}

			out(color);
			return this;
		};

		/**
		 * Sets the text color for upcoming elements.
		 * If only one, first argument is given,
		 * treats the value as gray-scale color value.
		 *
		 * @param {Number} r Red channel color value in range 0-255 or {String} r color value in hexadecimal, example: '#FFFFFF'
		 * @param {Number} g Green channel color value in range 0-255
		 * @param {Number} b Blue channel color value in range 0-255
		 * @function
		 * @returns {jsPDF}
		 * @methodOf jsPDF#
		 * @name setTextColor
		 */
		API.setTextColor = function(r, g, b) {
			if ((typeof r === 'string') && /^#[0-9A-Fa-f]{6}$/.test(r)) {
				var hex = parseInt(r.substr(1), 16);
				r = (hex >> 16) & 255;
				g = (hex >> 8) & 255;
				b = (hex & 255);
			}

			if ((r === 0 && g === 0 && b === 0) || (typeof g === 'undefined')) {
				textColor = f3(r / 255) + ' g';
			} else {
				textColor = [f3(r / 255), f3(g / 255), f3(b / 255), 'rg'].join(' ');
			}
			return this;
		};

		/**
		 * Is an Object providing a mapping from human-readable to
		 * integer flag values designating the varieties of line cap
		 * and join styles.
		 *
		 * @returns {Object}
		 * @fieldOf jsPDF#
		 * @name CapJoinStyles
		 */
		API.CapJoinStyles = {
			0 : 0,
			'butt' : 0,
			'but' : 0,
			'miter' : 0,
			1 : 1,
			'round' : 1,
			'rounded' : 1,
			'circle' : 1,
			2 : 2,
			'projecting' : 2,
			'project' : 2,
			'square' : 2,
			'bevel' : 2
		};

		/**
		 * Sets the line cap styles
		 * See {jsPDF.CapJoinStyles} for variants
		 *
		 * @param {String|Number} style A string or number identifying the type of line cap
		 * @function
		 * @returns {jsPDF}
		 * @methodOf jsPDF#
		 * @name setLineCap
		 */
		API.setLineCap = function(style) {
			var id = this.CapJoinStyles[style];
			if (id === undefined) {
				throw new Error("Line cap style of '" + style + "' is not recognized. See or extend .CapJoinStyles property for valid styles");
			}
			lineCapID = id;
			out(id + ' J');

			return this;
		};

		/**
		 * Sets the line join styles
		 * See {jsPDF.CapJoinStyles} for variants
		 *
		 * @param {String|Number} style A string or number identifying the type of line join
		 * @function
		 * @returns {jsPDF}
		 * @methodOf jsPDF#
		 * @name setLineJoin
		 */
		API.setLineJoin = function(style) {
			var id = this.CapJoinStyles[style];
			if (id === undefined) {
				throw new Error("Line join style of '" + style + "' is not recognized. See or extend .CapJoinStyles property for valid styles");
			}
			lineJoinID = id;
			out(id + ' j');

			return this;
		};

		// Output is both an internal (for plugins) and external function
		API.output = output;

		/**
		 * Saves as PDF document. An alias of jsPDF.output('save', 'filename.pdf')
		 * @param  {String} filename The filename including extension.
		 *
		 * @function
		 * @returns {jsPDF}
		 * @methodOf jsPDF#
		 * @name save
		 */
		API.save = function(filename) {
			API.output('save', filename);
		};

		// applying plugins (more methods) ON TOP of built-in API.
		// this is intentional as we allow plugins to override
		// built-ins
		for (var plugin in jsPDF.API) {
			if (jsPDF.API.hasOwnProperty(plugin)) {
				if (plugin === 'events' && jsPDF.API.events.length) {
					(function(events, newEvents) {

						// jsPDF.API.events is a JS Array of Arrays
						// where each Array is a pair of event name, handler
						// Events were added by plugins to the jsPDF instantiator.
						// These are always added to the new instance and some ran
						// during instantiation.
						var eventname,handler_and_args,i;

						for (i = newEvents.length - 1; i !== -1; i--) {
							// subscribe takes 3 args: 'topic', function, runonce_flag
							// if undefined, runonce is false.
							// users can attach callback directly,
							// or they can attach an array with [callback, runonce_flag]
							// that's what the "apply" magic is for below.
							eventname = newEvents[i][0];
							handler_and_args = newEvents[i][1];
							events.subscribe.apply(
								events,
								[eventname].concat(
									typeof handler_and_args === 'function' ?
										[handler_and_args] : handler_and_args));
						}
					}(events, jsPDF.API.events));
				} else {
					API[plugin] = jsPDF.API[plugin];
				}
			}
		}

		//////////////////////////////////////////////////////
		// continuing initialization of jsPDF Document object
		//////////////////////////////////////////////////////
		// Add the first page automatically
		addFonts();
		activeFontKey = 'F1';
		_addPage(format, orientation);

		events.publish('initialized');
		return API;
	}

	/**
	 * jsPDF.API is a STATIC property of jsPDF class.
	 * jsPDF.API is an object you can add methods and properties to.
	 * The methods / properties you add will show up in new jsPDF objects.
	 *
	 * One property is prepopulated. It is the 'events' Object. Plugin authors can add topics,
	 * callbacks to this object. These will be reassigned to all new instances of jsPDF.
	 * Examples:
	 * jsPDF.API.events['initialized'] = function(){ 'this' is API object }
	 * jsPDF.API.events['addFont'] = function(added_font_object){ 'this' is API object }
	 *
	 * @static
	 * @public
	 * @memberOf jsPDF
	 * @name API
	 *
	 * @example
	 * jsPDF.API.mymethod = function(){
	 *   // 'this' will be ref to internal API object. see jsPDF source
	 *   // , so you can refer to built-in methods like so:
	 *   //     this.line(....)
	 *   //     this.text(....)
	 * }
	 * var pdfdoc = new jsPDF()
	 * pdfdoc.mymethod() // <- !!!!!!
	 */
	jsPDF.API = {events:[]};
	jsPDF.version = "1.0.272-debug 2014-09-29T15:09:diegocr";

	if (typeof define === 'function' && define.amd) {
		define('jsPDF', function() {
			return jsPDF;
		});
	} else {
		global.jsPDF = jsPDF;
	}
	return jsPDF;
}(typeof self !== "undefined" && self || typeof window !== "undefined" && window || this));
/**
 * jsPDF addHTML PlugIn
 * Copyright (c) 2014 Diego Casorran
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */

(function (jsPDFAPI) {
	'use strict';

	/**
	 * Renders an HTML element to canvas object which added as an image to the PDF
	 *
	 * This PlugIn requires html2canvas: https://github.com/niklasvh/html2canvas
	 *            OR rasterizeHTML: https://github.com/cburgmer/rasterizeHTML.js
	 *
	 * @public
	 * @function
	 * @param element {Mixed} HTML Element, or anything supported by html2canvas.
	 * @param x {Number} starting X coordinate in jsPDF instance's declared units.
	 * @param y {Number} starting Y coordinate in jsPDF instance's declared units.
	 * @param options {Object} Additional options, check the code below.
	 * @param callback {Function} to call when the rendering has finished.
	 *
	 * NOTE: Every parameter is optional except 'element' and 'callback', in such
	 *       case the image is positioned at 0x0 covering the whole PDF document
	 *       size. Ie, to easily take screenshoots of webpages saving them to PDF.
	 */
	jsPDFAPI.addHTML = function (element, x, y, options, callback) {
		'use strict';

		if(typeof html2canvas === 'undefined' && typeof rasterizeHTML === 'undefined')
			throw new Error('You need either '
				+'https://github.com/niklasvh/html2canvas'
				+' or https://github.com/cburgmer/rasterizeHTML.js');

		if(typeof x !== 'number') {
			options = x;
			callback = y;
		}

		if(typeof options === 'function') {
			callback = options;
			options = null;
		}

		var I = this.internal, K = I.scaleFactor, W = I.pageSize.width, H = I.pageSize.height;

		options = options || {};
		options.onrendered = function(obj) {
			x = parseInt(x) || 0;
			y = parseInt(y) || 0;
			var dim = options.dim || {};
			var h = dim.h || 0;
			var w = dim.w || Math.min(W,obj.width/K) - x;

			var format = 'JPEG';
			if(options.format)
				format = options.format;

			if(obj.height > H && options.pagesplit) {
				var crop = function() {
					var cy = 0;
					while(1) {
						var canvas = document.createElement('canvas');
						canvas.width = Math.min(W*K,obj.width);
						canvas.height = Math.min(H*K,obj.height-cy);
						var ctx = canvas.getContext('2d');
						ctx.drawImage(obj,0,cy,obj.width,canvas.height,0,0,canvas.width,canvas.height);
						var args = [canvas, x,cy?0:y,canvas.width/K,canvas.height/K, format,null,'SLOW'];
						this.addImage.apply(this, args);
						cy += canvas.height;
						if(cy >= obj.height) break;
						this.addPage();
					}
					callback(w,cy,null,args);
				}.bind(this);
				if(obj.nodeName === 'CANVAS') {
					var img = new Image();
					img.onload = crop;
					img.src = obj.toDataURL("image/png");
					obj = img;
				} else {
					crop();
				}
			} else {
				var alias = Math.random().toString(35);
				var args = [obj, x,y,w,h, format,alias,'SLOW'];

				this.addImage.apply(this, args);

				callback(w,h,alias,args);
			}
		}.bind(this);

		if(typeof html2canvas !== 'undefined' && !options.rstz) {
			return html2canvas(element, options);
		}

		if(typeof rasterizeHTML !== 'undefined') {
			var meth = 'drawDocument';
			if(typeof element === 'string') {
				meth = /^http/.test(element) ? 'drawURL' : 'drawHTML';
			}
			options.width = options.width || (W*K);
			return rasterizeHTML[meth](element, void 0, options).then(function(r) {
				options.onrendered(r.image);
			}, function(e) {
				callback(null,e);
			});
		}

		return null;
	};
})(jsPDF.API);
/** @preserve
 * jsPDF addImage plugin
 * Copyright (c) 2012 Jason Siefken, https://github.com/siefkenj/
 *               2013 Chris Dowling, https://github.com/gingerchris
 *               2013 Trinh Ho, https://github.com/ineedfat
 *               2013 Edwin Alejandro Perez, https://github.com/eaparango
 *               2013 Norah Smith, https://github.com/burnburnrocket
 *               2014 Diego Casorran, https://github.com/diegocr
 *               2014 James Robb, https://github.com/jamesbrobb
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

;(function(jsPDFAPI) {
	'use strict'

	var namespace = 'addImage_',
		supported_image_types = ['jpeg', 'jpg', 'png'];

	// Image functionality ported from pdf.js
	var putImage = function(img) {

		var objectNumber = this.internal.newObject()
		, out = this.internal.write
		, putStream = this.internal.putStream

		img['n'] = objectNumber

		out('<</Type /XObject')
		out('/Subtype /Image')
		out('/Width ' + img['w'])
		out('/Height ' + img['h'])
		if (img['cs'] === this.color_spaces.INDEXED) {
			out('/ColorSpace [/Indexed /DeviceRGB '
					// if an indexed png defines more than one colour with transparency, we've created a smask
					+ (img['pal'].length / 3 - 1) + ' ' + ('smask' in img ? objectNumber + 2 : objectNumber + 1)
					+ ' 0 R]');
		} else {
			out('/ColorSpace /' + img['cs']);
			if (img['cs'] === this.color_spaces.DEVICE_CMYK) {
				out('/Decode [1 0 1 0 1 0 1 0]');
			}
		}
		out('/BitsPerComponent ' + img['bpc']);
		if ('f' in img) {
			out('/Filter /' + img['f']);
		}
		if ('dp' in img) {
			out('/DecodeParms <<' + img['dp'] + '>>');
		}
		if ('trns' in img && img['trns'].constructor == Array) {
			var trns = '',
				i = 0,
				len = img['trns'].length;
			for (; i < len; i++)
				trns += (img['trns'][i] + ' ' + img['trns'][i] + ' ');
			out('/Mask [' + trns + ']');
		}
		if ('smask' in img) {
			out('/SMask ' + (objectNumber + 1) + ' 0 R');
		}
		out('/Length ' + img['data'].length + '>>');

		putStream(img['data']);

		out('endobj');

		// Soft mask
		if ('smask' in img) {
			var dp = '/Predictor 15 /Colors 1 /BitsPerComponent ' + img['bpc'] + ' /Columns ' + img['w'];
			var smask = {'w': img['w'], 'h': img['h'], 'cs': 'DeviceGray', 'bpc': img['bpc'], 'dp': dp, 'data': img['smask']};
			if ('f' in img)
				smask.f = img['f'];
			putImage.call(this, smask);
		}

	    //Palette
		if (img['cs'] === this.color_spaces.INDEXED) {

			this.internal.newObject();
			//out('<< /Filter / ' + img['f'] +' /Length ' + img['pal'].length + '>>');
			//putStream(zlib.compress(img['pal']));
			out('<< /Length ' + img['pal'].length + '>>');
			putStream(this.arrayBufferToBinaryString(new Uint8Array(img['pal'])));
			out('endobj');
		}
	}
	, putResourcesCallback = function() {
		var images = this.internal.collections[namespace + 'images']
		for ( var i in images ) {
			putImage.call(this, images[i])
		}
	}
	, putXObjectsDictCallback = function(){
		var images = this.internal.collections[namespace + 'images']
		, out = this.internal.write
		, image
		for (var i in images) {
			image = images[i]
			out(
				'/I' + image['i']
				, image['n']
				, '0'
				, 'R'
			)
		}
	}
	, checkCompressValue = function(value) {
		if(value && typeof value === 'string')
			value = value.toUpperCase();
		return value in jsPDFAPI.image_compression ? value : jsPDFAPI.image_compression.NONE;
	}
	, getImages = function() {
		var images = this.internal.collections[namespace + 'images'];
		//first run, so initialise stuff
		if(!images) {
			this.internal.collections[namespace + 'images'] = images = {};
			this.internal.events.subscribe('putResources', putResourcesCallback);
			this.internal.events.subscribe('putXobjectDict', putXObjectsDictCallback);
		}

		return images;
	}
	, getImageIndex = function(images) {
		var imageIndex = 0;

		if (images){
			// this is NOT the first time this method is ran on this instance of jsPDF object.
			imageIndex = Object.keys ?
			Object.keys(images).length :
			(function(o){
				var i = 0
				for (var e in o){if(o.hasOwnProperty(e)){ i++ }}
				return i
			})(images)
		}

		return imageIndex;
	}
	, notDefined = function(value) {
		return typeof value === 'undefined' || value === null;
	}
	, generateAliasFromData = function(data) {
		return typeof data === 'string' && jsPDFAPI.sHashCode(data);
	}
	, doesNotSupportImageType = function(type) {
		return supported_image_types.indexOf(type) === -1;
	}
	, processMethodNotEnabled = function(type) {
		return typeof jsPDFAPI['process' + type.toUpperCase()] !== 'function';
	}
	, isDOMElement = function(object) {
		return typeof object === 'object' && object.nodeType === 1;
	}
	, createDataURIFromElement = function(element, format, angle) {

		//if element is an image which uses data url defintion, just return the dataurl
		if (element.nodeName === 'IMG' && element.hasAttribute('src')) {
			var src = ''+element.getAttribute('src');
			if (!angle && src.indexOf('data:image/') === 0) return src;

			// only if the user doesn't care about a format
			if (!format && /\.png(?:[?#].*)?$/i.test(src)) format = 'png';
		}

		if(element.nodeName === 'CANVAS') {
			var canvas = element;
		} else {
			var canvas = document.createElement('canvas');
			canvas.width = element.clientWidth || element.width;
			canvas.height = element.clientHeight || element.height;

			var ctx = canvas.getContext('2d');
			if (!ctx) {
				throw ('addImage requires canvas to be supported by browser.');
			}
			if (angle) {
				var x, y, b, c, s, w, h, to_radians = Math.PI/180, angleInRadians;

				if (typeof angle === 'object') {
					x = angle.x;
					y = angle.y;
					b = angle.bg;
					angle = angle.angle;
				}
				angleInRadians = angle*to_radians;
				c = Math.abs(Math.cos(angleInRadians));
				s = Math.abs(Math.sin(angleInRadians));
				w = canvas.width;
				h = canvas.height;
				canvas.width = h * s + w * c;
				canvas.height = h * c + w * s;

				if (isNaN(x)) x = canvas.width / 2;
				if (isNaN(y)) y = canvas.height / 2;

				ctx.clearRect(0,0,canvas.width, canvas.height);
				ctx.fillStyle = b || 'white';
				ctx.fillRect(0, 0, canvas.width, canvas.height);
				ctx.save();
				ctx.translate(x, y);
				ctx.rotate(angleInRadians);
				ctx.drawImage(element, -(w/2), -(h/2));
				ctx.rotate(-angleInRadians);
				ctx.translate(-x, -y);
				ctx.restore();
			} else {
				ctx.drawImage(element, 0, 0, canvas.width, canvas.height);
			}
		}
		return canvas.toDataURL((''+format).toLowerCase() == 'png' ? 'image/png' : 'image/jpeg');
	}
	,checkImagesForAlias = function(alias, images) {
		var cached_info;
		if(images) {
			for(var e in images) {
				if(alias === images[e].alias) {
					cached_info = images[e];
					break;
				}
			}
		}
		return cached_info;
	}
	,determineWidthAndHeight = function(w, h, info) {
		if (!w && !h) {
			w = -96;
			h = -96;
		}
		if (w < 0) {
			w = (-1) * info['w'] * 72 / w / this.internal.scaleFactor;
		}
		if (h < 0) {
			h = (-1) * info['h'] * 72 / h / this.internal.scaleFactor;
		}
		if (w === 0) {
			w = h * info['w'] / info['h'];
		}
		if (h === 0) {
			h = w * info['h'] / info['w'];
		}

		return [w, h];
	}
	, writeImageToPDF = function(x, y, w, h, info, index, images) {
		var dims = determineWidthAndHeight.call(this, w, h, info),
			coord = this.internal.getCoordinateString,
			vcoord = this.internal.getVerticalCoordinateString;

		w = dims[0];
		h = dims[1];

		images[index] = info;

		this.internal.write(
			'q'
			, coord(w)
			, '0 0'
			, coord(h) // TODO: check if this should be shifted by vcoord
			, coord(x)
			, vcoord(y + h)
			, 'cm /I'+info['i']
			, 'Do Q'
		)
	};

	/**
	 * COLOR SPACES
	 */
	jsPDFAPI.color_spaces = {
		DEVICE_RGB:'DeviceRGB',
		DEVICE_GRAY:'DeviceGray',
		DEVICE_CMYK:'DeviceCMYK',
		CAL_GREY:'CalGray',
		CAL_RGB:'CalRGB',
		LAB:'Lab',
		ICC_BASED:'ICCBased',
		INDEXED:'Indexed',
		PATTERN:'Pattern',
		SEPERATION:'Seperation',
		DEVICE_N:'DeviceN'
	};

	/**
	 * DECODE METHODS
	 */
	jsPDFAPI.decode = {
		DCT_DECODE:'DCTDecode',
		FLATE_DECODE:'FlateDecode',
		LZW_DECODE:'LZWDecode',
		JPX_DECODE:'JPXDecode',
		JBIG2_DECODE:'JBIG2Decode',
		ASCII85_DECODE:'ASCII85Decode',
		ASCII_HEX_DECODE:'ASCIIHexDecode',
		RUN_LENGTH_DECODE:'RunLengthDecode',
		CCITT_FAX_DECODE:'CCITTFaxDecode'
	};

	/**
	 * IMAGE COMPRESSION TYPES
	 */
	jsPDFAPI.image_compression = {
		NONE: 'NONE',
		FAST: 'FAST',
		MEDIUM: 'MEDIUM',
		SLOW: 'SLOW'
	};

	jsPDFAPI.sHashCode = function(str) {
		return Array.prototype.reduce && str.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);
	};

	jsPDFAPI.isString = function(object) {
		return typeof object === 'string';
	};

	/**
	 * Strips out and returns info from a valid base64 data URI
	 * @param {String[dataURI]} a valid data URI of format 'data:[<MIME-type>][;base64],<data>'
	 * @returns an Array containing the following
	 * [0] the complete data URI
	 * [1] <MIME-type>
	 * [2] format - the second part of the mime-type i.e 'png' in 'image/png'
	 * [4] <data>
	 */
	jsPDFAPI.extractInfoFromBase64DataURI = function(dataURI) {
		return /^data:([\w]+?\/([\w]+?));base64,(.+?)$/g.exec(dataURI);
	};

	/**
	 * Check to see if ArrayBuffer is supported
	 */
	jsPDFAPI.supportsArrayBuffer = function() {
		return typeof ArrayBuffer !== 'undefined' && typeof Uint8Array !== 'undefined';
	};

	/**
	 * Tests supplied object to determine if ArrayBuffer
	 * @param {Object[object]}
	 */
	jsPDFAPI.isArrayBuffer = function(object) {
		if(!this.supportsArrayBuffer())
	        return false;
		return object instanceof ArrayBuffer;
	};

	/**
	 * Tests supplied object to determine if it implements the ArrayBufferView (TypedArray) interface
	 * @param {Object[object]}
	 */
	jsPDFAPI.isArrayBufferView = function(object) {
		if(!this.supportsArrayBuffer())
	        return false;
		if(typeof Uint32Array === 'undefined')
			return false;
		return (object instanceof Int8Array ||
				object instanceof Uint8Array ||
				(typeof Uint8ClampedArray !== 'undefined' && object instanceof Uint8ClampedArray) ||
				object instanceof Int16Array ||
				object instanceof Uint16Array ||
				object instanceof Int32Array ||
				object instanceof Uint32Array ||
				object instanceof Float32Array ||
				object instanceof Float64Array );
	};

	/**
	 * Exactly what it says on the tin
	 */
	jsPDFAPI.binaryStringToUint8Array = function(binary_string) {
		/*
		 * not sure how efficient this will be will bigger files. Is there a native method?
		 */
		var len = binary_string.length;
	    var bytes = new Uint8Array( len );
	    for (var i = 0; i < len; i++) {
	        bytes[i] = binary_string.charCodeAt(i);
	    }
	    return bytes;
	};

	/**
	 * @see this discussion
	 * http://stackoverflow.com/questions/6965107/converting-between-strings-and-arraybuffers
	 *
	 * As stated, i imagine the method below is highly inefficent for large files.
	 *
	 * Also of note from Mozilla,
	 *
	 * "However, this is slow and error-prone, due to the need for multiple conversions (especially if the binary data is not actually byte-format data, but, for example, 32-bit integers or floats)."
	 *
	 * https://developer.mozilla.org/en-US/Add-ons/Code_snippets/StringView
	 *
	 * Although i'm strugglig to see how StringView solves this issue? Doesn't appear to be a direct method for conversion?
	 *
	 * Async method using Blob and FileReader could be best, but i'm not sure how to fit it into the flow?
	 */
	jsPDFAPI.arrayBufferToBinaryString = function(buffer) {
		if(this.isArrayBuffer(buffer))
			buffer = new Uint8Array(buffer);

	    var binary_string = '';
	    var len = buffer.byteLength;
	    for (var i = 0; i < len; i++) {
	        binary_string += String.fromCharCode(buffer[i]);
	    }
	    return binary_string;
	    /*
	     * Another solution is the method below - convert array buffer straight to base64 and then use atob
	     */
		//return atob(this.arrayBufferToBase64(buffer));
	};

	/**
	 * Converts an ArrayBuffer directly to base64
	 *
	 * Taken from here
	 *
	 * http://jsperf.com/encoding-xhr-image-data/31
	 *
	 * Need to test if this is a better solution for larger files
	 *
	 */
	jsPDFAPI.arrayBufferToBase64 = function(arrayBuffer) {
		var base64    = ''
		var encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

		var bytes         = new Uint8Array(arrayBuffer)
		var byteLength    = bytes.byteLength
		var byteRemainder = byteLength % 3
		var mainLength    = byteLength - byteRemainder

		var a, b, c, d
		var chunk

		// Main loop deals with bytes in chunks of 3
		for (var i = 0; i < mainLength; i = i + 3) {
			// Combine the three bytes into a single integer
			chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2]

			// Use bitmasks to extract 6-bit segments from the triplet
			a = (chunk & 16515072) >> 18 // 16515072 = (2^6 - 1) << 18
			b = (chunk & 258048)   >> 12 // 258048   = (2^6 - 1) << 12
			c = (chunk & 4032)     >>  6 // 4032     = (2^6 - 1) << 6
			d = chunk & 63               // 63       = 2^6 - 1

			// Convert the raw binary segments to the appropriate ASCII encoding
			base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d]
		}

		// Deal with the remaining bytes and padding
		if (byteRemainder == 1) {
			chunk = bytes[mainLength]

			a = (chunk & 252) >> 2 // 252 = (2^6 - 1) << 2

			// Set the 4 least significant bits to zero
			b = (chunk & 3)   << 4 // 3   = 2^2 - 1

			base64 += encodings[a] + encodings[b] + '=='
		} else if (byteRemainder == 2) {
			chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1]

			a = (chunk & 64512) >> 10 // 64512 = (2^6 - 1) << 10
			b = (chunk & 1008)  >>  4 // 1008  = (2^6 - 1) << 4

			// Set the 2 least significant bits to zero
			c = (chunk & 15)    <<  2 // 15    = 2^4 - 1

			base64 += encodings[a] + encodings[b] + encodings[c] + '='
		}

		return base64
	};

	jsPDFAPI.createImageInfo = function(data, wd, ht, cs, bpc, f, imageIndex, alias, dp, trns, pal, smask) {
		var info = {
				alias:alias,
				w : wd,
				h : ht,
				cs : cs,
				bpc : bpc,
				i : imageIndex,
				data : data
				// n: objectNumber will be added by putImage code
			};

		if(f) info.f = f;
		if(dp) info.dp = dp;
		if(trns) info.trns = trns;
		if(pal) info.pal = pal;
		if(smask) info.smask = smask;

		return info;
	};

	jsPDFAPI.addImage = function(imageData, format, x, y, w, h, alias, compression, rotation) {
		'use strict'

		if(typeof format !== 'string') {
			var tmp = h;
			h = w;
			w = y;
			y = x;
			x = format;
			format = tmp;
		}

		if (typeof imageData === 'object' && !isDOMElement(imageData) && "imageData" in imageData) {
			var options = imageData;

			imageData = options.imageData;
			format = options.format || format;
			x = options.x || x || 0;
			y = options.y || y || 0;
			w = options.w || w;
			h = options.h || h;
			alias = options.alias || alias;
			compression = options.compression || compression;
			rotation = options.rotation || options.angle || rotation;
		}

		if (isNaN(x) || isNaN(y))
		{
			console.error('jsPDF.addImage: Invalid coordinates', arguments);
			throw new Error('Invalid coordinates passed to jsPDF.addImage');
		}

		var images = getImages.call(this), info;

		if (!(info = checkImagesForAlias(imageData, images))) {
			var dataAsBinaryString;

			if(isDOMElement(imageData))
				imageData = createDataURIFromElement(imageData, format, rotation);

			if(notDefined(alias))
				alias = generateAliasFromData(imageData);

			if (!(info = checkImagesForAlias(alias, images))) {

				if(this.isString(imageData)) {

					var base64Info = this.extractInfoFromBase64DataURI(imageData);

					if(base64Info) {

						format = base64Info[2];
						imageData = atob(base64Info[3]);//convert to binary string

					} else {

						if (imageData.charCodeAt(0) === 0x89 &&
							imageData.charCodeAt(1) === 0x50 &&
							imageData.charCodeAt(2) === 0x4e &&
							imageData.charCodeAt(3) === 0x47  )  format = 'png';
					}
				}
				format = (format || 'JPEG').toLowerCase();

				if(doesNotSupportImageType(format))
					throw new Error('addImage currently only supports formats ' + supported_image_types + ', not \''+format+'\'');

				if(processMethodNotEnabled(format))
					throw new Error('please ensure that the plugin for \''+format+'\' support is added');

				/**
				 * need to test if it's more efficent to convert all binary strings
				 * to TypedArray - or should we just leave and process as string?
				 */
				if(this.supportsArrayBuffer()) {
					dataAsBinaryString = imageData;
					imageData = this.binaryStringToUint8Array(imageData);
				}

				info = this['process' + format.toUpperCase()](
					imageData,
					getImageIndex(images),
					alias,
					checkCompressValue(compression),
					dataAsBinaryString
				);

				if(!info)
					throw new Error('An unkwown error occurred whilst processing the image');
			}
		}

		writeImageToPDF.call(this, x, y, w, h, info, info.i, images);

		return this
	};

	/**
	 * JPEG SUPPORT
	 **/

	//takes a string imgData containing the raw bytes of
	//a jpeg image and returns [width, height]
	//Algorithm from: http://www.64lines.com/jpeg-width-height
	var getJpegSize = function(imgData) {
		'use strict'
		var width, height, numcomponents;
		// Verify we have a valid jpeg header 0xff,0xd8,0xff,0xe0,?,?,'J','F','I','F',0x00
		if (!imgData.charCodeAt(0) === 0xff ||
			!imgData.charCodeAt(1) === 0xd8 ||
			!imgData.charCodeAt(2) === 0xff ||
			!imgData.charCodeAt(3) === 0xe0 ||
			!imgData.charCodeAt(6) === 'J'.charCodeAt(0) ||
			!imgData.charCodeAt(7) === 'F'.charCodeAt(0) ||
			!imgData.charCodeAt(8) === 'I'.charCodeAt(0) ||
			!imgData.charCodeAt(9) === 'F'.charCodeAt(0) ||
			!imgData.charCodeAt(10) === 0x00) {
				throw new Error('getJpegSize requires a binary string jpeg file')
		}
		var blockLength = imgData.charCodeAt(4)*256 + imgData.charCodeAt(5);
		var i = 4, len = imgData.length;
		while ( i < len ) {
			i += blockLength;
			if (imgData.charCodeAt(i) !== 0xff) {
				throw new Error('getJpegSize could not find the size of the image');
			}
			if (imgData.charCodeAt(i+1) === 0xc0 || //(SOF) Huffman  - Baseline DCT
			    imgData.charCodeAt(i+1) === 0xc1 || //(SOF) Huffman  - Extended sequential DCT
			    imgData.charCodeAt(i+1) === 0xc2 || // Progressive DCT (SOF2)
			    imgData.charCodeAt(i+1) === 0xc3 || // Spatial (sequential) lossless (SOF3)
			    imgData.charCodeAt(i+1) === 0xc4 || // Differential sequential DCT (SOF5)
			    imgData.charCodeAt(i+1) === 0xc5 || // Differential progressive DCT (SOF6)
			    imgData.charCodeAt(i+1) === 0xc6 || // Differential spatial (SOF7)
			    imgData.charCodeAt(i+1) === 0xc7) {
				height = imgData.charCodeAt(i+5)*256 + imgData.charCodeAt(i+6);
				width = imgData.charCodeAt(i+7)*256 + imgData.charCodeAt(i+8);
                numcomponents = imgData.charCodeAt(i+9);
				return [width, height, numcomponents];
			} else {
				i += 2;
				blockLength = imgData.charCodeAt(i)*256 + imgData.charCodeAt(i+1)
			}
		}
	}
	, getJpegSizeFromBytes = function(data) {

		var hdr = (data[0] << 8) | data[1];

		if(hdr !== 0xFFD8)
			throw new Error('Supplied data is not a JPEG');

		var len = data.length,
			block = (data[4] << 8) + data[5],
			pos = 4,
			bytes, width, height, numcomponents;

		while(pos < len) {
			pos += block;
			bytes = readBytes(data, pos);
			block = (bytes[2] << 8) + bytes[3];
			if((bytes[1] === 0xC0 || bytes[1] === 0xC2) && bytes[0] === 0xFF && block > 7) {
				bytes = readBytes(data, pos + 5);
				width = (bytes[2] << 8) + bytes[3];
				height = (bytes[0] << 8) + bytes[1];
                numcomponents = bytes[4];
				return {width:width, height:height, numcomponents: numcomponents};
			}

			pos+=2;
		}

		throw new Error('getJpegSizeFromBytes could not find the size of the image');
	}
	, readBytes = function(data, offset) {
		return data.subarray(offset, offset+ 5);
	};

	jsPDFAPI.processJPEG = function(data, index, alias, compression, dataAsBinaryString) {
		'use strict'
		var colorSpace = this.color_spaces.DEVICE_RGB,
			filter = this.decode.DCT_DECODE,
			bpc = 8,
			dims;

		if(this.isString(data)) {
			dims = getJpegSize(data);
			return this.createImageInfo(data, dims[0], dims[1], dims[3] == 1 ? this.color_spaces.DEVICE_GRAY:colorSpace, bpc, filter, index, alias);
		}

		if(this.isArrayBuffer(data))
			data = new Uint8Array(data);

		if(this.isArrayBufferView(data)) {

			dims = getJpegSizeFromBytes(data);

			// if we already have a stored binary string rep use that
			data = dataAsBinaryString || this.arrayBufferToBinaryString(data);

			return this.createImageInfo(data, dims.width, dims.height, dims.numcomponents == 1 ? this.color_spaces.DEVICE_GRAY:colorSpace, bpc, filter, index, alias);
		}

		return null;
	};

	jsPDFAPI.processJPG = function(/*data, index, alias, compression, dataAsBinaryString*/) {
		return this.processJPEG.apply(this, arguments);
	}

})(jsPDF.API);
(function (jsPDFAPI) {
	'use strict';

	jsPDFAPI.autoPrint = function () {
		'use strict'
		var refAutoPrintTag;

		this.internal.events.subscribe('postPutResources', function () {
			refAutoPrintTag = this.internal.newObject()
				this.internal.write("<< /S/Named /Type/Action /N/Print >>", "endobj");
		});

		this.internal.events.subscribe("putCatalog", function () {
			this.internal.write("/OpenAction " + refAutoPrintTag + " 0" + " R");
		});
		return this;
	};
})(jsPDF.API);
/** ====================================================================
 * jsPDF Cell plugin
 * Copyright (c) 2013 Youssef Beddad, youssef.beddad@gmail.com
 *               2013 Eduardo Menezes de Morais, eduardo.morais@usp.br
 *               2013 Lee Driscoll, https://github.com/lsdriscoll
 *               2014 Juan Pablo Gaviria, https://github.com/juanpgaviria
 *               2014 James Hall, james@parall.ax
 *               2014 Diego Casorran, https://github.com/diegocr
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * ====================================================================
 */

(function (jsPDFAPI) {
    'use strict';
    /*jslint browser:true */
    /*global document: false, jsPDF */

    var fontName,
        fontSize,
        fontStyle,
        padding = 3,
        margin = 13,
        headerFunction,
        lastCellPos = { x: undefined, y: undefined, w: undefined, h: undefined, ln: undefined },
        pages = 1,
        setLastCellPosition = function (x, y, w, h, ln) {
            lastCellPos = { 'x': x, 'y': y, 'w': w, 'h': h, 'ln': ln };
        },
        getLastCellPosition = function () {
            return lastCellPos;
        },
        NO_MARGINS = {left:0, top:0, bottom: 0};

    jsPDFAPI.setHeaderFunction = function (func) {
        headerFunction = func;
    };

    jsPDFAPI.getTextDimensions = function (txt) {
        fontName = this.internal.getFont().fontName;
        fontSize = this.table_font_size || this.internal.getFontSize();
        fontStyle = this.internal.getFont().fontStyle;
        // 1 pixel = 0.264583 mm and 1 mm = 72/25.4 point
        var px2pt = 0.264583 * 72 / 25.4,
            dimensions,
            text;

        text = document.createElement('font');
        text.id = "jsPDFCell";
        text.style.fontStyle = fontStyle;
        text.style.fontName = fontName;
        text.style.fontSize = fontSize + 'pt';
        text.textContent = txt;

        document.body.appendChild(text);

        dimensions = { w: (text.offsetWidth + 1) * px2pt, h: (text.offsetHeight + 1) * px2pt};

        document.body.removeChild(text);

        return dimensions;
    };

    jsPDFAPI.cellAddPage = function () {
        var margins = this.margins || NO_MARGINS;

        this.addPage();

        setLastCellPosition(margins.left, margins.top, undefined, undefined);
        //setLastCellPosition(undefined, undefined, undefined, undefined, undefined);
        pages += 1;
    };

    jsPDFAPI.cellInitialize = function () {
        lastCellPos = { x: undefined, y: undefined, w: undefined, h: undefined, ln: undefined };
        pages = 1;
    };

    jsPDFAPI.cell = function (x, y, w, h, txt, ln, align) {
        var curCell = getLastCellPosition();

        // If this is not the first cell, we must change its position
        if (curCell.ln !== undefined) {
            if (curCell.ln === ln) {
                //Same line
                x = curCell.x + curCell.w;
                y = curCell.y;
            } else {
                //New line
                var margins = this.margins || NO_MARGINS;
                if ((curCell.y + curCell.h + h + margin) >= this.internal.pageSize.height - margins.bottom) {
                    this.cellAddPage();
                    if (this.printHeaders && this.tableHeaderRow) {
                        this.printHeaderRow(ln, true);
                    }
                }
                //We ignore the passed y: the lines may have diferent heights
                y = (getLastCellPosition().y + getLastCellPosition().h);

            }
        }

        if (txt[0] !== undefined) {
            if (this.printingHeaderRow) {
                this.rect(x, y, w, h, 'FD');
            } else {
                this.rect(x, y, w, h);
            }
            if (align === 'right') {
                if (txt instanceof Array) {
                    for(var i = 0; i<txt.length; i++) {
                        var currentLine = txt[i];
                        var textSize = this.getStringUnitWidth(currentLine) * this.internal.getFontSize();
                        this.text(currentLine, x + w - textSize - padding, y + this.internal.getLineHeight()*(i+1));
                    }
                }
            } else {
                this.text(txt, x + padding, y + this.internal.getLineHeight());
            }
        }
        setLastCellPosition(x, y, w, h, ln);
        return this;
    };

    /**
     * Return the maximum value from an array
     * @param array
     * @param comparisonFn
     * @returns {*}
     */
    jsPDFAPI.arrayMax = function (array, comparisonFn) {
        var max = array[0],
            i,
            ln,
            item;

        for (i = 0, ln = array.length; i < ln; i += 1) {
            item = array[i];

            if (comparisonFn) {
                if (comparisonFn(max, item) === -1) {
                    max = item;
                }
            } else {
                if (item > max) {
                    max = item;
                }
            }
        }

        return max;
    };

    /**
     * Create a table from a set of data.
     * @param {Integer} [x] : left-position for top-left corner of table
     * @param {Integer} [y] top-position for top-left corner of table
     * @param {Object[]} [data] As array of objects containing key-value pairs corresponding to a row of data.
     * @param {String[]} [headers] Omit or null to auto-generate headers at a performance cost

     * @param {Object} [config.printHeaders] True to print column headers at the top of every page
     * @param {Object} [config.autoSize] True to dynamically set the column widths to match the widest cell value
     * @param {Object} [config.margins] margin values for left, top, bottom, and width
     * @param {Object} [config.fontSize] Integer fontSize to use (optional)
     */

    jsPDFAPI.table = function (x,y, data, headers, config) {
        if (!data) {
            throw 'No data for PDF table';
        }

        var headerNames = [],
            headerPrompts = [],
            header,
            i,
            ln,
            cln,
            columnMatrix = {},
            columnWidths = {},
            columnData,
            column,
            columnMinWidths = [],
            j,
            tableHeaderConfigs = [],
            model,
            jln,
            func,

        //set up defaults. If a value is provided in config, defaults will be overwritten:
           autoSize        = false,
           printHeaders    = true,
           fontSize        = 12,
           margins         = NO_MARGINS;

           margins.width = this.internal.pageSize.width;

        if (config) {
        //override config defaults if the user has specified non-default behavior:
            if(config.autoSize === true) {
                autoSize = true;
            }
            if(config.printHeaders === false) {
                printHeaders = false;
            }
            if(config.fontSize){
                fontSize = config.fontSize;
            }
            if(config.margins){
                margins = config.margins;
            }
        }

        /**
         * @property {Number} lnMod
         * Keep track of the current line number modifier used when creating cells
         */
        this.lnMod = 0;
        lastCellPos = { x: undefined, y: undefined, w: undefined, h: undefined, ln: undefined },
        pages = 1;

        this.printHeaders = printHeaders;
        this.margins = margins;
        this.setFontSize(fontSize);
        this.table_font_size = fontSize;

        // Set header values
        if (headers === undefined || (headers === null)) {
            // No headers defined so we derive from data
            headerNames = Object.keys(data[0]);

        } else if (headers[0] && (typeof headers[0] !== 'string')) {
            var px2pt = 0.264583 * 72 / 25.4;

            // Split header configs into names and prompts
            for (i = 0, ln = headers.length; i < ln; i += 1) {
                header = headers[i];
                headerNames.push(header.name);
                headerPrompts.push(header.prompt);
                columnWidths[header.name] = header.width *px2pt;
            }

        } else {
            headerNames = headers;
        }

        if (autoSize) {
            // Create a matrix of columns e.g., {column_title: [row1_Record, row2_Record]}
            func = function (rec) {
                return rec[header];
            };

            for (i = 0, ln = headerNames.length; i < ln; i += 1) {
                header = headerNames[i];

                columnMatrix[header] = data.map(
                    func
                );

                // get header width
                columnMinWidths.push(this.getTextDimensions(headerPrompts[i] || header).w);
                column = columnMatrix[header];

                // get cell widths
                for (j = 0, cln = column.length; j < cln; j += 1) {
                    columnData = column[j];
                    columnMinWidths.push(this.getTextDimensions(columnData).w);
                }

                // get final column width
                columnWidths[header] = jsPDFAPI.arrayMax(columnMinWidths);
            }
        }

        // -- Construct the table

        if (printHeaders) {
            var lineHeight = this.calculateLineHeight(headerNames, columnWidths, headerPrompts.length?headerPrompts:headerNames);

            // Construct the header row
            for (i = 0, ln = headerNames.length; i < ln; i += 1) {
                header = headerNames[i];
                tableHeaderConfigs.push([x, y, columnWidths[header], lineHeight, String(headerPrompts.length ? headerPrompts[i] : header)]);
            }

            // Store the table header config
            this.setTableHeaderRow(tableHeaderConfigs);

            // Print the header for the start of the table
            this.printHeaderRow(1, false);
        }

        // Construct the data rows
        for (i = 0, ln = data.length; i < ln; i += 1) {
            var lineHeight;
            model = data[i];
            lineHeight = this.calculateLineHeight(headerNames, columnWidths, model);

            for (j = 0, jln = headerNames.length; j < jln; j += 1) {
                header = headerNames[j];
                this.cell(x, y, columnWidths[header], lineHeight, model[header], i + 2, header.align);
            }
        }
        this.lastCellPos = lastCellPos;
        this.table_x = x;
        this.table_y = y;
        return this;
    };
    /**
     * Calculate the height for containing the highest column
     * @param {String[]} headerNames is the header, used as keys to the data
     * @param {Integer[]} columnWidths is size of each column
     * @param {Object[]} model is the line of data we want to calculate the height of
     */
    jsPDFAPI.calculateLineHeight = function (headerNames, columnWidths, model) {
        var header, lineHeight = 0;
        for (var j = 0; j < headerNames.length; j++) {
            header = headerNames[j];
            model[header] = this.splitTextToSize(String(model[header]), columnWidths[header] - padding);
            var h = this.internal.getLineHeight() * model[header].length + padding;
            if (h > lineHeight)
                lineHeight = h;
        }
        return lineHeight;
    };

    /**
     * Store the config for outputting a table header
     * @param {Object[]} config
     * An array of cell configs that would define a header row: Each config matches the config used by jsPDFAPI.cell
     * except the ln parameter is excluded
     */
    jsPDFAPI.setTableHeaderRow = function (config) {
        this.tableHeaderRow = config;
    };

    /**
     * Output the store header row
     * @param lineNumber The line number to output the header at
     */
    jsPDFAPI.printHeaderRow = function (lineNumber, new_page) {
        if (!this.tableHeaderRow) {
            throw 'Property tableHeaderRow does not exist.';
        }

        var tableHeaderCell,
            tmpArray,
            i,
            ln;

        this.printingHeaderRow = true;
        if (headerFunction !== undefined) {
            var position = headerFunction(this, pages);
            setLastCellPosition(position[0], position[1], position[2], position[3], -1);
        }
        this.setFontStyle('bold');
        var tempHeaderConf = [];
        for (i = 0, ln = this.tableHeaderRow.length; i < ln; i += 1) {
            this.setFillColor(200,200,200);

            tableHeaderCell = this.tableHeaderRow[i];
            if (new_page) {
                tableHeaderCell[1] = this.margins && this.margins.top || 0;
                tempHeaderConf.push(tableHeaderCell);
            }
            tmpArray = [].concat(tableHeaderCell);
            this.cell.apply(this, tmpArray.concat(lineNumber));
        }
        if (tempHeaderConf.length > 0){
            this.setTableHeaderRow(tempHeaderConf);
        }
        this.setFontStyle('normal');
        this.printingHeaderRow = false;
    };

})(jsPDF.API);
/** @preserve
 * jsPDF fromHTML plugin. BETA stage. API subject to change. Needs browser
 * Copyright (c) 2012 Willow Systems Corporation, willow-systems.com
 *               2014 Juan Pablo Gaviria, https://github.com/juanpgaviria
 *               2014 Diego Casorran, https://github.com/diegocr
 *               2014 Daniel Husar, https://github.com/danielhusar
 *               2014 Wolfgang Gassler, https://github.com/woolfg
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * ====================================================================
 */

(function (jsPDFAPI) {
	var clone,
	DrillForContent,
	FontNameDB,
	FontStyleMap,
	FontWeightMap,
	FloatMap,
	ClearMap,
	GetCSS,
	PurgeWhiteSpace,
	Renderer,
	ResolveFont,
	ResolveUnitedNumber,
	UnitedNumberMap,
	elementHandledElsewhere,
	images,
	loadImgs,
	checkForFooter,
	process,
	tableToJson;
	clone = (function () {
		return function (obj) {
			Clone.prototype = obj;
			return new Clone()
		};
		function Clone() {}
	})();
	PurgeWhiteSpace = function (array) {
		var fragment,
		i,
		l,
		lTrimmed,
		r,
		rTrimmed,
		trailingSpace;
		i = 0;
		l = array.length;
		fragment = void 0;
		lTrimmed = false;
		rTrimmed = false;
		while (!lTrimmed && i !== l) {
			fragment = array[i] = array[i].trimLeft();
			if (fragment) {
				lTrimmed = true;
			}
			i++;
		}
		i = l - 1;
		while (l && !rTrimmed && i !== -1) {
			fragment = array[i] = array[i].trimRight();
			if (fragment) {
				rTrimmed = true;
			}
			i--;
		}
		r = /\s+$/g;
		trailingSpace = true;
		i = 0;
		while (i !== l) {
			fragment = array[i].replace(/\s+/g, " ");
			if (trailingSpace) {
				fragment = fragment.trimLeft();
			}
			if (fragment) {
				trailingSpace = r.test(fragment);
			}
			array[i] = fragment;
			i++;
		}
		return array;
	};
	Renderer = function (pdf, x, y, settings) {
		this.pdf = pdf;
		this.x = x;
		this.y = y;
		this.settings = settings;
		//list of functions which are called after each element-rendering process
		this.watchFunctions = [];
		this.init();
		return this;
	};
	ResolveFont = function (css_font_family_string) {
		var name,
		part,
		parts;
		name = void 0;
		parts = css_font_family_string.split(",");
		part = parts.shift();
		while (!name && part) {
			name = FontNameDB[part.trim().toLowerCase()];
			part = parts.shift();
		}
		return name;
	};
	ResolveUnitedNumber = function (css_line_height_string) {

		//IE8 issues
		css_line_height_string = css_line_height_string === "auto" ? "0px" : css_line_height_string;
		if (css_line_height_string.indexOf("em") > -1 && !isNaN(Number(css_line_height_string.replace("em", "")))) {
			css_line_height_string = Number(css_line_height_string.replace("em", "")) * 18.719 + "px";
		}
		if (css_line_height_string.indexOf("pt") > -1 && !isNaN(Number(css_line_height_string.replace("pt", "")))) {
			css_line_height_string = Number(css_line_height_string.replace("pt", "")) * 1.333 + "px";
		}

		var normal,
		undef,
		value;
		undef = void 0;
		normal = 16.00;
		value = UnitedNumberMap[css_line_height_string];
		if (value) {
			return value;
		}
		value = {
			"xx-small"  :  9,
			"x-small"   : 11,
			small       : 13,
			medium      : 16,
			large       : 19,
			"x-large"   : 23,
			"xx-large"  : 28,
			auto        :  0
		}[{ css_line_height_string : css_line_height_string }];

		if (value !== undef) {
			return UnitedNumberMap[css_line_height_string] = value / normal;
		}
		if (value = parseFloat(css_line_height_string)) {
			return UnitedNumberMap[css_line_height_string] = value / normal;
		}
		value = css_line_height_string.match(/([\d\.]+)(px)/);
		if (value.length === 3) {
			return UnitedNumberMap[css_line_height_string] = parseFloat(value[1]) / normal;
		}
		return UnitedNumberMap[css_line_height_string] = 1;
	};
	GetCSS = function (element) {
		var css,tmp,computedCSSElement;
		computedCSSElement = (function (el) {
			var compCSS;
			compCSS = (function (el) {
				if (document.defaultView && document.defaultView.getComputedStyle) {
					return document.defaultView.getComputedStyle(el, null);
				} else if (el.currentStyle) {
					return el.currentStyle;
				} else {
					return el.style;
				}
			})(el);
			return function (prop) {
				prop = prop.replace(/-\D/g, function (match) {
					return match.charAt(1).toUpperCase();
				});
				return compCSS[prop];
			};
		})(element);
		css = {};
		tmp = void 0;
		css["font-family"] = ResolveFont(computedCSSElement("font-family")) || "times";
		css["font-style"] = FontStyleMap[computedCSSElement("font-style")] || "normal";
		css["text-align"] = TextAlignMap[computedCSSElement("text-align")] || "left";
		tmp = FontWeightMap[computedCSSElement("font-weight")] || "normal";
		if (tmp === "bold") {
			if (css["font-style"] === "normal") {
				css["font-style"] = tmp;
			} else {
				css["font-style"] = tmp + css["font-style"];
			}
		}
		css["font-size"] = ResolveUnitedNumber(computedCSSElement("font-size")) || 1;
		css["line-height"] = ResolveUnitedNumber(computedCSSElement("line-height")) || 1;
		css["display"] = (computedCSSElement("display") === "inline" ? "inline" : "block");

		tmp = (css["display"] === "block");
		css["margin-top"]     = tmp && ResolveUnitedNumber(computedCSSElement("margin-top"))     || 0;
		css["margin-bottom"]  = tmp && ResolveUnitedNumber(computedCSSElement("margin-bottom"))  || 0;
		css["padding-top"]    = tmp && ResolveUnitedNumber(computedCSSElement("padding-top"))    || 0;
		css["padding-bottom"] = tmp && ResolveUnitedNumber(computedCSSElement("padding-bottom")) || 0;
		css["margin-left"]    = tmp && ResolveUnitedNumber(computedCSSElement("margin-left"))    || 0;
		css["margin-right"]   = tmp && ResolveUnitedNumber(computedCSSElement("margin-right"))   || 0;
		css["padding-left"]   = tmp && ResolveUnitedNumber(computedCSSElement("padding-left"))   || 0;
		css["padding-right"]  = tmp && ResolveUnitedNumber(computedCSSElement("padding-right"))  || 0;

		//float and clearing of floats
		css["float"] = FloatMap[computedCSSElement("cssFloat")] || "none";
		css["clear"] = ClearMap[computedCSSElement("clear")] || "none";
		return css;
	};
	elementHandledElsewhere = function (element, renderer, elementHandlers) {
		var handlers,
		i,
		isHandledElsewhere,
		l,
		t;
		isHandledElsewhere = false;
		i = void 0;
		l = void 0;
		t = void 0;
		handlers = elementHandlers["#" + element.id];
		if (handlers) {
			if (typeof handlers === "function") {
				isHandledElsewhere = handlers(element, renderer);
			} else {
				i = 0;
				l = handlers.length;
				while (!isHandledElsewhere && i !== l) {
					isHandledElsewhere = handlers[i](element, renderer);
					i++;
				}
			}
		}
		handlers = elementHandlers[element.nodeName];
		if (!isHandledElsewhere && handlers) {
			if (typeof handlers === "function") {
				isHandledElsewhere = handlers(element, renderer);
			} else {
				i = 0;
				l = handlers.length;
				while (!isHandledElsewhere && i !== l) {
					isHandledElsewhere = handlers[i](element, renderer);
					i++;
				}
			}
		}
		return isHandledElsewhere;
	};
	tableToJson = function (table, renderer) {
		var data,
		headers,
		i,
		j,
		rowData,
		tableRow,
		table_obj,
		table_with,
		cell,
		l;
		data = [];
		headers = [];
		i = 0;
		l = table.rows[0].cells.length;
		table_with = table.clientWidth;
		while (i < l) {
			cell = table.rows[0].cells[i];
			headers[i] = {
				name : cell.textContent.toLowerCase().replace(/\s+/g, ''),
				prompt : cell.textContent.replace(/\r?\n/g, ''),
				width : (cell.clientWidth / table_with) * renderer.pdf.internal.pageSize.width
			};
			i++;
		}
		i = 1;
		while (i < table.rows.length) {
			tableRow = table.rows[i];
			rowData = {};
			j = 0;
			while (j < tableRow.cells.length) {
				rowData[headers[j].name] = tableRow.cells[j].textContent.replace(/\r?\n/g, '');
				j++;
			}
			data.push(rowData);
			i++;
		}
		return table_obj = {
			rows : data,
			headers : headers
		};
	};
	var SkipNode = {
		SCRIPT   : 1,
		STYLE    : 1,
		NOSCRIPT : 1,
		OBJECT   : 1,
		EMBED    : 1,
		SELECT   : 1
	};
	var listCount = 1;
	DrillForContent = function (element, renderer, elementHandlers) {
		var cn,
		cns,
		fragmentCSS,
		i,
		isBlock,
		l,
		px2pt,
		table2json,
		cb;
		cns = element.childNodes;
		cn = void 0;
		fragmentCSS = GetCSS(element);
		isBlock = fragmentCSS.display === "block";
		if (isBlock) {
			renderer.setBlockBoundary();
			renderer.setBlockStyle(fragmentCSS);
		}
		px2pt = 0.264583 * 72 / 25.4;
		i = 0;
		l = cns.length;
		while (i < l) {
			cn = cns[i];
			if (typeof cn === "object") {

				//execute all watcher functions to e.g. reset floating
				renderer.executeWatchFunctions(cn);

				/*** HEADER rendering **/
				if (cn.nodeType === 1 && cn.nodeName === 'HEADER') {
					var header = cn;
					//store old top margin
					var oldMarginTop = renderer.pdf.margins_doc.top;
					//subscribe for new page event and render header first on every page
					renderer.pdf.internal.events.subscribe('addPage', function (pageInfo) {
						//set current y position to old margin
						renderer.y = oldMarginTop;
						//render all child nodes of the header element
						DrillForContent(header, renderer, elementHandlers);
						//set margin to old margin + rendered header + 10 space to prevent overlapping
						//important for other plugins (e.g. table) to start rendering at correct position after header
						renderer.pdf.margins_doc.top = renderer.y + 10;
						renderer.y += 10;
					}, false);
				}

				if (cn.nodeType === 8 && cn.nodeName === "#comment") {
					if (~cn.textContent.indexOf("ADD_PAGE")) {
						renderer.pdf.addPage();
						renderer.y = renderer.pdf.margins_doc.top;
					}

				} else if (cn.nodeType === 1 && !SkipNode[cn.nodeName]) {
					/*** IMAGE RENDERING ***/
					var cached_image;
					if (cn.nodeName === "IMG") {
						var url = cn.getAttribute("src");
						cached_image = images[renderer.pdf.sHashCode(url) || url];
					}
					if (cached_image) {
						if ((renderer.pdf.internal.pageSize.height - renderer.pdf.margins_doc.bottom < renderer.y + cn.height) && (renderer.y > renderer.pdf.margins_doc.top)) {
							renderer.pdf.addPage();
							renderer.y = renderer.pdf.margins_doc.top;
							//check if we have to set back some values due to e.g. header rendering for new page
							renderer.executeWatchFunctions(cn);
						}

						var imagesCSS = GetCSS(cn);
						var imageX = renderer.x;
						var fontToUnitRatio = 12 / renderer.pdf.internal.scaleFactor;

						//define additional paddings, margins which have to be taken into account for margin calculations
						var additionalSpaceLeft = (imagesCSS["margin-left"] + imagesCSS["padding-left"])*fontToUnitRatio;
						var additionalSpaceRight = (imagesCSS["margin-right"] + imagesCSS["padding-right"])*fontToUnitRatio;
						var additionalSpaceTop = (imagesCSS["margin-top"] + imagesCSS["padding-top"])*fontToUnitRatio;
						var additionalSpaceBottom = (imagesCSS["margin-bottom"] + imagesCSS["padding-bottom"])*fontToUnitRatio;

						//if float is set to right, move the image to the right border
						//add space if margin is set
						if (imagesCSS['float'] !== undefined && imagesCSS['float'] === 'right') {
							imageX += renderer.settings.width - cn.width - additionalSpaceRight;
						} else {
							imageX +=  additionalSpaceLeft;
						}

						renderer.pdf.addImage(cached_image, imageX, renderer.y + additionalSpaceTop, cn.width, cn.height);
						cached_image = undefined;
						//if the float prop is specified we have to float the text around the image
						if (imagesCSS['float'] === 'right' || imagesCSS['float'] === 'left') {
							//add functiont to set back coordinates after image rendering
							renderer.watchFunctions.push((function(diffX , thresholdY, diffWidth, el) {
								//undo drawing box adaptions which were set by floating
								if (renderer.y >= thresholdY) {
									renderer.x += diffX;
									renderer.settings.width += diffWidth;
									return true;
								} else if(el && el.nodeType === 1 && !SkipNode[el.nodeName] && renderer.x+el.width > (renderer.pdf.margins_doc.left + renderer.pdf.margins_doc.width)) {
									renderer.x += diffX;
									renderer.y = thresholdY;
									renderer.settings.width += diffWidth;
									return true;
								} else {
									return false;
								}
							}).bind(this, (imagesCSS['float'] === 'left') ? -cn.width-additionalSpaceLeft-additionalSpaceRight : 0, renderer.y+cn.height+additionalSpaceTop+additionalSpaceBottom, cn.width));
							//reset floating by clear:both divs
							//just set cursorY after the floating element
							renderer.watchFunctions.push((function(yPositionAfterFloating, pages, el) {
								if (renderer.y < yPositionAfterFloating && pages === renderer.pdf.internal.getNumberOfPages()) {
									if (el.nodeType === 1 && GetCSS(el).clear === 'both') {
										renderer.y = yPositionAfterFloating;
										return true;
									} else {
										return false;
									}
								} else {
									return true;
								}
							}).bind(this, renderer.y+cn.height, renderer.pdf.internal.getNumberOfPages()));

							//if floating is set we decrease the available width by the image width
							renderer.settings.width -= cn.width+additionalSpaceLeft+additionalSpaceRight;
							//if left just add the image width to the X coordinate
							if (imagesCSS['float'] === 'left') {
								renderer.x += cn.width+additionalSpaceLeft+additionalSpaceRight;
							}
						} else {
						//if no floating is set, move the rendering cursor after the image height
							renderer.y += cn.height + additionalSpaceBottom;
						}

					/*** TABLE RENDERING ***/
					} else if (cn.nodeName === "TABLE") {
						table2json = tableToJson(cn, renderer);
						renderer.y += 10;
						renderer.pdf.table(renderer.x, renderer.y, table2json.rows, table2json.headers, {
							autoSize : false,
							printHeaders : true,
							margins : renderer.pdf.margins_doc
						});
						renderer.y = renderer.pdf.lastCellPos.y + renderer.pdf.lastCellPos.h + 20;
					} else if (cn.nodeName === "OL" || cn.nodeName === "UL") {
						listCount = 1;
						if (!elementHandledElsewhere(cn, renderer, elementHandlers)) {
							DrillForContent(cn, renderer, elementHandlers);
						}
						renderer.y += 10;
					} else if (cn.nodeName === "LI") {
						var temp = renderer.x;
						renderer.x += cn.parentNode.nodeName === "UL" ? 22 : 10;
						renderer.y += 3;
						if (!elementHandledElsewhere(cn, renderer, elementHandlers)) {
							DrillForContent(cn, renderer, elementHandlers);
						}
						renderer.x = temp;
					} else if (cn.nodeName === "BR") {
						renderer.y += fragmentCSS["font-size"] * renderer.pdf.internal.scaleFactor;
					} else {
						if (!elementHandledElsewhere(cn, renderer, elementHandlers)) {
							DrillForContent(cn, renderer, elementHandlers);
						}
					}
				} else if (cn.nodeType === 3) {
					var value = cn.nodeValue;
					if (cn.nodeValue && cn.parentNode.nodeName === "LI") {
						if (cn.parentNode.parentNode.nodeName === "OL") {
							value = listCount++ + '. ' + value;
						} else {
							var fontPx = fragmentCSS["font-size"] * 16;
							var radius = 2;
							if (fontPx > 20) {
								radius = 3;
							}
							cb = function (x, y) {
								this.pdf.circle(x, y, radius, 'FD');
							};
						}
					}
					renderer.addText(value, fragmentCSS);
				} else if (typeof cn === "string") {
					renderer.addText(cn, fragmentCSS);
				}
			}
			i++;
		}

		if (isBlock) {
			return renderer.setBlockBoundary(cb);
		}
	};
	images = {};
	loadImgs = function (element, renderer, elementHandlers, cb) {
		var imgs = element.getElementsByTagName('img'),
		l = imgs.length, found_images,
		x = 0;
		function done() {
			renderer.pdf.internal.events.publish('imagesLoaded');
			cb(found_images);
		}
		function loadImage(url, width, height) {
			if (!url)
				return;
			var img = new Image();
			found_images = ++x;
			img.crossOrigin = '';
			img.onerror = img.onload = function () {
				if(img.complete) {
					//to support data urls in images, set width and height
					//as those values are not recognized automatically
					if (img.src.indexOf('data:image/') === 0) {
						img.width = width || img.width || 0;
						img.height = height || img.height || 0;
					}
					//if valid image add to known images array
					if (img.width + img.height) {
						var hash = renderer.pdf.sHashCode(url) || url;
						images[hash] = images[hash] || img;
					}
				}
				if(!--x) {
					done();
				}
			};
			img.src = url;
		}
		while (l--)
			loadImage(imgs[l].getAttribute("src"),imgs[l].width,imgs[l].height);
		return x || done();
	};
	checkForFooter = function (elem, renderer, elementHandlers) {
		//check if we can found a <footer> element
		var footer = elem.getElementsByTagName("footer");
		if (footer.length > 0) {

			footer = footer[0];

			//bad hack to get height of footer
			//creat dummy out and check new y after fake rendering
			var oldOut = renderer.pdf.internal.write;
			var oldY = renderer.y;
			renderer.pdf.internal.write = function () {};
			DrillForContent(footer, renderer, elementHandlers);
			var footerHeight = Math.ceil(renderer.y - oldY) + 5;
			renderer.y = oldY;
			renderer.pdf.internal.write = oldOut;

			//add 20% to prevent overlapping
			renderer.pdf.margins_doc.bottom += footerHeight;

			//Create function render header on every page
			var renderFooter = function (pageInfo) {
				var pageNumber = pageInfo !== undefined ? pageInfo.pageNumber : 1;
				//set current y position to old margin
				var oldPosition = renderer.y;
				//render all child nodes of the header element
				renderer.y = renderer.pdf.internal.pageSize.height - renderer.pdf.margins_doc.bottom;
				renderer.pdf.margins_doc.bottom -= footerHeight;

				//check if we have to add page numbers
				var spans = footer.getElementsByTagName('span');
				for (var i = 0; i < spans.length; ++i) {
					//if we find some span element with class pageCounter, set the page
					if ((" " + spans[i].className + " ").replace(/[\n\t]/g, " ").indexOf(" pageCounter ") > -1) {
						spans[i].innerHTML = pageNumber;
					}
					//if we find some span element with class totalPages, set a variable which is replaced after rendering of all pages
					if ((" " + spans[i].className + " ").replace(/[\n\t]/g, " ").indexOf(" totalPages ") > -1) {
						spans[i].innerHTML = '###jsPDFVarTotalPages###';
					}
				}

				//render footer content
				DrillForContent(footer, renderer, elementHandlers);
				//set bottom margin to previous height including the footer height
				renderer.pdf.margins_doc.bottom += footerHeight;
				//important for other plugins (e.g. table) to start rendering at correct position after header
				renderer.y = oldPosition;
			};

			//check if footer contains totalPages which shoudl be replace at the disoposal of the document
			var spans = footer.getElementsByTagName('span');
			for (var i = 0; i < spans.length; ++i) {
				if ((" " + spans[i].className + " ").replace(/[\n\t]/g, " ").indexOf(" totalPages ") > -1) {
					renderer.pdf.internal.events.subscribe('htmlRenderingFinished', renderer.pdf.putTotalPages.bind(renderer.pdf, '###jsPDFVarTotalPages###'), true);
				}
			}

			//register event to render footer on every new page
			renderer.pdf.internal.events.subscribe('addPage', renderFooter, false);
			//render footer on first page
			renderFooter();

			//prevent footer rendering
			SkipNode['FOOTER'] = 1;
		}
	};
	process = function (pdf, element, x, y, settings, callback) {
		if (!element)
			return false;
		if (typeof element !== "string" && !element.parentNode)
			element = '' + element.innerHTML;
		if (typeof element === "string") {
			element = (function (element) {
				var $frame,
				$hiddendiv,
				framename,
				visuallyhidden;
				framename = "jsPDFhtmlText" + Date.now().toString() + (Math.random() * 1000).toFixed(0);
				visuallyhidden = "position: absolute !important;" + "clip: rect(1px 1px 1px 1px); /* IE6, IE7 */" + "clip: rect(1px, 1px, 1px, 1px);" + "padding:0 !important;" + "border:0 !important;" + "height: 1px !important;" + "width: 1px !important; " + "top:auto;" + "left:-100px;" + "overflow: hidden;";
				$hiddendiv = document.createElement('div');
				$hiddendiv.style.cssText = visuallyhidden;
				$hiddendiv.innerHTML = "<iframe style=\"height:1px;width:1px\" name=\"" + framename + "\" />";
				document.body.appendChild($hiddendiv);
				$frame = window.frames[framename];
				$frame.document.body.innerHTML = element;
				return $frame.document.body;
			})(element.replace(/<\/?script[^>]*?>/gi, ''));
		}
		var r = new Renderer(pdf, x, y, settings), out;

		// 1. load images
		// 2. prepare optional footer elements
		// 3. render content
		loadImgs.call(this, element, r, settings.elementHandlers, function (found_images) {
			checkForFooter( element, r, settings.elementHandlers);
			DrillForContent(element, r, settings.elementHandlers);
			//send event dispose for final taks (e.g. footer totalpage replacement)
			r.pdf.internal.events.publish('htmlRenderingFinished');
			out = r.dispose();
			if (typeof callback === 'function') callback(out);
			else if (found_images) console.error('jsPDF Warning: rendering issues? provide a callback to fromHTML!');
		});
		return out || {x: r.x, y:r.y};
	};
	Renderer.prototype.init = function () {
		this.paragraph = {
			text : [],
			style : []
		};
		return this.pdf.internal.write("q");
	};
	Renderer.prototype.dispose = function () {
		this.pdf.internal.write("Q");
		return {
			x : this.x,
			y : this.y,
			ready:true
		};
	};

	//Checks if we have to execute some watcher functions
	//e.g. to end text floating around an image
	Renderer.prototype.executeWatchFunctions = function(el) {
		var ret = false;
		var narray = [];
		if (this.watchFunctions.length > 0) {
			for(var i=0; i< this.watchFunctions.length; ++i) {
				if (this.watchFunctions[i](el) === true) {
					ret = true;
				} else {
					narray.push(this.watchFunctions[i]);
				}
			}
			this.watchFunctions = narray;
		}
		return ret;
	};

	Renderer.prototype.splitFragmentsIntoLines = function (fragments, styles) {
		var currentLineLength,
		defaultFontSize,
		ff,
		fontMetrics,
		fontMetricsCache,
		fragment,
		fragmentChopped,
		fragmentLength,
		fragmentSpecificMetrics,
		fs,
		k,
		line,
		lines,
		maxLineLength,
		style;
		defaultFontSize = 12;
		k = this.pdf.internal.scaleFactor;
		fontMetricsCache = {};
		ff = void 0;
		fs = void 0;
		fontMetrics = void 0;
		fragment = void 0;
		style = void 0;
		fragmentSpecificMetrics = void 0;
		fragmentLength = void 0;
		fragmentChopped = void 0;
		line = [];
		lines = [line];
		currentLineLength = 0;
		maxLineLength = this.settings.width;
		while (fragments.length) {
			fragment = fragments.shift();
			style = styles.shift();
			if (fragment) {
				ff = style["font-family"];
				fs = style["font-style"];
				fontMetrics = fontMetricsCache[ff + fs];
				if (!fontMetrics) {
					fontMetrics = this.pdf.internal.getFont(ff, fs).metadata.Unicode;
					fontMetricsCache[ff + fs] = fontMetrics;
				}
				fragmentSpecificMetrics = {
					widths : fontMetrics.widths,
					kerning : fontMetrics.kerning,
					fontSize : style["font-size"] * defaultFontSize,
					textIndent : currentLineLength
				};
				fragmentLength = this.pdf.getStringUnitWidth(fragment, fragmentSpecificMetrics) * fragmentSpecificMetrics.fontSize / k;
				if (currentLineLength + fragmentLength > maxLineLength) {
					fragmentChopped = this.pdf.splitTextToSize(fragment, maxLineLength, fragmentSpecificMetrics);
					line.push([fragmentChopped.shift(), style]);
					while (fragmentChopped.length) {
						line = [[fragmentChopped.shift(), style]];
						lines.push(line);
					}
					currentLineLength = this.pdf.getStringUnitWidth(line[0][0], fragmentSpecificMetrics) * fragmentSpecificMetrics.fontSize / k;
				} else {
					line.push([fragment, style]);
					currentLineLength += fragmentLength;
				}
			}
		}

		//if text alignment was set, set margin/indent of each line
		if (style['text-align'] !== undefined && (style['text-align'] === 'center' || style['text-align'] === 'right' || style['text-align'] === 'justify')) {
			for (var i = 0; i < lines.length; ++i) {
				var length = this.pdf.getStringUnitWidth(lines[i][0][0], fragmentSpecificMetrics) * fragmentSpecificMetrics.fontSize / k;
				//if there is more than on line we have to clone the style object as all lines hold a reference on this object
				if (i > 0) {
					lines[i][0][1] = clone(lines[i][0][1]);
				}
				var space = (maxLineLength - length);

				if (style['text-align'] === 'right') {
					lines[i][0][1]['margin-left'] = space;
					//if alignment is not right, it has to be center so split the space to the left and the right
				} else if (style['text-align'] === 'center') {
					lines[i][0][1]['margin-left'] = space / 2;
					//if justify was set, calculate the word spacing and define in by using the css property
				} else if (style['text-align'] === 'justify') {
					var countSpaces = lines[i][0][0].split(' ').length - 1;
					lines[i][0][1]['word-spacing'] = space / countSpaces;
					//ignore the last line in justify mode
					if (i === (lines.length - 1)) {
						lines[i][0][1]['word-spacing'] = 0;
					}
				}
			}
		}

		return lines;
	};
	Renderer.prototype.RenderTextFragment = function (text, style) {
		var defaultFontSize,
		font,
		maxLineHeight;

		maxLineHeight = 0;
		defaultFontSize = 12;

		if (this.pdf.internal.pageSize.height - this.pdf.margins_doc.bottom < this.y + this.pdf.internal.getFontSize()) {
			this.pdf.internal.write("ET", "Q");
			this.pdf.addPage();
			this.y = this.pdf.margins_doc.top;
			this.pdf.internal.write("q", "BT 0 g", this.pdf.internal.getCoordinateString(this.x), this.pdf.internal.getVerticalCoordinateString(this.y), "Td");
			//move cursor by one line on new page
			maxLineHeight = Math.max(maxLineHeight, style["line-height"], style["font-size"]);
			this.pdf.internal.write(0, (-1 * defaultFontSize * maxLineHeight).toFixed(2), "Td");
		}

		font = this.pdf.internal.getFont(style["font-family"], style["font-style"]);

		//set the word spacing for e.g. justify style
		if (style['word-spacing'] !== undefined && style['word-spacing'] > 0) {
			this.pdf.internal.write(style['word-spacing'].toFixed(2), "Tw");
		}

		this.pdf.internal.write("/" + font.id, (defaultFontSize * style["font-size"]).toFixed(2), "Tf", "(" + this.pdf.internal.pdfEscape(text) + ") Tj");

		//set the word spacing back to neutral => 0
		if (style['word-spacing'] !== undefined) {
			this.pdf.internal.write(0, "Tw");
		}
	};
	Renderer.prototype.renderParagraph = function (cb) {
		var blockstyle,
		defaultFontSize,
		fontToUnitRatio,
		fragments,
		i,
		l,
		line,
		lines,
		maxLineHeight,
		out,
		paragraphspacing_after,
		paragraphspacing_before,
		priorblockstype,
		styles,
		fontSize;
		fragments = PurgeWhiteSpace(this.paragraph.text);
		styles = this.paragraph.style;
		blockstyle = this.paragraph.blockstyle;
		priorblockstype = this.paragraph.blockstyle || {};
		this.paragraph = {
			text : [],
			style : [],
			blockstyle : {},
			priorblockstyle : blockstyle
		};
		if (!fragments.join("").trim()) {
			return;
		}
		lines = this.splitFragmentsIntoLines(fragments, styles);
		line = void 0;
		maxLineHeight = void 0;
		defaultFontSize = 12;
		fontToUnitRatio = defaultFontSize / this.pdf.internal.scaleFactor;
		paragraphspacing_before = (Math.max((blockstyle["margin-top"] || 0) - (priorblockstype["margin-bottom"] || 0), 0) + (blockstyle["padding-top"] || 0)) * fontToUnitRatio;
		paragraphspacing_after = ((blockstyle["margin-bottom"] || 0) + (blockstyle["padding-bottom"] || 0)) * fontToUnitRatio;
		out = this.pdf.internal.write;
		i = void 0;
		l = void 0;
		this.y += paragraphspacing_before;
		out("q", "BT 0 g", this.pdf.internal.getCoordinateString(this.x), this.pdf.internal.getVerticalCoordinateString(this.y), "Td");

		//stores the current indent of cursor position
		var currentIndent = 0;

		while (lines.length) {
			line = lines.shift();
			maxLineHeight = 0;
			i = 0;
			l = line.length;
			while (i !== l) {
				if (line[i][0].trim()) {
					maxLineHeight = Math.max(maxLineHeight, line[i][1]["line-height"], line[i][1]["font-size"]);
					fontSize = line[i][1]["font-size"] * 7;
				}
				i++;
			}
			//if we have to move the cursor to adapt the indent
			var indentMove = 0;
			//if a margin was added (by e.g. a text-alignment), move the cursor
			if (line[0][1]["margin-left"] !== undefined && line[0][1]["margin-left"] > 0) {
				wantedIndent = this.pdf.internal.getCoordinateString(line[0][1]["margin-left"]);
				indentMove = wantedIndent - currentIndent;
				currentIndent = wantedIndent;
			}
			//move the cursor
			out(indentMove, (-1 * defaultFontSize * maxLineHeight).toFixed(2), "Td");
			i = 0;
			l = line.length;
			while (i !== l) {
				if (line[i][0]) {
					this.RenderTextFragment(line[i][0], line[i][1]);
				}
				i++;
			}
			this.y += maxLineHeight * fontToUnitRatio;

			//if some watcher function was executed sucessful, so e.g. margin and widths were changed,
			//reset line drawing and calculate position and lines again
			//e.g. to stop text floating around an image
			if (this.executeWatchFunctions(line[0][1]) && lines.length > 0) {
				var localFragments = [];
				var localStyles = [];
				//create fragement array of
				lines.forEach(function(localLine) {
					var i = 0;
					var l = localLine.length;
					while (i !== l) {
						if (localLine[i][0]) {
							localFragments.push(localLine[i][0]+' ');
							localStyles.push(localLine[i][1]);
						}
						++i;
					}
				});
				//split lines again due to possible coordinate changes
				lines = this.splitFragmentsIntoLines(PurgeWhiteSpace(localFragments), localStyles);
				//reposition the current cursor
				out("ET", "Q");
				out("q", "BT 0 g", this.pdf.internal.getCoordinateString(this.x), this.pdf.internal.getVerticalCoordinateString(this.y), "Td");
			}

		}
		if (cb && typeof cb === "function") {
			cb.call(this, this.x - 9, this.y - fontSize / 2);
		}
		out("ET", "Q");
		return this.y += paragraphspacing_after;
	};
	Renderer.prototype.setBlockBoundary = function (cb) {
		return this.renderParagraph(cb);
	};
	Renderer.prototype.setBlockStyle = function (css) {
		return this.paragraph.blockstyle = css;
	};
	Renderer.prototype.addText = function (text, css) {
		this.paragraph.text.push(text);
		return this.paragraph.style.push(css);
	};
	FontNameDB = {
		helvetica         : "helvetica",
		"sans-serif"      : "helvetica",
		"times new roman" : "times",
		serif             : "times",
		times             : "times",
		monospace         : "courier",
		courier           : "courier"
	};
	FontWeightMap = {
		100 : "normal",
		200 : "normal",
		300 : "normal",
		400 : "normal",
		500 : "bold",
		600 : "bold",
		700 : "bold",
		800 : "bold",
		900 : "bold",
		normal  : "normal",
		bold    : "bold",
		bolder  : "bold",
		lighter : "normal"
	};
	FontStyleMap = {
		normal  : "normal",
		italic  : "italic",
		oblique : "italic"
	};
	TextAlignMap = {
		left    : "left",
		right   : "right",
		center  : "center",
		justify : "justify"
	};
	FloatMap = {
		none : 'none',
		right: 'right',
		left: 'left'
	};
	ClearMap = {
	  none : 'none',
	  both : 'both'
	};
	UnitedNumberMap = {
		normal : 1
	};
	/**
	 * Converts HTML-formatted text into formatted PDF text.
	 *
	 * Notes:
	 * 2012-07-18
	 * Plugin relies on having browser, DOM around. The HTML is pushed into dom and traversed.
	 * Plugin relies on jQuery for CSS extraction.
	 * Targeting HTML output from Markdown templating, which is a very simple
	 * markup - div, span, em, strong, p. No br-based paragraph separation supported explicitly (but still may work.)
	 * Images, tables are NOT supported.
	 *
	 * @public
	 * @function
	 * @param HTML {String or DOM Element} HTML-formatted text, or pointer to DOM element that is to be rendered into PDF.
	 * @param x {Number} starting X coordinate in jsPDF instance's declared units.
	 * @param y {Number} starting Y coordinate in jsPDF instance's declared units.
	 * @param settings {Object} Additional / optional variables controlling parsing, rendering.
	 * @returns {Object} jsPDF instance
	 */
	jsPDFAPI.fromHTML = function (HTML, x, y, settings, callback, margins) {
		"use strict";

		this.margins_doc = margins || {
			top : 0,
			bottom : 0
		};
		if (!settings)
			settings = {};
		if (!settings.elementHandlers)
			settings.elementHandlers = {};

		return process(this, HTML, isNaN(x) ? 4 : x, isNaN(y) ? 4 : y, settings, callback);
	};
})(jsPDF.API);
/** ==================================================================== 
 * jsPDF JavaScript plugin
 * Copyright (c) 2013 Youssef Beddad, youssef.beddad@gmail.com
 * 
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 * 
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * ====================================================================
 */

/*global jsPDF */

(function (jsPDFAPI) {
    'use strict';
    var jsNamesObj, jsJsObj, text;
    jsPDFAPI.addJS = function (txt) {
        text = txt;
        this.internal.events.subscribe(
            'postPutResources',
            function (txt) {
                jsNamesObj = this.internal.newObject();
                this.internal.write('<< /Names [(EmbeddedJS) ' + (jsNamesObj + 1) + ' 0 R] >>', 'endobj');
                jsJsObj = this.internal.newObject();
                this.internal.write('<< /S /JavaScript /JS (', text, ') >>', 'endobj');
            }
        );
        this.internal.events.subscribe(
            'putCatalog',
            function () {
                if (jsNamesObj !== undefined && jsJsObj !== undefined) {
                    this.internal.write('/Names <</JavaScript ' + jsNamesObj + ' 0 R>>');
                }
            }
        );
        return this;
    };
}(jsPDF.API));
/**@preserve
 *  ==================================================================== 
 * jsPDF PNG PlugIn
 * Copyright (c) 2014 James Robb, https://github.com/jamesbrobb
 * 
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 * 
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * ====================================================================
 */

(function(jsPDFAPI) {
'use strict'
	
	/*
	 * @see http://www.w3.org/TR/PNG-Chunks.html
	 * 
	 Color    Allowed      Interpretation
	 Type     Bit Depths
	   
	   0       1,2,4,8,16  Each pixel is a grayscale sample.
	   
	   2       8,16        Each pixel is an R,G,B triple.
	   
	   3       1,2,4,8     Each pixel is a palette index;
	                       a PLTE chunk must appear.
	   
	   4       8,16        Each pixel is a grayscale sample,
	                       followed by an alpha sample.
	   
	   6       8,16        Each pixel is an R,G,B triple,
	                       followed by an alpha sample.
	*/
	
	/*
	 * PNG filter method types
	 * 
	 * @see http://www.w3.org/TR/PNG-Filters.html
	 * @see http://www.libpng.org/pub/png/book/chapter09.html
	 * 
	 * This is what the value 'Predictor' in decode params relates to
	 * 
	 * 15 is "optimal prediction", which means the prediction algorithm can change from line to line.
	 * In that case, you actually have to read the first byte off each line for the prediction algorthim (which should be 0-4, corresponding to PDF 10-14) and select the appropriate unprediction algorithm based on that byte.
	 *
	   0       None
	   1       Sub
	   2       Up
	   3       Average
	   4       Paeth
	 */
	
	var doesNotHavePngJS = function() {
		return typeof PNG !== 'function' || typeof FlateStream !== 'function';
	}
	, canCompress = function(value) {
		return value !== jsPDFAPI.image_compression.NONE && hasCompressionJS();
	}
	, hasCompressionJS = function() {
		var inst = typeof Deflater === 'function';
		if(!inst)
			throw new Error("requires deflate.js for compression")
		return inst;
	}
	, compressBytes = function(bytes, lineLength, colorsPerPixel, compression) {
		
		var level = 5,
			filter_method = filterUp;
		
		switch(compression) {
		
			case jsPDFAPI.image_compression.FAST:
				
				level = 3;
				filter_method = filterSub;
				break;
				
			case jsPDFAPI.image_compression.MEDIUM:
				
				level = 6;
				filter_method = filterAverage;
				break;
				
			case jsPDFAPI.image_compression.SLOW:
				
				level = 9;
				filter_method = filterPaeth;//uses to sum to choose best filter for each line
				break;
		}
		
		bytes = applyPngFilterMethod(bytes, lineLength, colorsPerPixel, filter_method);
		
		var header = new Uint8Array(createZlibHeader(level));
		var checksum = adler32(bytes);
		
		var deflate = new Deflater(level);
		var a = deflate.append(bytes);
		var cBytes = deflate.flush();
		
		var len = header.length + a.length + cBytes.length;
		
		var cmpd = new Uint8Array(len + 4);
		cmpd.set(header);
		cmpd.set(a, header.length);
		cmpd.set(cBytes, header.length + a.length);
		
		cmpd[len++] = (checksum >>> 24) & 0xff;
		cmpd[len++] = (checksum >>> 16) & 0xff;
		cmpd[len++] = (checksum >>> 8) & 0xff;
		cmpd[len++] = checksum & 0xff;
		
		return jsPDFAPI.arrayBufferToBinaryString(cmpd);
	}
	, createZlibHeader = function(bytes, level){
		/*
		 * @see http://www.ietf.org/rfc/rfc1950.txt for zlib header 
		 */
		var cm = 8;
        var cinfo = Math.LOG2E * Math.log(0x8000) - 8;
        var cmf = (cinfo << 4) | cm;
        
        var hdr = cmf << 8;
        var flevel = Math.min(3, ((level - 1) & 0xff) >> 1);
        
        hdr |= (flevel << 6);
        hdr |= 0;//FDICT
        hdr += 31 - (hdr % 31);
        
        return [cmf, (hdr & 0xff) & 0xff];
	}
	, adler32 = function(array, param) {
		var adler = 1;
	    var s1 = adler & 0xffff,
	        s2 = (adler >>> 16) & 0xffff;
	    var len = array.length;
	    var tlen;
	    var i = 0;

	    while (len > 0) {
	      tlen = len > param ? param : len;
	      len -= tlen;
	      do {
	        s1 += array[i++];
	        s2 += s1;
	      } while (--tlen);

	      s1 %= 65521;
	      s2 %= 65521;
	    }

	    return ((s2 << 16) | s1) >>> 0;
	}
	, applyPngFilterMethod = function(bytes, lineLength, colorsPerPixel, filter_method) {
		var lines = bytes.length / lineLength,
			result = new Uint8Array(bytes.length + lines),
			filter_methods = getFilterMethods(),
			i = 0, line, prevLine, offset;
		
		for(; i < lines; i++) {
			offset = i * lineLength;
			line = bytes.subarray(offset, offset + lineLength);
			
			if(filter_method) {
				result.set(filter_method(line, colorsPerPixel, prevLine), offset + i);
				
			}else{
			
				var j = 0,
					len = filter_methods.length,
					results = [];
				
				for(; j < len; j++)
					results[j] = filter_methods[j](line, colorsPerPixel, prevLine);
				
				var ind = getIndexOfSmallestSum(results.concat());
				
				result.set(results[ind], offset + i);
			}
			
			prevLine = line;
		}
		
		return result;
	}
	, filterNone = function(line, colorsPerPixel, prevLine) {
		/*var result = new Uint8Array(line.length + 1);
		result[0] = 0;
		result.set(line, 1);*/
		
		var result = Array.apply([], line);
		result.unshift(0);

		return result;
	}
	, filterSub = function(line, colorsPerPixel, prevLine) {
		var result = [],
			i = 0,
			len = line.length,
			left;
		
		result[0] = 1;
		
		for(; i < len; i++) {
			left = line[i - colorsPerPixel] || 0;
			result[i + 1] = (line[i] - left + 0x0100) & 0xff;
		}
		
		return result;
	}
	, filterUp = function(line, colorsPerPixel, prevLine) {
		var result = [],
			i = 0,
			len = line.length,
			up;
		
		result[0] = 2;
		
		for(; i < len; i++) {
			up = prevLine && prevLine[i] || 0;
			result[i + 1] = (line[i] - up + 0x0100) & 0xff;
		}
		
		return result;
	}
	, filterAverage = function(line, colorsPerPixel, prevLine) {
		var result = [],
			i = 0,
			len = line.length,
			left,
			up;
	
		result[0] = 3;
		
		for(; i < len; i++) {
			left = line[i - colorsPerPixel] || 0;
			up = prevLine && prevLine[i] || 0;
			result[i + 1] = (line[i] + 0x0100 - ((left + up) >>> 1)) & 0xff;
		}
		
		return result;
	}
	, filterPaeth = function(line, colorsPerPixel, prevLine) {
		var result = [],
			i = 0,
			len = line.length,
			left,
			up,
			upLeft,
			paeth;
		
		result[0] = 4;
		
		for(; i < len; i++) {
			left = line[i - colorsPerPixel] || 0;
			up = prevLine && prevLine[i] || 0;
			upLeft = prevLine && prevLine[i - colorsPerPixel] || 0;
			paeth = paethPredictor(left, up, upLeft);
			result[i + 1] = (line[i] - paeth + 0x0100) & 0xff;
		}
		
		return result;
	}
	,paethPredictor = function(left, up, upLeft) {

		var p = left + up - upLeft,
	        pLeft = Math.abs(p - left),
	        pUp = Math.abs(p - up),
	        pUpLeft = Math.abs(p - upLeft);
		
		return (pLeft <= pUp && pLeft <= pUpLeft) ? left : (pUp <= pUpLeft) ? up : upLeft;
	}
	, getFilterMethods = function() {
		return [filterNone, filterSub, filterUp, filterAverage, filterPaeth];
	}
	,getIndexOfSmallestSum = function(arrays) {
		var i = 0,
			len = arrays.length,
			sum, min, ind;
		
		while(i < len) {
			sum = absSum(arrays[i].slice(1));
			
			if(sum < min || !min) {
				min = sum;
				ind = i;
			}
			
			i++;
		}
		
		return ind;
	}
	, absSum = function(array) {
		var i = 0,
			len = array.length,
			sum = 0;
	
		while(i < len)
			sum += Math.abs(array[i++]);
			
		return sum;
	}
	, logImg = function(img) {
		console.log("width: " + img.width);
		console.log("height: " + img.height);
		console.log("bits: " + img.bits);
		console.log("colorType: " + img.colorType);
		console.log("transparency:");
		console.log(img.transparency);
		console.log("text:");
		console.log(img.text);
		console.log("compressionMethod: " + img.compressionMethod);
		console.log("filterMethod: " + img.filterMethod);
		console.log("interlaceMethod: " + img.interlaceMethod);
		console.log("imgData:");
		console.log(img.imgData);
		console.log("palette:");
		console.log(img.palette);
		console.log("colors: " + img.colors);
		console.log("colorSpace: " + img.colorSpace);
		console.log("pixelBitlength: " + img.pixelBitlength);
		console.log("hasAlphaChannel: " + img.hasAlphaChannel);
	};
	
	
	
	
	jsPDFAPI.processPNG = function(imageData, imageIndex, alias, compression, dataAsBinaryString) {
		'use strict'
		
		var colorSpace = this.color_spaces.DEVICE_RGB,
			decode = this.decode.FLATE_DECODE,
			bpc = 8,
			img, dp, trns,
			colors, pal, smask;
		
	/*	if(this.isString(imageData)) {
			
		}*/
		
		if(this.isArrayBuffer(imageData))
			imageData = new Uint8Array(imageData);
		
		if(this.isArrayBufferView(imageData)) {
			
			if(doesNotHavePngJS())
				throw new Error("PNG support requires png.js and zlib.js");
				
			img = new PNG(imageData);
			imageData = img.imgData;
			bpc = img.bits;
			colorSpace = img.colorSpace;
			colors = img.colors;
			
			//logImg(img);
			
			/*
			 * colorType 6 - Each pixel is an R,G,B triple, followed by an alpha sample.
			 * 
			 * colorType 4 - Each pixel is a grayscale sample, followed by an alpha sample.
			 * 
			 * Extract alpha to create two separate images, using the alpha as a sMask
			 */
			if([4,6].indexOf(img.colorType) !== -1) {
				
				/*
				 * processes 8 bit RGBA and grayscale + alpha images
				 */
				if(img.bits === 8) {
				
					var pixelsArrayType = window['Uint' + img.pixelBitlength + 'Array'],
						pixels = new pixelsArrayType(img.decodePixels().buffer),
						len = pixels.length,
						imgData = new Uint8Array(len * img.colors),
						alphaData = new Uint8Array(len),
						pDiff = img.pixelBitlength - img.bits,
						i = 0, n = 0, pixel, pbl;
				
					for(; i < len; i++) {
						pixel = pixels[i];
						pbl = 0;
						
						while(pbl < pDiff) {
							
							imgData[n++] = ( pixel >>> pbl ) & 0xff;
							pbl = pbl + img.bits;
						}
						
						alphaData[i] = ( pixel >>> pbl ) & 0xff;
					}
				}
				
				/*
				 * processes 16 bit RGBA and grayscale + alpha images
				 */
				if(img.bits === 16) {
					
					var pixels = new Uint32Array(img.decodePixels().buffer),
						len = pixels.length,
						imgData = new Uint8Array((len * (32 / img.pixelBitlength) ) * img.colors),
						alphaData = new Uint8Array(len * (32 / img.pixelBitlength) ),
						hasColors = img.colors > 1,
						i = 0, n = 0, a = 0, pixel;
					
					while(i < len) {
						pixel = pixels[i++];
						
						imgData[n++] = (pixel >>> 0) & 0xFF;
						
						if(hasColors) {
							imgData[n++] = (pixel >>> 16) & 0xFF;
							
							pixel = pixels[i++];
							imgData[n++] = (pixel >>> 0) & 0xFF;
						}
						
						alphaData[a++] = (pixel >>> 16) & 0xFF;
					}
					
					bpc = 8;
				}
				
				if(canCompress(compression)) {
										
					imageData = compressBytes(imgData, img.width * img.colors, img.colors, compression);
					smask = compressBytes(alphaData, img.width, 1, compression);
					
				}else{
					
					imageData = imgData;
					smask = alphaData;
					decode = null;
				}
			}
			
			/*
			 * Indexed png. Each pixel is a palette index.
			 */
			if(img.colorType === 3) {
				
				colorSpace = this.color_spaces.INDEXED;
				pal = img.palette;
				
				if(img.transparency.indexed) {
					
					var trans = img.transparency.indexed;
					
					var total = 0,
						i = 0,
						len = trans.length;

					for(; i<len; ++i)
					    total += trans[i];
					
					total = total / 255;
					
					/*
					 * a single color is specified as 100% transparent (0),
					 * so we set trns to use a /Mask with that index
					 */
					if(total === len - 1 && trans.indexOf(0) !== -1) {
						trns = [trans.indexOf(0)];
					
					/*
					 * there's more than one colour within the palette that specifies
					 * a transparency value less than 255, so we unroll the pixels to create an image sMask
					 */
					}else if(total !== len){
						
						var pixels = img.decodePixels(),
							alphaData = new Uint8Array(pixels.length),
							i = 0,
							len = pixels.length;
						
						for(; i < len; i++)
							alphaData[i] = trans[pixels[i]];
						
						smask = compressBytes(alphaData, img.width, 1);
					}
				}
			}
			
			if(decode === this.decode.FLATE_DECODE)
				dp = '/Predictor 15 /Colors '+ colors +' /BitsPerComponent '+ bpc +' /Columns '+ img.width;
			else
				//remove 'Predictor' as it applies to the type of png filter applied to its IDAT - we only apply with compression
				dp = '/Colors '+ colors +' /BitsPerComponent '+ bpc +' /Columns '+ img.width;
			
			if(this.isArrayBuffer(imageData) || this.isArrayBufferView(imageData))
				imageData = this.arrayBufferToBinaryString(imageData);
			
			if(smask && this.isArrayBuffer(smask) || this.isArrayBufferView(smask))
				smask = this.arrayBufferToBinaryString(smask);
			
			return this.createImageInfo(imageData, img.width, img.height, colorSpace,
										bpc, decode, imageIndex, alias, dp, trns, pal, smask);
		}
		
		throw new Error("Unsupported PNG image data, try using JPEG instead.");
	}

})(jsPDF.API)
/** @preserve
jsPDF Silly SVG plugin
Copyright (c) 2012 Willow Systems Corporation, willow-systems.com
*/
/**
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 * 
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * ====================================================================
 */

;(function(jsPDFAPI) {
'use strict'

/**
Parses SVG XML and converts only some of the SVG elements into
PDF elements.

Supports:
 paths

@public
@function
@param
@returns {Type}
*/
jsPDFAPI.addSVG = function(svgtext, x, y, w, h) {
	// 'this' is _jsPDF object returned when jsPDF is inited (new jsPDF())

	var undef

	if (x === undef || y === undef) {
		throw new Error("addSVG needs values for 'x' and 'y'");
	}

    function InjectCSS(cssbody, document) {
        var styletag = document.createElement('style');
        styletag.type = 'text/css';
        if (styletag.styleSheet) {
        	// ie
            styletag.styleSheet.cssText = cssbody;
        } else {
        	// others
            styletag.appendChild(document.createTextNode(cssbody));
        }
        document.getElementsByTagName("head")[0].appendChild(styletag);
    }

	function createWorkerNode(document){

		var frameID = 'childframe' // Date.now().toString() + '_' + (Math.random() * 100).toString()
		, frame = document.createElement('iframe')

		InjectCSS(
			'.jsPDF_sillysvg_iframe {display:none;position:absolute;}'
			, document
		)

		frame.name = frameID
		frame.setAttribute("width", 0)
		frame.setAttribute("height", 0)
		frame.setAttribute("frameborder", "0")
		frame.setAttribute("scrolling", "no")
		frame.setAttribute("seamless", "seamless")
		frame.setAttribute("class", "jsPDF_sillysvg_iframe")
		
		document.body.appendChild(frame)

		return frame
	}

	function attachSVGToWorkerNode(svgtext, frame){
		var framedoc = ( frame.contentWindow || frame.contentDocument ).document
		framedoc.write(svgtext)
		framedoc.close()
		return framedoc.getElementsByTagName('svg')[0]
	}

	function convertPathToPDFLinesArgs(path){
		'use strict'
		// we will use 'lines' method call. it needs:
		// - starting coordinate pair
		// - array of arrays of vector shifts (2-len for line, 6 len for bezier)
		// - scale array [horizontal, vertical] ratios
		// - style (stroke, fill, both)

		var x = parseFloat(path[1])
		, y = parseFloat(path[2])
		, vectors = []
		, position = 3
		, len = path.length

		while (position < len){
			if (path[position] === 'c'){
				vectors.push([
					parseFloat(path[position + 1])
					, parseFloat(path[position + 2])
					, parseFloat(path[position + 3])
					, parseFloat(path[position + 4])
					, parseFloat(path[position + 5])
					, parseFloat(path[position + 6])
				])
				position += 7
			} else if (path[position] === 'l') {
				vectors.push([
					parseFloat(path[position + 1])
					, parseFloat(path[position + 2])
				])
				position += 3
			} else {
				position += 1
			}
		}
		return [x,y,vectors]
	}

	var workernode = createWorkerNode(document)
	, svgnode = attachSVGToWorkerNode(svgtext, workernode)
	, scale = [1,1]
	, svgw = parseFloat(svgnode.getAttribute('width'))
	, svgh = parseFloat(svgnode.getAttribute('height'))

	if (svgw && svgh) {
		// setting both w and h makes image stretch to size.
		// this may distort the image, but fits your demanded size
		if (w && h) {
			scale = [w / svgw, h / svgh]
		} 
		// if only one is set, that value is set as max and SVG 
		// is scaled proportionately.
		else if (w) {
			scale = [w / svgw, w / svgw]
		} else if (h) {
			scale = [h / svgh, h / svgh]
		}
	}

	var i, l, tmp
	, linesargs
	, items = svgnode.childNodes
	for (i = 0, l = items.length; i < l; i++) {
		tmp = items[i]
		if (tmp.tagName && tmp.tagName.toUpperCase() === 'PATH') {
			linesargs = convertPathToPDFLinesArgs( tmp.getAttribute("d").split(' ') )
			// path start x coordinate
			linesargs[0] = linesargs[0] * scale[0] + x // where x is upper left X of image
			// path start y coordinate
			linesargs[1] = linesargs[1] * scale[1] + y // where y is upper left Y of image
			// the rest of lines are vectors. these will adjust with scale value auto.
			this.lines.call(
				this
				, linesargs[2] // lines
				, linesargs[0] // starting x
				, linesargs[1] // starting y
				, scale
			)
		}
	}

	// clean up
	// workernode.parentNode.removeChild(workernode)

	return this
}

})(jsPDF.API);
/** @preserve
 * jsPDF split_text_to_size plugin - MIT license.
 * Copyright (c) 2012 Willow Systems Corporation, willow-systems.com
 *               2014 Diego Casorran, https://github.com/diegocr
 */
/**
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * ====================================================================
 */

;(function(API) {
'use strict'

/**
Returns an array of length matching length of the 'word' string, with each
cell ocupied by the width of the char in that position.

@function
@param word {String}
@param widths {Object}
@param kerning {Object}
@returns {Array}
*/
var getCharWidthsArray = API.getCharWidthsArray = function(text, options){

	if (!options) {
		options = {}
	}

	var widths = options.widths ? options.widths : this.internal.getFont().metadata.Unicode.widths
	, widthsFractionOf = widths.fof ? widths.fof : 1
	, kerning = options.kerning ? options.kerning : this.internal.getFont().metadata.Unicode.kerning
	, kerningFractionOf = kerning.fof ? kerning.fof : 1

	// console.log("widths, kergnings", widths, kerning)

	var i, l
	, char_code
	, prior_char_code = 0 // for kerning
	, default_char_width = widths[0] || widthsFractionOf
	, output = []

	for (i = 0, l = text.length; i < l; i++) {
		char_code = text.charCodeAt(i)
		output.push(
			( widths[char_code] || default_char_width ) / widthsFractionOf +
			( kerning[char_code] && kerning[char_code][prior_char_code] || 0 ) / kerningFractionOf
		)
		prior_char_code = char_code
	}

	return output
}
var getArraySum = function(array){
	var i = array.length
	, output = 0
	while(i){
		;i--;
		output += array[i]
	}
	return output
}
/**
Returns a widths of string in a given font, if the font size is set as 1 point.

In other words, this is "proportional" value. For 1 unit of font size, the length
of the string will be that much.

Multiply by font size to get actual width in *points*
Then divide by 72 to get inches or divide by (72/25.6) to get 'mm' etc.

@public
@function
@param
@returns {Type}
*/
var getStringUnitWidth = API.getStringUnitWidth = function(text, options) {
	return getArraySum(getCharWidthsArray.call(this, text, options))
}

/**
returns array of lines
*/
var splitLongWord = function(word, widths_array, firstLineMaxLen, maxLen){
	var answer = []

	// 1st, chop off the piece that can fit on the hanging line.
	var i = 0
	, l = word.length
	, workingLen = 0
	while (i !== l && workingLen + widths_array[i] < firstLineMaxLen){
		workingLen += widths_array[i]
		;i++;
	}
	// this is first line.
	answer.push(word.slice(0, i))

	// 2nd. Split the rest into maxLen pieces.
	var startOfLine = i
	workingLen = 0
	while (i !== l){
		if (workingLen + widths_array[i] > maxLen) {
			answer.push(word.slice(startOfLine, i))
			workingLen = 0
			startOfLine = i
		}
		workingLen += widths_array[i]
		;i++;
	}
	if (startOfLine !== i) {
		answer.push(word.slice(startOfLine, i))
	}

	return answer
}

// Note, all sizing inputs for this function must be in "font measurement units"
// By default, for PDF, it's "point".
var splitParagraphIntoLines = function(text, maxlen, options){
	// at this time works only on Western scripts, ones with space char
	// separating the words. Feel free to expand.

	if (!options) {
		options = {}
	}

	var line = []
	, lines = [line]
	, line_length = options.textIndent || 0
	, separator_length = 0
	, current_word_length = 0
	, word
	, widths_array
	, words = text.split(' ')
	, spaceCharWidth = getCharWidthsArray(' ', options)[0]
	, i, l, tmp, lineIndent

	if(options.lineIndent === -1) {
		lineIndent = words[0].length +2;
	} else {
		lineIndent = options.lineIndent || 0;
	}
	if(lineIndent) {
		var pad = Array(lineIndent).join(" "), wrds = [];
		words.map(function(wrd) {
			wrd = wrd.split(/\s*\n/);
			if(wrd.length > 1) {
				wrds = wrds.concat(wrd.map(function(wrd, idx) {
					return (idx && wrd.length ? "\n":"") + wrd;
				}));
			} else {
				wrds.push(wrd[0]);
			}
		});
		words = wrds;
		lineIndent = getStringUnitWidth(pad, options);
	}

	for (i = 0, l = words.length; i < l; i++) {
		var force = 0;

		word = words[i]
		if(lineIndent && word[0] == "\n") {
			word = word.substr(1);
			force = 1;
		}
		widths_array = getCharWidthsArray(word, options)
		current_word_length = getArraySum(widths_array)

		if (line_length + separator_length + current_word_length > maxlen || force) {
			if (current_word_length > maxlen) {
				// this happens when you have space-less long URLs for example.
				// we just chop these to size. We do NOT insert hiphens
				tmp = splitLongWord(word, widths_array, maxlen - (line_length + separator_length), maxlen)
				// first line we add to existing line object
				line.push(tmp.shift()) // it's ok to have extra space indicator there
				// last line we make into new line object
				line = [tmp.pop()]
				// lines in the middle we apped to lines object as whole lines
				while(tmp.length){
					lines.push([tmp.shift()]) // single fragment occupies whole line
				}
				current_word_length = getArraySum( widths_array.slice(word.length - line[0].length) )
			} else {
				// just put it on a new line
				line = [word]
			}

			// now we attach new line to lines
			lines.push(line)
			line_length = current_word_length + lineIndent
			separator_length = spaceCharWidth

		} else {
			line.push(word)

			line_length += separator_length + current_word_length
			separator_length = spaceCharWidth
		}
	}

	if(lineIndent) {
		var postProcess = function(ln, idx) {
			return (idx ? pad : '') + ln.join(" ");
		};
	} else {
		var postProcess = function(ln) { return ln.join(" ")};
	}

	return lines.map(postProcess);
}

/**
Splits a given string into an array of strings. Uses 'size' value
(in measurement units declared as default for the jsPDF instance)
and the font's "widths" and "Kerning" tables, where availabe, to
determine display length of a given string for a given font.

We use character's 100% of unit size (height) as width when Width
table or other default width is not available.

@public
@function
@param text {String} Unencoded, regular JavaScript (Unicode, UTF-16 / UCS-2) string.
@param size {Number} Nominal number, measured in units default to this instance of jsPDF.
@param options {Object} Optional flags needed for chopper to do the right thing.
@returns {Array} with strings chopped to size.
*/
API.splitTextToSize = function(text, maxlen, options) {
	'use strict'

	if (!options) {
		options = {}
	}

	var fsize = options.fontSize || this.internal.getFontSize()
	, newOptions = (function(options){
		var widths = {0:1}
		, kerning = {}

		if (!options.widths || !options.kerning) {
			var f = this.internal.getFont(options.fontName, options.fontStyle)
			, encoding = 'Unicode'
			// NOT UTF8, NOT UTF16BE/LE, NOT UCS2BE/LE
			// Actual JavaScript-native String's 16bit char codes used.
			// no multi-byte logic here

			if (f.metadata[encoding]) {
				return {
					widths: f.metadata[encoding].widths || widths
					, kerning: f.metadata[encoding].kerning || kerning
				}
			}
		} else {
			return 	{
				widths: options.widths
				, kerning: options.kerning
			}
		}

		// then use default values
		return 	{
			widths: widths
			, kerning: kerning
		}
	}).call(this, options)

	// first we split on end-of-line chars
	var paragraphs
	if(Array.isArray(text)) {
		paragraphs = text;
	} else {
		paragraphs = text.split(/\r?\n/);
	}

	// now we convert size (max length of line) into "font size units"
	// at present time, the "font size unit" is always 'point'
	// 'proportional' means, "in proportion to font size"
	var fontUnit_maxLen = 1.0 * this.internal.scaleFactor * maxlen / fsize
	// at this time, fsize is always in "points" regardless of the default measurement unit of the doc.
	// this may change in the future?
	// until then, proportional_maxlen is likely to be in 'points'

	// If first line is to be indented (shorter or longer) than maxLen
	// we indicate that by using CSS-style "text-indent" option.
	// here it's in font units too (which is likely 'points')
	// it can be negative (which makes the first line longer than maxLen)
	newOptions.textIndent = options.textIndent ?
		options.textIndent * 1.0 * this.internal.scaleFactor / fsize :
		0
	newOptions.lineIndent = options.lineIndent;

	var i, l
	, output = []
	for (i = 0, l = paragraphs.length; i < l; i++) {
		output = output.concat(
			splitParagraphIntoLines(
				paragraphs[i]
				, fontUnit_maxLen
				, newOptions
			)
		)
	}

	return output
}

})(jsPDF.API);
/** @preserve 
jsPDF standard_fonts_metrics plugin
Copyright (c) 2012 Willow Systems Corporation, willow-systems.com
MIT license.
*/
/**
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 * 
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * ====================================================================
 */

;(function(API) {
'use strict'

/*
# reference (Python) versions of 'compress' and 'uncompress'
# only 'uncompress' function is featured lower as JavaScript
# if you want to unit test "roundtrip", just transcribe the reference
# 'compress' function from Python into JavaScript

def compress(data):

	keys =   '0123456789abcdef'
	values = 'klmnopqrstuvwxyz'
	mapping = dict(zip(keys, values))
	vals = []
	for key in data.keys():
		value = data[key]
		try:
			keystring = hex(key)[2:]
			keystring = keystring[:-1] + mapping[keystring[-1:]]
		except:
			keystring = key.join(["'","'"])
			#print('Keystring is %s' % keystring)

		try:
			if value < 0:
				valuestring = hex(value)[3:]
				numberprefix = '-'
			else:
				valuestring = hex(value)[2:]
				numberprefix = ''
			valuestring = numberprefix + valuestring[:-1] + mapping[valuestring[-1:]]
		except:
			if type(value) == dict:
				valuestring = compress(value)
			else:
				raise Exception("Don't know what to do with value type %s" % type(value))

		vals.append(keystring+valuestring)
	
	return '{' + ''.join(vals) + '}'

def uncompress(data):

	decoded = '0123456789abcdef'
	encoded = 'klmnopqrstuvwxyz'
	mapping = dict(zip(encoded, decoded))

	sign = +1
	stringmode = False
	stringparts = []

	output = {}

	activeobject = output
	parentchain = []

	keyparts = ''
	valueparts = ''

	key = None

	ending = set(encoded)

	i = 1
	l = len(data) - 1 # stripping starting, ending {}
	while i != l: # stripping {}
		# -, {, }, ' are special.

		ch = data[i]
		i += 1

		if ch == "'":
			if stringmode:
				# end of string mode
				stringmode = False
				key = ''.join(stringparts)
			else:
				# start of string mode
				stringmode = True
				stringparts = []
		elif stringmode == True:
			#print("Adding %s to stringpart" % ch)
			stringparts.append(ch)

		elif ch == '{':
			# start of object
			parentchain.append( [activeobject, key] )
			activeobject = {}
			key = None
			#DEBUG = True
		elif ch == '}':
			# end of object
			parent, key = parentchain.pop()
			parent[key] = activeobject
			key = None
			activeobject = parent
			#DEBUG = False

		elif ch == '-':
			sign = -1
		else:
			# must be number
			if key == None:
				#debug("In Key. It is '%s', ch is '%s'" % (keyparts, ch))
				if ch in ending:
					#debug("End of key")
					keyparts += mapping[ch]
					key = int(keyparts, 16) * sign
					sign = +1
					keyparts = ''
				else:
					keyparts += ch
			else:
				#debug("In value. It is '%s', ch is '%s'" % (valueparts, ch))
				if ch in ending:
					#debug("End of value")
					valueparts += mapping[ch]
					activeobject[key] = int(valueparts, 16) * sign
					sign = +1
					key = None
					valueparts = ''
				else:
					valueparts += ch

			#debug(activeobject)

	return output

*/

/**
Uncompresses data compressed into custom, base16-like format. 
@public
@function
@param
@returns {Type}
*/
var uncompress = function(data){

	var decoded = '0123456789abcdef'
	, encoded = 'klmnopqrstuvwxyz'
	, mapping = {}

	for (var i = 0; i < encoded.length; i++){
		mapping[encoded[i]] = decoded[i]
	}

	var undef
	, output = {}
	, sign = 1
	, stringparts // undef. will be [] in string mode
	
	, activeobject = output
	, parentchain = []
	, parent_key_pair
	, keyparts = ''
	, valueparts = ''
	, key // undef. will be Truthy when Key is resolved.
	, datalen = data.length - 1 // stripping ending }
	, ch

	i = 1 // stripping starting {
	
	while (i != datalen){
		// - { } ' are special.

		ch = data[i]
		i += 1

		if (ch == "'"){
			if (stringparts){
				// end of string mode
				key = stringparts.join('')
				stringparts = undef				
			} else {
				// start of string mode
				stringparts = []				
			}
		} else if (stringparts){
			stringparts.push(ch)
		} else if (ch == '{'){
			// start of object
			parentchain.push( [activeobject, key] )
			activeobject = {}
			key = undef
		} else if (ch == '}'){
			// end of object
			parent_key_pair = parentchain.pop()
			parent_key_pair[0][parent_key_pair[1]] = activeobject
			key = undef
			activeobject = parent_key_pair[0]
		} else if (ch == '-'){
			sign = -1
		} else {
			// must be number
			if (key === undef) {
				if (mapping.hasOwnProperty(ch)){
					keyparts += mapping[ch]
					key = parseInt(keyparts, 16) * sign
					sign = +1
					keyparts = ''
				} else {
					keyparts += ch
				}
			} else {
				if (mapping.hasOwnProperty(ch)){
					valueparts += mapping[ch]
					activeobject[key] = parseInt(valueparts, 16) * sign
					sign = +1
					key = undef
					valueparts = ''
				} else {
					valueparts += ch					
				}
			}
		}
	} // end while

	return output
}

// encoding = 'Unicode' 
// NOT UTF8, NOT UTF16BE/LE, NOT UCS2BE/LE. NO clever BOM behavior
// Actual 16bit char codes used.
// no multi-byte logic here

// Unicode characters to WinAnsiEncoding:
// {402: 131, 8211: 150, 8212: 151, 8216: 145, 8217: 146, 8218: 130, 8220: 147, 8221: 148, 8222: 132, 8224: 134, 8225: 135, 8226: 149, 8230: 133, 8364: 128, 8240:137, 8249: 139, 8250: 155, 710: 136, 8482: 153, 338: 140, 339: 156, 732: 152, 352: 138, 353: 154, 376: 159, 381: 142, 382: 158}
// as you can see, all Unicode chars are outside of 0-255 range. No char code conflicts.
// this means that you can give Win cp1252 encoded strings to jsPDF for rendering directly
// as well as give strings with some (supported by these fonts) Unicode characters and 
// these will be mapped to win cp1252 
// for example, you can send char code (cp1252) 0x80 or (unicode) 0x20AC, getting "Euro" glyph displayed in both cases.

var encodingBlock = {
	'codePages': ['WinAnsiEncoding']
	, 'WinAnsiEncoding': uncompress("{19m8n201n9q201o9r201s9l201t9m201u8m201w9n201x9o201y8o202k8q202l8r202m9p202q8p20aw8k203k8t203t8v203u9v2cq8s212m9t15m8w15n9w2dw9s16k8u16l9u17s9z17x8y17y9y}")
}
, encodings = {'Unicode':{
	'Courier': encodingBlock
	, 'Courier-Bold': encodingBlock
	, 'Courier-BoldOblique': encodingBlock
	, 'Courier-Oblique': encodingBlock
	, 'Helvetica': encodingBlock
	, 'Helvetica-Bold': encodingBlock
	, 'Helvetica-BoldOblique': encodingBlock
	, 'Helvetica-Oblique': encodingBlock
	, 'Times-Roman': encodingBlock
	, 'Times-Bold': encodingBlock
	, 'Times-BoldItalic': encodingBlock
	, 'Times-Italic': encodingBlock
//	, 'Symbol'
//	, 'ZapfDingbats'
}}
/** 
Resources:
Font metrics data is reprocessed derivative of contents of
"Font Metrics for PDF Core 14 Fonts" package, which exhibits the following copyright and license:

Copyright (c) 1989, 1990, 1991, 1992, 1993, 1997 Adobe Systems Incorporated. All Rights Reserved.

This file and the 14 PostScript(R) AFM files it accompanies may be used,
copied, and distributed for any purpose and without charge, with or without
modification, provided that all copyright notices are retained; that the AFM
files are not distributed without this file; that all modifications to this
file or any of the AFM files are prominently noted in the modified file(s);
and that this paragraph is not modified. Adobe Systems has no responsibility
or obligation to support the use of the AFM files.

*/
, fontMetrics = {'Unicode':{
	// all sizing numbers are n/fontMetricsFractionOf = one font size unit
	// this means that if fontMetricsFractionOf = 1000, and letter A's width is 476, it's
	// width is 476/1000 or 47.6% of its height (regardless of font size)
	// At this time this value applies to "widths" and "kerning" numbers.

	// char code 0 represents "default" (average) width - use it for chars missing in this table.
	// key 'fof' represents the "fontMetricsFractionOf" value

	'Courier-Oblique': uncompress("{'widths'{k3w'fof'6o}'kerning'{'fof'-6o}}")
	, 'Times-BoldItalic': uncompress("{'widths'{k3o2q4ycx2r201n3m201o6o201s2l201t2l201u2l201w3m201x3m201y3m2k1t2l2r202m2n2n3m2o3m2p5n202q6o2r1w2s2l2t2l2u3m2v3t2w1t2x2l2y1t2z1w3k3m3l3m3m3m3n3m3o3m3p3m3q3m3r3m3s3m203t2l203u2l3v2l3w3t3x3t3y3t3z3m4k5n4l4m4m4m4n4m4o4s4p4m4q4m4r4s4s4y4t2r4u3m4v4m4w3x4x5t4y4s4z4s5k3x5l4s5m4m5n3r5o3x5p4s5q4m5r5t5s4m5t3x5u3x5v2l5w1w5x2l5y3t5z3m6k2l6l3m6m3m6n2w6o3m6p2w6q2l6r3m6s3r6t1w6u1w6v3m6w1w6x4y6y3r6z3m7k3m7l3m7m2r7n2r7o1w7p3r7q2w7r4m7s3m7t2w7u2r7v2n7w1q7x2n7y3t202l3mcl4mal2ram3man3mao3map3mar3mas2lat4uau1uav3maw3way4uaz2lbk2sbl3t'fof'6obo2lbp3tbq3mbr1tbs2lbu1ybv3mbz3mck4m202k3mcm4mcn4mco4mcp4mcq5ycr4mcs4mct4mcu4mcv4mcw2r2m3rcy2rcz2rdl4sdm4sdn4sdo4sdp4sdq4sds4sdt4sdu4sdv4sdw4sdz3mek3mel3mem3men3meo3mep3meq4ser2wes2wet2weu2wev2wew1wex1wey1wez1wfl3rfm3mfn3mfo3mfp3mfq3mfr3tfs3mft3rfu3rfv3rfw3rfz2w203k6o212m6o2dw2l2cq2l3t3m3u2l17s3x19m3m}'kerning'{cl{4qu5kt5qt5rs17ss5ts}201s{201ss}201t{cks4lscmscnscoscpscls2wu2yu201ts}201x{2wu2yu}2k{201ts}2w{4qx5kx5ou5qx5rs17su5tu}2x{17su5tu5ou}2y{4qx5kx5ou5qx5rs17ss5ts}'fof'-6ofn{17sw5tw5ou5qw5rs}7t{cksclscmscnscoscps4ls}3u{17su5tu5os5qs}3v{17su5tu5os5qs}7p{17su5tu}ck{4qu5kt5qt5rs17ss5ts}4l{4qu5kt5qt5rs17ss5ts}cm{4qu5kt5qt5rs17ss5ts}cn{4qu5kt5qt5rs17ss5ts}co{4qu5kt5qt5rs17ss5ts}cp{4qu5kt5qt5rs17ss5ts}6l{4qu5ou5qw5rt17su5tu}5q{ckuclucmucnucoucpu4lu}5r{ckuclucmucnucoucpu4lu}7q{cksclscmscnscoscps4ls}6p{4qu5ou5qw5rt17sw5tw}ek{4qu5ou5qw5rt17su5tu}el{4qu5ou5qw5rt17su5tu}em{4qu5ou5qw5rt17su5tu}en{4qu5ou5qw5rt17su5tu}eo{4qu5ou5qw5rt17su5tu}ep{4qu5ou5qw5rt17su5tu}es{17ss5ts5qs4qu}et{4qu5ou5qw5rt17sw5tw}eu{4qu5ou5qw5rt17ss5ts}ev{17ss5ts5qs4qu}6z{17sw5tw5ou5qw5rs}fm{17sw5tw5ou5qw5rs}7n{201ts}fo{17sw5tw5ou5qw5rs}fp{17sw5tw5ou5qw5rs}fq{17sw5tw5ou5qw5rs}7r{cksclscmscnscoscps4ls}fs{17sw5tw5ou5qw5rs}ft{17su5tu}fu{17su5tu}fv{17su5tu}fw{17su5tu}fz{cksclscmscnscoscps4ls}}}")
	, 'Helvetica-Bold': uncompress("{'widths'{k3s2q4scx1w201n3r201o6o201s1w201t1w201u1w201w3m201x3m201y3m2k1w2l2l202m2n2n3r2o3r2p5t202q6o2r1s2s2l2t2l2u2r2v3u2w1w2x2l2y1w2z1w3k3r3l3r3m3r3n3r3o3r3p3r3q3r3r3r3s3r203t2l203u2l3v2l3w3u3x3u3y3u3z3x4k6l4l4s4m4s4n4s4o4s4p4m4q3x4r4y4s4s4t1w4u3r4v4s4w3x4x5n4y4s4z4y5k4m5l4y5m4s5n4m5o3x5p4s5q4m5r5y5s4m5t4m5u3x5v2l5w1w5x2l5y3u5z3r6k2l6l3r6m3x6n3r6o3x6p3r6q2l6r3x6s3x6t1w6u1w6v3r6w1w6x5t6y3x6z3x7k3x7l3x7m2r7n3r7o2l7p3x7q3r7r4y7s3r7t3r7u3m7v2r7w1w7x2r7y3u202l3rcl4sal2lam3ran3rao3rap3rar3ras2lat4tau2pav3raw3uay4taz2lbk2sbl3u'fof'6obo2lbp3xbq3rbr1wbs2lbu2obv3rbz3xck4s202k3rcm4scn4sco4scp4scq6ocr4scs4mct4mcu4mcv4mcw1w2m2zcy1wcz1wdl4sdm4ydn4ydo4ydp4ydq4yds4ydt4sdu4sdv4sdw4sdz3xek3rel3rem3ren3reo3rep3req5ter3res3ret3reu3rev3rew1wex1wey1wez1wfl3xfm3xfn3xfo3xfp3xfq3xfr3ufs3xft3xfu3xfv3xfw3xfz3r203k6o212m6o2dw2l2cq2l3t3r3u2l17s4m19m3r}'kerning'{cl{4qs5ku5ot5qs17sv5tv}201t{2ww4wy2yw}201w{2ks}201x{2ww4wy2yw}2k{201ts201xs}2w{7qs4qu5kw5os5qw5rs17su5tu7tsfzs}2x{5ow5qs}2y{7qs4qu5kw5os5qw5rs17su5tu7tsfzs}'fof'-6o7p{17su5tu5ot}ck{4qs5ku5ot5qs17sv5tv}4l{4qs5ku5ot5qs17sv5tv}cm{4qs5ku5ot5qs17sv5tv}cn{4qs5ku5ot5qs17sv5tv}co{4qs5ku5ot5qs17sv5tv}cp{4qs5ku5ot5qs17sv5tv}6l{17st5tt5os}17s{2kwclvcmvcnvcovcpv4lv4wwckv}5o{2kucltcmtcntcotcpt4lt4wtckt}5q{2ksclscmscnscoscps4ls4wvcks}5r{2ks4ws}5t{2kwclvcmvcnvcovcpv4lv4wwckv}eo{17st5tt5os}fu{17su5tu5ot}6p{17ss5ts}ek{17st5tt5os}el{17st5tt5os}em{17st5tt5os}en{17st5tt5os}6o{201ts}ep{17st5tt5os}es{17ss5ts}et{17ss5ts}eu{17ss5ts}ev{17ss5ts}6z{17su5tu5os5qt}fm{17su5tu5os5qt}fn{17su5tu5os5qt}fo{17su5tu5os5qt}fp{17su5tu5os5qt}fq{17su5tu5os5qt}fs{17su5tu5os5qt}ft{17su5tu5ot}7m{5os}fv{17su5tu5ot}fw{17su5tu5ot}}}")
	, 'Courier': uncompress("{'widths'{k3w'fof'6o}'kerning'{'fof'-6o}}")
	, 'Courier-BoldOblique': uncompress("{'widths'{k3w'fof'6o}'kerning'{'fof'-6o}}")
	, 'Times-Bold': uncompress("{'widths'{k3q2q5ncx2r201n3m201o6o201s2l201t2l201u2l201w3m201x3m201y3m2k1t2l2l202m2n2n3m2o3m2p6o202q6o2r1w2s2l2t2l2u3m2v3t2w1t2x2l2y1t2z1w3k3m3l3m3m3m3n3m3o3m3p3m3q3m3r3m3s3m203t2l203u2l3v2l3w3t3x3t3y3t3z3m4k5x4l4s4m4m4n4s4o4s4p4m4q3x4r4y4s4y4t2r4u3m4v4y4w4m4x5y4y4s4z4y5k3x5l4y5m4s5n3r5o4m5p4s5q4s5r6o5s4s5t4s5u4m5v2l5w1w5x2l5y3u5z3m6k2l6l3m6m3r6n2w6o3r6p2w6q2l6r3m6s3r6t1w6u2l6v3r6w1w6x5n6y3r6z3m7k3r7l3r7m2w7n2r7o2l7p3r7q3m7r4s7s3m7t3m7u2w7v2r7w1q7x2r7y3o202l3mcl4sal2lam3man3mao3map3mar3mas2lat4uau1yav3maw3tay4uaz2lbk2sbl3t'fof'6obo2lbp3rbr1tbs2lbu2lbv3mbz3mck4s202k3mcm4scn4sco4scp4scq6ocr4scs4mct4mcu4mcv4mcw2r2m3rcy2rcz2rdl4sdm4ydn4ydo4ydp4ydq4yds4ydt4sdu4sdv4sdw4sdz3rek3mel3mem3men3meo3mep3meq4ser2wes2wet2weu2wev2wew1wex1wey1wez1wfl3rfm3mfn3mfo3mfp3mfq3mfr3tfs3mft3rfu3rfv3rfw3rfz3m203k6o212m6o2dw2l2cq2l3t3m3u2l17s4s19m3m}'kerning'{cl{4qt5ks5ot5qy5rw17sv5tv}201t{cks4lscmscnscoscpscls4wv}2k{201ts}2w{4qu5ku7mu5os5qx5ru17su5tu}2x{17su5tu5ou5qs}2y{4qv5kv7mu5ot5qz5ru17su5tu}'fof'-6o7t{cksclscmscnscoscps4ls}3u{17su5tu5os5qu}3v{17su5tu5os5qu}fu{17su5tu5ou5qu}7p{17su5tu5ou5qu}ck{4qt5ks5ot5qy5rw17sv5tv}4l{4qt5ks5ot5qy5rw17sv5tv}cm{4qt5ks5ot5qy5rw17sv5tv}cn{4qt5ks5ot5qy5rw17sv5tv}co{4qt5ks5ot5qy5rw17sv5tv}cp{4qt5ks5ot5qy5rw17sv5tv}6l{17st5tt5ou5qu}17s{ckuclucmucnucoucpu4lu4wu}5o{ckuclucmucnucoucpu4lu4wu}5q{ckzclzcmzcnzcozcpz4lz4wu}5r{ckxclxcmxcnxcoxcpx4lx4wu}5t{ckuclucmucnucoucpu4lu4wu}7q{ckuclucmucnucoucpu4lu}6p{17sw5tw5ou5qu}ek{17st5tt5qu}el{17st5tt5ou5qu}em{17st5tt5qu}en{17st5tt5qu}eo{17st5tt5qu}ep{17st5tt5ou5qu}es{17ss5ts5qu}et{17sw5tw5ou5qu}eu{17sw5tw5ou5qu}ev{17ss5ts5qu}6z{17sw5tw5ou5qu5rs}fm{17sw5tw5ou5qu5rs}fn{17sw5tw5ou5qu5rs}fo{17sw5tw5ou5qu5rs}fp{17sw5tw5ou5qu5rs}fq{17sw5tw5ou5qu5rs}7r{cktcltcmtcntcotcpt4lt5os}fs{17sw5tw5ou5qu5rs}ft{17su5tu5ou5qu}7m{5os}fv{17su5tu5ou5qu}fw{17su5tu5ou5qu}fz{cksclscmscnscoscps4ls}}}")
	//, 'Symbol': uncompress("{'widths'{k3uaw4r19m3m2k1t2l2l202m2y2n3m2p5n202q6o3k3m2s2l2t2l2v3r2w1t3m3m2y1t2z1wbk2sbl3r'fof'6o3n3m3o3m3p3m3q3m3r3m3s3m3t3m3u1w3v1w3w3r3x3r3y3r3z2wbp3t3l3m5v2l5x2l5z3m2q4yfr3r7v3k7w1o7x3k}'kerning'{'fof'-6o}}")
	, 'Helvetica': uncompress("{'widths'{k3p2q4mcx1w201n3r201o6o201s1q201t1q201u1q201w2l201x2l201y2l2k1w2l1w202m2n2n3r2o3r2p5t202q6o2r1n2s2l2t2l2u2r2v3u2w1w2x2l2y1w2z1w3k3r3l3r3m3r3n3r3o3r3p3r3q3r3r3r3s3r203t2l203u2l3v1w3w3u3x3u3y3u3z3r4k6p4l4m4m4m4n4s4o4s4p4m4q3x4r4y4s4s4t1w4u3m4v4m4w3r4x5n4y4s4z4y5k4m5l4y5m4s5n4m5o3x5p4s5q4m5r5y5s4m5t4m5u3x5v1w5w1w5x1w5y2z5z3r6k2l6l3r6m3r6n3m6o3r6p3r6q1w6r3r6s3r6t1q6u1q6v3m6w1q6x5n6y3r6z3r7k3r7l3r7m2l7n3m7o1w7p3r7q3m7r4s7s3m7t3m7u3m7v2l7w1u7x2l7y3u202l3rcl4mal2lam3ran3rao3rap3rar3ras2lat4tau2pav3raw3uay4taz2lbk2sbl3u'fof'6obo2lbp3rbr1wbs2lbu2obv3rbz3xck4m202k3rcm4mcn4mco4mcp4mcq6ocr4scs4mct4mcu4mcv4mcw1w2m2ncy1wcz1wdl4sdm4ydn4ydo4ydp4ydq4yds4ydt4sdu4sdv4sdw4sdz3xek3rel3rem3ren3reo3rep3req5ter3mes3ret3reu3rev3rew1wex1wey1wez1wfl3rfm3rfn3rfo3rfp3rfq3rfr3ufs3xft3rfu3rfv3rfw3rfz3m203k6o212m6o2dw2l2cq2l3t3r3u1w17s4m19m3r}'kerning'{5q{4wv}cl{4qs5kw5ow5qs17sv5tv}201t{2wu4w1k2yu}201x{2wu4wy2yu}17s{2ktclucmucnu4otcpu4lu4wycoucku}2w{7qs4qz5k1m17sy5ow5qx5rsfsu5ty7tufzu}2x{17sy5ty5oy5qs}2y{7qs4qz5k1m17sy5ow5qx5rsfsu5ty7tufzu}'fof'-6o7p{17sv5tv5ow}ck{4qs5kw5ow5qs17sv5tv}4l{4qs5kw5ow5qs17sv5tv}cm{4qs5kw5ow5qs17sv5tv}cn{4qs5kw5ow5qs17sv5tv}co{4qs5kw5ow5qs17sv5tv}cp{4qs5kw5ow5qs17sv5tv}6l{17sy5ty5ow}do{17st5tt}4z{17st5tt}7s{fst}dm{17st5tt}dn{17st5tt}5o{ckwclwcmwcnwcowcpw4lw4wv}dp{17st5tt}dq{17st5tt}7t{5ow}ds{17st5tt}5t{2ktclucmucnu4otcpu4lu4wycoucku}fu{17sv5tv5ow}6p{17sy5ty5ow5qs}ek{17sy5ty5ow}el{17sy5ty5ow}em{17sy5ty5ow}en{5ty}eo{17sy5ty5ow}ep{17sy5ty5ow}es{17sy5ty5qs}et{17sy5ty5ow5qs}eu{17sy5ty5ow5qs}ev{17sy5ty5ow5qs}6z{17sy5ty5ow5qs}fm{17sy5ty5ow5qs}fn{17sy5ty5ow5qs}fo{17sy5ty5ow5qs}fp{17sy5ty5qs}fq{17sy5ty5ow5qs}7r{5ow}fs{17sy5ty5ow5qs}ft{17sv5tv5ow}7m{5ow}fv{17sv5tv5ow}fw{17sv5tv5ow}}}")
	, 'Helvetica-BoldOblique': uncompress("{'widths'{k3s2q4scx1w201n3r201o6o201s1w201t1w201u1w201w3m201x3m201y3m2k1w2l2l202m2n2n3r2o3r2p5t202q6o2r1s2s2l2t2l2u2r2v3u2w1w2x2l2y1w2z1w3k3r3l3r3m3r3n3r3o3r3p3r3q3r3r3r3s3r203t2l203u2l3v2l3w3u3x3u3y3u3z3x4k6l4l4s4m4s4n4s4o4s4p4m4q3x4r4y4s4s4t1w4u3r4v4s4w3x4x5n4y4s4z4y5k4m5l4y5m4s5n4m5o3x5p4s5q4m5r5y5s4m5t4m5u3x5v2l5w1w5x2l5y3u5z3r6k2l6l3r6m3x6n3r6o3x6p3r6q2l6r3x6s3x6t1w6u1w6v3r6w1w6x5t6y3x6z3x7k3x7l3x7m2r7n3r7o2l7p3x7q3r7r4y7s3r7t3r7u3m7v2r7w1w7x2r7y3u202l3rcl4sal2lam3ran3rao3rap3rar3ras2lat4tau2pav3raw3uay4taz2lbk2sbl3u'fof'6obo2lbp3xbq3rbr1wbs2lbu2obv3rbz3xck4s202k3rcm4scn4sco4scp4scq6ocr4scs4mct4mcu4mcv4mcw1w2m2zcy1wcz1wdl4sdm4ydn4ydo4ydp4ydq4yds4ydt4sdu4sdv4sdw4sdz3xek3rel3rem3ren3reo3rep3req5ter3res3ret3reu3rev3rew1wex1wey1wez1wfl3xfm3xfn3xfo3xfp3xfq3xfr3ufs3xft3xfu3xfv3xfw3xfz3r203k6o212m6o2dw2l2cq2l3t3r3u2l17s4m19m3r}'kerning'{cl{4qs5ku5ot5qs17sv5tv}201t{2ww4wy2yw}201w{2ks}201x{2ww4wy2yw}2k{201ts201xs}2w{7qs4qu5kw5os5qw5rs17su5tu7tsfzs}2x{5ow5qs}2y{7qs4qu5kw5os5qw5rs17su5tu7tsfzs}'fof'-6o7p{17su5tu5ot}ck{4qs5ku5ot5qs17sv5tv}4l{4qs5ku5ot5qs17sv5tv}cm{4qs5ku5ot5qs17sv5tv}cn{4qs5ku5ot5qs17sv5tv}co{4qs5ku5ot5qs17sv5tv}cp{4qs5ku5ot5qs17sv5tv}6l{17st5tt5os}17s{2kwclvcmvcnvcovcpv4lv4wwckv}5o{2kucltcmtcntcotcpt4lt4wtckt}5q{2ksclscmscnscoscps4ls4wvcks}5r{2ks4ws}5t{2kwclvcmvcnvcovcpv4lv4wwckv}eo{17st5tt5os}fu{17su5tu5ot}6p{17ss5ts}ek{17st5tt5os}el{17st5tt5os}em{17st5tt5os}en{17st5tt5os}6o{201ts}ep{17st5tt5os}es{17ss5ts}et{17ss5ts}eu{17ss5ts}ev{17ss5ts}6z{17su5tu5os5qt}fm{17su5tu5os5qt}fn{17su5tu5os5qt}fo{17su5tu5os5qt}fp{17su5tu5os5qt}fq{17su5tu5os5qt}fs{17su5tu5os5qt}ft{17su5tu5ot}7m{5os}fv{17su5tu5ot}fw{17su5tu5ot}}}")
	//, 'ZapfDingbats': uncompress("{'widths'{k4u2k1w'fof'6o}'kerning'{'fof'-6o}}")
	, 'Courier-Bold': uncompress("{'widths'{k3w'fof'6o}'kerning'{'fof'-6o}}")
	, 'Times-Italic': uncompress("{'widths'{k3n2q4ycx2l201n3m201o5t201s2l201t2l201u2l201w3r201x3r201y3r2k1t2l2l202m2n2n3m2o3m2p5n202q5t2r1p2s2l2t2l2u3m2v4n2w1t2x2l2y1t2z1w3k3m3l3m3m3m3n3m3o3m3p3m3q3m3r3m3s3m203t2l203u2l3v2l3w4n3x4n3y4n3z3m4k5w4l3x4m3x4n4m4o4s4p3x4q3x4r4s4s4s4t2l4u2w4v4m4w3r4x5n4y4m4z4s5k3x5l4s5m3x5n3m5o3r5p4s5q3x5r5n5s3x5t3r5u3r5v2r5w1w5x2r5y2u5z3m6k2l6l3m6m3m6n2w6o3m6p2w6q1w6r3m6s3m6t1w6u1w6v2w6w1w6x4s6y3m6z3m7k3m7l3m7m2r7n2r7o1w7p3m7q2w7r4m7s2w7t2w7u2r7v2s7w1v7x2s7y3q202l3mcl3xal2ram3man3mao3map3mar3mas2lat4wau1vav3maw4nay4waz2lbk2sbl4n'fof'6obo2lbp3mbq3obr1tbs2lbu1zbv3mbz3mck3x202k3mcm3xcn3xco3xcp3xcq5tcr4mcs3xct3xcu3xcv3xcw2l2m2ucy2lcz2ldl4mdm4sdn4sdo4sdp4sdq4sds4sdt4sdu4sdv4sdw4sdz3mek3mel3mem3men3meo3mep3meq4mer2wes2wet2weu2wev2wew1wex1wey1wez1wfl3mfm3mfn3mfo3mfp3mfq3mfr4nfs3mft3mfu3mfv3mfw3mfz2w203k6o212m6m2dw2l2cq2l3t3m3u2l17s3r19m3m}'kerning'{cl{5kt4qw}201s{201sw}201t{201tw2wy2yy6q-t}201x{2wy2yy}2k{201tw}2w{7qs4qy7rs5ky7mw5os5qx5ru17su5tu}2x{17ss5ts5os}2y{7qs4qy7rs5ky7mw5os5qx5ru17su5tu}'fof'-6o6t{17ss5ts5qs}7t{5os}3v{5qs}7p{17su5tu5qs}ck{5kt4qw}4l{5kt4qw}cm{5kt4qw}cn{5kt4qw}co{5kt4qw}cp{5kt4qw}6l{4qs5ks5ou5qw5ru17su5tu}17s{2ks}5q{ckvclvcmvcnvcovcpv4lv}5r{ckuclucmucnucoucpu4lu}5t{2ks}6p{4qs5ks5ou5qw5ru17su5tu}ek{4qs5ks5ou5qw5ru17su5tu}el{4qs5ks5ou5qw5ru17su5tu}em{4qs5ks5ou5qw5ru17su5tu}en{4qs5ks5ou5qw5ru17su5tu}eo{4qs5ks5ou5qw5ru17su5tu}ep{4qs5ks5ou5qw5ru17su5tu}es{5ks5qs4qs}et{4qs5ks5ou5qw5ru17su5tu}eu{4qs5ks5qw5ru17su5tu}ev{5ks5qs4qs}ex{17ss5ts5qs}6z{4qv5ks5ou5qw5ru17su5tu}fm{4qv5ks5ou5qw5ru17su5tu}fn{4qv5ks5ou5qw5ru17su5tu}fo{4qv5ks5ou5qw5ru17su5tu}fp{4qv5ks5ou5qw5ru17su5tu}fq{4qv5ks5ou5qw5ru17su5tu}7r{5os}fs{4qv5ks5ou5qw5ru17su5tu}ft{17su5tu5qs}fu{17su5tu5qs}fv{17su5tu5qs}fw{17su5tu5qs}}}")
	, 'Times-Roman': uncompress("{'widths'{k3n2q4ycx2l201n3m201o6o201s2l201t2l201u2l201w2w201x2w201y2w2k1t2l2l202m2n2n3m2o3m2p5n202q6o2r1m2s2l2t2l2u3m2v3s2w1t2x2l2y1t2z1w3k3m3l3m3m3m3n3m3o3m3p3m3q3m3r3m3s3m203t2l203u2l3v1w3w3s3x3s3y3s3z2w4k5w4l4s4m4m4n4m4o4s4p3x4q3r4r4s4s4s4t2l4u2r4v4s4w3x4x5t4y4s4z4s5k3r5l4s5m4m5n3r5o3x5p4s5q4s5r5y5s4s5t4s5u3x5v2l5w1w5x2l5y2z5z3m6k2l6l2w6m3m6n2w6o3m6p2w6q2l6r3m6s3m6t1w6u1w6v3m6w1w6x4y6y3m6z3m7k3m7l3m7m2l7n2r7o1w7p3m7q3m7r4s7s3m7t3m7u2w7v3k7w1o7x3k7y3q202l3mcl4sal2lam3man3mao3map3mar3mas2lat4wau1vav3maw3say4waz2lbk2sbl3s'fof'6obo2lbp3mbq2xbr1tbs2lbu1zbv3mbz2wck4s202k3mcm4scn4sco4scp4scq5tcr4mcs3xct3xcu3xcv3xcw2l2m2tcy2lcz2ldl4sdm4sdn4sdo4sdp4sdq4sds4sdt4sdu4sdv4sdw4sdz3mek2wel2wem2wen2weo2wep2weq4mer2wes2wet2weu2wev2wew1wex1wey1wez1wfl3mfm3mfn3mfo3mfp3mfq3mfr3sfs3mft3mfu3mfv3mfw3mfz3m203k6o212m6m2dw2l2cq2l3t3m3u1w17s4s19m3m}'kerning'{cl{4qs5ku17sw5ou5qy5rw201ss5tw201ws}201s{201ss}201t{ckw4lwcmwcnwcowcpwclw4wu201ts}2k{201ts}2w{4qs5kw5os5qx5ru17sx5tx}2x{17sw5tw5ou5qu}2y{4qs5kw5os5qx5ru17sx5tx}'fof'-6o7t{ckuclucmucnucoucpu4lu5os5rs}3u{17su5tu5qs}3v{17su5tu5qs}7p{17sw5tw5qs}ck{4qs5ku17sw5ou5qy5rw201ss5tw201ws}4l{4qs5ku17sw5ou5qy5rw201ss5tw201ws}cm{4qs5ku17sw5ou5qy5rw201ss5tw201ws}cn{4qs5ku17sw5ou5qy5rw201ss5tw201ws}co{4qs5ku17sw5ou5qy5rw201ss5tw201ws}cp{4qs5ku17sw5ou5qy5rw201ss5tw201ws}6l{17su5tu5os5qw5rs}17s{2ktclvcmvcnvcovcpv4lv4wuckv}5o{ckwclwcmwcnwcowcpw4lw4wu}5q{ckyclycmycnycoycpy4ly4wu5ms}5r{cktcltcmtcntcotcpt4lt4ws}5t{2ktclvcmvcnvcovcpv4lv4wuckv}7q{cksclscmscnscoscps4ls}6p{17su5tu5qw5rs}ek{5qs5rs}el{17su5tu5os5qw5rs}em{17su5tu5os5qs5rs}en{17su5qs5rs}eo{5qs5rs}ep{17su5tu5os5qw5rs}es{5qs}et{17su5tu5qw5rs}eu{17su5tu5qs5rs}ev{5qs}6z{17sv5tv5os5qx5rs}fm{5os5qt5rs}fn{17sv5tv5os5qx5rs}fo{17sv5tv5os5qx5rs}fp{5os5qt5rs}fq{5os5qt5rs}7r{ckuclucmucnucoucpu4lu5os}fs{17sv5tv5os5qx5rs}ft{17ss5ts5qs}fu{17sw5tw5qs}fv{17sw5tw5qs}fw{17ss5ts5qs}fz{ckuclucmucnucoucpu4lu5os5rs}}}")
	, 'Helvetica-Oblique': uncompress("{'widths'{k3p2q4mcx1w201n3r201o6o201s1q201t1q201u1q201w2l201x2l201y2l2k1w2l1w202m2n2n3r2o3r2p5t202q6o2r1n2s2l2t2l2u2r2v3u2w1w2x2l2y1w2z1w3k3r3l3r3m3r3n3r3o3r3p3r3q3r3r3r3s3r203t2l203u2l3v1w3w3u3x3u3y3u3z3r4k6p4l4m4m4m4n4s4o4s4p4m4q3x4r4y4s4s4t1w4u3m4v4m4w3r4x5n4y4s4z4y5k4m5l4y5m4s5n4m5o3x5p4s5q4m5r5y5s4m5t4m5u3x5v1w5w1w5x1w5y2z5z3r6k2l6l3r6m3r6n3m6o3r6p3r6q1w6r3r6s3r6t1q6u1q6v3m6w1q6x5n6y3r6z3r7k3r7l3r7m2l7n3m7o1w7p3r7q3m7r4s7s3m7t3m7u3m7v2l7w1u7x2l7y3u202l3rcl4mal2lam3ran3rao3rap3rar3ras2lat4tau2pav3raw3uay4taz2lbk2sbl3u'fof'6obo2lbp3rbr1wbs2lbu2obv3rbz3xck4m202k3rcm4mcn4mco4mcp4mcq6ocr4scs4mct4mcu4mcv4mcw1w2m2ncy1wcz1wdl4sdm4ydn4ydo4ydp4ydq4yds4ydt4sdu4sdv4sdw4sdz3xek3rel3rem3ren3reo3rep3req5ter3mes3ret3reu3rev3rew1wex1wey1wez1wfl3rfm3rfn3rfo3rfp3rfq3rfr3ufs3xft3rfu3rfv3rfw3rfz3m203k6o212m6o2dw2l2cq2l3t3r3u1w17s4m19m3r}'kerning'{5q{4wv}cl{4qs5kw5ow5qs17sv5tv}201t{2wu4w1k2yu}201x{2wu4wy2yu}17s{2ktclucmucnu4otcpu4lu4wycoucku}2w{7qs4qz5k1m17sy5ow5qx5rsfsu5ty7tufzu}2x{17sy5ty5oy5qs}2y{7qs4qz5k1m17sy5ow5qx5rsfsu5ty7tufzu}'fof'-6o7p{17sv5tv5ow}ck{4qs5kw5ow5qs17sv5tv}4l{4qs5kw5ow5qs17sv5tv}cm{4qs5kw5ow5qs17sv5tv}cn{4qs5kw5ow5qs17sv5tv}co{4qs5kw5ow5qs17sv5tv}cp{4qs5kw5ow5qs17sv5tv}6l{17sy5ty5ow}do{17st5tt}4z{17st5tt}7s{fst}dm{17st5tt}dn{17st5tt}5o{ckwclwcmwcnwcowcpw4lw4wv}dp{17st5tt}dq{17st5tt}7t{5ow}ds{17st5tt}5t{2ktclucmucnu4otcpu4lu4wycoucku}fu{17sv5tv5ow}6p{17sy5ty5ow5qs}ek{17sy5ty5ow}el{17sy5ty5ow}em{17sy5ty5ow}en{5ty}eo{17sy5ty5ow}ep{17sy5ty5ow}es{17sy5ty5qs}et{17sy5ty5ow5qs}eu{17sy5ty5ow5qs}ev{17sy5ty5ow5qs}6z{17sy5ty5ow5qs}fm{17sy5ty5ow5qs}fn{17sy5ty5ow5qs}fo{17sy5ty5ow5qs}fp{17sy5ty5qs}fq{17sy5ty5ow5qs}7r{5ow}fs{17sy5ty5ow5qs}ft{17sv5tv5ow}7m{5ow}fv{17sv5tv5ow}fw{17sv5tv5ow}}}")
}};

/*
This event handler is fired when a new jsPDF object is initialized
This event handler appends metrics data to standard fonts within
that jsPDF instance. The metrics are mapped over Unicode character
codes, NOT CIDs or other codes matching the StandardEncoding table of the
standard PDF fonts.
Future:
Also included is the encoding maping table, converting Unicode (UCS-2, UTF-16)
char codes to StandardEncoding character codes. The encoding table is to be used
somewhere around "pdfEscape" call.
*/

API.events.push([ 
	'addFonts'
	,function(fontManagementObjects) {
		// fontManagementObjects is {
		//	'fonts':font_ID-keyed hash of font objects
		//	, 'dictionary': lookup object, linking ["FontFamily"]['Style'] to font ID
		//}
		var font
		, fontID
		, metrics
		, unicode_section
		, encoding = 'Unicode'
		, encodingBlock

		for (fontID in fontManagementObjects.fonts){
			if (fontManagementObjects.fonts.hasOwnProperty(fontID)) {
				font = fontManagementObjects.fonts[fontID]

				// // we only ship 'Unicode' mappings and metrics. No need for loop.
				// // still, leaving this for the future.

				// for (encoding in fontMetrics){
				// 	if (fontMetrics.hasOwnProperty(encoding)) {

						metrics = fontMetrics[encoding][font.PostScriptName]
						if (metrics) {
							if (font.metadata[encoding]) {
								unicode_section = font.metadata[encoding]
							} else {
								unicode_section = font.metadata[encoding] = {}
							}

							unicode_section.widths = metrics.widths
							unicode_section.kerning = metrics.kerning
						}
				// 	}
				// }
				// for (encoding in encodings){
				// 	if (encodings.hasOwnProperty(encoding)) {
						encodingBlock = encodings[encoding][font.PostScriptName]
						if (encodingBlock) {
							if (font.metadata[encoding]) {
								unicode_section = font.metadata[encoding]
							} else {
								unicode_section = font.metadata[encoding] = {}
							}

							unicode_section.encoding = encodingBlock
							if (encodingBlock.codePages && encodingBlock.codePages.length) {
								font.encoding = encodingBlock.codePages[0]
							}
						}
				// 	}
				// }
			}
		}
	}
]) // end of adding event handler

})(jsPDF.API);
/** ==================================================================== 
 * jsPDF total_pages plugin
 * Copyright (c) 2013 Eduardo Menezes de Morais, eduardo.morais@usp.br
 * 
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 * 
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * ====================================================================
 */

(function(jsPDFAPI) {
'use strict';

jsPDFAPI.putTotalPages = function(pageExpression) {
	'use strict';
        var replaceExpression = new RegExp(pageExpression, 'g');
        for (var n = 1; n <= this.internal.getNumberOfPages(); n++) {
            for (var i = 0; i < this.internal.pages[n].length; i++)
               this.internal.pages[n][i] = this.internal.pages[n][i].replace(replaceExpression, this.internal.getNumberOfPages());
        }
	return this;
};

})(jsPDF.API);
/* Blob.js
 * A Blob implementation.
 * 2014-07-24
 *
 * By Eli Grey, http://eligrey.com
 * By Devin Samarin, https://github.com/dsamarin
 * License: X11/MIT
 *   See https://github.com/eligrey/Blob.js/blob/master/LICENSE.md
 */

/*global self, unescape */
/*jslint bitwise: true, regexp: true, confusion: true, es5: true, vars: true, white: true,
  plusplus: true */

/*! @source http://purl.eligrey.com/github/Blob.js/blob/master/Blob.js */

(function (view) {
	"use strict";

	view.URL = view.URL || view.webkitURL;

	if (view.Blob && view.URL) {
		try {
			new Blob;
			return;
		} catch (e) {}
	}

	// Internally we use a BlobBuilder implementation to base Blob off of
	// in order to support older browsers that only have BlobBuilder
	var BlobBuilder = view.BlobBuilder || view.WebKitBlobBuilder || view.MozBlobBuilder || (function(view) {
		var
			  get_class = function(object) {
				return Object.prototype.toString.call(object).match(/^\[object\s(.*)\]$/)[1];
			}
			, FakeBlobBuilder = function BlobBuilder() {
				this.data = [];
			}
			, FakeBlob = function Blob(data, type, encoding) {
				this.data = data;
				this.size = data.length;
				this.type = type;
				this.encoding = encoding;
			}
			, FBB_proto = FakeBlobBuilder.prototype
			, FB_proto = FakeBlob.prototype
			, FileReaderSync = view.FileReaderSync
			, FileException = function(type) {
				this.code = this[this.name = type];
			}
			, file_ex_codes = (
				  "NOT_FOUND_ERR SECURITY_ERR ABORT_ERR NOT_READABLE_ERR ENCODING_ERR "
				+ "NO_MODIFICATION_ALLOWED_ERR INVALID_STATE_ERR SYNTAX_ERR"
			).split(" ")
			, file_ex_code = file_ex_codes.length
			, real_URL = view.URL || view.webkitURL || view
			, real_create_object_URL = real_URL.createObjectURL
			, real_revoke_object_URL = real_URL.revokeObjectURL
			, URL = real_URL
			, btoa = view.btoa
			, atob = view.atob

			, ArrayBuffer = view.ArrayBuffer
			, Uint8Array = view.Uint8Array

			, origin = /^[\w-]+:\/*\[?[\w\.:-]+\]?(?::[0-9]+)?/
		;
		FakeBlob.fake = FB_proto.fake = true;
		while (file_ex_code--) {
			FileException.prototype[file_ex_codes[file_ex_code]] = file_ex_code + 1;
		}
		// Polyfill URL
		if (!real_URL.createObjectURL) {
			URL = view.URL = function(uri) {
				var
					  uri_info = document.createElementNS("http://www.w3.org/1999/xhtml", "a")
					, uri_origin
				;
				uri_info.href = uri;
				if (!("origin" in uri_info)) {
					if (uri_info.protocol.toLowerCase() === "data:") {
						uri_info.origin = null;
					} else {
						uri_origin = uri.match(origin);
						uri_info.origin = uri_origin && uri_origin[1];
					}
				}
				return uri_info;
			};
		}
		URL.createObjectURL = function(blob) {
			var
				  type = blob.type
				, data_URI_header
			;
			if (type === null) {
				type = "application/octet-stream";
			}
			if (blob instanceof FakeBlob) {
				data_URI_header = "data:" + type;
				if (blob.encoding === "base64") {
					return data_URI_header + ";base64," + blob.data;
				} else if (blob.encoding === "URI") {
					return data_URI_header + "," + decodeURIComponent(blob.data);
				} if (btoa) {
					return data_URI_header + ";base64," + btoa(blob.data);
				} else {
					return data_URI_header + "," + encodeURIComponent(blob.data);
				}
			} else if (real_create_object_URL) {
				return real_create_object_URL.call(real_URL, blob);
			}
		};
		URL.revokeObjectURL = function(object_URL) {
			if (object_URL.substring(0, 5) !== "data:" && real_revoke_object_URL) {
				real_revoke_object_URL.call(real_URL, object_URL);
			}
		};
		FBB_proto.append = function(data/*, endings*/) {
			var bb = this.data;
			// decode data to a binary string
			if (Uint8Array && (data instanceof ArrayBuffer || data instanceof Uint8Array)) {
				var
					  str = ""
					, buf = new Uint8Array(data)
					, i = 0
					, buf_len = buf.length
				;
				for (; i < buf_len; i++) {
					str += String.fromCharCode(buf[i]);
				}
				bb.push(str);
			} else if (get_class(data) === "Blob" || get_class(data) === "File") {
				if (FileReaderSync) {
					var fr = new FileReaderSync;
					bb.push(fr.readAsBinaryString(data));
				} else {
					// async FileReader won't work as BlobBuilder is sync
					throw new FileException("NOT_READABLE_ERR");
				}
			} else if (data instanceof FakeBlob) {
				if (data.encoding === "base64" && atob) {
					bb.push(atob(data.data));
				} else if (data.encoding === "URI") {
					bb.push(decodeURIComponent(data.data));
				} else if (data.encoding === "raw") {
					bb.push(data.data);
				}
			} else {
				if (typeof data !== "string") {
					data += ""; // convert unsupported types to strings
				}
				// decode UTF-16 to binary string
				bb.push(unescape(encodeURIComponent(data)));
			}
		};
		FBB_proto.getBlob = function(type) {
			if (!arguments.length) {
				type = null;
			}
			return new FakeBlob(this.data.join(""), type, "raw");
		};
		FBB_proto.toString = function() {
			return "[object BlobBuilder]";
		};
		FB_proto.slice = function(start, end, type) {
			var args = arguments.length;
			if (args < 3) {
				type = null;
			}
			return new FakeBlob(
				  this.data.slice(start, args > 1 ? end : this.data.length)
				, type
				, this.encoding
			);
		};
		FB_proto.toString = function() {
			return "[object Blob]";
		};
		FB_proto.close = function() {
			this.size = 0;
			delete this.data;
		};
		return FakeBlobBuilder;
	}(view));

	view.Blob = function(blobParts, options) {
		var type = options ? (options.type || "") : "";
		var builder = new BlobBuilder();
		if (blobParts) {
			for (var i = 0, len = blobParts.length; i < len; i++) {
				builder.append(blobParts[i]);
			}
		}
		return builder.getBlob(type);
	};
}(typeof self !== "undefined" && self || typeof window !== "undefined" && window || this.content || this));
/* FileSaver.js
 * A saveAs() FileSaver implementation.
 * 2014-08-29
 *
 * By Eli Grey, http://eligrey.com
 * License: X11/MIT
 *   See https://github.com/eligrey/FileSaver.js/blob/master/LICENSE.md
 */

/*global self */
/*jslint bitwise: true, indent: 4, laxbreak: true, laxcomma: true, smarttabs: true, plusplus: true */

/*! @source http://purl.eligrey.com/github/FileSaver.js/blob/master/FileSaver.js */

var saveAs = saveAs
  // IE 10+ (native saveAs)
  || (typeof navigator !== "undefined" &&
      navigator.msSaveOrOpenBlob && navigator.msSaveOrOpenBlob.bind(navigator))
  // Everyone else
  || (function(view) {
	"use strict";
	// IE <10 is explicitly unsupported
	if (typeof navigator !== "undefined" &&
	    /MSIE [1-9]\./.test(navigator.userAgent)) {
		return;
	}
	var
		  doc = view.document
		  // only get URL when necessary in case Blob.js hasn't overridden it yet
		, get_URL = function() {
			return view.URL || view.webkitURL || view;
		}
		, save_link = doc.createElementNS("http://www.w3.org/1999/xhtml", "a")
		, can_use_save_link = "download" in save_link
		, click = function(node) {
			var event = doc.createEvent("MouseEvents");
			event.initMouseEvent(
				"click", true, false, view, 0, 0, 0, 0, 0
				, false, false, false, false, 0, null
			);
			node.dispatchEvent(event);
		}
		, webkit_req_fs = view.webkitRequestFileSystem
		, req_fs = view.requestFileSystem || webkit_req_fs || view.mozRequestFileSystem
		, throw_outside = function(ex) {
			(view.setImmediate || view.setTimeout)(function() {
				throw ex;
			}, 0);
		}
		, force_saveable_type = "application/octet-stream"
		, fs_min_size = 0
		// See https://code.google.com/p/chromium/issues/detail?id=375297#c7 for
		// the reasoning behind the timeout and revocation flow
		, arbitrary_revoke_timeout = 10
		, revoke = function(file) {
			var revoker = function() {
				if (typeof file === "string") { // file is an object URL
					get_URL().revokeObjectURL(file);
				} else { // file is a File
					file.remove();
				}
			};
			if (view.chrome) {
				revoker();
			} else {
				setTimeout(revoker, arbitrary_revoke_timeout);
			}
		}
		, dispatch = function(filesaver, event_types, event) {
			event_types = [].concat(event_types);
			var i = event_types.length;
			while (i--) {
				var listener = filesaver["on" + event_types[i]];
				if (typeof listener === "function") {
					try {
						listener.call(filesaver, event || filesaver);
					} catch (ex) {
						throw_outside(ex);
					}
				}
			}
		}
		, FileSaver = function(blob, name) {
			// First try a.download, then web filesystem, then object URLs
			var
				  filesaver = this
				, type = blob.type
				, blob_changed = false
				, object_url
				, target_view
				, dispatch_all = function() {
					dispatch(filesaver, "writestart progress write writeend".split(" "));
				}
				// on any filesys errors revert to saving with object URLs
				, fs_error = function() {
					// don't create more object URLs than needed
					if (blob_changed || !object_url) {
						object_url = get_URL().createObjectURL(blob);
					}
					if (target_view) {
						target_view.location.href = object_url;
					} else {
						var new_tab = view.open(object_url, "_blank");
						if (new_tab == undefined && typeof safari !== "undefined") {
							//Apple do not allow window.open, see http://bit.ly/1kZffRI
							view.location.href = object_url
						}
					}
					filesaver.readyState = filesaver.DONE;
					dispatch_all();
					revoke(object_url);
				}
				, abortable = function(func) {
					return function() {
						if (filesaver.readyState !== filesaver.DONE) {
							return func.apply(this, arguments);
						}
					};
				}
				, create_if_not_found = {create: true, exclusive: false}
				, slice
			;
			filesaver.readyState = filesaver.INIT;
			if (!name) {
				name = "download";
			}
			if (can_use_save_link) {
				object_url = get_URL().createObjectURL(blob);
				save_link.href = object_url;
				save_link.download = name;
				click(save_link);
				filesaver.readyState = filesaver.DONE;
				dispatch_all();
				revoke(object_url);
				return;
			}
			// Object and web filesystem URLs have a problem saving in Google Chrome when
			// viewed in a tab, so I force save with application/octet-stream
			// http://code.google.com/p/chromium/issues/detail?id=91158
			// Update: Google errantly closed 91158, I submitted it again:
			// https://code.google.com/p/chromium/issues/detail?id=389642
			if (view.chrome && type && type !== force_saveable_type) {
				slice = blob.slice || blob.webkitSlice;
				blob = slice.call(blob, 0, blob.size, force_saveable_type);
				blob_changed = true;
			}
			// Since I can't be sure that the guessed media type will trigger a download
			// in WebKit, I append .download to the filename.
			// https://bugs.webkit.org/show_bug.cgi?id=65440
			if (webkit_req_fs && name !== "download") {
				name += ".download";
			}
			if (type === force_saveable_type || webkit_req_fs) {
				target_view = view;
			}
			if (!req_fs) {
				fs_error();
				return;
			}
			fs_min_size += blob.size;
			req_fs(view.TEMPORARY, fs_min_size, abortable(function(fs) {
				fs.root.getDirectory("saved", create_if_not_found, abortable(function(dir) {
					var save = function() {
						dir.getFile(name, create_if_not_found, abortable(function(file) {
							file.createWriter(abortable(function(writer) {
								writer.onwriteend = function(event) {
									target_view.location.href = file.toURL();
									filesaver.readyState = filesaver.DONE;
									dispatch(filesaver, "writeend", event);
									revoke(file);
								};
								writer.onerror = function() {
									var error = writer.error;
									if (error.code !== error.ABORT_ERR) {
										fs_error();
									}
								};
								"writestart progress write abort".split(" ").forEach(function(event) {
									writer["on" + event] = filesaver["on" + event];
								});
								writer.write(blob);
								filesaver.abort = function() {
									writer.abort();
									filesaver.readyState = filesaver.DONE;
								};
								filesaver.readyState = filesaver.WRITING;
							}), fs_error);
						}), fs_error);
					};
					dir.getFile(name, {create: false}, abortable(function(file) {
						// delete file if it already exists
						file.remove();
						save();
					}), abortable(function(ex) {
						if (ex.code === ex.NOT_FOUND_ERR) {
							save();
						} else {
							fs_error();
						}
					}));
				}), fs_error);
			}), fs_error);
		}
		, FS_proto = FileSaver.prototype
		, saveAs = function(blob, name) {
			return new FileSaver(blob, name);
		}
	;
	FS_proto.abort = function() {
		var filesaver = this;
		filesaver.readyState = filesaver.DONE;
		dispatch(filesaver, "abort");
	};
	FS_proto.readyState = FS_proto.INIT = 0;
	FS_proto.WRITING = 1;
	FS_proto.DONE = 2;

	FS_proto.error =
	FS_proto.onwritestart =
	FS_proto.onprogress =
	FS_proto.onwrite =
	FS_proto.onabort =
	FS_proto.onerror =
	FS_proto.onwriteend =
		null;

	return saveAs;
}(
	   typeof self !== "undefined" && self
	|| typeof window !== "undefined" && window
	|| this.content
));
// `self` is undefined in Firefox for Android content script context
// while `this` is nsIContentFrameMessageManager
// with an attribute `content` that corresponds to the window

if (typeof module !== "undefined" && module !== null) {
  module.exports = saveAs;
} else if ((typeof define !== "undefined" && 0)) {
  define([], function() {
    return saveAs;
  });
}
/*
 * Copyright (c) 2012 chick307 <chick307@gmail.com>
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */

void function(global, callback) {
	if (typeof module === 'object') {
		module.exports = callback();
	} else if (0 === 'function') {
		define(callback);
	} else {
		global.adler32cs = callback();
	}
}(jsPDF, function() {
	var _hasArrayBuffer = typeof ArrayBuffer === 'function' &&
		typeof Uint8Array === 'function';

	var _Buffer = null, _isBuffer = (function() {
		if (!_hasArrayBuffer)
			return function _isBuffer() { return false };

		try {
			var buffer = require('buffer');
			if (typeof buffer.Buffer === 'function')
				_Buffer = buffer.Buffer;
		} catch (error) {}

		return function _isBuffer(value) {
			return value instanceof ArrayBuffer ||
				_Buffer !== null && value instanceof _Buffer;
		};
	}());

	var _utf8ToBinary = (function() {
		if (_Buffer !== null) {
			return function _utf8ToBinary(utf8String) {
				return new _Buffer(utf8String, 'utf8').toString('binary');
			};
		} else {
			return function _utf8ToBinary(utf8String) {
				return unescape(encodeURIComponent(utf8String));
			};
		}
	}());

	var MOD = 65521;

	var _update = function _update(checksum, binaryString) {
		var a = checksum & 0xFFFF, b = checksum >>> 16;
		for (var i = 0, length = binaryString.length; i < length; i++) {
			a = (a + (binaryString.charCodeAt(i) & 0xFF)) % MOD;
			b = (b + a) % MOD;
		}
		return (b << 16 | a) >>> 0;
	};

	var _updateUint8Array = function _updateUint8Array(checksum, uint8Array) {
		var a = checksum & 0xFFFF, b = checksum >>> 16;
		for (var i = 0, length = uint8Array.length, x; i < length; i++) {
			a = (a + uint8Array[i]) % MOD;
			b = (b + a) % MOD;
		}
		return (b << 16 | a) >>> 0
	};

	var exports = {};

	var Adler32 = exports.Adler32 = (function() {
		var ctor = function Adler32(checksum) {
			if (!(this instanceof ctor)) {
				throw new TypeError(
					'Constructor cannot called be as a function.');
			}
			if (!isFinite(checksum = checksum == null ? 1 : +checksum)) {
				throw new Error(
					'First arguments needs to be a finite number.');
			}
			this.checksum = checksum >>> 0;
		};

		var proto = ctor.prototype = {};
		proto.constructor = ctor;

		ctor.from = function(from) {
			from.prototype = proto;
			return from;
		}(function from(binaryString) {
			if (!(this instanceof ctor)) {
				throw new TypeError(
					'Constructor cannot called be as a function.');
			}
			if (binaryString == null)
				throw new Error('First argument needs to be a string.');
			this.checksum = _update(1, binaryString.toString());
		});

		ctor.fromUtf8 = function(fromUtf8) {
			fromUtf8.prototype = proto;
			return fromUtf8;
		}(function fromUtf8(utf8String) {
			if (!(this instanceof ctor)) {
				throw new TypeError(
					'Constructor cannot called be as a function.');
			}
			if (utf8String == null)
				throw new Error('First argument needs to be a string.');
			var binaryString = _utf8ToBinary(utf8String.toString());
			this.checksum = _update(1, binaryString);
		});

		if (_hasArrayBuffer) {
			ctor.fromBuffer = function(fromBuffer) {
				fromBuffer.prototype = proto;
				return fromBuffer;
			}(function fromBuffer(buffer) {
				if (!(this instanceof ctor)) {
					throw new TypeError(
						'Constructor cannot called be as a function.');
				}
				if (!_isBuffer(buffer))
					throw new Error('First argument needs to be ArrayBuffer.');
				var array = new Uint8Array(buffer);
				return this.checksum = _updateUint8Array(1, array);
			});
		}

		proto.update = function update(binaryString) {
			if (binaryString == null)
				throw new Error('First argument needs to be a string.');
			binaryString = binaryString.toString();
			return this.checksum = _update(this.checksum, binaryString);
		};

		proto.updateUtf8 = function updateUtf8(utf8String) {
			if (utf8String == null)
				throw new Error('First argument needs to be a string.');
			var binaryString = _utf8ToBinary(utf8String.toString());
			return this.checksum = _update(this.checksum, binaryString);
		};

		if (_hasArrayBuffer) {
			proto.updateBuffer = function updateBuffer(buffer) {
				if (!_isBuffer(buffer))
					throw new Error('First argument needs to be ArrayBuffer.');
				var array = new Uint8Array(buffer);
				return this.checksum = _updateUint8Array(this.checksum, array);
			};
		}

		proto.clone = function clone() {
			return new Adler32(this.checksum);
		};

		return ctor;
	}());

	exports.from = function from(binaryString) {
		if (binaryString == null)
			throw new Error('First argument needs to be a string.');
		return _update(1, binaryString.toString());
	};

	exports.fromUtf8 = function fromUtf8(utf8String) {
		if (utf8String == null)
			throw new Error('First argument needs to be a string.');
		var binaryString = _utf8ToBinary(utf8String.toString());
		return _update(1, binaryString);
	};

	if (_hasArrayBuffer) {
		exports.fromBuffer = function fromBuffer(buffer) {
			if (!_isBuffer(buffer))
				throw new Error('First argument need to be ArrayBuffer.');
			var array = new Uint8Array(buffer);
			return _updateUint8Array(1, array);
		};
	}

	return exports;
});
/*
 Deflate.js - https://github.com/gildas-lormeau/zip.js
 Copyright (c) 2013 Gildas Lormeau. All rights reserved.

 Redistribution and use in source and binary forms, with or without
 modification, are permitted provided that the following conditions are met:

 1. Redistributions of source code must retain the above copyright notice,
 this list of conditions and the following disclaimer.

 2. Redistributions in binary form must reproduce the above copyright 
 notice, this list of conditions and the following disclaimer in 
 the documentation and/or other materials provided with the distribution.

 3. The names of the authors may not be used to endorse or promote products
 derived from this software without specific prior written permission.

 THIS SOFTWARE IS PROVIDED ``AS IS'' AND ANY EXPRESSED OR IMPLIED WARRANTIES,
 INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
 FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL JCRAFT,
 INC. OR ANY CONTRIBUTORS TO THIS SOFTWARE BE LIABLE FOR ANY DIRECT, INDIRECT,
 INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA,
 OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
 LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
 EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

/*
 * This program is based on JZlib 1.0.2 ymnk, JCraft,Inc.
 * JZlib is based on zlib-1.1.3, so all credit should go authors
 * Jean-loup Gailly(jloup@gzip.org) and Mark Adler(madler@alumni.caltech.edu)
 * and contributors of zlib.
 */

var Deflater = (function(obj) {

	// Global

	var MAX_BITS = 15;
	var D_CODES = 30;
	var BL_CODES = 19;

	var LENGTH_CODES = 29;
	var LITERALS = 256;
	var L_CODES = (LITERALS + 1 + LENGTH_CODES);
	var HEAP_SIZE = (2 * L_CODES + 1);

	var END_BLOCK = 256;

	// Bit length codes must not exceed MAX_BL_BITS bits
	var MAX_BL_BITS = 7;

	// repeat previous bit length 3-6 times (2 bits of repeat count)
	var REP_3_6 = 16;

	// repeat a zero length 3-10 times (3 bits of repeat count)
	var REPZ_3_10 = 17;

	// repeat a zero length 11-138 times (7 bits of repeat count)
	var REPZ_11_138 = 18;

	// The lengths of the bit length codes are sent in order of decreasing
	// probability, to avoid transmitting the lengths for unused bit
	// length codes.

	var Buf_size = 8 * 2;

	// JZlib version : "1.0.2"
	var Z_DEFAULT_COMPRESSION = -1;

	// compression strategy
	var Z_FILTERED = 1;
	var Z_HUFFMAN_ONLY = 2;
	var Z_DEFAULT_STRATEGY = 0;

	var Z_NO_FLUSH = 0;
	var Z_PARTIAL_FLUSH = 1;
	var Z_FULL_FLUSH = 3;
	var Z_FINISH = 4;

	var Z_OK = 0;
	var Z_STREAM_END = 1;
	var Z_NEED_DICT = 2;
	var Z_STREAM_ERROR = -2;
	var Z_DATA_ERROR = -3;
	var Z_BUF_ERROR = -5;

	// Tree

	// see definition of array dist_code below
	var _dist_code = [ 0, 1, 2, 3, 4, 4, 5, 5, 6, 6, 6, 6, 7, 7, 7, 7, 8, 8, 8, 8, 8, 8, 8, 8, 9, 9, 9, 9, 9, 9, 9, 9, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10,
			10, 10, 10, 10, 10, 10, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12,
			12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13,
			13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14,
			14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14,
			14, 14, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
			15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 0, 0, 16, 17, 18, 18, 19, 19,
			20, 20, 20, 20, 21, 21, 21, 21, 22, 22, 22, 22, 22, 22, 22, 22, 23, 23, 23, 23, 23, 23, 23, 23, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
			24, 24, 24, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26,
			26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27,
			27, 27, 27, 27, 27, 27, 27, 27, 27, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28,
			28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 29,
			29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29,
			29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29 ];

	function Tree() {
		var that = this;

		// dyn_tree; // the dynamic tree
		// max_code; // largest code with non zero frequency
		// stat_desc; // the corresponding static tree

		// Compute the optimal bit lengths for a tree and update the total bit
		// length
		// for the current block.
		// IN assertion: the fields freq and dad are set, heap[heap_max] and
		// above are the tree nodes sorted by increasing frequency.
		// OUT assertions: the field len is set to the optimal bit length, the
		// array bl_count contains the frequencies for each bit length.
		// The length opt_len is updated; static_len is also updated if stree is
		// not null.
		function gen_bitlen(s) {
			var tree = that.dyn_tree;
			var stree = that.stat_desc.static_tree;
			var extra = that.stat_desc.extra_bits;
			var base = that.stat_desc.extra_base;
			var max_length = that.stat_desc.max_length;
			var h; // heap index
			var n, m; // iterate over the tree elements
			var bits; // bit length
			var xbits; // extra bits
			var f; // frequency
			var overflow = 0; // number of elements with bit length too large

			for (bits = 0; bits <= MAX_BITS; bits++)
				s.bl_count[bits] = 0;

			// In a first pass, compute the optimal bit lengths (which may
			// overflow in the case of the bit length tree).
			tree[s.heap[s.heap_max] * 2 + 1] = 0; // root of the heap

			for (h = s.heap_max + 1; h < HEAP_SIZE; h++) {
				n = s.heap[h];
				bits = tree[tree[n * 2 + 1] * 2 + 1] + 1;
				if (bits > max_length) {
					bits = max_length;
					overflow++;
				}
				tree[n * 2 + 1] = bits;
				// We overwrite tree[n*2+1] which is no longer needed

				if (n > that.max_code)
					continue; // not a leaf node

				s.bl_count[bits]++;
				xbits = 0;
				if (n >= base)
					xbits = extra[n - base];
				f = tree[n * 2];
				s.opt_len += f * (bits + xbits);
				if (stree)
					s.static_len += f * (stree[n * 2 + 1] + xbits);
			}
			if (overflow === 0)
				return;

			// This happens for example on obj2 and pic of the Calgary corpus
			// Find the first bit length which could increase:
			do {
				bits = max_length - 1;
				while (s.bl_count[bits] === 0)
					bits--;
				s.bl_count[bits]--; // move one leaf down the tree
				s.bl_count[bits + 1] += 2; // move one overflow item as its brother
				s.bl_count[max_length]--;
				// The brother of the overflow item also moves one step up,
				// but this does not affect bl_count[max_length]
				overflow -= 2;
			} while (overflow > 0);

			for (bits = max_length; bits !== 0; bits--) {
				n = s.bl_count[bits];
				while (n !== 0) {
					m = s.heap[--h];
					if (m > that.max_code)
						continue;
					if (tree[m * 2 + 1] != bits) {
						s.opt_len += (bits - tree[m * 2 + 1]) * tree[m * 2];
						tree[m * 2 + 1] = bits;
					}
					n--;
				}
			}
		}

		// Reverse the first len bits of a code, using straightforward code (a
		// faster
		// method would use a table)
		// IN assertion: 1 <= len <= 15
		function bi_reverse(code, // the value to invert
		len // its bit length
		) {
			var res = 0;
			do {
				res |= code & 1;
				code >>>= 1;
				res <<= 1;
			} while (--len > 0);
			return res >>> 1;
		}

		// Generate the codes for a given tree and bit counts (which need not be
		// optimal).
		// IN assertion: the array bl_count contains the bit length statistics for
		// the given tree and the field len is set for all tree elements.
		// OUT assertion: the field code is set for all tree elements of non
		// zero code length.
		function gen_codes(tree, // the tree to decorate
		max_code, // largest code with non zero frequency
		bl_count // number of codes at each bit length
		) {
			var next_code = []; // next code value for each
			// bit length
			var code = 0; // running code value
			var bits; // bit index
			var n; // code index
			var len;

			// The distribution counts are first used to generate the code values
			// without bit reversal.
			for (bits = 1; bits <= MAX_BITS; bits++) {
				next_code[bits] = code = ((code + bl_count[bits - 1]) << 1);
			}

			// Check that the bit counts in bl_count are consistent. The last code
			// must be all ones.
			// Assert (code + bl_count[MAX_BITS]-1 == (1<<MAX_BITS)-1,
			// "inconsistent bit counts");
			// Tracev((stderr,"\ngen_codes: max_code %d ", max_code));

			for (n = 0; n <= max_code; n++) {
				len = tree[n * 2 + 1];
				if (len === 0)
					continue;
				// Now reverse the bits
				tree[n * 2] = bi_reverse(next_code[len]++, len);
			}
		}

		// Construct one Huffman tree and assigns the code bit strings and lengths.
		// Update the total bit length for the current block.
		// IN assertion: the field freq is set for all tree elements.
		// OUT assertions: the fields len and code are set to the optimal bit length
		// and corresponding code. The length opt_len is updated; static_len is
		// also updated if stree is not null. The field max_code is set.
		that.build_tree = function(s) {
			var tree = that.dyn_tree;
			var stree = that.stat_desc.static_tree;
			var elems = that.stat_desc.elems;
			var n, m; // iterate over heap elements
			var max_code = -1; // largest code with non zero frequency
			var node; // new node being created

			// Construct the initial heap, with least frequent element in
			// heap[1]. The sons of heap[n] are heap[2*n] and heap[2*n+1].
			// heap[0] is not used.
			s.heap_len = 0;
			s.heap_max = HEAP_SIZE;

			for (n = 0; n < elems; n++) {
				if (tree[n * 2] !== 0) {
					s.heap[++s.heap_len] = max_code = n;
					s.depth[n] = 0;
				} else {
					tree[n * 2 + 1] = 0;
				}
			}

			// The pkzip format requires that at least one distance code exists,
			// and that at least one bit should be sent even if there is only one
			// possible code. So to avoid special checks later on we force at least
			// two codes of non zero frequency.
			while (s.heap_len < 2) {
				node = s.heap[++s.heap_len] = max_code < 2 ? ++max_code : 0;
				tree[node * 2] = 1;
				s.depth[node] = 0;
				s.opt_len--;
				if (stree)
					s.static_len -= stree[node * 2 + 1];
				// node is 0 or 1 so it does not have extra bits
			}
			that.max_code = max_code;

			// The elements heap[heap_len/2+1 .. heap_len] are leaves of the tree,
			// establish sub-heaps of increasing lengths:

			for (n = Math.floor(s.heap_len / 2); n >= 1; n--)
				s.pqdownheap(tree, n);

			// Construct the Huffman tree by repeatedly combining the least two
			// frequent nodes.

			node = elems; // next internal node of the tree
			do {
				// n = node of least frequency
				n = s.heap[1];
				s.heap[1] = s.heap[s.heap_len--];
				s.pqdownheap(tree, 1);
				m = s.heap[1]; // m = node of next least frequency

				s.heap[--s.heap_max] = n; // keep the nodes sorted by frequency
				s.heap[--s.heap_max] = m;

				// Create a new node father of n and m
				tree[node * 2] = (tree[n * 2] + tree[m * 2]);
				s.depth[node] = Math.max(s.depth[n], s.depth[m]) + 1;
				tree[n * 2 + 1] = tree[m * 2 + 1] = node;

				// and insert the new node in the heap
				s.heap[1] = node++;
				s.pqdownheap(tree, 1);
			} while (s.heap_len >= 2);

			s.heap[--s.heap_max] = s.heap[1];

			// At this point, the fields freq and dad are set. We can now
			// generate the bit lengths.

			gen_bitlen(s);

			// The field len is now set, we can generate the bit codes
			gen_codes(tree, that.max_code, s.bl_count);
		};

	}

	Tree._length_code = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 12, 12, 13, 13, 13, 13, 14, 14, 14, 14, 15, 15, 15, 15, 16, 16, 16, 16,
			16, 16, 16, 16, 17, 17, 17, 17, 17, 17, 17, 17, 18, 18, 18, 18, 18, 18, 18, 18, 19, 19, 19, 19, 19, 19, 19, 19, 20, 20, 20, 20, 20, 20, 20, 20, 20,
			20, 20, 20, 20, 20, 20, 20, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22,
			22, 22, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
			24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25,
			25, 25, 25, 25, 25, 25, 25, 25, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26,
			26, 26, 26, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 28 ];

	Tree.base_length = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 14, 16, 20, 24, 28, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 0 ];

	Tree.base_dist = [ 0, 1, 2, 3, 4, 6, 8, 12, 16, 24, 32, 48, 64, 96, 128, 192, 256, 384, 512, 768, 1024, 1536, 2048, 3072, 4096, 6144, 8192, 12288, 16384,
			24576 ];

	// Mapping from a distance to a distance code. dist is the distance - 1 and
	// must not have side effects. _dist_code[256] and _dist_code[257] are never
	// used.
	Tree.d_code = function(dist) {
		return ((dist) < 256 ? _dist_code[dist] : _dist_code[256 + ((dist) >>> 7)]);
	};

	// extra bits for each length code
	Tree.extra_lbits = [ 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0 ];

	// extra bits for each distance code
	Tree.extra_dbits = [ 0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13 ];

	// extra bits for each bit length code
	Tree.extra_blbits = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7 ];

	Tree.bl_order = [ 16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15 ];

	// StaticTree

	function StaticTree(static_tree, extra_bits, extra_base, elems, max_length) {
		var that = this;
		that.static_tree = static_tree;
		that.extra_bits = extra_bits;
		that.extra_base = extra_base;
		that.elems = elems;
		that.max_length = max_length;
	}

	StaticTree.static_ltree = [ 12, 8, 140, 8, 76, 8, 204, 8, 44, 8, 172, 8, 108, 8, 236, 8, 28, 8, 156, 8, 92, 8, 220, 8, 60, 8, 188, 8, 124, 8, 252, 8, 2, 8,
			130, 8, 66, 8, 194, 8, 34, 8, 162, 8, 98, 8, 226, 8, 18, 8, 146, 8, 82, 8, 210, 8, 50, 8, 178, 8, 114, 8, 242, 8, 10, 8, 138, 8, 74, 8, 202, 8, 42,
			8, 170, 8, 106, 8, 234, 8, 26, 8, 154, 8, 90, 8, 218, 8, 58, 8, 186, 8, 122, 8, 250, 8, 6, 8, 134, 8, 70, 8, 198, 8, 38, 8, 166, 8, 102, 8, 230, 8,
			22, 8, 150, 8, 86, 8, 214, 8, 54, 8, 182, 8, 118, 8, 246, 8, 14, 8, 142, 8, 78, 8, 206, 8, 46, 8, 174, 8, 110, 8, 238, 8, 30, 8, 158, 8, 94, 8,
			222, 8, 62, 8, 190, 8, 126, 8, 254, 8, 1, 8, 129, 8, 65, 8, 193, 8, 33, 8, 161, 8, 97, 8, 225, 8, 17, 8, 145, 8, 81, 8, 209, 8, 49, 8, 177, 8, 113,
			8, 241, 8, 9, 8, 137, 8, 73, 8, 201, 8, 41, 8, 169, 8, 105, 8, 233, 8, 25, 8, 153, 8, 89, 8, 217, 8, 57, 8, 185, 8, 121, 8, 249, 8, 5, 8, 133, 8,
			69, 8, 197, 8, 37, 8, 165, 8, 101, 8, 229, 8, 21, 8, 149, 8, 85, 8, 213, 8, 53, 8, 181, 8, 117, 8, 245, 8, 13, 8, 141, 8, 77, 8, 205, 8, 45, 8,
			173, 8, 109, 8, 237, 8, 29, 8, 157, 8, 93, 8, 221, 8, 61, 8, 189, 8, 125, 8, 253, 8, 19, 9, 275, 9, 147, 9, 403, 9, 83, 9, 339, 9, 211, 9, 467, 9,
			51, 9, 307, 9, 179, 9, 435, 9, 115, 9, 371, 9, 243, 9, 499, 9, 11, 9, 267, 9, 139, 9, 395, 9, 75, 9, 331, 9, 203, 9, 459, 9, 43, 9, 299, 9, 171, 9,
			427, 9, 107, 9, 363, 9, 235, 9, 491, 9, 27, 9, 283, 9, 155, 9, 411, 9, 91, 9, 347, 9, 219, 9, 475, 9, 59, 9, 315, 9, 187, 9, 443, 9, 123, 9, 379,
			9, 251, 9, 507, 9, 7, 9, 263, 9, 135, 9, 391, 9, 71, 9, 327, 9, 199, 9, 455, 9, 39, 9, 295, 9, 167, 9, 423, 9, 103, 9, 359, 9, 231, 9, 487, 9, 23,
			9, 279, 9, 151, 9, 407, 9, 87, 9, 343, 9, 215, 9, 471, 9, 55, 9, 311, 9, 183, 9, 439, 9, 119, 9, 375, 9, 247, 9, 503, 9, 15, 9, 271, 9, 143, 9,
			399, 9, 79, 9, 335, 9, 207, 9, 463, 9, 47, 9, 303, 9, 175, 9, 431, 9, 111, 9, 367, 9, 239, 9, 495, 9, 31, 9, 287, 9, 159, 9, 415, 9, 95, 9, 351, 9,
			223, 9, 479, 9, 63, 9, 319, 9, 191, 9, 447, 9, 127, 9, 383, 9, 255, 9, 511, 9, 0, 7, 64, 7, 32, 7, 96, 7, 16, 7, 80, 7, 48, 7, 112, 7, 8, 7, 72, 7,
			40, 7, 104, 7, 24, 7, 88, 7, 56, 7, 120, 7, 4, 7, 68, 7, 36, 7, 100, 7, 20, 7, 84, 7, 52, 7, 116, 7, 3, 8, 131, 8, 67, 8, 195, 8, 35, 8, 163, 8,
			99, 8, 227, 8 ];

	StaticTree.static_dtree = [ 0, 5, 16, 5, 8, 5, 24, 5, 4, 5, 20, 5, 12, 5, 28, 5, 2, 5, 18, 5, 10, 5, 26, 5, 6, 5, 22, 5, 14, 5, 30, 5, 1, 5, 17, 5, 9, 5,
			25, 5, 5, 5, 21, 5, 13, 5, 29, 5, 3, 5, 19, 5, 11, 5, 27, 5, 7, 5, 23, 5 ];

	StaticTree.static_l_desc = new StaticTree(StaticTree.static_ltree, Tree.extra_lbits, LITERALS + 1, L_CODES, MAX_BITS);

	StaticTree.static_d_desc = new StaticTree(StaticTree.static_dtree, Tree.extra_dbits, 0, D_CODES, MAX_BITS);

	StaticTree.static_bl_desc = new StaticTree(null, Tree.extra_blbits, 0, BL_CODES, MAX_BL_BITS);

	// Deflate

	var MAX_MEM_LEVEL = 9;
	var DEF_MEM_LEVEL = 8;

	function Config(good_length, max_lazy, nice_length, max_chain, func) {
		var that = this;
		that.good_length = good_length;
		that.max_lazy = max_lazy;
		that.nice_length = nice_length;
		that.max_chain = max_chain;
		that.func = func;
	}

	var STORED = 0;
	var FAST = 1;
	var SLOW = 2;
	var config_table = [ new Config(0, 0, 0, 0, STORED), new Config(4, 4, 8, 4, FAST), new Config(4, 5, 16, 8, FAST), new Config(4, 6, 32, 32, FAST),
			new Config(4, 4, 16, 16, SLOW), new Config(8, 16, 32, 32, SLOW), new Config(8, 16, 128, 128, SLOW), new Config(8, 32, 128, 256, SLOW),
			new Config(32, 128, 258, 1024, SLOW), new Config(32, 258, 258, 4096, SLOW) ];

	var z_errmsg = [ "need dictionary", // Z_NEED_DICT
	// 2
	"stream end", // Z_STREAM_END 1
	"", // Z_OK 0
	"", // Z_ERRNO (-1)
	"stream error", // Z_STREAM_ERROR (-2)
	"data error", // Z_DATA_ERROR (-3)
	"", // Z_MEM_ERROR (-4)
	"buffer error", // Z_BUF_ERROR (-5)
	"",// Z_VERSION_ERROR (-6)
	"" ];

	// block not completed, need more input or more output
	var NeedMore = 0;

	// block flush performed
	var BlockDone = 1;

	// finish started, need only more output at next deflate
	var FinishStarted = 2;

	// finish done, accept no more input or output
	var FinishDone = 3;

	// preset dictionary flag in zlib header
	var PRESET_DICT = 0x20;

	var INIT_STATE = 42;
	var BUSY_STATE = 113;
	var FINISH_STATE = 666;

	// The deflate compression method
	var Z_DEFLATED = 8;

	var STORED_BLOCK = 0;
	var STATIC_TREES = 1;
	var DYN_TREES = 2;

	var MIN_MATCH = 3;
	var MAX_MATCH = 258;
	var MIN_LOOKAHEAD = (MAX_MATCH + MIN_MATCH + 1);

	function smaller(tree, n, m, depth) {
		var tn2 = tree[n * 2];
		var tm2 = tree[m * 2];
		return (tn2 < tm2 || (tn2 == tm2 && depth[n] <= depth[m]));
	}

	function Deflate() {

		var that = this;
		var strm; // pointer back to this zlib stream
		var status; // as the name implies
		// pending_buf; // output still pending
		var pending_buf_size; // size of pending_buf
		// pending_out; // next pending byte to output to the stream
		// pending; // nb of bytes in the pending buffer
		var method; // STORED (for zip only) or DEFLATED
		var last_flush; // value of flush param for previous deflate call

		var w_size; // LZ77 window size (32K by default)
		var w_bits; // log2(w_size) (8..16)
		var w_mask; // w_size - 1

		var window;
		// Sliding window. Input bytes are read into the second half of the window,
		// and move to the first half later to keep a dictionary of at least wSize
		// bytes. With this organization, matches are limited to a distance of
		// wSize-MAX_MATCH bytes, but this ensures that IO is always
		// performed with a length multiple of the block size. Also, it limits
		// the window size to 64K, which is quite useful on MSDOS.
		// To do: use the user input buffer as sliding window.

		var window_size;
		// Actual size of window: 2*wSize, except when the user input buffer
		// is directly used as sliding window.

		var prev;
		// Link to older string with same hash index. To limit the size of this
		// array to 64K, this link is maintained only for the last 32K strings.
		// An index in this array is thus a window index modulo 32K.

		var head; // Heads of the hash chains or NIL.

		var ins_h; // hash index of string to be inserted
		var hash_size; // number of elements in hash table
		var hash_bits; // log2(hash_size)
		var hash_mask; // hash_size-1

		// Number of bits by which ins_h must be shifted at each input
		// step. It must be such that after MIN_MATCH steps, the oldest
		// byte no longer takes part in the hash key, that is:
		// hash_shift * MIN_MATCH >= hash_bits
		var hash_shift;

		// Window position at the beginning of the current output block. Gets
		// negative when the window is moved backwards.

		var block_start;

		var match_length; // length of best match
		var prev_match; // previous match
		var match_available; // set if previous match exists
		var strstart; // start of string to insert
		var match_start; // start of matching string
		var lookahead; // number of valid bytes ahead in window

		// Length of the best match at previous step. Matches not greater than this
		// are discarded. This is used in the lazy match evaluation.
		var prev_length;

		// To speed up deflation, hash chains are never searched beyond this
		// length. A higher limit improves compression ratio but degrades the speed.
		var max_chain_length;

		// Attempt to find a better match only when the current match is strictly
		// smaller than this value. This mechanism is used only for compression
		// levels >= 4.
		var max_lazy_match;

		// Insert new strings in the hash table only if the match length is not
		// greater than this length. This saves time but degrades compression.
		// max_insert_length is used only for compression levels <= 3.

		var level; // compression level (1..9)
		var strategy; // favor or force Huffman coding

		// Use a faster search when the previous match is longer than this
		var good_match;

		// Stop searching when current match exceeds this
		var nice_match;

		var dyn_ltree; // literal and length tree
		var dyn_dtree; // distance tree
		var bl_tree; // Huffman tree for bit lengths

		var l_desc = new Tree(); // desc for literal tree
		var d_desc = new Tree(); // desc for distance tree
		var bl_desc = new Tree(); // desc for bit length tree

		// that.heap_len; // number of elements in the heap
		// that.heap_max; // element of largest frequency
		// The sons of heap[n] are heap[2*n] and heap[2*n+1]. heap[0] is not used.
		// The same heap array is used to build all trees.

		// Depth of each subtree used as tie breaker for trees of equal frequency
		that.depth = [];

		var l_buf; // index for literals or lengths */

		// Size of match buffer for literals/lengths. There are 4 reasons for
		// limiting lit_bufsize to 64K:
		// - frequencies can be kept in 16 bit counters
		// - if compression is not successful for the first block, all input
		// data is still in the window so we can still emit a stored block even
		// when input comes from standard input. (This can also be done for
		// all blocks if lit_bufsize is not greater than 32K.)
		// - if compression is not successful for a file smaller than 64K, we can
		// even emit a stored file instead of a stored block (saving 5 bytes).
		// This is applicable only for zip (not gzip or zlib).
		// - creating new Huffman trees less frequently may not provide fast
		// adaptation to changes in the input data statistics. (Take for
		// example a binary file with poorly compressible code followed by
		// a highly compressible string table.) Smaller buffer sizes give
		// fast adaptation but have of course the overhead of transmitting
		// trees more frequently.
		// - I can't count above 4
		var lit_bufsize;

		var last_lit; // running index in l_buf

		// Buffer for distances. To simplify the code, d_buf and l_buf have
		// the same number of elements. To use different lengths, an extra flag
		// array would be necessary.

		var d_buf; // index of pendig_buf

		// that.opt_len; // bit length of current block with optimal trees
		// that.static_len; // bit length of current block with static trees
		var matches; // number of string matches in current block
		var last_eob_len; // bit length of EOB code for last block

		// Output buffer. bits are inserted starting at the bottom (least
		// significant bits).
		var bi_buf;

		// Number of valid bits in bi_buf. All bits above the last valid bit
		// are always zero.
		var bi_valid;

		// number of codes at each bit length for an optimal tree
		that.bl_count = [];

		// heap used to build the Huffman trees
		that.heap = [];

		dyn_ltree = [];
		dyn_dtree = [];
		bl_tree = [];

		function lm_init() {
			var i;
			window_size = 2 * w_size;

			head[hash_size - 1] = 0;
			for (i = 0; i < hash_size - 1; i++) {
				head[i] = 0;
			}

			// Set the default configuration parameters:
			max_lazy_match = config_table[level].max_lazy;
			good_match = config_table[level].good_length;
			nice_match = config_table[level].nice_length;
			max_chain_length = config_table[level].max_chain;

			strstart = 0;
			block_start = 0;
			lookahead = 0;
			match_length = prev_length = MIN_MATCH - 1;
			match_available = 0;
			ins_h = 0;
		}

		function init_block() {
			var i;
			// Initialize the trees.
			for (i = 0; i < L_CODES; i++)
				dyn_ltree[i * 2] = 0;
			for (i = 0; i < D_CODES; i++)
				dyn_dtree[i * 2] = 0;
			for (i = 0; i < BL_CODES; i++)
				bl_tree[i * 2] = 0;

			dyn_ltree[END_BLOCK * 2] = 1;
			that.opt_len = that.static_len = 0;
			last_lit = matches = 0;
		}

		// Initialize the tree data structures for a new zlib stream.
		function tr_init() {

			l_desc.dyn_tree = dyn_ltree;
			l_desc.stat_desc = StaticTree.static_l_desc;

			d_desc.dyn_tree = dyn_dtree;
			d_desc.stat_desc = StaticTree.static_d_desc;

			bl_desc.dyn_tree = bl_tree;
			bl_desc.stat_desc = StaticTree.static_bl_desc;

			bi_buf = 0;
			bi_valid = 0;
			last_eob_len = 8; // enough lookahead for inflate

			// Initialize the first block of the first file:
			init_block();
		}

		// Restore the heap property by moving down the tree starting at node k,
		// exchanging a node with the smallest of its two sons if necessary,
		// stopping
		// when the heap property is re-established (each father smaller than its
		// two sons).
		that.pqdownheap = function(tree, // the tree to restore
		k // node to move down
		) {
			var heap = that.heap;
			var v = heap[k];
			var j = k << 1; // left son of k
			while (j <= that.heap_len) {
				// Set j to the smallest of the two sons:
				if (j < that.heap_len && smaller(tree, heap[j + 1], heap[j], that.depth)) {
					j++;
				}
				// Exit if v is smaller than both sons
				if (smaller(tree, v, heap[j], that.depth))
					break;

				// Exchange v with the smallest son
				heap[k] = heap[j];
				k = j;
				// And continue down the tree, setting j to the left son of k
				j <<= 1;
			}
			heap[k] = v;
		};

		// Scan a literal or distance tree to determine the frequencies of the codes
		// in the bit length tree.
		function scan_tree(tree,// the tree to be scanned
		max_code // and its largest code of non zero frequency
		) {
			var n; // iterates over all tree elements
			var prevlen = -1; // last emitted length
			var curlen; // length of current code
			var nextlen = tree[0 * 2 + 1]; // length of next code
			var count = 0; // repeat count of the current code
			var max_count = 7; // max repeat count
			var min_count = 4; // min repeat count

			if (nextlen === 0) {
				max_count = 138;
				min_count = 3;
			}
			tree[(max_code + 1) * 2 + 1] = 0xffff; // guard

			for (n = 0; n <= max_code; n++) {
				curlen = nextlen;
				nextlen = tree[(n + 1) * 2 + 1];
				if (++count < max_count && curlen == nextlen) {
					continue;
				} else if (count < min_count) {
					bl_tree[curlen * 2] += count;
				} else if (curlen !== 0) {
					if (curlen != prevlen)
						bl_tree[curlen * 2]++;
					bl_tree[REP_3_6 * 2]++;
				} else if (count <= 10) {
					bl_tree[REPZ_3_10 * 2]++;
				} else {
					bl_tree[REPZ_11_138 * 2]++;
				}
				count = 0;
				prevlen = curlen;
				if (nextlen === 0) {
					max_count = 138;
					min_count = 3;
				} else if (curlen == nextlen) {
					max_count = 6;
					min_count = 3;
				} else {
					max_count = 7;
					min_count = 4;
				}
			}
		}

		// Construct the Huffman tree for the bit lengths and return the index in
		// bl_order of the last bit length code to send.
		function build_bl_tree() {
			var max_blindex; // index of last bit length code of non zero freq

			// Determine the bit length frequencies for literal and distance trees
			scan_tree(dyn_ltree, l_desc.max_code);
			scan_tree(dyn_dtree, d_desc.max_code);

			// Build the bit length tree:
			bl_desc.build_tree(that);
			// opt_len now includes the length of the tree representations, except
			// the lengths of the bit lengths codes and the 5+5+4 bits for the
			// counts.

			// Determine the number of bit length codes to send. The pkzip format
			// requires that at least 4 bit length codes be sent. (appnote.txt says
			// 3 but the actual value used is 4.)
			for (max_blindex = BL_CODES - 1; max_blindex >= 3; max_blindex--) {
				if (bl_tree[Tree.bl_order[max_blindex] * 2 + 1] !== 0)
					break;
			}
			// Update opt_len to include the bit length tree and counts
			that.opt_len += 3 * (max_blindex + 1) + 5 + 5 + 4;

			return max_blindex;
		}

		// Output a byte on the stream.
		// IN assertion: there is enough room in pending_buf.
		function put_byte(p) {
			that.pending_buf[that.pending++] = p;
		}

		function put_short(w) {
			put_byte(w & 0xff);
			put_byte((w >>> 8) & 0xff);
		}

		function putShortMSB(b) {
			put_byte((b >> 8) & 0xff);
			put_byte((b & 0xff) & 0xff);
		}

		function send_bits(value, length) {
			var val, len = length;
			if (bi_valid > Buf_size - len) {
				val = value;
				// bi_buf |= (val << bi_valid);
				bi_buf |= ((val << bi_valid) & 0xffff);
				put_short(bi_buf);
				bi_buf = val >>> (Buf_size - bi_valid);
				bi_valid += len - Buf_size;
			} else {
				// bi_buf |= (value) << bi_valid;
				bi_buf |= (((value) << bi_valid) & 0xffff);
				bi_valid += len;
			}
		}

		function send_code(c, tree) {
			var c2 = c * 2;
			send_bits(tree[c2] & 0xffff, tree[c2 + 1] & 0xffff);
		}

		// Send a literal or distance tree in compressed form, using the codes in
		// bl_tree.
		function send_tree(tree,// the tree to be sent
		max_code // and its largest code of non zero frequency
		) {
			var n; // iterates over all tree elements
			var prevlen = -1; // last emitted length
			var curlen; // length of current code
			var nextlen = tree[0 * 2 + 1]; // length of next code
			var count = 0; // repeat count of the current code
			var max_count = 7; // max repeat count
			var min_count = 4; // min repeat count

			if (nextlen === 0) {
				max_count = 138;
				min_count = 3;
			}

			for (n = 0; n <= max_code; n++) {
				curlen = nextlen;
				nextlen = tree[(n + 1) * 2 + 1];
				if (++count < max_count && curlen == nextlen) {
					continue;
				} else if (count < min_count) {
					do {
						send_code(curlen, bl_tree);
					} while (--count !== 0);
				} else if (curlen !== 0) {
					if (curlen != prevlen) {
						send_code(curlen, bl_tree);
						count--;
					}
					send_code(REP_3_6, bl_tree);
					send_bits(count - 3, 2);
				} else if (count <= 10) {
					send_code(REPZ_3_10, bl_tree);
					send_bits(count - 3, 3);
				} else {
					send_code(REPZ_11_138, bl_tree);
					send_bits(count - 11, 7);
				}
				count = 0;
				prevlen = curlen;
				if (nextlen === 0) {
					max_count = 138;
					min_count = 3;
				} else if (curlen == nextlen) {
					max_count = 6;
					min_count = 3;
				} else {
					max_count = 7;
					min_count = 4;
				}
			}
		}

		// Send the header for a block using dynamic Huffman trees: the counts, the
		// lengths of the bit length codes, the literal tree and the distance tree.
		// IN assertion: lcodes >= 257, dcodes >= 1, blcodes >= 4.
		function send_all_trees(lcodes, dcodes, blcodes) {
			var rank; // index in bl_order

			send_bits(lcodes - 257, 5); // not +255 as stated in appnote.txt
			send_bits(dcodes - 1, 5);
			send_bits(blcodes - 4, 4); // not -3 as stated in appnote.txt
			for (rank = 0; rank < blcodes; rank++) {
				send_bits(bl_tree[Tree.bl_order[rank] * 2 + 1], 3);
			}
			send_tree(dyn_ltree, lcodes - 1); // literal tree
			send_tree(dyn_dtree, dcodes - 1); // distance tree
		}

		// Flush the bit buffer, keeping at most 7 bits in it.
		function bi_flush() {
			if (bi_valid == 16) {
				put_short(bi_buf);
				bi_buf = 0;
				bi_valid = 0;
			} else if (bi_valid >= 8) {
				put_byte(bi_buf & 0xff);
				bi_buf >>>= 8;
				bi_valid -= 8;
			}
		}

		// Send one empty static block to give enough lookahead for inflate.
		// This takes 10 bits, of which 7 may remain in the bit buffer.
		// The current inflate code requires 9 bits of lookahead. If the
		// last two codes for the previous block (real code plus EOB) were coded
		// on 5 bits or less, inflate may have only 5+3 bits of lookahead to decode
		// the last real code. In this case we send two empty static blocks instead
		// of one. (There are no problems if the previous block is stored or fixed.)
		// To simplify the code, we assume the worst case of last real code encoded
		// on one bit only.
		function _tr_align() {
			send_bits(STATIC_TREES << 1, 3);
			send_code(END_BLOCK, StaticTree.static_ltree);

			bi_flush();

			// Of the 10 bits for the empty block, we have already sent
			// (10 - bi_valid) bits. The lookahead for the last real code (before
			// the EOB of the previous block) was thus at least one plus the length
			// of the EOB plus what we have just sent of the empty static block.
			if (1 + last_eob_len + 10 - bi_valid < 9) {
				send_bits(STATIC_TREES << 1, 3);
				send_code(END_BLOCK, StaticTree.static_ltree);
				bi_flush();
			}
			last_eob_len = 7;
		}

		// Save the match info and tally the frequency counts. Return true if
		// the current block must be flushed.
		function _tr_tally(dist, // distance of matched string
		lc // match length-MIN_MATCH or unmatched char (if dist==0)
		) {
			var out_length, in_length, dcode;
			that.pending_buf[d_buf + last_lit * 2] = (dist >>> 8) & 0xff;
			that.pending_buf[d_buf + last_lit * 2 + 1] = dist & 0xff;

			that.pending_buf[l_buf + last_lit] = lc & 0xff;
			last_lit++;

			if (dist === 0) {
				// lc is the unmatched char
				dyn_ltree[lc * 2]++;
			} else {
				matches++;
				// Here, lc is the match length - MIN_MATCH
				dist--; // dist = match distance - 1
				dyn_ltree[(Tree._length_code[lc] + LITERALS + 1) * 2]++;
				dyn_dtree[Tree.d_code(dist) * 2]++;
			}

			if ((last_lit & 0x1fff) === 0 && level > 2) {
				// Compute an upper bound for the compressed length
				out_length = last_lit * 8;
				in_length = strstart - block_start;
				for (dcode = 0; dcode < D_CODES; dcode++) {
					out_length += dyn_dtree[dcode * 2] * (5 + Tree.extra_dbits[dcode]);
				}
				out_length >>>= 3;
				if ((matches < Math.floor(last_lit / 2)) && out_length < Math.floor(in_length / 2))
					return true;
			}

			return (last_lit == lit_bufsize - 1);
			// We avoid equality with lit_bufsize because of wraparound at 64K
			// on 16 bit machines and because stored blocks are restricted to
			// 64K-1 bytes.
		}

		// Send the block data compressed using the given Huffman trees
		function compress_block(ltree, dtree) {
			var dist; // distance of matched string
			var lc; // match length or unmatched char (if dist === 0)
			var lx = 0; // running index in l_buf
			var code; // the code to send
			var extra; // number of extra bits to send

			if (last_lit !== 0) {
				do {
					dist = ((that.pending_buf[d_buf + lx * 2] << 8) & 0xff00) | (that.pending_buf[d_buf + lx * 2 + 1] & 0xff);
					lc = (that.pending_buf[l_buf + lx]) & 0xff;
					lx++;

					if (dist === 0) {
						send_code(lc, ltree); // send a literal byte
					} else {
						// Here, lc is the match length - MIN_MATCH
						code = Tree._length_code[lc];

						send_code(code + LITERALS + 1, ltree); // send the length
						// code
						extra = Tree.extra_lbits[code];
						if (extra !== 0) {
							lc -= Tree.base_length[code];
							send_bits(lc, extra); // send the extra length bits
						}
						dist--; // dist is now the match distance - 1
						code = Tree.d_code(dist);

						send_code(code, dtree); // send the distance code
						extra = Tree.extra_dbits[code];
						if (extra !== 0) {
							dist -= Tree.base_dist[code];
							send_bits(dist, extra); // send the extra distance bits
						}
					} // literal or match pair ?

					// Check that the overlay between pending_buf and d_buf+l_buf is
					// ok:
				} while (lx < last_lit);
			}

			send_code(END_BLOCK, ltree);
			last_eob_len = ltree[END_BLOCK * 2 + 1];
		}

		// Flush the bit buffer and align the output on a byte boundary
		function bi_windup() {
			if (bi_valid > 8) {
				put_short(bi_buf);
			} else if (bi_valid > 0) {
				put_byte(bi_buf & 0xff);
			}
			bi_buf = 0;
			bi_valid = 0;
		}

		// Copy a stored block, storing first the length and its
		// one's complement if requested.
		function copy_block(buf, // the input data
		len, // its length
		header // true if block header must be written
		) {
			bi_windup(); // align on byte boundary
			last_eob_len = 8; // enough lookahead for inflate

			if (header) {
				put_short(len);
				put_short(~len);
			}

			that.pending_buf.set(window.subarray(buf, buf + len), that.pending);
			that.pending += len;
		}

		// Send a stored block
		function _tr_stored_block(buf, // input block
		stored_len, // length of input block
		eof // true if this is the last block for a file
		) {
			send_bits((STORED_BLOCK << 1) + (eof ? 1 : 0), 3); // send block type
			copy_block(buf, stored_len, true); // with header
		}

		// Determine the best encoding for the current block: dynamic trees, static
		// trees or store, and output the encoded block to the zip file.
		function _tr_flush_block(buf, // input block, or NULL if too old
		stored_len, // length of input block
		eof // true if this is the last block for a file
		) {
			var opt_lenb, static_lenb;// opt_len and static_len in bytes
			var max_blindex = 0; // index of last bit length code of non zero freq

			// Build the Huffman trees unless a stored block is forced
			if (level > 0) {
				// Construct the literal and distance trees
				l_desc.build_tree(that);

				d_desc.build_tree(that);

				// At this point, opt_len and static_len are the total bit lengths
				// of
				// the compressed block data, excluding the tree representations.

				// Build the bit length tree for the above two trees, and get the
				// index
				// in bl_order of the last bit length code to send.
				max_blindex = build_bl_tree();

				// Determine the best encoding. Compute first the block length in
				// bytes
				opt_lenb = (that.opt_len + 3 + 7) >>> 3;
				static_lenb = (that.static_len + 3 + 7) >>> 3;

				if (static_lenb <= opt_lenb)
					opt_lenb = static_lenb;
			} else {
				opt_lenb = static_lenb = stored_len + 5; // force a stored block
			}

			if ((stored_len + 4 <= opt_lenb) && buf != -1) {
				// 4: two words for the lengths
				// The test buf != NULL is only necessary if LIT_BUFSIZE > WSIZE.
				// Otherwise we can't have processed more than WSIZE input bytes
				// since
				// the last block flush, because compression would have been
				// successful. If LIT_BUFSIZE <= WSIZE, it is never too late to
				// transform a block into a stored block.
				_tr_stored_block(buf, stored_len, eof);
			} else if (static_lenb == opt_lenb) {
				send_bits((STATIC_TREES << 1) + (eof ? 1 : 0), 3);
				compress_block(StaticTree.static_ltree, StaticTree.static_dtree);
			} else {
				send_bits((DYN_TREES << 1) + (eof ? 1 : 0), 3);
				send_all_trees(l_desc.max_code + 1, d_desc.max_code + 1, max_blindex + 1);
				compress_block(dyn_ltree, dyn_dtree);
			}

			// The above check is made mod 2^32, for files larger than 512 MB
			// and uLong implemented on 32 bits.

			init_block();

			if (eof) {
				bi_windup();
			}
		}

		function flush_block_only(eof) {
			_tr_flush_block(block_start >= 0 ? block_start : -1, strstart - block_start, eof);
			block_start = strstart;
			strm.flush_pending();
		}

		// Fill the window when the lookahead becomes insufficient.
		// Updates strstart and lookahead.
		//
		// IN assertion: lookahead < MIN_LOOKAHEAD
		// OUT assertions: strstart <= window_size-MIN_LOOKAHEAD
		// At least one byte has been read, or avail_in === 0; reads are
		// performed for at least two bytes (required for the zip translate_eol
		// option -- not supported here).
		function fill_window() {
			var n, m;
			var p;
			var more; // Amount of free space at the end of the window.

			do {
				more = (window_size - lookahead - strstart);

				// Deal with !@#$% 64K limit:
				if (more === 0 && strstart === 0 && lookahead === 0) {
					more = w_size;
				} else if (more == -1) {
					// Very unlikely, but possible on 16 bit machine if strstart ==
					// 0
					// and lookahead == 1 (input done one byte at time)
					more--;

					// If the window is almost full and there is insufficient
					// lookahead,
					// move the upper half to the lower one to make room in the
					// upper half.
				} else if (strstart >= w_size + w_size - MIN_LOOKAHEAD) {
					window.set(window.subarray(w_size, w_size + w_size), 0);

					match_start -= w_size;
					strstart -= w_size; // we now have strstart >= MAX_DIST
					block_start -= w_size;

					// Slide the hash table (could be avoided with 32 bit values
					// at the expense of memory usage). We slide even when level ==
					// 0
					// to keep the hash table consistent if we switch back to level
					// > 0
					// later. (Using level 0 permanently is not an optimal usage of
					// zlib, so we don't care about this pathological case.)

					n = hash_size;
					p = n;
					do {
						m = (head[--p] & 0xffff);
						head[p] = (m >= w_size ? m - w_size : 0);
					} while (--n !== 0);

					n = w_size;
					p = n;
					do {
						m = (prev[--p] & 0xffff);
						prev[p] = (m >= w_size ? m - w_size : 0);
						// If n is not on any hash chain, prev[n] is garbage but
						// its value will never be used.
					} while (--n !== 0);
					more += w_size;
				}

				if (strm.avail_in === 0)
					return;

				// If there was no sliding:
				// strstart <= WSIZE+MAX_DIST-1 && lookahead <= MIN_LOOKAHEAD - 1 &&
				// more == window_size - lookahead - strstart
				// => more >= window_size - (MIN_LOOKAHEAD-1 + WSIZE + MAX_DIST-1)
				// => more >= window_size - 2*WSIZE + 2
				// In the BIG_MEM or MMAP case (not yet supported),
				// window_size == input_size + MIN_LOOKAHEAD &&
				// strstart + s->lookahead <= input_size => more >= MIN_LOOKAHEAD.
				// Otherwise, window_size == 2*WSIZE so more >= 2.
				// If there was sliding, more >= WSIZE. So in all cases, more >= 2.

				n = strm.read_buf(window, strstart + lookahead, more);
				lookahead += n;

				// Initialize the hash value now that we have some input:
				if (lookahead >= MIN_MATCH) {
					ins_h = window[strstart] & 0xff;
					ins_h = (((ins_h) << hash_shift) ^ (window[strstart + 1] & 0xff)) & hash_mask;
				}
				// If the whole input has less than MIN_MATCH bytes, ins_h is
				// garbage,
				// but this is not important since only literal bytes will be
				// emitted.
			} while (lookahead < MIN_LOOKAHEAD && strm.avail_in !== 0);
		}

		// Copy without compression as much as possible from the input stream,
		// return
		// the current block state.
		// This function does not insert new strings in the dictionary since
		// uncompressible data is probably not useful. This function is used
		// only for the level=0 compression option.
		// NOTE: this function should be optimized to avoid extra copying from
		// window to pending_buf.
		function deflate_stored(flush) {
			// Stored blocks are limited to 0xffff bytes, pending_buf is limited
			// to pending_buf_size, and each stored block has a 5 byte header:

			var max_block_size = 0xffff;
			var max_start;

			if (max_block_size > pending_buf_size - 5) {
				max_block_size = pending_buf_size - 5;
			}

			// Copy as much as possible from input to output:
			while (true) {
				// Fill the window as much as possible:
				if (lookahead <= 1) {
					fill_window();
					if (lookahead === 0 && flush == Z_NO_FLUSH)
						return NeedMore;
					if (lookahead === 0)
						break; // flush the current block
				}

				strstart += lookahead;
				lookahead = 0;

				// Emit a stored block if pending_buf will be full:
				max_start = block_start + max_block_size;
				if (strstart === 0 || strstart >= max_start) {
					// strstart === 0 is possible when wraparound on 16-bit machine
					lookahead = (strstart - max_start);
					strstart = max_start;

					flush_block_only(false);
					if (strm.avail_out === 0)
						return NeedMore;

				}

				// Flush if we may have to slide, otherwise block_start may become
				// negative and the data will be gone:
				if (strstart - block_start >= w_size - MIN_LOOKAHEAD) {
					flush_block_only(false);
					if (strm.avail_out === 0)
						return NeedMore;
				}
			}

			flush_block_only(flush == Z_FINISH);
			if (strm.avail_out === 0)
				return (flush == Z_FINISH) ? FinishStarted : NeedMore;

			return flush == Z_FINISH ? FinishDone : BlockDone;
		}

		function longest_match(cur_match) {
			var chain_length = max_chain_length; // max hash chain length
			var scan = strstart; // current string
			var match; // matched string
			var len; // length of current match
			var best_len = prev_length; // best match length so far
			var limit = strstart > (w_size - MIN_LOOKAHEAD) ? strstart - (w_size - MIN_LOOKAHEAD) : 0;
			var _nice_match = nice_match;

			// Stop when cur_match becomes <= limit. To simplify the code,
			// we prevent matches with the string of window index 0.

			var wmask = w_mask;

			var strend = strstart + MAX_MATCH;
			var scan_end1 = window[scan + best_len - 1];
			var scan_end = window[scan + best_len];

			// The code is optimized for HASH_BITS >= 8 and MAX_MATCH-2 multiple of
			// 16.
			// It is easy to get rid of this optimization if necessary.

			// Do not waste too much time if we already have a good match:
			if (prev_length >= good_match) {
				chain_length >>= 2;
			}

			// Do not look for matches beyond the end of the input. This is
			// necessary
			// to make deflate deterministic.
			if (_nice_match > lookahead)
				_nice_match = lookahead;

			do {
				match = cur_match;

				// Skip to next match if the match length cannot increase
				// or if the match length is less than 2:
				if (window[match + best_len] != scan_end || window[match + best_len - 1] != scan_end1 || window[match] != window[scan]
						|| window[++match] != window[scan + 1])
					continue;

				// The check at best_len-1 can be removed because it will be made
				// again later. (This heuristic is not always a win.)
				// It is not necessary to compare scan[2] and match[2] since they
				// are always equal when the other bytes match, given that
				// the hash keys are equal and that HASH_BITS >= 8.
				scan += 2;
				match++;

				// We check for insufficient lookahead only every 8th comparison;
				// the 256th check will be made at strstart+258.
				do {
				} while (window[++scan] == window[++match] && window[++scan] == window[++match] && window[++scan] == window[++match]
						&& window[++scan] == window[++match] && window[++scan] == window[++match] && window[++scan] == window[++match]
						&& window[++scan] == window[++match] && window[++scan] == window[++match] && scan < strend);

				len = MAX_MATCH - (strend - scan);
				scan = strend - MAX_MATCH;

				if (len > best_len) {
					match_start = cur_match;
					best_len = len;
					if (len >= _nice_match)
						break;
					scan_end1 = window[scan + best_len - 1];
					scan_end = window[scan + best_len];
				}

			} while ((cur_match = (prev[cur_match & wmask] & 0xffff)) > limit && --chain_length !== 0);

			if (best_len <= lookahead)
				return best_len;
			return lookahead;
		}

		// Compress as much as possible from the input stream, return the current
		// block state.
		// This function does not perform lazy evaluation of matches and inserts
		// new strings in the dictionary only for unmatched strings or for short
		// matches. It is used only for the fast compression options.
		function deflate_fast(flush) {
			// short hash_head = 0; // head of the hash chain
			var hash_head = 0; // head of the hash chain
			var bflush; // set if current block must be flushed

			while (true) {
				// Make sure that we always have enough lookahead, except
				// at the end of the input file. We need MAX_MATCH bytes
				// for the next match, plus MIN_MATCH bytes to insert the
				// string following the next match.
				if (lookahead < MIN_LOOKAHEAD) {
					fill_window();
					if (lookahead < MIN_LOOKAHEAD && flush == Z_NO_FLUSH) {
						return NeedMore;
					}
					if (lookahead === 0)
						break; // flush the current block
				}

				// Insert the string window[strstart .. strstart+2] in the
				// dictionary, and set hash_head to the head of the hash chain:
				if (lookahead >= MIN_MATCH) {
					ins_h = (((ins_h) << hash_shift) ^ (window[(strstart) + (MIN_MATCH - 1)] & 0xff)) & hash_mask;

					// prev[strstart&w_mask]=hash_head=head[ins_h];
					hash_head = (head[ins_h] & 0xffff);
					prev[strstart & w_mask] = head[ins_h];
					head[ins_h] = strstart;
				}

				// Find the longest match, discarding those <= prev_length.
				// At this point we have always match_length < MIN_MATCH

				if (hash_head !== 0 && ((strstart - hash_head) & 0xffff) <= w_size - MIN_LOOKAHEAD) {
					// To simplify the code, we prevent matches with the string
					// of window index 0 (in particular we have to avoid a match
					// of the string with itself at the start of the input file).
					if (strategy != Z_HUFFMAN_ONLY) {
						match_length = longest_match(hash_head);
					}
					// longest_match() sets match_start
				}
				if (match_length >= MIN_MATCH) {
					// check_match(strstart, match_start, match_length);

					bflush = _tr_tally(strstart - match_start, match_length - MIN_MATCH);

					lookahead -= match_length;

					// Insert new strings in the hash table only if the match length
					// is not too large. This saves time but degrades compression.
					if (match_length <= max_lazy_match && lookahead >= MIN_MATCH) {
						match_length--; // string at strstart already in hash table
						do {
							strstart++;

							ins_h = ((ins_h << hash_shift) ^ (window[(strstart) + (MIN_MATCH - 1)] & 0xff)) & hash_mask;
							// prev[strstart&w_mask]=hash_head=head[ins_h];
							hash_head = (head[ins_h] & 0xffff);
							prev[strstart & w_mask] = head[ins_h];
							head[ins_h] = strstart;

							// strstart never exceeds WSIZE-MAX_MATCH, so there are
							// always MIN_MATCH bytes ahead.
						} while (--match_length !== 0);
						strstart++;
					} else {
						strstart += match_length;
						match_length = 0;
						ins_h = window[strstart] & 0xff;

						ins_h = (((ins_h) << hash_shift) ^ (window[strstart + 1] & 0xff)) & hash_mask;
						// If lookahead < MIN_MATCH, ins_h is garbage, but it does
						// not
						// matter since it will be recomputed at next deflate call.
					}
				} else {
					// No match, output a literal byte

					bflush = _tr_tally(0, window[strstart] & 0xff);
					lookahead--;
					strstart++;
				}
				if (bflush) {

					flush_block_only(false);
					if (strm.avail_out === 0)
						return NeedMore;
				}
			}

			flush_block_only(flush == Z_FINISH);
			if (strm.avail_out === 0) {
				if (flush == Z_FINISH)
					return FinishStarted;
				else
					return NeedMore;
			}
			return flush == Z_FINISH ? FinishDone : BlockDone;
		}

		// Same as above, but achieves better compression. We use a lazy
		// evaluation for matches: a match is finally adopted only if there is
		// no better match at the next window position.
		function deflate_slow(flush) {
			// short hash_head = 0; // head of hash chain
			var hash_head = 0; // head of hash chain
			var bflush; // set if current block must be flushed
			var max_insert;

			// Process the input block.
			while (true) {
				// Make sure that we always have enough lookahead, except
				// at the end of the input file. We need MAX_MATCH bytes
				// for the next match, plus MIN_MATCH bytes to insert the
				// string following the next match.

				if (lookahead < MIN_LOOKAHEAD) {
					fill_window();
					if (lookahead < MIN_LOOKAHEAD && flush == Z_NO_FLUSH) {
						return NeedMore;
					}
					if (lookahead === 0)
						break; // flush the current block
				}

				// Insert the string window[strstart .. strstart+2] in the
				// dictionary, and set hash_head to the head of the hash chain:

				if (lookahead >= MIN_MATCH) {
					ins_h = (((ins_h) << hash_shift) ^ (window[(strstart) + (MIN_MATCH - 1)] & 0xff)) & hash_mask;
					// prev[strstart&w_mask]=hash_head=head[ins_h];
					hash_head = (head[ins_h] & 0xffff);
					prev[strstart & w_mask] = head[ins_h];
					head[ins_h] = strstart;
				}

				// Find the longest match, discarding those <= prev_length.
				prev_length = match_length;
				prev_match = match_start;
				match_length = MIN_MATCH - 1;

				if (hash_head !== 0 && prev_length < max_lazy_match && ((strstart - hash_head) & 0xffff) <= w_size - MIN_LOOKAHEAD) {
					// To simplify the code, we prevent matches with the string
					// of window index 0 (in particular we have to avoid a match
					// of the string with itself at the start of the input file).

					if (strategy != Z_HUFFMAN_ONLY) {
						match_length = longest_match(hash_head);
					}
					// longest_match() sets match_start

					if (match_length <= 5 && (strategy == Z_FILTERED || (match_length == MIN_MATCH && strstart - match_start > 4096))) {

						// If prev_match is also MIN_MATCH, match_start is garbage
						// but we will ignore the current match anyway.
						match_length = MIN_MATCH - 1;
					}
				}

				// If there was a match at the previous step and the current
				// match is not better, output the previous match:
				if (prev_length >= MIN_MATCH && match_length <= prev_length) {
					max_insert = strstart + lookahead - MIN_MATCH;
					// Do not insert strings in hash table beyond this.

					// check_match(strstart-1, prev_match, prev_length);

					bflush = _tr_tally(strstart - 1 - prev_match, prev_length - MIN_MATCH);

					// Insert in hash table all strings up to the end of the match.
					// strstart-1 and strstart are already inserted. If there is not
					// enough lookahead, the last two strings are not inserted in
					// the hash table.
					lookahead -= prev_length - 1;
					prev_length -= 2;
					do {
						if (++strstart <= max_insert) {
							ins_h = (((ins_h) << hash_shift) ^ (window[(strstart) + (MIN_MATCH - 1)] & 0xff)) & hash_mask;
							// prev[strstart&w_mask]=hash_head=head[ins_h];
							hash_head = (head[ins_h] & 0xffff);
							prev[strstart & w_mask] = head[ins_h];
							head[ins_h] = strstart;
						}
					} while (--prev_length !== 0);
					match_available = 0;
					match_length = MIN_MATCH - 1;
					strstart++;

					if (bflush) {
						flush_block_only(false);
						if (strm.avail_out === 0)
							return NeedMore;
					}
				} else if (match_available !== 0) {

					// If there was no match at the previous position, output a
					// single literal. If there was a match but the current match
					// is longer, truncate the previous match to a single literal.

					bflush = _tr_tally(0, window[strstart - 1] & 0xff);

					if (bflush) {
						flush_block_only(false);
					}
					strstart++;
					lookahead--;
					if (strm.avail_out === 0)
						return NeedMore;
				} else {
					// There is no previous match to compare with, wait for
					// the next step to decide.

					match_available = 1;
					strstart++;
					lookahead--;
				}
			}

			if (match_available !== 0) {
				bflush = _tr_tally(0, window[strstart - 1] & 0xff);
				match_available = 0;
			}
			flush_block_only(flush == Z_FINISH);

			if (strm.avail_out === 0) {
				if (flush == Z_FINISH)
					return FinishStarted;
				else
					return NeedMore;
			}

			return flush == Z_FINISH ? FinishDone : BlockDone;
		}

		function deflateReset(strm) {
			strm.total_in = strm.total_out = 0;
			strm.msg = null; //
			
			that.pending = 0;
			that.pending_out = 0;

			status = BUSY_STATE;

			last_flush = Z_NO_FLUSH;

			tr_init();
			lm_init();
			return Z_OK;
		}

		that.deflateInit = function(strm, _level, bits, _method, memLevel, _strategy) {
			if (!_method)
				_method = Z_DEFLATED;
			if (!memLevel)
				memLevel = DEF_MEM_LEVEL;
			if (!_strategy)
				_strategy = Z_DEFAULT_STRATEGY;

			// byte[] my_version=ZLIB_VERSION;

			//
			// if (!version || version[0] != my_version[0]
			// || stream_size != sizeof(z_stream)) {
			// return Z_VERSION_ERROR;
			// }

			strm.msg = null;

			if (_level == Z_DEFAULT_COMPRESSION)
				_level = 6;

			if (memLevel < 1 || memLevel > MAX_MEM_LEVEL || _method != Z_DEFLATED || bits < 9 || bits > 15 || _level < 0 || _level > 9 || _strategy < 0
					|| _strategy > Z_HUFFMAN_ONLY) {
				return Z_STREAM_ERROR;
			}

			strm.dstate = that;

			w_bits = bits;
			w_size = 1 << w_bits;
			w_mask = w_size - 1;

			hash_bits = memLevel + 7;
			hash_size = 1 << hash_bits;
			hash_mask = hash_size - 1;
			hash_shift = Math.floor((hash_bits + MIN_MATCH - 1) / MIN_MATCH);

			window = new Uint8Array(w_size * 2);
			prev = [];
			head = [];

			lit_bufsize = 1 << (memLevel + 6); // 16K elements by default

			// We overlay pending_buf and d_buf+l_buf. This works since the average
			// output size for (length,distance) codes is <= 24 bits.
			that.pending_buf = new Uint8Array(lit_bufsize * 4);
			pending_buf_size = lit_bufsize * 4;

			d_buf = Math.floor(lit_bufsize / 2);
			l_buf = (1 + 2) * lit_bufsize;

			level = _level;

			strategy = _strategy;
			method = _method & 0xff;

			return deflateReset(strm);
		};

		that.deflateEnd = function() {
			if (status != INIT_STATE && status != BUSY_STATE && status != FINISH_STATE) {
				return Z_STREAM_ERROR;
			}
			// Deallocate in reverse order of allocations:
			that.pending_buf = null;
			head = null;
			prev = null;
			window = null;
			// free
			that.dstate = null;
			return status == BUSY_STATE ? Z_DATA_ERROR : Z_OK;
		};

		that.deflateParams = function(strm, _level, _strategy) {
			var err = Z_OK;

			if (_level == Z_DEFAULT_COMPRESSION) {
				_level = 6;
			}
			if (_level < 0 || _level > 9 || _strategy < 0 || _strategy > Z_HUFFMAN_ONLY) {
				return Z_STREAM_ERROR;
			}

			if (config_table[level].func != config_table[_level].func && strm.total_in !== 0) {
				// Flush the last buffer:
				err = strm.deflate(Z_PARTIAL_FLUSH);
			}

			if (level != _level) {
				level = _level;
				max_lazy_match = config_table[level].max_lazy;
				good_match = config_table[level].good_length;
				nice_match = config_table[level].nice_length;
				max_chain_length = config_table[level].max_chain;
			}
			strategy = _strategy;
			return err;
		};

		that.deflateSetDictionary = function(strm, dictionary, dictLength) {
			var length = dictLength;
			var n, index = 0;

			if (!dictionary || status != INIT_STATE)
				return Z_STREAM_ERROR;

			if (length < MIN_MATCH)
				return Z_OK;
			if (length > w_size - MIN_LOOKAHEAD) {
				length = w_size - MIN_LOOKAHEAD;
				index = dictLength - length; // use the tail of the dictionary
			}
			window.set(dictionary.subarray(index, index + length), 0);

			strstart = length;
			block_start = length;

			// Insert all strings in the hash table (except for the last two bytes).
			// s->lookahead stays null, so s->ins_h will be recomputed at the next
			// call of fill_window.

			ins_h = window[0] & 0xff;
			ins_h = (((ins_h) << hash_shift) ^ (window[1] & 0xff)) & hash_mask;

			for (n = 0; n <= length - MIN_MATCH; n++) {
				ins_h = (((ins_h) << hash_shift) ^ (window[(n) + (MIN_MATCH - 1)] & 0xff)) & hash_mask;
				prev[n & w_mask] = head[ins_h];
				head[ins_h] = n;
			}
			return Z_OK;
		};

		that.deflate = function(_strm, flush) {
			var i, header, level_flags, old_flush, bstate;

			if (flush > Z_FINISH || flush < 0) {
				return Z_STREAM_ERROR;
			}

			if (!_strm.next_out || (!_strm.next_in && _strm.avail_in !== 0) || (status == FINISH_STATE && flush != Z_FINISH)) {
				_strm.msg = z_errmsg[Z_NEED_DICT - (Z_STREAM_ERROR)];
				return Z_STREAM_ERROR;
			}
			if (_strm.avail_out === 0) {
				_strm.msg = z_errmsg[Z_NEED_DICT - (Z_BUF_ERROR)];
				return Z_BUF_ERROR;
			}

			strm = _strm; // just in case
			old_flush = last_flush;
			last_flush = flush;

			// Write the zlib header
			if (status == INIT_STATE) {
				header = (Z_DEFLATED + ((w_bits - 8) << 4)) << 8;
				level_flags = ((level - 1) & 0xff) >> 1;

				if (level_flags > 3)
					level_flags = 3;
				header |= (level_flags << 6);
				if (strstart !== 0)
					header |= PRESET_DICT;
				header += 31 - (header % 31);

				status = BUSY_STATE;
				putShortMSB(header);
			}

			// Flush as much pending output as possible
			if (that.pending !== 0) {
				strm.flush_pending();
				if (strm.avail_out === 0) {
					// console.log(" avail_out==0");
					// Since avail_out is 0, deflate will be called again with
					// more output space, but possibly with both pending and
					// avail_in equal to zero. There won't be anything to do,
					// but this is not an error situation so make sure we
					// return OK instead of BUF_ERROR at next call of deflate:
					last_flush = -1;
					return Z_OK;
				}

				// Make sure there is something to do and avoid duplicate
				// consecutive
				// flushes. For repeated and useless calls with Z_FINISH, we keep
				// returning Z_STREAM_END instead of Z_BUFF_ERROR.
			} else if (strm.avail_in === 0 && flush <= old_flush && flush != Z_FINISH) {
				strm.msg = z_errmsg[Z_NEED_DICT - (Z_BUF_ERROR)];
				return Z_BUF_ERROR;
			}

			// User must not provide more input after the first FINISH:
			if (status == FINISH_STATE && strm.avail_in !== 0) {
				_strm.msg = z_errmsg[Z_NEED_DICT - (Z_BUF_ERROR)];
				return Z_BUF_ERROR;
			}

			// Start a new block or continue the current one.
			if (strm.avail_in !== 0 || lookahead !== 0 || (flush != Z_NO_FLUSH && status != FINISH_STATE)) {
				bstate = -1;
				switch (config_table[level].func) {
				case STORED:
					bstate = deflate_stored(flush);
					break;
				case FAST:
					bstate = deflate_fast(flush);
					break;
				case SLOW:
					bstate = deflate_slow(flush);
					break;
				default:
				}

				if (bstate == FinishStarted || bstate == FinishDone) {
					status = FINISH_STATE;
				}
				if (bstate == NeedMore || bstate == FinishStarted) {
					if (strm.avail_out === 0) {
						last_flush = -1; // avoid BUF_ERROR next call, see above
					}
					return Z_OK;
					// If flush != Z_NO_FLUSH && avail_out === 0, the next call
					// of deflate should use the same flush parameter to make sure
					// that the flush is complete. So we don't have to output an
					// empty block here, this will be done at next call. This also
					// ensures that for a very small output buffer, we emit at most
					// one empty block.
				}

				if (bstate == BlockDone) {
					if (flush == Z_PARTIAL_FLUSH) {
						_tr_align();
					} else { // FULL_FLUSH or SYNC_FLUSH
						_tr_stored_block(0, 0, false);
						// For a full flush, this empty block will be recognized
						// as a special marker by inflate_sync().
						if (flush == Z_FULL_FLUSH) {
							// state.head[s.hash_size-1]=0;
							for (i = 0; i < hash_size/*-1*/; i++)
								// forget history
								head[i] = 0;
						}
					}
					strm.flush_pending();
					if (strm.avail_out === 0) {
						last_flush = -1; // avoid BUF_ERROR at next call, see above
						return Z_OK;
					}
				}
			}

			if (flush != Z_FINISH)
				return Z_OK;
			return Z_STREAM_END;
		};
	}

	// ZStream

	function ZStream() {
		var that = this;
		that.next_in_index = 0;
		that.next_out_index = 0;
		// that.next_in; // next input byte
		that.avail_in = 0; // number of bytes available at next_in
		that.total_in = 0; // total nb of input bytes read so far
		// that.next_out; // next output byte should be put there
		that.avail_out = 0; // remaining free space at next_out
		that.total_out = 0; // total nb of bytes output so far
		// that.msg;
		// that.dstate;
	}

	ZStream.prototype = {
		deflateInit : function(level, bits) {
			var that = this;
			that.dstate = new Deflate();
			if (!bits)
				bits = MAX_BITS;
			return that.dstate.deflateInit(that, level, bits);
		},

		deflate : function(flush) {
			var that = this;
			if (!that.dstate) {
				return Z_STREAM_ERROR;
			}
			return that.dstate.deflate(that, flush);
		},

		deflateEnd : function() {
			var that = this;
			if (!that.dstate)
				return Z_STREAM_ERROR;
			var ret = that.dstate.deflateEnd();
			that.dstate = null;
			return ret;
		},

		deflateParams : function(level, strategy) {
			var that = this;
			if (!that.dstate)
				return Z_STREAM_ERROR;
			return that.dstate.deflateParams(that, level, strategy);
		},

		deflateSetDictionary : function(dictionary, dictLength) {
			var that = this;
			if (!that.dstate)
				return Z_STREAM_ERROR;
			return that.dstate.deflateSetDictionary(that, dictionary, dictLength);
		},

		// Read a new buffer from the current input stream, update the
		// total number of bytes read. All deflate() input goes through
		// this function so some applications may wish to modify it to avoid
		// allocating a large strm->next_in buffer and copying from it.
		// (See also flush_pending()).
		read_buf : function(buf, start, size) {
			var that = this;
			var len = that.avail_in;
			if (len > size)
				len = size;
			if (len === 0)
				return 0;
			that.avail_in -= len;
			buf.set(that.next_in.subarray(that.next_in_index, that.next_in_index + len), start);
			that.next_in_index += len;
			that.total_in += len;
			return len;
		},

		// Flush as much pending output as possible. All deflate() output goes
		// through this function so some applications may wish to modify it
		// to avoid allocating a large strm->next_out buffer and copying into it.
		// (See also read_buf()).
		flush_pending : function() {
			var that = this;
			var len = that.dstate.pending;

			if (len > that.avail_out)
				len = that.avail_out;
			if (len === 0)
				return;

			// if (that.dstate.pending_buf.length <= that.dstate.pending_out || that.next_out.length <= that.next_out_index
			// || that.dstate.pending_buf.length < (that.dstate.pending_out + len) || that.next_out.length < (that.next_out_index +
			// len)) {
			// console.log(that.dstate.pending_buf.length + ", " + that.dstate.pending_out + ", " + that.next_out.length + ", " +
			// that.next_out_index + ", " + len);
			// console.log("avail_out=" + that.avail_out);
			// }

			that.next_out.set(that.dstate.pending_buf.subarray(that.dstate.pending_out, that.dstate.pending_out + len), that.next_out_index);

			that.next_out_index += len;
			that.dstate.pending_out += len;
			that.total_out += len;
			that.avail_out -= len;
			that.dstate.pending -= len;
			if (that.dstate.pending === 0) {
				that.dstate.pending_out = 0;
			}
		}
	};

	// Deflater

	return function Deflater(level) {
		var that = this;
		var z = new ZStream();
		var bufsize = 512;
		var flush = Z_NO_FLUSH;
		var buf = new Uint8Array(bufsize);

		if (typeof level == "undefined")
			level = Z_DEFAULT_COMPRESSION;
		z.deflateInit(level);
		z.next_out = buf;

		that.append = function(data, onprogress) {
			var err, buffers = [], lastIndex = 0, bufferIndex = 0, bufferSize = 0, array;
			if (!data.length)
				return;
			z.next_in_index = 0;
			z.next_in = data;
			z.avail_in = data.length;
			do {
				z.next_out_index = 0;
				z.avail_out = bufsize;
				err = z.deflate(flush);
				if (err != Z_OK)
					throw "deflating: " + z.msg;
				if (z.next_out_index)
					if (z.next_out_index == bufsize)
						buffers.push(new Uint8Array(buf));
					else
						buffers.push(new Uint8Array(buf.subarray(0, z.next_out_index)));
				bufferSize += z.next_out_index;
				if (onprogress && z.next_in_index > 0 && z.next_in_index != lastIndex) {
					onprogress(z.next_in_index);
					lastIndex = z.next_in_index;
				}
			} while (z.avail_in > 0 || z.avail_out === 0);
			array = new Uint8Array(bufferSize);
			buffers.forEach(function(chunk) {
				array.set(chunk, bufferIndex);
				bufferIndex += chunk.length;
			});
			return array;
		};
		that.flush = function() {
			var err, buffers = [], bufferIndex = 0, bufferSize = 0, array;
			do {
				z.next_out_index = 0;
				z.avail_out = bufsize;
				err = z.deflate(Z_FINISH);
				if (err != Z_STREAM_END && err != Z_OK)
					throw "deflating: " + z.msg;
				if (bufsize - z.avail_out > 0)
					buffers.push(new Uint8Array(buf.subarray(0, z.next_out_index)));
				bufferSize += z.next_out_index;
			} while (z.avail_in > 0 || z.avail_out === 0);
			z.deflateEnd();
			array = new Uint8Array(bufferSize);
			buffers.forEach(function(chunk) {
				array.set(chunk, bufferIndex);
				bufferIndex += chunk.length;
			});
			return array;
		};
	};
})(this);
// Generated by CoffeeScript 1.4.0

/*
# PNG.js
# Copyright (c) 2011 Devon Govett
# MIT LICENSE
# 
# Permission is hereby granted, free of charge, to any person obtaining a copy of this 
# software and associated documentation files (the "Software"), to deal in the Software 
# without restriction, including without limitation the rights to use, copy, modify, merge, 
# publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons 
# to whom the Software is furnished to do so, subject to the following conditions:
# 
# The above copyright notice and this permission notice shall be included in all copies or 
# substantial portions of the Software.
# 
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING 
# BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND 
# NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, 
# DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/


(function(global) {
  var PNG;

  PNG = (function() {
    var APNG_BLEND_OP_OVER, APNG_BLEND_OP_SOURCE, APNG_DISPOSE_OP_BACKGROUND, APNG_DISPOSE_OP_NONE, APNG_DISPOSE_OP_PREVIOUS, makeImage, scratchCanvas, scratchCtx;

    PNG.load = function(url, canvas, callback) {
      var xhr,
        _this = this;
      if (typeof canvas === 'function') {
        callback = canvas;
      }
      xhr = new XMLHttpRequest;
      xhr.open("GET", url, true);
      xhr.responseType = "arraybuffer";
      xhr.onload = function() {
        var data, png;
        data = new Uint8Array(xhr.response || xhr.mozResponseArrayBuffer);
        png = new PNG(data);
        if (typeof (canvas != null ? canvas.getContext : void 0) === 'function') {
          png.render(canvas);
        }
        return typeof callback === "function" ? callback(png) : void 0;
      };
      return xhr.send(null);
    };

    APNG_DISPOSE_OP_NONE = 0;

    APNG_DISPOSE_OP_BACKGROUND = 1;

    APNG_DISPOSE_OP_PREVIOUS = 2;

    APNG_BLEND_OP_SOURCE = 0;

    APNG_BLEND_OP_OVER = 1;

    function PNG(data) {
      var chunkSize, colors, palLen, delayDen, delayNum, frame, i, index, key, section, palShort, text, _i, _j, _ref;
      this.data = data;
      this.pos = 8;
      this.palette = [];
      this.imgData = [];
      this.transparency = {};
      this.animation = null;
      this.text = {};
      frame = null;
      while (true) {
        chunkSize = this.readUInt32();
        section = ((function() {
          var _i, _results;
          _results = [];
          for (i = _i = 0; _i < 4; i = ++_i) {
            _results.push(String.fromCharCode(this.data[this.pos++]));
          }
          return _results;
        }).call(this)).join('');
        switch (section) {
          case 'IHDR':
            this.width = this.readUInt32();
            this.height = this.readUInt32();
            this.bits = this.data[this.pos++];
            this.colorType = this.data[this.pos++];
            this.compressionMethod = this.data[this.pos++];
            this.filterMethod = this.data[this.pos++];
            this.interlaceMethod = this.data[this.pos++];
            break;
          case 'acTL':
            this.animation = {
              numFrames: this.readUInt32(),
              numPlays: this.readUInt32() || Infinity,
              frames: []
            };
            break;
          case 'PLTE':
            this.palette = this.read(chunkSize);
            break;
          case 'fcTL':
            if (frame) {
              this.animation.frames.push(frame);
            }
            this.pos += 4;
            frame = {
              width: this.readUInt32(),
              height: this.readUInt32(),
              xOffset: this.readUInt32(),
              yOffset: this.readUInt32()
            };
            delayNum = this.readUInt16();
            delayDen = this.readUInt16() || 100;
            frame.delay = 1000 * delayNum / delayDen;
            frame.disposeOp = this.data[this.pos++];
            frame.blendOp = this.data[this.pos++];
            frame.data = [];
            break;
          case 'IDAT':
          case 'fdAT':
            if (section === 'fdAT') {
              this.pos += 4;
              chunkSize -= 4;
            }
            data = (frame != null ? frame.data : void 0) || this.imgData;
            for (i = _i = 0; 0 <= chunkSize ? _i < chunkSize : _i > chunkSize; i = 0 <= chunkSize ? ++_i : --_i) {
              data.push(this.data[this.pos++]);
            }
            break;
          case 'tRNS':
            this.transparency = {};
            switch (this.colorType) {
              case 3:
            	palLen = this.palette.length/3;
                this.transparency.indexed = this.read(chunkSize);
                if(this.transparency.indexed.length > palLen)
                	throw new Error('More transparent colors than palette size');
                /*
                 * According to the PNG spec trns should be increased to the same size as palette if shorter
                 */
                //palShort = 255 - this.transparency.indexed.length;
                palShort = palLen - this.transparency.indexed.length;
                if (palShort > 0) {
                  for (i = _j = 0; 0 <= palShort ? _j < palShort : _j > palShort; i = 0 <= palShort ? ++_j : --_j) {
                    this.transparency.indexed.push(255);
                  }
                }
                break;
              case 0:
                this.transparency.grayscale = this.read(chunkSize)[0];
                break;
              case 2:
                this.transparency.rgb = this.read(chunkSize);
            }
            break;
          case 'tEXt':
            text = this.read(chunkSize);
            index = text.indexOf(0);
            key = String.fromCharCode.apply(String, text.slice(0, index));
            this.text[key] = String.fromCharCode.apply(String, text.slice(index + 1));
            break;
          case 'IEND':
            if (frame) {
              this.animation.frames.push(frame);
            }
            this.colors = (function() {
              switch (this.colorType) {
                case 0:
                case 3:
                case 4:
                  return 1;
                case 2:
                case 6:
                  return 3;
              }
            }).call(this);
            this.hasAlphaChannel = (_ref = this.colorType) === 4 || _ref === 6;
            colors = this.colors + (this.hasAlphaChannel ? 1 : 0);
            this.pixelBitlength = this.bits * colors;
            this.colorSpace = (function() {
              switch (this.colors) {
                case 1:
                  return 'DeviceGray';
                case 3:
                  return 'DeviceRGB';
              }
            }).call(this);
            this.imgData = new Uint8Array(this.imgData);
            return;
          default:
            this.pos += chunkSize;
        }
        this.pos += 4;
        if (this.pos > this.data.length) {
          throw new Error("Incomplete or corrupt PNG file");
        }
      }
      return;
    }

    PNG.prototype.read = function(bytes) {
      var i, _i, _results;
      _results = [];
      for (i = _i = 0; 0 <= bytes ? _i < bytes : _i > bytes; i = 0 <= bytes ? ++_i : --_i) {
        _results.push(this.data[this.pos++]);
      }
      return _results;
    };

    PNG.prototype.readUInt32 = function() {
      var b1, b2, b3, b4;
      b1 = this.data[this.pos++] << 24;
      b2 = this.data[this.pos++] << 16;
      b3 = this.data[this.pos++] << 8;
      b4 = this.data[this.pos++];
      return b1 | b2 | b3 | b4;
    };

    PNG.prototype.readUInt16 = function() {
      var b1, b2;
      b1 = this.data[this.pos++] << 8;
      b2 = this.data[this.pos++];
      return b1 | b2;
    };

    PNG.prototype.decodePixels = function(data) {
      var abyte, c, col, i, left, length, p, pa, paeth, pb, pc, pixelBytes, pixels, pos, row, scanlineLength, upper, upperLeft, _i, _j, _k, _l, _m;
      if (data == null) {
        data = this.imgData;
      }
      if (data.length === 0) {
        return new Uint8Array(0);
      }
      data = new FlateStream(data);
      data = data.getBytes();
      pixelBytes = this.pixelBitlength / 8;
      scanlineLength = pixelBytes * this.width;
      pixels = new Uint8Array(scanlineLength * this.height);
      length = data.length;
      row = 0;
      pos = 0;
      c = 0;
      while (pos < length) {
        switch (data[pos++]) {
          case 0:
            for (i = _i = 0; _i < scanlineLength; i = _i += 1) {
              pixels[c++] = data[pos++];
            }
            break;
          case 1:
            for (i = _j = 0; _j < scanlineLength; i = _j += 1) {
              abyte = data[pos++];
              left = i < pixelBytes ? 0 : pixels[c - pixelBytes];
              pixels[c++] = (abyte + left) % 256;
            }
            break;
          case 2:
            for (i = _k = 0; _k < scanlineLength; i = _k += 1) {
              abyte = data[pos++];
              col = (i - (i % pixelBytes)) / pixelBytes;
              upper = row && pixels[(row - 1) * scanlineLength + col * pixelBytes + (i % pixelBytes)];
              pixels[c++] = (upper + abyte) % 256;
            }
            break;
          case 3:
            for (i = _l = 0; _l < scanlineLength; i = _l += 1) {
              abyte = data[pos++];
              col = (i - (i % pixelBytes)) / pixelBytes;
              left = i < pixelBytes ? 0 : pixels[c - pixelBytes];
              upper = row && pixels[(row - 1) * scanlineLength + col * pixelBytes + (i % pixelBytes)];
              pixels[c++] = (abyte + Math.floor((left + upper) / 2)) % 256;
            }
            break;
          case 4:
            for (i = _m = 0; _m < scanlineLength; i = _m += 1) {
              abyte = data[pos++];
              col = (i - (i % pixelBytes)) / pixelBytes;
              left = i < pixelBytes ? 0 : pixels[c - pixelBytes];
              if (row === 0) {
                upper = upperLeft = 0;
              } else {
                upper = pixels[(row - 1) * scanlineLength + col * pixelBytes + (i % pixelBytes)];
                upperLeft = col && pixels[(row - 1) * scanlineLength + (col - 1) * pixelBytes + (i % pixelBytes)];
              }
              p = left + upper - upperLeft;
              pa = Math.abs(p - left);
              pb = Math.abs(p - upper);
              pc = Math.abs(p - upperLeft);
              if (pa <= pb && pa <= pc) {
                paeth = left;
              } else if (pb <= pc) {
                paeth = upper;
              } else {
                paeth = upperLeft;
              }
              pixels[c++] = (abyte + paeth) % 256;
            }
            break;
          default:
            throw new Error("Invalid filter algorithm: " + data[pos - 1]);
        }
        row++;
      }
      return pixels;
    };

    PNG.prototype.decodePalette = function() {
      var c, i, length, palette, pos, ret, transparency, _i, _ref, _ref1;
      palette = this.palette;
      transparency = this.transparency.indexed || [];
      ret = new Uint8Array((transparency.length || 0) + palette.length);
      pos = 0;
      length = palette.length;
      c = 0;
      for (i = _i = 0, _ref = palette.length; _i < _ref; i = _i += 3) {
        ret[pos++] = palette[i];
        ret[pos++] = palette[i + 1];
        ret[pos++] = palette[i + 2];
        ret[pos++] = (_ref1 = transparency[c++]) != null ? _ref1 : 255;
      }
      return ret;
    };

    PNG.prototype.copyToImageData = function(imageData, pixels) {
      var alpha, colors, data, i, input, j, k, length, palette, v, _ref;
      colors = this.colors;
      palette = null;
      alpha = this.hasAlphaChannel;
      if (this.palette.length) {
        palette = (_ref = this._decodedPalette) != null ? _ref : this._decodedPalette = this.decodePalette();
        colors = 4;
        alpha = true;
      }
      data = imageData.data || imageData;
      length = data.length;
      input = palette || pixels;
      i = j = 0;
      if (colors === 1) {
        while (i < length) {
          k = palette ? pixels[i / 4] * 4 : j;
          v = input[k++];
          data[i++] = v;
          data[i++] = v;
          data[i++] = v;
          data[i++] = alpha ? input[k++] : 255;
          j = k;
        }
      } else {
        while (i < length) {
          k = palette ? pixels[i / 4] * 4 : j;
          data[i++] = input[k++];
          data[i++] = input[k++];
          data[i++] = input[k++];
          data[i++] = alpha ? input[k++] : 255;
          j = k;
        }
      }
    };

    PNG.prototype.decode = function() {
      var ret;
      ret = new Uint8Array(this.width * this.height * 4);
      this.copyToImageData(ret, this.decodePixels());
      return ret;
    };

    try {
        scratchCanvas = global.document.createElement('canvas');
        scratchCtx = scratchCanvas.getContext('2d');
    } catch(e) {
        return -1;
    }

    makeImage = function(imageData) {
      var img;
      scratchCtx.width = imageData.width;
      scratchCtx.height = imageData.height;
      scratchCtx.clearRect(0, 0, imageData.width, imageData.height);
      scratchCtx.putImageData(imageData, 0, 0);
      img = new Image;
      img.src = scratchCanvas.toDataURL();
      return img;
    };

    PNG.prototype.decodeFrames = function(ctx) {
      var frame, i, imageData, pixels, _i, _len, _ref, _results;
      if (!this.animation) {
        return;
      }
      _ref = this.animation.frames;
      _results = [];
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        frame = _ref[i];
        imageData = ctx.createImageData(frame.width, frame.height);
        pixels = this.decodePixels(new Uint8Array(frame.data));
        this.copyToImageData(imageData, pixels);
        frame.imageData = imageData;
        _results.push(frame.image = makeImage(imageData));
      }
      return _results;
    };

    PNG.prototype.renderFrame = function(ctx, number) {
      var frame, frames, prev;
      frames = this.animation.frames;
      frame = frames[number];
      prev = frames[number - 1];
      if (number === 0) {
        ctx.clearRect(0, 0, this.width, this.height);
      }
      if ((prev != null ? prev.disposeOp : void 0) === APNG_DISPOSE_OP_BACKGROUND) {
        ctx.clearRect(prev.xOffset, prev.yOffset, prev.width, prev.height);
      } else if ((prev != null ? prev.disposeOp : void 0) === APNG_DISPOSE_OP_PREVIOUS) {
        ctx.putImageData(prev.imageData, prev.xOffset, prev.yOffset);
      }
      if (frame.blendOp === APNG_BLEND_OP_SOURCE) {
        ctx.clearRect(frame.xOffset, frame.yOffset, frame.width, frame.height);
      }
      return ctx.drawImage(frame.image, frame.xOffset, frame.yOffset);
    };

    PNG.prototype.animate = function(ctx) {
      var doFrame, frameNumber, frames, numFrames, numPlays, _ref,
        _this = this;
      frameNumber = 0;
      _ref = this.animation, numFrames = _ref.numFrames, frames = _ref.frames, numPlays = _ref.numPlays;
      return (doFrame = function() {
        var f, frame;
        f = frameNumber++ % numFrames;
        frame = frames[f];
        _this.renderFrame(ctx, f);
        if (numFrames > 1 && frameNumber / numFrames < numPlays) {
          return _this.animation._timeout = setTimeout(doFrame, frame.delay);
        }
      })();
    };

    PNG.prototype.stopAnimation = function() {
      var _ref;
      return clearTimeout((_ref = this.animation) != null ? _ref._timeout : void 0);
    };

    PNG.prototype.render = function(canvas) {
      var ctx, data;
      if (canvas._png) {
        canvas._png.stopAnimation();
      }
      canvas._png = this;
      canvas.width = this.width;
      canvas.height = this.height;
      ctx = canvas.getContext("2d");
      if (this.animation) {
        this.decodeFrames(ctx);
        return this.animate(ctx);
      } else {
        data = ctx.createImageData(this.width, this.height);
        this.copyToImageData(data, this.decodePixels());
        return ctx.putImageData(data, 0, 0);
      }
    };

    return PNG;

  })();

  global.PNG = PNG;

})(typeof window !== "undefined" && window || this);
/*
 * Extracted from pdf.js
 * https://github.com/andreasgal/pdf.js
 *
 * Copyright (c) 2011 Mozilla Foundation
 *
 * Contributors: Andreas Gal <gal@mozilla.com>
 *               Chris G Jones <cjones@mozilla.com>
 *               Shaon Barman <shaon.barman@gmail.com>
 *               Vivien Nicolas <21@vingtetun.org>
 *               Justin D'Arcangelo <justindarc@gmail.com>
 *               Yury Delendik
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */

var DecodeStream = (function() {
  function constructor() {
    this.pos = 0;
    this.bufferLength = 0;
    this.eof = false;
    this.buffer = null;
  }

  constructor.prototype = {
    ensureBuffer: function decodestream_ensureBuffer(requested) {
      var buffer = this.buffer;
      var current = buffer ? buffer.byteLength : 0;
      if (requested < current)
        return buffer;
      var size = 512;
      while (size < requested)
        size <<= 1;
      var buffer2 = new Uint8Array(size);
      for (var i = 0; i < current; ++i)
        buffer2[i] = buffer[i];
      return this.buffer = buffer2;
    },
    getByte: function decodestream_getByte() {
      var pos = this.pos;
      while (this.bufferLength <= pos) {
        if (this.eof)
          return null;
        this.readBlock();
      }
      return this.buffer[this.pos++];
    },
    getBytes: function decodestream_getBytes(length) {
      var pos = this.pos;

      if (length) {
        this.ensureBuffer(pos + length);
        var end = pos + length;

        while (!this.eof && this.bufferLength < end)
          this.readBlock();

        var bufEnd = this.bufferLength;
        if (end > bufEnd)
          end = bufEnd;
      } else {
        while (!this.eof)
          this.readBlock();

        var end = this.bufferLength;
      }

      this.pos = end;
      return this.buffer.subarray(pos, end);
    },
    lookChar: function decodestream_lookChar() {
      var pos = this.pos;
      while (this.bufferLength <= pos) {
        if (this.eof)
          return null;
        this.readBlock();
      }
      return String.fromCharCode(this.buffer[this.pos]);
    },
    getChar: function decodestream_getChar() {
      var pos = this.pos;
      while (this.bufferLength <= pos) {
        if (this.eof)
          return null;
        this.readBlock();
      }
      return String.fromCharCode(this.buffer[this.pos++]);
    },
    makeSubStream: function decodestream_makeSubstream(start, length, dict) {
      var end = start + length;
      while (this.bufferLength <= end && !this.eof)
        this.readBlock();
      return new Stream(this.buffer, start, length, dict);
    },
    skip: function decodestream_skip(n) {
      if (!n)
        n = 1;
      this.pos += n;
    },
    reset: function decodestream_reset() {
      this.pos = 0;
    }
  };

  return constructor;
})();

var FlateStream = (function() {
  if (typeof Uint32Array === 'undefined') {
    return undefined;
  }
  var codeLenCodeMap = new Uint32Array([
    16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15
  ]);

  var lengthDecode = new Uint32Array([
    0x00003, 0x00004, 0x00005, 0x00006, 0x00007, 0x00008, 0x00009, 0x0000a,
    0x1000b, 0x1000d, 0x1000f, 0x10011, 0x20013, 0x20017, 0x2001b, 0x2001f,
    0x30023, 0x3002b, 0x30033, 0x3003b, 0x40043, 0x40053, 0x40063, 0x40073,
    0x50083, 0x500a3, 0x500c3, 0x500e3, 0x00102, 0x00102, 0x00102
  ]);

  var distDecode = new Uint32Array([
    0x00001, 0x00002, 0x00003, 0x00004, 0x10005, 0x10007, 0x20009, 0x2000d,
    0x30011, 0x30019, 0x40021, 0x40031, 0x50041, 0x50061, 0x60081, 0x600c1,
    0x70101, 0x70181, 0x80201, 0x80301, 0x90401, 0x90601, 0xa0801, 0xa0c01,
    0xb1001, 0xb1801, 0xc2001, 0xc3001, 0xd4001, 0xd6001
  ]);

  var fixedLitCodeTab = [new Uint32Array([
    0x70100, 0x80050, 0x80010, 0x80118, 0x70110, 0x80070, 0x80030, 0x900c0,
    0x70108, 0x80060, 0x80020, 0x900a0, 0x80000, 0x80080, 0x80040, 0x900e0,
    0x70104, 0x80058, 0x80018, 0x90090, 0x70114, 0x80078, 0x80038, 0x900d0,
    0x7010c, 0x80068, 0x80028, 0x900b0, 0x80008, 0x80088, 0x80048, 0x900f0,
    0x70102, 0x80054, 0x80014, 0x8011c, 0x70112, 0x80074, 0x80034, 0x900c8,
    0x7010a, 0x80064, 0x80024, 0x900a8, 0x80004, 0x80084, 0x80044, 0x900e8,
    0x70106, 0x8005c, 0x8001c, 0x90098, 0x70116, 0x8007c, 0x8003c, 0x900d8,
    0x7010e, 0x8006c, 0x8002c, 0x900b8, 0x8000c, 0x8008c, 0x8004c, 0x900f8,
    0x70101, 0x80052, 0x80012, 0x8011a, 0x70111, 0x80072, 0x80032, 0x900c4,
    0x70109, 0x80062, 0x80022, 0x900a4, 0x80002, 0x80082, 0x80042, 0x900e4,
    0x70105, 0x8005a, 0x8001a, 0x90094, 0x70115, 0x8007a, 0x8003a, 0x900d4,
    0x7010d, 0x8006a, 0x8002a, 0x900b4, 0x8000a, 0x8008a, 0x8004a, 0x900f4,
    0x70103, 0x80056, 0x80016, 0x8011e, 0x70113, 0x80076, 0x80036, 0x900cc,
    0x7010b, 0x80066, 0x80026, 0x900ac, 0x80006, 0x80086, 0x80046, 0x900ec,
    0x70107, 0x8005e, 0x8001e, 0x9009c, 0x70117, 0x8007e, 0x8003e, 0x900dc,
    0x7010f, 0x8006e, 0x8002e, 0x900bc, 0x8000e, 0x8008e, 0x8004e, 0x900fc,
    0x70100, 0x80051, 0x80011, 0x80119, 0x70110, 0x80071, 0x80031, 0x900c2,
    0x70108, 0x80061, 0x80021, 0x900a2, 0x80001, 0x80081, 0x80041, 0x900e2,
    0x70104, 0x80059, 0x80019, 0x90092, 0x70114, 0x80079, 0x80039, 0x900d2,
    0x7010c, 0x80069, 0x80029, 0x900b2, 0x80009, 0x80089, 0x80049, 0x900f2,
    0x70102, 0x80055, 0x80015, 0x8011d, 0x70112, 0x80075, 0x80035, 0x900ca,
    0x7010a, 0x80065, 0x80025, 0x900aa, 0x80005, 0x80085, 0x80045, 0x900ea,
    0x70106, 0x8005d, 0x8001d, 0x9009a, 0x70116, 0x8007d, 0x8003d, 0x900da,
    0x7010e, 0x8006d, 0x8002d, 0x900ba, 0x8000d, 0x8008d, 0x8004d, 0x900fa,
    0x70101, 0x80053, 0x80013, 0x8011b, 0x70111, 0x80073, 0x80033, 0x900c6,
    0x70109, 0x80063, 0x80023, 0x900a6, 0x80003, 0x80083, 0x80043, 0x900e6,
    0x70105, 0x8005b, 0x8001b, 0x90096, 0x70115, 0x8007b, 0x8003b, 0x900d6,
    0x7010d, 0x8006b, 0x8002b, 0x900b6, 0x8000b, 0x8008b, 0x8004b, 0x900f6,
    0x70103, 0x80057, 0x80017, 0x8011f, 0x70113, 0x80077, 0x80037, 0x900ce,
    0x7010b, 0x80067, 0x80027, 0x900ae, 0x80007, 0x80087, 0x80047, 0x900ee,
    0x70107, 0x8005f, 0x8001f, 0x9009e, 0x70117, 0x8007f, 0x8003f, 0x900de,
    0x7010f, 0x8006f, 0x8002f, 0x900be, 0x8000f, 0x8008f, 0x8004f, 0x900fe,
    0x70100, 0x80050, 0x80010, 0x80118, 0x70110, 0x80070, 0x80030, 0x900c1,
    0x70108, 0x80060, 0x80020, 0x900a1, 0x80000, 0x80080, 0x80040, 0x900e1,
    0x70104, 0x80058, 0x80018, 0x90091, 0x70114, 0x80078, 0x80038, 0x900d1,
    0x7010c, 0x80068, 0x80028, 0x900b1, 0x80008, 0x80088, 0x80048, 0x900f1,
    0x70102, 0x80054, 0x80014, 0x8011c, 0x70112, 0x80074, 0x80034, 0x900c9,
    0x7010a, 0x80064, 0x80024, 0x900a9, 0x80004, 0x80084, 0x80044, 0x900e9,
    0x70106, 0x8005c, 0x8001c, 0x90099, 0x70116, 0x8007c, 0x8003c, 0x900d9,
    0x7010e, 0x8006c, 0x8002c, 0x900b9, 0x8000c, 0x8008c, 0x8004c, 0x900f9,
    0x70101, 0x80052, 0x80012, 0x8011a, 0x70111, 0x80072, 0x80032, 0x900c5,
    0x70109, 0x80062, 0x80022, 0x900a5, 0x80002, 0x80082, 0x80042, 0x900e5,
    0x70105, 0x8005a, 0x8001a, 0x90095, 0x70115, 0x8007a, 0x8003a, 0x900d5,
    0x7010d, 0x8006a, 0x8002a, 0x900b5, 0x8000a, 0x8008a, 0x8004a, 0x900f5,
    0x70103, 0x80056, 0x80016, 0x8011e, 0x70113, 0x80076, 0x80036, 0x900cd,
    0x7010b, 0x80066, 0x80026, 0x900ad, 0x80006, 0x80086, 0x80046, 0x900ed,
    0x70107, 0x8005e, 0x8001e, 0x9009d, 0x70117, 0x8007e, 0x8003e, 0x900dd,
    0x7010f, 0x8006e, 0x8002e, 0x900bd, 0x8000e, 0x8008e, 0x8004e, 0x900fd,
    0x70100, 0x80051, 0x80011, 0x80119, 0x70110, 0x80071, 0x80031, 0x900c3,
    0x70108, 0x80061, 0x80021, 0x900a3, 0x80001, 0x80081, 0x80041, 0x900e3,
    0x70104, 0x80059, 0x80019, 0x90093, 0x70114, 0x80079, 0x80039, 0x900d3,
    0x7010c, 0x80069, 0x80029, 0x900b3, 0x80009, 0x80089, 0x80049, 0x900f3,
    0x70102, 0x80055, 0x80015, 0x8011d, 0x70112, 0x80075, 0x80035, 0x900cb,
    0x7010a, 0x80065, 0x80025, 0x900ab, 0x80005, 0x80085, 0x80045, 0x900eb,
    0x70106, 0x8005d, 0x8001d, 0x9009b, 0x70116, 0x8007d, 0x8003d, 0x900db,
    0x7010e, 0x8006d, 0x8002d, 0x900bb, 0x8000d, 0x8008d, 0x8004d, 0x900fb,
    0x70101, 0x80053, 0x80013, 0x8011b, 0x70111, 0x80073, 0x80033, 0x900c7,
    0x70109, 0x80063, 0x80023, 0x900a7, 0x80003, 0x80083, 0x80043, 0x900e7,
    0x70105, 0x8005b, 0x8001b, 0x90097, 0x70115, 0x8007b, 0x8003b, 0x900d7,
    0x7010d, 0x8006b, 0x8002b, 0x900b7, 0x8000b, 0x8008b, 0x8004b, 0x900f7,
    0x70103, 0x80057, 0x80017, 0x8011f, 0x70113, 0x80077, 0x80037, 0x900cf,
    0x7010b, 0x80067, 0x80027, 0x900af, 0x80007, 0x80087, 0x80047, 0x900ef,
    0x70107, 0x8005f, 0x8001f, 0x9009f, 0x70117, 0x8007f, 0x8003f, 0x900df,
    0x7010f, 0x8006f, 0x8002f, 0x900bf, 0x8000f, 0x8008f, 0x8004f, 0x900ff
  ]), 9];

  var fixedDistCodeTab = [new Uint32Array([
    0x50000, 0x50010, 0x50008, 0x50018, 0x50004, 0x50014, 0x5000c, 0x5001c,
    0x50002, 0x50012, 0x5000a, 0x5001a, 0x50006, 0x50016, 0x5000e, 0x00000,
    0x50001, 0x50011, 0x50009, 0x50019, 0x50005, 0x50015, 0x5000d, 0x5001d,
    0x50003, 0x50013, 0x5000b, 0x5001b, 0x50007, 0x50017, 0x5000f, 0x00000
  ]), 5];
  
  function error(e) {
      throw new Error(e)
  }

  function constructor(bytes) {
    //var bytes = stream.getBytes();
    var bytesPos = 0;

    var cmf = bytes[bytesPos++];
    var flg = bytes[bytesPos++];
    if (cmf == -1 || flg == -1)
      error('Invalid header in flate stream');
    if ((cmf & 0x0f) != 0x08)
      error('Unknown compression method in flate stream');
    if ((((cmf << 8) + flg) % 31) != 0)
      error('Bad FCHECK in flate stream');
    if (flg & 0x20)
      error('FDICT bit set in flate stream');

    this.bytes = bytes;
    this.bytesPos = bytesPos;

    this.codeSize = 0;
    this.codeBuf = 0;

    DecodeStream.call(this);
  }

  constructor.prototype = Object.create(DecodeStream.prototype);

  constructor.prototype.getBits = function(bits) {
    var codeSize = this.codeSize;
    var codeBuf = this.codeBuf;
    var bytes = this.bytes;
    var bytesPos = this.bytesPos;

    var b;
    while (codeSize < bits) {
      if (typeof (b = bytes[bytesPos++]) == 'undefined')
        error('Bad encoding in flate stream');
      codeBuf |= b << codeSize;
      codeSize += 8;
    }
    b = codeBuf & ((1 << bits) - 1);
    this.codeBuf = codeBuf >> bits;
    this.codeSize = codeSize -= bits;
    this.bytesPos = bytesPos;
    return b;
  };

  constructor.prototype.getCode = function(table) {
    var codes = table[0];
    var maxLen = table[1];
    var codeSize = this.codeSize;
    var codeBuf = this.codeBuf;
    var bytes = this.bytes;
    var bytesPos = this.bytesPos;

    while (codeSize < maxLen) {
      var b;
      if (typeof (b = bytes[bytesPos++]) == 'undefined')
        error('Bad encoding in flate stream');
      codeBuf |= (b << codeSize);
      codeSize += 8;
    }
    var code = codes[codeBuf & ((1 << maxLen) - 1)];
    var codeLen = code >> 16;
    var codeVal = code & 0xffff;
    if (codeSize == 0 || codeSize < codeLen || codeLen == 0)
      error('Bad encoding in flate stream');
    this.codeBuf = (codeBuf >> codeLen);
    this.codeSize = (codeSize - codeLen);
    this.bytesPos = bytesPos;
    return codeVal;
  };

  constructor.prototype.generateHuffmanTable = function(lengths) {
    var n = lengths.length;

    // find max code length
    var maxLen = 0;
    for (var i = 0; i < n; ++i) {
      if (lengths[i] > maxLen)
        maxLen = lengths[i];
    }

    // build the table
    var size = 1 << maxLen;
    var codes = new Uint32Array(size);
    for (var len = 1, code = 0, skip = 2;
         len <= maxLen;
         ++len, code <<= 1, skip <<= 1) {
      for (var val = 0; val < n; ++val) {
        if (lengths[val] == len) {
          // bit-reverse the code
          var code2 = 0;
          var t = code;
          for (var i = 0; i < len; ++i) {
            code2 = (code2 << 1) | (t & 1);
            t >>= 1;
          }

          // fill the table entries
          for (var i = code2; i < size; i += skip)
            codes[i] = (len << 16) | val;

          ++code;
        }
      }
    }

    return [codes, maxLen];
  };

  constructor.prototype.readBlock = function() {
    function repeat(stream, array, len, offset, what) {
      var repeat = stream.getBits(len) + offset;
      while (repeat-- > 0)
        array[i++] = what;
    }

    // read block header
    var hdr = this.getBits(3);
    if (hdr & 1)
      this.eof = true;
    hdr >>= 1;

    if (hdr == 0) { // uncompressed block
      var bytes = this.bytes;
      var bytesPos = this.bytesPos;
      var b;

      if (typeof (b = bytes[bytesPos++]) == 'undefined')
        error('Bad block header in flate stream');
      var blockLen = b;
      if (typeof (b = bytes[bytesPos++]) == 'undefined')
        error('Bad block header in flate stream');
      blockLen |= (b << 8);
      if (typeof (b = bytes[bytesPos++]) == 'undefined')
        error('Bad block header in flate stream');
      var check = b;
      if (typeof (b = bytes[bytesPos++]) == 'undefined')
        error('Bad block header in flate stream');
      check |= (b << 8);
      if (check != (~blockLen & 0xffff))
        error('Bad uncompressed block length in flate stream');

      this.codeBuf = 0;
      this.codeSize = 0;

      var bufferLength = this.bufferLength;
      var buffer = this.ensureBuffer(bufferLength + blockLen);
      var end = bufferLength + blockLen;
      this.bufferLength = end;
      for (var n = bufferLength; n < end; ++n) {
        if (typeof (b = bytes[bytesPos++]) == 'undefined') {
          this.eof = true;
          break;
        }
        buffer[n] = b;
      }
      this.bytesPos = bytesPos;
      return;
    }

    var litCodeTable;
    var distCodeTable;
    if (hdr == 1) { // compressed block, fixed codes
      litCodeTable = fixedLitCodeTab;
      distCodeTable = fixedDistCodeTab;
    } else if (hdr == 2) { // compressed block, dynamic codes
      var numLitCodes = this.getBits(5) + 257;
      var numDistCodes = this.getBits(5) + 1;
      var numCodeLenCodes = this.getBits(4) + 4;

      // build the code lengths code table
      var codeLenCodeLengths = Array(codeLenCodeMap.length);
      var i = 0;
      while (i < numCodeLenCodes)
        codeLenCodeLengths[codeLenCodeMap[i++]] = this.getBits(3);
      var codeLenCodeTab = this.generateHuffmanTable(codeLenCodeLengths);

      // build the literal and distance code tables
      var len = 0;
      var i = 0;
      var codes = numLitCodes + numDistCodes;
      var codeLengths = new Array(codes);
      while (i < codes) {
        var code = this.getCode(codeLenCodeTab);
        if (code == 16) {
          repeat(this, codeLengths, 2, 3, len);
        } else if (code == 17) {
          repeat(this, codeLengths, 3, 3, len = 0);
        } else if (code == 18) {
          repeat(this, codeLengths, 7, 11, len = 0);
        } else {
          codeLengths[i++] = len = code;
        }
      }

      litCodeTable =
        this.generateHuffmanTable(codeLengths.slice(0, numLitCodes));
      distCodeTable =
        this.generateHuffmanTable(codeLengths.slice(numLitCodes, codes));
    } else {
      error('Unknown block type in flate stream');
    }

    var buffer = this.buffer;
    var limit = buffer ? buffer.length : 0;
    var pos = this.bufferLength;
    while (true) {
      var code1 = this.getCode(litCodeTable);
      if (code1 < 256) {
        if (pos + 1 >= limit) {
          buffer = this.ensureBuffer(pos + 1);
          limit = buffer.length;
        }
        buffer[pos++] = code1;
        continue;
      }
      if (code1 == 256) {
        this.bufferLength = pos;
        return;
      }
      code1 -= 257;
      code1 = lengthDecode[code1];
      var code2 = code1 >> 16;
      if (code2 > 0)
        code2 = this.getBits(code2);
      var len = (code1 & 0xffff) + code2;
      code1 = this.getCode(distCodeTable);
      code1 = distDecode[code1];
      code2 = code1 >> 16;
      if (code2 > 0)
        code2 = this.getBits(code2);
      var dist = (code1 & 0xffff) + code2;
      if (pos + len >= limit) {
        buffer = this.ensureBuffer(pos + len);
        limit = buffer.length;
      }
      for (var k = 0; k < len; ++k, ++pos)
        buffer[pos] = buffer[pos - dist];
    }
  };

  return constructor;
})();/**
 * JavaScript Polyfill functions for jsPDF
 * Collected from public resources by
 * https://github.com/diegocr
 */

(function (global) {
	var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

	if (typeof global.btoa === 'undefined') {
		global.btoa = function(data) {
			//  discuss at: http://phpjs.org/functions/base64_encode/
			// original by: Tyler Akins (http://rumkin.com)
			// improved by: Bayron Guevara
			// improved by: Thunder.m
			// improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
			// improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
			// improved by: Rafal Kukawski (http://kukawski.pl)
			// bugfixed by: Pellentesque Malesuada
			//   example 1: base64_encode('Kevin van Zonneveld');
			//   returns 1: 'S2V2aW4gdmFuIFpvbm5ldmVsZA=='

			var o1,o2,o3,h1,h2,h3,h4,bits,i = 0,ac = 0,enc = '',tmp_arr = [];

			if (!data) {
				return data;
			}

			do { // pack three octets into four hexets
				o1 = data.charCodeAt(i++);
				o2 = data.charCodeAt(i++);
				o3 = data.charCodeAt(i++);

				bits = o1 << 16 | o2 << 8 | o3;

				h1 = bits >> 18 & 0x3f;
				h2 = bits >> 12 & 0x3f;
				h3 = bits >> 6 & 0x3f;
				h4 = bits & 0x3f;

				// use hexets to index into b64, and append result to encoded string
				tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
			} while (i < data.length);

			enc = tmp_arr.join('');

			var r = data.length % 3;

			return (r ? enc.slice(0, r - 3) : enc) + '==='.slice(r || 3);
		};
	}

	if (typeof global.atob === 'undefined') {
		global.atob = function(data) {
			//  discuss at: http://phpjs.org/functions/base64_decode/
			// original by: Tyler Akins (http://rumkin.com)
			// improved by: Thunder.m
			// improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
			// improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
			//    input by: Aman Gupta
			//    input by: Brett Zamir (http://brett-zamir.me)
			// bugfixed by: Onno Marsman
			// bugfixed by: Pellentesque Malesuada
			// bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
			//   example 1: base64_decode('S2V2aW4gdmFuIFpvbm5ldmVsZA==');
			//   returns 1: 'Kevin van Zonneveld'

			var o1,o2,o3,h1,h2,h3,h4,bits,i = 0,ac = 0,dec = '',tmp_arr = [];

			if (!data) {
				return data;
			}

			data += '';

			do { // unpack four hexets into three octets using index points in b64
				h1 = b64.indexOf(data.charAt(i++));
				h2 = b64.indexOf(data.charAt(i++));
				h3 = b64.indexOf(data.charAt(i++));
				h4 = b64.indexOf(data.charAt(i++));

				bits = h1 << 18 | h2 << 12 | h3 << 6 | h4;

				o1 = bits >> 16 & 0xff;
				o2 = bits >> 8 & 0xff;
				o3 = bits & 0xff;

				if (h3 == 64) {
					tmp_arr[ac++] = String.fromCharCode(o1);
				} else if (h4 == 64) {
					tmp_arr[ac++] = String.fromCharCode(o1, o2);
				} else {
					tmp_arr[ac++] = String.fromCharCode(o1, o2, o3);
				}
			} while (i < data.length);

			dec = tmp_arr.join('');

			return dec;
		};
	}

	if (!Array.prototype.map) {
		Array.prototype.map = function(fun /*, thisArg */) {
			if (this === void 0 || this === null || typeof fun !== "function")
				throw new TypeError();

			var t = Object(this), len = t.length >>> 0, res = new Array(len);
			var thisArg = arguments.length > 1 ? arguments[1] : void 0;
			for (var i = 0; i < len; i++) {
				// NOTE: Absolute correctness would demand Object.defineProperty
				//       be used.  But this method is fairly new, and failure is
				//       possible only if Object.prototype or Array.prototype
				//       has a property |i| (very unlikely), so use a less-correct
				//       but more portable alternative.
				if (i in t)
					res[i] = fun.call(thisArg, t[i], i, t);
			}

			return res;
		};
	}


	if(!Array.isArray) {
		Array.isArray = function(arg) {
			return Object.prototype.toString.call(arg) === '[object Array]';
		};
	}

	if (!Array.prototype.forEach) {
		Array.prototype.forEach = function(fun, thisArg) {
			"use strict";

			if (this === void 0 || this === null || typeof fun !== "function")
				throw new TypeError();

			var t = Object(this), len = t.length >>> 0;
			for (var i = 0; i < len; i++) {
				if (i in t)
					fun.call(thisArg, t[i], i, t);
			}
		};
	}

	if (!Object.keys) {
		Object.keys = (function () {
			'use strict';

			var hasOwnProperty = Object.prototype.hasOwnProperty,
				hasDontEnumBug = !({toString: null}).propertyIsEnumerable('toString'),
				dontEnums = ['toString','toLocaleString','valueOf','hasOwnProperty',
					'isPrototypeOf','propertyIsEnumerable','constructor'],
				dontEnumsLength = dontEnums.length;

			return function (obj) {
				if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
					throw new TypeError();
				}
				var result = [], prop, i;

				for (prop in obj) {
					if (hasOwnProperty.call(obj, prop)) {
						result.push(prop);
					}
				}

				if (hasDontEnumBug) {
					for (i = 0; i < dontEnumsLength; i++) {
						if (hasOwnProperty.call(obj, dontEnums[i])) {
							result.push(dontEnums[i]);
						}
					}
				}
				return result;
			};
		}());
	}

	if (!String.prototype.trim) {
		String.prototype.trim = function () {
			return this.replace(/^\s+|\s+$/g, '');
		};
	}
	if (!String.prototype.trimLeft) {
		String.prototype.trimLeft = function() {
			return this.replace(/^\s+/g, "");
		};
	}
	if (!String.prototype.trimRight) {
		String.prototype.trimRight = function() {
			return this.replace(/\s+$/g, "");
		};
	}

})(typeof self !== "undefined" && self || typeof window !== "undefined" && window || this);
