import should from 'should';
import 'jsdom-global/register';
import ModalGallery from '../dist/storm-modal-gallery.standalone';

const html = `<button class="js-modal-gallery__trigger">Open modal</button>
			<ul>
				<li><a class="js-modal-gallery" href="http://placehold.it/500x500" data-title="Image 1" data-description="Description 1" data-srcset="http://placehold.it/800x800 800w, http://placehold.it/500x500 320w">Image one</a></li>
				<li><a class="js-modal-gallery" href="http://placehold.it/300x800" data-title="Image 2" data-description="Description 2" data-srcset="http://placehold.it/500x800 800w, http://placehold.it/300x500 320w">Image two</a></li>
			</ul>`;

document.body.innerHTML = html;


let ModalGalleryItem = ModalGallery.init('.js-modal-gallery');


describe('DOM initialisation', () => {
	it('should return an object with the correct properties', () => {
		should(ModalGalleryItem).Object();
		ModalGalleryItem.should.have.property('isOpen').Boolean();
		ModalGalleryItem.should.have.property('current');
		ModalGalleryItem.should.have.property('items').Array();
		ModalGalleryItem.should.have.property('imageCache').Array();
		ModalGalleryItem.should.have.property('focusableChildren').Array();
		ModalGalleryItem.should.have.property('init').Function();
		ModalGalleryItem.should.have.property('initTriggers').Function();
		ModalGalleryItem.should.have.property('initUI').Function();
		ModalGalleryItem.should.have.property('initButtons').Function();
		ModalGalleryItem.should.have.property('loadImage').Function();
		ModalGalleryItem.should.have.property('loadImages').Function();
		ModalGalleryItem.should.have.property('getFocusableChildren').Function();
		ModalGalleryItem.should.have.property('trapTab').Function();
		ModalGalleryItem.should.have.property('keyListener').Function();
		ModalGalleryItem.should.have.property('previous').Function();
		ModalGalleryItem.should.have.property('next').Function();
		ModalGalleryItem.should.have.property('open').Function();
		ModalGalleryItem.should.have.property('close').Function();
		ModalGalleryItem.should.have.property('toggle').Function();
		ModalGalleryItem.should.have.property('toggleFullScreen').Function();
	});

	it('should throw an error if no elements are found', () => {
		ModalGallery.init.bind(ModalGallery, '.js-err').should.throw();
	});
	
});
describe('Programmatic initialisation', () => {
	let Gallery = ModalGallery.init([
		{
			src: 'http://placehold.it/500x500',
			title: 'Image 1',
			description: 'Description 1'
		},
		{
			src: 'http://placehold.it/400x400',
			title: 'Image 2',
			description: 'Description 2'
		}], {
			fullscreen: true
		});

	it('should return an object with the correct properties', () => {
		should(Gallery).Object();
		Gallery.should.have.property('isOpen').Boolean();
		Gallery.should.have.property('current');
		Gallery.should.have.property('items').Array();
		Gallery.should.have.property('imageCache').Array();
		Gallery.should.have.property('focusableChildren').Array();
		Gallery.should.have.property('init').Function();
		Gallery.should.have.property('initTriggers').Function();
		Gallery.should.have.property('initUI').Function();
		Gallery.should.have.property('initButtons').Function();
		Gallery.should.have.property('loadImage').Function();
		Gallery.should.have.property('loadImages').Function();
		Gallery.should.have.property('getFocusableChildren').Function();
		Gallery.should.have.property('trapTab').Function();
		Gallery.should.have.property('keyListener').Function();
		Gallery.should.have.property('previous').Function();
		Gallery.should.have.property('next').Function();
		Gallery.should.have.property('open').Function();
		Gallery.should.have.property('close').Function();
		Gallery.should.have.property('toggle').Function();
		Gallery.should.have.property('toggleFullScreen').Function();
	});

	it('should initialisation with different settings if different options are passed', () => {
		should(Gallery.settings.fullscreen).equal(true);
	});
});

/*
describe('Initialisation', () => {
	

	it('should initialisation with different settings if different options are passed', () => {
		should(TogglersNoDelay[0].settings.delay).not.equal(Togglers[0].settings.delay);
	});

	it('should attach the handleClick eventListener to DOMElement click event to toggle documentElement className', () => {
		TogglersNoDelay[0].btn.click();
		setTimeout(() => {
			Array.from(document.documentElement.classList).should.containEql('on--target-3');
			TogglersNoDelay[0].btn.click();
			setTimeout(() => {
				TogglersNoDelay.from(document.documentElement.classList).should.not.containEql('on--target-3');
			}, 1000);
		});
	});

	it('should attach the handleClick eventListener to DOMElement click event to toggle parentNode className', () => {
		TogglersLocal[0].btn.click();
		setTimeout(() => {
			Array.from(TogglersLocal[0].btn.parentNode.classList).should.containEql('active');
			TogglersLocal[0].btn.click();
			setTimeout(() => {
				TogglersLocal.from(TogglersLocal[0].btn.parentNode.classList).should.not.containEql('active');
			}, 1000);
		});
	});
	
	it('should pass an invokable callback as an option', () => {
		TogglersNoDelay[0].settings.should.have.property('callback').Function();
	});

	it('should change sibling buttons aria expanded attribute', () => {
		Togglers[0].btn.click();
		setTimeout(() => {
			Togglers[0].siblingBtns[0].getAttribute('aria-expanded').should.equal(true);
		});
	});

});
*/