(function ($) {
    Drupal.behaviors.popup = {
        attach: function (context, settings) {
            $(".storing-modal").each(function (index, value) {
                $(this).attr('id', 'stoModal_' + index);
            });
            $(".storing-button, .onderhoud-button").each(function (index, value) {
                $(this).colorbox({
                    inline: true,
                    width: "700px",
                })
                .attr('href', '#stoModal_' + index );
            }); 
        }
    };
})(jQuery);