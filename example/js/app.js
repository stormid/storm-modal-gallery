(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _stormModalGallery = require('./libs/storm-modal-gallery');

var _stormModalGallery2 = _interopRequireDefault(_stormModalGallery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var onDOMContentLoadedTasks = [function () {

	/*
 let gallery = ModalGallery.init([
 	{
 		src: 'http://placehold.it/500x500',
 		srcset:'http://placehold.it/800x800 800w, http://placehold.it/500x500 320w',
 		title: 'Image 1',
 		description: 'Description 1'
 	},
 	{
 		src: 'http://placehold.it/300x800',
 		srcset:'http://placehold.it/500x800 800w, http://placehold.it/300x500 320w',
 		title: 'Image 2',
 		description: 'Description 2'
 	}]);
 
 document.querySelector('.js-modal-gallery__trigger').addEventListener('click', gallery.open.bind(gallery, 0));
 */
	var gallery = _stormModalGallery2.default.init('.js-modal-gallery');
	document.querySelector('.js-modal-gallery__trigger').addEventListener('click', gallery.open.bind(gallery, 0));
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
 * @version 0.1.0: Tue, 20 Dec 2016 12:34:46 GMT
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJleGFtcGxlL3NyYy9hcHAuanMiLCJleGFtcGxlL3NyYy9saWJzL3N0b3JtLW1vZGFsLWdhbGxlcnkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBOzs7Ozs7QUFFQSxJQUFNLDBCQUEwQixDQUFDLFlBQU07O0FBRXRDOzs7Ozs7Ozs7Ozs7Ozs7OztBQWlCQSxLQUFJLFVBQVUsNEJBQWEsSUFBYixDQUFrQixtQkFBbEIsQ0FBZDtBQUNBLFVBQVMsYUFBVCxDQUF1Qiw0QkFBdkIsRUFBcUQsZ0JBQXJELENBQXNFLE9BQXRFLEVBQStFLFFBQVEsSUFBUixDQUFhLElBQWIsQ0FBa0IsT0FBbEIsRUFBMkIsQ0FBM0IsQ0FBL0U7QUFDQSxTQUFRLEdBQVIsQ0FBWSxPQUFaO0FBRUEsQ0F2QitCLENBQWhDOztBQXlCQSxJQUFHLHNCQUFzQixNQUF6QixFQUFpQyxPQUFPLGdCQUFQLENBQXdCLGtCQUF4QixFQUE0QyxZQUFNO0FBQUUseUJBQXdCLE9BQXhCLENBQWdDO0FBQUEsU0FBTSxJQUFOO0FBQUEsRUFBaEM7QUFBOEMsQ0FBbEc7Ozs7Ozs7O0FDM0JqQzs7Ozs7O0FBTUEsSUFBTSxXQUFXO0FBQ2YsWUFBVztBQUNWLDI1Q0FEVTtBQTBCViwyTUExQlU7QUE4QlY7QUE5QlUsRUFESTtBQW9DZixhQUFZLEtBcENHO0FBcUNmLFVBQVM7QUFyQ00sQ0FBakI7QUFBQSxJQXVDQyxZQUFZO0FBQ1gsTUFBSyxDQURNO0FBRVgsTUFBSyxFQUZNO0FBR1gsT0FBTSxFQUhLO0FBSVgsUUFBTyxFQUpJO0FBS1gsUUFBTztBQUxJLENBdkNiO0FBQUEsSUE4Q0MsaUJBQWlCLENBQUMsT0FBRCxFQUFVLFNBQVYsRUFBcUIsWUFBckIsQ0E5Q2xCOztBQWdEQSxJQUFNLG9CQUFvQjtBQUN6QixLQUR5QixrQkFDbEI7QUFBQTs7QUFDTixPQUFLLE1BQUwsR0FBYyxLQUFkO0FBQ0EsT0FB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QU8sS0FEK0M7QUFFdEQsWUFBVSxPQUFPLE1BQVAsQ0FBYyxFQUFkLEVBQWtCLFFBQWxCLEVBQTRCLElBQTVCO0FBRjRDLEVBQWhELEVBR0osSUFISSxFQUFQO0FBSUEsQ0E1QkQ7O2tCQThCZSxFQUFFLFVBQUYsRSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgTW9kYWxHYWxsZXJ5IGZyb20gJy4vbGlicy9zdG9ybS1tb2RhbC1nYWxsZXJ5JztcblxuY29uc3Qgb25ET01Db250ZW50TG9hZGVkVGFza3MgPSBbKCkgPT4ge1xuXHRcblx0Lypcblx0bGV0IGdhbGxlcnkgPSBNb2RhbEdhbGxlcnkuaW5pdChbXG5cdFx0e1xuXHRcdFx0c3JjOiAnaHR0cDovL3BsYWNlaG9sZC5pdC81MDB4NTAwJyxcblx0XHRcdHNyY3NldDonaHR0cDovL3BsYWNlaG9sZC5pdC84MDB4ODAwIDgwMHcsIGh0dHA6Ly9wbGFjZWhvbGQuaXQvNTAweDUwMCAzMjB3Jyxcblx0XHRcdHRpdGxlOiAnSW1hZ2UgMScsXG5cdFx0XHRkZXNjcmlwdGlvbjogJ0Rlc2NyaXB0aW9uIDEnXG5cdFx0fSxcblx0XHR7XG5cdFx0XHRzcmM6ICdodHRwOi8vcGxhY2Vob2xkLml0LzMwMHg4MDAnLFxuXHRcdFx0c3Jjc2V0OidodHRwOi8vcGxhY2Vob2xkLml0LzUwMHg4MDAgODAwdywgaHR0cDovL3BsYWNlaG9sZC5pdC8zMDB4NTAwIDMyMHcnLFxuXHRcdFx0dGl0bGU6ICdJbWFnZSAyJyxcblx0XHRcdGRlc2NyaXB0aW9uOiAnRGVzY3JpcHRpb24gMidcblx0XHR9XSk7XG5cdFxuXHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuanMtbW9kYWwtZ2FsbGVyeV9fdHJpZ2dlcicpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZ2FsbGVyeS5vcGVuLmJpbmQoZ2FsbGVyeSwgMCkpO1xuXHQqL1xuXHRsZXQgZ2FsbGVyeSA9IE1vZGFsR2FsbGVyeS5pbml0KCcuanMtbW9kYWwtZ2FsbGVyeScpO1xuXHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuanMtbW9kYWwtZ2FsbGVyeV9fdHJpZ2dlcicpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZ2FsbGVyeS5vcGVuLmJpbmQoZ2FsbGVyeSwgMCkpO1xuXHRjb25zb2xlLmxvZyhnYWxsZXJ5KTtcblxufV07XG4gICAgXG5pZignYWRkRXZlbnRMaXN0ZW5lcicgaW4gd2luZG93KSB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsICgpID0+IHsgb25ET01Db250ZW50TG9hZGVkVGFza3MuZm9yRWFjaChmbiA9PiBmbigpKTsgfSk7XG4iLCIvKipcbiAqIEBuYW1lIHN0b3JtLW1vZGFsLWdhbGxlcnk6IE1vZGFsIGdhbGxlcnkvbGlnaHRib3hcbiAqIEB2ZXJzaW9uIDAuMS4wOiBUdWUsIDIwIERlYyAyMDE2IDEyOjM0OjQ2IEdNVFxuICogQGF1dGhvciBtamJwXG4gKiBAbGljZW5zZSBNSVRcbiAqL1xuY29uc3QgZGVmYXVsdHMgPSB7XG5cdFx0dGVtcGxhdGVzOiB7XG5cdFx0XHRvdmVybGF5OiBgPGRpdiBjbGFzcz1cIm1vZGFsLWdhbGxlcnlfX291dGVyIGpzLW1vZGFsLWdhbGxlcnlfX291dGVyXCIgcm9sZT1cImRpYWxvZ1wiIHRhYmluZGV4PVwiLTFcIiBhcmlhLWhpZGRlbj1cInRydWVcIj5cblx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJtb2RhbC1nYWxsZXJ5X19pbm5lciBqcy1tb2RhbC1nYWxsZXJ5X19pbm5lclwiPlxuXHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwibW9kYWwtZ2FsbGVyeV9fY29udGVudCBqcy1tb2RhbC1nYWxsZXJ5X19jb250ZW50XCI+XG5cdFx0XHRcdFx0XHRcdFx0e3tpdGVtc319XG5cdFx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHQ8YnV0dG9uIGNsYXNzPVwianMtbW9kYWwtZ2FsbGVyeV9fbmV4dCBtb2RhbC1nYWxsZXJ5X19uZXh0XCI+XG5cdFx0XHRcdFx0XHRcdDxzdmcgcm9sZT1cImJ1dHRvblwiIHJvbGU9XCJidXR0b25cIiB3aWR0aD1cIjQ0XCIgaGVpZ2h0PVwiNjBcIj5cblx0XHRcdFx0XHRcdFx0XHQ8cG9seWxpbmUgcG9pbnRzPVwiMTQgMTAgMzQgMzAgMTQgNTBcIiBzdHJva2U9XCJyZ2IoMjU1LDI1NSwyNTUpXCIgc3Ryb2tlLXdpZHRoPVwiNFwiIHN0cm9rZS1saW5lY2FwPVwiYnV0dFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIi8+XG5cdFx0XHRcdFx0XHRcdDwvc3ZnPlxuXHRcdFx0XHRcdFx0PC9idXR0b24+XG5cdFx0XHRcdFx0XHQ8YnV0dG9uIGNsYXNzPVwianMtbW9kYWwtZ2FsbGVyeV9fcHJldmlvdXMgbW9kYWwtZ2FsbGVyeV9fcHJldmlvdXNcIj5cblx0XHRcdFx0XHRcdFx0PHN2ZyByb2xlPVwiYnV0dG9uXCIgd2lkdGg9XCI0NFwiIGhlaWdodD1cIjYwXCI+XG5cdFx0XHRcdFx0XHRcdFx0PHBvbHlsaW5lIHBvaW50cz1cIjMwIDEwIDEwIDMwIDMwIDUwXCIgc3Ryb2tlPVwicmdiKDI1NSwyNTUsMjU1KVwiIHN0cm9rZS13aWR0aD1cIjRcIiBzdHJva2UtbGluZWNhcD1cImJ1dHRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCIvPlxuXHRcdFx0XHRcdFx0XHQ8L3N2Zz5cblx0XHRcdFx0XHRcdDwvYnV0dG9uPlxuXHRcdFx0XHRcdFx0PGJ1dHRvbiBjbGFzcz1cImpzLW1vZGFsLWdhbGxlcnlfX2Nsb3NlIG1vZGFsLWdhbGxlcnlfX2Nsb3NlXCI+XG5cdFx0XHRcdFx0XHRcdDxzdmcgcm9sZT1cImJ1dHRvblwiIHJvbGU9XCJidXR0b25cIiB3aWR0aD1cIjMwXCIgaGVpZ2h0PVwiMzBcIj5cblx0XHRcdFx0XHRcdFx0XHQ8ZyBzdHJva2U9XCJyZ2IoMjU1LDI1NSwyNTUpXCIgc3Ryb2tlLXdpZHRoPVwiNFwiPlxuXHRcdFx0XHRcdFx0XHRcdFx0PGxpbmUgeDE9XCI1XCIgeTE9XCI1XCIgeDI9XCIyNVwiIHkyPVwiMjVcIi8+XG5cdFx0XHRcdFx0XHRcdFx0XHQ8bGluZSB4MT1cIjVcIiB5MT1cIjI1XCIgeDI9XCIyNVwiIHkyPVwiNVwiLz5cblx0XHRcdFx0XHRcdFx0XHQ8L2c+XG5cdFx0XHRcdFx0XHRcdDwvc3ZnPlxuXHRcdFx0XHRcdFx0PC9idXR0b24+XG5cdFx0XHRcdFx0PC9kaXY+YCxcblx0XHRcdGl0ZW06IGA8ZGl2IGNsYXNzPVwibW9kYWwtZ2FsbGVyeV9faXRlbSBqcy1tb2RhbC1nYWxsZXJ5X19pdGVtXCI+XG5cdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwibW9kYWwtZ2FsbGVyeV9faW1nLWNvbnRhaW5lciBqcy1tb2RhbC1nYWxsZXJ5X19pbWctY29udGFpbmVyXCI+PC9kaXY+XG5cdFx0XHRcdFx0XHR7e2RldGFpbHN9fVxuXHRcdFx0XHRcdDwvZGl2PmAsXG5cdFx0XHRkZXRhaWxzOiBgPGRpdiBjbGFzcz1cIm1vZGFsLWdhbGxlcnlfX2RldGFpbHNcIj5cblx0XHRcdFx0XHRcdDxoMSBjbGFzcz1cIm1vZGFsLWdhbGxlcnlfX3RpdGxlXCI+e3t0aXRsZX19PC9oMT5cblx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJtb2RhbC1nYWxsZXJ5X19kZXNjcmlwdGlvblwiPnt7ZGVzY3JpcHRpb259fTwvZGl2PlxuXHRcdFx0XHRcdDwvZGl2PmBcblx0XHR9LFxuXHRcdGZ1bGxzY3JlZW46IGZhbHNlLFxuXHRcdHByZWxvYWQ6IGZhbHNlXG5cdH0sXG5cdEtFWV9DT0RFUyA9IHtcblx0XHRUQUI6IDksXG5cdFx0RVNDOiAyNyxcblx0XHRMRUZUOiAzNyxcblx0XHRSSUdIVDogMzksXG5cdFx0RU5URVI6IDEzXG5cdH0sXG5cdFRSSUdHRVJfRVZFTlRTID0gWydjbGljaycsICdrZXlkb3duJywgJ3RvdWNoc3RhcnQnXTtcblxuY29uc3QgU3Rvcm1Nb2RhbEdhbGxlcnkgPSB7XG5cdGluaXQoKSB7XG5cdFx0dGhpcy5pc09wZW4gPSBmYWxzZTtcblx0XHR0aGlzLmN1cnJlbnQgPSBudWxsO1xuXHRcdHRoaXMuaW5pdFVJKCk7XG5cdFx0dGhpcy5pbWFnZUNhY2hlID0gW107XG5cdFx0dGhpcy5mb2N1c2FibGVDaGlsZHJlbiA9IHRoaXMuZ2V0Rm9jdXNhYmxlQ2hpbGRyZW4oKTtcblx0XHR0aGlzLmluaXRCdXR0b25zKCk7XG5cdFx0dGhpcy5pdGVtc1swXS50cmlnZ2VyICYmIHRoaXMuaW5pdFRyaWdnZXJzKCk7XG5cdFx0dGhpcy5zZXR0aW5ncy5wcmVsb2FkICYmIHRoaXMuaXRlbXMuZm9yRWFjaCgoaXRlbSwgaSkgPT4ge1xuXHRcdFx0dGhpcy5sb2FkSW1hZ2UoaSk7XG5cdFx0fSk7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH0sXG5cdGluaXRUcmlnZ2Vycygpe1xuXHRcdHRoaXMuaXRlbXMuZm9yRWFjaCgoaXRlbSwgaSkgPT4ge1xuXHRcdFx0VFJJR0dFUl9FVkVOVFMuZm9yRWFjaChldiA9PiB7XG5cdFx0XHRcdGl0ZW0udHJpZ2dlci5hZGRFdmVudExpc3RlbmVyKGV2LCBlID0+IHtcblx0XHRcdFx0XHRpZihlLmtleUNvZGUgJiYgZS5rZXlDb2RlICE9PSBLRVlfQ09ERVMuRU5URVIpIHJldHVybjtcblx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0ZS5zdG9wUHJvcGFnYXRpb24oKTtcblx0XHRcdFx0XHR0aGlzLm9wZW4oaSk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cdFx0fSk7XG5cdH0sXG5cdGluaXRVSSgpe1xuXHRcdGxldCByZW5kZXJUZW1wbGF0ZSA9IChkYXRhLCB0ZW1wbGF0ZSkgPT4ge1xuXHRcdFx0XHRmb3IobGV0IGRhdHVtIGluIGRhdGEpe1xuXHRcdFx0XHRcdGlmKGRhdGEuaGFzT3duUHJvcGVydHkoZGF0dW0pKXtcblx0XHRcdFx0XHRcdHRlbXBsYXRlID0gdGVtcGxhdGUuc3BsaXQoYHt7JHtkYXR1bX19fWApLmpvaW4oZGF0YVtkYXR1bV0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gdGVtcGxhdGU7XG5cdFx0XHR9LFxuXHRcdFx0ZGV0YWlsc1N0cmluZ0FycmF5ID0gdGhpcy5pdGVtcy5tYXAoZnVuY3Rpb24oaW1nKSB7XG5cdFx0XHRcdHJldHVybiByZW5kZXJUZW1wbGF0ZShpbWcsIHRoaXMuc2V0dGluZ3MudGVtcGxhdGVzLmRldGFpbHMpO1xuXHRcdFx0fS5iaW5kKHRoaXMpKSxcblx0XHRcdGl0ZW1zU3RyaW5nID0gZGV0YWlsc1N0cmluZ0FycmF5Lm1hcChmdW5jdGlvbihpdGVtKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLnNldHRpbmdzLnRlbXBsYXRlcy5pdGVtLnNwbGl0KCd7e2RldGFpbHN9fScpLmpvaW4oaXRlbSk7XG5cdFx0XHR9LmJpbmQodGhpcykpO1xuXG5cdFx0ZG9jdW1lbnQuYm9keS5pbnNlcnRBZGphY2VudEhUTUwoJ2JlZm9yZWVuZCcsIHRoaXMuc2V0dGluZ3MudGVtcGxhdGVzLm92ZXJsYXkuc3BsaXQoJ3t7aXRlbXN9fScpLmpvaW4oaXRlbXNTdHJpbmcuam9pbignJykpKTtcblx0XHR0aGlzLkRPTU92ZXJsYXkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuanMtbW9kYWwtZ2FsbGVyeV9fb3V0ZXInKTtcblx0XHR0aGlzLkRPTUl0ZW1zID0gW10uc2xpY2UuY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuanMtbW9kYWwtZ2FsbGVyeV9faXRlbScpKTtcblx0XHRyZXR1cm4gdGhpcztcblx0fSxcblx0aW5pdEJ1dHRvbnMoKXtcblx0XHR0aGlzLnByZXZpb3VzQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmpzLW1vZGFsLWdhbGxlcnlfX3ByZXZpb3VzJyk7XG5cdFx0dGhpcy5uZXh0QnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmpzLW1vZGFsLWdhbGxlcnlfX25leHQnKTtcblx0XHR0aGlzLmNsb3NlQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmpzLW1vZGFsLWdhbGxlcnlfX2Nsb3NlJyk7XG5cblx0XHR0aGlzLnByZXZpb3VzQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG5cdFx0XHR0aGlzLnByZXZpb3VzKCk7XG5cdFx0fS5iaW5kKHRoaXMpKTtcblx0XHR0aGlzLm5leHRCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpIHtcblx0XHRcdHRoaXMubmV4dCgpO1xuXHRcdH0uYmluZCh0aGlzKSk7XG5cdFx0dGhpcy5jbG9zZUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuXHRcdFx0dGhpcy5jbG9zZSgpO1xuXHRcdH0uYmluZCh0aGlzKSk7XG5cdH0sXG5cdGxvYWRJbWFnZShpKSB7XG5cdFx0dmFyIGltZyA9IG5ldyBJbWFnZSgpLFxuXHRcdFx0aW1hZ2VDb250YWluZXIgPSB0aGlzLkRPTUl0ZW1zW2ldLnF1ZXJ5U2VsZWN0b3IoJy5qcy1tb2RhbC1nYWxsZXJ5X19pbWctY29udGFpbmVyJyksXG5cdFx0XHRsb2FkZWQgPSAoKSA9PiB7XG5cdFx0XHRcdGxldCBzcmNzZXRBdHRyaWJ1dGUgPSB0aGlzLml0ZW1zW2ldLnNyY3NldCA/IGAgc3Jjc2V0PVwiJHt0aGlzLml0ZW1zW2ldLnNyY3NldH1cImAgOiAnJyxcblx0XHRcdFx0XHRzaXplc0F0dHJpYnV0ZSA9IHRoaXMuaXRlbXNbaV0uc2l6ZXMgPyBgIHNpemVzPVwiJHt0aGlzLml0ZW1zW2ldLnNpemVzfVwiYCA6ICcnO1xuXHRcdFx0XHRpbWFnZUNvbnRhaW5lci5pbm5lckhUTUwgPSBgPGltZyBjbGFzcz1cIm1vZGFsLWdhbGxlcnlfX2ltZ1wiIHNyYz1cIiR7dGhpcy5pdGVtc1tpXS5zcmN9XCIgYWx0PVwiJHt0aGlzLml0ZW1zW2ldLnRpdGxlfVwiJHtzcmNzZXRBdHRyaWJ1dGV9JHtzaXplc0F0dHJpYnV0ZX0+YDtcblx0XHRcdFx0dGhpcy5ET01JdGVtc1tpXS5jbGFzc0xpc3QucmVtb3ZlKCdsb2FkaW5nJyk7XG5cdFx0XHRcdGltZy5vbmxvYWQgPSBudWxsO1xuXHRcdFx0fTtcblx0XHRpbWcub25sb2FkID0gbG9hZGVkO1xuXHRcdGltZy5zcmMgPSB0aGlzLml0ZW1zW2ldLnNyYztcblx0XHRpbWcub25lcnJvciA9ICgpID0+IHtcblx0XHRcdHRoaXMuRE9NSXRlbXNbaV0uY2xhc3NMaXN0LnJlbW92ZSgnbG9hZGluZycpO1xuXHRcdFx0dGhpcy5ET01JdGVtc1tpXS5jbGFzc0xpc3QuYWRkKCdlcnJvcicpO1xuXHRcdH07XG5cdFx0aWYoaW1nLmNvbXBsZXRlKSBsb2FkZWQoKTtcblx0fSxcblx0bG9hZEltYWdlcyhpKXtcblx0XHRpZih0aGlzLmltYWdlQ2FjaGUubGVuZ3RoID09PSB0aGlzLml0ZW1zKSByZXR1cm47XG5cblx0XHRsZXQgaW5kZXhlcyA9IFtpXTtcblxuXHRcdGlmKHRoaXMuaXRlbXMubGVuZ3RoID4gMSkgaW5kZXhlcy5wdXNoKGkgPT09IDAgPyB0aGlzLml0ZW1zLmxlbmd0aCAtIDEgOiBpIC0gMSk7XG5cdFx0aWYodGhpcy5pdGVtcy5sZW5ndGggPiAyKSBpbmRleGVzLnB1c2goaSA9PT0gdGhpcy5pdGVtcy5sZW5ndGggLSAxID8gMCA6IGkgKyAxKTtcblxuXHRcdGluZGV4ZXMuZm9yRWFjaChpZHggPT4ge1xuXHRcdFx0aWYodGhpcy5pbWFnZUNhY2hlW2lkeF0gPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHR0aGlzLkRPTUl0ZW1zW2lkeF0uY2xhc3NMaXN0LmFkZCgnbG9hZGluZycpO1xuXHRcdFx0XHR0aGlzLmxvYWRJbWFnZShpZHgpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdH0sXG5cdGdldEZvY3VzYWJsZUNoaWxkcmVuKCkge1xuXHRcdGxldCBmb2N1c2FibGVFbGVtZW50cyA9IFsnYVtocmVmXScsICdhcmVhW2hyZWZdJywgJ2lucHV0Om5vdChbZGlzYWJsZWRdKScsICdzZWxlY3Q6bm90KFtkaXNhYmxlZF0pJywgJ3RleHRhcmVhOm5vdChbZGlzYWJsZWRdKScsICdidXR0b246bm90KFtkaXNhYmxlZF0pJywgJ2lmcmFtZScsICdvYmplY3QnLCAnZW1iZWQnLCAnW2NvbnRlbnRlZGl0YWJsZV0nLCAnW3RhYmluZGV4XTpub3QoW3RhYmluZGV4PVwiLTFcIl0pJ107XG5cblx0XHRyZXR1cm4gW10uc2xpY2UuY2FsbCh0aGlzLkRPTU92ZXJsYXkucXVlcnlTZWxlY3RvckFsbChmb2N1c2FibGVFbGVtZW50cy5qb2luKCcsJykpKTtcblx0fSxcblx0dHJhcFRhYihlKXtcblx0XHRsZXQgZm9jdXNlZEluZGV4ID0gdGhpcy5mb2N1c2FibGVDaGlsZHJlbi5pbmRleE9mKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpO1xuXHRcdGlmKGUuc2hpZnRLZXkgJiYgZm9jdXNlZEluZGV4ID09PSAwKSB7XG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHR0aGlzLmZvY3VzYWJsZUNoaWxkcmVuW3RoaXMuZm9jdXNhYmxlQ2hpbGRyZW4ubGVuZ3RoIC0gMV0uZm9jdXMoKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0aWYoIWUuc2hpZnRLZXkgJiYgZm9jdXNlZEluZGV4ID09PSB0aGlzLmZvY3VzYWJsZUNoaWxkcmVuLmxlbmd0aCAtIDEpIHtcblx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHR0aGlzLmZvY3VzYWJsZUNoaWxkcmVuWzBdLmZvY3VzKCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9LFxuXHRrZXlMaXN0ZW5lcihlKXtcblx0XHRpZighdGhpcy5vcGVuKSByZXR1cm47XG5cblx0XHRzd2l0Y2ggKGUua2V5Q29kZSkge1xuXHRcdGNhc2UgS0VZX0NPREVTLkVTQzpcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdHRoaXMudG9nZ2xlKCk7XG5cdFx0XHRicmVhaztcblx0XHRjYXNlIEtFWV9DT0RFUy5UQUI6XG5cdFx0XHR0aGlzLnRyYXBUYWIoZSk7XG5cdFx0XHRicmVhaztcblx0XHRjYXNlIEtFWV9DT0RFUy5MRUZUOlxuXHRcdFx0dGhpcy5wcmV2aW91cygpO1xuXHRcdFx0YnJlYWs7XG5cdFx0Y2FzZSBLRVlfQ09ERVMuUklHSFQ6XG5cdFx0XHR0aGlzLm5leHQoKTtcblx0XHRcdGJyZWFrO1xuXHRcdGRlZmF1bHQ6XG5cdFx0XHRicmVhaztcblx0XHR9XG5cdH0sXG5cdHByZXZpb3VzKCl7XG5cdFx0dGhpcy5ET01JdGVtc1t0aGlzLmN1cnJlbnRdLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHRcdHRoaXMuY3VycmVudCA9ICh0aGlzLmN1cnJlbnQgPT09IDAgPyB0aGlzLkRPTUl0ZW1zLmxlbmd0aCAtIDEgOiB0aGlzLmN1cnJlbnQgLSAxKTtcblx0XHR0aGlzLkRPTUl0ZW1zW3RoaXMuY3VycmVudF0uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG5cdFx0dGhpcy5sb2FkSW1hZ2VzKHRoaXMuY3VycmVudCk7XG5cdH0sXG5cdG5leHQoKXtcblx0XHR0aGlzLkRPTUl0ZW1zW3RoaXMuY3VycmVudF0uY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdFx0dGhpcy5jdXJyZW50ID0gKHRoaXMuY3VycmVudCA9PT0gdGhpcy5ET01JdGVtcy5sZW5ndGggLSAxID8gMCA6IHRoaXMuY3VycmVudCArIDEpO1xuXHRcdHRoaXMuRE9NSXRlbXNbdGhpcy5jdXJyZW50XS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcblx0XHR0aGlzLmxvYWRJbWFnZXModGhpcy5jdXJyZW50KTtcblx0fSxcblx0b3BlbihpKXtcblx0XHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdGhpcy5rZXlMaXN0ZW5lci5iaW5kKHRoaXMpKTtcblx0XHR0aGlzLmxvYWRJbWFnZXMoaSk7XG5cdFx0dGhpcy5sYXN0Rm9jdXNlZCA9ICBkb2N1bWVudC5hY3RpdmVFbGVtZW50O1xuXHRcdHRoaXMuZm9jdXNhYmxlQ2hpbGRyZW4ubGVuZ3RoICYmIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCl7dGhpcy5mb2N1c2FibGVDaGlsZHJlblswXS5mb2N1cygpO30uYmluZCh0aGlzKSwgMCk7XG5cdFx0dGhpcy5ET01JdGVtc1tpIHx8IDBdLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXHRcdHRoaXMudG9nZ2xlKGkgfHwgMCk7XG5cdH0sXG5cdGNsb3NlKCl7XG5cdFx0ZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRoaXMua2V5TGlzdGVuZXIuYmluZCh0aGlzKSk7XG5cdFx0dGhpcy5sYXN0Rm9jdXNlZC5mb2N1cygpO1xuXHRcdHRoaXMuRE9NSXRlbXNbdGhpcy5jdXJyZW50XS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcblx0XHR0aGlzLnRvZ2dsZShudWxsKTtcblx0fSxcblx0dG9nZ2xlKGkpe1xuXHRcdHRoaXMuaXNPcGVuID0gIXRoaXMuaXNPcGVuO1xuXHRcdHRoaXMuY3VycmVudCA9IGk7XG5cdFx0dGhpcy5ET01PdmVybGF5LmNsYXNzTGlzdC50b2dnbGUoJ2FjdGl2ZScpO1xuXHRcdHRoaXMuRE9NT3ZlcmxheS5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgIXRoaXMuaXNPcGVuKTtcblx0XHR0aGlzLkRPTU92ZXJsYXkuc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsIHRoaXMuaXNPcGVuID8gJzAnIDogJy0xJyk7XG5cdFx0dGhpcy5zZXR0aW5ncy5mdWxsc2NyZWVuICYmIHRoaXMudG9nZ2xlRnVsbFNjcmVlbigpO1xuXHR9LFxuXHR0b2dnbGVGdWxsU2NyZWVuKCl7XG5cdFx0aWYodGhpcy5pc09wZW4pe1xuXHRcdFx0dGhpcy5ET01PdmVybGF5LnJlcXVlc3RGdWxsc2NyZWVuICYmIHRoaXMuRE9NT3ZlcmxheS5yZXF1ZXN0RnVsbHNjcmVlbigpO1xuXHRcdFx0dGhpcy5ET01PdmVybGF5LndlYmtpdFJlcXVlc3RGdWxsc2NyZWVuICYmIHRoaXMuRE9NT3ZlcmxheS53ZWJraXRSZXF1ZXN0RnVsbHNjcmVlbigpO1xuXHRcdFx0dGhpcy5ET01PdmVybGF5Lm1velJlcXVlc3RGdWxsU2NyZWVuICYmIHRoaXMuRE9NT3ZlcmxheS5tb3pSZXF1ZXN0RnVsbFNjcmVlbigpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRkb2N1bWVudC5leGl0RnVsbHNjcmVlbiAmJiBkb2N1bWVudC5leGl0RnVsbHNjcmVlbigpO1xuXHRcdFx0ZG9jdW1lbnQubW96Q2FuY2VsRnVsbFNjcmVlbiAmJiBkb2N1bWVudC5tb3pDYW5jZWxGdWxsU2NyZWVuKCk7XG5cdFx0XHRkb2N1bWVudC53ZWJraXRFeGl0RnVsbHNjcmVlbiAmJiBkb2N1bWVudC53ZWJraXRFeGl0RnVsbHNjcmVlbigpO1xuXHRcdH1cblx0fVxufTtcblxuY29uc3QgaW5pdCA9IChzcmMsIG9wdHMpID0+IHtcblx0aWYoIXNyYy5sZW5ndGgpIHRocm93IG5ldyBFcnJvcignTW9kYWwgR2FsbGVyeSBjYW5ub3QgYmUgaW5pdGlhbGlzZWQsIG5vIGltYWdlcyBmb3VuZCcpO1xuXG5cdGxldCBpdGVtcztcblxuXHRpZih0eXBlb2Ygc3JjID09PSAnc3RyaW5nJyl7XG5cdFx0bGV0IGVscyA9IFtdLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChzcmMpKTtcblxuXHRcdGlmKCFlbHMubGVuZ3RoKSB0aHJvdyBuZXcgRXJyb3IoJ01vZGFsIEdhbGxlcnkgY2Fubm90IGJlIGluaXRpYWxpc2VkLCBubyBpbWFnZXMgZm91bmQnKTtcblx0XHRcblx0XHRpdGVtcyA9IGVscy5tYXAoZWwgPT4ge1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0dHJpZ2dlcjogZWwsXG5cdFx0XHRcdHNyYzogZWwuZ2V0QXR0cmlidXRlKCdocmVmJyksXG5cdFx0XHRcdHNyY3NldDogZWwuZ2V0QXR0cmlidXRlKCdkYXRhLXNyY3NldCcpIHx8IG51bGwsXG5cdFx0XHRcdHNpemVzOiBlbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtc2l6ZXMnKSB8fCBudWxsLFxuXHRcdFx0XHR0aXRsZTogZWwuZ2V0QXR0cmlidXRlKCdkYXRhLXRpdGxlJykgfHwgbnVsbCxcblx0XHRcdFx0ZGVzY3JpcHRpb246IGVsLmdldEF0dHJpYnV0ZSgnZGF0YS1kZXNjcmlwdGlvbicpIHx8IG51bGxcblx0XHRcdH07XG5cdFx0fSk7XG5cdH0gZWxzZSB7XG5cdFx0aXRlbXMgPSBzcmM7XG5cdH1cblx0XG5cdHJldHVybiBPYmplY3QuYXNzaWduKE9iamVjdC5jcmVhdGUoU3Rvcm1Nb2RhbEdhbGxlcnkpLCB7XG5cdFx0aXRlbXM6IGl0ZW1zLFxuXHRcdHNldHRpbmdzOiBPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0cywgb3B0cylcblx0fSkuaW5pdCgpO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgeyBpbml0IH07Il19
