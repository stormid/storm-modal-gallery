import ModalGallery from './libs/storm-modal-gallery';

const onDOMContentLoadedTasks = [() => {
	ModalGallery.init([
		{
			imageURL: 'https://unsplash.it/800/?random',
			title: 'Image 1'
		},
		{
			imageURL: 'https://unsplash.it/800/?random',
			title: 'Image 2'
		}]);
}];

    
if('addEventListener' in window) window.addEventListener('DOMContentLoaded', () => { onDOMContentLoadedTasks.forEach(fn => fn()); });
