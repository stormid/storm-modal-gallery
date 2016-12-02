(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _stormModalGallery = require('./libs/storm-modal-gallery');

var _stormModalGallery2 = _interopRequireDefault(_stormModalGallery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var onDOMContentLoadedTasks = [function () {
	var gallery = _stormModalGallery2.default.init([{
		src: 'https://unsplash.it/800/?random',
		title: 'Image 1',
		description: 'Description 1'
	}, {
		src: 'https://unsplash.it/800/?random',
		title: 'Image 2',
		description: 'Description 2'
	}]);

	document.querySelector('.js-modal-gallery__trigger').addEventListener('click', gallery.open.bind(gallery));
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
 * @version 0.1.0: Fri, 02 Dec 2016 18:03:41 GMT
 * @author mjbp
 * @license MIT
 */
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

exports.default = { init: init };

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJleGFtcGxlL3NyYy9hcHAuanMiLCJleGFtcGxlL3NyYy9saWJzL3N0b3JtLW1vZGFsLWdhbGxlcnkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBOzs7Ozs7QUFFQSxJQUFNLDBCQUEwQixDQUFDLFlBQU07QUFDdEMsS0FBSSxVQUFVLDRCQUFhLElBQWIsQ0FBa0IsQ0FDL0I7QUFDQyxPQUFLLGlDQUROO0FBRUMsU0FBTyxTQUZSO0FBR0MsZUFBYTtBQUhkLEVBRCtCLEVBTS9CO0FBQ0MsT0FBSyxpQ0FETjtBQUVDLFNBQU8sU0FGUjtBQUdDLGVBQWE7QUFIZCxFQU4rQixDQUFsQixDQUFkOztBQVlBLFVBQVMsYUFBVCxDQUF1Qiw0QkFBdkIsRUFBcUQsZ0JBQXJELENBQXNFLE9BQXRFLEVBQStFLFFBQVEsSUFBUixDQUFhLElBQWIsQ0FBa0IsT0FBbEIsQ0FBL0U7QUFDQSxDQWQrQixDQUFoQzs7QUFpQkEsSUFBRyxzQkFBc0IsTUFBekIsRUFBaUMsT0FBTyxnQkFBUCxDQUF3QixrQkFBeEIsRUFBNEMsWUFBTTtBQUFFLHlCQUF3QixPQUF4QixDQUFnQztBQUFBLFNBQU0sSUFBTjtBQUFBLEVBQWhDO0FBQThDLENBQWxHOzs7Ozs7OztBQ25CakM7Ozs7OztBQU1BLElBQU0sV0FBVztBQUNoQixZQUFXO0FBQ1YscTNDQURVO0FBMEJWLDRLQTFCVTtBQThCVjtBQTlCVSxFQURLO0FBb0NoQixhQUFZLEtBcENJO0FBcUNoQixRQUFPO0FBckNTLENBQWpCOztBQXdDQSxJQUFNLG9CQUFvQjtBQUN6QixLQUR5QixrQkFDbEI7QUFDTixPQUFLLE1BQUwsR0FBYyxLQUFkO0FBQ0EsT0FBSyxNQUFMO0FBQ0EsT0FBSyxVQUFMLEdBQWtCLEVBQWxCO0FBQ0EsT0FBSyxpQkFBTCxHQUF5QixLQUFLLG9CQUFMLEVBQXpCO0FBQ0EsT0FBSyxXQUFMO0FBQ0EsU0FBTyxJQUFQ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QUFLLEdBQUcsWUFBSCxDQUFnQixNQUFoQixDQURDO0FBRU4sV0FBTyxHQUFHLFlBQUgsQ0FBZ0IsWUFBaEIsS0FBaUMsSUFGbEM7QUFHTixpQkFBYSxHQUFHLFlBQUgsQ0FBZ0Isa0JBQWhCLEtBQXVDO0FBSDlDLElBQVA7QUFLQSxHQU5NLENBQVA7QUFPQSxFQVpELE1BWU87QUFDTixTQUFPLEdBQVA7QUFDQTs7QUFFRCxRQUFPLE9BQU8sTUFBUCxDQUFjLE9BQU8sTUFBUCxDQUFjLGlCQUFkLENBQWQsRUFBZ0Q7QUFDdEQsUUFBTSxJQURnRDtBQUV0RCxZQUFVLE9BQU8sTUFBUCxDQUFjLEVBQWQsRUFBa0IsUUFBbEIsRUFBNEIsSUFBNUI7QUFGNEMsRUFBaEQsRUFHSixJQUhJLEVBQVA7QUFJQSxDQXpCRDs7a0JBMkJlLEVBQUUsVUFBRixFIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCBNb2RhbEdhbGxlcnkgZnJvbSAnLi9saWJzL3N0b3JtLW1vZGFsLWdhbGxlcnknO1xuXG5jb25zdCBvbkRPTUNvbnRlbnRMb2FkZWRUYXNrcyA9IFsoKSA9PiB7XG5cdGxldCBnYWxsZXJ5ID0gTW9kYWxHYWxsZXJ5LmluaXQoW1xuXHRcdHtcblx0XHRcdHNyYzogJ2h0dHBzOi8vdW5zcGxhc2guaXQvODAwLz9yYW5kb20nLFxuXHRcdFx0dGl0bGU6ICdJbWFnZSAxJyxcblx0XHRcdGRlc2NyaXB0aW9uOiAnRGVzY3JpcHRpb24gMSdcblx0XHR9LFxuXHRcdHtcblx0XHRcdHNyYzogJ2h0dHBzOi8vdW5zcGxhc2guaXQvODAwLz9yYW5kb20nLFxuXHRcdFx0dGl0bGU6ICdJbWFnZSAyJyxcblx0XHRcdGRlc2NyaXB0aW9uOiAnRGVzY3JpcHRpb24gMidcblx0XHR9XSk7XG5cblx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmpzLW1vZGFsLWdhbGxlcnlfX3RyaWdnZXInKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGdhbGxlcnkub3Blbi5iaW5kKGdhbGxlcnkpKTtcbn1dO1xuXG4gICAgXG5pZignYWRkRXZlbnRMaXN0ZW5lcicgaW4gd2luZG93KSB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsICgpID0+IHsgb25ET01Db250ZW50TG9hZGVkVGFza3MuZm9yRWFjaChmbiA9PiBmbigpKTsgfSk7XG4iLCIvKipcbiAqIEBuYW1lIHN0b3JtLW1vZGFsLWdhbGxlcnk6IE1vZGFsIGdhbGxlcnkvbGlnaHRib3hcbiAqIEB2ZXJzaW9uIDAuMS4wOiBGcmksIDAyIERlYyAyMDE2IDE4OjAzOjQxIEdNVFxuICogQGF1dGhvciBtamJwXG4gKiBAbGljZW5zZSBNSVRcbiAqL1xuY29uc3QgZGVmYXVsdHMgPSB7XG5cdHRlbXBsYXRlczoge1xuXHRcdG92ZXJsYXk6IGA8ZGl2IGNsYXNzPVwibW9kYWwtZ2FsbGVyeV9fb3V0ZXIganMtbW9kYWwtZ2FsbGVyeV9fb3V0ZXJcIiByb2xlPVwiZGlhbG9nXCIgdGFiaW5kZXg9XCItMVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPlxuXHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJtb2RhbC1nYWxsZXJ5X19pbm5lciBqcy1tb2RhbC1nYWxsZXJ5X19pbm5lclwiPlxuXHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cIm1vZGFsLWdhbGxlcnlfX2NvbnRlbnQganMtbW9kYWwtZ2FsbGVyeV9fY29udGVudFwiPlxuXHRcdFx0XHRcdFx0XHR7e2l0ZW1zfX1cblx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdDxidXR0b24gY2xhc3M9XCJqcy1tb2RhbC1nYWxsZXJ5X19uZXh0IG1vZGFsLWdhbGxlcnlfX25leHRcIj5cblx0XHRcdFx0XHRcdDxzdmcgcm9sZT1cImJ1dHRvblwiIHJvbGU9XCJidXR0b25cIiB3aWR0aD1cIjQ0XCIgaGVpZ2h0PVwiNjBcIj5cblx0XHRcdFx0XHRcdFx0PHBvbHlsaW5lIHBvaW50cz1cIjE0IDEwIDM0IDMwIDE0IDUwXCIgc3Ryb2tlPVwicmdiYSgyNTUsMjU1LDI1NSwwLjUpXCIgc3Ryb2tlLXdpZHRoPVwiNFwiIHN0cm9rZS1saW5lY2FwPVwiYnV0dFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIi8+XG5cdFx0XHRcdFx0XHQ8L3N2Zz5cblx0XHRcdFx0XHQ8L2J1dHRvbj5cblx0XHRcdFx0XHQ8YnV0dG9uIGNsYXNzPVwianMtbW9kYWwtZ2FsbGVyeV9fcHJldmlvdXMgbW9kYWwtZ2FsbGVyeV9fcHJldmlvdXNcIj5cblx0XHRcdFx0XHRcdDxzdmcgcm9sZT1cImJ1dHRvblwiIHdpZHRoPVwiNDRcIiBoZWlnaHQ9XCI2MFwiPlxuXHRcdFx0XHRcdFx0XHQ8cG9seWxpbmUgcG9pbnRzPVwiMzAgMTAgMTAgMzAgMzAgNTBcIiBzdHJva2U9XCJyZ2JhKDI1NSwyNTUsMjU1LDAuNSlcIiBzdHJva2Utd2lkdGg9XCI0XCIgc3Ryb2tlLWxpbmVjYXA9XCJidXR0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiLz5cblx0XHRcdFx0XHRcdDwvc3ZnPlxuXHRcdFx0XHRcdDwvYnV0dG9uPlxuXHRcdFx0XHRcdDxidXR0b24gY2xhc3M9XCJqcy1tb2RhbC1nYWxsZXJ5X19jbG9zZSBtb2RhbC1nYWxsZXJ5X19jbG9zZVwiPlxuXHRcdFx0XHRcdFx0PHN2ZyByb2xlPVwiYnV0dG9uXCIgcm9sZT1cImJ1dHRvblwiIHdpZHRoPVwiMzBcIiBoZWlnaHQ9XCIzMFwiPlxuXHRcdFx0XHRcdFx0XHQ8ZyBzdHJva2U9XCJyZ2IoMTYwLDE2MCwxNjApXCIgc3Ryb2tlLXdpZHRoPVwiNFwiPlxuXHRcdFx0XHRcdFx0XHRcdDxsaW5lIHgxPVwiNVwiIHkxPVwiNVwiIHgyPVwiMjVcIiB5Mj1cIjI1XCIvPlxuXHRcdFx0XHRcdFx0XHRcdDxsaW5lIHgxPVwiNVwiIHkxPVwiMjVcIiB4Mj1cIjI1XCIgeTI9XCI1XCIvPlxuXHRcdFx0XHRcdFx0XHQ8L2c+XG5cdFx0XHRcdFx0XHQ8L3N2Zz5cblx0XHRcdFx0XHQ8L2J1dHRvbj5cblx0XHRcdFx0PC9kaXY+YCxcblx0XHRpdGVtOiBgPGRpdiBjbGFzcz1cIm1vZGFsLWdhbGxlcnlfX2l0ZW0ganMtbW9kYWwtZ2FsbGVyeV9faXRlbVwiPlxuXHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJtb2RhbC1nYWxsZXJ5X19pbWctY29udGFpbmVyXCI+e3tpbWd9fTwvZGl2PlxuXHRcdFx0XHRcdHt7ZGV0YWlsc319XG5cdFx0XHRcdDwvZGl2PmAsXG5cdFx0ZGV0YWlsczogYDxkaXYgY2xhc3M9XCJtb2RhbC1nYWxsZXJ5X19kZXRhaWxzXCI+XG5cdFx0XHRcdFx0PGgxIGNsYXNzPVwibW9kYWwtZ2FsbGVyeV9fdGl0bGVcIj57e3RpdGxlfX08L2gxPlxuXHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJtb2RhbC1nYWxsZXJ5X19kZXNjcmlwdGlvblwiPnt7ZGVzY3JpcHRpb259fTwvZGl2PlxuXHRcdFx0XHQ8L2Rpdj5gXG5cdH0sXG5cdGZ1bGxTY3JlZW46IGZhbHNlLFxuXHRhc3luYzogZmFsc2Vcbn07XG5cbmNvbnN0IFN0b3JtTW9kYWxHYWxsZXJ5ID0ge1xuXHRpbml0KCkge1xuXHRcdHRoaXMuaXNPcGVuID0gZmFsc2U7XG5cdFx0dGhpcy5pbml0VUkoKTtcblx0XHR0aGlzLmltYWdlQ2FjaGUgPSBbXTtcblx0XHR0aGlzLmZvY3VzYWJsZUNoaWxkcmVuID0gdGhpcy5nZXRGb2N1c2FibGVDaGlsZHJlbigpO1xuXHRcdHRoaXMuaW5pdEJ1dHRvbnMoKTtcblx0XHRyZXR1cm4gdGhpcztcblx0fSxcblx0aW5pdFVJKCl7XG5cdFx0bGV0IHJlbmRlclRlbXBsYXRlID0gKGRhdGEsIHRlbXBsYXRlKSA9PiB7XG5cdFx0XHRcdGZvcihsZXQgZGF0dW0gaW4gZGF0YSl7XG5cdFx0XHRcdFx0aWYoZGF0YS5oYXNPd25Qcm9wZXJ0eShkYXR1bSkpe1xuXHRcdFx0XHRcdFx0dGVtcGxhdGUgPSB0ZW1wbGF0ZS5zcGxpdChge3ske2RhdHVtfX19YCkuam9pbihkYXRhW2RhdHVtXSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiB0ZW1wbGF0ZTtcblx0XHRcdH0sXG5cdFx0XHRkZXRhaWxzU3RyaW5nQXJyYXkgPSB0aGlzLmltZ3MubWFwKGZ1bmN0aW9uKGltZykge1xuXHRcdFx0XHRyZXR1cm4gcmVuZGVyVGVtcGxhdGUoaW1nLCB0aGlzLnNldHRpbmdzLnRlbXBsYXRlcy5kZXRhaWxzKTtcblx0XHRcdH0uYmluZCh0aGlzKSksXG5cdFx0XHRpdGVtc1N0cmluZyA9IGRldGFpbHNTdHJpbmdBcnJheS5tYXAoZnVuY3Rpb24oaXRlbSkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5zZXR0aW5ncy50ZW1wbGF0ZXMuaXRlbS5zcGxpdCgne3tkZXRhaWxzfX0nKS5qb2luKGl0ZW0pO1xuXHRcdFx0fS5iaW5kKHRoaXMpKTtcblxuXHRcdGRvY3VtZW50LmJvZHkuaW5zZXJ0QWRqYWNlbnRIVE1MKCdiZWZvcmVlbmQnLCB0aGlzLnNldHRpbmdzLnRlbXBsYXRlcy5vdmVybGF5LnNwbGl0KCd7e2l0ZW1zfX0nKS5qb2luKGl0ZW1zU3RyaW5nLmpvaW4oJycpKSk7XG5cdFx0dGhpcy5vdmVybGF5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmpzLW1vZGFsLWdhbGxlcnlfX291dGVyJyk7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH0sXG5cdGluaXRCdXR0b25zKCl7XG5cdFx0dGhpcy5wcmV2aW91c0J0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5qcy1tb2RhbC1nYWxsZXJ5X19wcmV2aW91cycpO1xuXHRcdHRoaXMubmV4dEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5qcy1tb2RhbC1nYWxsZXJ5X19uZXh0Jyk7XG5cdFx0dGhpcy5jbG9zZUJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5qcy1tb2RhbC1nYWxsZXJ5X19jbG9zZScpO1xuXG5cdFx0dGhpcy5wcmV2aW91c0J0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuXHRcdFx0dGhpcy5wcmV2aW91cygpO1xuXHRcdH0uYmluZCh0aGlzKSk7XG5cdFx0dGhpcy5uZXh0QnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG5cdFx0XHR0aGlzLm5leHQoKTtcblx0XHR9LmJpbmQodGhpcykpO1xuXHRcdHRoaXMuY2xvc2VCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpIHtcblx0XHRcdHRoaXMuY2xvc2UoKTtcblx0XHR9LmJpbmQodGhpcykpO1xuXG5cdH0sXG5cdHByZWxvYWRJbWFnZShzcmMpIHtcblx0XHRsZXQgaW1nID0gbmV3IEltYWdlKCk7XG5cdFx0aW1nLnNyYyA9IHNyYztcblx0XHR0aGlzLmltYWdlQ2FjaGUucHVzaChpbWcpO1xuXHR9LFxuXHRnZXRGb2N1c2FibGVDaGlsZHJlbigpIHtcblx0XHRsZXQgZm9jdXNhYmxlRWxlbWVudHMgPSBbJ2FbaHJlZl0nLCAnYXJlYVtocmVmXScsICdpbnB1dDpub3QoW2Rpc2FibGVkXSknLCAnc2VsZWN0Om5vdChbZGlzYWJsZWRdKScsICd0ZXh0YXJlYTpub3QoW2Rpc2FibGVkXSknLCAnYnV0dG9uOm5vdChbZGlzYWJsZWRdKScsICdpZnJhbWUnLCAnb2JqZWN0JywgJ2VtYmVkJywgJ1tjb250ZW50ZWRpdGFibGVdJywgJ1t0YWJpbmRleF06bm90KFt0YWJpbmRleD1cIi0xXCJdKSddO1xuXG5cdFx0cmV0dXJuIFtdLnNsaWNlLmNhbGwodGhpcy5vdmVybGF5LnF1ZXJ5U2VsZWN0b3JBbGwoZm9jdXNhYmxlRWxlbWVudHMuam9pbignLCcpKSk7XG5cdH0sXG5cdHRyYXBUYWIoZSl7XG5cdFx0bGV0IGZvY3VzZWRJbmRleCA9IHRoaXMuZm9jdXNhYmxlQ2hpbGRyZW4uaW5kZXhPZihkb2N1bWVudC5hY3RpdmVFbGVtZW50KTtcblx0XHRpZihlLnNoaWZ0S2V5ICYmIGZvY3VzZWRJbmRleCA9PT0gMCkge1xuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0dGhpcy5mb2N1c2FibGVDaGlsZHJlblt0aGlzLmZvY3VzYWJsZUNoaWxkcmVuLmxlbmd0aCAtIDFdLmZvY3VzKCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGlmKCFlLnNoaWZ0S2V5ICYmIGZvY3VzZWRJbmRleCA9PT0gdGhpcy5mb2N1c2FibGVDaGlsZHJlbi5sZW5ndGggLSAxKSB7XG5cdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0dGhpcy5mb2N1c2FibGVDaGlsZHJlblswXS5mb2N1cygpO1xuXHRcdFx0fVxuXHRcdH1cblx0fSxcblx0a2V5TGlzdGVuZXIoZSl7XG5cdFx0aWYgKHRoaXMub3BlbiAmJiBlLmtleUNvZGUgPT09IDI3KSB7XG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHR0aGlzLnRvZ2dsZSgpO1xuXHRcdH1cblx0XHRpZiAodGhpcy5vcGVuICYmIGUua2V5Q29kZSA9PT0gOSkge1xuXHRcdFx0dGhpcy50cmFwVGFiKGUpO1xuXHRcdH1cblx0fSxcblx0b3Blbigpe1xuXHRcdGNvbnNvbGUubG9nKCdPcGVuJywgdGhpcyk7XG5cblx0XHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdGhpcy5rZXlMaXN0ZW5lci5iaW5kKHRoaXMpKTtcblx0XHR0aGlzLmxhc3RGb2N1c2VkID0gIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQ7XG5cdFx0d2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKXt0aGlzLmZvY3VzYWJsZUNoaWxkcmVuWzBdLmZvY3VzKCk7fS5iaW5kKHRoaXMpLCAwKTtcblx0XHR0aGlzLnRvZ2dsZSgpO1xuXHR9LFxuXHRwcmV2aW91cygpe1xuXHRcdGNvbnNvbGUubG9nKCdQcmV2aW91cycsIHRoaXMpO1xuXHR9LFxuXHRuZXh0KCl7XG5cdFx0Y29uc29sZS5sb2coJ05leHQnLCB0aGlzKTtcblx0fSxcblx0Y2xvc2UoKXtcblx0XHRjb25zb2xlLmxvZygnQ2xvc2UnLCB0aGlzKTtcblxuXHRcdGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLmtleUxpc3RlbmVyLmJpbmQodGhpcykpO1xuXHRcdHRoaXMubGFzdEZvY3VzZWQuZm9jdXMoKTtcblx0XHR0aGlzLnRvZ2dsZSgpO1xuXHR9LFxuXHR0b2dnbGUoKXtcblx0XHR0aGlzLmlzT3BlbiA9ICF0aGlzLmlzT3Blbjtcblx0XHR0aGlzLm92ZXJsYXkuY2xhc3NMaXN0LnRvZ2dsZSgnYWN0aXZlJyk7XG5cdFx0dGhpcy5vdmVybGF5LnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAhdGhpcy5pc09wZW4pO1xuXHRcdC8vdGhpcy5vdmVybGF5LnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCBTdHJpbmcoK3RoaXMuaXNPcGVuKSk7XG5cdH1cbn07XG5cbmNvbnN0IGluaXQgPSAoc3JjLCBvcHRzKSA9PiB7XG5cdGlmKCFzcmMubGVuZ3RoKSB0aHJvdyBuZXcgRXJyb3IoJ01vZGFsIEdhbGxlcnkgY2Fubm90IGJlIGluaXRpYWxpc2VkLCBubyBpbWFnZXMgZm91bmQnKTtcblxuXHRsZXQgaW1ncztcblxuXHRpZih0eXBlb2Ygc3JjID09PSAnc3RyaW5nJyl7XG5cdFx0bGV0IGVscyA9IFtdLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChzcmMpKTtcblxuXHRcdGlmKCFlbHMubGVuZ3RoKSB0aHJvdyBuZXcgRXJyb3IoJ01vZGFsIEdhbGxlcnkgY2Fubm90IGJlIGluaXRpYWxpc2VkLCBubyBpbWFnZXMgZm91bmQnKTtcblx0XHRcblx0XHRpbWdzID0gZWxzLm1hcChlbCA9PiB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRzcmM6IGVsLmdldEF0dHJpYnV0ZSgnaHJlZicpLFxuXHRcdFx0XHR0aXRsZTogZWwuZ2V0QXR0cmlidXRlKCdkYXRhLXRpdGxlJykgfHwgbnVsbCxcblx0XHRcdFx0ZGVzY3JpcHRpb246IGVsLmdldEF0dHJpYnV0ZSgnZGF0YS1kZXNjcmlwdGlvbicpIHx8IG51bGxcblx0XHRcdH07XG5cdFx0fSk7XG5cdH0gZWxzZSB7XG5cdFx0aW1ncyA9IHNyYztcblx0fVxuXHRcblx0cmV0dXJuIE9iamVjdC5hc3NpZ24oT2JqZWN0LmNyZWF0ZShTdG9ybU1vZGFsR2FsbGVyeSksIHtcblx0XHRpbWdzOiBpbWdzLFxuXHRcdHNldHRpbmdzOiBPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0cywgb3B0cylcblx0fSkuaW5pdCgpO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgeyBpbml0IH07Il19
