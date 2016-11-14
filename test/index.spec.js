import should from 'should';
import ModalGallery from '../dist/storm-modal-gallery';
import 'jsdom-global/register';

const html = `<a href="#target-1" class="js-toggler">Test toggler</a>
			 <a href="#target-1" class="js-toggler">Test toggler</a>
             <div id="target-1"></div>
             <a href="#target-2" class="js-toggler">Test toggler</a>
             <div id="target-2"></div>
			 <a href="#target-3" class="js-toggler-2">Test toggler</a>
             <div id="target-3"></div>
			 <div>
				<a href="#target-4" class="js-toggler-local">Test toggler</a>
				<div id="target-4"></div>
			</div>`;

document.body.innerHTML = html;

/*
let ModalGalleries = ModalGallery.init('.js-toggler'),
	ModalGalleries2 = ModalGallery.init('.js-toggler-2', {
		delay: 0,
		callback(){}
	});

describe('Initialisation', () => {
  
	it('should return array of togglers', () => {
		should(Togglers)
		.Array()
		.and.have.lengthOf(3);
	});

	it('should throw an error if no elements are found', () => {
		Toggler.init.bind(Toggler, '.js-err').should.throw();
	});
	
	it('each array item should be an object with the correct properties', () => {
		Togglers[0].should.be.an.instanceOf(Object).and.not.empty();
		Togglers[0].should.have.property('btn');
		Togglers[0].should.have.property('settings').Object();
		Togglers[0].should.have.property('init').Function();
		Togglers[0].should.have.property('toggleAttributes').Function();
		Togglers[0].should.have.property('toggleDocumentState').Function();
		Togglers[0].should.have.property('toggle').Function();
    
	});

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