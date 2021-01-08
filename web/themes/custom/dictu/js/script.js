(function ($) {
    Drupal.behaviors.dienstenPage = {
        attach: function (context, settings) {
            $('a.blok-display').click(function (e) {
                e.preventDefault();
                $(this).parent().parent().addClass('blok-display').removeClass('list-display');
            });
            $('a.list-display').click(function (e) {
                e.preventDefault();
                $(this).parent().parent().addClass('list-display').removeClass('blok-display');
            });
        }
    };

    Drupal.behaviors.print = {
        attach: function (context, settings) {
            // find the class
            $('.print-link').click(function (e) {
                e.preventDefault();
                window.print();
                //stops a 2nd trigger
                e.stopPropagation();
            });

            $('.top-link').click(function () {
                $('html, body').animate({scrollTop: 0}, "slow");
                return false;
            });

        }
    };

})(jQuery);

jQuery(document).ready(function ($) {

    /************************
     **** Responsive menu ****
     *************************/
    $("button.navbar-toggler").click(function () {
        // Slides menu open & close
        $(".navbar-toggleable-md").slideToggle("slow");

        // Changes text for accesibility.
        if ($(this).find('.sr-only').html() == "Ingeklapt") {
            $(this).find('.sr-only').html('Uitgeklapt');
        }
        else {
            $(this).find('.sr-only').html('Ingeklapt');
        }
    });

    if (!$(".navbar-branded-light li.nav-item").hasClass("is-active")) {
        $(".navbar-branded-light ul.nav").append('<li class="is-active link-style">' + Drupal.t('Open submenu') + '</li>');
    }

    $(".navbar-branded-light li.is-active").click(function () {
        $(".navbar-branded-light").find("li.nav-item").not("li.is-active").slideToggle();
    });

    /************************
     ****  FAQ Open/Close ****
     *************************/
    $(".accordion-head").click(function (e) {
        e.preventDefault();
        $control = $(this);
        $(this).next('.accordion-content').slideToggle();
        $(this).toggleClass("open");
        isAriaExp = $control.attr('aria-expanded');
        newAriaExp = (isAriaExp == "false") ? "true" : "false";
        $(this).attr('aria-expanded', newAriaExp);
    });

    //close status message
    $('#close-status-message').click(function (e) {
        e.preventDefault();
        $('.alert').hide();
    });

});
