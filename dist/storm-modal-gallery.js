/**
 * @name storm-modal-gallery: Modal gallery/lightbox
 * @version 0.1.0: Thu, 08 Dec 2016 11:27:08 GMT
 * @author mjbp
 * @license MIT
 */
const defaults = {
		templates: {
			overlay: `<div class="modal-gallery__outer js-modal-gallery__outer" role="dialog" tabindex="-1" aria-hidden="true">
						<div class="modal-gallery__inner js-modal-gallery__inner">
							<div class="modal-gallery__content js-modal-gallery__content">
								{{items}}
							</div>
						</div>
						<button class="js-modal-gallery__next modal-gallery__next">
							<svg role="button" role="button" width="44" height="60">
								<polyline points="14 10 34 30 14 50" stroke="rgb(255,255,255)" stroke-width="4" stroke-linecap="butt" fill="none" stroke-linejoin="round"/>
							</svg>
						</button>
						<button class="js-modal-gallery__previous modal-gallery__previous">
							<svg role="button" width="44" height="60">
								<polyline points="30 10 10 30 30 50" stroke="rgb(255,255,255)" stroke-width="4" stroke-linecap="butt" fill="none" stroke-linejoin="round"/>
							</svg>
						</button>
						<button class="js-modal-gallery__close modal-gallery__close">
							<svg role="button" role="button" width="30" height="30">
								<g stroke="rgb(255,255,255)" stroke-width="4">
									<line x1="5" y1="5" x2="25" y2="25"/>
									<line x1="5" y1="25" x2="25" y2="5"/>
								</g>
							</svg>
						</button>
					</div>`,
			item: `<div class="modal-gallery__item js-modal-gallery__item">
						<div class="modal-gallery__img-container js-modal-gallery__img-container"></div>
						{{details}}
					</div>`,
			details: `<div class="modal-gallery__details">
						<h1 class="modal-gallery__title">{{title}}</h1>
						<div class="modal-gallery__description">{{description}}</div>
					</div>`
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

const StormModalGallery = {
	init() {
		this.isOpen = false;
		this.current = null;
		this.initUI();
		this.imageCache = [];
		this.focusableChildren = this.getFocusableChildren();
		this.initButtons();
		this.items[0].trigger && this.initTriggers();
		this.settings.preload && this.items.forEach((item, i) => {
			this.loadImage(i);
		});
		return this;
	},
	initTriggers(){
		this.items.forEach((item, i) => {
			TRIGGER_EVENTS.forEach(ev => {
				item.trigger.addEventListener(ev, e => {
					if(e.keyCode && e.keyCode !== KEY_CODES.ENTER) return;
					e.preventDefault();
					e.stopPropagation();
					this.open(i);
				});
			});
		});
	},
	initUI(){
		let renderTemplate = (data, template) => {
				for(let datum in data){
					if(data.hasOwnProperty(datum)){
						template = template.split(`{{${datum}}}`).join(data[datum]);
					}
				}
				return template;
			},
			detailsStringArray = this.items.map(function(img) {
				return renderTemplate(img, this.settings.templates.details);
			}.bind(this)),
			itemsString = detailsStringArray.map(function(item) {
				return this.settings.templates.item.split('{{details}}').join(item);
			}.bind(this));

		document.body.insertAdjacentHTML('beforeend', this.settings.templates.overlay.split('{{items}}').join(itemsString.join('')));
		this.DOMOverlay = document.querySelector('.js-modal-gallery__outer');
		this.DOMItems = [].slice.call(document.querySelectorAll('.js-modal-gallery__item'));
		return this;
	},
	initButtons(){
		this.previousBtn = document.querySelector('.js-modal-gallery__previous');
		this.nextBtn = document.querySelector('.js-modal-gallery__next');
		this.closeBtn = document.querySelector('.js-modal-gallery__close');

		this.previousBtn.addEventListener('click', function() {
			this.previous();
		}.bind(this));
		this.nextBtn.addEventListener('click', function() {
			this.next();
		}.bind(this));
		this.closeBtn.addEventListener('click', function() {
			this.close();
		}.bind(this));
	},
	loadImage(i) {
		var img = new Image(),
			imageContainer = this.DOMItems[i].querySelector('.js-modal-gallery__img-container'),
			loaded = () => {
				imageContainer.innerHTML = `<img class="modal-gallery__img" src="${this.items[i].src}" alt="${this.items[i].title}">`;
				this.DOMItems[i].classList.remove('loading');
			};
		img.onload = loaded;
		img.src = this.items[i].src;
		
		img.onerror = () => {
			this.DOMItems[i].classList.remove('loading');
			this.DOMItems[i].classList.add('error');
		};
		if(img.complete) loaded();
	},
	loadImages(i){
		if(this.imageCache.length === this.items) return;

		let indexes = [i];

		if(this.items.length > 1) indexes.push(i === 0 ? this.items.length - 1 : i - 1);
		if(this.items.length > 2) indexes.push(i === this.items.length - 1 ? 0 : i + 1);

		indexes.forEach(idx => {
			if(this.imageCache[idx] === undefined) {
				this.DOMItems[idx].classList.add('loading');
				this.loadImage(idx);
			}
		});

	},
	getFocusableChildren() {
		let focusableElements = ['a[href]', 'area[href]', 'input:not([disabled])', 'select:not([disabled])', 'textarea:not([disabled])', 'button:not([disabled])', 'iframe', 'object', 'embed', '[contenteditable]', '[tabindex]:not([tabindex="-1"])'];

		return [].slice.call(this.DOMOverlay.querySelectorAll(focusableElements.join(',')));
	},
	trapTab(e){
		let focusedIndex = this.focusableChildren.indexOf(document.activeElement);
		if(e.shiftKey && focusedIndex === 0) {
			e.preventDefault();
			this.focusableChildren[this.focusableChildren.length - 1].focus();
		} else {
			if(!e.shiftKey && focusedIndex === this.focusableChildren.length - 1) {
				e.preventDefault();
				this.focusableChildren[0].focus();
			}
		}
	},
	keyListener(e){
		if(!this.open) return;

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
	previous(){
		this.DOMItems[this.current].classList.remove('active');
		this.current = (this.current === 0 ? this.DOMItems.length - 1 : this.current - 1);
		this.DOMItems[this.current].classList.add('active');
		this.loadImages(this.current);
	},
	next(){
		this.DOMItems[this.current].classList.remove('active');
		this.current = (this.current === this.DOMItems.length - 1 ? 0 : this.current + 1);
		this.DOMItems[this.current].classList.add('active');
		this.loadImages(this.current);
	},
	open(i){
		document.addEventListener('keydown', this.keyListener.bind(this));
		this.loadImages(i);
		this.lastFocused =  document.activeElement;
		this.focusableChildren.length && window.setTimeout(function(){this.focusableChildren[0].focus();}.bind(this), 0);
		this.DOMItems[i || 0].classList.add('active');
		this.toggle(i || 0);
	},
	close(){
		document.removeEventListener('keydown', this.keyListener.bind(this));
		this.lastFocused.focus();
		this.DOMItems[this.current].classList.remove('active');
		this.toggle(null);
	},
	toggle(i){
		this.isOpen = !this.isOpen;
		this.current = i;
		this.DOMOverlay.classList.toggle('active');
		this.DOMOverlay.setAttribute('aria-hidden', !this.isOpen);
		this.DOMOverlay.setAttribute('tabindex', this.isOpen ? '0' : '-1');
		this.settings.fullscreen && this.toggleFullScreen();
	},
	toggleFullScreen(){
		if(this.isOpen){
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

const init = (src, opts) => {
	if(!src.length) throw new Error('Modal Gallery cannot be initialised, no images found');

	let items;

	if(typeof src === 'string'){
		let els = [].slice.call(document.querySelectorAll(src));

		if(!els.length) throw new Error('Modal Gallery cannot be initialised, no images found');
		
		items = els.map(el => {
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

export default { init };