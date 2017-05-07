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
	} else items = src;

	return Object.assign(Object.create(_componentPrototype2.default), {
		items: items,
		settings: Object.assign({}, _defaults2.default, opts)
	}).init();
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
		    loaded = function loaded() {
			var srcsetAttribute = _this4.items[i].srcset ? ' srcset="' + _this4.items[i].srcset + '"' : '',
			    sizesAttribute = _this4.items[i].sizes ? ' sizes="' + _this4.items[i].sizes + '"' : '';
			imageContainer.innerHTML = '<img class="modal-gallery__img" src="' + _this4.items[i].src + '" alt="' + _this4.items[i].title + '"' + srcsetAttribute + sizesAttribute + '>';
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
    totals: true
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJleGFtcGxlL3NyYy9hcHAuanMiLCJleGFtcGxlL3NyYy9saWJzL2NvbXBvbmVudC9pbmRleC5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9jb21wb25lbnQtcHJvdG90eXBlLmpzIiwiZXhhbXBsZS9zcmMvbGlicy9jb21wb25lbnQvbGliL2RlZmF1bHRzLmpzIiwiZXhhbXBsZS9zcmMvbGlicy9jb21wb25lbnQvbGliL3RlbXBsYXRlcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUE7Ozs7Ozs7O0FBRUEsSUFBTSwyQkFBMkIsWUFBTSxBQUV0Qzs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTs7QUFFQTs7QUFFQTs7cUJBQUEsQUFBYSxLQUFiLEFBQWtCLEFBRWxCO0FBdEJELEFBQWdDLENBQUE7O0FBd0JoQyxJQUFHLHNCQUFILEFBQXlCLGVBQVEsQUFBTyxpQkFBUCxBQUF3QixvQkFBb0IsWUFBTSxBQUFFO3lCQUFBLEFBQXdCLFFBQVEsY0FBQTtTQUFBLEFBQU07QUFBdEMsQUFBOEM7QUFBbEcsQ0FBQTs7Ozs7Ozs7O0FDMUJqQzs7OztBQUNBOzs7Ozs7OztBQUVBLElBQU0sT0FBTyxTQUFQLEFBQU8sS0FBQSxBQUFDLEtBQUQsQUFBTSxNQUFTLEFBQzNCO0tBQUcsQ0FBQyxJQUFKLEFBQVEsUUFBUSxNQUFNLElBQUEsQUFBSSxNQUFWLEFBQU0sQUFBVSxBQUVoQzs7S0FBSSxhQUFKLEFBRUE7O0tBQUcsT0FBQSxBQUFPLFFBQVYsQUFBa0IsVUFBUyxBQUMxQjtNQUFJLE1BQU0sR0FBQSxBQUFHLE1BQUgsQUFBUyxLQUFLLFNBQUEsQUFBUyxpQkFBakMsQUFBVSxBQUFjLEFBQTBCLEFBRWxEOztNQUFHLENBQUMsSUFBSixBQUFRLFFBQVEsTUFBTSxJQUFBLEFBQUks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QUN6QjtRQUFJLFVBQVUsU0FBQSxBQUFTLGNBQXZCLEFBQWMsQUFBdUIsQUFFckM7O1lBQUEsQUFBUSxZQUFSLEFBQW9CLEFBQ3BCO1lBQUEsQUFBUSxhQUFSLEFBQXFCLFFBQXJCLEFBQTZCLEFBQzdCO1lBQUEsQUFBUSxhQUFSLEFBQXFCLFlBQXJCLEFBQWlDLEFBQ2pDO1lBQUEsQUFBUSxhQUFSLEFBQXFCLGVBQXJCLEFBQW9DLEFBRXBDOztXQUFBLEFBQU8sQUFDVjtBQVRNOztBQVdBLElBQU0sc0NBQWUsU0FBZixBQUFlLG9CQUFBO3dOQUFBLEFBRWMsUUFGZDtBQUFyQjs7QUF5QkEsSUFBTSxzQkFBTyxTQUFQLEFBQU8sY0FBQTtvT0FBQSxBQUVrQixVQUZsQjtBQUFiOztBQUtBLElBQU0sNEJBQVUsU0FBVixBQUFVLGNBQUE7MkhBQ2dELEtBRGhELEFBQ3FELGdHQUNFLEtBRnZELEFBRTRELGNBRjVEO0FBQWhCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCBNb2RhbEdhbGxlcnkgZnJvbSAnLi9saWJzL2NvbXBvbmVudCc7XG5cbmNvbnN0IG9uRE9NQ29udGVudExvYWRlZFRhc2tzID0gWygpID0+IHtcblxuXHQvLyBsZXQgZ2FsbGVyeSA9IE1vZGFsR2FsbGVyeS5pbml0KFtcblx0Ly8gXHR7XG5cdC8vIFx0XHRzcmM6ICdodHRwOi8vcGxhY2Vob2xkLml0LzUwMHg1MDAnLFxuXHQvLyBcdFx0c3Jjc2V0OidodHRwOi8vcGxhY2Vob2xkLml0LzgwMHg4MDAgODAwdywgaHR0cDovL3BsYWNlaG9sZC5pdC81MDB4NTAwIDMyMHcnLFxuXHQvLyBcdFx0dGl0bGU6ICdJbWFnZSAxJyxcblx0Ly8gXHRcdGRlc2NyaXB0aW9uOiAnRGVzY3JpcHRpb24gMSdcblx0Ly8gXHR9LFxuXHQvLyBcdHtcblx0Ly8gXHRcdHNyYzogJ2h0dHA6Ly9wbGFjZWhvbGQuaXQvMzAweDgwMCcsXG5cdC8vIFx0XHRzcmNzZXQ6J2h0dHA6Ly9wbGFjZWhvbGQuaXQvNTAweDgwMCA4MDB3LCBodHRwOi8vcGxhY2Vob2xkLml0LzMwMHg1MDAgMzIwdycsXG5cdC8vIFx0XHR0aXRsZTogJ0ltYWdlIDInLFxuXHQvLyBcdFx0ZGVzY3JpcHRpb246ICdEZXNjcmlwdGlvbiAyJ1xuXHQvLyBcdH1dKTtcblxuXHQvL2NvbnNvbGUubG9nKGdhbGxlcnkpO1xuXHRcblx0Ly9kb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuanMtbW9kYWwtZ2FsbGVyeV9fdHJpZ2dlcicpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZ2FsbGVyeS5vcGVuLmJpbmQoZ2FsbGVyeSwgMCkpO1xuXG5cdE1vZGFsR2FsbGVyeS5pbml0KCcuanMtbW9kYWwtZ2FsbGVyeScpO1xuXG59XTtcbiAgICBcbmlmKCdhZGRFdmVudExpc3RlbmVyJyBpbiB3aW5kb3cpIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4geyBvbkRPTUNvbnRlbnRMb2FkZWRUYXNrcy5mb3JFYWNoKGZuID0+IGZuKCkpOyB9KTsiLCJpbXBvcnQgZGVmYXVsdHMgZnJvbSAnLi9saWIvZGVmYXVsdHMnO1xuaW1wb3J0IGNvbXBvbmVudFByb3RvdHlwZSBmcm9tICcuL2xpYi9jb21wb25lbnQtcHJvdG90eXBlJztcblxuY29uc3QgaW5pdCA9IChzcmMsIG9wdHMpID0+IHtcblx0aWYoIXNyYy5sZW5ndGgpIHRocm93IG5ldyBFcnJvcignTW9kYWwgR2FsbGVyeSBjYW5ub3QgYmUgaW5pdGlhbGlzZWQsIG5vIGltYWdlcyBmb3VuZCcpO1xuXG5cdGxldCBpdGVtcztcblxuXHRpZih0eXBlb2Ygc3JjID09PSAnc3RyaW5nJyl7XG5cdFx0bGV0IGVscyA9IFtdLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChzcmMpKTtcblxuXHRcdGlmKCFlbHMubGVuZ3RoKSB0aHJvdyBuZXcgRXJyb3IoJ01vZGFsIEdhbGxlcnkgY2Fubm90IGJlIGluaXRpYWxpc2VkLCBubyBpbWFnZXMgZm91bmQnKTtcblx0XHRcblx0XHRpdGVtcyA9IGVscy5tYXAoZWwgPT4ge1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0dHJpZ2dlcjogZWwsXG5cdFx0XHRcdHNyYzogZWwuZ2V0QXR0cmlidXRlKCdocmVmJyksXG5cdFx0XHRcdHNyY3NldDogZWwuZ2V0QXR0cmlidXRlKCdkYXRhLXNyY3NldCcpIHx8IG51bGwsXG5cdFx0XHRcdHNpemVzOiBlbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtc2l6ZXMnKSB8fCBudWxsLFxuXHRcdFx0XHR0aXRsZTogZWwuZ2V0QXR0cmlidXRlKCdkYXRhLXRpdGxlJykgfHwgJycsXG5cdFx0XHRcdGRlc2NyaXB0aW9uOiBlbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtZGVzY3JpcHRpb24nKSB8fCAnJ1xuXHRcdFx0fTtcblx0XHR9KTtcblx0fSBlbHNlIGl0ZW1zID0gc3JjO1xuXHRcblx0cmV0dXJuIE9iamVjdC5hc3NpZ24oT2JqZWN0LmNyZWF0ZShjb21wb25lbnRQcm90b3R5cGUpLCB7XG5cdFx0aXRlbXM6IGl0ZW1zLFxuXHRcdHNldHRpbmdzOiBPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0cywgb3B0cylcblx0fSkuaW5pdCgpO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgeyBpbml0IH07IiwiaW1wb3J0IHsgb3ZlcmxheSwgb3ZlcmxheUlubmVyLCBpdGVtLCBkZXRhaWxzfSBmcm9tICcuL3RlbXBsYXRlcyc7XG5cbmNvbnN0IEtFWV9DT0RFUyA9IHtcblx0XHRUQUI6IDksXG5cdFx0RVNDOiAyNyxcblx0XHRMRUZUOiAzNyxcblx0XHRSSUdIVDogMzksXG5cdFx0RU5URVI6IDEzXG5cdH0sXG5cdFRSSUdHRVJfRVZFTlRTID0gW3dpbmRvdy5Qb2ludGVyRXZlbnQgPyAncG9pbnRlcmRvd24nIDogJ29udG91Y2hzdGFydCcgaW4gd2luZG93ID8gJ3RvdWNoc3RhcnQnIDogJ2NsaWNrJywgJ2tleWRvd24nIF07XG5cbmV4cG9ydCBkZWZhdWx0IHtcblx0aW5pdCgpIHtcblx0XHR0aGlzLmlzT3BlbiA9IGZhbHNlO1xuXHRcdHRoaXMuY3VycmVudCA9IGZhbHNlO1xuXHRcdHRoaXMuaW1hZ2VDYWNoZSA9IFtdO1xuXHRcdHRoaXMuaW5pdFVJKCk7XG5cdFx0dGhpcy5pbml0QnV0dG9ucygpO1xuXHRcdHRoaXMuZm9jdXNhYmxlQ2hpbGRyZW4gPSB0aGlzLmdldEZvY3VzYWJsZUNoaWxkcmVuKCk7XG5cdFx0dGhpcy5pdGVtc1swXS50cmlnZ2VyICYmIHRoaXMuaW5pdFRyaWdnZXJzKCk7XG5cdFx0dGhpcy5zZXR0aW5ncy5wcmVsb2FkICYmIHRoaXMuaXRlbXMuZm9yRWFjaCgoaXRlbSwgaSkgPT4geyB0aGlzLmxvYWRJbWFnZShpKTsgfSk7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH0sXG5cdGluaXRUcmlnZ2Vycygpe1xuXHRcdHRoaXMuaXRlbXMuZm9yRWFjaCgoaXRlbSwgaSkgPT4ge1xuXHRcdFx0VFJJR0dFUl9FVkVOVFMuZm9yRWFjaChldiA9PiB7XG5cdFx0XHRcdGl0ZW0udHJpZ2dlci5hZGRFdmVudExpc3RlbmVyKGV2LCBlID0+IHtcblx0XHRcdFx0XHRpZihlLmtleUNvZGUgJiYgZS5rZXlDb2RlICE9PSBLRVlfQ09ERVMuRU5URVIpIHJldHVybjtcblx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0ZS5zdG9wUHJvcGFnYXRpb24oKTtcblx0XHRcdFx0XHR0aGlzLm9wZW4oaSk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cdFx0fSk7XG5cdH0sXG5cdGluaXRVSSgpe1xuXHRcdHRoaXMuRE9NT3ZlcmxheSA9IGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQob3ZlcmxheSgpKTtcblx0XHR0aGlzLkRPTU92ZXJsYXkuaW5zZXJ0QWRqYWNlbnRIVE1MKCdiZWZvcmVlbmQnLCBvdmVybGF5SW5uZXIodGhpcy5pdGVtcy5tYXAoZGV0YWlscykubWFwKGl0ZW0pLmpvaW4oJycpKSk7XG5cdFx0dGhpcy5ET01JdGVtcyA9IFtdLnNsaWNlLmNhbGwodGhpcy5ET01PdmVybGF5LnF1ZXJ5U2VsZWN0b3JBbGwoJy5qcy1tb2RhbC1nYWxsZXJ5X19pdGVtJykpO1xuXHRcdHRoaXMuRE9NVG90YWxzID0gdGhpcy5ET01PdmVybGF5LnF1ZXJ5U2VsZWN0b3IoJy5qcy1nYWxsZXJ5LXRvdGFscycpO1xuXHRcdHJldHVybiB0aGlzO1xuXHR9LFxuXHRpbml0QnV0dG9ucygpe1xuXHRcdHRoaXMuY2xvc2VCdG4gPSB0aGlzLkRPTU92ZXJsYXkucXVlcnlTZWxlY3RvcignLmpzLW1vZGFsLWdhbGxlcnlfX2Nsb3NlJyk7XG5cdFx0dGhpcy5jbG9zZUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuY2xvc2UuYmluZCh0aGlzKSk7XG5cblx0XHRpZiAodGhpcy5pdGVtcy5sZW5ndGggPCAyKSB7XG5cdFx0XHR0aGlzLkRPTU92ZXJsYXkucmVtb3ZlQ2hpbGQodGhpcy5ET01PdmVybGF5LnF1ZXJ5U2VsZWN0b3IoJy5qcy1tb2RhbC1nYWxsZXJ5X19wcmV2aW91cycpKTtcblx0XHRcdHRoaXMuRE9NT3ZlcmxheS5yZW1vdmVDaGlsZCh0aGlzLkRPTU92ZXJsYXkucXVlcnlTZWxlY3RvcignLmpzLW1vZGFsLWdhbGxlcnlfX25leHQnKSk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dGhpcy5wcmV2aW91c0J0biA9IHRoaXMuRE9NT3ZlcmxheS5xdWVyeVNlbGVjdG9yKCcuanMtbW9kYWwtZ2FsbGVyeV9fcHJldmlvdXMnKTtcblx0XHR0aGlzLm5leHRCdG4gPSB0aGlzLkRPTU92ZXJsYXkucXVlcnlTZWxlY3RvcignLmpzLW1vZGFsLWdhbGxlcnlfX25leHQnKTtcblxuXHRcdFRSSUdHRVJfRVZFTlRTLmZvckVhY2goZXYgPT4ge1xuXHRcdFx0WydwcmV2aW91cycsICduZXh0J10uZm9yRWFjaCh0eXBlID0+IHtcblx0XHRcdFx0dGhpc1tgJHt0eXBlfUJ0bmBdLmFkZEV2ZW50TGlzdGVuZXIoZXYsIGUgPT4ge1xuXHRcdFx0XHRcdGlmKGUua2V5Q29kZSAmJiBlLmtleUNvZGUgIT09IEtFWV9DT0RFUy5FTlRFUikgcmV0dXJuO1xuXHRcdFx0XHRcdHRoaXNbdHlwZV0oKTtcblx0XHRcdFx0fSlcblx0XHRcdH0pO1xuXHRcdH0pO1xuXHR9LFxuXHR3cml0ZVRvdGFscygpIHsgdGhpcy5ET01Ub3RhbHMuaW5uZXJIVE1MID0gYCR7dGhpcy5jdXJyZW50ICsgMX0vJHt0aGlzLml0ZW1zLmxlbmd0aH1gOyB9LFxuXHRsb2FkSW1hZ2UoaSkge1xuXHRcdGxldCBpbWcgPSBuZXcgSW1hZ2UoKSxcblx0XHRcdGltYWdlQ29udGFpbmVyID0gdGhpcy5ET01JdGVtc1tpXS5xdWVyeVNlbGVjdG9yKCcuanMtbW9kYWwtZ2FsbGVyeV9faW1nLWNvbnRhaW5lcicpLFxuXHRcdFx0bG9hZGVkID0gKCkgPT4ge1xuXHRcdFx0XHRsZXQgc3Jjc2V0QXR0cmlidXRlID0gdGhpcy5pdGVtc1tpXS5zcmNzZXQgPyBgIHNyY3NldD1cIiR7dGhpcy5pdGVtc1tpXS5zcmNzZXR9XCJgIDogJycsXG5cdFx0XHRcdFx0c2l6ZXNBdHRyaWJ1dGUgPSB0aGlzLml0ZW1zW2ldLnNpemVzID8gYCBzaXplcz1cIiR7dGhpcy5pdGVtc1tpXS5zaXplc31cImAgOiAnJztcblx0XHRcdFx0aW1hZ2VDb250YWluZXIuaW5uZXJIVE1MID0gYDxpbWcgY2xhc3M9XCJtb2RhbC1nYWxsZXJ5X19pbWdcIiBzcmM9XCIke3RoaXMuaXRlbXNbaV0uc3JjfVwiIGFsdD1cIiR7dGhpcy5pdGVtc1tpXS50aXRsZX1cIiR7c3Jjc2V0QXR0cmlidXRlfSR7c2l6ZXNBdHRyaWJ1dGV9PmA7XG5cdFx0XHRcdHRoaXMuRE9NSXRlbXNbaV0uY2xhc3NMaXN0LnJlbW92ZSgnbG9hZGluZycpO1xuXHRcdFx0XHRpbWcub25sb2FkID0gbnVsbDtcblx0XHRcdH07XG5cdFx0aW1nLm9ubG9hZCA9IGxvYWRlZDtcblx0XHRpbWcuc3JjID0gdGhpcy5pdGVtc1tpXS5zcmM7XG5cdFx0aW1nLm9uZXJyb3IgPSAoKSA9PiB7XG5cdFx0XHR0aGlzLkRPTUl0ZW1zW2ldLmNsYXNzTGlzdC5yZW1vdmUoJ2xvYWRpbmcnKTtcblx0XHRcdHRoaXMuRE9NSXRlbXNbaV0uY2xhc3NMaXN0LmFkZCgnZXJyb3InKTtcblx0XHR9O1xuXHRcdGlmKGltZy5jb21wbGV0ZSkgbG9hZGVkKCk7XG5cdH0sXG5cdGxvYWRJbWFnZXMoaSl7XG5cdFx0aWYodGhpcy5pbWFnZUNhY2hlLmxlbmd0aCA9PT0gdGhpcy5pdGVtcykgcmV0dXJuO1xuXG5cdFx0bGV0IGluZGV4ZXMgPSBbaV07XG5cblx0XHRpZih0aGlzLml0ZW1zLmxlbmd0aCA+IDEpIGluZGV4ZXMucHVzaChpID09PSAwID8gdGhpcy5pdGVtcy5sZW5ndGggLSAxIDogaSAtIDEpO1xuXHRcdGlmKHRoaXMuaXRlbXMubGVuZ3RoID4gMikgaW5kZXhlcy5wdXNoKGkgPT09IHRoaXMuaXRlbXMubGVuZ3RoIC0gMSA/IDAgOiBpICsgMSk7XG5cblx0XHRpbmRleGVzLmZvckVhY2goaWR4ID0+IHtcblx0XHRcdGlmKHRoaXMuaW1hZ2VDYWNoZVtpZHhdID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0dGhpcy5ET01JdGVtc1tpZHhdLmNsYXNzTGlzdC5hZGQoJ2xvYWRpbmcnKTtcblx0XHRcdFx0dGhpcy5sb2FkSW1hZ2UoaWR4KTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHR9LFxuXHRnZXRGb2N1c2FibGVDaGlsZHJlbigpIHtcblx0XHRsZXQgZm9jdXNhYmxlRWxlbWVudHMgPSBbJ2FbaHJlZl0nLCAnYXJlYVtocmVmXScsICdpbnB1dDpub3QoW2Rpc2FibGVkXSknLCAnc2VsZWN0Om5vdChbZGlzYWJsZWRdKScsICd0ZXh0YXJlYTpub3QoW2Rpc2FibGVkXSknLCAnYnV0dG9uOm5vdChbZGlzYWJsZWRdKScsICdpZnJhbWUnLCAnb2JqZWN0JywgJ2VtYmVkJywgJ1tjb250ZW50ZWRpdGFibGVdJywgJ1t0YWJpbmRleF06bm90KFt0YWJpbmRleD1cIi0xXCJdKSddO1xuXG5cdFx0cmV0dXJuIFtdLnNsaWNlLmNhbGwodGhpcy5ET01PdmVybGF5LnF1ZXJ5U2VsZWN0b3JBbGwoZm9jdXNhYmxlRWxlbWVudHMuam9pbignLCcpKSk7XG5cdH0sXG5cdHRyYXBUYWIoZSl7XG5cdFx0bGV0IGZvY3VzZWRJbmRleCA9IHRoaXMuZm9jdXNhYmxlQ2hpbGRyZW4uaW5kZXhPZihkb2N1bWVudC5hY3RpdmVFbGVtZW50KTtcblx0XHRpZihlLnNoaWZ0S2V5ICYmIGZvY3VzZWRJbmRleCA9PT0gMCkge1xuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0dGhpcy5mb2N1c2FibGVDaGlsZHJlblt0aGlzLmZvY3VzYWJsZUNoaWxkcmVuLmxlbmd0aCAtIDFdLmZvY3VzKCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGlmKCFlLnNoaWZ0S2V5ICYmIGZvY3VzZWRJbmRleCA9PT0gdGhpcy5mb2N1c2FibGVDaGlsZHJlbi5sZW5ndGggLSAxKSB7XG5cdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0dGhpcy5mb2N1c2FibGVDaGlsZHJlblswXS5mb2N1cygpO1xuXHRcdFx0fVxuXHRcdH1cblx0fSxcblx0a2V5TGlzdGVuZXIoZSl7XG5cdFx0aWYoIXRoaXMuaXNPcGVuKSByZXR1cm47XG5cblx0XHRzd2l0Y2ggKGUua2V5Q29kZSkge1xuXHRcdGNhc2UgS0VZX0NPREVTLkVTQzpcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdHRoaXMudG9nZ2xlKCk7XG5cdFx0XHRicmVhaztcblx0XHRjYXNlIEtFWV9DT0RFUy5UQUI6XG5cdFx0XHR0aGlzLnRyYXBUYWIoZSk7XG5cdFx0XHRicmVhaztcblx0XHRjYXNlIEtFWV9DT0RFUy5MRUZUOlxuXHRcdFx0dGhpcy5wcmV2aW91cygpO1xuXHRcdFx0YnJlYWs7XG5cdFx0Y2FzZSBLRVlfQ09ERVMuUklHSFQ6XG5cdFx0XHR0aGlzLm5leHQoKTtcblx0XHRcdGJyZWFrO1xuXHRcdGRlZmF1bHQ6XG5cdFx0XHRicmVhaztcblx0XHR9XG5cdH0sXG5cdGluY3JlbWVudERlY3JlbWVudChmbil7XG5cdFx0dGhpcy5jdXJyZW50ICE9PSBmYWxzZSAmJiB0aGlzLkRPTUl0ZW1zW3RoaXMuY3VycmVudF0uY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdFx0dGhpcy5jdXJyZW50ID0gZm4oKTtcblx0XHR0aGlzLkRPTUl0ZW1zW3RoaXMuY3VycmVudF0uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG5cdFx0dGhpcy5sb2FkSW1hZ2VzKHRoaXMuY3VycmVudCk7XG5cdFx0KHRoaXMuaXRlbXMubGVuZ3RoID4gMSAmJiB0aGlzLnNldHRpbmdzLnRvdGFscykgJiYgdGhpcy53cml0ZVRvdGFscygpO1xuXHR9LFxuXHRwcmV2aW91cygpeyB0aGlzLmluY3JlbWVudERlY3JlbWVudCgoKSA9PiAodGhpcy5jdXJyZW50ID09PSAwID8gdGhpcy5ET01JdGVtcy5sZW5ndGggLSAxIDogdGhpcy5jdXJyZW50IC0gMSkpOyB9LFxuXHRuZXh0KCl7IHRoaXMuaW5jcmVtZW50RGVjcmVtZW50KCgpID0+ICh0aGlzLmN1cnJlbnQgPT09IHRoaXMuRE9NSXRlbXMubGVuZ3RoIC0gMSA/IDAgOiB0aGlzLmN1cnJlbnQgKyAxKSk7IH0sXG5cdG9wZW4oaSl7XG5cdFx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRoaXMua2V5TGlzdGVuZXIuYmluZCh0aGlzKSk7XG5cdFx0dGhpcy5sb2FkSW1hZ2VzKGkpO1xuXHRcdHRoaXMubGFzdEZvY3VzZWQgPSAgZG9jdW1lbnQuYWN0aXZlRWxlbWVudDtcblx0XHR0aGlzLmZvY3VzYWJsZUNoaWxkcmVuLmxlbmd0aCAmJiB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpe3RoaXMuZm9jdXNhYmxlQ2hpbGRyZW5bMF0uZm9jdXMoKTt9LmJpbmQodGhpcyksIDApO1xuXHRcdHRoaXMuRE9NSXRlbXNbaSB8fCAwXS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcblx0XHR0aGlzLnRvZ2dsZShpIHx8IDApO1xuXHR9LFxuXHRjbG9zZSgpe1xuXHRcdGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLmtleUxpc3RlbmVyLmJpbmQodGhpcykpO1xuXHRcdHRoaXMubGFzdEZvY3VzZWQgJiYgdGhpcy5sYXN0Rm9jdXNlZC5mb2N1cygpO1xuXHRcdHRoaXMuRE9NSXRlbXNbdGhpcy5jdXJyZW50XS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcblx0XHR0aGlzLnRvZ2dsZShudWxsKTtcblx0fSxcblx0dG9nZ2xlKGkpe1xuXHRcdHRoaXMuaXNPcGVuID0gIXRoaXMuaXNPcGVuO1xuXHRcdHRoaXMuY3VycmVudCA9IGk7XG5cdFx0dGhpcy5ET01PdmVybGF5LmNsYXNzTGlzdC50b2dnbGUoJ2FjdGl2ZScpO1xuXHRcdHRoaXMuRE9NT3ZlcmxheS5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgIXRoaXMuaXNPcGVuKTtcblx0XHR0aGlzLkRPTU92ZXJsYXkuc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsIHRoaXMuaXNPcGVuID8gJzAnIDogJy0xJyk7XG5cdFx0dGhpcy5zZXR0aW5ncy5mdWxsc2NyZWVuICYmIHRoaXMudG9nZ2xlRnVsbFNjcmVlbigpO1xuXHRcdCh0aGlzLml0ZW1zLmxlbmd0aCA+IDEgJiYgdGhpcy5zZXR0aW5ncy50b3RhbHMpICYmIHRoaXMud3JpdGVUb3RhbHMoKTtcblx0fSxcblx0dG9nZ2xlRnVsbFNjcmVlbigpe1xuXHRcdGlmKHRoaXMuaXNPcGVuKXtcblx0XHRcdHRoaXMuRE9NT3ZlcmxheS5yZXF1ZXN0RnVsbHNjcmVlbiAmJiB0aGlzLkRPTU92ZXJsYXkucmVxdWVzdEZ1bGxzY3JlZW4oKTtcblx0XHRcdHRoaXMuRE9NT3ZlcmxheS53ZWJraXRSZXF1ZXN0RnVsbHNjcmVlbiAmJiB0aGlzLkRPTU92ZXJsYXkud2Via2l0UmVxdWVzdEZ1bGxzY3JlZW4oKTtcblx0XHRcdHRoaXMuRE9NT3ZlcmxheS5tb3pSZXF1ZXN0RnVsbFNjcmVlbiAmJiB0aGlzLkRPTU92ZXJsYXkubW96UmVxdWVzdEZ1bGxTY3JlZW4oKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0ZG9jdW1lbnQuZXhpdEZ1bGxzY3JlZW4gJiYgZG9jdW1lbnQuZXhpdEZ1bGxzY3JlZW4oKTtcblx0XHRcdGRvY3VtZW50Lm1vekNhbmNlbEZ1bGxTY3JlZW4gJiYgZG9jdW1lbnQubW96Q2FuY2VsRnVsbFNjcmVlbigpO1xuXHRcdFx0ZG9jdW1lbnQud2Via2l0RXhpdEZ1bGxzY3JlZW4gJiYgZG9jdW1lbnQud2Via2l0RXhpdEZ1bGxzY3JlZW4oKTtcblx0XHR9XG5cdH1cbn07IiwiZXhwb3J0IGRlZmF1bHQge1xuICAgIGZ1bGxzY3JlZW46IGZhbHNlLFxuICAgIHByZWxvYWQ6IGZhbHNlLFxuICAgIHRvdGFsczogdHJ1ZVxufTsiLCJleHBvcnQgY29uc3Qgb3ZlcmxheSA9ICgpID0+IHtcbiAgICBsZXQgb3ZlcmxheSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXG4gICAgb3ZlcmxheS5jbGFzc05hbWUgPSAnbW9kYWwtZ2FsbGVyeV9fb3V0ZXIganMtbW9kYWwtZ2FsbGVyeV9fb3V0ZXInO1xuICAgIG92ZXJsYXkuc2V0QXR0cmlidXRlKCdyb2xlJywgJ2RpYWxvZycpO1xuICAgIG92ZXJsYXkuc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsICctMScpO1xuICAgIG92ZXJsYXkuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsIHRydWUpO1xuXG4gICAgcmV0dXJuIG92ZXJsYXk7XG59O1xuXG5leHBvcnQgY29uc3Qgb3ZlcmxheUlubmVyID0gaXRlbXMgPT4gYDxkaXYgY2xhc3M9XCJtb2RhbC1nYWxsZXJ5X19pbm5lciBqcy1tb2RhbC1nYWxsZXJ5X19pbm5lclwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWdhbGxlcnlfX2NvbnRlbnQganMtbW9kYWwtZ2FsbGVyeV9fY29udGVudFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICR7aXRlbXN9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJqcy1tb2RhbC1nYWxsZXJ5X19uZXh0IG1vZGFsLWdhbGxlcnlfX25leHRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzdmcgcm9sZT1cImJ1dHRvblwiIHJvbGU9XCJidXR0b25cIiB3aWR0aD1cIjQ0XCIgaGVpZ2h0PVwiNjBcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cG9seWxpbmUgcG9pbnRzPVwiMTQgMTAgMzQgMzAgMTQgNTBcIiBzdHJva2U9XCJyZ2IoMjU1LDI1NSwyNTUpXCIgc3Ryb2tlLXdpZHRoPVwiNFwiIHN0cm9rZS1saW5lY2FwPVwiYnV0dFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIi8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3N2Zz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJqcy1tb2RhbC1nYWxsZXJ5X19wcmV2aW91cyBtb2RhbC1nYWxsZXJ5X19wcmV2aW91c1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHN2ZyByb2xlPVwiYnV0dG9uXCIgd2lkdGg9XCI0NFwiIGhlaWdodD1cIjYwXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHBvbHlsaW5lIHBvaW50cz1cIjMwIDEwIDEwIDMwIDMwIDUwXCIgc3Ryb2tlPVwicmdiKDI1NSwyNTUsMjU1KVwiIHN0cm9rZS13aWR0aD1cIjRcIiBzdHJva2UtbGluZWNhcD1cImJ1dHRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zdmc+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwianMtbW9kYWwtZ2FsbGVyeV9fY2xvc2UgbW9kYWwtZ2FsbGVyeV9fY2xvc2VcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzdmcgcm9sZT1cImJ1dHRvblwiIHJvbGU9XCJidXR0b25cIiB3aWR0aD1cIjMwXCIgaGVpZ2h0PVwiMzBcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZyBzdHJva2U9XCJyZ2IoMjU1LDI1NSwyNTUpXCIgc3Ryb2tlLXdpZHRoPVwiNFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGluZSB4MT1cIjVcIiB5MT1cIjVcIiB4Mj1cIjI1XCIgeTI9XCIyNVwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpbmUgeDE9XCI1XCIgeTE9XCIyNVwiIHgyPVwiMjVcIiB5Mj1cIjVcIi8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9nPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zdmc+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtZ2FsbGVyeV9fdG90YWwganMtZ2FsbGVyeS10b3RhbHNcIj48L2Rpdj5gO1xuXG5leHBvcnQgY29uc3QgaXRlbSA9IGRldGFpbHMgPT4gYDxkaXYgY2xhc3M9XCJtb2RhbC1nYWxsZXJ5X19pdGVtIGpzLW1vZGFsLWdhbGxlcnlfX2l0ZW1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1nYWxsZXJ5X19pbWctY29udGFpbmVyIGpzLW1vZGFsLWdhbGxlcnlfX2ltZy1jb250YWluZXJcIj48L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICR7ZGV0YWlsc31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+YDtcblxuZXhwb3J0IGNvbnN0IGRldGFpbHMgPSBpdGVtID0+IGA8ZGl2IGNsYXNzPVwibW9kYWwtZ2FsbGVyeV9fZGV0YWlsc1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGgxIGNsYXNzPVwibW9kYWwtZ2FsbGVyeV9fdGl0bGVcIj4ke2l0ZW0udGl0bGV9PC9oMT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1nYWxsZXJ5X19kZXNjcmlwdGlvblwiPiR7aXRlbS5kZXNjcmlwdGlvbn08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+YDsiXX0=
