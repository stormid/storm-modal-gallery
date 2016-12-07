(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _stormModalGallery = require('./libs/storm-modal-gallery');

var _stormModalGallery2 = _interopRequireDefault(_stormModalGallery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var onDOMContentLoadedTasks = [function () {

	var gallery = _stormModalGallery2.default.init([{
		src: 'https://i.ytimg.com/vi/yaqe1qesQ8c/maxresdefault.jpg',
		title: 'Image 1',
		description: 'Description 1'
	}, {
		src: 'https://unsplash.it/800/?random',
		title: 'Image 2',
		description: 'Description 2'
	}]);

	document.querySelector('.js-modal-gallery__trigger').addEventListener('click', gallery.open.bind(gallery, 0));

	//ModalGallery.init('.js-modal-gallery');
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
 * @version 0.1.0: Wed, 07 Dec 2016 18:13:47 GMT
 * @author mjbp
 * @license MIT
 */
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

exports.default = { init: init };

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJleGFtcGxlL3NyYy9hcHAuanMiLCJleGFtcGxlL3NyYy9saWJzL3N0b3JtLW1vZGFsLWdhbGxlcnkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBOzs7Ozs7QUFFQSxJQUFNLDBCQUEwQixDQUFDLFlBQU07O0FBRXRDLEtBQUksVUFBVSw0QkFBYSxJQUFiLENBQWtCLENBQy9CO0FBQ0MsT0FBSyxzREFETjtBQUVDLFNBQU8sU0FGUjtBQUdDLGVBQWE7QUFIZCxFQUQrQixFQU0vQjtBQUNDLE9BQUssaUNBRE47QUFFQyxTQUFPLFNBRlI7QUFHQyxlQUFhO0FBSGQsRUFOK0IsQ0FBbEIsQ0FBZDs7QUFZQSxVQUFTLGFBQVQsQ0FBdUIsNEJBQXZCLEVBQXFELGdCQUFyRCxDQUFzRSxPQUF0RSxFQUErRSxRQUFRLElBQVIsQ0FBYSxJQUFiLENBQWtCLE9BQWxCLEVBQTJCLENBQTNCLENBQS9FOztBQUVBO0FBRUEsQ0FsQitCLENBQWhDOztBQXFCQSxJQUFHLHNCQUFzQixNQUF6QixFQUFpQyxPQUFPLGdCQUFQLENBQXdCLGtCQUF4QixFQUE0QyxZQUFNO0FBQUUseUJBQXdCLE9BQXhCLENBQWdDO0FBQUEsU0FBTSxJQUFOO0FBQUEsRUFBaEM7QUFBOEMsQ0FBbEc7Ozs7Ozs7O0FDdkJqQzs7Ozs7O0FBTUEsSUFBTSxXQUFXO0FBQ2YsWUFBVztBQUNWLDI1Q0FEVTtBQTBCViwyTUExQlU7QUE4QlY7QUE5QlUsRUFESTtBQW9DZixhQUFZLEtBcENHO0FBcUNmLFFBQU87QUFyQ1EsQ0FBakI7QUFBQSxJQXVDQyxZQUFZO0FBQ1gsTUFBSyxDQURNO0FBRVgsTUFBSyxFQUZNO0FBR1gsT0FBTSxFQUhLO0FBSVgsUUFBTyxFQUpJO0FBS1gsUUFBTztBQUxJLENBdkNiO0FBQUEsSUE4Q0MsaUJBQWlCLENBQUMsU0FBRCxFQUFZLFNBQVosRUFBdUIsWUFBdkIsQ0E5Q2xCOztB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QkE0QmUsRUFBRSxVQUFGLEUiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IE1vZGFsR2FsbGVyeSBmcm9tICcuL2xpYnMvc3Rvcm0tbW9kYWwtZ2FsbGVyeSc7XG5cbmNvbnN0IG9uRE9NQ29udGVudExvYWRlZFRhc2tzID0gWygpID0+IHtcblx0XG5cdGxldCBnYWxsZXJ5ID0gTW9kYWxHYWxsZXJ5LmluaXQoW1xuXHRcdHtcblx0XHRcdHNyYzogJ2h0dHBzOi8vaS55dGltZy5jb20vdmkveWFxZTFxZXNROGMvbWF4cmVzZGVmYXVsdC5qcGcnLFxuXHRcdFx0dGl0bGU6ICdJbWFnZSAxJyxcblx0XHRcdGRlc2NyaXB0aW9uOiAnRGVzY3JpcHRpb24gMSdcblx0XHR9LFxuXHRcdHtcblx0XHRcdHNyYzogJ2h0dHBzOi8vdW5zcGxhc2guaXQvODAwLz9yYW5kb20nLFxuXHRcdFx0dGl0bGU6ICdJbWFnZSAyJyxcblx0XHRcdGRlc2NyaXB0aW9uOiAnRGVzY3JpcHRpb24gMidcblx0XHR9XSk7XG5cblx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmpzLW1vZGFsLWdhbGxlcnlfX3RyaWdnZXInKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGdhbGxlcnkub3Blbi5iaW5kKGdhbGxlcnksIDApKTtcblx0XG5cdC8vTW9kYWxHYWxsZXJ5LmluaXQoJy5qcy1tb2RhbC1nYWxsZXJ5Jyk7XG5cbn1dO1xuXG4gICAgXG5pZignYWRkRXZlbnRMaXN0ZW5lcicgaW4gd2luZG93KSB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsICgpID0+IHsgb25ET01Db250ZW50TG9hZGVkVGFza3MuZm9yRWFjaChmbiA9PiBmbigpKTsgfSk7XG4iLCIvKipcbiAqIEBuYW1lIHN0b3JtLW1vZGFsLWdhbGxlcnk6IE1vZGFsIGdhbGxlcnkvbGlnaHRib3hcbiAqIEB2ZXJzaW9uIDAuMS4wOiBXZWQsIDA3IERlYyAyMDE2IDE4OjEzOjQ3IEdNVFxuICogQGF1dGhvciBtamJwXG4gKiBAbGljZW5zZSBNSVRcbiAqL1xuY29uc3QgZGVmYXVsdHMgPSB7XG5cdFx0dGVtcGxhdGVzOiB7XG5cdFx0XHRvdmVybGF5OiBgPGRpdiBjbGFzcz1cIm1vZGFsLWdhbGxlcnlfX291dGVyIGpzLW1vZGFsLWdhbGxlcnlfX291dGVyXCIgcm9sZT1cImRpYWxvZ1wiIHRhYmluZGV4PVwiLTFcIiBhcmlhLWhpZGRlbj1cInRydWVcIj5cblx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJtb2RhbC1nYWxsZXJ5X19pbm5lciBqcy1tb2RhbC1nYWxsZXJ5X19pbm5lclwiPlxuXHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwibW9kYWwtZ2FsbGVyeV9fY29udGVudCBqcy1tb2RhbC1nYWxsZXJ5X19jb250ZW50XCI+XG5cdFx0XHRcdFx0XHRcdFx0e3tpdGVtc319XG5cdFx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHQ8YnV0dG9uIGNsYXNzPVwianMtbW9kYWwtZ2FsbGVyeV9fbmV4dCBtb2RhbC1nYWxsZXJ5X19uZXh0XCI+XG5cdFx0XHRcdFx0XHRcdDxzdmcgcm9sZT1cImJ1dHRvblwiIHJvbGU9XCJidXR0b25cIiB3aWR0aD1cIjQ0XCIgaGVpZ2h0PVwiNjBcIj5cblx0XHRcdFx0XHRcdFx0XHQ8cG9seWxpbmUgcG9pbnRzPVwiMTQgMTAgMzQgMzAgMTQgNTBcIiBzdHJva2U9XCJyZ2IoMjU1LDI1NSwyNTUpXCIgc3Ryb2tlLXdpZHRoPVwiNFwiIHN0cm9rZS1saW5lY2FwPVwiYnV0dFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIi8+XG5cdFx0XHRcdFx0XHRcdDwvc3ZnPlxuXHRcdFx0XHRcdFx0PC9idXR0b24+XG5cdFx0XHRcdFx0XHQ8YnV0dG9uIGNsYXNzPVwianMtbW9kYWwtZ2FsbGVyeV9fcHJldmlvdXMgbW9kYWwtZ2FsbGVyeV9fcHJldmlvdXNcIj5cblx0XHRcdFx0XHRcdFx0PHN2ZyByb2xlPVwiYnV0dG9uXCIgd2lkdGg9XCI0NFwiIGhlaWdodD1cIjYwXCI+XG5cdFx0XHRcdFx0XHRcdFx0PHBvbHlsaW5lIHBvaW50cz1cIjMwIDEwIDEwIDMwIDMwIDUwXCIgc3Ryb2tlPVwicmdiKDI1NSwyNTUsMjU1KVwiIHN0cm9rZS13aWR0aD1cIjRcIiBzdHJva2UtbGluZWNhcD1cImJ1dHRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCIvPlxuXHRcdFx0XHRcdFx0XHQ8L3N2Zz5cblx0XHRcdFx0XHRcdDwvYnV0dG9uPlxuXHRcdFx0XHRcdFx0PGJ1dHRvbiBjbGFzcz1cImpzLW1vZGFsLWdhbGxlcnlfX2Nsb3NlIG1vZGFsLWdhbGxlcnlfX2Nsb3NlXCI+XG5cdFx0XHRcdFx0XHRcdDxzdmcgcm9sZT1cImJ1dHRvblwiIHJvbGU9XCJidXR0b25cIiB3aWR0aD1cIjMwXCIgaGVpZ2h0PVwiMzBcIj5cblx0XHRcdFx0XHRcdFx0XHQ8ZyBzdHJva2U9XCJyZ2IoMjU1LDI1NSwyNTUpXCIgc3Ryb2tlLXdpZHRoPVwiNFwiPlxuXHRcdFx0XHRcdFx0XHRcdFx0PGxpbmUgeDE9XCI1XCIgeTE9XCI1XCIgeDI9XCIyNVwiIHkyPVwiMjVcIi8+XG5cdFx0XHRcdFx0XHRcdFx0XHQ8bGluZSB4MT1cIjVcIiB5MT1cIjI1XCIgeDI9XCIyNVwiIHkyPVwiNVwiLz5cblx0XHRcdFx0XHRcdFx0XHQ8L2c+XG5cdFx0XHRcdFx0XHRcdDwvc3ZnPlxuXHRcdFx0XHRcdFx0PC9idXR0b24+XG5cdFx0XHRcdFx0PC9kaXY+YCxcblx0XHRcdGl0ZW06IGA8ZGl2IGNsYXNzPVwibW9kYWwtZ2FsbGVyeV9faXRlbSBqcy1tb2RhbC1nYWxsZXJ5X19pdGVtXCI+XG5cdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwibW9kYWwtZ2FsbGVyeV9faW1nLWNvbnRhaW5lciBqcy1tb2RhbC1nYWxsZXJ5X19pbWctY29udGFpbmVyXCI+PC9kaXY+XG5cdFx0XHRcdFx0XHR7e2RldGFpbHN9fVxuXHRcdFx0XHRcdDwvZGl2PmAsXG5cdFx0XHRkZXRhaWxzOiBgPGRpdiBjbGFzcz1cIm1vZGFsLWdhbGxlcnlfX2RldGFpbHNcIj5cblx0XHRcdFx0XHRcdDxoMSBjbGFzcz1cIm1vZGFsLWdhbGxlcnlfX3RpdGxlXCI+e3t0aXRsZX19PC9oMT5cblx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJtb2RhbC1nYWxsZXJ5X19kZXNjcmlwdGlvblwiPnt7ZGVzY3JpcHRpb259fTwvZGl2PlxuXHRcdFx0XHRcdDwvZGl2PmBcblx0XHR9LFxuXHRcdGZ1bGxTY3JlZW46IGZhbHNlLFxuXHRcdGFzeW5jOiBmYWxzZVxuXHR9LFxuXHRLRVlfQ09ERVMgPSB7XG5cdFx0VEFCOiA5LFxuXHRcdEVTQzogMjcsXG5cdFx0TEVGVDogMzcsXG5cdFx0UklHSFQ6IDM5LFxuXHRcdEVOVEVSOiAxM1xuXHR9LFxuXHRUUklHR0VSX0VWRU5UUyA9IFsnbW91c2V1cCcsICdrZXlkb3duJywgJ3RvdWNoc3RhcnQnXTtcblxuY29uc3QgU3Rvcm1Nb2RhbEdhbGxlcnkgPSB7XG5cdGluaXQoKSB7XG5cdFx0dGhpcy5pc09wZW4gPSBmYWxzZTtcblx0XHR0aGlzLmN1cnJlbnQgPSBudWxsO1xuXHRcdHRoaXMuaW5pdFVJKCk7XG5cdFx0dGhpcy5pbWFnZUNhY2hlID0gW107XG5cdFx0dGhpcy5mb2N1c2FibGVDaGlsZHJlbiA9IHRoaXMuZ2V0Rm9jdXNhYmxlQ2hpbGRyZW4oKTtcblx0XHR0aGlzLmluaXRCdXR0b25zKCk7XG5cdFx0dGhpcy5pdGVtc1swXS50cmlnZ2VyICYmIHRoaXMuaW5pdFRyaWdnZXJzKCk7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH0sXG5cdGluaXRUcmlnZ2Vycygpe1xuXHRcdC8qXG5cdFx0dGhpcy5pdGVtcy5mb3JFYWNoKChpdGVtLCBpKSA9PiB7XG5cdFx0XHRUUklHR0VSX0VWRU5UUy5mb3JFYWNoKGV2ID0+IHtcblx0XHRcdFx0aXRlbS50cmlnZ2VyLmFkZEV2ZW50TGlzdGVuZXIoZXYsIGUgPT4ge1xuXHRcdFx0XHRcdGlmKGUua2V5Q29kZSAmJiBlLmtleUNvZGUgIT09IEtFWV9DT0RFUy5FTlRFUikgcmV0dXJuO1xuXHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHR0aGlzLm9wZW4oaSk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cdFx0fSk7Ki9cblx0fSxcblx0aW5pdFVJKCl7XG5cdFx0bGV0IHJlbmRlclRlbXBsYXRlID0gKGRhdGEsIHRlbXBsYXRlKSA9PiB7XG5cdFx0XHRcdGZvcihsZXQgZGF0dW0gaW4gZGF0YSl7XG5cdFx0XHRcdFx0aWYoZGF0YS5oYXNPd25Qcm9wZXJ0eShkYXR1bSkpe1xuXHRcdFx0XHRcdFx0dGVtcGxhdGUgPSB0ZW1wbGF0ZS5zcGxpdChge3ske2RhdHVtfX19YCkuam9pbihkYXRhW2RhdHVtXSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiB0ZW1wbGF0ZTtcblx0XHRcdH0sXG5cdFx0XHRkZXRhaWxzU3RyaW5nQXJyYXkgPSB0aGlzLml0ZW1zLm1hcChmdW5jdGlvbihpbWcpIHtcblx0XHRcdFx0cmV0dXJuIHJlbmRlclRlbXBsYXRlKGltZywgdGhpcy5zZXR0aW5ncy50ZW1wbGF0ZXMuZGV0YWlscyk7XG5cdFx0XHR9LmJpbmQodGhpcykpLFxuXHRcdFx0aXRlbXNTdHJpbmcgPSBkZXRhaWxzU3RyaW5nQXJyYXkubWFwKGZ1bmN0aW9uKGl0ZW0pIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuc2V0dGluZ3MudGVtcGxhdGVzLml0ZW0uc3BsaXQoJ3t7ZGV0YWlsc319Jykuam9pbihpdGVtKTtcblx0XHRcdH0uYmluZCh0aGlzKSk7XG5cblx0XHRkb2N1bWVudC5ib2R5Lmluc2VydEFkamFjZW50SFRNTCgnYmVmb3JlZW5kJywgdGhpcy5zZXR0aW5ncy50ZW1wbGF0ZXMub3ZlcmxheS5zcGxpdCgne3tpdGVtc319Jykuam9pbihpdGVtc1N0cmluZy5qb2luKCcnKSkpO1xuXHRcdHRoaXMuRE9NT3ZlcmxheSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5qcy1tb2RhbC1nYWxsZXJ5X19vdXRlcicpO1xuXHRcdHRoaXMuRE9NSXRlbXMgPSBbXS5zbGljZS5jYWxsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5qcy1tb2RhbC1nYWxsZXJ5X19pdGVtJykpO1xuXHRcdHJldHVybiB0aGlzO1xuXHR9LFxuXHRpbml0QnV0dG9ucygpe1xuXHRcdHRoaXMucHJldmlvdXNCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuanMtbW9kYWwtZ2FsbGVyeV9fcHJldmlvdXMnKTtcblx0XHR0aGlzLm5leHRCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuanMtbW9kYWwtZ2FsbGVyeV9fbmV4dCcpO1xuXHRcdHRoaXMuY2xvc2VCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuanMtbW9kYWwtZ2FsbGVyeV9fY2xvc2UnKTtcblxuXHRcdHRoaXMucHJldmlvdXNCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpIHtcblx0XHRcdHRoaXMucHJldmlvdXMoKTtcblx0XHR9LmJpbmQodGhpcykpO1xuXHRcdHRoaXMubmV4dEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuXHRcdFx0dGhpcy5uZXh0KCk7XG5cdFx0fS5iaW5kKHRoaXMpKTtcblx0XHR0aGlzLmNsb3NlQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG5cdFx0XHR0aGlzLmNsb3NlKCk7XG5cdFx0fS5iaW5kKHRoaXMpKTtcblx0fSxcblx0bG9hZEltYWdlKGkpIHtcblx0XHR2YXIgaW1nID0gbmV3IEltYWdlKCksXG5cdFx0XHRpbWFnZUNvbnRhaW5lciA9IHRoaXMuRE9NSXRlbXNbaV0ucXVlcnlTZWxlY3RvcignLmpzLW1vZGFsLWdhbGxlcnlfX2ltZy1jb250YWluZXInKSxcblx0XHRcdGxvYWRlZCA9ICgpID0+IHtcblx0XHRcdFx0aW1hZ2VDb250YWluZXIuaW5uZXJIVE1MID0gYDxpbWcgY2xhc3M9XCJtb2RhbC1nYWxsZXJ5X19pbWdcIiBzcmM9XCIke3RoaXMuaXRlbXNbaV0uc3JjfVwiIGFsdD1cIiR7dGhpcy5pdGVtc1tpXS50aXRsZX1cIj5gO1xuXHRcdFx0XHR0aGlzLkRPTUl0ZW1zW2ldLmNsYXNzTGlzdC5yZW1vdmUoJ2xvYWRpbmcnKTtcblx0XHRcdH07XG5cdFx0aW1nLm9ubG9hZCA9IGxvYWRlZDtcblx0XHRpbWcuc3JjID0gdGhpcy5pdGVtc1tpXS5zcmM7XG5cdFx0XG5cdFx0aW1nLm9uZXJyb3IgPSAoKSA9PiB7XG5cdFx0XHR0aGlzLkRPTUl0ZW1zW2ldLmNsYXNzTGlzdC5yZW1vdmUoJ2xvYWRpbmcnKTtcblx0XHRcdHRoaXMuRE9NSXRlbXNbaV0uY2xhc3NMaXN0LmFkZCgnZXJyb3InKTtcblx0XHR9O1xuXHRcdGlmKGltZy5jb21wbGV0ZSkgbG9hZGVkKCk7XG5cdH0sXG5cdGxvYWRJbWFnZXMoaSl7XG5cdFx0aWYodGhpcy5pbWFnZUNhY2hlLmxlbmd0aCA9PT0gdGhpcy5pdGVtcykgcmV0dXJuO1xuXG5cdFx0bGV0IGluZGV4ZXMgPSBbaV07XG5cblx0XHRpZih0aGlzLml0ZW1zLmxlbmd0aCA+IDEpIGluZGV4ZXMucHVzaChpID09PSAwID8gdGhpcy5pdGVtcy5sZW5ndGggLSAxIDogaSAtIDEpO1xuXHRcdGlmKHRoaXMuaXRlbXMubGVuZ3RoID4gMikgaW5kZXhlcy5wdXNoKGkgPT09IHRoaXMuaXRlbXMubGVuZ3RoIC0gMSA/IDAgOiBpICsgMSk7XG5cblx0XHRpbmRleGVzLmZvckVhY2goaWR4ID0+IHtcblx0XHRcdGlmKHRoaXMuaW1hZ2VDYWNoZVtpZHhdID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0dGhpcy5ET01JdGVtc1tpZHhdLmNsYXNzTGlzdC5hZGQoJ2xvYWRpbmcnKTtcblx0XHRcdFx0dGhpcy5sb2FkSW1hZ2UoaWR4KTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHR9LFxuXHRnZXRGb2N1c2FibGVDaGlsZHJlbigpIHtcblx0XHRsZXQgZm9jdXNhYmxlRWxlbWVudHMgPSBbJ2FbaHJlZl0nLCAnYXJlYVtocmVmXScsICdpbnB1dDpub3QoW2Rpc2FibGVkXSknLCAnc2VsZWN0Om5vdChbZGlzYWJsZWRdKScsICd0ZXh0YXJlYTpub3QoW2Rpc2FibGVkXSknLCAnYnV0dG9uOm5vdChbZGlzYWJsZWRdKScsICdpZnJhbWUnLCAnb2JqZWN0JywgJ2VtYmVkJywgJ1tjb250ZW50ZWRpdGFibGVdJywgJ1t0YWJpbmRleF06bm90KFt0YWJpbmRleD1cIi0xXCJdKSddO1xuXG5cdFx0cmV0dXJuIFtdLnNsaWNlLmNhbGwodGhpcy5ET01PdmVybGF5LnF1ZXJ5U2VsZWN0b3JBbGwoZm9jdXNhYmxlRWxlbWVudHMuam9pbignLCcpKSk7XG5cdH0sXG5cdHRyYXBUYWIoZSl7XG5cdFx0bGV0IGZvY3VzZWRJbmRleCA9IHRoaXMuZm9jdXNhYmxlQ2hpbGRyZW4uaW5kZXhPZihkb2N1bWVudC5hY3RpdmVFbGVtZW50KTtcblx0XHRpZihlLnNoaWZ0S2V5ICYmIGZvY3VzZWRJbmRleCA9PT0gMCkge1xuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0dGhpcy5mb2N1c2FibGVDaGlsZHJlblt0aGlzLmZvY3VzYWJsZUNoaWxkcmVuLmxlbmd0aCAtIDFdLmZvY3VzKCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGlmKCFlLnNoaWZ0S2V5ICYmIGZvY3VzZWRJbmRleCA9PT0gdGhpcy5mb2N1c2FibGVDaGlsZHJlbi5sZW5ndGggLSAxKSB7XG5cdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0dGhpcy5mb2N1c2FibGVDaGlsZHJlblswXS5mb2N1cygpO1xuXHRcdFx0fVxuXHRcdH1cblx0fSxcblx0a2V5TGlzdGVuZXIoZSl7XG5cdFx0aWYoIXRoaXMub3BlbikgcmV0dXJuO1xuXG5cdFx0c3dpdGNoIChlLmtleUNvZGUpIHtcblx0XHRjYXNlIEtFWV9DT0RFUy5FU0M6XG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHR0aGlzLnRvZ2dsZSgpO1xuXHRcdFx0YnJlYWs7XG5cdFx0Y2FzZSBLRVlfQ09ERVMuVEFCOlxuXHRcdFx0dGhpcy50cmFwVGFiKGUpO1xuXHRcdFx0YnJlYWs7XG5cdFx0Y2FzZSBLRVlfQ09ERVMuTEVGVDpcblx0XHRcdHRoaXMucHJldmlvdXMoKTtcblx0XHRcdGJyZWFrO1xuXHRcdGNhc2UgS0VZX0NPREVTLlJJR0hUOlxuXHRcdFx0dGhpcy5uZXh0KCk7XG5cdFx0XHRicmVhaztcblx0XHRkZWZhdWx0OlxuXHRcdFx0YnJlYWs7XG5cdFx0fVxuXHR9LFxuXHRwcmV2aW91cygpe1xuXHRcdHRoaXMuRE9NSXRlbXNbdGhpcy5jdXJyZW50XS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcblx0XHR0aGlzLmN1cnJlbnQgPSAodGhpcy5jdXJyZW50ID09PSAwID8gdGhpcy5ET01JdGVtcy5sZW5ndGggLSAxIDogdGhpcy5jdXJyZW50IC0gMSk7XG5cdFx0dGhpcy5ET01JdGVtc1t0aGlzLmN1cnJlbnRdLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXHRcdGNvbnNvbGUubG9nKCdQcmV2aW91cycsIHRoaXMpO1xuXHR9LFxuXHRuZXh0KCl7XG5cdFx0dGhpcy5ET01JdGVtc1t0aGlzLmN1cnJlbnRdLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHRcdHRoaXMuY3VycmVudCA9ICh0aGlzLmN1cnJlbnQgPT09IHRoaXMuRE9NSXRlbXMubGVuZ3RoIC0gMSA/IDAgOiB0aGlzLmN1cnJlbnQgKyAxKTtcblx0XHR0aGlzLkRPTUl0ZW1zW3RoaXMuY3VycmVudF0uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG5cdFx0Y29uc29sZS5sb2coJ05leHQnLCB0aGlzKTtcblx0fSxcblx0b3BlbihpKXtcblx0XHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdGhpcy5rZXlMaXN0ZW5lci5iaW5kKHRoaXMpKTtcblx0XHR0aGlzLmxvYWRJbWFnZXMoaSk7XG5cdFx0dGhpcy5sYXN0Rm9jdXNlZCA9ICBkb2N1bWVudC5hY3RpdmVFbGVtZW50O1xuXHRcdHRoaXMuZm9jdXNhYmxlQ2hpbGRyZW4ubGVuZ3RoICYmIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCl7dGhpcy5mb2N1c2FibGVDaGlsZHJlblswXS5mb2N1cygpO30uYmluZCh0aGlzKSwgMCk7XG5cdFx0dGhpcy5ET01JdGVtc1tpIHx8IDBdLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXHRcdHRoaXMudG9nZ2xlKGkgfHwgMCk7XG5cdH0sXG5cdGNsb3NlKCl7XG5cdFx0ZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRoaXMua2V5TGlzdGVuZXIuYmluZCh0aGlzKSk7XG5cdFx0dGhpcy5sYXN0Rm9jdXNlZC5mb2N1cygpO1xuXHRcdHRoaXMuRE9NSXRlbXNbdGhpcy5jdXJyZW50XS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcblx0XHR0aGlzLnRvZ2dsZShudWxsKTtcblx0XHRjb25zb2xlLmxvZygnQ2xvc2UnLCB0aGlzKTtcblx0fSxcblx0dG9nZ2xlKGkpe1xuXHRcdHRoaXMuaXNPcGVuID0gIXRoaXMuaXNPcGVuO1xuXHRcdHRoaXMuY3VycmVudCA9IGk7XG5cdFx0dGhpcy5ET01PdmVybGF5LmNsYXNzTGlzdC50b2dnbGUoJ2FjdGl2ZScpO1xuXHRcdHRoaXMuRE9NT3ZlcmxheS5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgIXRoaXMuaXNPcGVuKTtcblx0XHR0aGlzLkRPTU92ZXJsYXkuc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsIHRoaXMuaXNPcGVuID8gJzAnIDogJy0xJyk7XG5cdFx0Y29uc29sZS5sb2coJ1RvZ2dsZScsIHRoaXMpO1xuXHR9XG59O1xuXG5jb25zdCBpbml0ID0gKHNyYywgb3B0cykgPT4ge1xuXHRpZighc3JjLmxlbmd0aCkgdGhyb3cgbmV3IEVycm9yKCdNb2RhbCBHYWxsZXJ5IGNhbm5vdCBiZSBpbml0aWFsaXNlZCwgbm8gaW1hZ2VzIGZvdW5kJyk7XG5cblx0bGV0IGl0ZW1zO1xuXG5cdGlmKHR5cGVvZiBzcmMgPT09ICdzdHJpbmcnKXtcblx0XHRsZXQgZWxzID0gW10uc2xpY2UuY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHNyYykpO1xuXG5cdFx0aWYoIWVscy5sZW5ndGgpIHRocm93IG5ldyBFcnJvcignTW9kYWwgR2FsbGVyeSBjYW5ub3QgYmUgaW5pdGlhbGlzZWQsIG5vIGltYWdlcyBmb3VuZCcpO1xuXHRcdFxuXHRcdGl0ZW1zID0gZWxzLm1hcChlbCA9PiB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHR0cmlnZ2VyOiBlbCxcblx0XHRcdFx0c3JjOiBlbC5nZXRBdHRyaWJ1dGUoJ2hyZWYnKSxcblx0XHRcdFx0dGl0bGU6IGVsLmdldEF0dHJpYnV0ZSgnZGF0YS10aXRsZScpIHx8IG51bGwsXG5cdFx0XHRcdGRlc2NyaXB0aW9uOiBlbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtZGVzY3JpcHRpb24nKSB8fCBudWxsXG5cdFx0XHR9O1xuXHRcdH0pO1xuXHR9IGVsc2Uge1xuXHRcdGl0ZW1zID0gc3JjO1xuXHR9XG5cdFxuXHRyZXR1cm4gT2JqZWN0LmFzc2lnbihPYmplY3QuY3JlYXRlKFN0b3JtTW9kYWxHYWxsZXJ5KSwge1xuXHRcdGl0ZW1zOiBpdGVtcyxcblx0XHRzZXR0aW5nczogT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdHMsIG9wdHMpXG5cdH0pLmluaXQoKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHsgaW5pdCB9OyJdfQ==
