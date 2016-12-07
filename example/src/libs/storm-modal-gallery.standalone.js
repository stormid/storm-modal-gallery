/**
 * @name storm-modal-gallery: Modal gallery/lightbox
 * @version 0.1.0: Wed, 07 Dec 2016 18:13:47 GMT
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
		overlay: '<div class="modal-gallery__outer js-modal-gallery__outer" role="dialog" tabindex="-1" aria-hidden="true">\n\t\t\t\t\t\t<div class="modal-gallery__inner js-modal-gallery__inner">\n\t\t\t\t\t\t\t<div class="modal-gallery__content js-modal-gallery__content">\n\t\t\t\t\t\t\t\t{{items}}\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<button class="js-modal-gallery__next modal-gallery__next">\n\t\t\t\t\t\t\t<svg role="button" role="button" width="44" height="60">\n\t\t\t\t\t\t\t\t<polyline points="14 10 34 30 14 50" stroke="rgb(255,255,255)" stroke-width="4" stroke-linecap="butt" fill="none" stroke-linejoin="round"/>\n\t\t\t\t\t\t\t</svg>\n\t\t\t\t\t\t</button>\n\t\t\t\t\t\t<button class="js-modal-gallery__previous modal-gallery__previous">\n\t\t\t\t\t\t\t<svg role="button" width="44" height="60">\n\t\t\t\t\t\t\t\t<polyline points="30 10 10 30 30 50" stroke="rgb(255,255,255)" stroke-width="4" stroke-linecap="butt" fill="none" stroke-linejoin="round"/>\n\t\t\t\t\t\t\t</svg>\n\t\t\t\t\t\t</button>\n\t\t\t\t\t\t<button class="js-modal-gallery__close modal-gallery__close">\n\t\t\t\t\t\t\t<svg role="button" role="button" width="30" height="30">\n\t\t\t\t\t\t\t\t<g stroke="rgb(255,255,255)" stroke-width="4">\n\t\t\t\t\t\t\t\t\t<line x1="5" y1="5" x2="25" y2="25"/>\n\t\t\t\t\t\t\t\t\t<line x1="5" y1="25" x2="25" y2="5"/>\n\t\t\t\t\t\t\t\t</g>\n\t\t\t\t\t\t\t</svg>\n\t\t\t\t\t\t</button>\n\t\t\t\t\t</div>',
		item: '<div class="modal-gallery__item js-modal-gallery__item">\n\t\t\t\t\t\t<div class="modal-gallery__img-container js-modal-gallery__img-container"></div>\n\t\t\t\t\t\t{{details}}\n\t\t\t\t\t</div>',
		details: '<div class="modal-gallery__details">\n\t\t\t\t\t\t<h1 class="modal-gallery__title">{{title}}</h1>\n\t\t\t\t\t\t<div class="modal-gallery__description">{{description}}</div>\n\t\t\t\t\t</div>'
	},
	fullScreen: false,
	async: false
},
    KEY_CODES = {
	TAB: 9,
	ESC: 27,
	LEFT: 37,
	RIGHT: 39,
	ENTER: 13
},
    TRIGGER_EVENTS = ['mouseup', 'keydown', 'touchstart'];

var StormModalGallery = {
	init: function init() {
		this.isOpen = false;
		this.current = null;
		this.initUI();
		this.imageCache = [];
		this.focusableChildren = this.getFocusableChildren();
		this.initButtons();
		this.items[0].trigger && this.initTriggers();
		return this;
	},
	initTriggers: function initTriggers() {
		/*
  this.items.forEach((item, i) => {
  	TRIGGER_EVENTS.forEach(ev => {
  		item.trigger.addEventListener(ev, e => {
  			if(e.keyCode && e.keyCode !== KEY_CODES.ENTER) return;
  			e.preventDefault();
  			this.open(i);
  		});
  	});
  });*/
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
		    detailsStringArray = this.items.map(function (img) {
			return renderTemplate(img, this.settings.templates.details);
		}.bind(this)),
		    itemsString = detailsStringArray.map(function (item) {
			return this.settings.templates.item.split('{{details}}').join(item);
		}.bind(this));

		document.body.insertAdjacentHTML('beforeend', this.settings.templates.overlay.split('{{items}}').join(itemsString.join('')));
		this.DOMOverlay = document.querySelector('.js-modal-gallery__outer');
		this.DOMItems = [].slice.call(document.querySelectorAll('.js-modal-gallery__item'));
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
	loadImage: function loadImage(i) {
		var _this = this;

		var img = new Image(),
		    imageContainer = this.DOMItems[i].querySelector('.js-modal-gallery__img-container'),
		    loaded = function loaded() {
			imageContainer.innerHTML = '<img class="modal-gallery__img" src="' + _this.items[i].src + '" alt="' + _this.items[i].title + '">';
			_this.DOMItems[i].classList.remove('loading');
		};
		img.onload = loaded;
		img.src = this.items[i].src;

		img.onerror = function () {
			_this.DOMItems[i].classList.remove('loading');
			_this.DOMItems[i].classList.add('error');
		};
		if (img.complete) loaded();
	},
	loadImages: function loadImages(i) {
		var _this2 = this;

		if (this.imageCache.length === this.items) return;

		var indexes = [i];

		if (this.items.length > 1) indexes.push(i === 0 ? this.items.length - 1 : i - 1);
		if (this.items.length > 2) indexes.push(i === this.items.length - 1 ? 0 : i + 1);

		indexes.forEach(function (idx) {
			if (_this2.imageCache[idx] === undefined) {
				_this2.DOMItems[idx].classList.add('loading');
				_this2.loadImage(idx);
			}
		});
	},
	getFocusableChildren: function getFocusableChildren() {
		var focusableElements = ['a[href]', 'area[href]', 'input:not([disabled])', 'select:not([disabled])', 'textarea:not([disabled])', 'button:not([disabled])', 'iframe', 'object', 'embed', '[contenteditable]', '[tabindex]:not([tabindex="-1"])'];

		return [].slice.call(this.DOMOverlay.querySelectorAll(focusableElements.join(',')));
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
		if (!this.open) return;

		switch (e.keyCode) {
			case KEY_CODES.ESC:
				e.preventDefault();
				this.toggle();
				break;
			case KEY_CODES.TAB:
				this.trapTab(e);
				break;
			case KEY_CODES.LEFT:
				this.previous();
				break;
			case KEY_CODES.RIGHT:
				this.next();
				break;
			default:
				break;
		}
	},
	previous: function previous() {
		this.DOMItems[this.current].classList.remove('active');
		this.current = this.current === 0 ? this.DOMItems.length - 1 : this.current - 1;
		this.DOMItems[this.current].classList.add('active');
		console.log('Previous', this);
	},
	next: function next() {
		this.DOMItems[this.current].classList.remove('active');
		this.current = this.current === this.DOMItems.length - 1 ? 0 : this.current + 1;
		this.DOMItems[this.current].classList.add('active');
		console.log('Next', this);
	},
	open: function open(i) {
		document.addEventListener('keydown', this.keyListener.bind(this));
		this.loadImages(i);
		this.lastFocused = document.activeElement;
		this.focusableChildren.length && window.setTimeout(function () {
			this.focusableChildren[0].focus();
		}.bind(this), 0);
		this.DOMItems[i || 0].classList.add('active');
		this.toggle(i || 0);
	},
	close: function close() {
		document.removeEventListener('keydown', this.keyListener.bind(this));
		this.lastFocused.focus();
		this.DOMItems[this.current].classList.remove('active');
		this.toggle(null);
		console.log('Close', this);
	},
	toggle: function toggle(i) {
		this.isOpen = !this.isOpen;
		this.current = i;
		this.DOMOverlay.classList.toggle('active');
		this.DOMOverlay.setAttribute('aria-hidden', !this.isOpen);
		this.DOMOverlay.setAttribute('tabindex', this.isOpen ? '0' : '-1');
		console.log('Toggle', this);
	}
};

var init = function init(src, opts) {
	if (!src.length) throw new Error('Modal Gallery cannot be initialised, no images found');

	var items = void 0;

	if (typeof src === 'string') {
		var els = [].slice.call(document.querySelectorAll(src));

		if (!els.length) throw new Error('Modal Gallery cannot be initialised, no images found');

		items = els.map(function (el) {
			return {
				trigger: el,
				src: el.getAttribute('href'),
				title: el.getAttribute('data-title') || null,
				description: el.getAttribute('data-description') || null
			};
		});
	} else {
		items = src;
	}

	return Object.assign(Object.create(StormModalGallery), {
		items: items,
		settings: Object.assign({}, defaults, opts)
	}).init();
};

exports.default = { init: init };;
}));
