
// ATTENTION! when upgrading fancybox.js
// -> changed 'absolute' to 'relative' in _getPosition (line 1401)
// -> added support for type === 'smartresize' (line 571)



$(function() {


  // FANCYBOX

  var PROJECT_BASE_URL = '#/proyecto/';
  // could generate RegExp from PROJECT_BASE_URL
  var projectTest = /#\/proyecto\/(.+)/;

  var ignoreHashchange = false;
  var previousHash = '';

  var currentScrollTop = 0;

  var $html = $('html');
  var $body = $('body');
  var $window = $(window);

  var slider;


  function isMobile() {
    return $(window).width() < 1150 || $body.hasClass('android');
  }


  setTimeout(function() {
    slider = $('.royalslider').data('royalSlider');
  }, 100);



  function initFancy() {
    var $el = $(this);
    var hex = $el.attr('data-color');
    var rgba = 'rgba(' + hexToRgb(hex) + ', 0.95)' //', 0.95)'

    if($('body').hasClass('ie8')) {
      rgba = hex;
    }

    $el.fancybox({

      helpers : {
        overlay : {
          css : { 'background' : rgba }
        }
      },

      beforeLoad: function() {

        if (!isMobile()) return;
        //currentScrollTop = $('body').scrollTop();

        if($('body').hasClass('ie') || $('body').hasClass('firefox')) {
          currentScrollTop = $(window).scrollTop();
        } else {
          currentScrollTop = $('body').scrollTop();
        }

        $body.addClass('hide_content');

      },

      afterLoad: function() {
        var $iframe = $('.fancybox-iframe');
        var height = $iframe.contents().find('body').height();

        // Markus 1.8.14
        $iframe.contents().find('html').addClass('uberHTML');

        $iframe.css( 'height', height );
      },

      afterShow: function() {
        ignoreHashchange = true;
        previousHash = window.location.hash;
        window.location.hash = PROJECT_BASE_URL + $el.attr('data-id');

        if (!isMobile()) return;
        slider.stopAutoPlay();
        $body.addClass('hide_content');
      },

      onCancel: function () {
        if (isMobile()) closeLightbox();
      },

      afterClose: function() {
        // set hash to previous (no support for IE < 10)
        var location = previousHash.match(projectTest) ? '' : previousHash;

        if (isMobile()) {
          //window.location.hash = location;
          closeLightbox();
          //$(window).scrollTop(currentScrollTop);

          return;
        }

        if (history.pushState) history.pushState(null, null, location);
      },

      margin: 0,
      padding: 0,
      maxWidth: 880,
      width: '100%',
      fixed: true
      
      //openEffect: 'none',
      //closeEffect: 'none',
      //openOpacity: false,
      //closeOpacity: false

    });
  }

  $('.project_list_item').each(initFancy);


  function closeLightbox() {
    slider.startAutoPlay();
    $body.removeClass('hide_content');
    $(window).resize();

    //console.log(currentScrollTop);
    if($('body').hasClass('ie') || $('body').hasClass('firefox')) {
      $(window).scrollTop(currentScrollTop);
    } else {
      $('body').scrollTop(currentScrollTop);
    }
  }

  function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return parseInt(result[1], 16)+ ',' + parseInt(result[2], 16)+ ',' + parseInt(result[3], 16);
  }




  // ROUTING


  // initialization
  checkForProject();


  $(window).on('hashchange', function(e) {

    // ignore hashchanges triggered by showing fancybox in afterShow cb
    if (ignoreHashchange) {
      ignoreHashchange = false;
      return;
    }
    // close fancybox in case another project was open before
    $.fancybox.close();

    checkForProject();
  });


  function checkForProject() {
    var hash = window.location.hash;
    var isProject = hash.match(projectTest);

    // not a /meisterwerk url
    if (!isProject) return;

    var id = isProject[1];
    var $link = $('a[data-id="' + id + '"]');

    // invalid project id
    if (! $link.length) return;

    // open fancybox
    $link.click();
  }


  // MEISTERWERKE ARCHIVE AND FILTERING

  function triggerWaypoints() {
	  $.waypoints('refresh');
  };

  var $archiveProjects = $('.project_list_container').find('[data-archive=1]').remove();
  var $resetButton = $('.filter_wrapper .reset');
  var $filters = $('.project_list_filter li');

  // isotope
  var $iso = $('.project_list_container').isotope({
    itemSelector : 'li',
    layoutMode : 'fitRows'
  });

  var showArchive = function() {
    $('.projektarchiv').hide();
    $iso.isotope('insert', $archiveProjects, function() {
			triggerWaypoints();
			//console.log('callback');
		}
    	
    );
		
    $('.project_list_container').find('[data-archive=1]').find('.project_list_item').each(initFancy);
    showArchive = function() {};
  };

  // isotope filter
  $filters.on('click', function() {
    showArchive();
    var selector = '[data-tags*="' + $(this).attr('data-tag') + '"]';
    $filters.removeClass('active');
    $(this).addClass('active');
    
    $iso.isotope({ filter: selector }, 
		function() {
			triggerWaypoints();
			//console.log('callback');
		});
    
    $resetButton.removeClass('hide');
  });


  // reset button
  function resetFilter() {
    $filters.removeClass('active');
    $iso.isotope({ filter: '' }, 
		function() {
			triggerWaypoints();
			//console.log('callback');
		});
		
    $resetButton.addClass('hide');
  }

  $resetButton.on('click', resetFilter);

  $('.projektarchiv h5').on('click', showArchive);


  // relayout on resize
  $window.on('resize', debounce(function() {
    $iso.isotope('reLayout');
    if ($(window).width() < 1024) {
      resetFilter();
      $('.projektfilter h5').removeClass('expanded');
      $('.filter_wrapper').hide();
    }
  }, 1000));




  // borrowed from underscorejs

  function throttle(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    options || (options = {});
    var later = function() {
        previous = options.leading === false ? 0 : new Date;
        timeout = null;
        result = func.apply(context, args);
      };
    return function() {
      var now = new Date;
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0) {
        clearTimeout(timeout);
        timeout = null;
        previous = now;
        result = func.apply(context, args);
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };


  function debounce(func, wait, immediate) {
    var timeout, args, context, timestamp, result;
    return function() {
      context = this;
      args = arguments;
      timestamp = new Date();
      var later = function() {
          var last = (new Date()) - timestamp;
          if (last < wait) {
            timeout = setTimeout(later, wait - last);
          } else {
            timeout = null;
            if (!immediate) result = func.apply(context, args);
          }
        };
      var callNow = immediate && !timeout;
      if (!timeout) {
        timeout = setTimeout(later, wait);
      }
      if (callNow) result = func.apply(context, args);
      return result;
    };
  }


});
