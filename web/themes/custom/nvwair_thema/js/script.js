(function ($) {
    Drupal.behaviors.leafletAdjustment = {
        attach: function (context, settings) {
            $(document).bind('leaflet.map', function (event, map, lMap) {
                lMap.scrollWheelZoom.disable();

                lMap.on('click', function () {
                    if (lMap.scrollWheelZoom.enabled()) {
                        lMap.scrollWheelZoom.disable();
                    }
                    else {
                        lMap.scrollWheelZoom.enable();
                    }
                });
            });
        }
    }
    Drupal.behaviors.leafletDisableTools = {
        attach: function (context, settings) {
            $(document).bind('leaflet.map', function (event, map, lMap) {
                if ($(".page-node-type-toezichtsobject")[0]) {
                    lMap.zoomControl.remove();
                }
            });
        }
    }
     Drupal.behaviors.switchMapFilter = {
        attach: function (context, settings) {
            $("#toezichtFilter .listMapSwitch").on("click", function (e) {
                if ($(this).hasClass(".is-active")) {
                    e.preventDefault();
                }
                else {
                    e.preventDefault();
                    $(this).addClass("is-active");
                    if($(this).hasClass('map')) {
                        $('#toezichtFilter .list').removeClass("is-active");
                        $(".bedrijfsinspecie-wrapper").addClass("close");
                        $(".inspectiersultaten-leaflet").addClass("open");
                        localStorage.setItem('map', 'open');

                    }
                    else if ($(this).hasClass('list')) {
                        $('#toezichtFilter .map').removeClass("is-active");
                        $(".bedrijfsinspecie-wrapper").removeClass("close");
                        $(".inspectiersultaten-leaflet").removeClass("open");
                        localStorage.clear();
                    }
                }

            });
        }
    }

    Drupal.behaviors.autoSubmitIE11Fix = {
      attach: function (context, settings) {
        $("form[data-bef-auto-submit-full-form] input[data-bef-auto-submit-exclude]").on("keyup", function (e) {
          var code = e.keyCode || e.which;
          // Enter keycode.
          if(code == 13) {
            $(this).closest('form').find('[data-bef-auto-submit-click]').click();
            e.preventDefault();
          }
        });
      }
    }

    Drupal.behaviors.getLocalStorageMap = {
        attach: function (context, settings) {
            var map = localStorage.getItem('map');
            if (map == 'open') {
                $('.inspectiersultaten-leaflet').addClass(map);
                $('#toezichtFilter .list').removeClass("is-active");
                $(".map").addClass("is-active");
                $(".bedrijfsinspecie-wrapper").addClass("close");
                console.log("hello");
            }
        }
    }
}(jQuery));

jQuery(document).ready(function ($) {
    $(".accordion-head").click(function (e) {
        e.preventDefault();
        $control = $(this);
        $(this).next('.accordion-content').slideToggle();
        $(this).toggleClass("open");
        isAriaExp = $control.attr('aria-expanded');
        newAriaExp = (isAriaExp == "false") ? "true" : "false";
        $(this).attr('aria-expanded', newAriaExp);
    });

    $('.paragraph--type--onderwerp').has('.niet-beoordeeld').addClass("wrapper-niet-beoordeeld");
});
