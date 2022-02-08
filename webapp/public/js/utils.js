let ipg = {};
ipg.easingSwiftOut = [0.55, 0, 0.1, 1];
ipg.helpers = {};
ipg.helpers.button = {
  /**
   * Replace button content
   * @param {string}  el          element class or id
   * @param {string}  html        replaced content
   * @param {boolean} animate     scale animation
   * @param {string}  classToAdd  class to add to button
   */
  'replaceContent': function(el, html, animate, classToAdd) {
    let $el = $(el).addClass('uk-transform-origin-center');
    let _html = $el.html();
    let $_html = $('<span class="uk-invisible">' + _html + '</span>');

    $el.html($_html);
    let $html = $el.children();

    if (animate) {
      $el.velocity({
        scale: 0.1,
        opacity: 0,
      }, {
        duration: 140,
        easing: scutum.easingSwiftOut,
        complete: function() {
          $el.velocity('reverse', {delay: 150});
          if (classToAdd) {
            $el.addClass(classToAdd);
          }
          setTimeout(function() {
            $html.html(html).removeClass('uk-invisible');
          }, 200);
        },
      });
    } else {
      $(el).html(html);
    }
  },
  /**
   * Show loading indicator
   * @param {string} el       element class or id
   * @param {string} mode     spinner color
   */
  'showLoading': function (el, mode='') {
    var $el = $(el);
    if (!$el.children('.ipg-js-el-hide').length) {
      var $_html = $('<span class="uk-invisible">' + $el.html() + '</span>');
      var style = mode || $el.attr('data-button-mode') ? 'style="border-color: rgba(0,0,0,.2);border-top-color: rgba(255,255,255,.9)"' : '';
      var $spinner = $('<span class="ipg-spinner ipg-spinner-small uk-hidden"' + style + '></span>');
      console.log('$spinner::',$spinner)
      $el.html($_html).append($spinner);
    }
    var $wrapper = $('<div>', {
      'class': 'ipg-button-wrapper',
      'css': {
        'width': $el.outerWidth()
      }
    });
    $el.wrap($wrapper);
    $el.velocity({
      // width: $el.outerHeight()+20,
      minWidth: $el.outerHeight()
    }, {
      duration: 140,
      easing: ipg.easingSwiftOut,
      complete: function () {
        $el.addClass('uk-flex uk-flex-center uk-padding-remove uk-disabled');
        $el.children('.ipg-spinner').removeClass('uk-hidden');
        $el.children('.uk-invisible').toggleClass('uk-hidden uk-invisible');
      }
    })
  },
  /**
   * Hide loading indicator
   * @param {string} el       element class or id
   */
  'hideLoading': function (el) {
    var $el = $(el);
    var $wrapper = $el.closest('.ipg-button-wrapper');
    $.Velocity.hook($el, "transition", 'none');
    $el.velocity({
      width: $wrapper.width(),
      minWidth: $wrapper.width()
    }, {
      duration: 140,
      easing: ipg.easingSwiftOut,
      begin: function () {
        $el.children('.ipg-spinner').remove();
        $el.removeClass('uk-flex uk-flex-center uk-padding-remove uk-disabled');
      },
      complete: function () {
        var $children = $el.children();
        $el.unwrap($wrapper);
        $.Velocity.hook($el, "transition", '');
        setTimeout(function () {
          $children.replaceWith($children[0].childNodes);
          // cleanup
          $.Velocity.hook($el, "width", '');
          $.Velocity.hook($el, "min-width", '');
        }, 150);
      }
    });
  }
};