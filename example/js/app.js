(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _stormModalGallery = require('./libs/storm-modal-gallery');

var _stormModalGallery2 = _interopRequireDefault(_stormModalGallery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var onDOMContentLoadedTasks = [function () {
	/*
 let gallery = ModalGallery.init([
 	{
 		src: 'https://i.ytimg.com/vi/yaqe1qesQ8c/maxresdefault.jpg',
 		title: 'Image 1',
 		description: 'Description 1'
 	},
 	{
 		src: 'https://unsplash.it/800/?random',
 		title: 'Image 2',
 		description: 'Description 2'
 	}]);
 	document.querySelector('.js-modal-gallery__trigger').addEventListener('click', gallery.open.bind(gallery, 0));
 */
	var gallery = _stormModalGallery2.default.init('.js-modal-gallery');
	console.log(gallery);
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
 * @version 0.1.0: Thu, 15 Dec 2016 13:46:54 GMT
 * @author mjbp
 * @license MIT
 */
var defaults = {
	templates: {
		overlay: '<div class="modal-gallery__outer js-modal-gallery__outer" role="dialog" tabindex="-1" aria-hidden="true">\n\t\t\t\t\t\t<div class="modal-gallery__inner js-modal-gallery__inner">\n\t\t\t\t\t\t\t<div class="modal-gallery__content js-modal-gallery__content">\n\t\t\t\t\t\t\t\t{{items}}\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<button class="js-modal-gallery__next modal-gallery__next">\n\t\t\t\t\t\t\t<svg role="button" role="button" width="44" height="60">\n\t\t\t\t\t\t\t\t<polyline points="14 10 34 30 14 50" stroke="rgb(255,255,255)" stroke-width="4" stroke-linecap="butt" fill="none" stroke-linejoin="round"/>\n\t\t\t\t\t\t\t</svg>\n\t\t\t\t\t\t</button>\n\t\t\t\t\t\t<button class="js-modal-gallery__previous modal-gallery__previous">\n\t\t\t\t\t\t\t<svg role="button" width="44" height="60">\n\t\t\t\t\t\t\t\t<polyline points="30 10 10 30 30 50" stroke="rgb(255,255,255)" stroke-width="4" stroke-linecap="butt" fill="none" stroke-linejoin="round"/>\n\t\t\t\t\t\t\t</svg>\n\t\t\t\t\t\t</button>\n\t\t\t\t\t\t<button class="js-modal-gallery__close modal-gallery__close">\n\t\t\t\t\t\t\t<svg role="button" role="button" width="30" height="30">\n\t\t\t\t\t\t\t\t<g stroke="rgb(255,255,255)" stroke-width="4">\n\t\t\t\t\t\t\t\t\t<line x1="5" y1="5" x2="25" y2="25"/>\n\t\t\t\t\t\t\t\t\t<line x1="5" y1="25" x2="25" y2="5"/>\n\t\t\t\t\t\t\t\t</g>\n\t\t\t\t\t\t\t</svg>\n\t\t\t\t\t\t</button>\n\t\t\t\t\t</div>',
		item: '<div class="modal-gallery__item js-modal-gallery__item">\n\t\t\t\t\t\t<div class="modal-gallery__img-container js-modal-gallery__img-container"></div>\n\t\t\t\t\t\t{{details}}\n\t\t\t\t\t</div>',
		details: '<div class="modal-gallery__details">\n\t\t\t\t\t\t<h1 class="modal-gallery__title">{{title}}</h1>\n\t\t\t\t\t\t<div class="modal-gallery__description">{{description}}</div>\n\t\t\t\t\t</div>'
	},
	fullscreen: false,
	preload: false
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
		this.loadImages(this.current);
	},
	next: function next() {
		this.DOMItems[this.current].classList.remove('active');
		this.current = this.current === this.DOMItems.length - 1 ? 0 : this.current + 1;
		this.DOMItems[this.current].classList.add('active');
		this.loadImages(this.current);
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
	},
	toggle: function toggle(i) {
		this.isOpen = !this.isOpen;
		this.current = i;
		this.DOMOverlay.classList.toggle('active');
		this.DOMOverlay.setAttribute('aria-hidden', !this.isOpen);
		this.DOMOverlay.setAttribute('tabindex', this.isOpen ? '0' : '-1');
		this.settings.fullscreen && this.toggleFullScreen();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJleGFtcGxlL3NyYy9hcHAuanMiLCJleGFtcGxlL3NyYy9saWJzL3N0b3JtLW1vZGFsLWdhbGxlcnkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBOzs7Ozs7QUFFQSxJQUFNLDBCQUEwQixDQUFDLFlBQU07QUFDdEM7Ozs7Ozs7Ozs7Ozs7O0FBZUEsS0FBSSxVQUFVLDRCQUFhLElBQWIsQ0FBa0IsbUJBQWxCLENBQWQ7QUFDQSxTQUFRLEdBQVIsQ0FBWSxPQUFaO0FBRUEsQ0FuQitCLENBQWhDOztBQXNCQSxJQUFHLHNCQUFzQixNQUF6QixFQUFpQyxPQUFPLGdCQUFQLENBQXdCLGtCQUF4QixFQUE0QyxZQUFNO0FBQUUseUJBQXdCLE9BQXhCLENBQWdDO0FBQUEsU0FBTSxJQUFOO0FBQUEsRUFBaEM7QUFBOEMsQ0FBbEc7Ozs7Ozs7O0FDeEJqQzs7Ozs7O0FBTUEsSUFBTSxXQUFXO0FBQ2YsWUFBVztBQUNWLDI1Q0FEVTtBQTBCViwyTUExQlU7QUE4QlY7QUE5QlUsRUFESTtBQW9DZixhQUFZLEtBcENHO0FBcUNmLFVBQVM7QUFyQ00sQ0FBakI7QUFBQSxJQXVDQyxZQUFZO0FBQ1gsTUFBSyxDQURNO0FBRVgsTUFBSyxFQUZNO0FBR1gsT0FBTSxFQUhLO0FBSVgsUUFBTyxFQUpJO0FBS1gsUUFBTztBQUxJLENBdkNiO0FBQUEsSUE4Q0MsaUJBQWlCLENBQUMsT0FBRCxFQUFVLFNBQVYsRUFBcUIsWUFBckIsQ0E5Q2xCOztBQWdEQSxJQUFNLG9CQUFvQjtBQUN6QixLQUR5QixrQkFDbEI7QUFBQTs7QUFDTixPQUFLLE1BQUwsR0FBYyxLQUFkO0FBQ0EsT0FBSyxPQUFMLEdBQWUsSUFBZjtBQUNBLE9BQUssTUFBTDtBQUNBLE9BQUssVUFBTCxHQUFrQixFQUFsQjtBQUNBLE9BQUssaUJBQUwsR0FBeUIsS0FBSyxvQkFBTCxFQUF6QjtBQUNBLE9BQUssV0FBTDtBQUNBLE9BQUssS0FBTCxDQUFXLENBQVgsRUFBYyxPQUFkLElBQXlCLEtBQUssWUFBTCxFQUF6QjtBQUNBLE9BQUssUUFBTCxDQUFjLE9BQWQsSUFBeUIsS0FBSyxLQUFMLENBQVcsT0FBWCxDQUFtQixVQUFDLElBQUQsRUFBTyxDQUFQLEVBQWE7QUFDeEQsU0FBSyxTQUFMLENBQWUsQ0FBZjtBQUNBLEdBRndCLENBQXpCO0FBR0EsU0FBTyxJQUFQO0FBQ0EsRUFid0I7QUFjekIsYUFkeUIsMEJBY1g7QUFBQTs7QUFDYixPQUFLLEtBQUwsQ0FBVyxPQUFYLENBQW1CLFVBQUMsSUFBRCxFQUFPLENBQVAsRUFBYTtBQUMvQixrQkFBZSxPQUFmLENBQXVCLGNBQU07QUFDNUIsU0FBSyxPQUFMLENBQWEsZ0JBQWIsQ0FBOEIsRUFBOUIsRUFBa0MsYUFBSztBQUN0QyxTQUFHLEVBQUUsT0FBRixJQUFhLEVBQUUsT0FBRixLQUFjLFVBQVUsS0FBeEMsRUFBK0M7QUFDL0MsT0FBRSxjQUFGO0FBQ0EsT0FBRSxlQUFGO0FBQ0EsWUFBSyxJQUFMLENBQVUsQ0FBVjtBQUNBLEtBTEQ7QUFNQSxJQVBEO0FBUUEsR0FURDtBQVVBLEVBekJ3QjtBQTBCekIsT0ExQnlCLG9CQTBCakI7QUFDUCxNQUFJLGlCQUFpQixTQUFqQixjQUFpQixDQUFDLElBQUQsRUFBTyxRQUFQLEVBQW9CO0FBQ3ZDLFFBQUksSUFBSSxLQUFSLElBQWlCLElBQWpCLEVBQXNCO0FBQ3JCLFFBQUcsS0FBSyxjQUFMLENBQW9CLEtBQXBCLENBQUgsRUFBOEI7QUFDN0IsZ0JBQVcsU0FBUyxLQUFULFFBQW9CLEtBQXBCLFNBQStCLElBQS9CLENBQW9DLEtBQUssS0FBTCxDQUFwQyxDQUFYO0FBQ0E7QUFDRDtBQUNELFVBQU8sUUFBUDtBQUNBLEdBUEY7QUFBQSxNQVFDLHFCQUFxQixLQUFLLEtBQUwsQ0FBVyxHQUFYLENBQWUsVUFBUyxHQUFULEVBQWM7QUFDakQsVUFBTyxlQUFlLEdBQWYsRUFBb0IsS0FBSyxRQUFMLENBQWMsU0FBZCxDQUF3QixPQUE1QyxDQUFQO0FBQ0EsR0FGbUMsQ0FFbEMsSUFGa0MsQ0FFN0IsSUFGNkIsQ0FBZixDQVJ0QjtBQUFBLE1BV0MsY0FBYyxtQkFBbUIsR0FBbkIsQ0FBdUIsVUFBUyxJQUFULEVBQWU7QUFDbkQsVUFBTyxLQUFLLFFBQUwsQ0FBYyxTQUFkLENBQXdCLElBQXhCLENBQTZCLEtBQTdCLENBQW1DLGFBQW5DLEVBQWtELElBQWxELENBQXVELElBQXZELENBQVA7QUFDQSxHQUZvQyxDQUVuQyxJQUZtQyxDQUU5QixJQUY4QixDQUF2QixDQVhmOztBQWVBLFdBQVMsSUFBVCxDQUFjLGtCQUFkLENBQWlDLFdBQWpDLEVBQThDLEtBQUssUUFBTCxDQUFjLFNBQWQsQ0FBd0IsT0FBeEIsQ0FBZ0MsS0FBaEMsQ0FBc0MsV0FBdEMsRUFBbUQsSUFBbkQsQ0FBd0QsWUFBWSxJQUFaLENBQWlCLEVBQWpCLENBQXhELENBQTlDO0FBQ0EsT0FBSyxVQUFMLEdBQWtCLFNBQVMsYUFBVCxDQUF1QiwwQkFBdkIsQ0FBbEI7QUFDQSxPQUFLLFFBQUwsR0FBZ0IsR0FBRyxLQUFILENBQVMsSUFBVCxDQUFjLFNBQVMsZ0JBQVQsQ0FBMEIseUJBQTFCLENBQWQsQ0FBaEI7QUFDQSxTQUFPLElBQVA7QUFDQSxFQTlDd0I7QUErQ3pCLFlBL0N5Qix5QkErQ1o7QUFDWixPQUFLLFdBQUwsR0FBbUIsU0FBUyxhQUFULENBQXVCLDZCQUF2QixDQUFuQjtBQUNBLE9BQUssT0FBTCxHQUFlLFNBQVMsYUFBVCxDQUF1Qix5QkFBdkIsQ0FBZjtBQUNBLE9BQUssUUFBTCxHQUFnQixTQUFTLGFBQVQsQ0FBdUIsMEJBQXZCLENBQWhCOztBQUVBLE9BQUssV0FBTCxDQUFpQixnQkFBakIsQ0FBa0MsT0FBbEMsRUFBMkMsWUFBVztBQUNyRCxRQUFLLFFBQUw7QUFDQSxHQUYwQyxDQUV6QyxJQUZ5QyxDQUVwQyxJQUZvQyxDQUEzQztBQUdBLE9BQUssT0FBTCxDQUFhLGdCQUFiLENBQThCLE9BQTlCLEVBQXVDLFlBQVc7QUFDakQsUUFBSyxJQUFMO0FBQ0EsR0FGc0MsQ0FFckMsSUFGcUMsQ0FFaEMsSUFGZ0MsQ0FBdkM7QUFHQSxPQUFLLFFBQUwsQ0FBYyxnQkFBZCxDQUErQixPQUEvQixFQUF3QyxZQUFXO0FBQ2xELFFBQUssS0FBTDtBQUNBLEdBRnVDLENBRXRDLElBRnNDLENBRWpDLElBRmlDLENBQXhDO0FBR0EsRUE3RHdCO0FBOER6QixVQTlEeUIscUJBOERmLENBOURlLEVBOERaO0FBQUE7O0FBQ1osTUFBSSxNQUFNLElBQUksS0FBSixFQUFWO0FBQUEsTUFDQyxpQkFBaUIsS0FBSyxRQUFMLENBQWMsQ0FBZCxFQUFpQixhQUFqQixDQUErQixrQ0FBL0IsQ0FEbEI7QUFBQSxNQUVDLFNBQVMsU0FBVCxNQUFTLEdBQU07QUFDZCxPQUFJLGtCQUFrQixPQUFLLEtBQUwsQ0FBVyxDQUFYLEVBQWMsTUFBZCxpQkFBbUMsT0FBSyxLQUFMLENBQVcsQ0FBWCxFQUFjLE1BQWpELFNBQTZELEVBQW5GO0FBQUEsT0FDQyxpQkFBaUIsT0FBSyxLQUFMLENBQVcsQ0FBWCxFQUFjLEtBQWQsZ0JBQWlDLE9BQUssS0FBTCxDQUFXLENBQVgsRUFBYyxLQUEvQyxTQUEwRCxFQUQ1RTtBQUVBLGtCQUFlLFNBQWYsNkNBQW1FLE9BQUssS0FBTCxDQUFXLENBQVgsRUFBYyxHQUFqRixlQUE4RixPQUFLLEtBQUwsQ0FBVyxDQUFYLEVBQWMsS0FBNUcsU0FBcUgsZUFBckgsR0FBdUksY0FBdkk7QUFDQSxVQUFLLFFBQUwsQ0FBYyxDQUFkLEVBQWlCLFNBQWpCLENBQTJCLE1BQTNCLENBQWtDLFNBQWxDO0FBQ0EsT0FBSSxNQUFKLEdBQWEsSUFBYjtBQUNBLEdBUkY7QUFTQSxNQUFJLE1BQUosR0FBYSxNQUFiO0FBQ0EsTUFBSSxHQUFKLEdBQVUsS0FBSyxLQUFMLENBQVcsQ0FBWCxFQUFjLEdBQXhCO0FBQ0EsTUFBSSxPQUFKLEdBQWMsWUFBTTtBQUNuQixVQUFLLFFBQUwsQ0FBYyxDQUFkLEVBQWlCLFNBQWpCLENBQTJCLE1BQTNCLENBQWtDLFNBQWxDO0FBQ0EsVUFBSyxRQUFMLENBQWMsQ0FBZCxFQUFpQixTQUFqQixDQUEyQixHQUEzQixDQUErQixPQUEvQjtBQUNBLEdBSEQ7QUFJQSxNQUFHLElBQUksUUFBUCxFQUFpQjtBQUNqQixFQS9Fd0I7QUFnRnpCLFdBaEZ5QixzQkFnRmQsQ0FoRmMsRUFnRlo7QUFBQTs7QUFDWixNQUFHLEtBQUssVUFBTCxDQUFnQixNQUFoQixLQUEyQixLQUFLLEtBQW5DLEVBQTBDOztBQUUxQyxNQUFJLFVBQVUsQ0FBQyxDQUFELENBQWQ7O0FBRUEsTUFBRyxLQUFLLEtBQUwsQ0FBVyxNQUFYLEdBQW9CLENBQXZCLEVBQTBCLFFBQVEsSUFBUixDQUFhLE1BQU0sQ0FBTixHQUFVLEtBQUssS0FBTCxDQUFXLE1BQVgsR0FBb0IsQ0FBOUIsR0FBa0MsSUFBSSxDQUFuRDtBQUMxQixNQUFHLEtBQUssS0FBTCxDQUFXLE1BQVgsR0FBb0IsQ0FBdkIsRUFBMEIsUUFBUSxJQUFSLENBQWEsTUFBTSxLQUFLLEtBQUwsQ0FBVyxNQUFYLEdBQW9CLENBQTFCLEdBQThCLENBQTlCLEdBQWtDLElBQUksQ0FBbkQ7O0FBRTFCLFVBQVEsT0FBUixDQUFnQixlQUFPO0FBQ3RCLE9BQUcsT0FBSyxVQUFMLENBQWdCLEdBQWhCLE1BQXlCLFNBQTVCLEVBQXVDO0FBQ3RDLFdBQUssUUFBTCxDQUFjLEdBQWQsRUFBbUIsU0FBbkIsQ0FBNkIsR0FBN0IsQ0FBaUMsU0FBakM7QUFDQSxXQUFLLFNBQUwsQ0FBZSxHQUFmO0FBQ0E7QUFDRCxHQUxEO0FBT0EsRUEvRndCO0FBZ0d6QixxQkFoR3lCLGtDQWdHRjtBQUN0QixNQUFJLG9CQUFvQixDQUFDLFNBQUQsRUFBWSxZQUFaLEVBQTBCLHVCQUExQixFQUFtRCx3QkFBbkQsRUFBNkUsMEJBQTdFLEVBQXlHLHdCQUF6RyxFQUFtSSxRQUFuSSxFQUE2SSxRQUE3SSxFQUF1SixPQUF2SixFQUFnSyxtQkFBaEssRUFBcUwsaUNBQXJMLENBQXhCOztBQUVBLFNBQU8sR0FBRyxLQUFILENBQVMsSUFBVCxDQUFjLEtBQUssVUFBTCxDQUFnQixnQkFBaEIsQ0FBaUMsa0JBQWtCLElBQWxCLENBQXVCLEdBQXZCLENBQWpDLENBQWQsQ0FBUDtBQUNBLEVBcEd3QjtBQXFHekIsUUFyR3lCLG1CQXFHakIsQ0FyR2lCLEVBcUdmO0FBQ1QsTUFBSSxlQUFlLEtBQUssaUJBQUwsQ0FBdUIsT0FBdkIsQ0FBK0IsU0FBUyxhQUF4QyxDQUFuQjtBQUNBLE1BQUcsRUFBRSxRQUFGLElBQWMsaUJBQWlCLENBQWxDLEVBQXFDO0FBQ3BDLEtBQUUsY0FBRjtBQUNBLFFBQUssaUJBQUwsQ0FBdUIsS0FBSyxpQkFBTCxDQUF1QixNQUF2QixHQUFnQyxDQUF2RCxFQUEwRCxLQUExRDtBQUNBLEdBSEQsTUFHTztBQUNOLE9BQUcsQ0FBQyxFQUFFLFFBQUgsSUFBZSxpQkFBaUIsS0FBSyxpQkFBTCxDQUF1QixNQUF2QixHQUFnQyxDQUFuRSxFQUFzRTtBQUNyRSxNQUFFLGNBQUY7QUFDQSxTQUFLLGlCQUFMLENBQXVCLENBQXZCLEVBQTBCLEtBQTFCO0FBQ0E7QUFDRDtBQUNELEVBaEh3QjtBQWlIekIsWUFqSHlCLHVCQWlIYixDQWpIYSxFQWlIWDtBQUNiLE1BQUcsQ0FBQyxLQUFLLElBQVQsRUFBZTs7QUFFZixVQUFRLEVBQUUsT0FBVjtBQUNBLFFBQUssVUFBVSxHQUFmO0FBQ0MsTUFBRSxjQUFGO0FBQ0EsU0FBSyxNQUFMO0FBQ0E7QUFDRCxRQUFLLFVBQVUsR0FBZjtBQUNDLFNBQUssT0FBTCxDQUFhLENBQWI7QUFDQTtBQUNELFFBQUssVUFBVSxJQUFmO0FBQ0MsU0FBSyxRQUFMO0FBQ0E7QUFDRCxRQUFLLFVBQVUsS0FBZjtBQUNDLFNBQUssSUFBTDtBQUNBO0FBQ0Q7QUFDQztBQWZEO0FBaUJBLEVBckl3QjtBQXNJekIsU0F0SXlCLHNCQXNJZjtBQUNULE9BQUssUUFBTCxDQUFjLEtBQUssT0FBbkIsRUFBNEIsU0FBNUIsQ0FBc0MsTUFBdEMsQ0FBNkMsUUFBN0M7QUFDQSxPQUFLLE9BQUwsR0FBZ0IsS0FBSyxPQUFMLEtBQWlCLENBQWpCLEdBQXFCLEtBQUssUUFBTCxDQUFjLE1BQWQsR0FBdUIsQ0FBNUMsR0FBZ0QsS0FBSyxPQUFMLEdBQWUsQ0FBL0U7QUFDQSxPQUFLLFFBQUwsQ0FBYyxLQUFLLE9BQW5CLEVBQTRCLFNBQTVCLENBQXNDLEdBQXRDLENBQTBDLFFBQTFDO0FBQ0EsT0FBSyxVQUFMLENBQWdCLEtBQUssT0FBckI7QUFDQSxFQTNJd0I7QUE0SXpCLEtBNUl5QixrQkE0SW5CO0FBQ0wsT0FBSyxRQUFMLENBQWMsS0FBSyxPQUFuQixFQUE0QixTQUE1QixDQUFzQyxNQUF0QyxDQUE2QyxRQUE3QztBQUNBLE9BQUssT0FBTCxHQUFnQixLQUFLLE9BQUwsS0FBaUIsS0FBSyxRQUFMLENBQWMsTUFBZCxHQUF1QixDQUF4QyxHQUE0QyxDQUE1QyxHQUFnRCxLQUFLLE9BQUwsR0FBZSxDQUEvRTtBQUNBLE9BQUssUUFBTCxDQUFjLEtBQUssT0FBbkIsRUFBNEIsU0FBNUIsQ0FBc0MsR0FBdEMsQ0FBMEMsUUFBMUM7QUFDQSxPQUFLLFVBQUwsQ0FBZ0IsS0FBSyxPQUFyQjtBQUNBLEVBakp3QjtBQWtKekIsS0FsSnlCLGdCQWtKcEIsQ0FsSm9CLEVBa0psQjtBQUNOLFdBQVMsZ0JBQVQsQ0FBMEIsU0FBMUIsRUFBcUMsS0FBSyxXQUFMLENBQWlCLElBQWpCLENBQXNCLElBQXRCLENBQXJDO0FBQ0EsT0FBSyxVQUFMLENBQWdCLENBQWhCO0FBQ0EsT0FBSyxXQUFMLEdBQW9CLFNBQVMsYUFBN0I7QUFDQSxPQUFLLGlCQUFMLENBQXVCLE1BQXZCLElBQWlDLE9BQU8sVUFBUCxDQUFrQixZQUFVO0FBQUMsUUFBSyxpQkFBTCxDQUF1QixDQUF2QixFQUEwQixLQUExQjtBQUFtQyxHQUE5QyxDQUErQyxJQUEvQyxDQUFvRCxJQUFwRCxDQUFsQixFQUE2RSxDQUE3RSxDQUFqQztBQUNBLE9BQUssUUFBTCxDQUFjLEtBQUssQ0FBbkIsRUFBc0IsU0FBdEIsQ0FBZ0MsR0FBaEMsQ0FBb0MsUUFBcEM7QUFDQSxPQUFLLE1BQUwsQ0FBWSxLQUFLLENBQWpCO0FBQ0EsRUF6SndCO0FBMEp6QixNQTFKeUIsbUJBMEpsQjtBQUNOLFdBQVMsbUJBQVQsQ0FBNkIsU0FBN0IsRUFBd0MsS0FBSyxXQUFMLENBQWlCLElBQWpCLENBQXNCLElBQXRCLENBQXhDO0FBQ0EsT0FBSyxXQUFMLENBQWlCLEtBQWpCO0FBQ0EsT0FBSyxRQUFMLENBQWMsS0FBSyxPQUFuQixFQUE0QixTQUE1QixDQUFzQyxNQUF0QyxDQUE2QyxRQUE3QztBQUNBLE9BQUssTUFBTCxDQUFZLElBQVo7QUFDQSxFQS9Kd0I7QUFnS3pCLE9BaEt5QixrQkFnS2xCLENBaEtrQixFQWdLaEI7QUFDUixPQUFLLE1BQUwsR0FBYyxDQUFDLEtBQUssTUFBcEI7QUFDQSxPQUFLLE9BQUwsR0FBZSxDQUFmO0FBQ0EsT0FBSyxVQUFMLENBQWdCLFNBQWhCLENBQTBCLE1BQTFCLENBQWlDLFFBQWpDO0FBQ0EsT0FBSyxVQUFMLENBQWdCLFlBQWhCLENBQTZCLGFBQTdCLEVBQTRDLENBQUMsS0FBSyxNQUFsRDtBQUNBLE9BQUssVUFBTCxDQUFnQixZQUFoQixDQUE2QixVQUE3QixFQUF5QyxLQUFLLE1BQUwsR0FBYyxHQUFkLEdBQW9CLElBQTdEO0FBQ0EsT0FBSyxRQUFMLENBQWMsVUFBZCxJQUE0QixLQUFLLGdCQUFMLEVBQTVCO0FBQ0EsRUF2S3dCO0FBd0t6QixpQkF4S3lCLDhCQXdLUDtBQUNqQixNQUFHLEtBQUssTUFBUixFQUFlO0FBQ2QsUUFBSyxVQUFMLENBQWdCLGlCQUFoQixJQUFxQyxLQUFLLFVBQUwsQ0FBZ0IsaUJBQWhCLEVBQXJDO0FBQ0EsUUFBSyxVQUFMLENBQWdCLHVCQUFoQixJQUEyQyxLQUFLLFVBQUwsQ0FBZ0IsdUJBQWhCLEVBQTNDO0FBQ0EsUUFBSyxVQUFMLENBQWdCLG9CQUFoQixJQUF3QyxLQUFLLFVBQUwsQ0FBZ0Isb0JBQWhCLEVBQXhDO0FBQ0EsR0FKRCxNQUlPO0FBQ04sWUFBUyxjQUFULElBQTJCLFNBQVMsY0FBVCxFQUEzQjtBQUNBLFlBQVMsbUJBQVQsSUFBZ0MsU0FBUyxtQkFBVCxFQUFoQztBQUNBLFlBQVMsb0JBQVQsSUFBaUMsU0FBUyxvQkFBVCxFQUFqQztBQUNBO0FBQ0Q7QUFsTHdCLENBQTFCOztBQXFMQSxJQUFNLE9BQU8sU0FBUCxJQUFPLENBQUMsR0FBRCxFQUFNLElBQU4sRUFBZTtBQUMzQixLQUFHLENBQUMsSUFBSSxNQUFSLEVBQWdCLE1BQU0sSUFBSSxLQUFKLENBQVUsc0RBQVYsQ0FBTjs7QUFFaEIsS0FBSSxjQUFKOztBQUVBLEtBQUcsT0FBTyxHQUFQLEtBQWUsUUFBbEIsRUFBMkI7QUFDMUIsTUFBSSxNQUFNLEdBQUcsS0FBSCxDQUFTLElBQVQsQ0FBYyxTQUFTLGdCQUFULENBQTBCLEdBQTFCLENBQWQsQ0FBVjs7QUFFQSxNQUFHLENBQUMsSUFBSSxNQUFSLEVBQWdCLE1BQU0sSUFBSSxLQUFKLENBQVUsc0RBQVYsQ0FBTjs7QUFFaEIsVUFBUSxJQUFJLEdBQUosQ0FBUSxjQUFNO0FBQ3JCLFVBQU87QUFDTixhQUFTLEVBREg7QUFFTixTQUFLLEdBQUcsWUFBSCxDQUFnQixNQUFoQixDQUZDO0FBR04sWUFBUSxHQUFHLFlBQUgsQ0FBZ0IsYUFBaEIsS0FBa0MsSUFIcEM7QUFJTixXQUFPLEdBQUcsWUFBSCxDQUFnQixZQUFoQixLQUFpQyxJQUpsQztBQUtOLFdBQU8sR0FBRyxZQUFILENBQWdCLFlBQWhCLEtBQWlDLElBTGxDO0FBTU4saUJBQWEsR0FBRyxZQUFILENBQWdCLGtCQUFoQixLQUF1QztBQU45QyxJQUFQO0FBUUEsR0FUTyxDQUFSO0FBVUEsRUFmRCxNQWVPO0FBQ04sVUFBUSxHQUFSO0FBQ0E7O0FBRUQsUUFBTyxPQUFPLE1BQVAsQ0FBYyxPQUFPLE1BQVAsQ0FBYyxpQkFBZCxDQUFkLEVBQWdEO0FBQ3RELFNBQU8sS0FEK0M7QUFFdEQsWUFBVSxPQUFPLE1BQVAsQ0FBYyxFQUFkLEVBQWtCLFFBQWxCLEVBQTRCLElBQTVCO0FBRjRDLEVBQWhELEVBR0osSUFISSxFQUFQO0FBSUEsQ0E1QkQ7O2tCQThCZSxFQUFFLFVBQUYsRSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgTW9kYWxHYWxsZXJ5IGZyb20gJy4vbGlicy9zdG9ybS1tb2RhbC1nYWxsZXJ5JztcblxuY29uc3Qgb25ET01Db250ZW50TG9hZGVkVGFza3MgPSBbKCkgPT4ge1xuXHQvKlxuXHRsZXQgZ2FsbGVyeSA9IE1vZGFsR2FsbGVyeS5pbml0KFtcblx0XHR7XG5cdFx0XHRzcmM6ICdodHRwczovL2kueXRpbWcuY29tL3ZpL3lhcWUxcWVzUThjL21heHJlc2RlZmF1bHQuanBnJyxcblx0XHRcdHRpdGxlOiAnSW1hZ2UgMScsXG5cdFx0XHRkZXNjcmlwdGlvbjogJ0Rlc2NyaXB0aW9uIDEnXG5cdFx0fSxcblx0XHR7XG5cdFx0XHRzcmM6ICdodHRwczovL3Vuc3BsYXNoLml0LzgwMC8/cmFuZG9tJyxcblx0XHRcdHRpdGxlOiAnSW1hZ2UgMicsXG5cdFx0XHRkZXNjcmlwdGlvbjogJ0Rlc2NyaXB0aW9uIDInXG5cdFx0fV0pO1xuXG5cdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5qcy1tb2RhbC1nYWxsZXJ5X190cmlnZ2VyJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBnYWxsZXJ5Lm9wZW4uYmluZChnYWxsZXJ5LCAwKSk7XG5cdCovXG5cdGxldCBnYWxsZXJ5ID0gTW9kYWxHYWxsZXJ5LmluaXQoJy5qcy1tb2RhbC1nYWxsZXJ5Jyk7XG5cdGNvbnNvbGUubG9nKGdhbGxlcnkpO1xuXG59XTtcblxuICAgIFxuaWYoJ2FkZEV2ZW50TGlzdGVuZXInIGluIHdpbmRvdykgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCAoKSA9PiB7IG9uRE9NQ29udGVudExvYWRlZFRhc2tzLmZvckVhY2goZm4gPT4gZm4oKSk7IH0pO1xuIiwiLyoqXG4gKiBAbmFtZSBzdG9ybS1tb2RhbC1nYWxsZXJ5OiBNb2RhbCBnYWxsZXJ5L2xpZ2h0Ym94XG4gKiBAdmVyc2lvbiAwLjEuMDogVGh1LCAxNSBEZWMgMjAxNiAxMzo0Njo1NCBHTVRcbiAqIEBhdXRob3IgbWpicFxuICogQGxpY2Vuc2UgTUlUXG4gKi9cbmNvbnN0IGRlZmF1bHRzID0ge1xuXHRcdHRlbXBsYXRlczoge1xuXHRcdFx0b3ZlcmxheTogYDxkaXYgY2xhc3M9XCJtb2RhbC1nYWxsZXJ5X19vdXRlciBqcy1tb2RhbC1nYWxsZXJ5X19vdXRlclwiIHJvbGU9XCJkaWFsb2dcIiB0YWJpbmRleD1cIi0xXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+XG5cdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwibW9kYWwtZ2FsbGVyeV9faW5uZXIganMtbW9kYWwtZ2FsbGVyeV9faW5uZXJcIj5cblx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cIm1vZGFsLWdhbGxlcnlfX2NvbnRlbnQganMtbW9kYWwtZ2FsbGVyeV9fY29udGVudFwiPlxuXHRcdFx0XHRcdFx0XHRcdHt7aXRlbXN9fVxuXHRcdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFx0PGJ1dHRvbiBjbGFzcz1cImpzLW1vZGFsLWdhbGxlcnlfX25leHQgbW9kYWwtZ2FsbGVyeV9fbmV4dFwiPlxuXHRcdFx0XHRcdFx0XHQ8c3ZnIHJvbGU9XCJidXR0b25cIiByb2xlPVwiYnV0dG9uXCIgd2lkdGg9XCI0NFwiIGhlaWdodD1cIjYwXCI+XG5cdFx0XHRcdFx0XHRcdFx0PHBvbHlsaW5lIHBvaW50cz1cIjE0IDEwIDM0IDMwIDE0IDUwXCIgc3Ryb2tlPVwicmdiKDI1NSwyNTUsMjU1KVwiIHN0cm9rZS13aWR0aD1cIjRcIiBzdHJva2UtbGluZWNhcD1cImJ1dHRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCIvPlxuXHRcdFx0XHRcdFx0XHQ8L3N2Zz5cblx0XHRcdFx0XHRcdDwvYnV0dG9uPlxuXHRcdFx0XHRcdFx0PGJ1dHRvbiBjbGFzcz1cImpzLW1vZGFsLWdhbGxlcnlfX3ByZXZpb3VzIG1vZGFsLWdhbGxlcnlfX3ByZXZpb3VzXCI+XG5cdFx0XHRcdFx0XHRcdDxzdmcgcm9sZT1cImJ1dHRvblwiIHdpZHRoPVwiNDRcIiBoZWlnaHQ9XCI2MFwiPlxuXHRcdFx0XHRcdFx0XHRcdDxwb2x5bGluZSBwb2ludHM9XCIzMCAxMCAxMCAzMCAzMCA1MFwiIHN0cm9rZT1cInJnYigyNTUsMjU1LDI1NSlcIiBzdHJva2Utd2lkdGg9XCI0XCIgc3Ryb2tlLWxpbmVjYXA9XCJidXR0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiLz5cblx0XHRcdFx0XHRcdFx0PC9zdmc+XG5cdFx0XHRcdFx0XHQ8L2J1dHRvbj5cblx0XHRcdFx0XHRcdDxidXR0b24gY2xhc3M9XCJqcy1tb2RhbC1nYWxsZXJ5X19jbG9zZSBtb2RhbC1nYWxsZXJ5X19jbG9zZVwiPlxuXHRcdFx0XHRcdFx0XHQ8c3ZnIHJvbGU9XCJidXR0b25cIiByb2xlPVwiYnV0dG9uXCIgd2lkdGg9XCIzMFwiIGhlaWdodD1cIjMwXCI+XG5cdFx0XHRcdFx0XHRcdFx0PGcgc3Ryb2tlPVwicmdiKDI1NSwyNTUsMjU1KVwiIHN0cm9rZS13aWR0aD1cIjRcIj5cblx0XHRcdFx0XHRcdFx0XHRcdDxsaW5lIHgxPVwiNVwiIHkxPVwiNVwiIHgyPVwiMjVcIiB5Mj1cIjI1XCIvPlxuXHRcdFx0XHRcdFx0XHRcdFx0PGxpbmUgeDE9XCI1XCIgeTE9XCIyNVwiIHgyPVwiMjVcIiB5Mj1cIjVcIi8+XG5cdFx0XHRcdFx0XHRcdFx0PC9nPlxuXHRcdFx0XHRcdFx0XHQ8L3N2Zz5cblx0XHRcdFx0XHRcdDwvYnV0dG9uPlxuXHRcdFx0XHRcdDwvZGl2PmAsXG5cdFx0XHRpdGVtOiBgPGRpdiBjbGFzcz1cIm1vZGFsLWdhbGxlcnlfX2l0ZW0ganMtbW9kYWwtZ2FsbGVyeV9faXRlbVwiPlxuXHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cIm1vZGFsLWdhbGxlcnlfX2ltZy1jb250YWluZXIganMtbW9kYWwtZ2FsbGVyeV9faW1nLWNvbnRhaW5lclwiPjwvZGl2PlxuXHRcdFx0XHRcdFx0e3tkZXRhaWxzfX1cblx0XHRcdFx0XHQ8L2Rpdj5gLFxuXHRcdFx0ZGV0YWlsczogYDxkaXYgY2xhc3M9XCJtb2RhbC1nYWxsZXJ5X19kZXRhaWxzXCI+XG5cdFx0XHRcdFx0XHQ8aDEgY2xhc3M9XCJtb2RhbC1nYWxsZXJ5X190aXRsZVwiPnt7dGl0bGV9fTwvaDE+XG5cdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwibW9kYWwtZ2FsbGVyeV9fZGVzY3JpcHRpb25cIj57e2Rlc2NyaXB0aW9ufX08L2Rpdj5cblx0XHRcdFx0XHQ8L2Rpdj5gXG5cdFx0fSxcblx0XHRmdWxsc2NyZWVuOiBmYWxzZSxcblx0XHRwcmVsb2FkOiBmYWxzZVxuXHR9LFxuXHRLRVlfQ09ERVMgPSB7XG5cdFx0VEFCOiA5LFxuXHRcdEVTQzogMjcsXG5cdFx0TEVGVDogMzcsXG5cdFx0UklHSFQ6IDM5LFxuXHRcdEVOVEVSOiAxM1xuXHR9LFxuXHRUUklHR0VSX0VWRU5UUyA9IFsnY2xpY2snLCAna2V5ZG93bicsICd0b3VjaHN0YXJ0J107XG5cbmNvbnN0IFN0b3JtTW9kYWxHYWxsZXJ5ID0ge1xuXHRpbml0KCkge1xuXHRcdHRoaXMuaXNPcGVuID0gZmFsc2U7XG5cdFx0dGhpcy5jdXJyZW50ID0gbnVsbDtcblx0XHR0aGlzLmluaXRVSSgpO1xuXHRcdHRoaXMuaW1hZ2VDYWNoZSA9IFtdO1xuXHRcdHRoaXMuZm9jdXNhYmxlQ2hpbGRyZW4gPSB0aGlzLmdldEZvY3VzYWJsZUNoaWxkcmVuKCk7XG5cdFx0dGhpcy5pbml0QnV0dG9ucygpO1xuXHRcdHRoaXMuaXRlbXNbMF0udHJpZ2dlciAmJiB0aGlzLmluaXRUcmlnZ2VycygpO1xuXHRcdHRoaXMuc2V0dGluZ3MucHJlbG9hZCAmJiB0aGlzLml0ZW1zLmZvckVhY2goKGl0ZW0sIGkpID0+IHtcblx0XHRcdHRoaXMubG9hZEltYWdlKGkpO1xuXHRcdH0pO1xuXHRcdHJldHVybiB0aGlzO1xuXHR9LFxuXHRpbml0VHJpZ2dlcnMoKXtcblx0XHR0aGlzLml0ZW1zLmZvckVhY2goKGl0ZW0sIGkpID0+IHtcblx0XHRcdFRSSUdHRVJfRVZFTlRTLmZvckVhY2goZXYgPT4ge1xuXHRcdFx0XHRpdGVtLnRyaWdnZXIuYWRkRXZlbnRMaXN0ZW5lcihldiwgZSA9PiB7XG5cdFx0XHRcdFx0aWYoZS5rZXlDb2RlICYmIGUua2V5Q29kZSAhPT0gS0VZX0NPREVTLkVOVEVSKSByZXR1cm47XG5cdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRcdGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0XHRcdFx0dGhpcy5vcGVuKGkpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH0pO1xuXHRcdH0pO1xuXHR9LFxuXHRpbml0VUkoKXtcblx0XHRsZXQgcmVuZGVyVGVtcGxhdGUgPSAoZGF0YSwgdGVtcGxhdGUpID0+IHtcblx0XHRcdFx0Zm9yKGxldCBkYXR1bSBpbiBkYXRhKXtcblx0XHRcdFx0XHRpZihkYXRhLmhhc093blByb3BlcnR5KGRhdHVtKSl7XG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZSA9IHRlbXBsYXRlLnNwbGl0KGB7eyR7ZGF0dW19fX1gKS5qb2luKGRhdGFbZGF0dW1dKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHRlbXBsYXRlO1xuXHRcdFx0fSxcblx0XHRcdGRldGFpbHNTdHJpbmdBcnJheSA9IHRoaXMuaXRlbXMubWFwKGZ1bmN0aW9uKGltZykge1xuXHRcdFx0XHRyZXR1cm4gcmVuZGVyVGVtcGxhdGUoaW1nLCB0aGlzLnNldHRpbmdzLnRlbXBsYXRlcy5kZXRhaWxzKTtcblx0XHRcdH0uYmluZCh0aGlzKSksXG5cdFx0XHRpdGVtc1N0cmluZyA9IGRldGFpbHNTdHJpbmdBcnJheS5tYXAoZnVuY3Rpb24oaXRlbSkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5zZXR0aW5ncy50ZW1wbGF0ZXMuaXRlbS5zcGxpdCgne3tkZXRhaWxzfX0nKS5qb2luKGl0ZW0pO1xuXHRcdFx0fS5iaW5kKHRoaXMpKTtcblxuXHRcdGRvY3VtZW50LmJvZHkuaW5zZXJ0QWRqYWNlbnRIVE1MKCdiZWZvcmVlbmQnLCB0aGlzLnNldHRpbmdzLnRlbXBsYXRlcy5vdmVybGF5LnNwbGl0KCd7e2l0ZW1zfX0nKS5qb2luKGl0ZW1zU3RyaW5nLmpvaW4oJycpKSk7XG5cdFx0dGhpcy5ET01PdmVybGF5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmpzLW1vZGFsLWdhbGxlcnlfX291dGVyJyk7XG5cdFx0dGhpcy5ET01JdGVtcyA9IFtdLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmpzLW1vZGFsLWdhbGxlcnlfX2l0ZW0nKSk7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH0sXG5cdGluaXRCdXR0b25zKCl7XG5cdFx0dGhpcy5wcmV2aW91c0J0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5qcy1tb2RhbC1nYWxsZXJ5X19wcmV2aW91cycpO1xuXHRcdHRoaXMubmV4dEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5qcy1tb2RhbC1nYWxsZXJ5X19uZXh0Jyk7XG5cdFx0dGhpcy5jbG9zZUJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5qcy1tb2RhbC1nYWxsZXJ5X19jbG9zZScpO1xuXG5cdFx0dGhpcy5wcmV2aW91c0J0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuXHRcdFx0dGhpcy5wcmV2aW91cygpO1xuXHRcdH0uYmluZCh0aGlzKSk7XG5cdFx0dGhpcy5uZXh0QnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG5cdFx0XHR0aGlzLm5leHQoKTtcblx0XHR9LmJpbmQodGhpcykpO1xuXHRcdHRoaXMuY2xvc2VCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpIHtcblx0XHRcdHRoaXMuY2xvc2UoKTtcblx0XHR9LmJpbmQodGhpcykpO1xuXHR9LFxuXHRsb2FkSW1hZ2UoaSkge1xuXHRcdHZhciBpbWcgPSBuZXcgSW1hZ2UoKSxcblx0XHRcdGltYWdlQ29udGFpbmVyID0gdGhpcy5ET01JdGVtc1tpXS5xdWVyeVNlbGVjdG9yKCcuanMtbW9kYWwtZ2FsbGVyeV9faW1nLWNvbnRhaW5lcicpLFxuXHRcdFx0bG9hZGVkID0gKCkgPT4ge1xuXHRcdFx0XHRsZXQgc3Jjc2V0QXR0cmlidXRlID0gdGhpcy5pdGVtc1tpXS5zcmNzZXQgPyBgIHNyY3NldD1cIiR7dGhpcy5pdGVtc1tpXS5zcmNzZXR9XCJgIDogJycsXG5cdFx0XHRcdFx0c2l6ZXNBdHRyaWJ1dGUgPSB0aGlzLml0ZW1zW2ldLnNpemVzID8gYCBzaXplcz1cIiR7dGhpcy5pdGVtc1tpXS5zaXplc31cImAgOiAnJztcblx0XHRcdFx0aW1hZ2VDb250YWluZXIuaW5uZXJIVE1MID0gYDxpbWcgY2xhc3M9XCJtb2RhbC1nYWxsZXJ5X19pbWdcIiBzcmM9XCIke3RoaXMuaXRlbXNbaV0uc3JjfVwiIGFsdD1cIiR7dGhpcy5pdGVtc1tpXS50aXRsZX1cIiR7c3Jjc2V0QXR0cmlidXRlfSR7c2l6ZXNBdHRyaWJ1dGV9PmA7XG5cdFx0XHRcdHRoaXMuRE9NSXRlbXNbaV0uY2xhc3NMaXN0LnJlbW92ZSgnbG9hZGluZycpO1xuXHRcdFx0XHRpbWcub25sb2FkID0gbnVsbDtcblx0XHRcdH07XG5cdFx0aW1nLm9ubG9hZCA9IGxvYWRlZDtcblx0XHRpbWcuc3JjID0gdGhpcy5pdGVtc1tpXS5zcmM7XG5cdFx0aW1nLm9uZXJyb3IgPSAoKSA9PiB7XG5cdFx0XHR0aGlzLkRPTUl0ZW1zW2ldLmNsYXNzTGlzdC5yZW1vdmUoJ2xvYWRpbmcnKTtcblx0XHRcdHRoaXMuRE9NSXRlbXNbaV0uY2xhc3NMaXN0LmFkZCgnZXJyb3InKTtcblx0XHR9O1xuXHRcdGlmKGltZy5jb21wbGV0ZSkgbG9hZGVkKCk7XG5cdH0sXG5cdGxvYWRJbWFnZXMoaSl7XG5cdFx0aWYodGhpcy5pbWFnZUNhY2hlLmxlbmd0aCA9PT0gdGhpcy5pdGVtcykgcmV0dXJuO1xuXG5cdFx0bGV0IGluZGV4ZXMgPSBbaV07XG5cblx0XHRpZih0aGlzLml0ZW1zLmxlbmd0aCA+IDEpIGluZGV4ZXMucHVzaChpID09PSAwID8gdGhpcy5pdGVtcy5sZW5ndGggLSAxIDogaSAtIDEpO1xuXHRcdGlmKHRoaXMuaXRlbXMubGVuZ3RoID4gMikgaW5kZXhlcy5wdXNoKGkgPT09IHRoaXMuaXRlbXMubGVuZ3RoIC0gMSA/IDAgOiBpICsgMSk7XG5cblx0XHRpbmRleGVzLmZvckVhY2goaWR4ID0+IHtcblx0XHRcdGlmKHRoaXMuaW1hZ2VDYWNoZVtpZHhdID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0dGhpcy5ET01JdGVtc1tpZHhdLmNsYXNzTGlzdC5hZGQoJ2xvYWRpbmcnKTtcblx0XHRcdFx0dGhpcy5sb2FkSW1hZ2UoaWR4KTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHR9LFxuXHRnZXRGb2N1c2FibGVDaGlsZHJlbigpIHtcblx0XHRsZXQgZm9jdXNhYmxlRWxlbWVudHMgPSBbJ2FbaHJlZl0nLCAnYXJlYVtocmVmXScsICdpbnB1dDpub3QoW2Rpc2FibGVkXSknLCAnc2VsZWN0Om5vdChbZGlzYWJsZWRdKScsICd0ZXh0YXJlYTpub3QoW2Rpc2FibGVkXSknLCAnYnV0dG9uOm5vdChbZGlzYWJsZWRdKScsICdpZnJhbWUnLCAnb2JqZWN0JywgJ2VtYmVkJywgJ1tjb250ZW50ZWRpdGFibGVdJywgJ1t0YWJpbmRleF06bm90KFt0YWJpbmRleD1cIi0xXCJdKSddO1xuXG5cdFx0cmV0dXJuIFtdLnNsaWNlLmNhbGwodGhpcy5ET01PdmVybGF5LnF1ZXJ5U2VsZWN0b3JBbGwoZm9jdXNhYmxlRWxlbWVudHMuam9pbignLCcpKSk7XG5cdH0sXG5cdHRyYXBUYWIoZSl7XG5cdFx0bGV0IGZvY3VzZWRJbmRleCA9IHRoaXMuZm9jdXNhYmxlQ2hpbGRyZW4uaW5kZXhPZihkb2N1bWVudC5hY3RpdmVFbGVtZW50KTtcblx0XHRpZihlLnNoaWZ0S2V5ICYmIGZvY3VzZWRJbmRleCA9PT0gMCkge1xuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0dGhpcy5mb2N1c2FibGVDaGlsZHJlblt0aGlzLmZvY3VzYWJsZUNoaWxkcmVuLmxlbmd0aCAtIDFdLmZvY3VzKCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGlmKCFlLnNoaWZ0S2V5ICYmIGZvY3VzZWRJbmRleCA9PT0gdGhpcy5mb2N1c2FibGVDaGlsZHJlbi5sZW5ndGggLSAxKSB7XG5cdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0dGhpcy5mb2N1c2FibGVDaGlsZHJlblswXS5mb2N1cygpO1xuXHRcdFx0fVxuXHRcdH1cblx0fSxcblx0a2V5TGlzdGVuZXIoZSl7XG5cdFx0aWYoIXRoaXMub3BlbikgcmV0dXJuO1xuXG5cdFx0c3dpdGNoIChlLmtleUNvZGUpIHtcblx0XHRjYXNlIEtFWV9DT0RFUy5FU0M6XG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHR0aGlzLnRvZ2dsZSgpO1xuXHRcdFx0YnJlYWs7XG5cdFx0Y2FzZSBLRVlfQ09ERVMuVEFCOlxuXHRcdFx0dGhpcy50cmFwVGFiKGUpO1xuXHRcdFx0YnJlYWs7XG5cdFx0Y2FzZSBLRVlfQ09ERVMuTEVGVDpcblx0XHRcdHRoaXMucHJldmlvdXMoKTtcblx0XHRcdGJyZWFrO1xuXHRcdGNhc2UgS0VZX0NPREVTLlJJR0hUOlxuXHRcdFx0dGhpcy5uZXh0KCk7XG5cdFx0XHRicmVhaztcblx0XHRkZWZhdWx0OlxuXHRcdFx0YnJlYWs7XG5cdFx0fVxuXHR9LFxuXHRwcmV2aW91cygpe1xuXHRcdHRoaXMuRE9NSXRlbXNbdGhpcy5jdXJyZW50XS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcblx0XHR0aGlzLmN1cnJlbnQgPSAodGhpcy5jdXJyZW50ID09PSAwID8gdGhpcy5ET01JdGVtcy5sZW5ndGggLSAxIDogdGhpcy5jdXJyZW50IC0gMSk7XG5cdFx0dGhpcy5ET01JdGVtc1t0aGlzLmN1cnJlbnRdLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXHRcdHRoaXMubG9hZEltYWdlcyh0aGlzLmN1cnJlbnQpO1xuXHR9LFxuXHRuZXh0KCl7XG5cdFx0dGhpcy5ET01JdGVtc1t0aGlzLmN1cnJlbnRdLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHRcdHRoaXMuY3VycmVudCA9ICh0aGlzLmN1cnJlbnQgPT09IHRoaXMuRE9NSXRlbXMubGVuZ3RoIC0gMSA/IDAgOiB0aGlzLmN1cnJlbnQgKyAxKTtcblx0XHR0aGlzLkRPTUl0ZW1zW3RoaXMuY3VycmVudF0uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG5cdFx0dGhpcy5sb2FkSW1hZ2VzKHRoaXMuY3VycmVudCk7XG5cdH0sXG5cdG9wZW4oaSl7XG5cdFx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRoaXMua2V5TGlzdGVuZXIuYmluZCh0aGlzKSk7XG5cdFx0dGhpcy5sb2FkSW1hZ2VzKGkpO1xuXHRcdHRoaXMubGFzdEZvY3VzZWQgPSAgZG9jdW1lbnQuYWN0aXZlRWxlbWVudDtcblx0XHR0aGlzLmZvY3VzYWJsZUNoaWxkcmVuLmxlbmd0aCAmJiB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpe3RoaXMuZm9jdXNhYmxlQ2hpbGRyZW5bMF0uZm9jdXMoKTt9LmJpbmQodGhpcyksIDApO1xuXHRcdHRoaXMuRE9NSXRlbXNbaSB8fCAwXS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcblx0XHR0aGlzLnRvZ2dsZShpIHx8IDApO1xuXHR9LFxuXHRjbG9zZSgpe1xuXHRcdGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLmtleUxpc3RlbmVyLmJpbmQodGhpcykpO1xuXHRcdHRoaXMubGFzdEZvY3VzZWQuZm9jdXMoKTtcblx0XHR0aGlzLkRPTUl0ZW1zW3RoaXMuY3VycmVudF0uY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdFx0dGhpcy50b2dnbGUobnVsbCk7XG5cdH0sXG5cdHRvZ2dsZShpKXtcblx0XHR0aGlzLmlzT3BlbiA9ICF0aGlzLmlzT3Blbjtcblx0XHR0aGlzLmN1cnJlbnQgPSBpO1xuXHRcdHRoaXMuRE9NT3ZlcmxheS5jbGFzc0xpc3QudG9nZ2xlKCdhY3RpdmUnKTtcblx0XHR0aGlzLkRPTU92ZXJsYXkuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICF0aGlzLmlzT3Blbik7XG5cdFx0dGhpcy5ET01PdmVybGF5LnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCB0aGlzLmlzT3BlbiA/ICcwJyA6ICctMScpO1xuXHRcdHRoaXMuc2V0dGluZ3MuZnVsbHNjcmVlbiAmJiB0aGlzLnRvZ2dsZUZ1bGxTY3JlZW4oKTtcblx0fSxcblx0dG9nZ2xlRnVsbFNjcmVlbigpe1xuXHRcdGlmKHRoaXMuaXNPcGVuKXtcblx0XHRcdHRoaXMuRE9NT3ZlcmxheS5yZXF1ZXN0RnVsbHNjcmVlbiAmJiB0aGlzLkRPTU92ZXJsYXkucmVxdWVzdEZ1bGxzY3JlZW4oKTtcblx0XHRcdHRoaXMuRE9NT3ZlcmxheS53ZWJraXRSZXF1ZXN0RnVsbHNjcmVlbiAmJiB0aGlzLkRPTU92ZXJsYXkud2Via2l0UmVxdWVzdEZ1bGxzY3JlZW4oKTtcblx0XHRcdHRoaXMuRE9NT3ZlcmxheS5tb3pSZXF1ZXN0RnVsbFNjcmVlbiAmJiB0aGlzLkRPTU92ZXJsYXkubW96UmVxdWVzdEZ1bGxTY3JlZW4oKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0ZG9jdW1lbnQuZXhpdEZ1bGxzY3JlZW4gJiYgZG9jdW1lbnQuZXhpdEZ1bGxzY3JlZW4oKTtcblx0XHRcdGRvY3VtZW50Lm1vekNhbmNlbEZ1bGxTY3JlZW4gJiYgZG9jdW1lbnQubW96Q2FuY2VsRnVsbFNjcmVlbigpO1xuXHRcdFx0ZG9jdW1lbnQud2Via2l0RXhpdEZ1bGxzY3JlZW4gJiYgZG9jdW1lbnQud2Via2l0RXhpdEZ1bGxzY3JlZW4oKTtcblx0XHR9XG5cdH1cbn07XG5cbmNvbnN0IGluaXQgPSAoc3JjLCBvcHRzKSA9PiB7XG5cdGlmKCFzcmMubGVuZ3RoKSB0aHJvdyBuZXcgRXJyb3IoJ01vZGFsIEdhbGxlcnkgY2Fubm90IGJlIGluaXRpYWxpc2VkLCBubyBpbWFnZXMgZm91bmQnKTtcblxuXHRsZXQgaXRlbXM7XG5cblx0aWYodHlwZW9mIHNyYyA9PT0gJ3N0cmluZycpe1xuXHRcdGxldCBlbHMgPSBbXS5zbGljZS5jYWxsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoc3JjKSk7XG5cblx0XHRpZighZWxzLmxlbmd0aCkgdGhyb3cgbmV3IEVycm9yKCdNb2RhbCBHYWxsZXJ5IGNhbm5vdCBiZSBpbml0aWFsaXNlZCwgbm8gaW1hZ2VzIGZvdW5kJyk7XG5cdFx0XG5cdFx0aXRlbXMgPSBlbHMubWFwKGVsID0+IHtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHRyaWdnZXI6IGVsLFxuXHRcdFx0XHRzcmM6IGVsLmdldEF0dHJpYnV0ZSgnaHJlZicpLFxuXHRcdFx0XHRzcmNzZXQ6IGVsLmdldEF0dHJpYnV0ZSgnZGF0YS1zcmNzZXQnKSB8fCBudWxsLFxuXHRcdFx0XHRzaXplczogZWwuZ2V0QXR0cmlidXRlKCdkYXRhLXNpemVzJykgfHwgbnVsbCxcblx0XHRcdFx0dGl0bGU6IGVsLmdldEF0dHJpYnV0ZSgnZGF0YS10aXRsZScpIHx8IG51bGwsXG5cdFx0XHRcdGRlc2NyaXB0aW9uOiBlbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtZGVzY3JpcHRpb24nKSB8fCBudWxsXG5cdFx0XHR9O1xuXHRcdH0pO1xuXHR9IGVsc2Uge1xuXHRcdGl0ZW1zID0gc3JjO1xuXHR9XG5cdFxuXHRyZXR1cm4gT2JqZWN0LmFzc2lnbihPYmplY3QuY3JlYXRlKFN0b3JtTW9kYWxHYWxsZXJ5KSwge1xuXHRcdGl0ZW1zOiBpdGVtcyxcblx0XHRzZXR0aW5nczogT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdHMsIG9wdHMpXG5cdH0pLmluaXQoKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHsgaW5pdCB9OyJdfQ==
