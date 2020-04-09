/* global $ */

$.fn.createMobileHeader = function() {
    var defaults = {
            layout: 'init'
        },
        settings = $.extend({}, defaults);

    var $header = this;
    var $html = $('html');
    var $nav = $('#navigation');
    var $main = $('#main');
    var $mainWrapper = $('#mainwrapper');
    var $searchFormWrapper = $('#search .wrapper');
    var $searchForm = $searchFormWrapper.find('form');
    var searchBtnTxtValue = $('#search-submit').val();
    var closeOverlayTxt = $nav.attr('data-closemobilenavtxt') || 'Sluiten';
    var $skipLinkContainer = $('#header').find('.skiplinks');
    var $skiplinkWrapper = '';
    var $mobileToggleBtn = $('#skip-to-menu');
    var $mobileSearchBtn = '';
    var headerHeight = $main.offset().top;
    var navToggleBreakPoint = $(window).width();
    var resizeDirection = '';
    var $navOverlay = '';
    var $navOverlayWrapper = '';
    var windowWidth = $(window).width();
    var initWindowWidth = windowWidth;
    var desktopNavBreakPoint = 0;
    var lastScrollPosition = 0;

    function initNavigation() {
        $nav.settings = settings;
        createSkipLinks();
        setNavType();
        initActions();
        holdFocus();
        createFormClearButton();
    }

    function createElements() {

        if ($('.skiplinkWrapper').length === 0) {

            $skiplinkWrapper = $('<div/>', {
                'class': 'skiplinkWrapper'
            });

            $skipLinkContainer.wrap($skiplinkWrapper);

            $mobileSearchBtn = $('<button/>', {
                'type': 'button',
                'class': 'mobileSearchBtn',
                'text': searchBtnTxtValue
            }).appendTo($skipLinkContainer);

            $navOverlay = $('<div/>', {
                'class': 'navOverlay',
            }).appendTo('body');

            $navOverlayWrapper = $('<div/>', {
                'class': 'navOverlayWrapper'
            }).appendTo($navOverlay);

            $overlayCloseBtn = $('<button/>', {
                'type': 'button',
                'class': 'closeOverlay',
                'text': closeOverlayTxt
            }).appendTo($navOverlayWrapper);

            initButtons();

        }

        $searchForm.appendTo($navOverlayWrapper);
        $nav.appendTo($navOverlayWrapper);

    }

    function initActions() {
        $(window).resize(function() {
            if ($(window).width() != windowWidth) {
                windowWidth = $(window).width();
                setNavType();
            }
        });
    }

    function initButtons() {
        $mobileToggleBtn.on('click', function(e) {
            if ($nav.settings.layout == 'mobile') {
                e.preventDefault();
                // console.log('toggle btn');
                showMobileNav();
            }
        });

        $('.mobileSearchBtn').on('click', function(e) {
            e.preventDefault();
            // console.log('mobile search btn');
            showMobileNav();
        });

        $('.closeOverlay').on('click', function(e) {
            e.preventDefault();
            // console.log('close overlay btn');
            hideMobileNav();
        });

        $('#survey-yes').on('click', function(e) {
            if ($nav.settings.layout == 'mobile') {
                hideMobileNav();
            }
        });

        $('#survey-no').on('click', function(e) {
            if ($nav.settings.layout == 'mobile') {
                hideMobileNav();
            }
        });
    }

    function addStickyHeader() {

        if ($nav.settings.layout === 'mobile') {

            var lastScrollPosition = 0;
            var minScrollDistance = 2;
            var navbarHeight = $('#search').outerHeight();

            $(window).scroll(function(event) {

                var scrollPosition = $(this).scrollTop();
                if ((!$html.hasClass('hasOverlay')) && ($nav.settings.layout === 'mobile')) {
                    if (Math.abs(lastScrollPosition - scrollPosition) > minScrollDistance) {

                        if (scrollPosition > (headerHeight)) {
                            $html.addClass('fixedNav');
                            if (scrollPosition > lastScrollPosition) {
                                $html.removeClass('nav-down').addClass('nav-up');
                            } else if (scrollPosition + $(window).height() < $(document).height()) {
                                $html.removeClass('nav-up').addClass('nav-down');
                            }
                        } else {
                            removeStickyHeader();
                        }
                        lastScrollPosition = scrollPosition;
                    }
                }
            });
        }
    }

    function removeStickyHeader() {
        $html.removeClass('fixedNav');
        $html.removeClass('nav-down');
        $html.removeClass('nav-up');
    }

    function showMobileNav() {

        if ($navOverlayWrapper.find('form').length === 0) {
            $searchForm.appendTo($navOverlayWrapper);
        }
        if ($navOverlayWrapper.find('#navigation').length === 0) {
            $nav.appendTo($navOverlayWrapper);
        }

        var offSet = 0;
        headerHeight = $main.offset().top;

        var navOffset = headerHeight - 44;
        lastScrollPosition = $(window).scrollTop();

        if (!$html.hasClass('fixedNav')) {
            offSet = navOffset;
        }

        $html.addClass('hasOverlay');
        $navOverlay.show();
        $nav.addClass('show');
        $navOverlay.css('top', offSet + 'px');

        var windowHeight = $(window).height();
        // var bodyHeight = offSet + basicOverlayHeight;        

        var extraBarsSpace = 0;
        if ($('.message.survey').length > 0) {
            extraBarsSpace = extraBarsSpace + $('.message.survey').outerHeight(true);
        }
        if ($('.message.cookie').length > 0) {
            extraBarsSpace = extraBarsSpace + $('.message.cookie').outerHeight(true);
        }

        var viewportHeight = windowHeight - extraBarsSpace;
        var overlayHeight = windowHeight;

        if (!$html.hasClass('fixedNav')) {
            // overlay moet aansluiten op header
            viewportHeight = (windowHeight + lastScrollPosition) - extraBarsSpace;
            overlayHeight = (viewportHeight - offSet) + extraBarsSpace;

            $mainWrapper.css('height', viewportHeight + 'px');
            $navOverlay.css('height', overlayHeight + 'px');

        } else {
            // overlay moet pagina bedekken
            $mainWrapper.css('height', viewportHeight + 'px');
            $navOverlay.css('height', overlayHeight + 'px');
        }

        if ($html.hasClass('fixedNav')) {
            $(window).scrollTop(0);
        }
    }

    function hideMobileNav() {

        $mainWrapper.css('height', 'auto');
        $html.removeClass('hasOverlay');
        $navOverlay.hide();
        $nav.removeClass('show');

        if (lastScrollPosition !== 0) {
            $(window).scrollTop(lastScrollPosition);
        }
    }

    function holdFocus() {
        document.addEventListener('focus', function(event) {
            if ($navOverlay !== '') {
                if ($html.hasClass('hasOverlay')) {
                    if (!$navOverlay[0].contains(event.target)) {
                        event.preventDefault();
                        $('.closeOverlay').focus();
                    }
                }
            }
        }, true);
    }

    function createSkipLinks() {
        var $prefixTxtContainer = $skipLinkContainer.find('span').first();
        $prefixTxtContainer.remove();
        $skipLinkContainer.find('a').prepend('<span>' + $prefixTxtContainer.html() + '</span> ');
    }

    function createFormClearButton() {
        var $inputField = $('#search-keyword');

        var $inputWrapper = $('<div/>', {
            'class': 'clearFieldWrapper',
            'html': ''
        });

        $inputField.wrap($inputWrapper);

        var $clearBtn = $('<button/>', {
            'class': 'clearField',
            'type': 'button',
            'html': 'invoer wissen'
        }).insertAfter($inputField);

        $clearBtn.on('click', function() {
            $inputField.val('').focus();
            $(this).removeClass('active');
        });

        if ($inputField.val() !== '') {
            $clearBtn.addClass('active');
        } else {
            $clearBtn.removeClass('active');
        }

        $inputField.keyup(function() {
            if ($(this).val() !== '') {
                $clearBtn.addClass('active');
            } else {
                $clearBtn.removeClass('active');
            }
        });
    }

    function setNavType() {
        if ($nav.hasClass('show')) {
            hideMobileNav();
        }

        if ($html.hasClass('nav-down')) {
            $html.removeClass('nav-down').addClass('nav-up');
        }

        if ((Core.viewport === 'screen-sm') || (Core.viewport === 'screen-xs') || (Core.viewport === 'screen-xxs') || forceNavToMobile()) {
            if ($nav.settings.layout !== 'mobile') {
                createElements();
            }
            $nav.settings.layout = 'mobile';
            addStickyHeader();
        } else {
            $nav.settings.layout = 'desktop';
            removeStickyHeader();
            $mobileToggleBtn.blur();
            $nav.appendTo($main);
            $searchForm.appendTo($searchFormWrapper);
        }
    }

    function forceNavToMobile() {
        $html.removeClass('fixeMobileNav');
        $nav.appendTo($main);
        $searchForm.appendTo($searchFormWrapper);
        var navBarWidth = $nav.find('ul').innerWidth();
        var wrapperWidth = $nav.find('.wrapper').innerWidth();
        var searchBarWidth = $('#search-form').innerWidth();
        var spaceLeft = wrapperWidth - (navBarWidth + searchBarWidth);

        if (spaceLeft < 10) {
            $html.addClass('fixeMobileNav');
            return true;
        }
    }

    initNavigation();
};

$.fn.createSearchBar = function() {
    var $body = $('body');
    var $search = $('#searchForm');
    var $searchInput = $search.find('.searchInput');
    var $searchButton = $search.find('.searchSubmit');
    var screenType = window.getComputedStyle(document.body, ':after').getPropertyValue('content') || 'desktop';
    var opened = false;

    function initSearchBar() {
        clearSearchInput(); // clear search when backwards in browser
        $(window).on('orientationchange resize', function() {
            setScreenType();
            initSearch();
        }).resize();
        if (!$search.hasClass('initSearch')) {
            $searchButton.on('click', function(ev) {
                ev.preventDefault();
                if ($searchInput.val() !== '') {
                    $search.find('form').submit();
                } else if (!opened && !$searchInput.is(':focus')) {
                    searchOpen();
                    $searchInput.focus();
                } else {
                    searchClose();
                }
            });
            $searchInput.on('blur', function() {
                if (!$search.is(':hover')) {
                    searchClose();
                }
            });
            $(window).on('scroll', function() {
                if ($search.hasClass('searchOpened')) {
                    searchClose();
                }
            });
        } else {
            $searchButton.on('click', function(ev) {
                ev.preventDefault();
                if ($searchInput.val() !== '') {
                    $search.find('form').submit();
                }
            });
        }
    }

    function initSearch() {
        if ($body.hasClass('home') || (screenType === "\"mobile\"")) {
            if ($body.hasClass('home')) {
                $search.addClass('initSearch');
            }
            searchOpen();
        } else {
            searchClose();
        }
    }

    function setScreenType() {
        screenType = window.getComputedStyle(document.body, ':after').getPropertyValue('content') || 'desktop';
    }

    function clearSearchInput() {
        $searchInput.val("");
    }

    function searchOpen() {
        $search.addClass('searchOpened');
        $searchButton.attr("title", $search.data('search-opened'));
        $searchButton.html($search.data('search-opened'));
        opened = true;
    }

    function searchClose() {
        $searchButton.attr("title", $search.attr('data-search-closed'));
        $searchButton.html($search.attr('data-search-closed'));
        $search.removeClass('searchOpened');
        clearSearchInput();
        opened = false;
    }

    initSearchBar();
};


$.fn.createSkipLinks = function() {
    var $skiplinks = $(this);

    function initSkipLinks(){
        var $prefixTxtContainer = $skiplinks.find('span').first();
        $prefixTxtContainer.remove();
        $skiplinks.find('a').prepend('<span>' + $prefixTxtContainer.html() + '</span> ');
    }

    initSkipLinks();
};

$(window).load(function() {
    // OlD UX
    if ($('#navigation').length > 0) {
        $('#header').createMobileHeader();
    }
    // NEW UX
    if ($('#navBar').length > 0) {
        $('.search').createSearchBar();
        $('.skiplinks').createSkipLinks();
    }
});
