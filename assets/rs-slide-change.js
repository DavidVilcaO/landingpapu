(function($) {

  "use strict";

  $.rsProto._initContentToTarget = function() {
    var self = this;

    // only call a function x times
    var maxcall = function(fn, max) {
      var count = 0;
      max = max || (max = 1);
      return function() {
        var args = Array.prototype.slice.call(arguments, 0);
        if (count >= max) return;
        fn.apply(null, args);
        count++;
      }
    };

    var triggerInit = function(ev, slide) {
      setTimeout(function() {
        self.ev.trigger('slideIn', slide.content);
      }, 0);
    };

    this.ev.on('rsBeforeAnimStart', function(ev) {
      self.ev.trigger('slideOut', ev.target.currSlide.content);
    });

    this.ev.on('rsAfterContentSet', maxcall(triggerInit));
    this.ev.on('rsAfterSlideChange', function(ev) {
      self.ev.trigger('slideIn', ev.target.currSlide.content);
    });
  };

  $.rsModules.contentToTarget = $.rsProto._initContentToTarget;

})(jQuery);
