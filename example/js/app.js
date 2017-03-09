(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _stormModalGallery = require('./libs/storm-modal-gallery');

var _stormModalGallery2 = _interopRequireDefault(_stormModalGallery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var onDOMContentLoadedTasks = [function () {

	// let gallery = ModalGallery.init([
	// 	{
	// 		src: 'http://placehold.it/500x500',
	// 		srcset:'http://placehold.it/800x800 800w, http://placehold.it/500x500 320w',
	// 		title: 'Image 1',
	// 		description: 'Description 1'
	// 	},
	// 	{
	// 		src: 'http://placehold.it/300x800',
	// 		srcset:'http://placehold.it/500x800 800w, http://placehold.it/300x500 320w',
	// 		title: 'Image 2',
	// 		description: 'Description 2'
	// 	}]);

	//console.log(gallery);

	//document.querySelector('.js-modal-gallery__trigger').addEventListener('click', gallery.open.bind(gallery, 0));

	_stormModalGallery2.default.init('.js-modal-gallery', {
		totals: false
	});
}];

if ('addEventListener' in window) window.addEventListener('DOMContentLoaded', function () {
	onDOMContentLoadedTasks.forEach(function (fn) {
		return fn();
	});
});

},{"./libs/storm-modal-gallery":2}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
/**
 * @name storm-modal-gallery: Modal gallery/lightbox
 * @version 0.2.0: Thu, 09 Mar 2017 17:09:03 GMT
 * @author mjbp
 * @license MIT
 */
var defaults = {
	templates: {
		overlay: '<div class="modal-gallery__inner js-modal-gallery__inner">\n\t\t\t\t\t\t\t<div class="modal-gallery__content js-modal-gallery__content">\n\t\t\t\t\t\t\t\t{{items}}\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<button class="js-modal-gallery__next modal-gallery__next">\n\t\t\t\t\t\t\t<svg role="button" role="button" width="44" height="60">\n\t\t\t\t\t\t\t\t<polyline points="14 10 34 30 14 50" stroke="rgb(255,255,255)" stroke-width="4" stroke-linecap="butt" fill="none" stroke-linejoin="round"/>\n\t\t\t\t\t\t\t</svg>\n\t\t\t\t\t\t</button>\n\t\t\t\t\t\t<button class="js-modal-gallery__previous modal-gallery__previous">\n\t\t\t\t\t\t\t<svg role="button" width="44" height="60">\n\t\t\t\t\t\t\t\t<polyline points="30 10 10 30 30 50" stroke="rgb(255,255,255)" stroke-width="4" stroke-linecap="butt" fill="none" stroke-linejoin="round"/>\n\t\t\t\t\t\t\t</svg>\n\t\t\t\t\t\t</button>\n\t\t\t\t\t\t<button class="js-modal-gallery__close modal-gallery__close">\n\t\t\t\t\t\t\t<svg role="button" role="button" width="30" height="30">\n\t\t\t\t\t\t\t\t<g stroke="rgb(255,255,255)" stroke-width="4">\n\t\t\t\t\t\t\t\t\t<line x1="5" y1="5" x2="25" y2="25"/>\n\t\t\t\t\t\t\t\t\t<line x1="5" y1="25" x2="25" y2="5"/>\n\t\t\t\t\t\t\t\t</g>\n\t\t\t\t\t\t\t</svg>\n\t\t\t\t\t\t</button>\n\t\t\t\t\t\t<div class="modal-gallery__total js-gallery-totals"></div>',
		item: '<div class="modal-gallery__item js-modal-gallery__item">\n\t\t\t\t\t\t<div class="modal-gallery__img-container js-modal-gallery__img-container"></div>\n\t\t\t\t\t\t{{details}}\n\t\t\t\t\t</div>',
		details: '<div class="modal-gallery__details">\n\t\t\t\t\t\t<h1 class="modal-gallery__title">{{title}}</h1>\n\t\t\t\t\t\t<div class="modal-gallery__description">{{description}}</div>\n\t\t\t\t\t</div>'
	},
	fullscreen: false,
	preload: false,
	totals: true
},
    KEY_CODES = {
	TAB: 9,
	ESC: 27,
	LEFT: 37,
	RIGHT: 39,
	ENTER: 13
},
    TRIGGER_EVENTS = ['click', 'keydown', 'touchstart'];

var StormModalGallery = {
	init: function init() {
		var _this = this;

		this.isOpen = false;
		this.current = null;
		this.initUI();
		this.imageCache = [];
		this.focusableChildren = this.getFocusableChildren();
		this.initButtons();
		this.items[0].trigger && this.initTriggers();
		this.settings.preload && this.items.forEach(function (item, i) {
			_this.loadImage(i);
		});
		return this;
	},
	initTriggers: function initTriggers() {
		var _this2 = this;

		this.items.forEach(function (item, i) {
			TRIGGER_EVENTS.forEach(function (ev) {
				item.trigger.addEventListener(ev, function (e) {
					if (e.keyCode && e.keyCode !== KEY_CODES.ENTER) return;
					e.preventDefault();
					e.stopPropagation();
					_this2.open(i);
				});
			});
		});
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
		}.bind(this)),
		    overlay = document.createElement('div');

		overlay.className = 'modal-gallery__outer js-modal-gallery__outer';
		overlay.setAttribute('role', 'dialog');
		overlay.setAttribute('tabindex', '-1');
		overlay.setAttribute('aria-hidden', true);

		this.DOMOverlay = document.body.appendChild(overlay);

		this.DOMOverlay.insertAdjacentHTML('beforeend', this.settings.templates.overlay.split('{{items}}').join(itemsString.join('')));
		this.DOMItems = [].slice.call(this.DOMOverlay.querySelectorAll('.js-modal-gallery__item'));
		this.DOMTotals = this.DOMOverlay.querySelector('.js-gallery-totals');
		return this;
	},
	initButtons: function initButtons() {
		this.previousBtn = this.DOMOverlay.querySelector('.js-modal-gallery__previous');
		this.nextBtn = this.DOMOverlay.querySelector('.js-modal-gallery__next');
		this.closeBtn = this.DOMOverlay.querySelector('.js-modal-gallery__close');

		this.closeBtn.addEventListener('click', function () {
			this.close();
		}.bind(this));

		if (this.total < 2) {
			this.previousBtn.parentNode.removeChild(this.previousBtn);
			this.nextBtn.parentNode.removeChild(this.nextBtn);
			return;
		}

		this.previousBtn.addEventListener('click', function () {
			this.previous();
		}.bind(this));
		this.nextBtn.addEventListener('click', function () {
			this.next();
		}.bind(this));
	},

	writeTotals: function writeTotals() {
		this.DOMTotals.innerHTML = this.current + 1 + '/' + this.total;
	},
	loadImage: function loadImage(i) {
		var _this3 = this;

		var img = new Image(),
		    imageContainer = this.DOMItems[i].querySelector('.js-modal-gallery__img-container'),
		    loaded = function loaded() {
			var srcsetAttribute = _this3.items[i].srcset ? ' srcset="' + _this3.items[i].srcset + '"' : '',
			    sizesAttribute = _this3.items[i].sizes ? ' sizes="' + _this3.items[i].sizes + '"' : '';
			imageContainer.innerHTML = '<img class="modal-gallery__img" src="' + _this3.items[i].src + '" alt="' + _this3.items[i].title + '"' + srcsetAttribute + sizesAttribute + '>';
			_this3.DOMItems[i].classList.remove('loading');
			img.onload = null;
		};
		img.onload = loaded;
		img.src = this.items[i].src;
		img.onerror = function () {
			_this3.DOMItems[i].classList.remove('loading');
			_this3.DOMItems[i].classList.add('error');
		};
		if (img.complete) loaded();
	},
	loadImages: function loadImages(i) {
		var _this4 = this;

		if (this.imageCache.length === this.items) return;

		var indexes = [i];

		if (this.items.length > 1) indexes.push(i === 0 ? this.items.length - 1 : i - 1);
		if (this.items.length > 2) indexes.push(i === this.items.length - 1 ? 0 : i + 1);

		indexes.forEach(function (idx) {
			if (_this4.imageCache[idx] === undefined) {
				_this4.DOMItems[idx].classList.add('loading');
				_this4.loadImage(idx);
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
	previous: function previous() {
		this.current && this.DOMItems[this.current].classList.remove('active');
		this.current = this.current === 0 ? this.DOMItems.length - 1 : this.current - 1;
		this.DOMItems[this.current].classList.add('active');
		this.loadImages(this.current);
		this.total > 1 && this.settings.totals && this.writeTotals();
	},
	next: function next() {
		this.current && this.DOMItems[this.current].classList.remove('active');
		this.current = this.current === this.DOMItems.length - 1 ? 0 : this.current + 1;
		this.DOMItems[this.current].classList.add('active');
		this.loadImages(this.current);
		this.total > 1 && this.settings.totals && this.writeTotals();
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
		this.lastFocused && this.lastFocused.focus();
		this.DOMItems[this.current].classList.remove('active');
		this.toggle(null);
	},
	toggle: function toggle(i) {
		this.isOpen = !this.isOpen;
		this.current = i;
		this.DOMOverlay.classList.toggle('active');
		this.DOMOverlay.setAttribute('aria-hidden', !this.isOpen);
		this.DOMOverlay.setAttribute('tabindex', this.isOpen ? '0' : '-1');
		this.settings.fullscreen && this.toggleFullScreen();
		this.total > 1 && this.settings.totals && this.writeTotals();
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
				srcset: el.getAttribute('data-srcset') || null,
				sizes: el.getAttribute('data-sizes') || null,
				title: el.getAttribute('data-title') || '',
				description: el.getAttribute('data-description') || ''
			};
		});
	} else {
		items = src;
	}

	return Object.assign(Object.create(StormModalGallery), {
		items: items,
		total: items.length,
		settings: Object.assign({}, defaults, opts)
	}).init();
};

exports.default = { init: init };

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJleGFtcGxlL3NyYy9hcHAuanMiLCJleGFtcGxlL3NyYy9saWJzL3N0b3JtLW1vZGFsLWdhbGxlcnkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBOzs7Ozs7QUFFQSxJQUFNLDBCQUEwQixDQUFDLFlBQU07O0FBRXRDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBLDZCQUFhLElBQWIsQ0FBa0IsbUJBQWxCLEVBQXVDO0FBQ3RDLFVBQVE7QUFEOEIsRUFBdkM7QUFJQSxDQXhCK0IsQ0FBaEM7O0FBMEJBLElBQUcsc0JBQXNCLE1BQXpCLEVBQWlDLE9BQU8sZ0JBQVAsQ0FBd0Isa0JBQXhCLEVBQTRDLFlBQU07QUFBRSx5QkFBd0IsT0FBeEIsQ0FBZ0M7QUFBQSxTQUFNLElBQU47QUFBQSxFQUFoQztBQUE4QyxDQUFsRzs7Ozs7Ozs7QUM1QmpDOzs7Ozs7QUFNQSxJQUFNLFdBQVc7QUFDZixZQUFXO0FBQ1YsMDFDQURVO0FBeUJWLDJNQXpCVTtBQTZCVjtBQTdCVSxFQURJO0FBbUNmLGFBQVksS0FuQ0c7QUFvQ2YsVUFBUyxLQXBDTTtBQXFDZixTQUFRO0FBckNPLENBQWpCO0FBQUEsSUF1Q0MsWUFBWTtBQUNYLE1BQUssQ0FETTtBQUVYLE1BQUssRUFGTTtBQUdYLE9BQU0sRUFISztBQUlYLFFBQU8sRUFKSTtBQUtYLFFBQU87QUFMSSxDQXZDYjtBQUFBLElBOENDLGlCQUFpQixDQUFDLE9BQUQsRUFBVSxTQUFWLEVBQXFCLFlBQXJCLENBOUNsQjs7QUFnREEsSUFBTSxvQkFBb0I7QUFDekIsS0FEeUIsa0JBQ2xCO0FBQUE7O0FBQ04sT0FBSyxNQUFMLEdBQWMsS0FBZDtBQUNBLE9BQUssT0FBTCxHQUFlLElBQWY7QUFDQSxPQUFLLE1BQUw7QUFDQSxPQUFLLFVBQUws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QUE0QixJQUE1QjtBQUg0QyxFQUFoRCxFQUlKLElBSkksRUFBUDtBQUtBLENBN0JEOztrQkErQmUsRUFBRSxVQUFGLEUiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IE1vZGFsR2FsbGVyeSBmcm9tICcuL2xpYnMvc3Rvcm0tbW9kYWwtZ2FsbGVyeSc7XG5cbmNvbnN0IG9uRE9NQ29udGVudExvYWRlZFRhc2tzID0gWygpID0+IHtcblxuXHQvLyBsZXQgZ2FsbGVyeSA9IE1vZGFsR2FsbGVyeS5pbml0KFtcblx0Ly8gXHR7XG5cdC8vIFx0XHRzcmM6ICdodHRwOi8vcGxhY2Vob2xkLml0LzUwMHg1MDAnLFxuXHQvLyBcdFx0c3Jjc2V0OidodHRwOi8vcGxhY2Vob2xkLml0LzgwMHg4MDAgODAwdywgaHR0cDovL3BsYWNlaG9sZC5pdC81MDB4NTAwIDMyMHcnLFxuXHQvLyBcdFx0dGl0bGU6ICdJbWFnZSAxJyxcblx0Ly8gXHRcdGRlc2NyaXB0aW9uOiAnRGVzY3JpcHRpb24gMSdcblx0Ly8gXHR9LFxuXHQvLyBcdHtcblx0Ly8gXHRcdHNyYzogJ2h0dHA6Ly9wbGFjZWhvbGQuaXQvMzAweDgwMCcsXG5cdC8vIFx0XHRzcmNzZXQ6J2h0dHA6Ly9wbGFjZWhvbGQuaXQvNTAweDgwMCA4MDB3LCBodHRwOi8vcGxhY2Vob2xkLml0LzMwMHg1MDAgMzIwdycsXG5cdC8vIFx0XHR0aXRsZTogJ0ltYWdlIDInLFxuXHQvLyBcdFx0ZGVzY3JpcHRpb246ICdEZXNjcmlwdGlvbiAyJ1xuXHQvLyBcdH1dKTtcblxuXHQvL2NvbnNvbGUubG9nKGdhbGxlcnkpO1xuXHRcblx0Ly9kb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuanMtbW9kYWwtZ2FsbGVyeV9fdHJpZ2dlcicpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZ2FsbGVyeS5vcGVuLmJpbmQoZ2FsbGVyeSwgMCkpO1xuXG5cdE1vZGFsR2FsbGVyeS5pbml0KCcuanMtbW9kYWwtZ2FsbGVyeScsIHtcblx0XHR0b3RhbHM6IGZhbHNlXG5cdH0pO1xuXG59XTtcbiAgICBcbmlmKCdhZGRFdmVudExpc3RlbmVyJyBpbiB3aW5kb3cpIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4geyBvbkRPTUNvbnRlbnRMb2FkZWRUYXNrcy5mb3JFYWNoKGZuID0+IGZuKCkpOyB9KTsiLCIvKipcbiAqIEBuYW1lIHN0b3JtLW1vZGFsLWdhbGxlcnk6IE1vZGFsIGdhbGxlcnkvbGlnaHRib3hcbiAqIEB2ZXJzaW9uIDAuMi4wOiBUaHUsIDA5IE1hciAyMDE3IDE3OjA5OjAzIEdNVFxuICogQGF1dGhvciBtamJwXG4gKiBAbGljZW5zZSBNSVRcbiAqL1xuY29uc3QgZGVmYXVsdHMgPSB7XG5cdFx0dGVtcGxhdGVzOiB7XG5cdFx0XHRvdmVybGF5OiBgPGRpdiBjbGFzcz1cIm1vZGFsLWdhbGxlcnlfX2lubmVyIGpzLW1vZGFsLWdhbGxlcnlfX2lubmVyXCI+XG5cdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJtb2RhbC1nYWxsZXJ5X19jb250ZW50IGpzLW1vZGFsLWdhbGxlcnlfX2NvbnRlbnRcIj5cblx0XHRcdFx0XHRcdFx0XHR7e2l0ZW1zfX1cblx0XHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHRcdDxidXR0b24gY2xhc3M9XCJqcy1tb2RhbC1nYWxsZXJ5X19uZXh0IG1vZGFsLWdhbGxlcnlfX25leHRcIj5cblx0XHRcdFx0XHRcdFx0PHN2ZyByb2xlPVwiYnV0dG9uXCIgcm9sZT1cImJ1dHRvblwiIHdpZHRoPVwiNDRcIiBoZWlnaHQ9XCI2MFwiPlxuXHRcdFx0XHRcdFx0XHRcdDxwb2x5bGluZSBwb2ludHM9XCIxNCAxMCAzNCAzMCAxNCA1MFwiIHN0cm9rZT1cInJnYigyNTUsMjU1LDI1NSlcIiBzdHJva2Utd2lkdGg9XCI0XCIgc3Ryb2tlLWxpbmVjYXA9XCJidXR0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiLz5cblx0XHRcdFx0XHRcdFx0PC9zdmc+XG5cdFx0XHRcdFx0XHQ8L2J1dHRvbj5cblx0XHRcdFx0XHRcdDxidXR0b24gY2xhc3M9XCJqcy1tb2RhbC1nYWxsZXJ5X19wcmV2aW91cyBtb2RhbC1nYWxsZXJ5X19wcmV2aW91c1wiPlxuXHRcdFx0XHRcdFx0XHQ8c3ZnIHJvbGU9XCJidXR0b25cIiB3aWR0aD1cIjQ0XCIgaGVpZ2h0PVwiNjBcIj5cblx0XHRcdFx0XHRcdFx0XHQ8cG9seWxpbmUgcG9pbnRzPVwiMzAgMTAgMTAgMzAgMzAgNTBcIiBzdHJva2U9XCJyZ2IoMjU1LDI1NSwyNTUpXCIgc3Ryb2tlLXdpZHRoPVwiNFwiIHN0cm9rZS1saW5lY2FwPVwiYnV0dFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIi8+XG5cdFx0XHRcdFx0XHRcdDwvc3ZnPlxuXHRcdFx0XHRcdFx0PC9idXR0b24+XG5cdFx0XHRcdFx0XHQ8YnV0dG9uIGNsYXNzPVwianMtbW9kYWwtZ2FsbGVyeV9fY2xvc2UgbW9kYWwtZ2FsbGVyeV9fY2xvc2VcIj5cblx0XHRcdFx0XHRcdFx0PHN2ZyByb2xlPVwiYnV0dG9uXCIgcm9sZT1cImJ1dHRvblwiIHdpZHRoPVwiMzBcIiBoZWlnaHQ9XCIzMFwiPlxuXHRcdFx0XHRcdFx0XHRcdDxnIHN0cm9rZT1cInJnYigyNTUsMjU1LDI1NSlcIiBzdHJva2Utd2lkdGg9XCI0XCI+XG5cdFx0XHRcdFx0XHRcdFx0XHQ8bGluZSB4MT1cIjVcIiB5MT1cIjVcIiB4Mj1cIjI1XCIgeTI9XCIyNVwiLz5cblx0XHRcdFx0XHRcdFx0XHRcdDxsaW5lIHgxPVwiNVwiIHkxPVwiMjVcIiB4Mj1cIjI1XCIgeTI9XCI1XCIvPlxuXHRcdFx0XHRcdFx0XHRcdDwvZz5cblx0XHRcdFx0XHRcdFx0PC9zdmc+XG5cdFx0XHRcdFx0XHQ8L2J1dHRvbj5cblx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJtb2RhbC1nYWxsZXJ5X190b3RhbCBqcy1nYWxsZXJ5LXRvdGFsc1wiPjwvZGl2PmAsXG5cdFx0XHRpdGVtOiBgPGRpdiBjbGFzcz1cIm1vZGFsLWdhbGxlcnlfX2l0ZW0ganMtbW9kYWwtZ2FsbGVyeV9faXRlbVwiPlxuXHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cIm1vZGFsLWdhbGxlcnlfX2ltZy1jb250YWluZXIganMtbW9kYWwtZ2FsbGVyeV9faW1nLWNvbnRhaW5lclwiPjwvZGl2PlxuXHRcdFx0XHRcdFx0e3tkZXRhaWxzfX1cblx0XHRcdFx0XHQ8L2Rpdj5gLFxuXHRcdFx0ZGV0YWlsczogYDxkaXYgY2xhc3M9XCJtb2RhbC1nYWxsZXJ5X19kZXRhaWxzXCI+XG5cdFx0XHRcdFx0XHQ8aDEgY2xhc3M9XCJtb2RhbC1nYWxsZXJ5X190aXRsZVwiPnt7dGl0bGV9fTwvaDE+XG5cdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwibW9kYWwtZ2FsbGVyeV9fZGVzY3JpcHRpb25cIj57e2Rlc2NyaXB0aW9ufX08L2Rpdj5cblx0XHRcdFx0XHQ8L2Rpdj5gXG5cdFx0fSxcblx0XHRmdWxsc2NyZWVuOiBmYWxzZSxcblx0XHRwcmVsb2FkOiBmYWxzZSxcblx0XHR0b3RhbHM6IHRydWVcblx0fSxcblx0S0VZX0NPREVTID0ge1xuXHRcdFRBQjogOSxcblx0XHRFU0M6IDI3LFxuXHRcdExFRlQ6IDM3LFxuXHRcdFJJR0hUOiAzOSxcblx0XHRFTlRFUjogMTNcblx0fSxcblx0VFJJR0dFUl9FVkVOVFMgPSBbJ2NsaWNrJywgJ2tleWRvd24nLCAndG91Y2hzdGFydCddO1xuXG5jb25zdCBTdG9ybU1vZGFsR2FsbGVyeSA9IHtcblx0aW5pdCgpIHtcblx0XHR0aGlzLmlzT3BlbiA9IGZhbHNlO1xuXHRcdHRoaXMuY3VycmVudCA9IG51bGw7XG5cdFx0dGhpcy5pbml0VUkoKTtcblx0XHR0aGlzLmltYWdlQ2FjaGUgPSBbXTtcblx0XHR0aGlzLmZvY3VzYWJsZUNoaWxkcmVuID0gdGhpcy5nZXRGb2N1c2FibGVDaGlsZHJlbigpO1xuXHRcdHRoaXMuaW5pdEJ1dHRvbnMoKTtcblx0XHR0aGlzLml0ZW1zWzBdLnRyaWdnZXIgJiYgdGhpcy5pbml0VHJpZ2dlcnMoKTtcblx0XHR0aGlzLnNldHRpbmdzLnByZWxvYWQgJiYgdGhpcy5pdGVtcy5mb3JFYWNoKChpdGVtLCBpKSA9PiB7XG5cdFx0XHR0aGlzLmxvYWRJbWFnZShpKTtcblx0XHR9KTtcblx0XHRyZXR1cm4gdGhpcztcblx0fSxcblx0aW5pdFRyaWdnZXJzKCl7XG5cdFx0dGhpcy5pdGVtcy5mb3JFYWNoKChpdGVtLCBpKSA9PiB7XG5cdFx0XHRUUklHR0VSX0VWRU5UUy5mb3JFYWNoKGV2ID0+IHtcblx0XHRcdFx0aXRlbS50cmlnZ2VyLmFkZEV2ZW50TGlzdGVuZXIoZXYsIGUgPT4ge1xuXHRcdFx0XHRcdGlmKGUua2V5Q29kZSAmJiBlLmtleUNvZGUgIT09IEtFWV9DT0RFUy5FTlRFUikgcmV0dXJuO1xuXHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHRlLnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdFx0XHRcdHRoaXMub3BlbihpKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9KTtcblx0XHR9KTtcblx0fSxcblx0aW5pdFVJKCl7XG5cdFx0bGV0IHJlbmRlclRlbXBsYXRlID0gKGRhdGEsIHRlbXBsYXRlKSA9PiB7XG5cdFx0XHRcdGZvcihsZXQgZGF0dW0gaW4gZGF0YSl7XG5cdFx0XHRcdFx0aWYoZGF0YS5oYXNPd25Qcm9wZXJ0eShkYXR1bSkpe1xuXHRcdFx0XHRcdFx0dGVtcGxhdGUgPSB0ZW1wbGF0ZS5zcGxpdChge3ske2RhdHVtfX19YCkuam9pbihkYXRhW2RhdHVtXSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiB0ZW1wbGF0ZTtcblx0XHRcdH0sXG5cdFx0XHRkZXRhaWxzU3RyaW5nQXJyYXkgPSB0aGlzLml0ZW1zLm1hcChmdW5jdGlvbihpbWcpIHtcblx0XHRcdFx0cmV0dXJuIHJlbmRlclRlbXBsYXRlKGltZywgdGhpcy5zZXR0aW5ncy50ZW1wbGF0ZXMuZGV0YWlscyk7XG5cdFx0XHR9LmJpbmQodGhpcykpLFxuXHRcdFx0aXRlbXNTdHJpbmcgPSBkZXRhaWxzU3RyaW5nQXJyYXkubWFwKGZ1bmN0aW9uKGl0ZW0pIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuc2V0dGluZ3MudGVtcGxhdGVzLml0ZW0uc3BsaXQoJ3t7ZGV0YWlsc319Jykuam9pbihpdGVtKTtcblx0XHRcdH0uYmluZCh0aGlzKSksXG5cdFx0XHRvdmVybGF5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cblx0XHRvdmVybGF5LmNsYXNzTmFtZSA9ICdtb2RhbC1nYWxsZXJ5X19vdXRlciBqcy1tb2RhbC1nYWxsZXJ5X19vdXRlcic7XG5cdFx0b3ZlcmxheS5zZXRBdHRyaWJ1dGUoJ3JvbGUnLCAnZGlhbG9nJyk7XG5cdFx0b3ZlcmxheS5zZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JywgJy0xJyk7XG5cdFx0b3ZlcmxheS5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgdHJ1ZSk7XG5cblx0XHR0aGlzLkRPTU92ZXJsYXkgPSBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKG92ZXJsYXkpO1xuXG5cdFx0dGhpcy5ET01PdmVybGF5Lmluc2VydEFkamFjZW50SFRNTCgnYmVmb3JlZW5kJywgdGhpcy5zZXR0aW5ncy50ZW1wbGF0ZXMub3ZlcmxheS5zcGxpdCgne3tpdGVtc319Jykuam9pbihpdGVtc1N0cmluZy5qb2luKCcnKSkpO1xuXHRcdHRoaXMuRE9NSXRlbXMgPSBbXS5zbGljZS5jYWxsKHRoaXMuRE9NT3ZlcmxheS5xdWVyeVNlbGVjdG9yQWxsKCcuanMtbW9kYWwtZ2FsbGVyeV9faXRlbScpKTtcblx0XHR0aGlzLkRPTVRvdGFscyA9IHRoaXMuRE9NT3ZlcmxheS5xdWVyeVNlbGVjdG9yKCcuanMtZ2FsbGVyeS10b3RhbHMnKTtcblx0XHRyZXR1cm4gdGhpcztcblx0fSxcblx0aW5pdEJ1dHRvbnMoKXtcblx0XHR0aGlzLnByZXZpb3VzQnRuID0gdGhpcy5ET01PdmVybGF5LnF1ZXJ5U2VsZWN0b3IoJy5qcy1tb2RhbC1nYWxsZXJ5X19wcmV2aW91cycpO1xuXHRcdHRoaXMubmV4dEJ0biA9IHRoaXMuRE9NT3ZlcmxheS5xdWVyeVNlbGVjdG9yKCcuanMtbW9kYWwtZ2FsbGVyeV9fbmV4dCcpO1xuXHRcdHRoaXMuY2xvc2VCdG4gPSB0aGlzLkRPTU92ZXJsYXkucXVlcnlTZWxlY3RvcignLmpzLW1vZGFsLWdhbGxlcnlfX2Nsb3NlJyk7XG5cblx0XHR0aGlzLmNsb3NlQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG5cdFx0XHR0aGlzLmNsb3NlKCk7XG5cdFx0fS5iaW5kKHRoaXMpKTtcblxuXHRcdGlmICh0aGlzLnRvdGFsIDwgMikge1xuXHRcdFx0dGhpcy5wcmV2aW91c0J0bi5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHRoaXMucHJldmlvdXNCdG4pO1xuXHRcdFx0dGhpcy5uZXh0QnRuLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQodGhpcy5uZXh0QnRuKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR0aGlzLnByZXZpb3VzQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG5cdFx0XHR0aGlzLnByZXZpb3VzKCk7XG5cdFx0fS5iaW5kKHRoaXMpKTtcblx0XHR0aGlzLm5leHRCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpIHtcblx0XHRcdHRoaXMubmV4dCgpO1xuXHRcdH0uYmluZCh0aGlzKSk7XG5cdH0sXG5cdHdyaXRlVG90YWxzOiBmdW5jdGlvbiB3cml0ZVRvdGFscygpIHtcblx0XHR0aGlzLkRPTVRvdGFscy5pbm5lckhUTUwgPSBgJHt0aGlzLmN1cnJlbnQgKyAxfS8ke3RoaXMudG90YWx9YDtcblx0fSxcblx0bG9hZEltYWdlKGkpIHtcblx0XHR2YXIgaW1nID0gbmV3IEltYWdlKCksXG5cdFx0XHRpbWFnZUNvbnRhaW5lciA9IHRoaXMuRE9NSXRlbXNbaV0ucXVlcnlTZWxlY3RvcignLmpzLW1vZGFsLWdhbGxlcnlfX2ltZy1jb250YWluZXInKSxcblx0XHRcdGxvYWRlZCA9ICgpID0+IHtcblx0XHRcdFx0bGV0IHNyY3NldEF0dHJpYnV0ZSA9IHRoaXMuaXRlbXNbaV0uc3Jjc2V0ID8gYCBzcmNzZXQ9XCIke3RoaXMuaXRlbXNbaV0uc3Jjc2V0fVwiYCA6ICcnLFxuXHRcdFx0XHRcdHNpemVzQXR0cmlidXRlID0gdGhpcy5pdGVtc1tpXS5zaXplcyA/IGAgc2l6ZXM9XCIke3RoaXMuaXRlbXNbaV0uc2l6ZXN9XCJgIDogJyc7XG5cdFx0XHRcdGltYWdlQ29udGFpbmVyLmlubmVySFRNTCA9IGA8aW1nIGNsYXNzPVwibW9kYWwtZ2FsbGVyeV9faW1nXCIgc3JjPVwiJHt0aGlzLml0ZW1zW2ldLnNyY31cIiBhbHQ9XCIke3RoaXMuaXRlbXNbaV0udGl0bGV9XCIke3NyY3NldEF0dHJpYnV0ZX0ke3NpemVzQXR0cmlidXRlfT5gO1xuXHRcdFx0XHR0aGlzLkRPTUl0ZW1zW2ldLmNsYXNzTGlzdC5yZW1vdmUoJ2xvYWRpbmcnKTtcblx0XHRcdFx0aW1nLm9ubG9hZCA9IG51bGw7XG5cdFx0XHR9O1xuXHRcdGltZy5vbmxvYWQgPSBsb2FkZWQ7XG5cdFx0aW1nLnNyYyA9IHRoaXMuaXRlbXNbaV0uc3JjO1xuXHRcdGltZy5vbmVycm9yID0gKCkgPT4ge1xuXHRcdFx0dGhpcy5ET01JdGVtc1tpXS5jbGFzc0xpc3QucmVtb3ZlKCdsb2FkaW5nJyk7XG5cdFx0XHR0aGlzLkRPTUl0ZW1zW2ldLmNsYXNzTGlzdC5hZGQoJ2Vycm9yJyk7XG5cdFx0fTtcblx0XHRpZihpbWcuY29tcGxldGUpIGxvYWRlZCgpO1xuXHR9LFxuXHRsb2FkSW1hZ2VzKGkpe1xuXHRcdGlmKHRoaXMuaW1hZ2VDYWNoZS5sZW5ndGggPT09IHRoaXMuaXRlbXMpIHJldHVybjtcblxuXHRcdGxldCBpbmRleGVzID0gW2ldO1xuXG5cdFx0aWYodGhpcy5pdGVtcy5sZW5ndGggPiAxKSBpbmRleGVzLnB1c2goaSA9PT0gMCA/IHRoaXMuaXRlbXMubGVuZ3RoIC0gMSA6IGkgLSAxKTtcblx0XHRpZih0aGlzLml0ZW1zLmxlbmd0aCA+IDIpIGluZGV4ZXMucHVzaChpID09PSB0aGlzLml0ZW1zLmxlbmd0aCAtIDEgPyAwIDogaSArIDEpO1xuXG5cdFx0aW5kZXhlcy5mb3JFYWNoKGlkeCA9PiB7XG5cdFx0XHRpZih0aGlzLmltYWdlQ2FjaGVbaWR4XSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdHRoaXMuRE9NSXRlbXNbaWR4XS5jbGFzc0xpc3QuYWRkKCdsb2FkaW5nJyk7XG5cdFx0XHRcdHRoaXMubG9hZEltYWdlKGlkeCk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0fSxcblx0Z2V0Rm9jdXNhYmxlQ2hpbGRyZW4oKSB7XG5cdFx0bGV0IGZvY3VzYWJsZUVsZW1lbnRzID0gWydhW2hyZWZdJywgJ2FyZWFbaHJlZl0nLCAnaW5wdXQ6bm90KFtkaXNhYmxlZF0pJywgJ3NlbGVjdDpub3QoW2Rpc2FibGVkXSknLCAndGV4dGFyZWE6bm90KFtkaXNhYmxlZF0pJywgJ2J1dHRvbjpub3QoW2Rpc2FibGVkXSknLCAnaWZyYW1lJywgJ29iamVjdCcsICdlbWJlZCcsICdbY29udGVudGVkaXRhYmxlXScsICdbdGFiaW5kZXhdOm5vdChbdGFiaW5kZXg9XCItMVwiXSknXTtcblxuXHRcdHJldHVybiBbXS5zbGljZS5jYWxsKHRoaXMuRE9NT3ZlcmxheS5xdWVyeVNlbGVjdG9yQWxsKGZvY3VzYWJsZUVsZW1lbnRzLmpvaW4oJywnKSkpO1xuXHR9LFxuXHR0cmFwVGFiKGUpe1xuXHRcdGxldCBmb2N1c2VkSW5kZXggPSB0aGlzLmZvY3VzYWJsZUNoaWxkcmVuLmluZGV4T2YoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCk7XG5cdFx0aWYoZS5zaGlmdEtleSAmJiBmb2N1c2VkSW5kZXggPT09IDApIHtcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdHRoaXMuZm9jdXNhYmxlQ2hpbGRyZW5bdGhpcy5mb2N1c2FibGVDaGlsZHJlbi5sZW5ndGggLSAxXS5mb2N1cygpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRpZighZS5zaGlmdEtleSAmJiBmb2N1c2VkSW5kZXggPT09IHRoaXMuZm9jdXNhYmxlQ2hpbGRyZW4ubGVuZ3RoIC0gMSkge1xuXHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdHRoaXMuZm9jdXNhYmxlQ2hpbGRyZW5bMF0uZm9jdXMoKTtcblx0XHRcdH1cblx0XHR9XG5cdH0sXG5cdGtleUxpc3RlbmVyKGUpe1xuXHRcdGlmKCF0aGlzLmlzT3BlbikgcmV0dXJuO1xuXG5cdFx0c3dpdGNoIChlLmtleUNvZGUpIHtcblx0XHRjYXNlIEtFWV9DT0RFUy5FU0M6XG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHR0aGlzLnRvZ2dsZSgpO1xuXHRcdFx0YnJlYWs7XG5cdFx0Y2FzZSBLRVlfQ09ERVMuVEFCOlxuXHRcdFx0dGhpcy50cmFwVGFiKGUpO1xuXHRcdFx0YnJlYWs7XG5cdFx0Y2FzZSBLRVlfQ09ERVMuTEVGVDpcblx0XHRcdHRoaXMucHJldmlvdXMoKTtcblx0XHRcdGJyZWFrO1xuXHRcdGNhc2UgS0VZX0NPREVTLlJJR0hUOlxuXHRcdFx0dGhpcy5uZXh0KCk7XG5cdFx0XHRicmVhaztcblx0XHRkZWZhdWx0OlxuXHRcdFx0YnJlYWs7XG5cdFx0fVxuXHR9LFxuXHRwcmV2aW91cygpe1xuXHRcdHRoaXMuY3VycmVudCAmJiB0aGlzLkRPTUl0ZW1zW3RoaXMuY3VycmVudF0uY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdFx0dGhpcy5jdXJyZW50ID0gKHRoaXMuY3VycmVudCA9PT0gMCA/IHRoaXMuRE9NSXRlbXMubGVuZ3RoIC0gMSA6IHRoaXMuY3VycmVudCAtIDEpO1xuXHRcdHRoaXMuRE9NSXRlbXNbdGhpcy5jdXJyZW50XS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcblx0XHR0aGlzLmxvYWRJbWFnZXModGhpcy5jdXJyZW50KTtcblx0XHQodGhpcy50b3RhbCA+IDEgJiYgdGhpcy5zZXR0aW5ncy50b3RhbHMpICYmIHRoaXMud3JpdGVUb3RhbHMoKTtcblx0fSxcblx0bmV4dCgpe1xuXHRcdHRoaXMuY3VycmVudCAmJiB0aGlzLkRPTUl0ZW1zW3RoaXMuY3VycmVudF0uY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdFx0dGhpcy5jdXJyZW50ID0gKHRoaXMuY3VycmVudCA9PT0gdGhpcy5ET01JdGVtcy5sZW5ndGggLSAxID8gMCA6IHRoaXMuY3VycmVudCArIDEpO1xuXHRcdHRoaXMuRE9NSXRlbXNbdGhpcy5jdXJyZW50XS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcblx0XHR0aGlzLmxvYWRJbWFnZXModGhpcy5jdXJyZW50KTtcblx0XHQodGhpcy50b3RhbCA+IDEgJiYgdGhpcy5zZXR0aW5ncy50b3RhbHMpICYmIHRoaXMud3JpdGVUb3RhbHMoKTtcblx0fSxcblx0b3BlbihpKXtcblx0XHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdGhpcy5rZXlMaXN0ZW5lci5iaW5kKHRoaXMpKTtcblx0XHR0aGlzLmxvYWRJbWFnZXMoaSk7XG5cdFx0dGhpcy5sYXN0Rm9jdXNlZCA9ICBkb2N1bWVudC5hY3RpdmVFbGVtZW50O1xuXHRcdHRoaXMuZm9jdXNhYmxlQ2hpbGRyZW4ubGVuZ3RoICYmIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCl7dGhpcy5mb2N1c2FibGVDaGlsZHJlblswXS5mb2N1cygpO30uYmluZCh0aGlzKSwgMCk7XG5cdFx0dGhpcy5ET01JdGVtc1tpIHx8IDBdLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXHRcdHRoaXMudG9nZ2xlKGkgfHwgMCk7XG5cdH0sXG5cdGNsb3NlKCl7XG5cdFx0ZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRoaXMua2V5TGlzdGVuZXIuYmluZCh0aGlzKSk7XG5cdFx0dGhpcy5sYXN0Rm9jdXNlZCAmJiB0aGlzLmxhc3RGb2N1c2VkLmZvY3VzKCk7XG5cdFx0dGhpcy5ET01JdGVtc1t0aGlzLmN1cnJlbnRdLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHRcdHRoaXMudG9nZ2xlKG51bGwpO1xuXHR9LFxuXHR0b2dnbGUoaSl7XG5cdFx0dGhpcy5pc09wZW4gPSAhdGhpcy5pc09wZW47XG5cdFx0dGhpcy5jdXJyZW50ID0gaTtcblx0XHR0aGlzLkRPTU92ZXJsYXkuY2xhc3NMaXN0LnRvZ2dsZSgnYWN0aXZlJyk7XG5cdFx0dGhpcy5ET01PdmVybGF5LnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAhdGhpcy5pc09wZW4pO1xuXHRcdHRoaXMuRE9NT3ZlcmxheS5zZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JywgdGhpcy5pc09wZW4gPyAnMCcgOiAnLTEnKTtcblx0XHR0aGlzLnNldHRpbmdzLmZ1bGxzY3JlZW4gJiYgdGhpcy50b2dnbGVGdWxsU2NyZWVuKCk7XG5cdFx0KHRoaXMudG90YWwgPiAxICYmIHRoaXMuc2V0dGluZ3MudG90YWxzKSAmJiB0aGlzLndyaXRlVG90YWxzKCk7XG5cdH0sXG5cdHRvZ2dsZUZ1bGxTY3JlZW4oKXtcblx0XHRpZih0aGlzLmlzT3Blbil7XG5cdFx0XHR0aGlzLkRPTU92ZXJsYXkucmVxdWVzdEZ1bGxzY3JlZW4gJiYgdGhpcy5ET01PdmVybGF5LnJlcXVlc3RGdWxsc2NyZWVuKCk7XG5cdFx0XHR0aGlzLkRPTU92ZXJsYXkud2Via2l0UmVxdWVzdEZ1bGxzY3JlZW4gJiYgdGhpcy5ET01PdmVybGF5LndlYmtpdFJlcXVlc3RGdWxsc2NyZWVuKCk7XG5cdFx0XHR0aGlzLkRPTU92ZXJsYXkubW96UmVxdWVzdEZ1bGxTY3JlZW4gJiYgdGhpcy5ET01PdmVybGF5Lm1velJlcXVlc3RGdWxsU2NyZWVuKCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGRvY3VtZW50LmV4aXRGdWxsc2NyZWVuICYmIGRvY3VtZW50LmV4aXRGdWxsc2NyZWVuKCk7XG5cdFx0XHRkb2N1bWVudC5tb3pDYW5jZWxGdWxsU2NyZWVuICYmIGRvY3VtZW50Lm1vekNhbmNlbEZ1bGxTY3JlZW4oKTtcblx0XHRcdGRvY3VtZW50LndlYmtpdEV4aXRGdWxsc2NyZWVuICYmIGRvY3VtZW50LndlYmtpdEV4aXRGdWxsc2NyZWVuKCk7XG5cdFx0fVxuXHR9XG59O1xuXG5jb25zdCBpbml0ID0gKHNyYywgb3B0cykgPT4ge1xuXHRpZighc3JjLmxlbmd0aCkgdGhyb3cgbmV3IEVycm9yKCdNb2RhbCBHYWxsZXJ5IGNhbm5vdCBiZSBpbml0aWFsaXNlZCwgbm8gaW1hZ2VzIGZvdW5kJyk7XG5cblx0bGV0IGl0ZW1zO1xuXG5cdGlmKHR5cGVvZiBzcmMgPT09ICdzdHJpbmcnKXtcblx0XHRsZXQgZWxzID0gW10uc2xpY2UuY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHNyYykpO1xuXG5cdFx0aWYoIWVscy5sZW5ndGgpIHRocm93IG5ldyBFcnJvcignTW9kYWwgR2FsbGVyeSBjYW5ub3QgYmUgaW5pdGlhbGlzZWQsIG5vIGltYWdlcyBmb3VuZCcpO1xuXHRcdFxuXHRcdGl0ZW1zID0gZWxzLm1hcChlbCA9PiB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHR0cmlnZ2VyOiBlbCxcblx0XHRcdFx0c3JjOiBlbC5nZXRBdHRyaWJ1dGUoJ2hyZWYnKSxcblx0XHRcdFx0c3Jjc2V0OiBlbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtc3Jjc2V0JykgfHwgbnVsbCxcblx0XHRcdFx0c2l6ZXM6IGVsLmdldEF0dHJpYnV0ZSgnZGF0YS1zaXplcycpIHx8IG51bGwsXG5cdFx0XHRcdHRpdGxlOiBlbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtdGl0bGUnKSB8fCAnJyxcblx0XHRcdFx0ZGVzY3JpcHRpb246IGVsLmdldEF0dHJpYnV0ZSgnZGF0YS1kZXNjcmlwdGlvbicpIHx8ICcnXG5cdFx0XHR9O1xuXHRcdH0pO1xuXHR9IGVsc2Uge1xuXHRcdGl0ZW1zID0gc3JjO1xuXHR9XG5cdFxuXHRyZXR1cm4gT2JqZWN0LmFzc2lnbihPYmplY3QuY3JlYXRlKFN0b3JtTW9kYWxHYWxsZXJ5KSwge1xuXHRcdGl0ZW1zOiBpdGVtcyxcblx0XHR0b3RhbDogaXRlbXMubGVuZ3RoLFxuXHRcdHNldHRpbmdzOiBPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0cywgb3B0cylcblx0fSkuaW5pdCgpO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgeyBpbml0IH07Il19
