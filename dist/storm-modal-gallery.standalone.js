/**
 * @name storm-modal-gallery: Modal gallery/lightbox
 * @version 1.3.2: Fri, 09 Mar 2018 17:26:43 GMT
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
	fullscreen: false,
	preload: false,
	totals: true,
	scrollable: false,
	single: false
};

var overlay = function overlay() {
	var overlay = document.createElement('div');

	overlay.className = 'modal-gallery__outer js-modal-gallery__outer';
	overlay.setAttribute('role', 'dialog');
	overlay.setAttribute('tabindex', '-1');
	overlay.setAttribute('aria-hidden', true);

	return overlay;
};

var overlayInner = function overlayInner(items) {
	return '<div class="modal-gallery__inner js-modal-gallery__inner">\n                                    <div class="modal-gallery__content js-modal-gallery__content">\n                                        ' + items + '\n                                    </div>\n                                </div>\n                                <button class="js-modal-gallery__next modal-gallery__next">\n                                    <svg role="button" role="button" width="44" height="60">\n                                        <polyline points="14 10 34 30 14 50" stroke="rgb(255,255,255)" stroke-width="4" stroke-linecap="butt" fill="none" stroke-linejoin="round"/>\n                                    </svg>\n                                </button>\n                                <button class="js-modal-gallery__previous modal-gallery__previous">\n                                    <svg role="button" width="44" height="60">\n                                        <polyline points="30 10 10 30 30 50" stroke="rgb(255,255,255)" stroke-width="4" stroke-linecap="butt" fill="none" stroke-linejoin="round"/>\n                                    </svg>\n                                </button>\n                                <button class="js-modal-gallery__close modal-gallery__close">\n                                    <svg role="button" role="button" width="30" height="30">\n                                        <g stroke="rgb(255,255,255)" stroke-width="4">\n                                            <line x1="5" y1="5" x2="25" y2="25"/>\n                                            <line x1="5" y1="25" x2="25" y2="5"/>\n                                        </g>\n                                    </svg>\n                                </button>\n                                <div class="modal-gallery__total js-gallery-totals"></div>';
};

var item = function item(details) {
	return '<div class="modal-gallery__item js-modal-gallery__item">\n                                    <div class="modal-gallery__img-container js-modal-gallery__img-container"></div>\n                                    ' + details + '\n                                </div>';
};

var details = function details(item) {
	return '<div class="modal-gallery__details">\n                                    <h1 class="modal-gallery__title">' + item.title + '</h1>\n                                    <div class="modal-gallery__description">' + item.description + '</div>\n                                </div>';
};

var KEY_CODES = {
	TAB: 9,
	ESC: 27,
	LEFT: 37,
	RIGHT: 39,
	ENTER: 13
};
var TRIGGER_EVENTS = [window.PointerEvent ? 'pointerdown' : 'ontouchstart' in window ? 'touchstart' : 'click', 'keydown'];

var componentPrototype = {
	init: function init() {
		var _this = this;

		this.isOpen = false;
		this.current = false;
		this.imageCache = [];
		this.items[0].trigger && this.initTriggers();
		this.settings.preload && this.items.forEach(function (item$$1, i) {
			_this.loadImage(i);
		});
		return this;
	},
	initTriggers: function initTriggers() {
		var _this2 = this;

		this.items.forEach(function (item$$1, i) {
			TRIGGER_EVENTS.forEach(function (ev) {
				item$$1.trigger.addEventListener(ev, function (e) {
					if (e.keyCode && e.keyCode !== KEY_CODES.ENTER) return;
					e.preventDefault();
					e.stopPropagation();
					_this2.open(i);
				});
			});
		});
	},
	initUI: function initUI(i) {
		var _this3 = this;

		this.DOMOverlay = document.body.appendChild(overlay());
		this.DOMOverlay.insertAdjacentHTML('beforeend', overlayInner(this.items.map(details).map(item).join('')));
		this.DOMItems = [].slice.call(this.DOMOverlay.querySelectorAll('.js-modal-gallery__item'));
		this.DOMTotals = this.DOMOverlay.querySelector('.js-gallery-totals');
		if (this.imageCache.length === this.items.length) this.imageCache.forEach(function (img, i) {
			_this3.writeImage(i);
		});else this.loadImages(i);
		return this;
	},
	unmountUI: function unmountUI() {
		this.DOMOverlay.parentNode.removeChild(this.DOMOverlay);
	},
	initButtons: function initButtons() {
		var _this4 = this;

		this.closeBtn = this.DOMOverlay.querySelector('.js-modal-gallery__close');
		this.closeBtn.addEventListener('click', this.close.bind(this));

		if (this.items.length < 2) {
			this.DOMOverlay.removeChild(this.DOMOverlay.querySelector('.js-modal-gallery__previous'));
			this.DOMOverlay.removeChild(this.DOMOverlay.querySelector('.js-modal-gallery__next'));
			return;
		}

		this.previousBtn = this.DOMOverlay.querySelector('.js-modal-gallery__previous');
		this.nextBtn = this.DOMOverlay.querySelector('.js-modal-gallery__next');

		TRIGGER_EVENTS.forEach(function (ev) {
			['previous', 'next'].forEach(function (type) {
				_this4[type + 'Btn'].addEventListener(ev, function (e) {
					if (e.keyCode && e.keyCode !== KEY_CODES.ENTER) return;
					_this4[type]();
				});
			});
		});
	},
	writeTotals: function writeTotals() {
		this.DOMTotals.innerHTML = this.current + 1 + '/' + this.items.length;
	},
	writeImage: function writeImage(i) {
		var imageContainer = this.DOMItems[i].querySelector('.js-modal-gallery__img-container'),
		    imageClassName = this.settings.scrollable ? 'modal-gallery__img modal-gallery__img--scrollable' : 'modal-gallery__img',
		    srcsetAttribute = this.items[i].srcset ? ' srcset="' + this.items[i].srcset + '"' : '',
		    sizesAttribute = this.items[i].sizes ? ' sizes="' + this.items[i].sizes + '"' : '';

		imageContainer.innerHTML = '<img class="' + imageClassName + '" src="' + this.items[i].src + '" alt="' + this.items[i].title + '"' + srcsetAttribute + sizesAttribute + '>';
		this.DOMItems[i].classList.remove('loading');
	},
	loadImage: function loadImage(i) {
		var _this5 = this;

		var img = new Image(),
		    loaded = function loaded() {
			_this5.imageCache[i] = img;
			_this5.writeImage(i);
		};
		img.onload = loaded;
		img.src = this.items[i].src;
		img.onerror = function () {
			_this5.DOMItems[i].classList.remove('loading');
			_this5.DOMItems[i].classList.add('error');
		};
		if (img.complete) loaded();
	},
	loadImages: function loadImages(i) {
		var _this6 = this;

		var indexes = [i];

		if (this.items.length > 1) indexes.push(i === 0 ? this.items.length - 1 : i - 1);
		if (this.items.length > 2) indexes.push(i === this.items.length - 1 ? 0 : i + 1);

		indexes.forEach(function (idx) {
			if (_this6.imageCache[idx] === undefined) {
				_this6.DOMItems[idx].classList.add('loading');
				_this6.loadImage(idx);
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
		if (!this.isOpen) return;

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
	incrementDecrement: function incrementDecrement(fn) {
		this.current !== false && this.DOMItems[this.current].classList.remove('active');
		this.current = fn();
		this.DOMItems[this.current].classList.add('active');
		this.loadImages(this.current);
		this.items.length > 1 && this.settings.totals && this.writeTotals();
	},
	previous: function previous() {
		var _this7 = this;

		this.incrementDecrement(function () {
			return _this7.current === 0 ? _this7.DOMItems.length - 1 : _this7.current - 1;
		});
	},
	next: function next() {
		var _this8 = this;

		this.incrementDecrement(function () {
			return _this8.current === _this8.DOMItems.length - 1 ? 0 : _this8.current + 1;
		});
	},
	open: function open(i) {
		this.initUI(i);
		this.initButtons();
		this.focusableChildren = this.getFocusableChildren();
		document.addEventListener('keydown', this.keyListener.bind(this));
		this.lastFocused = document.activeElement;
		this.focusableChildren.length && window.setTimeout(function () {
			this.focusableChildren[0].focus();
		}.bind(this), 0);
		this.DOMItems[i || 0].classList.add('active');
		this.toggle(i || 0);
	},
	close: function close() {
		document.removeEventListener('keydown', this.keyListener.bind(this));
		this.lastFocused && this.lastFocused.focus();
		this.DOMItems[this.current].classList.remove('active');
		this.toggle(null);
		this.unmountUI();
	},
	toggle: function toggle(i) {
		this.isOpen = !this.isOpen;
		this.current = i;
		this.DOMOverlay.classList.toggle('active');
		this.DOMOverlay.setAttribute('aria-hidden', !this.isOpen);
		this.DOMOverlay.setAttribute('tabindex', this.isOpen ? '0' : '-1');
		this.settings.fullscreen && this.toggleFullScreen();
		this.items.length > 1 && this.settings.totals && this.writeTotals();
	},
	toggleFullScreen: function toggleFullScreen() {
		if (this.isOpen) {
			this.DOMOverlay.requestFullscreen && this.DOMOverlay.requestFullscreen();
			this.DOMOverlay.webkitRequestFullscreen && this.DOMOverlay.webkitRequestFullscreen();
			this.DOMOverlay.mozRequestFullScreen && this.DOMOverlay.mozRequestFullScreen();
		} else {
			document.exitFullscreen && document.exitFullscreen();
			document.mozCancelFullScreen && document.mozCancelFullScreen();
			document.webkitExitFullscreen && document.webkitExitFullscreen();
		}
	}
};

var create = function create(items, opts) {
	return Object.assign(Object.create(componentPrototype), {
		items: items,
		settings: Object.assign({}, defaults, opts)
	}).init();
};

var singles = function singles(src, opts) {
	var els = [].slice.call(document.querySelectorAll(src));

	if (!els.length) throw new Error('Modal Gallery cannot be initialised, no images found');

	return els.map(function (el) {
		return create([{
			trigger: el,
			src: el.getAttribute('href'),
			srcset: el.getAttribute('data-srcset') || null,
			sizes: el.getAttribute('data-sizes') || null,
			title: el.getAttribute('data-title') || '',
			description: el.getAttribute('data-description') || ''
		}], opts);
	});
};

var galleries = function galleries(src, opts) {
	var items = void 0;

	if (typeof src === 'string') {
		var els = [].slice.call(document.querySelectorAll(src));

		if (!els.length) throw new Error('Modal Gallery cannot be initialised, no images found');

		items = els.map(function (el) {
			return {
				trigger: el,
				src: el.getAttribute('href'),
				srcset: el.getAttribute('data-srcset') || null,
				sizes: el.getAttribute('data-sizes') || null,
				title: el.getAttribute('data-title') || '',
				description: el.getAttribute('data-description') || ''
			};
		});
	} else items = src;

	return create(items, opts);
};

var init = function init(src, opts) {
	if (!src.length) throw new Error('Modal Gallery cannot be initialised, no images found');

	if (opts && opts.single) return singles(src, opts);else return galleries(src, opts);
};

var index = { init: init };

exports.default = index;;
}));
