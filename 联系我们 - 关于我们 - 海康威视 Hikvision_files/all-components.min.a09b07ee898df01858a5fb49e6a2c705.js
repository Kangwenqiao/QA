var focussedSearch = (function ($) {
    var focussedSearch = {};
    var numPerPage = 5;
    focussedSearch.init = function () {
        $(document).ready(function () {
            var urlKeyword = fessSearchProvider.urlParam("q");
            var $searchWrapper = $(".search-wrapper");
            var fessQueryUrl = $('.filter-header-web').attr('data-search-page');
            var $searchBox = $searchWrapper.find(".focussed-search");

            if ($searchBox && urlKeyword) {
                $searchBox.val(urlKeyword);
            }

            if (fessQueryUrl) {
                $searchBox.autocomplete({
                    source: function (request, response) {
                        var searchCriteria = request.term;
                        var siteName = parseSiteFromUrl();
                        var params = {
                            url: fessQueryUrl + ".searchSuggest.json",
                            keyword: searchCriteria,
                            pageSize: numPerPage,
                        };
                        // if ("cn" === siteName.toLowerCase()) {
                        params.tags = siteName;
                        // }
                        params.callback = response;
                        fessSearchProvider.doFessSuggest(params);
                    },
                    open: function (event, ui) {
                        $searchBox.addClass('remove-border');

                        var searchBoxWidth = $searchBox.outerWidth();
                        $('.ui-autocomplete').css('width', searchBoxWidth);
                    },
                    close: function (event, ui) {
                        $searchBox.removeClass('remove-border');
                    },
                    select: function (event, ui) {
                        var label = ui.item.label;
                        $searchBox.val(label);
                        doSearch();
                    },
                    delay: 300
                });
            }

            $searchBox.on('focus', function () {
                if (fessQueryUrl) {
                    var isDisabled = $searchBox.autocomplete('option', 'disabled');
                    if ($searchBox.val() && !isDisabled) {
                        $searchBox.autocomplete('search', $searchBox.val());
                    }
                }
            });

            function doSearch() {
                resultPagination.initialFetch($searchBox.val());
                // for at event
                var module = $searchBox.data('at-module');
                var value = $searchBox.val();
                module = module + atModel.atSpliter + value;

                atModel.doAtEvent(module + atModel.atSpliter + window.location.href, 'action', event);
            }

            // search click
            $searchWrapper.removeAttr('onclick').on('click', '.btn-search', function (event) {
                doSearch();
            });

            // search enter
            $searchWrapper.removeAttr('onkeyup').on('keyup', '.focussed-search', function (event) {
                if (event.keyCode === 13) {
                    if (fessQueryUrl) {
                        $searchBox.autocomplete('close');
                    }
                    doSearch();
                }
            });
        });
    };

    return focussedSearch;
})($);

focussedSearch.init();
//cta-btn埋点处理
$(function () {
    $.each($('.cta-btn'), function (index, el) {
        var lastNodeHref = lastNode($(this).attr('href'))
        var preModule = $(this).data('pre-module')
        $(this).attr('data-at-module', preModule + lastNodeHref)
    })
    var pageTitle=$("#header").attr('data-page-title')
    $('.description-wrapper.hiknow-rte a').unbind('click').on('click',function(e){
            e.stopPropagation()
            e.preventDefault()
            var ahref = $(this).data('href') || $(this).attr('href')
            if(ahref && !_.startsWith(ahref ,'http') && $(this).attr('target') != '_blank'){
              setTimeout(function() {
                window.open(ahref, '_self')
              }, 500)
            } else if(ahref) {
              setTimeout(function() {
                window.open(ahref, '_blank')
              }, 500)
            }
            var analyticsData=$(this).text()+"::Media::跳转页面::[complete-link]"+$(this).attr('href')+"::"+pageTitle
            HiAnalyticsCn.clickDown( analyticsData)
    })

    function getCurrentVideoSize($comp) {
        if($comp.find('.animated-videos').data('video-type') == 'internal') {
            var $video = $comp.find('video');
            var containerWidth = $comp.find('.plyr__video-wrapper').width();

            $video.each(function() {
                var $this = $(this);
                var width = $this[0].videoWidth;
                var height = $this[0].videoHeight;
                var ratio = width / height;
                var containerHeight = containerWidth / ratio;
    
                $this.closest('.plyr__video-wrapper--fixed-ratio').css('padding-bottom', containerHeight + 'px');
            })
        }
    }

    $('.media-wrapper').each(function () {
        var $comp = $(this);
        $comp.find('.media-folded .sub-title').click(function () {
            $(this).next().toggle();
            $(this).toggleClass("flip-icon");
        });

        var timeout;
        var tabs = $comp.find('.media-category-tab-item');
        var len = tabs.length;
        let tabsWidth = 0;
        for (var i = 0; i < len; i++) {
            tabsWidth += tabs[i].clientWidth;
        }
        tabsWidth += (len - 2) * 56;
        if (tabsWidth > 1122) {
            $comp.find('.tabs-wrapper .next-btn').addClass('show');
        }

        if ($('body').hasClass('rtl')) {
            $comp.find('.tabs-wrapper .next-btn').on('click', function () {
                clearTimeout(timeout);
                timeout = setTimeout(function () {
                    if (!$comp.find('.tabs-wrapper .next-btn').hasClass('show')) return;
                    var $tabs = $comp.find('.media-category-tab-items');
                    var num = $tabs.find('.media-category-tab-item').length;
                    var tabW = $tabs[0].scrollWidth;
                    var step = tabW / num;
                    var tabX = $tabs.css("transform").replace(/[^0-9\-,]/g, '').split(',')[4];
                    tabX = Math.round(tabX) + step;
                    $tabs.css({
                        'transform': 'translateX(' + Math.round(tabX) + 'px)'
                    });
                }, 180);
            });

            $comp.find('.tabs-wrapper .pre-btn').on('click', function () {
                if (!$(this).hasClass('show')) return;
                var $tabs = $comp.find('.media-category-tab-items');
                var num = $tabs.find('.media-category-tab-item').length;
                var tabW = $tabs[0].scrollWidth;
                var step = tabW / num;
                var tabX = $tabs.css("transform").replace(/[^0-9\-,]/g, '').split(',')[4];
                var containerW = $comp.find('.media-category-tab').width();

                tabX = tabX - step;
                if (Math.abs(tabX) > (tabW - containerW)) tabX = containerW - tabW;
                $tabs.css({
                    'transform': 'translateX(' + Math.round(tabX) + 'px)'
                });
            });
        } else {
            $comp.find('.tabs-wrapper .pre-btn').on('click', function () {
                clearTimeout(timeout);
                timeout = setTimeout(function () {
                    if (!$comp.find('.tabs-wrapper .pre-btn').hasClass('show')) return;
                    var $tabs = $comp.find('.media-category-tab-items');
                    var num = $tabs.find('.media-category-tab-item').length;
                    var tabW = $tabs[0].scrollWidth;
                    var step = tabW / num;
                    var tabX = $tabs.css("transform").replace(/[^0-9\-,]/g, '').split(',')[4];
                    tabX = Math.round(tabX) + step;
                    if (tabX > 0) tabX = 0;
                    $tabs.css({
                        'transform': 'translateX(' + Math.round(tabX) + 'px)'
                    });
                }, 180);
            });

            $comp.find('.tabs-wrapper .next-btn').on('click', function () {
                if (!$(this).hasClass('show')) return;
                var $tabs = $comp.find('.media-category-tab-items');
                var num = $tabs.find('.media-category-tab-item').length;
                var tabW = $tabs[0].scrollWidth;
                var step = tabW / num;
                var tabX = $tabs.css("transform").replace(/[^0-9\-,]/g, '').split(',')[4];
                var containerW = $comp.find('.media-category-tab').width();

                tabX = tabX - step;
                if (Math.abs(tabX) > (tabW - containerW)) tabX = containerW - tabW;
                $tabs.css({
                    'transform': 'translateX(' + Math.round(tabX) + 'px)'
                });
            });
        }

        $comp.find('.media-category-tab-items').on('transitionend', function () {
            initTabArrowBtn($comp);
        })

        function initTabArrowBtn($comp) {
            var containerW = $comp.find('.media-category-tab').width();
            var $tabs = $comp.find('.media-category-tab-items');
            var $preBtn = $comp.find('.tabs-wrapper .pre-btn');
            var $nextBtn = $comp.find('.tabs-wrapper .next-btn');
            var tabW = $tabs[0].scrollWidth;
            var tabX = $tabs.css("transform").replace(/[^0-9\-,]/g, '').split(',')[4];

            if (tabX == 0) {
                $preBtn.removeClass('show');
            } else {
                $preBtn.addClass('show');
            }

            if ((Math.abs(tabX) + 1) >= Math.round(tabW - containerW)) {
                $nextBtn.removeClass('show');
            } else {
                $nextBtn.addClass('show');
            }
        }

        $comp.on('autoResizeMedia', function(event, data) {
            getCurrentVideoSize($comp);
        });

        $(window).on('resize', function() {
            getCurrentVideoSize($comp);
        })
    });
})

$(document).ready(function() {
  $('.title-wrapper .title-capitalize').each(function() {
      var text = $(this).text().toLowerCase();
      $(this).text(text);
  });
});
function initialize() {
    var mapLatitude = $('.map-wrapper > .map-div').attr('data-attr-latitude');
    var mapLongitude = $('.map-wrapper > .map-div').attr('data-attr-longitude');
    var mapAddress = $('.map-wrapper > .map-div').attr('data-attr-address');
    var markerLabel = $('.map-wrapper > .map-div').attr('data-attr-marker');
    var mapValueSelector=$('.map-wrapper > .map-div').attr('data-attr-map-type');
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom : 8,
        center : {
            lat : parseFloat(mapLatitude),
            lng : parseFloat(mapLongitude)
        }
    });
    var geocoder = new google.maps.Geocoder();
    if (mapValueSelector=='address' && mapAddress) {
        geocodeAddress(geocoder, map, mapAddress, markerLabel);
    } else if (mapValueSelector=='Lat/Lng' && mapLatitude && mapLongitude){
        var myCenter = new google.maps.LatLng(parseFloat(mapLatitude), parseFloat(mapLongitude));
        var marker = new google.maps.Marker({
            map : map,
            label : markerLabel,
            position : myCenter
        });
    }else{
		$("#map").hide();
    }
}

function geocodeAddress(geocoder, resultsMap, mapAddress, markerLabel) {
    geocoder.geocode({
        'address' : mapAddress
    }, function(results, status) {
        if (status === 'OK') {
            resultsMap.setCenter(results[0].geometry.location);
            var marker = new google.maps.Marker({
                map : resultsMap,
                label : markerLabel,
                position : results[0].geometry.location
            });
        }
    });
}

var splitTitleContainer = (function ($) {
  var splitTitleContainer = {};

  splitTitleContainer.init = function () {
    $(document).ready(function () {
      var SINGLE_LINE_HEIGHT = 22
      $('.cmp-split-tile .card-wrapper .tile-card .card').click(function () {
            this.querySelector('.card-link').click();
          });
      $('.mini-box .mini-content').each(function () {
        if (parseInt($(this).find('.title').css('height')) > SINGLE_LINE_HEIGHT) {
          $(this).find('.desc').attr('style', '-webkit-line-clamp: 2')
        }
      })
      // // 处理unpublish或者错误的地址隐藏split title card
      // $.each($('.tile-card'), function(item, index){
      //   var self = this
      //   var splits = $(self).find('.split-tile')
      //   $.each(splits, function(data,i){
      //     var _this = this
      //     var $href = $(_this).find('.card-link').attr('href')
      //     $.ajax({
      //       type: 'get',
      //       cache: false,//true的话会读缓存,第二次的时候得到的是上次访问的结果，而不是重新到服务器获取。false的话会在url后面加一个时间缀，让它跑到服务器获取结果。cache只有GET方式的时候有效。
      //       url:  $href,
      //       dataType: "jsonp", //跨域采用jsonp方式
      //       processData: false,//processData 默认为true，当设置为true的时候,jquery ajax 提交的时候不会序列化 data，而是直接使用data，false会序列化。
      //      // timeout:3000,//设置超时 ‘0’：为永不超时，当请求超时后会进入error，可以在error中做超时的处理。
      //       complete: function (data) {
      //           //data.status 请求url地址的状态码，以此来判断url是否有效可以访问。
      //           if (data.status==200) {
      //             console.log('000',$(_this))
      //           } else {
      //               $(_this).hide();
      //           }
      //       },
      //       error:function (){

      //       }
      //   });
      //   })
      // })
    });
  };

  return splitTitleContainer;
}($));

splitTitleContainer.init();
var socialShare = (function($){

    var socailShare = {};
    socailShare.init = function(){
         $(document).ready(function(){

            var share = $('.cmp-socail-share');
            var shareDefault = $(share).find('.share-default');
            var shareOpen = $(share).find('.share');
            $('.share-button-wrap',share).click(function(e){
                shareOpen.addClass('open');
                shareDefault.addClass('close');
                e.stopPropagation();
                $('.share-txt, .share-button-img').css('color', '#989898');
            });

            $('.close-btn').click(function(e){
                shareOpen.removeClass('open');
                shareDefault.removeClass('close');
                e.stopPropagation();
            });


            $('.copy-link').click(function(e){
                var shareShortLinkUrl =  $(this).attr("data-share-uri");
                copyToClipBorad(shareShortLinkUrl);
            })


            function copyToClipBorad(shareShortLinkUrl){
                var tHtml;

                var clip = new ClipboardJS('.copy-link',{
                    text:function(){
                        return window.location.origin + '/' + shareShortLinkUrl;
                    }
                });
                clip.on('success',function(e){
                    tHtml = "<div id='copy-link-toast'><img src='/etc/clientlibs/it/resources/icons/icon-success.png'/>"+Granite.I18n.get('Copied link successfully')+"</div>"
                    $('body').append(tHtml);
                    clip.destroy();
                });
                clip.on('error',function(e){
                    tHtml = "<div id='copy-link-toast'><img src='/etc/clientlibs/it/resources/icons/error.png'/>"+Granite.I18n.get('Copied Error')+"</div>"
                    $('body').append(tHtml);
                });

                setTimeout(function () {
                    $('body').find("#copy-link-toast").remove();
                }, 2500);
            }

         });
    };
    return socailShare;
}($));

socialShare.init();
$(document).ready(function () {

  function BuryingPointFn(element, preModule) {
    var href = $(element).attr('href')
    var lastHrefIndex = lastNode(href);
    $(element).attr('data-at-module', preModule + lastHrefIndex);
  }

  $.each($('.product-categories-comp  .products .products-links'), function (index, item) {
    var preModule =$(this).attr('data-at-module')
    BuryingPointFn(item, preModule)
  })

  $.each($('.product-categories-comp'),function(){
    if($(this).attr('data-style')=='Style2'){
      $(this).find('.products').addClass('new-style')
    }
  })

})

$(document).ready(function() {
    $(".links-date.pressDate").each(function(){
        var lang = $("[lang]").attr("lang");
        if(lang =="ar") {
            lang = "en";
        }
        var date = new Date($(this).html());
        $(this).html(date.toLocaleDateString(lang));
    });
});
/**
 * 2020/08/24
 * scroll BUG
 */

 var techSpecs = (function ($) {
    var techSpecs = {};
    //移动端
    techSpecs.contentClick = function () {
        $('.tech-specs-accordio-mobile-content .tech-specs-accordio-mobile-list .nav-item .main-title').on('click',function () {
            var $this = $(this);
            var $itemContent = $this.closest('.nav-item').find('.main-content');
            $itemContent.slideToggle('fast', function () {
                $this.parent().toggleClass('active');
            })
        })
    };

    techSpecs.downloadSpecification = function () {
        var $downloadBtn = $('.tech-specs-accordion-wrapper .download-btn-link button');
        // var pdf = new jsPDF("l", "mm", "a4");
        // $downloadBtn.on('click', function () {
        //     pdf.addHTML(document.getElementsByClassName('tech-specs-accordion-wrapper'), function () {
        //         pdf.save('sample-file.pdf');
        //     });
        // });
    };
    techSpecs.initTitleUpercase = function () {
        if (JudgeWebLanguage('ru')) {
            $('.tech-specs-accordion-wrapper').addClass('isru')
        }
    };
  
  
    techSpecs.initSpecScroll = function () {
        var $techSpecsAccordion = $(".tech-specs-accordion-wrapper");
        $techSpecsAccordion.each(function(){
            var $techSpecsTitles = $(this).find('.tech-specs-items-title__name');
            var $techSpecsDescList = $(this).find('.tech-specs-items-description');
            var $techSpecsDescListWrapper = $(this).find('.tech-specs-items-description-wrap');
            $techSpecsTitles .bind('click', function (e) {
                e.preventDefault(); // prevent hard jump, the default behavior
  
                var targetIndex = $(this).index();
                var totalScrollHeight = 0;
                for (var i = 0; i < targetIndex; i++) {
                    totalScrollHeight += $($techSpecsDescList[i]).outerHeight();
                }
                // perform animated scrolling by getting top-position of target-element and set it as scroll target
                $techSpecsDescListWrapper.stop().animate({
                    scrollTop: totalScrollHeight
                }, 300);
  
                return false;
            });
  
  
            $techSpecsDescListWrapper.scroll(function () {
                var scrollDistance = $(this).scrollTop();
                var totalScrollHeight = 0;
    if($(this).children("ul:last-child").height() < $(this).height() - 50){
              $(this).children("ul:last-child").css({'marginBottom':$(this).height()- $(this).children("ul:last-child").height()-50+'px'})
          }
                // Assign active class to nav links while scolling
                $techSpecsDescList.each(function (i) {
                    totalScrollHeight += $(this).outerHeight();
                    if (scrollDistance <= (totalScrollHeight - $(this).height()/2)) {
                        if($techSpecsTitles.hasClass('active')){
                            $techSpecsTitles.removeClass('active');
                        }
  
                        var target = $(this).attr('data-target');
                        $('.tech-specs-accordion-wrapper .tech-specs-items-title__link[data-target="' + target + '"]').closest($techSpecsTitles).addClass('active');
                        return false;
                    }
                });
            }).scroll();
        });
  
    };
  
    techSpecs.initTabCarouselItems = function () {
        var items = $('.carousel-inner  .tech-specs-items-container');
  
        for (var i = 0; i < items.length; i += 1) {
            items.slice(i, i + 1).wrapAll('<div class="carousel-item"></div>');
        }
  
        $('.carousel-inner .carousel-item:first-child').addClass('active');
    }
  
    techSpecs.init = function () {
        $(document).ready(function () {
            techSpecs.initTitleUpercase();
            techSpecs.downloadSpecification();
            techSpecs.initSpecScroll();
            techSpecs.initTabCarouselItems();
            techSpecs.contentClick();
            // 处理specItemValue的回车
            var details = $('.tech-specs-items-description__title-details')
               // console.log('currenDivs', currenDivs)
             $.each(details, function(index, item){
                var innerHTML = ''
                var currenDivs = JSON.stringify($(item).text()).split('\\n')
                if(currenDivs.length>1){
                    $.each(currenDivs, function(index,item1){
                        var vHeight = index === currenDivs.length -1 ? '0.5em' :'0rem' 
                        innerHTML += "<p class='mb-p' style='margin-bottom:" + vHeight + ";height:auto;'>"+this.replace('\\', '').replace('"', '')+"</p>"
                    })
                    $(this).html(innerHTML)
                }
             })   
        });
    };
    return techSpecs;
  }($));
  
  techSpecs.init();
var courseEvents = (function ($) {

  var courseEvents = {};
  courseEvents.events = function () {
    var module = $('.course [data-ids]');
    $.each(module, function (i, v) {
      var idsData = $(v).data('ids');
      if (idsData) {
        $.ajax({
          type: 'GET',
          url: "/bin/hikvision/getCourseInfo.json?id=" + idsData,
        }).done(function (data) {
          if (data.courseInfo) {

            var tpl = $("#course-template").html();
            var template = Handlebars.compile(tpl);
            var category = {"courses": data.courseInfo};
            $(v).find(".description-wrapper").html(template(category.courses));
          }
        }).fail(function (data) {
          console.log(data.responseText);
        }).always(function () {
          //$(".verification img").attr("src","/bin/hikvision/kaptcha.jpg?k=" + new Date().getTime());
        });
      }
    });

  };
  $(document).ready(function () {
    courseEvents.events();
  });
  return courseEvents;
}($));
courseEvents.init;

var buttonEvents = (function ($) {
  var buttonEvents = {};
  var getUrlRelativePath = function () {
    var url = $('.header-wrapper').attr('data-product-select');
    var arrUrl = url.split("//");

    var start = arrUrl[0].indexOf("/");
    var relUrl = arrUrl[0].substring(start);

    if (relUrl.indexOf("?") != -1) {
      relUrl = relUrl.split("?")[0];
    }
    return relUrl.replace(".html", "");
  };

  function redirect(url) {
    $.ajax({
      type: 'GET',
      url: url,
      data: {
        path: encodeURI(getUrlRelativePath())
      },
    }).done(function (data) {
      if (data && data.path) {
        window.location = data.path;
      } else {
        window.alert("Email confirm has an error, please contact the support!");
      }
    }).fail(function (result) {
      window.alert("Email confirm has an error, please contact the support!");
    });
  }

  buttonEvents.init = function () {
    $(document).ready(function () {
      var emailConfirm = $('.button-cmp').data('emailconfirm');
      var showAgreement = $('.button-cmp').data('showagreement');
      $('.download-agreement-link').on('click',function(e){
        var link=$(this).attr('data-link')
        var pageTitle=$('#header').attr('data-page-title')
        var dataLable= $(this).text();
        if(window.location.href.indexOf('/cn/support/Downloads') > -1){
          var analyticsStr='下载::button::跳出弹窗::[file-link]'+link+'::'+pageTitle
          HiAnalyticsCn.clickDown(analyticsStr)
        } else {
          var atButton = $(this).parent().parent().attr('class').split('-')
          var compnentName = atButton[0] === 'offering'? atButton[0] : atButton[0] + '-' + atButton[1]
          window.compnentName = compnentName
          var atModule = $(this).data('pre-module')+'::' + lastNode($(this).attr('data-href')) + atModel.atSpliter + window.location.href.replace('#download-agreement','')
          atModel.doAtEvent(atModule , 'download', e); 

          var analyticsStr = dataLable+'::button::跳出弹窗::'+lastNode(link)+'::'+pageTitle
          HiAnalyticsCn.clickDown(analyticsStr)
        }
      })
      $('.button-cmp .hiknow-button a:not(.download-agreement-link), .button-cmp .hiknow-view a').on('click',function(){
        var link=$(this).attr('data-href') || $(this).attr('href')
        var pageTitle=$('#header').attr('data-page-title')
        var dataLable= $(this).text();
        var analyticsStr = dataLable+'::button::跳转页面::'+lastNode(link)+'::'+pageTitle
        HiAnalyticsCn.clickDown(analyticsStr);
      })
      if (emailConfirm) {
        var query = window.location.search.substring(1);
        var btnUrl = $('.button-cmp .hiknow-button a').data('href');
        var viewUrl = $('.button-cmp .hiknow-view a').data('href');
        if (btnUrl) {
          if (btnUrl.indexOf('?') >= 0) {
            btnUrl += '&' + query;
          } else {
            btnUrl += '?' + query;
          }
        }
        if (viewUrl) {
          if (viewUrl.indexOf('?') >= 0) {
            viewUrl += '&' + query;
          } else {
            viewUrl += '?' + query;
          }
        }
        $('.button-cmp .hiknow-button a').on('click', function () {
            setSubmittedPageUrlCookie("NewsLetterUrl");
            setSubmittedPageUrlCookie("contactUsUrl");
            $(this).attr('disabled', 'disabled');
            redirect(btnUrl);
        });
        $('.button-cmp .hiknow-view a').on('click', function () {
            setSubmittedPageUrlCookie("NewsLetterUrl");
            setSubmittedPageUrlCookie("contactUsUrl");
          $(this).attr('disabled', 'disabled');
          redirect(viewUrl);
        });

      } else {
        $('.button-cmp .hiknow-button a').on('click', function () {
            setSubmittedPageUrlCookie("NewsLetterUrl");
            setSubmittedPageUrlCookie("contactUsUrl");
        });
        $('.button-cmp .hiknow-view a').on('click', function () {
            setSubmittedPageUrlCookie("NewsLetterUrl");
            setSubmittedPageUrlCookie("contactUsUrl");
        });
        var btns = $('.button-cmp .hiknow-button a, .button-cmp .hiknow-view a');
        $.each(btns, function (key, val) {
          var checkLogin = $(val).data('download-checklogin');
          var checkLoginCn = $(val).data('download-checklogin-cn');
          var btnUrlOrg = $(val).attr('href');
          if (showAgreement || checkLogin || checkLoginCn) {
            var btnUrl = btnUrlOrg;
            btnUrl = header.checkLoginStatusForDownload(btnUrl, val);
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
          } else {
            var paths = btnUrlOrg.split('.');
            if (paths > 1) {
              var extension = paths[1];
              if (extension.toLowerCase() != 'html') {
                $(val).removeClass('at-navigation');
                $(val).addClass('at-download');
              }
            }
          }
        });
      }
    });
  };
  return buttonEvents;
}($));
buttonEvents.init();

var accessoryListOptions = (function ($) {
    var debug_mode = false;
    console.log('init accessory-list (', (debug_mode) ? "debug mode" : "standard mode", ")");

    var filterOptions = {};
    var i18n_next = Granite.I18n.get("next");
    var i18n_back = Granite.I18n.get("back");
    var i18n_detail = Granite.I18n.get("Details");
    filterOptions.init = function () {
        $(document).ready(function () {
            var $filter = $(".accessory-list");
            if (!$filter.length) {
                return;
            }

            var _filter_data;
            var _last_model_obj;
            // root level prop
            var _products_orig;
            // root level prop
            var _products_filtered = [];
            var _filter_state = {
                "model": {},
                "includes": []
            };

            /**
             * images lazyload
             */
            var invokeLazyLoad = function () {
                $filter.find('.lazy').lazyload();
            };

            var initFilterIncludeOptions = function () {
                _filter_state.includes = [];
                $.each($filter.find('.filter-card[data-title-type=subcategory] .include-subcategory'), function (i, obj) {
                    _filter_state.includes.push($(obj).val());
                    console.log('_filter_state.includes',_filter_state);
                });
            };

            function checkIncludeSubcategory(link) {
                if (_filter_state.includes) {
                    return _filter_state.includes.indexOf(link) > -1
                }
                return false;
            }

            function addIncludeSubcategory(link) {
                if (!checkIncludeSubcategory(link)) {
                    _filter_state.includes.push(link);
                }
            }

            function removeIncludeSubcategory(link) {
                var index = -1;
                if (_filter_state.includes) {
                    index = _filter_state.includes.indexOf(link);
                }
                if (index >= 0) {
                    _filter_state.includes.splice(index, 1);
                }
            }

            initFilterIncludeOptions();

            // root level prop, keep track of all states of filter
            // options
            var tpl = $("#result-grid-product-template").html();
            var template = Handlebars.compile(tpl);
            var url = $filter.find('.filter-container').data(url);
            if (url != null && url['url']) {
                var source = url['url'];
                console.log('source',source);
                $.ajax({
                    url: source + ".json",
                    dataType: 'json',
                    type: 'get',
                    contentType: 'application/json',
                    success: function (data) {
                        if (debug_mode) {
                            console.log('go with debug_mode ');
                            data = test_sample;
                        }
                        _filter_data = data.filters;
                        // store original source, apply no filter at beginning
                        _products_filtered = _products_orig = data.products;
                        // Populate category dropdown
                        renderModelDropdown(data.filters);

                        // render products
                        renderProducts(_products_filtered);
                    },
                    error: function (error) {
                        console.log(error);
                    }
                });
            }

            // binding reset filter event
            $('body').on('click', '.accessory-list .advanced-filter-reset', function (e) {
                $('.filter-card[data-title-type=category] input').val('');
                $('.filter-card[data-title-type=subcategory] input').prop('checked', true);

                _filter_state.model = {};
                initFilterIncludeOptions();

                renderProducts(_products_orig);

                var url = window.location.href;

                url = url.replaceAll("%20", "_");
                atModel.doAtEvent("accessor-filter::reset" + atModel.atSpliter + url, "action", e);
            });

            var $accordion = $filter.find("#advanced-filter-accordion");
            var $categorySelected = $filter.find('.category-selected-option');

            // -----------------------------
            // model selection
            // -----------------------------
            $filter.find('.category-list-dropdown').on('click', '.list-options', function (e) {

                var $category = $(this);
                var selectedOption = $category.text();
                var selectedObj = _filter_data.filter(function (obj) {
                    return (obj.title == selectedOption);
                })[0];
                _last_model_obj = selectedObj;
                _filter_state["model"] = selectedObj;
                applyFilter(_products_orig, _filter_state);

                doAtEvent(e, selectedObj.title ? selectedObj.title : $(event.currentTarget).text(), "action", "model");
            });

            // -----------------------------
            // setup Offer selection
            // -----------------------------
            $.each($filter.find('[data-title-type="subcategory"]'), function (i, obj) {
                var $subcategory = $(obj);
                var offerName = $subcategory.find(".collapsed.card-link").text();
                // setup accordions
                $subcategory.find(".collapsed.card-link").prop("href", "#" + offerName);
                $subcategory.find(".wrapper").prop("id", offerName);

                $subcategory.find('ul li input').on("change", function (e) {
                    var $subcategoryInput = $(this);
                    var link = $subcategoryInput.val();
                    var checked = $subcategoryInput.prop("checked");
 
                    if (!checked) {
 if (link === 'all') {
                            $subcategoryInput.closest('ul').find('input').each(function () {
                                if (e.target !== this) {
                                    removeIncludeSubcategory($(e.target).val());
                                    $(this).prop('checked', false);
                                    $(this).trigger('change');
                                }
                            });
                        } else {
                            removeIncludeSubcategory(link);
                            $subcategoryInput.closest('ul').find('input[isall]').prop('checked', false);
                        }
                    } else {
                        if (link === 'all') {
                            $subcategoryInput.closest('ul').find('input').each(function () {
                                if (e.target !== this) {
                                    addIncludeSubcategory($(e.target).val());
                                    $(this).prop('checked', true);
                                    $(this).trigger('change');
                                }
                            });
                        } else {
                            addIncludeSubcategory(link);
                            var sameStatus = true;
                            $subcategoryInput.closest('ul').find('input').each(function () {
                                if (e.target != this && !$(this).attr('isall')) {
                                    if (!$(this).prop("checked")) {
                                        sameStatus = false;
                                        return false;
                                    }
                                }
                            });
                            $subcategoryInput.closest('ul').find('input[isall]').prop('checked', sameStatus);
                        }
                    }

                    applyFilter(_products_orig, _filter_state);

                    var forLabel = $(e.currentTarget).attr("id");
                    var atTitle = $subcategory.find("label[for='" + forLabel + "']").text();
                    atTitle = checked ? "add_" + atTitle : "remove_" + atTitle;
                    doAtEvent(e, atTitle, "action", offerName);
                });

            });

            // Textbox to filter dropdown options
            $filter.find('.selected-option-wrapper').find(".selected-option").on(
                "keyup", function (e) {
                    var $selectedOption = $(this);
                    var value = $selectedOption.val().toLowerCase();
                    $selectedOption.closest('.category-dropdown-wrapper')
                        .find('.category-dropdown').find("*")
                        .filter(function () {
                            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
                        });

                    // reset model selection if input is empty
                    if (value.length === 0) {
                        _filter_state["model"] = {};
                        applyFilter(_products_orig, _filter_state);
                    }

                });

            // Setting input box value on dropdown option selection
            $filter.find('.category-dropdown').on('click', '.list-options', function () {
                $(this).closest('.category-dropdown-wrapper').find(".selected-option").val($(this).text());
            });

            var $categorySelector = $filter.find('.category-dropdown-wrapper');
            $categorySelector.on('click', function (e) {
                var $categorySel = $(this);
                e.stopPropagation();
                $categorySel.find('.category-dropdown').toggleClass('show remove-border');
                $categorySel.closest($categorySelector).toggleClass('remove-border');
                $categorySel.closest($categorySelector).find('.arrow-icon').toggleClass('arrow-up');
            });

            var renderModelDropdown = function (filters) {
                $.each(filters, function (i, obj) {
                    $accordion.find(".card").each(function () {
                        var $this = $(this);
                        var $categoryList = $(this).find('.category-list-dropdown');
                        if ($this.is('[data-title-type]')) {
                            if ($this.attr('data-title-type') == 'category') {
                                $categoryList.append('<li class="list-options"><div id="category-' + i + '">'
                                    + obj.title + '</div></li>');
                            }
                        }
                    });
                });
            };

            var createPagination = function (products) {
                $filter.find("#layout-pagination-wrapper").pagination({
                    items: products.length,
                    itemsOnPage: 10,
                    cssStyle: "light-theme",
                    currentPage: 1,
                    edges: 1,
                    useAnchors: false,
                    prevText: i18n_back,
                    nextText: i18n_next,
                    onPageClick: function (currentPageNumber) {
                        fetchResult(products, 10, (10 * (currentPageNumber - 1)));
                    }
                });
            };

            var fetchResult = function (products, limit, offset) {
                var matchedProducts = [];
                var end = offset + limit < products.length ? offset + limit : products.length;
                for (var i = offset; i < end; i++) {
                    products[i].details = i18n_detail;
                    matchedProducts.push(products[i]);
                }
                $filter.find('#layout4-pagination').empty().html(template(matchedProducts));
                invokeLazyLoad();

                // for at
                atModel.initAtNavigation(true, ".accessory-list #layout4-pagination .layout4-content-wrapper a.at-lazy");
            };

            // Populate products
            var renderProducts = function (data) {
                fetchResult(data, 10, 0);
                createPagination(data);
                productComparisonBottom.initCompareData();
            };

            var applyFilter = function (products, state) {
                var result = products.filter(function (product) {
                    // ------------------------
                    // filter by model
                    // ------------------------
                    // must have detailPath
                    if (product.detailPath === undefined)
                        return false;

                    // model is selected, then exam it
                    if (state.model && state.model.accessories !== undefined) {
                        // check if
                        var matchPath = state.model.accessories.includes(product.detailPath);
                        if (!matchPath)
                            return false;
                    }

                    // ------------------------
                    // filter by offer
                    // ------------------------
                    // must have offer
                    if (product.subseries === undefined)
                        return false;
                    if (state.includes.includes(product.subseries))
                        return true;
                    return false;
                });
                // end filter

                renderProducts(result);
            }

            // do at event
            var doAtEvent = function (event, title, ationType, optionType) {
                var atTitle = '';
                if (optionType.toLowerCase() === "model") {
                    atTitle = 'accessory-filter::model' + atModel.atSpliter + title;
                } else {
                    atTitle = 'accessory-filter' + atModel.atSpliter + optionType + atModel.atSpliter + title;
                }
                if (atTitle.length === 0) {
                    atTitle = 'accessory-filter' + atModel.atSpliter + optionType + atModel.atSpliter + title;
                }
                var url = window.location.href;

                url = url.replaceAll("%20", "_");
                atModel.doAtEvent(atTitle + atModel.atSpliter + url, ationType, event);
            };

            // ------------------------------------------------------------------
            // Filters
            // ------------------------------------------------------------------

            // ------------------------------------------------------------------
            // Utils
            // ------------------------------------------------------------------

            // RWD controls
            var rwdInit = function () {
                // dynamic control, static control (takes place when loaded) is set with CSS
                window.matchMedia("(min-width: 992px)").addListener(rwdControl);
                $(".advanced-filter-button").click(function () {
                    $(".filter-container").show();
                    $(".advanced-filter-inner").show('fast');
                    $(".advanced-filter-button").hide("fast");
                });

                $(".advanced-filter-close-icon").click(function () {
                    $(".advanced-filter-inner").hide('slidedown');
                    $(".advanced-filter-button").show("fast");
                });
            }

            var _rwdDesktopType = true;
            var rwdControl = function (event) {
                if (event.matches) {
                    _rwdDesktopType = true;
                    $(".advanced-filter-inner").show();
                    $(".advanced-filter-button").hide();
                } else {
                    _rwdDesktopType = false;
                    $(".advanced-filter-inner").hide();
                    $(".advanced-filter-button").show();
                }
            }

            rwdInit();
        });
    };
    // end filterOptions init

    return filterOptions;
})($);
accessoryListOptions.init();

var downloadAgreementModule = (function ($) {
  var downloadAgreement = {};
  var targetBoolean = 'x';
  downloadAgreement.init = function () {
    $(document).ready(function () {
      var pageTitle=$('#header').attr('data-page-title')
      var link = $('.header-wrapper').attr('data-download-agreement');
      // $('.download-agreement-wrapper .modal-content .agreement-wrapper .generalt-teams-link').attr('href', link);

      $('.download-agreement-wrapper .modal-content footer .agree').on('click', function (e) {
        e.stopPropagation()
        targetBoolean = 'agree'
        // var hrefTarget =  $(event.target).data('href')
        // window.open(hrefTarget, '_blank')
        // button组件 同意下载事件埋点
        if(isCnAnalytics && $(this).data('contact') == 'download-button'){
          var href=$(this).attr('href')  
          var analyticsAgreeData='同意::download agreement::下载::[file-link]'+href+"::"+pageTitle
          HiAnalyticsCn.clickDown(analyticsAgreeData)
        } else {
          var atButton = $('.download-agreement-link, .assets, .firmware-series,.main-category-link').parent().parent().attr('class').split('-')
          var compnentName =  window.compnentName? window.compnentName: atButton[0] === 'offering'? atButton[0] : atButton[0] + '-' + atButton[1]
          var atHref = $(this).attr('href')
          var arrSplit = atHref.split('/')
          var string = arrSplit.length ? $(this).text().trim() + '_'+ lastNode(atHref).replace('&', '') :$(this).text().trim()
          //  atModel.doAtEvent('agrement_button::'+ compnentName + '::' + $(this).text().trim() + atModel.atSpliter + window.location.href.replace('#download-agreement',''), 'action', e);
          atModel.doAtEvent('agrement_button::'+ compnentName + '::' +string+ atModel.atSpliter + window.location.href.replace('#download-agreement',''), 'action', e);
        //  atModel.doAtEvent('agrement_button:222:333', 'action', e);
        }
      //   $('.modal-backdrop.fade').removeClass("modal-open").hide()
       //  $('.modal.fade').removeClass("show").hide()
       $('.download-agreement-wrapper .modal-content header .close').click();
      });
      $('.download-agreement-wrapper .modal-content footer .disagree').on('click', function (e) {
       // e.stopPropagation();
        var atButton = $('.download-agreement-link, .assets, .firmware-series,.main-category-link').parent().parent().attr('class').split('-')
        var compnentName =  window.compnentName? window.compnentName: atButton[0] === 'offering'? atButton[0] : atButton[0] + '-' + atButton[1]
        var atHref =  $(this).parent().find('a').attr('href')
        var arrSplit = atHref.split('/')
        var string = arrSplit.length ? $(this).text().trim() + '_'+ lastNode(atHref).replace('&', '') :$(this).text().trim()
        atModel.doAtEvent('agrement_button::'+ compnentName + '::'+string+ atModel.atSpliter + window.location.href.replace('#download-agreement',''), 'action', e);
        $('.modal-backdrop.fade').removeClass("modal-open").hide()
        $('.modal.fade').removeClass("show").hide()
      })
      $('.download-agreement-wrapper .modal-content header .close').on('click', function (e) {
       // e.stopPropagation();
       if(targetBoolean!= "agree" ){
        var atButton = $('.download-agreement-link, .assets, .firmware-series,.main-category-link').parent().parent().attr('class').split('-')
        var compnentName =  window.compnentName? window.compnentName: atButton[0] === 'offering'? atButton[0] : atButton[0] + '-' + atButton[1]
         var atHref = $(this).parent().parent().find('footer .a-download-href').attr('href')
         var arrSplit = atHref.split('/')
         var string = arrSplit.length ? $(this).text().trim() + '_'+ lastNode(atHref).replace('&', '') :$(this).text().trim()
         atModel.doAtEvent('agrement_button::'+ compnentName + '::'+string+ atModel.atSpliter + window.location.href.replace('#download-agreement',''), 'action', e);
       }
         setTimeout(function(){
          targetBoolean = "x"
         }, 500)
         //  $('.modal-backdrop.fade').removeClass("modal-open").hide()
      //   $('.modal.fade').removeClass("show").hide()
      })
      $('.download-agreement-wrapper .modal-content .agreement-wrapper a').on('click',function(e){
        e.preventDefault()
        var ahref = $(this).attr('href')
        if(isCnAnalytics && $(this).attr('data-contact')== 'download-button' ){
          var analyticsLinkData='《海康威视软件许可协议》::download agreement::跳转页面::'+'[complete-link]https://www.hikvision.com/cn/support/Downloads/_/'+'::'+pageTitle
          HiAnalyticsCn.clickDown(analyticsLinkData)
        }
        setTimeout(function() {
          window.open(ahref, '_self')
        }, 500)
      })

      $('#download-agreement').on('show.bs.modal', function (e) {
        e.stopPropagation();
     //   $('.download-agreement-wrapper .modal-content footer .agree').attr('data-href', $(event.target).data('link'));
        //如果组件用于cn站 download-agreement-link 为点击事件添加埋点
        if(isCnAnalytics && $(event.target).hasClass('download-agreement-link')){
          $('.download-agreement-wrapper .modal-content footer .agree').attr('data-contact','download-button')
          $('.download-agreement-wrapper .modal-content a').attr('data-contact','download-button')
        }
        // 如果点击字需要单独处理===因为多包裹了一层h3
         var targetDiv = $(event.target)
        if($(event.target).hasClass('h3-seo') || $(event.target).hasClass('h4-seo')){
          targetDiv = $(event.target).parent()
        } else {
          targetDiv = $(event.target)
        }
        $('.download-agreement-wrapper .modal-content footer .agree').attr('href', $(targetDiv).data('link'));
      })

    });
  };

  return downloadAgreement;
})($);

downloadAgreementModule.init();
$(document).ready( function() {
    // convert from BaiDu location to GaoDe
    var convertLocation = function(longitude, latitude) {
      var x_pi = (3.14159265358979324 * 3000.0) / 180.0;
      var x = longitude - 0.0065;
      var y = latitude - 0.006;
      var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
      var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
      return {
        longitude: z * Math.cos(theta),
        latitude: z * Math.sin(theta)
      };
    };

    var buildServicePointItem = function(point) {
      var nameItem =
        '<div class="service-point-name">' + point.name + "</div>";
      var addressItem = point.address
        ? '<div class="service-point-address">地址: ' +
          point.address +
          "</div>"
        : "";
      var faxItem = point.fax
        ? '<div class="service-point-fax">传真: ' + point.fax + "</div>"
        : "";
      var phoneItem = point.phone
        ? '<div class="service-point-phone">电话: ' + point.phone + "</div>"
        : "";
      return (
        '<div class="service-point-item">' +
        nameItem +
        addressItem +
        faxItem +
        phoneItem +
        "</div>"
      );
    };

    var addMarkers = function(map, points) {
        points.forEach(function (point) {
            if (point.longitude && point.latitude) {
                var icon = new AMap.Icon({
                    size: new AMap.Size(20, 20),
                    image: "/etc/clientlibs/it/resources/images/icon-map-point.png",
                    imageSize: new AMap.Size(20, 20),
                    retina: true
                });

                // var label = {
                //   content: '<span class="service-point-label">' + point.simpleName + "</span>",
                //   direction: "top"
                // };
                var label = {
                    content: '<span class="service-point-label">' + point.name + "</span>",
                    direction: "top"
                }
                var location = convertLocation(point.longitude, point.latitude);
                var marker = new AMap.Marker({
                    position: new AMap.LngLat(location.longitude, location.latitude),
                    title: point.name,
                    icon: icon,
                    // label: label,
                });
                if (point.simpleName === "喀什") {
                    var marker = new AMap.Marker({
                        position: new AMap.LngLat(location.longitude, location.latitude),
                        title: point.name,
                        icon: icon,
                        offset: new AMap.Pixel(-15, -15)
                    });
                }
                marker.on("click", function (e) {
                    console.log('point', points)
                    var infoWindow = new AMap.InfoWindow({
                        autoMove: true,
                        anchor: "bottom-center",
                        content: buildServicePointItem(point),
                        offset: new AMap.Pixel(0, -40)
                    });
                    var center = new AMap.LngLat(
                        location.longitude,
                        location.latitude
                    );
                    map.setCenter(center);
                    map.setZoom(map.getZoom() < 6 ? 6 : map.getZoom());
                    infoWindow.open(map, center);
                });
                map.add(marker);
            }
        });
        map.setFitView();
    };

    var initServicePointMap = function() {
      var $mapWrapper = $('#service-point-map-wrapper');
      if ($mapWrapper.length === 0) {
        return null;
      }

      var map = new AMap.Map($mapWrapper[0]);

      map.plugin(["AMap.ToolBar"], function() {
        var tool = new AMap.ToolBar({
          position: "RT",
          noIpLocate: true,
          liteStyle: true,
          locate: true
        });
        tool.on("location", function(e) {
          map.setCenter(e.lnglat);
          map.setZoom(12);
        });
        map.addControl(tool);
      });

      return map;
    };

    var buildCards = function(points, filter) {
      var $items = $(".service-point-items");
      $items.empty();
      points.forEach(function(point) {
        if (filter) {
          var name = point.name ? point.name.toLowerCase() : "";
          var address = point.address ? point.address.toLowerCase() : "";
          var phone = point.phone ? point.phone.toLowerCase() : "";
          var fax = point.fax ? point.fax.toLowerCase() : "";
          if (
            name.indexOf(filter.trim().toLowerCase()) === -1 &&
            address.indexOf(filter.trim().toLowerCase()) === -1 &&
            phone.indexOf(filter.trim().toLowerCase()) === -1 &&
            fax.indexOf(filter.trim().toLowerCase()) === -1
          ) {
            return;
          }
        }
        var pointItem = buildServicePointItem(point);
        $items.append($(pointItem).hide().fadeIn());
      });
      if ($items.children().length === 0) {
        $items.append('<div class="service-point-items-notice">未找到相关服务网点</div>');
      }
    };

    var map = initServicePointMap();
    if (!map) {
      return;
    }

    var spUrl = $(".service-point").attr("data-spUrl") + ".json";
    $.ajax({
      type : "GET",
      url : spUrl,
      success : function(data) {
        if (data && data.result) {
          var items = data.result.items;
          var points = items.map(function(item) {
            var name = item.localNAME3;
            var simpleName = name.replace("服务站", "");
            var address = item.localADDRESS;
            var longitude = item.localZJD;
            var latitude = item.localZWD;
            var phone = item.localPHONE;
            var fax = item.localFAX;
            return {
              name: name,
              simpleName: simpleName,
              address: address,
              longitude: longitude,
              latitude: latitude,
              phone: phone,
              fax: fax
            };
          });
          console.log('map', map, points)
          addMarkers(map, points);
          buildCards(points);

          $(".service-point-items-search .input-group-append").on("click", function() {
            var input = $(this).prev('input').val().trim();
            if (input) {
              buildCards(points, input);
            }
          });

          $('.service-point-items-search input').on('keypress', function(e) {
            if (e.which === 13) {
              buildCards(points, e.target.value);
            }
          });

          $('.service-point-items-search input').on('input', function(e) {
            if (!e.target.value && points.length !== $(".service-point-items").children().length) {
              buildCards(points);
            }
          });
        }
      },
      error : function(error) {
        console.log(error);
      }
    });
});

var youtubeLiveChat = (function ($) {
    var youtubeLiveChat = {};

    youtubeLiveChat.init = function () {
        $(function () {
            var videoId = $("#youtube-player").data("videoId")
            if (videoId) {
                if ($("#youtube-chat").length > 0) {
                    $("#youtube-chat").html('<iframe width="100%" height="100%" src="https://www.youtube.com/live_chat?v=' + videoId + '&embed_domain=' + document.location.hostname + '" frameborder="0"></iframe>')
                }
            }
            calcHeight()
            $(window).resize(function (e) {
                debounce(calcHeight, window)
            })

            function debounce(method, context) {
                clearTimeout(method.timeout);
                method.timeout = setTimeout(function () {
                    method.call(context);
                }, 200);
            }

            function calcHeight() {
                var width = $("#youtube-player").width()
                var height = width / 16 * 9
                $("#youtube-player").height(height)
            }


        })
    };

    return youtubeLiveChat;
}($));

youtubeLiveChat.init();
(function (document, $) {

  $(document).ready(function () {
    function hideNotice() {
      $(".notice-wrapper").modal('hide');
    }

    function autoOpen() {
      var interval = $(".notice-wrapper").data('interval');
      if (interval) {
        setTimeout(function () {
          $('.notice-wrapper .notice-container .notice-info-wrapper .lazy').lazyload();
          $(".notice-wrapper.modal").modal('show');
          $(".modal-backdrop").css('z-index', '11001');
        }, interval * 1000);
      } else {
        $('.notice-wrapper .notice-container .notice-info-wrapper .lazy').lazyload();
        $(".notice-wrapper.modal").modal('show');
        $(".modal-backdrop").css('z-index', '11001');
      }
    }

    function checkCookie(cname) {
      var noticeDisclaimer = storeManager.cookie.get(cname);
      if (noticeDisclaimer) {
        $(".notice-wrapper").modal('hide');
      } else {
        autoOpen();
      }
    }

    $('.notice-wrapper').off('hidden.bs.modal').on('hidden.bs.modal', function () {
      var isSession = true;
      var config = {
        name: storeManager.STORE_NAMES.noticeDisclaimer,
        value: new Date().getTime(),
        path: '/'
      };

      if ($('.notice-wrapper .notice-container .notice-footer-wrapper .notice-cancel').is(':checked')) {
        config.expirationDays = 365;
        isSession = false;
      }
      storeManager.cookie.set(config, true, isSession);
    });

    $('.notice-wrapper .notice-container .notice-footer-wrapper .notice-cancel').on('click', function () {
      hideNotice();
    });
    $('.notice-wrapper .notice-container .notice-footer-wrapper .checkbox-info').on('click', function () {
      hideNotice();
    });

    checkCookie(storeManager.STORE_NAMES.noticeDisclaimer);
  });

})(document, $);

function changePassWord() {

    var password = document.getElementById('newPassword').value;
    var hasNumber = /^(?=.*\d)/;//必须有数字
    var rules = [];
    var rule1, rule2, rule3, rule4, rule5 = false;
    if (hasNumber.test(password)) {
        document.getElementById('number').style['background-image'] = " url('/etc/clientlibs/it/resources/icons/gou.png')";
        document.getElementById('number').style['color'] = "#666666;";
        rule1 = true
    } else {
        document.getElementById('number').style['background-image'] = "url( '/etc/clientlibs/it/resources/icons/error.png')";
        document.getElementById('number').style['color'] = "#D7292F;";
        rule1 = false
    }
    var hsaUpper = /^(?=.*[A-Z])/;//必须有大写字母
    if (hsaUpper.test(password)) {
        document.getElementById('upper').style['background-image'] = " url('/etc/clientlibs/it/resources/icons/gou.png')"
        document.getElementById('upper').style['color'] = "#666666;";
        rule2 = true
    } else {
        document.getElementById('upper').style['background-image'] = "url( '/etc/clientlibs/it/resources/icons/error.png')"
        document.getElementById('upper').style['color'] = "#D7292F;";
        rule2 = false
    }

    var hasLower = /^(?=.*[a-z])/;//必须有小写字母
    if (hasLower.test(password)) {
        document.getElementById('lower').style['background-image'] = " url('/etc/clientlibs/it/resources/icons/gou.png')"
        document.getElementById('lower').style['color'] = "#666666;";
        rule3 = true
    } else {
        document.getElementById('lower').style['background-image'] = "url( '/etc/clientlibs/it/resources/icons/error.png')"
        document.getElementById('lower').style['color'] = "#D7292F;";
        rule3 = false
    }

    if (password.length >= 8 && password.length <= 20) {    //长度限制
        rule4 = true
    }else{
        rule4 = false
    }

    //过滤特殊字符
    var hasSpecia = /^(?=.*[@.!#$%&^*])/;
    if (hasSpecia.test(password)) {
        document.getElementById('specialChart').style['background-image'] = " url('/etc/clientlibs/it/resources/icons/gou.png')"
        document.getElementById('specialChart').style['color'] = "#666666;";
        rule5 = true
    } else {
        document.getElementById('specialChart').style['background-image'] = "url( '/etc/clientlibs/it/resources/icons/error.png')"
        document.getElementById('specialChart').style['color'] = "#D7292F;";
        rule5 = false
    }

    var isBy = false;
    if(!rule4){
        isBy = false
    } else {
        rules.push(rule1), rules.push(rule2), rules.push(rule3), rules.push(rule5);
        var count = 0;
        for(var i = 0; i < rules.length; i++){
            if(rules[i]){
                count++;
            }
        }
        if(count >= 3 ){
            isBy = true;
        }
    }

    if (isBy) {
        document.getElementById('password-info').style.display = 'none';
    } else {
        document.getElementById('password-info').style.display = 'inline';
    }
    return isBy;
}

function changeConfirmPassword() {
    var confirmPassword = document.getElementById('confirmPassword');
    var confirmPasswordValue = document.getElementById('confirmPassword').value;
    var password = document.getElementById('newPassword').value;
    var isBy = false
    if (confirmPasswordValue === password) {
        document.getElementsByClassName("confirm-password-message")[0].style.display = "none";
        confirmPassword.style.borderBottom = '1px solid #CCCCCC';
        isBy = true
    } else {
        document.getElementsByClassName("confirm-password-message")[0].style.display = "inline";
        confirmPassword.style.borderBottom = '1px solid #D7292F';
        isBy = false
    }
    return isBy
}

function changeCurrentPassWord() {
    var currnetPasswordValue = $('#currentPassword').val();
    var isBy = false;
    if(currnetPasswordValue && currnetPasswordValue != null && currnetPasswordValue.trim() != "") {
        document.getElementsByClassName("current-password-message")[0].style.display = "none";
        confirmPassword.style.borderBottom = '1px solid #CCCCCC';
        isBy = true
    } else {
        document.getElementsByClassName("current-password-message")[0].style.display = "inline";
        confirmPassword.style.borderBottom = '1px solid #D7292F';
        isBy = false
    }
    return isBy;
}

function confirmFun() {
    if (
        changeCurrentPassWord() &&
        changePassWord() &&
        changeConfirmPassword()
    ) {
        loginUtil.checkLogin(requestSubmit);
    }
}

function requestSubmit(){
    document.getElementById('loading-div').style.display = 'inline';
    document.getElementById('btnReset').disabled = 'disabled';
    var hikId = $.cookie("HIKID");
    var email = $.cookie("HIKEMAIL");
    //ticket 有效
    try {
      hikId = atob(hikId);
      email = atob(email);
    } catch (error) {
      console.log("Login Error:" + error);
    }
    var changePasswordUrl = $(".reset-article").attr("data-change-psd") + ".json";
    var passwordInfo = {};
    passwordInfo.hikId = hikId;
    passwordInfo.email = email;
    passwordInfo.currentPassword = document.getElementById('currentPassword').value;
    passwordInfo.newPassword = document.getElementById('newPassword').value;
    passwordInfo.confirmPassword = document.getElementById('confirmPassword').value;
    $.ajax({
        type: "post",
        url: changePasswordUrl,
        data: {
            "passwordInfo":JSON.stringify(passwordInfo)
        },
        async: true,
        success: function (data) {
            var classVal = document.getElementById('message-info').getAttribute('class');
            if (data.code === 200) {
                classVal = classVal.replace('message-box-error', 'message-box-success');
                document.getElementById('message-info').setAttribute('class', classVal);
                document.getElementById('message-info').innerText = Granite.I18n.get("success");
                delayFun(function(){
                    document.getElementById('loading-div').style.display = 'none';
                    document.getElementById('btnReset').removeAttribute('disabled');
                    //redirect to sso login page
                    removeLoginCookie("redirectUrl");
                    setLoginCookie("redirectUrl", $(".navbar-logo__wrapper a").attr("href"));
                    window.location.href = $("a.login").attr("href");
                });
            } else {
                document.getElementById('loading-div').style.display = 'none';
                document.getElementById('btnReset').removeAttribute('disabled');
                classVal = classVal.replace('message-box-success', 'message-box-error');
                document.getElementById('message-info').setAttribute('class', classVal);
                document.getElementById('message-info').innerText = Granite.I18n.get(data.failMsg);
                delayFun();
            }

        },
        error: function (data) {
            console.log('servlet error');
            if (data.code === 500) {
                document.getElementById('loading-div').style.display = 'none';
                document.getElementById('btnReset').removeAttribute('disabled');
                var classVal = classVal.replace('message-box-success', 'message-box-error');
                document.getElementById('message-info').setAttribute('class', classVal);
                document.getElementById('message-info').innerText = Granite.I18n.get(data.failMsg);
                delayFun();
            }
        }
    });
}

function delayFun(callback) {
    document.getElementById('global-message').style.display = 'block'
    setTimeout(function(){
        document.getElementById('global-message').style.display = 'none'
        if(callback){
            callback();
        }
    },3000);
}

var windowWidth = $(window).width();
$(document).ready(function() {
  if ($(window).width() >= 768) {
      initCardCarousel();
      var livePreviewWrapper = $(".live-preview-wrapper")
      livePreviewWrapper.each(function(){
          var tabItems = $(this).find(".live-preview-nav .live-preview-nav-item");
          tabItems.on("click",function(){
              tabItemClick(this);
          });
         if(tabItems.length < 3) {
              $(this).find(".live-preview-nav").addClass("justify-content-center");
         }
      });
  }else {
      initTabCarousel();
  }
  globalSettings.init();
});

var getMatchCarousel = function(dataCarousel) {
    var matchedCarousel;
    $(".live-preview-list .live-preview-item").each(function(){
        if($(this).attr("data-carousel") == dataCarousel) {
            matchedCarousel = $(this);
        }
    });
    return matchedCarousel;
}

var initCardCarousel = function() {

  var activeCardCarousel = $(".live-preview-item.active .live-preview-carousel");
  activeCardCarousel.each(function(){
      var length = $(this).find(".live-preview-carousel-card").length
      if(length > 4){
          if(!$(this).hasClass("slick-slider")) {
              $(this).find(".live-preview-carousel-card").removeClass("col-3");
              toggleCardCarouselSlick($(this), true);
          }
      }
  })
}

var toggleCardCarouselSlick = function(activeCardCarousel,arrows) {

    activeCardCarousel.slick({
        dots: false,
        slidesToShow: 4,
        slidesToScroll: 4,
        arrows: arrows,
        accessibility: true,
        prevArrow: "<button class='slick-prev slick-arrow live-preview-btn' type='button' style=''><span></span></button>",
        nextArrow: "<button class='slick-next slick-arrow live-preview-btn' type='button' style=''><span></span></button>",
        useCss: true,
        lazyload: "ondemand",
        unslick: true
    });
}

var initTabCarousel = function() {
  $(".live-preview-wrapper").each(function(){
      var livePreviewNav = $(this).find(".live-preview-tab .live-preview-nav");
      var livePreviewNavItems = livePreviewNav.find(".live-preview-nav-item");
      livePreviewNavItems.each(function(){
          var dataCarousel = $(this).attr("data-carousel");
          var matchedCarousel = getMatchCarousel(dataCarousel);
          matchedCarousel.find(".live-preview-carousel-card").removeClass("col-3");
          $(this).find(".live-preview-nav-item-inner").append(matchedCarousel);
      });
      if(livePreviewNavItems.length >1){
          toggleTabCarouselSlick(livePreviewNav);
      }
  });
  var slickSlides = $(".slick-slide");
  slickSlides.each(function(){
    $(this).attr("data-slide-height",$(this).height());
  });
  setTabCarouselHeightForMobile();
}

var toggleTabCarouselSlick = function(livePreviewNav) {
  livePreviewNav.slick({
      dots: false,
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: true,
      accessibility: true,
      useCss: true,
      prevArrow: "<button class='slick-prev slick-arrow btn live-preview-btn' type='button' style=''><img src='/etc/clientlibs/it/resources/icons/icon-prev.png' alt=''></button>",
      nextArrow: "<button class='slick-next slick-arrow btn live-preview-btn' type='button' style=''><img src='/etc/clientlibs/it/resources/icons/icon-next.png' alt=''></button>",
      lazyload: "ondemand"
  });

  livePreviewNav.on('afterChange', function() {
      var slickCurrentHeight = livePreviewNav.find(".slick-current").attr("data-slide-height");
      livePreviewNav.find(".slick-track").height(slickCurrentHeight);
  });
}

var tabItemClick = function(item){
  var livePreviewTab = $(item).parents(".live-preview-tab");
  var activeLivePreviewNavItem = livePreviewTab.find(".live-preview-nav .live-preview-nav-item.active");
  if (!$(item).is(activeLivePreviewNavItem)){
      activeLivePreviewNavItem.removeClass("active");
      $(item).addClass("active");
      var dataCarousel = $(item).attr("data-carousel");
      var activeItem = livePreviewTab.next().find(".live-preview-item.active");
      activeItem.removeClass("active");
      activeItem.find(".live-preview-carousel.slick-initialized").each(function(){
          $(this).slick("unslick");
      });
      var matchedCarousel = getMatchCarousel(dataCarousel);
      if (matchedCarousel) {
          matchedCarousel.addClass("active");
          initCardCarousel();
      }
  }
}

var setTabCarouselHeightForMobile = function() {
    $(".live-preview-wrapper").each(function(){
        $(this).find(".slick-track").height($(this).find(".slick-current").attr("data-slide-height"));
    });
}

$(window).resize(function(){
    if($(window).width() >= 768 && windowWidth < 768) {
        $(".live-preview-tab .live-preview-nav.slick-initialized").slick("unslick");
        $(".live-preview-nav-item .live-preview-nav-item-inner .live-preview-item").each(function(){
            $(this).parents(".live-preview-tab").next().append($(this));
            $(this).find(".live-preview-carousel-card").addClass("col-3");
        });
        $(".live-preview-nav .live-preview-nav-item").on("click", function(){
            tabItemClick(this);
        });
        initCardCarousel();
    }

    if($(window).width() < 768 && windowWidth >= 768) {
        $(".live-preview-item.active .live-preview-carousel.slick-initialized").slick("unslick");
        $(".live-preview-nav .live-preview-nav-item").unbind();
        initTabCarousel();
    }
    windowWidth = $(window).width();
})
$(document).ready(function() {
    $(".live-review-card").click(function(e){
        e.stopPropagation()
        var hasVideo = $(this).find(".live-review-card-play").length > 0;
        //有链接有视频，点击图片打开视频；有链接无视频，点击图片打开链接
        if(!(hasVideo && (e.target == $(this).find(".live-review-card-play")[0] || e.target == $(this).find(".live-review-card-img")[0]))){
          var link = $(this).attr("data-href");
          var target = $(this).attr("data-target");
          if(link){
                var title = atModel.getTitle(event.currentTarget);
                atModel.doAtEvent(title, 'navigation', e);
                if(target=="_blank"){
                  //  window.open(link)
                  var el = document.createElement("a");
                    document.body.appendChild(el);
                    el.href = link; //url 是你得到的连接
                    el.target = '_blank'; //指定在新窗口打开
                    el.click();
                    document.body.removeChild(el);
                }else{
                    window.location.href = link;
                }
            }
        } else {
        }
    });
    
    $(".live-review-card-img").click(function(e){
     // e.stopPropagation();
      var hasVideo = $(this).find(".live-review-card-play").length > 0;
      if(hasVideo) {
        $('.header-wrapper').css('z-index', '1');
      }
    });
    
    $(window).resize(function () {
        $(".live-review-list").each(function(){
            $(this).find(".live-review-card").each(function(){
                $(this).removeAttr("style");
            });
        });
        setWebinarCardHeight();
    });
    
    //统一webinar live review card的高度
    function setWebinarCardHeight(){
        $(".live-review-list").each(function(){
            var height;
            $(".live-review-card").each(function(){
                var h = $(this).height();
                if(height){
                    height = height > h ? height :h;
                }else{
                    height = h;
                }
            });
    
            $(this).find(".live-review-card").each(function(){
                $(this).height(height);
            });
        });
    }
})

$(document).ready(function() {
    // 修改 getCookie为$.cookie
    if($.cookie('wcmmode')!="edit" || window.location.search.indexOf("disabled")>-1){
        $(".live-review-list .col-md-3").each(function(){
            $(this).addClass("hide");
        });
    }
    $(".live-review-list.hide").removeClass("hide");

    initLiveReviewSelect();
    initLoadingMore();

    var ticket = getLoginCookie("ticket");
    if (!ticket || ticket === "123") {
        var link = $(".live-review-list .live-review-card .hik-video-trigger");
        var title = link.attr("data-at-module");
        link.attr("data-at-module", title + "_login");
    }

    //bind search icon event
    $(".live-review-filter-wrapper-search-icon").on("click",function(){
        searchFilter($(this));

         // for at search event click
        var module = $(this).data('at-module');
        var searchContent= $(".live-review-filter-wrapper-search-ipt").val();
        atModel.doAtEvent(module + atModel.atSpliter + searchContent+ atModel.atSpliter + window.location.href, 'action', event);
    });
    $(".live-review-filter-wrapper-search-ipt").bind('keypress',function(event){
        if(event.keyCode === 13) {
            searchFilter($(this));

            // for at search event keypress
            var module = $(this).data('at-module');
            var searchContent= $(this).val();
            atModel.doAtEvent(module + atModel.atSpliter + searchContent+ atModel.atSpliter + window.location.href, 'action', event);
         }
    });

    //open filter content in mobile view
    $(".live-review-filter-wrapper-inner-mobile-btn").on("click",function(){
        $(".live-review-filter-wrapper-inner-mobile-content").addClass("active").find(".live-review-filter-wrapper-inner-mobile-option:first").addClass("active");
        $(".live-review-filter-wrapper-inner-mobile-bg").addClass("active");
        $("html,body").addClass("preventScroll");
    });

    //close filter content in mobile view
    $(".live-review-filter-wrapper-inner-mobile-header-close,.live-review-filter-wrapper-inner-mobile-bg,"+
    ".live-review-filter-wrapper-inner-mobile-content-confirm")
        .on("click",function(e){
            $(".live-review-filter-wrapper-inner-mobile-content").removeClass("active");
            $(".live-review-filter-wrapper-inner-mobile-bg").removeClass("active");
            $(".live-review-filter-wrapper-inner-mobile-option.active").removeClass("active");
            $("body").removeClass("preventScroll");
            e.stopPropagation();
    });

    $(".live-review-filter-wrapper-inner-mobile-content").on("click", function(e){
        $("html,body").addClass("preventScroll");
    });
    //open or close filter option content in mobile view
    $(".live-review-filter-wrapper-inner-mobile-option-header").on("click",function(){
        $(this).parent().toggleClass("active");
    });

    //select or cancel filter in mobile view
    $(".live-review-filter-wrapper-inner-mobile-option-item").on("click",function(){
        var selectedItem = $(this).parent().find(".live-review-filter-wrapper-inner-mobile-option-item.selected");
        if($(this).is(selectedItem)) {
            $(this).removeClass("selected");
        } else {
            selectedItem.removeClass("selected");
            $(this).addClass("selected");
        }
    });

    //reset selected filter in mobile view
    $(".live-review-filter-wrapper-inner-mobile-content-reset").on("click",function(){
        $(".live-review-filter-wrapper-inner-mobile-option-item.selected").removeClass("selected");
    });

    $(".live-review-filter-wrapper-inner-mobile-content-confirm").on("click",function(){
        searchFilter($(this));
    });

    $("select[id^='filter']").on("change", function(){
        $(".live-review-filter-select .dropdown-toggle").css("color","#333333");
        searchFilter($(this));
    });


    var searchFilter = function(current){
        var randomNo = current.parents(".live-review-content").attr("data-randomNo")
        var searchContent= $(".live-review-filter-wrapper-search-ipt").val();
        var filterOne = $("#filterOne-" + randomNo).val() !="all"&& $("#filterOne-" + randomNo).val() ? $("#filterOne-" + randomNo).val():"";
        var filterTwo = $("#filterTwo-" + randomNo).val() !="all"&& $("#filterTwo-" + randomNo).val() ? $("#filterTwo-" + randomNo).val():"";
        var filterThree = $("#filterThree-" + randomNo).val() !="all"&&  $("#filterThree-" + randomNo).val()?  $("#filterThree-" + randomNo).val():"";
        var filterFour = $("#filterFour-" + randomNo).val() !="all"&&  $("#filterFour-" + randomNo).val()?  $("#filterFour-" + randomNo).val():"";

        //mobile
        if($(window).width()<768){
            filterOne = $("#filterOne-mobile-" + randomNo).find(".selected").html() ? $("#filterOne-mobile-" + randomNo).find(".selected").html():"";
            filterTwo = $("#filterTwo-mobile-" + randomNo).find(".selected").html() ? $("#filterTwo-mobile-" + randomNo).find(".selected").html():"";
            filterThree = $("#filterthree-mobile-" + randomNo).find(".selected").html() ? $("#filterthree-mobile-" + randomNo).find(".selected").html():"";
            filterFour = $("#filterFour-mobile-" + randomNo).find(".selected").html() ? $("#filterFour-mobile-" + randomNo).find(".selected").html():"";
        }

        $(".live-review-list .live-review-card").each(function(){
            textSearch($(this), searchContent);
            var filter = $(this).find(".live-review-card-filter").html();
            if(filter.indexOf(filterOne)>-1 && filter.indexOf(filterTwo)>-1 && filter.indexOf(filterThree)>-1 && filter.indexOf(filterFour)>-1){
                textSearch($(this), searchContent);
            }else{
                $(this).parent().hide();
            }
        });

        initLoadingMore();
    }

    var textSearch = function(card, keyword){
        keyword = keyword.toLowerCase();
        var title = card.find(".live-review-card-title").html().toLowerCase();
        var desc = card.find(".live-review-card-desc").html().toLowerCase();

        if(title.indexOf(keyword)>-1 || desc.indexOf(keyword) >-1 ){
            card.parent().show();
        }else{
            card.parent().hide();
        }
    }

    $(window).scroll(function(event){
        if(!$(".live-review-list").length) return;
        var scrollTop = $(this).scrollTop();
        var windowHeight = $(this).height();
        var currentListHeight = $(".live-review-list").height();
        var listOffsetTop = $(".live-review-list").offset().top;

        if(scrollTop + windowHeight>= (listOffsetTop + currentListHeight+50)) {
            var len = $(".live-review-list .hide").length;
            if(len >0){
                $(".live-review-loading").show();
                setTimeout(function(){
                    initLoadingMore();
                },1);
            }
        }
    });

    globalSettings.init();

});

var initLiveReviewSelect = function(){
    //toggle bootstrap-select plugin
    var elm = $(".live-review-filter-select")
    if(elm) {
        elm.selectpicker({});
    }
};

var initLoadingMore = function(){
    var cardSize = 8;
    var len = $(".live-review-list .hide").length;
    if(len <= cardSize){
        $(".live-review-list .hide").each(function(){
            $(this).removeClass("hide");
        });
    }else if(len >cardSize ){
        $(".live-review-list .hide:lt("+ cardSize +")").each(function(){
            $(this).removeClass("hide");
        });
    }
    setWebinarCardHeight();
    $(".live-review-loading").hide();
}
//统一webinar live review card的高度
function setWebinarCardHeight(){
    var currentBreakpoint = getCurrentBreakpoint();
    $(".live-review-list").each(function(){
        var height;
        $(".live-review-card").each(function(){
            var h = $(this).height();
            if(height){
                height = height > h ? height :h;
            }else{
                height = h;
            }
        });
        // if (currentBreakpoint !== 'MOBILE'){
        //     $(this).find(".live-review-card").each(function(){
        //         $(this).height(height);
        //     });
        // } else{
        //     $(this).find(".live-review-card").each(function(){
        //         $(this).css({
        //             height: 'auto'
        //         });
        //     });
        // }
    });
}
var liveWindow = (function ($) {

    var liveWindow = {};
    liveWindow.livePlay;
    liveWindow.livePlayVolume = 0.5;
    liveWindow.livePlayPreviousVolume = 0;
    liveWindow.setLiveVideoListHeight = function(windowWrapper) {
        var liveVideoPlayWrapper = windowWrapper.find(".live-video-play-wrapper");
        windowWrapper.find(".live-video-list-wrapper").height(liveVideoPlayWrapper.innerHeight() - liveVideoPlayWrapper.height());
    }
    liveWindow.setSpecialVolume = function(liveVideoPlayWrapper) {
        var plyrVolume = liveVideoPlayWrapper.find(".plyr__volume");
        var inputVolume = plyrVolume.find("input[type=range]");
        var muteButton = plyrVolume.find("button.plyr__control");
        if ($(".plyr__volume-input").length == 0) {
            var plyrVolumeInput = $("<div/>", {
                class: "plyr__volume-input"
            });
            plyrVolumeInput.append(inputVolume).prependTo(plyrVolume).after($("<div class='plyr__volume-vlaue'>0%</div>"));
            setTimeout(function(){
                plyrVolumeInput.next().html(parseInt(inputVolume.attr("aria-valuenow")) + "%");
            },10);
            plyrVolume.mouseover(function() {
                plyrVolumeInput.addClass("active");
                plyrVolumeInput.next().addClass("active");
            })
            plyrVolume.mouseout(function() {
                plyrVolumeInput.removeClass("active");
                plyrVolumeInput.next().removeClass("active");

            })

            inputVolume.on("change input",function(){
               setTimeout(function(){
                    plyrVolumeInput.next().html(parseInt(inputVolume.attr("aria-valuenow")) + "%");
                    liveWindow.livePlayVolume = liveWindow.livePlay.volume;
                    liveWindow.livePlayPreviousVolume = liveWindow.livePlay.volume;
               },10);
            });

            muteButton.unbind("click").on("click",function(){
                if(liveWindow.livePlay.volume == 0) {
                    liveWindow.livePlay.volume = liveWindow.livePlayVolume;
                }else {
                    liveWindow.livePlay.volume= 0;

                }
                liveWindow.livePlayPreviousVolume = liveWindow.livePlay.volume;
                setTimeout(function(){
                    plyrVolumeInput.next().html(parseInt(inputVolume.attr("aria-valuenow")) + "%");
                },10);
            });
        }
    }
    liveWindow.playVideo = function(liveVideoListWrapperItem,liveVideoPlayWrapper) {
        var isInternalVideoLink = liveVideoListWrapperItem.attr("data-is-internal");
        var videoPath = liveVideoListWrapperItem.attr("data-video-path");
        var isFirstVideo = liveVideoListWrapperItem.attr("data-is-first");
        if (videoPath){
            if (isFirstVideo) {
                if(isInternalVideoLink == "true") {
                    var videoTag = $("<video/>",{
                        id: "live-video-play-plyr",
                        playsinline: "",
                        controls: "",
                        class: "live-video-play-plyr"
                    });
                    videoTag.append($('<source src="' + videoPath + '" type="video/mp4"/>'));
                    liveVideoPlayWrapper.append(videoTag);
                } else {
                    var divTag = $("<div/>", {
                        id: "live-video-play-plyr",
                        "data-plyr-provider": "youtube",
                        "data-plyr-embed-id": videoPath,
                        class: "live-video-play-plyr"
                    });
                    liveVideoPlayWrapper.append(divTag);
                }
                var liveVideoPlayPlyr = liveVideoPlayWrapper.find("#live-video-play-plyr");
                liveWindow.livePlay = new  Plyr(liveVideoPlayPlyr, {
                    "controls": ['play-large','play','volume','mute','current-time','duration','progress','fullscreen'],
                    "autoplay": true,
                });
            } else {
                if(isInternalVideoLink == "true") {
                    liveWindow.livePlay.source = {
                        type: "video",
                        sources: [
                            {
                                src: videoPath,
                                type: "video/mp4"
                            }
                        ]
                    }
                } else {
                    liveWindow.livePlay.source = {
                        type: "video",
                        sources: [
                            {
                                src: videoPath,
                                provider: "youtube"
                            }
                        ]
                    }
                }
            }

            liveWindow.livePlay.on("ready",function() {
                if (isFirstVideo) {
                    liveVideoListWrapperItem.attr("data-is-first","");
                }
                liveWindow.livePlay.volume = liveWindow.livePlayPreviousVolume;
                liveWindow.setSpecialVolume(liveVideoPlayWrapper);
            })
            return true;
        }
        return false;
    }
    liveWindow.requestData = function () {
        var ticket = getLoginCookie("ticket");
        if(ticket && ticket!="123"){
            loginUtil.checkLogin(function(){
                var url = $(".live-video-list-wrapper").attr("data-baseUrl");
                $.ajax({
                    type : "GET",
                    url : url+".json",
                    dataType : "json",
                    success : function(data) {
                        console.log("Webinar Video info get success");
                        var videoDetails = data.videoDetails;
                        for(var i=0; i < videoDetails.length; i++){
                            $(".live-video-list-wrapper-item." + i ).attr("data-video-path", videoDetails[i].videoPath);
                        }
                    },
                    error : function() {
                        console.log("Webinar Video info get failed");
                    }
                });
            });
        }
        $(".live-video-list-wrapper-item:not(:first)").on("click", function(){
            //webinar主窗口第一个视频自动播放不需要login验证
            var ticket = getLoginCookie("ticket");
            if(ticket && ticket!="123"){
                loginUtil.checkLogin();
            }else{
                loginUtil.popupLoginConfirmModal();
            }
        });
    }

    liveWindow.init = function () {
        $(document).ready(function () {
            var videoWithLogin = $(".live-video-list-wrapper").attr("data-login-video");
            if(videoWithLogin =="true"){
                liveWindow.requestData();
            }
            $(".live-window-wrapper").each(function(){
                var liveWindowWrapper = $(this);
                if($(window).width() < 1024) {
                    liveWindowWrapper.hide();
                    return;
                }
                var liveVideoListWrapperItems = liveWindowWrapper.find(".live-video-list-wrapper-item");
                var firstLiveVideoListWrapperItem = liveWindowWrapper.find(".live-video-list-wrapper-item:first");
                var liveVideoPlayWrapper = liveWindowWrapper.find(".live-video-play-wrapper");
                var liveVideoListContent = liveWindowWrapper.find(".live-video-list-content");
                var liveVideoPlayWrapperPlyr = liveVideoPlayWrapper.find(".plyr");
                if(liveVideoPlayWrapperPlyr.length>0){
                    //fixed init executed twice, after submit dialog
                    return;
                }
                liveWindow.setLiveVideoListHeight(liveWindowWrapper);
                liveVideoListContent.niceScroll({
                    cursorcolor: "rgba(255,255,255,0.39)",
                    cursorborder: "none",
                    cursoropacitymin: 1,
                    cursorwidth: "7px",
                    cursorborderradius: "3.5px"
                });
                //play first video
                liveWindow.playVideo(firstLiveVideoListWrapperItem,liveVideoPlayWrapper);

                liveVideoListWrapperItems.on("click",function(){
                    var activeItem = liveWindowWrapper.find(".live-video-list-wrapper-item.active");
                    if($(this).is(activeItem)) {
                        return;
                    }
                    var playSuccess = liveWindow.playVideo($(this),liveVideoPlayWrapper);
                    if (playSuccess) {
                        activeItem.removeClass("active");
                        $(this).addClass("active");
                    }
                });
            });
        });

        $(window).resize(function(){
            $(".live-window-wrapper").each(function(){
                if($(window).width() < 1024) {
                    $(this).hide();
                    return;
                }
                $(this).show();
                liveWindow.setLiveVideoListHeight($(this));
            });
        });
    };

    return liveWindow;
}($));

liveWindow.init();
$(document).ready(function () {
    var $moreBtn = $('.blog-landing-wapper .blog-filter-bar .action');
    var $filterBar = $moreBtn.closest('.blog-filter-bar');
    var $filterBarMobile = $('.blog-landing-wapper .blog-filter-bar-mobile');
    var $pagination = $('.blog-filter .blog-filter-pagination');
    var $items = $('#blogFilterItems').find('.blog-filter-item');

    function clearUrlSearch() {
        var url = window.location.href;
        var mainUrl = url.split('?')[0];
        window.history.pushState({}, 0, mainUrl);
    }

    function showMoreAfterDirect(filter) {
        var $filter = $('.blog-filter-bar .filter[data-tag="' + filter + '"]');
        $filter.length && getCurrentBreakPoint() != 'MOBILE' && !$filter.hasClass('show') && $moreBtn.click();
    }

    function pageInit() {
        var filter = getQueryString("q");
        if (!isNull(filter)) {
            $('.blog-filter-bar .filter[data-tag="' + filter + '"]').eq(0).click();
            clearUrlSearch();
            showMoreAfterDirect(filter);
        }
    }

    function calcDisplayFilter() {
        var filterContainerWidth = $filterBar.find('.filters-container').width();
        var widthScope = 0;
        var oneLine = true;
        $filterBar.find('.filter').each(function () {
            widthScope += $(this).outerWidth(true);
            if (widthScope < filterContainerWidth) {
                $(this).addClass('show');
            } else {
                $(this).removeClass('show');
                oneLine = false;
            }
        });
        if (oneLine) {
            $filterBar.addClass('oneline');
        } else {
            $filterBar.removeClass('oneline');
        }
    }

    function getCurrentBreakPoint() {
        var contentValue = window.getComputedStyle(
            document.querySelector('.blog-filter'), '::before'
        ).getPropertyValue('content');
        return contentValue.replace(/\"/g, '');
    }

    function initFilterBar() {
        calcDisplayFilter();
        if (getCurrentBreakPoint() == 'MOBILE') {
            $moreBtn.attr('data-target', '#blogFilterMobile');
        } else {
            $moreBtn.attr('data-target', '');
            $('#blogFilterMobile').modal('hide');
        }
    }

    function updateFilterChosen($obj, index) {
        $obj.find('.filter').removeClass('active');
        $obj.find('.filter').eq(index).addClass('active');
    }


    function initPagination() {
        $pagination.jPages({
            containerID: "blogFilterItems",
            perPage: 10,
            previous: "BACK",
            next: "NEXT",
            keyBrowse: true,
            animation: "slideInRight",
            callback: function (pages, items) {
                initPagenationAtEvent();
            }
        });
    }

    function initPagenationAtEvent() {
        var $back = $pagination.find(".jp-previous");
        var $next= $pagination.find(".jp-next");
        var $jpnum= $pagination.find("a:not(.jp-previous):not(.jp-next)");

        var url = window.location.href;
        url = url.replaceAll("%20", "_");
        $back.unbind('click').on('click', function (event) {
            var title = "blog_list" + atModel.atSpliter + "pagination" + atModel.atSpliter + "BACK";
            title = title + atModel.atSpliter + url;
            atModel.doAtEvent(title, 'action', event);
        });
        $next.unbind('click').on('click', function (event) {
            var title = "blog_list" + atModel.atSpliter + "pagination" + atModel.atSpliter + "NEXT";
            title = title + atModel.atSpliter + url;
            atModel.doAtEvent(title, 'action', event);
        });
        $jpnum.unbind('click').on('click', function (event) {
            var title = "blog_list" + atModel.atSpliter + "pagination" + atModel.atSpliter + $(this).text();
            title = title + atModel.atSpliter + url;
            atModel.doAtEvent(title, 'action', event);
        });
    }

    function updatePagination() {
        $items.removeClass('jp-hidden');
        var activeItems = $('#blogFilterItems').find('.blog-filter-item').not(".search-hide").not(".filter-hide");
      //  activeItems.prependTo("#blogFilterItems");

        var odd = true;
        activeItems.each(function () {
            odd ? $(this).addClass('odd-item') : $(this).removeClass('odd-item');
            odd = !odd;
        });

        $pagination.jPages('destroy');
        initPagination();

        var scrollTop = $('.blog-filter-bar').offset().top - 10;
        $('html,body').animate({scrollTop: scrollTop}, 200);
    }

    function initItemsMargin() {
        $('.blog-filter-item:even').addClass('odd-item');
    }

    function filterItems(filter) {
        var $showItem = $('#blogFilterItems').find('.blog-filter-item').not(".search-hide");
        if (filter === 'all') {
            $showItem.removeClass("filter-hide");
        } else if ($('.blog-filter').hasClass('filter-by-tags')) {
            $showItem.each(function () {
                var itemFilters = JSON.parse($(this).attr('data-info'));
                if (itemFilters.tags.indexOf(filter) !== -1) {
                    $(this).removeClass("filter-hide");
                } else {
                    $(this).addClass("filter-hide");
                }
            });
        } else {
            $showItem.each(function () {
                var itemFilters = JSON.parse($(this).attr('data-info'));
                if (itemFilters.topic.indexOf(filter) !== -1) {
                    $(this).removeClass("filter-hide");
                } else {
                    $(this).addClass("filter-hide");
                }
            });
        }
        updatePagination();
    }

    $moreBtn.on('click', function () {
        $(this).toggleClass('arrow-rotate');
        $filterBar.find('.filters-container').toggleClass('show-all');

    });

    $filterBar.find('.filter').click(function () {
        $(this).addClass('active');
        $(this).siblings().removeClass('active');
        updateFilterChosen($filterBarMobile, $(this).index());
        filterItems($(this).attr('data-tag'));
    });

    $filterBarMobile.find('.filter').click(function () {
        var _this = $(this);
        _this.addClass('active');
        _this.siblings().removeClass('active');
        updateFilterChosen($filterBar, _this.index());
        _this.closest('.modal-content').find('.label').click();
        filterItems(_this.attr('data-tag'));
        filterSearch.updateMoreButtonStatus(!_this.hasClass("blog-filter-all-mobile"));
    });

    $('.blog-filter-item .blog-filter-item-sub-title .author').click(function (e) {
        e.stopPropagation();
        e.preventDefault();
        var link = $(this).attr('data-link');
        window.location.href = link;
    });

    $('.blog-filter').each(function () {
        initFilterBar();
        initItemsMargin();
        initPagination();
        pageInit();
        $(window).resize(function () {
            initFilterBar();
        });
    });

    var blogFilterElement = $(".blog-filter");
    var path = blogFilterElement.attr("data-path");
    var filterPath = blogFilterElement.attr("data-filter-path");
    filterSearch.addSearchListener({
        isAjax: true,
        placeholder: "Find blog articles",
        path: path + ".search.json",
        data: {path: filterPath},
        callback: function (data) {
            var blogList = data.data;
            if (blogList) {
                $items.addClass("search-hide");
                blogList.forEach(function (value, index) {
                    var link = value;
                    if (link.startsWith("/content/hikvision/")) {
                        link = value.replace("/content/hikvision/", "/").replace(".html", "");
                    }
                    var item = $('#blogFilterItems').find(".blog-filter-item .link[href*='" + link + "']").parent();
                    item.removeClass("search-hide");
                });
            } else {
                if (isNull(data.keyword)) {
                    $items.removeClass("search-hide");
                    $items.removeClass("filter-hide");
                } else {
                    $items.addClass("search-hide");
                    $items.removeClass("filter-hide");
                }
            }
            $(".blog-filter-bar-btn").removeClass("active");
            $(".blog-filter-all").addClass("active");
            $(".filter-option-mobile").removeClass("active");
            $(".blog-filter-all-mobile").addClass("active");

            updatePagination();
        },
        atEvent: {
            module: "blog_list::search",
            action: "action"
        }
    });
    filterSearch.addMoreListener({
        callback: function () {
            $("#blogFilterMobile").modal("show");
        }
    })
    // filterSearch.addResetListener({
    //     showReset: true,
    //     callback: function () {
    //         $(".blog-filter-item").show();
    //         updatePagination();
    //     }
    // });

    var getArgs = function (url){
        var strindex=url.indexOf("?")
        var Args=url.substr(strindex+1).replace(/%20/g, " ")
        return Args
    }
    var args = getArgs(window.location.href)
    $filterBar.find('.filter').each(function(){
        if($(this).attr('data-tag')==args){
            $(this).addClass('active');
            $(this).siblings().removeClass('active');
            $filterBar.find('.filters-container').toggleClass('show-all');
            updateFilterChosen($filterBarMobile, $(this).index());
            filterItems($(this).attr('data-tag'));
        }
    }
    )
});



/*eslint-disable*/
$(document).ready(function () {
    $('.blog-tag-bar').each(function () {
        var $tags = $(this).find('.tags .tag');
        var $moreBtn = $(this).find('.action');
        if ($tags.length < 20) {
            $moreBtn.hide();
        }
        $tags.each(function () {
            var path = $(this).attr("href");
            var tag = $(this).attr("data-tag");
            $(this).attr("href", path + "?q=" + tag)
        });
    });

    $('.blog-tag-bar .action').click(function () {
        $(this).toggleClass('arrow-rotate');
        $(this).closest('.blog-tag-bar').find('.tags').toggleClass('expand');
    });
});
/*eslint-disable*/
$(document).ready(function () {
    /**
     * 添加 js.txt
     */
    $('.blog-subscribe .sign-up').click(function() {
        var currentUrl = window.location.href;
        setLoginCookie("NewsLetterUrl", currentUrl);
    });
});

$(document).ready(function () {
  // 进入该页面时隐藏header-2.0, 但是作者页要显示header-2.0
  function hideHeader () {
    if ($('.blog-detail-wapper-page').length && !$('.new-blog-author-page').length) {
      $('.header-2.aem-GridColumn').hide()
    }
  }
  function onClickBack () {
    // 兼容 tst 环境带href的a标签丢失问题
    $('.blog-detail-wapper-page a.back-link').on('click', function () {
     // var link = $(this).data('href')
     var blogElement = $('.cn-header-Blog')
     var target = $(this).attr('target')
     if(blogElement.length){
      window.open(blogElement.attr('href'), target)
     } else {
      var locale = $('meta[name=locale]').attr('content')
      var link = '/' + locale + '/newsroom/blog/'
      window.open(link, target)
     }
     console.log('blogHref', blogHref)
    })
  }
  onClickBack()
  hideHeader()
  $('.blog-detail-sub-title .author').click(function(e) {
      e.stopPropagation();
      e.preventDefault();
      var link = $(this).attr('data-link');
      window.location.href = link;
    });
});
/*eslint-disable*/

$(document).ready(function () {

    function initRegionSelector($comp) {
        var $formWrapper = $comp.find('.form-wrapper');
        var $regionSelectorWrapper = $formWrapper.find('.select-region-wrapper');

        $regionSelectorWrapper.each(function(){
            var $regionSelectorLabel = $(this).find('.region-selector-label');
            var $dropdownOptionsWrapper = $(this).find('.dropdown.region-options');
            var $regionOptions = $(this).find('.region-options li');
            var $selectRegionInput = $regionSelectorLabel.find('.selected-option-input');
            var $selectedRegionValue = $regionSelectorLabel.find('input[type=hidden]:not([name="countryCode"])');
            var $selectedRegionCodeValue = $regionSelectorLabel.find('input[type=hidden][name="countryCode"]');

            //Region selector dropdown
            $regionSelectorLabel.on('click', function (e) {
                e.stopPropagation();
                $regionSelectorLabel.addClass('remove-top-border');
                $dropdownOptionsWrapper.addClass('remove-top-border');
                $dropdownOptionsWrapper.slideToggle('fast', function () {
                    if ($dropdownOptionsWrapper.is(':visible')) {
                        $regionSelectorLabel.addClass('remove-top-border');
                        $dropdownOptionsWrapper.addClass('remove-top-border');
                    } else {
                        $dropdownOptionsWrapper.removeClass('remove-top-border');
                        $regionSelectorLabel.removeClass('remove-top-border');
                    }
                });
            });


            $(".selected-option-input").on('click', function(e){
                if($(this).parent().hasClass("remove-top-border")) {
                    e.stopPropagation();
                }
            })

            $regionOptions.on('click', function (e) {
                e.stopPropagation();
                $selectRegionInput.val($(this).html());
                $selectedRegionValue.val($(this).attr('data-country'));
                $selectedRegionCodeValue.val($(this).attr('data-country-code'));
                $dropdownOptionsWrapper.removeClass('remove-top-border');
                $regionSelectorLabel.removeClass('remove-top-border');
                $dropdownOptionsWrapper.slideUp();
                $selectedRegionValue.trigger("change");
            });
            //实现select搜索功能

            function selectValueClear() {
                $selectedRegionValue.val($(this).attr(''));
                $selectedRegionValue.trigger("change");
            }
            var liTexts = []
            var allTexts = []
            $selectRegionInput.on('keyup', function(){
                liTexts=[]
                var currentValue = $(this).val().replace(/^\s*/g,"");
                var oLis = $(this).parent().siblings("ul").find("li")
                $.each(oLis, function(i, item){
                    var name = $(this).text();
                    if($(this).val() === name){
                        allTexts.push(name)
                    }
                    if(name.toLowerCase().indexOf(currentValue.toLowerCase()) >= 0 ) {
                        $(this).show();
                        liTexts.push(name)
                    }else{
                        $(this).hide();
                    }

                    if(currentValue==='') {
                        selectValueClear();
                    }
                })
            })
            $selectRegionInput.on('blur',function(){
                var lis = $(this).parent().siblings("ul").find("li")
                var allLiText = []
                $.each(lis,function(i,item){
                    allLiText.push($(this).text())
                })
                if((!liTexts.length || !allTexts.length) && (allLiText.indexOf($(this).val()) === -1)){
                    $(this).val('');
                    selectValueClear();
                }
            })
            $selectRegionInput.on('focus',function(){
                var oLis = $(this).parent().siblings("ul").find("li")
                $.each(oLis, function(i, item){
                    $(this).show()
                })
            })
            $('body').on('click', function () {
                $dropdownOptionsWrapper.slideUp('fast', function () {
                    if ($dropdownOptionsWrapper.is(':visible')) {
                        $regionSelectorLabel.addClass('remove-top-border');
                        $dropdownOptionsWrapper.addClass('remove-top-border');
                    } else {
                        $dropdownOptionsWrapper.removeClass('remove-top-border');
                        $regionSelectorLabel.removeClass('remove-top-border');
                    }
                });
            });
        });
    };

    function countChars($comp){
        var $textArea = $comp.find('.textarea-wrapper textarea');

        $textArea.each(function(){
            var $charCounter =  $(this).closest('.textarea-wrapper').find('.char-counter');
            var maxCharsAllowed = parseInt($(this).attr('data-max-chars'));

            $charCounter.text($(this).val().length + '/' + maxCharsAllowed);
            $(this).on('keyup', function () {
                var len = $(this).val().length;
                if (len > maxCharsAllowed) {
                    $(this).val($(this).val().substring(0, maxCharsAllowed));
                } else {
                    $charCounter.text((len) + '/' + maxCharsAllowed);
                }
            });
        });
    };

    function initFormValidator($comp){
        var $form = $comp.find('form');
        var $requiredInputElements = $comp.find('form input:required, form textarea:required, form input[requredHidden="true"]');
        // submit button
        var $submitBtn = $comp.find('.two-cols-form-submit');
        var $resetBtn = $comp.find('.two-cols-form-reset');
        var $thanksMessageAlert = $comp.find('.two-cols-form-thanks-message');
        var $errorMessageAlert = $comp.find('.two-cols-form-error-message');
        var $shadowBg = $comp.find('.two-cols-form-alert-bg');
        $(".verification-code-wrapper img").attr("src","/bin/hikvision/kaptcha.jpg?k=" + new Date().getTime());

        $submitBtn.attr('disabled',true);
        //validate form
        if(!$.validator){
            return;
        }

        function getI18nString(msg) {
            return typeof Granite == "undefined" ? msg : Granite.I18n.get(msg);
        }

        function shadowBgShow(flag) {
            if(flag) {
                $shadowBg.addClass("active");
                $('body').css("overflow","hidden");
            } else {
                $shadowBg.removeClass("active");
                $('body').css("overflow","scroll");
            }
        }
        function submitSuccess() {
            $thanksMessageAlert.addClass("active");
            shadowBgShow(true);
        }

        function showErrorMsg(msg) {
            var content;
            if(msg && msg.startsWith('Invalid verification code')) {
                $form.find('.verification-invalid').show();
            }else {
                content= getI18nString(msg);
                $errorMessageAlert.find(".two-cols-form-error-message-text").empty().html(content);
                $errorMessageAlert.addClass("active");
                shadowBgShow(true);
            }
        }

        // submit form
        function submitForm(form) {
            // form submit
            var formData = new FormData(form);
            $submitBtn.addClass("loading");
            $.ajax({
                type: 'POST',
                url: form.action,
                data: formData,
                processData: false,
                contentType: false
            }).done(function(data) {
                $submitBtn.removeClass("loading");
                $(".verification-code-wrapper img").attr("src","/bin/hikvision/kaptcha.jpg?k=" + new Date().getTime());
                if (checkResultSuccess(data)) {
                    submitSuccess();
                } else {
                    showErrorMsg(data.message);
                }
            }).fail(function(result) {
                var resultBean = null;
                $submitBtn.removeClass("loading");
                $(".verification-code-wrapper img").attr("src","/bin/hikvision/kaptcha.jpg?k=" + new Date().getTime());
                try{
                    resultBean = JSON.parse(result.responseText);
                }catch (error) {
                    console.error(error.toString());
                }
                if(resultBean) {
                    showErrorMsg(resultBean.message);
                }else {
                    showErrorMsg("Unknown Error occurred!");
                }
            }).complete(function(XMLHttpRequest, status){
                // for at event
                var module = atModel.getTitle($submitBtn[0]);
                atModel.doAtEvent(module, 'action', event);
            });
        }

        $.validator.setDefaults({
            focusInvalid: true,
            submitHandler: function(form, evt){
                submitForm(form);
            },
            invalidHandler: function(event,validator){
                console.log('invalid');
            }
        });

        // custom method to add regex
        $.validator.addMethod (
            "regex",
            function(value, element, regexp) {
                return this.optional(element) || regexp.test(value);
            }
        );

        $.extend($.validator.messages, {
            required: getI18nString("This field is required."),
        });

        function submitBtnEnabel() {
            var isRequiredInputsFilled = true;
            if($form.find('[aria-invalid="true"]').length !==0 || $form.find('.verification-invalid').is('visible')) {
                isRequiredInputsFilled = false;
            } else {
                isRequiredInputsFilled = true;
            }
            if(isRequiredInputsFilled) {
                for(var i=0;i<$requiredInputElements.length;i++){
                    var $target = $requiredInputElements.eq(i);
                    if($target.prop("type")==="checkbox"){
                        var group = $target.attr('name');
                        var isValid = false;
                        $form.find('input[name="'+group+'"]').each(function(){
                            if($(this).is(":checked")){
                                isValid = true;
                            }
                        });
                        isRequiredInputsFilled = isValid;
                    }else if($target.prop("type")==="radio") {
                        var group = $target.attr('name');
                        var isValid = false;
                        $form.find('input[name="'+group+'"]').each(function(){
                            if($(this).is(":checked")){
                                isValid = true;
                            }
                        });
                        console.log('input', isValid)
                        isRequiredInputsFilled = isValid;
                    }else{
                        if($target.val()==""){
                            isRequiredInputsFilled = false;
                        }
                    }
                    if(!isRequiredInputsFilled) {
                        break;
                    }
                }
            }
            if(isRequiredInputsFilled){
                // disabled只能删除才能去除
                $submitBtn.removeAttr('disabled');
            } else {
                $submitBtn.attr("disabled", "disabled");
            }
        }

        $form.validate({
            errorElement: "em",
            errorPlacement: function (error, element) {
                // Add the `help-block` class to the error element
                error.addClass("help-block");
                if (element.prop("name") === "Clarification_GDPR" || element.prop("name") === "Clarification_Newsletter") {
                    error.insertAfter(element.parent("label"));
                } else if(element.prop("name") === "Verification") {
                    var lbl = element.parent();
                    error.insertAfter(lbl[0]);
                } else {
                    error.appendTo(element.closest('.input-box'));
                }
            },
            onkeyup: function(element) {
                $(element).valid();
                submitBtnEnabel();
            }
        });

        var $emailInputs = $('form input.custom-email');
        var emailErroInfo = $emailInputs.attr('data-errormsg')
        $emailInputs.rules('add',{
            regex: /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/,
            messages: {
                regex: emailErroInfo,
            }
        });

        $requiredInputElements.on('change keyup', function(){
            submitBtnEnabel();
        });

        $shadowBg.on('click', function() {
            $thanksMessageAlert.removeClass("active");
            $errorMessageAlert.removeClass("active");
            shadowBgShow(false);
        });

        $comp.find('.two-cols-form-thanks-message-close, .two-cols-form-error-message-close').on('click', function() {
            $thanksMessageAlert.removeClass("active");
            $errorMessageAlert.removeClass("active");
            shadowBgShow(false);
        });

        $resetBtn.on('click', function() {
            $submitBtn.attr('disabled',true);
            $comp.find('.verification-invalid').hide();
        });

        $('#twoColsFormVCode').on('change keyup', function(){
            $comp.find('.verification-invalid').hide();
        });

        $(".verification-code-wrapper img").on('click',function(){
            $(this).attr("src","/bin/hikvision/kaptcha.jpg?k=" + new Date().getTime());
        });
    };

    function initRadioCollapse($comp) {
        $comp.find('.radio-field').each(function() {
            var $radioField = $(this);
            $(this).find('input:radio').change(function() {
                var $otherOption= $radioField.find('.other-option');
                var isChecked = $otherOption.is(':checked');
                var $collapseControler = $otherOption.closest('.radio-item').find('.custom-control-label');
                var collapseTarget = $collapseControler.attr('data-target');
                if(isChecked) {
                    $collapseControler.attr('data-toggle','');
                } else {
                    $collapseControler.attr('data-toggle','collapse');
                    $(collapseTarget).collapse('hide');
                }
            });
        });
    }
    function initHiddenFieldsVals($comp){

        var hikId = $.cookie("HIKID");
        var hikIdInput = document.getElementById("formHikId");
        if(hikId && hikIdInput) {
            try {
                hikId = atob(hikId);
                hikIdInput.value = hikId;
            } catch (error) {
                console.log("Login Error:" + error);
            }
        }

        var hikEmail = $.cookie("HIKEMAIL");
        var hikEmailInput = document.getElementById("formEmail");
        if(hikEmail && hikEmailInput) {
            try {
                hikEmail = atob(hikEmail);
                hikEmailInput.value = hikEmail;
            } catch (error) {
                console.log("Login Error:" + error);
            }
        }
    }
    $('.two-cols-form').each(function() {
        initHiddenFieldsVals($(this));
        initRegionSelector($(this));
        countChars($(this));
        initFormValidator($(this));
        initRadioCollapse($(this));
    });
});

//dynamic表单限制输入部分特殊字符
var dynamicInputLimit = function(value){
    var reg = /[\_\!\|\~\`\%\+\=\/\'\$\%\^\&\*\{\}\:\;\"\<\>\?\\\(\)\（\）]/g;
    return value.replace(reg,'');
};

/*******************************************************************************
 * Copyright 2016 Adobe Systems Incorporated
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 ******************************************************************************/
/* global
    Granite, Coral
 */

var aiCampaign = (function ($) {

    var aiCampaign = {};
  
    aiCampaign.bindTabEvent = function(aiCampaignTab) {
        aiCampaignTab.mousemove(function(e){
            var x = e.pageX-$(this).offset().left
            var tabWidth = $(this).width();
            var itemWidth = $(this).find(".ai-campaign-tab-item:first").width();
            var overflowWidth = itemWidth * $(this).find(".ai-campaign-tab-item").length - tabWidth;
            var moveX = 0;
            if(overflowWidth > 0){
                moveX = -x / tabWidth * overflowWidth;
            }
            $(this).find(".ai-campaign-tab-wrapper").css("left", moveX + "px");
        });
        var aiCampaignList = aiCampaignTab.prev();
      //   aiCampaignTab.find(".ai-campaign-tab-item").hover(function(){
      //     var activeTabItem = $(this).siblings(".active");
      //           if(!$(this).is(activeTabItem)){
      //               $(this).addClass("active");
      //               activeTabItem.removeClass("active");
      //               var dataCategory = $(this).attr("data-category");
      //               aiCampaignList.find(".ai-campaign-item.active").removeClass("active");
      //               aiCampaignList.find(".ai-campaign-item[data-category*="+ dataCategory +"]").addClass("active");
      //           }        
      //   }, function())
      aiCampaignTab.find(".ai-campaign-tab-item").on("mouseenter",function(){
          var activeTabItem = $(this).siblings(".active");
          if(!$(this).is(activeTabItem)){
              $(this).addClass("active");
              activeTabItem.removeClass("active");
              var dataCategory = $(this).attr("data-category");
              aiCampaignList.find(".ai-campaign-item.active").removeClass("active");
              aiCampaignList.find(".ai-campaign-item[data-category*="+ dataCategory +"]").addClass("active");
          }
      });
    //   aiCampaignTab.find(".ai-campaign-tab-item").on("mouseleave",function(){
    //       var activeTabItem = $(this).siblings(".active");
    //       if(!$(this).is(activeTabItem)){
    //           $(this).removeClass("active");
    //           activeTabItem.removeClass("active");
    //           var dataCategory = $(this).attr("data-category");
    //           aiCampaignList.find(".ai-campaign-item.active").removeClass("active");
    //           aiCampaignList.find(".ai-campaign-item[data-category*="+ dataCategory +"]").removeClass("active");
    //       }
    //   });
        // aiCampaignTab.find(".ai-campaign-tab-item").on("click",function(){
        //     var activeTabItem = $(this).siblings(".active");
        //     if(!$(this).is(activeTabItem)){
        //         $(this).addClass("active");
        //         activeTabItem.removeClass("active");
        //         var dataCategory = $(this).attr("data-category");
        //         aiCampaignList.find(".ai-campaign-item.active").removeClass("active");
        //         aiCampaignList.find(".ai-campaign-item[data-category*="+ dataCategory +"]").addClass("active");
        //     }
        // });
    }
  
    aiCampaign.initPcView = function(aiCampaignContent) {
        var aiCampaignTab = aiCampaignContent.find(".ai-campaign-tab");
        var aiCampaignItemIcons = aiCampaignContent.find(".ai-campaign-item-icon");
        aiCampaignItemIcons.each(function(){
            $(this).load($(this).attr("data-svg"));
        });
        var aiCampaignTabIcons = aiCampaignContent.find(".ai-campaign-tab-icon");
        aiCampaignTabIcons.each(function(){
            $(this).load($(this).attr("data-svg"));
        });
        aiCampaign.bindTabEvent(aiCampaignTab);
    }
  
    aiCampaign.initMobileView = function(aiCampaignMobileContent) {
        var aiCampaignMobileItemIcons = aiCampaignMobileContent.find(".ai-campaign-mobile-item-icon");
        aiCampaignMobileItemIcons.each(function(){
            $(this).load($(this).attr("data-svg"));
        });
        var aiCampaignMobileTabIcons = aiCampaignMobileContent.find(".ai-campaign-mobile-tab-icon");
        aiCampaignMobileTabIcons.each(function(){
            $(this).load($(this).attr("data-svg"));
        });
        aiCampaignMobileContent.find(".ai-campaign-mobile-wrapper .ai-campaign-mobile-tab").unbind("click").on("click",function(){
            var activeItem = aiCampaignMobileContent.find(".ai-campaign-mobile-wrapper.active");
            if(!activeItem.is($(this).parent())) {
                activeItem.removeClass("active");
                $(this).parent().addClass("active");
            }else {
                $(this).parent().toggleClass("active");
            }
        });
    }
  
  
    aiCampaign.init = function () {
        $(document).ready(function () {
            $(".ai-campaign-wrapper").each(function(){
                var aiCampaignContent = $(this).find(".ai-campaign-content");
                var aiCampaignMobileContent = $(this).find(".ai-campaign-mobile-content");
                if($(window).width() < 768) {
                    aiCampaignMobileContent.show();
                    aiCampaign.initMobileView(aiCampaignMobileContent);
                } else {
                    aiCampaignMobileContent.hide();
                    aiCampaign.initPcView(aiCampaignContent);
                }
            });
        });
  
        $(window).resize(function(){
            $(".ai-campaign-wrapper").each(function(){
                var aiCampaignContent = $(this).find(".ai-campaign-content");
                var aiCampaignMobileContent = $(this).find(".ai-campaign-mobile-content");
                if($(window).width() < 768) {
                    aiCampaignMobileContent.show();
                    aiCampaign.initMobileView(aiCampaignMobileContent);
                } else {
                    aiCampaignMobileContent.hide();
                    aiCampaign.initPcView(aiCampaignContent);
                }
            });
        });
    };
   // mobile端关联产品
   var tabs = $('.ai-campaign-mobile-tab')
   $.each(tabs, function(index, item){
       var category = $(item).attr('data-category')
       var containers = $(item).siblings('.ai-campaign-mobile-list').find('.ai-campaign-mobile-item-container')
       $.each(containers, function(index,item1){
          if($(item1).attr("data-category").indexOf(category)!==-1){
              $(this).show()
          } else {
              $(this).remove()
          }
       })
   })
    return aiCampaign;
  }($));
  
  aiCampaign.init();
$(document).ready(function() {
  // $(".text-links .view-more").click(function() {
  //     var $parentSection = $(this).closest(".text-hyperlink-list-content");
  //     var limitNumber = Number($parentSection.attr("data-links-limit"));
  //     $parentSection.find(".text-link:gt(" + (limitNumber - 1) + ")").toggleClass("is-hide");
  //     $parentSection.toggleClass("is-expand");
  // });
  var typeObj={
    video:['mp4','avi','wmv','mpeg','m4v','mov','asf','flv','f4v','rmvb','rm','3gp','vob'],
    download:['zip','rar','exe','pdf','png','jpg']
  }
  //获取文件后缀名
  function extname(filename){
    if(!filename){
       return 
    };
    var strFileType= filename.lastIndexOf('.') >-1 ? filename.substring(filename.lastIndexOf('.') + 1) : '' ;
    return strFileType
  };

  function initVideolink($link){
    $link.addClass('video').addClass('hik-video-trigger');
    $link.attr("data-video-path", $link.attr('href'));
    $link.attr("data-internal-video", 'true');
    $link.attr("data-autoplay", 'true');
  };

  $.each($('.text-link-a'),function(index,item){
    var lastText=lastNode($(this).attr('href'))
    var extName=extname(lastText);
    if(typeObj.download.includes(extName)){
      $(this).addClass('download');
    }else if( typeObj.video.includes(extName)){
      initVideolink($(this));
    }else if($(this).attr('href') && ($(this).attr('href').indexOf('youtube.com/watch?v=') > -1 || $(this).attr('href').indexOf('youtu.be/') > -1 )){
      $(this).addClass('video').addClass('hik-video-trigger');
      $(this).attr("data-video-path", $(this).attr('href'));
      $(this).attr("data-autoplay", 'true');
    }
  });
  hikPlayer.Plyr.init();
  $('.text-link-a').on('click', function(e){
    var atModule = $(this).data('pre-module')+'::' + lastNode($(this).attr('data-href')) + atModel.atSpliter + window.location.href.replace('#download-agreement','')
    atModel.doAtEvent(atModule , 'download', e);
   })
});
$(document).ready(function () {
    $('.training-form-container').each(function(){
        autoFill($(this));
    })

    function autoFill($ele){
        var hikId = $.cookie("HIKID");
        try {
          hikId = atob(hikId);
        } catch (error) {
          console.log("Login Error:" + error);
        }
        var data=$.extend({},{hikId:hikId},{
            "ticket": getLoginCookie("ticket"),
            "service": getServiceUrl()
        });
        var trainingID = $ele.attr('data-training-id');
        var path = window.location.pathname;
        if(path.indexOf(trainingID) > -1){
            path = path.replace("." + trainingID + ".html","");
        }else{
            path = path.replace(".html","");
        }
        if(path.indexOf("/content/hikvision") < 0){
            path = "/content/hikvision" + path;
        }
        $.ajax({
            type : "GET",
            url : path + ".getUserInfo.json",
            data : data,
            dataType : "json",
            success : function(resp) {
                if(resp.data.code==0) {
                    renderFormInfo(resp.data.data,$ele);
                }
            },
            error : function() {
                console.log("get user info by hikId failed");
            }
        });
    }

    function renderFormInfo(data,$ele){
        $ele.find("input[name='FirstName']").val(data.firstName);
        $ele.find("input[name='LastName']").val(data.lastName);
        $ele.find("input[name='Phone']").val(data.phone);
        $ele.find("input[name='Email']").val(data.email);
        $ele.find("input[name='Company']").val(data.company);
        $ele.find("input[name='Type']").attr('value',data.customerType)
        $ele.find("input[name='Type']").siblings('.keys').val(data.customerType);
        $ele.find("input[name='Country']").attr('value',data.country)
        $ele.find("input[name='Country']").siblings('.keys').val(data.country);
        $ele.find("input[name='City']").val(data.city);
        $ele.find("input[name='Address']").val(data.address);
        $ele.find("input[name='PostalCode']").val(data.postcode);
    }

})
$(document).ready(function () {
    var $form = $('.form-elements.Newsletter');

    if ($form.length > 0) {
        var $select = $('.hik-multiple-select');
        $form.outlinedFormLabelShrink();

        $.getScript("/etc/hiknow/industry-list.json", function (data) {
            if (data) {
                var industryList = eval(data);
                var innerHtml = '';
                industryList.forEach(function (item, index) {
                    innerHtml += '<li data-val="' + item.value + '"><input name="businessVertical" type="checkbox" value="' + item.value + '" /> <span>' + Granite.I18n.get(item.name) + '</span></li>';
                });

                $select.find('ul').html(innerHtml);
                $select.hikMultiSelect();
            }
        });

        initialBusinessType($form);
        initialCountryRegion($form);
    }

    function initialBusinessType(form) {
        var option = {
            onSelected: function ($ele, $input) {
                var val = $input.data('value');
                $ele.find('input[name="Type"]').val(val).trigger('change').trigger('blur');
            },
            hasTooltip: true
        }
        
        return form.find('.hik-outlined-select.business-type').hikSelect(option);
    }

    function initialCountryRegion(form) {
        var option = {
            onSelected: function ($ele, $input) {
                var val = $input.data('value');
                var code = $input.data('country-code');
                $ele.find('input[name="Country"]').val(val).trigger('change').trigger('blur');
                $ele.find('input[name="countryCode"]').val(code).trigger('change').trigger('blur');
            },
            hasTooltip: true
        }
        
        return form.find('.hik-outlined-select.country-region').hikSelect(option);
    }
})
/*******************************************************************************
 * Copyright 2016 Adobe Systems Incorporated
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 ******************************************************************************/
/* global
    Granite, Coral
 */

$(document).ready(function () {
    function verifyProductCode($btn) {
        var value = $btn.closest('.maintenance-status-search-comp').find('.search-info .text-input.active').val().trim();
        var rep = /^[a-zA-Z0-9]{1,32}$/;
        if (rep.test(value)) {
            return true;
        }
        return false;
    }

    function success(resp, $comp) {
        var $resultWrapper = $comp.find('.maintenance-status-result-wrapper');
        $comp.find('.maintenance-status-search-wrapper').hide();
        $resultWrapper.show();
        var $resultContainer = $('<div>', {class: 'result-wrapper'});
        $resultContainer.prependTo($resultWrapper);
        $('<div>', {class: 'title', text: Granite.I18n.get('Repairing Status')}).prependTo($resultWrapper);
        $('<div>', {class: 'action'}).append($('<button>', {
            class: 'return-select',
            text: Granite.I18n.get('Search again')
        })).appendTo($resultWrapper);
        $.each(resp, function (index, val) {
            appendData(val, $resultContainer);
        })

    }

    function error(resp, $comp) {
        if (resp.status == 404) {
            $comp.find('.maintenance-status-no-result-wrapper').show();
            $comp.find('.maintenance-status-search-wrapper').hide();
        } else if (resp.status == 500 && resp.responseJSON.message == 'Invalid verification code.') {
            $comp.find('.search-verification .erro-message').addClass('show');
        } else if (resp.status == 500 && resp.responseJSON.message == 'Please enter a valid barcode to execute the query.') {
            $comp.find('.search-verification img').attr('src', "/bin/hikvision/kaptcha.jpg?k=" + new Date().getTime());
            $comp.find('.search-info .erro-message').addClass('show');
        }
    }

    function selectRequest($comp) {
        var code = $comp.find('#maintenanceProductNumber').val();
        if (code.length < 5) {
            var $erroMesg = $comp.find('#productNumberError');
            $erroMesg.addClass('show');
            return;
        }
        var url = $comp.find('.search-section .action').attr('data-path');
        var countryCode = $comp.find('.search-section .action').attr('data-countryCode');
        var params = {
            QueryType: 'byBarcode',
            userInput: code,
            Verification: $comp.find('#maintenanceVCode').val(),
            langu: 'E',
            countryCode: countryCode
        }
        $.ajax({
            type: 'POST',
            url: url + '.json',
            data: params,
            dataType: "json",
            success: function (data) {
                success(data, $comp);
                $comp.find('.search-verification img').attr('src', "/bin/hikvision/kaptcha.jpg?k=" + new Date().getTime());
            },
            error: function (data) {
                error(data, $comp);
                $comp.find('.search-verification img').attr('src', "/bin/hikvision/kaptcha.jpg?k=" + new Date().getTime());
            }
        })
    }

    /**
     * currentStep
     * 0:Repairing
     * 1:Repaired
     * :Shipped
     * @param step
     * @param currentStep
     * @param data
     * @returns status info
     */
    function renderSectionStep(step, currentStep, data) {
        var className = (step == currentStep) ? 'doing-state' : ((step > currentStep) ? 'done-state' : '');
        var titleName;
        var date;
        var message;

        if (currentStep === 0) {
            titleName = Granite.I18n.get("Repairing");
            date = data.CDATE;
            message = data.TISTATUS === 'Waiting for spare parts' || data.TISTATUS === 'Waiting for component'
                ? Granite.I18n.get("Device received, waiting for component(s)")
                : Granite.I18n.get("Device received, under repair");
        } else if (currentStep === 1) {
            titleName = Granite.I18n.get("Repaired");
            date = data.FIXDT;
            message = Granite.I18n.get('Repaired, ready for delivery');
        } else {
            titleName = Granite.I18n.get("Shipped");
            date = data.DLDAT;
            if (data.TDLTYP === 'Customer pick up') {
                message = Granite.I18n.get("Self-pickup");
            } else if (data.TDLTYP === 'Express') {
                var shippedDexpRess = Granite.I18n.get('Courier Services Company') + ": " + data.DEXPRESS;
                var shippedDexpNo = Granite.I18n.get('Tracking Number') + ": " + data.DEXPNO;
                message = shippedDexpRess + "<br>" + shippedDexpNo;
            } else if (data.TDLTYP === 'Back to warehouse') {
                message = "";
            } else {
                message = "";
            }
        }

        var $sectionStep = $('<div>', {class: 'section ' + className});
        var $state = $('<div>', {class: 'state'}).appendTo($sectionStep);
        var $stateBox = $('<div>', {class: 'state-box'}).appendTo($state);
        $('<div>', {class: 'process-number'}).append($('<span>', {text: currentStep + 1})).appendTo($stateBox);
        $('<span>', {class: 'state-title', text: titleName}).appendTo($stateBox);
        $('<div>', {class: 'time', text: className != '' ? formatDate(date) : ''}).appendTo($sectionStep);
        $('<div>', {class: 'message', html: className != '' ? message : ''}).appendTo($sectionStep);
        return $sectionStep;
    }

    function appendData(data, $ele) {
        var step = getStatusStep(data.TISTATUS);
        var $resultItem = $('<div>', {class: 'result-item'}).appendTo($ele);
        var cnRegex = /[(\u4e00-\u9fa5)(\uff08-\uff09)]+/g;
        $resultItem.append($('<div>', {
            class: 'serialNumber',
            text: Granite.I18n.get("Device Serial Number") + '：' + data.BARCD
        }));
        if (!$ele.parent().data("device-model")) {
            $resultItem.append($('<div>', {
                class: 'deviceModel',
                text: Granite.I18n.get("Device Model") + '：' + data.MAKTX.replace(cnRegex, "")
            }));
        }
        var $process = $('<div>', {class: 'process'}).appendTo($resultItem);
        renderSectionStep(step, 0, data).appendTo($process);
        renderSectionStep(step, 1, data).appendTo($process);
        renderSectionStep(step, 2, data).appendTo($process);
    }

    function getStatusStep(status) {
        if (status === 'Ready for shipment'
            || status === 'Shipped out but waiting for Payment'
            || status === 'Shipped to be peyment') {
            return 1;
        } else if (status == 'Shipped out') {
            return 2;
        } else {
            return 0;
        }
    }

    function formatDate(date) {
        return date && date != "00000000" ? date.substring(0, 4) + '-' + date.substring(4, 6) + '-' + date.substring(6, 8) : "";
    }

    $(document).on("click", ".search-verification img", function (e) {
        e.target.src = "/bin/hikvision/kaptcha.jpg?k=" + new Date().getTime();
    });

    $('.maintenance-status-search-comp .action .select').click(function () {
        var $comp = $(this).closest('.maintenance-status-search-comp');
        var $erroMesg = $comp.find('.search-info .erro-message');
        if (verifyProductCode($(this))) {
            $erroMesg.removeClass('show');
            selectRequest($comp);
        } else {
            $erroMesg.addClass('show');
        }
        ;

    })
    $('.maintenance-status-search-comp').on('click', '.action .return-select', function () {
        var $comp = $(this).closest('.maintenance-status-search-comp');
        var $noResultWrapper = $comp.find('.maintenance-status-no-result-wrapper');
        var $searchWrapper = $comp.find('.maintenance-status-search-wrapper');
        var $resultWrapper = $comp.find('.maintenance-status-result-wrapper');
        $searchWrapper.show();
        $resultWrapper.hide();
        $noResultWrapper.hide();
        $comp.find('#maintenanceProductNumber').val("");
        $comp.find('#maintenanceVCode').val("");
        $resultWrapper.children().remove();
        $comp.find('.search-verification img').attr('src', "/bin/hikvision/kaptcha.jpg?k=" + new Date().getTime());
        $comp.find('.erro-message').removeClass('show');
    })
})

function ProductsTab() {
  this.scrollWidth = 0;
  this.clientWidth = 0;
}

ProductsTab.prototype = {
  checkSlideAction: function() {
    var $element = $('.products-tab');
    var $leftAction = $element.find('.slide-left-action');
    var $rightAction = $element.find('.slide-right-action');
    var scrollLeft = parseInt($element.find('.tab-list')[0].scrollLeft);
    if (scrollLeft > 0) {
      $leftAction.addClass('enable-action');
    } else {
      $leftAction.removeClass('enable-action');
    }
    if (this.scrollWidth - scrollLeft > this.clientWidth) {
      $rightAction.addClass('enable-action');
    } else {
      $rightAction.removeClass('enable-action');
    }
  },
  initSlideAction: function() {
    var $element = $('.products-tab');
    var $slideAction = $element.find('.slide-action');
    var breakpoint = window.innerWidth;
    if (this.scrollWidth > this.clientWidth && breakpoint > 768) {
      $slideAction.show();
    } else {
      $slideAction.hide();
    }
  },
  animateScroll: function(scrollLeft) {
    var that = this;
    $('.products-tab .tab-list').animate({'scrollLeft': scrollLeft}, 300, function() {
      that.checkSlideAction();
    });
  },
  bindEvent: function() {
    var that = this;
    var $element = $('.products-tab');
    $element.find('.slide-action .is-active').click(function() {
      var scrollLeft = parseInt($element.find('.tab-list')[0].scrollLeft);
      var $parent = $(this).closest('.slide-action');
      if ($parent.hasClass('slide-right-action')) {
        if (that.scrollWidth - scrollLeft >= that.clientWidth) {
          that.animateScroll(scrollLeft + that.clientWidth);
        } else {
          that.animateScroll(that.scrollWidth - that.clientWidth);
        }
      } else {
        if (scrollLeft >= that.clientWidth) {
          that.animateScroll(scrollLeft - that.clientWidth);
        } else {
          that.animateScroll(0);
        }
      }
    });

    $element.find('.tab-list .nav-link').click(function(e) {
      e.preventDefault();
      var offsetLeft = $(this).offset().left;
      var parentOffsetLeft = $(this).closest('.nav-tabs').offset().left;
      var position = offsetLeft - parentOffsetLeft;
      var scrollLeft = parseInt($element.find('.tab-list')[0].scrollLeft);
      var href = $(this).attr('href');
      var $flyoutLink = $element.find('.flyout-list .item-link[href="' + href + '"]');
      $flyoutLink.addClass('active');
      $flyoutLink.closest('.list-item').siblings().find('.item-link').removeClass('active');
      if (that.scrollWidth - scrollLeft >= that.clientWidth) {
        that.animateScroll(position);
      } else {
        that.animateScroll(scrollLeft - that.clientWidth);
      }
    });

    $element.find('.flyout-list .item-link').click(function(e) {
      e.preventDefault();
      var href = $(this).attr('href');
      var $tabItem = $element.find('.tab-list .nav-link[href="' + href + '"]');
      $(this).addClass('active');
      $(this).closest('.list-item').siblings().find('.item-link').removeClass('active');
      $(this).closest('.flyout-panel').find('.close-flyout').click();
      $tabItem.click();
    });

    $element.find('.flyout .close-flyout').click(function() {
      $element.find('.flyout .flyout-panel').hide();
      $('html, body').removeClass('disable-page-scroll');
    });

    $element.find('.flyout .open-flyout').click(function() {
      $element.find('.flyout .flyout-panel').show();
      $('html, body').addClass('disable-page-scroll');
    });
  },
  init: function() {
    var that = this;
    $(document).ready(function() {
      var tabList =  $('.products-tab .tab-list')[0];
      if(tabList){
          that.scrollWidth = tabList.scrollWidth;
          that.clientWidth = tabList.clientWidth;
          that.bindEvent();
          that.initSlideAction();
          that.checkSlideAction();
          //that.initSpecScroll();
          techSpecs.initSpecScroll();
      }
    });
    
    $(window).resize(function() {
      var tabList =  $('.products-tab .tab-list')[0];
      var breakpoint = window.innerWidth;
      var $selectedItem = $('.products-tab .tab-list .nav-link.active');
      if(tabList){
          that.scrollWidth = tabList.scrollWidth;
          that.clientWidth = tabList.clientWidth;
      }

      $selectedItem.click();

      that.initSlideAction();
      if (breakpoint <= 768) {
        $('.products-tab .flyout .close-flyout').click();
      }
    });
  }
}

var productsTab = new ProductsTab();
productsTab.init();

$(document).ready(function() {
    function isMobileBreakPoint() {
        if ($(window).width() < 992) {
            return true;
        }

        return false;
    }

    function setImgSectionHeight($comp) {
        var height = $comp.find(".sticky-box").outerHeight(true);
        $comp.find(".img-section").css("height", height);
    }

    function updateStickyBoxPosition($comp) {
        var $stickyBox = $comp.find('.sticky-box');
        var cot = $comp.offset().top;
        var wst = $(window).scrollTop();
        var coh = $comp.outerHeight(true);
        var wh = $(window).height();
        var reg1 = cot - wst <= 0;
        var reg2 = (cot + coh) >= (wst + wh);
        var reg3 = (cot + coh - wst) >= $comp.find('.content-item:last-child').outerHeight(true) + $stickyBox.outerHeight(true) + 80;
        var width = $comp.find('.img-section').outerWidth(true);

        width = isMobileBreakPoint()? (width + parseInt($stickyBox.css("paddingLeft"))*2) : width;
        if (reg1 && reg2 || reg1 && reg3) {
            var left = $comp.find('.content-container').offset().left;
            $stickyBox.removeClass('sticky-bottom');
            $stickyBox.addClass('fixed-position');
            $stickyBox.css({'left': left, 'width': width});
        } else {
            if($comp.find('.content-item:first-child').hasClass('active') || $comp.find('.content-item:last-child').hasClass('active')) {
                $stickyBox.removeClass('fixed-position');
                $stickyBox.css({'left': 0, 'width': width});

                if (!reg1) {
                    $stickyBox.removeClass('sticky-bottom');
                } else {
                    if (!$stickyBox.hasClass('sticky-bottom')) {
                        var lastContentH = $comp.find('.content-item').last().outerHeight(true) + 75;
                        var imgHeight = $comp.find('.img-section').height();
                        var bottom = (lastContentH + imgHeight) <= wh ? lastContentH : (wh - imgHeight);

                        $stickyBox.addClass('sticky-bottom');
                        $stickyBox.css('bottom', bottom);
                    }
                }
            }
        }
    }

    function updateContentState($comp) {
        var $contentItems = $comp.find('.content-section .content-item');
        var stickyBoxHeight = $comp.find('.sticky-box').outerHeight(true);
        var baseHeight;

        if (isMobileBreakPoint()) {
            baseHeight = stickyBoxHeight + 60;
        } else {
            baseHeight = $(window).height() / 2;
        }

        $contentItems.each(function(index) {
            var ItemToWinTopH = $(this).offset().top - $(window).scrollTop();
            if ((index + 1) < $contentItems.length) {
                var ItemTopWinTopHNext = $contentItems.eq(index + 1).offset().top - $(window).scrollTop();

                if (ItemToWinTopH <= baseHeight && ItemTopWinTopHNext > baseHeight) {
                    $(this).addClass('active');
                    $(this).siblings().removeClass('active');
                    return false;
                }
            }

            if ((index + 1) == $contentItems.length) {
                if (ItemToWinTopH <= baseHeight) {
                    $(this).addClass('active');
                    $(this).siblings().removeClass('active');
                    return false;
                }

                if ($(window).scrollTop() > ($comp.offset().top + $comp.height())) {
                    $(this).siblings().removeClass('active');
                    $(this).addClass('active');
                } else {
                    $contentItems.eq(0).siblings().removeClass('active');
                    $contentItems.eq(0).addClass('active');
                }
            }
        });
    }
    function imageChange($comp){
        var activeImage = $comp.find('.sticky-box').find('.img-box');
        // var img = activeImage.find('img');
        var desktopImg = activeImage.find('.desktop-img');
        var activeDescrption = $comp.find('.content-section').find('.content-item.active');
        var src = '';
        if($(window).width() >= 992){
            src = activeDescrption.find(".image").attr("src");
        }else{
            src = activeDescrption.find(".imageMobile").attr("src");
        }
        // img.attr('src',src);
        desktopImg.css("background-image", "url('" + src + "')")
        if($(window).width() < 992){

        }
    }
    $('.ai-campaign-sketch-column-comp').each(function(){
        var $target = $(this);
        setImgSectionHeight($target);
        updateContentState($target);
        updateStickyBoxPosition($target);
        imageChange($target);
        $(window).scroll(function() {
            updateContentState($target);
            updateStickyBoxPosition($target);
            imageChange($target);
        });

        $(window).resize(function() {
            setImgSectionHeight($target);
            updateContentState($target);
            updateStickyBoxPosition($target);
            imageChange($target);
        });
    });
});
$(document).ready(function() {
    function updateBackDropOpacity($backDrop, cot, wst, ch, wh) {
        var h;
        var backdropOffsetValT;
        var backdropOffsetValB;
        if (ch < 1.6*wh) { //only have one section
            h = ch - 1.2*wh;
            backdropOffsetValT = 0.1*wh;
            backdropOffsetValB = 0.1*wh;
        } else {
            h = ch - 1.6*wh;
            backdropOffsetValT = 0.4*wh;
            backdropOffsetValB = 0.2*wh;
        }

        var reg1 = (cot + backdropOffsetValT - wst) <= 0;
        var reg2 = (cot + backdropOffsetValT + h*0.25) >= wst;
        var reg3 = (cot + backdropOffsetValT + h*0.75) >= wst;
        var reg4 = (cot + backdropOffsetValT + h) >= wst;
        var reg5 = (cot + ch - backdropOffsetValB) >= (wst + wh);
        if (reg1 && reg2 && reg5) {
            var opacity = parseFloat((wst - cot - backdropOffsetValT) / (h*0.25)*0.5);
            $backDrop.css("opacity", opacity);
        } else if (reg1 && reg3 && reg5) {
            $backDrop.css("opacity", 0.5);
        } else if (reg1 && reg4 && reg5) {
            var opacity = parseFloat(0.5 + (wst - cot - backdropOffsetValT - 0.75*h) / (h*0.25)*0.5);
            $backDrop.css("opacity", opacity);
        } else if (reg1 && reg5) {
            $backDrop.css("opacity", 1);
        } else {
            if (!reg1) {
                $backDrop.css("opacity", 0);
            } else {
                $backDrop.css("opacity", 1);
            }
        }
    }

    function updateBackgroundPosition($comp) {
        var $background = $comp.find('.background-box');
        var $backDrop = $comp.find('.back-drop');
        var cot = $comp.offset().top;
        var wst = $(window).scrollTop();
        var ch = $comp.height();
        var wh = $(window).height();
        var reg1 = cot - wst <= 0;
        var reg2 = (cot + ch) >= (wst + wh);
        if (reg1 && reg2) {
            $background.addClass('fixed-position');
            $background.removeClass('sticky-bottom');
            $backDrop.addClass('fixed-position');
            $backDrop.removeClass('sticky-bottom');
        } else {
            $background.removeClass('fixed-position');
            $backDrop.removeClass('fixed-position');
            if (!reg1) {
                $background.removeClass('sticky-bottom');
                $backDrop.removeClass('sticky-bottom');
            } else {
                $background.addClass('sticky-bottom');
                $backDrop.addClass('sticky-bottom');
            }
        }
        updateBackDropOpacity($backDrop, cot, wst, ch, wh);
    }

    function updateContentPosition($content, wst, sot, scrollSectionH, offsetH) {
        var offsetVal = 5;
        var reg1 = wst - sot - offsetH >= 0;
        var reg2 = wst - sot - scrollSectionH < 0;
        if (reg1 && reg2) {
            offsetVal = 5 - (wst - sot - offsetH)/((scrollSectionH - offsetH)) * 10;
        } else {
            if (!reg1) {
                offsetVal = 5;
            } else {
                offsetVal = -5;
            }
        }
        $content.children().css("transform", "translateY("+ offsetVal +"vh)");
    }

    function updateContentContainerPosition($comp) {
        var multFlag = $comp.find('.content-container .section').length > 1;
        var wst = $(window).scrollTop();
        var wh = $(window).height();
        $comp.find('.content-container .section').each(function(index) {
            var $content = $(this).find('.content');
            var sot = $(this).offset().top;
            var sh = $(this).height();
            var reg1 = sot - wst <= 0;
            var reg2 = (sot + sh) >= (wst + wh);
            if (index == 0 && multFlag) {
                reg1 = sot + 0.2*wh - wst <= 0;
                reg2 = $(this).next().offset().top - 0.5*wh - wst > 0;
                if (reg1 && reg2) {
                    $content.addClass('fixed-position');
                    $content.removeClass('sticky-bottom-mult');
                    $(this).siblings().find('.content').removeClass('active');
                    $content.addClass('active');
                } else {
                    $content.removeClass('fixed-position');
                    if (!reg1) {
                        $content.removeClass('sticky-bottom-mult');
                        $content.removeClass('active');
                    } else {
                        $content.addClass('sticky-bottom-mult');
                        $content.removeClass('active');
                    }
                }
                updateContentPosition($content, wst, sot, wh, 0.2*wh);
            }

            if (index == 1 || !multFlag) {
                reg1 = multFlag ? (sot - 0.5*wh - wst) <= 0 : reg1;
                if (reg1 && reg2) {
                    $content.addClass('fixed-position');
                    $content.removeClass('sticky-bottom');
                    $(this).siblings().find('.content').removeClass('active');
                    $content.addClass('active');
                } else {
                    $content.removeClass('fixed-position');
                    if (!reg1) {
                        $content.removeClass('sticky-bottom');
                        $content.removeClass('active');
                    } else {
                        $content.addClass('sticky-bottom');
                        $content.addClass('active');
                        $(this).siblings().find('.content').removeClass('active');
                    }
                }
                multFlag ? updateContentPosition($content, wst, sot, wh, -0.5*wh) : updateContentPosition($content, wst, sot, 0.5 *wh, 0);
            }
        });
    }

    $('.ai-campaign-mult-color-comp').each(function(){
        var $target = $(this);
        updateBackgroundPosition($target);
        updateContentContainerPosition($target);
        $(window).scroll(function() {
            updateBackgroundPosition($target);
            updateContentContainerPosition($target);
        });

        $(window).resize(function() {
            updateBackgroundPosition($target);
            updateContentContainerPosition($target);
        });
    });

    // IE 、Edge浏览器 fixed 背景抖动处理
    function hasAIComponent() {
        var hasAIComp1 = $('.ai-campaign-sketch-container').length > 0;
        var hasAIComp2 = $('.ai-campaign-sketch-column-comp').length > 0;
        var hasAIComp3 = $('.ai-campaign-mult-color-comp').length > 0;

        return hasAIComp1 || hasAIComp2 || hasAIComp3;
    }

    if(hasAIComponent()) {
        if(navigator.userAgent.match(/Trident\/7\./)) {
            document.body.addEventListener && document.body.addEventListener("mousewheel", function() {
                event.preventDefault();
                var wd = event.wheelDelta;
                var csp = window.pageYOffset;
                window.scrollTo(0, csp - wd);
            });
        }
    }
});
$(function(){
    $(".close_x").on("click", function(){
        $(".identification-box").hide()
    })
    $.each($(".identification-body ul li"), function(){
        $(this).on("click", function(){
            $(this).addClass("active").siblings().removeClass("active")
        })
    })
    $(".identification-footer button").on("click", function(){
        var activeLi = $(".identification-body ul li.active");
        setQueryString("type", $(activeLi).attr("data-formType"));
        initFormType();
    })
    $(".organization-type .radio-input").on("change", function(e){
        var _this = this
        if(e.target.value){
            $("#organization-type").val(e.target.value)
            if(checkInputs($("#enquiry-form"), $("#enquiry-form").find("button[type='submit']"))){
                $("#cn-charity-campaign-submit").removeAttr("disabled");
            }
        }
        if(e.target.value == "3"){
            $(".gongyi-organizationtype-other-checkbox-parant").addClass("required")
            $(".gongyi-organizationtype-other-checkbox").attr("required", "required")
        } else {
            $(".gongyi-organizationtype-other-checkbox-parant").removeClass("required")
            $(".gongyi-organizationtype-other-checkbox").val("").removeAttr("required").removeClass("has-error")
            $("#organizationTypeOther-error").remove()
        }
      checkInputs($("#enquiry-form"), $("#enquiry-form").find("button[type='submit']"))  
      $(".gongyi-organizationtype-other-checkbox").on("input", function(){
        setTimeout(function(){
            checkRequired($("#enquiry-form"), $("#enquiry-form").find("button[type='submit']"))
        }, 500)
      })
    })
    $(".join-company .radio-input").on("change", function(e){
        if(e.target.value){
            $("#join-company").val(e.target.value)
            if(checkInputs($("#enquiry-form"), $("#enquiry-form").find("button[type='submit']"))){
                $("#cn-charity-campaign-submit").removeAttr("disabled");
            }
        }
        if(e.target.value == "1"){
            $(".join-company-parent").addClass("required")
            $(".hiknow-line-input.join-company").attr("required", "required")
        } else {
            $(".join-company-parent").removeClass("required")
            $(".hiknow-line-input.join-company").val("").removeAttr("required").removeClass("has-error");
            $("#joinCompany-error").remove();
        }
        checkInputs($("#enquiry-form"), $("#enquiry-form").find("button[type='submit']")) 
        $(".hiknow-line-input.join-company").on("input", function(){ 
            setTimeout(function(){
                checkRequired($("#enquiry-form"), $("#enquiry-form").find("button[type='submit']"))
            }, 500)
          })
    })
    var cooperations = []
    $(".cooperation-type input[type=checkbox]").on("change", function(e){
        var formType = getQueryString("type")
        if($(this).is(":checked")){
            cooperations.push($(this).val())
        } else {
            cooperations.splice(cooperations.indexOf($(this).val()),1) 
        }
        if(($(this).is(":checked") && e.target.value == '7') || cooperations.indexOf("7")!==-1){
            $(this).parent().parent().find("."+formType +"-cooperationtype-other-checkbox-parent").addClass("required")
            $("."+formType +"-cooperationtype-other-checkbox").attr("required", "required") 
        } else{
            $(this).parent().parent().find("."+formType +"-cooperationtype-other-checkbox-parent").removeClass("required")
            $("."+formType +"-cooperationtype-other-checkbox").val("").removeAttr("required")
        }
        $("#cooperation-type").val(cooperations.join(","))
        if(checkInputs($("#enquiry-form"), $("#enquiry-form").find("button[type='submit']"))){
            $("#cn-charity-campaign-submit").removeAttr("disabled");
        }
        $("."+formType +"-cooperationtype-other-checkbox").on("input", function(){
            setTimeout(function(){
                checkRequired($("#enquiry-form"), $("#enquiry-form").find("button[type='submit']"))
            }, 500)
        })
    })
    var cooperations1 = []
    $(".cooperation-type1 input[type=checkbox]").on("change", function(e){
        var formType = getQueryString("type")
        if($(this).is(":checked")){
            cooperations1.push($(this).val())
        } else {
            cooperations1.splice(cooperations.indexOf($(this).val()),1) 
        }
        if(($(this).is(":checked") && e.target.value == '7') || cooperations1.indexOf("7")!==-1){
            $(this).parent().parent().find("."+formType +"-cooperationtype1-other-checkbox-parent").addClass("required")
            $("."+formType +"-cooperationtype1-other-checkbox").attr("required", "required") 
        } else{
            $(this).parent().parent().find("."+formType +"-cooperationtype1-other-checkbox-parent").removeClass("required")
            $("."+formType +"-cooperationtype1-other-checkbox").val("").removeAttr("required", "required")
        }
        $("#cooperation-type1").val(cooperations1.join(","))
        if(checkInputs($("#enquiry-form"), $("#enquiry-form").find("button[type='submit']"))){
            $("#cn-charity-campaign-submit").removeAttr("disabled");
        }
        $("."+formType +"-cooperationtype1-other-checkbox").on("input", function(){
            setTimeout(function(){
                checkRequired($("#enquiry-form"), $("#enquiry-form").find("button[type='submit']"))
            }, 500)
        })
    })
    function initFormType(){
      var formType = getQueryString("type")
      if(formType){
        $(".cn-charity-campaign").addClass(formType)
        if(formType === 'gongyi'){
            $(".technology").find("input").removeAttr("required")
            $(".technology").find("textarea").removeAttr("required")
            $("#formCnCharityCampaignType").val("0")
        } else {
            $(".gongyi").find("input").removeAttr("required")
            $(".gongyi").find("textarea").removeAttr("required")
            $("#formCnCharityCampaignType").val("1")
        }
        $(".identification-box").hide()
      }
    }
});
//设置video-image-hidden外面的iframe的高度
if($(".video-image-hidden").length){
    $.each($(".video-image-hidden"),function(){
        $(this).parent().css({
            height: $(this).height()
        })
    })
}

(function (document, $) {
    var inMobile = false;
    var $bannerWrapper = $(".new-split-banner-wrapper");
    var isIpad = true
    

    var isIpadFn = function () {
        isIpad = navigator.appVersion.indexOf('iPad') > -1
    }
    isIpadFn()

    var initClick = function () {
        $bannerWrapper.find(".new-split-banner-col-des-mobile").on("click", function () {
            clickMobile($(this).prev())
        })
    };
    var clickMobile = function (mobile) {
        mobile[0].click()
    };

    var initIEHover = function () {
        var bgIE = $bannerWrapper.find(".public-style") 
        // bgIE.each(function () {
        //     $(this).find("a").css({"background-size":"100%"})
        // })
        if (window.innerWidth > 768) {
            bgIE.each(function () {
                $(this).hover(function(){
                    $(this).find("a").stop().animate({backgroundSize:"115%"})
                },function(){
                    $(this).find("a").stop().animate({backgroundSize:"105%"})
                })
            })
        }else {
            bgIE.each(function () {
                $(this).find("a").css({"background-size":"100%"})
                $(this).unbind('mouseover').unbind('mouseout')
                $(this).hover(function(){
                    $(this).find("a").stop().animate({backgroundSize:"100%"})
                })
            })
        }
        
    }
    $(document).ready(function () {
        initClick();
        initIEHover()
        var publicHover = $bannerWrapper.find(".public-style")
        if(isIpad){
            publicHover.each(function () {
                $(this).hover(function () {
                    $(this).find(".new-split-banner-col-des").css({
                        '-webkit-transform':'translate(0%, 35%)',
                        '-moz-transform': 'translate(0%, 35%)',
                        'transform': 'translate(0%, 35%)',
                        'transition': 'none'
                    })
                    $(this).find("a").css({
                        'background-size':'cover',
                        'transition': 'none'
                    })
                })
            })
        }
        $(window).resize(function () {
            var $bannerWrapper = $(".new-split-banner-wrapper");
            var $newSplitBanners = $bannerWrapper.find(".public-style");
            if (window.innerWidth > 768) {
                initIEHover();
                if (inMobile) {
                    inMobile = false;
                    $newSplitBanners.each(function () {
                        var $banner = $(this);
                        var $this = $banner.find(".bg-box");
                        var originalImage = $this.data('original');
                        replaceWebpOriginal($this)
                       // $this.css('background-image', 'url("' + originalImage + '")');
                    });
                }
            } else {
                initIEHover();
                if (!inMobile) {
                    inMobile = true;
                    $newSplitBanners.each(function () {
                        var $banner = $(this);
                        var $this = $banner.find(".bg-box");
                        var originalImageMobile = $this.data('original-mobile');
                        replaceWebpOriginal($this)
                       // $this.css('background-image', 'url("' + originalImageMobile + '")');
                    });
                }
            }
        });
        $bannerWrapper.find('a.lazy-banner').on('click',function(){
            var analyticsStr=$(this).attr('data-analytics')
            HiAnalyticsCn.clickDown(analyticsStr)         
        })
    });
})(document, $);
//use hiknow-v2 new-split-banner.js
$(document).ready(function() {
    function isMobileBreakPoint() {
        if ($(window).width() < 992) {
            return true;
        }

        return false;
    }

    function addBackdrop() {
        var backdrop = '<div class="academy-course-backdrop"></div>';
        if (!$('.academy-course-backdrop').length) {
            $('body').append(backdrop);
            $('body').addClass('academy-backdrop-open');
        }
    }

    function removeBackdrop() {
        $('.academy-course-backdrop').remove();
        $('body').removeClass('academy-backdrop-open');
    }

    function updateMobileFilterBtnState($comp) {
        $comp.find('.academy-courses-filter-nav .nav-section').each(function() {
            if ($(this).hasClass('multi-chosen')) {
                if ($(this).find('.filter-option.temp-checked').length == $(this).find('.filter-option').length) {
                    $(this).find('.section-title').removeClass('has-filtered');
                } else {
                    $(this).find('.section-title').addClass('has-filtered');
                }
            } else {
                if ($(this).find('.filter-option:first-child').hasClass('temp-checked')) {
                    $(this).find('.section-title').removeClass('has-filtered');
                } else {
                    $(this).find('.section-title').addClass('has-filtered');
                }
            }
        });

        if ($comp.find('.academy-courses-filter-nav .section-title.has-filtered').length) {
            $comp.find('.mobile-application-container .filter-list-btn').addClass('has-filtered');
        } else {
            $comp.find('.mobile-application-container .filter-list-btn').removeClass('has-filtered');
        }
    }

    //cardTag: "xx;xx;xx;xx;" eg: "tag1;tag2;"
    function ifShowCard(cardTitle, cardTag, cardDescription, searchVal, $allFilterSection) {
        var showFlag = true;
        //search
        if (cardTitle.indexOf(searchVal) < 0 && cardDescription.indexOf(searchVal) < 0) {
            return false;
        }
        //nav-filter
        $allFilterSection.find('.nav-section.multi-chosen .filter-option:not(.checked)').each(function() {
            var filter = $(this).attr('data-tag') + ';';
            if (cardTag.indexOf(filter) >= 0) {
                showFlag = false;
                return false;
            }
        });

        if (!showFlag) {
            return false;
        }
        //select-filter
        $allFilterSection.find('.nav-section.single-chosen .filter-option.checked:not([data-tag="all"])').each(function() {
            var filter = $(this).attr('data-tag') + ';';
            if (cardTag.indexOf(filter) < 0) {
                showFlag = false;
                return false;
            }
        });

        return showFlag;
    }

    function ifShowNoResultIcon($comp) {
        var $visibleCourseCard = $comp.find('.course-card:visible');
        if($visibleCourseCard.length) {
            $comp.find('.no-result-found').hide();
        } else {
            $comp.find('.no-result-found').show();
        }
    }

    function applyFilter($comp) {
        var $courseList = $comp.find('.academy-courses-list-section .course-card');
        var searchVal = $comp.find('.search-container').attr('data-searchval').trim().toLowerCase();
        var $allFilterSection = $comp.find('.academy-courses-filter-nav .main-container');
        $courseList.each(function() {
            var cardTitle = $(this).find('.course-title').text().toLowerCase();
            var cardDescription = $(this).find('.course-description').length? $(this).find('.course-description').text().toLowerCase() : '';
            var cardTag = $(this).attr('data-tag')?$(this).attr('data-tag'):'';
            var showAsset = true;
            showAsset = ifShowCard(cardTitle, cardTag, cardDescription, searchVal, $allFilterSection);
            if (showAsset) {
                $(this).removeClass('not-in-scope');
                $(this).addClass('hide-for-load');
            } else {
                $(this).addClass('not-in-scope');
                $(this).removeClass('hide-for-load');
            }
        });
        initLoadingMore($comp);
        ifShowNoResultIcon($comp);
    }

    function initLoadingMore($comp) {
        var cardSize = 6;
        var $cardListContainer = $comp.find('.academy-courses-list-section');
        var len = $cardListContainer.find('.course-card:not(.not-in-scope).hide-for-load').length;
        if(len <= cardSize && len > 0){
            $cardListContainer.find('.course-card.hide-for-load').each(function(){
                $(this).removeClass('hide-for-load');
            });
        }else if(len > cardSize ){
            $cardListContainer.find('.course-card.hide-for-load:lt('+ cardSize + ')').each(function() {
                $(this).removeClass("hide-for-load");
            });
        }
        isVideo($comp)
        $(".academy-courses-list-loading").hide();
    }

    var mobileScrollLoadPrevent = false;
    function scrollToLoad($comp) {
        var $cotentContainer = $comp.find('.academy-courses-list-section');
        var bh = $cotentContainer.height() + $cotentContainer.offset().top + 25;

        if(($(window).height() + $(window).scrollTop() > bh) && $(window).scrollTop() < bh && !mobileScrollLoadPrevent) {
            var len = $comp.find('.course-card:not(.not-in-scope).hide-for-load').length;
            if(len > 0){
                mobileScrollLoadPrevent = true;
                $(".academy-courses-list-loading").show();
                setTimeout(function(){
                    initLoadingMore($comp);
                    mobileScrollLoadPrevent = false;
                }, 800);
            }
        }
    }

    //登录弹框
    function checkLoginHandle($comp){
        var $cardList = $comp.find(".academy-courses-list-section");
        $cardList.find(".course-link").each(function(){
            var checkLogin = $(this).data("check-login");
            if(checkLogin){
                $(this).on('click',function(){
                    var ticket = getLoginCookie("ticket");
                    if(ticket && ticket!="123"){
                        loginUtil.checkLogin();
                    }else{
                        loginUtil.popupLoginConfirmModal();
                        return false;
                    }
                })
            }
        });
    };
    $('.academy-courses-list-comp .mobile-application-container .filter-list-btn').click(function() {
        $(this).closest('.academy-courses-filter-nav').find('.main-container').addClass('main-container-slide-out');
        addBackdrop();
    });

    $('.academy-courses-list-comp .academy-courses-filter-nav .mobile-close').click(function() {
        var $filterContainer = $(this).closest('.main-container');
        $filterContainer.removeClass('main-container-slide-out');
        $filterContainer.find('.filter-option.checked').addClass('temp-checked');
        $filterContainer.find('.filter-option:not(.checked)').removeClass('temp-checked');
        updateMobileFilterBtnState($(this).closest('.academy-courses-list-comp'));
        removeBackdrop();
    });

    $('body').on('click', '.academy-course-backdrop', function() {
        $('.academy-courses-list-comp .academy-courses-filter-nav .mobile-close').click();
    });
    function changeChecked (li) {
            if(li.hasClass('checked')){
                li.parent().find('.display-none-checked').trigger('click')
            }else{
                li.parent().find('.display-none-unchecked').trigger('click')
            }
    }
    
    $('.academy-courses-list-comp .academy-courses-filter-nav .nav-section.multi-chosen .filter-option').click(function() {
        if (isMobileBreakPoint()) {
            $(this).toggleClass('temp-checked');
        } else {
            $(this).toggleClass('checked temp-checked');
            applyFilter($(this).closest('.academy-courses-list-comp'));
        }
        changeChecked($(this))
        // var tmpStr = $(this).attr('data-information').replace(//)
        updateMobileFilterBtnState($(this).closest('.academy-courses-list-comp'));
    });
    
    $('.academy-courses-list-comp .academy-courses-filter-nav .nav-section.single-chosen .filter-option').click(function() {
        $(this).siblings().removeClass('temp-checked');
        $(this).addClass('temp-checked');
        updateMobileFilterBtnState($(this).closest('.academy-courses-list-comp'));
    });

    $('.academy-courses-list-comp .academy-courses-filter-nav .mobile-filter-action .reset-action').click(function() {
        var $navFilterBar = $(this).closest('.academy-courses-filter-nav');
        var $selectFilter = $(this).closest('.academy-courses-list-comp').find('.academy-courses-filter-bar select.filter-select');
        $navFilterBar.find('.nav-section.multi-chosen .filter-option').addClass('checked temp-checked');
        $navFilterBar.find('.nav-section.single-chosen .filter-option').removeClass('checked temp-checked');
        $navFilterBar.find('.nav-section.single-chosen .filter-option:first-child').addClass('checked temp-checked');
        $selectFilter.val('all');
        $selectFilter.selectpicker('refresh');
        $('.academy-courses-list-comp .academy-courses-filter-nav .mobile-close').click();
        updateMobileFilterBtnState($(this).closest('.academy-courses-list-comp'));
        applyFilter($(this).closest('.academy-courses-list-comp'));
    })

    $('.academy-courses-list-comp .academy-courses-filter-nav .mobile-filter-action .apply-filter-action').click(function() {
        var $comp = $(this).closest('.academy-courses-list-comp');
        var $navSection = $comp.find('.academy-courses-filter-nav .nav-section');
        var $mobilefilterSelect = $comp.find('.academy-courses-filter-nav .nav-section.single-chosen');
        var $filterSelect = $comp.find('.academy-courses-filter-bar select.filter-select');

        $navSection.find('.filter-option').removeClass('checked');
        $navSection.find('.filter-option.temp-checked').addClass('checked');
        $filterSelect.each(function(index) {
            var optionVal = $mobilefilterSelect.eq(index).find('.checked').attr('data-tag');
            $filterSelect.eq(index).val(optionVal);
            $filterSelect.eq(index).selectpicker('refresh');
        })
        $('.academy-courses-list-comp .academy-courses-filter-nav .mobile-close').click();

        updateMobileFilterBtnState($comp);
        applyFilter($(this).closest('.academy-courses-list-comp'));
    })

    //toggle bootstrap-select plugin
    $('.academy-courses-filter-bar select.filter-select').selectpicker({});

     $('.academy-courses-filter-bar select.filter-select').on('loaded.bs.select', function() {
        $(this).parent().find('button').attr('title', '');
     });

     $('.academy-courses-list-section').find('.course-link').each(function(){
        var newArr = []
        if($(this).attr('href')){
           newArr = $(this).attr('href').replace(/.html/g,'').split('/')
        }
        var atModule = $(this).attr('data-at-module')
        var lastParams = atModule + '::' + newArr[newArr.length - 1]
        $(this).attr('data-at-module',lastParams)
     })
    //  $('.academy-courses-filter-bar .btn.dropdown-toggle.btn-light').on('click', function() {
    //     var parent = $(this).parent()
    //     var li = parent.find('.dropdown-menu').find('li')
    //     var text = $(this).parent().parent().attr('data-select-all')
    //     li.each(function(){
    //         $(this).find('a').addClass('at-action')
    //         $(this).find('a').attr('data-at-module','academy_top_filter::'+text+'::'+$(this).find('.text').text()+'')
    //     })

    // })
    $('.academy-courses-filter-bar select.filter-select').on('changed.bs.select', function() {
        var tagValue = $(this).val();
        var index = $(this).closest('.filter-category').index();
        var $mobilefilterSelect = $(this).closest('.academy-courses-list-comp').find('.academy-courses-filter-nav .nav-section.single-chosen');
        var $mobileTargetFilter = $mobilefilterSelect.eq(index).find('[data-tag="'+tagValue+'"]');
        $mobileTargetFilter.addClass('checked temp-checked');
        $mobileTargetFilter.siblings().removeClass('checked temp-checked');
        updateMobileFilterBtnState($(this).closest('.academy-courses-list-comp'));
        if (!isMobileBreakPoint()) {
            applyFilter($(this).closest('.academy-courses-list-comp'));
        }
        $(this).parent().find('button').attr('title', '');
    });

    $('.academy-courses-list-comp .search-container .course-search-btn').click(function() {
        var $allSearchContainer = $(this).closest('.academy-courses-list-comp').find('.search-container');
        var searchVal = $(this).closest('.search-container').find('.courses-search').val();
        $allSearchContainer.find('.courses-search').val(searchVal);
        $allSearchContainer.find('.courses-search').blur();
        $allSearchContainer.attr('data-searchval', searchVal);
        applyFilter($(this).closest('.academy-courses-list-comp'));
    });

    $('.academy-courses-list-comp .search-container .search-clear-btn').mousedown(function() {
        var $searchContainer = $(this).closest('.search-container');
        $searchContainer.find('.courses-search').val('');
        $searchContainer.attr('data-searchval','');
    });

    $('.academy-courses-list-comp .search-container').focus(function() {
        $(this).find('.courses-search').focus();
    });

    $('.academy-courses-list-comp .search-container .courses-search').keyup(function(e) {
        if (e.keyCode == 13){
            $(this).closest('.search-container').find('.course-search-btn').click();
        }
    });

    //don't support for ie11
    $('.academy-courses-list-comp .search-container .courses-search').bind('search', function() {
        $(this).closest('.search-container').find('.course-search-btn').click();
    });
   // 获取视频第一帧
   function getFirstFrame(videoCover,index, callback){
    var videos = '<video id="video" class="video123" controls="controls" style="visibility:hidden">'+
    '<source src="'+videoCover+'">'+
    '</video>'  
    $("body").append(videos) 
    var canvas = document.createElement('canvas')
    var video = $('.video123')[index];
    video.setAttribute('crossOrigin', 'anonymous')
    canvas.width = video.clientWidth
    canvas.height = video.clientHeight
    video.onloadeddata = function() {
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height)
    var dataURL = canvas.toDataURL('image/png')
    callback(dataURL)
    $('.video123').remove();   
    } 
   }
    function isVideo($comp){
        var arrVideos = []
        var liList = $comp.find('.courses-list-filter-wrapper').find('.academy-courses-list-section').find('.course-card')
        liList.each(function(index, item){
            if($(this).find('a').attr('data-video-path') && ! $(this).attr('data-bg')){
                arrVideos.push({
                    videoPath:$(item).find('a').attr('data-video-path'),
                    element: $(item)
                })
            }
            if($(this).find('.course-unLink')){
                $(this).find('.course-unLink').css({
                    height:$(this).outerHeight() - $(this).find('.course-img').outerHeight() + 'px'
                })
            }            
        })
        $.each(arrVideos.filter(function(item){
            return item.videoPath.indexOf('youtube') === -1
        }), function(index, item){
            var $this = $(item.element)
            var videoCover = item.videoPath
            getFirstFrame(videoCover,index, function(dataURL){
                $this.find('.card-content').find('.course-img').css({
                'background-image': 'url('+dataURL+')'
                })
          })
            
        })
        $.each(arrVideos.filter(function(item){
            return item.videoPath.indexOf('youtube') !== -1
        }), function(index, item){
            var $this = $(item.element)
            var videoCover = item.videoPath
            var youtubeVideoId = getYoutubeVideoId(videoCover, 'v')
            var youtubeImage =location.protocol + '//img.youtube.com/vi/' +youtubeVideoId+ '/0.jpg'
            $this.find('.card-content').find('.course-img').css({
                'background-image': 'url('+youtubeImage+')'
            }) 
        })
    }
    function getYoutubeVideoId(url,name) {
        if(!url) return ""
            if(url.indexOf(name + '=')!==-1){
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var urlIndex = url.indexOf('?')
            var r = url.slice(urlIndex + 1, url.length).substr(0).match(reg);
            if (r != null) return unescape(r[2]);
            return "";
            } else {
                // https://youtu.be/_oiWSL5xSGA
                if(url.indexOf('youtu') !== -1) {
                    var lastUrlId = url.lastIndexOf('/')
                    return url.slice(lastUrlId+1, url.length+1)
                } else {
                return "";
                }
            }
    }
    $('.academy-courses-list-comp').each(function() {
        var $comp = $(this);
        initLoadingMore($comp);
        checkLoginHandle($comp);
        isVideo($comp)
        window.onwheel = function() {
            if (document.body.scrollHeight <= window.innerHeight) {
                scrollToLoad($comp);
            }
        };

        $(window).scroll(function(){
            if (document.body.scrollHeight > window.innerHeight) {
                scrollToLoad($comp);
            }
        });
    });
});
$(document).ready(function() {
    function isMobileBreakPoint() {
        if ($(window).width() < 992) {
            return true;
        }

        return false;
    }

    function updateSectionTitle($comp, $targetSection) {
        var sectionTitle = $targetSection.find('.sub-course.playing .course-title').text();
        $comp.find('.academy-course-section-wrapper .course-section-name').html(sectionTitle);
    }

    function updateIntroduction($comp) {
        var $introductionWrapper = $comp.find('.introduction-wrapper');
        var index;
        $comp.find('.sub-course').each(function(i) {
            if ($(this).hasClass('playing')) {
                index = i;
                return false;
            }
        });
        $introductionWrapper.removeClass('show-introduction');
        $introductionWrapper.eq(index).addClass('show-introduction');
    }

    var $videoPlayerPlyr
    function updateVolumeTextValue($videoWrapper) {
        var $volumeVal = $videoWrapper.find('.plyr__volume .plyr__volume-value');
        var value = parseInt($videoWrapper.find('.plyr__volume input').attr('aria-valuenow')) + '%';
        $volumeVal.text(value);
    }

    function updateVideo($courseItem, $videoWrapper) {
        var isInternalVideo = $courseItem.attr("data-is-internal");
        var videoPath = $courseItem.attr("data-video-path") ? $courseItem.attr("data-video-path") : "";
        if(isInternalVideo == 'true') {
            $videoPlayerPlyr.source = {
                type: "video",
                sources: [
                    {
                        src: videoPath,
                        type: "video/mp4"
                    }
                ]
            }
        } else {
            $videoPlayerPlyr.source = {
                type: "video",
                sources: [
                    {
                        src: videoPath,
                        provider: "youtube"
                    }
                ]
            }
        }
    }
    
    $('.academy-course-detail-comp').find('.academy-course-detail-main-wrapper').find('.academy-course-video-wrapper').click(function(e){
        $('.academy-course-detail-comp').find('.academy-course-detail-nav-wrapper').find('.sub-course.playing').parent().find('.btn-action').click()
    })
    
    function videoInit($comp) {
        var $videoWrapper = $comp.find('.academy-course-video-wrapper');
        var $playingCourse = $comp.find('.sub-course.playing');
        var isInternalVideo = $playingCourse.attr("data-is-internal");
        var videoPath = $playingCourse.attr("data-video-path");
        $comp.find('.sub-course').length && $comp.find('.sub-course').each(function(){
            var str = ''
            str += $(this).parent().find('.btn-action').attr('data-info')
            $(this).parent().find('.btn-action').attr('data-path').length > 0 ? str +=  $(this).parent().find('.btn-action').attr('data-path').split('/').slice(-1)[0] : ''
            $(this).parent().find('.btn-action').attr('data-at-module',str)
        })
        if($videoWrapper.find(".plyr").length > 0){
            //fixed init executed twice, after submit dialog
            updateVideo($playingCourse, $videoWrapper);
            return;
        }

        // if($videoWrapper.find(".plyr").length > 0){
        //     //fixed init executed twice, after submit dialog
        //     updateVideo($playingCourse, $videoWrapper);
        //     return;
        // }
        // $('.academy-course-video-wrapper').addClass('at-action')
        // $('.academy-course-video-wrapper').attr('data-at-module','course::'+$('.academy-course-detail-desc-comp').find('.title').text()+'::'+videoPath.length ? videoPath.split('/').slice(-1) : ''+'')
        if(isInternalVideo == 'true') {
            var videoTag = $("<video/>",{
                id: "hikvision-academy-player",
                playsinline: "",
                controls: "",
                class: "hikvision-academy-player"
            });
            videoTag.append($('<source src="' + videoPath + '" type="video/mp4"/>'));
            $videoWrapper.append(videoTag);
        } else {
            var divTag = $("<div/>", {
                id: "hikvision-academy-player",
                "data-plyr-provider": "youtube",
                "data-plyr-embed-id": videoPath,
                class: "hikvision-academy-player"
            });
            $videoWrapper.append(divTag);
        }

        var $videoPlayer = $videoWrapper.find("#hikvision-academy-player");
        $videoPlayerPlyr = new Plyr($videoPlayer, {
            "controls": ['play-large','play','volume','mute','current-time','duration','progress','fullscreen'],
            "autoplay": false,
            "volume": 0.5
        });

        $videoPlayerPlyr.decreaseVolume(1);
        $videoPlayerPlyr.increaseVolume(0.5);

        $videoPlayerPlyr.on("ready", function() {
            $videoWrapper.find('.plyr__controls__item.plyr__volume').append('<div class="plyr__volume-value"></div>');
            updateVolumeTextValue($videoWrapper);
        })
    }

    function updateShareUrl($comp) {
        var localUrl = window.location.href;
        $comp.find('.academy-course-share a.section').each(function() {
            var newUrl = $(this).attr('data-share-head') + localUrl;
            $(this).attr('href', newUrl);
        })
    }

    function updateURL($comp) {
        var courseId;
        var oldURL = window.location.href;
        var newURL;
        var re1 = new RegExp('([?&])' + 'courseid=.*?(&|$)', 'i');
        var separator = oldURL.indexOf('?') !== -1 ? '&' : '?';

        $comp.find('.sub-course').each(function(index) {
            if ($(this).hasClass('playing')) {
                courseId = index;
                return false;
            }
        });

        if (oldURL.match(re1)) {
            newURL = oldURL.replace(re1, '$1' + 'courseid=' + courseId + '$2');
        } else {
            newURL = oldURL + separator + 'courseid=' + courseId;
        }

        window.history.replaceState({
            path: newURL
        }, null, newURL);

        updateShareUrl($comp);
    }

    function getURLParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var value = window.location.search.substr(1).match(reg);
        if (value) {
            return decodeURI(value[2]);
        }
        return '';
    }

    function initPlayCourseBaseOnURL($comp) {
        var courseId = getURLParam('courseid');
        var course = $comp.find('.sub-course');

        if (courseId) {
            var $targetCollapse = course.eq(courseId).closest('.nav-section').find('.section-title')
            course.removeClass('playing');
            course.eq(courseId).addClass('playing');
            updateSectionTitle($comp, course.eq(courseId).closest('.nav-section'));
            updateIntroduction($comp);
            if ($targetCollapse.attr('aria-expanded') == 'false') {
                $targetCollapse.click();
            }
        }

        updateShareUrl($comp);
    }

    $('.academy-course-detail-comp').on('click','.plyr__controls button.plyr__control',function() {
        var $videoWrapper = $(this).closest('.academy-course-video-wrapper');
        setTimeout(function(){
            updateVolumeTextValue($videoWrapper);
        },100);
    });

    $('.academy-course-detail-comp').on('change input','.plyr__controls .plyr__volume input[type=range]', function(){
        updateVolumeTextValue($(this).closest('.academy-course-video-wrapper'));
    });

    $('.academy-course-detail-comp .mobile-close').click(function() {
        $(this).closest('.academy-course-detail-nav-wrapper').removeClass('mobile-active');
        $('body').removeClass('academy-course-detail-nav-open');
    });

    $('.academy-course-detail-comp .academy-course-nav-mobile').click(function() {
        var $comp = $(this).closest('.academy-course-detail-comp');
        var $nav = $comp.find('.academy-course-detail-nav-wrapper');
        var scrollTop = $comp.find('.academy-course-video-wrapper').offset().top;
        var top = $comp.find('.academy-course-video-wrapper').height();
        window.scrollTo(0, scrollTop);
        $nav.addClass('mobile-active');
        $nav.css('top', top);
        $('body').addClass('academy-course-detail-nav-open');
    });

    $('.academy-course-detail-comp .nav-section .sub-course').click(function() {
        if (!$(this).hasClass('playing')) {
            var $comp = $(this).closest('.academy-course-detail-comp');
            var $targetSection = $(this).closest('.nav-section');
            var $videoWrapper = $comp.find('.academy-course-video-wrapper');
            $comp.find('.sub-course').removeClass('playing');
            $(this).addClass('playing');
            updateSectionTitle($comp, $targetSection);
            updateIntroduction($comp);
            updateURL($comp);
            updateVideo($(this), $videoWrapper);
        }
    });

    $('.academy-course-detail-comp .nav-section .sub-course').mouseover(function() {
        var $title = $(this).find('.course-title');
        if (!isMobileBreakPoint() && $title.get(0).scrollHeight > 37 && !$title.find('.title-tip').length) {
            var tipText = $title.text();
            $(this).append('<div class="title-tip">' + tipText + '</div>');
        }
    });

    $('.academy-course-detail-comp .nav-section .sub-course').mouseout(function() {
        var $title = $(this).find('.course-title');
        if (!$title.find('.title-tip').length) {
            $(this).find('.title-tip').remove();
        }
    });

    $('.academy-course-detail-comp .nav-section .sub-course').mouseout(function() {
        var $title = $(this).find('.course-title');
        if (!$title.find('.title-tip').length) {
            $(this).find('.title-tip').remove();
        }
    });

    $('.academy-course-detail-comp').each(function() {
        var $targetSection = $(this).find('.academy-course-detail-nav-wrapper .nav-section').eq(0);
        var $videoWrapper = $(this).find('.academy-course-video-wrapper');
        updateIntroduction($(this));
        updateSectionTitle($(this), $targetSection);
        initPlayCourseBaseOnURL($(this));
        videoInit($(this));
    });
});

$(document).ready(function() {
    function isMobileBreakPoint() {
        if ($(window).width() < 992) {
            return true;
        }
        return false;
    }
    function addBackdrop() {
        var backdrop = '<div class="academy-course-backdrop"></div>';
        if (!$('.academy-course-backdrop').length) {
            $('body').append(backdrop);
            $('body').addClass('academy-backdrop-open');
        }
    }
    function removeBackdrop() {
        $('.academy-course-backdrop').remove();
        $('body').removeClass('academy-backdrop-open');
    }
    $('.academy-course-video-comp .academy-course-share .share-action').click(function() {
        if (isMobileBreakPoint()) {
            $(this).closest('.academy-course-share').find('.share-content').addClass('show-share-content');
            addBackdrop();
        }
    });
    $('.academy-course-video-comp .academy-course-share .cancel').click(function() {
        if (isMobileBreakPoint()) {
            $(this).closest('.academy-course-share').find('.share-content').removeClass('show-share-content');
            removeBackdrop();
        }
    });
    $('body').on('click', '.academy-course-backdrop', function() {
        $('.academy-course-video-comp .academy-course-share .cancel').click();
    });
});

$(document).ready(function() {
    //登录弹框
    function checkLoginHandle($comp){
        var $linkList = $comp.find(".link a");
        $linkList.each(function(){
            var checkLogin = $(this).data("check-login");
            if(checkLogin){
                $(this).on('click',function(){
                    var ticket = getLoginCookie("ticket");
                    if(ticket && ticket!="123"){
                        loginUtil.checkLogin();
                    }else{
                        loginUtil.popupLoginConfirmModal();
                        return false;
                    }
                })
            }
        });
    };

    function addAtModuleInfo($comp) {
        var $introductionWrapper = $comp.find('.introduction-wrapper');
        $comp.find('.sub-course').each(function(i) {
            var title = $(this).find('.course-title').text()
            var links = $introductionWrapper.eq(i).find('.link a')
            links.length && links.each(function () {
                var tmpStr = 'course_' + title + $(this).attr('data-information')
                $(this).attr('href').length ? tmpStr += $(this).attr('href').split('/').slice(-1)[0] : ''
                $(this).attr('data-at-module', tmpStr )
            })
        });
    }
    $('.academy-course-detail-desc-comp').each(function() {
        checkLoginHandle($(this));
    });
    $('.academy-course-detail-comp').each(function() {
        addAtModuleInfo($(this))
    })
});

;;
(function (document, $) {
    function initGoTopEvent ($comp) {
        $comp.find('.customer-service-top').each(function () {
            $(this).on('click', function () {
                window.scrollTo(0 ,0)
            })
        })
    }

    function initCustomIcon () {
        $('.customer-service-item.custom-item').on('mouseenter', function () {
            var $icon = $(this).find('.icon.icon-custom')
            $icon.attr('src', $icon.data('icon-active'))
        })
        $('.customer-service-item.custom-item').on('mouseleave', function () {
            var $icon = $(this).find('.icon.icon-custom')
            $icon.attr('src', $icon.data('icon'))
        })
    }

    $(document).ready(function () {
        var modal = $(".customer-service-modal-back");
        var box = $(".customer-service");
        var $mobileBtn = $('.customer-service-btn-mobile')
        var $closeIcon = $('.customer-service-modal .close-icon')
        $mobileBtn.on('click', function () {
            modal.show()
        })
        $closeIcon.on('click', function () {
            modal.hide()
        })
        initGoTopEvent(box)
        initCustomIcon()
           var $goTop = $('.customer-service .customer-service-top')
            $(window).scroll(function () {
                if ($(this).scrollTop() > 0) {
                    $goTop.css('display', 'flex')
                } else {
                    $goTop.hide()
                }
            })
        HiAnalyticsCn.clickDownLazy('.customer-service-item , .service-modal-content .nav-line',isCnAnalytics);
        // HiAnalyticsCn.clickDownLazy('.service-modal-content .nav-line',isCnAnalytics);

        

        // $('body').click(function(e) {
        //     var classNameArr = ['icon','font','customer-service active']
        //     if( classNameArr.indexOf(e.target.className) == -1 ){
        //         box.removeClass("active");
        //         modal.hide();
        //     }
        // })

    });
})(document, $);
(function (document, $) {
    $(document).ready(function () {
        var $cnContactUsForm = $("#enquiry-form");
        var $submit = $cnContactUsForm.find("#cn-contact-us-submit");
        if ($submit && $submit.length > 0) {
            var contactUsUrl = storeManager.cookie.get("contactUsUrl");
            contactUsUrl = contactUsUrl && contactUsUrl != "123" ? contactUsUrl : "";
            $("input[name='submittedPage']").val(decodeURIComponent(contactUsUrl));
            storeManager.cookie.remove("contactUsUrl");
            phoneVarify.initPhoneVerifyStatus("#txtContactPhone")
        }
    });
})(document, $);
$(document).ready(function() {
    var timer1 , timer2 ,timer3
    function PCHover(){
        if($(window).width()<= $(".contact-us-btn-options").width()) {
            $(".contact-us-btn-options").width("90%");
        }
        timer2 = function(){
            timer3 = setTimeout(function(){
                $('.contact-us-btn-content .contact-us-btn-content-text').removeClass('contact-us-btn-content-text-move')
            }, 10000)
        }
        timer1 = setTimeout(function(){
                $('.contact-us-btn-content .contact-us-btn-content-text').addClass('contact-us-btn-content-text-move')
                    timer2()
            }, 0)
        $('.btn-content').hover(function(){
            clearTimeout(timer1)
            clearTimeout(timer3)
            timer2 = null
            if($(window).width() > 1024){
                $('.contact-us-btn-content .contact-us-btn-content-text').addClass('contact-us-btn-content-text-move') 
            }
        },function(){
            if($('.contact-us-btn-options').is(':hidden')){
                $('.contact-us-btn-content .contact-us-btn-content-text').removeClass('contact-us-btn-content-text-move')
            }
        })
        
        $(document).bind("click",function(e){
            var target = $(e.target);
            if(!$('.contact-us-btn-options').is(':hidden') && target.closest(".contact-us-btn-options").length == 0 && target.closest(".btn-content").length == 0 ){
                $(".contact-us-btn-options").hide();
                // $(".contact-us-btn-bg").hide();
                $('.contact-us-btn-content .contact-us-btn-content-text').removeClass('contact-us-btn-content-text-move')
            }
        })
    }

    $(window).resize(function() {
        if($(window).width() > 1024){
            PCHover()
        }
    });
    if($(window).width() > 1024){
        PCHover()
    }

    $(".contact-us-btn-content").on("click",function(){
        clearTimeout(timer1)
        clearTimeout(timer3)
        timer2 = null
        $(".contact-us-btn-options").toggle();
        // if ($(window).width() <= 1024) {
        //     $(".contact-us-btn-bg").show();
        // }
    });

    $(".contact-us-btn-options-header-close,.contact-us-btn-bg").on("click",function(){
        $(".contact-us-btn-options").hide();
        // $(".contact-us-btn-bg").hide();
        if($(window).width() <= 1024){
            $('.contact-us-btn-content .contact-us-btn-content-text').removeClass('contact-us-btn-content-text-move')
        }
    });

    $("a[href].contact-us-btn-options-item").on("click",function(){
        //跳转到contact us表单时，保存当前页面路径至cookie
        setSubmittedPageUrlCookie("contactUsUrl");
    });
});
var phoneVarify = (function ($) {
    var phone = {};
    /**
     * find hidden header for verification ajax
     */
    phone.getPhoneVerificationHeader = function (target) {
        var headers = [];
        var hiddenHeaders = target.find(".phone-verification-hidden");
        if (hiddenHeaders.length > 0) {
            $(hiddenHeaders).each(function () {
                var header = {
                    key: $(this).attr("name"),
                    value: $(this).val()
                };
                headers.push(header);
            });
        }
        return headers;
    };

    phone.sendPhoneVerification = function (target, phoneTarget) {
        var number = $(phoneTarget).val();
        if (number) {
            var headers = phone.getPhoneVerificationHeader(target);
            var src = target.find(".phone-validate-url").val();
            doAjaxWithDataType("GET", src + "&phoneNumber=" + number, null,
                null, null, false, headers,
                function (resultData) {
                    if (resultData && (resultData.code === 0 || resultData.code === 200)) {
                        showDialogMsg("短信验证码发送成功", "success");
                        phone.changePhoneVerifyStatus(target);
                    } else {
                        showDialogMsg(resultData.message.message);
                        phone.changePhoneVerifyStatus(target);
                    }
                }, true);

        } else {
            showDialogMsg("请输入正确手机号");
        }
    };

    phone.changePhoneVerifyStatus = function (target) {
        var $phoneVirify = target.find(".form-phone-verify");
        $phoneVirify.addClass("disabled");
        $phoneVirify.css("pointer-events", "none");
        var number = 60;
        $phoneVirify.html(60 + 's后重发');
        $phoneVirify.addClass("sent");
        var timer = setInterval(function () {
            if (number <= 0) {
                $phoneVirify.removeClass("sent");
                $phoneVirify.html('重新获取');
                $phoneVirify.removeClass("disabled");
                $phoneVirify.css("pointer-events", "");
                clearInterval(timer)
            } else {
                number--;
                $phoneVirify.html(number + 's后重发');
            }
        }, 1000)
    };

    phone.initPhoneVerifyStatus = function (phoneTarget) {
        var btns = $(".phone-code-group");
        $.each(btns, function (key, val) {
            var target = $(val);
            var $phoneVirify = target.find(".form-phone-verify");
            $phoneVirify.unbind("click").on('click', function () {
                console.log('didid666')
                phone.sendPhoneVerification(target, phoneTarget);
            });
        });
    };

    return phone;
}($));

var firmwareDownload = (function ($) {
    var firmware = {};

    firmware.addATModel = function() {
        var downLoadFirware = $('.firmware-download-comp .firmware-container .section').find('.firmware-series');
        downLoadFirware.length > 0 && downLoadFirware.each(function() {
            var arr = $(this).attr('data-link').split('/');
            var str = 'firmware_download::' + $(this).attr('data-title') + '::' + arr[arr.length-1] + atModel.atSpliter + window.location.href;
            $(this).on('click', function(e){
                atModel.doAtEvent(str, 'download', e);
            })
        //  $(this).attr('data-at-module',str)
        })
    }

    firmware.init = function() {
        $(document).ready(function () {
            firmware.addATModel();
        })
    }

    return firmware;
}($));

firmwareDownload.init();
var europeBanner = (function ($) {
	var europeBanner = {};
    europeBanner.computedMargin = function($comp){
            var wrapper = $comp.find('.europe-banner-inner')
            var btn = $comp.find('.banner-btn-span')
            var clientWidth = wrapper.width()
            if($(window).width() > 767.98){
                if($('.banner-btn-wrapper').height() < 100){
                    $comp.find('.banner-btn-wrapper').addClass('banner-btn-wrapper-center')
                }else{
                    var lineNum = parseInt(clientWidth / 237)
                    var marginPX = (clientWidth - (225*lineNum)) / 2 / lineNum
                    $comp.find('.banner-btn-wrapper').removeClass('banner-btn-wrapper-center')
                    if(marginPX <=6){
                        marginPX = 6
                    }
                    btn.css({
                        marginLeft: marginPX + 'px' ,
                        marginRight: marginPX + 'px' ,
                    })
                }
            }else {
                if($('.banner-btn-wrapper').height() < 25){
                    $comp.find('.banner-btn-wrapper').addClass('banner-btn-wrapper-center')
                }else{
                    var lineNum = parseInt(clientWidth / 150)
                    var marginPX = (clientWidth - (135*lineNum)) / 2 / lineNum
                    $comp.find('.banner-btn-wrapper').removeClass('banner-btn-wrapper-center')
                    if(marginPX <=6){
                        marginPX = 6
                    }
                    btn.css({
                        marginLeft: marginPX + 'px' ,
                        marginRight: marginPX + 'px' ,
                    })
                }
            }
    }
    europeBanner.bannerChange = function($comp) {
        var pcBG = $comp.attr('data-pc-bg');
        var mobileBG = $comp.attr('data-mobole-bg');
        if($(window).width() > 767.98){
            $comp.css("background-image","url('"+pcBG+"')");
        }else{
            $comp.css("background-image","url('"+mobileBG+"')");
        }
    }
	europeBanner.init = function () {
		$(document).ready(function () {
            var $comp = $('.europe-banner-wrapper')
            europeBanner.computedMargin($comp)
            europeBanner.bannerChange($comp)
            $(window).resize(function() {
                europeBanner.computedMargin($comp)
                europeBanner.bannerChange($comp)
            })
		});
	};
	return europeBanner;
}($));

europeBanner.init();
$(document).ready(function () {
    var viewAll = Granite.I18n.get("View All");
    var fessQueryUrl = $('.filter-search-wrapper').attr('data-search-page');
    var numPerPage = 10;
    var $resultGrid = $("#result-grid-template");
    var $filterPanel = $("#left-filter-template");
    var $searchBox = $('.filter-search-wrapper .filter-search-input');
    var $suggest = $('.filter-search-wrapper .input-suggest-wrapper');
    var $selectLeft = $('.filter-search-wrapper').find(".filter-search-container-left");
    var $selectRight = $('.filter-search-wrapper').find(".filter-search-container-right");
    var $showNoResult = $('.filter-search-wrapper').find(".filter-search-container-right").find(".filter-search-none");
    var $options = $('.filter-search-wrapper').find(".filter-search-container-left").find('.filter-search-left-option');
    var loading = $('.filter-search-wrapper').find(".filter-search-container-right").find(".filter-search-loading");
    var filterBy = $('.filter-search-wrapper').find(".filter-search-container-right").find(".filter-search-mobile");
    var $searchResult = $('.filter-search-wrapper').find(".filter-search-container-right").find('.filter-search-result-en');

    var q;
    var active;

    /**
     * init search event
     */
    function initialSearch() {
        $('.filter-search-wrapper').removeAttr('onclick').find(".btn-search").unbind("click").bind('click', function (event) {
            $suggest.hide();
            if($searchBox.val()){
                atModel.doAtEvent('search::' + $searchBox.val() + '::' + location.href, 'action', event)
                loading.show();
                numPerPage = 10;
                $(".filter-option-inner .filter-option-inner-inner").html("10 /" + Granite.I18n.get("page"))
                debounce(initialFetch($searchBox.val()), 2000)
            }
        });
    }

    function refreshQueryString(keyWord, category) {
        setTimeout(function () {
            if (keyWord) {
                setQueryString("q", keyWord);
            }
            if (category) {
                setQueryString("active", category);
            }
        }, 500);
    }

    /**
     * Suggest
     */
    function initialSuggest() {
        if (fessQueryUrl) {
            $searchBox.autocomplete({
                source: function (request, response) {
                    var searchCriteria = request.term;
                    var siteName = parseSiteFromUrl();
                    var params = {
                        url: fessQueryUrl + ".searchSuggest.json",
                        keyword: searchCriteria,
                        pageSize: numPerPage,
                    };
                    // if ("cn" === siteName.toLowerCase()) {
                    params.tags = siteName;
                    // }
                    params.callback = response;
                    fessSearchProvider.doFessSuggest(params);
                },
                open: function (event, ui) {
                    if(event.target.value){
                        $suggest.hide();
                    }
                    $searchBox.addClass('remove-border');
                    var searchBoxWidth = $searchBox.outerWidth();
                    var posTop = $(".ui-autocomplete").position().top
                    $('.ui-autocomplete').css({
                        'width': searchBoxWidth,
                        'top': posTop + 10
                    });
                    // 关键字高亮
                    var liText = $('.ui-autocomplete').find("li").find(".ui-menu-item-wrapper")
                    liText.length > 0 && liText.each(function () {
                        var tmpText = $(this).text().trim()
                        var tmpText1 = $(this).text().trim()
                        var tmpText2 = $(this).text().trim()
                        var tmpText3 = $(this).text().trim()
                        var startIndex = tmpText.toLowerCase().indexOf($searchBox.val().toLowerCase())
                        var endIndex = $searchBox.val().length
                        var str1 = ''
                        var str2 = ''
                        var str3 = ''
                        str1 = tmpText1.slice(0, startIndex)
                        str2 = tmpText2.slice(startIndex, startIndex + endIndex)
                        str3 = tmpText3.slice(endIndex)
                        $(this).html(str1 + '<b style="color:#333333;">' + str2 + '</b>' + str3)
                    })
                },
                close: function (event, ui) {
                    $searchBox.removeClass('remove-border');
                    $suggest.hide();
                },
                select: function (event, ui) {
                    var label = ui.item.label;
                    $searchBox.val(label);
                    $suggest.hide();
                    initialFetch($searchBox.val());
                },
                delay: 300
            });
        }
    }
    /**
     *
     * 默认suggest
     */
    function initSuggestFn() {
        $searchBox.unbind('focus').on('focus', function () {
            if ($searchBox.val()) {
                $suggest.hide();
            } else {
                $searchBox.addClass('remove-border');
                $suggest.show();
            }
        });
        $searchBox.unbind('blur').on('blur', function () {
            $(this).removeClass('remove-border');
            // setTimeout(function(){
            //   $suggest.hide();
            // }, 1000)
            //  $suggest.hide();
        })
        $(document).on("click", function(){
            $suggest.hide();
        })
        $(".filter-search-input-main").on("click", function(e){
            e.stopPropagation();
        })
        $suggest.find(".input-suggest-li-subCategory").unbind('click').on('click', function (){
            $searchBox.val($(this).text());
            $searchBox.removeClass('remove-border');
            $suggest.hide();
            initialFetch($searchBox.val());
        });
    }
    /**
     * page load search
     */
    function initialFetch(query, category) {
        loading.show();
        $searchResult.html('');
        if (fessQueryUrl) {
            fessSearchProvider.doFessSearch({
                url: fessQueryUrl,
                keyword: query || q,
                subcategory: null,
                pageNum: 0,
                pageSize: 0,
                callback: function (data) {
                    // search without category not set result
                    refreshResult(data, null);
                    refreshPagination(data);
                    refreshFilter(data, category);
                    renderNav();
                    // loading.hide();
                    $showNoResult.hide();
                    searchContent(data);
                }, error: function (error) {
                    loading.hide();
                    $showNoResult.show();
                }
            });
        }
    }

    /**
     * do search 翻页接口
     * @param startNum
     * @param category
     */
    function fetchResults(startNum, category) {
        if (isNull(category)) {
            var currentBreakpoint = getCurrentBreakpoint();
            if (currentBreakpoint !== "MOBILE") {
                category = $('.filter-search-container .card-heard.active').data('category');
            } else {
                category = $('.filter-search-container .filter-region-item.active').data('category');
            }
        }
        $searchResult.html('');
        var keyword = $searchBox.val();
        loading.show();
        fessSearchProvider.doFessSearch({
            url: fessQueryUrl,
            keyword: keyword || q,
            subcategory: category,
            pageNum: startNum,
            pageSize: numPerPage,
            callback: function (data) {
                refreshResult(data, startNum);
                refreshPagination(data);
                renderNav();
                loading.hide();
                if (data.result && data.result.length === 0) {
                    $showNoResult.show();
                    $(".pagination-section").hide();
                    $(".pagination-section-mobile").hide();
                } else {
                    $showNoResult.hide()
                }
            }, error: function (error) {
                loading.hide();
                $showNoResult.show();
            }
        });
        refreshQueryString(keyword, category);
    }

    /**
     * 搜索内容嵌入模板
     */
    function refreshResult(data, pageNum) {
        var results = [];
        var checkMode = loginUtil.notEditorOrPreviewMode();
        var keyword = $searchBox.val() || q;

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
            if (this.title) {
                this.url = this.url + "?q=" + replaceSpecialToMiddleline(keyword) + "&pageNum=" + pageNum + "&position=" + (index + 1) + "&hiksearch=true";
            }
            this.download = Granite.I18n.get("Download");
            if (checkMode) {
                delete this.score;
            }
            results.push(this);
        });

        var tpl = $resultGrid.html();
        $searchResult.hide();
        var template = Handlebars.compile(tpl);
        $searchResult.html(template(results));
        il8n();
        AtModelTitle();
        $searchResult.show();
        loading.hide();
    }

    function il8n() {
        var allLi = $(".filter-search-wrapper .card-content-li");
        allLi.length > 0 && allLi.each(function () {
            if ($(this).find('.card-content-li-label').attr('data-all') === 'true') {
                var num = $(this).find('.card-content-li-label').attr('data-length');
                $(this).find('.card-content-li-label').text(Granite.I18n.get("All") + ' (' + num + ')')
            }
        })
    }
    /**
     * title埋点
     */
    function AtModelTitle(){
        var $atTitles = $(".search-result-item-wrapper .search-result-item-content");
        $.each($atTitles, function(index, elem){
            $(this).find(".search-result-item-title").unbind("click").bind("click", function(e){
                var dataModule1 = "search::"  + $(this).text()+ "_" + (index + 1)+ "::" + $(this).find("a").attr("href").replace("&", "") + atModel.atSpliter + location.href;
                atModel.doAtEvent(dataModule1, 'action', e);
            })
        })
    }
    /**
     * 翻页
     */
    function refreshPagination(data) {
        $('#layout-pagination-wrapper').show();
        var currentBreakpoint = getCurrentBreakpoint();
        if(currentBreakpoint!== "MOBILE"){
            if(data.recordCount>=10 && data.recordCount!=0){
                $(".pagination-section").css({
                    "display": "flex"
                })
                $("#layout-pagination-wrapper").pagination({
                    items: data.recordCount,
                    itemsOnPage: data.pageSize,
                    cssStyle: "light-theme",
                    currentPage: data.pageNumber,
                    edges: 1,
                    useAnchors: false,
                    size:"mini",
                    prevText: '<',
                    nextText: '>',
                    onPageClick: function (currentPageNumber) {
                        loading.show();
                        $('html,body').animate({scrollTop: '0px'}, 500);
                        fetchResults((currentPageNumber - 1) * data.pageSize);
                    }
                });
            } else {
                $(".pagination-section").css({
                    "display": "none"
                })
            }
        } else {
            if(data.recordCount>=10 && data.recordCount >=numPerPage){
                $(".pagination-section-mobile").show();
                // numPerPage = 0
                $(".pagination-section-mobile").unbind("click").bind("click", function(e){
                    e.stopPropagation();
                    if(numPerPage>=data.recordCount){
                        $(this).hide()
                    } else {
                        numPerPage += 10
                        fetchResults(1);
                    }
                })
            } else {
                $(".pagination-section-mobile").hide();
            }

        }
    }

    function refreshFilter(data, category) {
        data.viewAll = viewAll;
        var currentBreakpoint = getCurrentBreakpoint();
        if (currentBreakpoint !== "MOBILE") {
            var tpl = "left-filter-template";
            if ($options) {
                $options.empty();
                $options.html(tmpl(tpl, data));
            }
            initFilterClickEvent();
            initSelectFilter(category);
            var $il8nTitles = $(".filter-search-card").find(".card-heard .il8n-title")
            $.each($il8nTitles, function (e, index) {
                $(this).text(Granite.I18n.get($(this).text()).trim())
            })
        } else {
            var tpl = "mob-left-filter-template";
            $('.filter-search-wrapper .filter-regions').html(tmpl(tpl, data));
             mobileFilterBy();
             initSelectFilter(category);
            var $il8nTitles = $(".filter-region-item").find(".il8n-title")
            $.each($il8nTitles, function (e, index) {
                $(this).text(Granite.I18n.get($(this).text()).trim())
            })
        }
    }

    /**
     * 筛选项点击
     */
    function initFilterClickEvent() {
        var cardHeard = $selectLeft.find('.card-heard');
        cardHeard.click(function (e) {
            if(!$searchBox.val()) return;
            var _this =$(this);
            var dataModule = "search::filter::" + _this.data("category") + atModel.atSpliter + location.href;
            atModel.doAtEvent(dataModule, 'action', e);
            searchContent({
                'recordCount': _this.attr('data-count')
            });
            var category = _this.data('category');
            cardHeard.removeClass("active");
            _this.toggleClass("active");
            fetchResults(null, category);
        });
    }

    /**
     * onkeydown
     * key == 13
     */
    $searchBox.keydown(function (e) {
        $suggest.hide();
        if (e.keyCode == 13) {
            $('.filter-search-wrapper').find('.btn-search').click();
            $('#ui-id-1').hide();
            $searchBox.removeClass('remove-border');
        }
        // delete键
        if(e.keyCode == 8){
            debounce(searchKeyCode8(), 500)
        }
    });
    // delete的时候判断input是否为空，为空则显示推荐项
    function searchKeyCode8(){
        if($searchBox.val().length<=1){
            $suggest.show();
            $(".ui-menu").hide();
        } else {
            $suggest.hide();
        }
    }
    /**
     * 搜索信息展示 包含搜索数目
     */
    function searchContent(data) {
        var searchTitle = $('.filter-search-wrapper .filter-search-container-right .filter-search-about .filter-search-content').find('span')
        var searchVal = $('.filter-search-wrapper .filter-search-container-right .filter-search-about .filter-search-content').find('b')
        var searchFor = $searchBox.val() || q;
        searchTitle.text(data.recordCount);
        searchVal.text(searchFor);
        if(data.recordCount === 0){
            $(".filter-search-none").show()
        }
    }
    //获取所有的li的width之和
    function totalLisWidth(index){
        var totals = 0
        $.each($(".filter-region-item"), function(i, ele){
            if(i<index-1){
                totals += $(this).width()
            }
        })
        return totals
    }
    /**
     * 移动端筛选点击
     */
    function mobileFilterBy() {
        var $filterRegionItem = $(".filter-region-item")
        $.each($filterRegionItem, function(index,ele){
            $(this).on("click", function(e){
                if(index>=3){
                    $(this).parent().animate({
                        "scrollLeft": totalLisWidth(index)
                    }, 500)
                } else {
                    $(this).parent().animate({
                        "scrollLeft": 0
                    }, 500)
                }
                $(this).addClass("active").siblings().removeClass("active")
                var _this =$(this);
                var dataModule = "search::filter::" + _this.data("category") + atModel.atSpliter + location.href;
                atModel.doAtEvent(dataModule, 'action', e);
                searchContent({
                    'recordCount': _this.attr('data-count')
                });
                var keyword = $searchBox.val() || q;
                if(!$searchBox.val()) return;
                var category = _this.data('category');
                fetchResults(null, category);
            })
        })
    }

    /**
     * 设置默认被选择的值
     * @param active
     */
    function initSelectFilter(active) {
        var currentBreakpoint = getCurrentBreakpoint();
        var activeElement = null;
        // default select has record first category
        if (currentBreakpoint !== "MOBILE") {
            if (active) {
                activeElement = $("[data-category=" + active + "]");
            } else {
                activeElement = $(".filter-search-card .card-heard.active").get(0);
            }
            $(activeElement).click().siblings(".card-heard").removeClass("active");
            $(".filter-search-pc-about .filter-search-content").find("span").text($(activeElement).data("count"));
        } else {
            activeElement = $(".filter-regions .filter-region-item.active").get(0);
            $(activeElement).click().siblings(".card-heard").removeClass("active");
            $(".filter-search-mobile-about .filter-search-content").find("span").text($(activeElement).data("count"));
        }
    }

    function renderNav() {
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
                        title = title.replaceAll("\<strong\>", "").replaceAll("\</strong\>", "");
                        item.append('<a class="search-result-item-nav-link at-action" href="' + showPath + '" aria-label="page-title-link" data-pre-module="search::breadcrumb_' + title + "::" + window.location.origin + showPath + atModel.atSpliter + location.href + '">' + title + '</a> ');
                        delayBreadCrumbAt()
                    } else {
                        title = title.replaceAll("-", " ");
                        item.append('<a class="search-result-item-nav-link at-action" href="' + showPath + '" aria-label="page-title-link" data-pre-module="search::breadcrumb_' + title + "::" + window.location.origin + showPath + atModel.atSpliter + location.href + '">' + title + '</a> <i class="search-result-item-nav-icon">/</i>');
                        delayBreadCrumbAt()
                    }
                }
            }
        }
    }

    /**
     * 处理面包屑埋点延迟的问题
     */
    function delayBreadCrumbAt(){
        $.each($(".search-result-item-nav-link"), function(index, item){
            $(this).unbind("click").on("click", function(e){
                var dataModule = $(this).data("pre-module");
                atModel.doAtEvent(dataModule, 'action', e);
            })
        })
    }

    $(document).ready(function () {
        if ($(".new-filter-search").length > 0) {
            active = getQueryString("active");
            q = fessSearchProvider.urlParam("q") || '';
            if ($searchBox && q) {
                $searchBox.val(q);
            }
            initialSearch();
            initSuggestFn();
            // remove suggest
            // initialSuggest();
            initialFetch(q, active);
            mobileFilterBy();
            if (!active && !q) {
                $(".filter-search-container-right .filter-search-none").show();
                $(".filter-search-container-right .filter-search-loading").hide();
            }
            $(".filter-search-wrapper").find('.item-num-for-page select.number-select').selectpicker({});
            $(".filter-search-wrapper").find('.item-num-for-page select.number-select').on('change', function (e) {
                numPerPage = e.target.value;
                fetchResults(1);
                $('html,body').animate({scrollTop: '0px'}, 500);
            });
            if ($('.filter-search-input-main').length) {
                $(this).on('scroll', function () {
                    var wScrollTop = $(window).scrollTop();
                    if (wScrollTop >= 155) {
                        $options.addClass("fixed").css({
                            top: '40px'
                        })
                    } else {
                        $options.removeClass("fixed")
                    }

                    //  900是算出来的大概数值
                    var footerScrollTop = $('.footer-body').offset().top - 620;
                    if (wScrollTop >= 400 && wScrollTop > footerScrollTop) {
                        $options.css({
                            top: 40 - (wScrollTop - footerScrollTop) + "px"
                        })
                    } else {
                        $options.css({
                            top: "40"
                        })
                    }
                })
            }
        }
    });
});
(function (document, $) {
    function initIndustryList() {
        var $industryGroup = $(".industry-group");
        if ($industryGroup && $industryGroup.length > 0) {
            var optionsGroup = $industryGroup.find(".option-list");
            if (optionsGroup && optionsGroup.length > 0) {
                var optionsFooter = $industryGroup.find(".industry-options-group footer");
                var optionsHeader = $industryGroup.find(".industry-options-group header");
                var industryLabel = $industryGroup.find(".industry-label");
                var required = industryLabel.hasClass("required");
                optionsGroup.empty();
                $.getScript("/etc/hiknow/industry-list.json", function (data) {
                    if (data) {
                        var industryList = eval(data);
                        var innerHtml = '';
                        industryList.forEach(function (item, index) {
                            var isShow = index > 2 ? "display-pc" : "";
                            innerHtml += '<label class="checkbox-inline options-item ' + isShow + '">'
                                + '<input type="checkbox" name="businessVertical" value="' + item.value + '"> ' + Granite.I18n.get(item.name)
                                + '</label>';
                        });
                        optionsGroup.html(innerHtml);

                        optionsFooter.on('click', function () {
                            optionsGroup.find(".checkbox-inline.display-pc").toggle("display-mobile");
                            var headerSpan = optionsHeader.find("span");
                            var footerSpan = $(this).find("span");
                            headerSpan.toggleClass("full-arrow-down");
                            headerSpan.toggleClass("full-arrow-up");
                            footerSpan.toggleClass("arrow-down");
                            footerSpan.toggleClass("arrow-up");
                            if (footerSpan.hasClass("arrow-up")) {
                                optionsFooter.html(Granite.I18n.get("Less") + " <span class=\"arrow-up\"></span>");
                            } else {
                                optionsFooter.html(Granite.I18n.get("More") + " <span class=\"arrow-down\"></span>");
                            }
                        });
                        optionsHeader.on('click', function () {
                            optionsGroup.find(".checkbox-inline.display-pc").toggle("display-mobile");
                            var headerSpan = $(this).find("span");
                            var footerSpan = optionsFooter.find("span");
                            headerSpan.toggleClass("full-arrow-down");
                            headerSpan.toggleClass("full-arrow-up");
                            footerSpan.toggleClass("arrow-down");
                            footerSpan.toggleClass("arrow-up");
                            if (footerSpan.hasClass("arrow-up")) {
                                optionsFooter.html(Granite.I18n.get("Less") + " <span class=\"arrow-up\"></span>");
                            } else {
                                optionsFooter.html(Granite.I18n.get("More") + " <span class=\"arrow-down\"></span>");
                            }
                        });
                    }
                });
            }
        }
    };

    $(document).ready(function () {
        initIndustryList();
    });

})(document, $);
(function (document, $) {
    var $cnContactUsForm = $("#enquiry-form");
    $(document).ready(function () {
        var $submit = $cnContactUsForm.find("#cn-contact-us-submit");
        if ($submit && $submit.length > 0) {
           phoneVarify.initPhoneVerifyStatus("#txtContactPhone")
        }
    });
    var $contractTypeOptions = $('#cn-contactType').find('li')
    $.each($contractTypeOptions, function(index, item){
        $(item).on('click', function(){
            var _this = this
            var optionName = $(this).text()
            var optionValue = $(this).attr('data-contactType')
            $(this).parent().siblings('.region-selector-label').find('.selected-option').text(optionName)
            setTimeout(function(){
                $(_this).parent().siblings('.region-selector-label').find('input').val(Number(optionValue))
            }, 500)
        })
    })
})(document, $);
$(document).ready(function () {
  function initMoreBtn() {
    $('.blog-author-container').each(function() {
      var $desc = $(this).find('.description');
      var $moreBtn =  $(this).find('.action');
      if($desc[0].clientHeight < 145) {
        $moreBtn.hide();
      } else {
        $moreBtn.show();
        $desc.removeClass('expand');
      }
    });
  }

  $('.blog-author-container .action').click(function() {
    $(this).closest('.top-section-mobile').find('.description').addClass('expand');
    $(this).hide();
  });

  initMoreBtn();
  $(window).resize(function(){
    initMoreBtn();
  });
});

(function (document, $) {
 
    $(document).ready(function () {
        var $form=$('.software-apply-trial1').find('#enquiry-form');
        var countryHasTax = ['BR'];
        var countryCode = $form.find('input[type=hidden][name=countryCode]').val();
        var $taxSection = $form.find('.tax-section');
        var currentPath = window.location.pathname;
        var site;
        var hikType = $.cookie("HIKROLE");
        globalPcd.initDefaultCountry($form);
        if($form.length != 0){
            var $emailInput = $form.find("input[name='email']");
            emailVarify.initEmailVerifyStatus($emailInput);
        }
        if(currentPath.indexOf("/content/hikvision")>-1){
            site = currentPath.split("/")[3];
        }else{
            site =currentPath.split("/")[1];
        }
        
        $form.find('input[type=hidden][name=language]').val($("html")[0].lang)
        $form.find('input[type=hidden][name=type]').val(hikType? hikType:"")
        $form.find('input[type=hidden][name=site]').val(site)



        if(countryHasTax.indexOf(countryCode) >= 0 ) {
            $taxSection.show();
        } else {
            $taxSection.hide();
            $taxSection.find('input').val('*');
        }
        $('.software-submit').on('click', function(e){
            e.preventDefault();
        })
    });
})(document, $);
$(document).ready(function() {
    initFirmwareListComp();
    $('.assets-box .assets').on('click', function(e){
        var atModule = $(this).data('pre-module')+'::' + lastNode($(this).attr('data-href')) + atModel.atSpliter + window.location.href.replace('#download-agreement','')
        atModel.doAtEvent(atModule , 'download', e); 
    })
});
var initFirmwareListComp = function(){
    function getCurrentBreakPoint() {
        var contentValue = window.getComputedStyle(
          document.querySelector('.firmware-list-comp'),'::before'
        ).getPropertyValue('content');
        return contentValue.replace(/\"/g, '');
    }

    function updateMobileList($comp, $viewMoreBtn) {
        destroyPagination($comp);
        $comp.find('.accordion .nav-item:not(.mobile-active):not(.not-in-scope):lt(6)').addClass('mobile-active');
        if ($comp.find('.accordion .nav-item:not(.mobile-active):not(.not-in-scope)').length < 1) {
            $viewMoreBtn.hide();
        } else {
            $viewMoreBtn.show();
        }
    }

    function destroyPagination($comp) {
        var $pagination = $comp.find('.pagination-section');
        if($pagination.hasClass('pagination-initialized')) {
            $pagination.jPages('destroy');
            $pagination.removeClass('pagination-initialized');
        }
    }

    function updateDesktopPagination($comp) {
        var containerID = $comp.find('.accordion').attr('id');
        var $pagination = $comp.find('.pagination-section');
        var perPage = parseInt($pagination.attr('data-num'));
        var $collapse = $comp.find(".firmware-items-list .collapse.show");

        if ($collapse.length) {
            $collapse.collapse('hide');
        }

        destroyPagination($comp);
        $pagination.jPages({
            containerID: containerID,
            perPage: perPage,
            previous: "",
            next: "",
            keyBrowse: true,
            animation: "slideInRight"
        });
        $pagination.addClass('pagination-initialized');
    }

    function initListPagination($comp, currentBreakPoint) {
        var $viewMoreBtn = $comp.find('.firmware-list-mobile-view-more');
        if (currentBreakPoint == 'MOBILE') {
            $comp.find('.accordion .nav-item').removeClass('mobile-active');
            updateMobileList($comp, $viewMoreBtn);
        } else {
            $viewMoreBtn.hide();
            updateDesktopPagination($comp);
        }
    }

    function updateExpandIconState($comp) {
        $comp.find('.filter-container .expand-icon').each(function() {
            var $icon = $(this);
            var $innerContent = $icon.closest('.category-section');
            if ($innerContent.height() > 30) {
                $icon.show();
            } else {
                $icon.hide();
            }

            $innerContent.parent().removeClass('expand-close');
        })
    }

    function ifShowFirmware($firmware, dataMainTag, dataSubTag, searchVal) {
        var title = $firmware.find('.main-title').text().toLowerCase();
        var showFirmware = false, collapseFirmware = false;
        var $childTitle = $firmware.find('.child-content');
        var $sonTitle = $childTitle.find('.child-title');

        if (title.indexOf(searchVal) < 0) {

            if($sonTitle.length) {
                
                $childTitle.each(function(){
                    var $this = $(this);
                    var child = $this.find('.child-title').text().toLowerCase().trim();
                    if(!child.includes(searchVal)){

                        $this.addClass('inactive');
                        if ($firmware.find('.sub-item').length) {
                            $firmware.find('.sub-item').each(function() {
                                if($(this).text().toLowerCase().indexOf(searchVal) >= 0) {
                                    showFirmware = true;
                                    $this.removeClass('inactive');
                                }
                            });
                        } 
                    } else {
                        showFirmware = true;
                        collapseFirmware = true;
                    }
                })
            } else {
                if ($firmware.find('.sub-item').length) {
                    $firmware.find('.sub-item').each(function() {
                        if($(this).text().toLowerCase().indexOf(searchVal) >= 0) {
                            showFirmware = true;
                            return false;
                        } else {
                            showFirmware = false;
                        }
                    });
                }
            }

        } else {
            if(title.trim() == searchVal){
                collapseFirmware = true;
            } 
            showFirmware = true;
        }


      
        if(!searchVal){
            collapseFirmware = false;
            showFirmware = true;
        }
               
        
        if (dataMainTag !== 'all' && dataMainTag !== $firmware.attr('data-main-tag')) {
            return {showFirmware: false, collapseFirmware: false};
        }

        if(dataSubTag && dataSubTag !== 'all' && dataSubTag !== $firmware.attr('data-sub-tag')) {
            return {showFirmware: false, collapseFirmware: false};
        }

        return {showFirmware: showFirmware, collapseFirmware: collapseFirmware};
    }

    function ifShowNoResultIcon($comp) {
        var $visibleCourseCard = $comp.find('.firmware-items-list .nav-item:not(.not-in-scope)');
        if($visibleCourseCard.length) {
            $comp.find('.firmware-list-desktop-pagination').addClass('active');
            $comp.find('.firmware-items-list').removeClass('minheight-noactive');
            $comp.find('.no-result-found').hide();
        } else {
            $comp.find('.no-result-found').show();
            $comp.find('.firmware-items-list').addClass('minheight-noactive');
            $comp.find('.firmware-list-desktop-pagination').removeClass('active');
        }
    }

    function applyFilter($comp) {
        var $firmwareList = $comp.find('.firmware-items-list .nav-item');
        var $subFilter = $comp.find('.sub-category.active .option-section.active .filter.active');
        var dataMainTag = $comp.find('.main-category .filter.active').attr('data-tag');
        var dataSubTag = $subFilter.length > 0 ? $subFilter.attr('data-tag') : '';
        var searchVal = $comp.find('.search-container').attr('data-searchval').trim().toLowerCase();
        var currentBreakPoint = getCurrentBreakPoint();
        $comp.find('.child-content').removeClass('inactive');
       
        $firmwareList.each(function() {
            var $this = $(this);
            var showFirmware = false, collapseFirmware = false;

            var firmwareObj = ifShowFirmware($this, dataMainTag, dataSubTag, searchVal);
            showFirmware = firmwareObj.showFirmware;
            collapseFirmware = firmwareObj.collapseFirmware;

            if (showFirmware) {
                $this.removeClass('not-in-scope');
                if(collapseFirmware) {
                    $this.find('.main-content').collapse('show');
                    
                } 
            } else {
                $this.addClass('not-in-scope');
            }
        });

        ifShowNoResultIcon($comp);
        initListPagination($comp, currentBreakPoint)
    }

    function initFilterBar($comp) {
        var $mainAllFilter = $comp.find('.filter-container .main-category .option-section .filter[data-tag="all"]');
        var $searchContainer = $comp.find('.search-container');

        $comp.find('.firmware-items-list .nav-item').removeClass('not-in-scope');
        $comp.find('.filter-container .sub-category').removeClass('active');
        $mainAllFilter.addClass('active');
        $mainAllFilter.siblings().removeClass('active');
        $searchContainer.find('.firmware-search').val('');
        $searchContainer.attr('data-searchval','');
        ifShowNoResultIcon($comp);
    }

    function bindEvent($comp) {
        $comp.find('.firmware-list-mobile-view-more').click(function() {
            updateMobileList($comp, $(this));
        });

        $comp.find('.firmware-items-list .main-title .link').click(function(e) {
            e.stopPropagation();
        });

        $comp.find('.item-num-for-page select.number-select').selectpicker({});

        $comp.find('.item-num-for-page select.number-select').on('loaded.bs.select', function() {
            $(this).parent().find('button').attr('title', '');
        });

        $comp.find('.item-num-for-page select.number-select').on('changed.bs.select', function() {
            var numberVal = $(this).val();
            $(this).parent().find('button').attr('title', '');
            $comp.find('.pagination-section').attr('data-num', numberVal);
            updateDesktopPagination($comp);
        });

        $comp.find('.filter-container .expand-icon').click(function() {
            $(this).closest('.category-section').parent().toggleClass('expand-close');
        });

        //filter
        $comp.find('.filter-container .main-category .option-section .filter').click(function() {
            if($(this).hasClass('active')) return;

            var dataTag = $(this).attr('data-tag');
            var $filterContainer = $(this).closest('.filter-container');
            var $subCategory = $filterContainer.find('.sub-category');
            if(dataTag !== 'all') {
                var $subOption = $subCategory.find('.option-section[data-parent-category="'+dataTag+'"]');
                if($subOption.length > 0) {
                    var $subAllFilter = $subOption.find('.filter').eq(0);
                    $subOption.addClass('active');
                    $subOption.siblings().removeClass('active');
                    $subAllFilter.addClass('active');
                    $subAllFilter.siblings().removeClass('active');
                    $subCategory.addClass('active');
                } else {
                    $subCategory.removeClass('active');
                }
            } else {
                $subCategory.removeClass('active');
            }

            $(this).addClass('active');
            $(this).siblings().removeClass('active');
            applyFilter($comp);
        });

        $comp.find('.filter-container .sub-category .option-section .filter').click(function() {
            if($(this).hasClass('active')) return;

            $(this).addClass('active');
            $(this).siblings().removeClass('active');
            applyFilter($comp);
        });

        //search
        $comp.find('.search-container .firmware-search-btn').click(function() {
            var $searchInput = $comp.find('.search-container .firmware-search');
            var searchVal = $searchInput.val();
            $searchInput.blur();
            $comp.find('.search-container').attr('data-searchval', searchVal);
            applyFilter($comp);
        });

        $comp.find('.search-container .search-clear-btn').mousedown(function() {
            var $searchContainer = $(this).closest('.search-container');
            $searchContainer.find('.firmware-search').val('');
            $searchContainer.attr('data-searchval','');
        });

        $comp.find('.search-container').focus(function() {
            $(this).find('.firmware-search').focus();
        });

        $comp.find('.search-container .firmware-search').focus(function() {
            $(this).closest('.search-container').addClass('input-focus');
        });

        $comp.find('.search-container .firmware-search').blur(function() {
            $(this).closest('.search-container').removeClass('input-focus');
        });

        $comp.find('.search-container .firmware-search').keyup(function(e) {
            if (e.keyCode == 13){
                $(this).closest('.search-container').find('.firmware-search-btn').click();
            }
        });

        //don't support for ie11
        $comp.find('.search-container .firmware-search').bind('search', function() {
            $(this).closest('.search-container').find('.firmware-search-btn').click();
        });
    }

    $('.firmware-list-comp').each(function() {
        var $comp = $(this);
        var currentBreakPoint = getCurrentBreakPoint();
        bindEvent($comp);
        updateExpandIconState($comp);
        ifShowNoResultIcon($comp);
        initListPagination($comp, currentBreakPoint);

        var resizeTimer;
        $(window).resize(function() {
            if (resizeTimer) {
                clearTimeout(resizeTimer);
            }

	        resizeTimer = setTimeout(function() {
                if (getCurrentBreakPoint() !== currentBreakPoint) {
                    currentBreakPoint = getCurrentBreakPoint();
                    initListPagination($comp, currentBreakPoint);
                    initFilterBar($comp);
                }

                if (currentBreakPoint == 'DESKTOP') {
                    updateExpandIconState($comp);
                }
            }, 80);
        });
    });
};


(function (document, $) {
    $(document).ready(function(){

        $(".hitools-detail-comp").each(function(){
            initThumbnail();
            initSelectedThumbnail($(this));

            $(".hitools-slider-thumbnail").on('beforeChange', function(event, slick, currentSlide, nextSlide){
                if(currentSlide == nextSlide) return;

                var targetSlide = $(slick.$slides[nextSlide]).find(".thumbnail-slider");
                var prevSlide = $(slick.$slides[currentSlide]).find(".thumbnail-slider");
                var src = targetSlide.css('backgroundImage');
                var imgBox = $(this).parent().find(".nav-slider");
                imgBox.css("backgroundImage" ,src )
                prevSlide.removeClass("selected-thumbnail");
                targetSlide.addClass("selected-thumbnail");
            }); 
        })
        function getLastUrlNode (url) {
            return (url || '').split('/').filter(Boolean).pop()
        }

        function initSelectedThumbnail($comp){
            var slick =  $(".hitools-slider-thumbnail").slick("getSlick")
            var navItem = $comp.find(".hitools-slider-nav .nav-slider");
            $(slick.$slides).each(function(index){
                if($(this).find(".thumbnail-slider").css('backgroundImage') == navItem.css('backgroundImage')){
                    $(this).find(".thumbnail-slider").addClass("selected-thumbnail");
                    $(".hitools-slider-thumbnail").slick("getSlick").currentSlide = index;
                }
            })
        }

        function initThumbnail(){
            $(".hitools-slider-nav").slick({
                slidesToShow: 1,
                slidesToScroll: 1,
                arrows: false,
                fade: true,
                asNavFor: ".hitools-slider-thumbnail"
            });
            $(".hitools-slider-thumbnail").slick({
                slidesToShow: 4,
                slidesToScroll: 1,
                asNavFor: ".hitools-slider-nav",
                focusOnSelect: true,
                centerMode:true,
                vertical: true,
                prevArrow:"<button type='button' class='slick-prev'><div class='slick-button'><img src='/etc/clientlibs/it/resources/icons/icon-down.svg'></div></button>",
                nextArrow:"<button type='button' class='slick-next'><div class='slick-button'><img src='/etc/clientlibs/it/resources/icons/icon-down.svg'></div></button>",
            });
        }

        $(".hitools-detail-comp .download-button, .hitools-detail-comp .download-button-mobile-view").click(function(e){
            var download = $(this).data("href");
            var downloadList = download.split(",");
            var atModule = 'hitools_details::' + $(this).data('title') + '::' + getLastUrlNode(download) + '::' + window.location.href
            atModel.doAtEvent(atModule, 'download', e)

            if(isCN && isCnAnalytics){
                var hitoolsTag = "";
                $.each($('.hidden-wrap .hidden-tag-title'),function(){
                    if($(this).attr('data-title').indexOf($(this).attr('data-tag')) > 0){
                        hitoolsTag =$(this).attr('data-tag-title')
                        return
                    }
                })
                var analyticsStr=$(this).attr('data-analytics')+hitoolsTag
                HiAnalyticsCn.clickDown(analyticsStr)
            }

            if (getBrowserType() == "IE") {
                downloadList.forEach(function(item){
                    window.open(item);
                });
            } else {
                downloadList.forEach(function(item){
                    $.fileDownload(item);
                })
            }
        })

        $('.hitools-detail-comp .thumbnail-slider').on('click', function (e) {
            var url = $(this).data('image-url')
            var atModule = 'hitools_details::' + $(this).data('title') + '::' + getLastUrlNode(url) + '::' + window.location.href
            atModel.doAtEvent(atModule, 'action', e)
        })

        $('.hitools-detail-comp .bar-link').on('click', function (e) {
            var href = $(this).data('href')
            var atModule = 'hitools_details::back_to_hitools_list' + '::' + window.location.href
            atModel.doAtEvent(atModule, 'navigation', e)
            setTimeout(function () {
                window.open(href, '_self')
            }, 500)
        })
    })
})(document, $);

function getBrowserType() {
    var userAgent = navigator.userAgent;
    var isOpera = userAgent.indexOf("Opera") > -1;
    if (userAgent.match(/MSIE|Trident/)  && !isOpera) {
        return "IE";
    }
}
$(function() {
    function getLastUrlNode (url) {
        return (url || '').split('/').filter(Boolean).pop()
    }

    function getCurrentBreakPoint() {
        var contentValue = window.getComputedStyle(
          document.querySelector('.hiktools-list-comp'),'::before'
        ).getPropertyValue('content');
        return contentValue.replace(/\"/g, '');
    }

    function updateExpandIconState($comp) {
        var $expandIcon = $comp.find('.hiktools-list-filter-bar .expand-icon');
        var $innerContainer = $comp.find('.hiktools-list-filter-bar .filter-container');

        $comp.find('.hiktools-list-filter-bar').removeClass('close-state');
        if ($innerContainer.height() > 30) {
            $expandIcon.removeClass('hide');
        } else {
            $expandIcon.addClass('hide');
        }
    }

    function addBackdrop() {
        var backdrop = '<div class="hiktools-list-backdrop"></div>';
        if(!$('.hiktools-list-backdrop').length) {
            $('body').append(backdrop);
            $('body').addClass('hiktools-backdrop-open');
        }
    }

    function removeBackdrop() {
        if($('.hiktools-list-backdrop').length) {
            $('.hiktools-list-backdrop').remove();
            $('body').removeClass('hiktools-backdrop-open');
        }
    }

    function ifShowHiktool($hiktool, dataTag, searchVal) {
        var title = $hiktool.find('.hiktool-title').text().toLowerCase();
        var desc = $hiktool.find('.description').text().toLowerCase();
        if (title.indexOf(searchVal) < 0 && desc.indexOf(searchVal) < 0) {
            return false;
        }

        dataTag = '|' + dataTag + '|';
        if (dataTag !== '|all|' && $hiktool.attr('data-tag').indexOf(dataTag) < 0) {
            return false;
        }

        return true;
    }

    function applyFilter($comp) {
        var $hiktoolsList = $comp.find('.hiktools-items-container .hiktools-item');
        var dataTag = $comp.find('.filter.active').attr('data-tag');
        var searchVal = $comp.find('.search-container').attr('data-searchval').trim().toLowerCase();
        $hiktoolsList.each(function() {
            var showHiktool = true;
            showHiktool = ifShowHiktool($(this), dataTag, searchVal);
            if (showHiktool) {
                $(this).removeClass('not-in-scope');
            } else {
                $(this).addClass('not-in-scope');
            }
        });

        initloadingItem($comp);
        ifShowNoResultIcon($comp);
    }

    function ifShowNoResultIcon($comp) {
        var $visibleCourseCard = $comp.find('.hiktools-items-container .hiktools-item:not(.not-in-scope)');
        if($visibleCourseCard.length) {
            $comp.find('.no-result-found').hide();
        } else {
            $comp.find('.no-result-found').show();
        }
    }

    function initloadingItem($comp) {
        $comp.find('.hiktools-items-container .hiktools-item').removeClass('active');
        $comp.find('.hiktools-items-container .hiktools-item:not(.not-in-scope):lt(10)').addClass('active');
    }

    var scrollTimer = null;
    function loadingItem($comp) {
        var $itemNoActive = $comp.find('.hiktools-items-container .hiktools-item:not(.not-in-scope):not(.active):lt(10)');
        var bh = $comp.height() + $comp.offset().top;

        var allowLoad = ($(window).height() + $(window).scrollTop() > bh) && $(window).scrollTop() < bh;

        if (scrollTimer || !allowLoad || $itemNoActive.length <= 0) {
            return;
        }

        if ($itemNoActive.length > 0) {
            $comp.append('<div class="loading-box"><div>');
        }

        scrollTimer = setTimeout(function() {
            $itemNoActive.addClass('active');
            $comp.find('.loading-box').remove();
            scrollTimer = null;
        }, 1000);
    }

    function bindEvent ($comp) {
        $comp.find('.mobile-filter-btn').on('click', function() {
            $comp.find('.hiktools-list-filter-bar').addClass('mobile-active');
            addBackdrop();
        });

        $comp.find('.hiktools-list-filter-bar .close-icon').on('click', function() {
            $comp.find('.hiktools-list-filter-bar').removeClass('mobile-active');
            removeBackdrop();
        });

        $comp.find('.hiktools-list-filter-bar .expand-icon').on('click', function() {
            $comp.find('.hiktools-list-filter-bar').toggleClass('close-state');
        });

        $comp.find('.filter-container .filter').on('click', function() {
            var $mobileFilterBtn = $comp.find('.mobile-filter-btn');
            $(this).addClass('active');
            $(this).siblings().removeClass('active');
            $comp.find('.hiktools-list-filter-bar .close-icon').trigger('click');
            $(this).attr('data-tag') === 'all' ? $mobileFilterBtn.removeClass('has-filtered') : $mobileFilterBtn.addClass('has-filtered');

            applyFilter($comp);
        });

        //search
        $comp.find('.search-container .hiktools-search-btn').on('click', function() {
            var searchVal = $comp.find('.search-container .hiktools-search').val();
            $comp.find('.search-container').attr('data-searchval', searchVal);

            applyFilter($comp);
        });

        $comp.find('.search-container .search-clear-btn').on('click', function() {
            var $searchContainer = $(this).closest('.search-container');
            $searchContainer.find('.hiktools-search').val('');
            $searchContainer.attr('data-searchval','');
        });

        $comp.find('.search-container .hiktools-search').keyup(function(e) {
            if (e.keyCode == 13){
                $comp.find('.hiktools-search-btn').trigger('click');
            }
        });

        //don't support for ie11
        $comp.find('.search-container .hiktools-search').bind('search', function() {
            $comp.find('.hiktools-search-btn').trigger('click');
        });
    }

    function initHitloolsTag(){
        if(isCN){
            $('.hiktools-item a').each(function(index,item){
                var hiktoolTag=$(item).attr('data-tag')
                var _this=$(item)
                $('.hiktools-list-comp ').find('.hiktools-list-filter-bar').find('.filter').each(function(index,itembar){
                    var itemTag=$(itembar).attr('data-tag')
                    var itemTagTitle=$(itembar).attr('data-tag-title')
                    if(hiktoolTag && hiktoolTag.indexOf(itemTag) > -1 ){        
                    var itemTagTitle=$(itembar).attr('data-tag-title')
                    _this.attr('data-tag-title',itemTagTitle)
                    _this.siblings('.download-btn').attr('data-tag-title',itemTagTitle)
                    }
                })
            })
        }

    }
    initHitloolsTag()






    $('body').on('click', '.hiktools-list-backdrop', function() {
        $('.hiktools-list-comp .hiktools-list-filter-bar .close-icon').trigger('click');
    });

    var resizeTimer;
    $('.hiktools-list-comp').each(function() {
        var $comp = $(this);
        var currentBreakPoint = getCurrentBreakPoint();
        updateExpandIconState($comp);
        ifShowNoResultIcon($comp);
        bindEvent($comp);

        $(window).on('resize', function() {
            if (resizeTimer) {
                clearTimeout(resizeTimer);
            }

	        resizeTimer = setTimeout(function() {
                if (getCurrentBreakPoint() !== currentBreakPoint) {
                    currentBreakPoint = getCurrentBreakPoint();
                    $comp.find('.hiktools-list-filter-bar .close-icon').trigger('click');
                }

                if (currentBreakPoint == 'DESKTOP') {
                    updateExpandIconState($comp);
                }
            }, 80);
        });

        window.onwheel = function() {
            if (document.body.scrollHeight <= window.innerHeight) {
                loadingItem($comp);
            }
        };

        $(window).on('scroll', function() {
            if (document.body.scrollHeight > window.innerHeight) {
                loadingItem($comp);
            }
        });
    });

    $(".hiktools-list-comp a.link").click(function (e) {
        var link = $(this).data('href')
        var target = $(this).attr('target')
        var atModule = 'hitools_list::' + $(this).data('title') + '::' + getLastUrlNode(link) + '::' + window.location.href
        atModel.doAtEvent(atModule, 'navigation', e)

        if(isCN && isCnAnalytics){
            link = $(this).data('href')
            var analyticsStr=$(this).attr('data-analytics')
            HiAnalyticsCn.clickDown(analyticsStr)
        }
        console.log('link',link);
        setTimeout(function () {
            window.open(link, target || '_self')
        }, 500)
    })

    $(".hiktools-list-comp .download-btn").click(function(e){
        var download = $(this).data("href");
        var downloadList = download.split(",");
        var atModule = 'hitools_list::' + $(this).data('title') + '::' + getLastUrlNode(download) + '::' + window.location.href
        atModel.doAtEvent(atModule, 'download', e)

        var tagTitle=$(this).attr('data-tag-title')
        var analyticsStr=$(this).attr('data-analytics')+"::"+tagTitle
        HiAnalyticsCn.clickDown(analyticsStr)
        if (getBrowserType() == "IE") {
            downloadList.forEach(function(item){
                window.open(item);
            });
        } else {
            downloadList.forEach(function(item){
                $.fileDownload(item);
            })
        }
        return false;
    })
});
// video 方法改到全局

(function (document, $) {
    $(document).ready(function(){

    $(".feature-gallery-comp .feature-gallery-item").mouseenter(function(){
        //remove before class
        var defaultCol = $(".feature-gallery-col.default-col");

        if(defaultCol.length>0){
            defaultCol.removeClass("default-col");
        }
    });

    $(".feature-gallery-comp .feature-gallery-item").mouseleave(function(){
        var defaultMask = $(".feature-gallery-item.default-item .gallery-mask-icon.fade-none");
        var defaultMaskConent = $(".feature-gallery-item.default-item .gallery-mask-content.fade-none");
        var defaultItem = $(".feature-gallery-item.default-item");

        if(defaultMask.length>0){
            defaultMask.removeClass("fade-none").addClass("fade-in");
        }

        if(defaultMaskConent.length>0){
            defaultMaskConent.removeClass("fade-none").addClass("fade-in");
        }

        if(defaultItem.length>0){
            defaultItem.removeClass("default-item");
        }

        $(this).find(".gallery-mask-icon").removeClass("fade-in").addClass("fade-none");
        $(this).find(".gallery-mask-content").removeClass("fade-in").addClass("fade-none");
        $(this).parent(".feature-gallery-col").addClass("default-col");
        $(this).addClass("default-item");
    });

    $(".feature-gallery-comp .feature-mobile-title").on("click",function(){
        var currentTitleStatus = $(this).find(".title-collasped");
        if(currentTitleStatus.length>0){
            currentTitleStatus.removeClass("title-collasped");
            $(this).parent(".feature-mobile-row").find(".feature-mobile-content").removeClass("default-mobile-content");
        }
        else{
            var defaultContent = $(".feature-mobile-content.default-mobile-content");
            if(defaultContent.length>0){
                defaultContent.removeClass("default-mobile-content");
                defaultContent.parent(".feature-mobile-row").find(".feature-mobile-title .mobile-title-icon").removeClass("title-collasped");
            }
            $(this).parent(".feature-mobile-row").find(".feature-mobile-content").addClass("default-mobile-content");
            $(this).parent(".feature-mobile-row").find(".feature-mobile-title .mobile-title-icon").addClass("title-collasped");
        }
    })



})
})(document, $);
$(document).ready(function () {
    // site
    var formSiteInput = document.getElementById("formSite");
    var hikId = $.cookie("HIKID");
    try {
        hikId = atob(hikId);
    } catch (error) {
        console.log("Login Error:" + error);
    }
    if (formSiteInput) {
        formSiteInput.value = parseSiteFromUrl();
    }

    var $form = $(".newsletter-form #enquiry-form");

    $form.find("textarea[name=otherReason]").css('display','none')
    $form.find('.char-counter').css('display','none')
    $form.find('#hikId').val(hikId)

    $form.find("textarea[name=otherReason]").css('display','none')
    $form.find("input[name=unsubscribeReason]").unbind("change").on('change', function () {
        if ($(this).hasClass("reason-others")) {
            // $form.find("textarea[name=otherReason]").removeAttr("readonly");
            $form.find("textarea[name=otherReason]").css('display','block')
            $form.find('.char-counter').css('display','block')

        } else {
            // $form.find("textarea[name=otherReason]").attr("readonly", "");
            $form.find("textarea[name=otherReason]").css('display','none')
            $form.find('.char-counter').css('display','none')

        }
    });

    if($(".newsletter-form #enquiry-form").length !=0){
        var $emailInput = $form.find("input[name='email']");
        emailVarify.initEmailVerifyStatus($emailInput)
    }
   
    var $submit = $("#newsletterSubmit1");
    if ($submit && $submit.length > 0) {
        initHikFormValidator($("#enquiry-form"), $submit, "newsletters");
    }
});

var emailVarify = (function ($) {
    var email = {};
    email.sendEmailVerification = function (target, emailTarget) {
        var $emailVerificationInput = target.find("input[name='emailVerification']");
        var number = emailTarget.val();
        if (number) {
            // var headers = getEmailVerificationHeader(target);
            var language = $("html")[0].lang;
            var src = "/bin/hikvision/emailVerify.json?email=" + number + "&language=" + language;
            doAjaxWithDataType("GET", src, null,
                null, null, false, null,
                function (resultData) {
                    if (resultData && (resultData.code === 0 || resultData.code === 200)) {
                        email.changeEmailVerifyStatus(target);
                    } else {
                        $('em#email-error').remove();
                        $('<em id="validate-error" class="error help-block">' + Granite.I18n.get(resultData.message.message) + '</em>').insertAfter($emailVerificationInput);
                        email.changeEmailVerifyStatus(target);
                    }
                });

        } else {
            $('em#email-error').remove();
            $('<em id="email-error" class="error help-block">' + Granite.I18n.get('Please enter valid email address') + '</em>').insertAfter(emailTarget);
        }
    };

    email.changeEmailVerifyStatus = function (target) {
        var $emailVirify = target.find(".form-email-verify");
        $emailVirify.addClass("disabled");
        $emailVirify.css("pointer-events", "none");
        var number = 60;
        $emailVirify.html(60 +'s'+ Granite.I18n.get(" later"));
        $emailVirify.addClass("sent");
        var timer = setInterval(function () {
            if (number <= 0) {
                $emailVirify.removeClass("sent");
                $emailVirify.html(Granite.I18n.get("Get code"));
                $emailVirify.removeClass("disabled");
                $emailVirify.css("pointer-events", "");
                clearInterval(timer)
            } else {
                number--;
                $emailVirify.html(number+'s' + Granite.I18n.get(" later"));
            }
        }, 1000)
    };

    email.initEmailVerifyStatus = function (emailTarget) {
        var btns = $(".email-code-group");
        $.each(btns, function (key, val) {
            var target = $(val);
            var $emailVirify = target.find(".form-email-verify");
            $emailVirify.unbind("click").on('click', function (e) {
                e.stopPropagation();
                var atModule = $(e.target).parent().parent().data('at-module')
                if(atModule){
                    atModel.doAtEvent(atModule + '::' , 'action', e)
                }
                email.sendEmailVerification(target, emailTarget);
            });
        });
    };

    return email;
}($));
$(document).ready(function() {
    $('.search-bar-section .search-bar .search-bar-btn').on('click', function() {
        var searchValue = $(this).closest('.search-bar').find('.search-bar-value').val();//搜索的值
        var searchType = $(this).closest('.search-bar').attr('data-search-type');//所在当前页面的type
        var searchURL = $(this).closest('.search-bar').attr('data-url');//跳转页面路径
        var turnToType = $(this).closest('.search-bar').attr('data-href-type');
        searchValue = searchValue.trim().toLowerCase();
        searchType = searchType.trim().toLowerCase();
        var newUrl = searchURL + '?q=' + searchValue + '&t=' + searchType;
        if(turnToType === '_self'){
            window.location.href = newUrl;//当前页面跳转
        } else if (turnToType === '_blank') {
            window.open(newUrl);
        }
    })
    $('.search-bar-section .search-bar .search-bar-search').keyup(function(e) {
        if (e.keyCode == 13){
            $(this).closest('.search-bar').find('.search-bar-btn').click();
        }
    });

    //don't support for ie11
    $('.search-bar-section .search-bar .search-bar-search').bind('search', function() {
        $(this).closest('.search-bar').find('.search-bar-btn').click();
    });

    $('.search-bar-section .search-bar .search-bar-empty').mousedown(function() {
        $(this).closest('.search-bar').find('.search-bar-value').val('');
    });
});
(function (document, $) {
    var $form = $("#enquiry-form");
    var $initBusinessTypeForm = $('#enquiry-form.sales-inquiry-form')
    var originalType = "";
    $(document).ready(function () {
        $form.find(".group-hidden").hide();
        $form.find("input[name=userType]").unbind("click").on('click', function () {
            var $item = $(this);
            var type = $item.val();
            if (originalType !== type) {
                originalType = type;
                changeUserType(type === "Enterprise");
            }
        });
        globalPcd.initDefaultCountry($form);
        globalPcd.styleOutlinedFormByDisplayStatus($form);
        initialBusinessType($initBusinessTypeForm);

        if ($form.hasClass('outlined-form')) {
            $initBusinessTypeForm.outlinedFormLabelShrink();

            var $select = $('.hik-multiple-select.industry');

            if ($select.length !== 0) {
                $.getScript("/etc/hiknow/industry-list.json", function (data) {
                    if (data) {
                        var industryList = eval(data);
                        var innerHtml = '';
                        industryList.forEach(function (item, index) {
                            innerHtml += '<li data-val="' + item.value + '"><input name="businessVertical" type="checkbox" value="' + item.value + '" /> <span>' + Granite.I18n.get(item.name) + '</span></li>';
                        });

                        $select.find('ul').html(innerHtml);
                        $select.hikMultiSelect();
                    }
                });
            }
        }
    });

    function changeUserType(isEnterprise) {
        var $company = $form.find(".group-company");
        var $businessType = $form.find(".group-business-type");
        if (isEnterprise) {
            $company.show();
            $company.find("input").attr("required", "");

            $form.find(".group-job-title").show();
            $form.find(".group-company-tel").show();
            $form.find(".group-hidden").remove();

            // tfs-31386
            $businessType.find("label").addClass("required");
            $businessType.find("input").attr("required", "");
            $businessType.find("input").attr("requredHidden", "true");
            $businessType.show();

            $form.find(".industry-group").show();
            $form.find('.group-company-title').show();
        } else {
            $company.hide();
            $company.find("input").removeAttr("required");

            $form.find(".group-job-title").hide();
            var compantTel = $form.find(".group-company-tel");
            compantTel.hide();
            $('<div class="form-group half group-hidden"></div>').insertAfter(compantTel);

            // tfs-31386
            $businessType.find("label").removeClass("required");
            $businessType.find("input").removeAttr("required");
            $businessType.find("input").removeAttr("requredHidden");
            $businessType.hide();
            $('<div class="form-group half group-hidden"></div>').insertAfter($businessType);

            $form.find(".industry-group").hide();
            $form.find('.group-company-title').hide();

            // var userType = $form.find("input[name=type]");
            // var endUser = "End User";
            // if (endUser !== userType.val()) {
            //     $form.find("li[data-value='End User']").trigger("click");
            // }
        }
    }

    function initialBusinessType(form) {
        var option = {
            onSelected: function ($ele, $input) {
                var val = $input.data('value');
                $ele.find('input[name="type"]').val(val).trigger('change').trigger('blur');
            },
            hasTooltip: true
        }
        
        return form.find('.hik-outlined-select.business-type').hikSelect(option);
    }
})(document, $);
var regionLever = {
    country: 0,
    region: 0,
    province: 1,
    city: 2,
    district: 3
};

if (!String.prototype.startsWith) {
    String.prototype.startsWith = function (str) {
        var reg = new RegExp("^" + str);
        return reg.test(this);
    }
}

var globalPcd = (function ($) {
    var regionModel = {};
    /**
     * show region countries
     */
    var showRegionCountry = ["FR"];
    var ruCountry = "RU";
    /**
     * hide province countries
     */
    var hideProvinceCountry = ["SA", "GB", "UK", "IE"];
    /**
     * hide city countries
     */
    var hideCityCountry = ["PL"];
    var placeholderMsg = Granite.I18n.get('Please Select') + "...";

    regionModel.selectData = {};
    var $regionUl;
    var $provinceUl;
    var $cityUl;
    var $selRegion;
    var $selProvince;
    var $selCity;
    var $selRegionInput;
    var $selProvinceInput;
    var $selCityInput;
    var $selRegionCodeInput;
    var $selProvinceCodeInput;
    var $selCityCodeInput;
    var $selForm;

    /**
     * initCountryRegionData
     */
    regionModel.initCountryRegionData = function (countryCode, callback, storageType, selector) {
        if (isNull(storageType)) {
            storageType = "local"
        }
        var storeName = storeManager.STORE_NAMES.regionDisclaimer;
        var path = "/bin/hikvision/regionInfo.json?countryCode=" + countryCode;
        if (!isNull(selector)) {
            storeName = storeManager.STORE_NAMES.suggestDisclaimer;
            path = "/bin/hikvision/regionInfo." + selector + ".json?countryCode=" + countryCode;
        }
        getAndConcatStorage(path, storeName, countryCode, storageType, callback);
    };

    /**
     * initMultiCountryRegionData
     */
    regionModel.initMultiCountryRegionData = function (countryCode, callback, storageType) {
        var result = [];
        if (countryCode instanceof Array) {
            countryCode.forEach(function (value, index) {
                regionModel.initCountryRegionData(value, function (data) {
                    result = result.concat(data);
                }, storageType, "suggest");
            });
        } else {
            regionModel.initCountryRegionData(countryCode, function (data) {
                result = data;
            }, storageType, "suggest");
        }
        return result;
    };

    /**
     * filter region data
     * @param regionData
     * @param level
     * @param value
     * @returns {*}
     */
    regionModel.filterData = function (regionData, level, value) {
        return regionData.filter(function (item, index) {
            return item.level === level && ((item.name && item.name.indexOf(value) >= 0) || (item.code && item.code.indexOf(value) >= 0));
        });
    };

    /**
     * filter user select data
     * @param regionData
     * @param level
     * @param value
     * @returns {*}
     */
    regionModel.filterSelectData = function (regionData, level, key, value) {
        return regionData.filter(function (item, index) {
            return item.level === level && item[key] === value
        });
    };

    /**
     * init dropdown status
     * @param $form
     */
    regionModel.initDropdownStatus = function ($form) {
        $regionUl = $form.find("#global-region");
        $provinceUl = $form.find("#global-province");
        $cityUl = $form.find("#global-city");
        $selRegion = $form.find("#selected-region");
        $selProvince = $form.find("#selected-province");
        $selCity = $form.find("#selected-city");
        $selRegionCodeInput = $form.find("input[name=regionCode]");
        $selCityCodeInput = $form.find("input[name=cityCode]");

        if ($form[0].hasAttribute("data-region-name")) {
            var regionName = $form.attr("data-region-name");
            $form.find("input[name=region]").attr("name", regionName);
            $selRegionInput = $form.find("input[name=" + regionName + "]");
        } else {
            $selRegionInput = $form.find("input[name=region]");
        }

        if ($form[0].hasAttribute("data-province-name")) {
            var provinceName = $form.attr("data-province-name");
            $form.find("input[name=province]").attr("name", provinceName);
            $selProvinceInput = $form.find("input[name=" + provinceName + "]");
        } else {
            $selProvinceInput = $form.find("input[name=province]");
        }

        // RU dif
        if (regionModel.selectData.countryCode === ruCountry) {
            var provinceCode = "leadLocationRegion";
            if (null === $selProvinceCodeInput || !$selProvinceCodeInput || $selProvinceCodeInput.length === 0) {
                $selProvinceCodeInput = $form.find("input[name='provinceCode']")
            }
            $selProvinceCodeInput.attr("name", provinceCode);
            $selProvinceCodeInput = $form.find("input[name=" + provinceCode + "]");
        } else {
            if ($form[0].hasAttribute("data-provincecode-name")) {
                var provinceCode = $form.attr("data-provincecode-name");
                if (null === $selProvinceCodeInput || !$selProvinceCodeInput || $selProvinceCodeInput.length === 0) {
                    $selProvinceCodeInput = $form.find("input[name='provinceCode']")
                }
                $selProvinceCodeInput.attr("name", provinceCode);
                $selProvinceCodeInput = $form.find("input[name=" + provinceCode + "]");
            } else {
                $selProvinceCodeInput = $form.find("input[name=provinceCode]");
            }
        }
        if ($form[0].hasAttribute("data-city-name")) {
            var cityName = $form.attr("data-city-name");
            $form.find("input[name=city]").attr("name", cityName);
            $selCityInput = $form.find("input[name=" + cityName + "]");
        } else {
            $selCityInput = $form.find("input[name=city]");
        }

        regionModel.initRegionData("");

        regionModel.initShowProvince($form);
        regionModel.initShowCity($form);
    };

    /**
     * init city show
     * @param $form
     */
    regionModel.initShowCity = function ($form) {
        $cityUl.empty();
        regionModel.initCityData("", "");
        if (hideCityCountry.indexOf(regionModel.selectData.countryCode) > -1) {
            var cityColumn = $form.find("#city-column");
            cityColumn.hide();
            if ($form.find(".city-hidden").length === 0) {
                $('<div class="form-group half address-group city-hidden hidden"></div>').insertAfter(cityColumn);
            }
            regionModel.initCityData(" ");
        } else {
            $form.find("#city-column").show();
            $form.find(".city-hidden").remove();
        }
    };

    /**
     * init province show
     * @param $form
     */
    regionModel.initShowProvince = function ($form) {
        $provinceUl.empty();
        regionModel.initProvinceData("", "");
        if (hideProvinceCountry.indexOf(regionModel.selectData.countryCode) > -1) {
            var provinceColumn = $form.find("#province-column");
            provinceColumn.hide();
            if ($form.find(".province-hidden").length === 0) {
                $('<div class="form-group half address-group province-hidden hidden"></div>').insertAfter(provinceColumn);
            }
            regionModel.initProvinceData(" ");
        } else {
            $form.find("#province-column").show();
            $form.find(".province-hidden").remove();
        }
    };
    /**
     * init region show
     * @param $form
     * @param show
     */
    regionModel.initShowRegion = function ($form, show) {
        $regionUl.empty();
        regionModel.initRegionData("", "");
        var $regionColumn = $form.find("#region-column");

        if (show) {
            $regionColumn.show();
            $regionColumn.find(".hidden-value").attr("required", "required");
            $form.find(".region-hidden").remove();
        } else {
            $regionColumn.hide();
            $regionColumn.find(".hidden-value").removeAttr("required");
            if ($form.find(".region-hidden").length === 0) {
                $('<div class="form-group half region-hidden hidden"></div>').insertAfter($regionColumn);
            }
        }
    };

    regionModel.styleOutlinedFormByDisplayStatus = function ($form) {
        var countryCol = $form.find('#country-column');
        if (!countryCol.find('.outlined').length)
            return;

        var $addrGrp = $form.find('.address-group');

        // all shown divs from address group 
        // -> country, region, provice , city, distributor, other distributor, postcode
        // add address-group ass class if want to auto format
        var shownDivs = $addrGrp.filter(function (index, addr) {
            return checkDivShown($(addr))
        });

        // check nums of shown address div, even country is half, odd full size
        if (shownDivs.length % 2 === 0) {
            countryCol.addClass('half')
        } else {
            countryCol.removeClass('half')
        }

        // remove shrink label after reinitial country dropdown
        $addrGrp.each(function (index, ele) {
            if (!$(ele).find('input').first().val()) {
                $(ele).find('.hasVal').removeClass('hasVal');
            }
        })

        function checkDivShown($ele) {
            return !!$ele.length && !($ele.css('display') === 'none');
        }
    }

    regionModel.initRegionData = function (value, code) {
        var $street = $selForm.find('#street');
        $selRegion.val(value);
        $selRegionInput.val(value);
        if (!isNull(code)) {
            $selRegionCodeInput.val(code);
        } else {
            $selRegionCodeInput.val("");
        }

        if (showRegionCountry.indexOf(regionModel.selectData.countryCode) > -1) {
            $street.val(value);
            $street.trigger("change");
        }
        if (isNull(value)) {
            $regionUl.children().remove();
        }
        $selRegionInput.trigger("change");
        $selRegionCodeInput.trigger("change");
    };

    regionModel.initProvinceData = function (value, code, countryCode) {
        $selProvince.val(value);
        $selProvinceInput.val(value);
        // for esales code = countryCode_code: CN_31
        if (!isNull(code)) {
            $selProvinceCodeInput.val(countryCode && countryCode !== ruCountry ? countryCode + "_" + code : code);
        } else {
            $selProvinceCodeInput.val("");
        }

        if (isNull(value)) {
            $provinceUl.children().remove();
        }
        $selProvinceInput.trigger("change");
        $selProvinceCodeInput.trigger("change");
    };
    regionModel.initCityData = function (value, code) {
        $selCity.val(value.trim());
        $selCityInput.val(value.trim());
        if (!isNull(code)) {
            $selCityCodeInput.val(code);
        } else {
            $selCityCodeInput.val("");
        }
        if (isNull(value)) {
            $cityUl.children().remove();
        }
        $selCityInput.trigger("change");
        $selCityCodeInput.trigger("change");
    };

    regionModel.initEditProvince = function () {
        $selProvince.addClass("editor-input");
        $selProvince.removeAttr("placeholder");
        $selProvince.parent().addClass("editor-input");
    };
    regionModel.initEditCity = function () {
        $selCity.addClass("editor-input");
        $selCity.removeAttr("placeholder");
        $selCity.parent().addClass("editor-input");
        $cityUl.empty();
    };

    regionModel.selectCountry = function ($form, countryCode, $selectCountry) {
        if (countryCode && regionModel.selectData.countryCode !== countryCode) {
            if ($selectCountry) {
                var postcodeGroup = $form.find(".postcode-group");
                var postcodeRequired = $selectCountry.attr('data-postcode-required');
                if (postcodeRequired && postcodeRequired.toLowerCase() === 'true') {
                    postcodeGroup.find("label").addClass('required');
                    postcodeGroup.find("input").attr('required', 'true');
                } else {
                    postcodeGroup.find("label").removeClass('required');
                    postcodeGroup.find("input").removeAttr('required');
                }
                // postcode验证必填
                postcodeGroup.find("input").on('input', function () {
                    setTimeout(function () {
                        checkRequired($("#enquiry-form"), $("#enquiry-form").find("button[type='submit']"))
                    }, 0);
                })
            }

            regionModel.initCountryRegionData(countryCode, function (regionData) {
                if (regionData != null) {
                    regionModel.selectData = {};
                    regionModel.selectData.countryCode = countryCode;
                    regionModel.initDropdownStatus($form);

                    // get select country
                    var selectCountryData = regionModel.filterSelectData(regionData, regionLever.country, "code", countryCode);
                    regionModel.initEditProvince();
                    regionModel.initEditCity();
                    
                    if (selectCountryData && selectCountryData.length > 0) {
                        if (selectCountryData[0].childs.length > 1) {
                            regionModel.initShowRegion($form, true);
                            regionModel.initRegion($form, selectCountryData[0].childs, countryCode);
                        } else {
                            regionModel.initShowRegion($form, false);
                            regionModel.selectData.region = selectCountryData[0].childs[0].name;
                            regionModel.initRegionData(selectCountryData[0].childs[0].name, selectCountryData[0].childs[0].code);
                            regionModel.initProvince($form, selectCountryData[0].childs[0].childs, countryCode);
                        }
                    } else {
                        regionModel.initShowRegion($form, false);
                    }

                    regionModel.styleOutlinedFormByDisplayStatus($form)
                }
            });
        }
    };

    regionModel.initRegion = function ($form, regionData, countryCode) {
        $selRegion.removeClass("editor-input");
        $selRegion.parent().removeClass("editor-input");
        if (!$selRegion.parent().parent().hasClass('outlined'))
            $selRegion.attr("placeholder", placeholderMsg);
        var tempRegion;
        regionData.forEach(function (regionItem, index) {
            if (tempRegion !== regionItem.name) {
                tempRegion = regionItem.name;
                var newRegionLi = $regionUl.append('<li data-value="' + regionItem.name + '" data-code="' + regionItem.code + '">' + regionItem.name + '</li>');
                newRegionLi.unbind("click").on("click", function (evt) {
                    var _this = $(evt.target);
                    var selectedVal = _this.parent().closest('.dropdown-wrapper').find('.selector-label .selected-option').val();

                    var value = _this.attr("data-value");
                    var code = _this.attr("data-code");

                    _this.siblings().removeClass('active')
                    _this.addClass('active')

                    if (regionModel.selectData.region !== value || selectedVal === '') {
                        regionModel.selectData.region = value;

                        regionModel.initRegionData(value, code);
                        regionModel.initProvinceData("", "");
                        regionModel.initCityData(" ", " ");
    
                        var selectRegionData = regionModel.filterSelectData(regionData, regionLever.region, "name", value);
                        if (selectRegionData && selectRegionData.length > 0) {
                            regionModel.initProvince($form, selectRegionData[0].childs, countryCode);
                        } else {
                            regionModel.initEditProvince();
                            regionModel.initEditCity();
                        }
                    }
                });
            }
        });
    };

    regionModel.initProvince = function ($form, provinceData, countryCode) {
        if (provinceData && provinceData.length > 0) {
            $selProvince.removeClass("editor-input");
            $selProvince.parent().removeClass("editor-input");
            $selProvince.attr("placeholder", placeholderMsg);
            var tempProvince = "";
            provinceData.forEach(function (provinceItem, index) {
                if (tempProvince !== provinceItem.name) {
                    tempProvince = provinceItem.name;
                    var newProvinceLi = $provinceUl.append('<li data-value="' + provinceItem.name + '" data-code="' + provinceItem.code + '">' + provinceItem.name + '</li>');
                    if (hideProvinceCountry.indexOf(regionModel.selectData.countryCode) > -1) {
                        regionModel.selectData.province = provinceItem.name;
                        regionModel.initProvinceData(" ", " ");
                        regionModel.selectProvince($form, provinceItem);
                    } else {
                        newProvinceLi.unbind("click").on("click", function (evt) {
                            var _this = $(evt.target);
                            var selectedVal = _this.parent().closest('.dropdown-wrapper').find('.selector-label .selected-option').val();

                            _this.siblings().removeClass('active')
                            _this.addClass('active')

                            var value = _this.attr("data-value");
                            var code = _this.attr("data-code");
                            if (regionModel.selectData.province !== value || selectedVal === '') {
                                regionModel.selectData.province = value;

                                regionModel.initProvinceData(value, code ? code : value, countryCode);
                                regionModel.initCityData(" ", " ");
    
                                var selectProvinceData = regionModel.filterSelectData(provinceData, regionLever.province, "name", value);
                                if (selectProvinceData && selectProvinceData.length > 0) {
                                    regionModel.selectProvince($form, selectProvinceData[0], countryCode);
                                } else {
                                    regionModel.initEditCity();
                                }
                            }
                        });
                    }
                }
            });
        }
    };

    regionModel.selectProvince = function ($form, provinceData, countryCode) {
        if (provinceData.childs.length > 0) {
            $selCity.removeClass("editor-input");
            $selCity.parent().removeClass("editor-input");
            if (!$selCity.parent().parent().hasClass('outlined'))
                $selCity.attr("placeholder", placeholderMsg);
            var tempCity = "";

            var cityList = regionModel.sortCity(provinceData.childs);
            cityList.forEach(function (cityItem, index) {
                if (tempCity !== cityItem.name) {
                    tempCity = cityItem.name;
                    var newCityLi = $cityUl.append('<li data-value="' + cityItem.name + '" data-code="' + cityItem.code + '">' + cityItem.name + '</li>');
                    newCityLi.unbind("click").on("click", function (evt) {
                        var _this = $(evt.target);
                        var value = _this.attr("data-value");
                        var code = _this.attr("data-code");
                        var selectedVal = _this.parent().closest('.dropdown-wrapper').find('.selector-label .selected-option').val();

                        _this.siblings().removeClass('active')
                        _this.addClass('active')

                        if (regionModel.selectData.city !== value || selectedVal === '') {
                            regionModel.selectData.city = value;
                            regionModel.initCityData(value, code);
                        }
                    });
                }
            });
        } else {
            regionModel.initEditCity();
        }
    };

    regionModel.sortCity = function (citys) {
        var outherCity = "Other Cities";
        var index = citys.findIndex(function (item) {
            return item.name === outherCity;
        });
        if (index >= 0) {
            var otherCityItem = citys[index];
            citys.splice(index, 1);
            citys.push(otherCityItem);
        }

        return citys;
    };

    /*****  region Suggest  *****/

    /**
     * select default country
     * @param $form
     */
    regionModel.initDefaultCountry = function ($form) {
        if ($form.length > 0) {
            $selForm = $form;
            setTimeout(function () {
                var defaultCountry = $form.find("#defaultCountry").val();
                var defaultCountryCode = $form.find("#defaultCountryCode").val();
                if (defaultCountry) {
                    var $country = $form.find("input[name=country]");
                    var $countryCode = $form.find("input[name=countryCode]");
                    var $selCountry = $form.find(".country-filter-input");
                    $selCountry.val(defaultCountry);

                    // outlined field suppor
                    if ($selCountry.parent().parent().hasClass('outlined')) {
                        $selCountry.parent().parent().addClass('hasVal');
                    }

                    $country.val(defaultCountry).trigger('change');
                    $countryCode.val(defaultCountryCode).trigger('change');
                    regionModel.selectCountry($form, defaultCountryCode);

                    var $selectCountry = $form.find(".global-country .options[data-code='" + defaultCountryCode + "']");
                    var postcodeGroup = $form.find(".postcode-group");
                    var postcodeRequired = $selectCountry.attr('data-postcode-required');
                    if (postcodeRequired && postcodeRequired.toLowerCase() === 'true') {
                        postcodeGroup.find("label").addClass('required');
                        postcodeGroup.find("input").attr('required', 'true');
                    } else {
                        postcodeGroup.find("label").removeClass('required');
                        postcodeGroup.find("input").removeAttr('required');
                    }
                    regionModel.selectCountry($form, defaultCountryCode.toUpperCase(), $selectCountry);
                }
            }, 1000);
        }
    };

    /**
     * json array sort
     * @param filed
     * @param rev is desc
     * @param primer type
     * @returns {Function}
     */
    regionModel.sortBy = function (filed, rev, primer) {
        rev = (rev) ? -1 : 1;
        return function (a, b) {
            a = a[filed];
            b = b[filed];
            if (typeof (primer) != 'undefined') {
                a = primer(a);
                b = primer(b);
            }
            if (a < b) {
                return rev * -1;
            }
            if (a > b) {
                return rev * 1;
            }
            return 1;
        }
    };

    /**
     * unique
     * @param array
     * @param key
     * @param removeCity
     * @returns {[*]}
     */
    regionModel.uniqueArray = function (array, key, removeCity) {
        var result = null;
        if (array.length > 0) {
            var itemOne = array[0];
            deleteProperty(itemOne, removeCity);
            result = [itemOne];
            for (var i = 1; i < array.length; i++) {
                var item = array[i];
                var repeat = false;
                for (var j = 0; j < result.length; j++) {
                    if (item[key] === result[j][key]) {
                        repeat = true;
                        break;
                    }
                }
                if (!repeat) {
                    deleteProperty(item, removeCity);
                    result.push(item);
                }
            }
            return result;
        }
        return result;
    };

    /**
     * delete json property
     * @param item
     * @param removeCity
     */
    function deleteProperty(item, removeCity) {
        if (removeCity) {
            delete item.city;
            delete item.cityCode;
        }
    }

    /**
     * input value suggest top size items
     * @param data {countryCode, level, value, top}
     */
    regionModel.regionSuggestData = function (data) {
        var top = data.top ? data.top : 10;
        var keyWords = data.value;
        var countryData = regionModel.initMultiCountryRegionData(data.countryCode, null, "local");
        if (countryData && countryData.length > 0 && keyWords.length >= 2) {
            if (!isNaN(Number(keyWords)) && keyWords.length <= 4) {
                // 1. equals， 2.starts with
                var equalsData = regionModel.filterDataEquals(countryData, regionLever.city, "cityCode", keyWords);
                if (top === equalsData.length) {
                    return equalsData;
                } else if (top < equalsData.length) {
                    return regionModel.checkArrayLength(equalsData, top);
                }

                var startsWithData = regionModel.filterDataStartWith(countryData, regionLever.city, "cityCode", keyWords);
                startsWithData = startsWithData.sort(regionModel.sortBy("cityCode", true, parseInt));
                if (startsWithData.length === 0) {
                    return equalsData;
                } else {
                    var startsSize = top - equalsData.length;
                    if (startsSize >= startsWithData.length) {
                        return equalsData.concat(startsWithData);
                    } else {
                        return equalsData.concat(regionModel.checkArrayLength(startsWithData, startsSize));
                    }
                }
            } else {
                // 1. equals， 2.starts with
                var equalsData = regionModel.suggestEquals(countryData, keyWords, top);
                if (top === equalsData.length) {
                    return equalsData;
                } else if (top < equalsData.length) {
                    return regionModel.checkArrayLength(equalsData, top);
                }

                var startsSize = top - equalsData.length;
                var startsWithData = regionModel.suggestStartsWith(countryData, keyWords, startsSize);
                var filterData = equalsData.concat(startsWithData);
                if (top >= filterData.length) {
                    return filterData;
                } else {
                    return regionModel.checkArrayLength(filterData, top);
                }
            }
        }
        return [];
    };
    /**
     * Equals data
     * @param countryData
     * @param keyWords
     * @returns {T[]}
     */
    regionModel.suggestEquals = function (countryData, keyWords, top) {
        var filterData = [];
        var cityData = regionModel.filterDataEquals(countryData, regionLever.city, "city", keyWords);
        cityData = cityData.sort(regionModel.sortBy("city", false, String));
        filterData = filterData.concat(cityData);
        if (top <= filterData.length) {
            return filterData;
        }

        var shortData = regionModel.filterDataEquals(countryData, regionLever.province, "provinceShort", keyWords);
        shortData = regionModel.uniqueAndSort(shortData, "province");
        filterData = filterData.concat(shortData);
        if (top <= filterData.length) {
            return filterData;
        }

        var provinceData = regionModel.filterDataEquals(countryData, regionLever.province, "province", keyWords);
        provinceData = regionModel.uniqueAndSort(provinceData, "province");
        filterData = filterData.concat(provinceData);

        return filterData
    };
    /**
     * StartsWith data
     * @param countryData
     * @param keyWords
     * @returns {T[]}
     */
    regionModel.suggestStartsWith = function (countryData, keyWords, top) {
        var filterData = [];
        var cityStartData = regionModel.filterDataStartWith(countryData, regionLever.city, "city", keyWords);
        cityStartData = cityStartData.sort(regionModel.sortBy("city", false, String));
        filterData = filterData.concat(cityStartData);
        if (top <= filterData.length) {
            return filterData;
        }

        var shortStartData = regionModel.filterDataStartWith(countryData, regionLever.province, "provinceShort", keyWords);
        shortStartData = regionModel.uniqueAndSort(shortStartData, "province");
        filterData = filterData.concat(shortStartData);
        if (top <= filterData.length) {
            return filterData;
        }

        var provinceStartData = regionModel.filterDataStartWith(countryData, regionLever.province, "province", keyWords);
        provinceStartData = regionModel.uniqueAndSort(provinceStartData, "province");
        filterData = filterData.concat(provinceStartData);

        return filterData
    };

    /**
     * unique and sort array
     * @param data
     * @param key
     * @returns {this}
     */
    regionModel.uniqueAndSort = function (data, key) {
        if (data.length > 1) {
            data = regionModel.uniqueArray(data, key, true)
                .sort(regionModel.sortBy(key, false, String));
        } else if (data.length === 1) {
            deleteProperty(data[0], true);
        }
        return data;
    };

    regionModel.checkArrayLength = function (data, size) {
        if (size >= data.length) {
            return data;
        } else {
            return data.splice(0, size);
        }
    };

    /**
     * input value suggest top size items
     * @param data {countryCode: "single or array country code", level, value, top}
     */
    regionModel.regionSuggest = function (data) {
        if (!data.countryCode) {
            return [];
        } else if (data.countryCode instanceof Array) {
            if (data.countryCode.length === 0) {
                return [];
            }
        } else if (isNull(data.countryCode) || isNull(data.value)) {
            return [];
        }
        return regionModel.regionSuggestData(data);
    };

    /**
     * filter region data(StartWith)
     * @param regionData
     * @param level
     * @param key
     * @param value
     * @returns {*}
     */
    regionModel.filterDataStartWith = function (regionData, level, key, value) {
        return regionData.filter(function (item, index) {
            return item[key]
                && item[key].toString().trim().toLowerCase() !== value.toString().trim().toLowerCase()
                && item[key].toString().trim().toLowerCase().startsWith(value.toString().trim().toLowerCase());
        });
    };
    /**
     * filter region data(Equals)
     * @param regionData
     * @param level
     * @param key
     * @param value
     * @returns {*}
     */
    regionModel.filterDataEquals = function (regionData, level, key, value) {
        return regionData.filter(function (item, index) {
            return item[key] && item[key].toString().trim().toLowerCase() === value.toString().trim().toLowerCase();
        });
    };

    /*****  end region Suggest  *****/

    return regionModel;
}($));
var cnPcd = (function ($) {
    var regionModel = {};
    regionModel.selectData = {};

    /**
     * initCnPCDData
     */
    regionModel.initCnPcdData = function () {
        var $form = $("#enquiry-form");
        var $selProvinceInput = $("input[name=province]");
        var $selCityInput = $("input[name=city]");
        var $selDistInput = $("input[name=district]");
        if ($form.length > 0) {
            if ($form[0].hasAttribute("data-province-name")) {
                var provinceName = $form.attr("data-province-name");
                $selProvinceInput.attr("name", provinceName);
            }
            if ($form[0].hasAttribute("data-city-name")) {
                var cityName = $form.attr("data-city-name");
                $selCityInput.attr("name", cityName);
            }
            if ($form[0].hasAttribute("data-district-name")) {
                var districtName = $form.attr("data-district-name");
                $selDistInput.attr("name", districtName);
            }
        }

        var $province = $("#cn-province");
        var $city = $("#cn-city");
        var $district = $("#cn-district");
        if ($province.length > 0 && $city.length > 0 && $district.length > 0) {
            var provinceData = storeManager.sessionStorage.get(storeManager.STORE_NAMES.cnRegionDisclaimer);
            if (!provinceData) {
                doAjax("GET", "/bin/hikvision/regionInfo.json?countryCode=CN", null,
                    "application/json", null, null, function (result) {
                        if (result) {
                            var region = eval(result);
                            if (region && region.length > 0 && region[0].childs.length > 0) {
                                provinceData = region[0].childs[0].childs;
                                storeManager.sessionStorage.set({
                                    name: storeManager.STORE_NAMES.cnRegionDisclaimer,
                                    value: provinceData
                                });

                                initDropdownInfo(provinceData);
                                var $submit = $form.find("button[type='submit']");
                                initNewDropdown($form, $submit);
                            }
                        }
                    });
            } else {
                initDropdownInfo(provinceData);
            }
        }
    };

    regionModel.selectProvince = function ($form, value, provinceTarget) {
        if (value && regionModel.selectData.province !== value) {
            var provinceData = storeManager.sessionStorage.get(storeManager.STORE_NAMES.cnRegionDisclaimer);
            if (provinceData != null) {
                regionModel.selectData.province = value;

                var $cityUi = $form.find("#cn-city");
                var $districtUi = $form.find("#cn-district");
                var $selCity = $form.find("#selected-city");
                var $selDist = $form.find("#selected-district");
                var $selCityInput = $form.find("input[name=city], input[name=hikRegisterCity]")
                var $selDistInput = $form.find("input[name=district], input[name=hikRegisterCounty]")

                $selCity.val('');
                $selCityInput.val('');
                $cityUi.children().remove();
                $selCityInput.trigger("change");

                $selDist.val('');
                $selDistInput.val('');
                $districtUi.children().remove();
                $selDistInput.trigger("change");

                var selectProvinceData = provinceData.filter(function (item, index) {
                    return item.level === 1 && item.name === value
                });
                if (selectProvinceData && selectProvinceData.length > 0) {
                    selectProvinceData[0].childs.forEach(function (cityItem, index) {
                        var newCity = $cityUi.append("<li data-value='" + cityItem.name + "'>" + cityItem.name + "</li>");
                        newCity.unbind("click").on("click", function (evt) {
                            var selectedCity = $(evt.target).text();
                            $selDist.val('');
                            $selDistInput.val('');
                            if (regionModel.selectData.city !== selectedCity) {
                                regionModel.selectData.city = selectedCity;
                                $selCity.val(selectedCity);
                                $selCityInput.val(selectedCity);
                                $selCityInput.change();
                                $districtUi.children().remove();
                                var selectCityData = selectProvinceData[0].childs.filter(function (item, index) {
                                    return item.level === 2 && item.name === selectedCity
                                });

                                if (selectCityData && selectCityData.length > 0) {
                                    selectCityData[0].childs.forEach(function (distItem, index) {
                                        var newDist = $districtUi.append("<li data-value='" + distItem.name + "'>" + distItem.name + "</li>");
                                        newDist.unbind("click").on('click', function (evt) {
                                            var selectedDistrict = $(evt.target).text();
                                            setTimeout(function(){
                                                checkRequired($form,$form.find("button[type='submit']"))
                                            }, 500)
                                            if ($selDistInput.val() !== selectedDistrict) {
                                                $selDist.val(selectedDistrict);
                                                $selDistInput.val(selectedDistrict);
                                            }
                                        });
                                    });
                                }
                            }
                        });
                    });
                }
            }
        }
    };

    function initDropdownInfo(provinceData) {
        if (provinceData && provinceData.length > 0) {
            var $province = $("#cn-province");
            $province.children().remove();
            provinceData.forEach(function (provinceItem, index) {
                $province.append("<li data-value='" + provinceItem.name + "'>" + provinceItem.name + "</li>");
            });
        }
    }

    $(document).ready(function () {
        regionModel.initCnPcdData();
    });

    return regionModel;
}($));

$(document).ready(function() {
    function header2Deviation($target) {
        var $header2 = $('#cmp-subheader-selector');
        var deviation = 0;

        if ($header2.length && $header2.is(":visible")) {
            var h2h =  $header2.height();
            var tot = $target.offset().top;
            var hot = $header2.offset().top;
            var header2Fixed = $header2.css('position') === 'fixed' ? true: false;
            if (header2Fixed) {
                deviation =  h2h + deviation;
            } else if (hot < tot) {
                deviation = 2 * h2h + deviation;
            }
        }

        return deviation;
    }

    function headerDeviation() {
        var $header = $('#header');
        var deviation = 0;

        if (getCurrentBreakPoint()!=='DESKTOP') {
            deviation = $header.length ? $header.height(): 0;
        }

        return deviation;
    }

    function scrollToTarget($target) {
        var scrollVal;
        var deviation = 0;

       deviation = deviation + header2Deviation($target) + headerDeviation();
       scrollVal = $target.offset().top - deviation;
       window.scrollTo(0, scrollVal);
    }

    function getCurrentBreakPoint() {
        var contentValue = window.getComputedStyle(
          document.querySelector('.solution-advanced-map-comp'),'::before'
        ).getPropertyValue('content');
        return contentValue.replace(/\"/g, '');
    }

    function updateThumbnailIconPosition($thumbnail, iLeft, iTop) {
        var ww = $(window).width();
        var wh = $(window).height();
        var thumbSize = $thumbnail.find('.icon-thumbnail-box').width();
        if (iLeft < 0) {
            iLeft = 0;
        } else if (iLeft > (ww - thumbSize)) {
            iLeft = ww - thumbSize;
        }

        if (iTop < 0) {
            iTop = 0;
        } else if (iTop > (wh - thumbSize)) {
            iTop = wh - thumbSize;
        }

        // $thumbnail.css("left", iLeft + 'px');
        $thumbnail.css("right", '18px');
        // $thumbnail.css("top", iTop + 'px');
        $thumbnail.css("top",  'calc(50% - 34px)');
    }

    function updateThumbnailPosition($comp) {
        var $thumbnail = $comp.find('.map-wrapper .thumbnail-wrapper');
        var $thumbImg = $comp.find('.map-wrapper .thumbnail-container');
        var wh = $(window).height();
        var ww = $(window).width();
        var tl = $thumbnail.position().left;
        var tt = $thumbnail.position().top;
        var sth = $thumbnail.height() / 2;
        var stw = $thumbnail.width() / 2;
        var positionClass = (tt + sth) < wh/2 ? 'img-bottom-' : 'img-top-';
        positionClass = positionClass + ((tl + stw) < ww/2 ? 'right' : 'left');
        $thumbImg.removeClass('img-bottom-left img-bottom-right img-top-left img-top-right');
        $thumbImg.addClass(positionClass);
    }

    function updateMarkerDetail($comp, $marker, $thumbMarker, index) {
        var $detailContainer = $comp.find('.solution-details');
        $thumbMarker.siblings().removeClass('active');
        $thumbMarker.addClass('active');
        $marker.siblings().removeClass('active');
        $marker.addClass('active');
        $detailContainer.find('.solution-detail.active').removeClass('active');
        $detailContainer.find('.solution-detail').eq(index).addClass('active');
        $(window).trigger('resize');
        if(getCurrentBreakPoint() !== 'DESKTOP') {
            scrollToTarget($comp);
        } else {
            scrollToTarget($comp.find('.solution-details-container'));
        }
    }

    function bindEvent($comp) {
        $comp.find('.map-container .marker').on('click', function() {
            var index = $(this).index();
            var $thumbMarker = $comp.find('.thumbnail-wrapper .marker').eq(index);
            updateMarkerDetail($comp, $(this), $thumbMarker, index);
        });

        $comp.find('.thumbnail-wrapper .marker').on('click', function() {
            var index = $(this).index();
            var $marker = $comp.find('.map-container .marker').eq(index);
            updateMarkerDetail($comp, $marker, $(this),index);
        });

        $comp.find('.map-wrapper .icon-thumbnail-box-mobile').on('click', function() {
            var $thumbnail = $(this).closest('.thumbnail-wrapper');
//            if($thumbnail.position().left !== initLeft ||$thumbnail.position().top !== initTop) return;

            if (getCurrentBreakPoint() !== 'DESKTOP') {
                scrollToTarget($comp);
            } else {
                $(this).next().toggleClass('active');
                updateThumbnailPosition($comp);
            }
        });

        $comp.find('.map-wrapper .thumbnail-container .icon-close').on('click', function() {
            $(this).parent().removeClass('active');
        });

        var initLeft, initTop, disX = 0, disY = 0, bodyTopVal = $(window).scrollTop();
        // 暂时去掉拖拽事件
        // $comp.find('.thumbnail-wrapper .icon-thumbnail-box').on('mousedown touchstart', function(e) {
        //     var $thumbnail = $(this).closest('.thumbnail-wrapper');
        //     var $target = e.type === 'mousedown'? e : e.originalEvent.targetTouches[0];
        //     initLeft = $thumbnail.position().left;
        //     initTop = $thumbnail.position().top;
        //     disX = $target.clientX - initLeft;
        //     disY = $target.clientY - initTop;

        //     if (e.type === 'touchstart') {
        //         var deviation = header2Deviation($comp);
        //         bodyTopVal = $(window).scrollTop();
        //         $('body').addClass('position-fixed');
        //         $('body').css("top", - (bodyTopVal + deviation));
        //         return;
        //     }

        //     $(document).on('mousemove.thumbnail', function (e2) {
        //         var iLeft = e2.clientX - disX;
        //         var iTop = e2.clientY - disY;
        //         updateThumbnailIconPosition($thumbnail, iLeft, iTop);
        //     });
    
        //     $(document).on('mouseup.thumbnail', function () {
        //         $(document).off('mouseup.thumbnail');
        //         $(document).off('mousemove.thumbnail');
        //         updateThumbnailPosition($comp);
        //     });
        // });

        $comp.find('.thumbnail-wrapper .icon-thumbnail-box, .thumbnail-wrapper .icon-thumbnail-box-mobile').on('touchmove', function (e2) {
            var iLeft,iTop;
            var $thumbnail = $(this).closest('.thumbnail-wrapper');
            iLeft = e2.originalEvent.changedTouches[0].clientX - disX;
            iTop = e2.originalEvent.changedTouches[0].clientY - disY;
            updateThumbnailIconPosition($thumbnail, iLeft, iTop);
        });

        $(document).on('touchend.thumbnail', function () {
            if (!$('body').hasClass('position-fixed')) return;
            $('body').removeClass('position-fixed');
            $('body').css('top', 'auto');
            window.scrollTo(0, bodyTopVal);
            updateThumbnailPosition($comp);
        });
    }

    function setOriginalAnimationPoint ($imgBox, $wrapper) {
        var width = $imgBox.width()
        var height = $imgBox.height()
        var $thumbnailBox = $wrapper.find('.icon-thumbnail-box')
        var offsetTop = $imgBox.offset().top
        var wst = $(window).scrollTop();
        $thumbnailBox.css('width', width)
        $thumbnailBox.css('height', height)
        $wrapper.css('top', -(wst - offsetTop) + 'px')
        $wrapper.css('right', '18px')
    }

    function updateFinalThumbnailPosition ($thumbnail) {
        var $thumbnailBox = $thumbnail.find('.icon-thumbnail-box')

        var iLeft = $(window).width() - $thumbnail.width() - 12;
        var iTop = $(window).height() * 0.2;
        $thumbnailBox.css('width', '128px')
        $thumbnailBox.css('height', '68px')
        updateThumbnailIconPosition($thumbnail, iLeft, iTop);
    }

    $('.solution-advanced-map-comp').each(function() {
        var $comp = $(this);
        bindEvent($comp);
        var prevWst = 0

        $(window).on('scroll',function() {
            var $imgBox = $comp.find('.map-wrapper .img-box');
            var wst = $(window).scrollTop();
            var $thumbnail = $comp.find('.map-wrapper .thumbnail-wrapper');
            var deviation = header2Deviation($comp) + headerDeviation();
            var direction = wst > prevWst ? 'down' : 'up'
            prevWst = wst
            if($('body').css('position') === 'fixed') return;
            if (($imgBox.offset().top + $imgBox.height() - deviation) < wst && ($comp.offset().top + $comp.height() - deviation) > wst) {
                if (!$thumbnail.hasClass('active')) {
                    console.log('scrollFromTop', direction, wst, prevWst)
                    // 根据滚动方向，加载不同动画
                    if (direction === 'down') {
                        setOriginalAnimationPoint($imgBox, $thumbnail)
                        $thumbnail.addClass('active');
                        setTimeout(function () {
                            updateFinalThumbnailPosition($thumbnail)
                        }, 0)
                        setTimeout(function () {
                            $thumbnail.addClass('hover')
                        }, 1000)
                    } else {
                        updateFinalThumbnailPosition($thumbnail)
                        $thumbnail.addClass('fade-out-transition')
                        setTimeout(function () {
                            $thumbnail.addClass('active')
                        }, 0)
                        setTimeout(function () {
                            $thumbnail.addClass('hover')
                        }, 200)
                    }
                }
                
            } else {
                if ($thumbnail.hasClass('active')) {
                    $thumbnail.removeClass('fade-out')
                    $thumbnail.addClass('fade')
                    $thumbnail.removeClass('fade-out-transition')
                    setTimeout(function () {
                        $thumbnail.removeClass('fade')
                        $thumbnail.removeClass('active');
                        if (direction !== 'down') {
                            setOriginalAnimationPoint($imgBox, $thumbnail)
                        }
                        $thumbnail.find('.thumbnail-container').removeClass('active');
                    }, 200)
                } else {
                    $thumbnail.removeClass('active');
                    // setOriginalAnimationPoint($imgBox, $thumbnail)
                    $thumbnail.find('.thumbnail-container').removeClass('active');
                }
                $thumbnail.removeClass('hover')
            }
        });

        $(window).on('resize',function() {
            var $thumbnail = $comp.find('.thumbnail-wrapper');
            if(!$thumbnail.hasClass('active')) return;
            var iLeft = $thumbnail.position().left;
            var iTop = $thumbnail.position().top;
            updateThumbnailIconPosition($thumbnail, iLeft, iTop);
        });
    });
})

$(document).ready(function() {
    initMultiTabsComp();
});
var initMultiTabsComp = function(){
    var breakpoint = getCurrentBreakpoint();
    var borderColor = $("body").css('background-color');
    var sWidth = $(".slick-slide").width()
    function bindEvent($comp) {
        $comp.find('.tabs-wrapper .tab-item .content').on('click', function() {
            var $tabItem = $(this).parent();
            var index = $tabItem.index();
            var $contentItem = $comp.find('.tabs-content-wrapper .content-detail-section').eq(index);

            $tabItem.addClass('active');
            $tabItem.siblings().removeClass('active');
            $contentItem.siblings().removeClass('active');
            $contentItem.addClass('active');
            $(this).trigger('multi-tabs-change');
            initBorderBottomColor($comp);
            if($(".slick-track").length){
                $.each($(".slick-track"), function(index){
                      var len = $(this).find(".slick-slide").length;
                      var wid = $(this).find(".slick-slide").width();
                      $(this).find(".slick-slide").css({
                        "width": sWidth
                      })
                      $(this).css({
                        "width":  sWidth * len
                     })
                   
              
                    // var len = $(this).find(".slick-slide").length;
                    // var wid = $(this).find(".slick-slide").width();
                    // var continerWidth = $(window).width()
                    // var cw=313
                    // console.log("widlen",$(window).width())
                    // $(this).css({
                    //     "width":  wid * len
                    // })
                    // if(continerWidth<=1680 && continerWidth>1280){
                    //     cw = 293
                    // } else if(continerWidth<=1280 && continerWidth>992){
                    //     cw = 250
                    // } else if(continerWidth>=1680){
                    //     cw = 313
                    // }
                    // $(this).find(".slick-slide").css({
                    //     "width": 313
                    // })
                })
            }
        });

        var timeout;
        $comp.find('.tabs-wrapper .pre-btn').on('click', function() {
            clearTimeout(timeout);
            timeout = setTimeout(function() {
                if (!$comp.find('.tabs-wrapper .pre-btn').hasClass('show')) return;
                var $tabs = $comp.find('.tabs-section');
                var num = $tabs.find('.tab-item').length;
                var tabW = $tabs[0].scrollWidth;
                var step = tabW / num;
                var tabX = $tabs.css("transform").replace(/[^0-9\-,]/g, '').split(',')[4];
                tabX = Math.round(tabX) + step;
                console.log(Math.round(tabX) + step)
                if (tabX > 0) tabX = 0;
                $tabs.css({ 'transform': 'translateX(' + Math.round(tabX) + 'px)' });
            }, 180);
        });

        $comp.find('.tabs-wrapper .next-btn').on('click', function() {
            if(!$(this).hasClass('show')) return;
            var $tabs = $comp.find('.tabs-section');
            var num = $tabs.find('.tab-item').length;
            var tabW = $tabs[0].scrollWidth;
            var step = tabW / num;
            var tabX = $tabs.css("transform").replace(/[^0-9\-,]/g,'').split(',')[4];
            var containerW = $comp.find('.tab-container').width();

            tabX = tabX - step;
            if (Math.abs(tabX) > (tabW - containerW)) tabX = containerW - tabW;
            $tabs.css({'transform':'translateX('+Math.round(tabX)+'px)'});
        });

        $comp.find('.tabs-section').on('transitionend', function() {
            initTabArrowBtn($comp);
        })
    }

    function initTabArrowBtn($comp) {
        var containerW = $comp.find('.tab-container').width();
        var $tabs = $comp.find('.tabs-section');
        var $preBtn = $comp.find('.tabs-wrapper .pre-btn');
        var $nextBtn = $comp.find('.tabs-wrapper .next-btn');
        var tabW = $tabs[0].scrollWidth;
        var tabX = $tabs.css("transform").replace(/[^0-9\-,]/g,'').split(',')[4];

        if (tabX == 0) {
            $preBtn.removeClass('show');
        } else {
            if(breakpoint === 'DESKTOP') {
                $preBtn.addClass('show');
            }
        }

        if ((Math.abs(tabX) + 1) >= Math.round(tabW - containerW)) {
            $nextBtn.removeClass('show');
        } else {
            if(breakpoint === 'DESKTOP') {
                $nextBtn.addClass('show');
            }
        }

        if(breakpoint === 'MOBILE') {
            $preBtn.removeClass('show');
            $nextBtn.removeClass('show');
        }
    }

    function initTabPosition($comp) {
        var tabW = 0;
        var $tabs = $comp.find('.tabs-section');
        var containerW = $comp.find('.tab-container').width();
        // ensure that section is there
        if(!$tabs.length) {
          return;
        }
        tabW = $tabs[0].scrollWidth;
        $tabs.css({'transform':'translateX(0)'});

        if (tabW > containerW) {
            setTimeout(function() {
                initTabArrowBtn($comp);
            }, 200);
        }
    }

    function initBorderBottomColor($comp) {
        var $activeTab = $comp.find('.tabs-wrapper .tab-container .tabs-section .tab-item.active');
        $activeTab.css('border-bottom-color',  borderColor);
    }
    $(".mult-mob-tabs-container-comp").each(function(){
        $.each($(this).find(".tabs-section li"), function(i,e){
            $(this).on("click", function(){
                var hrefUrl = $(".multi-link-" + $(this).attr("data-multi-tab")).attr("href")
                var hrefTarget = $(".multi-link-" + $(this).attr("data-multi-tab")).attr("target")
                setTimeout(function(){
                    window.open(hrefUrl, hrefTarget)
                }, 200)
                //$(".multi-link-" + $(this).attr("data-multi-tab")).trigger("click")
            })
        })
    })
    $('.mult-tabs-container-comp').each(function() {
        var $comp = $(this);
        bindEvent($comp);
        initTabPosition($comp);
        initBorderBottomColor($comp);

        var resizeTimer;
        $(window).on('resize', function() {
            if (resizeTimer) {
                clearTimeout(resizeTimer);
            }

            resizeTimer = setTimeout(function() {
                breakpoint = getCurrentBreakpoint();
                initTabPosition($comp);
                initBorderBottomColor($comp);
            }, 50);
        })
    });
};

$(document).ready(function() {
    initTextOverImageComp();
});
var initTextOverImageComp = function() {
    var currentBreakPoint = getCurrentBreakPoint();
    function updateImageSrc($comp, breakPoint) {
        var $urlData = $comp.find('.img-box');
        var $desktopList = $comp.find('.text-list.desktop');
        var $mobileList = $comp.find('.text-list.mobile');
        var path;

        if (breakPoint === 'MOBILE') {
            path = $urlData.attr('data-mobile-img');
            $desktopList.removeClass('active');
            $mobileList.addClass('active');
        } else {
            path = $urlData.attr('data-desktop-img');
            $desktopList.addClass('active');
            $mobileList.removeClass('active');
        }

        $comp.find('.bg-img').attr('src',path);
    }

    function updateCTAWidth($comp) {
        $comp.find('.cta').each(function() {
            var $parent = $(this).closest('.text-container');
            var titleWidth = $parent.find('.title')[0].style.width;
            var descriptionWidth =  $parent.find('.description')[0].style.width;
            var maxWidth = titleWidth > descriptionWidth ? titleWidth : descriptionWidth;
            $(this).css('max-width', maxWidth);
        });
    }

    $('.text-over-image-comp').each(function() {
        var $comp = $(this);
        updateImageSrc($comp, currentBreakPoint);
        updateCTAWidth($comp);
    });

    $(window).on('resize',function() {
        setTimeout(function() {
            var newBreakPoint = getCurrentBreakPoint();
            if (newBreakPoint !== currentBreakPoint) {
                currentBreakPoint = newBreakPoint;
                $('.text-over-image-comp').each(function() {
                    var $comp = $(this);
                    updateImageSrc($comp, newBreakPoint);
                });
            }
        },0)
    });
};

$(document).ready(function () {
    var detailJson,currentDetailJson;
    function updateSearchVal($comp) {
        var $searchInput = $comp.find('.search-section-wrapper .map-search-input');
        var newVal = $comp.find('.search-options-container').hasClass('active') ? $comp.find('.search-option.active .main-text').attr('data-val'): $searchInput.attr('data-input-val');
        $comp.find('.search-section-wrapper .map-search-input').val(newVal);
        updateSearchBtnATVal($comp, newVal);
    }

    function updateSearchValAttr($comp) {
        var $searchInput = $comp.find('.search-section-wrapper .map-search-input');
        var newVal = $comp.find('.search-options-container').hasClass('active') ? $comp.find('.search-option.active .main-text').attr('data-val'): $searchInput.val();
        $comp.find('.search-section-wrapper .map-search-input').attr('data-input-val', newVal);
        updateSearchBtnATVal($comp, newVal);
    }

    function updateSearchBtnATVal($comp, newKeyWord) {
        var newVal = 'installer_list::search::' + newKeyWord;
        $comp.find('.search-section-wrapper .map-search-btn').attr('data-at-module', newVal);
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

    function updateSearchOptionStatus($comp, type, $options, $activeOption) {
        $activeOption.removeClass('active');
        var $list = $comp.find('.search-options');
        if (type === 'prev' && $activeOption.index() !== 0) {
            $activeOption.prev().addClass('active');
            searchOptionListScroll($list, $activeOption.prev());
        } else if (type === 'next' && $activeOption.index() !== $options.length) {
            $activeOption.next().addClass('active');
            searchOptionListScroll($list, $activeOption.next());
        }

        updateSearchVal($comp);
    }

    function OptionMainText(text, matchText) {
        var matchTextIndex = 0;
        var mainText = '';
        for (var i = 0; i < text.length; i++){
            if (matchText.charAt(matchTextIndex) == text.charAt(i)) {
                mainText = mainText + '<span class="result-submatch">'+ matchText.charAt(matchTextIndex) +'</span>';
                matchTextIndex ++;
            } else {
                mainText = mainText + text.charAt(i);
            }
        }
         return mainText;
    }

    function defaultOptionHtml(info, type, searchVal) {
        var mainTextHtml, subTextHtml;
        var atModule = 'installer_list::keywords_list::';
        var dataState = 'provinceShort' in info ? info.provinceShort:'';
        if (type === 'level') {
            if (typeof info.cityCode != "undefined"){
                mainTextHtml = '<div class="main-text" data-val="'+ info.city +'">'+ OptionMainText(info.city, searchVal) +'</div>';
                subTextHtml = '<div class="sub-text">' + info.provinceShort + ','+ info.countryName + '</div>';
                atModule = atModule + info.city + '_' + info.provinceShort + '_' + info.countryName;
            } else {
                mainTextHtml = '<div class="main-text" data-val="'+ info.province +'">'+ OptionMainText(info.province, searchVal) +'</div>';
                subTextHtml = '<div class="sub-text">' + info.countryName + '</div>';
                atModule = atModule + info.province + '_' + info.countryName;
            }

        } else if (type === 'postcode') {
            mainTextHtml = '<div class="main-text" data-val="'+ info.cityCode +'">'+ OptionMainText(info.cityCode, searchVal) +'</div>';
            subTextHtml = '<div class="sub-text">' + info.city + ', ' + info.provinceShort + ', ' + info.countryName + '</div>';
            atModule = atModule + info.city + '_' + info.provinceShort + '_' + info.cityCode + '_' + info.countryName;
        }

        return {mainTextHtml: mainTextHtml, subTextHtml: subTextHtml, atModule: atModule, dataState: dataState, dataIsRegion: 'false'};
    }

    function cppOptionHtml(info, searchVal) {
        var mainTextHtml, subTextHtml;
        var atModule = 'installer_list::keywords_list::';
        var regionExist = (info.regionCode !== info.countryCode) || (info.regionCode === 'RU');
        var stateCode = regionExist? info.regionCode : info.provinceShort;
        var state = regionExist? (info.regionCode === 'RU' ? info.province : info.region) : info.province;
        var dataState = state;
        var dataIsRegion = regionExist? 'true':'false';

        if (typeof info.city != "undefined"){
            mainTextHtml = '<div class="main-text" data-val="'+ info.city +'">'+ OptionMainText(info.city, searchVal) +'</div>';
            subTextHtml = '<div class="sub-text">' + dataState + ','+ info.countryName + '</div>';
            atModule = atModule + info.city + '_' + dataState + '_' + info.countryName;
        } else {
            mainTextHtml = '<div class="main-text" data-val="'+ state +'">'+ OptionMainText(state, searchVal) +'</div>';
            subTextHtml = '<div class="sub-text">' + info.countryName + '</div>';
            atModule = atModule + state + '_' + info.countryName;
        }
        return {mainTextHtml: mainTextHtml, subTextHtml: subTextHtml, atModule: atModule, dataState: dataState, dataIsRegion:dataIsRegion};
    }

    function searchOptionHtml(index, info, type, searchVal, compType) {
        var liClass = index ? 'search-option at-action':'search-option active at-action';
        var html = $('<li>',{class: liClass});
        var mainTextHtml,subTextHtml;
        var atModule = 'installer_list::keywords_list::';
        var htmlObj;

        var dataCity = 'city' in info ? info.city:'';
        var dataCityCode = 'cityCode' in info ? info.cityCode:'';
        html.attr('data-city',dataCity);
        html.attr('data-postcode',dataCityCode);

        if (compType === 'cpp-search') {
            if (type !== 'level') return '';

            htmlObj = cppOptionHtml(info, searchVal);
            html.attr('data-state',htmlObj.dataState);
            html.attr('data-is-region',htmlObj.dataIsRegion);
        } else {
            htmlObj = defaultOptionHtml(info, type, searchVal);
            html.attr('data-state',htmlObj.dataState);
            html.attr('data-is-region',htmlObj.dataIsRegion);
        }

        html.attr('data-at-module', htmlObj.atModule);
        html.append(htmlObj.mainTextHtml).append(htmlObj.subTextHtml);
        return html;
    }

    function renderSearchOptions($comp, data, searchVal) {
        var $optionContainer = $comp.find('.search-options');
        $optionContainer.empty();
        var compType = $comp.attr('data-type');
        var type = data.type;
        $.each(data.info, function(index , info) {
            var html = searchOptionHtml(index, info, type, searchVal, compType);
            $optionContainer.append(html);
        })

        if ($comp.find('.search-option').length) {
            $optionContainer.closest('.search-options-container').addClass('active');
            $comp.find('.map-search-box').addClass('options-expand');
        } else {
            $optionContainer.closest('.search-options-container').removeClass('active');
            $comp.find('.map-search-box').removeClass('options-expand');
        }
    }

    var map;
    var geocoder, mapBoundary;
    var markers = [];
    var imgURL = {"normal":{
                    url:"/etc/clientlibs/it/resources/icons/icon-map-marker.svg",
                    scaledSize: {height: 50, width: 44}},
                  "checked":{
                      url:"/etc/clientlibs/it/resources/icons/icon-map-marker-checked.svg",
                      scaledSize: {height: 64, width: 56}}
                };
    function initMap() {
        try {
            mapBoundary = new google.maps.LatLngBounds();
            markers.forEach(function(marker) {
                marker.setMap(null);
            });
            markers.length = 0;
            if ($('#googlemap').hasClass('initialized')) return;
            geocoder = new google.maps.Geocoder();
            map = new google.maps.Map(document.getElementById("googlemap"), {
                zoom: 4,
                center: { lat: -25, lng: 115 }
            });
            $('#googlemap').addClass('initialized');
        } catch(e) {
            console.error( e + ':map api request error');
        }
    }

    function resetMarkerIcons() {
        for (var i = 0; i < markers.length; i++) {
            markers[i].setIcon(imgURL.normal);
        }
    }

    function renderMapMark(label,address) {
        try {
            geocoder.geocode({ 'address': address}, function(results, status) {
                if (status == 'OK') {
                    var icon = imgURL.normal;
                    label = label + '';
                    var marker = new google.maps.Marker({
                        map: map,
                        position: results[0].geometry.location,
                        label: {
                            color: "#fff",
                            text: label,
                            fontSize: "12px",
                        },
                        icon: icon,
                        optimized: false
                    });

                    mapBoundary.extend(marker.position);
                    map.fitBounds(mapBoundary);
                    marker.addListener("click", function() {
                        resetMarkerIcons();
                        this.setIcon(imgURL.checked);
                        var labelIndex = parseInt(this.label.text);
                        var $mainContainer = $('.detail-container');
                        var $scrollToContainer = $mainContainer.find('.detail-result').eq(labelIndex - 1);
                        map.setCenter(marker.position);
                        if ($scrollToContainer.length) {
                            $mainContainer.animate({
                                scrollTop: $scrollToContainer.offset().top - $mainContainer.offset().top + $mainContainer.scrollTop()
                            }, 400);
                        }

                        var dataModule = $scrollToContainer.attr('data-at-module');
                        $scrollToContainer.attr('data-at-module', dataModule + '::map');
                        $scrollToContainer.trigger('click');
                        $scrollToContainer.attr('data-at-module', dataModule);
                    });

                    markers.push(marker);
                } else {
                    console.log(label + ':'+'Geocode was not successful for the following reason: ' + status);
                }
            });
        } catch(e) {
            console.error( e + ':map api request error');
        }
    }

    function detailOptionHtml(detail,index) {
        var title = index + '. ' + detail.accountName;
        var html = $('<li>',{class: 'detail-result at-action'});
        var infoContainer = $('<div>',{class: 'info-container'});
        var logoBox = '';
        var placeName = $('<div>',{class: 'info place-name', text: title});
        var location = $('<div>',{class: 'info location', text: detail.address});
        var openTime = '';
        var website ='';
        var phone = '';
        var email = '';
        var shareSection = '';
        var imgSection = '';
        var direction = $('<div>',{class: 'info direction'});
        var moreBtn = '<div class="action-btn more at-action" data-at-module="installer_list::'+ detail.accountName +'::more">' + Granite.I18n.get("More") + '</div>';
        var lessBtn = '<div class="action-btn less">'+ Granite.I18n.get("Less") + '</div>';

        html = html.attr('data-at-module','installer_list::' + detail.accountName);
        if (detail.logo) {
            logoBox = $('<div>',{class: 'info logo-box'});
            logoBox.css('backgroundImage','url('+ detail.logo +')');
        }

        if (detail.openTime && detail.openTime.length > 0) {
            openTime = $('<div>',{class: 'info open-time'});
            detail.openTime.forEach(function(time) {
                openTime.append($('<div>',{class: 'time',text: time}));
            })
        }

        if (detail.website) {
            website  = $('<div>',{class: 'info website'});
            var websiteItem = $('<a>',{class:'', href: detail.website, text: detail.website,target:'_blank'});
            website.append(websiteItem);
            website.on("click", function (e) {
                e.stopPropagation();
                atModel.doAtEvent('installer_list::'+detail.accountName+'::website', 'navigation', e);
            });
        }

        if (detail.tel) {
            phone = $('<div>',{class: 'info phone', text: detail.tel});
        }

        if (detail.email) {
            email = $('<div>',{class: 'info email', text: detail.email});
        }

        if (detail.share && !$.isEmptyObject(detail.share)) {
            shareSection = $('<div>',{class: 'info share-section'});
            Object.getOwnPropertyNames(detail.share).forEach(function(key){
                var c = key + '-share item at-action';
                var shareItem = $('<a>',{class: c, href: detail.share[key],target:'_blank'});
                shareItem.attr('data-at-module','installer_list::' + detail.accountName + '::'+key);
                shareSection.append(shareItem);
            })
        }

        if (detail.img) {
            imgSection = $('<div>',{class: 'info img-section'});
            var imgbox = $('<div>',{class: 'img-box'}).css('backgroundImage','url('+ detail.img +')');
            imgSection.append(imgbox);
        }

        var i18nDirection = Granite.I18n.get("Direction");
        var directionItem = $('<a>',{class:"at-action" ,href: "https://www.google.com/maps?q="+ detail.address,text: i18nDirection, target:'_blank'});
        directionItem.attr('data-at-module','installer_list::'+ detail.accountName +'::direction');
        direction.append(directionItem);

        infoContainer.append(logoBox).append(placeName).append(location)
            .append(openTime).append(website).append(phone).append(email)
            .append(shareSection).append(imgSection).append(direction)
            .append(moreBtn).append(lessBtn);

        return html.append(infoContainer);
    }

    function cppDetailOptionHtml(detail, index) {
        var title = index + '. ' + detail.accountName;
        var html = $('<li>',{class: 'detail-result expand-detail at-action'});
        var infoContainer = $('<div>',{class: 'info-container'});
        var logoBox = '';
        var placeName = $('<div>',{class: 'info place-name', text: title});
        var description = '';
        var location = $('<div>',{class: 'info location', text: detail.address});
        var website = '';
        var phone = '';
        var email = '';

        html = html.attr('data-at-module','installer_list::' + detail.accountName);
        if (detail.logo) {
            logoBox = $('<div>',{class: 'info logo-box'});
            logoBox.css('backgroundImage','url('+ detail.logo +')');
        }

        if (detail.description) {
            description = $('<div>',{class: 'info desc', text: detail.description});
        }

        if (detail.website) {
            website  = $('<div>',{class: 'info website'});
            var websiteItem = $('<a>',{class:'', href: detail.website, text: detail.website,target:'_blank'});
            website.append(websiteItem);
            website.on("click", function (e) {
                e.stopPropagation();
                atModel.doAtEvent('installer_list::'+detail.accountName+'::website', 'navigation', e);
            });
        }

        if (detail.tel) {
            phone = $('<div>',{class: 'info phone', text: detail.tel});
        }

        if (detail.email) {
            email = $('<div>',{class: 'info email', text: detail.email});
        }

        infoContainer.append(logoBox).append(placeName).append(description).append(website)
            .append(location).append(phone).append(email);

        return html.append(infoContainer);
    }

    function renderDetailInfo($comp, data) {
        var $innerNoResult = $comp.find('.no-result.inner');
        var $outerNoResult = $comp.find('.no-result.outer');
        var $detailContainer = $comp.find('.detail-results');
        var $viewMoreBtn = $comp.find('.view-more-btn');
        var isCompTypeCpp = $comp.attr('data-type') === 'cpp-search';

        $detailContainer.find('.detail-result').remove();
        if (data.type === 'noResult') {
            $comp.find('.detail-map-container').hide();
            $outerNoResult.show();
            return;
        }

        $comp.find('.detail-map-container').show();
        $outerNoResult.hide();
        if (data.type === 'recommendResult') {
            $innerNoResult.show();
        } else {
            $innerNoResult.hide();
        }

        if (data.detail.length > 10) {
            $viewMoreBtn.show();
        } else {
            $viewMoreBtn.hide();
        }

        initMap();

        $.each(data.detail, function(i , detail) {
            if (i === 10) return false;
            var html = isCompTypeCpp ? cppDetailOptionHtml(detail, i+1) : detailOptionHtml(detail,i+1);
            $detailContainer.append(html);
            renderMapMark(i+1, detail.address);
        })
    }

    function updateCategoryFilter($comp, data) {
        if ($comp.find('.filter-section').length) {
            $comp.find('.filter-section .filter-item').removeClass('active enable');
            if (data.partnerCategory) {
                data.partnerCategory.forEach(function(value) {
                    $comp.find('.filter-section [data-tag="'+ value +'"]').addClass('enable');
                });

                if($comp.find('.filter-section .filter-item.enable').length) {
                    $comp.find('.filter-section').show();
                    $comp.find('.filter-section .filter-item.enable').eq(0).addClass('active');
                } else {
                    $comp.find('.filter-section').hide();
                }
            }
        }
    }

    function filterData($comp) {
        var $filter = $comp.find('.filter-section .filter-item.enable.active');
        var searchType = $comp.attr('data-type');
        if (searchType !== "cpp-search" && !$filter.length) {
          return detailJson;
        } else {
          if (!detailJson.partnerCategory) {
            return detailJson;
          }
          var matched = false;
          $comp.find('.filter-section li').each(function(index){
            if (detailJson.partnerCategory.length > 0 && detailJson.partnerCategory.includes($(this).attr('data-tag'))) {
              matched = true;
            }
          })
          if (detailJson.partnerCategory.length == 0 || !matched) {
            detailJson.type = "noResult";
            return detailJson;
          }
        }

        var filter = $filter.attr('data-tag');
        var newDetail = detailJson.detail.filter(function(detail) {
            if (!detail.subType) return false;
            return detail.subType.indexOf(filter) > -1;
        });

        return $.extend({},detailJson,{detail:newDetail});
    }

    function applySearch($comp, searchType) {
        var data = {};
        data.searchType = searchType;
        data.compType = $comp.attr('data-type');
        if (searchType === 'fuzzy') {
            data.searchVal = $comp.find('.search-section-wrapper .map-search-input').val().trim();
        } else if (searchType === 'precise') {
            var $activeOption = $comp.find('.search-options .search-option.active');
            data.postcode = $activeOption.attr('data-postcode');
            data.province = $activeOption.attr('data-state');
            data.city = $activeOption.attr('data-city');
            data.isRegion = $activeOption.attr('data-is-region');
        }

        $.ajax({
            type: 'POST',
            url: '/bin/hikvision/allinoneSearch.json',
            data: data,
            dataType: 'json'
        }).done(function (result) {
            detailJson = result;
            updateCategoryFilter($comp, detailJson);
            currentDetailJson = filterData($comp);
            renderDetailInfo($comp,currentDetailJson);
        });
    }

    function bindEvent($comp) {
        $comp.find('.search-section-wrapper .map-search-btn').on('click', function() {
            var searchType = $comp.find('.search-options .search-option').length ? 'precise' : 'fuzzy';
            applySearch($comp, searchType);
        });

        $comp.find('.search-section-wrapper .search-empty').on('mousedown', function() {
            var $searchInput = $comp.find('.search-section-wrapper .map-search-input');
            $searchInput.val('');
            $searchInput.attr('data-input-val','');
            $comp.find('.search-options-container').removeClass('active');
            $comp.find('.map-search-box').removeClass('options-expand');
        });

        $comp.find('.search-section-wrapper .map-search-input').on('focus', function() {
            var searchVal = $(this).val().trim();
            var $options = $comp.find('.search-section-wrapper .search-option');
            if (searchVal && searchVal.length > 1 && $options.length) {
                $comp.find('.search-options-container').addClass('active');
                $comp.find('.map-search-box').addClass('options-expand');
            }
        });

        $comp.find('.search-section-wrapper .map-search-input').on('blur', function() {
            if($comp.find('.search-options .search-option').length) {
                $(this).find('.search-option').removeClass('active');
                $(this).find('.search-option').first().addClass('active');
            }
            updateSearchValAttr($comp);
            updateSearchVal($comp);
            $comp.find('.search-options-container').removeClass('active');
            $comp.find('.map-search-box').removeClass('options-expand');
        });

        $comp.find('.search-section-wrapper .map-search-input').on('keyup', function(e) {
            if (e.keyCode === 13) { //enter
                updateSearchValAttr($comp);
                updateSearchVal($comp);
                if ($comp.find('.search-options-container').hasClass('active')) {
                    $comp.find('.search-options-container .search-option.active').trigger('click');
                    $comp.find('.search-section-wrapper .map-search-input').trigger('blur');
                } else {
                    $comp.find('.search-section-wrapper .map-search-btn').trigger('click');
                }
            }

            if (!$comp.find('.search-options-container').hasClass('active')) return;

            var $options = $comp.find('.search-options .search-option');
            var $activeOption = $comp.find('.search-options .search-option.active');

            if (e.keyCode === 38 ) { //top arrow
                if ($activeOption.index() === 0) return;

                updateSearchOptionStatus($comp, "prev", $options, $activeOption);
            }

            if (e.keyCode === 40 ) { //down arrow
                if ($activeOption.index() === $options.length - 1) return;

                updateSearchOptionStatus($comp, "next", $options, $activeOption);
            }
        });

        var inputTimer;
        $comp.find('.search-section-wrapper .map-search-input').on('input propertychange', function() {
            if (inputTimer) {
                clearTimeout(inputTimer);
            }
            inputTimer = setTimeout(function() {
                var searchVal = $comp.find('.search-section-wrapper .map-search-input').val().trim();
                $comp.find('.search-section-wrapper .map-search-input').attr('data-input-val', searchVal);
                updateSearchBtnATVal($comp, searchVal);
                if (searchVal.length < 2) {
                    $comp.find('.search-options-container').removeClass('active');
                    $comp.find('.map-search-box').removeClass('options-expand');
                    return;
                }

                var countryCode = $comp.attr('data-country-code') ? $comp.attr('data-country-code').split(';'): '';

                var suggest = globalPcd.regionSuggest({ "countryCode": countryCode, "value":searchVal});
                var regPos = /^\d+$/;
                var type = regPos.test(searchVal) ? "postcode" : "level";
                var searchData = {"type":type, "info":suggest};
                renderSearchOptions($comp, searchData, searchVal);
            }, 300);
        });

        $comp.on('mouseover','.search-option', function() {
            $(this).siblings().removeClass('active');
            $(this).addClass('active');
            updateSearchVal($comp);
        });

        $comp.on('mousedown','.search-option', function() {
            $(this).trigger('click');
        });

        $comp.on('click','.search-option', function(e) {
            var searchVal = $(this).find('.main-text').attr('data-val');
            $comp.find('.search-section-wrapper .map-search-input').attr('data-input-val', searchVal);
            applySearch($comp, 'precise');

            var title = atModel.getTitle(e.currentTarget);
            atModel.doAtEvent(title, 'action', e);
        });

        $comp.on('mouseleave','.search-options', function() {
            $(this).find('.search-option').removeClass('active');
            $(this).find('.search-option').first().addClass('active');
            $(this).get(0).scrollTop = 0;
            updateSearchVal($comp);
        });

        $comp.find('.filter-section .filter-item').on('click', function() {
            if($(this).hasClass('active')) return;
            $(this).addClass('active');
            $(this).siblings().removeClass('active');
            currentDetailJson = filterData($comp);
            renderDetailInfo($comp, currentDetailJson);
        });

        $comp.on('click','.action-btn', function(e) {
            e.stopPropagation();
            $(this).closest('.detail-result').toggleClass('expand-detail');
            if($(this).hasClass('more')) {
                var title = atModel.getTitle(e.currentTarget);
                atModel.doAtEvent(title, 'action', e);
            }
        });

        $comp.on('click', '.detail-result', function(e) {
            var length = $(this).index();
            markers.forEach(function(marker) {
                if(marker.label.text == length) {
                    resetMarkerIcons();
                    marker.setIcon(imgURL.checked);
                    map.setCenter(marker.position);
                    return false;
                }
            });

            var title = atModel.getTitle(e.currentTarget);
            atModel.doAtEvent(title, 'action', e);
        });

        $comp.on('click', '.detail-result a', function(e) {
            e.stopPropagation();

            var title = atModel.getTitle(e.currentTarget);
            atModel.doAtEvent(title, 'action', e);
        });

        $comp.on('click', '.view-more-btn', function() {
            var $detailContainer = $comp.find('.detail-results');
            var $currentShowResult = $comp.find('.detail-result');
            var limit = currentDetailJson.detail.length > ($currentShowResult.length + 10) ? $currentShowResult.length + 10 : currentDetailJson.detail.length;
            for (var i = $currentShowResult.length; i < limit; i++) {
                renderMapMark(i+1, currentDetailJson.detail[i].address);

                var isCompTypeCpp = $comp.attr('data-type') === 'cpp-search';
                var html = isCompTypeCpp ? cppDetailOptionHtml(currentDetailJson.detail[i], i+1) : detailOptionHtml(currentDetailJson.detail[i],i+1);
                $detailContainer.append(html);
            }

            if (limit === currentDetailJson.detail.length) $(this).hide();
        });
    }

    $('.all-in-one-comp').each(function() {
        bindEvent($(this));
    });
});
var filterSearch = (function (document, $) {
    var search = {};
    var $searchWrapper = $(".new-filter-search-wrapper");
    var $searchInput = $searchWrapper.find(".filter-search-input");
    var $resetButton = $searchWrapper.find(".filter-search-reset");
    var $searchButton = $searchWrapper.find(".filter-search-button");
    var $moreButton = $searchWrapper.find(".filter-search-more");

    /**
     * Search Listener
     * @param callback
     * @param config {isAjax,path,data,callback,placeholder,atEvent}
     */
    search.addSearchListener = function (config) {
        $searchButton.unbind("click").on('click', function (e) {
            e.preventDefault();
            doSearch(config);
        });

        $searchWrapper.unbind("keyup").on('keyup', '.filter-search-input', function (e) {
            if (e.keyCode === 13) {
                e.preventDefault();
                doSearch(config);
            }
        });
        if (!isNull(config.placeholder)) {
            $searchInput.attr("placeholder", Granite.I18n.get(config.placeholder));
        } else {
            $searchInput.attr("placeholder", Granite.I18n.get("Search"));
        }
    };

    function doSearch(config) {
        if (config) {
            if (config.isAjax && config.path) {
                var requestData = config.data;
                requestData.keyword = $searchInput.val();
                if (!isNull(requestData.keyword)) {
                    $.ajax({
                        url: config.path,
                        data: requestData,
                        dataType: 'json',
                        type: 'get',
                        contentType: 'application/json',
                        success: function (data) {
                            if (checkResultSuccess(data)) {
                                if (config.callback) {
                                    data.keyword = $searchInput.val();
                                    config.callback(data);
                                }
                            }
                        },
                        error: function (error) {
                            console.log(error.responseText);
                        },
                        complete: function () {
                            // for at event
                            var module = config.atEvent.module + atModel.atSpliter + requestData.keyword;
                            module = module + atModel.atSpliter + window.location.href;
                            atModel.doAtEvent(module, config.atEvent.action, event);
                        }
                    });
                } else{
                    if (config.callback) {
                        config.callback(requestData);
                    }
                }
            } else if (config.callback) {
                config.callback(requestData);
            }
        }
    }

    /**
     * Reset Listener
     * @param config {showReset, callback}
     */
    search.addResetListener = function (config) {
        $resetButton.on('click', function (e) {
            search.emptySearchInput();
            if (config.callback) {
                config.callback();
            }
        });
    };

    /**
     * More Listener
     * @param config {showMore, callback}
     */
    search.addMoreListener = function (config) {
        $moreButton.on('click', function (e) {
            if (config.callback) {
                config.callback();
            }
        });
    };

    search.emptySearchInput = function () {
        $searchInput.val("");
    };

    search.updateMoreButtonStatus = function (active) {
        if (active) {
            $moreButton.addClass("active");
        } else {
            $moreButton.removeClass("active");
        }
    };

    return search;
})(document, $);

$(document).ready(function () {
  function showErrorTip ($error, message) {
    $error.empty()
    $error.html(message)
    $error.show()
  }

  // 检查用户输入
  function checkSerialNumberIllegal (number) {
    var reg = /^[a-z0-9]{6,9}$/i
    return !reg.test(number)
  }

  // 跳出提示弹窗
  function showToast () {
    var $body = $('body')
    var html = '<div class="firmware-update-query-toast">' +
      '<img src="/etc/clientlibs/it/resources/icons/tip-icon-yellow.png" alt="">' +
      '<span>' + Granite.I18n.get('Only support to query less than 100 items once') + '.</span>' +
    '</div>'
    $body.append(html)
    var $toast = $body.find('.firmware-update-query-toast')
    setTimeout(function () {
      $toast.remove()
    }, 3000)
  }

  function checkDataUnavailable (item) {
    // 有物料号，但是没有下载链接 => 技术支持
    // 没有物料号 => no firmware
    return item.productModel && !item.downloadUrl
  }

  function checkDateAvailable (time) {
    var earliestDate = 210626
    // 这里有两种情况： 1. 数据更新时间晚于6.26，正常显示； 2. 数据更新时间遭遇6.26，显示空状态并提示联系当地开发支持
    // 后端的日期格式 YYMMDD, etc: 210825
    return Number(time) < earliestDate
  }

  // 渲染firmware list
  function renderList ($wrapper, list, isBatch) {
    // var list = data.data
    var $tableBody = $wrapper.find('.list-table .table-body')
    var $mobileTableBody = $wrapper.find('.list-table-mobile')
    $tableBody.empty()
    $mobileTableBody.empty()
    function getFileName (item) {
      if (checkDataUnavailable(item)) {
        return Granite.I18n.get('No firmware available. Please contact local technical support team.')
      }
      if (!item.productModel) {
        // no firmware available，please contact local technical support team
        return Granite.I18n.get('No firmware available. Only products need to be migrated to Hik-Connect can be searched on the page.')
      }
      return item.name || ''
    }

    // function getMD5 (item) {
    //   if (checkDataUnavailable(item)) {
    //     return ''
    //   }
    //   return item.md5 || ''
    // }
    list.forEach(function (item, index) {
      var module =  'firmware_query' + atModel.atSpliter + item.productModel+atModel.atSpliter +item.name+ atModel.atSpliter + $('#hiddns-serial_number').val() + atModel.atSpliter + window.location.href;
      atModel.doAtEvent(module, 'action', event);
      $tableBody.append("<div class='table-row'>" +
          "<div class='table-cell table-cell-short'>" + (item.productModel || '') + "</div>" +
          "<div class='table-cell table-cell-long'>" + getFileName(item) + "</div>" +
          // "<div class='table-cell'>" + getMD5(item) + "</div>" +
          "<div class='table-cell'>" +
              ((checkDataUnavailable(item) || !item.downloadUrl) ? "" 
                : "<a class='download-icon' data-index=" + index + " data-toggle='modal' data-title=" + item.fileName + " data-link=" + item.downloadUrl + " data-title='Firmware_V5.7.0_210913' href='#download-agreement'><img class='download-img' src='/etc/clientlibs/it/resources/icons/icon-firmware-download-red.svg' alt=''></a>") +
          "</div>" +
      "</div>")
       var showImageWrap = item.name?"<img class='download-img' src='/etc/clientlibs/it/resources/icons/icon-firmware-download-red.svg' alt=''>" : ''
      $mobileTableBody.append("<div class='model-name'>" + (item.productModel || '') + "</div>" +
      "<div class='list-item-box'>" +
           "<div class='item-entry'>" +
                "<div class='field-name'>Firmware</div>" +
                "<div class='field-value'>" + (item.name?item.name: Granite.I18n.get('No firmware available. Please contact local technical support team.'))  + "</div>" +
           "</div>" +
          //  "<div class='item-entry'>" +
          //       "<div class='field-name'>MD5</div>" +
          //       "<div class='field-value'>" + (item.md5 || '') + "</div>" +
          //  "</div>" +
            "<a class='download-icon' data-index=" + index + " data-toggle='modal' data-title=" + item.name + " data-link=" + item.downloadUrl + " data-title='Firmware_V5.7.0_210913' href='#download-agreement'>"+showImageWrap+"</a>" +
      "</div>")

      $('a.download-icon[data-index=' + index + ']').on('click', function (event) {
        // 给modal的agree按钮挂载link
        $('.download-agreement-wrapper .modal-content footer .agree').attr('href', item.downloadUrl);
        $('.download-agreement-wrapper .modal-content footer .agree').attr('data-href', item.downloadUrl);
        console.log('on click?',$('.download-agreement-wrapper .modal-content footer .agree'), item.downloadUrl)

          // for at event
          var module = "firmware_query::download::" + item.fileName + atModel.atSpliter + window.location.href;
          atModel.doAtEvent(module, 'action', event);
      })
      $wrapper.show()
    })
  }

    function getMD5 (item) {
        if (item.updateTime && checkDateAvailable(item.updateTime)) {
            return ''
        }
        return item.md5 || ''
    }

    var valueEnum = {
        number: 'number',
        batch: 'batch'
    };
    function requestAt(queryType, serial, result, event) {
        if(result.code === 200) {
            var chapter1 = "firmware_query";
            var chapter2;
            var module;
            if (queryType === valueEnum.number) {
                var chapter3 = "single";
                if (result.data && result.data.length > 0) {
                    if (result.data[0].length > 0) {
                        chapter2 = "affected_with_firmware";
                    } else {
                        chapter2 = "affected_without_firmware";
                    }
                } else if (result.data && result.data.length === 0) {
                    chapter2 = "no_affected";
                } else {
                    return;
                }
                // module = chapter1 + atModel.atSpliter
                //     + chapter2 + atModel.atSpliter
                //     + chapter3 + atModel.atSpliter
                //     + serial + atModel.atSpliter + window.location.href;
              //  atModel.doAtEvent(module, 'action', event);
      
            } else if (queryType === valueEnum.batch) {
                var chapter3 = "batch";
                result.data.forEach(function (item, index) {
                    if (item.fileName) {
                        if (getMD5(item).length > 0) {
                            chapter2 = "affected_with_firmware";
                        } else {
                            chapter2 = "affected_without_firmware";
                        }
                    } else {
                        chapter2 = "no_affected";
                    }
                    module = chapter1 + atModel.atSpliter
                        + chapter2 + atModel.atSpliter
                        + chapter3 + atModel.atSpliter
                        + item.serialNumber + atModel.atSpliter + window.location.href;
                    atModel.doAtEvent(module, 'action', event);
                });
            }
        }
    }

    /**
     * refresh validate code
     */
    function refreshValidateCode(apiUrl) {

        var src = apiUrl + "?k=" + new Date().getTime();
        $.ajax({
            url: src,
            type: 'GET',
            success: function(result) {
                if (result.code === 200 && result.data) {
                    $(".verification-code-img").attr("src", result.data.image);
                    $.cookie("VALIDATE_CODE", result.data.key)
                }
            }
        })
    }

  $('.firmware-update-query-comp').each(function () {
    var that = this
    var excelNumbers = null
    var serialNumber = ''
    var verifyCode = ''
    var crtPage = 1
    var dataList = []
    var $numberErrorTip = $(this).find('.error-tip.number-error')
    var $verifyNumberErrorTip = $(this).find('.error-tip.verify-number-error')
    var $resultErrorTip = $(this).find('.result-empty .empty-title')
    var $submitBtn = $(this).find('.hiddns-query-btn')
    var $loading = $(this).find('.loading-modal-back')
    var $verificationCodeImg = $(this).find('.verification-code-img')
    var $checkItem = $(this).find('.checkbox-wrapper .checkbox-item')
    var $excelUploader = $(this).find('input.upload-input')
    var $excelFileWrapper = $(this).find('.uploaded-excel-wrapper')
    var $excelCancelIcon = $(this).find('.uploaded-excel-wrapper .excel-close-icon')
    var $resultWrapper = $(this).find('.result-list-wrapper')
    var $paginationWrapper = $(this).find('.firmware-update-query-pagination')

      // firmware api host
      var apiHost = $(this).find("#firmwareApiHost").val();
      if (!apiHost || apiHost.length === 0) {
          apiHost = "https://download-center.hikvision.com/";
      }
      // firmware single query api
      var queryApi = "getHiddnsByProductModel";
      // firmware multi query api
      var multiQueryApi = "getFirmwareBySerialNumberListWithValidateCode";
      // firmware verification code api
      var verificationCodeApi = "validateCode";
      // 接口签名使用头部参数
      // firmware api id
      var apiId = $(this).find("#firmwareApiId").val();
      // firmware api secret
      var accessToken = $(this).find("#firmwareAccessToken").val();
      // firmware timestamp
      var timestamp = $(this).find("#firmwareTimestamp").val();

    function checkIfButtonDisable() {
      var illegal = !verifyCode.length 
      if (illegal) {
        $submitBtn.addClass('disable')
      } else {
        $submitBtn.removeClass('disable')
      }
      return illegal
    }

    // 上传excel
    $excelUploader.on('change', function (e) {
      var files = e.target.files

      // for at event
      var module = "firmware_query::upload";
      module = module + atModel.atSpliter + window.location.href;
      atModel.doAtEvent(module, 'action', e);

      if (files && files.length) {
        var file = files[0]
        if (file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') return

        // --- read file ---
        var reader = new FileReader()
        reader.onload = function (evt) {
          // 先清空下原来的数据
          onCancelExcel()
          var data = new Uint8Array(evt.target.result)
          var workbook = XLSX.read(data, { type: 'array' })
          var sheet = workbook.Sheets[workbook.SheetNames[0]]
          var rowDataArray = XLSX.utils.sheet_to_json(sheet, { header: 1 })
          console.log('on reading', rowDataArray, sheet)
          console.log('on reading', workbook)
          rowDataArray.forEach(function (arr) {
            if (typeof arr[0] === 'number' || typeof arr[0] === 'string') {
              if (excelNumbers) {
                excelNumbers.push(arr[0])
              } else {
                excelNumbers = [arr[0]]
              }
            }
          })
          if (excelNumbers && excelNumbers.length > 100) {
            showToast()
            return
          }
          $excelFileWrapper.find('.excel-name').html(file.name)
          $excelFileWrapper.addClass('show')
          $(that).find('.input-line.batch-upload').addClass('show-excel')
          checkIfButtonDisable()
        }
        reader.readAsArrayBuffer(file)
      }
    })

    function onCancelExcel () {
      $excelUploader.val('')
      $excelFileWrapper.removeClass('show')
      $(that).find('.input-line.batch-upload').removeClass('show-excel')
      excelNumbers = null
      checkIfButtonDisable()
    }

    // 取消当前文件
    $excelCancelIcon.on('click', onCancelExcel)

    function renderByPage (isBatch) {
      var pageNum = 15
      renderList($resultWrapper, dataList.slice(pageNum * (crtPage - 1), pageNum * crtPage), isBatch)
    }

    // 初始化分页器
    function initPagination () {
      crtPage = 1
      $paginationWrapper.empty()

      var pageNum = Math.ceil(dataList.length / 15)
      var pageItemHtml = ''
      for (var i = 1; i <= pageNum; i++) {
        pageItemHtml += '<li class="pagination-item"><a data-page="' + i + '">' + i + '</a></li>'
      }
      $paginationWrapper.html('<li>' +
        '<a class="arrow" data-type="prev" aria-label="Previous">' +
          '<span aria-hidden="true">&lsaquo;</span>' +
        '</a>' +
      '</li>' +
        pageItemHtml +
      '<li>' +
        '<a class="arrow" data-type="next" aria-label="Next">' +
          '<span aria-hidden="true">&rsaquo;</span>' +
        '</a>' +
      '</li>')
      $paginationWrapper.find('a[data-page=1]').addClass('active')
      var $paginationItem = $(that).find('.pagination-item a')
      var $paginationArrow = $(that).find('.pagination .arrow')
      // 分页器事件
      $paginationItem.on('click', function () {
        $paginationItem.removeClass('active')
        $(this).addClass('active')
        crtPage = $(this).data('page')
        renderByPage(true)
      })
      // 分页器事件-箭头
      $paginationArrow.on('click', function () {
        var type = $(this).data('type')
        if (type === 'prev' && crtPage > 1) {
          crtPage -= 1
        } else if (type === 'next' && crtPage < pageNum) {
          crtPage += 1
        }
        $paginationItem.removeClass('active')
        $(that).find('a[data-page=' + crtPage + ']').addClass('active')
        renderByPage(true)
      })
      $paginationWrapper.css('display', 'flex')
    }



    // checkbox
    $checkItem.on('click', function (event) {
      var $this = $(this)
      var value = $this.data('value')
      var $serialNumberLine = $(that).find('.input-line.serial-number')
      var $batchUploadLine = $(that).find('.input-line.batch-upload')
      var $listTable = $(that).find('.list-table')
      var $resultList = $(that).find('.result-list-wrapper')

      $(that).find('.checkbox-item.checked').removeClass('checked')

      $this.addClass('checked')
      if (value === valueEnum.number) {
        $serialNumberLine.removeClass('hide')
        $batchUploadLine.addClass('hide')
        $listTable.addClass('serial-number')
      } else {
        $serialNumberLine.addClass('hide')
        $batchUploadLine.removeClass('hide')
        $listTable.removeClass('serial-number')
      }
      // for at event
      var module = 'firmware_query::mode::' + (value === valueEnum.number ? 'single_serial_number' : 'multiple_serial_number');
      module = module + atModel.atSpliter + window.location.href;
      atModel.doAtEvent(module, 'action', event);

      $resultList.hide()
    })

    // 输入serial_number
    $('#hiddns-serial_number').on('input', function (e) {
      serialNumber = e.target.value
      setTimeout(function(){
        if (serialNumber.length > 0&&serialNumber.length<4) {
          // 用户输入有问题
          showErrorTip($numberErrorTip, Granite.I18n.get('Enter at least 4 characters.'))
        } else {
           $numberErrorTip.hide()
        }
      }, 500)
      checkIfButtonDisable()
    })

    $('#hiddns-serial_number').on('blur', function () {
      if (serialNumber.length === 0 ) {
        showErrorTip($numberErrorTip, Granite.I18n.get('This field is required.'))
      } else if(serialNumber.length<4){
        showErrorTip($numberErrorTip, Granite.I18n.get('Enter at least 4 characters.'))
      }
    })

    // 输入verification_code
    $('#hiddns-verification_code').on('input', function (e) {
      verifyCode = e.target.value
      checkIfButtonDisable()
      if (verifyCode.length) {
        $verifyNumberErrorTip.hide()
      }
    })

    $('#verification_code1').on('blur', function () {
      if (verifyCode.length === 0) {
        showErrorTip($verifyNumberErrorTip, Granite.I18n.get('This field is required.'))
      }
    })

    // 查询接口
    $submitBtn.on('click', function (event) {
      if (checkIfButtonDisable()) {
        return
      }
      $loading.show()
      function showEmptyErrorTip (text) {
        $resultWrapper.hide()
        $(that).find('.result-empty').show()
        showErrorTip($resultErrorTip, Granite.I18n.get(text))
      }

      var queryType = 'number';
      var ajaxUrl;
      var ajaxType;
      var ajaxData = null;
      var ajaxDataType = false;
      var ajaxContentType = false;
      // excel读取的系列号
      // excelNumbers = ["100220574", "100220575", "100256951"]
        ajaxUrl = apiHost + queryApi + '?productModel=' + serialNumber + '&validateCode=' + verifyCode;
         ajaxType = "GET";

        /**
         * ajax 请求头，cross, authorization
         * @type {{"app-id": *, "Access-Control-Allow-Origin": string, VALIDATE_CODE: *, "access-token": *, timestamp: *}}
         */
        var requestHeader = {
            "Access-Control-Allow-Origin": '*',
            "VALIDATE_CODE": $.cookie("VALIDATE_CODE"),
            "app-id": apiId,
            "access-token": accessToken,
            "timestamp": timestamp
        };

      $.ajax({
        url: ajaxUrl,
        type: ajaxType,
        data: ajaxData,
        dataType: ajaxDataType,
        contentType: ajaxContentType,
        headers: requestHeader,
        complete: function() {
          $loading.hide()
        },
        success: function(result) {
          $paginationWrapper.hide()
          dataList = []
          if (result.code === 200 && result.data && result.data.length) {
            $(that).find('.result-empty').hide()
            dataList = result.data
            // 大于50个要展示分页器
            if (dataList.length > 15) {
              initPagination()
            }
            renderByPage(queryType === valueEnum.batch)
          }
          if (result.code === 200 && (!result.data || !result.data.length)) {
            showEmptyErrorTip('No firmware available. Only products need to be migrated to Hik-Connect can be searched on the page.')
              // for at event
                var module = 'firmware_query::'+ serialNumber + atModel.atSpliter + 'No firmware available';
                module = module + atModel.atSpliter + window.location.href;
                atModel.doAtEvent(module, 'action', event);
          }
          if (result.code === 500 && result.message === 'Invalid verification code') {
            $resultWrapper.hide()
            $(that).find('.result-empty').hide()
            showErrorTip($verifyNumberErrorTip, Granite.I18n.get('Please enter the valid verification code.'))
          }
          if (result.code === 500 && result.message !== 'Invalid verification code') {
            showEmptyErrorTip('The system is busy, please try again later.')
          }

          // refresh validate code
          refreshValidateCode(apiHost + verificationCodeApi);

            // for at event
            requestAt('number',  serialNumber, result, event);
        }
      })
    });

      /**
       * validate code img click
       */
      $verificationCodeImg.on('click', function () {
          refreshValidateCode(apiHost + verificationCodeApi);
      });

      if($verificationCodeImg.length>0) {
          refreshValidateCode(apiHost + verificationCodeApi);
      }
  });
});

$(document).ready(function () {
    function showErrorTip($error, message) {
        $error.empty()
        $error.html(message)
        $error.show()
    }

    // 检查用户输入
    function checkSerialNumberIllegal(number) {
        var reg = /^[a-z0-9]{6,9}$/i
        return !reg.test(number)
    }

    // 跳出提示弹窗
    function showToast() {
        var $body = $('body')
        var html = '<div class="firmware-update-query-toast">' +
            '<img src="/etc/clientlibs/it/resources/icons/tip-icon-yellow.png" alt="">' +
            '<span>' + Granite.I18n.get('Only support to query less than 100 items once') + '.</span>' +
            '</div>'
        $body.append(html)
        var $toast = $body.find('.firmware-update-query-toast')
        setTimeout(function () {
            $toast.remove()
        }, 3000)
    }

    function checkDataUnavailable(item) {
        // 有物料号，但是没有下载链接 => 技术支持
        // 没有物料号 => no firmware
        return item.productModel && !item.downloadUrl
    }

    function checkDateAvailable(time) {
        var earliestDate = 210626
        // 这里有两种情况： 1. 数据更新时间晚于6.26，正常显示； 2. 数据更新时间遭遇6.26，显示空状态并提示联系当地开发支持
        // 后端的日期格式 YYMMDD, etc: 210825
        return Number(time) < earliestDate
    }

    // 渲染firmware list
    function renderList($wrapper, list, isBatch) {
        // var list = data.data
        var $tableBody = $wrapper.find('.list-table .table-body')
        var $mobileTableBody = $wrapper.find('.list-table-mobile')
        $tableBody.empty()
        $mobileTableBody.empty()

        function getFileName(item) {
            if (checkDataUnavailable(item)) {
                return Granite.I18n.get('please contact technical support to get new firmware')
            }
            if (!item.productModel) {
                return Granite.I18n.get('No firmware available for this serial number.')
            }
            return item.fileName || ''
        }

        function getMD5(item) {
            if (checkDataUnavailable(item)) {
                return ''
            }
            return item.md5 || ''
        }

        list.forEach(function (item, index) {
            $tableBody.append("<div class='table-row'>" +
                (isBatch ? ("<div class='table-cell serial-number'>" + (item.serialNumber || '') + "</div>") : "") +
                "<div class='table-cell table-cell-short'>" + (item.productModel || '') + "</div>" +
                "<div class='table-cell table-cell-long'>" + getFileName(item) + "</div>" +
                "<div class='table-cell'>" + getMD5(item) + "</div>" +
                "<div class='table-cell'>" +
                ((checkDataUnavailable(item) || !item.downloadUrl) ? ""
                    : "<a class='download-icon' data-index=" + index + " data-toggle='modal' data-title=" + item.fileName + " data-link=" + item.downloadUrl + " data-title='Firmware_V5.7.0_210913' href='#download-agreement'><img class='download-img' src='/etc/clientlibs/it/resources/icons/icon-firmware-download-red.svg' alt=''></a>") +
                "</div>" +
                "</div>")

            $mobileTableBody.append("<div class='model-name'>" + (item.productModel || '') + "</div>" +
                "<div class='list-item-box'>" +
                "<div class='item-entry'>" +
                "<div class='field-name'>Firmware</div>" +
                "<div class='field-value'>" + item.fileName + "</div>" +
                "</div>" +
                "<div class='item-entry'>" +
                "<div class='field-name'>MD5</div>" +
                "<div class='field-value'>" + (item.md5 || '') + "</div>" +
                "</div>" +
                "<a class='download-icon' data-index=" + index + " data-toggle='modal' data-title=" + item.fileName + " data-link=" + item.downloadUrl + " data-title='Firmware_V5.7.0_210913' href='#download-agreement'><img class='download-img' src='/etc/clientlibs/it/resources/icons/icon-firmware-download-red.svg' alt=''></a>" +
                "</div>")

            $('a.download-icon[data-index=' + index + ']').on('click', function (event) {
                // 给modal的agree按钮挂载link
                $('.download-agreement-wrapper .modal-content footer .agree').attr('href', item.downloadUrl);
                $('.download-agreement-wrapper .modal-content footer .agree').attr('data-href', item.downloadUrl);
                console.log('on click?', $('.download-agreement-wrapper .modal-content footer .agree'), item.downloadUrl)

                // for at event
                var module = "firmware_query::download::" + item.fileName + atModel.atSpliter + window.location.href;
                atModel.doAtEvent(module, 'action', event);
            })
            $wrapper.show()
        })
    }

    function getMD5(item) {
        if (item.updateTime && checkDateAvailable(item.updateTime)) {
            return ''
        }
        return item.md5 || ''
    }

    var valueEnum = {
        number: 'number',
        batch: 'batch'
    };

    function requestAt(queryType, serial, result, event) {
        if (result.code === 200) {
            var chapter1 = "firmware_query";
            var chapter2;
            var module;
            if (queryType === valueEnum.number) {
                var chapter3 = "single";
                if (result.data && result.data.length > 0) {
                    result.data.forEach(function (item, index) {
                        if (item.productModel) {
                            if (!checkDataUnavailable(item)) {
                                if (getMD5(item).length > 0) {
                                    chapter2 = "affected_with_firmware_md5";
                                } else {
                                    chapter2 = "affected_with_firmware_withoutmd5";
                                }
                            } else {
                                chapter2 = "affected_without_firmware";
                            }
                        }
                    });
                } else if (result.data && result.data.length === 0) {
                    chapter2 = "no_affected";
                } else {
                    return;
                }
                module = chapter1 + atModel.atSpliter
                    + chapter2 + atModel.atSpliter
                    + chapter3 + atModel.atSpliter
                    + serial + atModel.atSpliter + window.location.href;
                atModel.doAtEvent(module, 'action', event);
            } else if (queryType === valueEnum.batch) {
                var chapter3 = "batch";
                result.data.forEach(function (item, index) {
                    if (item.productModel) {
                        if (!checkDataUnavailable(item)) {
                            if (getMD5(item).length > 0) {
                                chapter2 = "affected_with_firmware_md5";
                            } else {
                                chapter2 = "affected_with_firmware_withoutmd5";
                            }
                        } else {
                            chapter2 = "affected_without_firmware";
                        }
                    } else {
                        chapter2 = "no_affected";
                    }
                    module = chapter1 + atModel.atSpliter
                        + chapter2 + atModel.atSpliter
                        + chapter3 + atModel.atSpliter
                        + item.serialNumber + atModel.atSpliter + window.location.href;
                    atModel.doAtEvent(module, 'action', event);
                });
            }
        }
    }

    /**
     * refresh validate code
     */
    function refreshValidateCode(apiUrl) {

        var src = apiUrl + "?k=" + new Date().getTime();
        $.ajax({
            url: src,
            type: 'GET',
            success: function (result) {
                if (result.code === 200 && result.data) {
                    $(".verification-code-img").attr("src", result.data.image);
                    $.cookie("VALIDATE_CODE", result.data.key)
                }
            }
        })
    }

    $('.firmware-update-query-comp').each(function () {
        var that = this
        var excelNumbers = null
        var serialNumber = ''
        var verifyCode = ''
        var crtPage = 1
        var dataList = []
        var $numberErrorTip = $(this).find('.error-tip.number-error')
        var $verifyNumberErrorTip = $(this).find('.error-tip.verify-number-error')
        var $resultErrorTip = $(this).find('.result-empty .empty-title')
        var $submitBtn = $(this).find('.update-query-btn')
        var $loading = $(this).find('.loading-modal-back')
        var $verificationCodeImg = $(this).find('.verification-code-img')
        var $checkItem = $(this).find('.checkbox-wrapper .checkbox-item')
        var $excelUploader = $(this).find('input.upload-input')
        var $excelFileWrapper = $(this).find('.uploaded-excel-wrapper')
        var $excelCancelIcon = $(this).find('.uploaded-excel-wrapper .excel-close-icon')
        var $resultWrapper = $(this).find('.result-list-wrapper')
        var $paginationWrapper = $(this).find('.firmware-update-query-pagination')

        // firmware api host
        var apiHost = $(this).find("#firmwareApiHost").val();
        if (!apiHost || apiHost.length === 0) {
            apiHost = "https://download-center.hikvision.com/";
        }
        // firmware single query api
        var queryApi = "getFirmwareBySerialNumber";
        // firmware multi query api
        var multiQueryApi = "getFirmwareBySerialNumberListWithValidateCode";
        // firmware verification code api
        var verificationCodeApi = "validateCode";
        // 接口签名使用头部参数
        // firmware api id
        var apiId = $(this).find("#firmwareApiId").val();
        // firmware api secret
        var accessToken = $(this).find("#firmwareAccessToken").val();
        // firmware timestamp
        var timestamp = $(this).find("#firmwareTimestamp").val();

        function checkIfButtonDisable() {
            var illegal = !verifyCode.length || checkSerialNumberIllegal(serialNumber)
            var value = $(that).find('.checkbox-wrapper .checkbox-item.checked').data('value')
            if (value === valueEnum.batch) {
                illegal = !verifyCode.length || !$excelFileWrapper.hasClass('show')
            }
            if (illegal) {
                $submitBtn.addClass('disable')
            } else {
                $submitBtn.removeClass('disable')
            }
            return illegal
        }

        // 上传excel
        $excelUploader.on('change', function (e) {
            var files = e.target.files

            // for at event
            var module = "firmware_query::upload";
            module = module + atModel.atSpliter + window.location.href;
            atModel.doAtEvent(module, 'action', e);

            if (files && files.length) {
                var file = files[0]
                if (file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') return

                // --- read file ---
                var reader = new FileReader()
                reader.onload = function (evt) {
                    // 先清空下原来的数据
                    onCancelExcel()
                    var data = new Uint8Array(evt.target.result)
                    var workbook = XLSX.read(data, {type: 'array'})
                    var sheet = workbook.Sheets[workbook.SheetNames[0]]
                    var rowDataArray = XLSX.utils.sheet_to_json(sheet, {header: 1})
                    console.log('on reading', rowDataArray, sheet)
                    console.log('on reading', workbook)
                    rowDataArray.forEach(function (arr) {
                        if (typeof arr[0] === 'number' || typeof arr[0] === 'string') {
                            if (excelNumbers) {
                                excelNumbers.push(arr[0])
                            } else {
                                excelNumbers = [arr[0]]
                            }
                        }
                    })
                    if (excelNumbers && excelNumbers.length > 100) {
                        showToast()
                        return
                    }
                    $excelFileWrapper.find('.excel-name').html(file.name)
                    $excelFileWrapper.addClass('show')
                    $(that).find('.input-line.batch-upload').addClass('show-excel')
                    checkIfButtonDisable()
                }
                reader.readAsArrayBuffer(file)
            }
        })

        function onCancelExcel() {
            $excelUploader.val('')
            $excelFileWrapper.removeClass('show')
            $(that).find('.input-line.batch-upload').removeClass('show-excel')
            excelNumbers = null
            checkIfButtonDisable()
        }

        // 取消当前文件
        $excelCancelIcon.on('click', onCancelExcel)

        function renderByPage(isBatch) {
            var pageNum = 50
            renderList($resultWrapper, dataList.slice(pageNum * (crtPage - 1), pageNum * crtPage), isBatch)
        }

        // 初始化分页器
        function initPagination() {
            crtPage = 1
            $paginationWrapper.empty()

            var pageNum = Math.ceil(dataList.length / 50)
            var pageItemHtml = ''
            for (var i = 1; i <= pageNum; i++) {
                pageItemHtml += '<li class="pagination-item"><a data-page="' + i + '">' + i + '</a></li>'
            }
            $paginationWrapper.html('<li>' +
                '<a class="arrow" data-type="prev" aria-label="Previous">' +
                '<span aria-hidden="true">&lsaquo;</span>' +
                '</a>' +
                '</li>' +
                pageItemHtml +
                '<li>' +
                '<a class="arrow" data-type="next" aria-label="Next">' +
                '<span aria-hidden="true">&rsaquo;</span>' +
                '</a>' +
                '</li>')
            $paginationWrapper.find('a[data-page=1]').addClass('active')
            var $paginationItem = $(that).find('.pagination-item a')
            var $paginationArrow = $(that).find('.pagination .arrow')
            // 分页器事件
            $paginationItem.on('click', function () {
                $paginationItem.removeClass('active')
                $(this).addClass('active')
                crtPage = $(this).data('page')
                renderByPage(true)
            })
            // 分页器事件-箭头
            $paginationArrow.on('click', function () {
                var type = $(this).data('type')
                if (type === 'prev' && crtPage > 1) {
                    crtPage -= 1
                } else if (type === 'next' && crtPage < pageNum) {
                    crtPage += 1
                }
                $paginationItem.removeClass('active')
                $(that).find('a[data-page=' + crtPage + ']').addClass('active')
                renderByPage(true)
            })
            $paginationWrapper.css('display', 'flex')
        }


        // checkbox
        $checkItem.on('click', function (event) {
            var $this = $(this)
            var value = $this.data('value')
            var $serialNumberLine = $(that).find('.input-line.serial-number')
            var $batchUploadLine = $(that).find('.input-line.batch-upload')
            var $listTable = $(that).find('.list-table')
            var $resultList = $(that).find('.result-list-wrapper')

            $(that).find('.checkbox-item.checked').removeClass('checked')

            $this.addClass('checked')
            if (value === valueEnum.number) {
                $serialNumberLine.removeClass('hide')
                $batchUploadLine.addClass('hide')
                $listTable.addClass('serial-number')
            } else {
                $serialNumberLine.addClass('hide')
                $batchUploadLine.removeClass('hide')
                $listTable.removeClass('serial-number')
            }
            // for at event
            var module = 'firmware_query::mode::' + (value === valueEnum.number ? 'single_serial_number' : 'multiple_serial_number');
            module = module + atModel.atSpliter + window.location.href;
            atModel.doAtEvent(module, 'action', event);

            $resultList.hide()
        })

        // 输入serial_number
        $('#serial_number').on('input', function (e) {
            serialNumber = e.target.value
            _.debounce(function () {
                if (serialNumber.length > 0 && checkSerialNumberIllegal(serialNumber)) {
                    // 用户输入有问题
                    showErrorTip($numberErrorTip, Granite.I18n.get('Please enter a valid serial number.'))
                } else {
                    $numberErrorTip.hide()
                }
            })
            checkIfButtonDisable()
        })

        $('#serial_number').on('blur', function () {
            if (serialNumber.length === 0) {
                showErrorTip($numberErrorTip, Granite.I18n.get('This field is required.'))
            }
        })

        // 输入verification_code
        $('#verification_code').on('input', function (e) {
            verifyCode = e.target.value
            checkIfButtonDisable()
            if (verifyCode.length) {
                $verifyNumberErrorTip.hide()
            }
        })

        $('#verification_code').on('blur', function () {
            if (verifyCode.length === 0) {
                showErrorTip($verifyNumberErrorTip, Granite.I18n.get('This field is required.'))
            }
        })

        // 查询接口
        $submitBtn.on('click', function (event) {
            if (checkIfButtonDisable()) {
                return
            }
            $loading.show()

            function showEmptyErrorTip(text) {
                $resultWrapper.hide()
                $(that).find('.result-empty').show()
                showErrorTip($resultErrorTip, Granite.I18n.get(text))
            }

            var queryType = $(that).find('.checkbox-wrapper .checkbox-item.checked').data('value');
            var ajaxUrl;
            var ajaxType;
            var ajaxData = null;
            var ajaxDataType = false;
            var ajaxContentType = false;
            // excel读取的系列号
            // excelNumbers = ["100220574", "100220575", "100256951"];
            // 批量
            if (queryType === valueEnum.batch) {
                ajaxUrl = apiHost + multiQueryApi;
                ajaxType = "POST";
                ajaxData = JSON.stringify({
                    serialNumberList: excelNumbers,
                    validateCode: verifyCode
                });
                ajaxDataType = "JSON";
                ajaxContentType = "application/json"
            } else {
                ajaxUrl = apiHost + queryApi + '?serialNumber=' + serialNumber + '&validateCode=' + verifyCode;
                ajaxType = "GET";
            }

            /**
             * ajax 请求头，cross, authorization
             * @type {{"app-id": *, "Access-Control-Allow-Origin": string, VALIDATE_CODE: *, "access-token": *, timestamp: *}}
             */
            var requestHeader = {
                "Access-Control-Allow-Origin": '*',
                "VALIDATE_CODE": $.cookie("VALIDATE_CODE"),
                "app-id": apiId,
                "access-token": accessToken,
                "timestamp": timestamp
            };

            $.ajax({
                url: ajaxUrl,
                type: ajaxType,
                data: ajaxData,
                dataType: ajaxDataType,
                contentType: ajaxContentType,
                headers: requestHeader,
                complete: function () {
                    $loading.hide()
                },
                success: function (result) {
                    $paginationWrapper.hide()
                    dataList = []
                    if (result.code === 200 && result.data && result.data.length) {
                        $(that).find('.result-empty').hide()
                        var isIllegal = result.data.some(function (item) {
                            return checkDataUnavailable(item)
                        })
                        // 只有单个查询时才检查是否包含不合法日期
                        if (isIllegal && queryType === valueEnum.number) {
                            showEmptyErrorTip(' Please contact local technical support team to update your firmware.')
                        } else {
                            dataList = result.data
                            // 大于50个要展示分页器
                            if (dataList.length > 50) {
                                initPagination()
                            }

                            renderByPage(queryType === valueEnum.batch)
                        }
                    }
                    if (result.code === 200 && (!result.data || !result.data.length)) {
                        showEmptyErrorTip('No firmware available for this serial number.')
                    }
                    if (result.code === 500 && result.message === 'Invalid verification code') {
                        $resultWrapper.hide()
                        $(that).find('.result-empty').hide()
                        showErrorTip($verifyNumberErrorTip, Granite.I18n.get('Please enter the valid verification code.'))
                    }
                    if (result.code === 500 && result.message !== 'Invalid verification code') {
                        showEmptyErrorTip('The system is busy, please try again later.')
                    }

                    // refresh validate code
                    refreshValidateCode(apiHost + verificationCodeApi);

                    // for at event
                    requestAt(queryType, queryType === valueEnum.number ? serialNumber : excelNumbers, result, event);
                }
            })
        });

        /**
         * validate code img click
         */
        $verificationCodeImg.on('click', function () {
            refreshValidateCode(apiHost + verificationCodeApi);
        });

        if ($verificationCodeImg.length > 0) {
            refreshValidateCode(apiHost + verificationCodeApi);
        }
    });
});


$(function(){
    $(".xss-value.name").on("blur", function(){
        var tValue = $(this).val().trim()
        var _this = this
        if(!tValue){
            setTimeout(function() {
                $(_this).parent().addClass("err").removeClass("hasVal")
                $(_this).parent().find("label").addClass("err").addClass("err-lbl")
                if($(_this).parent().find("#name-error").length){
                    $(_this).parent().find("#name-error").text(Granite.I18n.get("Please enter your name.")).show()
                } else {
                    $(_this).parent().append("<em id='name-error' class='error help-block'>"+Granite.I18n.get("Please enter your name.")+"</em>")
                }
            }, 200);
        }
    })
    $(".xss-number.postcode").on("input", function(){
        var tValue = $(this).val().trim()
        var _this = this
        if(!tValue){
            setTimeout(function() {
                $(_this).parent().addClass("err").removeClass("hasVal")
                $(_this).parent().find("label").addClass("err").addClass("err-lbl")
                if($(_this).parent().find("#zipCode-error").length){
                    $(_this).parent().find("#zipCode-error").text(Granite.I18n.get("This field is required.")).show()
                } else {
                    $(_this).parent().append("<em id='zipCode-error' class='error help-block'>"+Granite.I18n.get("This field is required.")+"</em>")
                }
            }, 200);
        }
    })
    var $submit = $("#formSubmit");
    var $form = $("#enquiry-form");
    var $formType = $form.data('form-type');
    var formBackground=$('.contact-installer-form .form-wrapper').attr( window.innerWidth <= 992 ? 'data-original-mobile' :'data-original')
    $('.contact-installer-form .contact-installer-image-wrap').css('background-image','url("'+formBackground+'")');
    if ($submit && $submit.length > 0) {
        initHikFormValidator($("#enquiry-form.contact-installer-form"), $submit, "contactInstaller",$formType);
    }
    $('#enquiry-form.contact-installer-form').outlinedFormLabelShrink();

})
$(document).ready(function () {
    function renderProductTypeList($optionsGroup,productTypeList) {
        var innerHtml = '';
        if (productTypeList.softwareType) {
            productTypeList.softwareType.forEach(function (item, index) {
                // innerHtml += '<label class="checkbox-inline options-item">'
                //     + '<input class="software-type" type="checkbox" name="caseType" value="' + item.value + '||' + item.name + '"> ' + Granite.I18n.get(item.name)
                //     + '</label>';
                innerHtml+='<li class="options software-type" data-type="software" data-value="' + item.value + '||' + item.name + '">'+ Granite.I18n.get(item.name)+'</li>'
            });
        }
        if (productTypeList.hardwareType) {
            productTypeList.hardwareType.forEach(function (item, index) {
                // innerHtml += '<label class="checkbox-inline options-item">'
                //     + '<input class="hardware-type" type="checkbox" name="caseType" value="' + item.value + '||' + item.name + '"> ' + Granite.I18n.get(item.name)
                //     + '</label>';
                innerHtml += '<li class="options hardware-type" data-type="hardware" data-value="' + item.value + '||' + item.name + '">'+ Granite.I18n.get(item.name)+'</li>'
            });
        }

        if (productTypeList.otherType) {
            productTypeList.otherType.forEach(function (item, index) {
                // innerHtml += '<label class="checkbox-inline options-item">'
                //     + '<input type="checkbox" name="caseType" value="' + item.value + '||' + item.name + '"> ' + Granite.I18n.get(item.name)
                //     + '</label>';
                innerHtml+= '<li class="options" data-type="" data-value="' + item.value + '||' + item.name + '">'+ Granite.I18n.get(item.name)+'</li>'
            });
        }
        $optionsGroup.html(innerHtml).find('li').on('click', function(){
            var currentText = $(this).text()
            var currentValue = $(this).data('value')
            var type = $(this).data('type')
            $(this).parent().parent().find('.selector-label').find('.selected-option').removeClass('selected-init').text(currentText)
            $(this).parent().parent().find('.selector-label').find('input').val(currentValue)
            $(this).siblings().removeClass('active')
            $(this).addClass('active')
            var $productTypeGroup = $(".product-type-article .product-type-group");
            var $form = $productTypeGroup.closest('form');
            updateFieldRequiredAttr($form,type);
        });
    }
    function removeRequireAttr($target) {
        $target.find('label').removeClass('required');
        $target.find('input').removeAttr('required');
        $target.find('input').removeClass('has-error');
        $target.find('.error').hide();
    }
    function addRequireAttr($target) {
        $target.find('label').addClass('required');
        $target.find('input').attr('required', 'required');
    }
    function updateFieldRequiredAttr($form,type) {
        console.log('type', type)
        var $deviceModelField = $form.find('.device-model-field');
        var $serialNumberField = $form.find('.serial-number-field');
        var $firmwareVersionField = $form.find('.firmware-version-field');
        var $softwareVersionField = $form.find('.software-version-field');
        var $countryField = $form.find('input[name="country"]');

        if (type === 'software') {
            addRequireAttr($softwareVersionField);
            if ($countryField.val() === 'Italy') {
                addRequireAttr($serialNumberField);
            } else {
                removeRequireAttr($serialNumberField);
            }
            removeRequireAttr($firmwareVersionField);
            removeRequireAttr($deviceModelField);
        } else if (type === 'hardware') {
            addRequireAttr($serialNumberField);
            addRequireAttr($firmwareVersionField);
            addRequireAttr($deviceModelField);
            removeRequireAttr($softwareVersionField);
        } else if (type === 'software-hardware') {
            addRequireAttr($serialNumberField);
            addRequireAttr($firmwareVersionField);
            addRequireAttr($deviceModelField);
            addRequireAttr($softwareVersionField);
        } else {
            removeRequireAttr($softwareVersionField);
            if ($countryField.val() === 'Italy') {
                addRequireAttr($serialNumberField);
            } else {
                removeRequireAttr($serialNumberField);
            }
            removeRequireAttr($firmwareVersionField);
            removeRequireAttr($deviceModelField);
        }

    }
    function initProductTypeList() {
        var $productTypeGroup = $(".product-type-article .product-type-group");
        var $form = $productTypeGroup.closest('form');
        if ($productTypeGroup && $productTypeGroup.length > 0) {
            var $optionsGroup = $productTypeGroup.find(".option-list");
            if ($optionsGroup && $optionsGroup.length > 0) {
                var productTypeLabel = $productTypeGroup.find(".product-type-label");
                var required = productTypeLabel.hasClass("required");
                $optionsGroup.empty();
                $.getScript("/etc/hiknow/product-type-list.json", function (data) {
                    if (data) {
                        var productTypeList = eval(data)[0];
                        renderProductTypeList($optionsGroup,productTypeList);
                        $optionsGroup.find('.options-item input').on('change', function() {
                            var type;
                            var checkedSoftware = $optionsGroup.find('.options-item input.software-type:checked');
                            var checkedHardware = $optionsGroup.find('.options-item input.hardware-type:checked');
                            if (checkedSoftware.length && checkedHardware.length) {
                                type = 'software-hardware';
                            } else if (checkedSoftware.length) {
                                type = 'software';
                            } else if (checkedHardware.length) {
                                type = 'hardware';
                            } else {
                                type = 'other';
                            }
                            updateFieldRequiredAttr($form,type);
                        })
                    }
                });
            }
        }
    };
    initProductTypeList();
});
var globalDistributor = (function ($) {
    var distributorModel = {};
    var showDistributeCountry = ["ZA", "IT"];
    var showOtherFieldCountry = ["IT"];
    var hideNotSureOptionCountry = ["IT"];

    distributorModel.resetValue = function ($distributorField, $otherDistributor) {
        $distributorField.find('.selected-option, .hidden-value').val('');
        $distributorField.find('.outlined').removeClass('hasVal').removeClass('shrink')
        $distributorField.find('.hidden-value-email').val('');
        $otherDistributor.find('input').val('');
        $otherDistributor.hide();
    }

    distributorModel.updateOtherFieldStatus = function ($distributorField, value, $form, $otherDistributorField) {
        if (value === 'Other') {
            $otherDistributorField.show();
        } else {
            $otherDistributorField.hide();
        }

        globalPcd.styleOutlinedFormByDisplayStatus($form)
    }

    distributorModel.bindOptionEvent = function ($distributorField, $form, $otherDistributorField) {
        $distributorField.find('.d-option').on('mousedown click', function () {
            var value = $(this).attr('data-value');
            var email = $(this).attr('data-email');
            $distributorField.find('.selected-option, .hidden-value').val(value).trigger('change');
            $distributorField.find('.hidden-value-email').val(email);
            distributorModel.updateOtherFieldStatus($distributorField, value, $form, $otherDistributorField);
        });
    }

    distributorModel.bindListenerEvent = function ($distributorField) {
        $distributorField.find('input.hidden-value').on('change', function () {
            setTimeout(function () {
                checkRequired($("#enquiry-form"), $("#enquiry-form").find("button[type='submit']"))
            }, 0);
        })
    }

    distributorModel.renderDistributorOption = function ($form, code, $otherDistributorField) {
        var listHtml = '';
        var $distributorField = $form.find('.group-distributor');
        var $dropdownList = $distributorField.find('.dropdown');

        if (!$distributorField.length) return;
        $dropdownList.empty();
        distributorModel.resetValue($distributorField, $otherDistributorField);
        if (showDistributeCountry.indexOf(code) > -1) {
            $distributorField.css('display', 'flex');
            if (typeof (DISTRIBUTOR_DATA[code]) !== 'undefined') {
                DISTRIBUTOR_DATA[code].forEach(function (value) {
                    listHtml += '<li class="d-option" data-value="' + value.name + '" data-email="' + value.email + '">' + value.name + '</li>';
                });
            }
        } else {
            $distributorField.hide();
            $distributorField.find("label").removeClass("required");
            $distributorField.find('.hidden-value').removeAttr('required');
            $distributorField.find('.hidden-value').removeAttr('requredHidden');
            $distributorField.find('.outlined').removeClass('hasVal').removeClass('shrink')
            globalPcd.styleOutlinedFormByDisplayStatus($form);
            return;
        }

        if (hideNotSureOptionCountry.indexOf(code) < 0) {
            listHtml += '<li class="d-option" data-value="Not sure" data-email="">' + Granite.I18n.get('Not sure') + '</li>';
        }

        if (showOtherFieldCountry.indexOf(code) > -1) {
            listHtml += '<li class="d-option other-option" data-value="Other" data-email="">' + Granite.I18n.get('Other') + '</li>';
        }

        $dropdownList.append(listHtml);
        if (listHtml) {
            $distributorField.find("label").addClass("required");
            $distributorField.find('.hidden-value').attr('required', '');
            $distributorField.find('.hidden-value').attr('requredHidden', 'true');
            distributorModel.bindOptionEvent($distributorField, $form, $otherDistributorField);
            distributorModel.bindListenerEvent($distributorField);
        }

        globalPcd.styleOutlinedFormByDisplayStatus($form)
    }

    distributorModel.initDistributorField = function ($form) {
        this.$form = $form;
        var $distributorField = $form.find('.group-distributor');
        var $otherDistributorField = $form.find('.other-distributor')
        distributorModel.updateOtherFieldStatus($distributorField, '', $form, $otherDistributorField);
        distributorModel.renderDistributorOption($form, '', $otherDistributorField);
    }

    return distributorModel;
}($));
var globalUploadFile = (function ($) {
    var fileModel = {};
    fileModel.fileAssets = {};

    function verifyFileSize(fileSize) {
        return fileSize / 1024 < 5120;
    }

    function getFileExtension(filename) {
        if (filename) {
            var nameArr = filename.split('.');
            return nameArr[nameArr.length - 1];
        }

        return '';
    }

    function getFileIconDiv(extension) {
        var fileExtensions = {
            doc: 'word',
            docx: 'word',
            pdf: 'pdf',
            xlsx: 'excel',
            xls: 'excel',
            jpg: 'image',
            jpeg: 'image',
            png: 'image',
            gif: 'image',
            svg: 'image'
        }

        var docType = fileExtensions[extension] ? fileExtensions[extension] : 'default';

        return '<div class="file-icon file-icon-' + docType + '"></div>'
    }

    fileModel.initFileField = function ($form) {
        $form.find('.file-section').each(function () {
            var _this = $(this);
            var $fileInput = $('.file-input', _this);
            var $uploadBtn = $('.upload-btn', _this);
            var $fileDisplay = $('.file-display', _this);
            var fieldName = $fileInput.attr('data-fname');
            $fileDisplay.hide();

            function selectFile(e) {
                e = e || window.event;
                e.preventDefault();
                this.files.forEach(function (item) {
                    var fileReader = new FileReader();
                    fileReader.readAsDataURL(item);
                    if (!verifyFileSize(item.size)) {
                        var i18Content = Granite.I18n.get('The uploaded file should be less than 5MB');
                        alert(i18Content);
                        return false;
                    }
                    $fileDisplay.empty();
                    fileReader.onload = function () {
                        var html = '<li class="file-item">' 
                            + getFileIconDiv(getFileExtension(item.name)) +
                            '<div class="file-name">' + item.name + '</div>' +
                            '<div class="remove-btn"></div>' +
                            '</li>'
                        $fileDisplay.append(html);
                        $fileDisplay.show();
                    }
                    fileModel.fileAssets[fieldName] = item;
                });
                this.value = '';
            }

            $uploadBtn.on('click', function () {
                $fileInput.trigger('click');
            })

            $fileInput.on('change', selectFile);

            $fileDisplay.on('click', '.remove-btn', function () {
                $fileDisplay.empty();
                $fileDisplay.hide();
                fileModel.fileAssets[fieldName] = '';
            })
        })
    }
    return fileModel;
}($));
$(document).ready(function () {
    var $form = $("#enquiry-form.technical-support-form");

    if (!$form.length) return;

    $form.find('input[name="country"]').on('change', function () {
        setTimeout(function () {
            var $productTypeGroup = $form.find(".product-type-article .product-type-group");
            var $optionsGroup = $productTypeGroup.find(".option-list");
            $optionsGroup.find('li.active').click();
        }, 300)
    });
    globalDistributor.initDistributorField($form);
    globalUploadFile.initFileField($form);
    initHiddenValue();

    function initHiddenValue() {
        // submitted page
        var contactUsUrl = $.cookie("contactUsUrl");
        contactUsUrl = contactUsUrl && contactUsUrl !== "123" ? contactUsUrl : "";
        var submittedPage = document.getElementById("submittedPage");
        if (submittedPage) {
            submittedPage.value = storeManager.localStorage.get(storeManager.STORE_NAMES.refererDisclaimer);
        }
    }
    $form.outlinedFormLabelShrink();
    initialBusinessType($form);
    var $select = $('.hik-multiple-select');

    $.getScript("/etc/hiknow/industry-list.json", function (data) {
        if (data) {
            var industryList = eval(data);
            var innerHtml = '';
            industryList.forEach(function (item, index) {
                innerHtml += '<li data-val="' + item.value + '"><input name="businessVertical" type="checkbox" value="' + item.value + '" /> <span>' + item.name + '</span></li>';
            });

            $select.find('ul').html(innerHtml);
            $select.hikMultiSelect();
        }
    });

    function initialBusinessType(form) {
        var option = {
            onSelected: function ($ele, $input) {
                var val = $input.data('value');
                $ele.find('input[name="type"]').val(val).trigger('change').trigger('blur');
            },
            hasTooltip: true
        }
        
        return form.find('.hik-outlined-select.business-type').hikSelect(option);
    }
});
$(document).ready(function() {
    var headerHeight = $('#header').length ? $('#header').outerHeight() : 0;
    function renderBackdrop() {
        if($('body').find('#material-list-backdrop').length) return;
        var $backdrop = $('<div id="material-list-backdrop">');//黑色遮罩
        $('body').append($backdrop);
        $('html').addClass('overflow-prevent')
    }

    function removeBackdrop() {
        $('.marketing-material-list-comp .categroy-section').removeClass('sub-expand hide-red-line');
        $('body').find('#material-list-backdrop').remove();
        $('html').removeClass('overflow-prevent')
    }

    function updateSubMenuStatus($target, $comp) {
        var $category = $target.closest('.categroy-section');
        if($target.hasClass('main-item') && !$category.hasClass('sub-expand')) {
            var filterPosition = $target.closest('.filter-container').offset().top - headerHeight;
            if($comp.find('.filter-container').hasClass('list-sticky')) {
                filterPosition += headerHeight;
            }
            window.scrollTo(0, filterPosition);
            $category.siblings().removeClass('sub-expand');
            $category.addClass('sub-expand');
            renderBackdrop();
        } else {
            removeBackdrop();
        }
    }

    function addPCSticky($comp) {
        $comp.find('.filter-container').addClass('list-sticky');
        $comp.find('.material-list-container').addClass('list-sticky');
    }

    function removePCSticky($comp) {
        $comp.find('.filter-container').removeClass('list-sticky');
        $comp.find('.material-list-container').removeClass('list-sticky');
    }

    function updateMainCategroyStatus($comp) {
        var scrollTop = $(window).scrollTop();
        var windowHeight = $(window).height();
        var compTop = $comp.offset().top;
        var height = $comp.height();
        var base = scrollTop + windowHeight / 2;
        var sticky_1 = scrollTop > 74;// 判断页面存在滚动(导航高度中文站pc：74，国际站pc： 64)
        var sticky_2 = (scrollTop + 100) - compTop > 0;// comp的顶部 大于 距离页面顶部+100
        var sticky_3 = (scrollTop + windowHeight - 100 - compTop - height < 0); // 距离页面底部-100 小于 comp的底部
        
        if(getCurrentBreakPoint() == 'DESKTOP') {
            if (sticky_1 && sticky_2 && sticky_3) {
                addPCSticky($comp);
            } else {
                removePCSticky($comp);
            }
        } else {
            if(scrollTop >= 0 && scrollTop < 48) {
                $comp.find('.filter-container').css('top', 48 - scrollTop + 'px');
            } else if(scrollTop > 48) {
                $comp.find('.filter-container').css('top', 0);
            }
        }

        if(compTop > base) {
            $comp.find('.categroy-section:not(:first-child) .main-item').removeClass('active');
            $comp.find('.categroy-section:first-child .main-item').addClass('active');
            return;
        } else if (compTop + height < base) {
            $comp.find('.categroy-section:not(:last-child) .main-item').removeClass('active');
            $comp.find('.categroy-section:last-child .main-item').addClass('active');
            return;
        }

        $comp.find('.list-category-wrapper').each(function() {
            var compTop = $(this).offset().top;
            var compBottom = compTop + $(this).outerHeight();

            if(compTop < base && compBottom > base) {
                var group =  $(this).attr("data-group");
                $comp.find('.categroy-section .main-item').removeClass('active');
                $comp.find('.categroy-section .main-item[data-group="'+group+'"]').addClass('active');
                return false;
            }
        });
    }

    function bindEvent($comp) {
        $comp.find('.filter-container .guide-btn').on('click', function() {
            var offsetVal = 0;
            var $this = $(this);
            if(getCurrentBreakPoint() !== 'DESKTOP') {
                updateSubMenuStatus($this, $comp);
                offsetVal = headerHeight + $comp.find('.filter-container').outerHeight();
                if($this.hasClass('main-item')) return;
            }
            $this.closest('.categroy-wrapper').find('.guide-btn').removeClass('active');
            $this.addClass('active');
            var index = $this.attr('data-index');
            var scrollValue = $comp.find('.material-list-container .category-title[data-index="'+ index +'"]').offset().top - offsetVal;
            $('html, body').animate({scrollTop: scrollValue}, 400);
        })
    }

    $('body').on('click','#material-list-backdrop', function() {
        removeBackdrop();
    })

    function addPlaceholder() {
        var placeholder = '<div class="marketing-material-placeholder"></div>';
        $('.mobile-block').after(placeholder);
    }

    $('.marketing-material-list-comp').each(function() {
        var $comp = $(this);
        bindEvent($comp);

        if(getCurrentBreakPoint() == 'MOBILE') {
            addPlaceholder();
        }

        $(window).on('scroll', function() {
            updateMainCategroyStatus($comp);
        });

        var resizeTimer;
        $(window).on('resize', function() {
            if (resizeTimer) {
                clearTimeout(resizeTimer);
            }
            resizeTimer = setTimeout(function() {
                headerHeight = $('#header').length ? $('#header').outerHeight() : 0;
                setMobileSubMenuTop($comp);
                removeBackdrop();
            }, 200);
        })
    });
});

$(document).ready(function () {
    $('.back-to-top-comp').each(function() {
        var $comp = $(this);
        $comp.hide();
        var scrollTopVal = 0;
        var resizeTimer;

        $comp.on('click', function() {
            $('html, body').animate({scrollTop: 0}, 300, function() {
                clearTimeout(resizeTimer);
                scrollTopVal = 0;
                $comp.fadeOut(200);
            });
        });

        $(window).on('scroll', function() {
            var newVal = $(window).scrollTop();
            if (resizeTimer) {
                clearTimeout(resizeTimer);
            }

            if (newVal > window.innerHeight) {
                $comp.show();
                resizeTimer = setTimeout(function() {
                    $comp.fadeOut(200);
                }, 6000);
            } else {
                $comp.fadeOut(200);
            }

            scrollTopVal = newVal;
        })
    });
});
$(document).ready(function () {
    initHiddenValue();
    initReferrerPage();

    function initHiddenValue() {
        if(!$("#enquiry-form.apply-for-permission-form").length) return;
        // hik name
        var hikName = $.cookie("HIKUSERNAME");
        var firstNameInput = document.getElementById("firstName");
        var lastNameInput = document.getElementById("lastName");
        if(hikName &&hikName!='123'&& firstNameInput && lastNameInput) {
            try {
                hikName = atob(hikName);
                if(hikName.indexOf(" ")>-1){
                    firstNameInput.value = hikName.split(" ")[0];
                    lastNameInput.value = hikName.split(" ")[1];
                }else{
                    firstNameInput.value = hikName;
                }

            } catch (error) {
                console.log("Login Error:" + error);
            }
        }
    }

    function initReferrerPage(){
        if(!$("#enquiry-form.apply-for-permission-form").length) return;
        $("#applyPath").val(getURLParam("applyPath"));
    }

    //获取路径参数
    function getURLParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var value = window.location.search.substr(1).match(reg);
        if (value) {
            return decodeURI(value[2]);
        }
        return '';
    }
});
$(document).ready(function() {
    function updateExpandIconState($comp) {
        var $expandIcon = $comp.find('.faq-list-filter-bar .expand-icon');
        var $innerContainer = $comp.find('.faq-list-filter-bar .filter-container');

        $comp.find('.faq-list-filter-bar').removeClass('close-state');
        if ($innerContainer.height() > 30) {
            $expandIcon.removeClass('hide');
        } else {
            $expandIcon.addClass('hide');
        }
    }

    function addBackdrop() {
        var backdrop = '<div class="faq-list-backdrop"></div>';
        if(!$('.faq-list-backdrop').length) {
            $('body').append(backdrop);
            $('body').addClass('faq-backdrop-open');
        }
    }

    function removeBackdrop() {
        if($('.faq-list-backdrop').length) {
            $('.faq-list-backdrop').remove();
            $('body').removeClass('faq-backdrop-open');
        }
    }

    function ifShowFaq($faq, dataTag, searchVal) {
        var $topic = $faq.find('.topic');
        var title = $topic.text().toLowerCase();
        var desc = $faq.find('.description').text().toLowerCase();
        if (title.indexOf(searchVal) < 0 && desc.indexOf(searchVal) < 0) {
            return false;
        }

        dataTag = '|' + dataTag + '|';
        if (dataTag !== '|all|' && $topic.attr('data-tag').indexOf(dataTag) < 0) {
            return false;
        }

        return true;
    }

    function ifShowNoResultIcon($comp) {
        var $visibleCard = $comp.find('.faq-items-container .faq-item:not(.not-in-scope)');
        if($visibleCard.length) {
            $comp.find('.no-result-found').hide();
            $comp.find('.faq-list-desktop-pagination').addClass('active');
            $comp.find('.faq-items-container').removeClass('minheight-noactive');
        } else {
            $comp.find('.no-result-found').show();
            $comp.find('.faq-list-desktop-pagination').removeClass('active');
            $comp.find('.faq-items-container').addClass('minheight-noactive');
        }
    }

    function updateMobileList($comp) {
        destroyPagination($comp);
        initLoadingItem($comp);
        if($comp.find('.accordion .faq-item:visible .content-section').eq(0).length) {
            $comp.find('.accordion .faq-item:visible .content-section').eq(0).collapse('show');
        }
    }

    function destroyPagination($comp) {
        var $pagination = $comp.find('.pagination-section');
        if($pagination.hasClass('pagination-initialized')) {
            $pagination.jPages('destroy');
            $pagination.removeClass('pagination-initialized');
        }
    }

    function updateDesktopPagination($comp) {
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
            callback: function(pages,items) {
                $(items.showing[0]).find('.content-section').collapse('show');
                if($pagination.hasClass('pagination-initialized')) {
                     var title = "faq_list::pagination::" + pages.current + atModel.atSpliter + window.location.href;
                     atModel.doAtEvent(title, 'action', event);
                }
            }
        });
        $pagination.addClass('pagination-initialized');
    }

    function initListPagination($comp) {
        if (currentBreakPoint !== 'DESKTOP') {
            updateMobileList($comp);
        } else {
            updateDesktopPagination($comp);
        }
    }

    function initLoadingItem($comp) {
        $comp.find('.faq-items-container .faq-item').removeClass('mobile-active');
        $comp.find('.faq-items-container .faq-item:not(.not-in-scope):lt(10)').addClass('mobile-active');
    }

    var scrollTimer = null;
    function loadingItem($comp) {
        var $itemNoActive = $comp.find('.faq-items-container .faq-item:not(.not-in-scope):not(.mobile-active):lt(10)');
        var bh = $comp.height() + $comp.offset().top;

        var allowLoad = ($(window).height() + $(window).scrollTop() > bh) && $(window).scrollTop() < bh;

        if (scrollTimer || !allowLoad || $itemNoActive.length <= 0) {
            return;
        }

        if ($itemNoActive.length > 0) {
            $comp.append('<div class="loading-box"><div>');
        }

        scrollTimer = setTimeout(function() {
            $itemNoActive.addClass('mobile-active');
            $comp.find('.loading-box').remove();
            scrollTimer = null;
        }, 1000);
    }

    function applyFilter($comp) {
        var $faqList = $comp.find('.faq-items-container .faq-item');
        var dataTag = $comp.find('.filter.active').attr('data-tag') ? $comp.find('.filter.active').attr('data-tag') : 'all';
        var searchVal = $comp.find('.search-container').attr('data-searchval') ? $comp.find('.search-container').attr('data-searchval').trim().toLowerCase() : '';
        $faqList.each(function() {
            var showFaq = true;
            showFaq = ifShowFaq($(this), dataTag, searchVal);
            if (showFaq) {
                $(this).removeClass('not-in-scope');
            } else {
                $(this).addClass('not-in-scope');
            }
        });
        
        ifShowNoResultIcon($comp);
        initListPagination($comp);
    }

    function bindEvent ($comp) {
        $comp.find('.mobile-filter-btn').on('click', function() {
            $comp.find('.faq-list-filter-bar').addClass('mobile-active');
            addBackdrop();
        });

        $comp.find('.faq-list-filter-bar .close-icon').on('click', function() {
            $comp.find('.faq-list-filter-bar').removeClass('mobile-active');
            removeBackdrop();
        });

        $comp.find('.faq-list-filter-bar .expand-icon').on('click', function() {
            $comp.find('.faq-list-filter-bar').toggleClass('close-state');
        });

        $comp.find('.filter-container .filter').on('click', function() {
            var $mobileFilterBtn = $comp.find('.mobile-filter-btn');
            $(this).addClass('active');
            $(this).siblings().removeClass('active');
            $comp.find('.faq-list-filter-bar .close-icon').trigger('click');
            $(this).attr('data-tag') === 'all' ? $mobileFilterBtn.removeClass('has-filtered') : $mobileFilterBtn.addClass('has-filtered');

            applyFilter($comp);
        });

        $comp.find('.item-num-for-page select.number-select').selectpicker({});

        $comp.find('.item-num-for-page select.number-select').on('loaded.bs.select', function() {
            $(this).parent().find('button').attr('title', '');
            updateDesktopPagination($comp)
            $comp.find('.faq-item.section').length <= 10 ? $comp.find('.faq-list-desktop-pagination').hide() : $comp.find('.faq-list-desktop-pagination').show() ;   
        });

        $comp.find('.item-num-for-page select.number-select').on('changed.bs.select', function() {
            var numberVal = $(this).val();
            $(this).parent().find('button').attr('title', '');
            $comp.find('.pagination-section').attr('data-num', numberVal);
            updateDesktopPagination($comp)
            if($comp.find('.pagination-section').attr('data-num') >= $comp.find('.faq-item.section').length){
                $comp.find('.pagination-section').hide()
            }else{
                $comp.find('.pagination-section').show()
            }
        });

        //search
        $comp.find('.search-container .faq-search-btn').on('click', function() {
            var searchVal = $comp.find('.search-container .faq-search').val();
            $comp.find('.search-container').attr('data-searchval', searchVal);
            applyFilter($comp);

            var title = "faq_list::search::" + searchVal + atModel.atSpliter + window.location.href;
            atModel.doAtEvent(title, 'action', event);
        });

        $comp.find('.search-container .search-clear-btn').on('click mousedown', function() {
            var $searchContainer = $(this).closest('.search-container');
            $searchContainer.find('.faq-search').val('');
            $searchContainer.attr('data-searchval','');
        });

        $comp.find('.search-container .faq-search').keyup(function(e) {
            if (e.keyCode == 13){
                $comp.find('.faq-search-btn').trigger('click');
            }
        });

        //don't support for ie11
        $comp.find('.search-container .faq-search').bind('search', function() {
            $comp.find('.faq-search-btn').trigger('click');
        });
  
    }

    $('body').on('click', '.faq-list-backdrop', function() {
        $('.faq-list-comp .faq-list-filter-bar .close-icon').trigger('click');
    });
    
    var resizeTimer;
    var currentBreakPoint = getCurrentBreakPoint();
    $('.faq-list-comp').each(function() {
        var $comp = $(this);
        bindEvent($comp);
        updateExpandIconState($comp);
        ifShowNoResultIcon($comp);
        if ($.cookie('wcmmode')!="edit" ) {
            initListPagination($comp);
        }

        $(window).on('resize', function() {
            if (resizeTimer) {
                clearTimeout(resizeTimer);
            }
            
	        resizeTimer = setTimeout(function() {
                if (getCurrentBreakPoint() !== currentBreakPoint) {
                    currentBreakPoint = getCurrentBreakPoint();
                    $comp.find('.faq-list-filter-bar .close-icon').trigger('click');
                    initListPagination($comp);
                }
                
                if (currentBreakPoint === 'DESKTOP') {
                    updateExpandIconState($comp);
                }
            }, 80);
        });

        $(window).on('scroll', function() {
            if (currentBreakPoint !== 'DESKTOP') {
                loadingItem($comp);
            }
        });
    });
});


var textGrid = (function ($) {
    var textGrid = {};
    textGrid.random = "";
    textGrid.downloadUrl = "";
    textGrid.textGridFormModal;
    textGrid.init = function () {
        $(document).ready(function () {
            var hasInit = {};
            $(".text-grid-form").not('.documentt-form').unbind('click').on("click", function(e){
                atDataAnalytic($(this), e);
           
                var hasForm = $(this).attr("data-has-form");
                var random = $(this).attr("data-randomNo");
                var formTarget =  $(this).attr('data-target')
                textGrid.downloadUrl = $(this).attr("href") || $(this).attr('data-href') || $(this).attr('data-mark');
                textGrid.random = random;
                if (hasForm == "true") {
                    e.stopPropagation();
                    e.preventDefault();
                    $(this).removeAttr('data-href')
                    textGrid.popupInit(random, $(this), formTarget, hasInit[random]);
                    if(!hasInit[random]) {
                        hasInit[random] = true
                    }
                    $('body').addClass('hideScroll');
                } else {
                    if(!isCN && $(this).attr('data-download-checklogin')&&$(this).attr('data-download-checklogin') == "true"){
                        header.checkLoginStatusForDownload(textGrid.downloadUrl, $(this), $(this), "text-grid");
                     } else {
                         if (textGrid.downloadUrl !== '#download-agreement' && hasForm != "true") {
                            e.stopPropagation();
                            e.preventDefault();
                            if(textGrid.downloadUrl){
                                window.open(textGrid.downloadUrl, '_blank')
                            }
                         }
                     } 
                }
            });

            var userType = $(".needLogin").attr("data-userType");
            var $textGrid = $(".text-grid-wrapper-check");

            if ($textGrid.length > 0 && $(".needLogin").length > 0 && userType != undefined) {
                var runMode = getLoginCookie("wcmmode");
                if (runMode == "edit" || runMode == "preview") {
                    return;
                }
                var hikId = $.cookie("HIKID");
                try {
                    hikId = atob(hikId);
                } catch (error) {
                    console.log("Login Error:" + error);
                }

                $textGrid.each(function () {
                    var mainCategory = $(this).attr("data-mainCategory");
                    var currentPagePath = $(this).attr("data-page-path");
                    var verifyUrl = $(this).attr("data-text-grid");
                    var showTextGridUrl = verifyUrl + ".usertype.json";

                    if (verifyUrl && mainCategory) {

                        $.ajax({
                            type: "GET",
                            url: showTextGridUrl,
                            data: {
                                hikId: hikId,
                                currentPagePath: currentPagePath
                            },
                            success: function (data) {
                                var jsonData = typeof data == "string" ? JSON.parse(data) : data;
                                if (jsonData.code == 200) {
                                    $("[data-text-grid='" + verifyUrl + "']").append($(jsonData.protectedComponent));
                                    // textGrid.init();
                                }
                            }
                        });
                    }

                })
            }

        });
    };

    textGrid.popupInit = function (random, $ele, target, hasInit) {
        var textGridFormModal = $("#text-grid-form-modal-" + random);
        var textGridFormFooter = textGridFormModal.find(".text-grid-form-footer");
        textGrid.textGridFormModal = textGridFormModal;
        var $textGridFormSubmit = textGridFormModal.find('.text-grid-form-submit');
        $textGridFormSubmit.attr("disabled", "disabled");
        var shadowBg = textGridFormModal.next();

        $(".verification img").attr("src", "/bin/hikvision/kaptcha.jpg?k=" + new Date().getTime());

        var textGridFormThanksMessage = textGridFormModal.find(".text-grid-form-thanks-message");
        var form = textGridFormModal.find(".text-grid-form-body");
        var textGridFormErrorMessage = textGridFormModal.find(".text-grid-form-error-message");
        var linkHref =  $ele.attr("href") || $ele.attr('data-href') || $ele.attr('data-mark');
        textGridFormModal.find("#text-grid-form-resource-url-" + random).val(document.location.origin + linkHref);

        textGridFormModal.parent().addClass('active');
        shadowBg.addClass("active");


        textGrid.addFormValidation(form);
        
        if(!hasInit) {
            textGrid.initOutlinedInputs(form);
            var countrySelect = textGrid.initCountrySelect(form);
            
            textGrid.autoFillUserInfo($ele, countrySelect);
    
            textGrid.initResetBtn(textGridFormFooter, textGridFormModal, countrySelect);
    
            initCloseBtn(textGridFormModal, textGridFormThanksMessage, textGridFormErrorMessage, shadowBg, random, countrySelect);
        }
        textGrid.validateRequiredMsg(form, textGridFormModal);

        //已登录用户自动填充用户信�

        $textGridFormSubmit.off('click').on('click', function (e) {
            if (form.valid()) {
                showVerifyModal(form, target)
            }
        })
    }

    textGrid.initCountrySelect = function (form) {
        var option = {
            onSelected: function ($ele, $input) {
                var val = $input.data('value');
                var code = $input.data('countryCode');
                $ele.find('input[name="countryCode"]').val(code).trigger('change').trigger('blur');
                $ele.find('input[name="Country"]').val(val).trigger('change').trigger('blur');
            }
        }

        return form.find('.hik-outlined-select').hikSelect(option);
    }

    textGrid.initOutlinedInputs = function (form) {
        form.outlinedFormLabelShrink();
    }

    function requiredCheckboxGroup(form) {
        var findInput = $(form).find(".text-grid-form-check:required");
        var result = true;
        findInput.each(function (key, item) {
            result = ($(item).find("input[type='checkbox']:checked").length > 0);
            if (!result) {
                return false;
            }
        });
        return result;
    }

    function checkRequired(form, submitBtn) {
        var requiredInputs = form.find('input:required');
        var isRequiredInputsFilled = true;
        for (var i = 0; i < requiredInputs.length; i++) {
            if ($(requiredInputs[i]).prop("type") === "checkbox") {
                if ($(requiredInputs[i]).is(":checked") === false) {
                    isRequiredInputsFilled = false;
                }
            } else {
                if ($(requiredInputs[i]).val() == "" || $(requiredInputs[i]).next('.error:visible').length) {
                    isRequiredInputsFilled = false;
                }
            }
        }
        var isRequiredCheckboxFilled = requiredCheckboxGroup(form);
        if (isRequiredInputsFilled && isRequiredCheckboxFilled) {
            submitBtn.removeAttr('disabled');
        } else {
            submitBtn.attr("disabled", "disabled");
        }
    }

    textGrid.validateRequiredMsg = function (form, textGridFormModal) {
        var $requiredInputElements = form.find('input:required');
        var $textGridFormSubmit = textGridFormModal.find('.text-grid-form-submit');

        $requiredInputElements.off('input change keyup').on('input change keyup', function () {
            setTimeout(function () {
                checkRequired(form, $textGridFormSubmit);
            }, 0)
        });

        form.off('change', '.text-grid-form-check input[type="checkbox"]').on('change', '.text-grid-form-check input[type="checkbox"]', function () {
            setTimeout(function () {
                checkRequired(form, $textGridFormSubmit);
            }, 0)
        });
    }

    textGrid.addFormValidation = function (form) {
        $.extend($.validator.messages, {
            required: Granite.I18n.get("This field is required."),
        });

        form.validate({
            focusInvalid: true,
            submitHandler: function (form, evt) {
                console.log('submit');
            },
            invalidHandler: function (event, validator) {
                console.log('invalid');
            },
            errorElement: "em",
            errorPlacement: function (error, element) {
                element.after(error)
            },
            highlight: function (element, errorClass, validClass) {
                if ($(element).parent().hasClass('hik-select-input')) {
                    $(element).parent().parent().parent().addClass('err')
                }
                $(element).siblings('label').addClass('err-lbl');
                $(element).parent().addClass('err');
            },
            unhighlight: function (element, errorClass, validClass) {
                if ($(element).parent().hasClass('hik-select-input')) {
                    $(element).parent().parent().parent().removeClass('err')
                    $(element).siblings('em').hide();
                }
                $(element).siblings('label').removeClass('err-lbl');
                $(element).parent().removeClass('err');
            },
            rules: {
                Email: {
                    required: true,
                    regex: /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/,
                },
            },
            messages: {
                Email: {
                    regex: Granite.I18n.get("Please enter valid email address.")
                }
            }
        });
    }

    textGrid.submitForm = function (form, target) {
        //提交表单
        var currentUrl = window.location.href;
        $("input[name='Submitted_Page__c']").val(currentUrl);
        var action = form[0].action;
        var formData = new FormData(form[0]);
        var headers = getFormHeader(form);
        $.ajax({
            type: 'POST',
            url: action,
            data: formData,
            processData: false,
            contentType: false,
            beforeSend: function (request) {
                if (headers) {
                    $(headers).each(function (index, item) {
                        request.setRequestHeader(item.key, item.value);
                    });
                }
                request.setRequestHeader("KAPTCHA_SESSION_KEY", storeManager.cookie.get("KAPTCHA_SESSION_KEY"));
            }
        }).done(function (data) {
            $(".verification img").attr("src", "/bin/hikvision/kaptcha.jpg?k=" + new Date().getTime());
            form.next().find(".text-grid-form-submit").removeClass("loading");
            if (checkResultSuccess(data)) {
                textGrid.submitSuccess(target);
            } else {
                textGrid.showErrorMsg(data.message);
            }
        }).fail(function (resData) {
            $(".verification img").attr("src", "/bin/hikvision/kaptcha.jpg?k=" + new Date().getTime());
            form.next().find(".text-grid-form-submit").removeClass("loading");
            var resultBean = null;
            try {
                resultBean = JSON.parse(resData.responseText);
            } catch (error) {
                console.error(error.toString());
            }
            if (resultBean) {
                textGrid.showErrorMsg(resultBean.message);
            } else {
                textGrid.showErrorMsg("Unknown Error occurred!");
            }
        }).complete(function (XMLHttpRequest, status) {
            // for at event
            var module = "text_grid_form::Submit" + atModel.atSpliter + window.location.href;
            atModel.doAtEvent(module, 'action', event);
        });

        // form.find('input[type="submit"]').addClass("loading");
    }

    textGrid.submitSuccess = function (target) {
        var textGridFormModal = $("#text-grid-form-modal-" + textGrid.random);
        var shadowBg = textGridFormModal.next();
        var textGridFormThanksMessage = textGridFormModal.find(".text-grid-form-thanks-message");
        textGridFormModal.find(".text-grid-form-header").hide();
        textGridFormModal.find(".text-grid-form-body").hide();
        textGridFormModal.find(".text-grid-form-footer").hide();
        textGridFormThanksMessage.addClass("active");
        shadowBg.addClass("active");
        setTimeout(function(){
            textGridFormThanksMessage.removeClass("active");
            shadowBg.removeClass("active");
            $("body").removeClass("hideScroll")
            $(".text-grid-form-close").trigger("click")
        }, 1500)
        //表单提交成功后下�
        window.open(textGrid.downloadUrl, target)
        //window.location.href = textGrid.downloadUrl;
    }

    textGrid.autoFillUserInfo = function ($ele, countrySelect) {
        loginUtil.autoFillUserInfoInForm(textGrid.renderUserInfo, $ele, countrySelect);
    }

    textGrid.initResetBtn = function (textGridFormFooter, textGridFormModal, countrySelect) {
        textGridFormFooter.find(".text-grid-form-reset").off('click').on("click", function () {
            resetForm(textGridFormModal, countrySelect);
        });
    }

    textGrid.showErrorMsg = function (text) {
        var content = Granite.I18n.get(text);
        textGrid.textGridFormModal.find(".text-grid-form-error-message").addClass("active");
        textGrid.textGridFormModal.find(".text-grid-form-error-message-text").empty().html(content);
        textGrid.textGridFormModal.next().addClass("active");
    }

    textGrid.renderUserInfo = function (userInfo, $ele, countrySelect) {
        var $textGridContainer = $ele.parents('.text-grid-container');
        $textGridContainer.find('#text-grid-form-first-name-' + textGrid.random).val(userInfo.firstName)
        $textGridContainer.find('#text-grid-form-last-name-' + textGrid.random).val(userInfo.lastName)
        $textGridContainer.find('#text-grid-form-email-' + textGrid.random).val(userInfo.email);
        $textGridContainer.find('#text-grid-form-company-' + textGrid.random).val(userInfo.company);
        $textGridContainer.find('#text-grid-form-post-code-' + textGrid.random).val(userInfo.postcode);
        $textGridContainer.find('#text-grid-form-additional-details-' + textGrid.random).val(userInfo.address);
        countrySelect.changeSelectedVal(userInfo.country);
    }
     
    function atDataAnalytic($this, e) {
        //处理掉 #download-agreement
        var splitCompnent = $this.parent().parent().attr('class').split('-');
        var compnentName = splitCompnent[0] === 'offering' ? splitCompnent[0] : splitCompnent[0] + '-' + splitCompnent[1];
        var linkHref = $this.attr('data-href') || $this.attr('data-link') || $this.attr('data-mark');
        if(!linkHref)
            return;
        window.compnentName = compnentName;
        var atModule = compnentName + '::' + $this.data('pre-module') + '::' + lastNode(linkHref).replace('&', '') + atModel.atSpliter + window.location.href.replace('#download-agreement', '')
        atModel.doAtEvent(atModule, 'download', e);
    }



    function initPuzzleVerification(form, verifyCode, timer1, target) {
        $("#mpanel4").slideVerify({
            type: 2,
            vOffset: 5,
            vSpace: 5,
            blockSize: {
                width: "40px",
                height: "40px",
            },
            success: function () {
                $(form).find('.verification input[name=Verification]').val(verifyCode);
                $('.verifyModalWrap').first().hide()
                textGrid.submitForm(form, target)
                clearTimeout(timer1)
            },
        });
        $('.verifyModalWrap .close-Verification').click(function () {
            $('.verifyModalWrap').first().hide()
            clearTimeout(timer1)
        })
    }

    /*
     * show verifyModalWrap
     */
    function showVerifyModal(form, target) {
        var verifyCode = '';
        $.ajax({
            type: "get",
            url: "/bin/hikvision/form-secure.image.json?t=" + new Date().getTime(),
            async: false,
            success: function (res) {
                if (res.code == 0) {
                    $('.verifyModalWrap').first().show();
                    verifyCode = res.data;
                    var timer1 = setTimeout(function () {
                        $('.verifyModalWrap').first().hide();
                        clearTimeout(timer1)
                    }, 50000)

                    initPuzzleVerification(form, verifyCode, timer1, target);
                }
            },
        });
    }

    function initCloseBtn(textGridFormModal, textGridFormThanksMessage, textGridFormErrorMessage, shadowBg, random, countrySelect) {
        textGridFormModal.find(".text-grid-form-close").unbind("click").on("click", function () {
            $("#text-grid-form-modal-" + random).parent().removeClass('active');
            textGridFormThanksMessage.removeClass("active");
            textGridFormErrorMessage.removeClass("active");

            resetForm(textGridFormModal, countrySelect);
            activeFormModal();
        });

        textGridFormThanksMessage.find(".text-grid-form-thanks-message-close").unbind("click").on("click", function () {
            $("#text-grid-form-modal-" + random).parent().removeClass('active');
            textGridFormThanksMessage.removeClass("active");

            activeFormModal();
        });


        textGridFormErrorMessage.find(".text-grid-form-error-message-close").unbind("click").on("click", function () {
            textGridFormErrorMessage.removeClass("active");
        });

        function activeFormModal() {
            textGridFormModal.find(".text-grid-form-body").show();
            textGridFormModal.find(".text-grid-form-footer").show();
            textGridFormModal.find(".text-grid-form-header").show();
            shadowBg.removeClass("active");
            $('body').removeClass("hideScroll");
        }
    }

    function resetForm(textGridFormModal, countrySelect) {
        textGridFormModal.find(".text-grid-form-field input[type='text']").val("");
        textGridFormModal.find(".text-grid-form-check input[type='checkbox']").prop("checked", false);
        textGridFormModal.find('.hasVal').removeClass('hasVal');
        textGridFormModal.find('.text-grid-form-submit').attr("disabled", "disabled");
        countrySelect.reset();
    }

    $.each($('.main-category-link'), function (index, item) {
        var atModule = $(this).data('pre-module')
        var $href = $(this).data('link') || $(this).data('href')
        if ($href) {
            $(this).attr('data-at-module', atModule)
            $(this).addClass('cursor')
        }
    })
    return textGrid;
})($);

textGrid.init();

(function (document, $) {
    var nextI18n = Granite.I18n.get("next");
    var backI18n = Granite.I18n.get("back");
    var allRegionCity = Granite.I18n.get("All Regions/Provinces/States");
    var currentArea;
    var currentCountry;
    var currentRegionWebsite;
    var $cppDataWrapper;
    var $cppFilterWrapper;
    var showRegionFilters;
    var notPageCountries;
    var regionFilterInput;

    /**
     * check mobile
     */
    function isMobileBreakPoint() {
        if ($(window).width() < 992) {
            return true;
        }
        return false;
    }

    /**
     * init pagenation
     */
    function initPagenation(size) {
        $cppDataWrapper.find(".holder").jPages({
            containerID: "cpp-list-wrapper",
            perPage: size || 10,
            previous: backI18n,
            next: nextI18n,
            keyBrowse: true,
            animation: "slideInRight",
            callback: function (pages, items) {
                var showingItems = items.showing;
                if ($(showingItems).hasClass('active')) {
                    $.each($(showingItems).find('.cpp-image-wrapper').find('img'), function (i, t) {
                        $(this).attr('src', $(this).data('original'))
                    })
                }
                // $(showingItems).find('.lazy').lazyload();
            }
        });
    }

    function initSelectCountry(filterCountry) {
        // filter region website
        var $subregionContainer = $(".filter-subregion-container");
        if (showRegionFilters === 'true') {
            $subregionContainer.hide();
            $subregionContainer.find(".region-option").not(".all-region-option").hide();
            var $countryRegionOption = $(".filter-subregion-container .region-option[data-country='" + filterCountry + "']");
            if ($countryRegionOption.length > 0) {
                $countryRegionOption.show();
                $subregionContainer.show();
                //显示时，regionFilterInput内容初始化
                regionFilterInput.val(allRegionCity);
                refreshFilterResults(currentArea, currentCountry, regionFilterInput.val());
            }
        } else {
            $subregionContainer.hide();
        }
    }

    /**
     * init filter event
     */
    function initFilterEvent() {

        // area click
        $cppFilterWrapper.find(".filter-regions .filter-region-item").on('click', function () {
            var $this = $(this);
            var filterArea = $this.attr('data-area');
            var changeSection = !$this.hasClass('active');

            var lastArea = currentArea;
            if (filterArea === lastArea) {
                $cppFilterWrapper.find('.filter-country-item.active').addClass('mobile-open').closest('.filter-regions-container').addClass('filter-opened');
                addBackdrop();
                return;
            }

            // select area
            $this.siblings().removeClass('active').removeClass('mobile-open');
            $this.addClass('active').addClass('mobile-open');

            // select country line
            $this.closest('.filter-regions').addClass('line-active');
            var activeCountry = $cppFilterWrapper.find('.filter-country-item[data-area="' + filterArea + '"]');
            activeCountry.siblings().removeClass('active').removeClass('mobile-open').closest('.filter-regions-container').removeClass('filter-opened');
            activeCountry.addClass('active').addClass('mobile-open').closest('.filter-regions-container').addClass('filter-opened');

            // select first country
            var firstCountry = $cppFilterWrapper.find('.filter-country-item[data-area="' + filterArea + '"]').find('.filter-country').eq(0);
            firstCountry.siblings().removeClass('active');
            firstCountry.addClass('active');
            addBackdrop();

            // filter region website
            var filterCountry = firstCountry.attr('data-country');
            initSelectCountry(filterCountry);

            refreshFilterResults(filterArea, filterCountry, regionFilterInput.val());
            currentArea = filterArea;
            currentCountry = filterCountry;
        });
        $.each($cppFilterWrapper.find('.filter-country-item'),function(){
            if($(this).hasClass('mobile-open')){
                $(this).closest('.filter-regions-container').addClass('filter-opened');
            }
        })


        // country click
        $cppFilterWrapper.find(".filter-countries .filter-country-item .filter-country").on('click', function () {
            removeBackdrop();
            var $this = $(this);

            var filterArea = $this.attr('data-area');
            var filterCountry = $this.attr('data-country');
            var lastArea = currentArea;
            var lastCountry = currentCountry;
            var changeSection = !$this.hasClass('active');

            if (filterArea === lastArea && filterCountry === lastCountry) {
                $this.closest('.filter-country-item').removeClass('mobile-open').closest('.filter-regions-container').removeClass('filter-opened');;
                return;
            }

            // select country
            if (showRegionFilters === 'true') {
                $this.siblings().removeClass('active');

                // filter region website
                initSelectCountry(filterCountry);
            } else {
                $cppFilterWrapper.find(".filter-countries .filter-country-item .filter-country").removeClass('active');
            }
            $this.addClass('active');

            if (isMobileBreakPoint()) {
                $this.closest('.filter-country-item').removeClass('mobile-open').closest('.filter-regions-container').removeClass('filter-opened');
            }

            refreshFilterResults(filterArea, filterCountry, regionFilterInput.val());
            currentArea = filterArea;
            currentCountry = filterCountry;
        });

        // more btn click
        $cppFilterWrapper.find(".more-btn").on('click', function () {
            $(this).toggleClass('active-more active-less');
            $(this).closest('.filter-items-container').find('.filter-countries').toggleClass('filter-close');
        });

        // search button click event
        $cppFilterWrapper.find(".cpp-search-btn").on('click', function (e) {
            e.preventDefault();
            refreshFilterResults(currentArea, currentCountry, regionFilterInput.val());
        });

        // search input enter event
        $cppFilterWrapper.find(".cpp-search").on('keydown', function (e) {
            if (e.keyCode == 13) {
                refreshFilterResults(currentArea, currentCountry, regionFilterInput.val());
            }
        });

        // reset filter event
        $cppFilterWrapper.find('.resetAll').click(function () {
            $cppFilterWrapper.find(".cpp-search").val("");
            regionFilterInput.val("");
            refreshFilterResults(currentArea, currentCountry, regionFilterInput.val());
        });

        // region website event
        regionFilterInput.change(function (e) {
            e.preventDefault();
            var regionWebSite = $(this).val();
            if (!isNull(regionWebSite)) {
                currentRegionWebsite = regionWebSite;
                refreshFilterResults(currentArea, currentCountry, regionWebSite);
            }
        });

        // region website event
        regionFilterInput.click(function (e) {
            $("#filterRegion").find(".filter-region-list").toggle();
            $(this).parent().toggleClass("region-filter-up");
            $(this).parent().toggleClass("region-filter-down");
        });
        // region website select event
        $(".filter-subregion-container .region-option").click(function () {
            var regionWebSite = $(this).attr("data-region");
            if (isNull(regionWebSite)) {
                regionFilterInput.val(allRegionCity);
                // region sort
                var cppList = $("#cpp-list-wrapper .cpp-item");
                var cppListHtml = quickSortCppList(true, cppList);
                $("#cpp-list-wrapper").html(cppListHtml);
            } else {
                regionFilterInput.val(regionWebSite);
            }
            currentRegionWebsite = regionWebSite;
            refreshFilterResults(currentArea, currentCountry, regionWebSite);
            regionFilterInput.parent().toggleClass("region-filter-up");
            regionFilterInput.parent().toggleClass("region-filter-down");
        })
    }

    /**
     * refresh results
     */
    function refreshFilterResults(area, country, regionWebsite) {
        var attrFilter = '.cpp-item';
        if (!isNull(area)) {
            attrFilter += '[data-area="' + area + '"]';
        }
        if (!isNull(country)) {
            attrFilter += '[data-country="' + country + '"]';
        }
        //region筛选项可见时，添加筛选条件
        if ($(".filter-subregion-container").is(":visible") && !isNull(regionWebsite) && allRegionCity !== regionWebsite) {
            if (regionWebsite === "National") {
                attrFilter += '[data-subtype="National Distributor"]';
            } else {
                attrFilter += '[data-regionWebsite="' + regionWebsite + '"]';
                // br 只显示该province的regional distributor
                if (!isNull(country) && country === "BR") {
                    attrFilter += '[data-subtype="Regional Distributor"]';
                }
                // it show national
                if (!isNull(country) && country === "IT") {
                    attrFilter += ',[data-regionWebsite="NATIONAL"]';
                }
            }
        }
        var showList = $cppDataWrapper.find(attrFilter);

        // filter search input
        var $searchInput = $cppFilterWrapper.find('.cpp-search');
        if ($searchInput && $searchInput.val()) {
            var searchValue = $searchInput.val().trim().toLowerCase();
            if (searchValue.length > 0) {
                showList = showList.filter(function (i, n) {
                    if ($(n).find('.cpp-title').text().toLowerCase().indexOf(searchValue) !== -1) {
                        return true;
                    } else {
                        return false;
                    }
                });
            }
        }
        var showListSort = quickSortCppList(true, showList);

        var cppItem = $cppDataWrapper.find('.cpp-item');
        cppItem.removeClass('active');
        // cppItem.removeClass('animated');
        // cppItem.removeClass('slideInRight');
        cppItem.removeClass('jp-hidden');
        showListSort.addClass('active');
        // var activeItems = $cppDataWrapper.find('.cpp-item.active');
        showListSort.prependTo("#cpp-list-wrapper");

        updateFilterMoreBtnState($cppFilterWrapper);
        var pageSize = null;
        if (notPageCountries && notPageCountries.indexOf(country) >= 0) {
            pageSize = showList.length;
        }
        initPagenation(pageSize);
    }

    function quickSortCppList(flag, $cppList) {
        var $newList = Array.prototype.sort.call($cppList, function (a, b) {
            return flag ? ($(a).attr("data-index") - 0) - ($(b).attr("data-index") - 0) : ($(b).attr("data-index") - 0) - ($(a).attr("data-index") - 0)
        });
        return $newList;
    }

    /**
     * update more btn state
     */
    function updateFilterMoreBtnState($targetComp, changeSection) {
        var $filterSection = $targetComp.find('.filter-country-item.active');
        var $moreBtn = $targetComp.find('.filter-search-container .more-btn');
        var $filterItems = $moreBtn.closest('.filter-items-container').find('.filter-countries');
        var filterContainerHeight = $filterSection.height();

        if (isMobileBreakPoint()) {
            $moreBtn.removeClass('active-more active-less');
            $filterItems.removeClass('filter-close');
        } else {
            if (filterContainerHeight > 35) {
                if (changeSection || (!$moreBtn.hasClass('active-more'))) {
                    $moreBtn.addClass('active-less');
                    $moreBtn.removeClass('active-more');
                    $filterItems.removeClass('filter-close');
                }
            } else {
                $moreBtn.removeClass('active-more active-less');
                $filterItems.removeClass('filter-close');
            }
        }
    }

    /**
     * mobile backdrop
     */
    function updateBackdropPosition() {
        if (isMobileBreakPoint() && $('.filter-country-item.active.mobile-open').length > 0) {
            var $filterContainer = $cppFilterWrapper.find('.filter-items-container');
            var containerTop = $filterContainer.offset().top - $(window).scrollTop();
            var containerHeight = $filterContainer.outerHeight();
            var dropTop = containerHeight + containerTop;
            $('.new-cpp-partners-backdrop').css('top', dropTop);
        }
    }

    /**
     * add backdrop
     */
    function addBackdrop() {
        if (isMobileBreakPoint() && showRegionFilters === 'true') {
            if ($('.new-cpp-partners-backdrop').length === 0) {
                var backdrop = '<div class="new-cpp-partners-backdrop"></div>';
                $('body').append(backdrop);
                $('body').addClass('new-cpp-partners-backdrop-open');
                $('.new-cpp-partners-backdrop').css("display", "block");
            } else {
                $('body').addClass('new-cpp-partners-backdrop-open');
                $('.new-cpp-partners-backdrop').css("display", "block");
            }
            updateBackdropPosition();
        }
    }

    /**
     * remove backdrop
     */
    function removeBackdrop() {
        $('.new-cpp-partners-backdrop').css("display", "none");
        $('body').removeClass('new-cpp-partners-backdrop-open');
    }

    $(document).ready(function () {
    //tfs-60366 cpp filter update
//        $.each($('.filter-countries .filter-country-item .filter-country'), function(index,element){
//            var filterCountry = $(this).attr('data-country');
//            if(filterCountry === 'HK' || filterCountry === 'MO'){
//                var chinaIndex = $(this).text().indexOf('China')
//                var firstCountry =  $(this).text().slice(1, chinaIndex + 5)
//                var secondCountry = $(this).text().slice(chinaIndex+6, $(this).text().length)
//                $(this).text(secondCountry+', ' +firstCountry)
//            }
//        })
        $cppDataWrapper = $(".cpp-data-wrapper");
        $cppFilterWrapper = $(".filter-regions-wrapper");
        showRegionFilters = $cppFilterWrapper.attr("data-showRegionFilters");
        notPageCountries = $cppFilterWrapper.attr("data-notPageCountries");
        regionFilterInput = $('#region-filter-input');
        initFilterEvent();
        if ($cppDataWrapper.length > 0) {
            addBackdrop();
        }

        updateFilterMoreBtnState($cppFilterWrapper);
        currentArea = $cppFilterWrapper.attr('data-area');
        if (isNull(currentArea)) {
            currentArea = $cppFilterWrapper.find(".filter-region-item.active").first().attr("data-area");
        }
        currentCountry = $cppFilterWrapper.attr('data-country');
        if (isNull(currentCountry)) {
            currentCountry = $cppFilterWrapper.find(".filter-country.active").first().attr("data-country");
        }
        initSelectCountry(currentCountry);
        refreshFilterResults(currentArea, currentCountry);

        $(window).resize(function () {
            updateFilterMoreBtnState($('.new-cpp-partners'));
            if ($cppDataWrapper.length > 0) {
                addBackdrop();
            }
            if (!isMobileBreakPoint()) {
                removeBackdrop();
            }
        });
    });
})(document, $);
var tppPartnersModule = (function ($) {
  var tppPartners = {};
  var i18n_next = Granite.I18n.get("next");
  var i18n_back = Granite.I18n.get("back");
  tppPartners.jPagesInit = function () {
    $('.tpp-layout-hide-wrapper').append($('.tpp-layout1-wrapper').html());
    $(".tpp-result-grid__layout1-wrapper").find(".holder").jPages({
      containerID: "tpp-layout1-wrapper",
      perPage: 10,
      previous: i18n_back,
      next: i18n_next,
      keyBrowse: true,
      animation: "slideInRight",
      callback: function (pages, items) {
        var showingItems = items.showing;
        $(showingItems).find('.lazy').lazyload();
      }
    });
  };
  tppPartners.currentFilters = [];
  tppPartners.bindSubcategoryClick = function () {

    // filter button click event
    $(".tpp-partners .filter-header-wrapper .navbar-nav .sub-item").click(function () {
      var dataSubcategory = $(this).attr('data-subcategory');

      if (tppPartners.currentFilters.indexOf(dataSubcategory) >= 0) {
        return;
      }

      var isViewAll = dataSubcategory === '*';
      if (isViewAll) {
        tppPartners.currentFilters = [];

        $(".tpp-partners .filter-header-wrapper .navbar-nav .sub-item.active").toggleClass('active');
        $(this).toggleClass('active');
        $(".filterTagContainer").empty();
      } else {
        tppPartners.currentFilters.push(dataSubcategory);

        $(".tpp-partners .filter-header-wrapper .navbar-nav .sub-item-all.active").toggleClass('active');
        $(this).toggleClass('active');

        var filteredTag = $('<button data-verticals="' + dataSubcategory + '" class="btn-products btn">'
            + dataSubcategory
            + '<img class="close-btn close-btn-filter" src="/etc/clientlibs/it/resources/icons/baseline-close-24px.svg" alt="Close">'
            + '</button>');

        filteredTag.on('click', function () {
          filteredTag.remove();
          var dataValue = $(this).attr('data-verticals');
          var dataIndex = tppPartners.currentFilters.indexOf(dataValue);
          tppPartners.currentFilters.splice(dataIndex, 1);
          $(".tpp-partners .filter-header-wrapper .navbar-nav .sub-item.active[data-subcategory='" + dataValue + "']").toggleClass('active');

          tppPartners.refreshFilterResults(false);
        });
        $(".filterTagContainer").append(filteredTag);
      }

      $(".tpp-partners .filter-header-wrapper .navbar-nav .nav-link.active").toggleClass('active');
      $(".tpp-partners .filter-header-wrapper .navbar-nav .nav-link[data-category='Vertical Industry Type']").toggleClass('active');

      tppPartners.refreshFilterResults(isViewAll);
    });

    // reset filter
    $('.tpp-partners .filter-header-wrapper .navbar .resetAll').click(function () {
      if (tppPartners.currentFilters.length > 0) {
        $(".filterTagContainer").empty();
        tppPartners.currentFilters = [];
        tppPartners.refreshFilterResults();
        $(".tpp-partners .filter-header-wrapper .navbar-nav .sub-item.active").toggleClass('active');
        $(".tpp-partners .filter-header-wrapper .navbar-nav .nav-link.active").toggleClass('active');
      }
    });

  };

  tppPartners.refreshFilterResults = function (isViewAll) {
    $('.tpp-layout1-wrapper').empty();
    if (tppPartners.currentFilters.length === 0 || isViewAll) {
      $('.tpp-layout1-wrapper').append($('.tpp-layout-hide-wrapper .tpp-layout1-content-wrapper'));
    } else {
      $.each(tppPartners.currentFilters, function (index, value) {
        $('.tpp-layout1-wrapper').append($('.tpp-layout-hide-wrapper .tpp-layout1-content-wrapper[data-verticals*="' + value + '"]'));
      });
    }
      initCtaEvents();
    tppPartners.jPagesInit();

  };
  var initCtaEvents = function () {
    var intBtn = $(".tpp-btn-integration");
    var solBtn = $(".tpp-btn-solution");
    if (solBtn) {
      solBtn.on("click", function (evt) {
        var _this = $(this);
        var _url = _this.attr('url');
        if (_url != undefined && _url != null) {
          window.open(_url, "_blank");
        }
      });
    }
    if (intBtn) {
      intBtn.on("click", function (evt) {
        var _this = $(this);
        var _url = _this.attr('url');
        if (_url) {
          window.open(_url, "_blank");
        }
      });
    }
  }
  tppPartners.init = function () {
    $(document).ready(function () {
      initCtaEvents();
      tppPartners.jPagesInit();
      tppPartners.bindSubcategoryClick();
    });
  };


  return tppPartners;
})($);

tppPartnersModule.init();
$(document).ready(function() {
  initSolutionsIndustryGalleryComp();
});

function initSolutionsIndustryGalleryComp() {
    function updateBg($comp) {
        $comp.find('.bg-box').each(function() {
            var bgPath;
            if (getCurrentBreakPoint() === 'DESKTOP') {
                bgPath = $(this).attr('data-img');
            } else {
                bgPath = $(this).attr('data-mobile-img') ? $(this).attr('data-mobile-img') : $(this).attr('data-img');
            }

            $(this).css('background-image','url('+ bgPath +')');
        });
    }

    function initCarousel($comp) {
        var $carousel = $comp.find('.scenario-card-list');
        var $dotsContainer = $comp.find('.dots-container');
        if ($carousel.hasClass('mobile-no-carousel')) return;

        if(getCurrentBreakPoint() !== 'DESKTOP' && !$carousel.hasClass('initialized') && $carousel.is(':visible')) {
            $carousel.find('.scenario-special').remove();
            $carousel.slick({
                arrows: false,
                infinite: true,
                autoplay: false,
                centerMode: true,
                centerPadding: '15px',
                dots: true,
                dotsClass: 'process-dots',
                appendDots: $dotsContainer,
                slidesToShow: 1
            });

            $carousel.addClass('initialized');
        } else if (getCurrentBreakPoint() === 'DESKTOP' && $carousel.hasClass('initialized')) {
            $carousel.slick('unslick');
            $carousel.removeClass('initialized');
        }
    }

    function relatedTabEventInit($comp) {
        var $tabs = $comp.closest('.mult-tabs-container-comp');
        if ($tabs.length) {
            $tabs.find('.tabs-wrapper .tab-item .content').on('multi-tabs-change',function() {
                initCarousel($comp);
            })
        }
    }

    $('.solutions-scenario-gallery-comp').each(function() {
        var $comp = $(this);
        relatedTabEventInit($comp);
        updateBg($comp);
        initCarousel($comp);
        var resizeTimer;
        var currentBreakpoint = getCurrentBreakPoint();
        $(window).on('resize', function() {
            if (resizeTimer) {
                clearTimeout(resizeTimer);
            }

            resizeTimer = setTimeout(function() {
                if(currentBreakpoint !== getCurrentBreakPoint()) {
                    currentBreakpoint = getCurrentBreakPoint();
                    updateBg($comp);
                    initCarousel($comp);
                }
            }, 50);
        })
    });
};



$(document).ready(function () {
   var $productGroup = $(".product-trials-and-promotions-form .interested-product-group");
   if (!$productGroup.length) return;
   function initSmartTryRequire() {
       var $smartTryGroup = $('.product-trials-and-promotions-form .smart-try-group');
       if($smartTryGroup.hasClass('hide')) {
           $smartTryGroup.find('.hidden-value').removeAttr("required");
           $smartTryGroup.find('.hidden-value').removeAttr("requredHidden");
       } else {
           $smartTryGroup.find(".hidden-value").attr("requredHidden", "true");
       }
   }

    function initSpecialOffeRequire() {
        var $specialOfferGroup = $('.product-trials-and-promotions-form .special-offer-group');
        if($specialOfferGroup.hasClass('hide')) {
            $specialOfferGroup.find('.form-group:not(.message-group)').removeClass("required-checkbox");
        } else {
            $specialOfferGroup.find('.form-group:not(.message-group)').addClass("required-checkbox");
        }
    }

    function updateAtModal() {
        var $smartTryGroup = $('.product-trials-and-promotions-form .smart-try-group');
        var $specialOfferGroup = $('.product-trials-and-promotions-form .special-offer-group');
        var dataModule = "invalid:submit";
        if (!$smartTryGroup.hasClass('hide') && !$specialOfferGroup.hasClass('hide')) {
            dataModule = "smart_try_application_form::submit::product_trials_and_promotions_form";
        } else if (!$smartTryGroup.hasClass('hide')){
            dataModule = "smart_try_application_form::submit::smart_trail_form";
        } else if (!$specialOfferGroup.hasClass('hide')) {
            dataModule = "smart_try_application_form::submit::special_offer_form";
        }

        $('.product-trials-and-promotions-form').attr('data-at-module',dataModule)
    }

     var optionsGroup = $productGroup.find(".option-list");
     var optionsFooter = $productGroup.find(".mobile-action");
     var optionsHeader = $productGroup.find(".mobile-title");

     optionsFooter.on('click', function () {
         optionsGroup.find(".checkbox-inline.display-pc").toggle("display-mobile");
         var headerSpan = optionsHeader.find("span");
         var footerSpan = $(this).find("span");
         headerSpan.toggleClass("full-arrow-down");
         headerSpan.toggleClass("full-arrow-up");
         footerSpan.toggleClass("arrow-down");
         footerSpan.toggleClass("arrow-up");
         if (footerSpan.hasClass("arrow-up")) {
             $(this).html(Granite.I18n.get('Less') + '<span class="arrow-up"></span>');
         } else {
             $(this).html(Granite.I18n.get('More') + '<span class="arrow-down"></span>');
         }
     });

     optionsHeader.on('click', function () {
         optionsGroup.find(".checkbox-inline.display-pc").toggle("display-mobile");
         var headerSpan = $(this).find("span");
         var footerSpan = optionsFooter.find("span");
         headerSpan.toggleClass("full-arrow-down");
         headerSpan.toggleClass("full-arrow-up");
         footerSpan.toggleClass("arrow-down");
         footerSpan.toggleClass("arrow-up");
         if (footerSpan.hasClass("arrow-up")) {
             optionsFooter.html(Granite.I18n.get('Less') + '<span class="arrow-up"></span>');
         } else {
             optionsFooter.html(Granite.I18n.get('More') + '<span class="arrow-down"></span>');
         }
     });

     $('.product-trials-and-promotions-form .other-radio-option').on('change', function() {
         $('.product-trials-and-promotions-form .other-brand-input').removeClass('hide');
         $('.product-trials-and-promotions-form .other-brand-input').val('');
     })

     $('.product-trials-and-promotions-form .other-option-remove').on('change', function() {
        $('.product-trials-and-promotions-form .other-brand-input').addClass('hide');
        $('.product-trials-and-promotions-form .other-brand-input').val('');
     })

    $('.product-trials-and-promotions-form .smart-trial-type').on('change', function() {
        if($(this).prop('checked')) {
            $('.product-trials-and-promotions-form .smart-try-group').removeClass('hide');
        } else {
            $('.product-trials-and-promotions-form .smart-try-group').addClass('hide');
        }
        initSmartTryRequire();
        updateAtModal();
    })

    $('.product-trials-and-promotions-form .special-offer-type').on('change', function() {
        if($(this).prop('checked')) {
            $('.product-trials-and-promotions-form .special-offer-group').removeClass('hide');
        } else {
            $('.product-trials-and-promotions-form .special-offer-group').addClass('hide');
        }
       initSpecialOffeRequire();
       updateAtModal();
    })

    $('.product-trials-and-promotions-form .smart-try-group .download-tip').on('click', function(e){
        var $download = $(this).find("a");
        var downloadLink = $download.attr("href");
        var linkName = downloadLink.substring(downloadLink.lastIndexOf("/") + 1);

        atModel.doAtEvent("smart_try_application_form::click::" + linkName, 'action', e);
    });

    function checkNdList(country, $form) {
        var $ndChannel = $form.find('.nd-channel');
        var $ndChannelFormGroup =  $ndChannel.find('.channel-form-group');
        var $ndList = $form.find('.nd-list');
        var $dropdownWrapper = $ndList.find('.dropdown-wrapper');
        var $ndListItem = $dropdownWrapper.find('li[data-country="'+country+'"]');
        $form.find('input[name="channel"]').attr('checked', false).trigger('change');
        if ($ndListItem.length > 0) {
            $ndChannel.removeClass('hide');
            $ndChannelFormGroup.addClass("required-checkbox");
        } else {
            $ndChannel.addClass('hide');
            $ndChannelFormGroup.removeClass("required-checkbox");
        }

        checkRequired( $form, $form.find("button[type='submit']"));
    }

    function updateEventForm(showTypeArticle, checkSmartTrial, checkSpecialOffer, $form) {
        if (showTypeArticle) {
            $form.find('.form-type-article').removeClass('hide').addClass('required-checkbox');
        } else {
            $form.find('.form-type-article').addClass('hide').removeClass('required-checkbox');
        }
        $("input[name=smartTrial]").prop('checked', checkSmartTrial).trigger('change');
        $("input[name=specialOffer]").prop('checked', checkSpecialOffer).trigger('change');
    }

    function checkEvent(activityType, $form) {
        switch(activityType) {
            case "0":
                updateEventForm(false, true, false, $form);
                break;
            case "1":
                updateEventForm(false, false, true, $form);
                break;
            case "2":
                 updateEventForm(true, false, false, $form);
                break;
            default:
                updateEventForm(false, false, false, $form);
        }
    }

    $('.product-trials-and-promotions-form input[name="country"]').on('change', function(e){
        var $target = $(this);
        var $form = $('.product-trials-and-promotions-form');
        var country = $target.val();
        var $dropdownWrapper = $target.closest('.dropdown-wrapper');
        var $targetOption = $dropdownWrapper.find('.dropdown li[data-value="' + country + '"]');
        var activityType = $targetOption.attr('data-activity');
        checkNdList(country, $form);
        checkEvent(activityType, $form);
    });

    $('.product-trials-and-promotions-form input[name=channel]').on('change', function(e){
        var $that = $(this);
        var value = $that.val();
        var $form = $('.product-trials-and-promotions-form');
        var country =  $form.find('input[name=country]').val()
        var $ndList = $form.find('.nd-list');
        var $dropdownWrapper = $ndList.find('.dropdown-wrapper');
        var placeholder = $dropdownWrapper.find('.selected-option').attr('data-placeholder');
        var $distributorName =  $dropdownWrapper.find("input[name=distributorName]");
        $dropdownWrapper.find('.selected-option').text(placeholder);
        $distributorName.val('');
        $dropdownWrapper.find('li.active').removeClass('active');

        if(value == '1') {
            $ndList.removeClass('hide');
            $dropdownWrapper.addClass('required');
            $dropdownWrapper.find('li:not(.other-nds)').addClass('hide');
            $dropdownWrapper.find('li[data-country="'+country+'"]').removeClass('hide');
            $distributorName.attr({
                "required": "true",
                "requredHidden": "true"
            });
            $dropdownWrapper.find(".selector-label .selected-option").addClass("selected-init");
        } else  {
            $ndList.addClass('hide');
            $dropdownWrapper.removeClass('required');
            $distributorName.val('Other Channels');
            $distributorName.removeAttr("required");
            $distributorName.removeAttr("requredHidden");
        }
    });

    function initDistributor(){
        var $distributor = $(".product-trials-and-promotions-form .nd-list .dropdown-wrapper");
        if($distributor.length > 0){
            var path = $distributor.data("path");
            if(path){
                var ndOptionsGroup = $distributor.find(".options");
                $.getScript(path, function (data) {
                    if (data) {
                        var distributorList = eval(data);
                        var innerHtml = '';
                        distributorList.forEach(function (item, index) {
                            var country = item.country;
                            item.distributors.split(",").forEach(function (distributor, index){
                                innerHtml += '<li data-value="' + distributor + '" data-country="' + country + '">'+ Granite.I18n.get(distributor) + '</li>';
                            });
                        });
                        innerHtml += '<li data-value="Other NDs" class="other-nds">'+ Granite.I18n.get('Other NDs') + '</li>'
                        ndOptionsGroup.html(innerHtml);

                        ndOptionsGroup.find("li").on('click', function(e){
                            var value = $(this).data("value");
                            console.log("test =" + value);
                            var $selectOption = $distributor.find(".selector-label .selected-option");
                            $selectOption.removeClass("selected-init");
                            $selectOption.html(value);
                            $distributor.find('input[name="distributorName"]').val(value);
                        });
                    }
                });
            }
        }
    }
    initDistributor();

    setTimeout(function() {
        initSmartTryRequire();
        initSpecialOffeRequire();
    }, 0)
});
$(document).ready(function() {
    var breakpoint =  getCurrentBreakpoint();
    var chart, mockYears, mockData;
    function initChart(chartEle, rowIndex) {
        var chartData = {
            unit: mockData[rowIndex].unit,
            name: mockData[rowIndex].name,
            data: mockData[rowIndex].data.map(function(item) {
                item = item.replaceAll(",", "");
                return item > 0 ? item : {value: item, itemStyle: {
                    color: '#D7150E'
                }}
            })
        };
        var isDesktop  =  getCurrentBreakpoint() === 'DESKTOP';
        var option = {
            title: {
                text: chartData.name,
                top: isDesktop ? 15 : 8,
                left: 'center',
                textStyle: {
                    color: '#666',
                    fontSize: isDesktop ? 14 : 12,
                    fontWeight: isDesktop ? 500 : 400
                }
            },
            grid: {
                left: 55,
                right: 20,
                top: isDesktop ? 55 : 40,
                bottom: isDesktop ? 40 : 35
            },
            tooltip: {
                trigger: 'axis',
                backgroundColor: 'rgba(255, 255, 255, 0.85)',
                formatter: function(params) {
                    var str = '';
                    str +=  '<div class="tooltip-container"><div class="icon-container">';
                    if(params[0].value > 0) {
                        str += '<span class="bar-icon"></span>';
                    } else {
                        str += '<span class="bar-icon red-icon"></span>';
                    }
                    str += '<span class="tooltip-name">' + params[0].seriesName + '</span>' + '</div>' + params[0].value.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') + '</div>';
                    return str;
                },
                axisPointer: {
                    lineStyle: {
                        color: '#999'
                    }
                }
            },
            xAxis: [
                {
                    type: 'category',
                    data: mockYears,
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#EAEAEA'
                        }
                    },
                    axisLabel: {
                        color: '#999',
                        margin: 15
                    }
                }
            ],
            yAxis: [
                {
                    name: chartData.unit,
                    nameTextStyle: {
                        color: '#666',
                        align: 'center',
                        height: isDesktop ? 30 : 15,
                        lineHeight: isDesktop ? 30 : 15,
                    },
                    type: 'value',
                    splitNumber: 8,
                    axisLabel: {
                        color: '#999',
                    },
                    splitLine: {
                        lineStyle: {
                            color: '#EAEAEA'
                        }
                    }
                },
            ],
            series: [
                {
                    name: chartData.name || '',
                    type: 'bar',
                    data: chartData.data,
                    itemStyle: {
                        color: '#4A5366',
                        opacity: 0.85
                    },
                    barMaxWidth: isDesktop ? 64 : 20,
                }
            ]
        };
        chart = echarts.init(chartEle);
        chart.setOption(option);
    }
    function initTableChart($comp){
        var tableHeadData = [''].concat(mockYears, [Granite.I18n.get('Charts')]);
        var tableBodyData = mockData.map(function(item) {
            return {
                data: [item.name].concat(item.data, ['<span class="toggle-chart"></span>'])
            }
        });
        $comp.find('.ir-table-comp').trigger('initIRTable', {
            headData: tableHeadData,
            bodyData: tableBodyData,
        });

        $comp.on('click', '.toggle-chart', function(event) {
            var $row = $(this).closest('tr');
            var isExpanded = $row.hasClass('expanded-row');
            if(chart && !chart.isDisposed()) {
                chart.dispose();
                $comp.find('.chart-row').remove();
                $comp.find('.expanded-row').removeClass('expanded-row');
            }
            if (isExpanded) {
                return;
            }
            var rowIndex = $row.index();
            $row.after('<tr class="chart-row"><td colspan="7"><div class="chart"></div></td></tr>');
            var chartEle = $row.next().find('.chart')[0];
            initChart(chartEle, rowIndex);
            $row.addClass('expanded-row');
            atModel.doAtEvent("Table_and_Charts::dropdown_chart::" + mockData[rowIndex].name, "action", event);
        });
    }

    $('.ir-kpi-spotlight-comp').each(function() {
        var $comp = $(this);
        var assetPath = $comp.data("asset-path");
        if(assetPath){
            var params = {
                path: assetPath,
                type: "tableCharts"
            };
            getTableData(params, function(data){
                if(data){
                    mockYears = data.headData;
                    mockData = data.bodyData;
                    initTableChart($comp);
                }
            });
        }
        $(window).resize(function() {
            var currentBreakpoint = getCurrentBreakpoint();
            if (!chart || chart.isDisposed()) {
                return;
            }
            if (breakpoint === currentBreakpoint) {
                chart.resize();
            } else {
                var $row = $comp.find('.expanded-row');
                var $chart = $row.next().find('.chart');
                var rowIndex = $row.index();
                chart.dispose();
                initChart($chart[0], rowIndex);
            }
            breakpoint = currentBreakpoint;
        });
    });
});
function getTableData(params, callback){
    $.ajax({
        type : "GET",
        url :  "/bin/hikvision/irTable.table.json",
        data: params,
        dataType : "json",
        success : function(data) {
            if(callback){
                callback(data);
            }
        }
    })
}

$(document).ready(function() {
    function createCell(cellData, type) {
        if (type === 'foot') {
            return '<td colspan="4">' + cellData + '</td>';
        } else {
            return '<td>' + cellData + '</td>';
        }
    }
    function createRow(rowData, type, isOdd) {
        var cells = '';
        var data = rowData;
        if (type === 'body') {
            data = rowData.data;
        }
        for(var i = 0; i< data.length; i++) {
            cells += createCell(data[i], type);
        }
        return (isOdd ? '<tr class="odd-row">' : '<tr>') + cells  + '</tr>';

    }
    function createBody(data) {
        var rows = '';
        for(var i = 0; i < data.length; i++) {
            rows += createRow(data[i], 'body', i % 2 == 1);
        }
        return '<tbody>' + rows + '</tbody>';
    }
    function createHead(data) {
        var row = createRow(data, 'head');
        return '<thead>' + row + '</thead>';
    }
    function createFoot(data) {
        var row = createRow(data, 'foot');
        return '<tfoot>' + row + '</tfoot>';
    }
    function initTable($comp, data) {
        var head = createHead(data.headData);
        var body = createBody(data.bodyData);
        var foot = '';
        if (data.footData && data.footData.length > 0) {
            foot = createFoot(data.footData);
        }
        var table= '<div class="table-container"><table>' + head + foot + body + '</table></div>';
        $comp.empty();
        $comp.append(table);
    }
    $('.ir-table-comp').each(function() {
        var $comp = $(this);
        $comp.on('initIRTable', function(event, data) {
            initTable($comp, data);
        });
        var assetPath = $comp.data("asset-path");
        var footData = "";
        if(assetPath){
            var params = {
                path: assetPath,
                type: "table"
            };
            getTableData(params, function(data){
                if(data){
                    var bodyData = data.bodyData;
                    if(bodyData && bodyData[0] && bodyData[0].length == 4 && data.headData[0] == ""){
                        footData = [Granite.I18n.get('IPO financing amount in 2010: RMB 3.4 billion')];
                    }
                    $comp.trigger('initIRTable', {
                        headData: data.headData,
                        bodyData: bodyData,
                        footData: footData
                    });
                }
            });
        }
    });
});
$(document).ready(function() {
    var breakpoint = getCurrentBreakpoint();
    var chart, mockYears, mockData;

    function initChart($comp) {
        var isDesktop = getCurrentBreakpoint() === 'DESKTOP';
        var tooltip = '<div class="tooltip-container"><div class="icon-container"><span class="line-icon"></span><span class="tooltip-name">{a0}</span></div>{c0}</div>';
        var series = [
            {
                name: mockData[0].name,
                type: 'line',
                symbol: 'circle',
                symbolSize: 6,
                data: [undefined].concat(mockData[0].data),
                itemStyle: {
                    color: '#D7150E',
                    borderWidth: 1,
                    borderColor: 'rgba(255, 255, 2555, .85)'
                },
            },
            {
                type: 'bar',
                data: [3.4],
                xAxisIndex: 1,
                yAxisIndex: 1,
                itemStyle: {
                    color: '#D7150E'
                },
                label: {
                    show: true,
                    position: 'top'
                },
                barMaxWidth: isDesktop ? 20 : 10,
            }
        ];
        if (mockData.length >= 2) {
            tooltip = tooltip + '<div class="tooltip-container"><div class="icon-container"><span class="bar-icon"></span><span class="tooltip-name">{a1}</span></div>{c1}</div>';
            series.push({
                name: mockData[1].name,
                type: 'bar',
                data: [undefined].concat(mockData[1].data),
                itemStyle: {
                    color: '#4A5366',
                    opacity: 0.85
                },
                yAxisIndex: 1,
                barMaxWidth: isDesktop ? 20 : 10,
            });
        }

        var xplaceholder = [];
        for (var i = 0; i < mockYears.length - 5; i++) {
            xplaceholder.push('')
        }

        var option = {
            grid: {
                left: 55,
                right: 55,
                top: 10,
                bottom: 100
            },
            tooltip: {
                trigger: 'axis',
                backgroundColor: 'rgba(255, 255, 255, 0.85)',
                formatter: tooltip,
                triggerOn: 'none',
                axisPointer: {
                    lineStyle: {
                        color: '#999'
                    }
                }
            },
            xAxis: [
                {
                    type: 'category',
                    data: [''].concat(mockYears),
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#EAEAEA'
                        }
                    },
                    axisLabel: {
                        rotate: 45,
                        color: '#999',
                    }
                },
                {
                    type: 'category',
                    data: [Granite.I18n.get('IPO financing {0} amount',['\n'])].concat(xplaceholder),
                    position: 'bottom',
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        margin: 14,
                        verticalAlign: 'bottom',
                        rotate: 45,
						color: '#999',
                    },
                    axisPointer: {
                        show: false
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    splitNumber: 8,
                    boundaryGap: ['20%', '20%'],
                    alignTicks: true,
                    axisLabel: {
                        color: '#999',
                        formatter: '{value}.00 %'
                    },
                    splitLine: {
                        lineStyle: {
                            color: '#EAEAEA'
                        }
                    }
                },
                {
                    type: 'value',
                    splitNumber: 8,
                    alignTicks: true,
                    axisLabel: {
                        color: '#999',
                    },
                    splitLine: {
                        lineStyle: {
                            color: '#EAEAEA'
                        }
                    }
                }
            ],
            series: series
        };

        function getTooltipPosition(offsetX, offsetY) {
            var $tooltip = $comp.find('.chart .tooltip-container').parent();
            var tooltipWidth = $tooltip.width();
            var tooltipHeight = $tooltip.height();
            var x = 0;
            var y = 0;
            if (offsetX + 30 + tooltipWidth > $comp.find('.chart').width()) {
                x = offsetX - 30 - tooltipWidth;
            } else {
                x = offsetX + 20;
            }
            if (offsetY + 30 + tooltipHeight > $comp.find('.chart').height()) {
                y = offsetY - 30 - tooltipHeight;
            } else {
                y = offsetY + 20;
            }
            return [x, y];
        }
        function chartTouchHandler(event) {
            var pointInPixel = [event.offsetX, event.offsetY];
            if(chart.containPixel('grid', pointInPixel)) {
                var pointInGrid = chart.convertFromPixel({seriesIndex: 2}, pointInPixel);
                var xIndex = pointInGrid[0];
                if (xIndex !== 0) {
                    var position = getTooltipPosition(event.offsetX, event.offsetY);
                    chart.dispatchAction({
                        type: 'showTip',
                        seriesIndex: 2,
                        position: position,
                        dataIndex: xIndex
                    });
                }
            } else{
                chart.dispatchAction({type: 'hideTip'});
                chart.dispatchAction({type: 'updateAxisPointer', currTrigger: 'leave'});
            }
        }
        chart = echarts.init($comp.find('.chart')[0]);
        chart.setOption(option);
        chart.getZr().on('click', chartTouchHandler);
        chart.getZr().on('mousemove', chartTouchHandler);
    }
    $('.ir-stock-trend-comp').each(function() {
        var $comp = $(this);
        var assetPath = $comp.data("asset-path");
        if(assetPath){
            var params = {
                path: assetPath,
                type: "stockTrend"
            };
            getTableData(params, function(data){
                if(data){
                    mockYears = data.headData;
                    mockData = data.bodyData;
                    initChart($comp);
                }
            });
        }
        $(window).resize(function() {
            var currentBreakpoint = getCurrentBreakpoint();
            if (breakpoint === currentBreakpoint) {
                chart.resize();
            } else {
                chart.dispose();
                initChart($comp);
            }
            breakpoint = currentBreakpoint;
        });
    });
});
$(document).ready(function() {
    var breakpoint = getCurrentBreakpoint();
    var chart, mockYears, mockData;
    function initChart($comp) {
        var isDesktop  =  getCurrentBreakpoint() === 'DESKTOP';
        var series = [
            {
                name: mockData[0].name,
                type: 'line',
                symbol: 'circle',
                symbolSize: 6,
                data: mockData[0].data,
                itemStyle: {
                    color: '#D7150E',
                    borderWidth: 1,
                    borderColor: 'rgba(255, 255, 2555, .85)'
                },
            }
        ];
        if (mockData.length >= 2) {
            series.push({
                name: mockData[1].name,
                type: 'bar',
                yAxisIndex: 1,
                data: mockData[1].data,
                itemStyle: {
                    color: '#4A5366',
                    opacity: 0.85
                },
                barMaxWidth: isDesktop ? 64 : 20,
            })
        }
        

        var option = {
            grid: {
                left: 55,
                right: 55,
                top: 10,
                bottom: isDesktop ? 45 : 40
            },
            tooltip: {
                trigger: 'axis',
                backgroundColor: 'rgba(255, 255, 255, 0.85)',
                formatter:function(params) {
                    var str = '<div class="tooltip-container"><div class="icon-container"><span class="line-icon"></span><span class="tooltip-name">'+params[0].seriesName+'</span></div>'+params[0].value+'</div>';
                    if(params.length >= 2){
                        str += '<div class="tooltip-container"><div class="icon-container"><span class="bar-icon"></span><span class="tooltip-name">'+params[1].seriesName+'</span></div>'+params[1].value.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')+'</div>'
                    }
                    return str;
                },
                axisPointer: {
                    lineStyle: {
                        color: '#999'
                    }
                }
            },
            xAxis: [
                {
                    type: 'category',
                    data: mockYears,
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#EAEAEA'
                        }
                    },
                    axisLabel: {
                        color: '#999'
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    splitNumber: 8,
                    boundaryGap: ['20%', '20%'],
                    alignTicks: true,
                    axisLabel: {
                        color: '#999',
                        formatter: function(value){
                            var percent = "";
                            if( mockData[0].name.indexOf("%")>-1 ){
                                percent = "%"
                            }
                            return parseFloat(value).toFixed(2) + percent;
                        }
                    },
                    splitLine: {
                        lineStyle: {
                            color: '#EAEAEA'
                        }
                    }
                },
                {
                    type: 'value',
                    splitNumber: 8,
                    boundaryGap: ['20%', '20%'],
                    alignTicks: true,
                    axisLabel: {
                        color: '#999',
                    },
                    splitLine: {
                        lineStyle: {
                            color: '#EAEAEA'
                        }
                    }
                }
            ],
            series: series
        };
        chart = echarts.init($comp.find('.chart')[0]);
        chart.setOption(option);
    }
    $('.ir-core-indicator-comp').each(function() {
        var $comp = $(this);
        var assetPath = $comp.data("asset-path");
        if(assetPath){
            var params = {
                path: assetPath,
                type: "charts"
            };
            getTableData(params, function(data){
                if(data){
                    mockYears = data.headData;
                    mockData = data.bodyData;
                    initChart($comp);
                }
            });
        }
        $(window).resize(function() {
            var currentBreakpoint  =  getCurrentBreakpoint();
            if (breakpoint === currentBreakpoint) {
                chart.resize();
            } else {
                chart.dispose();
                initChart($comp);
            }
            breakpoint = currentBreakpoint;
        });
    });
});
$(document).ready(function () {
    var $lineIframe = $('.iframe-box .line-iframe');
    iFrameResize({}, 'iframe');

    $(window).resize(function() {
        $lineIframe.css('height', getCurrentBreakpoint() === 'MOBILE' ? 360 : 426);
        iFrameResize({}, 'iframe');
    });

    window.addEventListener('message', function(event) {
        var str = event.data.split(':')[0];
        var height = event.data.split(':')[1];
        var index = str.substring(str.length - 1);
        var $iframe = $('iframe').eq(index);
        if(!$iframe.hasClass('line-iframe')){
            $iframe.css('height', height);
        } else {
            $iframe.css('height', getCurrentBreakpoint() === 'MOBILE' ? 360 : 426);
        }
    })
});

$(document).ready(function() {
    var breakpoint = getCurrentBreakpoint();
    var chart, mockYears,mockData ;
    var colors = ['#8F0F15', '#D71820', '#FF5252', '#EF9A9A', '#FFC3C3', '#FFDCE0'];
    function initChart($comp) {
        var isDesktop  =  getCurrentBreakpoint() === 'DESKTOP';
        var tooltip = '<div class="tooltip-container"><div class="icon-container"><span class="bar-icon icon-radius icon-color0"></span><span class="tooltip-name">{a0}</span></div>{c0}%</div>';
        var series = [
            {
                name: mockData[0].name,
                type: 'bar',
                data: mockData[0].data,
                emphasis: {
                    disabled: true,
                },
                stack: 'one',
                itemStyle: {
                    color: colors[0],
                    opacity: 0.85
                },
                barMaxWidth: isDesktop ? 118 : 45
            }
        ];
        if(mockData.length >= 2) {
            for(var temp = 1; temp < mockData.length; temp++) {
                tooltip = '<div class="tooltip-container"><div class="icon-container"><span class="bar-icon icon-radius icon-color'+ temp +'"></span><span class="tooltip-name">{a'+ temp +'}</span></div>{c'+ temp +'}%</div>' + tooltip;
                series.push({
                    name: mockData[temp].name,
                    type: 'bar',
                    data: mockData[temp].data,
                    emphasis: {
                        disabled: true,
                    },
                    stack: 'one',
                    itemStyle: {
                        color: colors[temp],
                        opacity: 0.85
                    },
                    barMaxWidth: isDesktop ? 118 : 45
                })
            }
        }

        var option = {
            grid: {
                left: isDesktop ? 60 : 55,
                right: 55,
                top: isDesktop ? 16 : 14,
                bottom: isDesktop ? 45 : 40
            },
            tooltip: {
                trigger: 'axis',
                backgroundColor: 'rgba(255, 255, 255, 0.85)',
                formatter: tooltip,
                axisPointer: {
                    lineStyle: {
                        color: '#999'
                    }
                }
            },
            xAxis: [
                {
                    type: 'category',
                    data: mockYears,
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#EAEAEA'
                        }
                    },
                    axisLabel: {
                        color: '#999'
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    splitNumber: 10,
                    alignTicks: true,
                    axisLabel: {
                        color: '#999',
                        formatter: function(value) {
                            return parseFloat(value).toFixed(2) + '%';
                        }
                    },
                    splitLine: {
                        lineStyle: {
                            color: '#EAEAEA'
                        }
                    }
                },
            ],
            series: series
        };
        chart = echarts.init($comp.find('.chart')[0]);
        chart.setOption(option);
    }
    $('.ir-zone-division-comp').each(function() {
        var $comp = $(this);
        var assetPath = $comp.data("asset-path");
        if(assetPath){
            var params = {
                path: assetPath,
                type: "dividedBarCharts"
            };
            getTableData(params, function(data){
                if(data){
                    mockYears = data.headData;
                    mockData = data.bodyData;
                    initChart($comp);
                }
            });
        }
        $(window).resize(function() {
            var currentBreakpoint  =  getCurrentBreakpoint();
            if (breakpoint === currentBreakpoint) {
                chart.resize();
            } else {
                chart.dispose();
                initChart($comp);
            }
            breakpoint = currentBreakpoint;
        });
    });
});

$(document).ready(function() {
    initAnnualDownloadComp();
});
function bindEvent($comp) {
    $comp.find('input[name="reportYearCode"]').on('change', function() {
        var $target = $(this);
        var reportYear = $target.val();
        $comp.find('.report-section').removeClass('active');
        $comp.find('.report-section[data-year=' + reportYear + ']').addClass('active');
    });
}
function initAnnualDownloadComp() {
    $('.ir-annual-download-comp').each(function() {
        var $comp = $(this);
        initNewDropdown($comp);
        bindEvent($comp);
        $comp.find('.dropdown-wrapper .option:first-child').click();
    });
}
$(document).ready(function () {
    initUserTestimonials();
});
function initUserTestimonials(){
    $(".user").css("visibility","visible");
    var width = $(window).width();
    $(".user").find(".user-slick").slick({
        slidesToShow: 3,
        slidesToScroll: 3,
        arrows: false,
        dots: true,
        responsive: [
            {
                breakpoint: 991,
                settings: {
                    dots: false,
                    slidesToShow: 1,
                    slidesToScroll:1,
                    variableWidth: true
                }
            },
        ]
    })
    $(".slick-dots").each(function () {
        $(this).find("li").each(function(index){
          $(this).bind().on('click', function (e) {
              var title = "customer_testimonial::rotator::" + (index + 1);
              atModel.doAtEvent(title, 'action', e)
          })
        })
    })
}



(function ($) {
    function hikMultiSelect(ele, data) {
        this.$selection = $(ele);
        this.$input = $(ele).find('.hik-multiple-input');
        this.$selector = $(ele).find('.hik-multiple-selector');
        this.$nodeList = $(ele).find('li');
    }


    hikMultiSelect.prototype = {
        init: function () {
            var that = this;

            toggleSelectList.call(this);

            // li options clicked 
            onOptionSelected.call(this);

            //input box change 
            onInputValChange.call(this);

            // close icon in input box
            bindCloseOptionIconClick.call(this)


            $(window).resize(function () {
                // hide options in inputbox when resize
                renderAndHideOptionsInInput.call(that)
            })
        },
        hideSelection: function () {
            this.$input.removeClass('active')
        },
        hasVal: function () {
            return this.$selection.find('.hik-multiple-selected-option').not('.ellipsis-label').length > 0;
        }
    }

    function bindCloseOptionIconClick() {
        var that = this;
        this.$selector.on('click', '.hik-option-close', function (e) {

            e.stopPropagation();
            var $target = $(e.target);

            var optionText = $target.prev().text();

            uncheckOptionInListByText.call(that, optionText);

            $target.parent().remove();

            that.$selector.trigger('change');
        });
    }

    function uncheckOptionInListByText(text) {
        $.grep(this.$nodeList, function (node) {
            if ($(node).find('span').text().trim() === text.trim()) {
                $(node).removeClass('selected');
                $(node).find('input').prop('checked', false);
            }
        });
    }

    // costomized change event 
    function onInputValChange() {
        var that = this;
        that.$selector.on('change', function (event) {
            var $this = $(this);

            var $placeholder = $this.find('.placeholder');
            var $label = $this.parent().find('label');

            if (that.hasVal()) {
                $label.css('top', '0').css('transform', 'translateY(-50%) scale(0.75)');
                $placeholder.hide();

                renderAndHideOptionsInInput.call(that);
            } else {
                $placeholder.show();
                $label.removeAttr('style');
            }
        });
    }

    function renderAndHideOptionsInInput() {
        var that = this;

        var $this = this.$selection;
        var $options = $this.find('.hik-multiple-selected-option').not('.ellipsis-label');

        $label = $this.parent().find('label');

        if (that.hasVal()) {
            var width = 0;
            var outerWidth = that.$selector.innerWidth();
            var $ellipsis = $this.find('.ellipsis-label');

            $options.each(function (index, element) {
                var curEleWidth = $(element).outerWidth(true);
                width += curEleWidth;

                if (width >= outerWidth) {
                    $(element).prev().addClass('hidden-option');

                    // compare pre pre with elipsis label 
                    // if the second previous span is shorter that ellpsis lable, then hide
                    if ($(element).prev().prev().outerWidth(true) < $ellipsis.outerWidth(true)) {
                        $(element).prev().prev().addClass('hidden-option')
                    }

                    $ellipsis.removeClass('hidden-option');
                    return false;
                } else {
                    if (index === $options.length - 1) {
                        $ellipsis.addClass('hidden-option');
                    }

                    $(element).removeClass('hidden-option');
                }
            });

            // first option will always be displayed 
            var $firstOpt = $options.first();
            if ($firstOpt.hasClass('hidden-option')) {
                // if first one is hidden -> add text elipsis to it 
                $firstOpt.find('span').first().addClass('hik-option-text-ellipsis');
                var dropdownArrowWidth = 12;
                var closeIconWidth = 16;
                var optionItemMarginPadding = 40;

                // set text elipsis max width
                $firstOpt.find('span').first().css("max-width", (that.$selector.innerWidth() - dropdownArrowWidth - closeIconWidth - optionItemMarginPadding - $ellipsis.outerWidth()) + 'px');
                $firstOpt.removeClass('hidden-option');

            } else {
                $firstOpt.find('span').first().removeAttr('style');
                $firstOpt.find('span').first().removeClass('hik-option-text-ellipsis');
            }

            var hiddenOptionNum = $this.find('.hidden-option').length;
            $ellipsis.find('span').text(hiddenOptionNum);
        }
    }

    function onOptionSelected() {
        var that = this;
        // bind checkbox click event, -- will add selected val to the input.
        that.$nodeList.on('click', 'input[type="checkbox"]', onCheckBoxClick.bind(this));

        that.$nodeList.on('click', onLiClicked.bind(this));
    }

    function onLiClicked(e) {
        e.stopPropagation();

        var $curentTarget = $(e.currentTarget);

        $curentTarget.children('input').trigger('click');
    }

    function onCheckBoxClick(e) {
        e.stopPropagation();

        var that = this;
        var $target = $(e.target);

        var $parentLi = $target.parent();
        var optionText = $parentLi.text();

        if ($target.is(':checked')) {
            $parentLi.addClass('selected')
            that.$selector
                .find('.ellipsis-label')
                .before(
                    '<div class="hik-multiple-selected-option hidden-option"><span>' +
                    optionText +
                    '</span><span class="hik-option-close"></span></div>'
                );
        } else {
            // remove
            $parentLi.removeClass('selected');
            removeOptionInInputByText.call(that, optionText);
        }

        that.$selector.trigger('change');
    }

    function removeOptionInInputByText(text) {
        var optionList = this.$selector.find('.hik-multiple-selected-option');

        $.grep(optionList, function (node) {
            if ($(node).find('span').eq(0).text().trim() === text.trim()) {
                $(node).remove();
            }
        });
    }

    function toggleSelectList() {
        // toggle list if clicked on selection;
        this.$selection.on('click', ':not(.hik-multiple-selected-option)', toggleDropDown.bind(this));

        // close list  
        // change to blur with mouse down prevent event + click ? -- no tester to verify.
        $('body').on('click', closeSelectList.bind(this));
    }

    function toggleDropDown(e) {
        e.stopPropagation();

        var that = this;
        
        that.$input.toggleClass('active');

        retractOtherDropdown(that.$input);
    }

    //retract the other dropdown
    function retractOtherDropdown($ele) {
        var $form = $ele.closest('form');
        var $dropdown = $form.find('.dropdown-wrapper .dropdown.remove-top-border');
        var $hikSelect = $form.find('.hik-outlined-select.active .hik-select-selection');
        $dropdown.slideUp('fast', function () {
            $(this).removeClass('remove-top-border');
            $(this).parent().find('.selector-label').removeClass('remove-top-border');
        })
        $hikSelect.slideUp('fast', function () {
            $(this).parent().removeClass('active');
            $(this).parent().find('.hik-select-input').removeClass('shrink');
        })
    }

    function closeSelectList(e) {
        var that = this;
        if (that.$selection.has(e.target).length === 0) {
            that.$input.removeClass('active');
        }
    }

    $.fn.extend({
        hikMultiSelect: function (option) {
            var select = new hikMultiSelect($(this))
            select.init();

            return select;
        },
    });
})($);
/**
 * hikvision customized select tool
 */

(function ($) {
    function hikSelect(element, option) {
        var $element = $(element)
        this.dom = {
            $ele: $element,
            $inputContainer: $element.find('.hik-select-input'),
            $input: $element.find('input').first(),
            $optionsContainer: $element.find('ul'),
            $options: $element.find('li')
        }
        this.defaultOptions = {
            onSelected: function ($ele, $selectedEle) {
                // call back 
            },
            hasTooltip: false
        }

        this.option = $.extend({}, this.defaultOptions, option)
    }


    hikSelect.prototype = {
        init: function () {
            handleOptionClicked.call(this);
            if(!this.dom.$input.attr('readonly')) handleSearch.call(this);
            handleToggleDropDown.call(this);
            
            if(this.option.hasTooltip) {
                handleTooltip.call(this);
            }

            // auto fill 
            if (this.dom.$input.val()) {
                this.dom.$inputContainer.addClass('hasVal')
            }
        },
        valid: function () {
            var closestFromValidator = this.dom.$ele.closest('form').validate();

            if (closestFromValidator)
                closestFromValidator.element(this.dom.$ele.find('input[required]'));

            return !!this.dom.$input.val();
        },
        reset: function () {
            this.dom.$inputContainer.removeClass('hasVal');
            this.dom.$ele.find('input').val('');
            this.dom.$optionsContainer.find('.active').removeClass('active');
        },
        // expose change val by text function
        // $option -> 

        changeSelectedVal: function (val, $option) {
            this.dom.$input.val(val);

            //remove selected option
            this.dom.$optionsContainer.find('.active').removeClass('active');

            if (!$option) {
                $.grep(that.dom.$options, function (node) {
                    var $node = $(node);
                    if ($node.text() && val && $node.text.trim().toLowerCase() === val.trim().toLowerCase()) {
                        $option = $node;
                    }
                })
            } else {
                this.dom.$input.parent().addClass('shrink')
            }

            $option.addClass('active');
            // else find option and active 
            this.dom.$input.parent().addClass('shrink').addClass('hasVal');

            // run user call back 
            this.option.onSelected(this.dom.$ele, $option);
        }
    }

    function handleOptionClicked() {
        var that = this;

        this.dom.$optionsContainer.on('click', 'li', function (e) {
            e.stopPropagation();
            var $option = $(e.target);

            // set input to none
            that.dom.$ele.find('input').val('').trigger('input');

            var text = $option.text().trim();

            that.changeSelectedVal(text, $option);
            that.dom.$ele.removeClass('active');
        });
    }

    function handleSearch() {
        var that = this;
        var inputs = that.dom.$ele.find('input');

        this.dom.$input.on('input', function (e) {
            var text = that.dom.$input.val();
            that.dom.$options.find('.active').removeClass('active');

            if (!text) {
                inputs.val('').trigger('change');
                // that.valid();
            }
            var hasResult = false;
            $.grep(
                that.dom.$options,
                function (node) {
                    var $node = $(node);
                    if (text && $node.text().toLowerCase().indexOf(text.trim().toLowerCase()) == -1) {
                        $node.hide();
                    } else {
                        hasResult = true;
                        $node.show();
                    }
                },
                true
            );

            if(!hasResult) {
                that.dom.$optionsContainer.css('opacity', 0);
            } else {
                that.dom.$optionsContainer.css('opacity', 1);
            }
        });
    }

    function handleToggleDropDown() {
        var that = this;
        that.dom.$ele.on('click', function (e) {
            that.dom.$optionsContainer.parent().removeAttr('style');
            that.dom.$ele.toggleClass('active');
            if(that.dom.$ele.hasClass('active')) {
                that.dom.$inputContainer.addClass('shrink');
            } else {
                that.dom.$input.trigger('blur');
                that.dom.$inputContainer.removeClass('shrink');
            }
        })

        $('body').on('click', function (e) {
            if (that.dom.$ele.has(e.target).length === 0) {
                var lis = that.dom.$options;
                var allLiText = [];
                var text = that.dom.$input.val();

                $.each(lis, function (i, item) {
                    var text = $(item).text().replace('/n','').trim();
                    allLiText.push(text)
                });


                if (allLiText.indexOf(text) !== -1) {
                    lis.each(function (i) {
                        if (allLiText.indexOf(text) === i) {
                            $(this).trigger("click")
                        }
                    })
                } else {
                    that.dom.$input.val('').trigger('input').trigger("change");
                    that.dom.$inputContainer.removeClass('hasVal')
                }
                
                that.dom.$ele.removeClass('active');
                that.dom.$inputContainer.removeClass('shrink');
            }
        });
    }

    function handleTooltip() {
        var _this = this;
        // 鼠标移入，添加tooltip
        _this.dom.$ele.on('mouseenter', 'li .hik-select-tooltip-icon', function (e) {
            e.stopPropagation();

            var $this = $(this);

            var $currentSelect = _this.dom.$ele.parent();
            var positionLeft = $currentSelect.get(0).getBoundingClientRect().left;
            var width = $currentSelect.width();
            var currentlength = width + positionLeft + 266;
            var isHalf = $currentSelect.hasClass('half-row');
            var left = $currentSelect.offset().left;

            if (window.innerWidth >= 992) {
                var $item = $this.closest('li');
                var tooltip = $this.attr('data-tooltip');
                var $tooltipContainer, top;
                // 判断tooltip显示位置，二分之一占位在左边则tooltip一直显示在右边，占位在右边（或占满一行）根据window是否可以显示全判断显示在上方或右边
                if(window.innerWidth >= currentlength || (left < window.innerWidth / 2 && isHalf)) {
                    $tooltipContainer = $('<div class="tooltip-container">' + tooltip + '</div>');
                    top = $item.offset().top - _this.dom.$ele.offset().top + $item.outerHeight() / 2;
                } else {
                    $tooltipContainer = $('<div class="tooltip-container show-tooltip-on-top">' + tooltip + '</div>');
                    top = $item.offset().top - _this.dom.$ele.offset().top - 5;
                }

                $tooltipContainer.css({
                    top: top + 'px'
                });
                _this.dom.$ele.append($tooltipContainer);
            }
        }).on('mouseleave', 'li .hik-select-tooltip-icon', function (e) {
            e.stopPropagation();
            var $tooltipContainer = _this.dom.$ele.find('.tooltip-container');
            $tooltipContainer.remove();
        });
        // 触发li的点击事件赋值
        _this.dom.$optionsContainer.on('click', 'li .hik-select-tooltip-icon', function (e) {
            e.stopPropagation();
            var $option = $(e.target).parent();

            // set input to none
            _this.dom.$ele.find('input').val('');

            var text = $option.text().trim();

            _this.changeSelectedVal(text, $option);
            _this.dom.$ele.removeClass('active');
         });
    }

    $.fn.extend({
        hikSelect: function (option) {
            var select = new hikSelect($(this), option)
            select.init();
            return select;
        },
    });
})($);



$.fn.extend({
    outlinedFormLabelShrink: function () {
        // this = form
        var $ele = $(this);
        var outlinedInput = $ele.find('.outlined input[type="text"]').not('[type="hidden"]');
        var outlinedTextArea = $ele.find('.outlined textarea');

        shrinkLabel(outlinedInput);
        shrinkLabel(outlinedTextArea)
    }
})


function shrinkLabel(element) {
    element.each(function (index, ele) {
        // for auto fill
        if($(ele).val()) {
            $(ele).parent().addClass('hasVal');
        }

        $(ele).on('focus', function (event) {
            $(this).parent().addClass('shrink');
        }).on('blur', function (event) {
            if (!$(ele).val()) {
                $(this).parent().removeClass('shrink').removeClass('hasVal');
            } else {
                $(this).parent().addClass('hasVal').removeClass('shrink');
            }
        })
    })
}

(function ($) {
    $(document).ready(function () {
        var map, geocoder;
        var isChinaIP = false, provinceMapping, afterSaleInfo, currentProvince, currentCity;

        var markers = [], positions = [];
        var imgURL = {
            "normal": {
                url: "/etc/clientlibs/it/resources/icons/icon-map-marker.svg",
                width: 25,
                height: 30,
            },
            "checked": {
                url: "/etc/clientlibs/it/resources/icons/icon-map-marker-checked.svg",
                width: 40,
                height: 48,
            }
        };

        function getLocation($comp) {
            init($comp)

            map.plugin("AMap.Geolocation", function () {
                var geolocation = new AMap.Geolocation({
                    enableHighAccuracy: true,
                    zoomToAccuracy: true
                })

                geolocation.getCityInfo(function (status, result) {
                    if (status === 'complete') {
                        currentProvince = result.province;
                        currentCity = result.city;
                        init($comp);
                    } else {
                        currentProvince = '北京市';
                        currentCity = '';
                        init($comp);
                    }
                });
            })
        }

        function getAllInfo($comp) {
            var $outlineContainer = $comp.find('.select-container');
            var url = $outlineContainer.attr('data-province-city-list');

            $.ajax({
                type: 'GET',
                url: url,
                success: function (res) {
                    isChinaIP = res.isChinaIP;
                    provinceMapping = res.provinceMapping;
                    afterSaleInfo = res.afterSaleInfo;
                    renderProvince($comp, res.provinceMapping);
                    provinceBindClickEvent($comp);
                    initProvinceAndCity($comp);
                },
                error: function () {
                    console.log('get info failed');
                }
            });
        }

        function renderProvince($comp, pronviceAndcity) {
            var html = '';
            Object.keys(pronviceAndcity).forEach(function (item) {
                html += '<li class="option" data-value="' + item + '">' + item + '</li>'
            })
            $comp.find('.dropdown-wrapper.province .dropdown').empty();
            $comp.find('.dropdown-wrapper.province .dropdown').append(html);
        }

        function renderCity($comp, cities) {
            var html = '';
            cities.forEach(function (item) {
                html += '<li class="option" data-value="' + item + '">' + item + '</li>'
            })
            $comp.find('.dropdown-wrapper.city .dropdown').empty();
            $comp.find('.dropdown-wrapper.city .dropdown').append(html);
        }

        function renderStores(item) {
            let phone = item.phone ? '<div class="offline-stores-info">电话：' + item.phone + '</div>' : '';
            let fax = item.fax ? '<div class="offline-stores-info">传真：' + item.fax + '</div>' : '';
            let serviceTime = item.serviceTime ? '<div class="offline-stores-info">服务时间：' + item.serviceTime + '</div>' : '';
            return '<div class="offline-stores-item">' +
                '<div class="offline-stores-name">' + item.otherName + '</div>' +
                phone +
                fax +
                '<div class="offline-stores-info">地址：' + item.fullAddress + '</div>' +
                serviceTime +
                '<div class="offline-stores-info-container">' +
                '<a class="offline-stores-path" href="https://www.amap.com/search?query=' + item.fullAddress + '" target="_blank">公交/驾车路线查询</a>' +
                '<div class="offline-stores-qrcode-container" data-url="https://www.amap.com/search?query=' + item.fullAddress + '">' +
                '<div class="qrcode-tip">打开手机扫一扫，获取路线</div>' +
                '<div class="qrcode-img"></div>' +
                '</div>' +
                '</div>' +
                '</div>';
        }

        function qrcodeBindEvent($comp) {
            var qrCode;
            $comp.find('.offline-stores-qrcode-container').on('mouseenter', function (e) {
                e.preventDefault();
                var $img = $(this).find('.qrcode-img');
                var href = encodeURI($(this).data('url'));
                $img.addClass('active');
                qrCode = new QRCode($img[0], { width: 190, height: 190, colorDark: "#000", colorLight: "#fff", correctLevel: QRCode.CorrectLevel.L, text: href })
            }).on('mouseleave', function (e) {
                e.preventDefault();
                if (qrCode) qrCode.clear();
                $(this).find('.qrcode-img').empty();
                $(this).find('.qrcode-img').removeClass('active');
            })
        }

        function initMap($comp) {
            var $mapContainer = $comp.find('#offline-store-container');
            map = new AMap.Map($mapContainer[0], {
                zoom: 16
            });
        }

        function initMarker(index) {
            index = index ? index : 0;
            map.setCenter(positions[index]);
            for (var i = 0; i < positions.length; i++) {
                var marker;
                if (i == index) {
                    var icon = new AMap.Icon({
                        image: imgURL["checked"].url,
                        size: new AMap.Size(40, 48),
                        imageSize: new AMap.Size(40, 48)
                    })
                    marker = new AMap.Marker({
                        map: map,
                        position: positions[i],
                        icon: icon,
                        offset: new AMap.Pixel(-20, -24)
                    })
                } else {
                    var icon = new AMap.Icon({
                        image: imgURL["normal"].url,
                        size: new AMap.Size(25, 30),
                        imageSize: new AMap.Size(25, 30)
                    })
                    marker = new AMap.Marker({
                        map: map,
                        position: positions[i],
                        icon: icon,
                        offset: new AMap.Pixel(-12, -15)
                    })
                }

                markers.push(marker);
            }
        }

        function initStores($comp, province, city) {
            var html = '', card = '';
            positions = [];
            afterSaleInfo.forEach(function (item) {
                if (province === item.province && city && city === item.city || province === item.province && !city) {
                    card = renderStores(item);
                    var lnglat = [item.longitude, item.latitude];
                    positions.push(lnglat);
                } else {
                    card = '';
                }

                html += card;
            })
            $comp.find('.offline-stores-items-container').empty();
            $comp.find('.offline-stores-items-container').append(html);
        }

        function initProvinceAndCity($comp) {
            if (isChinaIP && currentProvince && provinceMapping.hasOwnProperty(currentProvince)) {
                if (provinceMapping[currentProvince].length === 0) {
                    $comp.find('.dropdown-wrapper.city').addClass('notShow');
                } else {
                    $comp.find('.dropdown-wrapper.city').removeClass('notShow');
                }

                $comp.find('.dropdown-wrapper.province ul.dropdown li.option').each(function () {
                    if (!!!provinceMapping) return;

                    if ($(this).attr('data-value') === currentProvince) {
                        $(this).trigger('click');
                        var cities = provinceMapping[currentProvince];
                        renderCity($comp, cities);

                        if (cities.includes(currentCity)) {
                            $comp.find('.dropdown-wrapper.city ul.dropdown li.option').each(function () {
                                if ($(this).attr('data-value') === currentCity) {
                                    $(this).trigger('click');
                                }
                            })
                        } else {
                            $comp.find('.dropdown-wrapper.city .dropdown .option:first-child').trigger('click');
                        }
                    }
                })
            } else {
                currentProvince = '北京市';
                $comp.find('.dropdown-wrapper.city').addClass('notShow');

                $comp.find('.dropdown-wrapper.province ul.dropdown li.option').each(function () {
                    if ($(this).attr('data-value') === currentProvince) {
                        $(this).trigger('click');
                    }
                })
            }

        }

        function init($comp) {
            initMap($comp);
            getAllInfo($comp);
        }

        function provinceBindClickEvent($comp) {
            $comp.find('.dropdown-wrapper.province input[name="province"]').on('change', function () {
                var $target = $(this);
                var province = $target.val();
                if (provinceMapping[province].length === 0) {
                    $comp.find('.dropdown-wrapper.city').addClass('notShow');
                    map.remove(markers);
                    initStores($comp, province);
                    initMarker();
                    cardBindClickEvent($comp);
                    $comp.find('.offline-stores-item:first').click();
                    qrcodeBindEvent($comp);
                } else {
                    $comp.find('.dropdown-wrapper.city').removeClass('notShow');
                    var cities = provinceMapping[province];
                    renderCity($comp, cities);
                    cityBindClickEvent($comp);
                    $comp.find('.dropdown-wrapper.city .dropdown .option:first-child').trigger('click');
                }
            });
        }

        function cityBindClickEvent($comp) {
            $comp.find('.dropdown-wrapper.city input[name="city"]').off('change').on('change', function () {
                var province = $comp.find('input[name="province"]').val();
                var $target = $(this);
                var city = $target.val();
                map.remove(markers);
                initStores($comp, province, city);
                initMarker();
                cardBindClickEvent($comp);
                $comp.find('.offline-stores-item:first').click();
                qrcodeBindEvent($comp);
            });
        }

        function cardBindClickEvent($comp) {
            $comp.find('.offline-stores-item').on('click', function () {
                var index = $(this).index();
                $(this).siblings().removeClass('active');
                $(this).addClass('active');
                map.remove(markers);
                initMarker(index);
            })
        }


        $('.offline-stores-comp').each(function () {
            var $comp = $(this);
            var mapKey = $comp.data('map-key');
            AMapLoader.load({
                "key": mapKey,              // 申请好的Web端开发者Key，首次调用 load 时必填,   // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
                "plugins": ['AMap.Icon', 'AMap.Marker', 'AMap.Geolocation'],           // 需要使用的的插件列表，如比例尺'AMap.Scale'等
                "version": '2.0',
                "AMapUI": {             // 是否加载 AMapUI，缺省不加载
                    "version": '1.1',   // AMapUI 版本
                    "plugins": ['overlay/SimpleMarker'],       // 需要加载的 AMapUI ui插件
                },
                "Loca": {                // 是否加载 Loca， 缺省不加载
                    "version": '2.0'  // Loca 版本
                },
            }).then(function (AMap) {
                map = AMap;
                getLocation($comp);
            }).catch(function (e) {
                console.error(e);  //加载错误提示
            });

            initNewDropdown($comp);
        });
    })
})($)

$(document).ready(function () {
    var $form = $("#enquiry-form.hcc-form");
    var $timezoneSelect = $form.find('.timezone-type');
    if (!$form.length) return;

    
    var $emailInput = $form.find("input[name='email']");
    emailVarify.initEmailVerifyStatus($emailInput);
    
    initialBusinessType($form);
    $form.outlinedFormLabelShrink();
    getTimezone(initialTimezone, $form);
    showEmailHint($form);

    function initialBusinessType($form) {
        var option = {
            onSelected: function ($ele, $input) {
                var val = $input.data('value');
                $ele.find('input[name="Business"]').val(val).trigger('change').trigger('blur');
            },
            hasTooltip: true
        }
        
        return $form.find('.group-business-type .hik-outlined-select').hikSelect(option);
    }

    function initialTimezone($form) {
        var option = {
            onSelected: function ($ele, $input) {
                var val = $input.data('value');
                $ele.find('input[name="timezone"]').val(val).trigger('change').trigger('blur');
            }
        }
        
        return $form.find('.timezone-type .hik-outlined-select').hikSelect(option);
    }

    function getTimezone(callback, $form) {
        $.getScript("/etc/hiknow/timezone.json", function (data) {
            if (data) {
                var timezoneList = eval(data);
                var innerHtml = '';

                timezoneList.forEach(function (item, index) {
                    innerHtml += '<li data-value="' + item.id + '">'+ Granite.I18n.get(item.displayName) + '</li>';
                });
    
                $timezoneSelect.find('ul').html(innerHtml);
                callback($form);
            }
        })
    }

    function showEmailHint($comp) {
        $comp.find('input[name="email"]').on('focus input', function() {
            var $this = $(this);
            var val = $this.val();
            var $hint = $this.closest('.form-group').find('.hint');
            !val ? $hint.addClass('active'): $hint.removeClass('active');
        }).on('blur', function() {
            $(this).closest('.form-group').find('.hint').removeClass('active');
        })
    }
    
    $(window).on('scroll', function() {
        if (window.innerWidth < 992) {
            var $tooltipContainer = $form.find('.tooltip-container');
            $tooltipContainer.remove();
        }
    })
});
/**
 * Swiper 4.4.1
 * Most modern mobile touch slider and framework with hardware accelerated transitions
 * http://www.idangero.us/swiper/
 *
 * Copyright 2014-2018 Vladimir Kharlampidi
 *
 * Released under the MIT License
 *
 * Released on: September 14, 2018
 */
!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):e.Swiper=t()}(this,function(){"use strict";var f="undefined"==typeof document?{body:{},addEventListener:function(){},removeEventListener:function(){},activeElement:{blur:function(){},nodeName:""},querySelector:function(){return null},querySelectorAll:function(){return[]},getElementById:function(){return null},createEvent:function(){return{initEvent:function(){}}},createElement:function(){return{children:[],childNodes:[],style:{},setAttribute:function(){},getElementsByTagName:function(){return[]}}},location:{hash:""}}:document,Y="undefined"==typeof window?{document:f,navigator:{userAgent:""},location:{},history:{},CustomEvent:function(){return this},addEventListener:function(){},removeEventListener:function(){},getComputedStyle:function(){return{getPropertyValue:function(){return""}}},Image:function(){},Date:function(){},screen:{},setTimeout:function(){},clearTimeout:function(){}}:window,l=function(e){for(var t=0;t<e.length;t+=1)this[t]=e[t];return this.length=e.length,this};function L(e,t){var a=[],i=0;if(e&&!t&&e instanceof l)return e;if(e)if("string"==typeof e){var s,r,n=e.trim();if(0<=n.indexOf("<")&&0<=n.indexOf(">")){var o="div";for(0===n.indexOf("<li")&&(o="ul"),0===n.indexOf("<tr")&&(o="tbody"),0!==n.indexOf("<td")&&0!==n.indexOf("<th")||(o="tr"),0===n.indexOf("<tbody")&&(o="table"),0===n.indexOf("<option")&&(o="select"),(r=f.createElement(o)).innerHTML=n,i=0;i<r.childNodes.length;i+=1)a.push(r.childNodes[i])}else for(s=t||"#"!==e[0]||e.match(/[ .<>:~]/)?(t||f).querySelectorAll(e.trim()):[f.getElementById(e.trim().split("#")[1])],i=0;i<s.length;i+=1)s[i]&&a.push(s[i])}else if(e.nodeType||e===Y||e===f)a.push(e);else if(0<e.length&&e[0].nodeType)for(i=0;i<e.length;i+=1)a.push(e[i]);return new l(a)}function r(e){for(var t=[],a=0;a<e.length;a+=1)-1===t.indexOf(e[a])&&t.push(e[a]);return t}L.fn=l.prototype,L.Class=l,L.Dom7=l;var t={addClass:function(e){if(void 0===e)return this;for(var t=e.split(" "),a=0;a<t.length;a+=1)for(var i=0;i<this.length;i+=1)void 0!==this[i]&&void 0!==this[i].classList&&this[i].classList.add(t[a]);return this},removeClass:function(e){for(var t=e.split(" "),a=0;a<t.length;a+=1)for(var i=0;i<this.length;i+=1)void 0!==this[i]&&void 0!==this[i].classList&&this[i].classList.remove(t[a]);return this},hasClass:function(e){return!!this[0]&&this[0].classList.contains(e)},toggleClass:function(e){for(var t=e.split(" "),a=0;a<t.length;a+=1)for(var i=0;i<this.length;i+=1)void 0!==this[i]&&void 0!==this[i].classList&&this[i].classList.toggle(t[a]);return this},attr:function(e,t){var a=arguments;if(1===arguments.length&&"string"==typeof e)return this[0]?this[0].getAttribute(e):void 0;for(var i=0;i<this.length;i+=1)if(2===a.length)this[i].setAttribute(e,t);else for(var s in e)this[i][s]=e[s],this[i].setAttribute(s,e[s]);return this},removeAttr:function(e){for(var t=0;t<this.length;t+=1)this[t].removeAttribute(e);return this},data:function(e,t){var a;if(void 0!==t){for(var i=0;i<this.length;i+=1)(a=this[i]).dom7ElementDataStorage||(a.dom7ElementDataStorage={}),a.dom7ElementDataStorage[e]=t;return this}if(a=this[0]){if(a.dom7ElementDataStorage&&e in a.dom7ElementDataStorage)return a.dom7ElementDataStorage[e];var s=a.getAttribute("data-"+e);return s||void 0}},transform:function(e){for(var t=0;t<this.length;t+=1){var a=this[t].style;a.webkitTransform=e,a.transform=e}return this},transition:function(e){"string"!=typeof e&&(e+="ms");for(var t=0;t<this.length;t+=1){var a=this[t].style;a.webkitTransitionDuration=e,a.transitionDuration=e}return this},on:function(){for(var e,t=[],a=arguments.length;a--;)t[a]=arguments[a];var i=t[0],r=t[1],n=t[2],s=t[3];function o(e){var t=e.target;if(t){var a=e.target.dom7EventData||[];if(a.indexOf(e)<0&&a.unshift(e),L(t).is(r))n.apply(t,a);else for(var i=L(t).parents(),s=0;s<i.length;s+=1)L(i[s]).is(r)&&n.apply(i[s],a)}}function l(e){var t=e&&e.target&&e.target.dom7EventData||[];t.indexOf(e)<0&&t.unshift(e),n.apply(this,t)}"function"==typeof t[1]&&(i=(e=t)[0],n=e[1],s=e[2],r=void 0),s||(s=!1);for(var d,p=i.split(" "),c=0;c<this.length;c+=1){var u=this[c];if(r)for(d=0;d<p.length;d+=1){var h=p[d];u.dom7LiveListeners||(u.dom7LiveListeners={}),u.dom7LiveListeners[h]||(u.dom7LiveListeners[h]=[]),u.dom7LiveListeners[h].push({listener:n,proxyListener:o}),u.addEventListener(h,o,s)}else for(d=0;d<p.length;d+=1){var v=p[d];u.dom7Listeners||(u.dom7Listeners={}),u.dom7Listeners[v]||(u.dom7Listeners[v]=[]),u.dom7Listeners[v].push({listener:n,proxyListener:l}),u.addEventListener(v,l,s)}}return this},off:function(){for(var e,t=[],a=arguments.length;a--;)t[a]=arguments[a];var i=t[0],s=t[1],r=t[2],n=t[3];"function"==typeof t[1]&&(i=(e=t)[0],r=e[1],n=e[2],s=void 0),n||(n=!1);for(var o=i.split(" "),l=0;l<o.length;l+=1)for(var d=o[l],p=0;p<this.length;p+=1){var c=this[p],u=void 0;if(!s&&c.dom7Listeners?u=c.dom7Listeners[d]:s&&c.dom7LiveListeners&&(u=c.dom7LiveListeners[d]),u&&u.length)for(var h=u.length-1;0<=h;h-=1){var v=u[h];r&&v.listener===r?(c.removeEventListener(d,v.proxyListener,n),u.splice(h,1)):r||(c.removeEventListener(d,v.proxyListener,n),u.splice(h,1))}}return this},trigger:function(){for(var e=[],t=arguments.length;t--;)e[t]=arguments[t];for(var a=e[0].split(" "),i=e[1],s=0;s<a.length;s+=1)for(var r=a[s],n=0;n<this.length;n+=1){var o=this[n],l=void 0;try{l=new Y.CustomEvent(r,{detail:i,bubbles:!0,cancelable:!0})}catch(e){(l=f.createEvent("Event")).initEvent(r,!0,!0),l.detail=i}o.dom7EventData=e.filter(function(e,t){return 0<t}),o.dispatchEvent(l),o.dom7EventData=[],delete o.dom7EventData}return this},transitionEnd:function(t){var a,i=["webkitTransitionEnd","transitionend"],s=this;function r(e){if(e.target===this)for(t.call(this,e),a=0;a<i.length;a+=1)s.off(i[a],r)}if(t)for(a=0;a<i.length;a+=1)s.on(i[a],r);return this},outerWidth:function(e){if(0<this.length){if(e){var t=this.styles();return this[0].offsetWidth+parseFloat(t.getPropertyValue("margin-right"))+parseFloat(t.getPropertyValue("margin-left"))}return this[0].offsetWidth}return null},outerHeight:function(e){if(0<this.length){if(e){var t=this.styles();return this[0].offsetHeight+parseFloat(t.getPropertyValue("margin-top"))+parseFloat(t.getPropertyValue("margin-bottom"))}return this[0].offsetHeight}return null},offset:function(){if(0<this.length){var e=this[0],t=e.getBoundingClientRect(),a=f.body,i=e.clientTop||a.clientTop||0,s=e.clientLeft||a.clientLeft||0,r=e===Y?Y.scrollY:e.scrollTop,n=e===Y?Y.scrollX:e.scrollLeft;return{top:t.top+r-i,left:t.left+n-s}}return null},css:function(e,t){var a;if(1===arguments.length){if("string"!=typeof e){for(a=0;a<this.length;a+=1)for(var i in e)this[a].style[i]=e[i];return this}if(this[0])return Y.getComputedStyle(this[0],null).getPropertyValue(e)}if(2===arguments.length&&"string"==typeof e){for(a=0;a<this.length;a+=1)this[a].style[e]=t;return this}return this},each:function(e){if(!e)return this;for(var t=0;t<this.length;t+=1)if(!1===e.call(this[t],t,this[t]))return this;return this},html:function(e){if(void 0===e)return this[0]?this[0].innerHTML:void 0;for(var t=0;t<this.length;t+=1)this[t].innerHTML=e;return this},text:function(e){if(void 0===e)return this[0]?this[0].textContent.trim():null;for(var t=0;t<this.length;t+=1)this[t].textContent=e;return this},is:function(e){var t,a,i=this[0];if(!i||void 0===e)return!1;if("string"==typeof e){if(i.matches)return i.matches(e);if(i.webkitMatchesSelector)return i.webkitMatchesSelector(e);if(i.msMatchesSelector)return i.msMatchesSelector(e);for(t=L(e),a=0;a<t.length;a+=1)if(t[a]===i)return!0;return!1}if(e===f)return i===f;if(e===Y)return i===Y;if(e.nodeType||e instanceof l){for(t=e.nodeType?[e]:e,a=0;a<t.length;a+=1)if(t[a]===i)return!0;return!1}return!1},index:function(){var e,t=this[0];if(t){for(e=0;null!==(t=t.previousSibling);)1===t.nodeType&&(e+=1);return e}},eq:function(e){if(void 0===e)return this;var t,a=this.length;return new l(a-1<e?[]:e<0?(t=a+e)<0?[]:[this[t]]:[this[e]])},append:function(){for(var e,t=[],a=arguments.length;a--;)t[a]=arguments[a];for(var i=0;i<t.length;i+=1){e=t[i];for(var s=0;s<this.length;s+=1)if("string"==typeof e){var r=f.createElement("div");for(r.innerHTML=e;r.firstChild;)this[s].appendChild(r.firstChild)}else if(e instanceof l)for(var n=0;n<e.length;n+=1)this[s].appendChild(e[n]);else this[s].appendChild(e)}return this},prepend:function(e){var t,a,i=this;for(t=0;t<this.length;t+=1)if("string"==typeof e){var s=f.createElement("div");for(s.innerHTML=e,a=s.childNodes.length-1;0<=a;a-=1)i[t].insertBefore(s.childNodes[a],i[t].childNodes[0])}else if(e instanceof l)for(a=0;a<e.length;a+=1)i[t].insertBefore(e[a],i[t].childNodes[0]);else i[t].insertBefore(e,i[t].childNodes[0]);return this},next:function(e){return 0<this.length?e?this[0].nextElementSibling&&L(this[0].nextElementSibling).is(e)?new l([this[0].nextElementSibling]):new l([]):this[0].nextElementSibling?new l([this[0].nextElementSibling]):new l([]):new l([])},nextAll:function(e){var t=[],a=this[0];if(!a)return new l([]);for(;a.nextElementSibling;){var i=a.nextElementSibling;e?L(i).is(e)&&t.push(i):t.push(i),a=i}return new l(t)},prev:function(e){if(0<this.length){var t=this[0];return e?t.previousElementSibling&&L(t.previousElementSibling).is(e)?new l([t.previousElementSibling]):new l([]):t.previousElementSibling?new l([t.previousElementSibling]):new l([])}return new l([])},prevAll:function(e){var t=[],a=this[0];if(!a)return new l([]);for(;a.previousElementSibling;){var i=a.previousElementSibling;e?L(i).is(e)&&t.push(i):t.push(i),a=i}return new l(t)},parent:function(e){for(var t=[],a=0;a<this.length;a+=1)null!==this[a].parentNode&&(e?L(this[a].parentNode).is(e)&&t.push(this[a].parentNode):t.push(this[a].parentNode));return L(r(t))},parents:function(e){for(var t=[],a=0;a<this.length;a+=1)for(var i=this[a].parentNode;i;)e?L(i).is(e)&&t.push(i):t.push(i),i=i.parentNode;return L(r(t))},closest:function(e){var t=this;return void 0===e?new l([]):(t.is(e)||(t=t.parents(e).eq(0)),t)},find:function(e){for(var t=[],a=0;a<this.length;a+=1)for(var i=this[a].querySelectorAll(e),s=0;s<i.length;s+=1)t.push(i[s]);return new l(t)},children:function(e){for(var t=[],a=0;a<this.length;a+=1)for(var i=this[a].childNodes,s=0;s<i.length;s+=1)e?1===i[s].nodeType&&L(i[s]).is(e)&&t.push(i[s]):1===i[s].nodeType&&t.push(i[s]);return new l(r(t))},remove:function(){for(var e=0;e<this.length;e+=1)this[e].parentNode&&this[e].parentNode.removeChild(this[e]);return this},add:function(){for(var e=[],t=arguments.length;t--;)e[t]=arguments[t];var a,i;for(a=0;a<e.length;a+=1){var s=L(e[a]);for(i=0;i<s.length;i+=1)this[this.length]=s[i],this.length+=1}return this},styles:function(){return this[0]?Y.getComputedStyle(this[0],null):{}}};Object.keys(t).forEach(function(e){L.fn[e]=t[e]});var e,a,i,V={deleteProps:function(e){var t=e;Object.keys(t).forEach(function(e){try{t[e]=null}catch(e){}try{delete t[e]}catch(e){}})},nextTick:function(e,t){return void 0===t&&(t=0),setTimeout(e,t)},now:function(){return Date.now()},getTranslate:function(e,t){var a,i,s;void 0===t&&(t="x");var r=Y.getComputedStyle(e,null);return Y.WebKitCSSMatrix?(6<(i=r.transform||r.webkitTransform).split(",").length&&(i=i.split(", ").map(function(e){return e.replace(",",".")}).join(", ")),s=new Y.WebKitCSSMatrix("none"===i?"":i)):a=(s=r.MozTransform||r.OTransform||r.MsTransform||r.msTransform||r.transform||r.getPropertyValue("transform").replace("translate(","matrix(1, 0, 0, 1,")).toString().split(","),"x"===t&&(i=Y.WebKitCSSMatrix?s.m41:16===a.length?parseFloat(a[12]):parseFloat(a[4])),"y"===t&&(i=Y.WebKitCSSMatrix?s.m42:16===a.length?parseFloat(a[13]):parseFloat(a[5])),i||0},parseUrlQuery:function(e){var t,a,i,s,r={},n=e||Y.location.href;if("string"==typeof n&&n.length)for(s=(a=(n=-1<n.indexOf("?")?n.replace(/\S*\?/,""):"").split("&").filter(function(e){return""!==e})).length,t=0;t<s;t+=1)i=a[t].replace(/#\S+/g,"").split("="),r[decodeURIComponent(i[0])]=void 0===i[1]?void 0:decodeURIComponent(i[1])||"";return r},isObject:function(e){return"object"==typeof e&&null!==e&&e.constructor&&e.constructor===Object},extend:function(){for(var e=[],t=arguments.length;t--;)e[t]=arguments[t];for(var a=Object(e[0]),i=1;i<e.length;i+=1){var s=e[i];if(null!=s)for(var r=Object.keys(Object(s)),n=0,o=r.length;n<o;n+=1){var l=r[n],d=Object.getOwnPropertyDescriptor(s,l);void 0!==d&&d.enumerable&&(V.isObject(a[l])&&V.isObject(s[l])?V.extend(a[l],s[l]):!V.isObject(a[l])&&V.isObject(s[l])?(a[l]={},V.extend(a[l],s[l])):a[l]=s[l])}}return a}},R=(i=f.createElement("div"),{touch:Y.Modernizr&&!0===Y.Modernizr.touch||!!("ontouchstart"in Y||Y.DocumentTouch&&f instanceof Y.DocumentTouch),pointerEvents:!(!Y.navigator.pointerEnabled&&!Y.PointerEvent),prefixedPointerEvents:!!Y.navigator.msPointerEnabled,transition:(a=i.style,"transition"in a||"webkitTransition"in a||"MozTransition"in a),transforms3d:Y.Modernizr&&!0===Y.Modernizr.csstransforms3d||(e=i.style,"webkitPerspective"in e||"MozPerspective"in e||"OPerspective"in e||"MsPerspective"in e||"perspective"in e),flexbox:function(){for(var e=i.style,t="alignItems webkitAlignItems webkitBoxAlign msFlexAlign mozBoxAlign webkitFlexDirection msFlexDirection mozBoxDirection mozBoxOrient webkitBoxDirection webkitBoxOrient".split(" "),a=0;a<t.length;a+=1)if(t[a]in e)return!0;return!1}(),observer:"MutationObserver"in Y||"WebkitMutationObserver"in Y,passiveListener:function(){var e=!1;try{var t=Object.defineProperty({},"passive",{get:function(){e=!0}});Y.addEventListener("testPassiveListener",null,t)}catch(e){}return e}(),gestures:"ongesturestart"in Y}),s=function(e){void 0===e&&(e={});var t=this;t.params=e,t.eventsListeners={},t.params&&t.params.on&&Object.keys(t.params.on).forEach(function(e){t.on(e,t.params.on[e])})},n={components:{configurable:!0}};s.prototype.on=function(e,t,a){var i=this;if("function"!=typeof t)return i;var s=a?"unshift":"push";return e.split(" ").forEach(function(e){i.eventsListeners[e]||(i.eventsListeners[e]=[]),i.eventsListeners[e][s](t)}),i},s.prototype.once=function(i,s,e){var r=this;if("function"!=typeof s)return r;return r.on(i,function e(){for(var t=[],a=arguments.length;a--;)t[a]=arguments[a];s.apply(r,t),r.off(i,e)},e)},s.prototype.off=function(e,i){var s=this;return s.eventsListeners&&e.split(" ").forEach(function(a){void 0===i?s.eventsListeners[a]=[]:s.eventsListeners[a]&&s.eventsListeners[a].length&&s.eventsListeners[a].forEach(function(e,t){e===i&&s.eventsListeners[a].splice(t,1)})}),s},s.prototype.emit=function(){for(var e=[],t=arguments.length;t--;)e[t]=arguments[t];var a,i,s,r=this;return r.eventsListeners&&("string"==typeof e[0]||Array.isArray(e[0])?(a=e[0],i=e.slice(1,e.length),s=r):(a=e[0].events,i=e[0].data,s=e[0].context||r),(Array.isArray(a)?a:a.split(" ")).forEach(function(e){if(r.eventsListeners&&r.eventsListeners[e]){var t=[];r.eventsListeners[e].forEach(function(e){t.push(e)}),t.forEach(function(e){e.apply(s,i)})}})),r},s.prototype.useModulesParams=function(a){var i=this;i.modules&&Object.keys(i.modules).forEach(function(e){var t=i.modules[e];t.params&&V.extend(a,t.params)})},s.prototype.useModules=function(i){void 0===i&&(i={});var s=this;s.modules&&Object.keys(s.modules).forEach(function(e){var a=s.modules[e],t=i[e]||{};a.instance&&Object.keys(a.instance).forEach(function(e){var t=a.instance[e];s[e]="function"==typeof t?t.bind(s):t}),a.on&&s.on&&Object.keys(a.on).forEach(function(e){s.on(e,a.on[e])}),a.create&&a.create.bind(s)(t)})},n.components.set=function(e){this.use&&this.use(e)},s.installModule=function(t){for(var e=[],a=arguments.length-1;0<a--;)e[a]=arguments[a+1];var i=this;i.prototype.modules||(i.prototype.modules={});var s=t.name||Object.keys(i.prototype.modules).length+"_"+V.now();return(i.prototype.modules[s]=t).proto&&Object.keys(t.proto).forEach(function(e){i.prototype[e]=t.proto[e]}),t.static&&Object.keys(t.static).forEach(function(e){i[e]=t.static[e]}),t.install&&t.install.apply(i,e),i},s.use=function(e){for(var t=[],a=arguments.length-1;0<a--;)t[a]=arguments[a+1];var i=this;return Array.isArray(e)?(e.forEach(function(e){return i.installModule(e)}),i):i.installModule.apply(i,[e].concat(t))},Object.defineProperties(s,n);var o={updateSize:function(){var e,t,a=this,i=a.$el;e=void 0!==a.params.width?a.params.width:i[0].clientWidth,t=void 0!==a.params.height?a.params.height:i[0].clientHeight,0===e&&a.isHorizontal()||0===t&&a.isVertical()||(e=e-parseInt(i.css("padding-left"),10)-parseInt(i.css("padding-right"),10),t=t-parseInt(i.css("padding-top"),10)-parseInt(i.css("padding-bottom"),10),V.extend(a,{width:e,height:t,size:a.isHorizontal()?e:t}))},updateSlides:function(){var e=this,t=e.params,a=e.$wrapperEl,i=e.size,s=e.rtlTranslate,r=e.wrongRTL,n=e.virtual&&t.virtual.enabled,o=n?e.virtual.slides.length:e.slides.length,l=a.children("."+e.params.slideClass),d=n?e.virtual.slides.length:l.length,p=[],c=[],u=[],h=t.slidesOffsetBefore;"function"==typeof h&&(h=t.slidesOffsetBefore.call(e));var v=t.slidesOffsetAfter;"function"==typeof v&&(v=t.slidesOffsetAfter.call(e));var f=e.snapGrid.length,m=e.snapGrid.length,g=t.spaceBetween,b=-h,w=0,y=0;if(void 0!==i){var x,T;"string"==typeof g&&0<=g.indexOf("%")&&(g=parseFloat(g.replace("%",""))/100*i),e.virtualSize=-g,s?l.css({marginLeft:"",marginTop:""}):l.css({marginRight:"",marginBottom:""}),1<t.slidesPerColumn&&(x=Math.floor(d/t.slidesPerColumn)===d/e.params.slidesPerColumn?d:Math.ceil(d/t.slidesPerColumn)*t.slidesPerColumn,"auto"!==t.slidesPerView&&"row"===t.slidesPerColumnFill&&(x=Math.max(x,t.slidesPerView*t.slidesPerColumn)));for(var E,S=t.slidesPerColumn,C=x/S,M=C-(t.slidesPerColumn*C-d),k=0;k<d;k+=1){T=0;var z=l.eq(k);if(1<t.slidesPerColumn){var P=void 0,$=void 0,L=void 0;"column"===t.slidesPerColumnFill?(L=k-($=Math.floor(k/S))*S,(M<$||$===M&&L===S-1)&&S<=(L+=1)&&(L=0,$+=1),P=$+L*x/S,z.css({"-webkit-box-ordinal-group":P,"-moz-box-ordinal-group":P,"-ms-flex-order":P,"-webkit-order":P,order:P})):$=k-(L=Math.floor(k/C))*C,z.css("margin-"+(e.isHorizontal()?"top":"left"),0!==L&&t.spaceBetween&&t.spaceBetween+"px").attr("data-swiper-column",$).attr("data-swiper-row",L)}if("none"!==z.css("display")){if("auto"===t.slidesPerView){var I=Y.getComputedStyle(z[0],null),D=z[0].style.transform,O=z[0].style.webkitTransform;D&&(z[0].style.transform="none"),O&&(z[0].style.webkitTransform="none"),T=t.roundLengths?e.isHorizontal()?z.outerWidth(!0):z.outerHeight(!0):e.isHorizontal()?z[0].getBoundingClientRect().width+parseFloat(I.getPropertyValue("margin-left"))+parseFloat(I.getPropertyValue("margin-right")):z[0].getBoundingClientRect().height+parseFloat(I.getPropertyValue("margin-top"))+parseFloat(I.getPropertyValue("margin-bottom")),D&&(z[0].style.transform=D),O&&(z[0].style.webkitTransform=O),t.roundLengths&&(T=Math.floor(T))}else T=(i-(t.slidesPerView-1)*g)/t.slidesPerView,t.roundLengths&&(T=Math.floor(T)),l[k]&&(e.isHorizontal()?l[k].style.width=T+"px":l[k].style.height=T+"px");l[k]&&(l[k].swiperSlideSize=T),u.push(T),t.centeredSlides?(b=b+T/2+w/2+g,0===w&&0!==k&&(b=b-i/2-g),0===k&&(b=b-i/2-g),Math.abs(b)<.001&&(b=0),t.roundLengths&&(b=Math.floor(b)),y%t.slidesPerGroup==0&&p.push(b),c.push(b)):(t.roundLengths&&(b=Math.floor(b)),y%t.slidesPerGroup==0&&p.push(b),c.push(b),b=b+T+g),e.virtualSize+=T+g,w=T,y+=1}}if(e.virtualSize=Math.max(e.virtualSize,i)+v,s&&r&&("slide"===t.effect||"coverflow"===t.effect)&&a.css({width:e.virtualSize+t.spaceBetween+"px"}),R.flexbox&&!t.setWrapperSize||(e.isHorizontal()?a.css({width:e.virtualSize+t.spaceBetween+"px"}):a.css({height:e.virtualSize+t.spaceBetween+"px"})),1<t.slidesPerColumn&&(e.virtualSize=(T+t.spaceBetween)*x,e.virtualSize=Math.ceil(e.virtualSize/t.slidesPerColumn)-t.spaceBetween,e.isHorizontal()?a.css({width:e.virtualSize+t.spaceBetween+"px"}):a.css({height:e.virtualSize+t.spaceBetween+"px"}),t.centeredSlides)){E=[];for(var A=0;A<p.length;A+=1){var H=p[A];t.roundLengths&&(H=Math.floor(H)),p[A]<e.virtualSize+p[0]&&E.push(H)}p=E}if(!t.centeredSlides){E=[];for(var B=0;B<p.length;B+=1){var G=p[B];t.roundLengths&&(G=Math.floor(G)),p[B]<=e.virtualSize-i&&E.push(G)}p=E,1<Math.floor(e.virtualSize-i)-Math.floor(p[p.length-1])&&p.push(e.virtualSize-i)}if(0===p.length&&(p=[0]),0!==t.spaceBetween&&(e.isHorizontal()?s?l.css({marginLeft:g+"px"}):l.css({marginRight:g+"px"}):l.css({marginBottom:g+"px"})),t.centerInsufficientSlides){var N=0;if(u.forEach(function(e){N+=e+(t.spaceBetween?t.spaceBetween:0)}),(N-=t.spaceBetween)<i){var X=(i-N)/2;p.forEach(function(e,t){p[t]=e-X}),c.forEach(function(e,t){c[t]=e+X})}}V.extend(e,{slides:l,snapGrid:p,slidesGrid:c,slidesSizesGrid:u}),d!==o&&e.emit("slidesLengthChange"),p.length!==f&&(e.params.watchOverflow&&e.checkOverflow(),e.emit("snapGridLengthChange")),c.length!==m&&e.emit("slidesGridLengthChange"),(t.watchSlidesProgress||t.watchSlidesVisibility)&&e.updateSlidesOffset()}},updateAutoHeight:function(e){var t,a=this,i=[],s=0;if("number"==typeof e?a.setTransition(e):!0===e&&a.setTransition(a.params.speed),"auto"!==a.params.slidesPerView&&1<a.params.slidesPerView)for(t=0;t<Math.ceil(a.params.slidesPerView);t+=1){var r=a.activeIndex+t;if(r>a.slides.length)break;i.push(a.slides.eq(r)[0])}else i.push(a.slides.eq(a.activeIndex)[0]);for(t=0;t<i.length;t+=1)if(void 0!==i[t]){var n=i[t].offsetHeight;s=s<n?n:s}s&&a.$wrapperEl.css("height",s+"px")},updateSlidesOffset:function(){for(var e=this.slides,t=0;t<e.length;t+=1)e[t].swiperSlideOffset=this.isHorizontal()?e[t].offsetLeft:e[t].offsetTop},updateSlidesProgress:function(e){void 0===e&&(e=this&&this.translate||0);var t=this,a=t.params,i=t.slides,s=t.rtlTranslate;if(0!==i.length){void 0===i[0].swiperSlideOffset&&t.updateSlidesOffset();var r=-e;s&&(r=e),i.removeClass(a.slideVisibleClass),t.visibleSlidesIndexes=[],t.visibleSlides=[];for(var n=0;n<i.length;n+=1){var o=i[n],l=(r+(a.centeredSlides?t.minTranslate():0)-o.swiperSlideOffset)/(o.swiperSlideSize+a.spaceBetween);if(a.watchSlidesVisibility){var d=-(r-o.swiperSlideOffset),p=d+t.slidesSizesGrid[n];(0<=d&&d<t.size||0<p&&p<=t.size||d<=0&&p>=t.size)&&(t.visibleSlides.push(o),t.visibleSlidesIndexes.push(n),i.eq(n).addClass(a.slideVisibleClass))}o.progress=s?-l:l}t.visibleSlides=L(t.visibleSlides)}},updateProgress:function(e){void 0===e&&(e=this&&this.translate||0);var t=this,a=t.params,i=t.maxTranslate()-t.minTranslate(),s=t.progress,r=t.isBeginning,n=t.isEnd,o=r,l=n;0===i?n=r=!(s=0):(r=(s=(e-t.minTranslate())/i)<=0,n=1<=s),V.extend(t,{progress:s,isBeginning:r,isEnd:n}),(a.watchSlidesProgress||a.watchSlidesVisibility)&&t.updateSlidesProgress(e),r&&!o&&t.emit("reachBeginning toEdge"),n&&!l&&t.emit("reachEnd toEdge"),(o&&!r||l&&!n)&&t.emit("fromEdge"),t.emit("progress",s)},updateSlidesClasses:function(){var e,t=this,a=t.slides,i=t.params,s=t.$wrapperEl,r=t.activeIndex,n=t.realIndex,o=t.virtual&&i.virtual.enabled;a.removeClass(i.slideActiveClass+" "+i.slideNextClass+" "+i.slidePrevClass+" "+i.slideDuplicateActiveClass+" "+i.slideDuplicateNextClass+" "+i.slideDuplicatePrevClass),(e=o?t.$wrapperEl.find("."+i.slideClass+'[data-swiper-slide-index="'+r+'"]'):a.eq(r)).addClass(i.slideActiveClass),i.loop&&(e.hasClass(i.slideDuplicateClass)?s.children("."+i.slideClass+":not(."+i.slideDuplicateClass+')[data-swiper-slide-index="'+n+'"]').addClass(i.slideDuplicateActiveClass):s.children("."+i.slideClass+"."+i.slideDuplicateClass+'[data-swiper-slide-index="'+n+'"]').addClass(i.slideDuplicateActiveClass));var l=e.nextAll("."+i.slideClass).eq(0).addClass(i.slideNextClass);i.loop&&0===l.length&&(l=a.eq(0)).addClass(i.slideNextClass);var d=e.prevAll("."+i.slideClass).eq(0).addClass(i.slidePrevClass);i.loop&&0===d.length&&(d=a.eq(-1)).addClass(i.slidePrevClass),i.loop&&(l.hasClass(i.slideDuplicateClass)?s.children("."+i.slideClass+":not(."+i.slideDuplicateClass+')[data-swiper-slide-index="'+l.attr("data-swiper-slide-index")+'"]').addClass(i.slideDuplicateNextClass):s.children("."+i.slideClass+"."+i.slideDuplicateClass+'[data-swiper-slide-index="'+l.attr("data-swiper-slide-index")+'"]').addClass(i.slideDuplicateNextClass),d.hasClass(i.slideDuplicateClass)?s.children("."+i.slideClass+":not(."+i.slideDuplicateClass+')[data-swiper-slide-index="'+d.attr("data-swiper-slide-index")+'"]').addClass(i.slideDuplicatePrevClass):s.children("."+i.slideClass+"."+i.slideDuplicateClass+'[data-swiper-slide-index="'+d.attr("data-swiper-slide-index")+'"]').addClass(i.slideDuplicatePrevClass))},updateActiveIndex:function(e){var t,a=this,i=a.rtlTranslate?a.translate:-a.translate,s=a.slidesGrid,r=a.snapGrid,n=a.params,o=a.activeIndex,l=a.realIndex,d=a.snapIndex,p=e;if(void 0===p){for(var c=0;c<s.length;c+=1)void 0!==s[c+1]?i>=s[c]&&i<s[c+1]-(s[c+1]-s[c])/2?p=c:i>=s[c]&&i<s[c+1]&&(p=c+1):i>=s[c]&&(p=c);n.normalizeSlideIndex&&(p<0||void 0===p)&&(p=0)}if((t=0<=r.indexOf(i)?r.indexOf(i):Math.floor(p/n.slidesPerGroup))>=r.length&&(t=r.length-1),p!==o){var u=parseInt(a.slides.eq(p).attr("data-swiper-slide-index")||p,10);V.extend(a,{snapIndex:t,realIndex:u,previousIndex:o,activeIndex:p}),a.emit("activeIndexChange"),a.emit("snapIndexChange"),l!==u&&a.emit("realIndexChange"),a.emit("slideChange")}else t!==d&&(a.snapIndex=t,a.emit("snapIndexChange"))},updateClickedSlide:function(e){var t=this,a=t.params,i=L(e.target).closest("."+a.slideClass)[0],s=!1;if(i)for(var r=0;r<t.slides.length;r+=1)t.slides[r]===i&&(s=!0);if(!i||!s)return t.clickedSlide=void 0,void(t.clickedIndex=void 0);t.clickedSlide=i,t.virtual&&t.params.virtual.enabled?t.clickedIndex=parseInt(L(i).attr("data-swiper-slide-index"),10):t.clickedIndex=L(i).index(),a.slideToClickedSlide&&void 0!==t.clickedIndex&&t.clickedIndex!==t.activeIndex&&t.slideToClickedSlide()}};var d={getTranslate:function(e){void 0===e&&(e=this.isHorizontal()?"x":"y");var t=this.params,a=this.rtlTranslate,i=this.translate,s=this.$wrapperEl;if(t.virtualTranslate)return a?-i:i;var r=V.getTranslate(s[0],e);return a&&(r=-r),r||0},setTranslate:function(e,t){var a=this,i=a.rtlTranslate,s=a.params,r=a.$wrapperEl,n=a.progress,o=0,l=0;a.isHorizontal()?o=i?-e:e:l=e,s.roundLengths&&(o=Math.floor(o),l=Math.floor(l)),s.virtualTranslate||(R.transforms3d?r.transform("translate3d("+o+"px, "+l+"px, 0px)"):r.transform("translate("+o+"px, "+l+"px)")),a.previousTranslate=a.translate,a.translate=a.isHorizontal()?o:l;var d=a.maxTranslate()-a.minTranslate();(0===d?0:(e-a.minTranslate())/d)!==n&&a.updateProgress(e),a.emit("setTranslate",a.translate,t)},minTranslate:function(){return-this.snapGrid[0]},maxTranslate:function(){return-this.snapGrid[this.snapGrid.length-1]}};var p={setTransition:function(e,t){this.$wrapperEl.transition(e),this.emit("setTransition",e,t)},transitionStart:function(e,t){void 0===e&&(e=!0);var a=this,i=a.activeIndex,s=a.params,r=a.previousIndex;s.autoHeight&&a.updateAutoHeight();var n=t;if(n||(n=r<i?"next":i<r?"prev":"reset"),a.emit("transitionStart"),e&&i!==r){if("reset"===n)return void a.emit("slideResetTransitionStart");a.emit("slideChangeTransitionStart"),"next"===n?a.emit("slideNextTransitionStart"):a.emit("slidePrevTransitionStart")}},transitionEnd:function(e,t){void 0===e&&(e=!0);var a=this,i=a.activeIndex,s=a.previousIndex;a.animating=!1,a.setTransition(0);var r=t;if(r||(r=s<i?"next":i<s?"prev":"reset"),a.emit("transitionEnd"),e&&i!==s){if("reset"===r)return void a.emit("slideResetTransitionEnd");a.emit("slideChangeTransitionEnd"),"next"===r?a.emit("slideNextTransitionEnd"):a.emit("slidePrevTransitionEnd")}}};var c={slideTo:function(e,t,a,i){void 0===e&&(e=0),void 0===t&&(t=this.params.speed),void 0===a&&(a=!0);var s=this,r=e;r<0&&(r=0);var n=s.params,o=s.snapGrid,l=s.slidesGrid,d=s.previousIndex,p=s.activeIndex,c=s.rtlTranslate;if(s.animating&&n.preventInteractionOnTransition)return!1;var u=Math.floor(r/n.slidesPerGroup);u>=o.length&&(u=o.length-1),(p||n.initialSlide||0)===(d||0)&&a&&s.emit("beforeSlideChangeStart");var h,v=-o[u];if(s.updateProgress(v),n.normalizeSlideIndex)for(var f=0;f<l.length;f+=1)-Math.floor(100*v)>=Math.floor(100*l[f])&&(r=f);if(s.initialized&&r!==p){if(!s.allowSlideNext&&v<s.translate&&v<s.minTranslate())return!1;if(!s.allowSlidePrev&&v>s.translate&&v>s.maxTranslate()&&(p||0)!==r)return!1}return h=p<r?"next":r<p?"prev":"reset",c&&-v===s.translate||!c&&v===s.translate?(s.updateActiveIndex(r),n.autoHeight&&s.updateAutoHeight(),s.updateSlidesClasses(),"slide"!==n.effect&&s.setTranslate(v),"reset"!==h&&(s.transitionStart(a,h),s.transitionEnd(a,h)),!1):(0!==t&&R.transition?(s.setTransition(t),s.setTranslate(v),s.updateActiveIndex(r),s.updateSlidesClasses(),s.emit("beforeTransitionStart",t,i),s.transitionStart(a,h),s.animating||(s.animating=!0,s.onSlideToWrapperTransitionEnd||(s.onSlideToWrapperTransitionEnd=function(e){s&&!s.destroyed&&e.target===this&&(s.$wrapperEl[0].removeEventListener("transitionend",s.onSlideToWrapperTransitionEnd),s.$wrapperEl[0].removeEventListener("webkitTransitionEnd",s.onSlideToWrapperTransitionEnd),s.onSlideToWrapperTransitionEnd=null,delete s.onSlideToWrapperTransitionEnd,s.transitionEnd(a,h))}),s.$wrapperEl[0].addEventListener("transitionend",s.onSlideToWrapperTransitionEnd),s.$wrapperEl[0].addEventListener("webkitTransitionEnd",s.onSlideToWrapperTransitionEnd))):(s.setTransition(0),s.setTranslate(v),s.updateActiveIndex(r),s.updateSlidesClasses(),s.emit("beforeTransitionStart",t,i),s.transitionStart(a,h),s.transitionEnd(a,h)),!0)},slideToLoop:function(e,t,a,i){void 0===e&&(e=0),void 0===t&&(t=this.params.speed),void 0===a&&(a=!0);var s=e;return this.params.loop&&(s+=this.loopedSlides),this.slideTo(s,t,a,i)},slideNext:function(e,t,a){void 0===e&&(e=this.params.speed),void 0===t&&(t=!0);var i=this,s=i.params,r=i.animating;return s.loop?!r&&(i.loopFix(),i._clientLeft=i.$wrapperEl[0].clientLeft,i.slideTo(i.activeIndex+s.slidesPerGroup,e,t,a)):i.slideTo(i.activeIndex+s.slidesPerGroup,e,t,a)},slidePrev:function(e,t,a){void 0===e&&(e=this.params.speed),void 0===t&&(t=!0);var i=this,s=i.params,r=i.animating,n=i.snapGrid,o=i.slidesGrid,l=i.rtlTranslate;if(s.loop){if(r)return!1;i.loopFix(),i._clientLeft=i.$wrapperEl[0].clientLeft}function d(e){return e<0?-Math.floor(Math.abs(e)):Math.floor(e)}var p,c=d(l?i.translate:-i.translate),u=n.map(function(e){return d(e)}),h=(o.map(function(e){return d(e)}),n[u.indexOf(c)],n[u.indexOf(c)-1]);return void 0!==h&&(p=o.indexOf(h))<0&&(p=i.activeIndex-1),i.slideTo(p,e,t,a)},slideReset:function(e,t,a){return void 0===e&&(e=this.params.speed),void 0===t&&(t=!0),this.slideTo(this.activeIndex,e,t,a)},slideToClosest:function(e,t,a){void 0===e&&(e=this.params.speed),void 0===t&&(t=!0);var i=this,s=i.activeIndex,r=Math.floor(s/i.params.slidesPerGroup);if(r<i.snapGrid.length-1){var n=i.rtlTranslate?i.translate:-i.translate,o=i.snapGrid[r];(i.snapGrid[r+1]-o)/2<n-o&&(s=i.params.slidesPerGroup)}return i.slideTo(s,e,t,a)},slideToClickedSlide:function(){var e,t=this,a=t.params,i=t.$wrapperEl,s="auto"===a.slidesPerView?t.slidesPerViewDynamic():a.slidesPerView,r=t.clickedIndex;if(a.loop){if(t.animating)return;e=parseInt(L(t.clickedSlide).attr("data-swiper-slide-index"),10),a.centeredSlides?r<t.loopedSlides-s/2||r>t.slides.length-t.loopedSlides+s/2?(t.loopFix(),r=i.children("."+a.slideClass+'[data-swiper-slide-index="'+e+'"]:not(.'+a.slideDuplicateClass+")").eq(0).index(),V.nextTick(function(){t.slideTo(r)})):t.slideTo(r):r>t.slides.length-s?(t.loopFix(),r=i.children("."+a.slideClass+'[data-swiper-slide-index="'+e+'"]:not(.'+a.slideDuplicateClass+")").eq(0).index(),V.nextTick(function(){t.slideTo(r)})):t.slideTo(r)}else t.slideTo(r)}};var u={loopCreate:function(){var i=this,e=i.params,t=i.$wrapperEl;t.children("."+e.slideClass+"."+e.slideDuplicateClass).remove();var s=t.children("."+e.slideClass);if(e.loopFillGroupWithBlank){var a=e.slidesPerGroup-s.length%e.slidesPerGroup;if(a!==e.slidesPerGroup){for(var r=0;r<a;r+=1){var n=L(f.createElement("div")).addClass(e.slideClass+" "+e.slideBlankClass);t.append(n)}s=t.children("."+e.slideClass)}}"auto"!==e.slidesPerView||e.loopedSlides||(e.loopedSlides=s.length),i.loopedSlides=parseInt(e.loopedSlides||e.slidesPerView,10),i.loopedSlides+=e.loopAdditionalSlides,i.loopedSlides>s.length&&(i.loopedSlides=s.length);var o=[],l=[];s.each(function(e,t){var a=L(t);e<i.loopedSlides&&l.push(t),e<s.length&&e>=s.length-i.loopedSlides&&o.push(t),a.attr("data-swiper-slide-index",e)});for(var d=0;d<l.length;d+=1)t.append(L(l[d].cloneNode(!0)).addClass(e.slideDuplicateClass));for(var p=o.length-1;0<=p;p-=1)t.prepend(L(o[p].cloneNode(!0)).addClass(e.slideDuplicateClass))},loopFix:function(){var e,t=this,a=t.params,i=t.activeIndex,s=t.slides,r=t.loopedSlides,n=t.allowSlidePrev,o=t.allowSlideNext,l=t.snapGrid,d=t.rtlTranslate;t.allowSlidePrev=!0,t.allowSlideNext=!0;var p=-l[i]-t.getTranslate();i<r?(e=s.length-3*r+i,e+=r,t.slideTo(e,0,!1,!0)&&0!==p&&t.setTranslate((d?-t.translate:t.translate)-p)):("auto"===a.slidesPerView&&2*r<=i||i>=s.length-r)&&(e=-s.length+i+r,e+=r,t.slideTo(e,0,!1,!0)&&0!==p&&t.setTranslate((d?-t.translate:t.translate)-p));t.allowSlidePrev=n,t.allowSlideNext=o},loopDestroy:function(){var e=this.$wrapperEl,t=this.params,a=this.slides;e.children("."+t.slideClass+"."+t.slideDuplicateClass).remove(),a.removeAttr("data-swiper-slide-index")}};var h={setGrabCursor:function(e){if(!(R.touch||!this.params.simulateTouch||this.params.watchOverflow&&this.isLocked)){var t=this.el;t.style.cursor="move",t.style.cursor=e?"-webkit-grabbing":"-webkit-grab",t.style.cursor=e?"-moz-grabbin":"-moz-grab",t.style.cursor=e?"grabbing":"grab"}},unsetGrabCursor:function(){R.touch||this.params.watchOverflow&&this.isLocked||(this.el.style.cursor="")}};var v={appendSlide:function(e){var t=this,a=t.$wrapperEl,i=t.params;if(i.loop&&t.loopDestroy(),"object"==typeof e&&"length"in e)for(var s=0;s<e.length;s+=1)e[s]&&a.append(e[s]);else a.append(e);i.loop&&t.loopCreate(),i.observer&&R.observer||t.update()},prependSlide:function(e){var t=this,a=t.params,i=t.$wrapperEl,s=t.activeIndex;a.loop&&t.loopDestroy();var r=s+1;if("object"==typeof e&&"length"in e){for(var n=0;n<e.length;n+=1)e[n]&&i.prepend(e[n]);r=s+e.length}else i.prepend(e);a.loop&&t.loopCreate(),a.observer&&R.observer||t.update(),t.slideTo(r,0,!1)},addSlide:function(e,t){var a=this,i=a.$wrapperEl,s=a.params,r=a.activeIndex;s.loop&&(r-=a.loopedSlides,a.loopDestroy(),a.slides=i.children("."+s.slideClass));var n=a.slides.length;if(e<=0)a.prependSlide(t);else if(n<=e)a.appendSlide(t);else{for(var o=e<r?r+1:r,l=[],d=n-1;e<=d;d-=1){var p=a.slides.eq(d);p.remove(),l.unshift(p)}if("object"==typeof t&&"length"in t){for(var c=0;c<t.length;c+=1)t[c]&&i.append(t[c]);o=e<r?r+t.length:r}else i.append(t);for(var u=0;u<l.length;u+=1)i.append(l[u]);s.loop&&a.loopCreate(),s.observer&&R.observer||a.update(),s.loop?a.slideTo(o+a.loopedSlides,0,!1):a.slideTo(o,0,!1)}},removeSlide:function(e){var t=this,a=t.params,i=t.$wrapperEl,s=t.activeIndex;a.loop&&(s-=t.loopedSlides,t.loopDestroy(),t.slides=i.children("."+a.slideClass));var r,n=s;if("object"==typeof e&&"length"in e){for(var o=0;o<e.length;o+=1)r=e[o],t.slides[r]&&t.slides.eq(r).remove(),r<n&&(n-=1);n=Math.max(n,0)}else r=e,t.slides[r]&&t.slides.eq(r).remove(),r<n&&(n-=1),n=Math.max(n,0);a.loop&&t.loopCreate(),a.observer&&R.observer||t.update(),a.loop?t.slideTo(n+t.loopedSlides,0,!1):t.slideTo(n,0,!1)},removeAllSlides:function(){for(var e=[],t=0;t<this.slides.length;t+=1)e.push(t);this.removeSlide(e)}},m=function(){var e=Y.navigator.userAgent,t={ios:!1,android:!1,androidChrome:!1,desktop:!1,windows:!1,iphone:!1,ipod:!1,ipad:!1,cordova:Y.cordova||Y.phonegap,phonegap:Y.cordova||Y.phonegap},a=e.match(/(Windows Phone);?[\s\/]+([\d.]+)?/),i=e.match(/(Android);?[\s\/]+([\d.]+)?/),s=e.match(/(iPad).*OS\s([\d_]+)/),r=e.match(/(iPod)(.*OS\s([\d_]+))?/),n=!s&&e.match(/(iPhone\sOS|iOS)\s([\d_]+)/);if(a&&(t.os="windows",t.osVersion=a[2],t.windows=!0),i&&!a&&(t.os="android",t.osVersion=i[2],t.android=!0,t.androidChrome=0<=e.toLowerCase().indexOf("chrome")),(s||n||r)&&(t.os="ios",t.ios=!0),n&&!r&&(t.osVersion=n[2].replace(/_/g,"."),t.iphone=!0),s&&(t.osVersion=s[2].replace(/_/g,"."),t.ipad=!0),r&&(t.osVersion=r[3]?r[3].replace(/_/g,"."):null,t.iphone=!0),t.ios&&t.osVersion&&0<=e.indexOf("Version/")&&"10"===t.osVersion.split(".")[0]&&(t.osVersion=e.toLowerCase().split("version/")[1].split(" ")[0]),t.desktop=!(t.os||t.android||t.webView),t.webView=(n||s||r)&&e.match(/.*AppleWebKit(?!.*Safari)/i),t.os&&"ios"===t.os){var o=t.osVersion.split("."),l=f.querySelector('meta[name="viewport"]');t.minimalUi=!t.webView&&(r||n)&&(1*o[0]==7?1<=1*o[1]:7<1*o[0])&&l&&0<=l.getAttribute("content").indexOf("minimal-ui")}return t.pixelRatio=Y.devicePixelRatio||1,t}();function g(){var e=this,t=e.params,a=e.el;if(!a||0!==a.offsetWidth){t.breakpoints&&e.setBreakpoint();var i=e.allowSlideNext,s=e.allowSlidePrev,r=e.snapGrid;if(e.allowSlideNext=!0,e.allowSlidePrev=!0,e.updateSize(),e.updateSlides(),t.freeMode){var n=Math.min(Math.max(e.translate,e.maxTranslate()),e.minTranslate());e.setTranslate(n),e.updateActiveIndex(),e.updateSlidesClasses(),t.autoHeight&&e.updateAutoHeight()}else e.updateSlidesClasses(),("auto"===t.slidesPerView||1<t.slidesPerView)&&e.isEnd&&!e.params.centeredSlides?e.slideTo(e.slides.length-1,0,!1,!0):e.slideTo(e.activeIndex,0,!1,!0);e.allowSlidePrev=s,e.allowSlideNext=i,e.params.watchOverflow&&r!==e.snapGrid&&e.checkOverflow()}}var b={attachEvents:function(){var e=this,t=e.params,a=e.touchEvents,i=e.el,s=e.wrapperEl;e.onTouchStart=function(e){var t=this,a=t.touchEventsData,i=t.params,s=t.touches;if(!t.animating||!i.preventInteractionOnTransition){var r=e;if(r.originalEvent&&(r=r.originalEvent),a.isTouchEvent="touchstart"===r.type,(a.isTouchEvent||!("which"in r)||3!==r.which)&&!(!a.isTouchEvent&&"button"in r&&0<r.button||a.isTouched&&a.isMoved))if(i.noSwiping&&L(r.target).closest(i.noSwipingSelector?i.noSwipingSelector:"."+i.noSwipingClass)[0])t.allowClick=!0;else if(!i.swipeHandler||L(r).closest(i.swipeHandler)[0]){s.currentX="touchstart"===r.type?r.targetTouches[0].pageX:r.pageX,s.currentY="touchstart"===r.type?r.targetTouches[0].pageY:r.pageY;var n=s.currentX,o=s.currentY,l=i.edgeSwipeDetection||i.iOSEdgeSwipeDetection,d=i.edgeSwipeThreshold||i.iOSEdgeSwipeThreshold;if(!l||!(n<=d||n>=Y.screen.width-d)){if(V.extend(a,{isTouched:!0,isMoved:!1,allowTouchCallbacks:!0,isScrolling:void 0,startMoving:void 0}),s.startX=n,s.startY=o,a.touchStartTime=V.now(),t.allowClick=!0,t.updateSize(),t.swipeDirection=void 0,0<i.threshold&&(a.allowThresholdMove=!1),"touchstart"!==r.type){var p=!0;L(r.target).is(a.formElements)&&(p=!1),f.activeElement&&L(f.activeElement).is(a.formElements)&&f.activeElement!==r.target&&f.activeElement.blur(),p&&t.allowTouchMove&&i.touchStartPreventDefault&&r.preventDefault()}t.emit("touchStart",r)}}}}.bind(e),e.onTouchMove=function(e){var t=this,a=t.touchEventsData,i=t.params,s=t.touches,r=t.rtlTranslate,n=e;if(n.originalEvent&&(n=n.originalEvent),a.isTouched){if(!a.isTouchEvent||"mousemove"!==n.type){var o="touchmove"===n.type?n.targetTouches[0].pageX:n.pageX,l="touchmove"===n.type?n.targetTouches[0].pageY:n.pageY;if(n.preventedByNestedSwiper)return s.startX=o,void(s.startY=l);if(!t.allowTouchMove)return t.allowClick=!1,void(a.isTouched&&(V.extend(s,{startX:o,startY:l,currentX:o,currentY:l}),a.touchStartTime=V.now()));if(a.isTouchEvent&&i.touchReleaseOnEdges&&!i.loop)if(t.isVertical()){if(l<s.startY&&t.translate<=t.maxTranslate()||l>s.startY&&t.translate>=t.minTranslate())return a.isTouched=!1,void(a.isMoved=!1)}else if(o<s.startX&&t.translate<=t.maxTranslate()||o>s.startX&&t.translate>=t.minTranslate())return;if(a.isTouchEvent&&f.activeElement&&n.target===f.activeElement&&L(n.target).is(a.formElements))return a.isMoved=!0,void(t.allowClick=!1);if(a.allowTouchCallbacks&&t.emit("touchMove",n),!(n.targetTouches&&1<n.targetTouches.length)){s.currentX=o,s.currentY=l;var d,p=s.currentX-s.startX,c=s.currentY-s.startY;if(!(t.params.threshold&&Math.sqrt(Math.pow(p,2)+Math.pow(c,2))<t.params.threshold))if(void 0===a.isScrolling&&(t.isHorizontal()&&s.currentY===s.startY||t.isVertical()&&s.currentX===s.startX?a.isScrolling=!1:25<=p*p+c*c&&(d=180*Math.atan2(Math.abs(c),Math.abs(p))/Math.PI,a.isScrolling=t.isHorizontal()?d>i.touchAngle:90-d>i.touchAngle)),a.isScrolling&&t.emit("touchMoveOpposite",n),void 0===a.startMoving&&(s.currentX===s.startX&&s.currentY===s.startY||(a.startMoving=!0)),a.isScrolling)a.isTouched=!1;else if(a.startMoving){t.allowClick=!1,n.preventDefault(),i.touchMoveStopPropagation&&!i.nested&&n.stopPropagation(),a.isMoved||(i.loop&&t.loopFix(),a.startTranslate=t.getTranslate(),t.setTransition(0),t.animating&&t.$wrapperEl.trigger("webkitTransitionEnd transitionend"),a.allowMomentumBounce=!1,!i.grabCursor||!0!==t.allowSlideNext&&!0!==t.allowSlidePrev||t.setGrabCursor(!0),t.emit("sliderFirstMove",n)),t.emit("sliderMove",n),a.isMoved=!0;var u=t.isHorizontal()?p:c;s.diff=u,u*=i.touchRatio,r&&(u=-u),t.swipeDirection=0<u?"prev":"next",a.currentTranslate=u+a.startTranslate;var h=!0,v=i.resistanceRatio;if(i.touchReleaseOnEdges&&(v=0),0<u&&a.currentTranslate>t.minTranslate()?(h=!1,i.resistance&&(a.currentTranslate=t.minTranslate()-1+Math.pow(-t.minTranslate()+a.startTranslate+u,v))):u<0&&a.currentTranslate<t.maxTranslate()&&(h=!1,i.resistance&&(a.currentTranslate=t.maxTranslate()+1-Math.pow(t.maxTranslate()-a.startTranslate-u,v))),h&&(n.preventedByNestedSwiper=!0),!t.allowSlideNext&&"next"===t.swipeDirection&&a.currentTranslate<a.startTranslate&&(a.currentTranslate=a.startTranslate),!t.allowSlidePrev&&"prev"===t.swipeDirection&&a.currentTranslate>a.startTranslate&&(a.currentTranslate=a.startTranslate),0<i.threshold){if(!(Math.abs(u)>i.threshold||a.allowThresholdMove))return void(a.currentTranslate=a.startTranslate);if(!a.allowThresholdMove)return a.allowThresholdMove=!0,s.startX=s.currentX,s.startY=s.currentY,a.currentTranslate=a.startTranslate,void(s.diff=t.isHorizontal()?s.currentX-s.startX:s.currentY-s.startY)}i.followFinger&&((i.freeMode||i.watchSlidesProgress||i.watchSlidesVisibility)&&(t.updateActiveIndex(),t.updateSlidesClasses()),i.freeMode&&(0===a.velocities.length&&a.velocities.push({position:s[t.isHorizontal()?"startX":"startY"],time:a.touchStartTime}),a.velocities.push({position:s[t.isHorizontal()?"currentX":"currentY"],time:V.now()})),t.updateProgress(a.currentTranslate),t.setTranslate(a.currentTranslate))}}}}else a.startMoving&&a.isScrolling&&t.emit("touchMoveOpposite",n)}.bind(e),e.onTouchEnd=function(e){var t=this,a=t.touchEventsData,i=t.params,s=t.touches,r=t.rtlTranslate,n=t.$wrapperEl,o=t.slidesGrid,l=t.snapGrid,d=e;if(d.originalEvent&&(d=d.originalEvent),a.allowTouchCallbacks&&t.emit("touchEnd",d),a.allowTouchCallbacks=!1,!a.isTouched)return a.isMoved&&i.grabCursor&&t.setGrabCursor(!1),a.isMoved=!1,void(a.startMoving=!1);i.grabCursor&&a.isMoved&&a.isTouched&&(!0===t.allowSlideNext||!0===t.allowSlidePrev)&&t.setGrabCursor(!1);var p,c=V.now(),u=c-a.touchStartTime;if(t.allowClick&&(t.updateClickedSlide(d),t.emit("tap",d),u<300&&300<c-a.lastClickTime&&(a.clickTimeout&&clearTimeout(a.clickTimeout),a.clickTimeout=V.nextTick(function(){t&&!t.destroyed&&t.emit("click",d)},300)),u<300&&c-a.lastClickTime<300&&(a.clickTimeout&&clearTimeout(a.clickTimeout),t.emit("doubleTap",d))),a.lastClickTime=V.now(),V.nextTick(function(){t.destroyed||(t.allowClick=!0)}),!a.isTouched||!a.isMoved||!t.swipeDirection||0===s.diff||a.currentTranslate===a.startTranslate)return a.isTouched=!1,a.isMoved=!1,void(a.startMoving=!1);if(a.isTouched=!1,a.isMoved=!1,a.startMoving=!1,p=i.followFinger?r?t.translate:-t.translate:-a.currentTranslate,i.freeMode){if(p<-t.minTranslate())return void t.slideTo(t.activeIndex);if(p>-t.maxTranslate())return void(t.slides.length<l.length?t.slideTo(l.length-1):t.slideTo(t.slides.length-1));if(i.freeModeMomentum){if(1<a.velocities.length){var h=a.velocities.pop(),v=a.velocities.pop(),f=h.position-v.position,m=h.time-v.time;t.velocity=f/m,t.velocity/=2,Math.abs(t.velocity)<i.freeModeMinimumVelocity&&(t.velocity=0),(150<m||300<V.now()-h.time)&&(t.velocity=0)}else t.velocity=0;t.velocity*=i.freeModeMomentumVelocityRatio,a.velocities.length=0;var g=1e3*i.freeModeMomentumRatio,b=t.velocity*g,w=t.translate+b;r&&(w=-w);var y,x,T=!1,E=20*Math.abs(t.velocity)*i.freeModeMomentumBounceRatio;if(w<t.maxTranslate())i.freeModeMomentumBounce?(w+t.maxTranslate()<-E&&(w=t.maxTranslate()-E),y=t.maxTranslate(),T=!0,a.allowMomentumBounce=!0):w=t.maxTranslate(),i.loop&&i.centeredSlides&&(x=!0);else if(w>t.minTranslate())i.freeModeMomentumBounce?(w-t.minTranslate()>E&&(w=t.minTranslate()+E),y=t.minTranslate(),T=!0,a.allowMomentumBounce=!0):w=t.minTranslate(),i.loop&&i.centeredSlides&&(x=!0);else if(i.freeModeSticky){for(var S,C=0;C<l.length;C+=1)if(l[C]>-w){S=C;break}w=-(w=Math.abs(l[S]-w)<Math.abs(l[S-1]-w)||"next"===t.swipeDirection?l[S]:l[S-1])}if(x&&t.once("transitionEnd",function(){t.loopFix()}),0!==t.velocity)g=r?Math.abs((-w-t.translate)/t.velocity):Math.abs((w-t.translate)/t.velocity);else if(i.freeModeSticky)return void t.slideToClosest();i.freeModeMomentumBounce&&T?(t.updateProgress(y),t.setTransition(g),t.setTranslate(w),t.transitionStart(!0,t.swipeDirection),t.animating=!0,n.transitionEnd(function(){t&&!t.destroyed&&a.allowMomentumBounce&&(t.emit("momentumBounce"),t.setTransition(i.speed),t.setTranslate(y),n.transitionEnd(function(){t&&!t.destroyed&&t.transitionEnd()}))})):t.velocity?(t.updateProgress(w),t.setTransition(g),t.setTranslate(w),t.transitionStart(!0,t.swipeDirection),t.animating||(t.animating=!0,n.transitionEnd(function(){t&&!t.destroyed&&t.transitionEnd()}))):t.updateProgress(w),t.updateActiveIndex(),t.updateSlidesClasses()}else if(i.freeModeSticky)return void t.slideToClosest();(!i.freeModeMomentum||u>=i.longSwipesMs)&&(t.updateProgress(),t.updateActiveIndex(),t.updateSlidesClasses())}else{for(var M=0,k=t.slidesSizesGrid[0],z=0;z<o.length;z+=i.slidesPerGroup)void 0!==o[z+i.slidesPerGroup]?p>=o[z]&&p<o[z+i.slidesPerGroup]&&(k=o[(M=z)+i.slidesPerGroup]-o[z]):p>=o[z]&&(M=z,k=o[o.length-1]-o[o.length-2]);var P=(p-o[M])/k;if(u>i.longSwipesMs){if(!i.longSwipes)return void t.slideTo(t.activeIndex);"next"===t.swipeDirection&&(P>=i.longSwipesRatio?t.slideTo(M+i.slidesPerGroup):t.slideTo(M)),"prev"===t.swipeDirection&&(P>1-i.longSwipesRatio?t.slideTo(M+i.slidesPerGroup):t.slideTo(M))}else{if(!i.shortSwipes)return void t.slideTo(t.activeIndex);"next"===t.swipeDirection&&t.slideTo(M+i.slidesPerGroup),"prev"===t.swipeDirection&&t.slideTo(M)}}}.bind(e),e.onClick=function(e){this.allowClick||(this.params.preventClicks&&e.preventDefault(),this.params.preventClicksPropagation&&this.animating&&(e.stopPropagation(),e.stopImmediatePropagation()))}.bind(e);var r="container"===t.touchEventsTarget?i:s,n=!!t.nested;if(R.touch||!R.pointerEvents&&!R.prefixedPointerEvents){if(R.touch){var o=!("touchstart"!==a.start||!R.passiveListener||!t.passiveListeners)&&{passive:!0,capture:!1};r.addEventListener(a.start,e.onTouchStart,o),r.addEventListener(a.move,e.onTouchMove,R.passiveListener?{passive:!1,capture:n}:n),r.addEventListener(a.end,e.onTouchEnd,o)}(t.simulateTouch&&!m.ios&&!m.android||t.simulateTouch&&!R.touch&&m.ios)&&(r.addEventListener("mousedown",e.onTouchStart,!1),f.addEventListener("mousemove",e.onTouchMove,n),f.addEventListener("mouseup",e.onTouchEnd,!1))}else r.addEventListener(a.start,e.onTouchStart,!1),f.addEventListener(a.move,e.onTouchMove,n),f.addEventListener(a.end,e.onTouchEnd,!1);(t.preventClicks||t.preventClicksPropagation)&&r.addEventListener("click",e.onClick,!0),e.on(m.ios||m.android?"resize orientationchange observerUpdate":"resize observerUpdate",g,!0)},detachEvents:function(){var e=this,t=e.params,a=e.touchEvents,i=e.el,s=e.wrapperEl,r="container"===t.touchEventsTarget?i:s,n=!!t.nested;if(R.touch||!R.pointerEvents&&!R.prefixedPointerEvents){if(R.touch){var o=!("onTouchStart"!==a.start||!R.passiveListener||!t.passiveListeners)&&{passive:!0,capture:!1};r.removeEventListener(a.start,e.onTouchStart,o),r.removeEventListener(a.move,e.onTouchMove,n),r.removeEventListener(a.end,e.onTouchEnd,o)}(t.simulateTouch&&!m.ios&&!m.android||t.simulateTouch&&!R.touch&&m.ios)&&(r.removeEventListener("mousedown",e.onTouchStart,!1),f.removeEventListener("mousemove",e.onTouchMove,n),f.removeEventListener("mouseup",e.onTouchEnd,!1))}else r.removeEventListener(a.start,e.onTouchStart,!1),f.removeEventListener(a.move,e.onTouchMove,n),f.removeEventListener(a.end,e.onTouchEnd,!1);(t.preventClicks||t.preventClicksPropagation)&&r.removeEventListener("click",e.onClick,!0),e.off(m.ios||m.android?"resize orientationchange observerUpdate":"resize observerUpdate",g)}};var w,y={setBreakpoint:function(){var e=this,t=e.activeIndex,a=e.initialized,i=e.loopedSlides;void 0===i&&(i=0);var s=e.params,r=s.breakpoints;if(r&&(!r||0!==Object.keys(r).length)){var n=e.getBreakpoint(r);if(n&&e.currentBreakpoint!==n){var o=n in r?r[n]:e.originalParams,l=s.loop&&o.slidesPerView!==s.slidesPerView;V.extend(e.params,o),V.extend(e,{allowTouchMove:e.params.allowTouchMove,allowSlideNext:e.params.allowSlideNext,allowSlidePrev:e.params.allowSlidePrev}),e.currentBreakpoint=n,l&&a&&(e.loopDestroy(),e.loopCreate(),e.updateSlides(),e.slideTo(t-i+e.loopedSlides,0,!1)),e.emit("breakpoint",o)}}},getBreakpoint:function(e){if(e){var t=!1,a=[];Object.keys(e).forEach(function(e){a.push(e)}),a.sort(function(e,t){return parseInt(e,10)-parseInt(t,10)});for(var i=0;i<a.length;i+=1){var s=a[i];this.params.breakpointsInverse?s<=Y.innerWidth&&(t=s):s>=Y.innerWidth&&!t&&(t=s)}return t||"max"}}},I={isIE:!!Y.navigator.userAgent.match(/Trident/g)||!!Y.navigator.userAgent.match(/MSIE/g),isEdge:!!Y.navigator.userAgent.match(/Edge/g),isSafari:(w=Y.navigator.userAgent.toLowerCase(),0<=w.indexOf("safari")&&w.indexOf("chrome")<0&&w.indexOf("android")<0),isUiWebView:/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(Y.navigator.userAgent)};var x={init:!0,direction:"horizontal",touchEventsTarget:"container",initialSlide:0,speed:300,preventInteractionOnTransition:!1,edgeSwipeDetection:!1,edgeSwipeThreshold:20,freeMode:!1,freeModeMomentum:!0,freeModeMomentumRatio:1,freeModeMomentumBounce:!0,freeModeMomentumBounceRatio:1,freeModeMomentumVelocityRatio:1,freeModeSticky:!1,freeModeMinimumVelocity:.02,autoHeight:!1,setWrapperSize:!1,virtualTranslate:!1,effect:"slide",breakpoints:void 0,breakpointsInverse:!1,spaceBetween:0,slidesPerView:1,slidesPerColumn:1,slidesPerColumnFill:"column",slidesPerGroup:1,centeredSlides:!1,slidesOffsetBefore:0,slidesOffsetAfter:0,normalizeSlideIndex:!0,centerInsufficientSlides:!1,watchOverflow:!1,roundLengths:!1,touchRatio:1,touchAngle:45,simulateTouch:!0,shortSwipes:!0,longSwipes:!0,longSwipesRatio:.5,longSwipesMs:300,followFinger:!0,allowTouchMove:!0,threshold:0,touchMoveStopPropagation:!0,touchStartPreventDefault:!0,touchReleaseOnEdges:!1,uniqueNavElements:!0,resistance:!0,resistanceRatio:.85,watchSlidesProgress:!1,watchSlidesVisibility:!1,grabCursor:!1,preventClicks:!0,preventClicksPropagation:!0,slideToClickedSlide:!1,preloadImages:!0,updateOnImagesReady:!0,loop:!1,loopAdditionalSlides:0,loopedSlides:null,loopFillGroupWithBlank:!1,allowSlidePrev:!0,allowSlideNext:!0,swipeHandler:null,noSwiping:!0,noSwipingClass:"swiper-no-swiping",noSwipingSelector:null,passiveListeners:!0,containerModifierClass:"swiper-container-",slideClass:"swiper-slide",slideBlankClass:"swiper-slide-invisible-blank",slideActiveClass:"swiper-slide-active",slideDuplicateActiveClass:"swiper-slide-duplicate-active",slideVisibleClass:"swiper-slide-visible",slideDuplicateClass:"swiper-slide-duplicate",slideNextClass:"swiper-slide-next",slideDuplicateNextClass:"swiper-slide-duplicate-next",slidePrevClass:"swiper-slide-prev",slideDuplicatePrevClass:"swiper-slide-duplicate-prev",wrapperClass:"swiper-wrapper",runCallbacksOnInit:!0},T={update:o,translate:d,transition:p,slide:c,loop:u,grabCursor:h,manipulation:v,events:b,breakpoints:y,checkOverflow:{checkOverflow:function(){var e=this,t=e.isLocked;e.isLocked=1===e.snapGrid.length,e.allowSlideNext=!e.isLocked,e.allowSlidePrev=!e.isLocked,t!==e.isLocked&&e.emit(e.isLocked?"lock":"unlock"),t&&t!==e.isLocked&&(e.isEnd=!1,e.navigation.update())}},classes:{addClasses:function(){var t=this.classNames,a=this.params,e=this.rtl,i=this.$el,s=[];s.push(a.direction),a.freeMode&&s.push("free-mode"),R.flexbox||s.push("no-flexbox"),a.autoHeight&&s.push("autoheight"),e&&s.push("rtl"),1<a.slidesPerColumn&&s.push("multirow"),m.android&&s.push("android"),m.ios&&s.push("ios"),(I.isIE||I.isEdge)&&(R.pointerEvents||R.prefixedPointerEvents)&&s.push("wp8-"+a.direction),s.forEach(function(e){t.push(a.containerModifierClass+e)}),i.addClass(t.join(" "))},removeClasses:function(){var e=this.$el,t=this.classNames;e.removeClass(t.join(" "))}},images:{loadImage:function(e,t,a,i,s,r){var n;function o(){r&&r()}e.complete&&s?o():t?((n=new Y.Image).onload=o,n.onerror=o,i&&(n.sizes=i),a&&(n.srcset=a),t&&(n.src=t)):o()},preloadImages:function(){var e=this;function t(){null!=e&&e&&!e.destroyed&&(void 0!==e.imagesLoaded&&(e.imagesLoaded+=1),e.imagesLoaded===e.imagesToLoad.length&&(e.params.updateOnImagesReady&&e.update(),e.emit("imagesReady")))}e.imagesToLoad=e.$el.find("img");for(var a=0;a<e.imagesToLoad.length;a+=1){var i=e.imagesToLoad[a];e.loadImage(i,i.currentSrc||i.getAttribute("src"),i.srcset||i.getAttribute("srcset"),i.sizes||i.getAttribute("sizes"),!0,t)}}}},E={},S=function(u){function h(){for(var e,t,s,a=[],i=arguments.length;i--;)a[i]=arguments[i];1===a.length&&a[0].constructor&&a[0].constructor===Object?s=a[0]:(t=(e=a)[0],s=e[1]),s||(s={}),s=V.extend({},s),t&&!s.el&&(s.el=t),u.call(this,s),Object.keys(T).forEach(function(t){Object.keys(T[t]).forEach(function(e){h.prototype[e]||(h.prototype[e]=T[t][e])})});var r=this;void 0===r.modules&&(r.modules={}),Object.keys(r.modules).forEach(function(e){var t=r.modules[e];if(t.params){var a=Object.keys(t.params)[0],i=t.params[a];if("object"!=typeof i||null===i)return;if(!(a in s&&"enabled"in i))return;!0===s[a]&&(s[a]={enabled:!0}),"object"!=typeof s[a]||"enabled"in s[a]||(s[a].enabled=!0),s[a]||(s[a]={enabled:!1})}});var n=V.extend({},x);r.useModulesParams(n),r.params=V.extend({},n,E,s),r.originalParams=V.extend({},r.params),r.passedParams=V.extend({},s);var o=(r.$=L)(r.params.el);if(t=o[0]){if(1<o.length){var l=[];return o.each(function(e,t){var a=V.extend({},s,{el:t});l.push(new h(a))}),l}t.swiper=r,o.data("swiper",r);var d,p,c=o.children("."+r.params.wrapperClass);return V.extend(r,{$el:o,el:t,$wrapperEl:c,wrapperEl:c[0],classNames:[],slides:L(),slidesGrid:[],snapGrid:[],slidesSizesGrid:[],isHorizontal:function(){return"horizontal"===r.params.direction},isVertical:function(){return"vertical"===r.params.direction},rtl:"rtl"===t.dir.toLowerCase()||"rtl"===o.css("direction"),rtlTranslate:"horizontal"===r.params.direction&&("rtl"===t.dir.toLowerCase()||"rtl"===o.css("direction")),wrongRTL:"-webkit-box"===c.css("display"),activeIndex:0,realIndex:0,isBeginning:!0,isEnd:!1,translate:0,previousTranslate:0,progress:0,velocity:0,animating:!1,allowSlideNext:r.params.allowSlideNext,allowSlidePrev:r.params.allowSlidePrev,touchEvents:(d=["touchstart","touchmove","touchend"],p=["mousedown","mousemove","mouseup"],R.pointerEvents?p=["pointerdown","pointermove","pointerup"]:R.prefixedPointerEvents&&(p=["MSPointerDown","MSPointerMove","MSPointerUp"]),r.touchEventsTouch={start:d[0],move:d[1],end:d[2]},r.touchEventsDesktop={start:p[0],move:p[1],end:p[2]},R.touch||!r.params.simulateTouch?r.touchEventsTouch:r.touchEventsDesktop),touchEventsData:{isTouched:void 0,isMoved:void 0,allowTouchCallbacks:void 0,touchStartTime:void 0,isScrolling:void 0,currentTranslate:void 0,startTranslate:void 0,allowThresholdMove:void 0,formElements:"input, select, option, textarea, button, video",lastClickTime:V.now(),clickTimeout:void 0,velocities:[],allowMomentumBounce:void 0,isTouchEvent:void 0,startMoving:void 0},allowClick:!0,allowTouchMove:r.params.allowTouchMove,touches:{startX:0,startY:0,currentX:0,currentY:0,diff:0},imagesToLoad:[],imagesLoaded:0}),r.useModules(),r.params.init&&r.init(),r}}u&&(h.__proto__=u);var e={extendedDefaults:{configurable:!0},defaults:{configurable:!0},Class:{configurable:!0},$:{configurable:!0}};return((h.prototype=Object.create(u&&u.prototype)).constructor=h).prototype.slidesPerViewDynamic=function(){var e=this,t=e.params,a=e.slides,i=e.slidesGrid,s=e.size,r=e.activeIndex,n=1;if(t.centeredSlides){for(var o,l=a[r].swiperSlideSize,d=r+1;d<a.length;d+=1)a[d]&&!o&&(n+=1,s<(l+=a[d].swiperSlideSize)&&(o=!0));for(var p=r-1;0<=p;p-=1)a[p]&&!o&&(n+=1,s<(l+=a[p].swiperSlideSize)&&(o=!0))}else for(var c=r+1;c<a.length;c+=1)i[c]-i[r]<s&&(n+=1);return n},h.prototype.update=function(){var a=this;if(a&&!a.destroyed){var e=a.snapGrid,t=a.params;t.breakpoints&&a.setBreakpoint(),a.updateSize(),a.updateSlides(),a.updateProgress(),a.updateSlidesClasses(),a.params.freeMode?(i(),a.params.autoHeight&&a.updateAutoHeight()):(("auto"===a.params.slidesPerView||1<a.params.slidesPerView)&&a.isEnd&&!a.params.centeredSlides?a.slideTo(a.slides.length-1,0,!1,!0):a.slideTo(a.activeIndex,0,!1,!0))||i(),t.watchOverflow&&e!==a.snapGrid&&a.checkOverflow(),a.emit("update")}function i(){var e=a.rtlTranslate?-1*a.translate:a.translate,t=Math.min(Math.max(e,a.maxTranslate()),a.minTranslate());a.setTranslate(t),a.updateActiveIndex(),a.updateSlidesClasses()}},h.prototype.init=function(){var e=this;e.initialized||(e.emit("beforeInit"),e.params.breakpoints&&e.setBreakpoint(),e.addClasses(),e.params.loop&&e.loopCreate(),e.updateSize(),e.updateSlides(),e.params.watchOverflow&&e.checkOverflow(),e.params.grabCursor&&e.setGrabCursor(),e.params.preloadImages&&e.preloadImages(),e.params.loop?e.slideTo(e.params.initialSlide+e.loopedSlides,0,e.params.runCallbacksOnInit):e.slideTo(e.params.initialSlide,0,e.params.runCallbacksOnInit),e.attachEvents(),e.initialized=!0,e.emit("init"))},h.prototype.destroy=function(e,t){void 0===e&&(e=!0),void 0===t&&(t=!0);var a=this,i=a.params,s=a.$el,r=a.$wrapperEl,n=a.slides;return void 0===a.params||a.destroyed||(a.emit("beforeDestroy"),a.initialized=!1,a.detachEvents(),i.loop&&a.loopDestroy(),t&&(a.removeClasses(),s.removeAttr("style"),r.removeAttr("style"),n&&n.length&&n.removeClass([i.slideVisibleClass,i.slideActiveClass,i.slideNextClass,i.slidePrevClass].join(" ")).removeAttr("style").removeAttr("data-swiper-slide-index").removeAttr("data-swiper-column").removeAttr("data-swiper-row")),a.emit("destroy"),Object.keys(a.eventsListeners).forEach(function(e){a.off(e)}),!1!==e&&(a.$el[0].swiper=null,a.$el.data("swiper",null),V.deleteProps(a)),a.destroyed=!0),null},h.extendDefaults=function(e){V.extend(E,e)},e.extendedDefaults.get=function(){return E},e.defaults.get=function(){return x},e.Class.get=function(){return u},e.$.get=function(){return L},Object.defineProperties(h,e),h}(s),C={name:"device",proto:{device:m},static:{device:m}},M={name:"support",proto:{support:R},static:{support:R}},k={name:"browser",proto:{browser:I},static:{browser:I}},z={name:"resize",create:function(){var e=this;V.extend(e,{resize:{resizeHandler:function(){e&&!e.destroyed&&e.initialized&&(e.emit("beforeResize"),e.emit("resize"))},orientationChangeHandler:function(){e&&!e.destroyed&&e.initialized&&e.emit("orientationchange")}}})},on:{init:function(){Y.addEventListener("resize",this.resize.resizeHandler),Y.addEventListener("orientationchange",this.resize.orientationChangeHandler)},destroy:function(){Y.removeEventListener("resize",this.resize.resizeHandler),Y.removeEventListener("orientationchange",this.resize.orientationChangeHandler)}}},P={func:Y.MutationObserver||Y.WebkitMutationObserver,attach:function(e,t){void 0===t&&(t={});var a=this,i=new P.func(function(e){if(1!==e.length){var t=function(){a.emit("observerUpdate",e[0])};Y.requestAnimationFrame?Y.requestAnimationFrame(t):Y.setTimeout(t,0)}else a.emit("observerUpdate",e[0])});i.observe(e,{attributes:void 0===t.attributes||t.attributes,childList:void 0===t.childList||t.childList,characterData:void 0===t.characterData||t.characterData}),a.observer.observers.push(i)},init:function(){var e=this;if(R.observer&&e.params.observer){if(e.params.observeParents)for(var t=e.$el.parents(),a=0;a<t.length;a+=1)e.observer.attach(t[a]);e.observer.attach(e.$el[0],{childList:!1}),e.observer.attach(e.$wrapperEl[0],{attributes:!1})}},destroy:function(){this.observer.observers.forEach(function(e){e.disconnect()}),this.observer.observers=[]}},$={name:"observer",params:{observer:!1,observeParents:!1},create:function(){V.extend(this,{observer:{init:P.init.bind(this),attach:P.attach.bind(this),destroy:P.destroy.bind(this),observers:[]}})},on:{init:function(){this.observer.init()},destroy:function(){this.observer.destroy()}}},D={update:function(e){var t=this,a=t.params,i=a.slidesPerView,s=a.slidesPerGroup,r=a.centeredSlides,n=t.params.virtual,o=n.addSlidesBefore,l=n.addSlidesAfter,d=t.virtual,p=d.from,c=d.to,u=d.slides,h=d.slidesGrid,v=d.renderSlide,f=d.offset;t.updateActiveIndex();var m,g,b,w=t.activeIndex||0;m=t.rtlTranslate?"right":t.isHorizontal()?"left":"top",r?(g=Math.floor(i/2)+s+o,b=Math.floor(i/2)+s+l):(g=i+(s-1)+o,b=s+l);var y=Math.max((w||0)-b,0),x=Math.min((w||0)+g,u.length-1),T=(t.slidesGrid[y]||0)-(t.slidesGrid[0]||0);function E(){t.updateSlides(),t.updateProgress(),t.updateSlidesClasses(),t.lazy&&t.params.lazy.enabled&&t.lazy.load()}if(V.extend(t.virtual,{from:y,to:x,offset:T,slidesGrid:t.slidesGrid}),p===y&&c===x&&!e)return t.slidesGrid!==h&&T!==f&&t.slides.css(m,T+"px"),void t.updateProgress();if(t.params.virtual.renderExternal)return t.params.virtual.renderExternal.call(t,{offset:T,from:y,to:x,slides:function(){for(var e=[],t=y;t<=x;t+=1)e.push(u[t]);return e}()}),void E();var S=[],C=[];if(e)t.$wrapperEl.find("."+t.params.slideClass).remove();else for(var M=p;M<=c;M+=1)(M<y||x<M)&&t.$wrapperEl.find("."+t.params.slideClass+'[data-swiper-slide-index="'+M+'"]').remove();for(var k=0;k<u.length;k+=1)y<=k&&k<=x&&(void 0===c||e?C.push(k):(c<k&&C.push(k),k<p&&S.push(k)));C.forEach(function(e){t.$wrapperEl.append(v(u[e],e))}),S.sort(function(e,t){return e<t}).forEach(function(e){t.$wrapperEl.prepend(v(u[e],e))}),t.$wrapperEl.children(".swiper-slide").css(m,T+"px"),E()},renderSlide:function(e,t){var a=this,i=a.params.virtual;if(i.cache&&a.virtual.cache[t])return a.virtual.cache[t];var s=i.renderSlide?L(i.renderSlide.call(a,e,t)):L('<div class="'+a.params.slideClass+'" data-swiper-slide-index="'+t+'">'+e+"</div>");return s.attr("data-swiper-slide-index")||s.attr("data-swiper-slide-index",t),i.cache&&(a.virtual.cache[t]=s),s},appendSlide:function(e){this.virtual.slides.push(e),this.virtual.update(!0)},prependSlide:function(e){var t=this;if(t.virtual.slides.unshift(e),t.params.virtual.cache){var a=t.virtual.cache,i={};Object.keys(a).forEach(function(e){i[e+1]=a[e]}),t.virtual.cache=i}t.virtual.update(!0),t.slideNext(0)}},O={name:"virtual",params:{virtual:{enabled:!1,slides:[],cache:!0,renderSlide:null,renderExternal:null,addSlidesBefore:0,addSlidesAfter:0}},create:function(){var e=this;V.extend(e,{virtual:{update:D.update.bind(e),appendSlide:D.appendSlide.bind(e),prependSlide:D.prependSlide.bind(e),renderSlide:D.renderSlide.bind(e),slides:e.params.virtual.slides,cache:{}}})},on:{beforeInit:function(){var e=this;if(e.params.virtual.enabled){e.classNames.push(e.params.containerModifierClass+"virtual");var t={watchSlidesProgress:!0};V.extend(e.params,t),V.extend(e.originalParams,t),e.virtual.update()}},setTranslate:function(){this.params.virtual.enabled&&this.virtual.update()}}},A={handle:function(e){var t=this,a=t.rtlTranslate,i=e;i.originalEvent&&(i=i.originalEvent);var s=i.keyCode||i.charCode;if(!t.allowSlideNext&&(t.isHorizontal()&&39===s||t.isVertical()&&40===s))return!1;if(!t.allowSlidePrev&&(t.isHorizontal()&&37===s||t.isVertical()&&38===s))return!1;if(!(i.shiftKey||i.altKey||i.ctrlKey||i.metaKey||f.activeElement&&f.activeElement.nodeName&&("input"===f.activeElement.nodeName.toLowerCase()||"textarea"===f.activeElement.nodeName.toLowerCase()))){if(t.params.keyboard.onlyInViewport&&(37===s||39===s||38===s||40===s)){var r=!1;if(0<t.$el.parents("."+t.params.slideClass).length&&0===t.$el.parents("."+t.params.slideActiveClass).length)return;var n=Y.innerWidth,o=Y.innerHeight,l=t.$el.offset();a&&(l.left-=t.$el[0].scrollLeft);for(var d=[[l.left,l.top],[l.left+t.width,l.top],[l.left,l.top+t.height],[l.left+t.width,l.top+t.height]],p=0;p<d.length;p+=1){var c=d[p];0<=c[0]&&c[0]<=n&&0<=c[1]&&c[1]<=o&&(r=!0)}if(!r)return}t.isHorizontal()?(37!==s&&39!==s||(i.preventDefault?i.preventDefault():i.returnValue=!1),(39===s&&!a||37===s&&a)&&t.slideNext(),(37===s&&!a||39===s&&a)&&t.slidePrev()):(38!==s&&40!==s||(i.preventDefault?i.preventDefault():i.returnValue=!1),40===s&&t.slideNext(),38===s&&t.slidePrev()),t.emit("keyPress",s)}},enable:function(){this.keyboard.enabled||(L(f).on("keydown",this.keyboard.handle),this.keyboard.enabled=!0)},disable:function(){this.keyboard.enabled&&(L(f).off("keydown",this.keyboard.handle),this.keyboard.enabled=!1)}},H={name:"keyboard",params:{keyboard:{enabled:!1,onlyInViewport:!0}},create:function(){V.extend(this,{keyboard:{enabled:!1,enable:A.enable.bind(this),disable:A.disable.bind(this),handle:A.handle.bind(this)}})},on:{init:function(){this.params.keyboard.enabled&&this.keyboard.enable()},destroy:function(){this.keyboard.enabled&&this.keyboard.disable()}}};var B={lastScrollTime:V.now(),event:-1<Y.navigator.userAgent.indexOf("firefox")?"DOMMouseScroll":function(){var e="onwheel",t=e in f;if(!t){var a=f.createElement("div");a.setAttribute(e,"return;"),t="function"==typeof a[e]}return!t&&f.implementation&&f.implementation.hasFeature&&!0!==f.implementation.hasFeature("","")&&(t=f.implementation.hasFeature("Events.wheel","3.0")),t}()?"wheel":"mousewheel",normalize:function(e){var t=0,a=0,i=0,s=0;return"detail"in e&&(a=e.detail),"wheelDelta"in e&&(a=-e.wheelDelta/120),"wheelDeltaY"in e&&(a=-e.wheelDeltaY/120),"wheelDeltaX"in e&&(t=-e.wheelDeltaX/120),"axis"in e&&e.axis===e.HORIZONTAL_AXIS&&(t=a,a=0),i=10*t,s=10*a,"deltaY"in e&&(s=e.deltaY),"deltaX"in e&&(i=e.deltaX),(i||s)&&e.deltaMode&&(1===e.deltaMode?(i*=40,s*=40):(i*=800,s*=800)),i&&!t&&(t=i<1?-1:1),s&&!a&&(a=s<1?-1:1),{spinX:t,spinY:a,pixelX:i,pixelY:s}},handleMouseEnter:function(){this.mouseEntered=!0},handleMouseLeave:function(){this.mouseEntered=!1},handle:function(e){var t=e,a=this,i=a.params.mousewheel;if(!a.mouseEntered&&!i.releaseOnEdges)return!0;t.originalEvent&&(t=t.originalEvent);var s=0,r=a.rtlTranslate?-1:1,n=B.normalize(t);if(i.forceToAxis)if(a.isHorizontal()){if(!(Math.abs(n.pixelX)>Math.abs(n.pixelY)))return!0;s=n.pixelX*r}else{if(!(Math.abs(n.pixelY)>Math.abs(n.pixelX)))return!0;s=n.pixelY}else s=Math.abs(n.pixelX)>Math.abs(n.pixelY)?-n.pixelX*r:-n.pixelY;if(0===s)return!0;if(i.invert&&(s=-s),a.params.freeMode){a.params.loop&&a.loopFix();var o=a.getTranslate()+s*i.sensitivity,l=a.isBeginning,d=a.isEnd;if(o>=a.minTranslate()&&(o=a.minTranslate()),o<=a.maxTranslate()&&(o=a.maxTranslate()),a.setTransition(0),a.setTranslate(o),a.updateProgress(),a.updateActiveIndex(),a.updateSlidesClasses(),(!l&&a.isBeginning||!d&&a.isEnd)&&a.updateSlidesClasses(),a.params.freeModeSticky&&(clearTimeout(a.mousewheel.timeout),a.mousewheel.timeout=V.nextTick(function(){a.slideToClosest()},300)),a.emit("scroll",t),a.params.autoplay&&a.params.autoplayDisableOnInteraction&&a.autoplay.stop(),o===a.minTranslate()||o===a.maxTranslate())return!0}else{if(60<V.now()-a.mousewheel.lastScrollTime)if(s<0)if(a.isEnd&&!a.params.loop||a.animating){if(i.releaseOnEdges)return!0}else a.slideNext(),a.emit("scroll",t);else if(a.isBeginning&&!a.params.loop||a.animating){if(i.releaseOnEdges)return!0}else a.slidePrev(),a.emit("scroll",t);a.mousewheel.lastScrollTime=(new Y.Date).getTime()}return t.preventDefault?t.preventDefault():t.returnValue=!1,!1},enable:function(){var e=this;if(!B.event)return!1;if(e.mousewheel.enabled)return!1;var t=e.$el;return"container"!==e.params.mousewheel.eventsTarged&&(t=L(e.params.mousewheel.eventsTarged)),t.on("mouseenter",e.mousewheel.handleMouseEnter),t.on("mouseleave",e.mousewheel.handleMouseLeave),t.on(B.event,e.mousewheel.handle),e.mousewheel.enabled=!0},disable:function(){var e=this;if(!B.event)return!1;if(!e.mousewheel.enabled)return!1;var t=e.$el;return"container"!==e.params.mousewheel.eventsTarged&&(t=L(e.params.mousewheel.eventsTarged)),t.off(B.event,e.mousewheel.handle),!(e.mousewheel.enabled=!1)}},G={update:function(){var e=this,t=e.params.navigation;if(!e.params.loop){var a=e.navigation,i=a.$nextEl,s=a.$prevEl;s&&0<s.length&&(e.isBeginning?s.addClass(t.disabledClass):s.removeClass(t.disabledClass),s[e.params.watchOverflow&&e.isLocked?"addClass":"removeClass"](t.lockClass)),i&&0<i.length&&(e.isEnd?i.addClass(t.disabledClass):i.removeClass(t.disabledClass),i[e.params.watchOverflow&&e.isLocked?"addClass":"removeClass"](t.lockClass))}},init:function(){var e,t,a=this,i=a.params.navigation;(i.nextEl||i.prevEl)&&(i.nextEl&&(e=L(i.nextEl),a.params.uniqueNavElements&&"string"==typeof i.nextEl&&1<e.length&&1===a.$el.find(i.nextEl).length&&(e=a.$el.find(i.nextEl))),i.prevEl&&(t=L(i.prevEl),a.params.uniqueNavElements&&"string"==typeof i.prevEl&&1<t.length&&1===a.$el.find(i.prevEl).length&&(t=a.$el.find(i.prevEl))),e&&0<e.length&&e.on("click",function(e){e.preventDefault(),a.isEnd&&!a.params.loop||a.slideNext()}),t&&0<t.length&&t.on("click",function(e){e.preventDefault(),a.isBeginning&&!a.params.loop||a.slidePrev()}),V.extend(a.navigation,{$nextEl:e,nextEl:e&&e[0],$prevEl:t,prevEl:t&&t[0]}))},destroy:function(){var e=this.navigation,t=e.$nextEl,a=e.$prevEl;t&&t.length&&(t.off("click"),t.removeClass(this.params.navigation.disabledClass)),a&&a.length&&(a.off("click"),a.removeClass(this.params.navigation.disabledClass))}},N={update:function(){var e=this,t=e.rtl,s=e.params.pagination;if(s.el&&e.pagination.el&&e.pagination.$el&&0!==e.pagination.$el.length){var r,a=e.virtual&&e.params.virtual.enabled?e.virtual.slides.length:e.slides.length,i=e.pagination.$el,n=e.params.loop?Math.ceil((a-2*e.loopedSlides)/e.params.slidesPerGroup):e.snapGrid.length;if(e.params.loop?((r=Math.ceil((e.activeIndex-e.loopedSlides)/e.params.slidesPerGroup))>a-1-2*e.loopedSlides&&(r-=a-2*e.loopedSlides),n-1<r&&(r-=n),r<0&&"bullets"!==e.params.paginationType&&(r=n+r)):r=void 0!==e.snapIndex?e.snapIndex:e.activeIndex||0,"bullets"===s.type&&e.pagination.bullets&&0<e.pagination.bullets.length){var o,l,d,p=e.pagination.bullets;if(s.dynamicBullets&&(e.pagination.bulletSize=p.eq(0)[e.isHorizontal()?"outerWidth":"outerHeight"](!0),i.css(e.isHorizontal()?"width":"height",e.pagination.bulletSize*(s.dynamicMainBullets+4)+"px"),1<s.dynamicMainBullets&&void 0!==e.previousIndex&&(e.pagination.dynamicBulletIndex+=r-e.previousIndex,e.pagination.dynamicBulletIndex>s.dynamicMainBullets-1?e.pagination.dynamicBulletIndex=s.dynamicMainBullets-1:e.pagination.dynamicBulletIndex<0&&(e.pagination.dynamicBulletIndex=0)),o=r-e.pagination.dynamicBulletIndex,d=((l=o+(Math.min(p.length,s.dynamicMainBullets)-1))+o)/2),p.removeClass(s.bulletActiveClass+" "+s.bulletActiveClass+"-next "+s.bulletActiveClass+"-next-next "+s.bulletActiveClass+"-prev "+s.bulletActiveClass+"-prev-prev "+s.bulletActiveClass+"-main"),1<i.length)p.each(function(e,t){var a=L(t),i=a.index();i===r&&a.addClass(s.bulletActiveClass),s.dynamicBullets&&(o<=i&&i<=l&&a.addClass(s.bulletActiveClass+"-main"),i===o&&a.prev().addClass(s.bulletActiveClass+"-prev").prev().addClass(s.bulletActiveClass+"-prev-prev"),i===l&&a.next().addClass(s.bulletActiveClass+"-next").next().addClass(s.bulletActiveClass+"-next-next"))});else if(p.eq(r).addClass(s.bulletActiveClass),s.dynamicBullets){for(var c=p.eq(o),u=p.eq(l),h=o;h<=l;h+=1)p.eq(h).addClass(s.bulletActiveClass+"-main");c.prev().addClass(s.bulletActiveClass+"-prev").prev().addClass(s.bulletActiveClass+"-prev-prev"),u.next().addClass(s.bulletActiveClass+"-next").next().addClass(s.bulletActiveClass+"-next-next")}if(s.dynamicBullets){var v=Math.min(p.length,s.dynamicMainBullets+4),f=(e.pagination.bulletSize*v-e.pagination.bulletSize)/2-d*e.pagination.bulletSize,m=t?"right":"left";p.css(e.isHorizontal()?m:"top",f+"px")}}if("fraction"===s.type&&(i.find("."+s.currentClass).text(s.formatFractionCurrent(r+1)),i.find("."+s.totalClass).text(s.formatFractionTotal(n))),"progressbar"===s.type){var g;g=s.progressbarOpposite?e.isHorizontal()?"vertical":"horizontal":e.isHorizontal()?"horizontal":"vertical";var b=(r+1)/n,w=1,y=1;"horizontal"===g?w=b:y=b,i.find("."+s.progressbarFillClass).transform("translate3d(0,0,0) scaleX("+w+") scaleY("+y+")").transition(e.params.speed)}"custom"===s.type&&s.renderCustom?(i.html(s.renderCustom(e,r+1,n)),e.emit("paginationRender",e,i[0])):e.emit("paginationUpdate",e,i[0]),i[e.params.watchOverflow&&e.isLocked?"addClass":"removeClass"](s.lockClass)}},render:function(){var e=this,t=e.params.pagination;if(t.el&&e.pagination.el&&e.pagination.$el&&0!==e.pagination.$el.length){var a=e.virtual&&e.params.virtual.enabled?e.virtual.slides.length:e.slides.length,i=e.pagination.$el,s="";if("bullets"===t.type){for(var r=e.params.loop?Math.ceil((a-2*e.loopedSlides)/e.params.slidesPerGroup):e.snapGrid.length,n=0;n<r;n+=1)t.renderBullet?s+=t.renderBullet.call(e,n,t.bulletClass):s+="<"+t.bulletElement+' class="'+t.bulletClass+'"></'+t.bulletElement+">";i.html(s),e.pagination.bullets=i.find("."+t.bulletClass)}"fraction"===t.type&&(s=t.renderFraction?t.renderFraction.call(e,t.currentClass,t.totalClass):'<span class="'+t.currentClass+'"></span> / <span class="'+t.totalClass+'"></span>',i.html(s)),"progressbar"===t.type&&(s=t.renderProgressbar?t.renderProgressbar.call(e,t.progressbarFillClass):'<span class="'+t.progressbarFillClass+'"></span>',i.html(s)),"custom"!==t.type&&e.emit("paginationRender",e.pagination.$el[0])}},init:function(){var a=this,e=a.params.pagination;if(e.el){var t=L(e.el);0!==t.length&&(a.params.uniqueNavElements&&"string"==typeof e.el&&1<t.length&&1===a.$el.find(e.el).length&&(t=a.$el.find(e.el)),"bullets"===e.type&&e.clickable&&t.addClass(e.clickableClass),t.addClass(e.modifierClass+e.type),"bullets"===e.type&&e.dynamicBullets&&(t.addClass(""+e.modifierClass+e.type+"-dynamic"),a.pagination.dynamicBulletIndex=0,e.dynamicMainBullets<1&&(e.dynamicMainBullets=1)),"progressbar"===e.type&&e.progressbarOpposite&&t.addClass(e.progressbarOppositeClass),e.clickable&&t.on("click","."+e.bulletClass,function(e){e.preventDefault();var t=L(this).index()*a.params.slidesPerGroup;a.params.loop&&(t+=a.loopedSlides),a.slideTo(t)}),V.extend(a.pagination,{$el:t,el:t[0]}))}},destroy:function(){var e=this,t=e.params.pagination;if(t.el&&e.pagination.el&&e.pagination.$el&&0!==e.pagination.$el.length){var a=e.pagination.$el;a.removeClass(t.hiddenClass),a.removeClass(t.modifierClass+t.type),e.pagination.bullets&&e.pagination.bullets.removeClass(t.bulletActiveClass),t.clickable&&a.off("click","."+t.bulletClass)}}},X={setTranslate:function(){var e=this;if(e.params.scrollbar.el&&e.scrollbar.el){var t=e.scrollbar,a=e.rtlTranslate,i=e.progress,s=t.dragSize,r=t.trackSize,n=t.$dragEl,o=t.$el,l=e.params.scrollbar,d=s,p=(r-s)*i;a?0<(p=-p)?(d=s-p,p=0):r<-p+s&&(d=r+p):p<0?(d=s+p,p=0):r<p+s&&(d=r-p),e.isHorizontal()?(R.transforms3d?n.transform("translate3d("+p+"px, 0, 0)"):n.transform("translateX("+p+"px)"),n[0].style.width=d+"px"):(R.transforms3d?n.transform("translate3d(0px, "+p+"px, 0)"):n.transform("translateY("+p+"px)"),n[0].style.height=d+"px"),l.hide&&(clearTimeout(e.scrollbar.timeout),o[0].style.opacity=1,e.scrollbar.timeout=setTimeout(function(){o[0].style.opacity=0,o.transition(400)},1e3))}},setTransition:function(e){this.params.scrollbar.el&&this.scrollbar.el&&this.scrollbar.$dragEl.transition(e)},updateSize:function(){var e=this;if(e.params.scrollbar.el&&e.scrollbar.el){var t=e.scrollbar,a=t.$dragEl,i=t.$el;a[0].style.width="",a[0].style.height="";var s,r=e.isHorizontal()?i[0].offsetWidth:i[0].offsetHeight,n=e.size/e.virtualSize,o=n*(r/e.size);s="auto"===e.params.scrollbar.dragSize?r*n:parseInt(e.params.scrollbar.dragSize,10),e.isHorizontal()?a[0].style.width=s+"px":a[0].style.height=s+"px",i[0].style.display=1<=n?"none":"",e.params.scrollbarHide&&(i[0].style.opacity=0),V.extend(t,{trackSize:r,divider:n,moveDivider:o,dragSize:s}),t.$el[e.params.watchOverflow&&e.isLocked?"addClass":"removeClass"](e.params.scrollbar.lockClass)}},setDragPosition:function(e){var t,a=this,i=a.scrollbar,s=a.rtlTranslate,r=i.$el,n=i.dragSize,o=i.trackSize;t=((a.isHorizontal()?"touchstart"===e.type||"touchmove"===e.type?e.targetTouches[0].pageX:e.pageX||e.clientX:"touchstart"===e.type||"touchmove"===e.type?e.targetTouches[0].pageY:e.pageY||e.clientY)-r.offset()[a.isHorizontal()?"left":"top"]-n/2)/(o-n),t=Math.max(Math.min(t,1),0),s&&(t=1-t);var l=a.minTranslate()+(a.maxTranslate()-a.minTranslate())*t;a.updateProgress(l),a.setTranslate(l),a.updateActiveIndex(),a.updateSlidesClasses()},onDragStart:function(e){var t=this,a=t.params.scrollbar,i=t.scrollbar,s=t.$wrapperEl,r=i.$el,n=i.$dragEl;t.scrollbar.isTouched=!0,e.preventDefault(),e.stopPropagation(),s.transition(100),n.transition(100),i.setDragPosition(e),clearTimeout(t.scrollbar.dragTimeout),r.transition(0),a.hide&&r.css("opacity",1),t.emit("scrollbarDragStart",e)},onDragMove:function(e){var t=this.scrollbar,a=this.$wrapperEl,i=t.$el,s=t.$dragEl;this.scrollbar.isTouched&&(e.preventDefault?e.preventDefault():e.returnValue=!1,t.setDragPosition(e),a.transition(0),i.transition(0),s.transition(0),this.emit("scrollbarDragMove",e))},onDragEnd:function(e){var t=this,a=t.params.scrollbar,i=t.scrollbar.$el;t.scrollbar.isTouched&&(t.scrollbar.isTouched=!1,a.hide&&(clearTimeout(t.scrollbar.dragTimeout),t.scrollbar.dragTimeout=V.nextTick(function(){i.css("opacity",0),i.transition(400)},1e3)),t.emit("scrollbarDragEnd",e),a.snapOnRelease&&t.slideToClosest())},enableDraggable:function(){var e=this;if(e.params.scrollbar.el){var t=e.scrollbar,a=e.touchEvents,i=e.touchEventsDesktop,s=e.params,r=t.$el[0],n=!(!R.passiveListener||!s.passiveListeners)&&{passive:!1,capture:!1},o=!(!R.passiveListener||!s.passiveListeners)&&{passive:!0,capture:!1};R.touch||!R.pointerEvents&&!R.prefixedPointerEvents?(R.touch&&(r.addEventListener(a.start,e.scrollbar.onDragStart,n),r.addEventListener(a.move,e.scrollbar.onDragMove,n),r.addEventListener(a.end,e.scrollbar.onDragEnd,o)),(s.simulateTouch&&!m.ios&&!m.android||s.simulateTouch&&!R.touch&&m.ios)&&(r.addEventListener("mousedown",e.scrollbar.onDragStart,n),f.addEventListener("mousemove",e.scrollbar.onDragMove,n),f.addEventListener("mouseup",e.scrollbar.onDragEnd,o))):(r.addEventListener(i.start,e.scrollbar.onDragStart,n),f.addEventListener(i.move,e.scrollbar.onDragMove,n),f.addEventListener(i.end,e.scrollbar.onDragEnd,o))}},disableDraggable:function(){var e=this;if(e.params.scrollbar.el){var t=e.scrollbar,a=e.touchEvents,i=e.touchEventsDesktop,s=e.params,r=t.$el[0],n=!(!R.passiveListener||!s.passiveListeners)&&{passive:!1,capture:!1},o=!(!R.passiveListener||!s.passiveListeners)&&{passive:!0,capture:!1};R.touch||!R.pointerEvents&&!R.prefixedPointerEvents?(R.touch&&(r.removeEventListener(a.start,e.scrollbar.onDragStart,n),r.removeEventListener(a.move,e.scrollbar.onDragMove,n),r.removeEventListener(a.end,e.scrollbar.onDragEnd,o)),(s.simulateTouch&&!m.ios&&!m.android||s.simulateTouch&&!R.touch&&m.ios)&&(r.removeEventListener("mousedown",e.scrollbar.onDragStart,n),f.removeEventListener("mousemove",e.scrollbar.onDragMove,n),f.removeEventListener("mouseup",e.scrollbar.onDragEnd,o))):(r.removeEventListener(i.start,e.scrollbar.onDragStart,n),f.removeEventListener(i.move,e.scrollbar.onDragMove,n),f.removeEventListener(i.end,e.scrollbar.onDragEnd,o))}},init:function(){var e=this;if(e.params.scrollbar.el){var t=e.scrollbar,a=e.$el,i=e.params.scrollbar,s=L(i.el);e.params.uniqueNavElements&&"string"==typeof i.el&&1<s.length&&1===a.find(i.el).length&&(s=a.find(i.el));var r=s.find("."+e.params.scrollbar.dragClass);0===r.length&&(r=L('<div class="'+e.params.scrollbar.dragClass+'"></div>'),s.append(r)),V.extend(t,{$el:s,el:s[0],$dragEl:r,dragEl:r[0]}),i.draggable&&t.enableDraggable()}},destroy:function(){this.scrollbar.disableDraggable()}},F={setTransform:function(e,t){var a=this.rtl,i=L(e),s=a?-1:1,r=i.attr("data-swiper-parallax")||"0",n=i.attr("data-swiper-parallax-x"),o=i.attr("data-swiper-parallax-y"),l=i.attr("data-swiper-parallax-scale"),d=i.attr("data-swiper-parallax-opacity");if(n||o?(n=n||"0",o=o||"0"):this.isHorizontal()?(n=r,o="0"):(o=r,n="0"),n=0<=n.indexOf("%")?parseInt(n,10)*t*s+"%":n*t*s+"px",o=0<=o.indexOf("%")?parseInt(o,10)*t+"%":o*t+"px",null!=d){var p=d-(d-1)*(1-Math.abs(t));i[0].style.opacity=p}if(null==l)i.transform("translate3d("+n+", "+o+", 0px)");else{var c=l-(l-1)*(1-Math.abs(t));i.transform("translate3d("+n+", "+o+", 0px) scale("+c+")")}},setTranslate:function(){var i=this,e=i.$el,t=i.slides,s=i.progress,r=i.snapGrid;e.children("[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y]").each(function(e,t){i.parallax.setTransform(t,s)}),t.each(function(e,t){var a=t.progress;1<i.params.slidesPerGroup&&"auto"!==i.params.slidesPerView&&(a+=Math.ceil(e/2)-s*(r.length-1)),a=Math.min(Math.max(a,-1),1),L(t).find("[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y]").each(function(e,t){i.parallax.setTransform(t,a)})})},setTransition:function(s){void 0===s&&(s=this.params.speed);this.$el.find("[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y]").each(function(e,t){var a=L(t),i=parseInt(a.attr("data-swiper-parallax-duration"),10)||s;0===s&&(i=0),a.transition(i)})}},q={getDistanceBetweenTouches:function(e){if(e.targetTouches.length<2)return 1;var t=e.targetTouches[0].pageX,a=e.targetTouches[0].pageY,i=e.targetTouches[1].pageX,s=e.targetTouches[1].pageY;return Math.sqrt(Math.pow(i-t,2)+Math.pow(s-a,2))},onGestureStart:function(e){var t=this,a=t.params.zoom,i=t.zoom,s=i.gesture;if(i.fakeGestureTouched=!1,i.fakeGestureMoved=!1,!R.gestures){if("touchstart"!==e.type||"touchstart"===e.type&&e.targetTouches.length<2)return;i.fakeGestureTouched=!0,s.scaleStart=q.getDistanceBetweenTouches(e)}s.$slideEl&&s.$slideEl.length||(s.$slideEl=L(e.target).closest(".swiper-slide"),0===s.$slideEl.length&&(s.$slideEl=t.slides.eq(t.activeIndex)),s.$imageEl=s.$slideEl.find("img, svg, canvas"),s.$imageWrapEl=s.$imageEl.parent("."+a.containerClass),s.maxRatio=s.$imageWrapEl.attr("data-swiper-zoom")||a.maxRatio,0!==s.$imageWrapEl.length)?(s.$imageEl.transition(0),t.zoom.isScaling=!0):s.$imageEl=void 0},onGestureChange:function(e){var t=this.params.zoom,a=this.zoom,i=a.gesture;if(!R.gestures){if("touchmove"!==e.type||"touchmove"===e.type&&e.targetTouches.length<2)return;a.fakeGestureMoved=!0,i.scaleMove=q.getDistanceBetweenTouches(e)}i.$imageEl&&0!==i.$imageEl.length&&(R.gestures?this.zoom.scale=e.scale*a.currentScale:a.scale=i.scaleMove/i.scaleStart*a.currentScale,a.scale>i.maxRatio&&(a.scale=i.maxRatio-1+Math.pow(a.scale-i.maxRatio+1,.5)),a.scale<t.minRatio&&(a.scale=t.minRatio+1-Math.pow(t.minRatio-a.scale+1,.5)),i.$imageEl.transform("translate3d(0,0,0) scale("+a.scale+")"))},onGestureEnd:function(e){var t=this.params.zoom,a=this.zoom,i=a.gesture;if(!R.gestures){if(!a.fakeGestureTouched||!a.fakeGestureMoved)return;if("touchend"!==e.type||"touchend"===e.type&&e.changedTouches.length<2&&!m.android)return;a.fakeGestureTouched=!1,a.fakeGestureMoved=!1}i.$imageEl&&0!==i.$imageEl.length&&(a.scale=Math.max(Math.min(a.scale,i.maxRatio),t.minRatio),i.$imageEl.transition(this.params.speed).transform("translate3d(0,0,0) scale("+a.scale+")"),a.currentScale=a.scale,a.isScaling=!1,1===a.scale&&(i.$slideEl=void 0))},onTouchStart:function(e){var t=this.zoom,a=t.gesture,i=t.image;a.$imageEl&&0!==a.$imageEl.length&&(i.isTouched||(m.android&&e.preventDefault(),i.isTouched=!0,i.touchesStart.x="touchstart"===e.type?e.targetTouches[0].pageX:e.pageX,i.touchesStart.y="touchstart"===e.type?e.targetTouches[0].pageY:e.pageY))},onTouchMove:function(e){var t=this,a=t.zoom,i=a.gesture,s=a.image,r=a.velocity;if(i.$imageEl&&0!==i.$imageEl.length&&(t.allowClick=!1,s.isTouched&&i.$slideEl)){s.isMoved||(s.width=i.$imageEl[0].offsetWidth,s.height=i.$imageEl[0].offsetHeight,s.startX=V.getTranslate(i.$imageWrapEl[0],"x")||0,s.startY=V.getTranslate(i.$imageWrapEl[0],"y")||0,i.slideWidth=i.$slideEl[0].offsetWidth,i.slideHeight=i.$slideEl[0].offsetHeight,i.$imageWrapEl.transition(0),t.rtl&&(s.startX=-s.startX,s.startY=-s.startY));var n=s.width*a.scale,o=s.height*a.scale;if(!(n<i.slideWidth&&o<i.slideHeight)){if(s.minX=Math.min(i.slideWidth/2-n/2,0),s.maxX=-s.minX,s.minY=Math.min(i.slideHeight/2-o/2,0),s.maxY=-s.minY,s.touchesCurrent.x="touchmove"===e.type?e.targetTouches[0].pageX:e.pageX,s.touchesCurrent.y="touchmove"===e.type?e.targetTouches[0].pageY:e.pageY,!s.isMoved&&!a.isScaling){if(t.isHorizontal()&&(Math.floor(s.minX)===Math.floor(s.startX)&&s.touchesCurrent.x<s.touchesStart.x||Math.floor(s.maxX)===Math.floor(s.startX)&&s.touchesCurrent.x>s.touchesStart.x))return void(s.isTouched=!1);if(!t.isHorizontal()&&(Math.floor(s.minY)===Math.floor(s.startY)&&s.touchesCurrent.y<s.touchesStart.y||Math.floor(s.maxY)===Math.floor(s.startY)&&s.touchesCurrent.y>s.touchesStart.y))return void(s.isTouched=!1)}e.preventDefault(),e.stopPropagation(),s.isMoved=!0,s.currentX=s.touchesCurrent.x-s.touchesStart.x+s.startX,s.currentY=s.touchesCurrent.y-s.touchesStart.y+s.startY,s.currentX<s.minX&&(s.currentX=s.minX+1-Math.pow(s.minX-s.currentX+1,.8)),s.currentX>s.maxX&&(s.currentX=s.maxX-1+Math.pow(s.currentX-s.maxX+1,.8)),s.currentY<s.minY&&(s.currentY=s.minY+1-Math.pow(s.minY-s.currentY+1,.8)),s.currentY>s.maxY&&(s.currentY=s.maxY-1+Math.pow(s.currentY-s.maxY+1,.8)),r.prevPositionX||(r.prevPositionX=s.touchesCurrent.x),r.prevPositionY||(r.prevPositionY=s.touchesCurrent.y),r.prevTime||(r.prevTime=Date.now()),r.x=(s.touchesCurrent.x-r.prevPositionX)/(Date.now()-r.prevTime)/2,r.y=(s.touchesCurrent.y-r.prevPositionY)/(Date.now()-r.prevTime)/2,Math.abs(s.touchesCurrent.x-r.prevPositionX)<2&&(r.x=0),Math.abs(s.touchesCurrent.y-r.prevPositionY)<2&&(r.y=0),r.prevPositionX=s.touchesCurrent.x,r.prevPositionY=s.touchesCurrent.y,r.prevTime=Date.now(),i.$imageWrapEl.transform("translate3d("+s.currentX+"px, "+s.currentY+"px,0)")}}},onTouchEnd:function(){var e=this.zoom,t=e.gesture,a=e.image,i=e.velocity;if(t.$imageEl&&0!==t.$imageEl.length){if(!a.isTouched||!a.isMoved)return a.isTouched=!1,void(a.isMoved=!1);a.isTouched=!1,a.isMoved=!1;var s=300,r=300,n=i.x*s,o=a.currentX+n,l=i.y*r,d=a.currentY+l;0!==i.x&&(s=Math.abs((o-a.currentX)/i.x)),0!==i.y&&(r=Math.abs((d-a.currentY)/i.y));var p=Math.max(s,r);a.currentX=o,a.currentY=d;var c=a.width*e.scale,u=a.height*e.scale;a.minX=Math.min(t.slideWidth/2-c/2,0),a.maxX=-a.minX,a.minY=Math.min(t.slideHeight/2-u/2,0),a.maxY=-a.minY,a.currentX=Math.max(Math.min(a.currentX,a.maxX),a.minX),a.currentY=Math.max(Math.min(a.currentY,a.maxY),a.minY),t.$imageWrapEl.transition(p).transform("translate3d("+a.currentX+"px, "+a.currentY+"px,0)")}},onTransitionEnd:function(){var e=this.zoom,t=e.gesture;t.$slideEl&&this.previousIndex!==this.activeIndex&&(t.$imageEl.transform("translate3d(0,0,0) scale(1)"),t.$imageWrapEl.transform("translate3d(0,0,0)"),t.$slideEl=void 0,t.$imageEl=void 0,t.$imageWrapEl=void 0,e.scale=1,e.currentScale=1)},toggle:function(e){var t=this.zoom;t.scale&&1!==t.scale?t.out():t.in(e)},in:function(e){var t,a,i,s,r,n,o,l,d,p,c,u,h,v,f,m,g=this,b=g.zoom,w=g.params.zoom,y=b.gesture,x=b.image;(y.$slideEl||(y.$slideEl=g.clickedSlide?L(g.clickedSlide):g.slides.eq(g.activeIndex),y.$imageEl=y.$slideEl.find("img, svg, canvas"),y.$imageWrapEl=y.$imageEl.parent("."+w.containerClass)),y.$imageEl&&0!==y.$imageEl.length)&&(y.$slideEl.addClass(""+w.zoomedSlideClass),void 0===x.touchesStart.x&&e?(t="touchend"===e.type?e.changedTouches[0].pageX:e.pageX,a="touchend"===e.type?e.changedTouches[0].pageY:e.pageY):(t=x.touchesStart.x,a=x.touchesStart.y),b.scale=y.$imageWrapEl.attr("data-swiper-zoom")||w.maxRatio,b.currentScale=y.$imageWrapEl.attr("data-swiper-zoom")||w.maxRatio,e?(f=y.$slideEl[0].offsetWidth,m=y.$slideEl[0].offsetHeight,i=y.$slideEl.offset().left+f/2-t,s=y.$slideEl.offset().top+m/2-a,o=y.$imageEl[0].offsetWidth,l=y.$imageEl[0].offsetHeight,d=o*b.scale,p=l*b.scale,h=-(c=Math.min(f/2-d/2,0)),v=-(u=Math.min(m/2-p/2,0)),(r=i*b.scale)<c&&(r=c),h<r&&(r=h),(n=s*b.scale)<u&&(n=u),v<n&&(n=v)):n=r=0,y.$imageWrapEl.transition(300).transform("translate3d("+r+"px, "+n+"px,0)"),y.$imageEl.transition(300).transform("translate3d(0,0,0) scale("+b.scale+")"))},out:function(){var e=this,t=e.zoom,a=e.params.zoom,i=t.gesture;i.$slideEl||(i.$slideEl=e.clickedSlide?L(e.clickedSlide):e.slides.eq(e.activeIndex),i.$imageEl=i.$slideEl.find("img, svg, canvas"),i.$imageWrapEl=i.$imageEl.parent("."+a.containerClass)),i.$imageEl&&0!==i.$imageEl.length&&(t.scale=1,t.currentScale=1,i.$imageWrapEl.transition(300).transform("translate3d(0,0,0)"),i.$imageEl.transition(300).transform("translate3d(0,0,0) scale(1)"),i.$slideEl.removeClass(""+a.zoomedSlideClass),i.$slideEl=void 0)},enable:function(){var e=this,t=e.zoom;if(!t.enabled){t.enabled=!0;var a=!("touchstart"!==e.touchEvents.start||!R.passiveListener||!e.params.passiveListeners)&&{passive:!0,capture:!1};R.gestures?(e.$wrapperEl.on("gesturestart",".swiper-slide",t.onGestureStart,a),e.$wrapperEl.on("gesturechange",".swiper-slide",t.onGestureChange,a),e.$wrapperEl.on("gestureend",".swiper-slide",t.onGestureEnd,a)):"touchstart"===e.touchEvents.start&&(e.$wrapperEl.on(e.touchEvents.start,".swiper-slide",t.onGestureStart,a),e.$wrapperEl.on(e.touchEvents.move,".swiper-slide",t.onGestureChange,a),e.$wrapperEl.on(e.touchEvents.end,".swiper-slide",t.onGestureEnd,a)),e.$wrapperEl.on(e.touchEvents.move,"."+e.params.zoom.containerClass,t.onTouchMove)}},disable:function(){var e=this,t=e.zoom;if(t.enabled){e.zoom.enabled=!1;var a=!("touchstart"!==e.touchEvents.start||!R.passiveListener||!e.params.passiveListeners)&&{passive:!0,capture:!1};R.gestures?(e.$wrapperEl.off("gesturestart",".swiper-slide",t.onGestureStart,a),e.$wrapperEl.off("gesturechange",".swiper-slide",t.onGestureChange,a),e.$wrapperEl.off("gestureend",".swiper-slide",t.onGestureEnd,a)):"touchstart"===e.touchEvents.start&&(e.$wrapperEl.off(e.touchEvents.start,".swiper-slide",t.onGestureStart,a),e.$wrapperEl.off(e.touchEvents.move,".swiper-slide",t.onGestureChange,a),e.$wrapperEl.off(e.touchEvents.end,".swiper-slide",t.onGestureEnd,a)),e.$wrapperEl.off(e.touchEvents.move,"."+e.params.zoom.containerClass,t.onTouchMove)}}},W={loadInSlide:function(e,l){void 0===l&&(l=!0);var d=this,p=d.params.lazy;if(void 0!==e&&0!==d.slides.length){var c=d.virtual&&d.params.virtual.enabled?d.$wrapperEl.children("."+d.params.slideClass+'[data-swiper-slide-index="'+e+'"]'):d.slides.eq(e),t=c.find("."+p.elementClass+":not(."+p.loadedClass+"):not(."+p.loadingClass+")");!c.hasClass(p.elementClass)||c.hasClass(p.loadedClass)||c.hasClass(p.loadingClass)||(t=t.add(c[0])),0!==t.length&&t.each(function(e,t){var i=L(t);i.addClass(p.loadingClass);var s=i.attr("data-background"),r=i.attr("data-src"),n=i.attr("data-srcset"),o=i.attr("data-sizes");d.loadImage(i[0],r||s,n,o,!1,function(){if(null!=d&&d&&(!d||d.params)&&!d.destroyed){if(s?(i.css("background-image",'url("'+s+'")'),i.removeAttr("data-background")):(n&&(i.attr("srcset",n),i.removeAttr("data-srcset")),o&&(i.attr("sizes",o),i.removeAttr("data-sizes")),r&&(i.attr("src",r),i.removeAttr("data-src"))),i.addClass(p.loadedClass).removeClass(p.loadingClass),c.find("."+p.preloaderClass).remove(),d.params.loop&&l){var e=c.attr("data-swiper-slide-index");if(c.hasClass(d.params.slideDuplicateClass)){var t=d.$wrapperEl.children('[data-swiper-slide-index="'+e+'"]:not(.'+d.params.slideDuplicateClass+")");d.lazy.loadInSlide(t.index(),!1)}else{var a=d.$wrapperEl.children("."+d.params.slideDuplicateClass+'[data-swiper-slide-index="'+e+'"]');d.lazy.loadInSlide(a.index(),!1)}}d.emit("lazyImageReady",c[0],i[0])}}),d.emit("lazyImageLoad",c[0],i[0])})}},load:function(){var i=this,t=i.$wrapperEl,a=i.params,s=i.slides,e=i.activeIndex,r=i.virtual&&a.virtual.enabled,n=a.lazy,o=a.slidesPerView;function l(e){if(r){if(t.children("."+a.slideClass+'[data-swiper-slide-index="'+e+'"]').length)return!0}else if(s[e])return!0;return!1}function d(e){return r?L(e).attr("data-swiper-slide-index"):L(e).index()}if("auto"===o&&(o=0),i.lazy.initialImageLoaded||(i.lazy.initialImageLoaded=!0),i.params.watchSlidesVisibility)t.children("."+a.slideVisibleClass).each(function(e,t){var a=r?L(t).attr("data-swiper-slide-index"):L(t).index();i.lazy.loadInSlide(a)});else if(1<o)for(var p=e;p<e+o;p+=1)l(p)&&i.lazy.loadInSlide(p);else i.lazy.loadInSlide(e);if(n.loadPrevNext)if(1<o||n.loadPrevNextAmount&&1<n.loadPrevNextAmount){for(var c=n.loadPrevNextAmount,u=o,h=Math.min(e+u+Math.max(c,u),s.length),v=Math.max(e-Math.max(u,c),0),f=e+o;f<h;f+=1)l(f)&&i.lazy.loadInSlide(f);for(var m=v;m<e;m+=1)l(m)&&i.lazy.loadInSlide(m)}else{var g=t.children("."+a.slideNextClass);0<g.length&&i.lazy.loadInSlide(d(g));var b=t.children("."+a.slidePrevClass);0<b.length&&i.lazy.loadInSlide(d(b))}}},j={LinearSpline:function(e,t){var a,i,s,r,n,o=function(e,t){for(i=-1,a=e.length;1<a-i;)e[s=a+i>>1]<=t?i=s:a=s;return a};return this.x=e,this.y=t,this.lastIndex=e.length-1,this.interpolate=function(e){return e?(n=o(this.x,e),r=n-1,(e-this.x[r])*(this.y[n]-this.y[r])/(this.x[n]-this.x[r])+this.y[r]):0},this},getInterpolateFunction:function(e){var t=this;t.controller.spline||(t.controller.spline=t.params.loop?new j.LinearSpline(t.slidesGrid,e.slidesGrid):new j.LinearSpline(t.snapGrid,e.snapGrid))},setTranslate:function(e,t){var a,i,s=this,r=s.controller.control;function n(e){var t=s.rtlTranslate?-s.translate:s.translate;"slide"===s.params.controller.by&&(s.controller.getInterpolateFunction(e),i=-s.controller.spline.interpolate(-t)),i&&"container"!==s.params.controller.by||(a=(e.maxTranslate()-e.minTranslate())/(s.maxTranslate()-s.minTranslate()),i=(t-s.minTranslate())*a+e.minTranslate()),s.params.controller.inverse&&(i=e.maxTranslate()-i),e.updateProgress(i),e.setTranslate(i,s),e.updateActiveIndex(),e.updateSlidesClasses()}if(Array.isArray(r))for(var o=0;o<r.length;o+=1)r[o]!==t&&r[o]instanceof S&&n(r[o]);else r instanceof S&&t!==r&&n(r)},setTransition:function(t,e){var a,i=this,s=i.controller.control;function r(e){e.setTransition(t,i),0!==t&&(e.transitionStart(),e.params.autoHeight&&V.nextTick(function(){e.updateAutoHeight()}),e.$wrapperEl.transitionEnd(function(){s&&(e.params.loop&&"slide"===i.params.controller.by&&e.loopFix(),e.transitionEnd())}))}if(Array.isArray(s))for(a=0;a<s.length;a+=1)s[a]!==e&&s[a]instanceof S&&r(s[a]);else s instanceof S&&e!==s&&r(s)}},U={makeElFocusable:function(e){return e.attr("tabIndex","0"),e},addElRole:function(e,t){return e.attr("role",t),e},addElLabel:function(e,t){return e.attr("aria-label",t),e},disableEl:function(e){return e.attr("aria-disabled",!0),e},enableEl:function(e){return e.attr("aria-disabled",!1),e},onEnterKey:function(e){var t=this,a=t.params.a11y;if(13===e.keyCode){var i=L(e.target);t.navigation&&t.navigation.$nextEl&&i.is(t.navigation.$nextEl)&&(t.isEnd&&!t.params.loop||t.slideNext(),t.isEnd?t.a11y.notify(a.lastSlideMessage):t.a11y.notify(a.nextSlideMessage)),t.navigation&&t.navigation.$prevEl&&i.is(t.navigation.$prevEl)&&(t.isBeginning&&!t.params.loop||t.slidePrev(),t.isBeginning?t.a11y.notify(a.firstSlideMessage):t.a11y.notify(a.prevSlideMessage)),t.pagination&&i.is("."+t.params.pagination.bulletClass)&&i[0].click()}},notify:function(e){var t=this.a11y.liveRegion;0!==t.length&&(t.html(""),t.html(e))},updateNavigation:function(){var e=this;if(!e.params.loop){var t=e.navigation,a=t.$nextEl,i=t.$prevEl;i&&0<i.length&&(e.isBeginning?e.a11y.disableEl(i):e.a11y.enableEl(i)),a&&0<a.length&&(e.isEnd?e.a11y.disableEl(a):e.a11y.enableEl(a))}},updatePagination:function(){var i=this,s=i.params.a11y;i.pagination&&i.params.pagination.clickable&&i.pagination.bullets&&i.pagination.bullets.length&&i.pagination.bullets.each(function(e,t){var a=L(t);i.a11y.makeElFocusable(a),i.a11y.addElRole(a,"button"),i.a11y.addElLabel(a,s.paginationBulletMessage.replace(/{{index}}/,a.index()+1))})},init:function(){var e=this;e.$el.append(e.a11y.liveRegion);var t,a,i=e.params.a11y;e.navigation&&e.navigation.$nextEl&&(t=e.navigation.$nextEl),e.navigation&&e.navigation.$prevEl&&(a=e.navigation.$prevEl),t&&(e.a11y.makeElFocusable(t),e.a11y.addElRole(t,"button"),e.a11y.addElLabel(t,i.nextSlideMessage),t.on("keydown",e.a11y.onEnterKey)),a&&(e.a11y.makeElFocusable(a),e.a11y.addElRole(a,"button"),e.a11y.addElLabel(a,i.prevSlideMessage),a.on("keydown",e.a11y.onEnterKey)),e.pagination&&e.params.pagination.clickable&&e.pagination.bullets&&e.pagination.bullets.length&&e.pagination.$el.on("keydown","."+e.params.pagination.bulletClass,e.a11y.onEnterKey)},destroy:function(){var e,t,a=this;a.a11y.liveRegion&&0<a.a11y.liveRegion.length&&a.a11y.liveRegion.remove(),a.navigation&&a.navigation.$nextEl&&(e=a.navigation.$nextEl),a.navigation&&a.navigation.$prevEl&&(t=a.navigation.$prevEl),e&&e.off("keydown",a.a11y.onEnterKey),t&&t.off("keydown",a.a11y.onEnterKey),a.pagination&&a.params.pagination.clickable&&a.pagination.bullets&&a.pagination.bullets.length&&a.pagination.$el.off("keydown","."+a.params.pagination.bulletClass,a.a11y.onEnterKey)}},K={init:function(){var e=this;if(e.params.history){if(!Y.history||!Y.history.pushState)return e.params.history.enabled=!1,void(e.params.hashNavigation.enabled=!0);var t=e.history;t.initialized=!0,t.paths=K.getPathValues(),(t.paths.key||t.paths.value)&&(t.scrollToSlide(0,t.paths.value,e.params.runCallbacksOnInit),e.params.history.replaceState||Y.addEventListener("popstate",e.history.setHistoryPopState))}},destroy:function(){this.params.history.replaceState||Y.removeEventListener("popstate",this.history.setHistoryPopState)},setHistoryPopState:function(){this.history.paths=K.getPathValues(),this.history.scrollToSlide(this.params.speed,this.history.paths.value,!1)},getPathValues:function(){var e=Y.location.pathname.slice(1).split("/").filter(function(e){return""!==e}),t=e.length;return{key:e[t-2],value:e[t-1]}},setHistory:function(e,t){if(this.history.initialized&&this.params.history.enabled){var a=this.slides.eq(t),i=K.slugify(a.attr("data-history"));Y.location.pathname.includes(e)||(i=e+"/"+i);var s=Y.history.state;s&&s.value===i||(this.params.history.replaceState?Y.history.replaceState({value:i},null,i):Y.history.pushState({value:i},null,i))}},slugify:function(e){return e.toString().toLowerCase().replace(/\s+/g,"-").replace(/[^\w-]+/g,"").replace(/--+/g,"-").replace(/^-+/,"").replace(/-+$/,"")},scrollToSlide:function(e,t,a){var i=this;if(t)for(var s=0,r=i.slides.length;s<r;s+=1){var n=i.slides.eq(s);if(K.slugify(n.attr("data-history"))===t&&!n.hasClass(i.params.slideDuplicateClass)){var o=n.index();i.slideTo(o,e,a)}}else i.slideTo(0,e,a)}},_={onHashCange:function(){var e=this,t=f.location.hash.replace("#","");if(t!==e.slides.eq(e.activeIndex).attr("data-hash")){var a=e.$wrapperEl.children("."+e.params.slideClass+'[data-hash="'+t+'"]').index();if(void 0===a)return;e.slideTo(a)}},setHash:function(){var e=this;if(e.hashNavigation.initialized&&e.params.hashNavigation.enabled)if(e.params.hashNavigation.replaceState&&Y.history&&Y.history.replaceState)Y.history.replaceState(null,null,"#"+e.slides.eq(e.activeIndex).attr("data-hash")||"");else{var t=e.slides.eq(e.activeIndex),a=t.attr("data-hash")||t.attr("data-history");f.location.hash=a||""}},init:function(){var e=this;if(!(!e.params.hashNavigation.enabled||e.params.history&&e.params.history.enabled)){e.hashNavigation.initialized=!0;var t=f.location.hash.replace("#","");if(t)for(var a=0,i=e.slides.length;a<i;a+=1){var s=e.slides.eq(a);if((s.attr("data-hash")||s.attr("data-history"))===t&&!s.hasClass(e.params.slideDuplicateClass)){var r=s.index();e.slideTo(r,0,e.params.runCallbacksOnInit,!0)}}e.params.hashNavigation.watchState&&L(Y).on("hashchange",e.hashNavigation.onHashCange)}},destroy:function(){this.params.hashNavigation.watchState&&L(Y).off("hashchange",this.hashNavigation.onHashCange)}},Z={run:function(){var e=this,t=e.slides.eq(e.activeIndex),a=e.params.autoplay.delay;t.attr("data-swiper-autoplay")&&(a=t.attr("data-swiper-autoplay")||e.params.autoplay.delay),e.autoplay.timeout=V.nextTick(function(){e.params.autoplay.reverseDirection?e.params.loop?(e.loopFix(),e.slidePrev(e.params.speed,!0,!0),e.emit("autoplay")):e.isBeginning?e.params.autoplay.stopOnLastSlide?e.autoplay.stop():(e.slideTo(e.slides.length-1,e.params.speed,!0,!0),e.emit("autoplay")):(e.slidePrev(e.params.speed,!0,!0),e.emit("autoplay")):e.params.loop?(e.loopFix(),e.slideNext(e.params.speed,!0,!0),e.emit("autoplay")):e.isEnd?e.params.autoplay.stopOnLastSlide?e.autoplay.stop():(e.slideTo(0,e.params.speed,!0,!0),e.emit("autoplay")):(e.slideNext(e.params.speed,!0,!0),e.emit("autoplay"))},a)},start:function(){var e=this;return void 0===e.autoplay.timeout&&(!e.autoplay.running&&(e.autoplay.running=!0,e.emit("autoplayStart"),e.autoplay.run(),!0))},stop:function(){var e=this;return!!e.autoplay.running&&(void 0!==e.autoplay.timeout&&(e.autoplay.timeout&&(clearTimeout(e.autoplay.timeout),e.autoplay.timeout=void 0),e.autoplay.running=!1,e.emit("autoplayStop"),!0))},pause:function(e){var t=this;t.autoplay.running&&(t.autoplay.paused||(t.autoplay.timeout&&clearTimeout(t.autoplay.timeout),t.autoplay.paused=!0,0!==e&&t.params.autoplay.waitForTransition?(t.$wrapperEl[0].addEventListener("transitionend",t.autoplay.onTransitionEnd),t.$wrapperEl[0].addEventListener("webkitTransitionEnd",t.autoplay.onTransitionEnd)):(t.autoplay.paused=!1,t.autoplay.run())))}},Q={setTranslate:function(){for(var e=this,t=e.slides,a=0;a<t.length;a+=1){var i=e.slides.eq(a),s=-i[0].swiperSlideOffset;e.params.virtualTranslate||(s-=e.translate);var r=0;e.isHorizontal()||(r=s,s=0);var n=e.params.fadeEffect.crossFade?Math.max(1-Math.abs(i[0].progress),0):1+Math.min(Math.max(i[0].progress,-1),0);i.css({opacity:n}).transform("translate3d("+s+"px, "+r+"px, 0px)")}},setTransition:function(e){var a=this,t=a.slides,i=a.$wrapperEl;if(t.transition(e),a.params.virtualTranslate&&0!==e){var s=!1;t.transitionEnd(function(){if(!s&&a&&!a.destroyed){s=!0,a.animating=!1;for(var e=["webkitTransitionEnd","transitionend"],t=0;t<e.length;t+=1)i.trigger(e[t])}})}}},J={setTranslate:function(){var e,t=this,a=t.$el,i=t.$wrapperEl,s=t.slides,r=t.width,n=t.height,o=t.rtlTranslate,l=t.size,d=t.params.cubeEffect,p=t.isHorizontal(),c=t.virtual&&t.params.virtual.enabled,u=0;d.shadow&&(p?(0===(e=i.find(".swiper-cube-shadow")).length&&(e=L('<div class="swiper-cube-shadow"></div>'),i.append(e)),e.css({height:r+"px"})):0===(e=a.find(".swiper-cube-shadow")).length&&(e=L('<div class="swiper-cube-shadow"></div>'),a.append(e)));for(var h=0;h<s.length;h+=1){var v=s.eq(h),f=h;c&&(f=parseInt(v.attr("data-swiper-slide-index"),10));var m=90*f,g=Math.floor(m/360);o&&(m=-m,g=Math.floor(-m/360));var b=Math.max(Math.min(v[0].progress,1),-1),w=0,y=0,x=0;f%4==0?(w=4*-g*l,x=0):(f-1)%4==0?(w=0,x=4*-g*l):(f-2)%4==0?(w=l+4*g*l,x=l):(f-3)%4==0&&(w=-l,x=3*l+4*l*g),o&&(w=-w),p||(y=w,w=0);var T="rotateX("+(p?0:-m)+"deg) rotateY("+(p?m:0)+"deg) translate3d("+w+"px, "+y+"px, "+x+"px)";if(b<=1&&-1<b&&(u=90*f+90*b,o&&(u=90*-f-90*b)),v.transform(T),d.slideShadows){var E=p?v.find(".swiper-slide-shadow-left"):v.find(".swiper-slide-shadow-top"),S=p?v.find(".swiper-slide-shadow-right"):v.find(".swiper-slide-shadow-bottom");0===E.length&&(E=L('<div class="swiper-slide-shadow-'+(p?"left":"top")+'"></div>'),v.append(E)),0===S.length&&(S=L('<div class="swiper-slide-shadow-'+(p?"right":"bottom")+'"></div>'),v.append(S)),E.length&&(E[0].style.opacity=Math.max(-b,0)),S.length&&(S[0].style.opacity=Math.max(b,0))}}if(i.css({"-webkit-transform-origin":"50% 50% -"+l/2+"px","-moz-transform-origin":"50% 50% -"+l/2+"px","-ms-transform-origin":"50% 50% -"+l/2+"px","transform-origin":"50% 50% -"+l/2+"px"}),d.shadow)if(p)e.transform("translate3d(0px, "+(r/2+d.shadowOffset)+"px, "+-r/2+"px) rotateX(90deg) rotateZ(0deg) scale("+d.shadowScale+")");else{var C=Math.abs(u)-90*Math.floor(Math.abs(u)/90),M=1.5-(Math.sin(2*C*Math.PI/360)/2+Math.cos(2*C*Math.PI/360)/2),k=d.shadowScale,z=d.shadowScale/M,P=d.shadowOffset;e.transform("scale3d("+k+", 1, "+z+") translate3d(0px, "+(n/2+P)+"px, "+-n/2/z+"px) rotateX(-90deg)")}var $=I.isSafari||I.isUiWebView?-l/2:0;i.transform("translate3d(0px,0,"+$+"px) rotateX("+(t.isHorizontal()?0:u)+"deg) rotateY("+(t.isHorizontal()?-u:0)+"deg)")},setTransition:function(e){var t=this.$el;this.slides.transition(e).find(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").transition(e),this.params.cubeEffect.shadow&&!this.isHorizontal()&&t.find(".swiper-cube-shadow").transition(e)}},ee={setTranslate:function(){for(var e=this,t=e.slides,a=e.rtlTranslate,i=0;i<t.length;i+=1){var s=t.eq(i),r=s[0].progress;e.params.flipEffect.limitRotation&&(r=Math.max(Math.min(s[0].progress,1),-1));var n=-180*r,o=0,l=-s[0].swiperSlideOffset,d=0;if(e.isHorizontal()?a&&(n=-n):(d=l,o=-n,n=l=0),s[0].style.zIndex=-Math.abs(Math.round(r))+t.length,e.params.flipEffect.slideShadows){var p=e.isHorizontal()?s.find(".swiper-slide-shadow-left"):s.find(".swiper-slide-shadow-top"),c=e.isHorizontal()?s.find(".swiper-slide-shadow-right"):s.find(".swiper-slide-shadow-bottom");0===p.length&&(p=L('<div class="swiper-slide-shadow-'+(e.isHorizontal()?"left":"top")+'"></div>'),s.append(p)),0===c.length&&(c=L('<div class="swiper-slide-shadow-'+(e.isHorizontal()?"right":"bottom")+'"></div>'),s.append(c)),p.length&&(p[0].style.opacity=Math.max(-r,0)),c.length&&(c[0].style.opacity=Math.max(r,0))}s.transform("translate3d("+l+"px, "+d+"px, 0px) rotateX("+o+"deg) rotateY("+n+"deg)")}},setTransition:function(e){var a=this,t=a.slides,i=a.activeIndex,s=a.$wrapperEl;if(t.transition(e).find(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").transition(e),a.params.virtualTranslate&&0!==e){var r=!1;t.eq(i).transitionEnd(function(){if(!r&&a&&!a.destroyed){r=!0,a.animating=!1;for(var e=["webkitTransitionEnd","transitionend"],t=0;t<e.length;t+=1)s.trigger(e[t])}})}}},te={setTranslate:function(){for(var e=this,t=e.width,a=e.height,i=e.slides,s=e.$wrapperEl,r=e.slidesSizesGrid,n=e.params.coverflowEffect,o=e.isHorizontal(),l=e.translate,d=o?t/2-l:a/2-l,p=o?n.rotate:-n.rotate,c=n.depth,u=0,h=i.length;u<h;u+=1){var v=i.eq(u),f=r[u],m=(d-v[0].swiperSlideOffset-f/2)/f*n.modifier,g=o?p*m:0,b=o?0:p*m,w=-c*Math.abs(m),y=o?0:n.stretch*m,x=o?n.stretch*m:0;Math.abs(x)<.001&&(x=0),Math.abs(y)<.001&&(y=0),Math.abs(w)<.001&&(w=0),Math.abs(g)<.001&&(g=0),Math.abs(b)<.001&&(b=0);var T="translate3d("+x+"px,"+y+"px,"+w+"px)  rotateX("+b+"deg) rotateY("+g+"deg)";if(v.transform(T),v[0].style.zIndex=1-Math.abs(Math.round(m)),n.slideShadows){var E=o?v.find(".swiper-slide-shadow-left"):v.find(".swiper-slide-shadow-top"),S=o?v.find(".swiper-slide-shadow-right"):v.find(".swiper-slide-shadow-bottom");0===E.length&&(E=L('<div class="swiper-slide-shadow-'+(o?"left":"top")+'"></div>'),v.append(E)),0===S.length&&(S=L('<div class="swiper-slide-shadow-'+(o?"right":"bottom")+'"></div>'),v.append(S)),E.length&&(E[0].style.opacity=0<m?m:0),S.length&&(S[0].style.opacity=0<-m?-m:0)}}(R.pointerEvents||R.prefixedPointerEvents)&&(s[0].style.perspectiveOrigin=d+"px 50%")},setTransition:function(e){this.slides.transition(e).find(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").transition(e)}},ae={init:function(){var e=this,t=e.params.thumbs,a=e.constructor;t.swiper instanceof a?(e.thumbs.swiper=t.swiper,V.extend(e.thumbs.swiper.originalParams,{watchSlidesProgress:!0,slideToClickedSlide:!1}),V.extend(e.thumbs.swiper.params,{watchSlidesProgress:!0,slideToClickedSlide:!1})):V.isObject(t.swiper)&&(e.thumbs.swiper=new a(V.extend({},t.swiper,{watchSlidesVisibility:!0,watchSlidesProgress:!0,slideToClickedSlide:!1})),e.thumbs.swiperCreated=!0),e.thumbs.swiper.$el.addClass(e.params.thumbs.thumbsContainerClass),e.thumbs.swiper.on("tap",e.thumbs.onThumbClick)},onThumbClick:function(){var e=this,t=e.thumbs.swiper;if(t){var a=t.clickedIndex;if(null!=a){var i;if(i=t.params.loop?parseInt(L(t.clickedSlide).attr("data-swiper-slide-index"),10):a,e.params.loop){var s=e.activeIndex;e.slides.eq(s).hasClass(e.params.slideDuplicateClass)&&(e.loopFix(),e._clientLeft=e.$wrapperEl[0].clientLeft,s=e.activeIndex);var r=e.slides.eq(s).prevAll('[data-swiper-slide-index="'+i+'"]').eq(0).index(),n=e.slides.eq(s).nextAll('[data-swiper-slide-index="'+i+'"]').eq(0).index();i=void 0===r?n:void 0===n?r:n-s<s-r?n:r}e.slideTo(i)}}},update:function(e){var t=this,a=t.thumbs.swiper;if(a){var i="auto"===a.params.slidesPerView?a.slidesPerViewDynamic():a.params.slidesPerView;if(t.realIndex!==a.realIndex){var s,r=a.activeIndex;if(a.params.loop){a.slides.eq(r).hasClass(a.params.slideDuplicateClass)&&(a.loopFix(),a._clientLeft=a.$wrapperEl[0].clientLeft,r=a.activeIndex);var n=a.slides.eq(r).prevAll('[data-swiper-slide-index="'+t.realIndex+'"]').eq(0).index(),o=a.slides.eq(r).nextAll('[data-swiper-slide-index="'+t.realIndex+'"]').eq(0).index();s=void 0===n?o:void 0===o?n:o-r<r-n?o:n}else s=t.realIndex;a.visibleSlidesIndexes.indexOf(s)<0&&(a.params.centeredSlides?s=r<s?s-Math.floor(i/2)+1:s+Math.floor(i/2)-1:r<s&&(s=s-i+1),a.slideTo(s,e?0:void 0))}var l=1,d=t.params.thumbs.slideThumbActiveClass;if(1<t.params.slidesPerView&&!t.params.centeredSlides&&(l=t.params.slidesPerView),a.slides.removeClass(d),a.params.loop)for(var p=0;p<l;p+=1)a.$wrapperEl.children('[data-swiper-slide-index="'+(t.realIndex+p)+'"]').addClass(d);else for(var c=0;c<l;c+=1)a.slides.eq(t.realIndex+c).addClass(d)}}},ie=[C,M,k,z,$,O,H,{name:"mousewheel",params:{mousewheel:{enabled:!1,releaseOnEdges:!1,invert:!1,forceToAxis:!1,sensitivity:1,eventsTarged:"container"}},create:function(){var e=this;V.extend(e,{mousewheel:{enabled:!1,enable:B.enable.bind(e),disable:B.disable.bind(e),handle:B.handle.bind(e),handleMouseEnter:B.handleMouseEnter.bind(e),handleMouseLeave:B.handleMouseLeave.bind(e),lastScrollTime:V.now()}})},on:{init:function(){this.params.mousewheel.enabled&&this.mousewheel.enable()},destroy:function(){this.mousewheel.enabled&&this.mousewheel.disable()}}},{name:"navigation",params:{navigation:{nextEl:null,prevEl:null,hideOnClick:!1,disabledClass:"swiper-button-disabled",hiddenClass:"swiper-button-hidden",lockClass:"swiper-button-lock"}},create:function(){V.extend(this,{navigation:{init:G.init.bind(this),update:G.update.bind(this),destroy:G.destroy.bind(this)}})},on:{init:function(){this.navigation.init(),this.navigation.update()},toEdge:function(){this.navigation.update()},fromEdge:function(){this.navigation.update()},destroy:function(){this.navigation.destroy()},click:function(e){var t=this.navigation,a=t.$nextEl,i=t.$prevEl;!this.params.navigation.hideOnClick||L(e.target).is(i)||L(e.target).is(a)||(a&&a.toggleClass(this.params.navigation.hiddenClass),i&&i.toggleClass(this.params.navigation.hiddenClass))}}},{name:"pagination",params:{pagination:{el:null,bulletElement:"span",clickable:!1,hideOnClick:!1,renderBullet:null,renderProgressbar:null,renderFraction:null,renderCustom:null,progressbarOpposite:!1,type:"bullets",dynamicBullets:!1,dynamicMainBullets:1,formatFractionCurrent:function(e){return e},formatFractionTotal:function(e){return e},bulletClass:"swiper-pagination-bullet",bulletActiveClass:"swiper-pagination-bullet-active",modifierClass:"swiper-pagination-",currentClass:"swiper-pagination-current",totalClass:"swiper-pagination-total",hiddenClass:"swiper-pagination-hidden",progressbarFillClass:"swiper-pagination-progressbar-fill",progressbarOppositeClass:"swiper-pagination-progressbar-opposite",clickableClass:"swiper-pagination-clickable",lockClass:"swiper-pagination-lock"}},create:function(){var e=this;V.extend(e,{pagination:{init:N.init.bind(e),render:N.render.bind(e),update:N.update.bind(e),destroy:N.destroy.bind(e),dynamicBulletIndex:0}})},on:{init:function(){this.pagination.init(),this.pagination.render(),this.pagination.update()},activeIndexChange:function(){this.params.loop?this.pagination.update():void 0===this.snapIndex&&this.pagination.update()},snapIndexChange:function(){this.params.loop||this.pagination.update()},slidesLengthChange:function(){this.params.loop&&(this.pagination.render(),this.pagination.update())},snapGridLengthChange:function(){this.params.loop||(this.pagination.render(),this.pagination.update())},destroy:function(){this.pagination.destroy()},click:function(e){var t=this;t.params.pagination.el&&t.params.pagination.hideOnClick&&0<t.pagination.$el.length&&!L(e.target).hasClass(t.params.pagination.bulletClass)&&t.pagination.$el.toggleClass(t.params.pagination.hiddenClass)}}},{name:"scrollbar",params:{scrollbar:{el:null,dragSize:"auto",hide:!1,draggable:!1,snapOnRelease:!0,lockClass:"swiper-scrollbar-lock",dragClass:"swiper-scrollbar-drag"}},create:function(){var e=this;V.extend(e,{scrollbar:{init:X.init.bind(e),destroy:X.destroy.bind(e),updateSize:X.updateSize.bind(e),setTranslate:X.setTranslate.bind(e),setTransition:X.setTransition.bind(e),enableDraggable:X.enableDraggable.bind(e),disableDraggable:X.disableDraggable.bind(e),setDragPosition:X.setDragPosition.bind(e),onDragStart:X.onDragStart.bind(e),onDragMove:X.onDragMove.bind(e),onDragEnd:X.onDragEnd.bind(e),isTouched:!1,timeout:null,dragTimeout:null}})},on:{init:function(){this.scrollbar.init(),this.scrollbar.updateSize(),this.scrollbar.setTranslate()},update:function(){this.scrollbar.updateSize()},resize:function(){this.scrollbar.updateSize()},observerUpdate:function(){this.scrollbar.updateSize()},setTranslate:function(){this.scrollbar.setTranslate()},setTransition:function(e){this.scrollbar.setTransition(e)},destroy:function(){this.scrollbar.destroy()}}},{name:"parallax",params:{parallax:{enabled:!1}},create:function(){V.extend(this,{parallax:{setTransform:F.setTransform.bind(this),setTranslate:F.setTranslate.bind(this),setTransition:F.setTransition.bind(this)}})},on:{beforeInit:function(){this.params.parallax.enabled&&(this.params.watchSlidesProgress=!0,this.originalParams.watchSlidesProgress=!0)},init:function(){this.params.parallax&&this.parallax.setTranslate()},setTranslate:function(){this.params.parallax&&this.parallax.setTranslate()},setTransition:function(e){this.params.parallax&&this.parallax.setTransition(e)}}},{name:"zoom",params:{zoom:{enabled:!1,maxRatio:3,minRatio:1,toggle:!0,containerClass:"swiper-zoom-container",zoomedSlideClass:"swiper-slide-zoomed"}},create:function(){var t=this,a={enabled:!1,scale:1,currentScale:1,isScaling:!1,gesture:{$slideEl:void 0,slideWidth:void 0,slideHeight:void 0,$imageEl:void 0,$imageWrapEl:void 0,maxRatio:3},image:{isTouched:void 0,isMoved:void 0,currentX:void 0,currentY:void 0,minX:void 0,minY:void 0,maxX:void 0,maxY:void 0,width:void 0,height:void 0,startX:void 0,startY:void 0,touchesStart:{},touchesCurrent:{}},velocity:{x:void 0,y:void 0,prevPositionX:void 0,prevPositionY:void 0,prevTime:void 0}};"onGestureStart onGestureChange onGestureEnd onTouchStart onTouchMove onTouchEnd onTransitionEnd toggle enable disable in out".split(" ").forEach(function(e){a[e]=q[e].bind(t)}),V.extend(t,{zoom:a})},on:{init:function(){this.params.zoom.enabled&&this.zoom.enable()},destroy:function(){this.zoom.disable()},touchStart:function(e){this.zoom.enabled&&this.zoom.onTouchStart(e)},touchEnd:function(e){this.zoom.enabled&&this.zoom.onTouchEnd(e)},doubleTap:function(e){this.params.zoom.enabled&&this.zoom.enabled&&this.params.zoom.toggle&&this.zoom.toggle(e)},transitionEnd:function(){this.zoom.enabled&&this.params.zoom.enabled&&this.zoom.onTransitionEnd()}}},{name:"lazy",params:{lazy:{enabled:!1,loadPrevNext:!1,loadPrevNextAmount:1,loadOnTransitionStart:!1,elementClass:"swiper-lazy",loadingClass:"swiper-lazy-loading",loadedClass:"swiper-lazy-loaded",preloaderClass:"swiper-lazy-preloader"}},create:function(){V.extend(this,{lazy:{initialImageLoaded:!1,load:W.load.bind(this),loadInSlide:W.loadInSlide.bind(this)}})},on:{beforeInit:function(){this.params.lazy.enabled&&this.params.preloadImages&&(this.params.preloadImages=!1)},init:function(){this.params.lazy.enabled&&!this.params.loop&&0===this.params.initialSlide&&this.lazy.load()},scroll:function(){this.params.freeMode&&!this.params.freeModeSticky&&this.lazy.load()},resize:function(){this.params.lazy.enabled&&this.lazy.load()},scrollbarDragMove:function(){this.params.lazy.enabled&&this.lazy.load()},transitionStart:function(){var e=this;e.params.lazy.enabled&&(e.params.lazy.loadOnTransitionStart||!e.params.lazy.loadOnTransitionStart&&!e.lazy.initialImageLoaded)&&e.lazy.load()},transitionEnd:function(){this.params.lazy.enabled&&!this.params.lazy.loadOnTransitionStart&&this.lazy.load()}}},{name:"controller",params:{controller:{control:void 0,inverse:!1,by:"slide"}},create:function(){var e=this;V.extend(e,{controller:{control:e.params.controller.control,getInterpolateFunction:j.getInterpolateFunction.bind(e),setTranslate:j.setTranslate.bind(e),setTransition:j.setTransition.bind(e)}})},on:{update:function(){this.controller.control&&this.controller.spline&&(this.controller.spline=void 0,delete this.controller.spline)},resize:function(){this.controller.control&&this.controller.spline&&(this.controller.spline=void 0,delete this.controller.spline)},observerUpdate:function(){this.controller.control&&this.controller.spline&&(this.controller.spline=void 0,delete this.controller.spline)},setTranslate:function(e,t){this.controller.control&&this.controller.setTranslate(e,t)},setTransition:function(e,t){this.controller.control&&this.controller.setTransition(e,t)}}},{name:"a11y",params:{a11y:{enabled:!0,notificationClass:"swiper-notification",prevSlideMessage:"Previous slide",nextSlideMessage:"Next slide",firstSlideMessage:"This is the first slide",lastSlideMessage:"This is the last slide",paginationBulletMessage:"Go to slide {{index}}"}},create:function(){var t=this;V.extend(t,{a11y:{liveRegion:L('<span class="'+t.params.a11y.notificationClass+'" aria-live="assertive" aria-atomic="true"></span>')}}),Object.keys(U).forEach(function(e){t.a11y[e]=U[e].bind(t)})},on:{init:function(){this.params.a11y.enabled&&(this.a11y.init(),this.a11y.updateNavigation())},toEdge:function(){this.params.a11y.enabled&&this.a11y.updateNavigation()},fromEdge:function(){this.params.a11y.enabled&&this.a11y.updateNavigation()},paginationUpdate:function(){this.params.a11y.enabled&&this.a11y.updatePagination()},destroy:function(){this.params.a11y.enabled&&this.a11y.destroy()}}},{name:"history",params:{history:{enabled:!1,replaceState:!1,key:"slides"}},create:function(){var e=this;V.extend(e,{history:{init:K.init.bind(e),setHistory:K.setHistory.bind(e),setHistoryPopState:K.setHistoryPopState.bind(e),scrollToSlide:K.scrollToSlide.bind(e),destroy:K.destroy.bind(e)}})},on:{init:function(){this.params.history.enabled&&this.history.init()},destroy:function(){this.params.history.enabled&&this.history.destroy()},transitionEnd:function(){this.history.initialized&&this.history.setHistory(this.params.history.key,this.activeIndex)}}},{name:"hash-navigation",params:{hashNavigation:{enabled:!1,replaceState:!1,watchState:!1}},create:function(){var e=this;V.extend(e,{hashNavigation:{initialized:!1,init:_.init.bind(e),destroy:_.destroy.bind(e),setHash:_.setHash.bind(e),onHashCange:_.onHashCange.bind(e)}})},on:{init:function(){this.params.hashNavigation.enabled&&this.hashNavigation.init()},destroy:function(){this.params.hashNavigation.enabled&&this.hashNavigation.destroy()},transitionEnd:function(){this.hashNavigation.initialized&&this.hashNavigation.setHash()}}},{name:"autoplay",params:{autoplay:{enabled:!1,delay:3e3,waitForTransition:!0,disableOnInteraction:!0,stopOnLastSlide:!1,reverseDirection:!1}},create:function(){var t=this;V.extend(t,{autoplay:{running:!1,paused:!1,run:Z.run.bind(t),start:Z.start.bind(t),stop:Z.stop.bind(t),pause:Z.pause.bind(t),onTransitionEnd:function(e){t&&!t.destroyed&&t.$wrapperEl&&e.target===this&&(t.$wrapperEl[0].removeEventListener("transitionend",t.autoplay.onTransitionEnd),t.$wrapperEl[0].removeEventListener("webkitTransitionEnd",t.autoplay.onTransitionEnd),t.autoplay.paused=!1,t.autoplay.running?t.autoplay.run():t.autoplay.stop())}}})},on:{init:function(){this.params.autoplay.enabled&&this.autoplay.start()},beforeTransitionStart:function(e,t){this.autoplay.running&&(t||!this.params.autoplay.disableOnInteraction?this.autoplay.pause(e):this.autoplay.stop())},sliderFirstMove:function(){this.autoplay.running&&(this.params.autoplay.disableOnInteraction?this.autoplay.stop():this.autoplay.pause())},destroy:function(){this.autoplay.running&&this.autoplay.stop()}}},{name:"effect-fade",params:{fadeEffect:{crossFade:!1}},create:function(){V.extend(this,{fadeEffect:{setTranslate:Q.setTranslate.bind(this),setTransition:Q.setTransition.bind(this)}})},on:{beforeInit:function(){var e=this;if("fade"===e.params.effect){e.classNames.push(e.params.containerModifierClass+"fade");var t={slidesPerView:1,slidesPerColumn:1,slidesPerGroup:1,watchSlidesProgress:!0,spaceBetween:0,virtualTranslate:!0};V.extend(e.params,t),V.extend(e.originalParams,t)}},setTranslate:function(){"fade"===this.params.effect&&this.fadeEffect.setTranslate()},setTransition:function(e){"fade"===this.params.effect&&this.fadeEffect.setTransition(e)}}},{name:"effect-cube",params:{cubeEffect:{slideShadows:!0,shadow:!0,shadowOffset:20,shadowScale:.94}},create:function(){V.extend(this,{cubeEffect:{setTranslate:J.setTranslate.bind(this),setTransition:J.setTransition.bind(this)}})},on:{beforeInit:function(){var e=this;if("cube"===e.params.effect){e.classNames.push(e.params.containerModifierClass+"cube"),e.classNames.push(e.params.containerModifierClass+"3d");var t={slidesPerView:1,slidesPerColumn:1,slidesPerGroup:1,watchSlidesProgress:!0,resistanceRatio:0,spaceBetween:0,centeredSlides:!1,virtualTranslate:!0};V.extend(e.params,t),V.extend(e.originalParams,t)}},setTranslate:function(){"cube"===this.params.effect&&this.cubeEffect.setTranslate()},setTransition:function(e){"cube"===this.params.effect&&this.cubeEffect.setTransition(e)}}},{name:"effect-flip",params:{flipEffect:{slideShadows:!0,limitRotation:!0}},create:function(){V.extend(this,{flipEffect:{setTranslate:ee.setTranslate.bind(this),setTransition:ee.setTransition.bind(this)}})},on:{beforeInit:function(){var e=this;if("flip"===e.params.effect){e.classNames.push(e.params.containerModifierClass+"flip"),e.classNames.push(e.params.containerModifierClass+"3d");var t={slidesPerView:1,slidesPerColumn:1,slidesPerGroup:1,watchSlidesProgress:!0,spaceBetween:0,virtualTranslate:!0};V.extend(e.params,t),V.extend(e.originalParams,t)}},setTranslate:function(){"flip"===this.params.effect&&this.flipEffect.setTranslate()},setTransition:function(e){"flip"===this.params.effect&&this.flipEffect.setTransition(e)}}},{name:"effect-coverflow",params:{coverflowEffect:{rotate:50,stretch:0,depth:100,modifier:1,slideShadows:!0}},create:function(){V.extend(this,{coverflowEffect:{setTranslate:te.setTranslate.bind(this),setTransition:te.setTransition.bind(this)}})},on:{beforeInit:function(){var e=this;"coverflow"===e.params.effect&&(e.classNames.push(e.params.containerModifierClass+"coverflow"),e.classNames.push(e.params.containerModifierClass+"3d"),e.params.watchSlidesProgress=!0,e.originalParams.watchSlidesProgress=!0)},setTranslate:function(){"coverflow"===this.params.effect&&this.coverflowEffect.setTranslate()},setTransition:function(e){"coverflow"===this.params.effect&&this.coverflowEffect.setTransition(e)}}},{name:"thumbs",params:{thumbs:{swiper:null,slideThumbActiveClass:"swiper-slide-thumb-active",thumbsContainerClass:"swiper-container-thumbs"}},create:function(){V.extend(this,{thumbs:{swiper:null,init:ae.init.bind(this),update:ae.update.bind(this),onThumbClick:ae.onThumbClick.bind(this)}})},on:{beforeInit:function(){var e=this.params.thumbs;e&&e.swiper&&(this.thumbs.init(),this.thumbs.update(!0))},slideChange:function(){this.thumbs.swiper&&this.thumbs.update()},update:function(){this.thumbs.swiper&&this.thumbs.update()},resize:function(){this.thumbs.swiper&&this.thumbs.update()},observerUpdate:function(){this.thumbs.swiper&&this.thumbs.update()},setTransition:function(e){var t=this.thumbs.swiper;t&&t.setTransition(e)},beforeDestroy:function(){var e=this.thumbs.swiper;e&&this.thumbs.swiperCreated&&e&&e.destroy()}}}];return void 0===S.use&&(S.use=S.Class.use,S.installModule=S.Class.installModule),S.use(ie),S});
//# sourceMappingURL=swiper.min.js.map

$(document).ready(function () {
    var $generalSwiperCard = $('.led-list-content .swiper-slide');
    var $previewSwiper = $('.case-preview-content')
    var $previewClose = $('.case-preview-content .close-btn');
    var cardIndex;
    var previewSwiper;
  
    function initCarousel() {
        var generalSwiper = new Swiper('.swiper', {
            slidesPerView: $(window).width() > 991 ? 3 : 1.5,
            spaceBetween: $(window).width() > 991 ? 25 : 15,
            direction: 'horizontal',
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev'
            }
        });
    }
    function initCarouselPreview(cardIndex) {
        if(!previewSwiper){
            previewSwiper = new Swiper('.big-swiper', {
                navigation: {
                    nextEl: '.swiper-button-next2',
                    prevEl: '.swiper-button-prev2'
                },
                on: {
                    slideChangeTransitionStart: function(){
                        $('.plyr__control--overlaid.plyr__control--pressed').click();
                    },
                }
            });
            previewSwiper.slideTo(cardIndex,0);
        }else{
            previewSwiper.slideTo(cardIndex,0);
        }
    }

    if($generalSwiperCard.length < 3){
        $('.led-list-content').addClass('center-style');
    }

    // youtubeImage
    $('.led-list-content .slide-youtobevideo').each(function(){
        var videoPath = $(this).find('.card-item').attr('data-video-path')
        if(videoPath){
         var youtubeVideoId = getVideoId(videoPath,'v')
         var youtubeImage =location.protocol + '//img.youtube.com/vi/' +youtubeVideoId+ '/0.jpg'
         $(this).find('.card-item').css('background-image','url('+youtubeImage+')')
        }
    })
      
    initCarousel();

    $generalSwiperCard.on('click', function () {
        cardIndex= $(this).index();
        $previewSwiper.show();
        initCarouselPreview(cardIndex);
    })
  
    $previewClose.on('click', function (e) {
        e.stopPropagation();
        $previewSwiper.hide()
    })

});
$(document).ready(function() {
    var $comp = $('.doc-certificate-comp')
    var currentSite = $('meta[name="locale"]').attr('content');
    $comp.find('.doc-search-input').on('focus',function(){
        $(this).parent().addClass('focused')
    })
    $comp.find('.doc-search-input').on('blur',function(){
        $(this).parent().removeClass('focused')
    })
    $comp.find('.search-btn').on('click',function(event){
        var currentKey = $comp.find('.doc-search-input').val();
        var module ="DOC_Certificate_Query::search::"+ currentKey +'::'+ window.location.href
        atModel.doAtEvent(module, 'action', event);
        $('.search-input-wrap').removeClass('error-input');
        if(currentKey.length < 6){
            $('.search-input-wrap').addClass('error-input');
            return
        }
        var timer = setTimeout(function () {
            $('.verifyModalWrap').hide();
            clearTimeout(timer)
        }, 50000)
        $('.verifyModalWrap').first().show();
        initPuzzleVerification(currentKey,currentSite,timer)
    })

    function initPuzzleVerification(key,site,timer) {
        $("#mpanel4").slideVerify({
            type: 2,
            vOffset: 5,
            vSpace: 5,
            blockSize: {
                width: "40px",
                height: "40px",
            },
            success: function () {
                $('.verifyModalWrap').hide()
                clearTimeout(timer)
                searchResult(key,site);
            },
        });
        $('.verifyModalWrap .close-Verification').click(function () {
            $('.verifyModalWrap').hide()
            clearTimeout(timer)
        })
    }

    function searchResult(key,site){
        $.ajax({
            type: 'GET',
            url: '/bin/hikvision/doc/search.json?site='+site+'&keyword='+key,
            dataType: 'json',
            data:null
        }).done(function (resultData) {
            $('#tmpl-result-body').html(tmpl('tmpl-doc-certificate', resultData.data));
            initLoadingItem($comp);
            docBindEvent($comp);
            $comp.find('.product-model-item-name').first().click()
            $('.doc-certificate-comp .doc-name-item a').on('click', function(e) {
                e.preventDefault();
                var module = $(this).attr('data-at-module') + window.location.href;
                atModel.doAtEvent(module, 'download', e);
                var ahref = $(this).attr('href')
                if(ahref != 'javascript:void(0);'){
                    setTimeout(function() {
                        window.open(ahref, '_blank')
                    }, 500)
                }

            });
        }).fail(function (error) {
            console.log(error);
        })
    }

    function docBindEvent($comp){
        $comp.find('.product-model-item-name').on('click',function(){
            $(this).parent().siblings().removeClass('active');
            $(this).parent().toggleClass("active");
        })
    }

    $comp.each(function() {
        $(window).on('scroll', function() {
            loadingItem($comp);
        });
    })

    function initLoadingItem($comp) {
        $comp.find('.product-model-item').removeClass('lazy-show');
        $comp.find('.product-model-item:lt(10)').addClass('lazy-show');
    }

    var scrollTimer = null;
    function loadingItem($comp) {
        var $itemNoActive = $comp.find('.product-model-item:not(.lazy-show):lt(10)');
        var bh = $comp.height() + $comp.offset().top;

        var allowLoad = ($(window).height() + $(window).scrollTop() > bh) && $(window).scrollTop() < bh;

        if (scrollTimer || !allowLoad || $itemNoActive.length <= 0) {
            return;
        }

        if ($itemNoActive.length > 0) {
            $comp.append('<div class="loading-box"><div>');
        }

        scrollTimer = setTimeout(function() {
            $itemNoActive.addClass('lazy-show');
            $comp.find('.loading-box').remove();
            scrollTimer = null;
        }, 1000);
    }

});

$(document).ready(function () {
    function initCountryRegion(form) {
        var option = {
            onSelected: function ($ele, $input) {
                var val = $input.data('value');
                var code = $input.data('country-code');
                $ele.find('input[name="Country"]').val(val).trigger('change').trigger('blur');
                $ele.find('input[name="countryCode"]').val(code).trigger('change').trigger('blur');
                selectCountry(form, code);
            }
        }
        return form.find('.hik-outlined-select.country-region').hikSelect(option);
        
    }

    function selectCountry($comp, code) {
        $comp.find(".contact-us-list").each(function () {
            var $this = $(this);
            var country = $this.data('value');
            $this.removeClass('active')
            if(country == code) {
                $this.addClass('active');
            }
        })
    }
    //按钮埋点
    function atBtn($comp) {
        var $linkArrow = $comp.find(".linkArrow");
        if($linkArrow.length > 0){
            $linkArrow.on('click',function (e) {
                var $this = $(this);
                var catName = $this.children().text().trim();
                var href = $this.children().attr('href');
                var lastHrefIndex = lastNode(href);
                var atModule ='contact_us_selector::'+ catName +"::" + lastHrefIndex;
                atModel.doAtEvent(atModule,'navigation',e)
            })
        }
    }
    $('.contact-us-scheme-comp').each(function() {
        var $comp = $(this);
        initCountryRegion($comp);
        atBtn($comp);
    })
})
