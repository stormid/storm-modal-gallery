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

	_component2.default.init('.js-modal-single', {
		single: true
	});
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

var create = function create(items, opts) {
	return Object.assign(Object.create(_componentPrototype2.default), {
		items: items,
		settings: Object.assign({}, _defaults2.default, opts)
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

exports.default = { init: init };

},{"./lib/component-prototype":3,"./lib/defaults":4}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _templates = require('./templates');

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
		this.current = false;
		this.imageCache = [];
		this.initUI();
		this.initButtons();
		this.focusableChildren = this.getFocusableChildren();
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
		this.DOMOverlay = document.body.appendChild((0, _templates.overlay)());
		this.DOMOverlay.insertAdjacentHTML('beforeend', (0, _templates.overlayInner)(this.items.map(_templates.details).map(_templates.item).join('')));
		this.DOMItems = [].slice.call(this.DOMOverlay.querySelectorAll('.js-modal-gallery__item'));
		this.DOMTotals = this.DOMOverlay.querySelector('.js-gallery-totals');
		return this;
	},
	initButtons: function initButtons() {
		var _this3 = this;

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
				_this3[type + 'Btn'].addEventListener(ev, function (e) {
					if (e.keyCode && e.keyCode !== KEY_CODES.ENTER) return;
					_this3[type]();
				});
			});
		});
	},
	writeTotals: function writeTotals() {
		this.DOMTotals.innerHTML = this.current + 1 + '/' + this.items.length;
	},
	loadImage: function loadImage(i) {
		var _this4 = this;

		var img = new Image(),
		    imageContainer = this.DOMItems[i].querySelector('.js-modal-gallery__img-container'),
		    imageClassName = this.settings.scrollable ? 'modal-gallery__img modal-gallery__img--scrollable' : 'modal-gallery__img',
		    loaded = function loaded() {
			var srcsetAttribute = _this4.items[i].srcset ? ' srcset="' + _this4.items[i].srcset + '"' : '',
			    sizesAttribute = _this4.items[i].sizes ? ' sizes="' + _this4.items[i].sizes + '"' : '';
			imageContainer.innerHTML = '<img class="' + imageClassName + '" src="' + _this4.items[i].src + '" alt="' + _this4.items[i].title + '"' + srcsetAttribute + sizesAttribute + '>';
			_this4.DOMItems[i].classList.remove('loading');
			img.onload = null;
		};
		img.onload = loaded;
		img.src = this.items[i].src;
		img.onerror = function () {
			_this4.DOMItems[i].classList.remove('loading');
			_this4.DOMItems[i].classList.add('error');
		};
		if (img.complete) loaded();
	},
	loadImages: function loadImages(i) {
		var _this5 = this;

		if (this.imageCache.length === this.items) return;

		var indexes = [i];

		if (this.items.length > 1) indexes.push(i === 0 ? this.items.length - 1 : i - 1);
		if (this.items.length > 2) indexes.push(i === this.items.length - 1 ? 0 : i + 1);

		indexes.forEach(function (idx) {
			if (_this5.imageCache[idx] === undefined) {
				_this5.DOMItems[idx].classList.add('loading');
				_this5.loadImage(idx);
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
		var _this6 = this;

		this.incrementDecrement(function () {
			return _this6.current === 0 ? _this6.DOMItems.length - 1 : _this6.current - 1;
		});
	},
	next: function next() {
		var _this7 = this;

		this.incrementDecrement(function () {
			return _this7.current === _this7.DOMItems.length - 1 ? 0 : _this7.current + 1;
		});
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

},{"./templates":5}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = {
    fullscreen: false,
    preload: false,
    totals: true,
    scrollable: false,
    single: false
};

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var overlay = exports.overlay = function overlay() {
    var overlay = document.createElement('div');

    overlay.className = 'modal-gallery__outer js-modal-gallery__outer';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('tabindex', '-1');
    overlay.setAttribute('aria-hidden', true);

    return overlay;
};

var overlayInner = exports.overlayInner = function overlayInner(items) {
    return '<div class="modal-gallery__inner js-modal-gallery__inner">\n                                    <div class="modal-gallery__content js-modal-gallery__content">\n                                        ' + items + '\n                                    </div>\n                                </div>\n                                <button class="js-modal-gallery__next modal-gallery__next">\n                                    <svg role="button" role="button" width="44" height="60">\n                                        <polyline points="14 10 34 30 14 50" stroke="rgb(255,255,255)" stroke-width="4" stroke-linecap="butt" fill="none" stroke-linejoin="round"/>\n                                    </svg>\n                                </button>\n                                <button class="js-modal-gallery__previous modal-gallery__previous">\n                                    <svg role="button" width="44" height="60">\n                                        <polyline points="30 10 10 30 30 50" stroke="rgb(255,255,255)" stroke-width="4" stroke-linecap="butt" fill="none" stroke-linejoin="round"/>\n                                    </svg>\n                                </button>\n                                <button class="js-modal-gallery__close modal-gallery__close">\n                                    <svg role="button" role="button" width="30" height="30">\n                                        <g stroke="rgb(255,255,255)" stroke-width="4">\n                                            <line x1="5" y1="5" x2="25" y2="25"/>\n                                            <line x1="5" y1="25" x2="25" y2="5"/>\n                                        </g>\n                                    </svg>\n                                </button>\n                                <div class="modal-gallery__total js-gallery-totals"></div>';
};

var item = exports.item = function item(details) {
    return '<div class="modal-gallery__item js-modal-gallery__item">\n                                    <div class="modal-gallery__img-container js-modal-gallery__img-container"></div>\n                                    ' + details + '\n                                </div>';
};

var details = exports.details = function details(item) {
    return '<div class="modal-gallery__details">\n                                    <h1 class="modal-gallery__title">' + item.title + '</h1>\n                                    <div class="modal-gallery__description">' + item.description + '</div>\n                                </div>';
};

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJleGFtcGxlL3NyYy9hcHAuanMiLCJleGFtcGxlL3NyYy9saWJzL2NvbXBvbmVudC9pbmRleC5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9jb21wb25lbnQtcHJvdG90eXBlLmpzIiwiZXhhbXBsZS9zcmMvbGlicy9jb21wb25lbnQvbGliL2RlZmF1bHRzLmpzIiwiZXhhbXBsZS9zcmMvbGlicy9jb21wb25lbnQvbGliL3RlbXBsYXRlcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUE7Ozs7Ozs7O0FBRUEsSUFBTSwyQkFBMkIsWUFBTSxBQUV0Qzs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTs7QUFFQTs7QUFFQTs7cUJBQUEsQUFBYSxLQUFiLEFBQWtCLEFBRWxCOztxQkFBQSxBQUFhLEtBQWIsQUFBa0I7VUFBbEIsQUFBc0MsQUFDN0IsQUFHVDtBQUpzQyxBQUNyQztBQXZCRixBQUFnQyxDQUFBOztBQTRCaEMsSUFBRyxzQkFBSCxBQUF5QixlQUFRLEFBQU8saUJBQVAsQUFBd0Isb0JBQW9CLFlBQU0sQUFBRTt5QkFBQSxBQUF3QixRQUFRLGNBQUE7U0FBQSxBQUFNO0FBQXRDLEFBQThDO0FBQWxHLENBQUE7Ozs7Ozs7OztBQzlCakM7Ozs7QUFDQTs7Ozs7Ozs7QUFFQSxJQUFNLFNBQVMsU0FBVCxBQUFTLE9BQUEsQUFBQyxPQUFELEFBQVEsTUFBUjtlQUFpQixBQUFPLE9BQU8sT0FBQSxBQUFPLDRCQUFyQjtTQUFpRCxBQUN4RSxBQUNQO1lBQVUsT0FBQSxBQUFPLE9BQVAsQUFBYyx3QkFGTSxBQUFpRCxBQUVyRSxBQUE0QjtBQUZ5QyxBQUMvRSxFQUQ4QixFQUFqQixBQUFpQixBQUc1QjtBQUhKOztBQUtBLElBQU0sVUFBVSxTQUFWLEFBQVUsUUFBQSxBQUFDLEtB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Ozs7Ozs7O0FDREcsSUFBTSw0QkFBVSxtQkFBTSxBQUN6QjtRQUFJLFVBQVUsU0FBQSxBQUFTLGNBQXZCLEFBQWMsQUFBdUIsQUFFckM7O1lBQUEsQUFBUSxZQUFSLEFBQW9CLEFBQ3BCO1lBQUEsQUFBUSxhQUFSLEFBQXFCLFFBQXJCLEFBQTZCLEFBQzdCO1lBQUEsQUFBUSxhQUFSLEFBQXFCLFlBQXJCLEFBQWlDLEFBQ2pDO1lBQUEsQUFBUSxhQUFSLEFBQXFCLGVBQXJCLEFBQW9DLEFBRXBDOztXQUFBLEFBQU8sQUFDVjtBQVRNOztBQVdBLElBQU0sc0NBQWUsU0FBZixBQUFlLG9CQUFBO3dOQUFBLEFBRWMsUUFGZDtBQUFyQjs7QUF5QkEsSUFBTSxzQkFBTyxTQUFQLEFBQU8sY0FBQTtvT0FBQSxBQUVrQixVQUZsQjtBQUFiOztBQUtBLElBQU0sNEJBQVUsU0FBVixBQUFVLGNBQUE7MkhBQ2dELEtBRGhELEFBQ3FELGdHQUNFLEtBRnZELEFBRTRELGNBRjVEO0FBQWhCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCBNb2RhbEdhbGxlcnkgZnJvbSAnLi9saWJzL2NvbXBvbmVudCc7XG5cbmNvbnN0IG9uRE9NQ29udGVudExvYWRlZFRhc2tzID0gWygpID0+IHtcblxuXHQvLyBsZXQgZ2FsbGVyeSA9IE1vZGFsR2FsbGVyeS5pbml0KFtcblx0Ly8gXHR7XG5cdC8vIFx0XHRzcmM6ICdodHRwOi8vcGxhY2Vob2xkLml0LzUwMHg1MDAnLFxuXHQvLyBcdFx0c3Jjc2V0OidodHRwOi8vcGxhY2Vob2xkLml0LzgwMHg4MDAgODAwdywgaHR0cDovL3BsYWNlaG9sZC5pdC81MDB4NTAwIDMyMHcnLFxuXHQvLyBcdFx0dGl0bGU6ICdJbWFnZSAxJyxcblx0Ly8gXHRcdGRlc2NyaXB0aW9uOiAnRGVzY3JpcHRpb24gMSdcblx0Ly8gXHR9LFxuXHQvLyBcdHtcblx0Ly8gXHRcdHNyYzogJ2h0dHA6Ly9wbGFjZWhvbGQuaXQvMzAweDgwMCcsXG5cdC8vIFx0XHRzcmNzZXQ6J2h0dHA6Ly9wbGFjZWhvbGQuaXQvNTAweDgwMCA4MDB3LCBodHRwOi8vcGxhY2Vob2xkLml0LzMwMHg1MDAgMzIwdycsXG5cdC8vIFx0XHR0aXRsZTogJ0ltYWdlIDInLFxuXHQvLyBcdFx0ZGVzY3JpcHRpb246ICdEZXNjcmlwdGlvbiAyJ1xuXHQvLyBcdH1dKTtcblxuXHQvL2NvbnNvbGUubG9nKGdhbGxlcnkpO1xuXHRcblx0Ly9kb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuanMtbW9kYWwtZ2FsbGVyeV9fdHJpZ2dlcicpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZ2FsbGVyeS5vcGVuLmJpbmQoZ2FsbGVyeSwgMCkpO1xuXG5cdE1vZGFsR2FsbGVyeS5pbml0KCcuanMtbW9kYWwtZ2FsbGVyeScpO1xuXG5cdE1vZGFsR2FsbGVyeS5pbml0KCcuanMtbW9kYWwtc2luZ2xlJywge1xuXHRcdHNpbmdsZTogdHJ1ZVxuXHR9KTtcblxufV07XG4gICAgXG5pZignYWRkRXZlbnRMaXN0ZW5lcicgaW4gd2luZG93KSB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsICgpID0+IHsgb25ET01Db250ZW50TG9hZGVkVGFza3MuZm9yRWFjaChmbiA9PiBmbigpKTsgfSk7IiwiaW1wb3J0IGRlZmF1bHRzIGZyb20gJy4vbGliL2RlZmF1bHRzJztcbmltcG9ydCBjb21wb25lbnRQcm90b3R5cGUgZnJvbSAnLi9saWIvY29tcG9uZW50LXByb3RvdHlwZSc7XG5cbmNvbnN0IGNyZWF0ZSA9IChpdGVtcywgb3B0cykgPT4gT2JqZWN0LmFzc2lnbihPYmplY3QuY3JlYXRlKGNvbXBvbmVudFByb3RvdHlwZSksIHtcblx0XHRpdGVtczogaXRlbXMsXG5cdFx0c2V0dGluZ3M6IE9iamVjdC5hc3NpZ24oe30sIGRlZmF1bHRzLCBvcHRzKVxuXHR9KS5pbml0KCk7XG5cbmNvbnN0IHNpbmdsZXMgPSAoc3JjLCBvcHRzKSA9PiB7XG5cdGxldCBlbHMgPSBbXS5zbGljZS5jYWxsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoc3JjKSk7XG5cblx0aWYoIWVscy5sZW5ndGgpIHRocm93IG5ldyBFcnJvcignTW9kYWwgR2FsbGVyeSBjYW5ub3QgYmUgaW5pdGlhbGlzZWQsIG5vIGltYWdlcyBmb3VuZCcpO1xuXG5cdHJldHVybiBlbHMubWFwKGVsID0+IGNyZWF0ZShbe1xuXHRcdHRyaWdnZXI6IGVsLFxuXHRcdHNyYzogZWwuZ2V0QXR0cmlidXRlKCdocmVmJyksXG5cdFx0c3Jjc2V0OiBlbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtc3Jjc2V0JykgfHwgbnVsbCxcblx0XHRzaXplczogZWwuZ2V0QXR0cmlidXRlKCdkYXRhLXNpemVzJykgfHwgbnVsbCxcblx0XHR0aXRsZTogZWwuZ2V0QXR0cmlidXRlKCdkYXRhLXRpdGxlJykgfHwgJycsXG5cdFx0ZGVzY3JpcHRpb246IGVsLmdldEF0dHJpYnV0ZSgnZGF0YS1kZXNjcmlwdGlvbicpIHx8ICcnXG5cdH1dLCBvcHRzKSk7XG59O1xuXG5jb25zdCBnYWxsZXJpZXMgPSAoc3JjLCBvcHRzKSA9PiB7XG5cdGxldCBpdGVtcztcblxuXHRpZih0eXBlb2Ygc3JjID09PSAnc3RyaW5nJyl7XG5cdFx0bGV0IGVscyA9IFtdLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChzcmMpKTtcblxuXHRcdGlmKCFlbHMubGVuZ3RoKSB0aHJvdyBuZXcgRXJyb3IoJ01vZGFsIEdhbGxlcnkgY2Fubm90IGJlIGluaXRpYWxpc2VkLCBubyBpbWFnZXMgZm91bmQnKTtcblx0XHRcblx0XHRpdGVtcyA9IGVscy5tYXAoZWwgPT4ge1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0dHJpZ2dlcjogZWwsXG5cdFx0XHRcdHNyYzogZWwuZ2V0QXR0cmlidXRlKCdocmVmJyksXG5cdFx0XHRcdHNyY3NldDogZWwuZ2V0QXR0cmlidXRlKCdkYXRhLXNyY3NldCcpIHx8IG51bGwsXG5cdFx0XHRcdHNpemVzOiBlbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtc2l6ZXMnKSB8fCBudWxsLFxuXHRcdFx0XHR0aXRsZTogZWwuZ2V0QXR0cmlidXRlKCdkYXRhLXRpdGxlJykgfHwgJycsXG5cdFx0XHRcdGRlc2NyaXB0aW9uOiBlbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtZGVzY3JpcHRpb24nKSB8fCAnJ1xuXHRcdFx0fTtcblx0XHR9KTtcblx0fSBlbHNlIGl0ZW1zID0gc3JjO1xuXG5cdHJldHVybiBjcmVhdGUoaXRlbXMsIG9wdHMpO1xufTtcblxuY29uc3QgaW5pdCA9IChzcmMsIG9wdHMpID0+IHtcblx0aWYoIXNyYy5sZW5ndGgpIHRocm93IG5ldyBFcnJvcignTW9kYWwgR2FsbGVyeSBjYW5ub3QgYmUgaW5pdGlhbGlzZWQsIG5vIGltYWdlcyBmb3VuZCcpO1xuXG5cdGlmKG9wdHMgJiYgb3B0cy5zaW5nbGUpIHJldHVybiBzaW5nbGVzKHNyYywgb3B0cyk7XG5cdGVsc2UgcmV0dXJuIGdhbGxlcmllcyhzcmMsIG9wdHMpO1xuXHRcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHsgaW5pdCB9OyIsImltcG9ydCB7IFxuXHRvdmVybGF5LFxuXHRvdmVybGF5SW5uZXIsXG5cdGl0ZW0sXG5cdGRldGFpbHNcbn0gZnJvbSAnLi90ZW1wbGF0ZXMnO1xuXG5jb25zdCBLRVlfQ09ERVMgPSB7XG5cdFx0VEFCOiA5LFxuXHRcdEVTQzogMjcsXG5cdFx0TEVGVDogMzcsXG5cdFx0UklHSFQ6IDM5LFxuXHRcdEVOVEVSOiAxM1xuXHR9LFxuXHRUUklHR0VSX0VWRU5UUyA9IFt3aW5kb3cuUG9pbnRlckV2ZW50ID8gJ3BvaW50ZXJkb3duJyA6ICdvbnRvdWNoc3RhcnQnIGluIHdpbmRvdyA/ICd0b3VjaHN0YXJ0JyA6ICdjbGljaycsICdrZXlkb3duJyBdO1xuXG5leHBvcnQgZGVmYXVsdCB7XG5cdGluaXQoKSB7XG5cdFx0dGhpcy5pc09wZW4gPSBmYWxzZTtcblx0XHR0aGlzLmN1cnJlbnQgPSBmYWxzZTtcblx0XHR0aGlzLmltYWdlQ2FjaGUgPSBbXTtcblx0XHR0aGlzLmluaXRVSSgpO1xuXHRcdHRoaXMuaW5pdEJ1dHRvbnMoKTtcblx0XHR0aGlzLmZvY3VzYWJsZUNoaWxkcmVuID0gdGhpcy5nZXRGb2N1c2FibGVDaGlsZHJlbigpO1xuXHRcdHRoaXMuaXRlbXNbMF0udHJpZ2dlciAmJiB0aGlzLmluaXRUcmlnZ2VycygpO1xuXHRcdHRoaXMuc2V0dGluZ3MucHJlbG9hZCAmJiB0aGlzLml0ZW1zLmZvckVhY2goKGl0ZW0sIGkpID0+IHsgdGhpcy5sb2FkSW1hZ2UoaSk7IH0pO1xuXHRcdHJldHVybiB0aGlzO1xuXHR9LFxuXHRpbml0VHJpZ2dlcnMoKXtcblx0XHR0aGlzLml0ZW1zLmZvckVhY2goKGl0ZW0sIGkpID0+IHtcblx0XHRcdFRSSUdHRVJfRVZFTlRTLmZvckVhY2goZXYgPT4ge1xuXHRcdFx0XHRpdGVtLnRyaWdnZXIuYWRkRXZlbnRMaXN0ZW5lcihldiwgZSA9PiB7XG5cdFx0XHRcdFx0aWYoZS5rZXlDb2RlICYmIGUua2V5Q29kZSAhPT0gS0VZX0NPREVTLkVOVEVSKSByZXR1cm47XG5cdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRcdGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0XHRcdFx0dGhpcy5vcGVuKGkpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH0pO1xuXHRcdH0pO1xuXHR9LFxuXHRpbml0VUkoKXtcblx0XHR0aGlzLkRPTU92ZXJsYXkgPSBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKG92ZXJsYXkoKSk7XG5cdFx0dGhpcy5ET01PdmVybGF5Lmluc2VydEFkamFjZW50SFRNTCgnYmVmb3JlZW5kJywgb3ZlcmxheUlubmVyKHRoaXMuaXRlbXMubWFwKGRldGFpbHMpLm1hcChpdGVtKS5qb2luKCcnKSkpO1xuXHRcdHRoaXMuRE9NSXRlbXMgPSBbXS5zbGljZS5jYWxsKHRoaXMuRE9NT3ZlcmxheS5xdWVyeVNlbGVjdG9yQWxsKCcuanMtbW9kYWwtZ2FsbGVyeV9faXRlbScpKTtcblx0XHR0aGlzLkRPTVRvdGFscyA9IHRoaXMuRE9NT3ZlcmxheS5xdWVyeVNlbGVjdG9yKCcuanMtZ2FsbGVyeS10b3RhbHMnKTtcblx0XHRyZXR1cm4gdGhpcztcblx0fSxcblx0aW5pdEJ1dHRvbnMoKXtcblx0XHR0aGlzLmNsb3NlQnRuID0gdGhpcy5ET01PdmVybGF5LnF1ZXJ5U2VsZWN0b3IoJy5qcy1tb2RhbC1nYWxsZXJ5X19jbG9zZScpO1xuXHRcdHRoaXMuY2xvc2VCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLmNsb3NlLmJpbmQodGhpcykpO1xuXG5cdFx0aWYgKHRoaXMuaXRlbXMubGVuZ3RoIDwgMikge1xuXHRcdFx0dGhpcy5ET01PdmVybGF5LnJlbW92ZUNoaWxkKHRoaXMuRE9NT3ZlcmxheS5xdWVyeVNlbGVjdG9yKCcuanMtbW9kYWwtZ2FsbGVyeV9fcHJldmlvdXMnKSk7XG5cdFx0XHR0aGlzLkRPTU92ZXJsYXkucmVtb3ZlQ2hpbGQodGhpcy5ET01PdmVybGF5LnF1ZXJ5U2VsZWN0b3IoJy5qcy1tb2RhbC1nYWxsZXJ5X19uZXh0JykpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHRoaXMucHJldmlvdXNCdG4gPSB0aGlzLkRPTU92ZXJsYXkucXVlcnlTZWxlY3RvcignLmpzLW1vZGFsLWdhbGxlcnlfX3ByZXZpb3VzJyk7XG5cdFx0dGhpcy5uZXh0QnRuID0gdGhpcy5ET01PdmVybGF5LnF1ZXJ5U2VsZWN0b3IoJy5qcy1tb2RhbC1nYWxsZXJ5X19uZXh0Jyk7XG5cblx0XHRUUklHR0VSX0VWRU5UUy5mb3JFYWNoKGV2ID0+IHtcblx0XHRcdFsncHJldmlvdXMnLCAnbmV4dCddLmZvckVhY2godHlwZSA9PiB7XG5cdFx0XHRcdHRoaXNbYCR7dHlwZX1CdG5gXS5hZGRFdmVudExpc3RlbmVyKGV2LCBlID0+IHtcblx0XHRcdFx0XHRpZihlLmtleUNvZGUgJiYgZS5rZXlDb2RlICE9PSBLRVlfQ09ERVMuRU5URVIpIHJldHVybjtcblx0XHRcdFx0XHR0aGlzW3R5cGVdKCk7XG5cdFx0XHRcdH0pXG5cdFx0XHR9KTtcblx0XHR9KTtcblx0fSxcblx0d3JpdGVUb3RhbHMoKSB7IHRoaXMuRE9NVG90YWxzLmlubmVySFRNTCA9IGAke3RoaXMuY3VycmVudCArIDF9LyR7dGhpcy5pdGVtcy5sZW5ndGh9YDsgfSxcblx0bG9hZEltYWdlKGkpIHtcblx0XHRsZXQgaW1nID0gbmV3IEltYWdlKCksXG5cdFx0XHRpbWFnZUNvbnRhaW5lciA9IHRoaXMuRE9NSXRlbXNbaV0ucXVlcnlTZWxlY3RvcignLmpzLW1vZGFsLWdhbGxlcnlfX2ltZy1jb250YWluZXInKSxcblx0XHRcdGltYWdlQ2xhc3NOYW1lID0gdGhpcy5zZXR0aW5ncy5zY3JvbGxhYmxlID8gJ21vZGFsLWdhbGxlcnlfX2ltZyBtb2RhbC1nYWxsZXJ5X19pbWctLXNjcm9sbGFibGUnIDogJ21vZGFsLWdhbGxlcnlfX2ltZycsXG5cdFx0XHRsb2FkZWQgPSAoKSA9PiB7XG5cdFx0XHRcdGxldCBzcmNzZXRBdHRyaWJ1dGUgPSB0aGlzLml0ZW1zW2ldLnNyY3NldCA/IGAgc3Jjc2V0PVwiJHt0aGlzLml0ZW1zW2ldLnNyY3NldH1cImAgOiAnJyxcblx0XHRcdFx0XHRzaXplc0F0dHJpYnV0ZSA9IHRoaXMuaXRlbXNbaV0uc2l6ZXMgPyBgIHNpemVzPVwiJHt0aGlzLml0ZW1zW2ldLnNpemVzfVwiYCA6ICcnO1xuXHRcdFx0XHRpbWFnZUNvbnRhaW5lci5pbm5lckhUTUwgPSBgPGltZyBjbGFzcz1cIiR7aW1hZ2VDbGFzc05hbWV9XCIgc3JjPVwiJHt0aGlzLml0ZW1zW2ldLnNyY31cIiBhbHQ9XCIke3RoaXMuaXRlbXNbaV0udGl0bGV9XCIke3NyY3NldEF0dHJpYnV0ZX0ke3NpemVzQXR0cmlidXRlfT5gO1xuXHRcdFx0XHR0aGlzLkRPTUl0ZW1zW2ldLmNsYXNzTGlzdC5yZW1vdmUoJ2xvYWRpbmcnKTtcblx0XHRcdFx0aW1nLm9ubG9hZCA9IG51bGw7XG5cdFx0XHR9O1xuXHRcdGltZy5vbmxvYWQgPSBsb2FkZWQ7XG5cdFx0aW1nLnNyYyA9IHRoaXMuaXRlbXNbaV0uc3JjO1xuXHRcdGltZy5vbmVycm9yID0gKCkgPT4ge1xuXHRcdFx0dGhpcy5ET01JdGVtc1tpXS5jbGFzc0xpc3QucmVtb3ZlKCdsb2FkaW5nJyk7XG5cdFx0XHR0aGlzLkRPTUl0ZW1zW2ldLmNsYXNzTGlzdC5hZGQoJ2Vycm9yJyk7XG5cdFx0fTtcblx0XHRpZihpbWcuY29tcGxldGUpIGxvYWRlZCgpO1xuXHR9LFxuXHRsb2FkSW1hZ2VzKGkpe1xuXHRcdGlmKHRoaXMuaW1hZ2VDYWNoZS5sZW5ndGggPT09IHRoaXMuaXRlbXMpIHJldHVybjtcblxuXHRcdGxldCBpbmRleGVzID0gW2ldO1xuXG5cdFx0aWYodGhpcy5pdGVtcy5sZW5ndGggPiAxKSBpbmRleGVzLnB1c2goaSA9PT0gMCA/IHRoaXMuaXRlbXMubGVuZ3RoIC0gMSA6IGkgLSAxKTtcblx0XHRpZih0aGlzLml0ZW1zLmxlbmd0aCA+IDIpIGluZGV4ZXMucHVzaChpID09PSB0aGlzLml0ZW1zLmxlbmd0aCAtIDEgPyAwIDogaSArIDEpO1xuXG5cdFx0aW5kZXhlcy5mb3JFYWNoKGlkeCA9PiB7XG5cdFx0XHRpZih0aGlzLmltYWdlQ2FjaGVbaWR4XSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdHRoaXMuRE9NSXRlbXNbaWR4XS5jbGFzc0xpc3QuYWRkKCdsb2FkaW5nJyk7XG5cdFx0XHRcdHRoaXMubG9hZEltYWdlKGlkeCk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0fSxcblx0Z2V0Rm9jdXNhYmxlQ2hpbGRyZW4oKSB7XG5cdFx0bGV0IGZvY3VzYWJsZUVsZW1lbnRzID0gWydhW2hyZWZdJywgJ2FyZWFbaHJlZl0nLCAnaW5wdXQ6bm90KFtkaXNhYmxlZF0pJywgJ3NlbGVjdDpub3QoW2Rpc2FibGVkXSknLCAndGV4dGFyZWE6bm90KFtkaXNhYmxlZF0pJywgJ2J1dHRvbjpub3QoW2Rpc2FibGVkXSknLCAnaWZyYW1lJywgJ29iamVjdCcsICdlbWJlZCcsICdbY29udGVudGVkaXRhYmxlXScsICdbdGFiaW5kZXhdOm5vdChbdGFiaW5kZXg9XCItMVwiXSknXTtcblxuXHRcdHJldHVybiBbXS5zbGljZS5jYWxsKHRoaXMuRE9NT3ZlcmxheS5xdWVyeVNlbGVjdG9yQWxsKGZvY3VzYWJsZUVsZW1lbnRzLmpvaW4oJywnKSkpO1xuXHR9LFxuXHR0cmFwVGFiKGUpe1xuXHRcdGxldCBmb2N1c2VkSW5kZXggPSB0aGlzLmZvY3VzYWJsZUNoaWxkcmVuLmluZGV4T2YoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCk7XG5cdFx0aWYoZS5zaGlmdEtleSAmJiBmb2N1c2VkSW5kZXggPT09IDApIHtcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdHRoaXMuZm9jdXNhYmxlQ2hpbGRyZW5bdGhpcy5mb2N1c2FibGVDaGlsZHJlbi5sZW5ndGggLSAxXS5mb2N1cygpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRpZighZS5zaGlmdEtleSAmJiBmb2N1c2VkSW5kZXggPT09IHRoaXMuZm9jdXNhYmxlQ2hpbGRyZW4ubGVuZ3RoIC0gMSkge1xuXHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdHRoaXMuZm9jdXNhYmxlQ2hpbGRyZW5bMF0uZm9jdXMoKTtcblx0XHRcdH1cblx0XHR9XG5cdH0sXG5cdGtleUxpc3RlbmVyKGUpe1xuXHRcdGlmKCF0aGlzLmlzT3BlbikgcmV0dXJuO1xuXG5cdFx0c3dpdGNoIChlLmtleUNvZGUpIHtcblx0XHRjYXNlIEtFWV9DT0RFUy5FU0M6XG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHR0aGlzLnRvZ2dsZSgpO1xuXHRcdFx0YnJlYWs7XG5cdFx0Y2FzZSBLRVlfQ09ERVMuVEFCOlxuXHRcdFx0dGhpcy50cmFwVGFiKGUpO1xuXHRcdFx0YnJlYWs7XG5cdFx0Y2FzZSBLRVlfQ09ERVMuTEVGVDpcblx0XHRcdHRoaXMucHJldmlvdXMoKTtcblx0XHRcdGJyZWFrO1xuXHRcdGNhc2UgS0VZX0NPREVTLlJJR0hUOlxuXHRcdFx0dGhpcy5uZXh0KCk7XG5cdFx0XHRicmVhaztcblx0XHRkZWZhdWx0OlxuXHRcdFx0YnJlYWs7XG5cdFx0fVxuXHR9LFxuXHRpbmNyZW1lbnREZWNyZW1lbnQoZm4pe1xuXHRcdHRoaXMuY3VycmVudCAhPT0gZmFsc2UgJiYgdGhpcy5ET01JdGVtc1t0aGlzLmN1cnJlbnRdLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHRcdHRoaXMuY3VycmVudCA9IGZuKCk7XG5cdFx0dGhpcy5ET01JdGVtc1t0aGlzLmN1cnJlbnRdLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXHRcdHRoaXMubG9hZEltYWdlcyh0aGlzLmN1cnJlbnQpO1xuXHRcdCh0aGlzLml0ZW1zLmxlbmd0aCA+IDEgJiYgdGhpcy5zZXR0aW5ncy50b3RhbHMpICYmIHRoaXMud3JpdGVUb3RhbHMoKTtcblx0fSxcblx0cHJldmlvdXMoKXsgdGhpcy5pbmNyZW1lbnREZWNyZW1lbnQoKCkgPT4gKHRoaXMuY3VycmVudCA9PT0gMCA/IHRoaXMuRE9NSXRlbXMubGVuZ3RoIC0gMSA6IHRoaXMuY3VycmVudCAtIDEpKTsgfSxcblx0bmV4dCgpeyB0aGlzLmluY3JlbWVudERlY3JlbWVudCgoKSA9PiAodGhpcy5jdXJyZW50ID09PSB0aGlzLkRPTUl0ZW1zLmxlbmd0aCAtIDEgPyAwIDogdGhpcy5jdXJyZW50ICsgMSkpOyB9LFxuXHRvcGVuKGkpe1xuXHRcdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLmtleUxpc3RlbmVyLmJpbmQodGhpcykpO1xuXHRcdHRoaXMubG9hZEltYWdlcyhpKTtcblx0XHR0aGlzLmxhc3RGb2N1c2VkID0gIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQ7XG5cdFx0dGhpcy5mb2N1c2FibGVDaGlsZHJlbi5sZW5ndGggJiYgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKXt0aGlzLmZvY3VzYWJsZUNoaWxkcmVuWzBdLmZvY3VzKCk7fS5iaW5kKHRoaXMpLCAwKTtcblx0XHR0aGlzLkRPTUl0ZW1zW2kgfHwgMF0uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG5cdFx0dGhpcy50b2dnbGUoaSB8fCAwKTtcblx0fSxcblx0Y2xvc2UoKXtcblx0XHRkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdGhpcy5rZXlMaXN0ZW5lci5iaW5kKHRoaXMpKTtcblx0XHR0aGlzLmxhc3RGb2N1c2VkICYmIHRoaXMubGFzdEZvY3VzZWQuZm9jdXMoKTtcblx0XHR0aGlzLkRPTUl0ZW1zW3RoaXMuY3VycmVudF0uY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdFx0dGhpcy50b2dnbGUobnVsbCk7XG5cdH0sXG5cdHRvZ2dsZShpKXtcblx0XHR0aGlzLmlzT3BlbiA9ICF0aGlzLmlzT3Blbjtcblx0XHR0aGlzLmN1cnJlbnQgPSBpO1xuXHRcdHRoaXMuRE9NT3ZlcmxheS5jbGFzc0xpc3QudG9nZ2xlKCdhY3RpdmUnKTtcblx0XHR0aGlzLkRPTU92ZXJsYXkuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICF0aGlzLmlzT3Blbik7XG5cdFx0dGhpcy5ET01PdmVybGF5LnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCB0aGlzLmlzT3BlbiA/ICcwJyA6ICctMScpO1xuXHRcdHRoaXMuc2V0dGluZ3MuZnVsbHNjcmVlbiAmJiB0aGlzLnRvZ2dsZUZ1bGxTY3JlZW4oKTtcblx0XHQodGhpcy5pdGVtcy5sZW5ndGggPiAxICYmIHRoaXMuc2V0dGluZ3MudG90YWxzKSAmJiB0aGlzLndyaXRlVG90YWxzKCk7XG5cdH0sXG5cdHRvZ2dsZUZ1bGxTY3JlZW4oKXtcblx0XHRpZih0aGlzLmlzT3Blbil7XG5cdFx0XHR0aGlzLkRPTU92ZXJsYXkucmVxdWVzdEZ1bGxzY3JlZW4gJiYgdGhpcy5ET01PdmVybGF5LnJlcXVlc3RGdWxsc2NyZWVuKCk7XG5cdFx0XHR0aGlzLkRPTU92ZXJsYXkud2Via2l0UmVxdWVzdEZ1bGxzY3JlZW4gJiYgdGhpcy5ET01PdmVybGF5LndlYmtpdFJlcXVlc3RGdWxsc2NyZWVuKCk7XG5cdFx0XHR0aGlzLkRPTU92ZXJsYXkubW96UmVxdWVzdEZ1bGxTY3JlZW4gJiYgdGhpcy5ET01PdmVybGF5Lm1velJlcXVlc3RGdWxsU2NyZWVuKCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGRvY3VtZW50LmV4aXRGdWxsc2NyZWVuICYmIGRvY3VtZW50LmV4aXRGdWxsc2NyZWVuKCk7XG5cdFx0XHRkb2N1bWVudC5tb3pDYW5jZWxGdWxsU2NyZWVuICYmIGRvY3VtZW50Lm1vekNhbmNlbEZ1bGxTY3JlZW4oKTtcblx0XHRcdGRvY3VtZW50LndlYmtpdEV4aXRGdWxsc2NyZWVuICYmIGRvY3VtZW50LndlYmtpdEV4aXRGdWxsc2NyZWVuKCk7XG5cdFx0fVxuXHR9XG59OyIsImV4cG9ydCBkZWZhdWx0IHtcbiAgICBmdWxsc2NyZWVuOiBmYWxzZSxcbiAgICBwcmVsb2FkOiBmYWxzZSxcbiAgICB0b3RhbHM6IHRydWUsXG4gICAgc2Nyb2xsYWJsZTogZmFsc2UsXG4gICAgc2luZ2xlOiBmYWxzZVxufTsiLCJleHBvcnQgY29uc3Qgb3ZlcmxheSA9ICgpID0+IHtcbiAgICBsZXQgb3ZlcmxheSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXG4gICAgb3ZlcmxheS5jbGFzc05hbWUgPSAnbW9kYWwtZ2FsbGVyeV9fb3V0ZXIganMtbW9kYWwtZ2FsbGVyeV9fb3V0ZXInO1xuICAgIG92ZXJsYXkuc2V0QXR0cmlidXRlKCdyb2xlJywgJ2RpYWxvZycpO1xuICAgIG92ZXJsYXkuc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsICctMScpO1xuICAgIG92ZXJsYXkuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsIHRydWUpO1xuXG4gICAgcmV0dXJuIG92ZXJsYXk7XG59O1xuXG5leHBvcnQgY29uc3Qgb3ZlcmxheUlubmVyID0gaXRlbXMgPT4gYDxkaXYgY2xhc3M9XCJtb2RhbC1nYWxsZXJ5X19pbm5lciBqcy1tb2RhbC1nYWxsZXJ5X19pbm5lclwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWdhbGxlcnlfX2NvbnRlbnQganMtbW9kYWwtZ2FsbGVyeV9fY29udGVudFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICR7aXRlbXN9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJqcy1tb2RhbC1nYWxsZXJ5X19uZXh0IG1vZGFsLWdhbGxlcnlfX25leHRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzdmcgcm9sZT1cImJ1dHRvblwiIHJvbGU9XCJidXR0b25cIiB3aWR0aD1cIjQ0XCIgaGVpZ2h0PVwiNjBcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cG9seWxpbmUgcG9pbnRzPVwiMTQgMTAgMzQgMzAgMTQgNTBcIiBzdHJva2U9XCJyZ2IoMjU1LDI1NSwyNTUpXCIgc3Ryb2tlLXdpZHRoPVwiNFwiIHN0cm9rZS1saW5lY2FwPVwiYnV0dFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIi8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3N2Zz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJqcy1tb2RhbC1nYWxsZXJ5X19wcmV2aW91cyBtb2RhbC1nYWxsZXJ5X19wcmV2aW91c1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHN2ZyByb2xlPVwiYnV0dG9uXCIgd2lkdGg9XCI0NFwiIGhlaWdodD1cIjYwXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHBvbHlsaW5lIHBvaW50cz1cIjMwIDEwIDEwIDMwIDMwIDUwXCIgc3Ryb2tlPVwicmdiKDI1NSwyNTUsMjU1KVwiIHN0cm9rZS13aWR0aD1cIjRcIiBzdHJva2UtbGluZWNhcD1cImJ1dHRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zdmc+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwianMtbW9kYWwtZ2FsbGVyeV9fY2xvc2UgbW9kYWwtZ2FsbGVyeV9fY2xvc2VcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzdmcgcm9sZT1cImJ1dHRvblwiIHJvbGU9XCJidXR0b25cIiB3aWR0aD1cIjMwXCIgaGVpZ2h0PVwiMzBcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZyBzdHJva2U9XCJyZ2IoMjU1LDI1NSwyNTUpXCIgc3Ryb2tlLXdpZHRoPVwiNFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGluZSB4MT1cIjVcIiB5MT1cIjVcIiB4Mj1cIjI1XCIgeTI9XCIyNVwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpbmUgeDE9XCI1XCIgeTE9XCIyNVwiIHgyPVwiMjVcIiB5Mj1cIjVcIi8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9nPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zdmc+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtZ2FsbGVyeV9fdG90YWwganMtZ2FsbGVyeS10b3RhbHNcIj48L2Rpdj5gO1xuXG5leHBvcnQgY29uc3QgaXRlbSA9IGRldGFpbHMgPT4gYDxkaXYgY2xhc3M9XCJtb2RhbC1nYWxsZXJ5X19pdGVtIGpzLW1vZGFsLWdhbGxlcnlfX2l0ZW1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1nYWxsZXJ5X19pbWctY29udGFpbmVyIGpzLW1vZGFsLWdhbGxlcnlfX2ltZy1jb250YWluZXJcIj48L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICR7ZGV0YWlsc31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+YDtcblxuZXhwb3J0IGNvbnN0IGRldGFpbHMgPSBpdGVtID0+IGA8ZGl2IGNsYXNzPVwibW9kYWwtZ2FsbGVyeV9fZGV0YWlsc1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGgxIGNsYXNzPVwibW9kYWwtZ2FsbGVyeV9fdGl0bGVcIj4ke2l0ZW0udGl0bGV9PC9oMT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1nYWxsZXJ5X19kZXNjcmlwdGlvblwiPiR7aXRlbS5kZXNjcmlwdGlvbn08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+YDsiXX0=
