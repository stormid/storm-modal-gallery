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

	_stormModalGallery2.default.init('.js-modal-gallery');
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJleGFtcGxlL3NyYy9hcHAuanMiLCJleGFtcGxlL3NyYy9saWJzL3N0b3JtLW1vZGFsLWdhbGxlcnkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBOzs7Ozs7QUFFQSxJQUFNLDBCQUEwQixDQUFDLFlBQU07O0FBRXRDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBLDZCQUFhLElBQWIsQ0FBa0IsbUJBQWxCO0FBRUEsQ0F0QitCLENBQWhDOztBQXdCQSxJQUFHLHNCQUFzQixNQUF6QixFQUFpQyxPQUFPLGdCQUFQLENBQXdCLGtCQUF4QixFQUE0QyxZQUFNO0FBQUUseUJBQXdCLE9BQXhCLENBQWdDO0FBQUEsU0FBTSxJQUFOO0FBQUEsRUFBaEM7QUFBOEMsQ0FBbEc7Ozs7Ozs7O0FDMUJqQzs7Ozs7O0FBTUEsSUFBTSxXQUFXO0FBQ2YsWUFBVztBQUNWLDAxQ0FEVTtBQXlCViwyTUF6QlU7QUE2QlY7QUE3QlUsRUFESTtBQW1DZixhQUFZLEtBbkNHO0FBb0NmLFVBQVMsS0FwQ007QUFxQ2YsU0FBUTtBQXJDTyxDQUFqQjtBQUFBLElBdUNDLFlBQVk7QUFDWCxNQUFLLENBRE07QUFFWCxNQUFLLEVBRk07QUFHWCxPQUFNLEVBSEs7QUFJWCxRQUFPLEVBSkk7QUFLWCxRQUFPO0FBTEksQ0F2Q2I7QUFBQSxJQThDQyxpQkFBaUIsQ0FBQyxPQUFELEVBQVUsU0FBVixFQUFxQixZQUFyQixDQTlDbEI7O0FBZ0RBLElBQU0sb0JBQW9CO0FBQ3pCLEtBRHlCLGtCQUNsQjtBQUFBOztBQUNOLE9BQUssTUFBTCxHQUFjLEtBQWQ7QUFDQSxPQUFLLE9BQUwsR0FBZSxJQUFmO0FBQ0EsT0FBSyxNQUFMO0FBQ0EsT0FBSyxVQUFMLEdBQWtCLEVBQWxCO0FBQ0EsT0FBSyxpQkFBTCxH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QUpJLEVBQVA7QUFLQSxDQTdCRDs7a0JBK0JlLEVBQUUsVUFBRixFIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCBNb2RhbEdhbGxlcnkgZnJvbSAnLi9saWJzL3N0b3JtLW1vZGFsLWdhbGxlcnknO1xuXG5jb25zdCBvbkRPTUNvbnRlbnRMb2FkZWRUYXNrcyA9IFsoKSA9PiB7XG5cblx0Ly8gbGV0IGdhbGxlcnkgPSBNb2RhbEdhbGxlcnkuaW5pdChbXG5cdC8vIFx0e1xuXHQvLyBcdFx0c3JjOiAnaHR0cDovL3BsYWNlaG9sZC5pdC81MDB4NTAwJyxcblx0Ly8gXHRcdHNyY3NldDonaHR0cDovL3BsYWNlaG9sZC5pdC84MDB4ODAwIDgwMHcsIGh0dHA6Ly9wbGFjZWhvbGQuaXQvNTAweDUwMCAzMjB3Jyxcblx0Ly8gXHRcdHRpdGxlOiAnSW1hZ2UgMScsXG5cdC8vIFx0XHRkZXNjcmlwdGlvbjogJ0Rlc2NyaXB0aW9uIDEnXG5cdC8vIFx0fSxcblx0Ly8gXHR7XG5cdC8vIFx0XHRzcmM6ICdodHRwOi8vcGxhY2Vob2xkLml0LzMwMHg4MDAnLFxuXHQvLyBcdFx0c3Jjc2V0OidodHRwOi8vcGxhY2Vob2xkLml0LzUwMHg4MDAgODAwdywgaHR0cDovL3BsYWNlaG9sZC5pdC8zMDB4NTAwIDMyMHcnLFxuXHQvLyBcdFx0dGl0bGU6ICdJbWFnZSAyJyxcblx0Ly8gXHRcdGRlc2NyaXB0aW9uOiAnRGVzY3JpcHRpb24gMidcblx0Ly8gXHR9XSk7XG5cblx0Ly9jb25zb2xlLmxvZyhnYWxsZXJ5KTtcblx0XG5cdC8vZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmpzLW1vZGFsLWdhbGxlcnlfX3RyaWdnZXInKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGdhbGxlcnkub3Blbi5iaW5kKGdhbGxlcnksIDApKTtcblxuXHRNb2RhbEdhbGxlcnkuaW5pdCgnLmpzLW1vZGFsLWdhbGxlcnknKTtcblxufV07XG4gICAgXG5pZignYWRkRXZlbnRMaXN0ZW5lcicgaW4gd2luZG93KSB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsICgpID0+IHsgb25ET01Db250ZW50TG9hZGVkVGFza3MuZm9yRWFjaChmbiA9PiBmbigpKTsgfSk7IiwiLyoqXG4gKiBAbmFtZSBzdG9ybS1tb2RhbC1nYWxsZXJ5OiBNb2RhbCBnYWxsZXJ5L2xpZ2h0Ym94XG4gKiBAdmVyc2lvbiAwLjIuMDogVGh1LCAwOSBNYXIgMjAxNyAxNzowOTowMyBHTVRcbiAqIEBhdXRob3IgbWpicFxuICogQGxpY2Vuc2UgTUlUXG4gKi9cbmNvbnN0IGRlZmF1bHRzID0ge1xuXHRcdHRlbXBsYXRlczoge1xuXHRcdFx0b3ZlcmxheTogYDxkaXYgY2xhc3M9XCJtb2RhbC1nYWxsZXJ5X19pbm5lciBqcy1tb2RhbC1nYWxsZXJ5X19pbm5lclwiPlxuXHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwibW9kYWwtZ2FsbGVyeV9fY29udGVudCBqcy1tb2RhbC1nYWxsZXJ5X19jb250ZW50XCI+XG5cdFx0XHRcdFx0XHRcdFx0e3tpdGVtc319XG5cdFx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHQ8YnV0dG9uIGNsYXNzPVwianMtbW9kYWwtZ2FsbGVyeV9fbmV4dCBtb2RhbC1nYWxsZXJ5X19uZXh0XCI+XG5cdFx0XHRcdFx0XHRcdDxzdmcgcm9sZT1cImJ1dHRvblwiIHJvbGU9XCJidXR0b25cIiB3aWR0aD1cIjQ0XCIgaGVpZ2h0PVwiNjBcIj5cblx0XHRcdFx0XHRcdFx0XHQ8cG9seWxpbmUgcG9pbnRzPVwiMTQgMTAgMzQgMzAgMTQgNTBcIiBzdHJva2U9XCJyZ2IoMjU1LDI1NSwyNTUpXCIgc3Ryb2tlLXdpZHRoPVwiNFwiIHN0cm9rZS1saW5lY2FwPVwiYnV0dFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIi8+XG5cdFx0XHRcdFx0XHRcdDwvc3ZnPlxuXHRcdFx0XHRcdFx0PC9idXR0b24+XG5cdFx0XHRcdFx0XHQ8YnV0dG9uIGNsYXNzPVwianMtbW9kYWwtZ2FsbGVyeV9fcHJldmlvdXMgbW9kYWwtZ2FsbGVyeV9fcHJldmlvdXNcIj5cblx0XHRcdFx0XHRcdFx0PHN2ZyByb2xlPVwiYnV0dG9uXCIgd2lkdGg9XCI0NFwiIGhlaWdodD1cIjYwXCI+XG5cdFx0XHRcdFx0XHRcdFx0PHBvbHlsaW5lIHBvaW50cz1cIjMwIDEwIDEwIDMwIDMwIDUwXCIgc3Ryb2tlPVwicmdiKDI1NSwyNTUsMjU1KVwiIHN0cm9rZS13aWR0aD1cIjRcIiBzdHJva2UtbGluZWNhcD1cImJ1dHRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCIvPlxuXHRcdFx0XHRcdFx0XHQ8L3N2Zz5cblx0XHRcdFx0XHRcdDwvYnV0dG9uPlxuXHRcdFx0XHRcdFx0PGJ1dHRvbiBjbGFzcz1cImpzLW1vZGFsLWdhbGxlcnlfX2Nsb3NlIG1vZGFsLWdhbGxlcnlfX2Nsb3NlXCI+XG5cdFx0XHRcdFx0XHRcdDxzdmcgcm9sZT1cImJ1dHRvblwiIHJvbGU9XCJidXR0b25cIiB3aWR0aD1cIjMwXCIgaGVpZ2h0PVwiMzBcIj5cblx0XHRcdFx0XHRcdFx0XHQ8ZyBzdHJva2U9XCJyZ2IoMjU1LDI1NSwyNTUpXCIgc3Ryb2tlLXdpZHRoPVwiNFwiPlxuXHRcdFx0XHRcdFx0XHRcdFx0PGxpbmUgeDE9XCI1XCIgeTE9XCI1XCIgeDI9XCIyNVwiIHkyPVwiMjVcIi8+XG5cdFx0XHRcdFx0XHRcdFx0XHQ8bGluZSB4MT1cIjVcIiB5MT1cIjI1XCIgeDI9XCIyNVwiIHkyPVwiNVwiLz5cblx0XHRcdFx0XHRcdFx0XHQ8L2c+XG5cdFx0XHRcdFx0XHRcdDwvc3ZnPlxuXHRcdFx0XHRcdFx0PC9idXR0b24+XG5cdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwibW9kYWwtZ2FsbGVyeV9fdG90YWwganMtZ2FsbGVyeS10b3RhbHNcIj48L2Rpdj5gLFxuXHRcdFx0aXRlbTogYDxkaXYgY2xhc3M9XCJtb2RhbC1nYWxsZXJ5X19pdGVtIGpzLW1vZGFsLWdhbGxlcnlfX2l0ZW1cIj5cblx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJtb2RhbC1nYWxsZXJ5X19pbWctY29udGFpbmVyIGpzLW1vZGFsLWdhbGxlcnlfX2ltZy1jb250YWluZXJcIj48L2Rpdj5cblx0XHRcdFx0XHRcdHt7ZGV0YWlsc319XG5cdFx0XHRcdFx0PC9kaXY+YCxcblx0XHRcdGRldGFpbHM6IGA8ZGl2IGNsYXNzPVwibW9kYWwtZ2FsbGVyeV9fZGV0YWlsc1wiPlxuXHRcdFx0XHRcdFx0PGgxIGNsYXNzPVwibW9kYWwtZ2FsbGVyeV9fdGl0bGVcIj57e3RpdGxlfX08L2gxPlxuXHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cIm1vZGFsLWdhbGxlcnlfX2Rlc2NyaXB0aW9uXCI+e3tkZXNjcmlwdGlvbn19PC9kaXY+XG5cdFx0XHRcdFx0PC9kaXY+YFxuXHRcdH0sXG5cdFx0ZnVsbHNjcmVlbjogZmFsc2UsXG5cdFx0cHJlbG9hZDogZmFsc2UsXG5cdFx0dG90YWxzOiB0cnVlXG5cdH0sXG5cdEtFWV9DT0RFUyA9IHtcblx0XHRUQUI6IDksXG5cdFx0RVNDOiAyNyxcblx0XHRMRUZUOiAzNyxcblx0XHRSSUdIVDogMzksXG5cdFx0RU5URVI6IDEzXG5cdH0sXG5cdFRSSUdHRVJfRVZFTlRTID0gWydjbGljaycsICdrZXlkb3duJywgJ3RvdWNoc3RhcnQnXTtcblxuY29uc3QgU3Rvcm1Nb2RhbEdhbGxlcnkgPSB7XG5cdGluaXQoKSB7XG5cdFx0dGhpcy5pc09wZW4gPSBmYWxzZTtcblx0XHR0aGlzLmN1cnJlbnQgPSBudWxsO1xuXHRcdHRoaXMuaW5pdFVJKCk7XG5cdFx0dGhpcy5pbWFnZUNhY2hlID0gW107XG5cdFx0dGhpcy5mb2N1c2FibGVDaGlsZHJlbiA9IHRoaXMuZ2V0Rm9jdXNhYmxlQ2hpbGRyZW4oKTtcblx0XHR0aGlzLmluaXRCdXR0b25zKCk7XG5cdFx0dGhpcy5pdGVtc1swXS50cmlnZ2VyICYmIHRoaXMuaW5pdFRyaWdnZXJzKCk7XG5cdFx0dGhpcy5zZXR0aW5ncy5wcmVsb2FkICYmIHRoaXMuaXRlbXMuZm9yRWFjaCgoaXRlbSwgaSkgPT4ge1xuXHRcdFx0dGhpcy5sb2FkSW1hZ2UoaSk7XG5cdFx0fSk7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH0sXG5cdGluaXRUcmlnZ2Vycygpe1xuXHRcdHRoaXMuaXRlbXMuZm9yRWFjaCgoaXRlbSwgaSkgPT4ge1xuXHRcdFx0VFJJR0dFUl9FVkVOVFMuZm9yRWFjaChldiA9PiB7XG5cdFx0XHRcdGl0ZW0udHJpZ2dlci5hZGRFdmVudExpc3RlbmVyKGV2LCBlID0+IHtcblx0XHRcdFx0XHRpZihlLmtleUNvZGUgJiYgZS5rZXlDb2RlICE9PSBLRVlfQ09ERVMuRU5URVIpIHJldHVybjtcblx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0ZS5zdG9wUHJvcGFnYXRpb24oKTtcblx0XHRcdFx0XHR0aGlzLm9wZW4oaSk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cdFx0fSk7XG5cdH0sXG5cdGluaXRVSSgpe1xuXHRcdGxldCByZW5kZXJUZW1wbGF0ZSA9IChkYXRhLCB0ZW1wbGF0ZSkgPT4ge1xuXHRcdFx0XHRmb3IobGV0IGRhdHVtIGluIGRhdGEpe1xuXHRcdFx0XHRcdGlmKGRhdGEuaGFzT3duUHJvcGVydHkoZGF0dW0pKXtcblx0XHRcdFx0XHRcdHRlbXBsYXRlID0gdGVtcGxhdGUuc3BsaXQoYHt7JHtkYXR1bX19fWApLmpvaW4oZGF0YVtkYXR1bV0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gdGVtcGxhdGU7XG5cdFx0XHR9LFxuXHRcdFx0ZGV0YWlsc1N0cmluZ0FycmF5ID0gdGhpcy5pdGVtcy5tYXAoZnVuY3Rpb24oaW1nKSB7XG5cdFx0XHRcdHJldHVybiByZW5kZXJUZW1wbGF0ZShpbWcsIHRoaXMuc2V0dGluZ3MudGVtcGxhdGVzLmRldGFpbHMpO1xuXHRcdFx0fS5iaW5kKHRoaXMpKSxcblx0XHRcdGl0ZW1zU3RyaW5nID0gZGV0YWlsc1N0cmluZ0FycmF5Lm1hcChmdW5jdGlvbihpdGVtKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLnNldHRpbmdzLnRlbXBsYXRlcy5pdGVtLnNwbGl0KCd7e2RldGFpbHN9fScpLmpvaW4oaXRlbSk7XG5cdFx0XHR9LmJpbmQodGhpcykpLFxuXHRcdFx0b3ZlcmxheSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXG5cdFx0b3ZlcmxheS5jbGFzc05hbWUgPSAnbW9kYWwtZ2FsbGVyeV9fb3V0ZXIganMtbW9kYWwtZ2FsbGVyeV9fb3V0ZXInO1xuXHRcdG92ZXJsYXkuc2V0QXR0cmlidXRlKCdyb2xlJywgJ2RpYWxvZycpO1xuXHRcdG92ZXJsYXkuc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsICctMScpO1xuXHRcdG92ZXJsYXkuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsIHRydWUpO1xuXG5cdFx0dGhpcy5ET01PdmVybGF5ID0gZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChvdmVybGF5KTtcblxuXHRcdHRoaXMuRE9NT3ZlcmxheS5pbnNlcnRBZGphY2VudEhUTUwoJ2JlZm9yZWVuZCcsIHRoaXMuc2V0dGluZ3MudGVtcGxhdGVzLm92ZXJsYXkuc3BsaXQoJ3t7aXRlbXN9fScpLmpvaW4oaXRlbXNTdHJpbmcuam9pbignJykpKTtcblx0XHR0aGlzLkRPTUl0ZW1zID0gW10uc2xpY2UuY2FsbCh0aGlzLkRPTU92ZXJsYXkucXVlcnlTZWxlY3RvckFsbCgnLmpzLW1vZGFsLWdhbGxlcnlfX2l0ZW0nKSk7XG5cdFx0dGhpcy5ET01Ub3RhbHMgPSB0aGlzLkRPTU92ZXJsYXkucXVlcnlTZWxlY3RvcignLmpzLWdhbGxlcnktdG90YWxzJyk7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH0sXG5cdGluaXRCdXR0b25zKCl7XG5cdFx0dGhpcy5wcmV2aW91c0J0biA9IHRoaXMuRE9NT3ZlcmxheS5xdWVyeVNlbGVjdG9yKCcuanMtbW9kYWwtZ2FsbGVyeV9fcHJldmlvdXMnKTtcblx0XHR0aGlzLm5leHRCdG4gPSB0aGlzLkRPTU92ZXJsYXkucXVlcnlTZWxlY3RvcignLmpzLW1vZGFsLWdhbGxlcnlfX25leHQnKTtcblx0XHR0aGlzLmNsb3NlQnRuID0gdGhpcy5ET01PdmVybGF5LnF1ZXJ5U2VsZWN0b3IoJy5qcy1tb2RhbC1nYWxsZXJ5X19jbG9zZScpO1xuXG5cdFx0dGhpcy5jbG9zZUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuXHRcdFx0dGhpcy5jbG9zZSgpO1xuXHRcdH0uYmluZCh0aGlzKSk7XG5cblx0XHRpZiAodGhpcy50b3RhbCA8IDIpIHtcblx0XHRcdHRoaXMucHJldmlvdXNCdG4ucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh0aGlzLnByZXZpb3VzQnRuKTtcblx0XHRcdHRoaXMubmV4dEJ0bi5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHRoaXMubmV4dEJ0bik7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dGhpcy5wcmV2aW91c0J0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuXHRcdFx0dGhpcy5wcmV2aW91cygpO1xuXHRcdH0uYmluZCh0aGlzKSk7XG5cdFx0dGhpcy5uZXh0QnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG5cdFx0XHR0aGlzLm5leHQoKTtcblx0XHR9LmJpbmQodGhpcykpO1xuXHR9LFxuXHR3cml0ZVRvdGFsczogZnVuY3Rpb24gd3JpdGVUb3RhbHMoKSB7XG5cdFx0dGhpcy5ET01Ub3RhbHMuaW5uZXJIVE1MID0gYCR7dGhpcy5jdXJyZW50ICsgMX0vJHt0aGlzLnRvdGFsfWA7XG5cdH0sXG5cdGxvYWRJbWFnZShpKSB7XG5cdFx0dmFyIGltZyA9IG5ldyBJbWFnZSgpLFxuXHRcdFx0aW1hZ2VDb250YWluZXIgPSB0aGlzLkRPTUl0ZW1zW2ldLnF1ZXJ5U2VsZWN0b3IoJy5qcy1tb2RhbC1nYWxsZXJ5X19pbWctY29udGFpbmVyJyksXG5cdFx0XHRsb2FkZWQgPSAoKSA9PiB7XG5cdFx0XHRcdGxldCBzcmNzZXRBdHRyaWJ1dGUgPSB0aGlzLml0ZW1zW2ldLnNyY3NldCA/IGAgc3Jjc2V0PVwiJHt0aGlzLml0ZW1zW2ldLnNyY3NldH1cImAgOiAnJyxcblx0XHRcdFx0XHRzaXplc0F0dHJpYnV0ZSA9IHRoaXMuaXRlbXNbaV0uc2l6ZXMgPyBgIHNpemVzPVwiJHt0aGlzLml0ZW1zW2ldLnNpemVzfVwiYCA6ICcnO1xuXHRcdFx0XHRpbWFnZUNvbnRhaW5lci5pbm5lckhUTUwgPSBgPGltZyBjbGFzcz1cIm1vZGFsLWdhbGxlcnlfX2ltZ1wiIHNyYz1cIiR7dGhpcy5pdGVtc1tpXS5zcmN9XCIgYWx0PVwiJHt0aGlzLml0ZW1zW2ldLnRpdGxlfVwiJHtzcmNzZXRBdHRyaWJ1dGV9JHtzaXplc0F0dHJpYnV0ZX0+YDtcblx0XHRcdFx0dGhpcy5ET01JdGVtc1tpXS5jbGFzc0xpc3QucmVtb3ZlKCdsb2FkaW5nJyk7XG5cdFx0XHRcdGltZy5vbmxvYWQgPSBudWxsO1xuXHRcdFx0fTtcblx0XHRpbWcub25sb2FkID0gbG9hZGVkO1xuXHRcdGltZy5zcmMgPSB0aGlzLml0ZW1zW2ldLnNyYztcblx0XHRpbWcub25lcnJvciA9ICgpID0+IHtcblx0XHRcdHRoaXMuRE9NSXRlbXNbaV0uY2xhc3NMaXN0LnJlbW92ZSgnbG9hZGluZycpO1xuXHRcdFx0dGhpcy5ET01JdGVtc1tpXS5jbGFzc0xpc3QuYWRkKCdlcnJvcicpO1xuXHRcdH07XG5cdFx0aWYoaW1nLmNvbXBsZXRlKSBsb2FkZWQoKTtcblx0fSxcblx0bG9hZEltYWdlcyhpKXtcblx0XHRpZih0aGlzLmltYWdlQ2FjaGUubGVuZ3RoID09PSB0aGlzLml0ZW1zKSByZXR1cm47XG5cblx0XHRsZXQgaW5kZXhlcyA9IFtpXTtcblxuXHRcdGlmKHRoaXMuaXRlbXMubGVuZ3RoID4gMSkgaW5kZXhlcy5wdXNoKGkgPT09IDAgPyB0aGlzLml0ZW1zLmxlbmd0aCAtIDEgOiBpIC0gMSk7XG5cdFx0aWYodGhpcy5pdGVtcy5sZW5ndGggPiAyKSBpbmRleGVzLnB1c2goaSA9PT0gdGhpcy5pdGVtcy5sZW5ndGggLSAxID8gMCA6IGkgKyAxKTtcblxuXHRcdGluZGV4ZXMuZm9yRWFjaChpZHggPT4ge1xuXHRcdFx0aWYodGhpcy5pbWFnZUNhY2hlW2lkeF0gPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHR0aGlzLkRPTUl0ZW1zW2lkeF0uY2xhc3NMaXN0LmFkZCgnbG9hZGluZycpO1xuXHRcdFx0XHR0aGlzLmxvYWRJbWFnZShpZHgpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdH0sXG5cdGdldEZvY3VzYWJsZUNoaWxkcmVuKCkge1xuXHRcdGxldCBmb2N1c2FibGVFbGVtZW50cyA9IFsnYVtocmVmXScsICdhcmVhW2hyZWZdJywgJ2lucHV0Om5vdChbZGlzYWJsZWRdKScsICdzZWxlY3Q6bm90KFtkaXNhYmxlZF0pJywgJ3RleHRhcmVhOm5vdChbZGlzYWJsZWRdKScsICdidXR0b246bm90KFtkaXNhYmxlZF0pJywgJ2lmcmFtZScsICdvYmplY3QnLCAnZW1iZWQnLCAnW2NvbnRlbnRlZGl0YWJsZV0nLCAnW3RhYmluZGV4XTpub3QoW3RhYmluZGV4PVwiLTFcIl0pJ107XG5cblx0XHRyZXR1cm4gW10uc2xpY2UuY2FsbCh0aGlzLkRPTU92ZXJsYXkucXVlcnlTZWxlY3RvckFsbChmb2N1c2FibGVFbGVtZW50cy5qb2luKCcsJykpKTtcblx0fSxcblx0dHJhcFRhYihlKXtcblx0XHRsZXQgZm9jdXNlZEluZGV4ID0gdGhpcy5mb2N1c2FibGVDaGlsZHJlbi5pbmRleE9mKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpO1xuXHRcdGlmKGUuc2hpZnRLZXkgJiYgZm9jdXNlZEluZGV4ID09PSAwKSB7XG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHR0aGlzLmZvY3VzYWJsZUNoaWxkcmVuW3RoaXMuZm9jdXNhYmxlQ2hpbGRyZW4ubGVuZ3RoIC0gMV0uZm9jdXMoKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0aWYoIWUuc2hpZnRLZXkgJiYgZm9jdXNlZEluZGV4ID09PSB0aGlzLmZvY3VzYWJsZUNoaWxkcmVuLmxlbmd0aCAtIDEpIHtcblx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHR0aGlzLmZvY3VzYWJsZUNoaWxkcmVuWzBdLmZvY3VzKCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9LFxuXHRrZXlMaXN0ZW5lcihlKXtcblx0XHRpZighdGhpcy5pc09wZW4pIHJldHVybjtcblxuXHRcdHN3aXRjaCAoZS5rZXlDb2RlKSB7XG5cdFx0Y2FzZSBLRVlfQ09ERVMuRVNDOlxuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0dGhpcy50b2dnbGUoKTtcblx0XHRcdGJyZWFrO1xuXHRcdGNhc2UgS0VZX0NPREVTLlRBQjpcblx0XHRcdHRoaXMudHJhcFRhYihlKTtcblx0XHRcdGJyZWFrO1xuXHRcdGNhc2UgS0VZX0NPREVTLkxFRlQ6XG5cdFx0XHR0aGlzLnByZXZpb3VzKCk7XG5cdFx0XHRicmVhaztcblx0XHRjYXNlIEtFWV9DT0RFUy5SSUdIVDpcblx0XHRcdHRoaXMubmV4dCgpO1xuXHRcdFx0YnJlYWs7XG5cdFx0ZGVmYXVsdDpcblx0XHRcdGJyZWFrO1xuXHRcdH1cblx0fSxcblx0cHJldmlvdXMoKXtcblx0XHR0aGlzLmN1cnJlbnQgJiYgdGhpcy5ET01JdGVtc1t0aGlzLmN1cnJlbnRdLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHRcdHRoaXMuY3VycmVudCA9ICh0aGlzLmN1cnJlbnQgPT09IDAgPyB0aGlzLkRPTUl0ZW1zLmxlbmd0aCAtIDEgOiB0aGlzLmN1cnJlbnQgLSAxKTtcblx0XHR0aGlzLkRPTUl0ZW1zW3RoaXMuY3VycmVudF0uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG5cdFx0dGhpcy5sb2FkSW1hZ2VzKHRoaXMuY3VycmVudCk7XG5cdFx0KHRoaXMudG90YWwgPiAxICYmIHRoaXMuc2V0dGluZ3MudG90YWxzKSAmJiB0aGlzLndyaXRlVG90YWxzKCk7XG5cdH0sXG5cdG5leHQoKXtcblx0XHR0aGlzLmN1cnJlbnQgJiYgdGhpcy5ET01JdGVtc1t0aGlzLmN1cnJlbnRdLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHRcdHRoaXMuY3VycmVudCA9ICh0aGlzLmN1cnJlbnQgPT09IHRoaXMuRE9NSXRlbXMubGVuZ3RoIC0gMSA/IDAgOiB0aGlzLmN1cnJlbnQgKyAxKTtcblx0XHR0aGlzLkRPTUl0ZW1zW3RoaXMuY3VycmVudF0uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG5cdFx0dGhpcy5sb2FkSW1hZ2VzKHRoaXMuY3VycmVudCk7XG5cdFx0KHRoaXMudG90YWwgPiAxICYmIHRoaXMuc2V0dGluZ3MudG90YWxzKSAmJiB0aGlzLndyaXRlVG90YWxzKCk7XG5cdH0sXG5cdG9wZW4oaSl7XG5cdFx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRoaXMua2V5TGlzdGVuZXIuYmluZCh0aGlzKSk7XG5cdFx0dGhpcy5sb2FkSW1hZ2VzKGkpO1xuXHRcdHRoaXMubGFzdEZvY3VzZWQgPSAgZG9jdW1lbnQuYWN0aXZlRWxlbWVudDtcblx0XHR0aGlzLmZvY3VzYWJsZUNoaWxkcmVuLmxlbmd0aCAmJiB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpe3RoaXMuZm9jdXNhYmxlQ2hpbGRyZW5bMF0uZm9jdXMoKTt9LmJpbmQodGhpcyksIDApO1xuXHRcdHRoaXMuRE9NSXRlbXNbaSB8fCAwXS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcblx0XHR0aGlzLnRvZ2dsZShpIHx8IDApO1xuXHR9LFxuXHRjbG9zZSgpe1xuXHRcdGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLmtleUxpc3RlbmVyLmJpbmQodGhpcykpO1xuXHRcdHRoaXMubGFzdEZvY3VzZWQgJiYgdGhpcy5sYXN0Rm9jdXNlZC5mb2N1cygpO1xuXHRcdHRoaXMuRE9NSXRlbXNbdGhpcy5jdXJyZW50XS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcblx0XHR0aGlzLnRvZ2dsZShudWxsKTtcblx0fSxcblx0dG9nZ2xlKGkpe1xuXHRcdHRoaXMuaXNPcGVuID0gIXRoaXMuaXNPcGVuO1xuXHRcdHRoaXMuY3VycmVudCA9IGk7XG5cdFx0dGhpcy5ET01PdmVybGF5LmNsYXNzTGlzdC50b2dnbGUoJ2FjdGl2ZScpO1xuXHRcdHRoaXMuRE9NT3ZlcmxheS5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgIXRoaXMuaXNPcGVuKTtcblx0XHR0aGlzLkRPTU92ZXJsYXkuc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsIHRoaXMuaXNPcGVuID8gJzAnIDogJy0xJyk7XG5cdFx0dGhpcy5zZXR0aW5ncy5mdWxsc2NyZWVuICYmIHRoaXMudG9nZ2xlRnVsbFNjcmVlbigpO1xuXHRcdCh0aGlzLnRvdGFsID4gMSAmJiB0aGlzLnNldHRpbmdzLnRvdGFscykgJiYgdGhpcy53cml0ZVRvdGFscygpO1xuXHR9LFxuXHR0b2dnbGVGdWxsU2NyZWVuKCl7XG5cdFx0aWYodGhpcy5pc09wZW4pe1xuXHRcdFx0dGhpcy5ET01PdmVybGF5LnJlcXVlc3RGdWxsc2NyZWVuICYmIHRoaXMuRE9NT3ZlcmxheS5yZXF1ZXN0RnVsbHNjcmVlbigpO1xuXHRcdFx0dGhpcy5ET01PdmVybGF5LndlYmtpdFJlcXVlc3RGdWxsc2NyZWVuICYmIHRoaXMuRE9NT3ZlcmxheS53ZWJraXRSZXF1ZXN0RnVsbHNjcmVlbigpO1xuXHRcdFx0dGhpcy5ET01PdmVybGF5Lm1velJlcXVlc3RGdWxsU2NyZWVuICYmIHRoaXMuRE9NT3ZlcmxheS5tb3pSZXF1ZXN0RnVsbFNjcmVlbigpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRkb2N1bWVudC5leGl0RnVsbHNjcmVlbiAmJiBkb2N1bWVudC5leGl0RnVsbHNjcmVlbigpO1xuXHRcdFx0ZG9jdW1lbnQubW96Q2FuY2VsRnVsbFNjcmVlbiAmJiBkb2N1bWVudC5tb3pDYW5jZWxGdWxsU2NyZWVuKCk7XG5cdFx0XHRkb2N1bWVudC53ZWJraXRFeGl0RnVsbHNjcmVlbiAmJiBkb2N1bWVudC53ZWJraXRFeGl0RnVsbHNjcmVlbigpO1xuXHRcdH1cblx0fVxufTtcblxuY29uc3QgaW5pdCA9IChzcmMsIG9wdHMpID0+IHtcblx0aWYoIXNyYy5sZW5ndGgpIHRocm93IG5ldyBFcnJvcignTW9kYWwgR2FsbGVyeSBjYW5ub3QgYmUgaW5pdGlhbGlzZWQsIG5vIGltYWdlcyBmb3VuZCcpO1xuXG5cdGxldCBpdGVtcztcblxuXHRpZih0eXBlb2Ygc3JjID09PSAnc3RyaW5nJyl7XG5cdFx0bGV0IGVscyA9IFtdLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChzcmMpKTtcblxuXHRcdGlmKCFlbHMubGVuZ3RoKSB0aHJvdyBuZXcgRXJyb3IoJ01vZGFsIEdhbGxlcnkgY2Fubm90IGJlIGluaXRpYWxpc2VkLCBubyBpbWFnZXMgZm91bmQnKTtcblx0XHRcblx0XHRpdGVtcyA9IGVscy5tYXAoZWwgPT4ge1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0dHJpZ2dlcjogZWwsXG5cdFx0XHRcdHNyYzogZWwuZ2V0QXR0cmlidXRlKCdocmVmJyksXG5cdFx0XHRcdHNyY3NldDogZWwuZ2V0QXR0cmlidXRlKCdkYXRhLXNyY3NldCcpIHx8IG51bGwsXG5cdFx0XHRcdHNpemVzOiBlbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtc2l6ZXMnKSB8fCBudWxsLFxuXHRcdFx0XHR0aXRsZTogZWwuZ2V0QXR0cmlidXRlKCdkYXRhLXRpdGxlJykgfHwgJycsXG5cdFx0XHRcdGRlc2NyaXB0aW9uOiBlbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtZGVzY3JpcHRpb24nKSB8fCAnJ1xuXHRcdFx0fTtcblx0XHR9KTtcblx0fSBlbHNlIHtcblx0XHRpdGVtcyA9IHNyYztcblx0fVxuXHRcblx0cmV0dXJuIE9iamVjdC5hc3NpZ24oT2JqZWN0LmNyZWF0ZShTdG9ybU1vZGFsR2FsbGVyeSksIHtcblx0XHRpdGVtczogaXRlbXMsXG5cdFx0dG90YWw6IGl0ZW1zLmxlbmd0aCxcblx0XHRzZXR0aW5nczogT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdHMsIG9wdHMpXG5cdH0pLmluaXQoKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHsgaW5pdCB9OyJdfQ==
