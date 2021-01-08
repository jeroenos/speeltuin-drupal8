(function ($) {
    Drupal.behaviors.bigMenu = {
        attach: function (context, settings) {
            //Change default behaviour of space on menu.
            $(".open-menu, .close-menu, .black-background-menu").keypress(function(e) {
                if (e.which == 32) {
                    if (e.stopPropagation) {
                        e.stopPropagation();
                        e.preventDefault();
                    }
                    return false;
                }
            });
            //Open close menu with space or mouse. 
            $(".open-menu, .close-menu, .black-background-menu").on('click keyup', function (e) {
                isAriaExp = $(".open-menu").attr('aria-expanded');
                newAriaExp = (isAriaExp == "false") ? "true" : "false";
                $(".open-menu").attr('aria-expanded', newAriaExp);

                e.preventDefault();
                
                if (e.which == 1 || e.which == 32 && e.which != 9) {
                    $(".big-menu").toggleClass("open");
                    $(".black-background-menu").toggleClass("show");
                }
                else {
                    return true;
                }
            });
        }
    };
    Drupal.behaviors.menuItems = {
        //Set second menu and increase height of menu if second menu size is bigger. 
        attach: function (context, settings) {
            $(".big-menu .main-navigation .nav-item>a").hover(function() {
                $(".dropdown-menu").removeClass("active");
                $(this).next(".dropdown-menu").addClass("active");
                heightSubmenu = $(this).next(".dropdown-menu").height();
                $(".big-menu, .big-menu .container, .big-menu .row").css("min-height", heightSubmenu);
            });
            $(".big-menu .main-navigation .nav-item>a").focus(function () {
                $(".dropdown-menu").removeClass("active");
                $(this).next(".dropdown-menu").addClass("active");
                heightSubmenu = $(this).next(".dropdown-menu").height();
                $(".big-menu, .big-menu .container, .big-menu .row").css("min-height", heightSubmenu);
            });
        }
    };
    Drupal.behaviors.tabLoop = {
        //if big menu is open, keep focus within big menu.
        attach: function (context, settings) {
            $(".close-menu").keydown(function(e) {
                 if (e.which == 9) {
                    e.preventDefault();
                    $(".open-menu").focus();
                 }
            }) 
        }
    };
})(jQuery);