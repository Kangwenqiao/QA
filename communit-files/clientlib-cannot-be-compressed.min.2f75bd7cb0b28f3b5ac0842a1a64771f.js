;
var newFooter = (function ($) {
    var footer = {};

    footer.init = function () {
        $(document).ready(function () {
            var $headQuarterDropdown = $(".footer-body .contact-group__items--dropdown-styled-select");
            var $headQuarterDropdownOptions = $(".footer-body .contact-group__items--dropdown-styled-select li");

            var selectedOption = $headQuarterDropdown.find('.selected-option').text().trim();
            var $addressWrapper = $('.contact-group__items--dropdown .address-wrapper');
            $addressWrapper.find('.address').hide();
            $addressWrapper.find(".address[data-locationName='" + selectedOption + "']").show();
            $headQuarterDropdown.find('.dropdown').hide();

            $headQuarterDropdown.on('click', function (e) {
                $(this).find('.dropdown').toggle();
                if (!$(this).find('.dropdown').is(':visible')) {
                    $headQuarterDropdown.find('.dropdown-arrow').removeClass('rotate-up');
                    $headQuarterDropdown.removeClass('bottom-rounded-border');
                } else {
                    $headQuarterDropdown.addClass('bottom-rounded-border');
                    $headQuarterDropdown.find('.dropdown-arrow').addClass('rotate-up');
                }
            });

            $headQuarterDropdownOptions.on('click', function (e) {
                var selectedOption = $(this).attr('data-locationName');
                var $addressWrapper = $('.contact-group__items--dropdown .address-wrapper')
                $headQuarterDropdown.find('.selected-option').text(selectedOption);
                $addressWrapper.find('.address').hide();
                $addressWrapper.find(".address[data-locationName='" + selectedOption + "']").show();
            });

            let num = document.body.clientWidth;
            if (num > 500) {
                $(".socail-item").hover(function () {
                    $(this).find(".socail-qr-code").css("display", "block");
                }, function () {
                    $(this).find(".socail-qr-code").css("display", "none");
                });
            } else {
                $(".socail-item").click(function () {
                    var $this = $(this);
                    var qaCode = $this.find(".socail-qr-code");
                    if (qaCode.length > 0) {
                        var popUp = $(".add-pop-up-windows");
                        popUp.css("display", "flex");
                        popUp.find(".mobile-qr-img").css("background-image", qaCode.css("background-image"))
                    }
                });
                $(".add-pop-up-windows").click(function () {
                    $(".add-pop-up-windows").css("display", "none");
                });
            }

            $('body').on('click', function (e) {
                if ($headQuarterDropdown.has(e.target).length == 0) {
                    $headQuarterDropdown.find('.dropdown').hide();
                    $headQuarterDropdown.removeClass('bottom-rounded-border');
                    $headQuarterDropdown.find('.dropdown-arrow').removeClass('rotate-up');
                }
            });
            HiAnalyticsCn.clickDownLazy('.footer-navigation-body a',isCnAnalytics);
        });
    };

    return footer;
}($));
//contact-group__items--dropdown-styled-select
newFooter.init();

var footer = (function($) {
    var footer = {};

    footer.init = function() {
        $(document).ready(function() {
            var $headQuarterDropdown = $(".hiknow-footer .contact-group__items--dropdown-styled-select");
            var $headQuarterDropdownOptions = $(".hiknow-footer .contact-group__items--dropdown-styled-select li");
            var selectedOption = $headQuarterDropdown.find('.selected-option').text();
            var $addressWrapper = $('.contact-group__items--dropdown .address-wrapper');
             $addressWrapper.find('.address').hide();
            setTimeout(function(){
                $addressWrapper.find(".address[data-locationName='" + selectedOption + "']").show();
            }, 100)
            $headQuarterDropdown.find('.dropdown').hide();
            $headQuarterDropdown.on('click', function(e) {
                $(this).find('.dropdown').toggle();
                if (!$(this).find('.dropdown').is(':visible')) {
                    $headQuarterDropdown.find('.dropdown-arrow').removeClass('rotate-up');
                    $headQuarterDropdown.removeClass('bottom-rounded-border');
                } else {
                    $headQuarterDropdown.addClass('bottom-rounded-border');
                    $headQuarterDropdown.find('.dropdown-arrow').addClass('rotate-up');
                }
            });

            $headQuarterDropdownOptions.on('click', function(e) {
                var selectedOption = $(this).attr('data-locationName');
                var $addressWrapper = $('.contact-group__items--dropdown .address-wrapper')
                $headQuarterDropdown.find('.selected-option').text(selectedOption);
                $addressWrapper.find('.address').hide();
                $addressWrapper.find(".address[data-locationName='" + selectedOption + "']").show();
            });

            $('body').on('click', function(e) {
                if ($headQuarterDropdown.has(e.target).length == 0) {
                    $headQuarterDropdown.find('.dropdown').hide();
                    $headQuarterDropdown.removeClass('bottom-rounded-border');
                    $headQuarterDropdown.find('.dropdown-arrow').removeClass('rotate-up');
                }
            });

            $(".qrcode-out").hide();
            $(".wechat-in").hover(function() {
                $(".qrcode-out").show();
            }, function() {
                $(".qrcode-out").hide();
            });
        });
    };

    return footer;
}($));

footer.init();
var filterOptions = (function ($) {

    var debug_mode = false;
    var filterOptions = {};
    var currentCount = 10;
    // define modes
    var Modes = Object.freeze({ "default": 0, "product": 1, "subcategory": 2, "series": 3 });
    var filterModes = Modes.product;
    var i18n_compare_product = Granite.I18n.get("Compare");
    var i18n_details = Granite.I18n.get("Details");
    var hasUsedInitialURLFilterParams = false;
    filterOptions.init = function () {
        $(document).ready(function () {
            var search_list_selector = ".search-list";
            var $filter = $(search_list_selector);
            if (!$filter.length) {
                return;
            }
            var customProduct = $filter.find(".advanced-filter-wrapper").attr("data-custom");
            // ajax return filters
            var advancedFilters;
            // root level prop, ajax return orig products
            var _products_orig;
            // root level prop, render product to template
            var _products_filtered = [];
            // root level prop, keep track of all states of filter options
            var _filter_state = {};
            // set to category dropdown
            var categoryArray = [];
            // set to sub category dropdown
            var subcategoryArray = [];
            // set to sub category dropdown
            var subcategories = [];
            // set to series dropdown
            var series = [];
            // filterTemplate in filter state(filters.subItems.subItems)
            var filterTemplate = {};
            // product list template
            var tpl = $("#result-grid-product-template").html();
            var template = Handlebars.compile(tpl);
            $('.pagination-section').hide();
            $('.result-grid-layout4-wrapper .product-loading').show();

            // ajax url
            var url = $filter.find('.filter-container').data(url);
            if (url != null && url['url']) {
                var source = url['url'];
                $.ajax({
                    url: source + ".json",
                    dataType: 'json',
                    type: 'get',
                    contentType: 'application/json',
                    success: function (data) {
                        advancedFilters = data.filters;
                        // store original source, apply no filter at beginning
                        _products_filtered = _products_orig = data.products;
                        // Populate category dropdown
                        populateCategoryFilter(data.filters);

                        // render products
                        renderProducts(_products_filtered);
                        // render subseries
                        if (_filter_state && _filter_state.series && _filter_state.series.options) {
                            // hideSubseries(_products_filtered, _filter_state.series.options.Subseries);
                            hideOptions(_products_filtered, advancedFilters, _filter_state.series.options.Subseries);
                        }
                        initURLFilterParamToFilterPanel();

                        $('.result-grid-layout4-wrapper .product-loading').hide();
                        if(getCurrentBreakPoint() == 'DESKTOP') $('.pagination-section').css('display', 'flex');
                        
                        // ten by ten  mobile
                        viewMoreForMoblie();
                    },
                    error: function (error) {
                        console.log(error);
                    }
                });
            }

            // images lazyload
            var invokeLazyLoad = function () {
                $filter.find('.lazy').lazyload();
            };

            // step 1: populate filters
            var populateCategoryFilter = function (filters) {
                // pre-process to find filter mode (series mode, subcategory mode, product mode > default)
                var subItemSize = function (node) {
                    return node.filter(function (obj) {
                        return (obj.subItems != null);
                    }).length
                };
                var isDepth3Match = (filters[0] && filters[0].subItems[0] && filters[0].subItems[0].subItems) ? (subItemSize(filters[0].subItems[0].subItems) === 1) : false;
                var isDepth2Match = (filters[0] && filters[0].subItems) ? (subItemSize(filters[0].subItems) === 1) : false;
                var isDepth1Match = (filters.length === 1);

                //
                var getMode = function () {
                    if (isDepth3Match && isDepth2Match && isDepth1Match) return Modes.series;
                    if (!isDepth3Match && isDepth2Match && isDepth1Match) return Modes.subcategory;
                    if (!isDepth3Match && !isDepth2Match && isDepth1Match) return Modes.product;
                    return Modes.default;
                };
                filterModes = getMode();
                series = [];

                switch (filterModes) {
                    // populate series filters
                    case Modes.series:
                        var seriesObj = filters[0].subItems[0].subItems.filter(
                            function (obj, i) {
                                return obj['subItems'] != null
                            }
                        )[0];

                        // find filterTemplate in depth 3 for filter options except Subseries
                        filterTemplate = filters[0].subItems[0].subItems.filter(function (obj, i) {
                            return obj.title === 'filterTemplate'
                        })[0];

                        // set selector to disabled mode
                        disableCategorySelector("series", $categorySelector, seriesObj.title);
                        
                        series.push(seriesObj);
                        selectSeriesByIndex(0);
                    // populate subcategory filters
                    case Modes.subcategory:
                        subcategories = filters[0].subItems;
                        // set selector to disabled mode
                        disableCategorySelector("subcategory", $categorySelector, filters[0].subItems[0].title);
                        selectSubCategoryByIndex(0);
                    // populate product filters
                    case Modes.product:
                        // set selector to disabled mode
                        disableCategorySelector("category", $categorySelector, filters[0].title);
                        selectCategoryByIndex(0);
                        renderCategoryListDropdown(filters);
                        break;
                    // default mode : category mode
                    // populate category filters
                    default:
                        _filter_state = {};
                        renderCategoryListDropdown(filters);
                        disableCategorySelector("subcategory");
                        disableCategorySelector("series");
                        break;
                }
            };

            // model disable set disable, page load from detail product series
            var disableCategorySelector = function (type, categorySelector, label) {
                var selector = '[data-title-type="' + type + '"]';
                $(selector).hide();
                $('[data-title-type="Subseries"] .filter-card-header').removeClass('collapsed')
                $('[data-title-type="Subseries"] .collapse').collapse('show');
            };

            // render category dropdown list
            var renderCategoryListDropdown = function (filters) {
                $.each(filters, function (i, obj) {
                    var checkboxOptions = filters[i];

                    // set filter state
                    if (_filter_state['category'] !== undefined) {
                        _filter_state['category']['value'] = checkboxOptions.title;
                    }

                    $accordion.find(".card").each(function () {
                        if ($(this).is('[data-title-type]')) {
                            if ($(this).attr('data-title-type') == 'category') {
                                categoryArray.push(checkboxOptions.title);
                                var radio = '<li class="list-options">' +
                                                '<input title="'+ checkboxOptions.title +'" type="radio" name="category" id="category-'+i+'" value="'+ checkboxOptions.title +'" required="required">' +
                                                '<label for="category-'+ i +'">' +
                                                    '<h2 class="h2-seo">'+ checkboxOptions.title +'</h2>'+
                                                '</label>'+
                                            '</li>';
                                
                                $(this).find('.checkbox-left').append(radio);
                            }
                        }
                    });
                });
                // atModel.initAtAction();
            };

            var bindThreeRadioCheck = function (selector) {
                $(selector).on("change", function (e) {
                    var checked=false;
                    var $card = $(this).closest('.card');
                    $(this).closest('ul').find('input').each(function (i) {
                        if ($(this).parent().css("display") !== "none") {
                            if($(this).is(":checked")) {checked = true}
                        }
                    });

                    if (checked) {
                        $card.find(".triangle-indicator").addClass('active');
                    } else {
                        $card.find(".triangle-indicator").removeClass('active');
                    }
                });
            }

            // step 2: Populate products
            var renderProducts = function (data, search) {
                var itemsOnPageVal = parseInt($(search_list_selector).find('.pagination-section').attr('data-num'));
                // render product to template
                fetchResult(data, itemsOnPageVal, 0);
                $('.advanced-filter-submit .sum-number-of-products').html('(' + data.length + ')')
                if(!$.isEmptyObject(_filter_state) || search) {
                    $('.result-grid-layout4-wrapper .sum-of-products').addClass('active');
                    $('.result-grid-layout4-wrapper .sum-number-of-products').html(data.length);
                }
                if(!$.isEmptyObject(_filter_state)) {
                    $('.advanced-filter-search-wrapper-mobile').addClass('active');
                } 
                
                if(data.length > 0){
                    if(getCurrentBreakPoint() == 'DESKTOP') $('.pagination-section').css('display', 'flex');
                    $('.product-blank-page').removeClass('active');
                } else {
                    $('.pagination-section').hide();
                    $('.product-blank-page').addClass('active');
                }
                
                // create pagination
                createPagination(data);
                // filter dropdown options
                setupSelectedOptionTextboxFilters();
                // populate product compare check state
                productComparisonBottom.getCompareArray().forEach(function (value, index) {
                    $('input[data-product-url="' + value.productUrl + '"]').attr('checked', true);
                });
            };

            // products filter result insert into template
            var fetchResult = function (products, limit, offset) {
                var matchedProducts = [];
                var end = offset + limit < products.length ? offset + limit : products.length;
                for (var i = offset; i < end; i++) {
                    products[i].details = i18n_details;
                    products[i].compareProduct = i18n_compare_product;
                    matchedProducts.push(products[i]);
                }
                // 设置更小的图片
                $.each(matchedProducts, function (i, item) {
                    if (item.image) {
                        if (getCurrentBreakPoint() != "MOBILE") {
                            item.image1 = item.image
                        } else {
                            item.image1 = !isCN ? item.image.replace("thumb.319.319", "thumb.140.100") : item.image
                        }
                    }
                })
                currentCount = 10;
                matchedProducts.length < 10 ? $('.search-list .product-view-more').removeClass('active') :  $('.search-list .product-view-more').addClass('active');
                var items = getCurrentBreakPoint() != "MOBILE" ? matchedProducts : matchedProducts.slice(0, 10);
                $('#layout4-pagination').empty().html(template(items));
                invokeLazyLoad();

                // bug#2608
                for (var i = 0; i < compareTriggers.length; i++) {
                    productComparisonBottom.init(compareTriggers[i]);
                }

                // for at
                atModel.initAtNavigation(true, ".search-list #layout4-pagination .layout4-content-wrapper a.at-lazy");
            };

            
            var viewMoreForMoblie = function() {
                $('.search-list .product-view-more').on('click', function(e){
                    var range = currentCount + 10;
                    var items = [];
                    if(range >= _products_filtered.length) {
                        range = _products_filtered.length;
                        $(this).removeClass('active');
                    }
                    for(var i = 0; i < range; i++) {
                        var obj =_.cloneDeep(_products_filtered[i]);
                        obj.details = i18n_details;
                        obj.compareProduct = i18n_compare_product;
                        items.push(obj);
                    }
                    $.each(items, function (i, item) {
                        if (item.image) {
                            if (getCurrentBreakPoint() != "MOBILE") {
                                item.image1 = item.image
                            } else {
                                item.image1 = !isCN ? item.image.replace("thumb.319.319", "thumb.140.100") : item.image
                            }
                        }
                    })
                    currentCount += 10;
                    $('#layout4-pagination').html(template(items));
                    invokeLazyLoad();

                    // bug#2608
                    for (var i = 0; i < compareTriggers.length; i++) {
                        productComparisonBottom.init(compareTriggers[i]);
                    }

                    // for at
                    atModel.initAtNavigation(true, ".search-list #layout4-pagination .layout4-content-wrapper a.at-lazy");
                })
            }
        
            // create pagination
            var createPagination = function (products) {
                var itemsOnPageVal = parseInt($(search_list_selector).find('.pagination-section').attr('data-num'));
                if(getCurrentBreakPoint() == 'DESKTOP') {
                    $("#layout-pagination-wrapper").pagination({
                        items: products.length,
                        itemsOnPage: itemsOnPageVal,
                        cssStyle: "light-theme",
                        currentPage: 1,
                        edges: 1,
                        useAnchors: false,
                        prevText: '<',
                        nextText: '>',
                        onPageClick: function (currentPageNumber, e) {
                            atModel.doAtEvent('product_series_list::pagination::' + currentPageNumber + "::" + window.location.href, 'action', e)
                            fetchResult(products, itemsOnPageVal, (itemsOnPageVal * (currentPageNumber - 1)));
                        
                            stickyList['sticky']();
                        }
                    });
                }
            };
            $(search_list_selector).find('.item-num-for-page select.number-select').selectpicker({});

            $(search_list_selector).find('.item-num-for-page select.number-select').on('loaded.bs.select', function () {
                $(this).parent().find('button').attr('title', '');
            });

            $(search_list_selector).find('.item-num-for-page select.number-select').on('changed.bs.select', function (e) {
                var numberVal = $(this).val();
                $(this).parent().find('button').attr('title', '');
                $(search_list_selector).find('.pagination-section').attr('data-num', numberVal);
                renderProducts(_products_filtered);
                atModel.doAtEvent('product_series_list::pagination_selector::' + $(this).val() + '/page::' + window.location.href, 'action', e)
            });

            // Textbox to filter dropdown options
            var setupSelectedOptionTextboxFilters = function () {
                $('.selected-option-wrapper').find(".selected-option").off("keyup");
                $('.selected-option-wrapper').find(".selected-option").on("keyup", function () {
                    if ($(this).prop("readonly")) return; // avoid readonly field to do filter
                    var value = $(this).val().toLowerCase();
                    $(this).closest('.category-dropdown-wrapper').find('.category-dropdown').find("*").filter(function () {
                        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
                    });
                });
            };

            // end option collapse events

            var ignorantList = $("#ignorant-product-filters").attr("value");
            // filter wrapper
            var $accordion = $("#advanced-filter-accordion");
            // category input
            var $categorySelected = $('.category-selected-option');
            // sub category input
            var $subcategorySelected = $('.subcategory-selected-option');
            // series input
            var $seriesSelected = $('.series-selected-option');
            // todo unuse
            var $selectedCategory = [];
            // all products in list
            var $resultgridItems = $(".result-grid-layout4-wrapper .layout4-content-wrapper");
            // filter product result, try to set hide-result
            var filterResult = function () {
                $resultgridItems.each(function () {
                    var resultItemCategory = $(this).attr("data-category");
                    if (resultItemCategory !== "All Products" && $selectedCategory.length) {
                        if ($selectedCategory.indexOf(resultItemCategory) > -1) {
                            $(this).removeClass('hide-result');
                        } else {
                            $(this).removeClass('hide-result');
                            $(this).addClass('hide-result');
                        }
                    } else {
                        $(this).removeClass('hide-result');
                    }
                })
            };
            // todo unuse
            $($accordion).on('click', '.category-checkbox', function () {
                if ($(this).is(':checked')) {
                    if ($(this).attr("data-category") !== "All Products") {
                        $selectedCategory.push($(this).attr("data-category"));
                        filterResult();
                    } else {
                        $resultgridItems.each(function () {
                            $(this).removeClass('hide-result');
                        })
                    }
                } else {
                    if ($(this).attr("data-category") == "All Products") {
                        filterResult();
                    }
                    if ($selectedCategory.indexOf($(this).attr("data-category")) > -1) {
                        $selectedCategory.splice($selectedCategory.indexOf($(this).attr("data-category")), 1);
                        filterResult();
                    }
                }

            });

            function bindClickRecount() {
                $('.search-list .advanced-filter-inner .filter-container .filter-card .collapse').on('shown.bs.collapse', function () {
                    stickyList['test']();
                });
            }
            bindClickRecount();

            var $productDropdownElement = $('<div class="category-dropdown-wrapper"></div>');
            var $selectedOptionWrapperElement = $('<div class="selected-option-wrapper"></div>');
            var $categoryDropdownListElement = $('<ul class="category-dropdown"></ul>');
            var $selectedOptionElement = $('<input type="text" class="selected-option"></input>');
            var $arrowIconElement = $('<div class="arrow-icon"></div>');

            $selectedOptionElement.appendTo($selectedOptionWrapperElement);
            $arrowIconElement.appendTo($selectedOptionWrapperElement);

            // select category item, populate sub category dropdown
            // category option click
            $('.category-list-dropdown').on('click', '.list-options', function (e) {
                e.stopPropagation();
                var clickedIndex = categoryArray.indexOf($(this).text());
                var id = $(this).find('input').attr('id');

                $('.subcategory-list-dropdown').empty();
                $('[data-title-type="subcategory"] .triangle-indicator').removeClass('active');
                $('.series-list-dropdown').empty();
                $('[data-title-type="series"] .triangle-indicator').removeClass('active');
                $('.seriesFilterCont').remove();
                $subcategorySelected.val('');
                $seriesSelected.val('');
                selectCategoryByIndex(clickedIndex, this);
                
                var $subCategory = $("div.advanced-filter-inner .filter-container .filter-card[data-title-type='subcategory'] .card-body ul li");
                if($subCategory.length != 1) {$('[data-title-type="subcategory"]').show();}
                $('[data-title-type="series"]').hide();

                // change collapse icon state
                bindThreeRadioCheck('#' + id);
                // Apply product filter once category selected
                _filter_state['series'] = { "value": "", "options": {} };

                applyFilter(_products_orig, _filter_state, e, categoryArray[clickedIndex], 'Category');
            });

            // select category item, populate sub category dropdown
            var selectCategoryByIndex = function (index, that) {
                subcategoryArray = [];
                subcategories = advancedFilters[index].subItems;

                // set filter state
                _filter_state['category'] = { "index": index, "value": categoryArray[index] };
                _filter_state['subcategory'] = { "index": index, "value": "" };

                if (subcategories) {
                    $.each(subcategories, function (index, value) {
                        $accordion.find(".card").each(function () {
                            if ($(this).is('[data-title-type]')) {
                                if ($(this).attr('data-title-type') == 'subcategory') {
                                    subcategoryArray.push(value.title);
                                    var radio = '<li class="list-options">' +
                                                    '<input title="'+ value.title +'" type="radio" name="subcategory" id="subcategory-'+ index +'" value="'+ value.title +'" required="required">' +
                                                    '<label for="subcategory-'+ index +'">' +
                                                        '<h2 class="h2-seo">'+ value.title +'</h2>'+
                                                    '</label>'+
                                                '</li>';
                                    
                                    $(this).find('.subcategory-list-dropdown').append(radio);
                                }
                            }
                        });
                    });

                    if (that) {
                        $(that).closest('.category-dropdown').toggleClass('show remove-border');
                        $(that).closest($categorySelector).toggleClass('remove-border');
                        $(that).closest($categorySelector).find('.arrow-icon').toggleClass('arrow-up');
                    }
                }

            };

            // select sub category item, Populate Series dropdown
            // subcategory option click
            $('.subcategory-list-dropdown').on('click', '.list-options', function (e) {
                e.stopPropagation();
                var id = $(this).find('input').attr('id');
                
                bindThreeRadioCheck('#' + id);
                $('.series-list-dropdown').empty();
                $('[data-title-type="series"] .triangle-indicator').removeClass('active');
                $('.seriesFilterCont').remove();
                $seriesSelected.val('');
                var clickedSubcategoryIndex = subcategoryArray.indexOf($(this).text());
                selectSubCategoryByIndex(clickedSubcategoryIndex, this);
                var $series = $("div.advanced-filter-inner .filter-container .filter-card[data-title-type='series'] .card-body ul li");
                if($series.length != 1) {
                    $('[data-title-type="series"]').show();
                }

                // Show filter options
                var data = {
                    filterItems: filterTemplate && filterTemplate.filterItems ? filterTemplate.filterItems : []
                };
                seriesFilterOption(data);
                _filter_state['series'] = { "value": "", "options": {} };
                // Apply product filter once subcategory selected
                applyFilter(_products_orig, _filter_state, e, subcategories[clickedSubcategoryIndex].title, 'Subcategory');
            });

            // select sub category item, Populate Series dropdown
            var selectSubCategoryByIndex = function (index, that) {
                var subcategories1 = subcategories[index].subItems;
                series = [];

                // set filter state
                _filter_state['subcategory'] = { "index": index, "value": subcategories[index].title };

                if (subcategories1) {
                    $.each(subcategories1, function (index, value) {
                        if (value.title == "filterTemplate") {
                            filterTemplate = value;
                        } else {
                            $accordion.find(".card").each(function () {
                                if ($(this).is('[data-title-type]')) {
                                    if ($(this).attr('data-title-type') == 'series') {
                                        series.push(value);
                                        var radio = '<li class="list-options" style="' + (value.hideDropdown ? 'display: none;' : '') +'">' +
                                                        '<input title="'+ value.title +'" type="radio" name="series" id="series-'+ index +'" value="'+ value.title +'" required="required">' +
                                                        '<label for="series-'+ index +'">' +
                                                            '<h2 class="h2-seo">'+ value.title +'</h2>'+
                                                        '</label>'+
                                                    '</li>';
                                        $(this).find('.series-list-dropdown').append(radio);
                                    }
                                }
                            });
                        }
                    });

                    if (that) {
                        $(that).closest('.category-dropdown').toggleClass('show remove-border');
                        $(that).closest($categorySelector).toggleClass('remove-border');
                        $(that).closest($categorySelector).find('.arrow-icon').toggleClass('arrow-up');
                    }


                }
            };

            // select series item, Populate Series Filter dropdown
            // series option click
            $('.series-list-dropdown').on('click', '.list-options', function (e) {
                e.stopPropagation();
                $('.seriesFilterCont').remove();
                var selected = $(this).text();
                var selectedIndex = series.findIndex(function (obj) {
                    return obj.title === selected;
                });
                var id = $(this).find('input').attr('id');
                
                bindThreeRadioCheck('#' + id);
                selectSeriesByIndex(selectedIndex, this, e);

                // render subseries
                if (_filter_state && _filter_state.series && _filter_state.series.options) {
                    hideOptions(_products_filtered, advancedFilters, _filter_state.series.options.Subseries);
                }

            });

            // select series item, Populate Series Filter dropdown
            var selectSeriesByIndex = function (index, that, e) {
                if (that) {
                    $(that).closest('.category-dropdown').toggleClass('show remove-border');
                    $(that).closest($categorySelector).toggleClass('remove-border');
                    $(that).closest($categorySelector).find('.arrow-icon').toggleClass('arrow-up');
                    $('.seriesFilterCont').remove();
                }

                // add offer to the beginning of the filter array
                var filterArray = [];

                // find filter item
                $.each(series, function (i, obj) {
                    if (obj.title == series[index].title) {
                        obj.subItems && obj.subItems.length && obj.subItems[0].filterItems && obj.subItems[0].filterItems.length && filterArray.push(obj.subItems[0].filterItems[0]);
                    }
                });

                if (filterArray && filterArray.length > 0) {
                    if (filterTemplate) {
                        filterArray = filterArray.concat(filterTemplate.filterItems)
                    }

                    var data = {
                        filterItems: filterArray
                    };

                    // set filter state
                    _filter_state['series'] = { "value": series[index].title, "options": {} };

                    seriesFilterOption(data);

                    // apply filter
                    applyFilter(_products_orig, _filter_state, e, series[index].title, 'Series');

                }
                setupSelectedOptionTextboxFilters();
            };

            // select options item, Setting input box value on dropdown option selection
            // options click event
            $('.category-dropdown').on('click', '.list-options', function () {
                $(this).closest('.category-dropdown-wrapper').find(".selected-option").val($(this).text());
            });

            var $categorySelector = $('.category-dropdown-wrapper');
            var $categoryDropdown = $categorySelector.find('.category-dropdown');
            var $categorySelectedOption = $categorySelector.find('.selected-option-wrapper .selected-option');

            // dropdown show pop, hide other pop
            $categorySelector.on('click', function (e) {
                e.stopPropagation();
                $(this).find('.category-dropdown').toggleClass('show remove-border');
                $(this).closest($categorySelector).toggleClass('remove-border');
                $(this).closest($categorySelector).find('.arrow-icon').toggleClass('arrow-up');
                // hideDropDownOthers(e.currentTarget, $('.category-dropdown-wrapper.remove-border'), $categorySelector);
            });

            $('body').on('click', search_list_selector + ' .cat-drop-wrap', function (e) {
                e.stopPropagation();
                $(this).find('.category-dropdown').toggleClass('show remove-border');
                $(this).closest('.cat-drop-wrap').toggleClass('remove-border');
                $(this).closest('.cat-drop-wrap').find('.arrow-icon').toggleClass('arrow-up');
                // hideDropDownOthers(e.currentTarget, $($filter).find('.cat-drop-wrap.remove-border'), '.cat-drop-wrap');

            });

            $('body').on('click', search_list_selector + '.series-list input', function (e) {
                e.stopPropagation();
            });

            $('body').on('click', search_list_selector + ' .series-list', function (e) {
                e.stopPropagation();
                $(this).closest('.category-dropdown').toggleClass('show remove-border');
                $(this).closest('.cat-drop-wrap').toggleClass('remove-border');
                $(this).closest('.cat-drop-wrap').find('.arrow-icon').toggleClass('arrow-up');
                var clickedSeriesFilterKey = $(this).text();
                $(this).parent().siblings().find('.selected-option').val(clickedSeriesFilterKey);
            });

            // binding reset filter event
            // reset click event
            $('body').on('click', search_list_selector + ' .advanced-filter-reset', function (e) {
                $('.filter-card[data-title-type=category] input').val('');
                $('.filter-card[data-title-type=subcategory] input').val('');
                $('.filter-card[data-title-type=series] input').val('');
                $('.filter-card[data-title-type=category] .filter-card-header').removeClass('collapsed');
                $('.filter-card[data-title-type=category] .collapse').addClass('show');
                $('.search-list .product-search-container .product-search').val('');
                $('.search-list .product-search-container').attr('data-searchval', '');
                $('.result-grid-layout4-wrapper .sum-of-products').removeClass('active');
                $('.triangle-indicator').removeClass('active');
                $('.advanced-filter-search-wrapper-mobile').removeClass('active');

                currentCount = 10;
                _products_filtered = _products_orig;
                $('.category-list-dropdown').empty();
                $('.subcategory-list-dropdown').empty();
                $('.series-list-dropdown').empty();
                $('.seriesFilterCont').remove();

                populateCategoryFilter(advancedFilters);
                renderProducts(_products_orig);


                var $series = $("div.advanced-filter-inner .filter-container .filter-card[data-title-type='series'] .card-body ul li");
                var $subseriesHeader = $("div.advanced-filter-inner .filter-container .filter-card[data-title-type='Subseries'] .card-header");
                if ($series.length == 1) {$subseriesHeader.addClass('subseries')};
                
                // render subseries
                if (_filter_state && _filter_state.series && _filter_state.series.options) {
                    hideOptions(_products_filtered, advancedFilters, _filter_state.series.options.Subseries);
                }
                syncFilterConditionToURL();

                stickyList['sticky']();
            });
            $('body').on('click', search_list_selector + ' .advanced-filter-submit', function (e) {
                $('.search-list .close-aem_modal').click();
            });
            var bindTooltipEvent = function ($target, tipText) {
                $target.mouseover(function (e) {
                    if (!$(this).find('.tipText').length) {
                        $(this).append('<div class="tip-text">' + tipText + '</div>');

                        if ($(this).find(".tip-text").width() > 251 && $(window).width() > 450) {
                            $(this).find(".tip-text").css({ "min-width": "251px", "white-space": "normal" });
                        } else if ($(this).find(".tip-text").width() > 111 && $(window).width() <= 450) {
                            $(this).find(".tip-text").css({ "min-width": "111px", "white-space": "normal" });
                        }
                    }
                });

                $target.mouseout(function (e) {
                    $(this).find('.tip-text').remove();
                });
            }

            // *important Populate Series Filter Section selected-option
            var seriesFilterOption = function (data) {
                var seriesFilterData = data.filterItems;
                $.each(seriesFilterData, function (i, obj) {
                    if (!obj || typeof obj === "undefined" || obj === "undefined") {
                        return;
                    }

                    if (obj['title'] === 'Subseries') {
                        obj.dataType = 'combobox'
                    }
                    
                    var $series = $("div.advanced-filter-inner .filter-container .filter-card[data-title-type='series'] .card-body ul li");
                    var $subseriesHeader = $("div.advanced-filter-inner .filter-container .filter-card[data-title-type='Subseries'] .card-header");
                    if ($series.length == 1) {$subseriesHeader.addClass('subseries')};
                    var showCollapes = $series.length == 1 && obj['title'] === 'Subseries' ? 'show' : '';
                    var collapsed = $series.length == 1 && obj['title'] === 'Subseries' ? '' : 'collapsed';
                    $accordion.append('<div class="card filter-card seriesFilterCont" id="seriesFilterCont' + i + '" data-title-type="' + obj['title'] + '">' +
                        ' <div class="'+ collapsed +' card-header filter-card-header" data-toggle="collapse" data-target="#seriesFilter' + i + '" aria-controls="seriesFilter' + i + '">' +
                        '   <span class="card-link">' +
                        Granite.I18n.get(data.filterItems[i].title) +
                        '     <span class="triangle-indicator"></span>' +
                        '   </span>' +
                        ' </div>' +
                        ' <div class="collapse '+ showCollapes +'" id= "seriesFilter' + i + '">' +
                        '   <div class="card-body filter-body">' +
                        '     <div class="checkbox-wrapper">' +
                        '       <div class="checkbox-options">' +
                        '         <ul class="checkbox-left"></ul>' +
                        '       </div>' +
                        '     </div>' +
                        '   </div>' +
                        ' </div>' +
                        '</div>');

                    if (data.filterItems[i].dataType == 'combobox') {
                        $.each(data.filterItems[i].options, function (j) {
                            var filterTitle = data.filterItems[i].options[j].title;
                            var unencodeTitle = filterTitle;
                            if (unencodeTitle) {
                                unencodeTitle = unencodeTitle.replaceAll("&", "-");
                            }
                            var filterValue = encodeURI(unencodeTitle);
                            var hasTooltip = data.filterItems[i].options[j].hasTooltip;

                            $accordion.find("#seriesFilter" + i).find('ul').append('<li><input title="' + Granite.I18n.get(filterTitle) + '" type="checkbox" name="enquiryType" id="filterOption-' + i + '-' + j +
                                '" value="' + filterValue + '" required="required" /><label for="filterOption-' + i + '-' + j + '"><h2 class="h2-seo">' + Granite.I18n.get(filterTitle) +
                                '</h2></label></li>');

                            if (hasTooltip) {
                                var tipText = Granite.I18n.get(data.filterItems[i].options[j].tipText);
                                $accordion.find("#seriesFilter" + i + " ul li:last-child").append('<div class="filter-tip" style="background-image:url(../%E8%81%94%E7%B3%BB%E6%88%91%E4%BB%AC%20-%20%E5%85%B3%E4%BA%8E%E6%88%91%E4%BB%AC%20-%20%E6%B5%B7%E5%BA%B7%E5%A8%81%E8%A7%86%20Hikvision_files//%27/etc/clientlibs/it/resources/icons/icon-tooltip.png/%27)">t</div>');
                                bindTooltipEvent($accordion.find("#seriesFilter" + i + " ul li:last-child .filter-tip"), tipText);
                            }
                            // set filter state
                            bindSeriesComboboxWithFilter('#filterOption-' + i + '-' + j, obj['title'], filterTitle);
                        });
                        $accordion.find("#seriesFilter" + i).find('ul').addClass('input-type-checkbox');
                    } else {
                        // options.length <= 20, type radio
                        $.each(data.filterItems[i].options, function (j) {
                            var filterTitle = data.filterItems[i].options[j].title;
                            var filterValue = encodeURI(data.filterItems[i].options[j].title.replaceAll("&", "-"));

                            $accordion.find("#seriesFilter" + i).find('ul').append('<li><input title="' + Granite.I18n.get(filterTitle) + '" type="radio" name="enquiryType' + i + '" id="filterOption-' + i + '-' + j +
                                '" value="' + filterValue + '" required="required" /><label for="filterOption-' + i + '-' + j + '">' + Granite.I18n.get(filterTitle) +
                                '</label></li>');

                            // listen and update filter state

                            $('#filterOption-' + i + '-' + j).on("change", function (e) {
                                _filter_state['series']['options'][obj['title']] = filterValue;
                                applyFilter(_products_orig, _filter_state, e, filterTitle, obj['title']);
                            });

                            bindThreeRadioCheck('#filterOption-' + i + '-' + j);
                        });
                    }
                });

                bindClickRecount();

                // todo:unuse series change event
                $(document).on("change", ".series-list input", function () {
                    var id = this.id;
                    var IsChecked = $('#' + id).is(":checked");
                    var containerId = id.split('-')[1];
                    var optionId = id.split('-')[2];
                    var value = this.value;
                    var optionKey = $(this).data('option-type');
                    if (IsChecked) {
                        $('#tagContainer-' + containerId).append('<button data-value ="' + value + '" data-option-type="' + optionKey + '" class="btn-products btn">' + value
                            + '<img class="close-btn close-btn-filter" src="/etc/clientlibs/it/resources/icons/baseline-close-24px.svg" alt="Close" id="closeFilter-'
                            + containerId + '-' + optionId + '"></button>');
                    } else {
                        $('#tagContainer-' + containerId).find(".btn[data-value='" + value + "']").remove();
                    }
                });
                // todo:unuse
                $(document).on('click', '.close-btn-filter', function (e) {
                    var containerId = this.id.split('-')[1];
                    var buttonValue = this.parentElement.attributes['data-value'].value;
                    var optionKey = this.parentElement.attributes['data-option-type'].value;
                    $('#tagContainer-' + containerId).find(".btn[data-value='" + buttonValue + "']").remove();
                    $('.series-list input[value="' + buttonValue + '"]').prop('checked', false);

                    _filter_state['series']['options'][optionKey] =
                        (_filter_state['series']['options'][optionKey]).filter(function (elm) {
                            return !(elm === buttonValue);
                        });
                    applyFilter(_products_orig, _filter_state, e, buttonValue, 'Parameters');
                });


            };
            // end of seriesFilterOption

            $('body').on('click', search_list_selector + ' .product-search-container .product-search-btn', function () {
                var searchValue = $(this).parent().find('.product-search').val();
                searchValue = searchValue.trim().toLowerCase();
                $(this).closest(search_list_selector).find('.product-search-container').attr('data-searchval', searchValue);
                $(this).closest(search_list_selector).find('.product-search').val(searchValue);
                applyFilter(_products_orig, _filter_state);
            });
            $('body').on('focus', search_list_selector + ' .product-search', function (e) {
                $(this).closest('.product-search-container').addClass('input-focus');
            });
            $('body').on('blur', search_list_selector + ' .product-search', function (e) {
                $(this).closest('.product-search-container').removeClass('input-focus');
            });

            $('body').on('input propertychange', search_list_selector + ' .product-search', function (e) {
                var atValue = "product_selector::search::" + $(this).parent().find('.product-search').val();
                $(this).closest('.search-list-comp').find('.product-search-container .product-search-btn').attr('data-at-module', atValue);
            });

            $('body').on('keydown', search_list_selector + ' .product-search', function (e) {
                if (e.keyCode == 13) {
                    $(this).parent().find('.product-search-btn').click();
                }
            });

            // *important series ui helpers
            // series click event
            // todo filterOptionValue not encode
            var bindSeriesComboboxWithFilter = function (selector, filterOptionKey, filterOptionValue, isAll) {
                // init prop
                if (_filter_state['series']['options'][filterOptionKey] === undefined) {
                    _filter_state['series']['options'][filterOptionKey] = [];
                }

                // listen and update filter state, options select
                $(selector).on("change", function (e) {
                    var $card = $(this).closest('.card');
                    var checked=false;
                    $(this).closest('ul').find('input').each(function (i) {
                        if ($(this).parent().css("display") !== "none") {
                            if($(this).is(":checked")) {checked = true}
                        }
                    });

                    if (checked) {
                        $card.find(".triangle-indicator").addClass('active');
                    } else {
                        $card.find(".triangle-indicator").removeClass('active');
                    }
                    var isAdd = $(e.target).prop("checked");

                    setOptionValue(filterOptionKey, filterOptionValue, isAdd);

                    applyFilter(_products_orig, _filter_state, e, filterOptionValue, filterOptionKey);
                });
            };
            // *important binding option value change, add filter option into _filter_state for render product list
            var setOptionValue = function (key, value, add) {
                // event from subseries and have not filter options
                var data = {};
                if (filterTemplate) {
                    data = {
                        filterItems: filterTemplate.filterItems
                    };
                }
                // check a option, add to filter state
                if (add) {
                    if (!_filter_state['series']['options'][key]) {
                        _filter_state['series']['options'][key] = [];
                    }
                    if (!(_filter_state['series']['options'][key]).includes(value)) {
                        (_filter_state['series']['options'][key]).push(value);
                    }
                } else {
                    // uncheck a option, remove to filter state
                    // if not this selection filter, first set all options to this selection
                    if (!_filter_state['series']['options'][key]) {
                        var dataOptionsItem = data.filterItems.filter(function (elm) {
                            return !(elm.title === key);
                        });
                        _filter_state['series']['options'][key] = dataOptionsItem.options;
                    }
                    _filter_state['series']['options'][key] =
                        _filter_state['series']['options'][key] ?
                            (_filter_state['series']['options'][key]).filter(function (elm) {
                                return !(elm === value);
                            }) : [];
                }
            };


            // do at event
            var doAtEvent = function (event, title, ationType, optionType) {

                // at action event
                // var category = $('.category-dropdown-wrapper .category-selected-option').val();
                // var subcategory = $('.category-dropdown-wrapper .subcategory-selected-option').val();
                // var series = $('.category-dropdown-wrapper .series-selected-option').val();

                var atTitle = '';
                if (optionType === 'Category') {
                    atTitle = 'product selector::select category' + atModel.atSpliter + title;
                } else if (optionType === 'Subcategory') {
                    atTitle = 'product selector::select sub category' + atModel.atSpliter + title;
                } else if (optionType === 'Series') {
                    atTitle = 'product selector::select series' + atModel.atSpliter + title;
                } else if (optionType === 'Subseries') {
                    atTitle = 'product selector::subsereis' + atModel.atSpliter + title;
                } else {
                    atTitle = 'product selector' + atModel.atSpliter + optionType + atModel.atSpliter + title;
                }
                if (atTitle.length === 0) {
                    atTitle = 'product selector' + atModel.atSpliter + optionType + atModel.atSpliter + title;
                }
                var url = window.location.href;
                url = url.replaceAll("%20", "_");
                atModel.doAtEvent(atTitle + atModel.atSpliter + url, ationType, event);
            };

            var isSearchedProduct = function (product, searchValue) {
                var productTitle = 'title' in product ? product['title'].toLowerCase().trim() : '';
                var productDescription = 'description' in product ? product['description'].toLowerCase().trim() : '';
                if (productTitle.indexOf(searchValue) < 0 && productDescription.indexOf(searchValue) < 0) {
                    return false;
                }
                return true;
            };

            // ------------------------------------------------------------------
            // *important product filters
            // ------------------------------------------------------------------
            var applyFilter = function (products, filter, event, title, optionType) {
                var $searchContainer = $('.search-list .product-search-container');
                var searchValue = $searchContainer.length > 0 ? $searchContainer.attr('data-searchval') : '';

                if(!searchValue) $('.result-grid-layout4-wrapper .sum-of-products').removeClass('active');
                _products_filtered = products.filter(function (product) {
                    if (!isSearchedProduct(product, searchValue)) {
                        return false;
                    }

                    // check level root
                    var unmatchedProduct = Object.keys(product).filter(function (key) {
                        if ((filter[key] !== undefined)) {
                            if (filter[key]['value'] === "") return false;
                            if (product[key] !== filter[key]['value']) return true;
                        }
                        return false;
                    });


                    if (unmatchedProduct.length > 0) return false;

                    // match parameters
                    if (product['selectParameters'] !== undefined && product['selectParameters'] !== null) {
                        if (filter['series'] === undefined || filter['series']['options'] === undefined) {
                            return true;
                        }

                        var options = filter['series']['options'];
                        var params = product['selectParameters'];

                        var matched = true;

                        for (var optKey in options) {
                            // if no option, skip 
                            if (optKey === undefined)
                                continue;

                            // each selected option values 
                            var optVal = options[optKey];

                            // product param val
                            var paramVal = params[optKey];

                            // if product has no this filter -- not matched 
                            if (paramVal === undefined) {
                                // solve some glitchies related to bad data 
                                if (isArray(optVal) && optVal.length === 0) {
                                    continue;
                                }

                                matched = false;
                                break;
                            }

                            // if selected is radio btn 
                            if (!isArray(optVal)) {
                                if (optVal !== encodeURI(paramVal)) {
                                    matched = false;
                                    break;
                                }
                            } else {
                                // selected filter is combo box 

                                // if nothing selected
                                if (optVal.length === 0)
                                    continue;

                                // if some val is in product params
                                var hasValueInProd = optVal.some(function (val) {
                                    return paramVal.includes(val);
                                })

                                if (!hasValueInProd) {
                                    matched = false;
                                    break;
                                }
                            }
                        }


                        return matched;

                    } else {
                        // parameter is null , Show it per requirements..
                        return false;
                    }
                });
                // end filter
                renderProducts(_products_filtered, searchValue);

                if (typeof event !== "undefined" && event.originalEvent) {
                    doAtEvent(event, title ? title : $(event.currentTarget).text(), 'action', optionType);
                }
                var tagetID = (event && event.currentTarget && $(event.currentTarget).attr('id')) || '';
                var isDep4AboveEle = tagetID.startsWith('filterOption-') && tagetID.split('-')[1] >= 1;
                if (hasUsedInitialURLFilterParams && !isDep4AboveEle) {
                    syncFilterConditionToURL();
                }

                stickyList['sticky']()
            };

            var setUrlParam = function (name, val) {
                var url = new URL(location.href);
                val && url.searchParams.set(name, val);
                !val && url.searchParams.delete(name);
                history.replaceState(null, null, url.toString());
            }

            var getUrlParam = function (name) {
                var url = new URL(location.href);
                return url.searchParams.get(name);
            }
            // url 更新变化
            var syncFilterConditionToURL = function () {
                setTimeout(function () {
                    var category = $('div.advanced-filter-inner .category-list-dropdown input[type="radio"]:checked').val();
                    var subCategory = $('div.advanced-filter-inner .subcategory-list-dropdown input[type="radio"]:checked').val() || '';
                    var series = $('div.advanced-filter-inner .series-list-dropdown input[type="radio"]:checked').val() || '';
                    var checkedSubSeries = !series ? null : ($('div[data-title-type="Subseries"]').find('.filter-body ul li input:checked').filter(function () {
                        return $(this).parent().css("display") != 'none'
                    }).toArray().map(function (it) {
                        return $(it).val()
                    }).filter(function (it) {
                        return it.toLowerCase() != 'all'
                    }).join(';') || 'NONE');

                    setUrlParam('category', category);
                    setUrlParam('subCategory', subCategory.replaceAll("&", "-"));
                    setUrlParam('series', series.replaceAll("&", "-"));
                    setUrlParam('checkedSubSeries', decodeURI(checkedSubSeries));
                }, 300);
            }

            var initURLFilterParamToFilterPanel = function () {
                setTimeout(function () {
                    var $category = $("div.advanced-filter-inner .filter-container .filter-card[data-title-type='category'] .card-body ul li");
                    var $subCategory = $("div.advanced-filter-inner .filter-container .filter-card[data-title-type='subcategory'] .card-body ul li");
                    var $series = $("div.advanced-filter-inner .filter-container .filter-card[data-title-type='series'] .card-body ul li");

                    var category = $category.length == 1 ? $($category[0]).find('input').val() : getUrlParam('category');
                    var subCategory = $subCategory.length == 1 ? $($subCategory[0]).find('input').val() : getUrlParam('subCategory');
                    var series = $series.length == 1 ? $($series[0]).find('input').val() : getUrlParam('series');

                    var checkedSubSeriesStr = getUrlParam('checkedSubSeries');
                    var checkedSubSeries = (checkedSubSeriesStr || '').split(';');
                    hasUsedInitialURLFilterParams = true;

                    var categoryEle;
                    if (!category || !(categoryEle = $("ul.category-list-dropdown li input").filter(function (index, it) {
                        return $(it).val() == category
                    }).first()).length) {
                        return;
                    }
                    categoryEle.click().click();

                    /**
                     * subCategory  获取到的subCategory可能含有'&' 做两种匹配
                     */
                    var subCategoryEle;
                    if (!subCategory || !(subCategoryEle = $("ul.subcategory-list-dropdown li input").filter(function (index, it) {
                        return $(it).val() == subCategory || $(it).val().replaceAll("&", "-") == subCategory
                    }).first()).length) {
                        return;
                    }
                    subCategoryEle.click().click();

                    /**
                     * series  获取到的series可能含有'&' 做两种匹配
                     */
                    var seriesEle;
                    if (!series || !(seriesEle = $("ul.series-list-dropdown li input").filter(function (index, it) {
                        return $(it).val() == series || $(it).val().replaceAll("&", "-") == series
                    }).first()).length) {
                        return;
                    }
                    seriesEle.click().click();

                    checkedSubSeriesStr != null && $('div[data-title-type="Subseries"]').find('.filter-body ul li input:checked').filter(function (index, it) {
                        return $(it).val() != 'all' && checkedSubSeries.indexOf(decodeURI($(it).val())) < 0 && $(this).parent().css("display") != 'none'
                    }).click();
                }, 200);
            }

            // 2020/03/12 zhangjianlong6: check subseries for hide
            var hideSubseries = function (products) {
                var subseries = [];

                $('[data-title-type="Subseries"]').find('li').each(function (i, el) {
                    subseries.push(decodeURI($(el).find('input').val()));
                })

                if (subseries) {
                    var result = subseries.forEach(function (subserie) {
                        var filterResult = products.find(function (product) {
                            //根据产品筛选项中数据筛选subseries
                            return product['selectParameters']['Subseries'] && product['selectParameters']['Subseries'][0] && product['selectParameters']['Subseries'][0] === subserie;
                        });
                        if (!filterResult) {
                            $('.filter-card[data-title-type=Subseries] input[value="' + encodeURI(subserie) + '"]').parent().hide()
                            $('.filter-card[data-title-type=Subseries] input[value="' + encodeURI(subserie) + '"]').parent().addClass('hide-flag');
                        }
                    });
                } else {
                    $('.filter-card[data-title-type=Subseries]').hide();
                }
            };

            var hideSelect = function () {
                var filterContainer = $(".filter-container")
                var qwe = filterContainer.find(".checkbox-left")
                qwe.each(function (i, item) {
                    if (item.childNodes && item.childNodes.length > 0) {
                        var flag = true
                        for (let index = 0; index < item.childNodes.length; index++) {
                            const element = item.childNodes[index];
                            if ($(element).css("display") != "none") {
                                flag = false
                            }
                        }
                        if (flag) {
                            $(this).parent().parent().parent().parent().parent().hide()
                        }
                    }
                })
            };
            // 2020/04/22 zhangjianlong6: check options for hide
            var hideOptions = function (products, filters, subseries) {
                if (filters) {
                    var filterTemplates = filters[0].subItems[0].subItems.filter(function (obj, i) {
                        return obj.title === 'filterTemplate'
                    })[0];

                    if (filterTemplates) {
                        for (var option in filterTemplates.filterItems) {
                            if (filterTemplates.filterItems[option] && filterTemplates.filterItems[option].options) {
                                var result = filterTemplates.filterItems[option].options.forEach(function (key) {
                                    var filterResult = products.find(function (product) {
                                        return product['selectParameters'][filterTemplates.filterItems[option].title]
                                            && product['selectParameters'][filterTemplates.filterItems[option].title].includes(key.value);
                                    });
                                    if (!filterResult) {
                                        $('.filter-card[data-title-type="' + filterTemplates.filterItems[option].title + '"] input[value="' + encodeURI(key.value) + '"]').parent().hide()
                                        $('.filter-card[data-title-type="' + filterTemplates.filterItems[option].title + '"] input[value="' + encodeURI(key.value) + '"]').parent().addClass('hide-flag');
                                    }
                                });
                            }
                        }
                    }
                }

                hideSubseries(products, subseries);
                hideSelect();

            };

            // ------------------------------------------------------------------
            // array utils
            // ------------------------------------------------------------------
            var isArray = function (data) {
                return (data instanceof Array);
            };

            // ------------------------------------------------------------------
            // RWD controls
            // ------------------------------------------------------------------
            var _rwdDesktopType = true;
            var minWidth = 992;
            var rwdInit = function () {

                // dynamic control
                window.matchMedia("(min-width: " + minWidth + "px)").addListener(rwdControl);

                $.aem_modal.defaults = {
                    closeExisting: true,
                    escapeClose: true,
                    clickClose: false,
                    showClose: true,
                    blockerClass: "search-list",
                };

                // static control once when enter
                if ($(window).width() <= minWidth) {
                    _rwdDesktopType = false;
                    $filter.find(".advanced-filter-inner").addClass("aem_modal");
                } else {
                    _rwdDesktopType = true;
                    $filter.find(".advanced-filter-inner").removeClass("aem_modal");
                }
                $filter.find(".mobile-filter").click(function (e) {
                    $('body').removeClass('modal_fix').addClass('modal_fix');
                    $(".aem_modal").aem_modal({ closeText: "" });
                    $filter.find(".advanced-filter-inner").show();
                    $filter.find(".advanced-filter-button").hide("fast");
                });

                $filter.find(".advanced-filter-button").click(function (e) {
                    $('body').removeClass('modal_fix').addClass('modal_fix');
                    $(".aem_modal").aem_modal();
                    $filter.find(".advanced-filter-inner").show();
                    $filter.find(".advanced-filter-button").hide("fast");
                });

                $(".aem_modal").on('aem_modal:after-close', function (event, modal) {
                    if (!_rwdDesktopType) {
                        $filter.find(".advanced-filter-inner").hide('slidedown');
                        $filter.find(".advanced-filter-inner").addClass("aem_modal");
                        $filter.find(".advanced-filter-button").show("fast");
                    } else {
                        $(".advanced-filter-inner").show();
                        $filter.find(".advanced-filter-button").hide("fast");
                        $filter.find(".advanced-filter-button.btn1").show("fast");
                        $filter.find(".advanced-filter-inner").removeClass("aem_modal");
                    }
                    $('body').removeClass('modal_fix');
                    $(".advanced-filter-inner").appendTo(".advanced-filter-wrapper");
                });


            };
            var rwdControl = function (event) {
                if (event.matches) {
                    _rwdDesktopType = true;
                    if ($.aem_modal.isActive()) {
                        $.aem_modal.close();
                    }
                    $filter.find(".advanced-filter-inner").removeClass("aem_modal");
                    $filter.find(".advanced-filter-inner").show();
                    $filter.find(".advanced-filter-button").hide();
                    // TODO: remove readonly tag for input[data-rwd-type="mobile"] when switch into desktop
                } else {
                    _rwdDesktopType = false;
                    $filter.find(".advanced-filter-inner").addClass("aem_modal");
                    $filter.find(".advanced-filter-inner").hide();
                    $filter.find(".advanced-filter-button").show();
                }
            };
            rwdInit();

        });


    }; // end filterOptions init
    document.onkeypress = banBackSpace;
    document.onkeydown = banBackSpace;
    return filterOptions;

})($);

function banBackSpace(e) {
    var ev = e || window.event;//获取event对象
    var obj = ev.target || ev.srcElement;//获取事件源
    var t = obj.type || obj.getAttribute('type');//获取事件源类型
    //获取作为判断条件的事件类型
    var vReadOnly = obj.getAttribute('readonly');
    //处理null值情况
    vReadOnly = (vReadOnly == "") ? false : vReadOnly;
    //当敲Backspace键时，事件源类型为密码或单行、多行文本的，
    //并且readonly属性为true或enabled属性为false的，则退格键失效
    var flag1 = (ev.keyCode == 8 && (t == "password" || t == "text" || t == "textarea" || t == "search") && vReadOnly == "readonly") ? true : false;
    //当敲Backspace键时，事件源类型非密码或单行、多行文本的，则退格键失效
    var flag2 = (ev.keyCode == 8 && t != "password" && t != "text" && t != "textarea" && t != "search") ? true : false;
    //判断
    if (flag2) {
        return false;
    }
    if (flag1) {
        return false;
    }
}

filterOptions.init();
/**
 * functions related to search list stikcy
 *  
 */
var stickyList = (function ($) {
    var stickyList = {};
    $(document).ready(function () {
        var dom = {
            $selector: $('.search-list-comp'),
            $filter: $('.advanced-filter-wrapper'),
            $filterInner: $('.advanced-filter-inner'),
            $filterItems: $('.advanced-fixed-height'),
            $list: $('.result-grid-layout4-wrapper'),
            $listInner: $('.layout4-wrapper'),
        }

        $(window).scroll(checkIfSticky).resize(function () {
            checkIfSticky()
            stickyList['sticky']();
        });


        stickyList['test'] = checkIfSticky;
        
        
        function checkIfSticky() {
            if (!dom.$selector.length || !dom.$filter.length)
                return;
            if(dom.$listInner.outerHeight() < dom.$filterInner.outerHeight()) {
                stickySearchList(false);
                return;
            }


            if (getPostion(dom.$selector, 'top') < 0) {
                var listBtmTop = getPostion(dom.$list, 'top') + getPostion(dom.$list, 'height');
                var filterBtmTop = getPostion(dom.$filter, 'top') + getPostion(dom.$filter, 'height');

                // reach bottom
                if (filterBtmTop > listBtmTop) {
                    dom.$filter.css('top', listBtmTop - dom.$filter.outerHeight())
                } else {
                    if (listBtmTop - dom.$filter.outerHeight() > 0) {
                        dom.$filter.css('top', 0);
                    } else {
                        dom.$filter.css('top', listBtmTop - dom.$filter.outerHeight());
                    }
                }
                stickySearchList(true)
            } else {
                stickySearchList(false)
            }
        }

        function stickySearchList(isSticky) {
            if (isSticky) {
                dom.$selector.addClass('sticky');
                dom.$filter.css('width', (dom.$selector.outerWidth() * 0.27 - 16) + "px");
                dom.$filter.css('left', getPostion(dom.$selector, 'left') + 30 + "px");
            } else {
                dom.$selector.removeClass('sticky');
                dom.$filter.css('width', '');
                dom.$filter.css('left', '');
                dom.$filter.css('top', '');
            }
        }

        function getPostion($ele, pos) {
            if (!$ele || $ele.length === 0)
                return;
            return $ele[0].getBoundingClientRect()[pos];
        }

        stickyList['sticky'] = function () {
            if (!dom.$selector.length || !dom.$filter.length)
                return;

            if (dom.$selector.hasClass('sticky')) {
                stickySearchList(false);
                window.scrollTo({ top: dom.$selector.offset().top })
            }
        };


    })

    return stickyList;
})($)
$(document).ready(function () {
    var $filterPc = $('.pc-selector')
    var $filterMobil = $('.mob-selector')
    var $accessorySelector = window.innerWidth > 992 ? $filterPc : $filterMobil
    var dataModels;  //models
    var dataProducts = [];
    var Bracketlist = {}
    var modelFilterState = {
        "model": {},
        "includes": []
    };

    var ModelStateSelected = {
        camera: {},
        accessories: [],
        CameraMount: [],
    }



    // $('.product-accessories').hide()
    var url = $('.accessory-selector-comp').data(url);

    if (url != null && url['url']) {
        var source = url['url'];
        //ajax请求数据
        $.ajax({
            url: source + ".json",
            dataType: 'json',
            type: 'get',
            contentType: 'application/json',
            success: function (data) {
                dataModels = data.filters;
                dataProducts = data.products;
            },
            error: function (error) {
                console.log(error);
            }
        }).then(function (data) {
            console.log(data);
            dataModels = data.filters;
            dataProducts = data.products;

            $filterPc.find('.camera').find('.search-cont-list-wrap').css('background', 'none')
            $filterPc.find('.camera').find('.series-list').find('.series').html(tmpl('tmpl-products-series', dataModels))
            $filterMobil.find('.camera').find('.series-list').find('.series').html(tmpl('tmpl-products-series', dataModels))
            $filterMobil.find('.search-cont-list-wrap').css('background', 'none')
            //选中一个model
            $filterPc.find('.camera').find('.series-item').on('click', function (e) {
                e.stopPropagation()
                var $clickItem = $(this)
                maidian($clickItem, e)
                initselectCameraHandel($clickItem)

                function initselectCameraHandel($clickItem) {
                    modelFilterState.includes = []
                    ModelStateSelected = {
                        camera: {},
                        accessories: [],
                        CameraMount: [],
                    }
                    $clickItem.addClass('selected').siblings().removeClass('selected')  //添加model的选中样式

                    $('.product-accessories').find('.product-item').find('.count').hide()
                     $('.pc-camera-mount').hide()
                     $('.camera-mount-wrap').show().removeClass('show-no-data').addClass('show-not-select')
                    var selectedOption = $clickItem.find('.series-title').text();
                    ModelStateSelected.camera = dataModels.filter(function (obj) {
                        return (obj.title == selectedOption);
                    })[0]
                    
                    $.each(dataProducts, function (i, obj) {
                        if ($.inArray(obj.detailPath, ModelStateSelected.camera.accessories) != -1) {
                            modelFilterState.includes.push(obj)
                        }
                    })
                    $.each(modelFilterState.includes, function (index, item) {
                        if (!item.image) {
                            item.image = '/etc/clientlibs/it/resources/images/default_product_img.png'
                        }
                    })
                    initBracket($accessorySelector)

                }
                console.log('modelFilterState',modelFilterState);
                $('.product-item').removeClass('active')
                //展示categray 列表下的产品
                function initCategrayItem() {
                    $.each($filterPc.find('.product-accessories').find('.offer-item'), function () {
                        var link = $(this).attr('data-link')
                        $(this).find('li').remove()
                        var that = $(this)
                        var categrayName = $(this).parent().attr('data-category')
                        $.each(modelFilterState.includes, function (i, obj) {
                            if (obj.subseries === link) {
                                that.append(
                                    '<li class="series-item at-action" data-detailPath="' + obj.detailPath + '" data-categrayName="' + categrayName + '" data-at-mer="accessory-filter::' + categrayName + '::' + obj.title + '">' +
                                    '<div class="img"><img src="../联系我们 - 关于我们 - 海康威视 Hikvision_files/' + obj.image + '" alt=""></div>' +
                                    '<div class="model">' +
                                    '<p class="series-title">' + obj.title + '</p>' +
                                    '</div>' +
                                    '<a href="../联系我们 - 关于我们 - 海康威视 Hikvision_files/' + obj.detailPath + '"  class="at-navigation" target="_blank" data-at-moudel="accessory-filter::redirect::' + lastNode(obj.detailPath) + '">' +
                                    '<div class="products-page"><img src="/etc/clientlibs/it/resources/icons/icon_yanjing.svg"  alt="">' +
                                    '<p>Details</p>' +
                                    '</div>' +
                                    '</a>' +
                                    '</li>'
                                )
                            }
                        })
                        $(that).find('.series-item').length < 1 ? $(that).hide() : $(that).show()
                    })

                    $('.at-navigation').on('click', function (e) {
                        e.stopPropagation()
                    })

                }

                initCategrayItem()
                hideCategray()
                //展示配件选择部分
                $('.product-accessories').show()

                //点击选中配件
                $('.product-accessories').find('.product-item').find('.series-item').on('click', function (e) {
                    e.stopPropagation()
                    maidian($(this), e)
                    $('.product-item').removeClass('active')
                    var detailPath = $(this).attr('data-detailPath')
                    var categrayName = $(this).attr('data-categrayName')
                    $.each(modelFilterState.includes, function (i, obj) {
                        if (obj.detailPath === detailPath) {
                            //obj不存在于已经选择的accessories中
                            if ($.inArray(obj, ModelStateSelected.accessories) === -1) {
                                obj.Num = 1
                                obj.categrayName = categrayName
                                ModelStateSelected.accessories.push(obj)
                            }
                        }
                    })
                    console.log('ModelStateSelected.accessories',ModelStateSelected.accessories);
                    var accessoriesSelectedNum = 0
                    //计算选中的配件数量
                    $.each(ModelStateSelected.accessories, function (i, obj) {
                        if (obj.categrayName === categrayName) {
                            accessoriesSelectedNum++;
                        }
                    })
                    //如果有选中的显示数量
                    if (accessoriesSelectedNum > 0) {
                        $(this).parents('.product-item').find('.count').css('display', 'block').find('i').text(accessoriesSelectedNum)
                    } else {
                        $(this).find('.count').hide()
                    }
                    $(this).addClass('selected')

                    //选中配件后显示再下方的表格里
                    showDownload()
                })
                //展示到选择项
                showModel()
                // 展示到表格
                showDownload()
            })
            $('.at-navigation').on('click',function(e){
                e.stopPropagation()
            })

            $filterMobil.find('.camera').find('.series-item').on('click', function (e) {
                e.stopPropagation()
                maidian($(this), e)
                $('.accessories .sort_wrap').show()
                modelFilterState.includes = []
                ModelStateSelected = {
                    camera: {},
                    accessories: [],
                    CameraMount: [],
                }
                $(this).addClass('selected').siblings().removeClass('selected')  //添加model的选中样式

                $('.accessories').find('.product-item').find('.count').hide()
                $('.pc-camera-mount').hide()
                $('.camera-mount-wrap').show().removeClass('show-no-data').addClass('show-not-select')
                $('.cameramount .mount_wrap').hide()
                var selectedOption = $(this).find('.series-title').text();
                ModelStateSelected.camera = dataModels.filter(function (obj) {
                    return (obj.title == selectedOption);
                })[0];
                $.each(dataProducts, function (i, obj) {
                    if ($.inArray(obj.detailPath, ModelStateSelected.camera.accessories) != -1) {
                        modelFilterState.includes.push(obj)
                    }
                })
                $.each(modelFilterState.includes, function (index, item) {
                    if (!item.image) {
                        item.image = '/etc/clientlibs/it/resources/images/default_product_img.png'
                    }
                })
                showModel()
                initBracket($accessorySelector)

                $filterMobil.find('.product-item').removeClass('active')
                $.each($filterMobil.find('.accessories').find('.offer-item'), function () {
                    var link = $(this).attr('data-link');
                    $(this).find('li').remove()
                    var that = $(this)
                    var categrayName = $(this).parent().attr('data-category')
                    $.each(modelFilterState.includes, function (i, obj) {
                        if (obj.subseries === link) {
                            that.append(
                                '<li class="series-item at-action" data-detailPath="' + obj.detailPath + '" data-categrayName="' + categrayName + '"  data-at-mer="accessory-filter::' + categrayName + '::' + obj.title + '">' +
                                '<div class="img"><img src="../联系我们 - 关于我们 - 海康威视 Hikvision_files/' + obj.image + '" alt=""></div>' +
                                '<div class="model">' +
                                '<p class="series-title">' + obj.title + '</p>' +
                                '</div>' +
                                '<a href="../联系我们 - 关于我们 - 海康威视 Hikvision_files/' + obj.detailPath + '" class="at-navigation" target="_blank" data-at-moudel="accessory-filter::redirect::' + lastNode(obj.detailPath) + '" >' +
                                '<div class="products-page"><img src="/etc/clientlibs/it/resources/icons/icon_yanjing.svg"  alt="">' +
                                '<p>Details</p>' +
                                '</div>' +
                                '</a>' +
                                '</li>'
                            )
                        }
                    })
                    $(that).find('.series-item').length < 1 ? $(that).hide() : $(that).show();
                })
                $('.at-navigation').on('click', function (e) {
                    e.stopPropagation()
                })
                hideCategray()

                $filterMobil.find('.accessories').find('.product-item').find('.series-item').on('click', function (e) {
                    e.stopPropagation()
                    maidian($(this), e)
                    var detailPath = $(this).attr('data-detailPath')
                    var categrayName = $(this).attr('data-categrayName')
                    $.each(modelFilterState.includes, function (i, obj) {
                        if (obj.detailPath === detailPath) {
                            //obj不存在于已经选择的accessories中
                            if ($.inArray(obj, ModelStateSelected.accessories) === -1) {
                                obj.Num = 1
                                obj.categrayName = categrayName
                                ModelStateSelected.accessories.push(obj)
                            }
                        }
                    })
                    var accessoriesSelectedNum = 0
                    //计算选中的配件数量
                    $.each(ModelStateSelected.accessories, function (i, obj) {
                        if (obj.categrayName === categrayName) {
                            accessoriesSelectedNum++;
                        }
                    })
                    //如果有选中的显示数量
                    if (accessoriesSelectedNum > 0) {
                        $(this).parents('.product-item').find('.count').css('display', 'block').find('i').text(accessoriesSelectedNum)
                    } else {
                        $(this).find('.count').hide()
                    }
                    $(this).addClass('selected')
                    $('.product-item').removeClass('active')
                    //选中配件后显示再下方的表格里
                    // showDownload()
                })
            })
        })
    }

    //隐藏没有子级的Categray
    function hideCategray() {
        // $accessorySelector
        var flag='';
        $.each($accessorySelector.find('.product-accessories , .accessories').find('.product-item'), function () {
            $(this).find('.series-item').length < 1 ? $(this).hide() : $(this).show()
            $(this).find('.series-item').length < 1 ? flag+='0' : flag+='1';
        })

        flag.indexOf('1') > -1 ? $('.product-accessories-wrap').hide() : $('.product-accessories-wrap').show().removeClass('show-not-select').addClass('show-no-data');
        // $.each($filterPc.find('.product-accessories').find('.product-item'), function () {
        //     $(this).find('.series-item').length < 1 ? $(this).hide() : $(this).show()
        // })
        // // accessories
        // $.each($filterMobil.find('.accessories').find('.product-item'), function () {
        //     $(this).find('.series-item').length < 1 ? $(this).hide() : $(this).show()
        // })
    }

    //埋点
    function maidian($clickItem, e) {
        if ($clickItem.attr('data-at-mer')) {
            var dataModule = $clickItem.attr('data-at-mer') + '::' + location.href
            atModel.doAtEvent(dataModule, 'action', e)
        }
    }


    // 点击bracket类选择配件
    $('.product-item.Bracket .offer-item').on('click', function (e) {
        e.stopPropagation()
        // 只展示Breacket下的分类
        // var bracketDescription = '';
        $('.camera-mount-wrap').hide()
        $('.pc-camera-mount').show()
        maidian($(this), e)
        ModelStateSelected.CameraMount = []
        $(this).addClass('selected').siblings().removeClass('selected')
        var link = $(this).attr('data-link')
        $.each(modelFilterState.includes, function (i, obj) {
            if (obj.subseries === link) {
                obj.Num = 1
                ModelStateSelected.CameraMount.push(obj)
            }
        })
        $('.pc-camera-mount').empty()
        $filterMobil.find('.cameramount').find('.mount_wrap').empty()
        if (ModelStateSelected.CameraMount.length >= 1) {
            $('.camera-mount,.cameramount .mount_wrap').show()
            $('.camera-mount-wrap').hide()
        } else {
            // $('.camera-mount,.cameramount').hide()
            // $('.cameramount').hide()
        }
        for (var i = 0; i < ModelStateSelected.CameraMount.length; i++) {
            $('.pc-camera-mount , .mob-selector .cameramount .mount_wrap').append(
                '<div class="product-item">' +
                '<div class="top-detail-btn">' +
                '<a href="../联系我们 - 关于我们 - 海康威视 Hikvision_files/' + ModelStateSelected.CameraMount[i].detailPath + '" class="at-navigation" target="_blank"  data-at-mer="accessory-filter::redirect::'+lastNode(ModelStateSelected.CameraMount[i].detailPath)+'">' +
                '<img src="/etc/clientlibs/it/resources/icons/icon_yanjing.svg" alt="">' +
                '<span>Details</span>' +
                '</a>' +
                '</div>' +
                '<div class="img-con"> <img class="item" src="../联系我们 - 关于我们 - 海康威视 Hikvision_files/' + ModelStateSelected.CameraMount[i].image + '" alt=""></div>' +
                '<p>' + ModelStateSelected.CameraMount[i].title + '</p>' +
                '</div>'
            )
        }

        $('.at-navigation').on('click', function (e) {
            e.stopPropagation()
        })

        $('.product-item').removeClass('active')
        showDownload()
    })

    var initBracket = function ($accessorySelector) {
        Bracketlist={}
        var flag ='';
        $.each($($accessorySelector).find('.placement .product-item.Bracket .offer-item'), function (index, element) {
            var link = $(element).attr('data-link')
            var title = $(element).attr('data-title')
            $.each(modelFilterState.includes, function (i, obj) {
                if (obj.subseries === link) {
                    Bracketlist[title] = []
                    Bracketlist[title].push(obj)
                }
            })
            !Bracketlist[title] ? $(this).hide() : $(this).show();
            !Bracketlist[title] ? flag+='0' : flag+='1';
        })
        flag.indexOf('1') > -1 ? $('.product-item.Bracket .search-cont-list-wrap').removeClass('no-data') : $('.product-item.Bracket .search-cont-list-wrap').addClass('no-data');
        
    }
    //-------------搜索--------------
    searchListinit()
    function searchListinit() {
        //实时搜索 
        $accessorySelector.find('.search-top').find(".product-search").on("keyup", _.throttle(function (e) {
            var $selectedOption = $(this);
            selectedOptionHandel($selectedOption)
        }, 1000));
    }

    function selectedOptionHandel($selectedOption) {
        var value = $selectedOption.val().toLowerCase().trim();
        $selectedOption.closest('.search-list-wrap')
            .find('.search-cont').find("li") 
            .filter(function () {
                $(this).toggle($(this).find('p').text().toLowerCase().indexOf(value) > -1)
            });
    }


    //配件分类
    function CategrayNameUniq(objArry) {
        var CategrayNameArry = []
        $.each(objArry, function (i, obj) {
            CategrayNameArry.push(obj.categrayName)
        })
        var res = _.uniq(CategrayNameArry)
        return res
    }

    //初始select a camera
    function showModel() {
        if (!$.isEmptyObject(ModelStateSelected.camera)) {
            $filterPc.find('.camera').find('.product-item').find('.product-item-title span').text(ModelStateSelected.camera.title)
            $filterMobil.find('.camera').find('.camera-select').find('.camera-select-title span').text(ModelStateSelected.camera.title)
        } else {
            $filterPc.find('.camera').find('.product-item').find('.product-item-title span').text('Select')
            $filterMobil.find('.camera').find('.camera-select').find('.camera-select-title span').text('Select')
        }
    }

    //重置reset
    function resetDown() {
        // product-accessories
        ModelStateSelected = {
            camera: {},
            accessories: [],
            CameraMount: [],
        }
        $accessorySelector.find('.search-top').find(".product-search").val('')
        selectedOptionHandel($accessorySelector.find('.search-top').find(".product-search"))
        $('.product-accessories').hide()
        $('.pc-camera-mount').hide()
        $('.camera-mount-wrap').show().removeClass('show-no-data').addClass('show-not-select')
        $('.product-accessories-wrap').show().removeClass('show-no-data').addClass('show-not-select');
        $filterPc.find('.download-wrap').show()
        $('.download-top').hide()
        $('.download-content').hide()
        $('.series-item').removeClass('selected')
        $filterMobil.find('.accessories .sort_wrap,.cameramount .mount_wrap').hide()
        showModel()
    }

    $('.reset-btn').on('click', function () {
        resetDown()
    })

    //展示Download部分
    function showDownload() {
        $filterPc.find('.download-wrap').show()
        $filterPc.find('.download-content').show()
        $filterPc.find('.download-top').show()
        //creame存在
        if (!$.isEmptyObject(ModelStateSelected.camera)) {
            $('.camear-tab').css('display', 'block')
            $('.model-title').text(ModelStateSelected.camera.title)
        }
        //展示accessories
        var accessoriesObj = accessoriesSort(ModelStateSelected.accessories)
        if (accessoriesObj.length >= 1) {
            $('.pc-selector').find('.pc-tab-accessories').show()
            $('.pc-selector').find('.pc-tab-accessories').html(tmpl('tmpl-pc-accessories-tab', accessoriesObj))
        } else {
            $('.pc-selector').find('.pc-tab-accessories').hide()
        }
        //展示CameraMount
        if (ModelStateSelected.CameraMount.length >= 1) {
            $('.pc-tab-camearMount').show()
            $('.pc-tab-camearMount').html(tmpl('tmpl-pc-camearMount-tab', ModelStateSelected.CameraMount))
        } else {
            $('.pc-tab-camearMount').hide()
        }

        changeAmount()
        initremoveAccessory()
    }

    //配件分类，以便展示
    function accessoriesSort(accessoriesArry) {
        var categoryItem = CategrayNameUniq(accessoriesArry)
        var accessoriesObj = []
        $.each(categoryItem, function (i, item) {
            accessoriesObj.push({ categrayName: item, children: [] })
            $.each(accessoriesArry, function (j, obj) {
                if (obj.categrayName === accessoriesObj[i].categrayName) {
                    accessoriesObj[i].children.push(obj)
                }
            })
        })
        return accessoriesObj
    }


    //下拉列表弹出
    function clickFilterItem() {
        $('.pc-selector .product-item').on('click', function (e) {
            e.stopPropagation()
            maidian($(this), e)
            var title = $(this).data('title')
            if ($.isEmptyObject(ModelStateSelected.camera) && title === 'Bracket') {
                return
            } else {
                $('.product-item').removeClass('active')
                $(this).addClass('active')
            }
        })
        $(document).on('click', function () {
            $('.product-item').removeClass('active')
        })
    }
    clickFilterItem()

    $('.download-content input').val(1);
    // 改变count
    function changeAmount() {
        $.each($('.amount'), function () {
            $(this).children('.add , .reduce').on('click', function () {
                var count = $(this).siblings('input').val();
                var change = $(this).hasClass('add') ? 1 : -1 ;
                if(count=='1'&& change == -1){
                    return
                }else{
                    count =parseInt(count) + change;
                    $(this).css('cursor', count > 1 ? 'pointer' : 'not-allowed')
                    var DetailPath = $(this).parents('tr').attr('data-detailpath') || $(this).parents('.product').attr('data-detailpath')

                    $.each(ModelStateSelected.CameraMount, function (i, obj) {
                        if (obj.detailPath === DetailPath) {
                            obj.Num = count
                        }
                    })
                    $.each(ModelStateSelected.accessories, function (i, obj) {
                        if (obj.detailPath === DetailPath) {
                            obj.Num = count
                        }
                    })
                    $(this).siblings('input').val(count);
                }
            });
            $(this).children('.reduce').on('mouseenter', function () {
                var count = $(this).siblings('input').val();
                $(this).css('cursor', count > 1 ? 'pointer' : 'not-allowed')
            })
        });
    }


    function removeOneHandel(e,onlyDetail){
        var dataModule = 'accessory-filter::remove::' + location.href
        atModel.doAtEvent(dataModule, 'action', e)     
        $.each(ModelStateSelected.accessories, function (i, obj) {
            if ( obj && onlyDetail === obj.detailPath) {  
                ModelStateSelected.accessories.splice(i, 1) 
            }
        })
    }

    // delete accessories
    function initremoveAccessory() {
        //delete accessory
        $.each($('.download-content .accessories-remove'), function () {
            $(this).children().on('click', function (e) {
                var onlyDetail = $(this).parent().parent().attr('data-detailPath')
                $(this).parent().parent().remove();    
                console.log('onlyDetail',onlyDetail);
                removeOneHandel(e,onlyDetail)
                showDownload()
             
            });
        });
        $.each($('.detial.accessories .delete-btn'), function () {
            $(this).on('click', function (e) { 
                var onlyDetail = $(this).parents('.product').attr('data-detailPath')
                $(this).parents('.product').remove();
                removeOneHandel(e,onlyDetail)
                mobileShowDownload()
            });
        });

        //delete Camera Mount
        $('.camera-mount-remove,.detial.cameramount .delete-btn').on('click', function (e) {
            var dataModule = 'accessory-filter::remove::' + location.href
            atModel.doAtEvent(dataModule, 'action', e) 
            ModelStateSelected.CameraMount = []
            if ($(this).parents('.pc-selector').length > 0) {
                $('.camearMount-tab').hide()
                showDownload()
            } else {
                $('.detial.cameramount').hide()
                mobileShowDownload()
            }
        })
    }

    // mobile选项卡展示
    $filterMobil.find('.mobile-nav li').click(function () {
        const _index = $(this).index();
        $('.content>div').eq(_index).show().siblings()
            .hide();
        $(this).addClass('active').siblings().removeClass('active');
        mobileShowDownload()
    });

    //关闭搜索窗口
    $filterMobil.find('.mob-select-close').on('click', function (e) {
        e.stopPropagation()
        $filterMobil.find('.product-item').removeClass('active')
    })

    //产品列表显示
    $filterMobil.find('.product-item').on('click', function (e) {
        e.stopPropagation()
        var title = $(this).data('title')
        if ($.isEmptyObject(ModelStateSelected.camera) && title === 'Bracket') {
            return
        }
        if ($(this).hasClass('accessories-select') || (!$.isEmptyObject(ModelStateSelected.camera) && title === 'Bracket')) {
            maidian($(this), e)
        }
        $(this).addClass('active')
    })

    // ----moblie show table
    function mobileShowDownload() {
        if (!$.isEmptyObject(ModelStateSelected.camera)) {
            $('.detial-wrap').find('.detial.camera').show()
            $('.detial.camera').find('.describe h4').text(ModelStateSelected.camera.title)
        } else {
            $('.detial-wrap').find('.detial.camera').hide()
        }

        //展示accessories
        var accessoriesObj = accessoriesSort(ModelStateSelected.accessories)
        if (accessoriesObj.length >= 1) {
            $filterMobil.find('.detial-wrap').find('.detial.accessories').show()
            $filterMobil.find('.detial-wrap').find('.detial.accessories').html(tmpl('tmpl-mob-accessories-tab', accessoriesObj))
        } else {
            $('.detial-wrap').find('.detial.accessories').hide()
        }

        //展示CameraMount
        if (ModelStateSelected.CameraMount.length >= 1) {
            $('.detial-wrap').find('.detial.cameramount').show()
            $('.detial-wrap').find('.detial.cameramount').html(tmpl('tmpl-mob-camearMount-tab', ModelStateSelected.CameraMount))
        } else {
            $('.detial-wrap').find('.detial.cameramount').hide()
        }
        changeAmount()
        initremoveAccessory()
    }

    // download  PDF------------------------------
    var $downloadBtn = $('.accessory-selector-comp .download-btn');
    $downloadBtn.on('click', function (e) {
        e.stopPropagation()
        var dataModule = 'accessory-filter::print::' + location.href
        atModel.doAtEvent(dataModule, 'action', e)
        var pdf = new jsPDF('p', 'pt', 'a4');
        pdf.internal.scaleFactor = 2;// 调整缩放比
        var options = {
            pagesplit: false,
            background: '#FFFFFF',
        };
        $('#downloadPDF').html(tmpl('tmpl-download-pdf', ModelStateSelected))
        $('#downloadPDF').show();
        pdf.addHTML(document.getElementById('downloadPDF'), options, function () {
            pdf.save('AccessorySelector.pdf');
            $('#downloadPDF').hide();
        })
    });
});
var cppPartnersModule = (function ($) {
    var cppPartners = {};
    var i18n_next = Granite.I18n.get("next");
    var i18n_back = Granite.I18n.get("back");

    cppPartners.jPagesInit = function () {
        //         containerID: "container id",
        //         first: 'first name',
        //         last: 'last name',
        //         previous: 'previous name',
        //         next: 'next name',
        //         perPage: 10, rows for each page
        //         startPage: 1, start page
        //         startRange: 2, start range num
        //         midRange: 3, max show range, other use ...
        //         ndRange: 2, start range num
        //         keyBrowse: true
        $(".cpp-result-grid__layout1-wrapper").find(".holder").jPages({
            containerID: "cpp-layout1-wrapper",
            perPage: 10,
            previous: i18n_back,
            next: i18n_next,
            keyBrowse: true,
            animation: "slideInRight",
            callback: function(pages, items) {
              var showingItems = items.showing;
              $(showingItems).find('.lazy').lazyload();
            }
        });
    };

    cppPartners.pageInit = function () {
         $('.cpp-layout-hide-wrapper').append($('.cpp-layout1-wrapper').html());
         updateFilterMoreBtnState($('.cpp-partners'));
         cppPartners.filteredBasedOnIP();
         cppPartners.description()
    };

    cppPartners.filteredBasedOnIP = function() {
        var dataFilter = $('.cpp-partners .filter-header-wrapper .filter-search-container').attr('data-filter-based-on-ip');
        var parentCategory = dataFilter.split('||')[0];
        var childRegion = dataFilter.split('||')[1];
        var $parentCategory = $('.cpp-partners .filter-header-wrapper .filter-category[data-category="'+ parentCategory + '"]');
        var $childRegion = $('.cpp-partners .filter-header-wrapper .filter-items .sub-item[data-region="'+ childRegion +'"]');
        if ($childRegion.length) {
            var index = $childRegion.closest('.filter-section').index();
            $('.cpp-partners .filter-header-wrapper .filter-category').eq(index).eq(0).click();
            $childRegion.click();
        } else if($parentCategory.length) {
            var index = $parentCategory.index();
            $parentCategory.click();
            $('.cpp-partners .filter-header-wrapper .filter-section').eq(index).find('.sub-item').eq(0).click();
        }else {
            $('.cpp-partners .filter-header-wrapper .filter-category').eq(0).click();
            $('.cpp-partners .filter-header-wrapper .filter-section').eq(0).find('.sub-item').eq(0).click();
        }
    }

    cppPartners.currentFilters = [];

    cppPartners.bindEvent = function () {
        $('.cpp-partners .filter-tab .filter-category').on('click', function() {
            var that = $(this)
            var filterIndex = 0;
            $('.cpp-partners .filter-tab .filter-category').each(function(index , item){
                if($(this).attr('data-category') == that.attr('data-category')){
                    filterIndex = index;
                }
            })
            var $filterBar = $(this).closest('.filter-search-container');
            var filterValue = Granite.I18n.get($(this).attr('data-category'));
            var changeSection = !$(this).hasClass('active');
            if (isMobileBreakPoint()) {
                if ($(this).hasClass('active mobile-open')) {
                    $filterBar.find('.filter-section').eq(filterIndex).removeClass('mobile-open');
                    $(this).removeClass('mobile-open');
                    $filterBar.find('.filter-categorys').removeClass('line-active');
                    removeBackdrop();
                } else {
                    $filterBar.find('.filter-category').removeClass('active mobile-open');
                    $filterBar.find('.filter-section').removeClass('active mobile-open');
                    $(this).addClass('active mobile-open');
                    $filterBar.find('.filter-section').eq(filterIndex).addClass('active mobile-open');
                    $filterBar.find('.filter-categorys').addClass('line-active');
                    if( $('.cpp-partners').find('.filter-search-container').attr('data-hideregionfilters') != 'true' ){
                        addBackdrop();
                    }
                }
            } else {
                $filterBar.find('.filter-section').removeClass('active mobile-open');
                $filterBar.find('.filter-category').removeClass('active mobile-open');
                $(this).addClass('active mobile-open');
                $filterBar.find('.filter-section').eq(filterIndex).addClass('active mobile-open');
                $filterBar.find('.filter-categorys').addClass('line-active');
                addBackdrop();
            }

            if(cppPartners.currentFilters.length && cppPartners.currentFilters.split('||')[0] != filterValue) {
               $filterBar.find('.filter-section').eq(filterIndex).find('.sub-item').eq(0).click();
            }

            updateFilterMoreBtnState($filterBar.closest('.cpp-partners'),changeSection);
            updateBackdropPosition();
            cppPartners.description()
        });

        $('.cpp-partners .filter-header-wrapper .filter-items-container .more-btn').on('click', function() {
            $(this).toggleClass('active-more active-less');
            $(this).closest('.filter-items-container').find('.filter-items').toggleClass('filter-close');
        });

        // filter button click event
        $(".cpp-partners .filter-header-wrapper .filter-items-container .sub-item").click(function() {
            var $brotherFilterItem = $(this).closest('.filter-section').siblings();
            var dataSubcategory = $(this).attr('data-subcategory');
            var parentCategory = dataSubcategory.split('||')[0];
            var parentSubCategory = dataSubcategory.split('||')[1];
            var lastCategory = cppPartners.currentFilters;
            var index = $(this).closest('.filter-section').index();
            if(cppPartners.currentFilters == dataSubcategory) {
                return;
            }
            var that = $(this)    
            $(".cpp-partners .filter-header-wrapper .filter-tab .filter-hideRegionFilters-li-btn").each(function(){
                if($(this).attr('data-subcategory').split('||')[1] == that.attr('data-subcategory').split('||')[1]){
                    $(this).addClass('filter-hideRegionFilters-li-btn-active')
                    return
                }else{
                    $(this).removeClass('filter-hideRegionFilters-li-btn-active')
                }
            })
            cppPartners.currentFilters = dataSubcategory;
            $brotherFilterItem.find('.sub-item').removeClass('active');
            $(this).addClass('active');
            $(this).siblings().removeClass('active');
            $(this).closest('.filter-search-container').find('.filter-category').removeClass('has-active-filter');
            $(this).closest('.filter-search-container').find('.filter-category').eq(index).addClass('has-active-filter');
            if(($('.cpp-partners').find('.filter-search-container').attr('data-hideregionfilters') != 'true') && (lastCategory.length < 1 || (lastCategory.length && lastCategory.split('||')[0] == parentCategory))) {
                $(this).closest('.filter-search-container').find('.filter-category.active').click();
            }

            hideRegionFilter(parentSubCategory);
            $("#filterRegion").find(".region-filter-input").val(Granite.I18n.get("Region/City"));
            cppPartners.refreshFilterResults(false, parentCategory);
            cppPartners.description()
        });
        var hideRegionFilters = $(".cpp-partners .filter-header-wrapper .filter-tab .filter-hideRegionFilters-li-btn")
        var filterCategory = $(".cpp-partners .filter-header-wrapper .filter-tab .filter-category")
        var contextList= $('.cpp-partners').find('.filter-search-container')
        var flag = false
            if(contextList.attr('data-hideregionfilters') == 'true'){
                flag = true
            }
        if(hideRegionFilters.length && flag){
            // filter-category
            $(".cpp-partners .filter-header-wrapper .filter-items-container").hide()
            var subItms = $(".cpp-partners .filter-header-wrapper .filter-items-container .sub-item")
            var arr2 = [];
            subItms.each(function() {
                arr2.push( $(this).attr('data-subcategory').split('||')[1] )
            })
            hideRegionFilters.click(function() {
                var i = arr2.indexOf( $(this).attr('data-subcategory').split('||')[1] )
                subItms.eq(i).click()
            });
        }

        // search button click event
         $('.cpp-partners .filter-header-wrapper .cpp-search-btn').click(function(e) {
            e.preventDefault();
            cppPartners.refreshFilterResults();
         });

         $('.cpp-partners .cpp-search').on('keydown', function(e) {
            if (e.keyCode == 13){
                $(this).parent().find('.cpp-search-btn').click();
            }
         });

        // select option on change event
         $('#filterRegion').find(".region-filter-input").change(function(e) {
                    e.preventDefault();
                    cppPartners.refreshFilterResults();
                });
        $("#filterRegion").find(".region-filter-input").click(function(e){
            $("#filterRegion").find(".region-filter-wrapper").toggle()
            $(this).parent().toggleClass('filter-input-click')
            $(this).parent().toggleClass("region-filter-up")
            $(this).parent().toggleClass("region-filter-down")
            cppPartners.clickRegion()
        })    

        // reset filter
        $('.cpp-partners .filter-header-wrapper .resetAll').click(function() {
            $(".cpp-search").val("");
            $("#filterRegion").hide();
            $("#filterRegion").find(".region-filter-input").val(Granite.I18n.get("Region/City"));
            cppPartners.currentFilters = [];
            cppPartners.filteredBasedOnIP();
        });

        $('body').on('click', '.cpp-partners-backdrop', function() {
            $('.cpp-partners .filter-tab .filter-category.active.mobile-open').click();
        });
    };

    function isMobileBreakPoint() {
        if ($(window).width() < 992) {
            return true;
        }

        return false;
    }

    function updateFilterMoreBtnState($targetComp,changeSection) {
        var $filterSection = $targetComp.find('.filter-section.active');
        var $moreBtn = $targetComp.find('.filter-search-container .more-btn');
        var $filterItems = $moreBtn.closest('.filter-items-container').find('.filter-items');
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

    function addBackdrop() {
        var backdrop = '<div class="cpp-partners-backdrop"></div>';
        if(!$('.cpp-partners-backdrop').length) {
            $('body').append(backdrop);
            $('body').addClass('cpp-partners-backdrop-open');
            updateBackdropPosition();
        }
    }

    function removeBackdrop() {
        $('.cpp-partners-backdrop').remove();
        $('body').removeClass('cpp-partners-backdrop-open');
    }

    function updateBackdropPosition() {
        if(isMobileBreakPoint && $('.filter-section.active.mobile-open').length) {
            var $filterContainer = $('.filter-section.active.mobile-open').closest('.filter-search-container').find('.filter-items-container');
            var containerTop = $filterContainer.offset().top - $(window).scrollTop();
            var containerHeight = $filterContainer.outerHeight();
            var dropTop = containerHeight + containerTop;
            $('.cpp-partners-backdrop').css('top', dropTop);
        }
    }

    function hideRegionFilter(parentSubCategory){
        var $filterRegion = $("#filterRegion");
        var $filterContainer= $(".cpp-partners .filter-search-container");
        if('true' === $filterContainer.attr("data-filter-by-region")  &&
            $filterContainer.attr("data-show-region-country") != null &&
            $filterContainer.attr("data-show-region-country").toLowerCase().indexOf(parentSubCategory.toLowerCase()) !== -1 ){
       $filterRegion.show();
       $filterRegion.find(".region-filter-wrapper").find('.region-option').remove();
       cppPartners.prependDom()
    //    $filterRegion.append($('.regionFilterContainer .region-filter-hide [data-country="' + parentSubCategory + '"]').clone());
        $('.regionFilterContainer .region-filter-hide').find(".region-option").length>0 && $('.regionFilterContainer .region-filter-hide').find(".region-option").each(function(){
            if($(this).attr("data-country") == parentSubCategory){
                $filterRegion.find(".region-filter-wrapper").append('<li class="region-option" data-country='+ $(this).attr('data-country') +' value='+ $(this).attr('value') +' >'+$(this).text() +'</li>')
            }
        })
       var filterItem = $filterRegion.find(".region-filter-wrapper").find(".region-option")
       var itemText = []
       var newArr = []
       filterItem.each(function () {
           itemText.push($(this).text())
       })
       for (let index = itemText.length - 1; index >= 0; index --) {
           if(newArr.indexOf(itemText[index]) == -1 && (itemText[index] != '')){
            newArr.push(itemText[index])
           }else{
               filterItem.eq(index).hide()
           }
       }
     }else{
       $filterRegion.hide();
       $filterRegion.find(".region-filter-input").val(Granite.I18n.get("Region/City"));
     }
    }

    cppPartners.refreshFilterResults = function(isViewAll, bu){
        $("#filterRegion").find(".region-filter-wrapper").hide()
        $("#filterRegion").removeClass('filter-input-click')
        !$("#filterRegion").hasClass("region-filter-up") && $("#filterRegion").addClass("region-filter-up")
        $("#filterRegion").removeClass("region-filter-down")
        var $searchInput = $('.filter-header-wrapper .cpp-search');
        var searchValue = $searchInput.val().trim().toLowerCase();
      $('.cpp-layout1-wrapper').empty();
      var appendItems = $().add("<ul>");
      if (isViewAll && bu) {
        appendItems.append($('.cpp-layout-hide-wrapper .cpp-layout1-content-wrapper[data-bu="'+ bu +'"]').clone());
      } else if(cppPartners.currentFilters.length === 0) {
         appendItems.append($('.cpp-layout-hide-wrapper .cpp-layout1-content-wrapper').clone());
      } else {
          var cppBu = cppPartners.currentFilters.split('||')[0];
          var cppCountry = cppPartners.currentFilters.split('||')[1];
          if($("#filterRegion").find(".region-filter-input").val() == Granite.I18n.get("Region/City")){
            appendItems.append($('.cpp-layout-hide-wrapper .cpp-layout1-content-wrapper[data-bu="' + cppBu + '"][data-country="' + cppCountry + '"]').clone());
            } else {
                var allList = $('.cpp-layout-hide-wrapper .cpp-layout1-content-wrapper[data-bu="' + cppBu + '"][data-country="' + cppCountry + '"]')
                allList.each(function () {
                    if($(this).attr('data-region').indexOf($("#filterRegion").find(".region-filter-input").val()) > -1){
                        appendItems.append($(this).clone())
                    }
                })
            // appendItems.append($('.cpp-layout-hide-wrapper .cpp-layout1-content-wrapper[data-bu="' + cppBu + '"][data-country="' + cppCountry + '"][data-region="' + $("#filterRegion").val() + '"]').clone());
            }
      }
      appendItems.append("</ul>");
      appendItems = appendItems.find('.cpp-layout1-content-wrapper').filter(function(i,n){
       if($(n).find('.cpp-result-grid-layout1__text .cpp-tile-heading').text().toLowerCase().indexOf(searchValue) != -1){
       return true;
       } else {
       return false;
       }
      });
     //去掉前端排序
      if (cppPartners.currentFilters.length !== 0){
          //Order by ranking, more small more advanced
        //   appendItems = appendItems.sort(function(x,y){
        //     //   var xStr = x.getAttribute('data-ranking');
        //     //   var yStr = y.getAttribute('data-ranking');
        //     //   var xr = parseInt(xStr?xStr:999);
        //     //   var yr = parseInt(yStr?yStr:999);
        //     //   return xr<yr? -1: xr>yr? 1:cppPartners.compareByAcctName(x,y);
        //       return $(x).find(".cpp-tile-heading").text().charCodeAt(0) - $(y).find(".cpp-tile-heading").html().charCodeAt(0);
        //     });
      }

      if(appendItems.length === 0){
      var emptyResult = $('<div colspan="4" class="cpp-layout1-content-empty text-center text-secondary">' + Granite.I18n.get("There is no matching result.") + '</div>');
      $('#cpp-layout1-wrapper').append(emptyResult);
      }else{
      $('#cpp-layout1-wrapper').append(appendItems);
      }

      cppPartners.jPagesInit();
    };
    cppPartners.handleOption = function () {
        var options = $('.regionFilterContainer .region-filter-hide').find('.region-option')
        var optionsName = []
        options.length && options.each(function () {
            if($(this).text().indexOf(';') > -1 || $(this).text().indexOf('；') > -1){
                var optionsArr = []
                optionsArr = $(this).text().replace(/；/g,";").split(';')
                optionsName =  optionsName.concat(optionsArr)
                optionsName = optionsName.filter(function(item,index,arr){
                    return arr.indexOf(item,0) === index
                })
                var that = $(this)
                for (let index = 0; index < optionsArr.length; index++) {
                    // if(optionsName.indexOf(optionsArr[index]) == -1){
                        // that.parent().append( '<option class="region-option" style="position:absolute;" data-country='+ that.attr('data-country') +' value='+ that.attr('value') +' >'+ optionsArr[index] +'</option>')
                        that.parent().append( '<li class="region-option" data-country='+ that.attr('data-country') +' value='+ that.attr('value') +' >'+ optionsArr[index] +'</li>')
                    // }
                }
                $(this).remove()
            }else{
                $(this).text() && optionsName.indexOf($(this).text()) == -1 && optionsName.push($(this).text())
            }
        })
        cppPartners.bindEvent();
        cppPartners.pageInit();
    }
    cppPartners.clickRegion = function(){
        var regionOption = $("#filterRegion").find(".region-filter-wrapper").find(".region-option")
        var regionInput = $("#filterRegion").find(".region-filter-input")
        // $("#filterRegion").find(".region-filter-wrapper").find(".region-option").length>0 && $("#filterRegion").find(".region-filter-wrapper").find(".region-option").eq(0).click()
        regionOption && regionOption.click(function(){
            if($(this).attr('value') == Granite.I18n.get("Region/City")){
                regionInput.val(Granite.I18n.get("Region/City"))
            }else{
                regionInput.val($(this).text())
            }
            cppPartners.refreshFilterResults();
        })
    }
    cppPartners.prependDom = function () {
        $("#filterRegion").find(".region-filter-wrapper").prepend('<li class="region-option" data-country='+ $(this).attr('data-country') +' value='+Granite.I18n.get("Region/City")+' > '+Granite.I18n.get("Region/City")+'</li>')
    }
    cppPartners.description = function () {
        var dec= $('.cpp-partners').find('.cpp-result-grid__layout1-wrapper').find('.cpp-layout1-content-wrapper').find('.cpp-result-grid-layout1__text')
        dec.length>0 && dec.each(function () {
            if($(this).find('.cpp-tile-heading').height() <= 21){
                $(this).find('.cpp-tile-content').addClass('cpp-tile-content-5')
            }else{
                $(this).find('.cpp-tile-content').removeClass('cpp-tile-content-5')
            }
        })
    }
    cppPartners.init = function () {
        $(document).ready(function () {
            $('.cpp-partners').each(function(){
                cppPartners.handleOption();
                cppPartners.description()
                $(window).resize(function() {
                    updateFilterMoreBtnState($('.cpp-partners'));
                    updateBackdropPosition();
                    cppPartners.description()
                });
            });
        });
    };
    cppPartners.compareByAcctName = function (x,y) {
        var xn = $(x).find(".cpp-tile-heading").html().toLowerCase();
        var yn = $(y).find(".cpp-tile-heading").html().toLowerCase();
        return xn<yn? -1: xn>yn? 1:0;
    };
    return cppPartners;
}($));

cppPartnersModule.init();
$(document).ready(function() {
    $('.grid-list-wrapper a').unbind('click').click(function(){
        var target = $(this).attr('target')
        var href= $(this).attr('data-href')
        window.open(href,target)
    })
});

(function (document, $) {
    function initPaddingTop(){
        $.each($('.card-gallery'),function(){
            if($(this).prev().hasClass('card-gallery')){
                $(this).find('.card-gallery-wrapper').css('margin-top','0px')
            }
        })
    };
    function addClassforCn(){
        if(JudgeWebLanguage('cn')){
            $('.card-gallery').addClass('cn-card-gallery');
        }
    };
    function openLink(){
        $(".card-gallery-content .hik-video-wrapper").click(function (e) {
            e.stopPropagation();
        })
        $(".card-gallery-content").click(function(e){
            if(!($(e.target).attr("data-is-jump"))){
                $(this).parent().find(".btn-link").click()
                var hasVideo = $(this).find(".icon-play").length > 0;
                //有链接有视频，点击图片打开视频；有链接无视频，点击图片打开链接
                if(!(hasVideo && (e.target == $(this).find(".icon-play")[0] || e.target == $(this).find(".content-img")[0]))){
                    var link = $(this).attr("data-href");
                    var target = $(this).attr("data-target");
                    if(link){
                        var title = atModel.getTitle(event.currentTarget);
                      //  atModel.doAtEvent(title, 'navigation', e);
                        if (target=="_blank") {
                            window.open(link);
                        } else {
                            window.location.href = link;
                        }
                    }
                }
            }
        });
    }

    $(window).resize(function () {
        $(".card-gallery").each(function(){
            $(this).find(".card-gallery-content").each(function(){
                $(this).removeAttr("style");
            });
        });
        // setCardHeight();
    });
    var pageTitle=$("#header").attr('data-page-title')
    $('.card-gallery .card-gallery-content-desc a').unbind().on('click',function(e){
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
            var analyticsData=$(this).text()+"::Card Gallery::跳转页面::[complete-link]"+$(this).attr('href')+"::"+pageTitle
            HiAnalyticsCn.clickDown( analyticsData)
    })
    $('.card-gallery .card-gallery-content').unbind('click').on('click',function(){
            var href=$(this).attr('data-href')
            var analyticsStr=$(this).attr('data-analytics')
            href ? HiAnalyticsCn.clickDown( analyticsStr) : false;
    })

    //统一每行card gallery的高度
    // function setCardHeight(){
    //     $(".card-gallery").each(function(){
    //         var height;
    //         $(this).find(".card-gallery-content").each(function(){
    //             $(this).height('auto');
    //             var h = $(this).height();
    //             if(height){
    //                 height = height > h ? height :h;

    //             }else{
    //                 height = h;
    //             }
    //         });
            
    //         $(this).find(".card-gallery-content").each(function(){
    //             $(this).height(height);
    //         });
    //     });
    // }
    
    //无链接无交互
    function initCATHover() {
        $('.card-gallery-wrapper-check .card-gallery-content').each(function (index,item) {
            if(!$(this).attr('data-href')){
                $(this).addClass('no-link');
                $(this).find('.card-gallery-content-img').addClass('no-link')
            }
        })
    }

    $(document).ready(function(){
        initPaddingTop();
        addClassforCn();
        // setTimeout(setCardHeight, 1000);
        // hoverLearnMore()
        openLink();
        initCATHover();

        // $('.mult-tabs-container-comp').on('multi-tabs-change', function() {
        //     setCardHeight();
        // });
        $('.card-gallery-modal').on('show.bs.modal', function (e) {
            e.stopPropagation();
        })
        var userType = $(".needLogin").attr("data-userType");
        var cardGallery = $(".card-gallery-wrapper-check");
        if(cardGallery.length > 0 && $(".needLogin").length > 0 && userType != undefined){
            var runMode = getLoginCookie("wcmmode");
            if(runMode == "edit" || runMode =="preview"){
                return;
            }
            var hikId = $.cookie("HIKID");
            try {
                hikId = atob(hikId);
            } catch (error) {
                console.log("Login Error:" + error);
            }
            cardGallery.each(function(){
                var thisCardPath = $(this).attr("data-card-gallery");
                var currentPagePath = $(this).attr("data-page-path");
                var showCardGalleryUrl = thisCardPath + ".usertype.json";
                if(thisCardPath){
                    $.ajax({
                        type: "GET",
                        url: showCardGalleryUrl,
                        data: {
                            hikId: hikId,
                            currentPagePath: currentPagePath
                        },
                        success: function(data){
                            var jsonData = typeof data=="string" ? JSON.parse(data):data;
                            if(jsonData.code == 200){
                                $("[data-card-gallery='"+thisCardPath+"']").append($(unescape(jsonData.protectedComponent)));
                                openLink();
                            }
                        }
                    });
                }

            })

        }
    })
})(document, $);

$(document).ready(function() {
  // Bind tab click event
  var $tabItems = $(".side-nav .side-nav-item a");
  $tabItems.click(function() {
    $(this).tab("show");
  });

  // Activate tab by hash
  var hash = window.location.hash;
  var tabNames = $.map($tabItems, function(item) {
    return $(item).attr("href");
  });
  if (hash && tabNames.indexOf(hash) > -1) {
    $(".side-nav .side-nav-item a[href='" + hash + "']").tab("show");
  } else {
    $(".side-nav .side-nav-item:first-child a").tab("show");
  }

  var userCenter = $('.user-center-wrapper').length;
  if(userCenter > 0){
    $('.link-logout, .logout').on('click',function(){
      $('.personal-information-content').css('visibility','hidden');
    })
  }

});

$(document).ready(function() {
    setTimeout(function(){
        showLoading() 
    }, 1000)
    var userInfo = {};
    var userInfoUrl = $(".personal-information-content").attr("data-personal-information-path");
    var ssoCheckParameters = {
        "ticket": getLoginCookie("ticket"),
        "service": getServiceUrl()
    }
    var verifyTicket = function(){
        var hikId = $.cookie("HIKID");
        //ticket 有效
        try {
          hikId = atob(hikId);
        } catch (error) {
          console.log("Login Error:" + error);
        }
        var params = $.extend({},{hikId:hikId},ssoCheckParameters);
        var getInfoPath =  window.location.pathname.replace(".html","");
        if(getInfoPath.indexOf("/content/hikvision") < 0){
            getInfoPath = "/content/hikvision" + getInfoPath;
        }
        $.ajax({
            type : "GET",
            url : getInfoPath + ".getUserInfo.json",
            data : params,
            dataType : "json",
            success : function(resp) {
                if(resp.data.code==0) {
                    userInfo = resp.data.data;
                    renderUserInfo(userInfo);
                    if(userInfo && userInfo.deleteUrl){
                        var logoutUrl = $(".link-logout").attr("href");
                        //var logoutHost = logoutUrl ? logoutUrl.split("?")[0] : "";
                        var deleteUrl = userInfo.deleteUrl + "?hikId=" + hikId + "&logoutUrl=" + encodeURI(logoutUrl);
                        $("#personal-information-delete-link").attr("href", deleteUrl)
                    }
                }
            },
            error : function() {
                console.log("get user info by hikId failed");
            }
        });
    }


    //提交用户信息修改
    $("#personal-information-form-submit").on("click", function(e) {
        e.preventDefault();
        $(".personal-information-form-submit-error").hide();
        var formVaild = $(".personal-information-form").valid();
        var selectVaild = validSelect("personal-information-form-country") & validSelect("personal-information-form-customer-type");
        if(formVaild && selectVaild){
            submitUserInfo();
        }
    });

    var submitUserInfo = function(){
        //获取用户信息
        // userInfo.userName = $('#personal-information-form-username').val();
         showLoading(true);
        userInfo.phone = $('#personal-information-form-phone').val();
        userInfo.customerType = $('#personal-information-form-customer-type').val();
        userInfo.company = $('#personal-information-form-company').val();
        userInfo.phoneAreaCode = $('#personal-information-form-phone-code').val();
        userInfo.province = $('#personal-information-form-province').val();
        userInfo.city = $('#personal-information-form-city').val();
        userInfo.postcode = $('#personal-information-form-postcode').val();
        userInfo.address = $('#personal-information-form-address').val();
        userInfo.countryCode = $('#personal-information-form-country').val();
        userInfo.country = $('#personal-information-form-country-name').val();
        // userInfo.userImage = $('#personal-information-user-image').attr("src");
        //提交表单
        var params = $.extend({},{userInfo:JSON.stringify(userInfo)},ssoCheckParameters);
        var headers = getFormHeader($(".personal-information-form"));
        $.ajax({
            type : "POST",
            url : userInfoUrl +".editUserInfo.json",
            data : params,
            beforeSend: function (request) {
                if (headers) {
                    $(headers).each(function (index, item) {
                        request.setRequestHeader(item.key, item.value);
                    });
                }
            },
            dataType : "json",
            success : function(resp) {
              //  showLoading(false)
                if(resp.data.code==0) {
                    $("#editUserInfoModel").modal("show");
                }else{
                    $(".personal-information-form-submit-error").show();
                }
            },
            error : function() {
               // showLoading(false)
                $(".personal-information-form-submit-error").show();
            }
        }).complete(function(XMLHttpRequest, status){
          // for at event
          var module = $("#personal-information-form-submit").data('at-module');
          module = module + atModel.atSpliter + window.location.href;
          atModel.doAtEvent(module, 'action', event);
          setTimeout(function(){
            showLoading(false);
            $('.close').trigger('click')
          }, 500)
        });
    };

    var renderUserInfo = function(userInfo){
        $('#personal-information-form-email').val(userInfo.email);
        $('#personal-information-form-username').val(userInfo.userName);
        $('#personal-information-form-phone').val(userInfo.phone);
        $('#personal-information-form-company').val(userInfo.company);
        $('#personal-information-form-province').val(userInfo.province);
        $('#personal-information-form-city').val(userInfo.city);
        $('#personal-information-form-postcode').val(userInfo.postcode);
        $('#personal-information-form-address').val(userInfo.address);
//        $('#personal-information-form-phone-code').find("option[value='"+userInfo.countryCode+"']").attr("selected",true);
        $('#personal-information-form-phone-code').val(userInfo.phoneAreaCode);
        //bootstrap select 赋值
        $('#personal-information-form-customer-type').val(userInfo.customerType);
        $('#personal-information-form-customer-type').selectpicker('render');
        $('#personal-information-form-country').val(userInfo.countryCode);
        $('#personal-information-form-country').selectpicker('render');
        $('#personal-information-form-country-name').val(userInfo.country);
//        if(userInfo.userImage){
//            $('#personal-information-user-image').attr("src", userInfo.userImage);
//        }
    }
    if(userInfoUrl){
        verifyTicket();
    }
    //启用bootstrap-select插件，解决option字符过长导致下拉框宽度超过select元素
    $('.select-picker').selectpicker();
    //customer-type/country非空验证
    var validSelect = function(selectClass){
        var selectVal = $("#" + selectClass).val();
        $("#" + selectClass + "-error").remove();
        if(!selectVal){
            $("#" + selectClass).parent().after("<label id='" + selectClass + "-error' class='error'"
                + "for='"+selectClass+"'>This field is required.</label>");
            return false;
        }else{
            return true;
        }
    }
    $("#personal-information-form-country").on("change",function(){
        validSelect("personal-information-form-country");
        var countryCode = $("#personal-information-form-country").find("option:selected").text();
        $('#personal-information-form-country-name').val(countryCode);
    });
    $("#personal-information-form-customer-type").on("change",function(){
        validSelect("personal-information-form-customer-type");
    });
});
//表单限制输入部分特殊字符
var inputLimit = function(value){
    var reg = /[\@\_\!\|\~\`\%\+\=\/\$\%\^\&\*\{\}\:\;\"\<\>\?\\\(\)\（\）]/g;
    return value.replace(reg,'');
};
function showLoading(show) {
    if (show) {
        $('.personal-information-form-submit').addClass('loading')
        $('.personal-information-form-submit').attr('disabled', true)
    } else {
        $('.personal-information-form-submit').removeClass('loading')
        $('.personal-information-form-submit').removeAttr('disabled')
    }
  }
$(document).ready(function() {
    var tabID = $(".my-collection").parent().attr("id");
    var currentPath = window.location.pathname;
    currentPath = currentPath.indexOf("/content/hikvision")>-1 ?currentPath:"/content/hikvision"+currentPath;
    var requestUrl = $(".my-collection-list").attr("data-my-collection-list-path");
    var getListUrl = requestUrl + ".getMyFavoritesList.json";
    var removeProductUrl = requestUrl + ".removeProduct.json";
    var pageNum = 1,
        pageSize = 10;
    var i18n_next = Granite.I18n.get("next");
    var i18n_back = Granite.I18n.get("back");
    var ssoCheckParameters = {
        "ticket": getLoginCookie("ticket"),
        "service": getServiceUrl()
    }

    var pagination = function(totalNum,pageNum) {
        $(".my-collection .holder").pagination({
            items: totalNum,
            itemsOnPage: pageSize,
            cssStyle: "light-theme",
            currentPage: pageNum,
            edges: 1,
            useAnchors: false,
            prevText: i18n_back,
            nextText: i18n_next,
            onPageClick: function(currentPageNumber) {
                getMyCollectionList(currentPageNumber);
            }
        })
    };
    function getLoginCookie1 (name) {
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
    var isPaged = function() {
        return $("#" + tabID+" .holder").find(".jp-current").length !== 0;
    };

    var isSwitchToMyCollection = function($tabPane) {
        return $(".my-collection").length >0;
    };

    $("a.side-nav-item-inner").on("shown.bs.tab", function(e) {
        var $tab = $(e.target);
        var $tabPane = $($.find($tab.attr("href")));
        if($(".my-collection").parent().hasClass("show")){
            getMyCollectionList(pageNum);
        }
    });

    var renderMyCollectionList = function(total, source, pageNum){
        var html = $("#my-collection-template").html();
        var template = Handlebars.compile(html);
        if(total > 0){
            var content = template(source);
            $('#my-collection-list').empty().html(content);
            pagination(total,pageNum);
            deleteCollectionItem();
            globalSettings.init();
        }else{
            var emptyHtml = $('.my-collection-empty-hidden .my-collection-empty').clone();
            $('#my-collection-list').empty().html(emptyHtml);
        }
        if(total > pageSize){
            $(".holder").show();
        }else{
            $(".holder").hide();
        }

    };

    var getMyCollectionList= function(pageNum){
        var params ={
            "hikId": getHikId(),
            "site": getSiteCode(),
            "pageNum": pageNum,
            "pageSize": pageSize,
            "orderByColumn":"creationTime",
            "orderBySort": "desc"
        };
        params = $.extend({},params,ssoCheckParameters);
        //按照收藏时间倒叙排列
        var success = function(resp){
            if(resp.data.code==0 || resp.data.code==200) {
                console.log("Get My Favorites success");
                var source = resp.data.data.rows;
                $.each(source, function (n, value){
                    value.details = Granite.I18n.get("Details");
                    value.remove = Granite.I18n.get("Remove");
                });
                renderMyCollectionList(resp.data.data.total, source, pageNum);
            }else{
                console.log("Get My Favorites failed. Error message: "+ resp.data.message);
            }
        }

        var error = function(){
            console.log("Get My Favorites failed");
        }
        loginUtil.requestServerData("GET", getListUrl, params, success, error);
    };

    var deleteCollectionItem = function(){
        $(".collection-card-content-remove-btn").on("click", function() {
            removeMyFavorites($(this));
        });
    };

    var removeMyFavorites = function(removeProduct){
        var pageNum = $(".simple-pagination .active .current").html();
        var productNumber = removeProduct.attr("data-number");
        var path = removeProduct.attr("data-page");
        pageNum = $(".collection-card").length == 1 && pageNum > 1 ? pageNum-1 : pageNum;
        if(productNumber&&path){
            var product = {
                "hikId": getHikId(),
                "site": getSiteCode(),
                "productNumber": productNumber,
                "page": path
            };
            var params =$.extend({},{
                "product" : JSON.stringify(product)
            },ssoCheckParameters);
            var success = function(resp){
                if(resp.data.code==0) {
                    console.log("remove To My Favorites success");
                    getMyCollectionList(pageNum);
                }else{
                    console.log("remove To My Favorites failed. Error message: "+ resp.data.message);
                }
            }

            var error = function(){
                console.log("remove To My Favorites failed");
            }
            loginUtil.requestServerData("POST", removeProductUrl, params, success, error);
        }
    };

    var getHikId = function(){
        var hikId = $.cookie("HIKID");
        //ticket 有效
        try {
            hikId = atob(hikId);
        } catch (error) {
            console.log("Login Error:" + error);
        }
        return hikId;
    }

    var getSiteCode = function(){
        var regex = new RegExp('/hikvision/(.*?)/'),
            language = regex.exec(currentPath + '/');
        return decodeURIComponent(language[1]);
    }

    if($(".my-collection").parent().hasClass("show")){
        getMyCollectionList(pageNum);
    }

});
/* pagination -- number of items per page */
var trainingListModule = (function ($) {
    var trainingList = {};

    trainingList.init = function(){
        $(document).ready(function () {
            $(".traininglist").find('.holder').jPages({
                containerID: "training-list",
                perPage: 10,
                previous: "Back",
                next: "NEXT",
                keyBrowse: true,
                animation: "slideInRight"
            });
        });
    };
    

    return trainingList;
}($));

trainingListModule.init();
$(document).ready(function () {
  var flag = true
  function getCurrentBreakPoint() {
    var contentValue = window.getComputedStyle(
      document.querySelector('.ai-campaign-sketch-container'), '::before'
    ).getPropertyValue('content');
    return contentValue.replace(/\"/g, '');
  }


  /*
  * 下列方法的变量说明：
  * zoom : 150vh
  * container : 100vh
  * a : zoom顶部距离浏览器工作区顶端的距离
  * b : zoom底部距离浏览器工作区顶端的距离
  * c : container的高度
  * d : 工作区的一半高度
  * e : zoom的高度
  * wh : 工作区高度
  * ww : 工作区宽度
  * ih ：图片高度
  * iw : 图片宽度
  */
  function initOverlayRegion($comp) {
    var $stickyZoom = $comp.find('.sticky-zoom');
    var $overlay = $stickyZoom.find('.overlay');
    var a = $stickyZoom.offset().top - $(window).scrollTop();
    var d = $(window).height() / 2;
    var widthRate = 0.2;
    if (a <= 100) {
      $overlay.css({ "width": 0 });
    } else if (a >= d) {
      widthRate = 0.2 * 100 + "%";
      $overlay.css({ "width": widthRate });
    } else {
      widthRate = ((1 - (d - a) / d) * 0.2) * 100 + "%";
      $overlay.css({ "width": widthRate });
    }
  }

  function initContainerPosition($comp) {
    var $stickyZoom = $comp.find('.sticky-zoom');
    var $stickyContainer = $stickyZoom.find('.sticky-container');
    var a = $stickyZoom.offset().top - $(window).scrollTop();
    var b = $stickyZoom.height() + a;
    var c = $stickyContainer.height();
    if (a <= 0 && b > c) {
      $stickyContainer.addClass('sticky-state');
      $stickyContainer.removeClass('sticky-to-bottom');
    } else {
      if (b <= c) {
        $stickyContainer.addClass('sticky-to-bottom');
      } else {
        $stickyContainer.removeClass('sticky-to-bottom');
      }
      $stickyContainer.removeClass('sticky-state');
    }
  }

  function initTextState($comp) {
    var $stickyZoom = $comp.find('.sticky-zoom');
    var $textContaienr = $stickyZoom.find('.text-container');
    var a = $stickyZoom.offset().top - $(window).scrollTop();
    if (Math.abs(a) < 250) {
      $textContaienr.addClass('display-text');
    } else {
      $textContaienr.removeClass('display-text');
    }
  }

  function calcScale(rate, a, c, e) {
    return rate - Math.abs(a) / (e - c) * (rate - 1);
  }
  function calScaleRate(a, b, c, e, ih, iw) {
    var wh = $(window).height() + 150;  //+150
    var ww = $(window).width() + 150;
    var rh = wh / ih;
    var rw = ww / iw;
    if (a >= 0) {
      return Math.max(rh, rw);
    } else if (b > c) {
      return rh > rw ? calcScale(rh, a, c, e) : calcScale(rw, a, c, e);
    }
    return 1;
  }

  function initImageSize($comp) {
    var $stickyZoom = $comp.find('.sticky-zoom');
    var $imgContainer = $stickyZoom.find('.img-container');
    var $stickyContainer = $stickyZoom.find('.sticky-container');
    var a = $stickyZoom.offset().top - $(window).scrollTop();
    var b = $stickyZoom.height() + a;
    var c = $stickyContainer.height();
    var e = $stickyZoom.height();
    var ih = $imgContainer.height();
    var iw = $imgContainer.width();
    var scaleRate = calScaleRate(a, b, c, e, ih, iw);
    var scale = "scale(" + scaleRate + "," + scaleRate + ")";
    $imgContainer.css({ "transform": scale });
  }

  function initDescriptionState($comp) {
    var $desWrapper = $comp.find('.description-wrapper');
    var toTop = $desWrapper.offset().top - $(window).scrollTop();
    if (toTop < ($(window).height())) {
      $desWrapper.addClass('display-description');
    } else {
      $desWrapper.removeClass('display-description');
    }
  }
  /***** */
  function initInMobile($comp) {
    $comp.find('.img-container').css({ "transform": "scale(2.7,2.7)" });
    console.log("MOBILE")
  }
  function stop() {
    var mo = function (e) { passive: false; }
    document.body.style.overflow = "hidden"
    document.addEventListener("touchmove", mo, false) // 禁止页面滚动
  }
  function move() {
    var mo = function (e) { passive: false; }
    document.body.style.overflow = ""
    document.addEventListener("touchmove", mo, false)
  }
  var flag = true
  function initMobileContainerPosition($comp) {
    var $stickyZoom = $comp.find('.sticky-zoom');
    var $desWrapper = $comp.find('.description-wrapper');
    var a = $stickyZoom.offset().top - $(window).scrollTop();
    if (a > 0 && flag) {
      flag = false
      $desWrapper.removeClass("moble-color")
      $comp.find('.img-container').css({ "height": $(window).height() - a + "px", "backgroundSize": "cover", "padding": "0" });
      $comp.css({ "background": "none",  "height": Math.floor($(window).height()) + "px", "overflow": "none", "height": "auto", "paddingBottom": "0" })
      $comp.find('.text-container').css({ "opacity": "1", "transition": "opacity 0.2s" ,"color":"#f8f8f8"})
      $comp.find('.sticky-container').css({ "width": "90%", "transition": "width 0.3s ease" })
      $desWrapper.css({ 'opacity': '0', "transition": "opacity 0.1s ease" })
      flag = true
    } else {
      flag = false
      var compHeight = $comp.find(".sticky-zoom").height()+$comp.find(".description-wrapper.moble-color").height()
      $desWrapper.addClass("moble-color")
      $comp.find('.sticky-container').css({ "width": "90%", "transition": "width 0.3s ease" })
      $comp.find('.text-container').css({ "opacity": "0", "transition": "opacity 0.2s" })
      $comp.find('.img-container').css({ "height": "300px", "backgroundSize": "cover", "padding": "0" });
      $comp.css({ "background": "#000000", "height":Math.floor($(window).height())+a > compHeight +50 ? Math.floor($(window).height())+a :  compHeight +50 + "px", "overflowY": "none", "paddingBottom": "50px" })
      $desWrapper.css({ 'opacity': '1', "transition": "opacity 0.1s ease" })
      if($comp.find('.img-container').height() == 300){
        flag = true
      }
    }
  }

  function aiCompState($comp) {
    if (getCurrentBreakPoint() !== 'MOBILE') {
      initContainerPosition($comp);
      initOverlayRegion($comp);
      initImageSize($comp);
      initTextState($comp);
      initDescriptionState($comp);
    } else {
      // initInMobile($comp);
      initMobileContainerPosition($comp)
    }
  }


  $('.ai-campaign-sketch-container').each(function () {
    var $comp = $(this);
    aiCompState($comp);

    $(window).resize(function () {
      aiCompState($comp);
    });

    $(window).scroll(function () {
      aiCompState($comp);
    });
  });
});
$(document).ready(function () {
    $('.icon-feature-gallery-wrapper').each(function () {
        let $this = $(this)
        let $thisParent=$(this).parent('.icon-and-feature-gallery')
        let cardLength = $(this).find('.hiknow-link').length;
        let $prevButton = $(this).find('.button.btn_prev')
        let $nextButton = $(this).find('.button.btn_next')
        let $content = $(this).find('.icon-feature-gallery-content')
        let count = 0;
        let offset11 = 290;//单位偏移长度
        var mobileWidth = 992
        // 最大可偏移
        let maxOffset = cardLength * offset11 - 1310;

        initOffset();
        init()
        initHikCardEvent()
        initArrowDiaplayEvent()
        initArrowClickEvent()
        // 监听窗口大小  改变偏移量offset11
        $(window).resize(function () {
            initOffset();
        })
        function initOffset(){
            if ($(window).width() >= 1370) {
                offset11 = 290
                maxOffset = cardLength * offset11 - 1310;
                $content.animate({ left: '-' + offset11 * count + 'px' });
            }else if ($(window).width() < 1370 && $(window).width() >= 992 ){
                offset11 = 280
                maxOffset = cardLength * offset11 - ($(window).width() - 60)
                $content.animate({ left: '-' + offset11 * count + 'px' });
            }else{
                offset11 = 260
                maxOffset = cardLength * offset11 - 15 - ($(window).width() - 30)
                $content.animate({ left: '-' + offset11 * count + 'px' });
            }
        }
        function init () {
            if (cardLength === 4) {
                // 4个时单独样式
                $content.addClass('icon-feature-gallery-content-row-4')
            }
            if (cardLength < 4) {
                $content.addClass('icon-feature-gallery-content-row-center')
            }
    
            //埋点最后一个节点
            $(this).find('.hiknow-link[data-href]').each(function (index, item) {
                var href = $(this).attr('data-href')
                var preModule = $(this).attr('data-pre-module')
                // 判断url地址结尾是不是/
                var isLastUrl = href[href.length - 1] === '/'
                if (isLastUrl) {
                    href = href.slice(0, href.length - 1)
                }
                var lastHrefIndex = href.lastIndexOf('/')
                $(this).attr('data-at-module', preModule + href.slice(lastHrefIndex + 1, href.length))
            })
        }
    
        function initHikCardEvent () {
            $('.hiknow-link[data-href]').each(function () {
                var action = $(this).attr('data-href')
                var target = $(this).attr('target') || '_self'
                $(this).on('click', function () {
                    window.open(action, target);
                })
                $(this).addClass('hiknow-link-hover')
            })
        }
    
        // 控制左右箭头展示
        function initArrowDiaplayEvent () {
            if($(window).width() >= mobileWidth && cardLength > 4){
                $this.on('mouseover', onMouseOver)
                $this.on('mouseleave', onMouseLeave)
            }else if($(window).width() < mobileWidth){
                initMobileButton();
            }

            function onMouseOver () {
                setTimeout(function(){
                    $prevButton.css('display', count == 0 ? "none" : "block")
                    $nextButton.css('display', count >= (cardLength - 4) ? "none" : "block")
                }, 500)
            }
            function onMouseLeave () {
                $prevButton.css('display', 'none')
                $nextButton.css('display', 'none')
            }
            function initMobileButton () {
                $prevButton.css('display', count == 0 ? "none" : "block")
                $nextButton.css('display', cardLength * 260 + 15 < $(window).width() ? "none" : "block")
                cardLength * 260 + 15 < $(window).width() ? $thisParent.addClass('side-blur') : $thisParent.removeClass('side-blur')
            }

        }
    
        // 左右箭头点击事件
        function initArrowClickEvent () {
            // 右箭头点击
            $nextButton.click(function () {
                    if($(window).width() >= mobileWidth){
                        maxOffset = ($(window).width() >= 1370 ? cardLength * offset11 - 1310 : cardLength * offset11 - ($(window).width() - 60))
                    }else{
                        maxOffset = cardLength * offset11 - ($(window).width() - 60) +($(window).width() - 260 - 60)
                    }
                    // 剩余偏移量=最大偏移-已经偏移
                    let waitOffset = maxOffset - count * offset11
                    // 如果剩余偏移量小于当前偏移量
                    if (waitOffset > offset11) {
                        count++;
                        $content.animate({ left: '-' + offset11 * count + 'px' });
                        $nextButton.css('display','block')
                        $prevButton.css('display','block')
                    } else if(waitOffset <= offset11 && waitOffset > 0 ) {
                        $content.animate({ left: '-' + maxOffset + 'px' });
                        $nextButton.css('display','none')
                        $prevButton.css('display','block')
                        $thisParent.addClass('side-blur')
                        count++;
                    }
            });
            
            // 左箭头点击
            $prevButton.click(function () {
                // 剩余偏移量=已经偏移量
                if (count >= 1) {
                    count--;
                    $content.animate({ left: '-' + offset11 * count + 'px' });
                    $prevButton.css('display',count == 0 ? 'none' : 'block')
                    $nextButton.css('display','block')
                    $thisParent.removeClass('side-blur')
                }
            });
            var startX;
            var startY;
            var moveEndX;
            var moveEndY;

            $this.on("touchstart", function (e) {
                startX = e.originalEvent.changedTouches[0].pageX,
                startY = e.originalEvent.changedTouches[0].pageY;
            });
            $this.on("touchend",function(e){
                moveEndX = e.originalEvent.changedTouches[0].pageX
                moveEndY = e.originalEvent.changedTouches[0].pageY
                X = moveEndX - startX
                Y = moveEndY - startY
                if (X > 50) {
                    $prevButton.click()
                }else if (X < -50) {
                    $nextButton.click()
                }
            })
        }
    })

});

