import ModalGallery from './libs/storm-modal-gallery';

const onDOMContentLoadedTasks = [() => {
	let gallery = ModalGallery.init([
		{
			src: 'https://unsplash.it/800/?random',
			title: 'Image 1',
			description: 'Description 1'
		},
		{
			src: 'https://unsplash.it/800/?random',
			title: 'Image 2',
			description: 'Description 2'
		}]);

	document.querySelector('.js-modal-gallery__trigger').addEventListener('click', gallery.open.bind(gallery));
}];

    
if('addEventListener' in window) window.addEventListener('DOMContentLoaded', () => { onDOMContentLoadedTasks.forEach(fn => fn()); });
