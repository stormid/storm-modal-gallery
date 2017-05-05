const KEY_CODES = {
		TAB: 9,
		ESC: 27,
		LEFT: 37,
		RIGHT: 39,
		ENTER: 13
	},
	TRIGGER_EVENTS = [window.PointerEvent ? 'pointerdown' : 'ontouchstart' in window ? 'touchstart' : 'click', 'keydown' ];

export default {
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
	initButtons(){
		this.previousBtn = this.DOMOverlay.querySelector('.js-modal-gallery__previous');
		this.nextBtn = this.DOMOverlay.querySelector('.js-modal-gallery__next');
		this.closeBtn = this.DOMOverlay.querySelector('.js-modal-gallery__close');

		this.closeBtn.addEventListener('click', function() {
			this.close();
		}.bind(this));

		if (this.total < 2) {
			this.previousBtn.parentNode.removeChild(this.previousBtn);
			this.nextBtn.parentNode.removeChild(this.nextBtn);
			return;
		}

		this.previousBtn.addEventListener('click', function() {
			this.previous();
		}.bind(this));
		this.nextBtn.addEventListener('click', function() {
			this.next();
		}.bind(this));
	},
	writeTotals: function writeTotals() {
		this.DOMTotals.innerHTML = `${this.current + 1}/${this.total}`;
	},
	loadImage(i) {
		var img = new Image(),
			imageContainer = this.DOMItems[i].querySelector('.js-modal-gallery__img-container'),
			loaded = () => {
				let srcsetAttribute = this.items[i].srcset ? ` srcset="${this.items[i].srcset}"` : '',
					sizesAttribute = this.items[i].sizes ? ` sizes="${this.items[i].sizes}"` : '';
				imageContainer.innerHTML = `<img class="modal-gallery__img" src="${this.items[i].src}" alt="${this.items[i].title}"${srcsetAttribute}${sizesAttribute}>`;
				this.DOMItems[i].classList.remove('loading');
				img.onload = null;
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
		if(!this.isOpen) return;

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
		this.current && this.DOMItems[this.current].classList.remove('active');
		this.current = (this.current === 0 ? this.DOMItems.length - 1 : this.current - 1);
		this.DOMItems[this.current].classList.add('active');
		this.loadImages(this.current);
		(this.total > 1 && this.settings.totals) && this.writeTotals();
	},
	next(){
		this.current && this.DOMItems[this.current].classList.remove('active');
		this.current = (this.current === this.DOMItems.length - 1 ? 0 : this.current + 1);
		this.DOMItems[this.current].classList.add('active');
		this.loadImages(this.current);
		(this.total > 1 && this.settings.totals) && this.writeTotals();
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
		this.lastFocused && this.lastFocused.focus();
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
		(this.total > 1 && this.settings.totals) && this.writeTotals();
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