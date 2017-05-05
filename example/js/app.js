(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _component = require('./libs/component');

var _component2 = _interopRequireDefault(_component);

function _interopRequireDefault(obj) {
	return obj && obj.__esModule ? obj : { default: obj };
}

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

	_component2.default.init('.js-modal-gallery');
}];

if ('addEventListener' in window) window.addEventListener('DOMContentLoaded', function () {
	onDOMContentLoadedTasks.forEach(function (fn) {
		return fn();
	});
});

},{"./libs/component":2}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _defaults = require('./lib/defaults');

var _defaults2 = _interopRequireDefault(_defaults);

var _componentPrototype = require('./lib/component-prototype');

var _componentPrototype2 = _interopRequireDefault(_componentPrototype);

function _interopRequireDefault(obj) {
	return obj && obj.__esModule ? obj : { default: obj };
}

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

	return Object.assign(Object.create(_componentPrototype2.default), {
		items: items,
		total: items.length,
		settings: Object.assign({}, _defaults2.default, opts)
	}).init();
};

exports.default = { init: init };

},{"./lib/component-prototype":3,"./lib/defaults":4}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
var KEY_CODES = {
	TAB: 9,
	ESC: 27,
	LEFT: 37,
	RIGHT: 39,
	ENTER: 13
},
    TRIGGER_EVENTS = [window.PointerEvent ? 'pointerdown' : 'ontouchstart' in window ? 'touchstart' : 'click', 'keydown'];

exports.default = {
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

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = {
    templates: {
        overlay: "<div class=\"modal-gallery__inner js-modal-gallery__inner\">\n                        <div class=\"modal-gallery__content js-modal-gallery__content\">\n                            {{items}}\n                        </div>\n                    </div>\n                    <button class=\"js-modal-gallery__next modal-gallery__next\">\n                        <svg role=\"button\" role=\"button\" width=\"44\" height=\"60\">\n                            <polyline points=\"14 10 34 30 14 50\" stroke=\"rgb(255,255,255)\" stroke-width=\"4\" stroke-linecap=\"butt\" fill=\"none\" stroke-linejoin=\"round\"/>\n                        </svg>\n                    </button>\n                    <button class=\"js-modal-gallery__previous modal-gallery__previous\">\n                        <svg role=\"button\" width=\"44\" height=\"60\">\n                            <polyline points=\"30 10 10 30 30 50\" stroke=\"rgb(255,255,255)\" stroke-width=\"4\" stroke-linecap=\"butt\" fill=\"none\" stroke-linejoin=\"round\"/>\n                        </svg>\n                    </button>\n                    <button class=\"js-modal-gallery__close modal-gallery__close\">\n                        <svg role=\"button\" role=\"button\" width=\"30\" height=\"30\">\n                            <g stroke=\"rgb(255,255,255)\" stroke-width=\"4\">\n                                <line x1=\"5\" y1=\"5\" x2=\"25\" y2=\"25\"/>\n                                <line x1=\"5\" y1=\"25\" x2=\"25\" y2=\"5\"/>\n                            </g>\n                        </svg>\n                    </button>\n                    <div class=\"modal-gallery__total js-gallery-totals\"></div>",
        item: "<div class=\"modal-gallery__item js-modal-gallery__item\">\n                    <div class=\"modal-gallery__img-container js-modal-gallery__img-container\"></div>\n                    {{details}}\n                </div>",
        details: "<div class=\"modal-gallery__details\">\n                    <h1 class=\"modal-gallery__title\">{{title}}</h1>\n                    <div class=\"modal-gallery__description\">{{description}}</div>\n                </div>"
    },
    fullscreen: false,
    preload: false,
    totals: true
};

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJleGFtcGxlL3NyYy9hcHAuanMiLCJleGFtcGxlL3NyYy9saWJzL2NvbXBvbmVudC9pbmRleC5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9jb21wb25lbnQtcHJvdG90eXBlLmpzIiwiZXhhbXBsZS9zcmMvbGlicy9jb21wb25lbnQvbGliL2RlZmF1bHRzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTs7Ozs7Ozs7QUFFQSxJQUFNLDJCQUEyQixZQUFNLEFBRXRDOztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBOztBQUVBOztBQUVBOztxQkFBQSxBQUFhLEtBQWIsQUFBa0IsQUFFbEI7QUF0QkQsQUFBZ0MsQ0FBQTs7QUF3QmhDLElBQUcsc0JBQUgsQUFBeUIsZUFBUSxBQUFPLGlCQUFQLEFBQXdCLG9CQUFvQixZQUFNLEFBQUU7eUJBQUEsQUFBd0IsUUFBUSxjQUFBO1NBQUEsQUFBTTtBQUF0QyxBQUE4QztBQUFsRyxDQUFBOzs7Ozs7Ozs7QUMxQmpDOzs7O0FBQ0E7Ozs7Ozs7O0FBRUEsSUFBTSxPQUFPLFNBQVAsQUFBTyxLQUFBLEFBQUMsS0FBRCxBQUFNLE1BQVMsQUFDM0I7S0FBRyxDQUFDLElBQUosQUFBUSxRQUFRLE1BQU0sSUFBQSxBQUFJLE1BQVYsQUFBTSxBQUFVLEFBRWhDOztLQUFJLGFBQUosQUFFQTs7S0FBRyxPQUFBLEFBQU8sUUFBVixBQUFrQixVQUFTLEFBQzFCO01BQUksTUFBTSxHQUFBLEFBQUcsTUFBSCxBQUFTLEtBQUssU0FBQSxBQUFTLGlCQUFqQyxBQUFVLEFBQWMsQUFBMEIsQUFFbEQ7O01BQUcsQ0FBQyxJQUFKLEFBQVEsUUFBUSxNQUFNLElBQUEsQUFBSSxNQUFWLEFBQU0sQUFBVSxBQUVoQzs7Y0FBUSxBQUFJLElBQUksY0FBTSxBQUNy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ZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCBNb2RhbEdhbGxlcnkgZnJvbSAnLi9saWJzL2NvbXBvbmVudCc7XG5cbmNvbnN0IG9uRE9NQ29udGVudExvYWRlZFRhc2tzID0gWygpID0+IHtcblxuXHQvLyBsZXQgZ2FsbGVyeSA9IE1vZGFsR2FsbGVyeS5pbml0KFtcblx0Ly8gXHR7XG5cdC8vIFx0XHRzcmM6ICdodHRwOi8vcGxhY2Vob2xkLml0LzUwMHg1MDAnLFxuXHQvLyBcdFx0c3Jjc2V0OidodHRwOi8vcGxhY2Vob2xkLml0LzgwMHg4MDAgODAwdywgaHR0cDovL3BsYWNlaG9sZC5pdC81MDB4NTAwIDMyMHcnLFxuXHQvLyBcdFx0dGl0bGU6ICdJbWFnZSAxJyxcblx0Ly8gXHRcdGRlc2NyaXB0aW9uOiAnRGVzY3JpcHRpb24gMSdcblx0Ly8gXHR9LFxuXHQvLyBcdHtcblx0Ly8gXHRcdHNyYzogJ2h0dHA6Ly9wbGFjZWhvbGQuaXQvMzAweDgwMCcsXG5cdC8vIFx0XHRzcmNzZXQ6J2h0dHA6Ly9wbGFjZWhvbGQuaXQvNTAweDgwMCA4MDB3LCBodHRwOi8vcGxhY2Vob2xkLml0LzMwMHg1MDAgMzIwdycsXG5cdC8vIFx0XHR0aXRsZTogJ0ltYWdlIDInLFxuXHQvLyBcdFx0ZGVzY3JpcHRpb246ICdEZXNjcmlwdGlvbiAyJ1xuXHQvLyBcdH1dKTtcblxuXHQvL2NvbnNvbGUubG9nKGdhbGxlcnkpO1xuXHRcblx0Ly9kb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuanMtbW9kYWwtZ2FsbGVyeV9fdHJpZ2dlcicpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZ2FsbGVyeS5vcGVuLmJpbmQoZ2FsbGVyeSwgMCkpO1xuXG5cdE1vZGFsR2FsbGVyeS5pbml0KCcuanMtbW9kYWwtZ2FsbGVyeScpO1xuXG59XTtcbiAgICBcbmlmKCdhZGRFdmVudExpc3RlbmVyJyBpbiB3aW5kb3cpIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4geyBvbkRPTUNvbnRlbnRMb2FkZWRUYXNrcy5mb3JFYWNoKGZuID0+IGZuKCkpOyB9KTsiLCJpbXBvcnQgZGVmYXVsdHMgZnJvbSAnLi9saWIvZGVmYXVsdHMnO1xuaW1wb3J0IGNvbXBvbmVudFByb3RvdHlwZSBmcm9tICcuL2xpYi9jb21wb25lbnQtcHJvdG90eXBlJztcblxuY29uc3QgaW5pdCA9IChzcmMsIG9wdHMpID0+IHtcblx0aWYoIXNyYy5sZW5ndGgpIHRocm93IG5ldyBFcnJvcignTW9kYWwgR2FsbGVyeSBjYW5ub3QgYmUgaW5pdGlhbGlzZWQsIG5vIGltYWdlcyBmb3VuZCcpO1xuXG5cdGxldCBpdGVtcztcblxuXHRpZih0eXBlb2Ygc3JjID09PSAnc3RyaW5nJyl7XG5cdFx0bGV0IGVscyA9IFtdLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChzcmMpKTtcblxuXHRcdGlmKCFlbHMubGVuZ3RoKSB0aHJvdyBuZXcgRXJyb3IoJ01vZGFsIEdhbGxlcnkgY2Fubm90IGJlIGluaXRpYWxpc2VkLCBubyBpbWFnZXMgZm91bmQnKTtcblx0XHRcblx0XHRpdGVtcyA9IGVscy5tYXAoZWwgPT4ge1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0dHJpZ2dlcjogZWwsXG5cdFx0XHRcdHNyYzogZWwuZ2V0QXR0cmlidXRlKCdocmVmJyksXG5cdFx0XHRcdHNyY3NldDogZWwuZ2V0QXR0cmlidXRlKCdkYXRhLXNyY3NldCcpIHx8IG51bGwsXG5cdFx0XHRcdHNpemVzOiBlbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtc2l6ZXMnKSB8fCBudWxsLFxuXHRcdFx0XHR0aXRsZTogZWwuZ2V0QXR0cmlidXRlKCdkYXRhLXRpdGxlJykgfHwgJycsXG5cdFx0XHRcdGRlc2NyaXB0aW9uOiBlbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtZGVzY3JpcHRpb24nKSB8fCAnJ1xuXHRcdFx0fTtcblx0XHR9KTtcblx0fSBlbHNlIHtcblx0XHRpdGVtcyA9IHNyYztcblx0fVxuXHRcblx0cmV0dXJuIE9iamVjdC5hc3NpZ24oT2JqZWN0LmNyZWF0ZShjb21wb25lbnRQcm90b3R5cGUpLCB7XG5cdFx0aXRlbXM6IGl0ZW1zLFxuXHRcdHRvdGFsOiBpdGVtcy5sZW5ndGgsXG5cdFx0c2V0dGluZ3M6IE9iamVjdC5hc3NpZ24oe30sIGRlZmF1bHRzLCBvcHRzKVxuXHR9KS5pbml0KCk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCB7IGluaXQgfTsiLCJjb25zdCBLRVlfQ09ERVMgPSB7XG5cdFx0VEFCOiA5LFxuXHRcdEVTQzogMjcsXG5cdFx0TEVGVDogMzcsXG5cdFx0UklHSFQ6IDM5LFxuXHRcdEVOVEVSOiAxM1xuXHR9LFxuXHRUUklHR0VSX0VWRU5UUyA9IFt3aW5kb3cuUG9pbnRlckV2ZW50ID8gJ3BvaW50ZXJkb3duJyA6ICdvbnRvdWNoc3RhcnQnIGluIHdpbmRvdyA/ICd0b3VjaHN0YXJ0JyA6ICdjbGljaycsICdrZXlkb3duJyBdO1xuXG5leHBvcnQgZGVmYXVsdCB7XG5cdGluaXQoKSB7XG5cdFx0dGhpcy5pc09wZW4gPSBmYWxzZTtcblx0XHR0aGlzLmN1cnJlbnQgPSBudWxsO1xuXHRcdHRoaXMuaW5pdFVJKCk7XG5cdFx0dGhpcy5pbWFnZUNhY2hlID0gW107XG5cdFx0dGhpcy5mb2N1c2FibGVDaGlsZHJlbiA9IHRoaXMuZ2V0Rm9jdXNhYmxlQ2hpbGRyZW4oKTtcblx0XHR0aGlzLmluaXRCdXR0b25zKCk7XG5cdFx0dGhpcy5pdGVtc1swXS50cmlnZ2VyICYmIHRoaXMuaW5pdFRyaWdnZXJzKCk7XG5cdFx0dGhpcy5zZXR0aW5ncy5wcmVsb2FkICYmIHRoaXMuaXRlbXMuZm9yRWFjaCgoaXRlbSwgaSkgPT4ge1xuXHRcdFx0dGhpcy5sb2FkSW1hZ2UoaSk7XG5cdFx0fSk7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH0sXG5cdGluaXRUcmlnZ2Vycygpe1xuXHRcdHRoaXMuaXRlbXMuZm9yRWFjaCgoaXRlbSwgaSkgPT4ge1xuXHRcdFx0VFJJR0dFUl9FVkVOVFMuZm9yRWFjaChldiA9PiB7XG5cdFx0XHRcdGl0ZW0udHJpZ2dlci5hZGRFdmVudExpc3RlbmVyKGV2LCBlID0+IHtcblx0XHRcdFx0XHRpZihlLmtleUNvZGUgJiYgZS5rZXlDb2RlICE9PSBLRVlfQ09ERVMuRU5URVIpIHJldHVybjtcblx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0ZS5zdG9wUHJvcGFnYXRpb24oKTtcblx0XHRcdFx0XHR0aGlzLm9wZW4oaSk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cdFx0fSk7XG5cdH0sXG5cdGluaXRVSSgpe1xuXHRcdGxldCByZW5kZXJUZW1wbGF0ZSA9IChkYXRhLCB0ZW1wbGF0ZSkgPT4ge1xuXHRcdFx0XHRmb3IobGV0IGRhdHVtIGluIGRhdGEpe1xuXHRcdFx0XHRcdGlmKGRhdGEuaGFzT3duUHJvcGVydHkoZGF0dW0pKXtcblx0XHRcdFx0XHRcdHRlbXBsYXRlID0gdGVtcGxhdGUuc3BsaXQoYHt7JHtkYXR1bX19fWApLmpvaW4oZGF0YVtkYXR1bV0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gdGVtcGxhdGU7XG5cdFx0XHR9LFxuXHRcdFx0ZGV0YWlsc1N0cmluZ0FycmF5ID0gdGhpcy5pdGVtcy5tYXAoZnVuY3Rpb24oaW1nKSB7XG5cdFx0XHRcdHJldHVybiByZW5kZXJUZW1wbGF0ZShpbWcsIHRoaXMuc2V0dGluZ3MudGVtcGxhdGVzLmRldGFpbHMpO1xuXHRcdFx0fS5iaW5kKHRoaXMpKSxcblx0XHRcdGl0ZW1zU3RyaW5nID0gZGV0YWlsc1N0cmluZ0FycmF5Lm1hcChmdW5jdGlvbihpdGVtKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLnNldHRpbmdzLnRlbXBsYXRlcy5pdGVtLnNwbGl0KCd7e2RldGFpbHN9fScpLmpvaW4oaXRlbSk7XG5cdFx0XHR9LmJpbmQodGhpcykpLFxuXHRcdFx0b3ZlcmxheSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXG5cdFx0b3ZlcmxheS5jbGFzc05hbWUgPSAnbW9kYWwtZ2FsbGVyeV9fb3V0ZXIganMtbW9kYWwtZ2FsbGVyeV9fb3V0ZXInO1xuXHRcdG92ZXJsYXkuc2V0QXR0cmlidXRlKCdyb2xlJywgJ2RpYWxvZycpO1xuXHRcdG92ZXJsYXkuc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsICctMScpO1xuXHRcdG92ZXJsYXkuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsIHRydWUpO1xuXG5cdFx0dGhpcy5ET01PdmVybGF5ID0gZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChvdmVybGF5KTtcblxuXHRcdHRoaXMuRE9NT3ZlcmxheS5pbnNlcnRBZGphY2VudEhUTUwoJ2JlZm9yZWVuZCcsIHRoaXMuc2V0dGluZ3MudGVtcGxhdGVzLm92ZXJsYXkuc3BsaXQoJ3t7aXRlbXN9fScpLmpvaW4oaXRlbXNTdHJpbmcuam9pbignJykpKTtcblx0XHR0aGlzLkRPTUl0ZW1zID0gW10uc2xpY2UuY2FsbCh0aGlzLkRPTU92ZXJsYXkucXVlcnlTZWxlY3RvckFsbCgnLmpzLW1vZGFsLWdhbGxlcnlfX2l0ZW0nKSk7XG5cdFx0dGhpcy5ET01Ub3RhbHMgPSB0aGlzLkRPTU92ZXJsYXkucXVlcnlTZWxlY3RvcignLmpzLWdhbGxlcnktdG90YWxzJyk7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH0sXG5cdGluaXRCdXR0b25zKCl7XG5cdFx0dGhpcy5wcmV2aW91c0J0biA9IHRoaXMuRE9NT3ZlcmxheS5xdWVyeVNlbGVjdG9yKCcuanMtbW9kYWwtZ2FsbGVyeV9fcHJldmlvdXMnKTtcblx0XHR0aGlzLm5leHRCdG4gPSB0aGlzLkRPTU92ZXJsYXkucXVlcnlTZWxlY3RvcignLmpzLW1vZGFsLWdhbGxlcnlfX25leHQnKTtcblx0XHR0aGlzLmNsb3NlQnRuID0gdGhpcy5ET01PdmVybGF5LnF1ZXJ5U2VsZWN0b3IoJy5qcy1tb2RhbC1nYWxsZXJ5X19jbG9zZScpO1xuXG5cdFx0dGhpcy5jbG9zZUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuXHRcdFx0dGhpcy5jbG9zZSgpO1xuXHRcdH0uYmluZCh0aGlzKSk7XG5cblx0XHRpZiAodGhpcy50b3RhbCA8IDIpIHtcblx0XHRcdHRoaXMucHJldmlvdXNCdG4ucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh0aGlzLnByZXZpb3VzQnRuKTtcblx0XHRcdHRoaXMubmV4dEJ0bi5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHRoaXMubmV4dEJ0bik7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dGhpcy5wcmV2aW91c0J0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuXHRcdFx0dGhpcy5wcmV2aW91cygpO1xuXHRcdH0uYmluZCh0aGlzKSk7XG5cdFx0dGhpcy5uZXh0QnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG5cdFx0XHR0aGlzLm5leHQoKTtcblx0XHR9LmJpbmQodGhpcykpO1xuXHR9LFxuXHR3cml0ZVRvdGFsczogZnVuY3Rpb24gd3JpdGVUb3RhbHMoKSB7XG5cdFx0dGhpcy5ET01Ub3RhbHMuaW5uZXJIVE1MID0gYCR7dGhpcy5jdXJyZW50ICsgMX0vJHt0aGlzLnRvdGFsfWA7XG5cdH0sXG5cdGxvYWRJbWFnZShpKSB7XG5cdFx0dmFyIGltZyA9IG5ldyBJbWFnZSgpLFxuXHRcdFx0aW1hZ2VDb250YWluZXIgPSB0aGlzLkRPTUl0ZW1zW2ldLnF1ZXJ5U2VsZWN0b3IoJy5qcy1tb2RhbC1nYWxsZXJ5X19pbWctY29udGFpbmVyJyksXG5cdFx0XHRsb2FkZWQgPSAoKSA9PiB7XG5cdFx0XHRcdGxldCBzcmNzZXRBdHRyaWJ1dGUgPSB0aGlzLml0ZW1zW2ldLnNyY3NldCA/IGAgc3Jjc2V0PVwiJHt0aGlzLml0ZW1zW2ldLnNyY3NldH1cImAgOiAnJyxcblx0XHRcdFx0XHRzaXplc0F0dHJpYnV0ZSA9IHRoaXMuaXRlbXNbaV0uc2l6ZXMgPyBgIHNpemVzPVwiJHt0aGlzLml0ZW1zW2ldLnNpemVzfVwiYCA6ICcnO1xuXHRcdFx0XHRpbWFnZUNvbnRhaW5lci5pbm5lckhUTUwgPSBgPGltZyBjbGFzcz1cIm1vZGFsLWdhbGxlcnlfX2ltZ1wiIHNyYz1cIiR7dGhpcy5pdGVtc1tpXS5zcmN9XCIgYWx0PVwiJHt0aGlzLml0ZW1zW2ldLnRpdGxlfVwiJHtzcmNzZXRBdHRyaWJ1dGV9JHtzaXplc0F0dHJpYnV0ZX0+YDtcblx0XHRcdFx0dGhpcy5ET01JdGVtc1tpXS5jbGFzc0xpc3QucmVtb3ZlKCdsb2FkaW5nJyk7XG5cdFx0XHRcdGltZy5vbmxvYWQgPSBudWxsO1xuXHRcdFx0fTtcblx0XHRpbWcub25sb2FkID0gbG9hZGVkO1xuXHRcdGltZy5zcmMgPSB0aGlzLml0ZW1zW2ldLnNyYztcblx0XHRpbWcub25lcnJvciA9ICgpID0+IHtcblx0XHRcdHRoaXMuRE9NSXRlbXNbaV0uY2xhc3NMaXN0LnJlbW92ZSgnbG9hZGluZycpO1xuXHRcdFx0dGhpcy5ET01JdGVtc1tpXS5jbGFzc0xpc3QuYWRkKCdlcnJvcicpO1xuXHRcdH07XG5cdFx0aWYoaW1nLmNvbXBsZXRlKSBsb2FkZWQoKTtcblx0fSxcblx0bG9hZEltYWdlcyhpKXtcblx0XHRpZih0aGlzLmltYWdlQ2FjaGUubGVuZ3RoID09PSB0aGlzLml0ZW1zKSByZXR1cm47XG5cblx0XHRsZXQgaW5kZXhlcyA9IFtpXTtcblxuXHRcdGlmKHRoaXMuaXRlbXMubGVuZ3RoID4gMSkgaW5kZXhlcy5wdXNoKGkgPT09IDAgPyB0aGlzLml0ZW1zLmxlbmd0aCAtIDEgOiBpIC0gMSk7XG5cdFx0aWYodGhpcy5pdGVtcy5sZW5ndGggPiAyKSBpbmRleGVzLnB1c2goaSA9PT0gdGhpcy5pdGVtcy5sZW5ndGggLSAxID8gMCA6IGkgKyAxKTtcblxuXHRcdGluZGV4ZXMuZm9yRWFjaChpZHggPT4ge1xuXHRcdFx0aWYodGhpcy5pbWFnZUNhY2hlW2lkeF0gPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHR0aGlzLkRPTUl0ZW1zW2lkeF0uY2xhc3NMaXN0LmFkZCgnbG9hZGluZycpO1xuXHRcdFx0XHR0aGlzLmxvYWRJbWFnZShpZHgpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdH0sXG5cdGdldEZvY3VzYWJsZUNoaWxkcmVuKCkge1xuXHRcdGxldCBmb2N1c2FibGVFbGVtZW50cyA9IFsnYVtocmVmXScsICdhcmVhW2hyZWZdJywgJ2lucHV0Om5vdChbZGlzYWJsZWRdKScsICdzZWxlY3Q6bm90KFtkaXNhYmxlZF0pJywgJ3RleHRhcmVhOm5vdChbZGlzYWJsZWRdKScsICdidXR0b246bm90KFtkaXNhYmxlZF0pJywgJ2lmcmFtZScsICdvYmplY3QnLCAnZW1iZWQnLCAnW2NvbnRlbnRlZGl0YWJsZV0nLCAnW3RhYmluZGV4XTpub3QoW3RhYmluZGV4PVwiLTFcIl0pJ107XG5cblx0XHRyZXR1cm4gW10uc2xpY2UuY2FsbCh0aGlzLkRPTU92ZXJsYXkucXVlcnlTZWxlY3RvckFsbChmb2N1c2FibGVFbGVtZW50cy5qb2luKCcsJykpKTtcblx0fSxcblx0dHJhcFRhYihlKXtcblx0XHRsZXQgZm9jdXNlZEluZGV4ID0gdGhpcy5mb2N1c2FibGVDaGlsZHJlbi5pbmRleE9mKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpO1xuXHRcdGlmKGUuc2hpZnRLZXkgJiYgZm9jdXNlZEluZGV4ID09PSAwKSB7XG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHR0aGlzLmZvY3VzYWJsZUNoaWxkcmVuW3RoaXMuZm9jdXNhYmxlQ2hpbGRyZW4ubGVuZ3RoIC0gMV0uZm9jdXMoKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0aWYoIWUuc2hpZnRLZXkgJiYgZm9jdXNlZEluZGV4ID09PSB0aGlzLmZvY3VzYWJsZUNoaWxkcmVuLmxlbmd0aCAtIDEpIHtcblx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHR0aGlzLmZvY3VzYWJsZUNoaWxkcmVuWzBdLmZvY3VzKCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9LFxuXHRrZXlMaXN0ZW5lcihlKXtcblx0XHRpZighdGhpcy5pc09wZW4pIHJldHVybjtcblxuXHRcdHN3aXRjaCAoZS5rZXlDb2RlKSB7XG5cdFx0Y2FzZSBLRVlfQ09ERVMuRVNDOlxuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0dGhpcy50b2dnbGUoKTtcblx0XHRcdGJyZWFrO1xuXHRcdGNhc2UgS0VZX0NPREVTLlRBQjpcblx0XHRcdHRoaXMudHJhcFRhYihlKTtcblx0XHRcdGJyZWFrO1xuXHRcdGNhc2UgS0VZX0NPREVTLkxFRlQ6XG5cdFx0XHR0aGlzLnByZXZpb3VzKCk7XG5cdFx0XHRicmVhaztcblx0XHRjYXNlIEtFWV9DT0RFUy5SSUdIVDpcblx0XHRcdHRoaXMubmV4dCgpO1xuXHRcdFx0YnJlYWs7XG5cdFx0ZGVmYXVsdDpcblx0XHRcdGJyZWFrO1xuXHRcdH1cblx0fSxcblx0cHJldmlvdXMoKXtcblx0XHR0aGlzLmN1cnJlbnQgJiYgdGhpcy5ET01JdGVtc1t0aGlzLmN1cnJlbnRdLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHRcdHRoaXMuY3VycmVudCA9ICh0aGlzLmN1cnJlbnQgPT09IDAgPyB0aGlzLkRPTUl0ZW1zLmxlbmd0aCAtIDEgOiB0aGlzLmN1cnJlbnQgLSAxKTtcblx0XHR0aGlzLkRPTUl0ZW1zW3RoaXMuY3VycmVudF0uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG5cdFx0dGhpcy5sb2FkSW1hZ2VzKHRoaXMuY3VycmVudCk7XG5cdFx0KHRoaXMudG90YWwgPiAxICYmIHRoaXMuc2V0dGluZ3MudG90YWxzKSAmJiB0aGlzLndyaXRlVG90YWxzKCk7XG5cdH0sXG5cdG5leHQoKXtcblx0XHR0aGlzLmN1cnJlbnQgJiYgdGhpcy5ET01JdGVtc1t0aGlzLmN1cnJlbnRdLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHRcdHRoaXMuY3VycmVudCA9ICh0aGlzLmN1cnJlbnQgPT09IHRoaXMuRE9NSXRlbXMubGVuZ3RoIC0gMSA/IDAgOiB0aGlzLmN1cnJlbnQgKyAxKTtcblx0XHR0aGlzLkRPTUl0ZW1zW3RoaXMuY3VycmVudF0uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG5cdFx0dGhpcy5sb2FkSW1hZ2VzKHRoaXMuY3VycmVudCk7XG5cdFx0KHRoaXMudG90YWwgPiAxICYmIHRoaXMuc2V0dGluZ3MudG90YWxzKSAmJiB0aGlzLndyaXRlVG90YWxzKCk7XG5cdH0sXG5cdG9wZW4oaSl7XG5cdFx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRoaXMua2V5TGlzdGVuZXIuYmluZCh0aGlzKSk7XG5cdFx0dGhpcy5sb2FkSW1hZ2VzKGkpO1xuXHRcdHRoaXMubGFzdEZvY3VzZWQgPSAgZG9jdW1lbnQuYWN0aXZlRWxlbWVudDtcblx0XHR0aGlzLmZvY3VzYWJsZUNoaWxkcmVuLmxlbmd0aCAmJiB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpe3RoaXMuZm9jdXNhYmxlQ2hpbGRyZW5bMF0uZm9jdXMoKTt9LmJpbmQodGhpcyksIDApO1xuXHRcdHRoaXMuRE9NSXRlbXNbaSB8fCAwXS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcblx0XHR0aGlzLnRvZ2dsZShpIHx8IDApO1xuXHR9LFxuXHRjbG9zZSgpe1xuXHRcdGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLmtleUxpc3RlbmVyLmJpbmQodGhpcykpO1xuXHRcdHRoaXMubGFzdEZvY3VzZWQgJiYgdGhpcy5sYXN0Rm9jdXNlZC5mb2N1cygpO1xuXHRcdHRoaXMuRE9NSXRlbXNbdGhpcy5jdXJyZW50XS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcblx0XHR0aGlzLnRvZ2dsZShudWxsKTtcblx0fSxcblx0dG9nZ2xlKGkpe1xuXHRcdHRoaXMuaXNPcGVuID0gIXRoaXMuaXNPcGVuO1xuXHRcdHRoaXMuY3VycmVudCA9IGk7XG5cdFx0dGhpcy5ET01PdmVybGF5LmNsYXNzTGlzdC50b2dnbGUoJ2FjdGl2ZScpO1xuXHRcdHRoaXMuRE9NT3ZlcmxheS5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgIXRoaXMuaXNPcGVuKTtcblx0XHR0aGlzLkRPTU92ZXJsYXkuc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsIHRoaXMuaXNPcGVuID8gJzAnIDogJy0xJyk7XG5cdFx0dGhpcy5zZXR0aW5ncy5mdWxsc2NyZWVuICYmIHRoaXMudG9nZ2xlRnVsbFNjcmVlbigpO1xuXHRcdCh0aGlzLnRvdGFsID4gMSAmJiB0aGlzLnNldHRpbmdzLnRvdGFscykgJiYgdGhpcy53cml0ZVRvdGFscygpO1xuXHR9LFxuXHR0b2dnbGVGdWxsU2NyZWVuKCl7XG5cdFx0aWYodGhpcy5pc09wZW4pe1xuXHRcdFx0dGhpcy5ET01PdmVybGF5LnJlcXVlc3RGdWxsc2NyZWVuICYmIHRoaXMuRE9NT3ZlcmxheS5yZXF1ZXN0RnVsbHNjcmVlbigpO1xuXHRcdFx0dGhpcy5ET01PdmVybGF5LndlYmtpdFJlcXVlc3RGdWxsc2NyZWVuICYmIHRoaXMuRE9NT3ZlcmxheS53ZWJraXRSZXF1ZXN0RnVsbHNjcmVlbigpO1xuXHRcdFx0dGhpcy5ET01PdmVybGF5Lm1velJlcXVlc3RGdWxsU2NyZWVuICYmIHRoaXMuRE9NT3ZlcmxheS5tb3pSZXF1ZXN0RnVsbFNjcmVlbigpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRkb2N1bWVudC5leGl0RnVsbHNjcmVlbiAmJiBkb2N1bWVudC5leGl0RnVsbHNjcmVlbigpO1xuXHRcdFx0ZG9jdW1lbnQubW96Q2FuY2VsRnVsbFNjcmVlbiAmJiBkb2N1bWVudC5tb3pDYW5jZWxGdWxsU2NyZWVuKCk7XG5cdFx0XHRkb2N1bWVudC53ZWJraXRFeGl0RnVsbHNjcmVlbiAmJiBkb2N1bWVudC53ZWJraXRFeGl0RnVsbHNjcmVlbigpO1xuXHRcdH1cblx0fVxufTsiLCJleHBvcnQgZGVmYXVsdCB7XG4gICAgdGVtcGxhdGVzOiB7XG4gICAgICAgIG92ZXJsYXk6IGA8ZGl2IGNsYXNzPVwibW9kYWwtZ2FsbGVyeV9faW5uZXIganMtbW9kYWwtZ2FsbGVyeV9faW5uZXJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1nYWxsZXJ5X19jb250ZW50IGpzLW1vZGFsLWdhbGxlcnlfX2NvbnRlbnRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7e2l0ZW1zfX1cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImpzLW1vZGFsLWdhbGxlcnlfX25leHQgbW9kYWwtZ2FsbGVyeV9fbmV4dFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHN2ZyByb2xlPVwiYnV0dG9uXCIgcm9sZT1cImJ1dHRvblwiIHdpZHRoPVwiNDRcIiBoZWlnaHQ9XCI2MFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwb2x5bGluZSBwb2ludHM9XCIxNCAxMCAzNCAzMCAxNCA1MFwiIHN0cm9rZT1cInJnYigyNTUsMjU1LDI1NSlcIiBzdHJva2Utd2lkdGg9XCI0XCIgc3Ryb2tlLWxpbmVjYXA9XCJidXR0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvc3ZnPlxuICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImpzLW1vZGFsLWdhbGxlcnlfX3ByZXZpb3VzIG1vZGFsLWdhbGxlcnlfX3ByZXZpb3VzXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8c3ZnIHJvbGU9XCJidXR0b25cIiB3aWR0aD1cIjQ0XCIgaGVpZ2h0PVwiNjBcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cG9seWxpbmUgcG9pbnRzPVwiMzAgMTAgMTAgMzAgMzAgNTBcIiBzdHJva2U9XCJyZ2IoMjU1LDI1NSwyNTUpXCIgc3Ryb2tlLXdpZHRoPVwiNFwiIHN0cm9rZS1saW5lY2FwPVwiYnV0dFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIi8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L3N2Zz5cbiAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJqcy1tb2RhbC1nYWxsZXJ5X19jbG9zZSBtb2RhbC1nYWxsZXJ5X19jbG9zZVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHN2ZyByb2xlPVwiYnV0dG9uXCIgcm9sZT1cImJ1dHRvblwiIHdpZHRoPVwiMzBcIiBoZWlnaHQ9XCIzMFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxnIHN0cm9rZT1cInJnYigyNTUsMjU1LDI1NSlcIiBzdHJva2Utd2lkdGg9XCI0XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsaW5lIHgxPVwiNVwiIHkxPVwiNVwiIHgyPVwiMjVcIiB5Mj1cIjI1XCIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGluZSB4MT1cIjVcIiB5MT1cIjI1XCIgeDI9XCIyNVwiIHkyPVwiNVwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2c+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L3N2Zz5cbiAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1nYWxsZXJ5X190b3RhbCBqcy1nYWxsZXJ5LXRvdGFsc1wiPjwvZGl2PmAsXG4gICAgICAgIGl0ZW06IGA8ZGl2IGNsYXNzPVwibW9kYWwtZ2FsbGVyeV9faXRlbSBqcy1tb2RhbC1nYWxsZXJ5X19pdGVtXCI+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1nYWxsZXJ5X19pbWctY29udGFpbmVyIGpzLW1vZGFsLWdhbGxlcnlfX2ltZy1jb250YWluZXJcIj48L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAge3tkZXRhaWxzfX1cbiAgICAgICAgICAgICAgICA8L2Rpdj5gLFxuICAgICAgICBkZXRhaWxzOiBgPGRpdiBjbGFzcz1cIm1vZGFsLWdhbGxlcnlfX2RldGFpbHNcIj5cbiAgICAgICAgICAgICAgICAgICAgPGgxIGNsYXNzPVwibW9kYWwtZ2FsbGVyeV9fdGl0bGVcIj57e3RpdGxlfX08L2gxPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtZ2FsbGVyeV9fZGVzY3JpcHRpb25cIj57e2Rlc2NyaXB0aW9ufX08L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5gXG4gICAgfSxcbiAgICBmdWxsc2NyZWVuOiBmYWxzZSxcbiAgICBwcmVsb2FkOiBmYWxzZSxcbiAgICB0b3RhbHM6IHRydWVcbn07Il19
