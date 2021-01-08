(function ($) {
    Drupal.behaviors.heroBanner = {
        attach: function (context, settings) {
            $('.herobanner-description').mouseover(function () {
               
                $(".herobanner-description").closest("li").removeClass("act");
                $(this).closest("li").addClass("act");

            });
            $('.herobanner-title a').focus(function () {
                $(".herobanner-description").closest("li").removeClass("act");
                $(this).closest("li").addClass("act");
            });
       
        }
    };
})(jQuery);