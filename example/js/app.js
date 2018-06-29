(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

var _component = require('./libs/component');

var _component2 = _interopRequireDefault(_component);

function _interopRequireDefault(obj) {
	return obj && obj.__esModule ? obj : { default: obj };
}

var onDOMContentLoadedTasks = [function () {

	var gallery = _component2.default.init([{
		src: 'http://placehold.it/500x500',
		srcset: 'http://placehold.it/800x800 800w, http://placehold.it/500x500 320w',
		title: 'Image 1',
		description: 'Description 1'
	}, {
		src: 'http://placehold.it/300x800',
		srcset: 'http://placehold.it/500x800 800w, http://placehold.it/300x500 320w',
		title: 'Image 2',
		description: 'Description 2'
	}]);

	//console.log(gallery);

	// document.querySelector('.js-modal-gallery__trigger').addEventListener('click', gallery.open.bind(gallery, 0));

	_component2.default.init('.js-modal-gallery');

	// ModalGallery.init('.js-modal-single', {
	// 	single: true
	// });
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
	initUI: function initUI(i) {
		var _this3 = this;

		this.DOMOverlay = document.body.appendChild((0, _templates.overlay)());
		this.DOMOverlay.insertAdjacentHTML('beforeend', (0, _templates.overlayInner)(this.items.map(_templates.details).map(_templates.item).join('')));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJleGFtcGxlL3NyYy9hcHAuanMiLCJleGFtcGxlL3NyYy9saWJzL2NvbXBvbmVudC9pbmRleC5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9jb21wb25lbnQtcHJvdG90eXBlLmpzIiwiZXhhbXBsZS9zcmMvbGlicy9jb21wb25lbnQvbGliL2RlZmF1bHRzLmpzIiwiZXhhbXBsZS9zcmMvbGlicy9jb21wb25lbnQvbGliL3RlbXBsYXRlcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUEsSUFBQSxhQUFBLFFBQUEsa0JBQUEsQ0FBQTs7Ozs7Ozs7QUFFQSxJQUFNLDBCQUEwQixDQUFDLFlBQU07O0FBRXRDLEtBQUksVUFBVSxZQUFBLE9BQUEsQ0FBQSxJQUFBLENBQWtCLENBQy9CO0FBQ0MsT0FERCw2QkFBQTtBQUVDLFVBRkQsb0VBQUE7QUFHQyxTQUhELFNBQUE7QUFJQyxlQUFhO0FBSmQsRUFEK0IsRUFPL0I7QUFDQyxPQURELDZCQUFBO0FBRUMsVUFGRCxvRUFBQTtBQUdDLFNBSEQsU0FBQTtBQUlDLGVBQWE7QUFKZCxFQVArQixDQUFsQixDQUFkOztBQWNBOztBQUVBOztBQUVBLGFBQUEsT0FBQSxDQUFBLElBQUEsQ0FBQSxtQkFBQTs7QUFFQTtBQUNBO0FBQ0E7QUF4QkQsQ0FBZ0MsQ0FBaEM7O0FBNEJBLElBQUcsc0JBQUgsTUFBQSxFQUFpQyxPQUFBLGdCQUFBLENBQUEsa0JBQUEsRUFBNEMsWUFBTTtBQUFFLHlCQUFBLE9BQUEsQ0FBZ0MsVUFBQSxFQUFBLEVBQUE7QUFBQSxTQUFBLElBQUE7QUFBaEMsRUFBQTtBQUFwRCxDQUFBOzs7Ozs7Ozs7QUM5QmpDLElBQUEsWUFBQSxRQUFBLGdCQUFBLENBQUE7Ozs7QUFDQSxJQUFBLHNCQUFBLFFBQUEsMkJBQUEsQ0FBQTs7Ozs7Ozs7QUFFQSxJQUFNLFNBQVMsU0FBVCxNQUFTLENBQUEs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WCxnQkFEVyxLQUFBO0FBRVgsYUFGVyxLQUFBO0FBR1gsWUFIVyxJQUFBO0FBSVgsZ0JBSlcsS0FBQTtBQUtYLFlBQVE7QUFMRyxDOzs7Ozs7OztBQ0FSLElBQU0sVUFBQSxRQUFBLE9BQUEsR0FBVSxTQUFBLE9BQUEsR0FBTTtBQUN6QixRQUFJLFVBQVUsU0FBQSxhQUFBLENBQWQsS0FBYyxDQUFkOztBQUVBLFlBQUEsU0FBQSxHQUFBLDhDQUFBO0FBQ0EsWUFBQSxZQUFBLENBQUEsTUFBQSxFQUFBLFFBQUE7QUFDQSxZQUFBLFlBQUEsQ0FBQSxVQUFBLEVBQUEsSUFBQTtBQUNBLFlBQUEsWUFBQSxDQUFBLGFBQUEsRUFBQSxJQUFBOztBQUVBLFdBQUEsT0FBQTtBQVJHLENBQUE7O0FBV0EsSUFBTSxlQUFBLFFBQUEsWUFBQSxHQUFlLFNBQWYsWUFBZSxDQUFBLEtBQUEsRUFBQTtBQUFBLFdBQUEsNk1BQUEsS0FBQSxHQUFBLDBuREFBQTtBQUFyQixDQUFBOztBQXlCQSxJQUFNLE9BQUEsUUFBQSxJQUFBLEdBQU8sU0FBUCxJQUFPLENBQUEsT0FBQSxFQUFBO0FBQUEsV0FBQSx5TkFBQSxPQUFBLEdBQUEsMENBQUE7QUFBYixDQUFBOztBQUtBLElBQU0sVUFBQSxRQUFBLE9BQUEsR0FBVSxTQUFWLE9BQVUsQ0FBQSxJQUFBLEVBQUE7QUFBQSxXQUFBLGdIQUNnRCxLQURoRCxLQUFBLEdBQUEscUZBQUEsR0FFdUQsS0FGdkQsV0FBQSxHQUFBLGdEQUFBO0FBQWhCLENBQUEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJpbXBvcnQgTW9kYWxHYWxsZXJ5IGZyb20gJy4vbGlicy9jb21wb25lbnQnO1xuXG5jb25zdCBvbkRPTUNvbnRlbnRMb2FkZWRUYXNrcyA9IFsoKSA9PiB7XG5cblx0bGV0IGdhbGxlcnkgPSBNb2RhbEdhbGxlcnkuaW5pdChbXG5cdFx0e1xuXHRcdFx0c3JjOiAnaHR0cDovL3BsYWNlaG9sZC5pdC81MDB4NTAwJyxcblx0XHRcdHNyY3NldDonaHR0cDovL3BsYWNlaG9sZC5pdC84MDB4ODAwIDgwMHcsIGh0dHA6Ly9wbGFjZWhvbGQuaXQvNTAweDUwMCAzMjB3Jyxcblx0XHRcdHRpdGxlOiAnSW1hZ2UgMScsXG5cdFx0XHRkZXNjcmlwdGlvbjogJ0Rlc2NyaXB0aW9uIDEnXG5cdFx0fSxcblx0XHR7XG5cdFx0XHRzcmM6ICdodHRwOi8vcGxhY2Vob2xkLml0LzMwMHg4MDAnLFxuXHRcdFx0c3Jjc2V0OidodHRwOi8vcGxhY2Vob2xkLml0LzUwMHg4MDAgODAwdywgaHR0cDovL3BsYWNlaG9sZC5pdC8zMDB4NTAwIDMyMHcnLFxuXHRcdFx0dGl0bGU6ICdJbWFnZSAyJyxcblx0XHRcdGRlc2NyaXB0aW9uOiAnRGVzY3JpcHRpb24gMidcblx0XHR9XSk7XG5cblx0Ly9jb25zb2xlLmxvZyhnYWxsZXJ5KTtcblx0XG5cdC8vIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5qcy1tb2RhbC1nYWxsZXJ5X190cmlnZ2VyJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBnYWxsZXJ5Lm9wZW4uYmluZChnYWxsZXJ5LCAwKSk7XG5cblx0TW9kYWxHYWxsZXJ5LmluaXQoJy5qcy1tb2RhbC1nYWxsZXJ5Jyk7XG5cblx0Ly8gTW9kYWxHYWxsZXJ5LmluaXQoJy5qcy1tb2RhbC1zaW5nbGUnLCB7XG5cdC8vIFx0c2luZ2xlOiB0cnVlXG5cdC8vIH0pO1xuXG59XTtcbiAgICBcbmlmKCdhZGRFdmVudExpc3RlbmVyJyBpbiB3aW5kb3cpIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4geyBvbkRPTUNvbnRlbnRMb2FkZWRUYXNrcy5mb3JFYWNoKGZuID0+IGZuKCkpOyB9KTsiLCJpbXBvcnQgZGVmYXVsdHMgZnJvbSAnLi9saWIvZGVmYXVsdHMnO1xuaW1wb3J0IGNvbXBvbmVudFByb3RvdHlwZSBmcm9tICcuL2xpYi9jb21wb25lbnQtcHJvdG90eXBlJztcblxuY29uc3QgY3JlYXRlID0gKGl0ZW1zLCBvcHRzKSA9PiBPYmplY3QuYXNzaWduKE9iamVjdC5jcmVhdGUoY29tcG9uZW50UHJvdG90eXBlKSwge1xuXHRcdGl0ZW1zOiBpdGVtcyxcblx0XHRzZXR0aW5nczogT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdHMsIG9wdHMpXG5cdH0pLmluaXQoKTtcblxuY29uc3Qgc2luZ2xlcyA9IChzcmMsIG9wdHMpID0+IHtcblx0bGV0IGVscyA9IFtdLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChzcmMpKTtcblxuXHRpZighZWxzLmxlbmd0aCkgdGhyb3cgbmV3IEVycm9yKCdNb2RhbCBHYWxsZXJ5IGNhbm5vdCBiZSBpbml0aWFsaXNlZCwgbm8gaW1hZ2VzIGZvdW5kJyk7XG5cblx0cmV0dXJuIGVscy5tYXAoZWwgPT4gY3JlYXRlKFt7XG5cdFx0dHJpZ2dlcjogZWwsXG5cdFx0c3JjOiBlbC5nZXRBdHRyaWJ1dGUoJ2hyZWYnKSxcblx0XHRzcmNzZXQ6IGVsLmdldEF0dHJpYnV0ZSgnZGF0YS1zcmNzZXQnKSB8fCBudWxsLFxuXHRcdHNpemVzOiBlbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtc2l6ZXMnKSB8fCBudWxsLFxuXHRcdHRpdGxlOiBlbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtdGl0bGUnKSB8fCAnJyxcblx0XHRkZXNjcmlwdGlvbjogZWwuZ2V0QXR0cmlidXRlKCdkYXRhLWRlc2NyaXB0aW9uJykgfHwgJydcblx0fV0sIG9wdHMpKTtcbn07XG5cbmNvbnN0IGdhbGxlcmllcyA9IChzcmMsIG9wdHMpID0+IHtcblx0bGV0IGl0ZW1zO1xuXG5cdGlmKHR5cGVvZiBzcmMgPT09ICdzdHJpbmcnKXtcblx0XHRsZXQgZWxzID0gW10uc2xpY2UuY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHNyYykpO1xuXG5cdFx0aWYoIWVscy5sZW5ndGgpIHRocm93IG5ldyBFcnJvcignTW9kYWwgR2FsbGVyeSBjYW5ub3QgYmUgaW5pdGlhbGlzZWQsIG5vIGltYWdlcyBmb3VuZCcpO1xuXHRcdFxuXHRcdGl0ZW1zID0gZWxzLm1hcChlbCA9PiB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHR0cmlnZ2VyOiBlbCxcblx0XHRcdFx0c3JjOiBlbC5nZXRBdHRyaWJ1dGUoJ2hyZWYnKSxcblx0XHRcdFx0c3Jjc2V0OiBlbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtc3Jjc2V0JykgfHwgbnVsbCxcblx0XHRcdFx0c2l6ZXM6IGVsLmdldEF0dHJpYnV0ZSgnZGF0YS1zaXplcycpIHx8IG51bGwsXG5cdFx0XHRcdHRpdGxlOiBlbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtdGl0bGUnKSB8fCAnJyxcblx0XHRcdFx0ZGVzY3JpcHRpb246IGVsLmdldEF0dHJpYnV0ZSgnZGF0YS1kZXNjcmlwdGlvbicpIHx8ICcnXG5cdFx0XHR9O1xuXHRcdH0pO1xuXHR9IGVsc2UgaXRlbXMgPSBzcmM7XG5cblx0cmV0dXJuIGNyZWF0ZShpdGVtcywgb3B0cyk7XG59O1xuXG5jb25zdCBpbml0ID0gKHNyYywgb3B0cykgPT4ge1xuXHRpZighc3JjLmxlbmd0aCkgdGhyb3cgbmV3IEVycm9yKCdNb2RhbCBHYWxsZXJ5IGNhbm5vdCBiZSBpbml0aWFsaXNlZCwgbm8gaW1hZ2VzIGZvdW5kJyk7XG5cblx0aWYob3B0cyAmJiBvcHRzLnNpbmdsZSkgcmV0dXJuIHNpbmdsZXMoc3JjLCBvcHRzKTtcblx0ZWxzZSByZXR1cm4gZ2FsbGVyaWVzKHNyYywgb3B0cyk7XG5cdFxufTtcblxuZXhwb3J0IGRlZmF1bHQgeyBpbml0IH07IiwiaW1wb3J0IHsgXG5cdG92ZXJsYXksXG5cdG92ZXJsYXlJbm5lcixcblx0aXRlbSxcblx0ZGV0YWlsc1xufSBmcm9tICcuL3RlbXBsYXRlcyc7XG5cbmNvbnN0IEtFWV9DT0RFUyA9IHtcblx0XHRUQUI6IDksXG5cdFx0RVNDOiAyNyxcblx0XHRMRUZUOiAzNyxcblx0XHRSSUdIVDogMzksXG5cdFx0RU5URVI6IDEzXG5cdH0sXG5cdFRSSUdHRVJfRVZFTlRTID0gW3dpbmRvdy5Qb2ludGVyRXZlbnQgPyAncG9pbnRlcmRvd24nIDogJ29udG91Y2hzdGFydCcgaW4gd2luZG93ID8gJ3RvdWNoc3RhcnQnIDogJ2NsaWNrJywgJ2tleWRvd24nIF07XG5cbmV4cG9ydCBkZWZhdWx0IHtcblx0aW5pdCgpIHtcblx0XHR0aGlzLmlzT3BlbiA9IGZhbHNlO1xuXHRcdHRoaXMuY3VycmVudCA9IGZhbHNlO1xuXHRcdHRoaXMuaW1hZ2VDYWNoZSA9IFtdO1xuXHRcdHRoaXMuaXRlbXNbMF0udHJpZ2dlciAmJiB0aGlzLmluaXRUcmlnZ2VycygpO1xuXHRcdHRoaXMuc2V0dGluZ3MucHJlbG9hZCAmJiB0aGlzLml0ZW1zLmZvckVhY2goKGl0ZW0sIGkpID0+IHsgdGhpcy5sb2FkSW1hZ2UoaSk7IH0pO1xuXHRcdHJldHVybiB0aGlzO1xuXHR9LFxuXHRpbml0VHJpZ2dlcnMoKXtcblx0XHR0aGlzLml0ZW1zLmZvckVhY2goKGl0ZW0sIGkpID0+IHtcblx0XHRcdFRSSUdHRVJfRVZFTlRTLmZvckVhY2goZXYgPT4ge1xuXHRcdFx0XHRpdGVtLnRyaWdnZXIuYWRkRXZlbnRMaXN0ZW5lcihldiwgZSA9PiB7XG5cdFx0XHRcdFx0aWYoZS5rZXlDb2RlICYmIGUua2V5Q29kZSAhPT0gS0VZX0NPREVTLkVOVEVSKSByZXR1cm47XG5cdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRcdGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0XHRcdFx0dGhpcy5vcGVuKGkpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH0pO1xuXHRcdH0pO1xuXHR9LFxuXHRpbml0VUkoaSl7XG5cdFx0dGhpcy5ET01PdmVybGF5ID0gZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChvdmVybGF5KCkpO1xuXHRcdHRoaXMuRE9NT3ZlcmxheS5pbnNlcnRBZGphY2VudEhUTUwoJ2JlZm9yZWVuZCcsIG92ZXJsYXlJbm5lcih0aGlzLml0ZW1zLm1hcChkZXRhaWxzKS5tYXAoaXRlbSkuam9pbignJykpKTtcblx0XHR0aGlzLkRPTUl0ZW1zID0gW10uc2xpY2UuY2FsbCh0aGlzLkRPTU92ZXJsYXkucXVlcnlTZWxlY3RvckFsbCgnLmpzLW1vZGFsLWdhbGxlcnlfX2l0ZW0nKSk7XG5cdFx0dGhpcy5ET01Ub3RhbHMgPSB0aGlzLkRPTU92ZXJsYXkucXVlcnlTZWxlY3RvcignLmpzLWdhbGxlcnktdG90YWxzJyk7XG5cdFx0aWYodGhpcy5pbWFnZUNhY2hlLmxlbmd0aCA9PT0gdGhpcy5pdGVtcy5sZW5ndGgpIHRoaXMuaW1hZ2VDYWNoZS5mb3JFYWNoKChpbWcsIGkpID0+IHsgdGhpcy53cml0ZUltYWdlKGkpOyB9KTtcblx0XHRlbHNlIHRoaXMubG9hZEltYWdlcyhpKTtcblx0XHRyZXR1cm4gdGhpcztcblx0fSxcblx0dW5tb3VudFVJKCl7XG5cdFx0dGhpcy5ET01PdmVybGF5LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQodGhpcy5ET01PdmVybGF5KTtcblx0fSxcblx0aW5pdEJ1dHRvbnMoKXtcblx0XHR0aGlzLmNsb3NlQnRuID0gdGhpcy5ET01PdmVybGF5LnF1ZXJ5U2VsZWN0b3IoJy5qcy1tb2RhbC1nYWxsZXJ5X19jbG9zZScpO1xuXHRcdHRoaXMuY2xvc2VCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLmNsb3NlLmJpbmQodGhpcykpO1xuXG5cdFx0aWYgKHRoaXMuaXRlbXMubGVuZ3RoIDwgMikge1xuXHRcdFx0dGhpcy5ET01PdmVybGF5LnJlbW92ZUNoaWxkKHRoaXMuRE9NT3ZlcmxheS5xdWVyeVNlbGVjdG9yKCcuanMtbW9kYWwtZ2FsbGVyeV9fcHJldmlvdXMnKSk7XG5cdFx0XHR0aGlzLkRPTU92ZXJsYXkucmVtb3ZlQ2hpbGQodGhpcy5ET01PdmVybGF5LnF1ZXJ5U2VsZWN0b3IoJy5qcy1tb2RhbC1nYWxsZXJ5X19uZXh0JykpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHRoaXMucHJldmlvdXNCdG4gPSB0aGlzLkRPTU92ZXJsYXkucXVlcnlTZWxlY3RvcignLmpzLW1vZGFsLWdhbGxlcnlfX3ByZXZpb3VzJyk7XG5cdFx0dGhpcy5uZXh0QnRuID0gdGhpcy5ET01PdmVybGF5LnF1ZXJ5U2VsZWN0b3IoJy5qcy1tb2RhbC1nYWxsZXJ5X19uZXh0Jyk7XG5cblx0XHRUUklHR0VSX0VWRU5UUy5mb3JFYWNoKGV2ID0+IHtcblx0XHRcdFsncHJldmlvdXMnLCAnbmV4dCddLmZvckVhY2godHlwZSA9PiB7XG5cdFx0XHRcdHRoaXNbYCR7dHlwZX1CdG5gXS5hZGRFdmVudExpc3RlbmVyKGV2LCBlID0+IHtcblx0XHRcdFx0XHRpZihlLmtleUNvZGUgJiYgZS5rZXlDb2RlICE9PSBLRVlfQ09ERVMuRU5URVIpIHJldHVybjtcblx0XHRcdFx0XHR0aGlzW3R5cGVdKCk7XG5cdFx0XHRcdH0pXG5cdFx0XHR9KTtcblx0XHR9KTtcblx0fSxcblx0d3JpdGVUb3RhbHMoKSB7IHRoaXMuRE9NVG90YWxzLmlubmVySFRNTCA9IGAke3RoaXMuY3VycmVudCArIDF9LyR7dGhpcy5pdGVtcy5sZW5ndGh9YDsgfSxcblx0d3JpdGVJbWFnZShpKXtcblx0XHRsZXQgaW1hZ2VDb250YWluZXIgPSB0aGlzLkRPTUl0ZW1zW2ldLnF1ZXJ5U2VsZWN0b3IoJy5qcy1tb2RhbC1nYWxsZXJ5X19pbWctY29udGFpbmVyJyksXG5cdFx0XHRpbWFnZUNsYXNzTmFtZSA9IHRoaXMuc2V0dGluZ3Muc2Nyb2xsYWJsZSA/ICdtb2RhbC1nYWxsZXJ5X19pbWcgbW9kYWwtZ2FsbGVyeV9faW1nLS1zY3JvbGxhYmxlJyA6ICdtb2RhbC1nYWxsZXJ5X19pbWcnLFxuXHRcdFx0c3Jjc2V0QXR0cmlidXRlID0gdGhpcy5pdGVtc1tpXS5zcmNzZXQgPyBgIHNyY3NldD1cIiR7dGhpcy5pdGVtc1tpXS5zcmNzZXR9XCJgIDogJycsXG5cdFx0XHRzaXplc0F0dHJpYnV0ZSA9IHRoaXMuaXRlbXNbaV0uc2l6ZXMgPyBgIHNpemVzPVwiJHt0aGlzLml0ZW1zW2ldLnNpemVzfVwiYCA6ICcnO1xuXHRcdFxuXHRcdGltYWdlQ29udGFpbmVyLmlubmVySFRNTCA9IGA8aW1nIGNsYXNzPVwiJHtpbWFnZUNsYXNzTmFtZX1cIiBzcmM9XCIke3RoaXMuaXRlbXNbaV0uc3JjfVwiIGFsdD1cIiR7dGhpcy5pdGVtc1tpXS50aXRsZX1cIiR7c3Jjc2V0QXR0cmlidXRlfSR7c2l6ZXNBdHRyaWJ1dGV9PmA7XG5cdFx0dGhpcy5ET01JdGVtc1tpXS5jbGFzc0xpc3QucmVtb3ZlKCdsb2FkaW5nJyk7XG5cdH0sXG5cdGxvYWRJbWFnZShpKSB7XG5cdFx0bGV0IGltZyA9IG5ldyBJbWFnZSgpLFxuXHRcdFx0bG9hZGVkID0gKCkgPT4geyBcblx0XHRcdFx0dGhpcy5pbWFnZUNhY2hlW2ldID0gaW1nO1xuXHRcdFx0XHR0aGlzLndyaXRlSW1hZ2UoaSk7XG5cdFx0XHR9O1xuXHRcdGltZy5vbmxvYWQgPSBsb2FkZWQ7XG5cdFx0aW1nLnNyYyA9IHRoaXMuaXRlbXNbaV0uc3JjO1xuXHRcdGltZy5vbmVycm9yID0gKCkgPT4ge1xuXHRcdFx0dGhpcy5ET01JdGVtc1tpXS5jbGFzc0xpc3QucmVtb3ZlKCdsb2FkaW5nJyk7XG5cdFx0XHR0aGlzLkRPTUl0ZW1zW2ldLmNsYXNzTGlzdC5hZGQoJ2Vycm9yJyk7XG5cdFx0fTtcblx0XHRpZihpbWcuY29tcGxldGUpIGxvYWRlZCgpO1xuXHR9LFxuXHRsb2FkSW1hZ2VzKGkpe1xuXHRcdGxldCBpbmRleGVzID0gW2ldO1xuXG5cdFx0aWYodGhpcy5pdGVtcy5sZW5ndGggPiAxKSBpbmRleGVzLnB1c2goaSA9PT0gMCA/IHRoaXMuaXRlbXMubGVuZ3RoIC0gMSA6IGkgLSAxKTtcblx0XHRpZih0aGlzLml0ZW1zLmxlbmd0aCA+IDIpIGluZGV4ZXMucHVzaChpID09PSB0aGlzLml0ZW1zLmxlbmd0aCAtIDEgPyAwIDogaSArIDEpO1xuXG5cdFx0aW5kZXhlcy5mb3JFYWNoKGlkeCA9PiB7XG5cdFx0XHRpZih0aGlzLmltYWdlQ2FjaGVbaWR4XSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdHRoaXMuRE9NSXRlbXNbaWR4XS5jbGFzc0xpc3QuYWRkKCdsb2FkaW5nJyk7XG5cdFx0XHRcdHRoaXMubG9hZEltYWdlKGlkeCk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0fSxcblx0Z2V0Rm9jdXNhYmxlQ2hpbGRyZW4oKSB7XG5cdFx0bGV0IGZvY3VzYWJsZUVsZW1lbnRzID0gWydhW2hyZWZdJywgJ2FyZWFbaHJlZl0nLCAnaW5wdXQ6bm90KFtkaXNhYmxlZF0pJywgJ3NlbGVjdDpub3QoW2Rpc2FibGVkXSknLCAndGV4dGFyZWE6bm90KFtkaXNhYmxlZF0pJywgJ2J1dHRvbjpub3QoW2Rpc2FibGVkXSknLCAnaWZyYW1lJywgJ29iamVjdCcsICdlbWJlZCcsICdbY29udGVudGVkaXRhYmxlXScsICdbdGFiaW5kZXhdOm5vdChbdGFiaW5kZXg9XCItMVwiXSknXTtcblxuXHRcdHJldHVybiBbXS5zbGljZS5jYWxsKHRoaXMuRE9NT3ZlcmxheS5xdWVyeVNlbGVjdG9yQWxsKGZvY3VzYWJsZUVsZW1lbnRzLmpvaW4oJywnKSkpO1xuXHR9LFxuXHR0cmFwVGFiKGUpe1xuXHRcdGxldCBmb2N1c2VkSW5kZXggPSB0aGlzLmZvY3VzYWJsZUNoaWxkcmVuLmluZGV4T2YoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCk7XG5cdFx0aWYoZS5zaGlmdEtleSAmJiBmb2N1c2VkSW5kZXggPT09IDApIHtcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdHRoaXMuZm9jdXNhYmxlQ2hpbGRyZW5bdGhpcy5mb2N1c2FibGVDaGlsZHJlbi5sZW5ndGggLSAxXS5mb2N1cygpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRpZighZS5zaGlmdEtleSAmJiBmb2N1c2VkSW5kZXggPT09IHRoaXMuZm9jdXNhYmxlQ2hpbGRyZW4ubGVuZ3RoIC0gMSkge1xuXHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdHRoaXMuZm9jdXNhYmxlQ2hpbGRyZW5bMF0uZm9jdXMoKTtcblx0XHRcdH1cblx0XHR9XG5cdH0sXG5cdGtleUxpc3RlbmVyKGUpe1xuXHRcdGlmKCF0aGlzLmlzT3BlbikgcmV0dXJuO1xuXG5cdFx0c3dpdGNoIChlLmtleUNvZGUpIHtcblx0XHRjYXNlIEtFWV9DT0RFUy5FU0M6XG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHR0aGlzLnRvZ2dsZSgpO1xuXHRcdFx0YnJlYWs7XG5cdFx0Y2FzZSBLRVlfQ09ERVMuVEFCOlxuXHRcdFx0dGhpcy50cmFwVGFiKGUpO1xuXHRcdFx0YnJlYWs7XG5cdFx0Y2FzZSBLRVlfQ09ERVMuTEVGVDpcblx0XHRcdHRoaXMucHJldmlvdXMoKTtcblx0XHRcdGJyZWFrO1xuXHRcdGNhc2UgS0VZX0NPREVTLlJJR0hUOlxuXHRcdFx0dGhpcy5uZXh0KCk7XG5cdFx0XHRicmVhaztcblx0XHRkZWZhdWx0OlxuXHRcdFx0YnJlYWs7XG5cdFx0fVxuXHR9LFxuXHRpbmNyZW1lbnREZWNyZW1lbnQoZm4pe1xuXHRcdHRoaXMuY3VycmVudCAhPT0gZmFsc2UgJiYgdGhpcy5ET01JdGVtc1t0aGlzLmN1cnJlbnRdLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHRcdHRoaXMuY3VycmVudCA9IGZuKCk7XG5cdFx0dGhpcy5ET01JdGVtc1t0aGlzLmN1cnJlbnRdLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXHRcdHRoaXMubG9hZEltYWdlcyh0aGlzLmN1cnJlbnQpO1xuXHRcdCh0aGlzLml0ZW1zLmxlbmd0aCA+IDEgJiYgdGhpcy5zZXR0aW5ncy50b3RhbHMpICYmIHRoaXMud3JpdGVUb3RhbHMoKTtcblx0fSxcblx0cHJldmlvdXMoKXsgdGhpcy5pbmNyZW1lbnREZWNyZW1lbnQoKCkgPT4gKHRoaXMuY3VycmVudCA9PT0gMCA/IHRoaXMuRE9NSXRlbXMubGVuZ3RoIC0gMSA6IHRoaXMuY3VycmVudCAtIDEpKTsgfSxcblx0bmV4dCgpeyB0aGlzLmluY3JlbWVudERlY3JlbWVudCgoKSA9PiAodGhpcy5jdXJyZW50ID09PSB0aGlzLkRPTUl0ZW1zLmxlbmd0aCAtIDEgPyAwIDogdGhpcy5jdXJyZW50ICsgMSkpOyB9LFxuXHRvcGVuKGkpe1xuXHRcdHRoaXMuaW5pdFVJKGkpO1xuXHRcdHRoaXMuaW5pdEJ1dHRvbnMoKTtcblx0XHR0aGlzLmZvY3VzYWJsZUNoaWxkcmVuID0gdGhpcy5nZXRGb2N1c2FibGVDaGlsZHJlbigpO1xuXHRcdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLmtleUxpc3RlbmVyLmJpbmQodGhpcykpO1xuXHRcdHRoaXMubGFzdEZvY3VzZWQgPSAgZG9jdW1lbnQuYWN0aXZlRWxlbWVudDtcblx0XHR0aGlzLmZvY3VzYWJsZUNoaWxkcmVuLmxlbmd0aCAmJiB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpe3RoaXMuZm9jdXNhYmxlQ2hpbGRyZW5bMF0uZm9jdXMoKTt9LmJpbmQodGhpcyksIDApO1xuXHRcdHRoaXMuRE9NSXRlbXNbaSB8fCAwXS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcblx0XHR0aGlzLnRvZ2dsZShpIHx8IDApO1xuXHR9LFxuXHRjbG9zZSgpe1xuXHRcdGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLmtleUxpc3RlbmVyLmJpbmQodGhpcykpO1xuXHRcdHRoaXMubGFzdEZvY3VzZWQgJiYgdGhpcy5sYXN0Rm9jdXNlZC5mb2N1cygpO1xuXHRcdHRoaXMuRE9NSXRlbXNbdGhpcy5jdXJyZW50XS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcblx0XHR0aGlzLnRvZ2dsZShudWxsKTtcblx0XHR0aGlzLnVubW91bnRVSSgpO1xuXHR9LFxuXHR0b2dnbGUoaSl7XG5cdFx0dGhpcy5pc09wZW4gPSAhdGhpcy5pc09wZW47XG5cdFx0dGhpcy5jdXJyZW50ID0gaTtcblx0XHR0aGlzLkRPTU92ZXJsYXkuY2xhc3NMaXN0LnRvZ2dsZSgnYWN0aXZlJyk7XG5cdFx0dGhpcy5ET01PdmVybGF5LnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAhdGhpcy5pc09wZW4pO1xuXHRcdHRoaXMuRE9NT3ZlcmxheS5zZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JywgdGhpcy5pc09wZW4gPyAnMCcgOiAnLTEnKTtcblx0XHR0aGlzLnNldHRpbmdzLmZ1bGxzY3JlZW4gJiYgdGhpcy50b2dnbGVGdWxsU2NyZWVuKCk7XG5cdFx0KHRoaXMuaXRlbXMubGVuZ3RoID4gMSAmJiB0aGlzLnNldHRpbmdzLnRvdGFscykgJiYgdGhpcy53cml0ZVRvdGFscygpO1xuXHR9LFxuXHR0b2dnbGVGdWxsU2NyZWVuKCl7XG5cdFx0aWYodGhpcy5pc09wZW4pe1xuXHRcdFx0dGhpcy5ET01PdmVybGF5LnJlcXVlc3RGdWxsc2NyZWVuICYmIHRoaXMuRE9NT3ZlcmxheS5yZXF1ZXN0RnVsbHNjcmVlbigpO1xuXHRcdFx0dGhpcy5ET01PdmVybGF5LndlYmtpdFJlcXVlc3RGdWxsc2NyZWVuICYmIHRoaXMuRE9NT3ZlcmxheS53ZWJraXRSZXF1ZXN0RnVsbHNjcmVlbigpO1xuXHRcdFx0dGhpcy5ET01PdmVybGF5Lm1velJlcXVlc3RGdWxsU2NyZWVuICYmIHRoaXMuRE9NT3ZlcmxheS5tb3pSZXF1ZXN0RnVsbFNjcmVlbigpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRkb2N1bWVudC5leGl0RnVsbHNjcmVlbiAmJiBkb2N1bWVudC5leGl0RnVsbHNjcmVlbigpO1xuXHRcdFx0ZG9jdW1lbnQubW96Q2FuY2VsRnVsbFNjcmVlbiAmJiBkb2N1bWVudC5tb3pDYW5jZWxGdWxsU2NyZWVuKCk7XG5cdFx0XHRkb2N1bWVudC53ZWJraXRFeGl0RnVsbHNjcmVlbiAmJiBkb2N1bWVudC53ZWJraXRFeGl0RnVsbHNjcmVlbigpO1xuXHRcdH1cblx0fVxufTsiLCJleHBvcnQgZGVmYXVsdCB7XG4gICAgZnVsbHNjcmVlbjogZmFsc2UsXG4gICAgcHJlbG9hZDogZmFsc2UsXG4gICAgdG90YWxzOiB0cnVlLFxuICAgIHNjcm9sbGFibGU6IGZhbHNlLFxuICAgIHNpbmdsZTogZmFsc2Vcbn07IiwiZXhwb3J0IGNvbnN0IG92ZXJsYXkgPSAoKSA9PiB7XG4gICAgbGV0IG92ZXJsYXkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblxuICAgIG92ZXJsYXkuY2xhc3NOYW1lID0gJ21vZGFsLWdhbGxlcnlfX291dGVyIGpzLW1vZGFsLWdhbGxlcnlfX291dGVyJztcbiAgICBvdmVybGF5LnNldEF0dHJpYnV0ZSgncm9sZScsICdkaWFsb2cnKTtcbiAgICBvdmVybGF5LnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAnLTEnKTtcbiAgICBvdmVybGF5LnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCB0cnVlKTtcblxuICAgIHJldHVybiBvdmVybGF5O1xufTtcblxuZXhwb3J0IGNvbnN0IG92ZXJsYXlJbm5lciA9IGl0ZW1zID0+IGA8ZGl2IGNsYXNzPVwibW9kYWwtZ2FsbGVyeV9faW5uZXIganMtbW9kYWwtZ2FsbGVyeV9faW5uZXJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1nYWxsZXJ5X19jb250ZW50IGpzLW1vZGFsLWdhbGxlcnlfX2NvbnRlbnRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAke2l0ZW1zfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwianMtbW9kYWwtZ2FsbGVyeV9fbmV4dCBtb2RhbC1nYWxsZXJ5X19uZXh0XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3ZnIHJvbGU9XCJidXR0b25cIiByb2xlPVwiYnV0dG9uXCIgd2lkdGg9XCI0NFwiIGhlaWdodD1cIjYwXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHBvbHlsaW5lIHBvaW50cz1cIjE0IDEwIDM0IDMwIDE0IDUwXCIgc3Ryb2tlPVwicmdiKDI1NSwyNTUsMjU1KVwiIHN0cm9rZS13aWR0aD1cIjRcIiBzdHJva2UtbGluZWNhcD1cImJ1dHRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zdmc+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwianMtbW9kYWwtZ2FsbGVyeV9fcHJldmlvdXMgbW9kYWwtZ2FsbGVyeV9fcHJldmlvdXNcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzdmcgcm9sZT1cImJ1dHRvblwiIHdpZHRoPVwiNDRcIiBoZWlnaHQ9XCI2MFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwb2x5bGluZSBwb2ludHM9XCIzMCAxMCAxMCAzMCAzMCA1MFwiIHN0cm9rZT1cInJnYigyNTUsMjU1LDI1NSlcIiBzdHJva2Utd2lkdGg9XCI0XCIgc3Ryb2tlLWxpbmVjYXA9XCJidXR0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvc3ZnPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImpzLW1vZGFsLWdhbGxlcnlfX2Nsb3NlIG1vZGFsLWdhbGxlcnlfX2Nsb3NlXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3ZnIHJvbGU9XCJidXR0b25cIiByb2xlPVwiYnV0dG9uXCIgd2lkdGg9XCIzMFwiIGhlaWdodD1cIjMwXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGcgc3Ryb2tlPVwicmdiKDI1NSwyNTUsMjU1KVwiIHN0cm9rZS13aWR0aD1cIjRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpbmUgeDE9XCI1XCIgeTE9XCI1XCIgeDI9XCIyNVwiIHkyPVwiMjVcIi8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsaW5lIHgxPVwiNVwiIHkxPVwiMjVcIiB4Mj1cIjI1XCIgeTI9XCI1XCIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvc3ZnPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWdhbGxlcnlfX3RvdGFsIGpzLWdhbGxlcnktdG90YWxzXCI+PC9kaXY+YDtcblxuZXhwb3J0IGNvbnN0IGl0ZW0gPSBkZXRhaWxzID0+IGA8ZGl2IGNsYXNzPVwibW9kYWwtZ2FsbGVyeV9faXRlbSBqcy1tb2RhbC1nYWxsZXJ5X19pdGVtXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtZ2FsbGVyeV9faW1nLWNvbnRhaW5lciBqcy1tb2RhbC1nYWxsZXJ5X19pbWctY29udGFpbmVyXCI+PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAke2RldGFpbHN9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PmA7XG5cbmV4cG9ydCBjb25zdCBkZXRhaWxzID0gaXRlbSA9PiBgPGRpdiBjbGFzcz1cIm1vZGFsLWdhbGxlcnlfX2RldGFpbHNcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxoMSBjbGFzcz1cIm1vZGFsLWdhbGxlcnlfX3RpdGxlXCI+JHtpdGVtLnRpdGxlfTwvaDE+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtZ2FsbGVyeV9fZGVzY3JpcHRpb25cIj4ke2l0ZW0uZGVzY3JpcHRpb259PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PmA7Il19
