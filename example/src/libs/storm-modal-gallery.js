/**
 * @name storm-modal-gallery: Modal gallery/lightbox
 * @version 0.1.0: Mon, 14 Nov 2016 18:07:41 GMT
 * @author mjbp
 * @license MIT
 */
const defaults = {
	templates: {
		leftArrow: `<svg class="js-modal-gallery__previous" role="button" width="44" height="60">
						<polyline points="30 10 10 30 30 50" stroke="rgba(255,255,255,0.5)" stroke-width="4" stroke-linecap="butt" fill="none" stroke-linejoin="round"/>
					</svg>`,
		rightArrow: `<svg class="js-modal-gallery__next" role="button" width="44" height="60">
						<polyline points="14 10 34 30 14 50" stroke="rgba(255,255,255,0.5)" stroke-width="4" stroke-linecap="butt" fill="none" stroke-linejoin="round"/>
					</svg>`,
		close: `<svg class="js-modal-gallery__close" role="button" width="30" height="30">
					<g stroke="rgb(160,160,160)" stroke-width="4">
						<line x1="5" y1="5" x2="25" y2="25"/>
						<line x1="5" y1="25" x2="25" y2="5"/>
					</g>
				</svg>`
	},
	fullScreen: false,
	async: false,
	preload: 2
};

const StormModalGallery = {
	init() {
		this.initOverlay();
		return this;
	},
	initOverlay(){
		let overlayTemplate = `<div class="modal-gallery__outer" role="dialog" tabindex="-1">
									<div class="modal-gallery__inner"></div>
									${this.settings.templates.leftArrow}
									${this.settings.templates.rightArrow}
									${this.settings.templates.close}
								</div>`;

		document.body.insertAdjacentHTML('beforeend', overlayTemplate);
	},
	initButtons(){

	}
	open(){},
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