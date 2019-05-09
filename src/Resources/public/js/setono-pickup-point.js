(function ($) {
  'use strict';

  $.fn.extend({
    findPickupPoints: function () {
      return this.each(function () {
        let $element = $(this);
        let $container = $(this).closest('.item');
        let url = $element.data('pickup-point-provider-url');
        let csrfToken = $element.data('csrf-token');

        if (!url) {
          return;
        }
        addEmptyPickuPoint($container);

        $element.api({
          method: 'GET',
          on: 'change',
          cache: false,
          url: url,
          beforeSend: function (settings) {
            settings.data = {
              _csrf_token: csrfToken
            };

            removePickupPoints($container);
            $container.addClass('loading');

            return settings;
          },
          onSuccess: function (response) {
            addPickupPoints($container, response);
            $('.ui.fluid.selection.dropdown').dropdown('setting', 'onChange', function () {
              let id = ($('.ui.fluid.selection.dropdown').dropdown('get value'));
              let text = ($('.ui.fluid.selection.dropdown').dropdown('get text'));
              let splitString = text.split(', ');
              $(".pickup-point-id").val(id);
              $(".pickup-point-address").val(splitString[1] + ', ' + splitString[0]);
              $(".pickup-point-name").val(splitString[2]);
            });
          },
          onFailure: function (response) {
            console.log(response);
          },
          onComplete: function () {
            $container.removeClass('loading');
          }
        });
      });
    }
  });

  function removePickupPoints($container) {
    $container.find('.pickup-points').remove();
  }

  function addEmptyPickuPoint($container) {
    if (document.querySelector('.ui.fluid.selection.dropdown') == null) {
      let list = '<div class="ui fluid search selection dropdown loading disabled pickup-point-dropdown">' +
          '<input type="hidden" name="pickupPoint">' +
          '<i class="dropdown icon"></i>' +
          '<div class="default text">Vyberte partnerské místo</div>' +
          '<div class="menu">' +
          '</div>' +
          '</div>' +
          '</div>'
      ;

      $container.find('.content .additional').append(list);

      let $dropdown = $('.ui.fluid.selection.dropdown');

      $dropdown.dropdown();

    }

  }

  function addPickupPoints($container, pickupPoints) {
    let list = '';
    pickupPoints.forEach(function (element) {
      list += '<div class="item" data-value="' + element.id + '">';
      list += ' ' + element.city;
      list += ' ' + element.zip_code;
      list += ', ' + element.address;
      list += ', <strong>' + element.name + '</strong>';
      list += '</div>'
    });

    let $dropdown = $('.ui.fluid.selection.dropdown');

    $container.find('.menu').append(list);
    $dropdown.removeClass('loading');
    $dropdown.removeClass('disabled');
    $dropdown.dropdown();

    let id = $(".pickup-point-id").val();

    $dropdown.dropdown('set selected', id);
  }
})(jQuery);