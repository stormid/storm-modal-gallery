import ModalGallery from './libs/component';

const onDOMContentLoadedTasks = [() => {

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

	ModalGallery.init('.js-modal-gallery');

	ModalGallery.init('.js-modal-single', {
		single: true
	});

}];
    
if('addEventListener' in window) window.addEventListener('DOMContentLoaded', () => { onDOMContentLoadedTasks.forEach(fn => fn()); });