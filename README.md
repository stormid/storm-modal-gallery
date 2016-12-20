#Storm Modal Gallery 

[![Build Status](https://travis-ci.org/mjbp/storm-modal-gallery.svg?branch=master)](https://travis-ci.org/mjbp/storm-modal-gallery)
[![codecov.io](http://codecov.io/github/mjbp/storm-modal-gallery/coverage.svg?branch=master)](http://codecov.io/github/mjbp/storm-modal-gallery?branch=master)
[![npm version](https://badge.fury.io/js/storm-modal-gallery.svg)](https://badge.fury.io/js/storm-modal-gallery)

Modal gallery/lightbox.

##Usage
A modal gallery can be created with DOM elements, or programmatically created from a JS Object

To create from HTML:
```
<ul>
    <li><a class="js-modal-gallery" href="http://placehold.it/500x500" data-title="Image 1" data-description="Description 1" data-srcset="http://placehold.it/800x800 800w, http://placehold.it/500x500 320w">Image one</a></li>
    <li><a class="js-modal-gallery" href="http://placehold.it/300x800" data-title="Image 2" data-description="Description 2" data-srcset="http://placehold.it/500x800 800w, http://placehold.it/300x500 320w">Image two</a></li>
</ul>
```

JS
```
npm i -S storm-modal-gallery
```
either using es6 import
```
import ModalGallery from 'storm-modal-gallery';

ModalGallery.init('.js-modal-gallery');
```
or aynchronous browser loading (use the .standalone version in the /dist folder)
```
import Load from 'storm-load';

Load('/content/js/async/storm-toggler.standalone.js')
    .then(() => {
        StormModalGalllery.init('.js-modal-gallery');
    });
```

To create from pure JS and triggered from any event:
```
import ModalGallery from 'storm-modal-gallery';

let gallery = ModalGallery.init([
    {
        src: 'http://placehold.it/500x500',
        srcset:'http://placehold.it/800x800 800w, http://placehold.it/500x500 320w',
        title: 'Image 1',
        description: 'Description 1'
    },
    {
        src: 'http://placehold.it/300x800',
        srcset:'http://placehold.it/500x800 800w, http://placehold.it/300x500 320w',
        title: 'Image 2',
        description: 'Description 2'
    }]);

//e.g. Open the gallery by clicking on a button with the className 'js-modal-gallery__trigger'
document.querySelector('.js-modal-gallery__trigger').addEventListener('click', gallery.open.bind(gallery, 0));
```

##Example
[https://mjbp.github.io/storm-modal-gallery](https://mjbp.github.io/storm-modal-gallery)


##Options
```
{
    templates: {
        overlay: `<div class="modal-gallery__outer js-modal-gallery__outer" role="dialog" tabindex="-1" aria-hidden="true">
                    <div class="modal-gallery__inner js-modal-gallery__inner">
                        <div class="modal-gallery__content js-modal-gallery__content">
                            {{items}}
                        </div>
                    </div>
                    <button class="js-modal-gallery__next modal-gallery__next">
                        <svg role="button" role="button" width="44" height="60">
                            <polyline points="14 10 34 30 14 50" stroke="rgb(255,255,255)" stroke-width="4" stroke-linecap="butt" fill="none" stroke-linejoin="round"/>
                        </svg>
                    </button>
                    <button class="js-modal-gallery__previous modal-gallery__previous">
                        <svg role="button" width="44" height="60">
                            <polyline points="30 10 10 30 30 50" stroke="rgb(255,255,255)" stroke-width="4" stroke-linecap="butt" fill="none" stroke-linejoin="round"/>
                        </svg>
                    </button>
                    <button class="js-modal-gallery__close modal-gallery__close">
                        <svg role="button" role="button" width="30" height="30">
                            <g stroke="rgb(255,255,255)" stroke-width="4">
                                <line x1="5" y1="5" x2="25" y2="25"/>
                                <line x1="5" y1="25" x2="25" y2="5"/>
                            </g>
                        </svg>
                    </button>
                </div>`,
        item: `<div class="modal-gallery__item js-modal-gallery__item">
                    <div class="modal-gallery__img-container js-modal-gallery__img-container"></div>
                    {{details}}
                </div>`,
        details: `<div class="modal-gallery__details">
                    <h1 class="modal-gallery__title">{{title}}</h1>
                    <div class="modal-gallery__description">{{description}}</div>
                </div>`
    },
    fullscreen: false,
    preload: false
}
```

e.g.
```
ModalGallery.init('.js-modal-gallery', {
    fullscreen: true
});
```

##Tests
```
npm run test
```

##Browser support
This is module has both es6 and es5 distributions. The es6 version should be used in a workflow that transpiles.

The es5 version depends unpon Object.assign, element.classList, and Promises so all evergreen browsers are supported out of the box, ie9+ is supported with polyfills. ie8+ will work with even more polyfils for Array functions and eventListeners.

##Dependencies
None

##License
MIT