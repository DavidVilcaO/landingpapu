if (typeof union == 'undefined') {
	var union = {};
}
 
$(window).resize(function() {
	if (this.resizeTO) {
		clearTimeout(this.resizeTO);
	}
	this.resizeTO = setTimeout(function() {
		$(this).trigger('resizeEnd');
	}, 500);
});

var scrollTripped = 0;
var $slider;

/*-----------------------
 @MAIN
 ------------------------*/
union.main = (function() {

	return {
		isMobile: false,
		init: function() {

			$.Android = (navigator.userAgent.match(/Android/i));
			$.iPhone = ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i)));
			$.iPad = ((navigator.userAgent.match(/iPad/i)));
			$.iOs4 = (/OS [1-4]_[0-9_]+ like Mac OS X/i.test(navigator.userAgent));

			if ($.iPhone || $.iPad || $.Android) {
				this.isMobile = true;
			}
			this.registerEvents();
		},
		registerEvents: function() {
      if ($(".m_tabs").length) {
        union.tabs.init();
			}
		},
		windowWide: function() {
			return $(window).width() > 767 ? true : false;
		},
		isTouchDevice: function() {
			var is_touch_device = 'ontouchstart' in document.documentElement;
			return is_touch_device;
		}
	};
})();

/*-----------------------
 @AMAZING MAGICALLY MUTATING TABS

 Originally based on http://codepen.io/chriscoyier/pen/gHnGD
 Modified beyond recognition. Don't try this at home.
 ------------------------*/
var selectorCount = 0;
union.tabs = {
	settings: {
		$el: $(".m_tabs"),
		$selectorWrap: $("<div class='row tab-selectors'></div>")
	},
	init: function()
	{
		var $t,
				moduleType;

		this.settings.$el.each(function() {
			$t = $(this);
			isTeam = $(this).hasClass('team');

			// "large" screen
			if (union.main.windowWide()) {
				moduleType = "tabs";

				union.tabs.upgradeTags($t, isTeam);
				union.tabs.enableModule($t, moduleType, isTeam);
				union.tabs.buildSelectors($t, moduleType, isTeam);
				union.tabs.pageLoadActiveItem($t.not('[data-not-expanded]'), moduleType, isTeam);
				union.tabs.bindUIfunctions($t, moduleType, isTeam);
			}
			// "small" screen & transform to accordion
			else if ($t.hasClass("m_accordion")) {
				moduleType = "accordion";

				union.tabs.upgradeTags($t, isTeam);
				union.tabs.enableModule($t, moduleType, isTeam);
				union.tabs.buildSelectors($t, moduleType, isTeam);
				union.tabs.pageLoadActiveItem($t, moduleType, isTeam);
				union.tabs.bindUIfunctions($t, moduleType, isTeam);
			}
		});
	},
	// reconfigure DOM
	upgradeTags: function($t, isTeam)
	{
		var $el,
			$tagHTML,
			newTag;

		// replace tags first, it takes the most work
		$t.find("[data-upgrade-tag]").each(function() {
			$el = $(this);
			$tagHTML = $el.html();

			newTag = $("<" + $el.attr("data-upgrade-tag") + " />");
			if ($el.attr("data-upgrade-tag") === "a") {
				if ($el.attr("data-upgrade-hash").length) {
					newTag.attr("href", $el.attr("data-upgrade-hash"));
				} else {
					newTag.attr("href", "#");
				}
			}

			newTag.addClass($el.attr("data-upgrade-class")).html($tagHTML);
			$el.replaceWith(newTag);
		});

		// simple replaces for classes
		$t.find("[data-upgrade-class]").each(function() {
			$(this)
					.attr("class", $(this).attr("data-upgrade-class"))
					.removeAttr("data-upgrade-class");
		});
	},
	enableModule: function($t, moduleType, isTeam)
	{
		$t.removeClass(moduleType + "-disabled").addClass(moduleType + "-enabled");
	},
	buildSelectors: function($t, moduleType, isTeam)
	{
		if (moduleType == "tabs") {
			if(isTeam) {
				var $newRow = $('<div class="row tab-selectors"></div>');
				$t.find('[data-tab-selector]').each(function(i, el) {
					selectorCount++;
					$(el).appendTo($newRow);

					if(selectorCount == 3) {
						$newRow.insertBefore($t.find('.tab-content'));

						$newRow = $("<div class='row tab-selectors'></div>");
						selectorCount = 0;
					}
				});
				$newRow.insertBefore($t.find('.tab-content'));
				$('.row').after('<div class="content-container"></div>');
			} else {
				// build
				$t.find("[data-tab-selector]").appendTo(union.tabs.settings.$selectorWrap);
				// insert
				union.tabs.settings.$selectorWrap.insertAfter($t.find(".module-heading").first());
			}
		}

		if (moduleType == "accordion") {
			// build
			$t.find("[data-accordion-tab]").attr("class", "accordion-tab-cell").wrap("<div class='row accordion-tab' />");
			// flag content
			$t.find(".accordion-tab").next(".row").addClass("accordion-content");
		}
	},
	bindUIfunctions: function($t, moduleType, isTeam)
	{
		if (moduleType == "tabs") {
			$t.children(".tab-selectors")
        .on('mouseenter mouseout', 'img', function(e){
          var original = $(this).attr('src');
          var replacement = $(this).data('hoverimg');
          $(this).attr('src', replacement).data('hoverimg', original);
        })      
				.on("click", "a", function(e) {
					if (union.main.windowWide()) {
						e.preventDefault();
					}
				})
				.on("click", "a[href^='#']", function(e) {
					if (union.main.windowWide()) {
						union.tabs.changeTab($t, this.hash, isTeam, $(this).hasClass('active'));
					}
				});         
		}

		if (moduleType == "accordion") {
			$t.find(".tab-item .accordion-tab")
				.on("click", function(e) {
					e.preventDefault();

					var $tabItem = $(this).parents('.tab-item');
					union.tabs.toggleAccordion($t, $tabItem);
				});
		}
	},
	pageLoadActiveItem: function($t, moduleType, isTeam)
	{
		if (moduleType == "tabs") {
			var hash = document.location.hash.length
					? document.location.hash
					: false;

			// if there's no document hash OR if the given hash doesn't match one of the selector IDs, use the first item
			if (!hash || !$t.find(".tab-selectors #" + hash.replace("#", "")).length) {
				hash = "#" + $t.children(".tab-content").children(".tab-item").first().attr("id");
			}
			this.changeTab($t, hash, isTeam, false);
		}

		if (moduleType == "accordion") {
			$t.find(".accordion-tab").first().parent(".tab-item").addClass("active");
			$t.find(".tab-content .tab-item").not(".active").children(".accordion-content").hide();
		}
	},
	// tabs only
	changeTab: function($t, hash, isTeam, collapse)
	{
		var anchor = $("[href=" + hash + "]").closest(".tab-item-cell");
		var rowContent = anchor.parents('.row').next('.content-container');
		var div = $(hash);

		if(isTeam) {
			if(collapse) {
				$('.content-container.active').empty().removeClass('active');
				anchor.removeClass('active');
			} else {
				$('.tab-selectors').find('.active').removeClass('active');
				anchor.addClass('active');

				// activate content
				$('.content-container').empty().find('.tab-item').removeClass('active');
				div.clone().appendTo(rowContent).addClass('active');
				$('.content-container').removeClass('active');
				rowContent.addClass('active');
			}
			$('.tab-item-cell .jump').text('');
			anchor.find('.jump').text(collapse ? '' : '');
		} else {
			// activate selector
			anchor.addClass("active").parent().siblings().find(".active").removeClass("active");

			// activate content
			div.addClass("active").siblings().removeClass("active");

			// update URL, no history addition
			// You'd have this active in a real situation, but it causes issues in an <iframe> (like here on CodePen) in Firefox. So commenting out.
			// window.history.replaceState("", "", hash);
		}
	},
	// accordion only
	toggleAccordion: function($t, $clickedTab, isTeam)
	{
		if (!$clickedTab.hasClass("active")) {
			$t.find(".tab-item.active").removeClass("active").children(".accordion-content").slideUp("fast");
			$clickedTab.addClass("active").children(".accordion-content").slideDown("fast", function() {
				union.tabs.positionAccordion($t);
			});
		} else {
			$clickedTab.removeClass("active").children(".accordion-content").slideUp("fast");
		}
	},
	positionAccordion: function($t, isTeam)
	{
		$(".st-content").scrollTo($t.find(".module-heading"), 400);
	},
}

jQuery(function() {
	union.main.init();
});
