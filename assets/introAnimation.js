//
// Intro Animation
//
;(function ($, window, document, undefined) {
  var device = {

    android: function() {
      return navigator.userAgent.match(/Android/i);
    },
    androidPhone: function() {
      return navigator.userAgent.match(/Android.+Mobile/i);
    },
    androidTablet: function() {
      return (device.android() && !device.androidPhone());
    },
    blackberry: function() {
      return navigator.userAgent.match(/BlackBerry/i);
    },
    iPhone: function() {
      return navigator.userAgent.match(/iPhone/i);
    },
    iPod: function() {
      return navigator.userAgent.match(/iPod/i);
    },
    iPad: function() {
      return navigator.userAgent.match(/iPad/i);
    },
    iOS: function() {
      return (device.iPhone() || device.iPod() || device.iPad());
    },
    opera: function() {
      return navigator.userAgent.match(/Opera Mini/i);
    },
    windowsPhone: function() {
      return navigator.userAgent.match(/IEios/i);
    },
    touch: function() {
      return (device.android() || device.blackberry() || device.iOS() || device.opera() || device.windowsPhone());
    },
    tablet: function() {
      return (device.iPad() || device.androidTablet());
    },
    mobile: function() {
      return (device.touch() && !device.tablet());
    },
    safari: function() {
      return Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
    },
    ie8: function() {
      return navigator.userAgent.match(/MSIE\s8/i);
    }

  };


  if (device.mobile() || location.hash.match('meisterwerk') || device.ie8()) {
    $('body').css('display', 'block');
    window.introAnimation = function(cb) {
      cb();
    };
    return;
  }

  var DURATION = 1500;
  var BACKGROUND_COLOR = '#AB2228';


  function createLine(path) {
    var line = paper.path(path);
    var len  = line.getTotalLength();
    line.attr({
      strokeWidth: 7.8,
      stroke: '#AB2228',
      'stroke-dasharray': len + ' ' + len,
      'stroke-dashoffset': len
    });
    return addAni(line);
  }

  function addAni(obj) {
    obj.ani = function() {
      var defer = $.Deferred();
      var args = Array.prototype.slice.call(arguments);
      args.push(function() {
        defer.resolve();
      });
      obj.animate.apply(obj, args);
      return defer.promise();
    };
    return obj;
  }



  var startX = (800 - $(window).width()) / 2;
  var startY = (600 - $(window).height()) / 2;

  var metrics = {
    width: $(window).width(),
    height: $(window).height()
  };

  var transform = {
    transform: 't'+(metrics.width-800)/2+' '+(metrics.height-600)/2
  };

  var $el = $('<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="'+metrics.width+'" height="'+metrics.height+'">')
    .css({
      position: 'absolute',
      zIndex: 60000001
    });

  var paper = Snap($el.get(0));

  var invertedCross = addAni(paper.path('M '+startX+' '+startY+'v'+$(window).height()+'h'+$(window).width()+'V'+startY+'H'+startX+'z M416.975,312.868l-4.755,4.754l-12.345-12.345l-12.345,12.345l-4.754-4.754l12.345-12.345l-12.345-12.345 l4.754-4.755l12.345,12.345l12.345-12.345l4.755,4.755l-12.346,12.345L416.975,312.868z'))
    .attr({ fill: '#fff' })
    .attr(transform);

  var background = paper.rect(0,0,800,600)
    .attr({ fill: BACKGROUND_COLOR })
    .attr(metrics);

  var emblem = paper.path()
    .attr({ fill: '#fff', opacity: 0 });

  var line1  = createLine();
  var line2  = createLine();

  var logo = paper.group(emblem, line1, line2)
    .attr(transform);


  $(function() {
    $('body').prepend($el).css('display', 'block');
  });


  window.introAnimation = function(cb) {
    emblem.animate({ opacity: 1 }, 0.35*DURATION, mina.easeinout);

    line1.ani({ 'stroke-dashoffset': 0 }, 0.175*DURATION, mina.easeinout)
      .then(function() {
        return line2.ani({ 'stroke-dashoffset': 0 }, 0.175*DURATION, mina.easeinout);
      })
      .then(function() {
        logo.attr({ display: 'none' });
        background.attr({ mask: invertedCross });
        $(background.node).attr('mask', 'url('+location+'#'+$('defs mask').first().attr('id')+')');
        var factor = Math.max(metrics.width,metrics.height)*0.12;
        return invertedCross.ani({ transform: invertedCross.transform().local+'S'+factor+' '+factor }, 0.45*DURATION, mina.easeinout)
      })
      .then(function() {
        $el.remove();
      })
      .then(cb);
  };



})( jQuery, window, document );
