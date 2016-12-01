const defaults = {
	templates: {
		previous: `<svg width="44" height="60">
						<polyline points="30 10 10 30 30 50" stroke="rgba(255,255,255,0.5)" stroke-width="4" stroke-linecap="butt" fill="none" stroke-linejoin="round"/>
					</svg>`,
		right: `<svg role="button" width="44" height="60">
						<polyline points="14 10 34 30 14 50" stroke="rgba(255,255,255,0.5)" stroke-width="4" stroke-linecap="butt" fill="none" stroke-linejoin="round"/>
					</svg>`,
		close: `<svg role="button" width="30" height="30">
					<g stroke="rgb(160,160,160)" stroke-width="4">
						<line x1="5" y1="5" x2="25" y2="25"/>
						<line x1="5" y1="25" x2="25" y2="5"/>
					</g>
				</svg>`
	},
	fullScreen: false,
	async: false
};

const StormModalGallery = {
	init() {
		this.initOverlay();
		this.imageCache = [];
		return this;
	},
	createNode(type = 'div', classList = '', attributeList = {}){
		let node = document.createElement(type);

		for(let attribute in attributeList) {
			if(attributeList.hasOwnProperty(attribute)) node.setAttribute(attribute, attributeList[attribute]);
		}
		node.classList = classList
		return node;
	},
	initOverlay(){
		this.overlay = {};
		this.overlay.container = createNode('div', 'modal-gallery__outer', {
			role: 'dialog',
			tabindex: '-1'
		});
		this.overlay.inner = createNode('div', 'modal-gallery__inner');
		this.overlay.buttonPrevious = createNode('button', 'modal-gallery__previous');
		this.overlay.buttonPrevious.innerHTML = this.settings.templates.previous;
		this.overlay.buttonNext = createNode('button', 'modal-gallery__next');
		this.overlay.buttonNext.innerHTML = this.settings.templates.next;
		this.overlay.buttonClose = createNode('button', 'modal-gallery__close');
		this.overlay.buttonClose.innerHTML = this.settings.templates.close;

		this.overlay.container.appendChild(this.overlay.inner);
		this.overlay.container.appendChild(this.overlay.buttonPrevious);
		this.overlay.container.appendChild(this.overlay.buttonNext);

		/*
		let overlayTemplate = `<div class="" >
									<div class="modal-gallery__inner"></div>
									${this.settings.templates.leftArrow}
									${this.settings.templates.rightArrow}
									${this.settings.templates.close}
								</div>`;
								*/
		document.body.insertAdjacentHTML('beforeend', overlayTemplate);
	},
	initButtons(){
		//shouldn't have to do this
		//create buttons via createElement, then innerHTML the svg template
		this.previousBtn = document.querySelector('js-modal-gallery__previous');
		this.nextBtn = document.querySelector('js-modal-gallery__next');
		this.closeBtn = document.querySelector('js-modal-gallery__next');

		this.previousBtn.addEventListener('click', () => {
			this.previous();
		});
		this.nextBtn.addEventListener('click', () => {
			this.next();
		});
		this.closeBtn.addEventListener('click', () => {
			this.close();
		});

	},
	preloadImage(src) {
		let img = new Image();
		img.src = src;
		this.imageCache.push(img);
	},
	open(){},
	previous(){},
	next(){},
	close(){}
};

const init = (src, opts) => {
	if(!src.length) throw new Error('Modal Gallery cannot be initialised, no images found');

	let imgs;

	if(typeof src === 'string'){
		let els = [].slice.call(document.querySelectorAll(src));

		if(!els.length) throw new Error('Modal Gallery cannot be initialised, no images found');
		
		imgs = els.map(el => {
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

export default { init };