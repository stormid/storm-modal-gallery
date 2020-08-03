/**
 * @name storm-modal-gallery: Modal gallery/lightbox
 * @version 1.5.0: Mon, 03 Aug 2020 12:44:52 GMT
 * @author mjbp
 * @license MIT
 */
import defaults from './lib/defaults';
import componentPrototype from './lib/component-prototype';

const create = (items, opts) => Object.assign(Object.create(componentPrototype), {
		items: items,
		settings: Object.assign({}, defaults, opts)
	}).init();

const singles = (src, opts) => {
	let els = [].slice.call(document.querySelectorAll(src));

	if(!els.length) throw new Error('Modal Gallery cannot be initialised, no images found');

	return els.map(el => create([{
		trigger: el,
		src: el.getAttribute('href'),
		srcset: el.getAttribute('data-srcset') || null,
		sizes: el.getAttribute('data-sizes') || null,
		title: el.getAttribute('data-title') || '',
		description: el.getAttribute('data-description') || ''
	}], opts));
};

const galleries = (src, opts) => {
	let items;

	if(typeof src === 'string'){
		let els = [].slice.call(document.querySelectorAll(src));

		if(!els.length) throw new Error('Modal Gallery cannot be initialised, no images found');
		
		items = els.map(el => {
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

const init = (src, opts) => {
	if(!src.length) throw new Error('Modal Gallery cannot be initialised, no images found');

	if(opts && opts.single) return singles(src, opts);
	else return galleries(src, opts);
	
};

export default { init };