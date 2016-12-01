/**
 * @name storm-modal-gallery: Modal gallery/lightbox
 * @version 0.1.0: Thu, 01 Dec 2016 21:51:43 GMT
 * @author mjbp
 * @license MIT
 */
(function(root, factory) {
   var mod = {
       exports: {}
   };
   if (typeof exports !== 'undefined'){
       mod.exports = exports
       factory(mod.exports)
       module.exports = mod.exports.default
   } else {
       factory(mod.exports);
       root.StormModalGallery = mod.exports.default
   }

}(this, function(exports) {
   'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
var defaults = {
	templates: {
		leftArrow: '<svg class="js-modal-gallery__previous" role="button" width="44" height="60">\n\t\t\t\t\t\t<polyline points="30 10 10 30 30 50" stroke="rgba(255,255,255,0.5)" stroke-width="4" stroke-linecap="butt" fill="none" stroke-linejoin="round"/>\n\t\t\t\t\t</svg>',
		rightArrow: '<svg class="js-modal-gallery__next" role="button" width="44" height="60">\n\t\t\t\t\t\t<polyline points="14 10 34 30 14 50" stroke="rgba(255,255,255,0.5)" stroke-width="4" stroke-linecap="butt" fill="none" stroke-linejoin="round"/>\n\t\t\t\t\t</svg>',
		close: '<svg class="js-modal-gallery__close" role="button" width="30" height="30">\n\t\t\t\t\t<g stroke="rgb(160,160,160)" stroke-width="4">\n\t\t\t\t\t\t<line x1="5" y1="5" x2="25" y2="25"/>\n\t\t\t\t\t\t<line x1="5" y1="25" x2="25" y2="5"/>\n\t\t\t\t\t</g>\n\t\t\t\t</svg>'
	},
	fullScreen: false,
	async: false
};

var StormModalGallery = {
	init: function init() {
		this.initOverlay();
		this.imageCache = [];
		return this;
	},
	initOverlay: function initOverlay() {
		var overlayTemplate = '<div class="modal-gallery__outer" role="dialog" tabindex="-1">\n\t\t\t\t\t\t\t\t\t<div class="modal-gallery__inner"></div>\n\t\t\t\t\t\t\t\t\t' + this.settings.templates.leftArrow + '\n\t\t\t\t\t\t\t\t\t' + this.settings.templates.rightArrow + '\n\t\t\t\t\t\t\t\t\t' + this.settings.templates.close + '\n\t\t\t\t\t\t\t\t</div>';

		document.body.insertAdjacentHTML('beforeend', overlayTemplate);
	},
	initButtons: function initButtons() {
		var _this = this;

		//shouldn't have to do this
		//create buttons via createElement, then innerHTML the svg template
		this.previousBtn = document.querySelector('js-modal-gallery__previous');
		this.nextBtn = document.querySelector('js-modal-gallery__next');
		this.closeBtn = document.querySelector('js-modal-gallery__next');

		this.previousBtn.addEventListener('click', function () {
			_this.previous();
		});
		this.nextBtn.addEventListener('click', function () {
			_this.next();
		});
		this.closeBtn.addEventListener('click', function () {
			_this.close();
		});
	},
	preloadImage: function preloadImage(src) {
		var img = new Image();
		img.src = src;
		this.imageCache.push(img);
	},
	open: function open() {},
	previous: function previous() {},
	next: function next() {},
	close: function close() {}
};

var init = function init(src, opts) {
	if (!src.length) throw new Error('Modal Gallery cannot be initialised, no images found');

	var imgs = void 0;

	if (typeof src === 'string') {
		var els = [].slice.call(document.querySelectorAll(src));

		if (!els.length) throw new Error('Modal Gallery cannot be initialised, no images found');

		imgs = els.map(function (el) {
			return {
				imageURL: el.getAttribute('href'),
				title: el.getAttribute('data-title') || ''
			};
		});
	} else {
		imgs = src;
	}

	return Object.assign(Object.create(StormModalGallery), {
		imgs: imgs,
		settings: Object.assign({}, defaults, opts)
	}).init();
};

exports.default = { init: init };;
}));
