/**
 * @name storm-modal-gallery: Modal gallery/lightbox
 * @version 0.1.0: Fri, 02 Dec 2016 18:03:41 GMT
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
		overlay: '<div class="modal-gallery__outer js-modal-gallery__outer" role="dialog" tabindex="-1" aria-hidden="true">\n\t\t\t\t\t<div class="modal-gallery__inner js-modal-gallery__inner">\n\t\t\t\t\t\t<div class="modal-gallery__content js-modal-gallery__content">\n\t\t\t\t\t\t\t{{items}}\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<button class="js-modal-gallery__next modal-gallery__next">\n\t\t\t\t\t\t<svg role="button" role="button" width="44" height="60">\n\t\t\t\t\t\t\t<polyline points="14 10 34 30 14 50" stroke="rgba(255,255,255,0.5)" stroke-width="4" stroke-linecap="butt" fill="none" stroke-linejoin="round"/>\n\t\t\t\t\t\t</svg>\n\t\t\t\t\t</button>\n\t\t\t\t\t<button class="js-modal-gallery__previous modal-gallery__previous">\n\t\t\t\t\t\t<svg role="button" width="44" height="60">\n\t\t\t\t\t\t\t<polyline points="30 10 10 30 30 50" stroke="rgba(255,255,255,0.5)" stroke-width="4" stroke-linecap="butt" fill="none" stroke-linejoin="round"/>\n\t\t\t\t\t\t</svg>\n\t\t\t\t\t</button>\n\t\t\t\t\t<button class="js-modal-gallery__close modal-gallery__close">\n\t\t\t\t\t\t<svg role="button" role="button" width="30" height="30">\n\t\t\t\t\t\t\t<g stroke="rgb(160,160,160)" stroke-width="4">\n\t\t\t\t\t\t\t\t<line x1="5" y1="5" x2="25" y2="25"/>\n\t\t\t\t\t\t\t\t<line x1="5" y1="25" x2="25" y2="5"/>\n\t\t\t\t\t\t\t</g>\n\t\t\t\t\t\t</svg>\n\t\t\t\t\t</button>\n\t\t\t\t</div>',
		item: '<div class="modal-gallery__item js-modal-gallery__item">\n\t\t\t\t\t<div class="modal-gallery__img-container">{{img}}</div>\n\t\t\t\t\t{{details}}\n\t\t\t\t</div>',
		details: '<div class="modal-gallery__details">\n\t\t\t\t\t<h1 class="modal-gallery__title">{{title}}</h1>\n\t\t\t\t\t<div class="modal-gallery__description">{{description}}</div>\n\t\t\t\t</div>'
	},
	fullScreen: false,
	async: false
};

var StormModalGallery = {
	init: function init() {
		this.isOpen = false;
		this.initUI();
		this.imageCache = [];
		this.focusableChildren = this.getFocusableChildren();
		this.initButtons();
		return this;
	},
	initUI: function initUI() {
		var renderTemplate = function renderTemplate(data, template) {
			for (var datum in data) {
				if (data.hasOwnProperty(datum)) {
					template = template.split('{{' + datum + '}}').join(data[datum]);
				}
			}
			return template;
		},
		    detailsStringArray = this.imgs.map(function (img) {
			return renderTemplate(img, this.settings.templates.details);
		}.bind(this)),
		    itemsString = detailsStringArray.map(function (item) {
			return this.settings.templates.item.split('{{details}}').join(item);
		}.bind(this));

		document.body.insertAdjacentHTML('beforeend', this.settings.templates.overlay.split('{{items}}').join(itemsString.join('')));
		this.overlay = document.querySelector('.js-modal-gallery__outer');
		return this;
	},
	initButtons: function initButtons() {
		this.previousBtn = document.querySelector('.js-modal-gallery__previous');
		this.nextBtn = document.querySelector('.js-modal-gallery__next');
		this.closeBtn = document.querySelector('.js-modal-gallery__close');

		this.previousBtn.addEventListener('click', function () {
			this.previous();
		}.bind(this));
		this.nextBtn.addEventListener('click', function () {
			this.next();
		}.bind(this));
		this.closeBtn.addEventListener('click', function () {
			this.close();
		}.bind(this));
	},
	preloadImage: function preloadImage(src) {
		var img = new Image();
		img.src = src;
		this.imageCache.push(img);
	},
	getFocusableChildren: function getFocusableChildren() {
		var focusableElements = ['a[href]', 'area[href]', 'input:not([disabled])', 'select:not([disabled])', 'textarea:not([disabled])', 'button:not([disabled])', 'iframe', 'object', 'embed', '[contenteditable]', '[tabindex]:not([tabindex="-1"])'];

		return [].slice.call(this.overlay.querySelectorAll(focusableElements.join(',')));
	},
	trapTab: function trapTab(e) {
		var focusedIndex = this.focusableChildren.indexOf(document.activeElement);
		if (e.shiftKey && focusedIndex === 0) {
			e.preventDefault();
			this.focusableChildren[this.focusableChildren.length - 1].focus();
		} else {
			if (!e.shiftKey && focusedIndex === this.focusableChildren.length - 1) {
				e.preventDefault();
				this.focusableChildren[0].focus();
			}
		}
	},
	keyListener: function keyListener(e) {
		if (this.open && e.keyCode === 27) {
			e.preventDefault();
			this.toggle();
		}
		if (this.open && e.keyCode === 9) {
			this.trapTab(e);
		}
	},
	open: function open() {
		console.log('Open', this);

		document.addEventListener('keydown', this.keyListener.bind(this));
		this.lastFocused = document.activeElement;
		window.setTimeout(function () {
			this.focusableChildren[0].focus();
		}.bind(this), 0);
		this.toggle();
	},
	previous: function previous() {
		console.log('Previous', this);
	},
	next: function next() {
		console.log('Next', this);
	},
	close: function close() {
		console.log('Close', this);

		document.removeEventListener('keydown', this.keyListener.bind(this));
		this.lastFocused.focus();
		this.toggle();
	},
	toggle: function toggle() {
		this.isOpen = !this.isOpen;
		this.overlay.classList.toggle('active');
		this.overlay.setAttribute('aria-hidden', !this.isOpen);
		//this.overlay.setAttribute('tabindex', String(+this.isOpen));
	}
};

var init = function init(src, opts) {
	if (!src.length) throw new Error('Modal Gallery cannot be initialised, no images found');

	var imgs = void 0;

	if (typeof src === 'string') {
		var els = [].slice.call(document.querySelectorAll(src));

		if (!els.length) throw new Error('Modal Gallery cannot be initialised, no images found');

		imgs = els.map(function (el) {
			return {
				src: el.getAttribute('href'),
				title: el.getAttribute('data-title') || null,
				description: el.getAttribute('data-description') || null
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
