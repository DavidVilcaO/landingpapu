var nextTick = function(fn) {
  setTimeout(fn, 0);
};

$(document).ready(function() {

  var slider;

  $(window).resize(function() {
    $('#slider').css({
      'height' : $(window).height()
    });
    
    $('#creemos').css({
      'height' : $(window).height()
    });
    $('.creemos').css({
      'height' : $(window).height()
    });          

    var metoheadHeight = $("#metodologia .headline").outerHeight();
    $('#metodologia').css({
      'height' : $(window).height()
    });
    
    $('.metodo').css({
      'height' : ($(window).height() - metoheadHeight) / 2
    });
    
    $('#full_nav').css({
      'width' : $(window).width(),
      'height' : $(window).height()
    });

  });

  $(window).resize();


  // mobile menu

  $('.mohead').on('click', function() {
    $('.default').toggleClass('showsub');
  });





  function isMobile() {
    return $(window).width() < 1150 || $('body').hasClass('android');
  }



  // MENU

  // smooth scroll to anchor links
  $('a[href^="#"]').on('click', function(e) {

    var target = this.hash;
    var $target = $(target);

    //var offset = $('body').hasClass('mobile') ? 0 : -20;
    var offset = $('body').hasClass('mobile') ? 0 : 0;

    //console.log(offset);

    $('.mohead').click();
    //$('#full_nav .close').click();
    $('body').toggleClass('nav_is_visible');

    function scrollTo($el) {
      $el.stop().animate({
        'scrollTop': $target.offset().top - offset
      }, 1300, 'swing', function() {
        window.location.hash = target;
      });
    }

    scrollTo($('html,body'));

    e.preventDefault();

  }); 


  // SHUFFLE

  function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex ;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }


  function renderSlideItem(pic) {

    var tags = '';

    try {
      tags = $.map(pic.caption.text.split(' '), function(tag) {
        return '<span>' + tag + '</span>';
      }).join(' ');
    } catch (e) {}

    return '<a href="#" class="" style="cursor:default;" onclick="return false;">' +
              '<div class="le_image">' +
                  '<img src="'+ pic.images.standard_resolution.url + '" alt />' +
                  '<div class="hashy">' +
                    '<div class="t">' +
                        '<div class="tc">' +
                          tags +
                        '</div>' +
                    '</div>' +
                  '</div>' +
              '</div>' +
           '</a>';
/*
    return '<a href="' + pic.link + '" target="_blank" class="">' +
      '<div class="le_image">' +
      '<img src="'+ pic.images.standard_resolution.url + '" alt />' +
      '</div>' +
      '</a>';
*/
  }

  function renderPic(pic) {

  // use caption:
/*
       var tags = '';

        try {
                tags = $.map(pic.caption.text.split(' '), function(tag) {
                return '<span>' + tag + '</span>';
        }).join(' ');
        } catch (e) {}
*/
        return '<a href="" class="igram" style="cursor:default;" onclick="return false;">' +
            '<div class="image">' +
                '<img src="'+ pic.images.standard_resolution.url + '" alt />' +
            '</div>' +
            '<div class="hashtags">' +
                '<div class="outer">' +
                    '<div class="inner">' +
                        //'<p>' + tags + '</p>' +
                        '<p>Follow us on instagram<br>#hochburg</p>' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</a>';
/*
    // use caption:
    var tags = $.map(pic.caption.text.split(' '), function(tag) {
      return '<span>' + tag + '</span>';
    }).join(' ');


    return '<a href="' + pic.link + '" target="_blank">' +
        '<div class="image">' +
            '<img src="'+ pic.images.standard_resolution.url + '" alt />' +
        '</div>' +
        '<div class="hashtags">' +
            '<div class="outer">' +
                '<div class="inner">' +
                    '<p>' + tags + '</p>' +
                '</div>' +
            '</div>' +
        '</div>' +
    '</a>';
*/
/*
  return '<a href="' + pic.link + '" target="_blank">' +
        '<div class="image">' +
            '<img src="'+ pic.images.standard_resolution.url + '" alt />' +
        '</div>' +
        '<div class="hashtags">' +
            '<div class="outer">' +
                '<div class="inner">' +
                    '<p>[nbsp]' + '</p>' +
                '</div>' +
            '</div>' +
        '</div>' +
    '</a>';
*/
  }

/*
  // MOBILE SIDE MENU

  var snapper = new Snap({
    element: $('#wrapper')[0],
    disable: 'left',
    minPosition: -251,
    touchToDrag: false,
    tapToClose: false
  });

  snapper.disable();
*/

  // IFRAME SCROLLING

  if (!$('body').hasClass('android')) $('body').addClass('not-android');



  // borrowed from underscorejs

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


  // navi
/*
  $('.button_right a').on('click', function() {
    //$('#full_nav').show();
    $('#full_nav').css({
      'left' : 0
    });
    return false;
  });

  $('#full_nav .close').on('click', function() {
    //$(this).hide();
    $('#full_nav').css({
      'left' : '100%'
    });
    return false;
  });
*/
  $('.button_right a').on('click', function() {
    $('body').toggleClass('nav_is_visible');
    return false;
  });


  // waypoints

  $nav = $('.wide');
  var os = 70;

  // direction == up, down, left, or right

/*
  $('#slider').waypoint(function(direction) {
    $nav.addClass('white');
  }, { offset: 0 })

  $('#slider').waypoint(function(direction) {
    $nav.addClass('white');
  }, { offset: -200 })
*/

  var navColor = (function() {
    return {
      white: function() {
        $nav.addClass('white');
      },
      black: function() {
        $nav.removeClass('white');
      }
    };
  }());

  var $slider = $('#slider');

  $slider.waypoint(function(direction) {

    if(direction == 'down') {
      $('.logo_left').addClass('cut');
    } else {
      $('.logo_left').removeClass('cut');
    }
  }, { offset: -300 });



/*
  var do_it = true;

  $slider.waypoint(function(direction) {
    console.log('slider waypoint');
    if(direction == 'down') {
      do_it = false;
    } else {
      do_it = true;
    }

    console.log(do_it);

  }, { offset: -($slider.height()-100) });
*/


  var currentSection = 'slider';

  $('.mod_article').waypoint(function(direction) {
    var $this = $(this);

    if(direction === 'down' || !$this.prev().length) {
      currentSection = $this.attr('id');
    } else {
      currentSection = $this.prev().attr('id')
    }

    if ($('#' + currentSection).hasClass('nav_white')) {
      navColor.white();
    } else {
      navColor.black();
    }
  }, { offset: os });

/*
  $('#meisterwerke, #hochburg, #kultur').waypoint(function(direction) {
    if(direction == 'down') {
      navColor.white();
    } else {
      navColor.black();
    }
  }, { offset: os });

  $('#team, #kunden, #prozess, #kontakt').waypoint(function(direction) {
    if(direction == 'down') {
      navColor.black();
    } else {
      navColor.white();
    }
  }, { offset: os });
*/
  // intro

    nextTick(function() {
      var top_slider = $('#royalslider_73').data('royalSlider');
      top_slider.stopAutoPlay();

      top_slider.ev.on('slideIn', function(ev, el) {
        var isWhite = !!$(el).find('.white').length;
        $slider.toggleClass('nav_white', isWhite);
        if(currentSection === 'slider' && $(window).width() > 1149) {
          if (isWhite) {
            navColor.white();
          } else {
            navColor.black();
          }
        }
      });

      $slider.imagesLoaded(function() {
        introAnimation(function() {
          top_slider.startAutoPlay();
/*
          var introslider = $('#royalslider_73').data('royalSlider');
          introslider.ev.on('rsAfterSlideChange', function(event) {

            if($(window).width() > 1149) {
              if(introslider.currSlideId === 0) {
                console.log('slide=true');
              }
            }
          });
*/
        });
      });

    });

});
