(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _stormModalGallery = require('./libs/storm-modal-gallery');

var _stormModalGallery2 = _interopRequireDefault(_stormModalGallery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var onDOMContentLoadedTasks = [function () {
	_stormModalGallery2.default.init([{
		imageURL: 'https://unsplash.it/800/?random',
		title: 'Image 1'
	}, {
		imageURL: 'https://unsplash.it/800/?random',
		title: 'Image 2'
	}]);
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
 * @version 0.1.0: Mon, 14 Nov 2016 18:03:05 GMT
 * @author mjbp
 * @license MIT
 */
var defaults = {
	templates: {
		leftArrow: '<svg role="button" width="44" height="60">\n\t\t\t\t\t\t<polyline points="30 10 10 30 30 50" stroke="rgba(255,255,255,0.5)" stroke-width="4" stroke-linecap="butt" fill="none" stroke-linejoin="round"/>\n\t\t\t\t\t</svg>',
		rightArrow: '<svg role="button" width="44" height="60">\n\t\t\t\t\t\t<polyline points="14 10 34 30 14 50" stroke="rgba(255,255,255,0.5)" stroke-width="4" stroke-linecap="butt" fill="none" stroke-linejoin="round"/>\n\t\t\t\t\t</svg>',
		close: '<svg role="button" width="30" height="30">\n\t\t\t\t\t<g stroke="rgb(160,160,160)" stroke-width="4">\n\t\t\t\t\t\t<line x1="5" y1="5" x2="25" y2="25"/>\n\t\t\t\t\t\t<line x1="5" y1="25" x2="25" y2="5"/>\n\t\t\t\t\t</g>\n\t\t\t\t</svg>'
	},
	fullScreen: false,
	async: false,
	preload: 2
};

var StormModalGallery = {
	init: function init() {
		this.initOverlay();
		return this;
	},
	initOverlay: function initOverlay() {
		var overlayTemplate = '<div class="modal-gallery__outer" role="dialog" tabindex="-1">\n\t\t\t\t\t\t\t\t\t<div class="modal-gallery__inner"></div>\n\t\t\t\t\t\t\t\t\t' + this.settings.templates.leftArrow + '\n\t\t\t\t\t\t\t\t\t' + this.settings.templates.rightArrow + '\n\t\t\t\t\t\t\t\t\t' + this.settings.templates.close + '\n\t\t\t\t\t\t\t\t</div>';

		document.body.insertAdjacentHTML('beforeend', overlayTemplate);
	},
	open: function open() {},
	close: function close() {}
};

var init = function init(src, opts) {
	if (!src.length) throw new Error('Modal Gallery cannot be initialised, no images found');

	var imgs = void 0;

	if (typeof src === 'string') {
		var els = [].slice.call(document.querySelectorAll(src));

		if (!els.length) throw new Error('Modal Gallery cannot be initialised, no images found');

		imgs = els.map(function (el) {
			return {
				imageURL: el.getAttribute('href'),
				title: el.getAttribute('data-title') || ''
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJleGFtcGxlL3NyYy9hcHAuanMiLCJleGFtcGxlL3NyYy9saWJzL3N0b3JtLW1vZGFsLWdhbGxlcnkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBOzs7Ozs7QUFFQSxJQUFNLDBCQUEwQixDQUFDLFlBQU07QUFDdEMsNkJBQWEsSUFBYixDQUFrQixDQUNqQjtBQUNDLFlBQVUsaUNBRFg7QUFFQyxTQUFPO0FBRlIsRUFEaUIsRUFLakI7QUFDQyxZQUFVLGlDQURYO0FBRUMsU0FBTztBQUZSLEVBTGlCLENBQWxCO0FBU0EsQ0FWK0IsQ0FBaEM7O0FBYUEsSUFBRyxzQkFBc0IsTUFBekIsRUFBaUMsT0FBTyxnQkFBUCxDQUF3QixrQkFBeEIsRUFBNEMsWUFBTTtBQUFFLHlCQUF3QixPQUF4QixDQUFnQztBQUFBLFNBQU0sSUFBTjtBQUFBLEVBQWhDO0FBQThDLENBQWxHOzs7Ozs7OztBQ2ZqQzs7Ozs7O0FBTUEsSUFBTSxXQUFXO0FBQ2hCLFlBQVc7QUFDVix5T0FEVTtBQUlWLDBPQUpVO0FBT1Y7QUFQVSxFQURLO0FBZWhCLGFBQVksS0FmSTtBQWdCaEIsUUFBTyxLQWhCUztBQWlCaEIsVUFBUztBQWpCTyxDQUFqQjs7QUFvQkEsSUFBTSxvQkFBb0I7QUFDekIsS0FEeUIsa0JBQ2xCO0FBQ04sT0FBSyxXQUFMO0FBQ0EsU0FBTyxJQUFQO0FBQ0EsRUFKd0I7QUFLekIsWUFMeUIseUJBS1o7QUFDWixNQUFJLHFLQUVLLEtBQUssUUFBTCxDQUFjLFNBQWQsQ0FBd0IsU0FGN0IsNEJBR0ssS0FBSyxRQUFMLENBQWMsU0FBZCxDQUF3QixVQUg3Qiw0QkFJSyxLQUFLLFFBQUwsQ0FBYyxTQUFkLENBQXdCLEtBSjdCLDZCQUFKOztBQU9BLFdBQVMsSUFBVCxDQUFjLGtCQUFkLENBQWlDLFdBQWpDLEVBQThDLGVBQTlDO0FBQ0EsRUFkd0I7QUFlekIsS0FmeUIsa0JBZW5CLENBQUUsQ0FmaUI7QUFnQnpCLE1BaEJ5QixtQkFnQmxCLENBQUU7QUFoQmdCLENBQTFCOztBQW1CQSxJQUFNLE9BQU8sU0FBUCxJQUFPLENBQUMsR0FBRCxFQUFNLElBQU4sRUFBZTtBQUMzQixLQUFHLENBQUMsSUFBSSxNQUFSLEVBQWdCLE1BQU0sSUFBSSxLQUFKLENBQVUsc0RBQVYsQ0FBTjs7QUFFaEIsS0FBSSxhQUFKOztBQUVBLEtBQUcsT0FBTyxHQUFQLEtBQWUsUUFBbEIsRUFBMkI7QUFDMUIsTUFBSSxNQUFNLEdBQUcsS0FBSCxDQUFTLElBQVQsQ0FBYyxTQUFTLGdCQUFULENBQTBCLEdBQTFCLENBQWQsQ0FBVjs7QUFFQSxNQUFHLENBQUMsSUFBSSxNQUFSLEVBQWdCLE1BQU0sSUFBSSxLQUFKLENBQVUsc0RBQVYsQ0FBTjs7QUFFaEIsU0FBTyxJQUFJLEdBQUosQ0FBUSxjQUFNO0FBQ3BCLFVBQU87QUFDTixjQUFVLEdBQUcsWUFBSCxDQUFnQixNQUFoQixDQURKO0FBRU4sV0FBTyxHQUFHLFlBQUgsQ0FBZ0IsWUFBaEIsS0FBaUM7QUFGbEMsSUFBUDtBQUlBLEdBTE0sQ0FBUDtBQU1BLEVBWEQsTUFXTztBQUNOLFNBQU8sR0FBUDtBQUNBOztBQUVELFFBQU8sT0FBTyxNQUFQLENBQWMsT0FBTyxNQUFQLENBQWMsaUJBQWQsQ0FBZCxFQUFnRDtBQUN0RCxRQUFNLElBRGdEO0FBRXRELFlBQVUsT0FBTyxNQUFQLENBQWMsRUFBZCxFQUFrQixRQUFsQixFQUE0QixJQUE1QjtBQUY0QyxFQUFoRCxFQUdKLElBSEksRUFBUDtBQUlBLENBeEJEOztrQkEwQmUsRUFBRSxVQUFGLEUiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IE1vZGFsR2FsbGVyeSBmcm9tICcuL2xpYnMvc3Rvcm0tbW9kYWwtZ2FsbGVyeSc7XG5cbmNvbnN0IG9uRE9NQ29udGVudExvYWRlZFRhc2tzID0gWygpID0+IHtcblx0TW9kYWxHYWxsZXJ5LmluaXQoW1xuXHRcdHtcblx0XHRcdGltYWdlVVJMOiAnaHR0cHM6Ly91bnNwbGFzaC5pdC84MDAvP3JhbmRvbScsXG5cdFx0XHR0aXRsZTogJ0ltYWdlIDEnXG5cdFx0fSxcblx0XHR7XG5cdFx0XHRpbWFnZVVSTDogJ2h0dHBzOi8vdW5zcGxhc2guaXQvODAwLz9yYW5kb20nLFxuXHRcdFx0dGl0bGU6ICdJbWFnZSAyJ1xuXHRcdH1dKTtcbn1dO1xuXG4gICAgXG5pZignYWRkRXZlbnRMaXN0ZW5lcicgaW4gd2luZG93KSB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsICgpID0+IHsgb25ET01Db250ZW50TG9hZGVkVGFza3MuZm9yRWFjaChmbiA9PiBmbigpKTsgfSk7XG4iLCIvKipcbiAqIEBuYW1lIHN0b3JtLW1vZGFsLWdhbGxlcnk6IE1vZGFsIGdhbGxlcnkvbGlnaHRib3hcbiAqIEB2ZXJzaW9uIDAuMS4wOiBNb24sIDE0IE5vdiAyMDE2IDE4OjAzOjA1IEdNVFxuICogQGF1dGhvciBtamJwXG4gKiBAbGljZW5zZSBNSVRcbiAqL1xuY29uc3QgZGVmYXVsdHMgPSB7XG5cdHRlbXBsYXRlczoge1xuXHRcdGxlZnRBcnJvdzogYDxzdmcgcm9sZT1cImJ1dHRvblwiIHdpZHRoPVwiNDRcIiBoZWlnaHQ9XCI2MFwiPlxuXHRcdFx0XHRcdFx0PHBvbHlsaW5lIHBvaW50cz1cIjMwIDEwIDEwIDMwIDMwIDUwXCIgc3Ryb2tlPVwicmdiYSgyNTUsMjU1LDI1NSwwLjUpXCIgc3Ryb2tlLXdpZHRoPVwiNFwiIHN0cm9rZS1saW5lY2FwPVwiYnV0dFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIi8+XG5cdFx0XHRcdFx0PC9zdmc+YCxcblx0XHRyaWdodEFycm93OiBgPHN2ZyByb2xlPVwiYnV0dG9uXCIgd2lkdGg9XCI0NFwiIGhlaWdodD1cIjYwXCI+XG5cdFx0XHRcdFx0XHQ8cG9seWxpbmUgcG9pbnRzPVwiMTQgMTAgMzQgMzAgMTQgNTBcIiBzdHJva2U9XCJyZ2JhKDI1NSwyNTUsMjU1LDAuNSlcIiBzdHJva2Utd2lkdGg9XCI0XCIgc3Ryb2tlLWxpbmVjYXA9XCJidXR0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiLz5cblx0XHRcdFx0XHQ8L3N2Zz5gLFxuXHRcdGNsb3NlOiBgPHN2ZyByb2xlPVwiYnV0dG9uXCIgd2lkdGg9XCIzMFwiIGhlaWdodD1cIjMwXCI+XG5cdFx0XHRcdFx0PGcgc3Ryb2tlPVwicmdiKDE2MCwxNjAsMTYwKVwiIHN0cm9rZS13aWR0aD1cIjRcIj5cblx0XHRcdFx0XHRcdDxsaW5lIHgxPVwiNVwiIHkxPVwiNVwiIHgyPVwiMjVcIiB5Mj1cIjI1XCIvPlxuXHRcdFx0XHRcdFx0PGxpbmUgeDE9XCI1XCIgeTE9XCIyNVwiIHgyPVwiMjVcIiB5Mj1cIjVcIi8+XG5cdFx0XHRcdFx0PC9nPlxuXHRcdFx0XHQ8L3N2Zz5gXG5cdH0sXG5cdGZ1bGxTY3JlZW46IGZhbHNlLFxuXHRhc3luYzogZmFsc2UsXG5cdHByZWxvYWQ6IDJcbn07XG5cbmNvbnN0IFN0b3JtTW9kYWxHYWxsZXJ5ID0ge1xuXHRpbml0KCkge1xuXHRcdHRoaXMuaW5pdE92ZXJsYXkoKTtcblx0XHRyZXR1cm4gdGhpcztcblx0fSxcblx0aW5pdE92ZXJsYXkoKXtcblx0XHRsZXQgb3ZlcmxheVRlbXBsYXRlID0gYDxkaXYgY2xhc3M9XCJtb2RhbC1nYWxsZXJ5X19vdXRlclwiIHJvbGU9XCJkaWFsb2dcIiB0YWJpbmRleD1cIi0xXCI+XG5cdFx0XHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwibW9kYWwtZ2FsbGVyeV9faW5uZXJcIj48L2Rpdj5cblx0XHRcdFx0XHRcdFx0XHRcdCR7dGhpcy5zZXR0aW5ncy50ZW1wbGF0ZXMubGVmdEFycm93fVxuXHRcdFx0XHRcdFx0XHRcdFx0JHt0aGlzLnNldHRpbmdzLnRlbXBsYXRlcy5yaWdodEFycm93fVxuXHRcdFx0XHRcdFx0XHRcdFx0JHt0aGlzLnNldHRpbmdzLnRlbXBsYXRlcy5jbG9zZX1cblx0XHRcdFx0XHRcdFx0XHQ8L2Rpdj5gO1xuXG5cdFx0ZG9jdW1lbnQuYm9keS5pbnNlcnRBZGphY2VudEhUTUwoJ2JlZm9yZWVuZCcsIG92ZXJsYXlUZW1wbGF0ZSk7XG5cdH0sXG5cdG9wZW4oKXt9LFxuXHRjbG9zZSgpe31cbn07XG5cbmNvbnN0IGluaXQgPSAoc3JjLCBvcHRzKSA9PiB7XG5cdGlmKCFzcmMubGVuZ3RoKSB0aHJvdyBuZXcgRXJyb3IoJ01vZGFsIEdhbGxlcnkgY2Fubm90IGJlIGluaXRpYWxpc2VkLCBubyBpbWFnZXMgZm91bmQnKTtcblxuXHRsZXQgaW1ncztcblxuXHRpZih0eXBlb2Ygc3JjID09PSAnc3RyaW5nJyl7XG5cdFx0bGV0IGVscyA9IFtdLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChzcmMpKTtcblxuXHRcdGlmKCFlbHMubGVuZ3RoKSB0aHJvdyBuZXcgRXJyb3IoJ01vZGFsIEdhbGxlcnkgY2Fubm90IGJlIGluaXRpYWxpc2VkLCBubyBpbWFnZXMgZm91bmQnKTtcblx0XHRcblx0XHRpbWdzID0gZWxzLm1hcChlbCA9PiB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRpbWFnZVVSTDogZWwuZ2V0QXR0cmlidXRlKCdocmVmJyksXG5cdFx0XHRcdHRpdGxlOiBlbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtdGl0bGUnKSB8fCAnJ1xuXHRcdFx0fTtcblx0XHR9KTtcblx0fSBlbHNlIHtcblx0XHRpbWdzID0gc3JjO1xuXHR9XG5cdFxuXHRyZXR1cm4gT2JqZWN0LmFzc2lnbihPYmplY3QuY3JlYXRlKFN0b3JtTW9kYWxHYWxsZXJ5KSwge1xuXHRcdGltZ3M6IGltZ3MsXG5cdFx0c2V0dGluZ3M6IE9iamVjdC5hc3NpZ24oe30sIGRlZmF1bHRzLCBvcHRzKVxuXHR9KS5pbml0KCk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCB7IGluaXQgfTsiXX0=
