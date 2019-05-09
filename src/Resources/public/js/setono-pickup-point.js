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
        addEmptyPickupPoint($container);

        $element.api({
          method: 'GET',
          on: 'change',
          cache: false,
          url: url,
          beforeSend: function (settings) {
            settings.data = {
              _csrf_token: csrfToken
            };
            let $dropdown = $('.pickup-point-dropdown');
            if ($dropdown.hasClass('fullyloaded')) {
              $element.api('abort');
              return;
            }

            removePickupPoints($container);
            $('.pickup-point-dropdown').addClass('loading');

            return settings;
          },
          onSuccess: function (response) {
            addPickupPoints($container, response);
            let $dropdown = $('.pickup-point-dropdown');
            $dropdown.dropdown('setting', 'onChange', function () {
              let id = ($dropdown.dropdown('get value'));
              let text = ($dropdown.dropdown('get text'));
              let splitString = text.split(', ');
              $(".pickup-point-id").val(id);
              $(".pickup-point-address").val(splitString[1] + ', ' + splitString[0]);
              $(".pickup-point-name").val(splitString[2]);
              $dropdown.addClass('fullyloaded');
            });
          },
          onFailure: function (response) {
            console.log(response);
          },
          onComplete: function () {
            let $dropdown = $('.pickup-point-dropdown');
            $dropdown.removeClass('loading');
          }
        });
      });
    }
  });

  function removePickupPoints($container) {
    $container.find('.pickup-points').remove();
  }

  function addEmptyPickupPoint($container) {
    if (document.querySelector('.pickup-point-dropdown') == null) {
      let list = '<div class="ui fluid search selection dropdown disabled pickup-point-dropdown">' +
          '<input type="hidden" name="pickupPoint">' +
          '<i class="dropdown icon"></i>' +
          '<div class="default text">Vyberte partnerské místo</div>' +
          '<div class="menu">' +
          '</div>' +
          '</div>' +
          '</div>'
      ;

      $container.find('.content .additional').append(list);

      let $dropdown = $('.pickup-point-dropdown');

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
      list += ', ' + element.name;
      list += '</div>'
    });

    let $dropdown = $('.pickup-point-dropdown');

    $container.find('.menu').append(list);
    $dropdown.removeClass('loading');
    $dropdown.removeClass('disabled');
    $dropdown.dropdown();

    let id = $(".pickup-point-id").val();

    $dropdown.dropdown('set selected', id);
  }
})(jQuery);