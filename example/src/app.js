import ModalGallery from './libs/storm-modal-gallery';

const onDOMContentLoadedTasks = [() => {
	/*
	let gallery = ModalGallery.init([
		{
			src: 'https://i.ytimg.com/vi/yaqe1qesQ8c/maxresdefault.jpg',
			title: 'Image 1',
			description: 'Description 1'
		},
		{
			src: 'https://unsplash.it/800/?random',
			title: 'Image 2',
			description: 'Description 2'
		}]);

	document.querySelector('.js-modal-gallery__trigger').addEventListener('click', gallery.open.bind(gallery, 0));
	*/
	let gallery = ModalGallery.init('.js-modal-gallery');
	document.querySelector('.js-modal-gallery__trigger').addEventListener('click', gallery.open.bind(gallery, 0));
	console.log(gallery);

}];

    
if('addEventListener' in window) window.addEventListener('DOMContentLoaded', () => { onDOMContentLoadedTasks.forEach(fn => fn()); });
